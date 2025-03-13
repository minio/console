// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package api

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"

	errorsApi "github.com/go-openapi/errors"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/utils"
	"github.com/minio/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  0,
	WriteBufferSize: 1024,
}

const (
	// websocket base path
	wsBasePath = "/ws"
)

type wsMinioClient struct {
	// websocket connection.
	conn wsConn
	// MinIO admin Client
	client minioClient
}

// WSConn interface with all functions to be implemented
// by mock when testing, it should include all websocket.Conn
// respective api calls that are used within this project.
type WSConn interface {
	writeMessage(messageType int, data []byte) error
	close() error
	readMessage() (messageType int, p []byte, err error)
	remoteAddress() string
}

// Interface implementation
//
// Define the structure of a websocket Connection
type wsConn struct {
	conn *websocket.Conn
}

func (c wsConn) writeMessage(messageType int, data []byte) error {
	return c.conn.WriteMessage(messageType, data)
}

func (c wsConn) close() error {
	return c.conn.Close()
}

func (c wsConn) readMessage() (messageType int, p []byte, err error) {
	return c.conn.ReadMessage()
}

func (c wsConn) remoteAddress() string {
	clientIP, _, err := net.SplitHostPort(c.conn.RemoteAddr().String())
	if err != nil {
		// In case there's an error, return an empty string
		log.Printf("Invalid ws.clientIP = %s\n", err)
		return ""
	}
	return clientIP
}

// serveWS validates the incoming request and
// upgrades the request to a Websocket protocol.
// Websocket communication will be done depending
// on the path.
// Request should come like ws://<host>:<port>/ws/<api>
func serveWS(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	wsPath := strings.TrimPrefix(req.URL.Path, wsBasePath)
	// Perform authentication before upgrading to a Websocket Connection
	// authenticate WS connection with Console
	session, err := auth.GetClaimsFromTokenInRequest(req)
	if err != nil && (errors.Is(err, auth.ErrReadingToken) && !strings.HasPrefix(wsPath, `/objectManager`)) {
		ErrorWithContext(ctx, err)
		errorsApi.ServeError(w, req, errorsApi.New(http.StatusUnauthorized, "%v", err))
		return
	}

	// If we are using a subpath we are most likely behind a reverse proxy so we most likely
	// can't validate the proper Origin since we don't know the source domain, so we are going
	// to allow the connection to be upgraded in this case.
	if getSubPath() != "/" || getConsoleDevMode() {
		upgrader.CheckOrigin = func(_ *http.Request) bool {
			return true
		}
	}

	// upgrades the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		ErrorWithContext(ctx, err)
		errorsApi.ServeError(w, req, err)
		return
	}

	clientIP := getSourceIPFromHeaders(req)
	if clientIP == "" {
		if ip, _, err := net.SplitHostPort(conn.RemoteAddr().String()); err == nil {
			clientIP = ip
		} else {
			// In case there's an error, return an empty string
			LogError("Invalid ws.RemoteAddr() = %v\n", err)
		}
	}

	switch {
	case strings.HasPrefix(wsPath, `/objectManager`):
		wsMinioClient, err := newWebSocketMinioClient(conn, session, clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}

		go wsMinioClient.objectManager(session)
	default:
		// path not found
		closeWsConn(conn)
	}
}

func newWebSocketMinioClient(conn *websocket.Conn, claims *models.Principal, clientIP string) (*wsMinioClient, error) {
	mClient, err := newMinioClient(claims, clientIP)
	if err != nil {
		LogError("error creating MinioClient:", err)
		return nil, err
	}

	// create a websocket connection interface implementation
	// defining the connection to be used
	wsConnection := wsConn{conn: conn}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// create websocket client and handle request
	wsMinioClient := &wsMinioClient{conn: wsConnection, client: minioClient}
	return wsMinioClient, nil
}

// wsReadClientCtx reads the messages that come from the client
// if the client sends a Close Message the context will be
// canceled. If the connection is closed the goroutine inside
// will return.
func wsReadClientCtx(parentContext context.Context, conn WSConn) context.Context {
	// a cancel context is needed to end all goroutines used
	ctx, cancel := context.WithCancel(context.Background())

	var requestID string
	var SessionID string
	var UserAgent string
	var Host string
	var RemoteHost string

	if val, o := parentContext.Value(utils.ContextRequestID).(string); o {
		requestID = val
	}
	if val, o := parentContext.Value(utils.ContextRequestUserID).(string); o {
		SessionID = val
	}
	if val, o := parentContext.Value(utils.ContextRequestUserAgent).(string); o {
		UserAgent = val
	}
	if val, o := parentContext.Value(utils.ContextRequestHost).(string); o {
		Host = val
	}
	if val, o := parentContext.Value(utils.ContextRequestRemoteAddr).(string); o {
		RemoteHost = val
	}

	ctx = context.WithValue(ctx, utils.ContextRequestID, requestID)
	ctx = context.WithValue(ctx, utils.ContextRequestUserID, SessionID)
	ctx = context.WithValue(ctx, utils.ContextRequestUserAgent, UserAgent)
	ctx = context.WithValue(ctx, utils.ContextRequestHost, Host)
	ctx = context.WithValue(ctx, utils.ContextRequestRemoteAddr, RemoteHost)

	go func() {
		defer cancel()
		for {
			_, _, err := conn.readMessage()
			if err != nil {
				// if errors of type websocket.CloseError and is Unexpected
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
					ErrorWithContext(ctx, fmt.Errorf("error unexpected CloseError on ReadMessage: %v", err))
					return
				}
				// Not all errors are of type websocket.CloseError.
				if _, ok := err.(*websocket.CloseError); !ok {
					ErrorWithContext(ctx, fmt.Errorf("error on ReadMessage: %v", err))
					return
				}
				// else is an expected Close Error
				return
			}
		}
	}()
	return ctx
}

// closeWsConn sends Close Message and closes the websocket connection
func closeWsConn(conn *websocket.Conn) {
	conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	conn.Close()
}

// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

package restapi

import (
	"context"
	"log"
	"net"
	"net/http"
	"strings"

	"github.com/go-openapi/errors"
	"github.com/gorilla/websocket"
	"github.com/minio/mcs/pkg/auth"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  0,
	WriteBufferSize: 1024,
}

const (
	// websocket base path
	wsBasePath = "/ws"
)

// MCSWebsocketAdmin interface of a Websocket Client
type MCSWebsocketAdmin interface {
	trace()
	console()
}

type wsAdminClient struct {
	// websocket connection.
	conn wsConn
	// MinIO admin Client
	client MinioAdmin
}

// MCSWebsocket interface of a Websocket Client
type MCSWebsocket interface {
	watch(options watchOptions)
	heal(opts healOptions)
}

type wsS3Client struct {
	// websocket connection.
	conn wsConn
	// mcS3Client
	client MCS3Client
}

// WSConn interface with all functions to be implemented
// by mock when testing, it should include all websocket.Conn
// respective api calls that are used within this project.
type WSConn interface {
	writeMessage(messageType int, data []byte) error
	close() error
	readMessage() (messageType int, p []byte, err error)
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

// serveWS validates the incoming request and
// upgrades the request to a Websocket protocol.
// Websocket communication will be done depending
// on the path.
// Request should come like ws://<host>:<port>/ws/<api>
func serveWS(w http.ResponseWriter, req *http.Request) {
	// Perform authentication before upgrading to a Websocket Connection
	// authenticate WS connection with MCS
	claims, err := auth.GetClaimsFromTokenInRequest(req)
	if err != nil {
		log.Print("error on ws authentication: ", err)
		errors.ServeError(w, req, errors.New(http.StatusUnauthorized, err.Error()))
		return
	}

	// upgrades the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Print("error on upgrade: ", err)
		errors.ServeError(w, req, err)
		return
	}

	wsPath := strings.TrimPrefix(req.URL.Path, wsBasePath)
	switch {
	case wsPath == "/trace":
		wsAdminClient, err := newWebSocketAdminClient(conn, claims)
		if err != nil {
			closeWsConn(conn)
			return
		}
		go wsAdminClient.trace()
	case wsPath == "/console":
		wsAdminClient, err := newWebSocketAdminClient(conn, claims)
		if err != nil {
			closeWsConn(conn)
			return
		}
		go wsAdminClient.console()
	case strings.HasPrefix(wsPath, `/heal`):
		hOptions, err := getHealOptionsFromReq(req)
		if err != nil {
			log.Println("error getting heal options:", err)
			closeWsConn(conn)
			return
		}
		wsAdminClient, err := newWebSocketAdminClient(conn, claims)
		if err != nil {
			closeWsConn(conn)
			return
		}
		go wsAdminClient.heal(hOptions)
	case strings.HasPrefix(wsPath, `/watch`):
		wOptions := getWatchOptionsFromReq(req)
		wsS3Client, err := newWebSocketS3Client(conn, claims, wOptions.BucketName)
		if err != nil {
			closeWsConn(conn)
			return
		}
		go wsS3Client.watch(wOptions)
	default:
		// path not found
		closeWsConn(conn)
	}
}

// newWebSocketAdminClient returns a wsAdminClient authenticated as an admin user
func newWebSocketAdminClient(conn *websocket.Conn, autClaims *auth.DecryptedClaims) (*wsAdminClient, error) {
	// Only start Websocket Interaction after user has been
	// authenticated with MinIO
	mAdmin, err := newAdminFromClaims(autClaims)
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		// close connection
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		conn.Close()
		return nil, err
	}
	// create a websocket connection interface implementation
	// defining the connection to be used
	wsConnection := wsConn{conn: conn}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// create websocket client and handle request
	wsAdminClient := &wsAdminClient{conn: wsConnection, client: adminClient}
	return wsAdminClient, nil
}

// newWebSocketS3Client returns a wsAdminClient authenticated as MCS admin
func newWebSocketS3Client(conn *websocket.Conn, claims *auth.DecryptedClaims, bucketName string) (*wsS3Client, error) {
	// Only start Websocket Interaction after user has been
	// authenticated with MinIO
	s3Client, err := newS3BucketClient(claims, bucketName)
	if err != nil {
		log.Println("error creating S3Client:", err)
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		conn.Close()
		return nil, err
	}
	// create a websocket connection interface implementation
	// defining the connection to be used
	wsConnection := wsConn{conn: conn}
	// create a s3Client interface implementation
	// defining the client to be used
	mcS3C := mcS3Client{client: s3Client}
	// create websocket client and handle request
	wsS3Client := &wsS3Client{conn: wsConnection, client: mcS3C}
	return wsS3Client, nil
}

// wsReadClientCtx reads the messages that come from the client
// if the client sends a Close Message the context will be
// canceled. If the connection is closed the goroutine inside
// will return.
func wsReadClientCtx(conn WSConn) context.Context {
	// a cancel context is needed to end all goroutines used
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		defer cancel()
		for {
			_, _, err := conn.readMessage()
			if err != nil {
				// if error of type websocket.CloseError and is Unexpected
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
					log.Println("error unexpected CloseError on ReadMessage:", err)
					return
				}
				// Not all errors are of type websocket.CloseError.
				if _, ok := err.(*websocket.CloseError); !ok {
					log.Println("error on ReadMessage:", err)
					return
				}
				// else is an expected Close Error
				log.Println("closed conn.ReadMessage:", err)
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

// trace serves madmin.ServiceTraceInfo
// on a Websocket connection.
func (wsc *wsAdminClient) trace() {
	defer func() {
		log.Println("trace stopped")
		// close connection after return
		wsc.conn.close()
	}()
	log.Println("trace started")

	ctx := wsReadClientCtx(wsc.conn)

	err := startTraceInfo(ctx, wsc.conn, wsc.client)

	sendWsCloseMessage(wsc.conn, err)
}

// console serves madmin.GetLogs
// on a Websocket connection.
func (wsc *wsAdminClient) console() {
	defer func() {
		log.Println("console logs stopped")
		// close connection after return
		wsc.conn.close()
	}()
	log.Println("console logs started")

	ctx := wsReadClientCtx(wsc.conn)

	err := startConsoleLog(ctx, wsc.conn, wsc.client)

	sendWsCloseMessage(wsc.conn, err)
}

func (wsc *wsS3Client) watch(params watchOptions) {
	defer func() {
		log.Println("watch stopped")
		// close connection after return
		wsc.conn.close()
	}()
	log.Println("watch started")

	ctx := wsReadClientCtx(wsc.conn)

	err := startWatch(ctx, wsc.conn, wsc.client, params)

	sendWsCloseMessage(wsc.conn, err)
}

func (wsc *wsAdminClient) heal(opts *healOptions) {
	defer func() {
		log.Println("heal stopped")
		// close connection after return
		wsc.conn.close()
	}()
	log.Println("heal started")

	ctx := wsReadClientCtx(wsc.conn)

	err := startHeal(ctx, wsc.conn, wsc.client, opts)

	sendWsCloseMessage(wsc.conn, err)
}

// sendWsCloseMessage sends Websocket Connection Close Message indicating the Status Code
// see https://tools.ietf.org/html/rfc6455#page-45
func sendWsCloseMessage(conn WSConn, err error) {
	if err != nil {
		// If connection exceeded read deadline send Close
		// Message Policy Violation code since we don't want
		// to let the receiver figure out the read deadline.
		// This is a generic code designed if there is a
		// need to hide specific details about the policy.
		if nErr, ok := err.(net.Error); ok && nErr.Timeout() {
			conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, ""))
			return
		}
		// else, internal server error
		conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseInternalServerErr, err.Error()))
		return
	}
	// normal closure
	conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
}

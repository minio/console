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
	"sync"
	"time"

	"github.com/go-openapi/errors"
	"github.com/gorilla/websocket"
	"github.com/minio/mcs/pkg/ws"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  0,
	WriteBufferSize: 1024,
}

const (
	// websocket base path
	wsBasePath = "/ws"

	// Time allowed to read the next pong message from the peer.
	pingWait = 15 * time.Second

	// Maximum message size allowed from peer. 0 = unlimited
	maxMessageSize = 512
)

// MCSWebsocket interface of a Websocket Client
type MCSWebsocket interface {
	// start trace info from servers
	trace()
}

type wsClient struct {
	// websocket connection.
	conn wsConn
	// MinIO admin Client
	madmin MinioAdmin
}

// WSConn interface with all functions to be implemented
// by mock when testing, it should include all websocket.Conn
// respective api calls that are used within this project.
type WSConn interface {
	writeMessage(messageType int, data []byte) error
	close() error
	setReadLimit(limit int64)
	setReadDeadline(t time.Time) error
	setPongHandler(h func(appData string) error)
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

func (c wsConn) setReadLimit(limit int64) {
	c.conn.SetReadLimit(limit)
}

func (c wsConn) setReadDeadline(t time.Time) error {
	return c.conn.SetReadDeadline(t)
}

func (c wsConn) setPongHandler(h func(appData string) error) {
	c.conn.SetPongHandler(h)
}
func (c wsConn) readMessage() (messageType int, p []byte, err error) {
	return c.conn.ReadMessage()
}

// serveWS validates the incoming request and
// upgrades the request to a Websocket protocol.
// Websocket communication will be done depending
// on the path.
// Request should come like ws://<host>:<port>/ws/<api>
//
// TODO: Enable CORS
func serveWS(w http.ResponseWriter, req *http.Request) {
	// authenticate WS connection with MCS
	claims, err := ws.Authenticate(req)
	if err != nil {
		log.Print("error on ws authentication: ", err)
		errors.ServeError(w, req, err)
		return
	}

	// upgrades the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Print("error on upgrade: ", err)
		errors.ServeError(w, req, err)
		return
	}

	// Only start Websocket Interaction after user has been
	// authenticated with MinIO
	mAdmin, err := newAdminFromClaims(claims)
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		errors.ServeError(w, req, err)
		return
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// create a websocket connection interface implementation
	// defining the connection to be used
	wsConnection := wsConn{conn: conn}

	// create websocket client and handle request
	wsClient := &wsClient{conn: wsConnection, madmin: adminClient}
	switch strings.TrimPrefix(req.URL.Path, wsBasePath) {
	case "/trace":
		go wsClient.trace()
	case "/console":
		go wsClient.console()
	default:
		// path not found
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		conn.Close()
	}
}

// wsReadCheck ensures that the client is sending a message
// every `pingWait` seconds. If deadline exceeded or an error
// happened this will return, meaning it won't be able to ensure
// client heartbeat.
func wsReadCheck(ctx context.Context, wg *sync.WaitGroup, conn WSConn) chan error {
	// decrements the WaitGroup counter by one when the function returns
	defer wg.Done()
	ch := make(chan error)
	go func(ch chan error) {
		defer close(ch)

		// set initial Limits and deadlines for the Reader
		conn.setReadLimit(maxMessageSize)
		conn.setReadDeadline(time.Now().Add(pingWait))
		conn.setPongHandler(func(string) error { conn.setReadDeadline(time.Now().Add(pingWait)); return nil })

		for {
			select {
			case <-ctx.Done():
				log.Println("context done inside wsReadCheck")
				return
			default:
				_, _, err := conn.readMessage()
				if err != nil {
					// if error of type websocket.CloseError and is Unexpected
					if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
						log.Println("error unexpected CloseError on ReadMessage:", err)
						ch <- err
						return
					}
					// Not all errors are of type websocket.CloseError.
					// If not of type websocket.CloseError return error
					if _, ok := err.(*websocket.CloseError); !ok {
						log.Println("error on ReadMessage:", err)
						ch <- err
						return
					}
					// else is an expected Close Error
					log.Println("closed conn.ReadMessage:", err)
					return
				}
				// Reset Read Deadline after each Read
				conn.setReadDeadline(time.Now().Add(pingWait))
				conn.setPongHandler(func(string) error { conn.setReadDeadline(time.Now().Add(pingWait)); return nil })
			}
		}
	}(ch)
	return ch
}

// trace serves madmin.ServiceTraceInfo
// on a Websocket connection.
func (wsc *wsClient) trace() {
	defer func() {
		log.Println("trace stopped")
		// close connection after return
		wsc.conn.close()
	}()
	log.Println("trace started")

	err := startTraceInfo(wsc.conn, wsc.madmin)
	// Send Connection Close Message indicating the Status Code
	// see https://tools.ietf.org/html/rfc6455#page-45
	if err != nil {
		// If connection exceeded read deadline send Close
		// Message Policy Violation code since we don't want
		// to let the receiver figure out the read deadline.
		// This is a generic code designed if there is a
		// need to hide specific details about the policy.
		if nErr, ok := err.(net.Error); ok && nErr.Timeout() {
			wsc.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, ""))
			return
		}
		// else, internal server error
		wsc.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseInternalServerErr, err.Error()))
		return
	}
	// normal closure
	wsc.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
}

// console serves madmin.GetLogs
// on a Websocket connection.
func (wsc *wsClient) console() {
	defer func() {
		log.Println("console logs stopped")
		// close connection after return
		wsc.conn.close()
	}()
	log.Println("console logs started")

	err := startConsoleLog(wsc.conn, wsc.madmin)
	// Send Connection Close Message indicating the Status Code
	// see https://tools.ietf.org/html/rfc6455#page-45
	if err != nil {
		// If connection exceeded read deadline send Close
		// Message Policy Violation code since we don't want
		// to let the receiver figure out the read deadline.
		// This is a generic code designed if there is a
		// need to hide specific details about the policy.
		if nErr, ok := err.(net.Error); ok && nErr.Timeout() {
			wsc.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, ""))
			return
		}
		// else, internal server error
		wsc.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseInternalServerErr, err.Error()))
		return
	}
	// normal closure
	wsc.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
}

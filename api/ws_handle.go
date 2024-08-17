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
	"strconv"
	"strings"
	"time"

	"github.com/minio/madmin-go/v3"

	"github.com/minio/console/pkg/utils"

	errorsApi "github.com/go-openapi/errors"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth"
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

// ConsoleWebsocketAdmin interface of a Websocket Client
type ConsoleWebsocketAdmin interface {
	trace()
	console()
}

type wsAdminClient struct {
	// websocket connection.
	conn wsConn
	// MinIO admin Client
	client MinioAdmin
}

// ConsoleWebsocket interface of a Websocket Client
type ConsoleWebsocket interface {
	watch(options watchOptions)
}

type wsS3Client struct {
	// websocket connection.
	conn wsConn
	// mcClient
	client MCClient
}

// ConsoleWebSocketMClient interface of a Websocket Client
type ConsoleWebsocketMClient interface {
	objectManager(options objectsListOpts)
}

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

// Types for trace request. this adds support for calls, threshold, status and extra filters
type TraceRequest struct {
	s3         bool
	internal   bool
	storage    bool
	os         bool
	threshold  int64
	onlyErrors bool
	statusCode int64
	method     string
	funcName   string
	path       string
}

// Type for log requests. This allows for filtering by node and kind
type LogRequest struct {
	node    string
	logType string
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
	case strings.HasPrefix(wsPath, `/trace`):
		wsAdminClient, err := newWebSocketAdminClient(conn, session, clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}

		calls := req.URL.Query().Get("calls")
		threshold, _ := strconv.ParseInt(req.URL.Query().Get("threshold"), 10, 64)
		onlyErrors := req.URL.Query().Get("onlyErrors")
		stCode, errorStCode := strconv.ParseInt(req.URL.Query().Get("statusCode"), 10, 64)
		method := req.URL.Query().Get("method")
		funcName := req.URL.Query().Get("funcname")
		path := req.URL.Query().Get("path")

		statusCode := int64(0)

		if errorStCode == nil {
			statusCode = stCode
		}

		traceRequestItem := TraceRequest{
			s3:         strings.Contains(calls, "s3") || strings.Contains(calls, "all"),
			internal:   strings.Contains(calls, "internal") || strings.Contains(calls, "all"),
			storage:    strings.Contains(calls, "storage") || strings.Contains(calls, "all"),
			os:         strings.Contains(calls, "os") || strings.Contains(calls, "all"),
			onlyErrors: onlyErrors == "yes",
			threshold:  threshold,
			statusCode: statusCode,
			method:     method,
			funcName:   funcName,
			path:       path,
		}

		go wsAdminClient.trace(ctx, traceRequestItem)
	case strings.HasPrefix(wsPath, `/console`):

		wsAdminClient, err := newWebSocketAdminClient(conn, session, clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}
		node := req.URL.Query().Get("node")
		logType := req.URL.Query().Get("logType")

		logRequestItem := LogRequest{
			node:    node,
			logType: logType,
		}
		go wsAdminClient.console(ctx, logRequestItem)
	case strings.HasPrefix(wsPath, `/health-info`):
		deadline, err := getHealthInfoOptionsFromReq(req)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error getting health info options: %v", err))
			closeWsConn(conn)
			return
		}
		wsAdminClient, err := newWebSocketAdminClient(conn, session, clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}
		go wsAdminClient.healthInfo(ctx, deadline)
	case strings.HasPrefix(wsPath, `/watch`):
		wOptions, err := getWatchOptionsFromReq(req)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error getting watch options: %v", err))
			closeWsConn(conn)
			return
		}
		wsS3Client, err := newWebSocketS3Client(conn, session, wOptions.BucketName, "", clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}
		go wsS3Client.watch(ctx, wOptions)
	case strings.HasPrefix(wsPath, `/speedtest`):
		speedtestOpts, err := getSpeedtestOptionsFromReq(req)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error getting speedtest options: %v", err))
			closeWsConn(conn)
			return
		}
		wsAdminClient, err := newWebSocketAdminClient(conn, session, clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}
		go wsAdminClient.speedtest(ctx, speedtestOpts)
	case strings.HasPrefix(wsPath, `/profile`):
		pOptions, err := getProfileOptionsFromReq(req)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error getting profile options: %v", err))
			closeWsConn(conn)
			return
		}
		wsAdminClient, err := newWebSocketAdminClient(conn, session, clientIP)
		if err != nil {
			ErrorWithContext(ctx, err)
			closeWsConn(conn)
			return
		}
		go wsAdminClient.profile(ctx, pOptions)

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

// newWebSocketAdminClient returns a wsAdminClient authenticated as an admin user
func newWebSocketAdminClient(conn *websocket.Conn, autClaims *models.Principal, clientIP string) (*wsAdminClient, error) {
	// create a websocket connection interface implementation
	// defining the connection to be used
	wsConnection := wsConn{conn: conn}

	// Only start Websocket Interaction after user has been
	// authenticated with MinIO
	mAdmin, err := newAdminFromClaims(autClaims, clientIP)
	if err != nil {
		LogError("error creating madmin client: %v", err)
		return nil, err
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	// create websocket client and handle request
	wsAdminClient := &wsAdminClient{conn: wsConnection, client: adminClient}
	return wsAdminClient, nil
}

// newWebSocketS3Client returns a wsAdminClient authenticated as Console admin
func newWebSocketS3Client(conn *websocket.Conn, claims *models.Principal, bucketName, prefix, clientIP string) (*wsS3Client, error) {
	// Only start Websocket Interaction after user has been
	// authenticated with MinIO
	s3Client, err := newS3BucketClient(claims, bucketName, prefix, clientIP)
	if err != nil {
		LogError("error creating S3Client:", err)
		return nil, err
	}
	// create a websocket connection interface implementation
	// defining the connection to be used
	wsConnection := wsConn{conn: conn}
	// create a s3Client interface implementation
	// defining the client to be used
	mcS3C := mcClient{client: s3Client}
	// create websocket client and handle request
	wsS3Client := &wsS3Client{conn: wsConnection, client: mcS3C}
	return wsS3Client, nil
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

// trace serves madmin.ServiceTraceInfo
// on a Websocket connection.
func (wsc *wsAdminClient) trace(ctx context.Context, traceRequestItem TraceRequest) {
	defer func() {
		LogInfo("trace stopped")
		// close connection after return
		wsc.conn.close()
	}()
	LogInfo("trace started")

	ctx = wsReadClientCtx(ctx, wsc.conn)

	err := startTraceInfo(ctx, wsc.conn, wsc.client, traceRequestItem)

	sendWsCloseMessage(wsc.conn, err)
}

// console serves madmin.GetLogs
// on a Websocket connection.
func (wsc *wsAdminClient) console(ctx context.Context, logRequestItem LogRequest) {
	defer func() {
		LogInfo("console logs stopped")
		// close connection after return
		wsc.conn.close()
	}()
	LogInfo("console logs started")

	ctx = wsReadClientCtx(ctx, wsc.conn)

	err := startConsoleLog(ctx, wsc.conn, wsc.client, logRequestItem)

	sendWsCloseMessage(wsc.conn, err)
}

func (wsc *wsS3Client) watch(ctx context.Context, params *watchOptions) {
	defer func() {
		LogInfo("watch stopped")
		// close connection after return
		wsc.conn.close()
	}()
	LogInfo("watch started")

	ctx = wsReadClientCtx(ctx, wsc.conn)

	err := startWatch(ctx, wsc.conn, wsc.client, params)

	sendWsCloseMessage(wsc.conn, err)
}

func (wsc *wsAdminClient) healthInfo(ctx context.Context, deadline *time.Duration) {
	defer func() {
		LogInfo("health info stopped")
		// close connection after return
		wsc.conn.close()
	}()
	LogInfo("health info started")

	ctx = wsReadClientCtx(ctx, wsc.conn)
	err := startHealthInfo(ctx, wsc.conn, wsc.client, deadline)

	sendWsCloseMessage(wsc.conn, err)
}

func (wsc *wsAdminClient) speedtest(ctx context.Context, opts *madmin.SpeedtestOpts) {
	defer func() {
		LogInfo("speedtest stopped")
		// close connection after return
		wsc.conn.close()
	}()
	LogInfo("speedtest started")

	ctx = wsReadClientCtx(ctx, wsc.conn)

	err := startSpeedtest(ctx, wsc.conn, wsc.client, opts)

	sendWsCloseMessage(wsc.conn, err)
}

func (wsc *wsAdminClient) profile(ctx context.Context, opts *profileOptions) {
	defer func() {
		LogInfo("profile stopped")
		// close connection after return
		wsc.conn.close()
	}()
	LogInfo("profile started")

	ctx = wsReadClientCtx(ctx, wsc.conn)

	err := startProfiling(ctx, wsc.conn, wsc.client, opts)

	sendWsCloseMessage(wsc.conn, err)
}

// sendWsCloseMessage sends Websocket Connection Close Message indicating the Status Code
// see https://tools.ietf.org/html/rfc6455#page-45
func sendWsCloseMessage(conn WSConn, err error) {
	if err != nil {
		LogError("original ws error: %v", err)
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

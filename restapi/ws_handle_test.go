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
	"errors"
	"testing"

	"github.com/gorilla/websocket"
)

// Common mocks for WSConn interface
// assigning mock at runtime instead of compile time
var connWriteMessageMock func(messageType int, data []byte) error
var connReadMessageMock func() (messageType int, p []byte, err error)

// The Conn type represents a WebSocket connection.
type mockConn struct{}

func (c mockConn) writeMessage(messageType int, data []byte) error {
	return connWriteMessageMock(messageType, data)
}
func (c mockConn) readMessage() (messageType int, p []byte, err error) {
	return connReadMessageMock()
}

func (c mockConn) close() error {
	return nil
}

func TestWSHandle(t *testing.T) {
	// assert := assert.New(t)
	mockWSConn := mockConn{}

	// mock function of conn.ReadMessage(), returns unexpected Close Error CloseAbnormalClosure
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, &websocket.CloseError{Code: websocket.CloseAbnormalClosure, Text: ""}
	}
	ctx := wsReadClientCtx(mockWSConn)

	<-ctx.Done()
	// closed ctx correctly

	// mock function of conn.ReadMessage(), returns unexpected Close Error CloseAbnormalClosure
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, errors.New("error")
	}
	ctx2 := wsReadClientCtx(mockWSConn)
	<-ctx2.Done()
	// closed ctx correctly

	// mock function of conn.ReadMessage(), returns unexpected Close Error CloseAbnormalClosure
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, &websocket.CloseError{Code: websocket.CloseGoingAway, Text: ""}
	}
	ctx3 := wsReadClientCtx(mockWSConn)
	<-ctx3.Done()
	// closed ctx correctly
}

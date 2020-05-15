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
	"time"
)

// Common mocks for WSConn interface
// assigning mock at runtime instead of compile time
var connWriteMessageMock func(messageType int, data []byte) error
var connReadMessageMock func() (messageType int, p []byte, err error)

// Uncomment and implement if needed
// var connCloseMock func() error
// var connSetReadLimitMock func(limit int64)
// var connSetReadDeadlineMock func(t time.Time) error
// var connSetPongHandlerMock func(h func(appData string) error)

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
func (c mockConn) setReadLimit(limit int64) {
}
func (c mockConn) setReadDeadline(t time.Time) error {
	return nil
}
func (c mockConn) setPongHandler(h func(appData string) error) {
}

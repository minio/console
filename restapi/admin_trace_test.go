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
	"encoding/json"
	"fmt"
	"testing"

	"github.com/gorilla/websocket"
	"github.com/minio/minio/pkg/madmin"
	trace "github.com/minio/minio/pkg/trace"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioServiceTraceMock func(ctx context.Context, allTrace, errTrace bool) <-chan madmin.ServiceTraceInfo

// mock function of listPolicies()
func (ac adminClientMock) serviceTrace(ctx context.Context, allTrace, errTrace bool) <-chan madmin.ServiceTraceInfo {
	return minioServiceTraceMock(ctx, allTrace, errTrace)
}

func TestAdminTrace(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	mockWSConn := mockConn{}
	function := "startTraceInfo()"

	testReceiver := make(chan shortTraceMsg, 5)
	textToReceive := "test"
	testStreamSize := 5

	// Test-1: Serve Trace with no errors until trace finishes sending
	// define mock function behavior for minio server Trace
	minioServiceTraceMock = func(ctx context.Context, allTrace, errTrace bool) <-chan madmin.ServiceTraceInfo {
		ch := make(chan madmin.ServiceTraceInfo)
		// Only success, start a routine to start reading line by line.
		go func(ch chan<- madmin.ServiceTraceInfo) {
			defer close(ch)
			lines := make([]int, testStreamSize)
			// mocking sending 5 lines of info
			for range lines {
				info := trace.Info{
					FuncName: textToReceive,
				}
				ch <- madmin.ServiceTraceInfo{Trace: info}
			}
		}(ch)
		return ch
	}
	// mock function of conn.ReadMessage(), no error on read
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, nil
	}
	writesCount := 1
	// mock connection WriteMessage() no error
	connWriteMessageMock = func(messageType int, data []byte) error {
		// emulate that receiver gets the message written
		var t shortTraceMsg
		_ = json.Unmarshal(data, &t)
		if writesCount == testStreamSize {
			// for testing we need to close the receiver channel
			close(testReceiver)
			return nil
		}
		testReceiver <- t
		writesCount++
		return nil
	}
	if err := startTraceInfo(mockWSConn, adminClient); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// check that the TestReceiver got the same number of data from trace.
	for i := range testReceiver {
		assert.Equal(textToReceive, i.FuncName)
	}

	// Test-2: if error happens while writing, return error
	connWriteMessageMock = func(messageType int, data []byte) error {
		return fmt.Errorf("error on write")
	}
	if err := startTraceInfo(mockWSConn, adminClient); assert.Error(err) {
		assert.Equal("error on write", err.Error())
	}

	// Test-3: error happens while reading, unexpected Close Error should return error.
	connWriteMessageMock = func(messageType int, data []byte) error {
		return nil
	}
	// mock function of conn.ReadMessage(), returns unexpected Close Error CloseAbnormalClosure
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, &websocket.CloseError{Code: websocket.CloseAbnormalClosure, Text: ""}
	}
	if err := startTraceInfo(mockWSConn, adminClient); assert.Error(err) {
		assert.Equal("websocket: close 1006 (abnormal closure)", err.Error())
	}

	// Test-4: error happens while reading, expected Close Error NormalClosure
	// 		   expected Close Error should not return an error, just end trace.
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, &websocket.CloseError{Code: websocket.CloseNormalClosure, Text: ""}
	}
	if err := startTraceInfo(mockWSConn, adminClient); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-5: error happens while reading, expected Close Error CloseGoingAway
	// 		   expected Close Error should not return an error, just return.
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, &websocket.CloseError{Code: websocket.CloseGoingAway, Text: ""}
	}
	if err := startTraceInfo(mockWSConn, adminClient); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-6: error happens while reading, non Close Error Type should be returned as
	//         error
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, fmt.Errorf("error on read")
	}
	if err := startTraceInfo(mockWSConn, adminClient); assert.Error(err) {
		assert.Equal("error on read", err.Error())
	}

	// Test-7: error happens on serviceTrace Minio, trace should stop
	// and error shall be returned.
	minioServiceTraceMock = func(ctx context.Context, allTrace, errTrace bool) <-chan madmin.ServiceTraceInfo {
		ch := make(chan madmin.ServiceTraceInfo)
		// Only success, start a routine to start reading line by line.
		go func(ch chan<- madmin.ServiceTraceInfo) {
			defer close(ch)
			lines := make([]int, 2)
			// mocking sending 5 lines of info
			for range lines {
				info := trace.Info{
					NodeName: "test",
				}
				ch <- madmin.ServiceTraceInfo{Trace: info}
			}
			ch <- madmin.ServiceTraceInfo{Err: fmt.Errorf("error on trace")}
		}(ch)
		return ch
	}
	// mock function of conn.ReadMessage(), no error on read, should stay unless
	// context is done.
	connReadMessageMock = func() (messageType int, p []byte, err error) {
		return 0, []byte{}, nil
	}
	if err := startTraceInfo(mockWSConn, adminClient); assert.Error(err) {
		assert.Equal("error on trace", err.Error())
	}
}

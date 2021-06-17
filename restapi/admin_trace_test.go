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

package restapi

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/minio/madmin-go"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioServiceTraceMock func(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo

// mock function of listPolicies()
func (ac adminClientMock) serviceTrace(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
	return minioServiceTraceMock(ctx, threshold, s3, internal, storage, os, errTrace)
}

func TestAdminTrace(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	mockWSConn := mockConn{}
	function := "startTraceInfo(ctx, )"
	ctx := context.Background()

	testReceiver := make(chan shortTraceMsg, 5)
	textToReceive := "test"
	testStreamSize := 5
	isClosed := false // testReceiver is closed?

	// Test-1: Serve Trace with no errors until trace finishes sending
	// define mock function behavior for minio server Trace
	minioServiceTraceMock = func(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
		ch := make(chan madmin.ServiceTraceInfo)
		// Only success, start a routine to start reading line by line.
		go func(ch chan<- madmin.ServiceTraceInfo) {
			defer close(ch)
			lines := make([]int, testStreamSize)
			// mocking sending 5 lines of info
			for range lines {
				info := madmin.TraceInfo{
					FuncName: textToReceive,
				}
				ch <- madmin.ServiceTraceInfo{Trace: info}
			}
		}(ch)
		return ch
	}
	writesCount := 1
	// mock connection WriteMessage() no error
	connWriteMessageMock = func(messageType int, data []byte) error {
		// emulate that receiver gets the message written
		var t shortTraceMsg
		_ = json.Unmarshal(data, &t)
		if writesCount == testStreamSize {
			// for testing we need to close the receiver channel
			if !isClosed {
				close(testReceiver)
				isClosed = true
			}
			return nil
		}
		testReceiver <- t
		writesCount++
		return nil
	}
	if err := startTraceInfo(ctx, mockWSConn, adminClient, TraceRequest{s3: true, internal: true, storage: true, os: true, onlyErrors: false}); err != nil {
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
	if err := startTraceInfo(ctx, mockWSConn, adminClient, TraceRequest{}); assert.Error(err) {
		assert.Equal("error on write", err.Error())
	}

	// Test-3: error happens on serviceTrace Minio, trace should stop
	// and error shall be returned.
	minioServiceTraceMock = func(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
		ch := make(chan madmin.ServiceTraceInfo)
		// Only success, start a routine to start reading line by line.
		go func(ch chan<- madmin.ServiceTraceInfo) {
			defer close(ch)
			lines := make([]int, 2)
			// mocking sending 5 lines of info
			for range lines {
				info := madmin.TraceInfo{
					NodeName: "test",
				}
				ch <- madmin.ServiceTraceInfo{Trace: info}
			}
			ch <- madmin.ServiceTraceInfo{Err: fmt.Errorf("error on trace")}
		}(ch)
		return ch
	}
	connWriteMessageMock = func(messageType int, data []byte) error {
		return nil
	}
	if err := startTraceInfo(ctx, mockWSConn, adminClient, TraceRequest{}); assert.Error(err) {
		assert.Equal("error on trace", err.Error())
	}
}

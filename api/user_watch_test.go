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
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"testing"
	"time"

	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var mcWatchMock func(ctx context.Context, options mc.WatchOptions) (*mc.WatchObject, *probe.Error)

// implements mc.S3Client.Watch()
func (c s3ClientMock) watch(ctx context.Context, options mc.WatchOptions) (*mc.WatchObject, *probe.Error) {
	if options.Prefix == "file/" {
		return mcWatchMock(ctx, options)
	}
	wo := &mc.WatchObject{
		EventInfoChan: make(chan []mc.EventInfo),
		ErrorChan:     make(chan *probe.Error),
		DoneChan:      make(chan struct{}),
	}
	return wo, nil
}

func TestWatchOnContextDone(t *testing.T) {
	assert := assert.New(t)
	client := s3ClientMock{}
	mockWSConn := mockConn{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	testOptions := &watchOptions{}
	testOptions.BucketName = "bucktest"
	testOptions.Prefix = "file2/"
	testOptions.Suffix = ".png"

	// Test-0: Test closing a done channel
	ctxWithTimeout, cancelFunction := context.WithTimeout(ctx, time.Duration(1)*time.Millisecond)
	defer cancelFunction()
	assert.Equal(startWatch(ctxWithTimeout, mockWSConn, client, testOptions), nil)
}

func TestWatch(t *testing.T) {
	assert := assert.New(t)
	client := s3ClientMock{}
	mockWSConn := mockConn{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	function := "startWatch()"
	testStreamSize := 5
	testReceiver := make(chan []mc.EventInfo, testStreamSize)
	isClosed := false // testReceiver is closed?
	textToReceive := "test message"
	testOptions := &watchOptions{}
	testOptions.BucketName = "bucktest"
	testOptions.Prefix = "file/"
	testOptions.Suffix = ".png"

	// Test-1: Serve Watch with no errors until Watch finishes sending
	// define mock function behavior
	mcWatchMock = func(_ context.Context, _ mc.WatchOptions) (*mc.WatchObject, *probe.Error) {
		wo := &mc.WatchObject{
			EventInfoChan: make(chan []mc.EventInfo),
			ErrorChan:     make(chan *probe.Error),
			DoneChan:      make(chan struct{}),
		}
		// Only success, start a routine to start reading line by line.
		go func(wo *mc.WatchObject) {
			defer func() {
				close(wo.EventInfoChan)
				close(wo.ErrorChan)
			}()

			lines := make([]int, testStreamSize)
			// mocking sending 5 lines of info
			for range lines {
				info := []mc.EventInfo{
					{
						UserAgent: textToReceive,
					},
				}
				wo.Events() <- info
			}
		}(wo)
		return wo, nil
	}
	writesCount := 1
	// mock connection WriteMessage() no error
	connWriteMessageMock = func(_ int, data []byte) error {
		// emulate that receiver gets the message written
		var t []mc.EventInfo
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
	if err := startWatch(ctx, mockWSConn, client, testOptions); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// check that the TestReceiver got the same number of data from Console.
	for i := range testReceiver {
		for _, val := range i {
			assert.Equal(textToReceive, val.UserAgent)
		}
	}

	// Test-2: if error happens while writing, return error
	connWriteMessageMock = func(_ int, _ []byte) error {
		return fmt.Errorf("error on write")
	}
	if err := startWatch(ctx, mockWSConn, client, testOptions); assert.Error(err) {
		assert.Equal("error on write", err.Error())
	}

	// Test-3: error happens on Watch, watch should stop
	// and error shall be returned.
	mcWatchMock = func(_ context.Context, _ mc.WatchOptions) (*mc.WatchObject, *probe.Error) {
		wo := &mc.WatchObject{
			EventInfoChan: make(chan []mc.EventInfo),
			ErrorChan:     make(chan *probe.Error),
			DoneChan:      make(chan struct{}),
		}
		// Only success, start a routine to start reading line by line.
		go func(wo *mc.WatchObject) {
			defer func() {
				close(wo.EventInfoChan)
				close(wo.ErrorChan)
			}()
			lines := make([]int, testStreamSize)
			// mocking sending 5 lines of info
			for range lines {
				info := []mc.EventInfo{
					{
						UserAgent: textToReceive,
					},
				}
				wo.Events() <- info
			}
			wo.Errors() <- &probe.Error{Cause: fmt.Errorf("error on watch")}
		}(wo)
		return wo, nil
	}
	connWriteMessageMock = func(_ int, _ []byte) error {
		return nil
	}
	if err := startWatch(ctx, mockWSConn, client, testOptions); assert.Error(err) {
		assert.Equal("error on watch", err.Error())
	}

	// Test-4: error happens on Watch, watch should stop
	// and error shall be returned.
	mcWatchMock = func(_ context.Context, _ mc.WatchOptions) (*mc.WatchObject, *probe.Error) {
		return nil, &probe.Error{Cause: fmt.Errorf("error on watch")}
	}
	if err := startWatch(ctx, mockWSConn, client, testOptions); assert.Error(err) {
		assert.Equal("error on watch", err.Error())
	}

	// Test-5: return nil on error on watch
	mcWatchMock = func(_ context.Context, _ mc.WatchOptions) (*mc.WatchObject, *probe.Error) {
		wo := &mc.WatchObject{
			EventInfoChan: make(chan []mc.EventInfo),
			ErrorChan:     make(chan *probe.Error),
			DoneChan:      make(chan struct{}),
		}
		// Only success, start a routine to start reading line by line.
		go func(wo *mc.WatchObject) {
			defer func() {
				close(wo.EventInfoChan)
				close(wo.ErrorChan)
			}()
			lines := make([]int, testStreamSize)
			// mocking sending 5 lines of info
			for range lines {
				info := []mc.EventInfo{
					{
						UserAgent: textToReceive,
					},
				}
				wo.Events() <- info
			}
			wo.Events() <- nil
			wo.Errors() <- nil
		}(wo)
		return wo, nil
	}
	if err := startWatch(ctx, mockWSConn, client, testOptions); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// check that the TestReceiver got the same number of data from Console.
	for i := range testReceiver {
		for _, val := range i {
			assert.Equal(textToReceive, val.UserAgent)
		}
	}

	// Test-6: getWatchOptionsFromReq return parameters from path
	u, err := url.Parse("http://localhost/api/v1/watch/bucket1?prefix=&suffix=.jpg&events=put,get")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", "url.Parse()", err.Error())
	}
	req := &http.Request{
		URL: u,
	}
	opts, err := getWatchOptionsFromReq(req)
	if assert.NoError(err) {
		expectedOptions := watchOptions{
			BucketName: "bucket1",
		}
		expectedOptions.Prefix = ""
		expectedOptions.Suffix = ".jpg"
		expectedOptions.Events = []string{"put", "get"}
		assert.Equal(expectedOptions.BucketName, opts.BucketName)
		assert.Equal(expectedOptions.Prefix, opts.Prefix)
		assert.Equal(expectedOptions.Suffix, opts.Suffix)
		assert.Equal(expectedOptions.Events, opts.Events)
	}

	// Test-7: getWatchOptionsFromReq return default events if not defined
	u, err = url.Parse("http://localhost/api/v1/watch/bucket1?prefix=&suffix=.jpg&events=")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", "url.Parse()", err.Error())
	}
	req = &http.Request{
		URL: u,
	}
	opts, err = getWatchOptionsFromReq(req)
	if assert.NoError(err) {
		expectedOptions := watchOptions{
			BucketName: "bucket1",
		}
		expectedOptions.Prefix = ""
		expectedOptions.Suffix = ".jpg"
		expectedOptions.Events = []string{"put", "get", "delete"}
		assert.Equal(expectedOptions.BucketName, opts.BucketName)
		assert.Equal(expectedOptions.Prefix, opts.Prefix)
		assert.Equal(expectedOptions.Suffix, opts.Suffix)
		assert.Equal(expectedOptions.Events, opts.Events)

	}

	// Test-8: getWatchOptionsFromReq return default events if not defined
	u, err = url.Parse("http://localhost/api/v1/watch/bucket2?prefix=&suffix=")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", "url.Parse()", err.Error())
	}
	req = &http.Request{
		URL: u,
	}
	opts, err = getWatchOptionsFromReq(req)
	if assert.NoError(err) {
		expectedOptions := watchOptions{
			BucketName: "bucket2",
		}
		expectedOptions.Events = []string{"put", "get", "delete"}
		assert.Equal(expectedOptions.BucketName, opts.BucketName)
		assert.Equal(expectedOptions.Prefix, opts.Prefix)
		assert.Equal(expectedOptions.Suffix, opts.Suffix)
		assert.Equal(expectedOptions.Events, opts.Events)
	}

	// Test-9: getWatchOptionsFromReq invalid url
	u, _ = url.Parse("http://localhost/api/v1/wach/bucket2?prefix=&suffix=")
	req = &http.Request{
		URL: u,
	}
	_, err = getWatchOptionsFromReq(req)
	assert.Error(err)
}

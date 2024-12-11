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
	"bytes"
	"context"
	"errors"
	"io"
	"net/http"
	"net/url"
	"testing"
	"time"

	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
)

// Implementing fake closingBuffer to mock stopProfiling() (io.ReadCloser, error)
type ClosingBuffer struct {
	*bytes.Buffer
}

// Implementing a fake Close function for io.ReadCloser
func (cb *ClosingBuffer) Close() error {
	return nil
}

func TestStartProfiling(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	mockWSConn := mockConn{}
	function := "startProfiling()"
	testOptions := &profileOptions{
		Types: "cpu",
	}

	// Test-1 : startProfiling() Get response from MinIO server with one profiling object without errors
	// mock function response from startProfiling()
	minioStartProfiling = func(_ madmin.ProfilerType, _ time.Duration) (io.ReadCloser, error) {
		return &ClosingBuffer{bytes.NewBufferString("In memory string eaeae")}, nil
	}
	// mock function response from mockConn.writeMessage()
	connWriteMessageMock = func(_ int, _ []byte) error {
		return nil
	}
	err := startProfiling(ctx, mockWSConn, adminClient, testOptions)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(err, nil)

	// Test-2 : startProfiling() Correctly handles errors returned by MinIO
	// mock function response from startProfiling()
	minioStartProfiling = func(_ madmin.ProfilerType, _ time.Duration) (io.ReadCloser, error) {
		return nil, errors.New("error")
	}
	err = startProfiling(ctx, mockWSConn, adminClient, testOptions)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-3: getProfileOptionsFromReq() correctly returns profile options from request
	u, _ := url.Parse("ws://localhost/ws/profile?types=cpu,mem,block,mutex,trace,threads,goroutines")
	req := &http.Request{
		URL: u,
	}
	opts, err := getProfileOptionsFromReq(req)
	if assert.NoError(err) {
		expectedOptions := profileOptions{
			Types: "cpu,mem,block,mutex,trace,threads,goroutines",
		}
		assert.Equal(expectedOptions.Types, opts.Types)
	}
}

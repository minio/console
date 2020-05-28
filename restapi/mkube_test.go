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
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

// RoundTripFunc .
type RoundTripFunc func(req *http.Request) (*http.Response, error)

// RoundTrip .
func (f RoundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

//NewTestClient returns *http.Client with Transport replaced to avoid making real calls
func NewTestClient(fn RoundTripFunc) *http.Client {
	return &http.Client{
		Transport: fn,
	}
}

func Test_serverMkube(t *testing.T) {

	OKclient := NewTestClient(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       ioutil.NopCloser(bytes.NewBufferString(`OK`)),
			Header:     make(http.Header),
		}, nil
	})

	badClient := NewTestClient(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 500,
			Body:       ioutil.NopCloser(bytes.NewBufferString(`NOTOK`)),
			Header:     make(http.Header),
		}, errors.New("something wrong")
	})

	refusedClient := NewTestClient(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 500,
			Body:       ioutil.NopCloser(bytes.NewBufferString(`NOTOK`)),
			Header:     make(http.Header),
		}, errors.New("connection refused")
	})

	testURL, _ := url.Parse("/api/v1/clusters")
	type args struct {
		client   *http.Client
		recorder *httptest.ResponseRecorder
		req      *http.Request
	}
	tests := []struct {
		name     string
		args     args
		wantCode int
	}{
		{
			name: "Successful request",
			args: args{
				client:   OKclient,
				recorder: httptest.NewRecorder(),
				req:      &http.Request{URL: testURL},
			},
			wantCode: 200,
		},
		{
			name: "Unsuccessful request",
			args: args{
				client:   badClient,
				recorder: httptest.NewRecorder(),
				req:      &http.Request{URL: testURL},
			},
			wantCode: 500,
		},
		{
			name: "refused request",
			args: args{
				client:   refusedClient,
				recorder: httptest.NewRecorder(),
				req:      &http.Request{URL: testURL},
			},
			wantCode: 500,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			serverMkube(tt.args.client, tt.args.recorder, tt.args.req)
			resp := tt.args.recorder.Result()
			if resp.StatusCode != tt.wantCode {
				t.Errorf("Invalid code returned")
				return
			}
		})
	}
}

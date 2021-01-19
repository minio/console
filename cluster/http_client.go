// This file is part of MinIO Kubernetes Cloud
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

package cluster

import (
	"io"
	"net/http"
)

// HTTPClientI interface with all functions to be implemented
// by mock when testing, it should include all HttpClient respective api calls
// that are used within this project.
type HTTPClientI interface {
	Get(url string) (resp *http.Response, err error)
	Post(url, contentType string, body io.Reader) (resp *http.Response, err error)
	Do(req *http.Request) (*http.Response, error)
}

// HTTPClient Interface implementation
//
// Define the structure of a http client and define the functions that are actually used
type HTTPClient struct {
	Client *http.Client
}

// Get implements http.Client.Get()
func (c *HTTPClient) Get(url string) (resp *http.Response, err error) {
	return c.Client.Get(url)
}

// Post implements http.Client.Post()
func (c *HTTPClient) Post(url, contentType string, body io.Reader) (resp *http.Response, err error) {
	return c.Client.Post(url, contentType, body)
}

// Do implements http.Client.Do()
func (c *HTTPClient) Do(req *http.Request) (*http.Response, error) {
	return c.Client.Do(req)
}

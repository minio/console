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
	"net/http"
)

type ConsoleTransport struct {
	Transport http.RoundTripper
	ClientIP  string
}

func (t *ConsoleTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	if t.ClientIP != "" {
		// Do not set an empty x-forwarded-for
		req.Header.Add(xForwardedFor, t.ClientIP)
	}
	return t.Transport.RoundTrip(req)
}

// PrepareSTSClientTransport :
func PrepareSTSClientTransport(clientIP string) *ConsoleTransport {
	return &ConsoleTransport{
		Transport: GlobalTransport,
		ClientIP:  clientIP,
	}
}

// PrepareConsoleHTTPClient returns an http.Client with custom configurations need it by *credentials.STSAssumeRole
// custom configurations include the use of CA certificates
func PrepareConsoleHTTPClient(clientIP string) *http.Client {
	// Return http client with default configuration
	return &http.Client{
		Transport: PrepareSTSClientTransport(clientIP),
	}
}

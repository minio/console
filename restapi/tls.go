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
	"crypto/tls"
	"net"
	"net/http"
	"time"
)

type ConsoleTransport struct {
	Transport *http.Transport
	ClientIP  string
}

func (t *ConsoleTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	req.Header.Add("X-Forwarded-For", t.ClientIP)
	resp, err := t.Transport.RoundTrip(req)
	return resp, err
}

// PrepareSTSClientTransport :
func PrepareSTSClientTransport(insecure bool, remoteAddress string) *ConsoleTransport {
	// This takes github.com/minio/madmin-go/v2/transport.go as an example
	//
	// DefaultTransport - this default transport is similar to
	// http.DefaultTransport but with additional param  DisableCompression
	// is set to true to avoid decompressing content with 'gzip' encoding.
	DefaultTransport := &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 15 * time.Second,
		}).DialContext,
		MaxIdleConns:          1024,
		MaxIdleConnsPerHost:   1024,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 10 * time.Second,
		DisableCompression:    true,
		TLSClientConfig: &tls.Config{
			// Can't use SSLv3 because of POODLE and BEAST
			// Can't use TLSv1.0 because of POODLE and BEAST using CBC cipher
			// Can't use TLSv1.1 because of RC4 cipher usage
			MinVersion:         tls.VersionTLS12,
			InsecureSkipVerify: insecure,
			RootCAs:            GlobalRootCAs,
		},
	}
	t := &ConsoleTransport{
		Transport: DefaultTransport,
		ClientIP:  remoteAddress,
	}
	return t
}

// PrepareConsoleHTTPClient returns an http.Client with custom configurations need it by *credentials.STSAssumeRole
// custom configurations include the use of CA certificates
func PrepareConsoleHTTPClient(insecure bool, clientIP string) *http.Client {
	transport := PrepareSTSClientTransport(insecure, clientIP)
	// Return http client with default configuration
	c := &http.Client{
		Transport: transport,
	}
	return c
}

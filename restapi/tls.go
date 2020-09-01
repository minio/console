// This file is part of MinIO Orchestrator
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
	"crypto/tls"
	"crypto/x509"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"time"
)

func getCertPool() *x509.CertPool {
	rootCAs, _ := x509.SystemCertPool()
	if rootCAs == nil {
		// In some systems (like Windows) system cert pool is
		// not supported or no certificates are present on the
		// system - so we create a new cert pool.
		rootCAs = x509.NewCertPool()
	}
	caCertFileNames := getMinioServerTLSRootCAs()
	for _, caCert := range caCertFileNames {
		pemData, err := ioutil.ReadFile(caCert)
		if err != nil {
			// logging this error
			log.Println(err)
			continue
		}
		rootCAs.AppendCertsFromPEM(pemData)
	}
	return rootCAs
}

var certPool = getCertPool()

func prepareSTSClientTransport(insecure bool) *http.Transport {
	// This takes github.com/minio/minio/pkg/madmin/transport.go as an example
	//
	// DefaultTransport - this default transport is similar to
	// http.DefaultTransport but with additional param  DisableCompression
	// is set to true to avoid decompressing content with 'gzip' encoding.
	DefaultTransport := &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			KeepAlive: 15 * time.Second,
		}).DialContext,
		MaxIdleConns:          1024,
		MaxIdleConnsPerHost:   1024,
		ResponseHeaderTimeout: 60 * time.Second,
		IdleConnTimeout:       60 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
		DisableCompression:    true,
		TLSClientConfig: &tls.Config{
			// Can't use SSLv3 because of POODLE and BEAST
			// Can't use TLSv1.0 because of POODLE and BEAST using CBC cipher
			// Can't use TLSv1.1 because of RC4 cipher usage
			MinVersion:         tls.VersionTLS12,
			InsecureSkipVerify: insecure,
			RootCAs:            certPool,
		},
	}
	return DefaultTransport
}

// PrepareSTSClient returns an http.Client with custom configurations need it by *credentials.STSAssumeRole
// custom configurations include the use of CA certificates
func PrepareSTSClient(insecure bool) *http.Client {
	transport := prepareSTSClientTransport(insecure)
	// Return http client with default configuration
	c := &http.Client{
		Transport: transport,
	}
	return c
}

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
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"time"
)

var (
	certDontExists = "File certificate doesn't exists: %s"
)

func prepareSTSClientTransport() *http.Transport {
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
	}
	// If Minio instance is running with TLS enabled and it's using a self-signed certificate
	// or a certificate issued by a custom certificate authority we prepare a new custom *http.Transport
	if getMinIOEndpointIsSecure() {
		caCertFileNames := getMinioServerTLSRootCAs()
		tlsConfig := &tls.Config{
			// Can't use SSLv3 because of POODLE and BEAST
			// Can't use TLSv1.0 because of POODLE and BEAST using CBC cipher
			// Can't use TLSv1.1 because of RC4 cipher usage
			MinVersion: tls.VersionTLS12,
		}
		// If root CAs are configured we save them to the http.Client RootCAs store
		if len(caCertFileNames) > 0 {
			certs := x509.NewCertPool()
			for _, caCert := range caCertFileNames {
				// Validate certificate exists
				if FileExists(caCert) {
					pemData, err := ioutil.ReadFile(caCert)
					if err != nil {
						// if there was an error reading pem file stop mcs
						panic(err)
					}
					certs.AppendCertsFromPEM(pemData)
				} else {
					// if provided cert filename doesn't exists stop mcs
					panic(fmt.Sprintf(certDontExists, caCert))
				}
			}
			tlsConfig.RootCAs = certs
		}
		DefaultTransport.TLSClientConfig = tlsConfig
	}
	return DefaultTransport
}

// PrepareSTSClient returns an http.Client with custom configurations need it by *credentials.STSAssumeRole
// custom configurations include skipVerification flag, and root CA certificates
func PrepareSTSClient() *http.Client {
	transport := prepareSTSClientTransport()
	// Return http client with default configuration
	return &http.Client{
		Transport: transport,
	}
}

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

package mkube

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/minio/minio/pkg/env"
)

var (
	certDontExists = "File certificate doesn't exists: %s"
)

// getMkubeEndpoint returns the hostname of mkube
func GetMkubeEndpoint() string {
	return env.Get(McsMkubeHost, "http://m3:8787")
}

// getMkubeEndpointIsSecure returns true or false depending on the protocol in Mkube URL
func getMkubeEndpointIsSecure() bool {
	server := GetMkubeEndpoint()
	if strings.Contains(server, "://") {
		parts := strings.Split(server, "://")
		if len(parts) > 1 {
			if parts[0] == "https" {
				return true
			}
		}
	}
	return false
}

// If MCS_M3_SERVER_TLS_CA_CERTIFICATE is true mcs will load a list of certificates into the
// http.client rootCAs store, this is useful for testing or when working with self-signed certificates
func getMkubeServerTLSRootCAs() []string {
	caCertFileNames := strings.TrimSpace(env.Get(McsMkubeTLSCACertificate, ""))
	if caCertFileNames == "" {
		return []string{}
	}
	return strings.Split(caCertFileNames, ",")
}

// FileExists verifies if a file exist on the desired location and its not a folder
func FileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

// GetMkubeHTTPClient returns an http.Client with custom configurations used by MCS to talk to Mkube
// custom configurations include the use of CA certificates
func getMkubeHTTPClient() *http.Client {
	httpTransport := &http.Transport{}
	// If Mkube server is running with TLS enabled and it's using a self-signed certificate
	// or a certificate issued by a custom certificate authority we prepare a new custom *http.Transport
	if getMkubeEndpointIsSecure() {
		caCertFileNames := getMkubeServerTLSRootCAs()
		tlsConfig := &tls.Config{
			// Can't use SSLv3 because of POODLE and BEAST
			// Can't use TLSv1.0 because of POODLE and BEAST using CBC cipher
			// Can't use TLSv1.1 because of RC4 cipher usage
			MinVersion: tls.VersionTLS12,
		}
		// If CAs certificates are configured we save them to the http.Client RootCAs store
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
		httpTransport.TLSClientConfig = tlsConfig
	}

	// Return http client with default configuration
	return &http.Client{
		Transport: httpTransport,
	}
}

// HTTPClient it's a public variable that contains the HTTP configuration to be used by MCS to talk to Mkube
// This function will run only once
var HTTPClient = getMkubeHTTPClient()

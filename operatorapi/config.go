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

package operatorapi

import (
	"crypto/x509"
	xcerts "github.com/minio/pkg/certs"
	"io/ioutil"

	"github.com/minio/pkg/env"
)

var (
	// GlobalRootCAs is CA root certificates, a nil value means system certs pool will be used
	GlobalRootCAs *x509.CertPool
	// GlobalPublicCerts has certificates Console will use to serve clients
	GlobalPublicCerts []*x509.Certificate
	// GlobalTLSCertsManager custom TLS Manager for SNI support
	GlobalTLSCertsManager *xcerts.Manager
)

// getK8sSAToken assumes the plugin is running inside a k8s pod and extract the current service account from the
// /var/run/secrets/kubernetes.io/serviceaccount/token file
func getK8sSAToken() string {
	dat, err := ioutil.ReadFile("/var/run/secrets/kubernetes.io/serviceaccount/token")
	if err != nil {
		return env.Get(ConsoleOperatorSAToken, "")
	}
	return string(dat)
}

// Get Marketplace deployment platform
func getMarketplace() string {
	return env.Get(ConsoleMarketplace, "")
}

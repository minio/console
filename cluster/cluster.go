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
	direct "github.com/minio/direct-csi/pkg/clientset"
	operator "github.com/minio/operator/pkg/client/clientset/versioned"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	certutil "k8s.io/client-go/util/cert"
)

// getTLSClientConfig will return the right TLS configuration for the K8S client based on the configured TLS certificate
func getTLSClientConfig() rest.TLSClientConfig {
	var defaultRootCAFile = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
	var customRootCAFile = getK8sAPIServerTLSRootCA()
	tlsClientConfig := rest.TLSClientConfig{}
	// if console is running inside k8s by default he will have access to the CA Cert from the k8s local authority
	if _, err := certutil.NewPool(defaultRootCAFile); err == nil {
		tlsClientConfig.CAFile = defaultRootCAFile
	}
	// if the user explicitly define a custom CA certificate, instead, we will use that
	if customRootCAFile != "" {
		if _, err := certutil.NewPool(customRootCAFile); err == nil {
			tlsClientConfig.CAFile = customRootCAFile
		}
	}
	return tlsClientConfig
}

// This operation will run only once at console startup
var tlsClientConfig = getTLSClientConfig()

func GetK8sConfig(token string) *rest.Config {
	config := &rest.Config{
		Host:            GetK8sAPIServer(),
		TLSClientConfig: tlsClientConfig,
		APIPath:         "/",
		BearerToken:     token,
	}
	return config
}

// OperatorClient returns an operator client using GetK8sConfig for its config
func OperatorClient(token string) (*operator.Clientset, error) {
	return operator.NewForConfig(GetK8sConfig(token))
}

// K8sClient returns kubernetes client using GetK8sConfig for its config
func K8sClient(token string) (*kubernetes.Clientset, error) {
	return kubernetes.NewForConfig(GetK8sConfig(token))
}

// DirectCSIClient returns Direct CSI client using GetK8sConfig for its config
func DirectCSIClient(token string) (*direct.Clientset, error) {
	return direct.NewForConfig(GetK8sConfig(token))
}

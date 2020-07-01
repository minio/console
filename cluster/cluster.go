// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2019 MinIO, Inc.
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
	operator "github.com/minio/minio-operator/pkg/client/clientset/versioned"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	certutil "k8s.io/client-go/util/cert"
)

func GetK8sConfig(token string) *rest.Config {
	// if m3 is running inside k8s by default he will have access to the ca cert from the k8s local authority
	const (
		rootCAFile = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
	)
	tlsClientConfig := rest.TLSClientConfig{Insecure: getK8sAPIServerInsecure()}
	if _, err := certutil.NewPool(rootCAFile); err == nil {
		tlsClientConfig.CAFile = rootCAFile
	}
	config := &rest.Config{
		Host:            getK8sAPIServer(),
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

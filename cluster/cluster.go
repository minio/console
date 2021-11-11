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
	directcsiv1beta1 "github.com/minio/direct-csi/pkg/clientset/typed/direct.csi.min.io/v1beta1"
	directcsiv1beta2 "github.com/minio/direct-csi/pkg/clientset/typed/direct.csi.min.io/v1beta2"
	operator "github.com/minio/operator/pkg/client/clientset/versioned"
	"k8s.io/client-go/kubernetes"
	runtime "k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/rest"
	certutil "k8s.io/client-go/util/cert"
	kubernetesscheme "k8s.io/client-go/kubernetes/scheme"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	schema "k8s.io/apimachinery/pkg/runtime/schema"
)

var localSchemeBuilder = runtime.SchemeBuilder{
	kubernetesscheme.AddToScheme,
	directcsiv1beta1.AddToScheme,
	directcsiv1beta2.AddToScheme,
}

var AddToScheme = localSchemeBuilder.AddToScheme
var Scheme = AddToScheme(runtime.NewScheme())
func init() {
	v1.AddToGroupVersion(Scheme, schema.GroupVersion{Version: "v1"})
	utilruntime.Must(AddToScheme(Scheme))
}

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

// DirectCSIClientSet returns Direct CSI client using GetK8sConfig for its config
func DirectCSIClientSet(token string) (*direct.Clientset, error) {
	return direct.NewForConfig(GetK8sConfig(token))
}

func DirectCSIClientV1beta1(token string) (*directcsiv1beta1.DirectV1beta1Client, error) {
	return directcsiv1beta1.NewForConfig(GetK8sConfig(token))
}

func DirectCSIClientV1beta2(token string) (*directcsiv1beta2.DirectV1beta2Client, error) {
	return directcsiv1beta2.NewForConfig(GetK8sConfig(token))
}


// package utils

// import (
// 	directcsi "github.com/minio/direct-csi/pkg/apis/direct.csi.min.io/v1beta2"
// 	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
// 	runtime "k8s.io/apimachinery/pkg/runtime"
// 	schema "k8s.io/apimachinery/pkg/runtime/schema"
// 	serializer "k8s.io/apimachinery/pkg/runtime/serializer"
// 	utilruntime "k8s.io/apimachinery/pkg/util/runtime"
// 	kubernetesscheme "k8s.io/client-go/kubernetes/scheme"
// )

// var Scheme = runtime.NewScheme()
// var Codecs = serializer.NewCodecFactory(Scheme)
// var ParameterCodec = runtime.NewParameterCodec(Scheme)
// var localSchemeBuilder = runtime.SchemeBuilder{
// 	kubernetesscheme.AddToScheme,
// 	directcsi.AddToScheme,
// }

// // AddToScheme adds all types of this clientset into the given scheme. This allows composition
// // of clientsets, like in:
// //
// //   import (
// //     "k8s.io/client-go/kubernetes"
// //     clientsetscheme "k8s.io/client-go/kubernetes/scheme"
// //     aggregatorclientsetscheme "k8s.io/kube-aggregator/pkg/client/clientset_generated/clientset/scheme"
// //   )
// //
// //   kclientset, _ := kubernetes.NewForConfig(c)
// //   _ = aggregatorclientsetscheme.AddToScheme(clientsetscheme.Scheme)
// //
// // After this, RawExtensions in Kubernetes types will serialize kube-aggregator types
// // correctly.
// var AddToScheme = localSchemeBuilder.AddToScheme

// func init() {
// 	v1.AddToGroupVersion(Scheme, schema.GroupVersion{Version: "v1"})
// 	utilruntime.Must(AddToScheme(Scheme))
// }

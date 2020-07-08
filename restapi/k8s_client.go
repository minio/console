// This file is part of MinIO Kubernetes Cloud
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
	"context"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

// K8sClient interface with all functions to be implemented
// by mock when testing, it should include all K8sClient respective api calls
// that are used within this project.
type K8sClient interface {
	getResourceQuota(ctx context.Context, namespace, resource string, opts metav1.GetOptions) (*v1.ResourceQuota, error)
	getSecret(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*v1.Secret, error)
	getService(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*v1.Service, error)
}

// Interface implementation
//
// Define the structure of a k8s client and define the functions that are actually used
type k8sClient struct {
	client *kubernetes.Clientset
}

func (c *k8sClient) getResourceQuota(ctx context.Context, namespace, resource string, opts metav1.GetOptions) (*v1.ResourceQuota, error) {
	return c.client.CoreV1().ResourceQuotas(namespace).Get(ctx, resource, opts)
}

func (c *k8sClient) getSecret(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*v1.Secret, error) {
	return c.client.CoreV1().Secrets(namespace).Get(ctx, secretName, opts)
}

func (c *k8sClient) getService(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*v1.Service, error) {
	return c.client.CoreV1().Services(namespace).Get(ctx, serviceName, opts)
}

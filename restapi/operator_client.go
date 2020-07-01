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

	v1 "github.com/minio/minio-operator/pkg/apis/operator.min.io/v1"
	operatorClientset "github.com/minio/minio-operator/pkg/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	types "k8s.io/apimachinery/pkg/types"
)

// OperatorClient interface with all functions to be implemented
// by mock when testing, it should include all OperatorClient respective api calls
// that are used within this project.
type OperatorClient interface {
	MinIOInstanceDelete(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error
	MinIOInstanceGet(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error)
	MinIOInstancePatch(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error)
	MinIOInstanceList(ctx context.Context, namespace string, opts metav1.ListOptions) (*v1.MinIOInstanceList, error)
}

// Interface implementation
//
// Define the structure of a operator client and define the functions that are actually used
// from the minio-operator.
type operatorClient struct {
	client *operatorClientset.Clientset
}

// MinIOInstanceDelete implements the minio instance delete action from minio-operator
func (c *operatorClient) MinIOInstanceDelete(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error {
	return c.client.OperatorV1().MinIOInstances(namespace).Delete(ctx, instanceName, options)
}

// MinIOInstanceGet implements the minio instance get action from minio-operator
func (c *operatorClient) MinIOInstanceGet(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
	return c.client.OperatorV1().MinIOInstances(namespace).Get(ctx, instanceName, options)
}

// MinIOInstancePatch implements the minio instance patch action from minio-operator
func (c *operatorClient) MinIOInstancePatch(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
	return c.client.OperatorV1().MinIOInstances(namespace).Patch(ctx, instanceName, pt, data, options)
}

// MinIOInstanceList implements the minio instance list action from minio-operator
func (c *operatorClient) MinIOInstanceList(ctx context.Context, namespace string, opts metav1.ListOptions) (*v1.MinIOInstanceList, error) {
	return c.client.OperatorV1().MinIOInstances(namespace).List(ctx, opts)
}

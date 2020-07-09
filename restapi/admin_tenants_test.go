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

package restapi

import (
	"bytes"
	"context"
	"errors"
	"io/ioutil"
	"net/http"
	"reflect"
	"testing"

	"github.com/minio/mcs/cluster"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations/admin_api"
	v1 "github.com/minio/minio-operator/pkg/apis/operator.min.io/v1"
	"github.com/minio/minio/pkg/madmin"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	types "k8s.io/apimachinery/pkg/types"
)

var opClientMinioInstanceDeleteMock func(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error
var opClientMinioInstanceGetMock func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error)
var opClientMinioInstancePatchMock func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error)
var opClientMinioInstanceListMock func(ctx context.Context, namespace string, opts metav1.ListOptions) (*v1.MinIOInstanceList, error)
var httpClientGetMock func(url string) (resp *http.Response, err error)
var k8sclientGetSecretMock func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error)
var k8sclientGetServiceMock func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error)

// mock function of MinioInstanceDelete()
func (ac opClientMock) MinIOInstanceDelete(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error {
	return opClientMinioInstanceDeleteMock(ctx, namespace, instanceName, options)
}

// mock function of MinIOInstanceGet()
func (ac opClientMock) MinIOInstanceGet(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
	return opClientMinioInstanceGetMock(ctx, namespace, instanceName, options)
}

// mock function of MinioInstancePatch()
func (ac opClientMock) MinIOInstancePatch(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
	return opClientMinioInstancePatchMock(ctx, namespace, instanceName, pt, data, options)
}

// mock function of MinioInstanceList()
func (ac opClientMock) MinIOInstanceList(ctx context.Context, namespace string, opts metav1.ListOptions) (*v1.MinIOInstanceList, error) {
	return opClientMinioInstanceListMock(ctx, namespace, opts)
}

// mock function of get()
func (h httpClientMock) Get(url string) (resp *http.Response, err error) {
	return httpClientGetMock(url)
}

func (c k8sClientMock) getSecret(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
	return k8sclientGetSecretMock(ctx, namespace, secretName, opts)
}

func (c k8sClientMock) getService(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
	return k8sclientGetServiceMock(ctx, namespace, serviceName, opts)
}

func Test_TenantInfo(t *testing.T) {
	ctx := context.Background()
	kClient := k8sClientMock{}
	type args struct {
		ctx         context.Context
		client      K8sClient
		namespace   string
		tenantName  string
		serviceName string
		scheme      string
	}
	tests := []struct {
		name           string
		args           args
		wantErr        bool
		want           madmin.AdminClient
		mockGetSecret  func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error)
		mockGetService func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error)
	}{
		{
			name: "Return Tenant Admin, no errors",
			args: args{
				ctx:         ctx,
				client:      kClient,
				namespace:   "default",
				tenantName:  "tenant-1",
				serviceName: "service-1",
				scheme:      "http",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["secretkey"] = []byte("secret")
				vals["accesskey"] = []byte("access")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: false,
		},
		{
			name: "Access key not stored on secrets",
			args: args{
				ctx:         ctx,
				client:      kClient,
				namespace:   "default",
				tenantName:  "tenant-1",
				serviceName: "service-1",
				scheme:      "http",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["secretkey"] = []byte("secret")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: true,
		},
		{
			name: "Secret key not stored on secrets",
			args: args{
				ctx:         ctx,
				client:      kClient,
				namespace:   "default",
				tenantName:  "tenant-1",
				serviceName: "service-1",
				scheme:      "http",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["accesskey"] = []byte("access")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: true,
		},
		{
			name: "Handle error on getService",
			args: args{
				ctx:         ctx,
				client:      kClient,
				namespace:   "default",
				tenantName:  "tenant-1",
				serviceName: "service-1",
				scheme:      "http",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["accesskey"] = []byte("access")
				vals["secretkey"] = []byte("secret")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				return nil, errors.New("error")
			},
			wantErr: true,
		},
		{
			name: "Handle error on getSecret",
			args: args{
				ctx:         ctx,
				client:      kClient,
				namespace:   "default",
				tenantName:  "tenant-1",
				serviceName: "service-1",
				scheme:      "http",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				return nil, errors.New("error")
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		k8sclientGetSecretMock = tt.mockGetSecret
		k8sclientGetServiceMock = tt.mockGetService
		t.Run(tt.name, func(t *testing.T) {
			got, err := getTenantAdminClient(tt.args.ctx, tt.args.client, tt.args.namespace, tt.args.tenantName, tt.args.serviceName, tt.args.scheme)
			if err != nil {
				if tt.wantErr {
					return
				}
				t.Errorf("getTenantAdminClient() error = %v, wantErr %v", err, tt.wantErr)
			}
			if reflect.DeepEqual(got, tt.want) {
				t.Errorf("got %v want %v", got, tt.want)
			}
		})

	}
}

func Test_deleteTenantAction(t *testing.T) {
	opClient := opClientMock{}

	type args struct {
		ctx                     context.Context
		operatorClient          OperatorClient
		nameSpace               string
		instanceName            string
		mockMinioInstanceDelete func(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Success",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstanceDelete: func(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			name: "Error",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstanceDelete: func(ctx context.Context, namespace string, instanceName string, options metav1.DeleteOptions) error {
					return errors.New("something happened")
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		opClientMinioInstanceDeleteMock = tt.args.mockMinioInstanceDelete
		t.Run(tt.name, func(t *testing.T) {
			if err := deleteTenantAction(tt.args.ctx, tt.args.operatorClient, tt.args.nameSpace, tt.args.instanceName); (err != nil) != tt.wantErr {
				t.Errorf("deleteTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_UpdateTenantAction(t *testing.T) {
	opClient := opClientMock{}
	httpClientM := httpClientMock{}

	type args struct {
		ctx                    context.Context
		operatorClient         OperatorClient
		httpCl                 cluster.HTTPClientI
		nameSpace              string
		instanceName           string
		mockMinioInstancePatch func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error)
		mockMinioInstanceGet   func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error)
		mockHTTPClientGet      func(url string) (resp *http.Response, err error)
		params                 admin_api.UpdateTenantParams
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Update minio version no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstancePatch: func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockMinioInstanceGet: func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "minio/minio:RELEASE.2020-06-03T22-13-49Z",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Error occurs getting minioInstance",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstancePatch: func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockMinioInstanceGet: func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
					return nil, errors.New("error-get")
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "minio/minio:RELEASE.2020-06-03T22-13-49Z",
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Error occurs patching minioInstance",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstancePatch: func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
					return nil, errors.New("error-get")
				},
				mockMinioInstanceGet: func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "minio/minio:RELEASE.2020-06-03T22-13-49Z",
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Empty image should patch correctly with latest image",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstancePatch: func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockMinioInstanceGet: func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					r := ioutil.NopCloser(bytes.NewReader([]byte(`./minio.RELEASE.2020-06-18T02-23-35Z"`)))
					return &http.Response{
						Body: r,
					}, nil
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Empty image input Error retrieving latest image",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				instanceName:   "minio-instance",
				mockMinioInstancePatch: func(ctx context.Context, namespace string, instanceName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockMinioInstanceGet: func(ctx context.Context, namespace string, instanceName string, options metav1.GetOptions) (*v1.MinIOInstance, error) {
					return &v1.MinIOInstance{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return nil, errors.New("error")
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "",
					},
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		opClientMinioInstanceGetMock = tt.args.mockMinioInstanceGet
		opClientMinioInstancePatchMock = tt.args.mockMinioInstancePatch
		httpClientGetMock = tt.args.mockHTTPClientGet
		t.Run(tt.name, func(t *testing.T) {
			if err := updateTenantAction(tt.args.ctx, tt.args.operatorClient, tt.args.httpCl, tt.args.nameSpace, tt.args.params); (err != nil) != tt.wantErr {
				t.Errorf("deleteTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

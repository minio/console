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
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"reflect"
	"testing"

	"github.com/go-openapi/swag"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations/admin_api"
	operator "github.com/minio/operator/pkg/apis/minio.min.io/v1"
	v1 "github.com/minio/operator/pkg/apis/minio.min.io/v1"
	corev1 "k8s.io/api/core/v1"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	types "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes/fake"
)

var opClientTenantDeleteMock func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error
var opClientTenantGetMock func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error)
var opClientTenantPatchMock func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error)
var opClientTenantListMock func(ctx context.Context, namespace string, opts metav1.ListOptions) (*v1.TenantList, error)
var httpClientGetMock func(url string) (resp *http.Response, err error)
var k8sclientGetSecretMock func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error)
var k8sclientGetServiceMock func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error)

// mock function of TenantDelete()
func (ac opClientMock) TenantDelete(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
	return opClientTenantDeleteMock(ctx, namespace, tenantName, options)
}

// mock function of TenantGet()
func (ac opClientMock) TenantGet(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
	return opClientTenantGetMock(ctx, namespace, tenantName, options)
}

// mock function of TenantPatch()
func (ac opClientMock) TenantPatch(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
	return opClientTenantPatchMock(ctx, namespace, tenantName, pt, data, options)
}

// mock function of TenantList()
func (ac opClientMock) TenantList(ctx context.Context, namespace string, opts metav1.ListOptions) (*v1.TenantList, error) {
	return opClientTenantListMock(ctx, namespace, opts)
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

func Test_TenantInfoTenantAdminClient(t *testing.T) {
	ctx := context.Background()
	kClient := k8sClientMock{}
	type args struct {
		ctx        context.Context
		client     K8sClientI
		tenant     v1.Tenant
		serviceURL string
		insecure   bool
	}
	tests := []struct {
		name           string
		args           args
		wantErr        bool
		mockGetSecret  func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error)
		mockGetService func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error)
	}{
		{
			name: "Return Tenant Admin, no errors",
			args: args{
				ctx:    ctx,
				client: kClient,
				tenant: v1.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
					Spec: v1.TenantSpec{CredsSecret: &corev1.LocalObjectReference{Name: "secret-name"}},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
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
				ctx:    ctx,
				client: kClient,
				tenant: v1.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
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
				ctx:    ctx,
				client: kClient,
				tenant: v1.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
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
				ctx:    ctx,
				client: kClient,
				tenant: v1.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
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
				ctx:    ctx,
				client: kClient,
				tenant: v1.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
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
			got, err := getTenantAdminClient(tt.args.ctx, tt.args.client, &tt.args.tenant, tt.args.serviceURL, tt.args.insecure)
			if err != nil {
				if tt.wantErr {
					return
				}
				t.Errorf("getTenantAdminClient() error = %v, wantErr %v", err, tt.wantErr)
			}
			if got == nil {
				t.Errorf("getTenantAdminClient() expected type: *madmin.AdminClient, got: nil")
			}
		})
	}
}

func Test_TenantInfo(t *testing.T) {
	testTimeStamp := metav1.Now()
	type args struct {
		minioTenant *operator.Tenant
	}
	tests := []struct {
		name string
		args args
		want *models.Tenant
	}{
		{
			name: "Get tenant Info",
			args: args{
				minioTenant: &operator.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
					},
					Spec: operator.TenantSpec{
						Zones: []operator.Zone{
							{
								Name:             "zone1",
								Servers:          int32(2),
								VolumesPerServer: 4,
								VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
									Spec: corev1.PersistentVolumeClaimSpec{
										Resources: corev1.ResourceRequirements{
											Requests: map[corev1.ResourceName]resource.Quantity{
												corev1.ResourceStorage: resource.MustParse("1Mi"),
											},
										},
										StorageClassName: swag.String("standard"),
									},
								},
							},
						},

						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: operator.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate: testTimeStamp.String(),
				Name:         "tenant1",
				TotalSize:    int64(8388608),
				CurrentState: "ready",
				Zones: []*models.Zone{
					{
						Name:             "zone1",
						Servers:          swag.Int64(int64(2)),
						VolumesPerServer: swag.Int32(4),
						VolumeConfiguration: &models.ZoneVolumeConfiguration{
							StorageClassName: "standard",
							Size:             swag.Int64(1024 * 1024),
						},
					},
				},
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: false,
			},
		},
		{
			// Description if DeletionTimeStamp is present, value should be returned as string
			// If Prometheus annotations are present, EnablePrometheus should be returned as true
			// All three annotations should be defined to consider Prometheus enabled
			name: "Get tenant Info w DeletionTimeStamp and Prometheus",
			args: args{
				minioTenant: &operator.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
						DeletionTimestamp: &testTimeStamp,
						Annotations: map[string]string{
							prometheusPath:   "some/path",
							prometheusPort:   "other/path",
							prometheusScrape: "other/path",
						},
					},
					Spec: operator.TenantSpec{
						Zones: []operator.Zone{
							{
								Name:             "zone1",
								Servers:          int32(2),
								VolumesPerServer: 4,
								VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
									Spec: corev1.PersistentVolumeClaimSpec{
										Resources: corev1.ResourceRequirements{
											Requests: map[corev1.ResourceName]resource.Quantity{
												corev1.ResourceStorage: resource.MustParse("1Mi"),
											},
										},
										StorageClassName: swag.String("standard"),
									},
								},
							},
						},
						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: operator.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate: testTimeStamp.String(),
				DeletionDate: testTimeStamp.String(),
				Name:         "tenant1",
				TotalSize:    int64(8388608),
				CurrentState: "ready",
				Zones: []*models.Zone{
					{
						Name:             "zone1",
						Servers:          swag.Int64(int64(2)),
						VolumesPerServer: swag.Int32(4),
						VolumeConfiguration: &models.ZoneVolumeConfiguration{
							StorageClassName: "standard",
							Size:             swag.Int64(1024 * 1024),
						},
					},
				},
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: true,
			},
		},
		{
			// If Prometheus annotations are present, EnablePrometheus should be returned as true
			// All three annotations should be defined to consider Prometheus enabled
			name: "Get tenant Info, not all Prometheus annotations",
			args: args{
				minioTenant: &operator.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
						Annotations: map[string]string{
							prometheusPath:   "some/path",
							prometheusScrape: "other/path",
						},
					},
					Spec: operator.TenantSpec{
						Zones: []operator.Zone{},
						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: operator.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate:     testTimeStamp.String(),
				Name:             "tenant1",
				CurrentState:     "ready",
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: false,
			},
		},
		{
			// If console image is set, it should be returned on tenant info
			name: "Get tenant Info, Console image set",
			args: args{
				minioTenant: &operator.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
						Annotations: map[string]string{
							prometheusPath:   "some/path",
							prometheusScrape: "other/path",
						},
					},
					Spec: operator.TenantSpec{
						Zones: []operator.Zone{},
						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
						Console: &operator.ConsoleConfiguration{
							Image: "minio/console:master",
						},
					},
					Status: operator.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate:     testTimeStamp.String(),
				Name:             "tenant1",
				CurrentState:     "ready",
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: false,
				ConsoleImage:     "minio/console:master",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := getTenantInfo(tt.args.minioTenant)
			if !reflect.DeepEqual(got, tt.want) {
				ji, _ := json.Marshal(got)
				vi, _ := json.Marshal(tt.want)
				t.Errorf("got %s want %s", ji, vi)
			}
		})
	}
}

func Test_deleteTenantAction(t *testing.T) {
	opClient := opClientMock{}
	type args struct {
		ctx              context.Context
		operatorClient   OperatorClientI
		nameSpace        string
		tenantName       string
		deletePvcs       bool
		objs             []runtime.Object
		mockTenantDelete func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error
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
				tenantName:     "minio-tenant",
				deletePvcs:     false,
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
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
				tenantName:     "minio-tenant",
				deletePvcs:     false,
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return errors.New("something happened")
				},
			},
			wantErr: true,
		},
		{
			// Delete only PVCs of the defined tenant on the specific namespace
			name: "Delete PVCs on Tenant Deletion",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "minio-tenant",
				tenantName:     "tenant1",
				deletePvcs:     true,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								operator.TenantLabel: "tenant1",
								operator.ZoneLabel:   "zone-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			// Do not delete underlying pvcs
			name: "Don't Delete PVCs on Tenant Deletion",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "minio-tenant",
				tenantName:     "tenant1",
				deletePvcs:     false,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								operator.TenantLabel: "tenant1",
								operator.ZoneLabel:   "zone-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			// If error is different than NotFound, PVC deletion should not continue
			name: "Don't delete pvcs if error Deleting Tenant, return",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "minio-tenant",
				tenantName:     "tenant1",
				deletePvcs:     true,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								operator.TenantLabel: "tenant1",
								operator.ZoneLabel:   "zone-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return errors.New("error returned")
				},
			},
			wantErr: true,
		},
		{
			// If error is NotFound while trying to Delete Tenant, PVC deletion should continue
			name: "Delete pvcs if tenant not found",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "minio-tenant",
				tenantName:     "tenant1",
				deletePvcs:     true,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								operator.TenantLabel: "tenant1",
								operator.ZoneLabel:   "zone-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return k8sErrors.NewNotFound(schema.GroupResource{}, "tenant1")
				},
			},
			wantErr: false,
		},
		{
			// If error is NotFound while trying to Delete Tenant and pvcdeletion=false,
			// error should be returned
			name: "Don't delete pvcs and return error if tenant not found",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "minio-tenant",
				tenantName:     "tenant1",
				deletePvcs:     false,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								operator.TenantLabel: "tenant1",
								operator.ZoneLabel:   "zone-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return k8sErrors.NewNotFound(schema.GroupResource{}, "tenant1")
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		opClientTenantDeleteMock = tt.args.mockTenantDelete
		kubeClient := fake.NewSimpleClientset(tt.args.objs...)
		t.Run(tt.name, func(t *testing.T) {
			if err := deleteTenantAction(tt.args.ctx, tt.args.operatorClient, kubeClient.CoreV1(), tt.args.nameSpace, tt.args.tenantName, tt.args.deletePvcs); (err != nil) != tt.wantErr {
				t.Errorf("deleteTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_TenantAddZone(t *testing.T) {
	opClient := opClientMock{}

	type args struct {
		ctx             context.Context
		operatorClient  OperatorClientI
		nameSpace       string
		mockTenantPatch func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error)
		mockTenantGet   func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error)
		params          admin_api.TenantAddZoneParams
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Add zone, no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				params: admin_api.TenantAddZoneParams{
					Body: &models.Zone{
						Name:    "zone-1",
						Servers: swag.Int64(int64(4)),
						VolumeConfiguration: &models.ZoneVolumeConfiguration{
							Size:             swag.Int64(2147483648),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(4),
					},
				},
			},
			wantErr: false,
		}, {
			name: "Add zone, error size",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				params: admin_api.TenantAddZoneParams{
					Body: &models.Zone{
						Name:    "zone-1",
						Servers: swag.Int64(int64(4)),
						VolumeConfiguration: &models.ZoneVolumeConfiguration{
							Size:             swag.Int64(0),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(4),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Add zone, error servers negative",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				params: admin_api.TenantAddZoneParams{
					Body: &models.Zone{
						Name:    "zone-1",
						Servers: swag.Int64(int64(-1)),
						VolumeConfiguration: &models.ZoneVolumeConfiguration{
							Size:             swag.Int64(2147483648),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(4),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Add zone, error volumes per server negative",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				params: admin_api.TenantAddZoneParams{
					Body: &models.Zone{
						Name:    "zone-1",
						Servers: swag.Int64(int64(4)),
						VolumeConfiguration: &models.ZoneVolumeConfiguration{
							Size:             swag.Int64(2147483648),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(-1),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Error on patch, handle error",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return nil, errors.New("errors")
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				params: admin_api.TenantAddZoneParams{
					Body: &models.Zone{
						Name:    "zone-1",
						Servers: swag.Int64(int64(4)),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Error on get, handle error",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return nil, errors.New("errors")
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return nil, errors.New("errors")
				},
				params: admin_api.TenantAddZoneParams{
					Body: &models.Zone{
						Name:    "zone-1",
						Servers: swag.Int64(int64(4)),
					},
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		opClientTenantGetMock = tt.args.mockTenantGet
		opClientTenantPatchMock = tt.args.mockTenantPatch
		t.Run(tt.name, func(t *testing.T) {
			if err := addTenantZone(tt.args.ctx, tt.args.operatorClient, tt.args.params); (err != nil) != tt.wantErr {
				t.Errorf("addTenantZone() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_UpdateTenantAction(t *testing.T) {
	opClient := opClientMock{}
	httpClientM := httpClientMock{}

	type args struct {
		ctx               context.Context
		operatorClient    OperatorClientI
		httpCl            cluster.HTTPClientI
		nameSpace         string
		tenantName        string
		mockTenantPatch   func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error)
		mockTenantGet     func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error)
		mockHTTPClientGet func(url string) (resp *http.Response, err error)
		params            admin_api.UpdateTenantParams
	}
	tests := []struct {
		name    string
		args    args
		objs    []runtime.Object
		wantErr bool
	}{
		{
			name: "Update minio version no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
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
			name: "Error occurs getting minioTenant",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
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
			name: "Error occurs patching minioTenant",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return nil, errors.New("error-get")
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: admin_api.UpdateTenantParams{
					Tenant: "minio-tenant",
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
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					r := ioutil.NopCloser(bytes.NewReader([]byte(`./minio.RELEASE.2020-06-18T02-23-35Z"`)))
					return &http.Response{
						Body: r,
					}, nil
				},
				params: admin_api.UpdateTenantParams{
					Tenant: "minio-tenant",
					Body: &models.UpdateTenantRequest{
						Image: "",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Empty image input Error retrieving latest image, nothing happens",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return nil, errors.New("error")
				},
				params: admin_api.UpdateTenantParams{
					Tenant: "minio-tenant",
					Body: &models.UpdateTenantRequest{
						Image: "",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Update minio console version no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return nil, errors.New("use default minio")
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						ConsoleImage: "minio/console:v0.4.2",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Update minio image pull secrets no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*v1.Tenant, error) {
					return &v1.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return nil, errors.New("use default minio")
				},
				params: admin_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						ImagePullSecret: "minio-regcred",
					},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		opClientTenantGetMock = tt.args.mockTenantGet
		opClientTenantPatchMock = tt.args.mockTenantPatch
		httpClientGetMock = tt.args.mockHTTPClientGet
		cnsClient := fake.NewSimpleClientset(tt.objs...)
		t.Run(tt.name, func(t *testing.T) {
			if err := updateTenantAction(tt.args.ctx, tt.args.operatorClient, cnsClient.CoreV1(), tt.args.httpCl, tt.args.nameSpace, tt.args.params); (err != nil) != tt.wantErr {
				t.Errorf("updateTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

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

package operatorapi

import (
	"context"
	"testing"

	v2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"

	"errors"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Test_addSubscriptionLicenseToTenant(t *testing.T) {
	k8sClient := k8sClientMock{}
	opClient := opClientMock{}
	tenant := &v2.Tenant{
		ObjectMeta: metav1.ObjectMeta{},
		Spec:       v2.TenantSpec{},
	}
	type args struct {
		ctx       context.Context
		clientSet K8sClientI
		opClient  OperatorClientI
		license   string
		tenant    *v2.Tenant
	}
	tests := []struct {
		name     string
		args     args
		wantErr  bool
		mockFunc func()
	}{
		{
			name: "success updating subscription for tenant with configuration file",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				opClient:  opClient,
				license:   "",
				tenant:    tenant,
			},
			wantErr: false,
			mockFunc: func() {
				tenant.Spec.Configuration = &corev1.LocalObjectReference{
					Name: "minio-configuration",
				}
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					return &corev1.Secret{
						ObjectMeta: metav1.ObjectMeta{
							Name: "minio-configuration",
						},
						Data: map[string][]byte{
							"config.env": []byte("export MINIO_SUBNET_LICENSE=\"eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I\""),
						},
					}, nil
				}
				UpdateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.UpdateOptions) (*corev1.Secret, error) {
					return nil, nil
				}
			},
		},
		{
			name: "error updating subscription for tenant because cannot get configuration file",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				opClient:  opClient,
				license:   "",
				tenant:    tenant,
			},
			wantErr: true,
			mockFunc: func() {
				tenant.Spec.Configuration = &corev1.LocalObjectReference{
					Name: "minio-configuration",
				}
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					return nil, errors.New("something wrong happened")
				}
				UpdateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.UpdateOptions) (*corev1.Secret, error) {
					return nil, nil
				}
			},
		},
		{
			name: "error updating subscription for tenant because configuration file has wrong format",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				opClient:  opClient,
				license:   "",
				tenant:    tenant,
			},
			wantErr: true,
			mockFunc: func() {
				tenant.Spec.Configuration = &corev1.LocalObjectReference{
					Name: "minio-configuration",
				}
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					return &corev1.Secret{
						ObjectMeta: metav1.ObjectMeta{
							Name: "minio-configuration",
						},
						Data: map[string][]byte{
							"aaaaa": []byte("export MINIO_SUBNET_LICENSE=\"eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I\""),
						},
					}, nil
				}
				UpdateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.UpdateOptions) (*corev1.Secret, error) {
					return nil, nil
				}
			},
		},
		{
			name: "error updating subscription for tenant because cannot update configuration file",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				opClient:  opClient,
				license:   "",
				tenant:    tenant,
			},
			wantErr: true,
			mockFunc: func() {
				tenant.Spec.Configuration = &corev1.LocalObjectReference{
					Name: "minio-configuration",
				}
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					return &corev1.Secret{
						ObjectMeta: metav1.ObjectMeta{
							Name: "minio-configuration",
						},
						Data: map[string][]byte{
							"config.env": []byte("export MINIO_SUBNET_LICENSE=\"eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I\""),
						},
					}, nil
				}
				UpdateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.UpdateOptions) (*corev1.Secret, error) {
					return nil, errors.New("something wrong happened")
				}

			},
		},
		{
			name: "success updating subscription for tenant with env variable",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				opClient:  opClient,
				license:   "",
				tenant:    tenant,
			},
			wantErr: false,
			mockFunc: func() {
				tenant.Spec.Env = []corev1.EnvVar{
					{
						Name:      "MINIO_SUBNET_LICENSE",
						Value:     "",
						ValueFrom: nil,
					},
				}
				opClientTenantUpdateMock = func(ctx context.Context, tenant *v2.Tenant, opts metav1.UpdateOptions) (*v2.Tenant, error) {
					return nil, nil
				}
			},
		},
		{
			name: "error updating subscription for tenant with env variable because of update tenant error",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				opClient:  opClient,
				license:   "",
				tenant:    tenant,
			},
			wantErr: true,
			mockFunc: func() {
				tenant.Spec.Env = []corev1.EnvVar{
					{
						Name:      "MINIO_SUBNET_LICENSE",
						Value:     "",
						ValueFrom: nil,
					},
				}
				opClientTenantUpdateMock = func(ctx context.Context, tenant *v2.Tenant, opts metav1.UpdateOptions) (*v2.Tenant, error) {
					return nil, errors.New("something wrong happened")
				}
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mockFunc != nil {
				tt.mockFunc()
			}
			if err := addSubscriptionLicenseToTenant(tt.args.ctx, tt.args.clientSet, tt.args.opClient, tt.args.license, tt.args.tenant); (err != nil) != tt.wantErr {
				t.Errorf("addSubscriptionLicenseToTenant() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_saveSubscriptionLicense(t *testing.T) {
	k8sClient := k8sClientMock{}
	type args struct {
		ctx       context.Context
		clientSet K8sClientI
		license   string
	}
	tests := []struct {
		name     string
		args     args
		wantErr  bool
		mockFunc func()
	}{
		{
			name: "error deleting existing secret",
			args: args{
				ctx:       context.Background(),
				clientSet: k8sClient,
				license:   "1111111111",
			},
			mockFunc: func() {
				DeleteSecretMock = func(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
					return nil
				}
				CreateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.CreateOptions) (*corev1.Secret, error) {
					return nil, errors.New("something went wrong")
				}
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mockFunc != nil {
				tt.mockFunc()
			}
			if err := saveSubscriptionLicense(tt.args.ctx, tt.args.clientSet, tt.args.license); (err != nil) != tt.wantErr {
				t.Errorf("saveSubscriptionLicense() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_getSubscriptionLicense(t *testing.T) {
	license := "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I"
	k8sClient := k8sClientMock{}
	type args struct {
		ctx        context.Context
		clientSet  K8sClientI
		namespace  string
		secretName string
	}
	tests := []struct {
		name     string
		args     args
		want     string
		wantErr  bool
		mockFunc func()
	}{
		{
			name: "error because subscription license doesnt exists",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				namespace:  "namespace",
				secretName: OperatorSubnetLicenseSecretName,
			},
			wantErr: true,
			mockFunc: func() {
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					return nil, errors.New("something went wrong")
				}
			},
		},
		{
			name: "error because license field doesnt exist in k8s secret",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				namespace:  "namespace",
				secretName: OperatorSubnetLicenseSecretName,
			},
			wantErr: true,
			mockFunc: func() {
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					imm := true
					return &corev1.Secret{
						ObjectMeta: metav1.ObjectMeta{
							Name: OperatorSubnetLicenseSecretName,
						},
						Immutable: &imm,
						Data:      map[string][]byte{
							//ConsoleSubnetLicense: []byte(license),
						},
					}, nil
				}
			},
		},
		{
			name: "license obtained successfully",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				namespace:  "namespace",
				secretName: OperatorSubnetLicenseSecretName,
			},
			wantErr: false,
			want:    license,
			mockFunc: func() {
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					imm := true
					return &corev1.Secret{
						ObjectMeta: metav1.ObjectMeta{
							Name: OperatorSubnetLicenseSecretName,
						},
						Immutable: &imm,
						Data: map[string][]byte{
							ConsoleSubnetLicense: []byte(license),
						},
					}, nil
				}
			},
		},
	}
	for _, tt := range tests {
		if tt.mockFunc != nil {
			tt.mockFunc()
		}
		t.Run(tt.name, func(t *testing.T) {
			got, err := getSubscriptionLicense(tt.args.ctx, tt.args.clientSet, tt.args.namespace, tt.args.secretName)
			if (err != nil) != tt.wantErr {
				t.Errorf("getSubscriptionLicense() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("getSubscriptionLicense() got = %v, want %v", got, tt.want)
			}
		})
	}
}

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

package restapi

import (
	"context"
	"testing"

	"errors"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Test_addSubscriptionLicenseToTenant(t *testing.T) {
	k8sClient := k8sClientMock{}
	type args struct {
		ctx        context.Context
		clientSet  K8sClientI
		license    string
		namespace  string
		tenantName string
		secretName string
	}
	tests := []struct {
		name     string
		args     args
		wantErr  bool
		mockFunc func()
	}{
		{
			name: "error because subnet license doesnt exists",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				license:    "",
				namespace:  "",
				tenantName: "",
				secretName: "subnet-license",
			},
			wantErr: true,
			mockFunc: func() {
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					return nil, errors.New("something went wrong")
				}
			},
		},
		{
			name: "error because existing license could not be deleted",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				license:    "",
				namespace:  "",
				tenantName: "",
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
						Data: map[string][]byte{
							ConsoleSubnetLicense: []byte("eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I"),
						},
					}, nil
				}
				DeleteSecretMock = func(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
					return errors.New("something went wrong")
				}
			},
		},
		{
			name: "error because unable to create new subnet license",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				license:    "",
				namespace:  "",
				tenantName: "",
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
						Data: map[string][]byte{
							ConsoleSubnetLicense: []byte("eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I"),
						},
					}, nil
				}
				DeleteSecretMock = func(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
					return nil
				}
				CreateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.CreateOptions) (*corev1.Secret, error) {
					return nil, errors.New("something went wrong")
				}
			},
		},
		{
			name: "error because unable to delete pod collection",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				license:    "",
				namespace:  "",
				tenantName: "",
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
						Data: map[string][]byte{
							ConsoleSubnetLicense: []byte("eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I"),
						},
					}, nil
				}
				DeleteSecretMock = func(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
					return nil
				}
				CreateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.CreateOptions) (*corev1.Secret, error) {
					return nil, nil
				}
				DeletePodCollectionMock = func(ctx context.Context, namespace string, opts metav1.DeleteOptions, listOpts metav1.ListOptions) error {
					return errors.New("something went wrong")
				}
			},
		},
		{
			name: "subscription updated successfully",
			args: args{
				ctx:        context.Background(),
				clientSet:  k8sClient,
				license:    "",
				namespace:  "",
				tenantName: "",
				secretName: OperatorSubnetLicenseSecretName,
			},
			wantErr: false,
			mockFunc: func() {
				k8sclientGetSecretMock = func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
					imm := true
					return &corev1.Secret{
						ObjectMeta: metav1.ObjectMeta{
							Name: OperatorSubnetLicenseSecretName,
						},
						Immutable: &imm,
						Data: map[string][]byte{
							ConsoleSubnetLicense: []byte("eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I"),
						},
					}, nil
				}
				DeleteSecretMock = func(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
					return nil
				}
				CreateSecretMock = func(ctx context.Context, namespace string, secret *corev1.Secret, opts metav1.CreateOptions) (*corev1.Secret, error) {
					return nil, nil
				}
				DeletePodCollectionMock = func(ctx context.Context, namespace string, opts metav1.DeleteOptions, listOpts metav1.ListOptions) error {
					return nil
				}
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mockFunc != nil {
				tt.mockFunc()
			}
			if err := addSubscriptionLicenseToTenant(tt.args.ctx, tt.args.clientSet, tt.args.license, tt.args.namespace, tt.args.tenantName, tt.args.secretName); (err != nil) != tt.wantErr {
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

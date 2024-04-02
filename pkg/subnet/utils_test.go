// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

package subnet

import (
	"os"
	"reflect"
	"testing"

	"github.com/minio/mc/cmd"
)

func Test_subnetBaseURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if tt.args.env != nil {
				for k, v := range tt.args.env {
					os.Setenv(k, v)
				}
			}
			if got := subnetBaseURL(); got != tt.want {
				t.Errorf("subnetBaseURL() = %v, want %v", got, tt.want)
			}
			if tt.args.env != nil {
				for k := range tt.args.env {
					os.Unsetenv(k)
				}
			}
		})
	}
}

func Test_subnetRegisterURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io/api/cluster/register",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle/api/cluster/register",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := subnetRegisterURL(); got != tt.want {
				t.Errorf("subnetRegisterURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func Test_subnetLoginURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io/api/auth/login",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle/api/auth/login",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := subnetLoginURL(); got != tt.want {
				t.Errorf("subnetLoginURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func Test_subnetOrgsURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io/api/auth/organizations",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle/api/auth/organizations",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := subnetOrgsURL(); got != tt.want {
				t.Errorf("subnetOrgsURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func Test_subnetMFAURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io/api/auth/mfa-login",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle/api/auth/mfa-login",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := subnetMFAURL(); got != tt.want {
				t.Errorf("subnetMFAURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func Test_subnetAPIKeyURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io/api/auth/api-key",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle/api/auth/api-key",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := subnetAPIKeyURL(); got != tt.want {
				t.Errorf("subnetAPIKeyURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func TestLogWebhookURL(t *testing.T) {
	type args struct {
		env map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env: nil,
			},
			want: "https://subnet.min.io/api/logs",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
			},
			want: "http://oorgle/api/logs",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := LogWebhookURL(); got != tt.want {
				t.Errorf("LogWebhookURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func TestUploadURL(t *testing.T) {
	type args struct {
		env        map[string]string
		uploadType string
		filename   string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "default",
			args: args{
				env:        nil,
				uploadType: "x",
				filename:   "y.jpg",
			},
			want: "https://subnet.min.io/api/x/upload?filename=y.jpg",
		},
		{
			name: "with env",
			args: args{
				env: map[string]string{
					"CONSOLE_SUBNET_URL": "http://oorgle",
				},
				uploadType: "x",
				filename:   "y.jpg",
			},
			want: "http://oorgle/api/x/upload?filename=y.jpg",
		},
	}
	for _, tt := range tests {
		if tt.args.env != nil {
			for k, v := range tt.args.env {
				os.Setenv(k, v)
			}
		}
		t.Run(tt.name, func(_ *testing.T) {
			if got := UploadURL(tt.args.uploadType, tt.args.filename); got != tt.want {
				t.Errorf("UploadURL() = %v, want %v", got, tt.want)
			}
		})
		if tt.args.env != nil {
			for k := range tt.args.env {
				os.Unsetenv(k)
			}
		}
	}
}

func TestUploadAuthHeaders(t *testing.T) {
	type args struct {
		apiKey string
	}
	tests := []struct {
		name string
		args args
		want map[string]string
	}{
		{
			name: "basic",
			args: args{
				apiKey: "xx",
			},
			want: map[string]string{"x-subnet-api-key": "xx"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if got := UploadAuthHeaders(tt.args.apiKey); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("UploadAuthHeaders() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGenerateRegToken(t *testing.T) {
	type args struct {
		clusterRegInfo cmd.ClusterRegistrationInfo
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		{
			name: "basic",
			args: args{
				clusterRegInfo: cmd.ClusterRegistrationInfo{
					DeploymentID: "x",
					ClusterName:  "y",
					UsedCapacity: 1,
					Info:         cmd.ClusterInfo{},
				},
			},
			want:    "eyJkZXBsb3ltZW50X2lkIjoieCIsImNsdXN0ZXJfbmFtZSI6InkiLCJ1c2VkX2NhcGFjaXR5IjoxLCJpbmZvIjp7Im1pbmlvX3ZlcnNpb24iOiIiLCJub19vZl9zZXJ2ZXJfcG9vbHMiOjAsIm5vX29mX3NlcnZlcnMiOjAsIm5vX29mX2RyaXZlcyI6MCwibm9fb2ZfYnVja2V0cyI6MCwibm9fb2Zfb2JqZWN0cyI6MCwidG90YWxfZHJpdmVfc3BhY2UiOjAsInVzZWRfZHJpdmVfc3BhY2UiOjB9fQ==",
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got, err := GenerateRegToken(tt.args.clusterRegInfo)
			if (err != nil) != tt.wantErr {
				t.Errorf("GenerateRegToken() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GenerateRegToken() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_subnetAuthHeaders(t *testing.T) {
	type args struct {
		authToken string
	}
	tests := []struct {
		name string
		args args
		want map[string]string
	}{
		{
			name: "basic",
			args: args{
				authToken: "x",
			},
			want: map[string]string{"Authorization": "Bearer x"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if got := subnetAuthHeaders(tt.args.authToken); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("subnetAuthHeaders() = %v, want %v", got, tt.want)
			}
		})
	}
}

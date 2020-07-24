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
	"context"
	"errors"
	"reflect"
	"testing"

	"github.com/go-openapi/swag"

	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations/admin_api"
)

func Test_addNotificationEndpoint(t *testing.T) {
	client := adminClientMock{}

	type args struct {
		ctx    context.Context
		client MinioAdmin
		params *admin_api.AddNotificationEndpointParams
	}
	tests := []struct {
		name          string
		args          args
		mockSetConfig func(kv string) error
		want          *models.NotificationEndpoint
		wantErr       bool
	}{
		{
			name: "valid postgres",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"host":     "localhost",
							"user":     "user",
							"password": "passwrd",
						},
						Service: "postgres",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"host":     "localhost",
					"user":     "user",
					"password": "passwrd",
				},
				Service: "postgres",
			},
			wantErr: false,
		},
		{
			name: "set config returns error",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"host":     "localhost",
							"user":     "user",
							"password": "passwrd",
						},
						Service: "postgres",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return errors.New("error")
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "valid mysql",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"host":     "localhost",
							"user":     "user",
							"password": "passwrd",
						},
						Service: "mysql",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"host":     "localhost",
					"user":     "user",
					"password": "passwrd",
				},
				Service: "mysql",
			},
			wantErr: false,
		},
		{
			name: "valid kafka",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"brokers": "http://localhost:8080/broker1",
						},
						Service: "kafka",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"brokers": "http://localhost:8080/broker1",
				},
				Service: "kafka",
			},
			wantErr: false,
		},
		{
			name: "valid amqp",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"url": "http://localhost:8080/broker1",
						},
						Service: "amqp",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"url": "http://localhost:8080/broker1",
				},
				Service: "amqp",
			},
			wantErr: false,
		},
		{
			name: "valid mqtt",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"broker": "http://localhost:8080/broker1",
							"topic":  "minio",
						},
						Service: "mqtt",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"broker": "http://localhost:8080/broker1",
					"topic":  "minio",
				},
				Service: "mqtt",
			},
			wantErr: false,
		},
		{
			name: "valid elasticsearch",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"url":    "http://localhost:8080/broker1",
							"index":  "minio",
							"format": "namespace",
						},
						Service: "elasticsearch",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"url":    "http://localhost:8080/broker1",
					"index":  "minio",
					"format": "namespace",
				},
				Service: "elasticsearch",
			},
			wantErr: false,
		},
		{
			name: "valid redis",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"address": "http://localhost:8080/broker1",
							"key":     "minio",
							"format":  "namespace",
						},
						Service: "redis",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"address": "http://localhost:8080/broker1",
					"key":     "minio",
					"format":  "namespace",
				},
				Service: "redis",
			},
			wantErr: false,
		},
		{
			name: "valid nats",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"address": "http://localhost:8080/broker1",
							"subject": "minio",
						},
						Service: "nats",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"address": "http://localhost:8080/broker1",
					"subject": "minio",
				},
				Service: "nats",
			},
			wantErr: false,
		},
		{
			name: "valid webhook",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"endpoint": "http://localhost:8080/broker1",
						},
						Service: "webhook",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"endpoint": "http://localhost:8080/broker1",
				},
				Service: "webhook",
			},
			wantErr: false,
		},
		{
			name: "valid nsq",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"nsqd_address": "http://localhost:8080/broker1",
							"topic":        "minio",
						},
						Service: "nsq",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return nil
			},
			want: &models.NotificationEndpoint{
				AccountID: swag.String("1"),
				Properties: map[string]string{
					"nsqd_address": "http://localhost:8080/broker1",
					"topic":        "minio",
				},
				Service: "nsq",
			},
			wantErr: false,
		},
		{
			name: "invalid service",
			args: args{
				ctx:    context.Background(),
				client: client,
				params: &admin_api.AddNotificationEndpointParams{
					HTTPRequest: nil,
					Body: &models.NotificationEndpoint{
						AccountID: swag.String("1"),
						Properties: map[string]string{
							"host":     "localhost",
							"user":     "user",
							"password": "passwrd",
						},
						Service: "oorgle",
					},
				},
			},
			mockSetConfig: func(kv string) error {
				return errors.New("invalid config")
			},
			want:    nil,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// mock function response from setConfig()
			minioSetConfigKVMock = tt.mockSetConfig
			got, err := addNotificationEndpoint(tt.args.ctx, tt.args.client, tt.args.params)
			if (err != nil) != tt.wantErr {
				t.Errorf("addNotificationEndpoint() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("addNotificationEndpoint() got = %v, want %v", got, tt.want)
			}
		})
	}
}

// This file is part of MinIO Console Server
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

package api

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"testing"

	"github.com/go-openapi/swag"
	"github.com/stretchr/testify/assert"

	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

const (
	NotifyPostgresSubSys     = "notify_postgres"
	PostgresFormat           = "format"
	PostgresConnectionString = "connection_string"
	PostgresTable            = "table"
	PostgresQueueDir         = "queue_dir"
	PostgresQueueLimit       = "queue_limit"
)

func TestListConfig(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	function := "listConfig()"
	// Test-1 : listConfig() get list of two configurations and ensure is output correctly
	configListMock := []madmin.HelpKV{
		{
			Key:         "region",
			Description: "label the location of the server",
		},
		{
			Key:         "notify_nsq",
			Description: "publish bucket notifications to NSQ endpoints",
		},
	}
	mockConfigList := madmin.Help{
		SubSys:          "sys",
		Description:     "desc",
		MultipleTargets: false,
		KeysHelp:        configListMock,
	}
	expectedKeysDesc := mockConfigList.KeysHelp
	// mock function response from listConfig()
	minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
		return mockConfigList, nil
	}
	configList, err := listConfig(adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of keys is correct
	assert.Equal(len(expectedKeysDesc), len(configList), fmt.Sprintf("Failed on %s: length of Configs's lists is not the same", function))
	// verify KeysHelp content
	for i, kv := range configList {
		assert.Equal(expectedKeysDesc[i].Key, kv.Key)
		assert.Equal(expectedKeysDesc[i].Description, kv.Description)
	}

	// Test-2 : listConfig() Return error and see that the error is handled correctly and returned
	// mock function response from listConfig()
	minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
		return madmin.Help{}, errors.New("error")
	}
	_, err = listConfig(adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestSetConfig(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	function := "setConfig()"
	// mock function response from setConfig()
	minioSetConfigKVMock = func(_ string) (restart bool, err error) {
		return false, nil
	}
	configName := "notify_postgres"
	kvs := []*models.ConfigurationKV{
		{
			Key:   "enable",
			Value: "off",
		},
		{
			Key:   "connection_string",
			Value: "",
		},
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1 : setConfig() sets a config with two key value pairs
	restart, err := setConfig(ctx, adminClient, &configName, kvs)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(restart, false)

	// Test-2 : setConfig() returns error, handle properly
	minioSetConfigKVMock = func(_ string) (restart bool, err error) {
		return false, errors.New("error")
	}
	restart, err = setConfig(ctx, adminClient, &configName, kvs)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
	assert.Equal(restart, false)

	// Test-4 : setConfig() set config, need restart
	minioSetConfigKVMock = func(_ string) (restart bool, err error) {
		return true, nil
	}
	restart, err = setConfig(ctx, adminClient, &configName, kvs)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(restart, true)
}

func TestDelConfig(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	function := "resetConfig()"
	// mock function response from setConfig()
	minioDelConfigKVMock = func(_ string) (err error) {
		return nil
	}
	configName := "region"

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1 : resetConfig() resets a config with the config name
	err := resetConfig(ctx, adminClient, &configName)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 : resetConfig() returns error, handle properly
	minioDelConfigKVMock = func(_ string) (err error) {
		return errors.New("error")
	}

	err = resetConfig(ctx, adminClient, &configName)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func Test_buildConfig(t *testing.T) {
	type args struct {
		configName *string
		kvs        []*models.ConfigurationKV
	}
	tests := []struct {
		name string
		args args
		want *string
	}{
		// Test-1: buildConfig() format correctly configuration as "config_name k=v k2=v2"
		{
			name: "format correctly",
			args: args{
				configName: swag.String("notify_postgres"),
				kvs: []*models.ConfigurationKV{
					{
						Key:   "enable",
						Value: "off",
					},
					{
						Key:   "connection_string",
						Value: "",
					},
				},
			},
			want: swag.String("notify_postgres enable=\"off\" connection_string=\"\""),
		},
		// Test-2: buildConfig() format correctly configuration as "config_name k=v k2=v2 k2=v3" with duplicate keys
		{
			name: "duplicated keys in config",
			args: args{
				configName: swag.String("notify_postgres"),
				kvs: []*models.ConfigurationKV{
					{
						Key:   "enable",
						Value: "off",
					},
					{
						Key:   "connection_string",
						Value: "",
					},
					{
						Key:   "connection_string",
						Value: "x",
					},
				},
			},
			want: swag.String("notify_postgres enable=\"off\" connection_string=\"\" connection_string=\"x\""),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if got := buildConfig(tt.args.configName, tt.args.kvs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("buildConfig() = %s, want %s", *got, *tt.want)
			}
		})
	}
}

func Test_setConfigWithARN(t *testing.T) {
	assert := assert.New(t)
	client := AdminClientMock{}

	type args struct {
		ctx        context.Context
		client     MinioAdmin
		configName *string
		kvs        []*models.ConfigurationKV
		arn        string
	}
	tests := []struct {
		name          string
		args          args
		mockSetConfig func(kv string) (restart bool, err error)
		wantErr       bool
		expected      bool
	}{
		{
			name: "Set valid config with arn",
			args: args{
				ctx:        context.Background(),
				client:     client,
				configName: swag.String("notify_kafka"),
				kvs: []*models.ConfigurationKV{
					{
						Key:   "brokers",
						Value: "http://localhost:8080/broker1,http://localhost:8080/broker2",
					},
				},
				arn: "1",
			},
			mockSetConfig: func(_ string) (restart bool, err error) {
				return false, nil
			},
			wantErr:  false,
			expected: false,
		},
		{
			name: "Set valid config, expect restart",
			args: args{
				ctx:        context.Background(),
				client:     client,
				configName: swag.String("notify_kafka"),
				kvs: []*models.ConfigurationKV{
					{
						Key:   "brokers",
						Value: "http://localhost:8080/broker1,http://localhost:8080/broker2",
					},
				},
				arn: "1",
			},
			mockSetConfig: func(_ string) (restart bool, err error) {
				return true, nil
			},
			wantErr:  false,
			expected: true,
		},
		{
			name: "Set valid config without arn",
			args: args{
				ctx:        context.Background(),
				client:     client,
				configName: swag.String("region"),
				kvs: []*models.ConfigurationKV{
					{
						Key:   "name",
						Value: "us-west-1",
					},
				},
				arn: "",
			},
			mockSetConfig: func(_ string) (restart bool, err error) {
				return false, nil
			},
			wantErr:  false,
			expected: false,
		},
		{
			name: "Setting an incorrect config",
			args: args{
				ctx:        context.Background(),
				client:     client,
				configName: swag.String("oorgle"),
				kvs: []*models.ConfigurationKV{
					{
						Key:   "name",
						Value: "us-west-1",
					},
				},
				arn: "",
			},
			mockSetConfig: func(_ string) (restart bool, err error) {
				return false, errors.New("error")
			},
			wantErr:  true,
			expected: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			// mock function response from setConfig()
			minioSetConfigKVMock = tt.mockSetConfig
			restart, err := setConfigWithARNAccountID(tt.args.ctx, tt.args.client, tt.args.configName, tt.args.kvs, tt.args.arn)
			if (err != nil) != tt.wantErr {
				t.Errorf("setConfigWithARNAccountID() error = %v, wantErr %v", err, tt.wantErr)
			}
			assert.Equal(restart, tt.expected)
		})
	}
}

func Test_getConfig(t *testing.T) {
	client := AdminClientMock{}
	type args struct {
		client MinioAdmin
		name   string
	}
	tests := []struct {
		name    string
		args    args
		mock    func()
		want    []*models.Configuration
		wantErr bool
	}{
		{
			name: "get config",
			args: args{
				client: client,
				name:   "notify_postgres",
			},
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(_ string) ([]byte, error) {
					return []byte(`notify_postgres:_ connection_string="host=localhost dbname=minio_events user=postgres password=password port=5432 sslmode=disable" table=bucketevents`), nil
				}

				configListMock := []madmin.HelpKV{
					{
						Key:         PostgresConnectionString,
						Description: `Postgres server connection-string e.g. "host=localhost port=5432 dbname=minio_events user=postgres password=password sslmode=disable"`,
						Type:        "string",
					},
					{
						Key:         PostgresTable,
						Description: "DB table name to store/update events, table is auto-created",
						Type:        "string",
					},
					{
						Key:         PostgresFormat,
						Description: "desc",
						Type:        "namespace*|access",
					},
					{
						Key:         PostgresQueueDir,
						Description: "des",
						Optional:    true,
						Type:        "path",
					},
					{
						Key:         PostgresQueueLimit,
						Description: "desc",
						Optional:    true,
						Type:        "number",
					},
					{
						Key:         madmin.CommentKey,
						Description: "",
						Optional:    true,
						Type:        "sentence",
					},
				}
				mockConfigList := madmin.Help{
					SubSys:          NotifyPostgresSubSys,
					Description:     "publish bucket notifications to Postgres databases",
					MultipleTargets: true,
					KeysHelp:        configListMock,
				}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
					return mockConfigList, nil
				}
			},
			want: []*models.Configuration{
				{
					KeyValues: []*models.ConfigurationKV{
						{
							Key:   PostgresConnectionString,
							Value: "host=localhost dbname=minio_events user=postgres password=password port=5432 sslmode=disable",
						},
						{
							Key:   PostgresTable,
							Value: "bucketevents",
						},
					}, Name: "notify_postgres",
				},
			},
			wantErr: false,
		},
		{
			name: "valid config, but server returned empty",
			args: args{
				client: client,
				name:   NotifyPostgresSubSys,
			},
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(_ string) ([]byte, error) {
					return []byte(`notify_postgres:_`), nil
				}

				configListMock := []madmin.HelpKV{
					{
						Key:         PostgresConnectionString,
						Description: `Postgres server connection-string e.g. "host=localhost port=5432 dbname=minio_events user=postgres password=password sslmode=disable"`,
						Type:        "string",
					},
					{
						Key:         PostgresTable,
						Description: "DB table name to store/update events, table is auto-created",
						Type:        "string",
					},
					{
						Key:         PostgresFormat,
						Description: "desc",
						Type:        "namespace*|access",
					},
					{
						Key:         PostgresQueueDir,
						Description: "des",
						Optional:    true,
						Type:        "path",
					},
					{
						Key:         PostgresQueueLimit,
						Description: "desc",
						Optional:    true,
						Type:        "number",
					},
					{
						Key:         madmin.CommentKey,
						Description: "optionally add a comment to this setting",
						Optional:    true,
						Type:        "sentence",
					},
				}
				mockConfigList := madmin.Help{
					SubSys:          NotifyPostgresSubSys,
					Description:     "publish bucket notifications to Postgres databases",
					MultipleTargets: true,
					KeysHelp:        configListMock,
				}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
					return mockConfigList, nil
				}
			},
			want:    nil,
			wantErr: false,
		},
		{
			name: "random bytes coming out of getConfigKv",
			args: args{
				client: client,
				name:   "notify_postgres",
			},
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(_ string) ([]byte, error) {
					x := make(map[string]string)
					x["x"] = "x"
					j, _ := json.Marshal(x)
					return j, nil
				}

				configListMock := []madmin.HelpKV{
					{
						Key:         PostgresConnectionString,
						Description: `Postgres server connection-string e.g. "host=localhost port=5432 dbname=minio_events user=postgres password=password sslmode=disable"`,
						Type:        "string",
					},
					{
						Key:         PostgresTable,
						Description: "DB table name to store/update events, table is auto-created",
						Type:        "string",
					},
					{
						Key:         PostgresFormat,
						Description: "desc",
						Type:        "namespace*|access",
					},
					{
						Key:         PostgresQueueDir,
						Description: "des",
						Optional:    true,
						Type:        "path",
					},
					{
						Key:         PostgresQueueLimit,
						Description: "desc",
						Optional:    true,
						Type:        "number",
					},
					{
						Key:         madmin.CommentKey,
						Description: "optionally add a comment to this setting",
						Optional:    true,
						Type:        "sentence",
					},
				}
				mockConfigList := madmin.Help{
					SubSys:          NotifyPostgresSubSys,
					Description:     "publish bucket notifications to Postgres databases",
					MultipleTargets: true,
					KeysHelp:        configListMock,
				}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
					return mockConfigList, nil
				}
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "bad config",
			args: args{
				client: client,
				name:   "notify_postgresx",
			},
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(_ string) ([]byte, error) {
					return nil, errors.New("invalid config")
				}

				mockConfigList := madmin.Help{}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
					return mockConfigList, nil
				}
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "no help",
			args: args{
				client: client,
				name:   "notify_postgresx",
			},
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(_ string) ([]byte, error) {
					return nil, errors.New("invalid config")
				}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(_, _ string, _ bool) (madmin.Help, error) {
					return madmin.Help{}, errors.New("no help")
				}
			},
			want:    nil,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		tt.mock()
		t.Run(tt.name, func(_ *testing.T) {
			got, err := getConfig(context.Background(), tt.args.client, tt.args.name)
			if (err != nil) != tt.wantErr {
				t.Errorf("getConfig() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getConfig() got = %v, want %v", got, tt.want)
			}
		})
	}
}

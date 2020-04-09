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
	"fmt"
	"reflect"
	"testing"

	"github.com/go-openapi/swag"

	"github.com/minio/mcs/models"
	"github.com/minio/minio/pkg/madmin"

	"errors"

	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioHelpConfigKVMock func(subSys, key string, envOnly bool) (madmin.Help, error)
var minioGetConfigKVMock func(key string) (madmin.Targets, error)
var minioSetConfigKVMock func(kv string) error

// mock function helpConfigKV()
func (ac adminClientMock) helpConfigKV(ctx context.Context, subSys, key string, envOnly bool) (madmin.Help, error) {
	return minioHelpConfigKVMock(subSys, key, envOnly)
}

// mock function getConfigKV()
func (ac adminClientMock) getConfigKV(ctx context.Context, name string) (madmin.Targets, error) {
	return minioGetConfigKVMock(name)
}

// mock function setConfigKV()
func (ac adminClientMock) setConfigKV(ctx context.Context, kv string) error {
	return minioSetConfigKVMock(kv)
}

func TestListConfig(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	function := "listConfig()"
	// Test-1 : listConfig() get list of two configurations and ensure is output correctly
	configListMock := []madmin.HelpKV{
		madmin.HelpKV{
			Key:         "region",
			Description: "label the location of the server",
		},
		madmin.HelpKV{
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
	minioHelpConfigKVMock = func(subSys, key string, envOnly bool) (madmin.Help, error) {
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
	minioHelpConfigKVMock = func(subSys, key string, envOnly bool) (madmin.Help, error) {
		return madmin.Help{}, errors.New("error")
	}
	_, err = listConfig(adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestGetConfigInfo(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	function := "getConfig()"
	// Test-1 : getConfig() get info of postgres configuration, has 3 key-value pairs
	configMock := []madmin.Target{
		madmin.Target{
			SubSystem: "notify_postgres",
			KVS: []madmin.KV{
				madmin.KV{
					Key:   "enable",
					Value: "off",
				},
				madmin.KV{
					Key:   "format",
					Value: "namespace",
				},
				madmin.KV{
					Key:   "connection",
					Value: "",
				},
			},
		},
	}
	expectedKV := configMock[0].KVS
	// mock function response from getConfig()
	minioGetConfigKVMock = func(key string) (madmin.Targets, error) {
		return configMock, nil
	}
	configNameToGet := "notify_postgres"
	configInfo, err := getConfig(adminClient, configNameToGet)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of keys is correct
	assert.Equal(len(expectedKV), len(configInfo), fmt.Sprintf("Failed on %s: length of Configs's lists is not the same", function))
	// verify KeysHelp content
	for i, kv := range configInfo {
		assert.Equal(expectedKV[i].Key, kv.Key)
		assert.Equal(expectedKV[i].Value, kv.Value)
	}

	// Test-2 : getConfig() Return error and see that the error is handled correctly and returned
	minioGetConfigKVMock = func(key string) (madmin.Targets, error) {
		return madmin.Targets{}, errors.New("error")
	}
	_, err = getConfig(adminClient, configNameToGet)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-3 : getConfig() get info but Response has empty results (possible)
	configMock = []madmin.Target{}
	// mock function response from getConfig()
	minioGetConfigKVMock = func(key string) (madmin.Targets, error) {
		return configMock, nil
	}
	configNameToGet = "notify_postgres"
	_, err = getConfig(adminClient, configNameToGet)
	if assert.Error(err) {
		assert.Equal("error getting config: empty info", err.Error())
	}
}

func TestSetConfig(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	function := "setConfig()"
	// mock function response from setConfig()
	minioSetConfigKVMock = func(kv string) error {
		return nil
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

	ctx := context.Background()
	// Test-1 : setConfig() sets a config with two key value pairs
	err := setConfig(ctx, adminClient, &configName, kvs)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 : setConfig() returns error, handle properly
	minioSetConfigKVMock = func(kv string) error {
		return errors.New("error")
	}
	if err := setConfig(ctx, adminClient, &configName, kvs); assert.Error(err) {
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
			want: swag.String("notify_postgres enable=off connection_string="),
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
			want: swag.String("notify_postgres enable=off connection_string= connection_string=x"),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := buildConfig(tt.args.configName, tt.args.kvs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("buildConfig() = %s, want %s", *got, *tt.want)
			}
		})
	}
}

func Test_setConfigWithARN(t *testing.T) {
	client := adminClientMock{}

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
		mockSetConfig func(kv string) error
		wantErr       bool
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
			mockSetConfig: func(kv string) error {
				return nil
			},
			wantErr: false,
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
			mockSetConfig: func(kv string) error {
				return nil
			},
			wantErr: false,
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
			mockSetConfig: func(kv string) error {
				return errors.New("error")
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// mock function response from setConfig()
			minioSetConfigKVMock = tt.mockSetConfig
			if err := setConfigWithARNAccountID(tt.args.ctx, tt.args.client, tt.args.configName, tt.args.kvs, tt.args.arn); (err != nil) != tt.wantErr {
				t.Errorf("setConfigWithARNAccountID() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

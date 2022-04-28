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

package restapi

import (
	"context"
	"fmt"
	"strings"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	madmin "github.com/minio/madmin-go"

	cfgApi "github.com/minio/console/restapi/operations/configuration"
)

func registerConfigHandlers(api *operations.ConsoleAPI) {
	// List Configurations
	api.ConfigurationListConfigHandler = cfgApi.ListConfigHandlerFunc(func(params cfgApi.ListConfigParams, session *models.Principal) middleware.Responder {
		configListResp, err := getListConfigResponse(session)
		if err != nil {
			return cfgApi.NewListConfigDefault(int(err.Code)).WithPayload(err)
		}
		return cfgApi.NewListConfigOK().WithPayload(configListResp)
	})
	// Configuration Info
	api.ConfigurationConfigInfoHandler = cfgApi.ConfigInfoHandlerFunc(func(params cfgApi.ConfigInfoParams, session *models.Principal) middleware.Responder {
		config, err := getConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewConfigInfoDefault(int(err.Code)).WithPayload(err)
		}
		return cfgApi.NewConfigInfoOK().WithPayload(config)
	})
	// Set Configuration
	api.ConfigurationSetConfigHandler = cfgApi.SetConfigHandlerFunc(func(params cfgApi.SetConfigParams, session *models.Principal) middleware.Responder {
		resp, err := setConfigResponse(session, params.Name, params.Body)
		if err != nil {
			return cfgApi.NewSetConfigDefault(int(err.Code)).WithPayload(err)
		}
		return cfgApi.NewSetConfigOK().WithPayload(resp)
	})
	// Reset Configuration
	api.ConfigurationResetConfigHandler = cfgApi.ResetConfigHandlerFunc(func(params cfgApi.ResetConfigParams, session *models.Principal) middleware.Responder {
		resp, err := resetConfigResponse(session, params.Name)
		if err != nil {
			return cfgApi.NewResetConfigDefault(int(err.Code)).WithPayload(err)
		}
		return cfgApi.NewResetConfigOK().WithPayload(resp)
	})

}

// listConfig gets all configurations' names and their descriptions
func listConfig(client MinioAdmin) ([]*models.ConfigDescription, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	configKeysHelp, err := client.helpConfigKV(ctx, "", "", false)
	if err != nil {
		return nil, err
	}
	var configDescs []*models.ConfigDescription
	for _, c := range configKeysHelp.KeysHelp {
		desc := &models.ConfigDescription{
			Key:         c.Key,
			Description: c.Description,
		}
		configDescs = append(configDescs, desc)
	}
	return configDescs, nil
}

// getListConfigResponse performs listConfig() and serializes it to the handler's output
func getListConfigResponse(session *models.Principal) (*models.ListConfigResponse, *models.Error) {
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	configDescs, err := listConfig(adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	listGroupsResponse := &models.ListConfigResponse{
		Configurations: configDescs,
		Total:          int64(len(configDescs)),
	}
	return listGroupsResponse, nil
}

// getConfig gets the key values for a defined configuration
func getConfig(ctx context.Context, client MinioAdmin, name string) ([]*models.ConfigurationKV, error) {
	configKeysHelp, err := client.helpConfigKV(ctx, name, "", false)
	if err != nil {
		return nil, err
	}
	configBytes, err := client.getConfigKV(ctx, name)
	if err != nil {
		return nil, err
	}

	target, err := madmin.ParseSubSysTarget(configBytes, configKeysHelp)
	if err != nil {
		return nil, err
	}
	if len(target.KVS) > 0 {
		// return Key Values, first element contains info
		var confkv []*models.ConfigurationKV
		for _, kv := range target.KVS {
			confkv = append(confkv, &models.ConfigurationKV{Key: kv.Key, Value: kv.Value})
		}
		return confkv, nil
	}
	return nil, fmt.Errorf("error retrieving configuration for: %s", name)
}

// getConfigResponse performs getConfig() and serializes it to the handler's output
func getConfigResponse(session *models.Principal, params cfgApi.ConfigInfoParams) (*models.Configuration, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	configkv, err := getConfig(ctx, adminClient, params.Name)
	if err != nil {
		return nil, prepareError(err)
	}
	configurationObj := &models.Configuration{
		Name:      params.Name,
		KeyValues: configkv,
	}
	return configurationObj, nil
}

// setConfig sets a configuration with the defined key values
func setConfig(ctx context.Context, client MinioAdmin, configName *string, kvs []*models.ConfigurationKV) (restart bool, err error) {
	config := buildConfig(configName, kvs)
	restart, err = client.setConfigKV(ctx, *config)
	if err != nil {
		return false, err
	}
	return restart, nil
}

func setConfigWithARNAccountID(ctx context.Context, client MinioAdmin, configName *string, kvs []*models.ConfigurationKV, arnAccountID string) (restart bool, err error) {
	// if arnAccountID is not empty the configuration will be treated as a notification target
	// arnAccountID will be used as an identifier for that specific target
	// docs: https://docs.min.io/docs/minio-bucket-notification-guide.html
	if arnAccountID != "" {
		configName = swag.String(fmt.Sprintf("%s:%s", *configName, arnAccountID))
	}
	return setConfig(ctx, client, configName, kvs)
}

// buildConfig builds a concatenated string including name and keyvalues
// e.g. `region name=us-west-1`
func buildConfig(configName *string, kvs []*models.ConfigurationKV) *string {
	configElements := []string{*configName}
	for _, kv := range kvs {
		key := kv.Key
		val := fmt.Sprintf("\"%s\"", kv.Value)
		if key != "" {
			configElements = append(configElements, fmt.Sprintf("%s=%s", key, val))
		}
	}
	config := strings.Join(configElements, " ")
	return &config
}

// setConfigResponse implements setConfig() to be used by handler
func setConfigResponse(session *models.Principal, name string, configRequest *models.SetConfigRequest) (*models.SetConfigResponse, *models.Error) {
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	configName := name

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	needsRestart, err := setConfigWithARNAccountID(ctx, adminClient, &configName, configRequest.KeyValues, configRequest.ArnResourceID)
	if err != nil {
		return nil, prepareError(err)
	}
	return &models.SetConfigResponse{Restart: needsRestart}, nil
}

func resetConfig(ctx context.Context, client MinioAdmin, configName *string) (err error) {
	err = client.delConfigKV(ctx, *configName)
	return err
}

// resetConfigResponse implements resetConfig() to be used by handler
func resetConfigResponse(session *models.Principal, configName string) (*models.SetConfigResponse, *models.Error) {
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err = resetConfig(ctx, adminClient, &configName)

	if err != nil {
		return nil, prepareError(err)
	}

	return &models.SetConfigResponse{Restart: true}, nil
}

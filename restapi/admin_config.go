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

	"github.com/minio/console/restapi/operations/admin_api"
)

func registerConfigHandlers(api *operations.ConsoleAPI) {
	// List Configurations
	api.AdminAPIListConfigHandler = admin_api.ListConfigHandlerFunc(func(params admin_api.ListConfigParams, session *models.Principal) middleware.Responder {
		configListResp, err := getListConfigResponse(session)
		if err != nil {
			return admin_api.NewListConfigDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListConfigOK().WithPayload(configListResp)
	})
	// Configuration Info
	api.AdminAPIConfigInfoHandler = admin_api.ConfigInfoHandlerFunc(func(params admin_api.ConfigInfoParams, session *models.Principal) middleware.Responder {
		config, err := getConfigResponse(session, params)
		if err != nil {
			return admin_api.NewConfigInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewConfigInfoOK().WithPayload(config)
	})
	// Set Configuration
	api.AdminAPISetConfigHandler = admin_api.SetConfigHandlerFunc(func(params admin_api.SetConfigParams, session *models.Principal) middleware.Responder {
		resp, err := setConfigResponse(session, params.Name, params.Body)
		if err != nil {
			return admin_api.NewSetConfigDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSetConfigOK().WithPayload(resp)
	})
}

// listConfig gets all configurations' names and their descriptions
func listConfig(client MinioAdmin) ([]*models.ConfigDescription, error) {
	ctx := context.Background()
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
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

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
func getConfigResponse(session *models.Principal, params admin_api.ConfigInfoParams) (*models.Configuration, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

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
		configElements = append(configElements, fmt.Sprintf("%s=%s", kv.Key, kv.Value))
	}
	config := strings.Join(configElements, " ")
	return &config
}

// setConfigResponse implements setConfig() to be used by handler
func setConfigResponse(session *models.Principal, name string, configRequest *models.SetConfigRequest) (*models.SetConfigResponse, *models.Error) {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	configName := name

	ctx := context.Background()

	needsRestart, err := setConfigWithARNAccountID(ctx, adminClient, &configName, configRequest.KeyValues, configRequest.ArnResourceID)
	if err != nil {
		return nil, prepareError(err)
	}
	return &models.SetConfigResponse{Restart: needsRestart}, nil
}

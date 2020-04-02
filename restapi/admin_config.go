// This file is part of MinIO Kubernetes Cloud
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
	"log"
	"strings"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/m3/mcs/models"
	"github.com/minio/m3/mcs/restapi/operations"

	"github.com/minio/m3/mcs/restapi/operations/admin_api"
)

func registerConfigHandlers(api *operations.McsAPI) {
	// List Configurations
	api.AdminAPIListConfigHandler = admin_api.ListConfigHandlerFunc(func(params admin_api.ListConfigParams, principal interface{}) middleware.Responder {
		configListResp, err := getListConfigResponse()
		if err != nil {
			return admin_api.NewListConfigDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListConfigOK().WithPayload(configListResp)
	})
	// Configuration Info
	api.AdminAPIConfigInfoHandler = admin_api.ConfigInfoHandlerFunc(func(params admin_api.ConfigInfoParams, principal interface{}) middleware.Responder {
		config, err := getConfigResponse(params)
		if err != nil {
			return admin_api.NewConfigInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewConfigInfoOK().WithPayload(config)
	})
	// Set Configuration
	api.AdminAPISetConfigHandler = admin_api.SetConfigHandlerFunc(func(params admin_api.SetConfigParams, principal interface{}) middleware.Responder {
		if err := setConfigResponse(params.Name, params.Body); err != nil {
			return admin_api.NewSetConfigDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewSetConfigNoContent()
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
func getListConfigResponse() (*models.ListConfigResponse, error) {
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	configDescs, err := listConfig(adminClient)
	if err != nil {
		log.Println("error listing configurations:", err)
		return nil, err
	}
	listGroupsResponse := &models.ListConfigResponse{
		Configurations: configDescs,
		Total:          int64(len(configDescs)),
	}
	return listGroupsResponse, nil
}

// getConfig gets the key values for a defined configuration
func getConfig(client MinioAdmin, name string) ([]*models.ConfigurationKV, error) {
	ctx := context.Background()
	configTarget, err := client.getConfigKV(ctx, name)
	if err != nil {
		return nil, err
	}
	// configTarget comes as an array []madmin.Target
	if len(configTarget) > 0 {
		// return Key Values, first element contains info
		var confkv []*models.ConfigurationKV
		for _, kv := range configTarget[0].KVS {
			confkv = append(confkv, &models.ConfigurationKV{Key: kv.Key, Value: kv.Value})
		}
		return confkv, nil
	}

	return nil, errors.New(500, "error getting config: empty info")
}

// getConfigResponse performs getConfig() and serializes it to the handler's output
func getConfigResponse(params admin_api.ConfigInfoParams) (*models.Configuration, error) {
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	configkv, err := getConfig(adminClient, params.Name)
	if err != nil {
		log.Println("error listing configurations:", err)
		return nil, err
	}
	configurationObj := &models.Configuration{
		Name:      params.Name,
		KeyValues: configkv,
	}
	return configurationObj, nil
}

// setConfig sets a configuration with the defined key values
func setConfig(client MinioAdmin, name *string, kvs []*models.ConfigurationKV, arnResourceID string) error {
	config := buildConfig(name, kvs, arnResourceID)
	ctx := context.Background()
	if err := client.setConfigKV(ctx, *config); err != nil {
		return err
	}
	return nil
}

// buildConfig builds a concatenated string including name and keyvalues
// e.g. `region name=us-west-1`
func buildConfig(name *string, kvs []*models.ConfigurationKV, arnResourceID string) *string {
	// if arnResourceID is not empty the configuration will be treated as a notification target
	// arnResourceID will be used as an identifier for that specific target
	// docs: https://docs.min.io/docs/minio-bucket-notification-guide.html
	configName := *name
	if arnResourceID != "" {
		configName += ":" + arnResourceID
	}
	configElements := []string{configName}
	for _, kv := range kvs {
		configElements = append(configElements, kv.Key+"="+kv.Value)
	}
	config := strings.Join(configElements, " ")
	return &config
}

// setConfigResponse implements setConfig() to be used by handler
func setConfigResponse(name string, configRequest *models.SetConfigRequest) error {
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return err
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	if err := setConfig(adminClient, swag.String(name), configRequest.KeyValues, configRequest.ArnResourceID); err != nil {
		log.Println("error listing configurations:", err)
		return err
	}
	return nil
}

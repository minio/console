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
	"encoding/base64"
	"fmt"
	"strings"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/models"
	madmin "github.com/minio/madmin-go/v3"

	cfgApi "github.com/minio/console/api/operations/configuration"
)

func registerConfigHandlers(api *operations.ConsoleAPI) {
	// List Configurations
	api.ConfigurationListConfigHandler = cfgApi.ListConfigHandlerFunc(func(params cfgApi.ListConfigParams, session *models.Principal) middleware.Responder {
		configListResp, err := getListConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewListConfigDefault(err.Code).WithPayload(err.APIError)
		}
		return cfgApi.NewListConfigOK().WithPayload(configListResp)
	})
	// Configuration Info
	api.ConfigurationConfigInfoHandler = cfgApi.ConfigInfoHandlerFunc(func(params cfgApi.ConfigInfoParams, session *models.Principal) middleware.Responder {
		config, err := getConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewConfigInfoDefault(err.Code).WithPayload(err.APIError)
		}
		return cfgApi.NewConfigInfoOK().WithPayload(config)
	})
	// Set Configuration
	api.ConfigurationSetConfigHandler = cfgApi.SetConfigHandlerFunc(func(params cfgApi.SetConfigParams, session *models.Principal) middleware.Responder {
		resp, err := setConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewSetConfigDefault(err.Code).WithPayload(err.APIError)
		}
		return cfgApi.NewSetConfigOK().WithPayload(resp)
	})
	// Reset Configuration
	api.ConfigurationResetConfigHandler = cfgApi.ResetConfigHandlerFunc(func(params cfgApi.ResetConfigParams, session *models.Principal) middleware.Responder {
		resp, err := resetConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewResetConfigDefault(err.Code).WithPayload(err.APIError)
		}
		return cfgApi.NewResetConfigOK().WithPayload(resp)
	})
	// Export Configuration as base64 string.
	api.ConfigurationExportConfigHandler = cfgApi.ExportConfigHandlerFunc(func(params cfgApi.ExportConfigParams, session *models.Principal) middleware.Responder {
		resp, err := exportConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewExportConfigDefault(err.Code).WithPayload(err.APIError)
		}
		return cfgApi.NewExportConfigOK().WithPayload(resp)
	})
	api.ConfigurationPostConfigsImportHandler = cfgApi.PostConfigsImportHandlerFunc(func(params cfgApi.PostConfigsImportParams, session *models.Principal) middleware.Responder {
		_, err := importConfigResponse(session, params)
		if err != nil {
			return cfgApi.NewPostConfigsImportDefault(err.Code).WithPayload(err.APIError)
		}
		return cfgApi.NewPostConfigsImportDefault(200)
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
func getListConfigResponse(session *models.Principal, params cfgApi.ListConfigParams) (*models.ListConfigResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	configDescs, err := listConfig(adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	listGroupsResponse := &models.ListConfigResponse{
		Configurations: configDescs,
		Total:          int64(len(configDescs)),
	}
	return listGroupsResponse, nil
}

// getConfig gets the key values for a defined configuration.
func getConfig(ctx context.Context, client MinioAdmin, name string) ([]*models.Configuration, error) {
	configBytes, err := client.getConfigKV(ctx, name)
	if err != nil {
		return nil, err
	}
	subSysConfigs, err := madmin.ParseServerConfigOutput(string(configBytes))
	if err != nil {
		return nil, err
	}
	var configSubSysList []*models.Configuration
	for _, scfg := range subSysConfigs {
		if !madmin.SubSystems.Contains(scfg.SubSystem) {
			return nil, fmt.Errorf("no sub-systems found")
		}
		var confkv []*models.ConfigurationKV
		for _, kv := range scfg.KV {
			var envOverride *models.EnvOverride

			if kv.EnvOverride != nil {
				envOverride = &models.EnvOverride{
					Name:  kv.EnvOverride.Name,
					Value: kv.EnvOverride.Value,
				}
			}

			confkv = append(confkv, &models.ConfigurationKV{Key: kv.Key, Value: kv.Value, EnvOverride: envOverride})
		}
		if len(confkv) == 0 {
			continue
		}
		var fullConfigName string
		if scfg.Target == "" {
			fullConfigName = scfg.SubSystem
		} else {
			fullConfigName = scfg.SubSystem + ":" + scfg.Target
		}
		configSubSysList = append(configSubSysList, &models.Configuration{KeyValues: confkv, Name: fullConfigName})
	}
	return configSubSysList, nil
}

// getConfigResponse performs getConfig() and serializes it to the handler's output
func getConfigResponse(session *models.Principal, params cfgApi.ConfigInfoParams) ([]*models.Configuration, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	configurations, err := getConfig(ctx, adminClient, params.Name)
	if err != nil {
		errorVal := ErrorWithContext(ctx, err)
		minioError := madmin.ToErrorResponse(err)
		if minioError.Code == "XMinioConfigError" {
			errorVal.Code = 404
		}
		return nil, errorVal
	}
	return configurations, nil
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
	// docs: https://min.io/docs/minio/linux/administration/monitoring/bucket-notifications.html
	if arnAccountID != "" {
		configName = swag.String(fmt.Sprintf("%s:%s", *configName, arnAccountID))
	}
	return setConfig(ctx, client, configName, kvs)
}

// buildConfig builds a concatenated string including name and keyvalues
// e.g. `region name=us-west-1`
func buildConfig(configName *string, kvs []*models.ConfigurationKV) *string {
	var builder strings.Builder
	builder.WriteString(*configName)
	for _, kv := range kvs {
		key := strings.TrimSpace(kv.Key)
		if key == "" {
			continue
		}
		builder.WriteString(" ")
		builder.WriteString(key)
		builder.WriteString("=")
		// All newlines must be converted to ','
		builder.WriteString(strings.ReplaceAll(strings.TrimSpace(fmt.Sprintf("\"%s\"", kv.Value)), "\n", ","))
	}
	config := builder.String()
	return &config
}

// setConfigResponse implements setConfig() to be used by handler
func setConfigResponse(session *models.Principal, params cfgApi.SetConfigParams) (*models.SetConfigResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	configName := params.Name

	needsRestart, err := setConfigWithARNAccountID(ctx, adminClient, &configName, params.Body.KeyValues, params.Body.ArnResourceID)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.SetConfigResponse{Restart: needsRestart}, nil
}

func resetConfig(ctx context.Context, client MinioAdmin, configName *string) (err error) {
	err = client.delConfigKV(ctx, *configName)
	return err
}

// resetConfigResponse implements resetConfig() to be used by handler
func resetConfigResponse(session *models.Principal, params cfgApi.ResetConfigParams) (*models.SetConfigResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	err = resetConfig(ctx, adminClient, &params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return &models.SetConfigResponse{Restart: true}, nil
}

func exportConfigResponse(session *models.Principal, params cfgApi.ExportConfigParams) (*models.ConfigExportResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	configRes, err := mAdmin.GetConfig(ctx)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// may contain sensitive information so unpack only when required.
	return &models.ConfigExportResponse{
		Status: "success",
		Value:  base64.StdEncoding.EncodeToString(configRes),
	}, nil
}

func importConfigResponse(session *models.Principal, params cfgApi.PostConfigsImportParams) (*cfgApi.PostConfigsImportDefault, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	file, _, err := params.HTTPRequest.FormFile("file")
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	defer file.Close()

	err = mAdmin.SetConfig(ctx, file)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &cfgApi.PostConfigsImportDefault{}, nil
}

// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
//

package restapi

import (
	"context"
	"fmt"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/idp"
	madmin "github.com/minio/madmin-go/v2"
)

var errInvalidIDPType = fmt.Errorf("IDP type must be one of %v", madmin.ValidIDPConfigTypes)

func registerIDPHandlers(api *operations.ConsoleAPI) {
	api.IdpCreateConfigurationHandler = idp.CreateConfigurationHandlerFunc(func(params idp.CreateConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := createIDPConfigurationResponse(session, params)
		if err != nil {
			return idp.NewCreateConfigurationDefault(int(err.Code)).WithPayload(err)
		}
		return idp.NewCreateConfigurationCreated().WithPayload(response)
	})
	api.IdpUpdateConfigurationHandler = idp.UpdateConfigurationHandlerFunc(func(params idp.UpdateConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := updateIDPConfigurationResponse(session, params)
		if err != nil {
			return idp.NewUpdateConfigurationDefault(int(err.Code)).WithPayload(err)
		}
		return idp.NewUpdateConfigurationOK().WithPayload(response)
	})
	api.IdpListConfigurationsHandler = idp.ListConfigurationsHandlerFunc(func(params idp.ListConfigurationsParams, session *models.Principal) middleware.Responder {
		response, err := listIDPConfigurationsResponse(session, params)
		if err != nil {
			return idp.NewListConfigurationsDefault(int(err.Code)).WithPayload(err)
		}
		return idp.NewListConfigurationsOK().WithPayload(response)
	})
	api.IdpDeleteConfigurationHandler = idp.DeleteConfigurationHandlerFunc(func(params idp.DeleteConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := deleteIDPConfigurationResponse(session, params)
		if err != nil {
			return idp.NewDeleteConfigurationDefault(int(err.Code)).WithPayload(err)
		}
		return idp.NewDeleteConfigurationOK().WithPayload(response)
	})
	api.IdpGetConfigurationHandler = idp.GetConfigurationHandlerFunc(func(params idp.GetConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := getIDPConfigurationsResponse(session, params)
		if err != nil {
			return idp.NewGetConfigurationDefault(int(err.Code)).WithPayload(err)
		}
		return idp.NewGetConfigurationOK().WithPayload(response)
	})
}

func createIDPConfigurationResponse(session *models.Principal, params idp.CreateConfigurationParams) (*models.SetIDPResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	restart, err := createOrUpdateIDPConfig(ctx, params.Type, params.Body.Name, params.Body.Input, false, AdminClient{Client: mAdmin})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.SetIDPResponse{Restart: restart}, nil
}

func updateIDPConfigurationResponse(session *models.Principal, params idp.UpdateConfigurationParams) (*models.SetIDPResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	restart, err := createOrUpdateIDPConfig(ctx, params.Type, params.Name, params.Body.Input, true, AdminClient{Client: mAdmin})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.SetIDPResponse{Restart: restart}, nil
}

func createOrUpdateIDPConfig(ctx context.Context, idpType, name, input string, update bool, client MinioAdmin) (bool, error) {
	if !madmin.ValidIDPConfigTypes.Contains(idpType) {
		return false, errInvalidIDPType
	}
	restart, err := client.addOrUpdateIDPConfig(ctx, idpType, name, input, update)
	if err != nil {
		return false, err
	}
	return restart, nil
}

func listIDPConfigurationsResponse(session *models.Principal, params idp.ListConfigurationsParams) (*models.IdpListConfigurationsResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	results, err := listIDPConfigurations(ctx, params.Type, AdminClient{Client: mAdmin})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.IdpListConfigurationsResponse{Results: results}, nil
}

func listIDPConfigurations(ctx context.Context, idpType string, client MinioAdmin) ([]*models.IdpServerConfiguration, error) {
	if !madmin.ValidIDPConfigTypes.Contains(idpType) {
		return nil, errInvalidIDPType
	}
	results, err := client.listIDPConfig(ctx, idpType)
	if err != nil {
		return nil, err
	}
	return parseIDPConfigurations(results), nil
}

func parseIDPConfigurations(configs []madmin.IDPListItem) (serverConfigs []*models.IdpServerConfiguration) {
	for _, c := range configs {
		serverConfigs = append(serverConfigs, &models.IdpServerConfiguration{
			Name:    c.Name,
			Enabled: c.Enabled,
			Type:    c.Type,
		})
	}
	return serverConfigs
}

func deleteIDPConfigurationResponse(session *models.Principal, params idp.DeleteConfigurationParams) (*models.SetIDPResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	restart, err := deleteIDPConfig(ctx, params.Type, params.Name, AdminClient{Client: mAdmin})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.SetIDPResponse{Restart: restart}, nil
}

func deleteIDPConfig(ctx context.Context, idpType, name string, client MinioAdmin) (bool, error) {
	if !madmin.ValidIDPConfigTypes.Contains(idpType) {
		return false, errInvalidIDPType
	}
	restart, err := client.deleteIDPConfig(ctx, idpType, name)
	if err != nil {
		return false, err
	}
	return restart, nil
}

func getIDPConfigurationsResponse(session *models.Principal, params idp.GetConfigurationParams) (*models.IdpServerConfiguration, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	result, err := getIDPConfiguration(ctx, params.Type, params.Name, AdminClient{Client: mAdmin})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return result, nil
}

func getIDPConfiguration(ctx context.Context, idpType, name string, client MinioAdmin) (*models.IdpServerConfiguration, error) {
	if !madmin.ValidIDPConfigTypes.Contains(idpType) {
		return nil, errInvalidIDPType
	}
	config, err := client.getIDPConfig(ctx, idpType, name)
	if err != nil {
		return nil, err
	}
	return &models.IdpServerConfiguration{
		Name: config.Name,
		Type: config.Type,
		Info: parseIDPConfigurationsInfo(config.Info),
	}, nil
}

func parseIDPConfigurationsInfo(infoList []madmin.IDPCfgInfo) (results []*models.IdpServerConfigurationInfo) {
	for _, info := range infoList {
		results = append(results, &models.IdpServerConfigurationInfo{
			Key:   info.Key,
			Value: info.Value,
			IsCfg: info.IsCfg,
			IsEnv: info.IsEnv,
		})
	}
	return results
}

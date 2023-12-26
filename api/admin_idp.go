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

package api

import (
	"context"
	"fmt"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/idp"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

var errInvalidIDPType = fmt.Errorf("IDP type must be one of %v", madmin.ValidIDPConfigTypes)

func registerIDPHandlers(api *operations.ConsoleAPI) {
	api.IdpCreateConfigurationHandler = idp.CreateConfigurationHandlerFunc(func(params idp.CreateConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := createIDPConfigurationResponse(session, params)
		if err != nil {
			return idp.NewCreateConfigurationDefault(err.Code).WithPayload(err.APIError)
		}
		return idp.NewCreateConfigurationCreated().WithPayload(response)
	})
	api.IdpUpdateConfigurationHandler = idp.UpdateConfigurationHandlerFunc(func(params idp.UpdateConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := updateIDPConfigurationResponse(session, params)
		if err != nil {
			return idp.NewUpdateConfigurationDefault(err.Code).WithPayload(err.APIError)
		}
		return idp.NewUpdateConfigurationOK().WithPayload(response)
	})
	api.IdpListConfigurationsHandler = idp.ListConfigurationsHandlerFunc(func(params idp.ListConfigurationsParams, session *models.Principal) middleware.Responder {
		response, err := listIDPConfigurationsResponse(session, params)
		if err != nil {
			return idp.NewListConfigurationsDefault(err.Code).WithPayload(err.APIError)
		}
		return idp.NewListConfigurationsOK().WithPayload(response)
	})
	api.IdpDeleteConfigurationHandler = idp.DeleteConfigurationHandlerFunc(func(params idp.DeleteConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := deleteIDPConfigurationResponse(session, params)
		if err != nil {
			return idp.NewDeleteConfigurationDefault(err.Code).WithPayload(err.APIError)
		}
		return idp.NewDeleteConfigurationOK().WithPayload(response)
	})
	api.IdpGetConfigurationHandler = idp.GetConfigurationHandlerFunc(func(params idp.GetConfigurationParams, session *models.Principal) middleware.Responder {
		response, err := getIDPConfigurationsResponse(session, params)
		if err != nil {
			return idp.NewGetConfigurationDefault(err.Code).WithPayload(err.APIError)
		}
		return idp.NewGetConfigurationOK().WithPayload(response)
	})
	api.IdpGetLDAPEntitiesHandler = idp.GetLDAPEntitiesHandlerFunc(func(params idp.GetLDAPEntitiesParams, session *models.Principal) middleware.Responder {
		response, err := getLDAPEntitiesResponse(session, params)
		if err != nil {
			return idp.NewGetLDAPEntitiesDefault(err.Code).WithPayload(err.APIError)
		}
		return idp.NewGetLDAPEntitiesOK().WithPayload(response)
	})
}

func createIDPConfigurationResponse(session *models.Principal, params idp.CreateConfigurationParams) (*models.SetIDPResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	restart, err := createOrUpdateIDPConfig(ctx, params.Type, params.Body.Name, params.Body.Input, false, AdminClient{Client: mAdmin})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.SetIDPResponse{Restart: restart}, nil
}

func updateIDPConfigurationResponse(session *models.Principal, params idp.UpdateConfigurationParams) (*models.SetIDPResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
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

func listIDPConfigurationsResponse(session *models.Principal, params idp.ListConfigurationsParams) (*models.IdpListConfigurationsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
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

func deleteIDPConfigurationResponse(session *models.Principal, params idp.DeleteConfigurationParams) (*models.SetIDPResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
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

func getIDPConfigurationsResponse(session *models.Principal, params idp.GetConfigurationParams) (*models.IdpServerConfiguration, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
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

func getLDAPEntitiesResponse(session *models.Principal, params idp.GetLDAPEntitiesParams) (*models.LdapEntities, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	result, err := getEntitiesResult(ctx, AdminClient{Client: mAdmin}, params.Body.Users, params.Body.Groups, params.Body.Policies)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return result, nil
}

func getEntitiesResult(ctx context.Context, client MinioAdmin, users, groups, policies []string) (*models.LdapEntities, error) {
	entities, err := client.getLDAPPolicyEntities(ctx, madmin.PolicyEntitiesQuery{
		Users:  users,
		Groups: groups,
		Policy: policies,
	})
	if err != nil {
		return nil, err
	}

	var result models.LdapEntities

	var usersEntity []*models.LdapUserPolicyEntity
	var groupsEntity []*models.LdapGroupPolicyEntity
	var policiesEntity []*models.LdapPolicyEntity

	result.Timestamp = entities.Timestamp.Format(time.RFC3339)

	for _, userMapping := range entities.UserMappings {
		mapItem := models.LdapUserPolicyEntity{
			User:     userMapping.User,
			Policies: userMapping.Policies,
		}

		usersEntity = append(usersEntity, &mapItem)
	}

	result.Users = usersEntity

	for _, groupsMapping := range entities.GroupMappings {
		mapItem := models.LdapGroupPolicyEntity{
			Group:    groupsMapping.Group,
			Policies: groupsMapping.Policies,
		}

		groupsEntity = append(groupsEntity, &mapItem)
	}

	result.Groups = groupsEntity

	for _, policyMapping := range entities.PolicyMappings {
		mapItem := models.LdapPolicyEntity{
			Policy: policyMapping.Policy,
			Users:  policyMapping.Users,
			Groups: policyMapping.Groups,
		}

		policiesEntity = append(policiesEntity, &mapItem)
	}

	result.Policies = policiesEntity

	return &result, nil
}

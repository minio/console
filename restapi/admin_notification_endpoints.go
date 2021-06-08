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
	"errors"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerAdminNotificationEndpointsHandlers(api *operations.ConsoleAPI) {
	// return a list of notification endpoints
	api.AdminAPINotificationEndpointListHandler = admin_api.NotificationEndpointListHandlerFunc(func(params admin_api.NotificationEndpointListParams, session *models.Principal) middleware.Responder {
		notifEndpoints, err := getNotificationEndpointsResponse(session)
		if err != nil {
			return admin_api.NewNotificationEndpointListDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewNotificationEndpointListOK().WithPayload(notifEndpoints)
	})
	// add a new notification endpoints
	api.AdminAPIAddNotificationEndpointHandler = admin_api.AddNotificationEndpointHandlerFunc(func(params admin_api.AddNotificationEndpointParams, session *models.Principal) middleware.Responder {
		notifEndpoints, err := getAddNotificationEndpointResponse(session, &params)
		if err != nil {
			return admin_api.NewAddNotificationEndpointDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAddNotificationEndpointCreated().WithPayload(notifEndpoints)
	})

}

// getNotificationEndpoints invokes admin info and returns a list of notification endpoints
func getNotificationEndpoints(ctx context.Context, client MinioAdmin) (*models.NotifEndpointResponse, error) {
	serverInfo, err := client.serverInfo(ctx)
	if err != nil {
		return nil, err
	}
	var listEndpoints []*models.NotificationEndpointItem
	for i := range serverInfo.Services.Notifications {
		for service, endpointStatus := range serverInfo.Services.Notifications[i] {
			for j := range endpointStatus {
				for account, status := range endpointStatus[j] {
					listEndpoints = append(listEndpoints, &models.NotificationEndpointItem{
						Service:   models.NofiticationService(service),
						AccountID: account,
						Status:    status.Status,
					})
				}
			}

		}
	}

	// build response
	return &models.NotifEndpointResponse{
		NotificationEndpoints: listEndpoints,
	}, nil
}

// getNotificationEndpointsResponse returns a list of notification endpoints in the instance
func getNotificationEndpointsResponse(session *models.Principal) (*models.NotifEndpointResponse, *models.Error) {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	notfEndpointResp, err := getNotificationEndpoints(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	return notfEndpointResp, nil
}

func addNotificationEndpoint(ctx context.Context, client MinioAdmin, params *admin_api.AddNotificationEndpointParams) (*models.SetNotificationEndpointResponse, error) {
	configs := []*models.ConfigurationKV{}
	var configName string

	// we have different add validations for each service
	switch *params.Body.Service {
	case models.NofiticationServiceAmqp:
		configName = "notify_amqp"
	case models.NofiticationServiceMqtt:
		configName = "notify_mqtt"
	case models.NofiticationServiceElasticsearch:
		configName = "notify_elasticsearch"
	case models.NofiticationServiceRedis:
		configName = "notify_redis"
	case models.NofiticationServiceNats:
		configName = "notify_nats"
	case models.NofiticationServicePostgres:
		configName = "notify_postgres"
	case models.NofiticationServiceMysql:
		configName = "notify_mysql"
	case models.NofiticationServiceKafka:
		configName = "notify_kafka"
	case models.NofiticationServiceWebhook:
		configName = "notify_webhook"
	case models.NofiticationServiceNsq:
		configName = "notify_nsq"
	default:
		return nil, errors.New("provided service is not supported")
	}

	// set all the config values if found on the param.Body.Properties
	for k, val := range params.Body.Properties {
		configs = append(configs, &models.ConfigurationKV{
			Key:   k,
			Value: val,
		})
	}

	needsRestart, err := setConfigWithARNAccountID(ctx, client, &configName, configs, *params.Body.AccountID)
	if err != nil {
		return nil, err
	}

	return &models.SetNotificationEndpointResponse{
		AccountID:  params.Body.AccountID,
		Properties: params.Body.Properties,
		Service:    params.Body.Service,
		Restart:    needsRestart,
	}, nil
}

// getNotificationEndpointsResponse returns a list of notification endpoints in the instance
func getAddNotificationEndpointResponse(session *models.Principal, params *admin_api.AddNotificationEndpointParams) (*models.SetNotificationEndpointResponse, *models.Error) {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	notfEndpointResp, err := addNotificationEndpoint(ctx, adminClient, params)
	if err != nil {
		return nil, prepareError(err)
	}
	return notfEndpointResp, nil
}

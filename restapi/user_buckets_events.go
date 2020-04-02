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
	"log"
	"strings"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/m3/mcs/models"
	"github.com/minio/m3/mcs/restapi/operations"
	"github.com/minio/m3/mcs/restapi/operations/user_api"
	"github.com/minio/minio-go/v6"
)

func registerBucketEventsHandlers(api *operations.McsAPI) {
	api.UserAPIListBucketEventsHandler = user_api.ListBucketEventsHandlerFunc(func(params user_api.ListBucketEventsParams, principal interface{}) middleware.Responder {
		listBucketEventsResponse, err := getListBucketEventsResponse(params)
		if err != nil {
			return user_api.NewListBucketEventsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewListBucketEventsOK().WithPayload(listBucketEventsResponse)
	})
}

// listBucketEvents fetches a list of all events set for a bucket and serializes them for a proper output
func listBucketEvents(client MinioClient, bucketName string) ([]*models.NotificationConfig, error) {
	var configs []*models.NotificationConfig
	bn, err := client.getBucketNotification(bucketName)
	if err != nil {
		return nil, err
	}

	// Generate pretty event names from event types
	prettyEventNames := func(eventsTypes []minio.NotificationEventType) []models.NotificationEventType {
		var result []models.NotificationEventType
		for _, eventType := range eventsTypes {
			var eventTypePretty models.NotificationEventType
			switch eventType {
			case minio.ObjectAccessedAll:
				eventTypePretty = models.NotificationEventTypeGet
			case minio.ObjectCreatedAll:
				eventTypePretty = models.NotificationEventTypePut
			case minio.ObjectRemovedAll:
				eventTypePretty = models.NotificationEventTypeDelete
			}
			result = append(result, eventTypePretty)
		}
		return result
	}
	// part of implementation taken from minio/mc
	// s3Client.ListNotificationConfigs()... to serialize configurations
	getFilters := func(config minio.NotificationConfig) (prefix, suffix string) {
		if config.Filter == nil {
			return
		}
		for _, filter := range config.Filter.S3Key.FilterRules {
			if strings.ToLower(filter.Name) == "prefix" {
				prefix = filter.Value
			}
			if strings.ToLower(filter.Name) == "suffix" {
				suffix = filter.Value
			}

		}
		return prefix, suffix
	}
	for _, config := range bn.TopicConfigs {
		prefix, suffix := getFilters(config.NotificationConfig)
		configs = append(configs, &models.NotificationConfig{ID: config.ID,
			Arn:    config.Topic,
			Events: prettyEventNames(config.Events),
			Prefix: prefix,
			Suffix: suffix})
	}
	for _, config := range bn.QueueConfigs {
		prefix, suffix := getFilters(config.NotificationConfig)
		configs = append(configs, &models.NotificationConfig{ID: config.ID,
			Arn:    config.Queue,
			Events: prettyEventNames(config.Events),
			Prefix: prefix,
			Suffix: suffix})
	}
	for _, config := range bn.LambdaConfigs {
		prefix, suffix := getFilters(config.NotificationConfig)
		configs = append(configs, &models.NotificationConfig{ID: config.ID,
			Arn:    config.Lambda,
			Events: prettyEventNames(config.Events),
			Prefix: prefix,
			Suffix: suffix})
	}
	return configs, nil
}

// getListBucketsResponse performs listBucketEvents() and serializes it to the handler's output
func getListBucketEventsResponse(params user_api.ListBucketEventsParams) (*models.ListBucketEventsResponse, error) {
	mClient, err := newMinioClient()
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	bucketEvents, err := listBucketEvents(minioClient, params.BucketName)
	if err != nil {
		log.Println("error listing bucket events:", err)
		return nil, err
	}
	// serialize output
	listBucketsResponse := &models.ListBucketEventsResponse{
		Events: bucketEvents,
		Total:  int64(len(bucketEvents)),
	}
	return listBucketsResponse, nil
}

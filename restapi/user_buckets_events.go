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
	"log"
	"strings"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/pkg/auth"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
	"github.com/minio/minio-go/v6"
)

func registerBucketEventsHandlers(api *operations.McsAPI) {
	// list bucket events
	api.UserAPIListBucketEventsHandler = user_api.ListBucketEventsHandlerFunc(func(params user_api.ListBucketEventsParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		listBucketEventsResponse, err := getListBucketEventsResponse(sessionID, params)
		if err != nil {
			return user_api.NewListBucketEventsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewListBucketEventsOK().WithPayload(listBucketEventsResponse)
	})
	// create bucket event
	api.UserAPICreateBucketEventHandler = user_api.CreateBucketEventHandlerFunc(func(params user_api.CreateBucketEventParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		if err := getCreateBucketEventsResponse(sessionID, params.BucketName, params.Body); err != nil {
			return user_api.NewCreateBucketEventDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewCreateBucketEventCreated()
	})
	// delete bucket event
	api.UserAPIDeleteBucketEventHandler = user_api.DeleteBucketEventHandlerFunc(func(params user_api.DeleteBucketEventParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		if err := getDeleteBucketEventsResponse(sessionID, params.BucketName, params.Arn, params.Body.Events, params.Body.Prefix, params.Body.Suffix); err != nil {
			return user_api.NewDeleteBucketEventDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewDeleteBucketEventNoContent()
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
			Arn:    swag.String(config.Topic),
			Events: prettyEventNames(config.Events),
			Prefix: prefix,
			Suffix: suffix})
	}
	for _, config := range bn.QueueConfigs {
		prefix, suffix := getFilters(config.NotificationConfig)
		configs = append(configs, &models.NotificationConfig{ID: config.ID,
			Arn:    swag.String(config.Queue),
			Events: prettyEventNames(config.Events),
			Prefix: prefix,
			Suffix: suffix})
	}
	for _, config := range bn.LambdaConfigs {
		prefix, suffix := getFilters(config.NotificationConfig)
		configs = append(configs, &models.NotificationConfig{ID: config.ID,
			Arn:    swag.String(config.Lambda),
			Events: prettyEventNames(config.Events),
			Prefix: prefix,
			Suffix: suffix})
	}
	return configs, nil
}

// getListBucketsResponse performs listBucketEvents() and serializes it to the handler's output
func getListBucketEventsResponse(sessionID string, params user_api.ListBucketEventsParams) (*models.ListBucketEventsResponse, error) {
	mClient, err := newMinioClient(sessionID)
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

// createBucketEvent calls mc AddNotificationConfig() to create a bucket nofication
//
// If notificationEvents is empty, by default will set [get, put, delete], else the provided
// ones will be set.
// this function follows same behavior as minio/mc for adding a bucket event
func createBucketEvent(client MCS3Client, arn string, notificationEvents []models.NotificationEventType, prefix, suffix string, ignoreExisting bool) error {
	var events []string
	if len(notificationEvents) == 0 {
		// default event values are [get, put, delete]
		events = []string{
			string(models.NotificationEventTypeGet),
			string(models.NotificationEventTypePut),
			string(models.NotificationEventTypeDelete),
		}
	} else {
		// else use defined events in request
		// cast type models.NotificationEventType to string
		for _, e := range notificationEvents {
			events = append(events, string(e))
		}
	}

	perr := client.addNotificationConfig(arn, events, prefix, suffix, ignoreExisting)
	if perr != nil {
		return perr.Cause
	}
	return nil
}

// getCreateBucketEventsResponse calls createBucketEvent to add a bucket event notification
func getCreateBucketEventsResponse(sessionID, bucketName string, eventReq *models.BucketEventRequest) error {
	claims, err := auth.JWTAuthenticate(sessionID)
	if err != nil {
		return err
	}
	s3Client, err := newS3BucketClient(claims, bucketName)
	if err != nil {
		log.Println("error creating S3Client:", err)
		return err
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcS3Client := mcS3Client{client: s3Client}
	err = createBucketEvent(mcS3Client, *eventReq.Configuration.Arn, eventReq.Configuration.Events, eventReq.Configuration.Prefix, eventReq.Configuration.Suffix, eventReq.IgnoreExisting)
	if err != nil {
		log.Println("error creating bucket event:", err)
		return err
	}
	return nil
}

// deleteBucketEventNotification calls S3Client.RemoveNotificationConfig to remove a bucket event notification
func deleteBucketEventNotification(client MCS3Client, arn string, events []models.NotificationEventType, prefix, suffix *string) error {
	eventSingleString := joinNotificationEvents(events)
	perr := client.removeNotificationConfig(arn, eventSingleString, *prefix, *suffix)
	if perr != nil {
		return perr.Cause
	}
	return nil
}

func joinNotificationEvents(events []models.NotificationEventType) string {
	var eventsArn []string
	for _, e := range events {
		eventsArn = append(eventsArn, string(e))
	}
	return strings.Join(eventsArn, ",")
}

// getDeleteBucketEventsResponse calls deleteBucketEventNotification() to delete a bucket event notification
func getDeleteBucketEventsResponse(sessionID, bucketName string, arn string, events []models.NotificationEventType, prefix, suffix *string) error {
	claims, err := auth.JWTAuthenticate(sessionID)
	if err != nil {
		return err
	}
	s3Client, err := newS3BucketClient(claims, bucketName)
	if err != nil {
		log.Println("error creating S3Client:", err)
		return err
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcS3Client := mcS3Client{client: s3Client}
	err = deleteBucketEventNotification(mcS3Client, arn, events, prefix, suffix)
	if err != nil {
		log.Println("error deleting bucket event:", err)
		return err
	}
	return nil
}

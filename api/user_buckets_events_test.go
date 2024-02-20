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
	"errors"
	"fmt"
	"testing"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7/pkg/notification"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioGetBucketNotificationMock func(ctx context.Context, bucketName string) (bucketNotification notification.Configuration, err error)

// mock function of getBucketNotification()
func (mc minioClientMock) getBucketNotification(ctx context.Context, bucketName string) (bucketNotification notification.Configuration, err error) {
	return minioGetBucketNotificationMock(ctx, bucketName)
}

// // Mock mc S3Client functions ////
var (
	mcAddNotificationConfigMock    func(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error
	mcRemoveNotificationConfigMock func(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error
)

// Define a mock struct of mc S3Client interface implementation
type s3ClientMock struct{}

// implements mc.S3Client.AddNotificationConfigMock()
func (c s3ClientMock) addNotificationConfig(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
	return mcAddNotificationConfigMock(ctx, arn, events, prefix, suffix, ignoreExisting)
}

// implements mc.S3Client.DeleteBucketEventNotification()
func (c s3ClientMock) removeNotificationConfig(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error {
	return mcRemoveNotificationConfigMock(ctx, arn, event, prefix, suffix)
}

func TestAddBucketNotification(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client := s3ClientMock{}
	function := "createBucketEvent()"
	// Test-1: createBucketEvent() set an event with empty parameters and events, should set default values with no error
	testArn := "arn:minio:sqs::test:postgresql"
	testNotificationEvents := []models.NotificationEventType{}
	testPrefix := ""
	testSuffix := ""
	testIgnoreExisting := false
	mcAddNotificationConfigMock = func(_ context.Context, _ string, _ []string, _, _ string, _ bool) *probe.Error {
		return nil
	}
	if err := createBucketEvent(ctx, client, testArn, testNotificationEvents, testPrefix, testSuffix, testIgnoreExisting); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: createBucketEvent() with different even types in list shouls create event with no errors
	testArn = "arn:minio:sqs::test:postgresql"
	testNotificationEvents = []models.NotificationEventType{
		models.NotificationEventTypePut,
		models.NotificationEventTypeGet,
	}
	testPrefix = "photos/"
	testSuffix = ".jpg"
	testIgnoreExisting = true
	mcAddNotificationConfigMock = func(_ context.Context, _ string, _ []string, _, _ string, _ bool) *probe.Error {
		return nil
	}
	if err := createBucketEvent(ctx, client, testArn, testNotificationEvents, testPrefix, testSuffix, testIgnoreExisting); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-3 createBucketEvent() S3Client.AddNotificationConfig returns an error and is handled correctly
	mcAddNotificationConfigMock = func(_ context.Context, _ string, _ []string, _, _ string, _ bool) *probe.Error {
		return probe.NewError(errors.New("error"))
	}
	if err := createBucketEvent(ctx, client, testArn, testNotificationEvents, testPrefix, testSuffix, testIgnoreExisting); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestDeleteBucketNotification(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	assert := assert.New(t)
	// mock minIO client
	client := s3ClientMock{}
	function := "deleteBucketEventNotification()"
	// Test-1: deleteBucketEventNotification() delete a bucket event notification
	testArn := "arn:minio:sqs::test:postgresql"
	// arn string, events []models.NotificationEventType, prefix, suffix *string
	events := []models.NotificationEventType{
		models.NotificationEventTypeGet,
		models.NotificationEventTypeDelete,
		models.NotificationEventTypePut,
	}
	prefix := "/photos"
	suffix := ".jpg"
	mcRemoveNotificationConfigMock = func(_ context.Context, _ string, _ string, _ string, _ string) *probe.Error {
		return nil
	}
	if err := deleteBucketEventNotification(ctx, client, testArn, events, swag.String(prefix), swag.String(suffix)); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 deleteBucketEventNotification() S3Client.DeleteBucketEventNotification returns an error and is handled correctly
	mcRemoveNotificationConfigMock = func(_ context.Context, _ string, _ string, _ string, _ string) *probe.Error {
		return probe.NewError(errors.New("error"))
	}
	if err := deleteBucketEventNotification(ctx, client, testArn, events, swag.String(prefix), swag.String(suffix)); assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-3 joinNotificationEvents() verify that it returns the events as a single string separated by commas
	function = "joinNotificationEvents()"
	eventString := joinNotificationEvents(events)
	assert.Equal("get,delete,put", eventString, fmt.Sprintf("Failed on %s:", function))
}

func TestListBucketEvents(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	function := "listBucketEvents()"

	////// Test-1 : listBucketEvents() get list of events for a particular bucket only one config
	// mock bucketNotification response from MinIO
	mockBucketN := notification.Configuration{
		LambdaConfigs: []notification.LambdaConfig{},
		TopicConfigs:  []notification.TopicConfig{},
		QueueConfigs: []notification.QueueConfig{
			{
				Queue: "arn:minio:sqs::test:postgresql",
				Config: notification.Config{
					ID: "",
					Events: []notification.EventType{
						notification.ObjectAccessedAll,
						notification.ObjectCreatedAll,
						notification.ObjectRemovedAll,
					},
					Filter: &notification.Filter{
						S3Key: notification.S3Key{
							FilterRules: []notification.FilterRule{
								{
									Name:  "suffix",
									Value: ".jpg",
								},
								{
									Name:  "prefix",
									Value: "file/",
								},
							},
						},
					},
				},
			},
		},
	}
	expectedOutput := []*models.NotificationConfig{
		{
			Arn:    swag.String("arn:minio:sqs::test:postgresql"),
			ID:     "",
			Prefix: "file/",
			Suffix: ".jpg",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeGet,
				models.NotificationEventTypePut,
				models.NotificationEventTypeDelete,
			},
		},
	}
	minioGetBucketNotificationMock = func(_ context.Context, _ string) (bucketNotification notification.Configuration, err error) {
		return mockBucketN, nil
	}
	eventConfigs, err := listBucketEvents(minClient, "bucket")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(expectedOutput), len(eventConfigs), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	for i, conf := range eventConfigs {
		assert.Equal(expectedOutput[i].Arn, conf.Arn)
		assert.Equal(expectedOutput[i].ID, conf.ID)
		assert.Equal(expectedOutput[i].Suffix, conf.Suffix)
		assert.Equal(expectedOutput[i].Prefix, conf.Prefix)
		assert.Equal(len(expectedOutput[i].Events), len(conf.Events), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
		for j, event := range conf.Events {
			assert.Equal(expectedOutput[i].Events[j], event)
		}
	}

	////// Test-2 : listBucketEvents() get list of events no filters
	mockBucketN = notification.Configuration{
		LambdaConfigs: []notification.LambdaConfig{},
		TopicConfigs:  []notification.TopicConfig{},
		QueueConfigs: []notification.QueueConfig{
			{
				Queue: "arn:minio:sqs::test:postgresql",
				Config: notification.Config{
					ID: "",
					Events: []notification.EventType{
						notification.ObjectRemovedAll,
					},
				},
			},
		},
	}
	expectedOutput = []*models.NotificationConfig{
		{
			Arn:    swag.String("arn:minio:sqs::test:postgresql"),
			ID:     "",
			Prefix: "",
			Suffix: "",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
	}
	minioGetBucketNotificationMock = func(_ context.Context, _ string) (bucketNotification notification.Configuration, err error) {
		return mockBucketN, nil
	}
	eventConfigs, err = listBucketEvents(minClient, "bucket")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(expectedOutput), len(eventConfigs), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	for i, conf := range eventConfigs {
		assert.Equal(expectedOutput[i].Arn, conf.Arn)
		assert.Equal(expectedOutput[i].ID, conf.ID)
		assert.Equal(expectedOutput[i].Suffix, conf.Suffix)
		assert.Equal(expectedOutput[i].Prefix, conf.Prefix)
		assert.Equal(len(expectedOutput[i].Events), len(conf.Events), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
		for j, event := range conf.Events {
			assert.Equal(expectedOutput[i].Events[j], event)
		}
	}

	////// Test-3 : listBucketEvents() get list of events
	mockBucketN = notification.Configuration{
		LambdaConfigs: []notification.LambdaConfig{
			{
				Lambda: "lambda",
				Config: notification.Config{
					ID: "",
					Events: []notification.EventType{
						notification.ObjectRemovedAll,
					},
					Filter: &notification.Filter{
						S3Key: notification.S3Key{
							FilterRules: []notification.FilterRule{
								{
									Name:  "suffix",
									Value: ".png",
								},
								{
									Name:  "prefix",
									Value: "lambda/",
								},
							},
						},
					},
				},
			},
		},
		TopicConfigs: []notification.TopicConfig{
			{
				Topic: "topic",
				Config: notification.Config{
					ID: "",
					Events: []notification.EventType{
						notification.ObjectRemovedAll,
					},
					Filter: &notification.Filter{
						S3Key: notification.S3Key{
							FilterRules: []notification.FilterRule{
								{
									Name:  "suffix",
									Value: ".gif",
								},
								{
									Name:  "prefix",
									Value: "topic/",
								},
							},
						},
					},
				},
			},
		},
		QueueConfigs: []notification.QueueConfig{
			{
				Queue: "arn:minio:sqs::test:postgresql",
				Config: notification.Config{
					ID: "",
					Events: []notification.EventType{
						notification.ObjectRemovedAll,
					},
					Filter: &notification.Filter{
						S3Key: notification.S3Key{
							FilterRules: []notification.FilterRule{},
						},
					},
				},
			},
		},
	}
	// order matters in output: topic,queue then lambda are given respectively
	expectedOutput = []*models.NotificationConfig{
		{
			Arn:    swag.String("topic"),
			ID:     "",
			Prefix: "topic/",
			Suffix: ".gif",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
		{
			Arn:    swag.String("arn:minio:sqs::test:postgresql"),
			ID:     "",
			Prefix: "",
			Suffix: "",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
		{
			Arn:    swag.String("lambda"),
			ID:     "",
			Prefix: "lambda/",
			Suffix: ".png",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
	}
	minioGetBucketNotificationMock = func(_ context.Context, _ string) (bucketNotification notification.Configuration, err error) {
		return mockBucketN, nil
	}
	eventConfigs, err = listBucketEvents(minClient, "bucket")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(expectedOutput), len(eventConfigs), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	for i, conf := range eventConfigs {
		assert.Equal(expectedOutput[i].Arn, conf.Arn)
		assert.Equal(expectedOutput[i].ID, conf.ID)
		assert.Equal(expectedOutput[i].Suffix, conf.Suffix)
		assert.Equal(expectedOutput[i].Prefix, conf.Prefix)
		assert.Equal(len(expectedOutput[i].Events), len(conf.Events), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
		for j, event := range conf.Events {
			assert.Equal(expectedOutput[i].Events[j], event)
		}
	}

	////// Test-2 : listBucketEvents() Returns error and see that the error is handled correctly and returned
	minioGetBucketNotificationMock = func(_ context.Context, _ string) (bucketNotification notification.Configuration, err error) {
		return notification.Configuration{}, errors.New("error")
	}
	_, err = listBucketEvents(minClient, "bucket")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

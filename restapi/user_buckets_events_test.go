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
	"fmt"
	"testing"

	"errors"

	"github.com/go-openapi/swag"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/mcs/models"
	"github.com/minio/minio-go/v6"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioGetBucketNotificationMock func(bucketName string) (bucketNotification minio.BucketNotification, err error)

// mock function of getBucketNotification()
func (mc minioClientMock) getBucketNotification(bucketName string) (bucketNotification minio.BucketNotification, err error) {
	return minioGetBucketNotificationMock(bucketName)
}

//// Mock mc S3Client functions ////
var mcAddNotificationConfigMock func(arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error

// Define a mock struct of mc S3Client interface implementation
type s3ClientMock struct {
}

// implements mc.S3Client.AddNotificationConfigMock(ctx)
func (c s3ClientMock) addNotificationConfig(arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
	return mcAddNotificationConfigMock(arn, events, prefix, suffix, ignoreExisting)
}

func TestAddBucketNotification(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := s3ClientMock{}
	function := "createBucketEvent()"
	// Test-1: createBucketEvent() set an event with empty parameters and events, should set default values with no error
	testArn := "arn:minio:sqs::test:postgresql"
	testNotificationEvents := []models.NotificationEventType{}
	testPrefix := ""
	testSuffix := ""
	testIgnoreExisting := false
	mcAddNotificationConfigMock = func(arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
		return nil
	}
	if err := createBucketEvent(client, testArn, testNotificationEvents, testPrefix, testSuffix, testIgnoreExisting); err != nil {
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
	mcAddNotificationConfigMock = func(arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
		return nil
	}
	if err := createBucketEvent(client, testArn, testNotificationEvents, testPrefix, testSuffix, testIgnoreExisting); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-3 createBucketEvent() S3Client.AddNotificationConfig returns an error and is handled correctly
	mcAddNotificationConfigMock = func(arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
		return probe.NewError(errors.New("error"))
	}
	if err := createBucketEvent(client, testArn, testNotificationEvents, testPrefix, testSuffix, testIgnoreExisting); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestListBucketEvents(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	function := "listBucketEvents()"

	////// Test-1 : listBucketEvents() get list of events for a particular bucket only one config
	// mock bucketNotification response from MinIO
	mockBucketN := minio.BucketNotification{
		LambdaConfigs: []minio.LambdaConfig{},
		TopicConfigs:  []minio.TopicConfig{},
		QueueConfigs: []minio.QueueConfig{
			minio.QueueConfig{
				Queue: "arn:minio:sqs::test:postgresql",
				NotificationConfig: minio.NotificationConfig{
					ID: "",
					Events: []minio.NotificationEventType{
						minio.ObjectAccessedAll,
						minio.ObjectCreatedAll,
						minio.ObjectRemovedAll,
					},
					Filter: &minio.Filter{
						S3Key: minio.S3Key{
							FilterRules: []minio.FilterRule{
								minio.FilterRule{
									Name:  "suffix",
									Value: ".jpg",
								},
								minio.FilterRule{
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
		&models.NotificationConfig{
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
	minioGetBucketNotificationMock = func(bucketName string) (bucketNotification minio.BucketNotification, err error) {
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
	mockBucketN = minio.BucketNotification{
		LambdaConfigs: []minio.LambdaConfig{},
		TopicConfigs:  []minio.TopicConfig{},
		QueueConfigs: []minio.QueueConfig{
			minio.QueueConfig{
				Queue: "arn:minio:sqs::test:postgresql",
				NotificationConfig: minio.NotificationConfig{
					ID: "",
					Events: []minio.NotificationEventType{
						minio.ObjectRemovedAll,
					},
				},
			},
		},
	}
	expectedOutput = []*models.NotificationConfig{
		&models.NotificationConfig{
			Arn:    swag.String("arn:minio:sqs::test:postgresql"),
			ID:     "",
			Prefix: "",
			Suffix: "",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
	}
	minioGetBucketNotificationMock = func(bucketName string) (bucketNotification minio.BucketNotification, err error) {
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
	mockBucketN = minio.BucketNotification{
		LambdaConfigs: []minio.LambdaConfig{
			minio.LambdaConfig{
				Lambda: "lambda",
				NotificationConfig: minio.NotificationConfig{
					ID: "",
					Events: []minio.NotificationEventType{
						minio.ObjectRemovedAll,
					},
					Filter: &minio.Filter{
						S3Key: minio.S3Key{
							FilterRules: []minio.FilterRule{
								minio.FilterRule{
									Name:  "suffix",
									Value: ".png",
								},
								minio.FilterRule{
									Name:  "prefix",
									Value: "lambda/",
								},
							},
						},
					},
				},
			},
		},
		TopicConfigs: []minio.TopicConfig{
			minio.TopicConfig{
				Topic: "topic",
				NotificationConfig: minio.NotificationConfig{
					ID: "",
					Events: []minio.NotificationEventType{
						minio.ObjectRemovedAll,
					},
					Filter: &minio.Filter{
						S3Key: minio.S3Key{
							FilterRules: []minio.FilterRule{
								minio.FilterRule{
									Name:  "suffix",
									Value: ".gif",
								},
								minio.FilterRule{
									Name:  "prefix",
									Value: "topic/",
								},
							},
						},
					},
				},
			},
		},
		QueueConfigs: []minio.QueueConfig{
			minio.QueueConfig{
				Queue: "arn:minio:sqs::test:postgresql",
				NotificationConfig: minio.NotificationConfig{
					ID: "",
					Events: []minio.NotificationEventType{
						minio.ObjectRemovedAll,
					},
					Filter: &minio.Filter{
						S3Key: minio.S3Key{
							FilterRules: []minio.FilterRule{},
						},
					},
				},
			},
		},
	}
	// order matters in output: topic,queue then lambda are given respectively
	expectedOutput = []*models.NotificationConfig{
		&models.NotificationConfig{
			Arn:    swag.String("topic"),
			ID:     "",
			Prefix: "topic/",
			Suffix: ".gif",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
		&models.NotificationConfig{
			Arn:    swag.String("arn:minio:sqs::test:postgresql"),
			ID:     "",
			Prefix: "",
			Suffix: "",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
		&models.NotificationConfig{
			Arn:    swag.String("lambda"),
			ID:     "",
			Prefix: "lambda/",
			Suffix: ".png",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
	}
	minioGetBucketNotificationMock = func(bucketName string) (bucketNotification minio.BucketNotification, err error) {
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
	minioGetBucketNotificationMock = func(bucketName string) (bucketNotification minio.BucketNotification, err error) {
		return minio.BucketNotification{}, errors.New("error")
	}
	_, err = listBucketEvents(minClient, "bucket")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

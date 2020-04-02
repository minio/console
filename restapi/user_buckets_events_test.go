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
	"fmt"
	"testing"

	"errors"

	"github.com/minio/m3/mcs/models"
	"github.com/minio/minio-go/v6"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioGetBucketNotificationMock func(bucketName string) (bucketNotification minio.BucketNotification, err error)

// mock function of getBucketNotification()
func (mc minioClientMock) getBucketNotification(bucketName string) (bucketNotification minio.BucketNotification, err error) {
	return minioGetBucketNotificationMock(bucketName)
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
			Arn:    "arn:minio:sqs::test:postgresql",
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
			Arn:    "arn:minio:sqs::test:postgresql",
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
			Arn:    "topic",
			ID:     "",
			Prefix: "topic/",
			Suffix: ".gif",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
		&models.NotificationConfig{
			Arn:    "arn:minio:sqs::test:postgresql",
			ID:     "",
			Prefix: "",
			Suffix: "",
			Events: []models.NotificationEventType{
				models.NotificationEventTypeDelete,
			},
		},
		&models.NotificationConfig{
			Arn:    "lambda",
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

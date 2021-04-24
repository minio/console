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
	"fmt"
	"testing"

	"github.com/minio/console/models"
	"github.com/stretchr/testify/assert"

	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/minio-go/v7/pkg/lifecycle"
)

// assigning mock at runtime instead of compile time
var minioGetLifecycleRulesMock func(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error)

// mock function of getLifecycleRules()
func (ac minioClientMock) getLifecycleRules(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error) {
	return minioGetLifecycleRulesMock(ctx, bucketName)
}

// assign mock for set Bucket Lifecycle
var minioSetBucketLifecycleMock func(ctx context.Context, bucketName string, config *lifecycle.Configuration) error

// mock function of setBucketLifecycle()
func (ac minioClientMock) setBucketLifecycle(ctx context.Context, bucketName string, config *lifecycle.Configuration) error {
	return minioSetBucketLifecycleMock(ctx, bucketName, config)
}

func TestGetLifecycleRules(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}

	function := "getBucketLifecycle()"
	bucketName := "testBucket"
	ctx := context.Background()

	// Test-1 : getBucketLifecycle() get list of events for a particular bucket only one config
	// mock lifecycle response from MinIO
	mockLifecycle := lifecycle.Configuration{
		Rules: []lifecycle.Rule{
			{
				ID:         "TESTRULE",
				Expiration: lifecycle.Expiration{Days: 15},
				Status:     "Enabled",
				RuleFilter: lifecycle.Filter{Tag: lifecycle.Tag{Key: "tag1", Value: "val1"}, And: lifecycle.And{Prefix: "prefix1"}},
			},
		},
	}

	expectedOutput := models.BucketLifecycleResponse{
		Lifecycle: []*models.ObjectBucketLifecycle{
			{
				ID:         "TESTRULE",
				Status:     "Enabled",
				Prefix:     "prefix1",
				Expiration: &models.ExpirationResponse{Days: int64(15)},
				Transition: &models.TransitionResponse{},
				Tags:       []*models.LifecycleTag{{Key: "tag1", Value: "val1"}},
			},
		},
	}

	minioGetLifecycleRulesMock = func(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycle, nil
	}

	lifeCycleConfigs, err := getBucketLifecycle(ctx, minClient, bucketName)

	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(expectedOutput.Lifecycle), len(lifeCycleConfigs.Lifecycle), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	for i, conf := range lifeCycleConfigs.Lifecycle {
		assert.Equal(expectedOutput.Lifecycle[i].ID, conf.ID)
		assert.Equal(expectedOutput.Lifecycle[i].Status, conf.Status)
		assert.Equal(expectedOutput.Lifecycle[i].Prefix, conf.Prefix)
		assert.Equal(expectedOutput.Lifecycle[i].Expiration.Days, conf.Expiration.Days)
		for j, event := range conf.Tags {
			assert.Equal(expectedOutput.Lifecycle[i].Tags[j], event)
		}
	}

	// Test-2 : getBucketLifecycle() get list of events is empty
	mockLifecycleT2 := lifecycle.Configuration{
		Rules: []lifecycle.Rule{},
	}

	expectedOutputT2 := models.BucketLifecycleResponse{
		Lifecycle: []*models.ObjectBucketLifecycle{},
	}

	minioGetLifecycleRulesMock = func(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycleT2, nil
	}

	lifeCycleConfigsT2, err := getBucketLifecycle(ctx, minClient, bucketName)

	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(expectedOutputT2.Lifecycle), len(lifeCycleConfigsT2.Lifecycle), fmt.Sprintf("Failed on %s: length of lists is not the same", function))

	// Test-3 : getBucketLifecycle() get list of events returns an error

	minioGetLifecycleRulesMock = func(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error) {
		return nil, errors.New("error returned")
	}

	_, errT3 := getBucketLifecycle(ctx, minClient, bucketName)

	errorCompare := errors.New("error returned")

	assert.Equal(errorCompare, errT3, fmt.Sprintf("Failed on %s: Invalid error message", function))

	// verify length of buckets is correct
	assert.Equal(len(expectedOutputT2.Lifecycle), len(lifeCycleConfigsT2.Lifecycle), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
}

func TestSetLifecycleRule(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}

	function := "addBucketLifecycle()"
	ctx := context.Background()

	// Test-1 : addBucketLifecycle() get list of events for a particular bucket only one config
	// mock create request
	mockLifecycle := lifecycle.Configuration{
		Rules: []lifecycle.Rule{
			{
				ID:         "TESTRULE",
				Expiration: lifecycle.Expiration{Days: 15},
				Status:     "Enabled",
				RuleFilter: lifecycle.Filter{Tag: lifecycle.Tag{Key: "tag1", Value: "val1"}, And: lifecycle.And{Prefix: "prefix1"}},
			},
		},
	}

	minioGetLifecycleRulesMock = func(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycle, nil
	}

	insertMock := user_api.AddBucketLifecycleParams{
		BucketName: "testBucket",
		Body: &models.AddBucketLifecycle{
			Disable:                                 false,
			ExpiredObjectDeleteMarker:               false,
			ExpiryDays:                              int32(16),
			NoncurrentversionExpirationDays:         0,
			NoncurrentversionTransitionDays:         0,
			NoncurrentversionTransitionStorageClass: "",
			Prefix:                                  "pref1",
			StorageClass:                            "",
			Tags:                                    "",
			TransitionDate:                          "",
			TransitionDays:                          0,
		},
	}

	minioSetBucketLifecycleMock = func(ctx context.Context, bucketName string, config *lifecycle.Configuration) error {
		return nil
	}

	err := addBucketLifecycle(ctx, minClient, insertMock)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-2 : addBucketLifecycle() returns error

	minioSetBucketLifecycleMock = func(ctx context.Context, bucketName string, config *lifecycle.Configuration) error {
		return errors.New("error setting lifecycle")
	}

	err2 := addBucketLifecycle(ctx, minClient, insertMock)

	assert.Equal(errors.New("error setting lifecycle"), err2, fmt.Sprintf("Failed on %s: Error returned", function))
}

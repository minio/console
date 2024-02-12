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

	"github.com/minio/console/models"
	"github.com/stretchr/testify/assert"

	bucketApi "github.com/minio/console/api/operations/bucket"
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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

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

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
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

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycleT2, nil
	}

	lifeCycleConfigsT2, err := getBucketLifecycle(ctx, minClient, bucketName)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(expectedOutputT2.Lifecycle), len(lifeCycleConfigsT2.Lifecycle), fmt.Sprintf("Failed on %s: length of lists is not the same", function))

	// Test-3 : getBucketLifecycle() get list of events returns an error

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

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

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycle, nil
	}

	expiryRule := "expiry"

	insertMock := bucketApi.AddBucketLifecycleParams{
		BucketName: "testBucket",
		Body: &models.AddBucketLifecycle{
			Type:                                    expiryRule,
			Disable:                                 false,
			ExpiredObjectDeleteMarker:               false,
			ExpiryDays:                              int32(16),
			NoncurrentversionExpirationDays:         0,
			NoncurrentversionTransitionDays:         0,
			NoncurrentversionTransitionStorageClass: "",
			Prefix:                                  "pref1",
			StorageClass:                            "",
			Tags:                                    "",
			TransitionDays:                          0,
		},
	}

	minioSetBucketLifecycleMock = func(_ context.Context, _ string, _ *lifecycle.Configuration) error {
		return nil
	}

	err := addBucketLifecycle(ctx, minClient, insertMock)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-2 : addBucketLifecycle() returns error

	minioSetBucketLifecycleMock = func(_ context.Context, _ string, _ *lifecycle.Configuration) error {
		return errors.New("error setting lifecycle")
	}

	err2 := addBucketLifecycle(ctx, minClient, insertMock)

	assert.Equal(errors.New("error setting lifecycle"), err2, fmt.Sprintf("Failed on %s: Error returned", function))
}

func TestUpdateLifecycleRule(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}

	function := "editBucketLifecycle()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Test-1 : editBucketLifecycle() get list of events for a particular bucket only one config (get lifecycle mock)
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

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycle, nil
	}

	// Test-2 : editBucketLifecycle() Update lifecycle rule

	expiryRule := "expiry"

	editMock := bucketApi.UpdateBucketLifecycleParams{
		BucketName: "testBucket",
		Body: &models.UpdateBucketLifecycle{
			Type:                                    &expiryRule,
			Disable:                                 false,
			ExpiredObjectDeleteMarker:               false,
			ExpiryDays:                              int32(16),
			NoncurrentversionExpirationDays:         0,
			NoncurrentversionTransitionDays:         0,
			NoncurrentversionTransitionStorageClass: "",
			Prefix:                                  "pref1",
			StorageClass:                            "",
			Tags:                                    "",
			TransitionDays:                          0,
		},
		LifecycleID: "TESTRULE",
	}

	minioSetBucketLifecycleMock = func(_ context.Context, _ string, _ *lifecycle.Configuration) error {
		return nil
	}

	err := editBucketLifecycle(ctx, minClient, editMock)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-2a : editBucketLifecycle() Update lifecycle rule

	transitionRule := "transition"

	editMock = bucketApi.UpdateBucketLifecycleParams{
		BucketName: "testBucket",
		Body: &models.UpdateBucketLifecycle{
			Type:                                    &transitionRule,
			Disable:                                 false,
			ExpiredObjectDeleteMarker:               false,
			NoncurrentversionTransitionDays:         5,
			Prefix:                                  "pref1",
			StorageClass:                            "TEST",
			NoncurrentversionTransitionStorageClass: "TESTNC",
			Tags:                                    "",
			TransitionDays:                          int32(16),
		},
		LifecycleID: "TESTRULE",
	}

	minioSetBucketLifecycleMock = func(_ context.Context, _ string, _ *lifecycle.Configuration) error {
		return nil
	}

	err = editBucketLifecycle(ctx, minClient, editMock)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-3 : editBucketLifecycle() returns error

	minioSetBucketLifecycleMock = func(_ context.Context, _ string, _ *lifecycle.Configuration) error {
		return errors.New("error setting lifecycle")
	}

	err2 := editBucketLifecycle(ctx, minClient, editMock)

	assert.Equal(errors.New("error setting lifecycle"), err2, fmt.Sprintf("Failed on %s: Error returned", function))
}

func TestDeleteLifecycleRule(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}

	function := "deleteBucketLifecycle()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	minioSetBucketLifecycleMock = func(_ context.Context, _ string, _ *lifecycle.Configuration) error {
		return nil
	}

	// Test-1 : deleteBucketLifecycle() get list of events for a particular bucket only one config (get lifecycle mock)
	// mock create request
	mockLifecycle := lifecycle.Configuration{
		Rules: []lifecycle.Rule{
			{
				ID:         "TESTRULE",
				Expiration: lifecycle.Expiration{Days: 15},
				Status:     "Enabled",
				RuleFilter: lifecycle.Filter{Tag: lifecycle.Tag{Key: "tag1", Value: "val1"}, And: lifecycle.And{Prefix: "prefix1"}},
			},
			{
				ID:         "TESTRULE2",
				Transition: lifecycle.Transition{Days: 10, StorageClass: "TESTSTCLASS"},
				Status:     "Enabled",
				RuleFilter: lifecycle.Filter{Tag: lifecycle.Tag{Key: "tag1", Value: "val1"}, And: lifecycle.And{Prefix: "prefix1"}},
			},
		},
	}

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycle, nil
	}

	// Test-2 : deleteBucketLifecycle() try to delete an available rule

	availableParams := bucketApi.DeleteBucketLifecycleRuleParams{
		LifecycleID: "TESTRULE2",
		BucketName:  "testBucket",
	}

	err := deleteBucketLifecycle(ctx, minClient, availableParams)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-3 : deleteBucketLifecycle() returns error trying to delete a non available rule

	nonAvailableParams := bucketApi.DeleteBucketLifecycleRuleParams{
		LifecycleID: "INVALIDTESTRULE",
		BucketName:  "testBucket",
	}

	err2 := deleteBucketLifecycle(ctx, minClient, nonAvailableParams)

	assert.Equal(fmt.Errorf("lifecycle rule for id '%s' doesn't exist", nonAvailableParams.LifecycleID), err2, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-4 : deleteBucketLifecycle() returns error trying to delete a rule when no rules are available

	mockLifecycle2 := lifecycle.Configuration{
		Rules: []lifecycle.Rule{},
	}

	minioGetLifecycleRulesMock = func(_ context.Context, _ string) (lifecycle *lifecycle.Configuration, err error) {
		return &mockLifecycle2, nil
	}

	err3 := deleteBucketLifecycle(ctx, minClient, nonAvailableParams)

	assert.Equal(errors.New("no rules available to delete"), err3, fmt.Sprintf("Failed on %s: Error returned", function))
}

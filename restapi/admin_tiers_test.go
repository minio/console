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
	"github.com/minio/console/restapi/operations/admin_api"
	"github.com/minio/minio/pkg/madmin"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioListTiersMock func(ctx context.Context) ([]*madmin.TierConfig, error)

// mock function of listTiers()
func (ac adminClientMock) listTiers(ctx context.Context) ([]*madmin.TierConfig, error) {
	return minioListTiersMock(ctx)
}

// assigning mock at runtime instead of compile time
var minioAddTiersMock func(ctx context.Context, tier *madmin.TierConfig) error

// mock function of addTier()
func (ac adminClientMock) addTier(ctx context.Context, tier *madmin.TierConfig) error {
	return minioAddTiersMock(ctx, tier)
}

// assigning mock at runtime instead of compile time
var minioEditTiersMock func(ctx context.Context, tierName string, creds madmin.TierCreds) error

// mock function of editTierCreds()
func (ac adminClientMock) editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error {
	return minioEditTiersMock(ctx, tierName, creds)
}

func TestGetTiers(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "getTiers()"
	ctx := context.Background()

	// Test-1 : getBucketLifecycle() get list of tiers
	// mock lifecycle response from MinIO
	returnListMock := []*madmin.TierConfig{
		{
			Version: "V1",
			Type:    madmin.TierType(0),
			Name:    "S3 Tier",
			S3: &madmin.TierS3{
				Endpoint:     "https://s3tier.test.com/",
				AccessKey:    "Access Key",
				SecretKey:    "Secret Key",
				Bucket:       "buckets3",
				Prefix:       "pref1",
				Region:       "us-west-1",
				StorageClass: "TT1",
			},
		},
	}

	expectedOutput := &models.TierListResponse{
		Items: []*models.Tier{
			{
				Type: "S3",
				S3: &models.TierS3{
					Accesskey:    "Access Key",
					Secretkey:    "Secret Key",
					Bucket:       "buckets3",
					Endpoint:     "https://s3tier.test.com/",
					Name:         "S3 Tier",
					Prefix:       "pref1",
					Region:       "us-west-1",
					Storageclass: "TT1",
				},
			},
		},
	}

	minioListTiersMock = func(ctx context.Context) ([]*madmin.TierConfig, error) {
		return returnListMock, nil
	}

	tiersList, err := getTiers(ctx, adminClient)

	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of tiers list is correct
	assert.Equal(len(tiersList.Items), len(returnListMock), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	for i, conf := range returnListMock {
		if conf.Type == madmin.TierType(0) {
			// S3
			assert.Equal(expectedOutput.Items[i].S3.Name, conf.Name)
			assert.Equal(expectedOutput.Items[i].S3.Bucket, conf.S3.Bucket)
			assert.Equal(expectedOutput.Items[i].S3.Prefix, conf.S3.Prefix)
			assert.Equal(expectedOutput.Items[i].S3.Accesskey, conf.S3.AccessKey)
			assert.Equal(expectedOutput.Items[i].S3.Secretkey, conf.S3.SecretKey)
			assert.Equal(expectedOutput.Items[i].S3.Endpoint, conf.S3.Endpoint)
			assert.Equal(expectedOutput.Items[i].S3.Region, conf.S3.Region)
			assert.Equal(expectedOutput.Items[i].S3.Storageclass, conf.S3.StorageClass)
		} else if conf.Type == madmin.TierType(1) {
			// Azure
			assert.Equal(expectedOutput.Items[i].Azure.Name, conf.Name)
			assert.Equal(expectedOutput.Items[i].Azure.Bucket, conf.Azure.Bucket)
			assert.Equal(expectedOutput.Items[i].Azure.Prefix, conf.Azure.Prefix)
			assert.Equal(expectedOutput.Items[i].Azure.Accountkey, conf.Azure.AccountKey)
			assert.Equal(expectedOutput.Items[i].Azure.Accountname, conf.Azure.AccountName)
			assert.Equal(expectedOutput.Items[i].Azure.Endpoint, conf.Azure.Endpoint)
			assert.Equal(expectedOutput.Items[i].Azure.Region, conf.Azure.Region)
		} else if conf.Type == madmin.TierType(2) {
			// GCS
			assert.Equal(expectedOutput.Items[i].Gcs.Name, conf.Name)
			assert.Equal(expectedOutput.Items[i].Gcs.Bucket, conf.GCS.Bucket)
			assert.Equal(expectedOutput.Items[i].Gcs.Prefix, conf.GCS.Prefix)
			assert.Equal(expectedOutput.Items[i].Gcs.Creds, conf.GCS.Creds)
			assert.Equal(expectedOutput.Items[i].Gcs.Endpoint, conf.GCS.Endpoint)
			assert.Equal(expectedOutput.Items[i].Gcs.Region, conf.GCS.Region)
		}
	}

	// Test-2 : getBucketLifecycle() list is empty
	returnListMockT2 := []*madmin.TierConfig{}

	minioListTiersMock = func(ctx context.Context) ([]*madmin.TierConfig, error) {
		return returnListMockT2, nil
	}

	tiersListT2, err := getTiers(ctx, adminClient)

	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	if len(tiersListT2.Items) != 0 {
		t.Errorf("Failed on %s:, returned list was not empty", function)
	}
}

func TestAddTier(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "addTier()"
	ctx := context.Background()

	// Test-1: addTier() add new Tier
	minioAddTiersMock = func(ctx context.Context, tier *madmin.TierConfig) error {
		return nil
	}

	paramsToAdd := admin_api.AddTierParams{
		Body: &models.Tier{
			Type: "S3",
			S3: &models.TierS3{
				Accesskey:    "TestAK",
				Bucket:       "bucket1",
				Endpoint:     "https://test.com/",
				Name:         "TIERS3",
				Prefix:       "Pr1",
				Region:       "us-west-1",
				Secretkey:    "SecretK",
				Storageclass: "STCLASS",
			},
		},
	}

	err := addTier(ctx, adminClient, &paramsToAdd)
	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-2: addTier() error adding Tier
	minioAddTiersMock = func(ctx context.Context, tier *madmin.TierConfig) error {
		return errors.New("error setting new tier")
	}

	err2 := addTier(ctx, adminClient, &paramsToAdd)

	assert.Equal(errors.New("error setting new tier"), err2, fmt.Sprintf("Failed on %s: Error returned", function))
}

func TestUpdateTierCreds(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "editTierCredentials()"
	ctx := context.Background()

	// Test-1: editTierCredentials() update Tier configuration
	minioEditTiersMock = func(ctx context.Context, tierName string, creds madmin.TierCreds) error {
		return nil
	}

	params := &admin_api.EditTierCredentialsParams{
		Name: "TESTTIER",
		Body: &models.TierCredentialsRequest{
			AccessKey: "New Key",
			SecretKey: "Secret Key",
		},
	}

	err := editTierCredentials(ctx, adminClient, params)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-2: editTierCredentials() update Tier configuration failure
	minioEditTiersMock = func(ctx context.Context, tierName string, creds madmin.TierCreds) error {
		return errors.New("error message")
	}

	errT2 := editTierCredentials(ctx, adminClient, params)

	assert.Equal(errors.New("error message"), errT2, fmt.Sprintf("Failed on %s: Error returned", function))
}

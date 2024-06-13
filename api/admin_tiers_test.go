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

	tieringApi "github.com/minio/console/api/operations/tiering"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
)

func TestGetTiers(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "getTiers()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1 : getTiers() get list of tiers
	// mock lifecycle response from MinIO
	returnListMock := []*madmin.TierConfig{
		{
			Version: "V1",
			Type:    madmin.S3,
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
		{
			Version: "V1",
			Type:    madmin.MinIO,
			Name:    "MinIO Tier",
			MinIO: &madmin.TierMinIO{
				Endpoint:  "https://minio-endpoint.test.com/",
				AccessKey: "access",
				SecretKey: "secret",
				Bucket:    "somebucket",
				Prefix:    "p1",
				Region:    "us-east-2",
			},
		},
	}

	returnStatsMock := []madmin.TierInfo{
		{
			Name:  "STANDARD",
			Type:  "internal",
			Stats: madmin.TierStats{NumObjects: 2, NumVersions: 2, TotalSize: 228915},
		},
		{
			Name:  "MinIO Tier",
			Type:  "internal",
			Stats: madmin.TierStats{NumObjects: 10, NumVersions: 3, TotalSize: 132788},
		},
		{
			Name:  "S3 Tier",
			Type:  "s3",
			Stats: madmin.TierStats{NumObjects: 0, NumVersions: 0, TotalSize: 0},
		},
	}

	expectedOutput := &models.TierListResponse{
		Items: []*models.Tier{
			{
				Type: models.TierTypeS3,
				S3: &models.TierS3{
					Accesskey:    "Access Key",
					Secretkey:    "Secret Key",
					Bucket:       "buckets3",
					Endpoint:     "https://s3tier.test.com/",
					Name:         "S3 Tier",
					Prefix:       "pref1",
					Region:       "us-west-1",
					Storageclass: "TT1",
					Usage:        "0 B",
					Objects:      "0",
					Versions:     "0",
				},
				Status: false,
			},
			{
				Type: models.TierTypeMinio,
				Minio: &models.TierMinio{
					Accesskey: "access",
					Secretkey: "secret",
					Bucket:    "somebucket",
					Endpoint:  "https://minio-endpoint.test.com/",
					Name:      "MinIO Tier",
					Prefix:    "p1",
					Region:    "us-east-2",
					Usage:     "130 KiB",
					Objects:   "10",
					Versions:  "3",
				},
				Status: false,
			},
		},
	}

	minioListTiersMock = func(_ context.Context) ([]*madmin.TierConfig, error) {
		return returnListMock, nil
	}

	minioTierStatsMock = func(_ context.Context) ([]madmin.TierInfo, error) {
		return returnStatsMock, nil
	}

	minioVerifyTierStatusMock = func(_ context.Context, _ string) error {
		return fmt.Errorf("someerror")
	}

	tiersList, err := getTiers(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of tiers list is correct
	assert.Equal(len(tiersList.Items), len(returnListMock), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	assert.Equal(expectedOutput, tiersList)

	// Test-2 : getTiers() list is empty
	returnListMockT2 := []*madmin.TierConfig{}
	minioListTiersMock = func(_ context.Context) ([]*madmin.TierConfig, error) {
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

func TestGetTiersName(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "getTiersName()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1 : getTiersName() get list tiers' names
	// mock lifecycle response from MinIO
	returnListMock := []*madmin.TierConfig{
		{
			Version: "V1",
			Type:    madmin.S3,
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
		{
			Version: "V1",
			Type:    madmin.MinIO,
			Name:    "MinIO Tier",
			MinIO: &madmin.TierMinIO{
				Endpoint:  "https://minio-endpoint.test.com/",
				AccessKey: "access",
				SecretKey: "secret",
				Bucket:    "somebucket",
				Prefix:    "p1",
				Region:    "us-east-2",
			},
		},
	}

	expectedOutput := &models.TiersNameListResponse{
		Items: []string{"S3 Tier", "MinIO Tier"},
	}

	minioListTiersMock = func(_ context.Context) ([]*madmin.TierConfig, error) {
		return returnListMock, nil
	}

	tiersList, err := getTiersName(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of tiers list is correct
	assert.Equal(len(tiersList.Items), len(returnListMock), fmt.Sprintf("Failed on %s: length of lists is not the same", function))
	assert.Equal(expectedOutput, tiersList)

	// Test-2 : getTiersName() list is empty
	returnListMockT2 := []*madmin.TierConfig{}
	minioListTiersMock = func(_ context.Context) ([]*madmin.TierConfig, error) {
		return returnListMockT2, nil
	}

	emptyTierList, err := getTiersName(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	if len(emptyTierList.Items) != 0 {
		t.Errorf("Failed on %s:, returned list was not empty", function)
	}
}

func TestAddTier(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "addTier()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1: addTier() add new Tier
	minioAddTiersMock = func(_ context.Context, _ *madmin.TierConfig) error {
		return nil
	}

	paramsToAdd := tieringApi.AddTierParams{
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
	minioAddTiersMock = func(_ context.Context, _ *madmin.TierConfig) error {
		return errors.New("error setting new tier")
	}

	err2 := addTier(ctx, adminClient, &paramsToAdd)

	assert.Equal(errors.New("error setting new tier"), err2, fmt.Sprintf("Failed on %s: Error returned", function))
}

func TestUpdateTierCreds(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "editTierCredentials()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1: editTierCredentials() update Tier configuration
	minioEditTiersMock = func(_ context.Context, _ string, _ madmin.TierCreds) error {
		return nil
	}

	params := &tieringApi.EditTierCredentialsParams{
		Name: "TESTTIER",
		Body: &models.TierCredentialsRequest{
			AccessKey: "New Key",
			SecretKey: "Secret Key",
		},
	}

	err := editTierCredentials(ctx, adminClient, params)

	assert.Equal(nil, err, fmt.Sprintf("Failed on %s: Error returned", function))

	// Test-2: editTierCredentials() update Tier configuration failure
	minioEditTiersMock = func(_ context.Context, _ string, _ madmin.TierCreds) error {
		return errors.New("error message")
	}

	errT2 := editTierCredentials(ctx, adminClient, params)

	assert.Equal(errors.New("error message"), errT2, fmt.Sprintf("Failed on %s: Error returned", function))
}

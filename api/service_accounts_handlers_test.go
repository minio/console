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
	"time"

	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
)

func TestAddServiceAccount(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "createServiceAccount()"
	// Test-1: createServiceAccount create a service account by assigning it a policy
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	policyDefinition := "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::bucket1/*\"]}]}"
	mockResponse := madmin.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(_ context.Context, _ string, _ string, _ string, _ string, _ string, _ string, _ *time.Time, _ string) (madmin.Credentials, error) {
		return mockResponse, nil
	}
	saCreds, err := createServiceAccount(ctx, client, policyDefinition, "", "", nil, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(mockResponse.AccessKey, saCreds.AccessKey, fmt.Sprintf("Failed on %s:, error occurred: AccessKey differ", function))
	assert.Equal(mockResponse.SecretKey, saCreds.SecretKey, fmt.Sprintf("Failed on %s:, error occurred: SecretKey differ", function))

	// Test-2: if an error occurs on server while creating service account (valid policy), handle it
	policyDefinition = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::bucket1/*\"]}]}"
	mockResponse = madmin.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(_ context.Context, _ string, _ string, _ string, _ string, _ string, _ string, _ *time.Time, _ string) (madmin.Credentials, error) {
		return madmin.Credentials{}, errors.New("error")
	}
	_, err = createServiceAccount(ctx, client, policyDefinition, "", "", nil, "")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestListServiceAccounts(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "getUserServiceAccounts()"

	// Test-1: getUserServiceAccounts list serviceaccounts for a user
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mockResponse := madmin.ListServiceAccountsResp{
		Accounts: []madmin.ServiceAccountInfo{
			{
				AccessKey: "accesskey1",
			}, {
				AccessKey: "accesskey2",
			},
		},
	}
	minioListServiceAccountsMock = func(_ context.Context, _ string) (madmin.ListServiceAccountsResp, error) {
		return mockResponse, nil
	}

	mockInfoResp := madmin.InfoServiceAccountResp{
		ParentUser:    "",
		AccountStatus: "",
		ImpliedPolicy: false,
		Policy:        "",
		Name:          "",
		Description:   "",
		Expiration:    nil,
	}
	minioInfoServiceAccountMock = func(_ context.Context, _ string) (madmin.InfoServiceAccountResp, error) {
		return mockInfoResp, nil
	}
	_, err := getUserServiceAccounts(ctx, client, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: getUserServiceAccounts returns an error, handle it properly
	minioListServiceAccountsMock = func(_ context.Context, _ string) (madmin.ListServiceAccountsResp, error) {
		return madmin.ListServiceAccountsResp{}, errors.New("error")
	}
	_, err = getUserServiceAccounts(ctx, client, "")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestDeleteServiceAccount(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "deleteServiceAccount()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Test-1: deleteServiceAccount receive a service account to delete
	testServiceAccount := "accesskeytest"
	minioDeleteServiceAccountMock = func(_ context.Context, _ string) error {
		return nil
	}
	if err := deleteServiceAccount(ctx, client, testServiceAccount); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: if an invalid policy is assigned to the service account, this will raise an error
	minioDeleteServiceAccountMock = func(_ context.Context, _ string) error {
		return errors.New("error")
	}

	if err := deleteServiceAccount(ctx, client, testServiceAccount); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestGetServiceAccountDetails(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "getServiceAccountDetails()"

	// Test-1: getServiceAccountPolicy list serviceaccounts for a user
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mockResponse := madmin.InfoServiceAccountResp{
		Policy: `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    }
  ]
}`,
	}

	minioInfoServiceAccountMock = func(_ context.Context, _ string) (madmin.InfoServiceAccountResp, error) {
		return mockResponse, nil
	}
	serviceAccount, err := getServiceAccountDetails(ctx, client, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(mockResponse.Policy, serviceAccount.Policy)

	// Test-2: getServiceAccountPolicy returns an error, handle it properly
	minioInfoServiceAccountMock = func(_ context.Context, _ string) (madmin.InfoServiceAccountResp, error) {
		return madmin.InfoServiceAccountResp{}, errors.New("error")
	}
	_, err = getServiceAccountDetails(ctx, client, "")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

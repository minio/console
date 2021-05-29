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
	"fmt"
	"testing"

	"errors"

	"github.com/minio/minio/pkg/auth"
	iampolicy "github.com/minio/minio/pkg/iam/policy"
	"github.com/minio/minio/pkg/madmin"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioAddServiceAccountMock func(ctx context.Context, policy *iampolicy.Policy) (auth.Credentials, error)
var minioListServiceAccountsMock func(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error)
var minioDeleteServiceAccountMock func(ctx context.Context, serviceAccount string) error

// mock function of AddServiceAccount()
func (ac adminClientMock) addServiceAccount(ctx context.Context, policy *iampolicy.Policy) (auth.Credentials, error) {
	return minioAddServiceAccountMock(ctx, policy)
}

// mock function of ListServiceAccounts()
func (ac adminClientMock) listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
	return minioListServiceAccountsMock(ctx, user)
}

// mock function of DeleteServiceAccount()
func (ac adminClientMock) deleteServiceAccount(ctx context.Context, serviceAccount string) error {
	return minioDeleteServiceAccountMock(ctx, serviceAccount)
}

func TestAddServiceAccount(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := adminClientMock{}
	function := "createServiceAccount()"
	// Test-1: createServiceAccount create a service account by assigning it a policy
	ctx := context.Background()
	policyDefinition := "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::bucket1/*\"]}]}"
	mockResponse := auth.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(ctx context.Context, policy *iampolicy.Policy) (auth.Credentials, error) {
		return mockResponse, nil
	}
	saCreds, err := createServiceAccount(ctx, client, policyDefinition)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(mockResponse.AccessKey, saCreds.AccessKey, fmt.Sprintf("Failed on %s:, error occurred: AccessKey differ", function))
	assert.Equal(mockResponse.SecretKey, saCreds.SecretKey, fmt.Sprintf("Failed on %s:, error occurred: SecretKey differ", function))

	// Test-2: if an invalid policy is assigned to the service account, this will raise an error
	policyDefinition = "invalid policy"
	mockResponse = auth.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(ctx context.Context, policy *iampolicy.Policy) (auth.Credentials, error) {
		return mockResponse, nil
	}
	saCreds, err = createServiceAccount(ctx, client, policyDefinition)
	assert.Error(err)

	// Test-3: if an error occurs on server while creating service account (valid policy), handle it
	policyDefinition = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::bucket1/*\"]}]}"
	mockResponse = auth.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(ctx context.Context, policy *iampolicy.Policy) (auth.Credentials, error) {
		return auth.Credentials{}, errors.New("error")
	}
	_, err = createServiceAccount(ctx, client, policyDefinition)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestListServiceAccounts(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := adminClientMock{}
	function := "getUserServiceAccounts()"

	// Test-1: getUserServiceAccounts list serviceaccounts for a user
	ctx := context.Background()
	mockResponse := madmin.ListServiceAccountsResp{
		Accounts: []string{"accesskey1", "accesskey2"},
	}
	minioListServiceAccountsMock = func(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
		return mockResponse, nil
	}
	serviceAccounts, err := getUserServiceAccounts(ctx, client, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	for i, sa := range serviceAccounts {
		assert.Equal(mockResponse.Accounts[i], sa)
	}

	// Test-2: getUserServiceAccounts returns an error, handle it properly
	minioListServiceAccountsMock = func(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
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
	client := adminClientMock{}
	function := "deleteServiceAccount()"
	ctx := context.Background()

	// Test-1: deleteServiceAccount receive a service account to delete
	testServiceAccount := "accesskeytest"
	minioDeleteServiceAccountMock = func(ctx context.Context, serviceAccount string) error {
		return nil
	}
	if err := deleteServiceAccount(ctx, client, testServiceAccount); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: if an invalid policy is assigned to the service account, this will raise an error
	minioDeleteServiceAccountMock = func(ctx context.Context, serviceAccount string) error {
		return errors.New("error")
	}

	if err := deleteServiceAccount(ctx, client, testServiceAccount); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

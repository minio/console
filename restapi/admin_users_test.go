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
	"context"
	"fmt"
	"testing"

	"github.com/minio/minio/pkg/madmin"

	"errors"

	asrt "github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioListUsersMock func() (map[string]madmin.UserInfo, error)
var minioAddUserMock func(accessKey, secreyKey string) error
var minioRemoveUserMock func(accessKey string) error

// mock function of listUsers()
func (ac adminClientMock) listUsers(ctx context.Context) (map[string]madmin.UserInfo, error) {
	return minioListUsersMock()
}

// mock function of addUser()
func (ac adminClientMock) addUser(ctx context.Context, accessKey, secretKey string) error {
	return minioAddUserMock(accessKey, secretKey)
}

// mock function of removeUser()
func (ac adminClientMock) removeUser(ctx context.Context, accessKey string) error {
	return minioRemoveUserMock(accessKey)
}

func TestListUsers(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()
	// Test-1 : listUsers() Get response from minio client with two users and return the same number on listUsers()
	// mock minIO client
	mockUserMap := map[string]madmin.UserInfo{
		"ABCDEFGHI": madmin.UserInfo{
			SecretKey:  "",
			PolicyName: "ABCDEFGHI-policy",
			Status:     "enabled",
			MemberOf:   []string{"group1", "group2"},
		},
		"ZBCDEFGHI": madmin.UserInfo{
			SecretKey:  "",
			PolicyName: "ZBCDEFGHI-policy",
			Status:     "enabled",
			MemberOf:   []string{"group1", "group2"},
		},
	}

	// mock function response from listUsersWithContext(ctx)
	minioListUsersMock = func() (map[string]madmin.UserInfo, error) {
		return mockUserMap, nil
	}
	// get list users response this response should have Name, CreationDate, Size and Access
	// as part of of each user
	function := "listUsers()"
	userMap, err := listUsers(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of users is correct
	assert.Equal(len(mockUserMap), len(userMap), fmt.Sprintf("Failed on %s: length of user's lists is not the same", function))

	for _, b := range userMap {
		assert.Contains(mockUserMap, b.AccessKey)
		assert.Equal(string(mockUserMap[b.AccessKey].Status), b.Status)
		assert.Equal(mockUserMap[b.AccessKey].PolicyName, b.Policy)
		assert.ElementsMatch(mockUserMap[b.AccessKey].MemberOf, []string{"group1", "group2"})
	}

	// Test-2 : listUsers() Return and see that the error is handled correctly and returned
	minioListUsersMock = func() (map[string]madmin.UserInfo, error) {
		return nil, errors.New("error")
	}
	_, err = listUsers(ctx, adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestAddUser(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()
	// Test-1: valid case of adding a user with a proper access key
	accessKey := "ABCDEFGHI"
	secretKey := "ABCDEFGHIABCDEFGHI"

	// mock function response from addUser() return no error
	minioAddUserMock = func(accessKey, secretKey string) error {
		return nil
	}
	// adds a valid user to MinIO
	function := "addUser()"
	user, err := addUser(ctx, adminClient, &accessKey, &secretKey)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// no error should have been returned
	assert.Nil(err, "Error is not null")
	// the same access key should be in the model users
	assert.Equal(user.AccessKey, accessKey)
	// Test-1: valid case
	accessKey = "AB"
	secretKey = "ABCDEFGHIABCDEFGHI"

	// mock function response from addUser() return no error
	minioAddUserMock = func(accessKey, secretKey string) error {
		return errors.New("error")
	}

	user, err = addUser(ctx, adminClient, &accessKey, &secretKey)

	// no error should have been returned
	assert.Nil(user, "User is not null")
	assert.NotNil(err, "An error should have been returned")

	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestRemoveUser(t *testing.T) {
	assert := asrt.New(t)
	// mock minIO client
	adminClient := adminClientMock{}
	ctx := context.Background()
	function := "removeUser()"

	// Test-1: removeUser() delete a user
	// mock function response from removeUser(accessKey)
	minioRemoveUserMock = func(accessKey string) error {
		return nil
	}

	if err := removeUser(ctx, adminClient, "ABCDEFGHI"); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: removeUser() make sure errors are handled correctly when error on DeleteUser()
	// mock function response from removeUser(accessKey)
	minioRemoveUserMock = func(accessKey string) error {
		return errors.New("error")
	}

	if err := removeUser(ctx, adminClient, "notexistentuser"); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

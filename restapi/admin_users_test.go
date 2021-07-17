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
	"bytes"
	"context"
	"errors"
	"fmt"
	"strings"
	"testing"

	"github.com/minio/madmin-go"
	iampolicy "github.com/minio/pkg/iam/policy"
	asrt "github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioListUsersMock func() (map[string]madmin.UserInfo, error)
var minioAddUserMock func(accessKey, secreyKey string) error
var minioRemoveUserMock func(accessKey string) error
var minioGetUserInfoMock func(accessKey string) (madmin.UserInfo, error)
var minioSetUserStatusMock func(accessKey string, status madmin.AccountStatus) error

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

//mock function of getUserInfo()
func (ac adminClientMock) getUserInfo(ctx context.Context, accessKey string) (madmin.UserInfo, error) {
	return minioGetUserInfoMock(accessKey)
}

//mock function of setUserStatus()
func (ac adminClientMock) setUserStatus(ctx context.Context, accessKey string, status madmin.AccountStatus) error {
	return minioSetUserStatusMock(accessKey, status)
}

func TestListUsers(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()
	// Test-1 : listUsers() Get response from minio client with two users and return the same number on listUsers()
	// mock minIO client
	mockUserMap := map[string]madmin.UserInfo{
		"ABCDEFGHI": {
			SecretKey:  "",
			PolicyName: "ABCDEFGHI-policy",
			Status:     "enabled",
			MemberOf:   []string{"group1", "group2"},
		},
		"ZBCDEFGHI": {
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
		assert.Equal(mockUserMap[b.AccessKey].PolicyName, strings.Join(b.Policy, ","))
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
	groups := []string{"group1", "group2", "group3"}
	emptyGroupTest := []string{}
	mockResponse := &madmin.UserInfo{
		MemberOf:   []string{"group1", "group2", "gropup3"},
		PolicyName: "",
		Status:     "enabled",
		SecretKey:  "",
	}

	// mock function response from addUser() return no error
	minioAddUserMock = func(accessKey, secretKey string) error {
		return nil
	}

	minioGetUserInfoMock = func(accessKey string) (madmin.UserInfo, error) {
		return *mockResponse, nil
	}

	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return nil
	}
	// Test-1: Add a user
	function := "addUser()"
	user, err := addUser(ctx, adminClient, &accessKey, &secretKey, groups)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// no error should have been returned
	assert.Nil(err, "Error is not null")
	// the same access key should be in the model users
	assert.Equal(user.AccessKey, accessKey)

	// Test-2 Add a user with empty groups list
	user, err = addUser(ctx, adminClient, &accessKey, &secretKey, emptyGroupTest)
	// no error should have been returned
	assert.Nil(err, "Error is not null")
	// the same access key should be in the model users
	assert.Equal(user.AccessKey, accessKey)

	// Test-3: valid case
	accessKey = "AB"
	secretKey = "ABCDEFGHIABCDEFGHI"
	// mock function response from addUser() return no error
	minioAddUserMock = func(accessKey, secretKey string) error {
		return errors.New("error")
	}

	user, err = addUser(ctx, adminClient, &accessKey, &secretKey, groups)

	// no error should have been returned
	assert.Nil(user, "User is not null")
	assert.NotNil(err, "An error should have been returned")

	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-4: add groups function returns an error
	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return errors.New("error")
	}

	user, err = addUser(ctx, adminClient, &accessKey, &secretKey, groups)

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

func TestUserGroups(t *testing.T) {
	assert := asrt.New(t)
	// mock minIO client
	adminClient := adminClientMock{}
	ctx := context.Background()

	function := "updateUserGroups()"
	mockUserGroups := []string{"group1", "group2", "group3"}
	mockUserName := "testUser"
	mockResponse := &madmin.UserInfo{
		MemberOf:   []string{"group1", "group2", "gropup3"},
		PolicyName: "",
		Status:     "enabled",
		SecretKey:  mockUserName,
	}
	mockEmptyResponse := &madmin.UserInfo{
		MemberOf:   nil,
		PolicyName: "",
		Status:     "",
		SecretKey:  "",
	}

	// Test-1: updateUserGroups() updates the groups for a user
	// mock function response from updateUserGroups(accessKey, groupsToAssign)

	minioGetUserInfoMock = func(accessKey string) (madmin.UserInfo, error) {
		return *mockResponse, nil
	}

	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return nil
	}

	if _, err := updateUserGroups(ctx, adminClient, mockUserName, mockUserGroups); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: updateUserGroups() make sure errors are handled correctly when error on UpdateGroupMembersMock()
	// mock function response from removeUser(accessKey)

	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return errors.New("error")
	}

	if _, err := updateUserGroups(ctx, adminClient, mockUserName, mockUserGroups); assert.Error(err) {
		assert.Equal("there was an error updating the groups", err.Error())
	}

	// Test-3: updateUserGroups() make sure we return the correct error when getUserInfo returns error
	minioGetUserInfoMock = func(accessKey string) (madmin.UserInfo, error) {
		return *mockEmptyResponse, errors.New("error getting user ")
	}

	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return nil
	}

	if _, err := updateUserGroups(ctx, adminClient, mockUserName, mockUserGroups); assert.Error(err) {
		assert.Equal("error getting user ", err.Error())
	}
}

func TestGetUserInfo(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()

	// Test-1 : getUserInfo() get user info
	userName := "userNameTest"
	mockResponse := &madmin.UserInfo{
		SecretKey:  userName,
		PolicyName: "",
		MemberOf:   []string{"group1", "group2", "group3"},
		Status:     "enabled",
	}
	emptyMockResponse := &madmin.UserInfo{
		SecretKey:  "",
		PolicyName: "",
		Status:     "",
		MemberOf:   nil,
	}

	// mock function response from getUserInfo()
	minioGetUserInfoMock = func(username string) (madmin.UserInfo, error) {
		return *mockResponse, nil
	}
	function := "getUserInfo()"
	info, err := getUserInfo(ctx, adminClient, userName)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	assert.Equal(userName, info.SecretKey)
	assert.Equal("", info.PolicyName)
	assert.ElementsMatch([]string{"group1", "group2", "group3"}, info.MemberOf)
	assert.Equal(mockResponse.Status, info.Status)

	// Test-2 : getUserInfo() Return error and see that the error is handled correctly and returned
	minioGetUserInfoMock = func(username string) (madmin.UserInfo, error) {
		return *emptyMockResponse, errors.New("error")
	}
	_, err = getUserInfo(ctx, adminClient, userName)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestSetUserStatus(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	function := "setUserStatus()"
	userName := "userName123"
	ctx := context.Background()

	// Test-1: setUserStatus() update valid disabled status
	expectedStatus := "disabled"
	minioSetUserStatusMock = func(accessKey string, status madmin.AccountStatus) error {
		return nil
	}
	if err := setUserStatus(ctx, adminClient, userName, expectedStatus); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2: setUserStatus() update valid enabled status
	expectedStatus = "enabled"
	minioSetUserStatusMock = func(accessKey string, status madmin.AccountStatus) error {
		return nil
	}
	if err := setUserStatus(ctx, adminClient, userName, expectedStatus); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-3: setUserStatus() update invalid status, should send error
	expectedStatus = "invalid"
	minioSetUserStatusMock = func(accessKey string, status madmin.AccountStatus) error {
		return nil
	}
	if err := setUserStatus(ctx, adminClient, userName, expectedStatus); assert.Error(err) {
		assert.Equal("status not valid", err.Error())
	}
	// Test-4: setUserStatus() handler error correctly
	expectedStatus = "enabled"
	minioSetUserStatusMock = func(accessKey string, status madmin.AccountStatus) error {
		return errors.New("error")
	}
	if err := setUserStatus(ctx, adminClient, userName, expectedStatus); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestUserGroupsBulk(t *testing.T) {
	assert := asrt.New(t)
	// mock minIO client
	adminClient := adminClientMock{}
	ctx := context.Background()

	function := "updateUserGroups()"
	mockUserGroups := []string{"group1", "group2", "group3"}
	mockUsers := []string{"testUser", "testUser2"}

	// Test-1: addUsersListToGroups() updates the groups for a users list
	// mock function response from updateUserGroups(accessKey, groupsToAssign)
	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return nil
	}

	if err := addUsersListToGroups(ctx, adminClient, mockUsers, mockUserGroups); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: addUsersListToGroups() make sure errors are handled correctly when error on updateGroupMembers()
	// mock function response from removeUser(accessKey)
	minioUpdateGroupMembersMock = func(remove madmin.GroupAddRemove) error {
		return errors.New("error")
	}

	if err := addUsersListToGroups(ctx, adminClient, mockUsers, mockUserGroups); assert.Error(err) {
		assert.Equal("error in users-groups assignation: \"error,error,error\"", err.Error())
	}
}

func TestListUsersWithAccessToBucket(t *testing.T) {
	assert := asrt.New(t)
	ctx := context.Background()
	adminClient := adminClientMock{}
	user1 := madmin.UserInfo{SecretKey: "testtest",
		PolicyName: "consoleAdmin,testPolicy,redundantPolicy",
		Status:     "enabled",
		MemberOf:   []string{"group1"},
	}
	user2 := madmin.UserInfo{SecretKey: "testtest",
		PolicyName: "testPolicy, otherPolicy",
		Status:     "enabled",
		MemberOf:   []string{"group1"},
	}
	mockUsers := map[string]madmin.UserInfo{"testuser1": user1, "testuser2": user2}
	minioListUsersMock = func() (map[string]madmin.UserInfo, error) {
		return mockUsers, nil
	}
	policyMap := map[string]string{
		"consoleAdmin": `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "admin:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::*"
            ]
        }
    ]
}`,
		"testPolicy": `{
				"Version": "2012-10-17",
				"Statement": [
			{
				"Effect": "Deny",
				"Action": [
				"s3:*"
			],
				"Resource": [
				"arn:aws:s3:::bucket1"
			]
			}
			]
			}`,
		"otherPolicy": `{
				"Version": "2012-10-17",
				"Statement": [
			{
				"Effect": "Allow",
				"Action": [
				"s3:*"
			],
				"Resource": [
				"arn:aws:s3:::bucket2"
			]
			}
			]
			}`,
		"thirdPolicy": `{
				"Version": "2012-10-17",
				"Statement": [
			{
				"Effect": "Allow",
				"Action": [
				"s3:*"
			],
				"Resource": [
				"arn:aws:s3:::bucket3"
			]
			}
			]
			}`, "RedundantPolicy": `{
				"Version": "2012-10-17",
				"Statement": [
			{
				"Effect": "Allow",
				"Action": [
				"s3:*"
			],
				"Resource": [
				"arn:aws:s3:::bucket1"
			]
			}
			]
			}`,
	}
	minioGetPolicyMock = func(name string) (*iampolicy.Policy, error) {
		iamp, err := iampolicy.ParseConfig(bytes.NewReader([]byte(policyMap[name])))
		if err != nil {
			return nil, err
		}
		return iamp, nil
	}
	minioListGroupsMock = func() ([]string, error) {
		return []string{"group1"}, nil
	}
	minioGetGroupDescriptionMock = func(name string) (*madmin.GroupDesc, error) {
		if name == "group1" {
			mockResponse := &madmin.GroupDesc{
				Name:    "group1",
				Policy:  "thirdPolicy",
				Members: []string{"testuser1", "testuser2"},
				Status:  "enabled",
			}
			return mockResponse, nil
		}
		return nil, ErrorGeneric
	}
	type args struct {
		bucket string
	}
	tests := []struct {
		name string
		args args
		want []string
	}{
		{
			name: "Test1",
			args: args{bucket: "bucket0"},
			want: []string{"testuser1"},
		},
		{
			name: "Test2",
			args: args{bucket: "bucket1"},
			want: []string(nil),
		},
		{
			name: "Test3",
			args: args{bucket: "bucket2"},
			want: []string{"testuser1", "testuser2"},
		},
		{
			name: "Test4",
			args: args{bucket: "bucket3"},
			want: []string{"testuser1", "testuser2"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, _ := listUsersWithAccessToBucket(ctx, adminClient, tt.args.bucket)
			assert.Equal(got, tt.want)
		})
	}

}

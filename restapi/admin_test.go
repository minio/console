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
	"context"
	"fmt"
	"testing"

	"github.com/minio/minio/pkg/madmin"

	"errors"

	"github.com/stretchr/testify/assert"
	asrt "github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioListUsersMock func() (map[string]madmin.UserInfo, error)
var minioAddUserMock func(accessKey, secreyKey string) error
var minioListGroupsMock func() ([]string, error)
var minioUpdateGroupMembersMock func(madmin.GroupAddRemove) error
var minioGetGroupDescriptionMock func(group string) (*madmin.GroupDesc, error)
var minioSetGroupStatusMock func(group string, status madmin.GroupStatus) error

// Define a mock struct of Admin Client interface implementation
type adminClientMock struct{}

// mock function of listUsers()
func (ac adminClientMock) listUsers(ctx context.Context) (map[string]madmin.UserInfo, error) {
	return minioListUsersMock()
}

// mock function of addUser()
func (ac adminClientMock) addUser(ctx context.Context, accessKey, secretKey string) error {
	return minioAddUserMock(accessKey, secretKey)
}

// mock function of listGroups()
func (ac adminClientMock) listGroups(ctx context.Context) ([]string, error) {
	return minioListGroupsMock()
}

// mock function of updateGroupMembers()
func (ac adminClientMock) updateGroupMembers(ctx context.Context, req madmin.GroupAddRemove) error {
	return minioUpdateGroupMembersMock(req)
}

// mock function of getGroupDescription()
func (ac adminClientMock) getGroupDescription(ctx context.Context, group string) (*madmin.GroupDesc, error) {
	return minioGetGroupDescriptionMock(group)
}

// mock function setGroupStatus()
func (ac adminClientMock) setGroupStatus(ctx context.Context, group string, status madmin.GroupStatus) error {
	return minioSetGroupStatusMock(group, status)
}

func TestListUsers(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
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
	userMap, err := listUsers(adminClient)
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
	_, err = listUsers(adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestAddUser(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}

	// Test-1: valid case of adding a user with a proper access key
	accessKey := "ABCDEFGHI"
	secretKey := "ABCDEFGHIABCDEFGHI"

	// mock function response from addUser() return no error
	minioAddUserMock = func(accessKey, secretKey string) error {
		return nil
	}
	// adds a valid user to MinIO
	function := "addUser()"
	user, err := addUser(adminClient, &accessKey, &secretKey)
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

	user, err = addUser(adminClient, &accessKey, &secretKey)

	// no error should have been returned
	assert.Nil(user, "User is not null")
	assert.NotNil(err, "An error should have been returned")

	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestListGroups(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()

	// Test-1 : listGroups() Get response from minio client with two Groups and return the same number on listGroups()
	mockGroupsList := []string{"group1", "group2"}

	// mock function response from listGroups()
	minioListGroupsMock = func() ([]string, error) {
		return mockGroupsList, nil
	}
	// get list Groups response this response should have Name, CreationDate, Size and Access
	// as part of of each Groups
	function := "listGroups()"
	groupsList, err := listGroups(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of Groupss is correct
	assert.Equal(len(mockGroupsList), len(*groupsList), fmt.Sprintf("Failed on %s: length of Groups's lists is not the same", function))

	for i, g := range *groupsList {
		assert.Equal(mockGroupsList[i], g)
	}

	// Test-2 : listGroups() Return error and see that the error is handled correctly and returned
	minioListGroupsMock = func() ([]string, error) {
		return nil, errors.New("error")
	}
	_, err = listGroups(ctx, adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestAddGroup(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()

	// Test-1 : addGroup() add a new group with two members
	newGroup := "acmeGroup"
	groupMembers := []string{"user1", "user2"}
	// mock function response from updateGroupMembers()
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return nil
	}
	function := "addGroup()"
	if err := addGroup(ctx, adminClient, newGroup, groupMembers); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 : addGroup() Return error and see that the error is handled correctly and returned
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return errors.New("error")
	}

	if err := addGroup(ctx, adminClient, newGroup, groupMembers); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestRemoveGroup(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()

	// Test-1 : removeGroup() remove group assume it has no members
	groupToRemove := "acmeGroup"
	// mock function response from updateGroupMembers()
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return nil
	}
	function := "removeGroup()"
	if err := removeGroup(ctx, adminClient, groupToRemove); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 : removeGroup() Return error and see that the error is handled correctly and returned
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return errors.New("error")
	}
	if err := removeGroup(ctx, adminClient, groupToRemove); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestGroupInfo(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()

	// Test-1 : groupInfo() get group info
	groupName := "acmeGroup"
	mockResponse := &madmin.GroupDesc{
		Name:    groupName,
		Policy:  "policyTest",
		Members: []string{"user1", "user2"},
		Status:  "enabled",
	}
	// mock function response from updateGroupMembers()
	minioGetGroupDescriptionMock = func(group string) (*madmin.GroupDesc, error) {
		return mockResponse, nil
	}
	function := "groupInfo()"
	info, err := groupInfo(ctx, adminClient, groupName)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(groupName, info.Name)
	assert.Equal("policyTest", info.Policy)
	assert.ElementsMatch([]string{"user1", "user2"}, info.Members)
	assert.Equal("enabled", info.Status)

	// Test-2 : groupInfo() Return error and see that the error is handled correctly and returned
	minioGetGroupDescriptionMock = func(group string) (*madmin.GroupDesc, error) {
		return nil, errors.New("error")
	}
	_, err = groupInfo(ctx, adminClient, groupName)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestUpdateGroupInfo(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()

	// Test-1 : addOrDeleteMembers()  update group members add user3 and delete user2
	function := "addOrDeleteMembers()"
	groupName := "acmeGroup"
	mockGroupDesc := &madmin.GroupDesc{
		Name:    groupName,
		Policy:  "policyTest",
		Members: []string{"user1", "user2"},
		Status:  "enabled",
	}
	membersDesired := []string{"user3", "user1"}
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return nil
	}
	if err := addOrDeleteMembers(ctx, adminClient, mockGroupDesc, membersDesired); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 : addOrDeleteMembers()  handle error correctly
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return errors.New("error")
	}
	if err := addOrDeleteMembers(ctx, adminClient, mockGroupDesc, membersDesired); assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-3 : addOrDeleteMembers()  only add members but handle error on adding
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return errors.New("error")
	}
	membersDesired = []string{"user3", "user1", "user2"}
	if err := addOrDeleteMembers(ctx, adminClient, mockGroupDesc, membersDesired); assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-4: addOrDeleteMembers() no updates needed so error shall not be triggered or handled.
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return errors.New("error")
	}
	membersDesired = []string{"user1", "user2"}
	if err := addOrDeleteMembers(ctx, adminClient, mockGroupDesc, membersDesired); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
}

func TestSetGroupStatus(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	function := "setGroupStatus()"
	groupName := "acmeGroup"
	ctx := context.Background()

	// Test-1: setGroupStatus() update valid disabled status
	expectedStatus := "disabled"
	minioSetGroupStatusMock = func(group string, status madmin.GroupStatus) error {
		return nil
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2: setGroupStatus() update valid enabled status
	expectedStatus = "enabled"
	minioSetGroupStatusMock = func(group string, status madmin.GroupStatus) error {
		return nil
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-3: setGroupStatus() update invalid status, should send error
	expectedStatus = "invalid"
	minioSetGroupStatusMock = func(group string, status madmin.GroupStatus) error {
		return nil
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); assert.Error(err) {
		assert.Equal("status not valid", err.Error())
	}
	// Test-4: setGroupStatus() handler error correctly
	expectedStatus = "enabled"
	minioSetGroupStatusMock = func(group string, status madmin.GroupStatus) error {
		return errors.New("error")
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

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

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
)

func TestListGroups(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1 : listGroups() Get response from minio client with two Groups and return the same number on listGroups()
	mockGroupsList := []string{"group1", "group2"}

	// mock function response from listGroups()
	minioListGroupsMock = func() ([]string, error) {
		return mockGroupsList, nil
	}
	// get list Groups response this response should have Name, CreationDate, Size and Access
	// as part of of each Groups
	function := "listGroups()"
	groupsList, err := adminClient.listGroups(ctx)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of Groupss is correct
	assert.Equal(len(mockGroupsList), len(groupsList), fmt.Sprintf("Failed on %s: length of Groups's lists is not the same", function))

	for i, g := range groupsList {
		assert.Equal(mockGroupsList[i], g)
	}

	// Test-2 : listGroups() Return error and see that the error is handled correctly and returned
	minioListGroupsMock = func() ([]string, error) {
		return nil, errors.New("error")
	}
	_, err = adminClient.listGroups(ctx)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestAddGroup(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
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
	adminClient := AdminClientMock{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
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
	adminClient := AdminClientMock{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1 : groupInfo() get group info
	groupName := "acmeGroup"
	mockResponse := &madmin.GroupDesc{
		Name:    groupName,
		Policy:  "policyTest",
		Members: []string{"user1", "user2"},
		Status:  "enabled",
	}
	// mock function response from updateGroupMembers()
	minioGetGroupDescriptionMock = func(_ string) (*madmin.GroupDesc, error) {
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
	minioGetGroupDescriptionMock = func(_ string) (*madmin.GroupDesc, error) {
		return nil, errors.New("error")
	}
	_, err = groupInfo(ctx, adminClient, groupName)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestUpdateGroup(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
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

	// Test-5 : groupUpdate() integrate all from getting current group to update it and see if it changed.
	// This test mocks one function twice and makes sure it returns different content on each call.
	function = "groupUpdate()"
	groupName = "acmeGroup"
	membersDesired = []string{"user1", "user2", "user3"}
	expectedGroupUpdate := &models.UpdateGroupRequest{
		Members: membersDesired,
		Status:  swag.String("disabled"),
	}
	mockResponseBeforeUpdate := &madmin.GroupDesc{
		Name:    groupName,
		Policy:  "policyTest",
		Members: []string{"user1", "user2"},
		Status:  "enabled",
	}
	mockResponseAfterUpdate := &madmin.GroupDesc{
		Name:    groupName,
		Policy:  "policyTest",
		Members: []string{"user1", "user2", "user3"},
		Status:  "disabled",
	}
	// groupUpdate uses getInfo() twice which uses getGroupDescription() so we need to mock as if it called
	// the function twice but the second time returned an error
	is2ndRunGroupInfo := false
	// mock function response from updateGroupMembers()
	minioGetGroupDescriptionMock = func(_ string) (*madmin.GroupDesc, error) {
		if is2ndRunGroupInfo {
			return mockResponseAfterUpdate, nil
		}
		is2ndRunGroupInfo = true
		return mockResponseBeforeUpdate, nil
	}
	minioUpdateGroupMembersMock = func(madmin.GroupAddRemove) error {
		return nil
	}
	minioSetGroupStatusMock = func(_ string, _ madmin.GroupStatus) error {
		return nil
	}
	groupUpdated, err := groupUpdate(ctx, adminClient, groupName, expectedGroupUpdate)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// assert elements were updated as expected
	assert.ElementsMatch(membersDesired, groupUpdated.Members)
	assert.Equal(groupName, groupUpdated.Name)
	assert.Equal(*expectedGroupUpdate.Status, groupUpdated.Status)
}

func TestSetGroupStatus(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	function := "setGroupStatus()"
	groupName := "acmeGroup"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Test-1: setGroupStatus() update valid disabled status
	expectedStatus := "disabled"
	minioSetGroupStatusMock = func(_ string, _ madmin.GroupStatus) error {
		return nil
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2: setGroupStatus() update valid enabled status
	expectedStatus = "enabled"
	minioSetGroupStatusMock = func(_ string, _ madmin.GroupStatus) error {
		return nil
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-3: setGroupStatus() update invalid status, should send error
	expectedStatus = "invalid"
	minioSetGroupStatusMock = func(_ string, _ madmin.GroupStatus) error {
		return nil
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); assert.Error(err) {
		assert.Equal("status not valid", err.Error())
	}
	// Test-4: setGroupStatus() handler error correctly
	expectedStatus = "enabled"
	minioSetGroupStatusMock = func(_ string, _ madmin.GroupStatus) error {
		return errors.New("error")
	}
	if err := setGroupStatus(ctx, adminClient, groupName, expectedStatus); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

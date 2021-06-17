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

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/madmin-go"

	"github.com/minio/console/restapi/operations/admin_api"

	"github.com/minio/console/models"
)

func registerGroupsHandlers(api *operations.ConsoleAPI) {
	// List Groups
	api.AdminAPIListGroupsHandler = admin_api.ListGroupsHandlerFunc(func(params admin_api.ListGroupsParams, session *models.Principal) middleware.Responder {
		listGroupsResponse, err := getListGroupsResponse(session)
		if err != nil {
			return admin_api.NewListGroupsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListGroupsOK().WithPayload(listGroupsResponse)
	})
	// Group Info
	api.AdminAPIGroupInfoHandler = admin_api.GroupInfoHandlerFunc(func(params admin_api.GroupInfoParams, session *models.Principal) middleware.Responder {
		groupInfo, err := getGroupInfoResponse(session, params)
		if err != nil {
			return admin_api.NewGroupInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGroupInfoOK().WithPayload(groupInfo)
	})
	// Add Group
	api.AdminAPIAddGroupHandler = admin_api.AddGroupHandlerFunc(func(params admin_api.AddGroupParams, session *models.Principal) middleware.Responder {
		if err := getAddGroupResponse(session, params.Body); err != nil {
			return admin_api.NewAddGroupDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAddGroupCreated()
	})
	// Remove Group
	api.AdminAPIRemoveGroupHandler = admin_api.RemoveGroupHandlerFunc(func(params admin_api.RemoveGroupParams, session *models.Principal) middleware.Responder {
		if err := getRemoveGroupResponse(session, params); err != nil {
			return admin_api.NewRemoveGroupDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewRemoveGroupNoContent()
	})
	// Update Group
	api.AdminAPIUpdateGroupHandler = admin_api.UpdateGroupHandlerFunc(func(params admin_api.UpdateGroupParams, session *models.Principal) middleware.Responder {
		groupUpdateResp, err := getUpdateGroupResponse(session, params)
		if err != nil {
			return admin_api.NewUpdateGroupDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewUpdateGroupOK().WithPayload(groupUpdateResp)
	})
}

// getListGroupsResponse performs listGroups() and serializes it to the handler's output
func getListGroupsResponse(session *models.Principal) (*models.ListGroupsResponse, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	groups, err := adminClient.listGroups(ctx)
	if err != nil {
		return nil, prepareError(err)
	}

	// serialize output
	listGroupsResponse := &models.ListGroupsResponse{
		Groups: groups,
		Total:  int64(len(groups)),
	}

	return listGroupsResponse, nil
}

// groupInfo calls MinIO server get Group's info
func groupInfo(ctx context.Context, client MinioAdmin, group string) (*madmin.GroupDesc, error) {
	groupDesc, err := client.getGroupDescription(ctx, group)
	if err != nil {
		return nil, err
	}
	return groupDesc, nil
}

// getGroupInfoResponse performs groupInfo() and serializes it to the handler's output
func getGroupInfoResponse(session *models.Principal, params admin_api.GroupInfoParams) (*models.Group, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	groupDesc, err := groupInfo(ctx, adminClient, params.Name)
	if err != nil {
		return nil, prepareError(err)
	}

	groupResponse := &models.Group{
		Members: groupDesc.Members,
		Name:    groupDesc.Name,
		Policy:  groupDesc.Policy,
		Status:  groupDesc.Status}

	return groupResponse, nil
}

// addGroupAdd a MinIO group with the defined members
func addGroup(ctx context.Context, client MinioAdmin, group string, members []string) error {
	gAddRemove := madmin.GroupAddRemove{
		Group:    group,
		Members:  members,
		IsRemove: false,
	}
	err := client.updateGroupMembers(ctx, gAddRemove)
	if err != nil {
		return err
	}
	return nil
}

// getAddGroupResponse performs addGroup() and serializes it to the handler's output
func getAddGroupResponse(session *models.Principal, params *models.AddGroupRequest) *models.Error {
	ctx := context.Background()
	// AddGroup request needed to proceed
	if params == nil {
		return prepareError(errGroupBodyNotInRequest)
	}

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := addGroup(ctx, adminClient, *params.Group, params.Members); err != nil {
		return prepareError(err)
	}
	return nil
}

// removeGroup deletes a minIO group only if it has no members
func removeGroup(ctx context.Context, client MinioAdmin, group string) error {
	gAddRemove := madmin.GroupAddRemove{
		Group:    group,
		Members:  []string{},
		IsRemove: true,
	}
	err := client.updateGroupMembers(ctx, gAddRemove)
	if err != nil {
		return err
	}
	return nil
}

// getRemoveGroupResponse performs removeGroup() and serializes it to the handler's output
func getRemoveGroupResponse(session *models.Principal, params admin_api.RemoveGroupParams) *models.Error {
	ctx := context.Background()

	if params.Name == "" {
		return prepareError(errGroupNameNotInRequest)
	}
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// createad a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := removeGroup(ctx, adminClient, params.Name); err != nil {
		return prepareError(err)
	}
	return nil
}

// updateGroup updates a group by adding/removing members and setting the status to the desired one
//
// isRemove: whether remove members or not
func updateGroupMembers(ctx context.Context, client MinioAdmin, group string, members []string, isRemove bool) error {
	gAddRemove := madmin.GroupAddRemove{
		Group:    group,
		Members:  members,
		IsRemove: isRemove,
	}
	err := client.updateGroupMembers(ctx, gAddRemove)
	if err != nil {
		return err
	}
	return nil
}

// addOrDeleteMembers updates a group members by adding or deleting them based on the expectedMembers
func addOrDeleteMembers(ctx context.Context, client MinioAdmin, group *madmin.GroupDesc, expectedMembers []string) error {
	// get members to delete/add
	membersToDelete := DifferenceArrays(group.Members, expectedMembers)
	membersToAdd := DifferenceArrays(expectedMembers, group.Members)
	// delete members if any to be deleted
	if len(membersToDelete) > 0 {
		err := updateGroupMembers(ctx, client, group.Name, membersToDelete, true)
		if err != nil {
			return err
		}
	}
	// add members if any to be added
	if len(membersToAdd) > 0 {
		err := updateGroupMembers(ctx, client, group.Name, membersToAdd, false)
		if err != nil {
			return err
		}
	}
	return nil
}

func setGroupStatus(ctx context.Context, client MinioAdmin, group, status string) error {
	var setStatus madmin.GroupStatus
	switch status {
	case "enabled":
		setStatus = madmin.GroupEnabled
	case "disabled":
		setStatus = madmin.GroupDisabled
	default:
		return errors.New(500, "status not valid")
	}
	return client.setGroupStatus(ctx, group, setStatus)
}

// getUpdateGroupResponse updates a group by adding or removing it's members depending on the request,
// 	also sets the group's status if status in the request is different than the current one.
//  Then serializes the output to be used by the handler.
func getUpdateGroupResponse(session *models.Principal, params admin_api.UpdateGroupParams) (*models.Group, *models.Error) {
	ctx := context.Background()
	if params.Name == "" {
		return nil, prepareError(errGroupNameNotInRequest)
	}
	if params.Body == nil {
		return nil, prepareError(errGroupBodyNotInRequest)

	}
	expectedGroupUpdate := params.Body
	groupName := params.Name

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	groupUpdated, err := groupUpdate(ctx, adminClient, groupName, expectedGroupUpdate)
	if err != nil {
		return nil, prepareError(err)
	}
	groupResponse := &models.Group{
		Name:    groupUpdated.Name,
		Members: groupUpdated.Members,
		Policy:  groupUpdated.Policy,
		Status:  groupUpdated.Status,
	}
	return groupResponse, nil
}

// groupUpdate updates a group given the expected parameters, compares the expected parameters against the current ones
//   and updates them accordingly, status is only updated if the expected status is different than the current one.
//   Then fetches the group again to return the object updated.
func groupUpdate(ctx context.Context, client MinioAdmin, groupName string, expectedGroup *models.UpdateGroupRequest) (*madmin.GroupDesc, error) {
	expectedMembers := expectedGroup.Members
	expectedStatus := *expectedGroup.Status
	// get current members and status
	groupDescription, err := groupInfo(ctx, client, groupName)
	if err != nil {
		LogInfo("error getting group info: %v", err)
		return nil, err
	}
	// update group members
	err = addOrDeleteMembers(ctx, client, groupDescription, expectedMembers)
	if err != nil {
		LogInfo("error updating group: %v", err)
		return nil, err
	}
	// update group status only if different from current status
	if expectedStatus != groupDescription.Status {
		err = setGroupStatus(ctx, client, groupDescription.Name, expectedStatus)
		if err != nil {
			LogInfo("error updating group's status: %v", err)
			return nil, err
		}
	}
	// return latest group info to verify that changes were applied correctly
	groupDescription, err = groupInfo(ctx, client, groupName)
	if err != nil {
		LogInfo("error getting group info: %v", err)
		return nil, err
	}
	return groupDescription, nil
}

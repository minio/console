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
	"errors"
	"github.com/minio/minio/pkg/madmin"
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/restapi/operations"

	"github.com/minio/mcs/restapi/operations/admin_api"

	"github.com/minio/mcs/models"
)

func registerUsersHandlers(api *operations.McsAPI) {
	// List Users
	api.AdminAPIListUsersHandler = admin_api.ListUsersHandlerFunc(func(params admin_api.ListUsersParams, principal *models.Principal) middleware.Responder {
		listUsersResponse, err := getListUsersResponse()
		if err != nil {
			return admin_api.NewListUsersDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListUsersOK().WithPayload(listUsersResponse)
	})
	// Add User
	api.AdminAPIAddUserHandler = admin_api.AddUserHandlerFunc(func(params admin_api.AddUserParams, principal *models.Principal) middleware.Responder {
		userResponse, err := getUserAddResponse(params)
		if err != nil {
			return admin_api.NewAddUserDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewAddUserCreated().WithPayload(userResponse)
	})
	// Remove User
	api.AdminAPIRemoveUserHandler = admin_api.RemoveUserHandlerFunc(func(params admin_api.RemoveUserParams, principal *models.Principal) middleware.Responder {
		err := getRemoveUserResponse(params)
		if err != nil {
			return admin_api.NewRemoveUserDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewRemoveUserNoContent()
	})
	// Update User-Groups
	api.AdminAPIUpdateUserGroupsHandler = admin_api.UpdateUserGroupsHandlerFunc(func(params admin_api.UpdateUserGroupsParams, principal *models.Principal) middleware.Responder {
		userUpdateResponse, err := getUpdateUserGroupsResponse(params)
		if err != nil {
			return admin_api.NewUpdateUserGroupsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}

		return admin_api.NewUpdateUserGroupsOK().WithPayload(userUpdateResponse)
	})
}

func listUsers(ctx context.Context, client MinioAdmin) ([]*models.User, error) {

	// Get list of all users in the MinIO
	// This call requires explicit authentication, no anonymous requests are
	// allowed for listing users.
	userMap, err := client.listUsers(ctx)
	if err != nil {
		return []*models.User{}, err
	}

	var users []*models.User
	for accessKey, user := range userMap {
		userElem := &models.User{
			AccessKey: accessKey,
			Status:    string(user.Status),
			Policy:    user.PolicyName,
			MemberOf:  user.MemberOf,
		}
		users = append(users, userElem)
	}

	return users, nil
}

// getListUsersResponse performs listUsers() and serializes it to the handler's output
func getListUsersResponse() (*models.ListUsersResponse, error) {
	ctx := context.Background()
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	users, err := listUsers(ctx, adminClient)
	if err != nil {
		log.Println("error listing users:", err)
		return nil, err
	}
	// serialize output
	listUsersResponse := &models.ListUsersResponse{
		Users: users,
	}
	return listUsersResponse, nil
}

// addUser invokes adding a users on `MinioAdmin` and builds the response `models.User`
func addUser(ctx context.Context, client MinioAdmin, accessKey, secretKey *string) (*models.User, error) {
	// Calls into MinIO to add a new user if there's an error return it
	err := client.addUser(ctx, *accessKey, *secretKey)
	if err != nil {
		return nil, err
	}

	userElem := &models.User{
		AccessKey: *accessKey,
	}

	return userElem, nil
}

func getUserAddResponse(params admin_api.AddUserParams) (*models.User, error) {
	ctx := context.Background()
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	user, err := addUser(ctx, adminClient, params.Body.AccessKey, params.Body.SecretKey)
	if err != nil {
		log.Println("error adding user:", err)
		return nil, err
	}
	return user, nil
}

//removeUser invokes removing an user on `MinioAdmin`, then we return the response from API
func removeUser(ctx context.Context, client MinioAdmin, accessKey string) error {
	if err := client.removeUser(ctx, accessKey); err != nil {
		return err
	}
	return nil
}

func getRemoveUserResponse(params admin_api.RemoveUserParams) error {
	ctx := context.Background()

	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return err
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := removeUser(ctx, adminClient, params.Name); err != nil {
		log.Println("error removing user:", err)
		return err
	}

	log.Println("User removed successfully:", params.Name)
	return nil
}

// updateUserGroups invokes getGroupDescription() to get the current users in the specified group on `MinioAdmin`,
// then we add/delete the user to the specified groups and return the response to the client

func updateUserGroups(ctx context.Context, client MinioAdmin, user string, groupsToAssign []string) (*models.User, error) {
	parallelUserUpdate := func(groupName string) chan interface{} {
		chProcess := make(chan interface{})

		go func() bool {
			defer close(chProcess)

			groupDesc, err := client.getGroupDescription(ctx, groupName)

			if err != nil {
				return false
			}

			isUserInOriginGroup := IsElementInSlice(groupDesc.Members, user)
			isUserInNewGroups := IsElementInSlice(groupsToAssign, user)
			isRemove := false // User is added by default

			// User is deleted from the group
			if isUserInOriginGroup && !isUserInNewGroups {
				isRemove = true
			}

			if isUserInOriginGroup || isUserInNewGroups {
				userToAddRemove := []string{user}

				gAddRemove := madmin.GroupAddRemove{
					Group:    groupName,
					Members:  userToAddRemove,
					IsRemove: isRemove,
				}
				err := client.updateGroupMembers(ctx, gAddRemove)
				if err != nil {
					log.Println("Error updating", groupName, err)
					return false
				}
			}

			return true
		}()

		return chProcess
	}

	var listOfUpdates []chan interface{}

	for _, groupN := range groupsToAssign {
		proc := parallelUserUpdate(groupN)
		listOfUpdates = append(listOfUpdates, proc)
	}

	channelHasError := false

	for _, chanRet := range listOfUpdates {
		errorRet := <-chanRet

		if errorRet != nil {
			channelHasError = true
		}
	}

	if channelHasError {
		errRt := errors.New("there was an error updating the groups")
		return nil, errRt
	}

	userInfo, err := client.getUserInfo(ctx, user)

	if err != nil {
		log.Println("error getting user:", err)
		return nil, err
	}

	userReturn := &models.User{
		AccessKey: user,
		MemberOf:  userInfo.MemberOf,
		Policy:    userInfo.PolicyName,
		Status:    string(userInfo.Status),
	}

	return userReturn, nil
}

func getUpdateUserGroupsResponse(params admin_api.UpdateUserGroupsParams) (*models.User, error) {
	ctx := context.Background()

	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	user, err := updateUserGroups(ctx, adminClient, params.Name, params.Body.Groups)

	if err != nil {
		log.Println("error removing user:", err)
		return nil, err
	}

	log.Println("User removed successfully:", params.Name)
	return user, nil
}

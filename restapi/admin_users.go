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
	"sort"
	"strings"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	"github.com/minio/madmin-go"
	iampolicy "github.com/minio/pkg/iam/policy"
)

// Policy evaluated constants
const (
	Unknown = 0
	Allow   = 1
	Deny    = -1
)

func registerUsersHandlers(api *operations.ConsoleAPI) {
	// List Users
	api.AdminAPIListUsersHandler = admin_api.ListUsersHandlerFunc(func(params admin_api.ListUsersParams, session *models.Principal) middleware.Responder {
		listUsersResponse, err := getListUsersResponse(session)
		if err != nil {
			return admin_api.NewListUsersDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListUsersOK().WithPayload(listUsersResponse)
	})
	// Add User
	api.AdminAPIAddUserHandler = admin_api.AddUserHandlerFunc(func(params admin_api.AddUserParams, session *models.Principal) middleware.Responder {
		userResponse, err := getUserAddResponse(session, params)
		if err != nil {
			return admin_api.NewAddUserDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAddUserCreated().WithPayload(userResponse)
	})
	// Remove User
	api.AdminAPIRemoveUserHandler = admin_api.RemoveUserHandlerFunc(func(params admin_api.RemoveUserParams, session *models.Principal) middleware.Responder {
		err := getRemoveUserResponse(session, params)
		if err != nil {
			return admin_api.NewRemoveUserDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewRemoveUserNoContent()
	})
	// Update User-Groups
	api.AdminAPIUpdateUserGroupsHandler = admin_api.UpdateUserGroupsHandlerFunc(func(params admin_api.UpdateUserGroupsParams, session *models.Principal) middleware.Responder {
		userUpdateResponse, err := getUpdateUserGroupsResponse(session, params)
		if err != nil {
			return admin_api.NewUpdateUserGroupsDefault(int(err.Code)).WithPayload(err)
		}

		return admin_api.NewUpdateUserGroupsOK().WithPayload(userUpdateResponse)
	})
	// Get User
	api.AdminAPIGetUserInfoHandler = admin_api.GetUserInfoHandlerFunc(func(params admin_api.GetUserInfoParams, session *models.Principal) middleware.Responder {
		userInfoResponse, err := getUserInfoResponse(session, params)
		if err != nil {
			return admin_api.NewGetUserInfoDefault(int(err.Code)).WithPayload(err)
		}

		return admin_api.NewGetUserInfoOK().WithPayload(userInfoResponse)
	})
	// Update User
	api.AdminAPIUpdateUserInfoHandler = admin_api.UpdateUserInfoHandlerFunc(func(params admin_api.UpdateUserInfoParams, session *models.Principal) middleware.Responder {
		userUpdateResponse, err := getUpdateUserResponse(session, params)
		if err != nil {
			return admin_api.NewUpdateUserInfoDefault(int(err.Code)).WithPayload(err)
		}

		return admin_api.NewUpdateUserInfoOK().WithPayload(userUpdateResponse)
	})
	// Update User-Groups Bulk
	api.AdminAPIBulkUpdateUsersGroupsHandler = admin_api.BulkUpdateUsersGroupsHandlerFunc(func(params admin_api.BulkUpdateUsersGroupsParams, session *models.Principal) middleware.Responder {
		err := getAddUsersListToGroupsResponse(session, params)
		if err != nil {
			return admin_api.NewBulkUpdateUsersGroupsDefault(int(err.Code)).WithPayload(err)
		}

		return admin_api.NewBulkUpdateUsersGroupsOK()
	})
	api.AdminAPIListUsersWithAccessToBucketHandler = admin_api.ListUsersWithAccessToBucketHandlerFunc(func(params admin_api.ListUsersWithAccessToBucketParams, session *models.Principal) middleware.Responder {
		response, err := getListUsersWithAccessToBucketResponse(session, params.Bucket)
		if err != nil {
			return admin_api.NewListUsersWithAccessToBucketDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListUsersWithAccessToBucketOK().WithPayload(response)
	})
	// Change User Password
	api.AdminAPIChangeUserPasswordHandler = admin_api.ChangeUserPasswordHandlerFunc(func(params admin_api.ChangeUserPasswordParams, session *models.Principal) middleware.Responder {
		err := getChangeUserPasswordResponse(session, params)
		if err != nil {
			return admin_api.NewChangeUserPasswordDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewChangeUserPasswordCreated()
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
			Policy:    strings.Split(user.PolicyName, ","),
			MemberOf:  user.MemberOf,
		}
		users = append(users, userElem)
	}

	return users, nil
}

// getListUsersResponse performs listUsers() and serializes it to the handler's output
func getListUsersResponse(session *models.Principal) (*models.ListUsersResponse, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	users, err := listUsers(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	// serialize output
	listUsersResponse := &models.ListUsersResponse{
		Users: users,
	}
	return listUsersResponse, nil
}

// addUser invokes adding a users on `MinioAdmin` and builds the response `models.User`
func addUser(ctx context.Context, client MinioAdmin, accessKey, secretKey *string, groups []string) (*models.User, error) {
	// Calls into MinIO to add a new user if there's an error return it
	if err := client.addUser(ctx, *accessKey, *secretKey); err != nil {
		return nil, err
	}

	if len(groups) > 0 {
		userElem, errUG := updateUserGroups(ctx, client, *accessKey, groups)

		if errUG != nil {
			return nil, errUG
		}
		return userElem, nil
	}

	userRet := &models.User{
		AccessKey: *accessKey,
		MemberOf:  nil,
		Policy:    []string{},
		Status:    "",
	}
	return userRet, nil
}

func getUserAddResponse(session *models.Principal, params admin_api.AddUserParams) (*models.User, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	user, err := addUser(ctx, adminClient, params.Body.AccessKey, params.Body.SecretKey, params.Body.Groups)
	if err != nil {
		return nil, prepareError(err)
	}
	return user, nil
}

//removeUser invokes removing an user on `MinioAdmin`, then we return the response from API
func removeUser(ctx context.Context, client MinioAdmin, accessKey string) error {
	return client.removeUser(ctx, accessKey)
}

func getRemoveUserResponse(session *models.Principal, params admin_api.RemoveUserParams) *models.Error {
	ctx := context.Background()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}

	if session.AccountAccessKey == params.Name {
		return prepareError(errAvoidSelfAccountDelete)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := removeUser(ctx, adminClient, params.Name); err != nil {
		return prepareError(err)
	}

	return nil
}

// getUserInfo calls MinIO server get the User Information
func getUserInfo(ctx context.Context, client MinioAdmin, accessKey string) (*madmin.UserInfo, error) {
	userInfo, err := client.getUserInfo(ctx, accessKey)

	if err != nil {
		return nil, err
	}
	return &userInfo, nil
}

func getUserInfoResponse(session *models.Principal, params admin_api.GetUserInfoParams) (*models.User, *models.Error) {
	ctx := context.Background()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	user, err := getUserInfo(ctx, adminClient, params.Name)
	if err != nil {
		return nil, prepareError(err)
	}

	userInformation := &models.User{
		AccessKey: params.Name,
		MemberOf:  user.MemberOf,
		Policy:    strings.Split(user.PolicyName, ","),
		Status:    string(user.Status),
	}

	return userInformation, nil
}

// updateUserGroups invokes getUserInfo() to get the old groups from the user,
// then we merge the list with the new groups list to have a shorter iteration between groups and we do a comparison between the current and old groups.
// We delete or update the groups according the location in each list and send the user with the new groups from `MinioAdmin` to the client
func updateUserGroups(ctx context.Context, client MinioAdmin, user string, groupsToAssign []string) (*models.User, error) {
	parallelUserUpdate := func(groupName string, originGroups []string) chan error {
		chProcess := make(chan error)

		go func() error {
			defer close(chProcess)

			//Compare if groupName is in the arrays
			isGroupPersistent := IsElementInArray(groupsToAssign, groupName)
			isInOriginGroups := IsElementInArray(originGroups, groupName)

			if isGroupPersistent && isInOriginGroups { // Group is already assigned and doesn't need to be updated
				chProcess <- nil

				return nil
			}

			isRemove := false // User is added by default

			// User is deleted from the group
			if !isGroupPersistent {
				isRemove = true
			}

			userToAddRemove := []string{user}

			updateReturn := updateGroupMembers(ctx, client, groupName, userToAddRemove, isRemove)

			chProcess <- updateReturn

			return updateReturn
		}()

		return chProcess
	}

	userInfoOr, err := getUserInfo(ctx, client, user)
	if err != nil {
		return nil, err
	}

	memberOf := userInfoOr.MemberOf
	mergedGroupArray := UniqueKeys(append(memberOf, groupsToAssign...))

	var listOfUpdates []chan error

	// Each group must be updated individually because there is no way to update all the groups at once for a user,
	// we are using the same logic as 'mc admin group add' command
	for _, groupN := range mergedGroupArray {
		proc := parallelUserUpdate(groupN, memberOf)
		listOfUpdates = append(listOfUpdates, proc)
	}

	channelHasError := false

	for _, chanRet := range listOfUpdates {
		locError := <-chanRet

		if locError != nil {
			channelHasError = true
		}
	}

	if channelHasError {
		errRt := errors.New(500, "there was an error updating the groups")
		return nil, errRt
	}

	userInfo, err := getUserInfo(ctx, client, user)
	if err != nil {
		return nil, err
	}

	policies := strings.Split(userInfo.PolicyName, ",")

	userReturn := &models.User{
		AccessKey: user,
		MemberOf:  userInfo.MemberOf,
		Policy:    policies,
		Status:    string(userInfo.Status),
	}

	return userReturn, nil
}

func getUpdateUserGroupsResponse(session *models.Principal, params admin_api.UpdateUserGroupsParams) (*models.User, *models.Error) {
	ctx := context.Background()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	user, err := updateUserGroups(ctx, adminClient, params.Name, params.Body.Groups)

	if err != nil {
		return nil, prepareError(err)
	}

	return user, nil
}

// setUserStatus invokes setUserStatus from madmin to update user status
func setUserStatus(ctx context.Context, client MinioAdmin, user string, status string) error {
	var setStatus madmin.AccountStatus
	switch status {
	case "enabled":
		setStatus = madmin.AccountEnabled
	case "disabled":
		setStatus = madmin.AccountDisabled
	default:
		return errors.New(500, "status not valid")
	}

	return client.setUserStatus(ctx, user, setStatus)
}

func getUpdateUserResponse(session *models.Principal, params admin_api.UpdateUserInfoParams) (*models.User, *models.Error) {
	ctx := context.Background()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	name := params.Name
	status := *params.Body.Status
	groups := params.Body.Groups

	if err := setUserStatus(ctx, adminClient, name, status); err != nil {
		return nil, prepareError(err)
	}

	userElem, errUG := updateUserGroups(ctx, adminClient, name, groups)

	if errUG != nil {
		return nil, prepareError(errUG)
	}
	return userElem, nil
}

// addUsersListToGroups iterates over the user list & assigns the requested groups to each user.
func addUsersListToGroups(ctx context.Context, client MinioAdmin, usersToUpdate []string, groupsToAssign []string) error {
	// We update each group with the complete usersList
	parallelGroupsUpdate := func(groupToAssign string) chan error {
		groupProcess := make(chan error)

		go func() {
			defer close(groupProcess)
			// We add the users array to the group.
			err := updateGroupMembers(ctx, client, groupToAssign, usersToUpdate, false)

			groupProcess <- err
		}()
		return groupProcess
	}

	var groupsUpdateList []chan error

	// We get each group name & add users accordingly
	for _, groupName := range groupsToAssign {
		// We update the group
		proc := parallelGroupsUpdate(groupName)
		groupsUpdateList = append(groupsUpdateList, proc)
	}

	errorsList := []string{} // We get the errors list because we want to have all errors at once.
	for _, err := range groupsUpdateList {
		errorFromUpdate := <-err // We store the error to avoid Data Race
		if errorFromUpdate != nil {
			// If there is an error, we store the errors strings so we can join them after we receive all errors
			errorsList = append(errorsList, errorFromUpdate.Error()) // We wait until all the channels have been closed.
		}
	}

	// If there are errors, we throw the final error with the errors inside
	if len(errorsList) > 0 {
		errGen := fmt.Errorf("error in users-groups assignation: %q", strings.Join(errorsList[:], ","))
		return errGen
	}

	return nil
}

func getAddUsersListToGroupsResponse(session *models.Principal, params admin_api.BulkUpdateUsersGroupsParams) *models.Error {
	ctx := context.Background()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	usersList := params.Body.Users
	groupsList := params.Body.Groups

	if err := addUsersListToGroups(ctx, adminClient, usersList, groupsList); err != nil {
		return prepareError(err)
	}

	return nil
}

func getListUsersWithAccessToBucketResponse(session *models.Principal, bucket string) ([]string, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	return listUsersWithAccessToBucket(ctx, adminClient, bucket)
}

func policyAllowsAndMatchesBucket(policy *iampolicy.Policy, bucket string) int {
	policyStatements := policy.Statements
	for i := 0; i < len(policyStatements); i++ {
		resources := policyStatements[i].Resources
		effect := policyStatements[i].Effect
		if resources.Match(bucket, map[string][]string{}) {
			if effect.IsValid() {
				if effect.IsAllowed(true) {
					return Allow
				}
				return Deny
			}
		}
	}
	return Unknown
}

func listUsersWithAccessToBucket(ctx context.Context, adminClient MinioAdmin, bucket string) ([]string, *models.Error) {
	users, err := adminClient.listUsers(ctx)
	if err != nil {
		return nil, prepareError(err)
	}
	var retval []string
	akHasAccess := make(map[string]struct{})
	akIsDenied := make(map[string]struct{})
	for k, v := range users {
		for _, policyName := range strings.Split(v.PolicyName, ",") {
			policyName = strings.TrimSpace(policyName)
			if policyName == "" {
				continue
			}
			policy, err := adminClient.getPolicy(ctx, policyName)
			if err != nil {
				LogError("unable to fetch policy %s: %v", policyName, err)
				continue
			}
			if _, ok := akIsDenied[k]; !ok {
				switch policyAllowsAndMatchesBucket(policy, bucket) {
				case Allow:
					if _, ok := akHasAccess[k]; !ok {
						akHasAccess[k] = struct{}{}
					}
				case Deny:
					akIsDenied[k] = struct{}{}
					delete(akHasAccess, k)
				}
			}
		}
	}

	groups, err := adminClient.listGroups(ctx)
	if err != nil {
		LogError("unable to list groups: %v", err)
		return retval, nil
	}

	for _, groupName := range groups {
		info, err := groupInfo(ctx, adminClient, groupName)
		if err != nil {
			LogError("unable to fetch group info %s: %v", groupName, err)
			continue
		}
		policy, err := adminClient.getPolicy(ctx, info.Policy)
		if err != nil {
			LogError("unable to fetch group policy %s: %v", info.Policy, err)
			continue
		}
		for _, member := range info.Members {
			if _, ok := akIsDenied[member]; !ok {
				switch policyAllowsAndMatchesBucket(policy, bucket) {
				case Allow:
					if _, ok := akHasAccess[member]; !ok {
						akHasAccess[member] = struct{}{}
					}
				case Deny:
					akIsDenied[member] = struct{}{}
					delete(akHasAccess, member)
				}
			}
		}
	}
	for k := range akHasAccess {
		retval = append(retval, k)
	}
	sort.Strings(retval)
	return retval, nil
}

// changeUserPassword changes password of selectedUser to newSecretKey
func changeUserPassword(ctx context.Context, client MinioAdmin, selectedUser string, newSecretKey string) error {
	return client.changePassword(ctx, selectedUser, newSecretKey)
}

// getChangeUserPasswordResponse will change the password of selctedUser to newSecretKey
func getChangeUserPasswordResponse(session *models.Principal, params admin_api.ChangeUserPasswordParams) *models.Error {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	// params will contain selectedUser and newSecretKey credentials for the user
	user := *params.Body.SelectedUser
	newSecretKey := *params.Body.NewSecretKey

	// changes password of user to newSecretKey
	if err := changeUserPassword(ctx, adminClient, user, newSecretKey); err != nil {
		return prepareError(err)
	}
	return nil
}

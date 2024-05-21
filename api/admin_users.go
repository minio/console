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
	"fmt"
	"sort"
	"strings"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	accountApi "github.com/minio/console/api/operations/account"
	bucketApi "github.com/minio/console/api/operations/bucket"
	userApi "github.com/minio/console/api/operations/user"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	iampolicy "github.com/minio/pkg/v3/policy"
)

// Policy evaluated constants
const (
	Unknown = 0
	Allow   = 1
	Deny    = -1
)

func registerUsersHandlers(api *operations.ConsoleAPI) {
	// List Users
	api.UserListUsersHandler = userApi.ListUsersHandlerFunc(func(params userApi.ListUsersParams, session *models.Principal) middleware.Responder {
		listUsersResponse, err := getListUsersResponse(session, params)
		if err != nil {
			return userApi.NewListUsersDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewListUsersOK().WithPayload(listUsersResponse)
	})
	// Add User
	api.UserAddUserHandler = userApi.AddUserHandlerFunc(func(params userApi.AddUserParams, session *models.Principal) middleware.Responder {
		userResponse, err := getUserAddResponse(session, params)
		if err != nil {
			return userApi.NewAddUserDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewAddUserCreated().WithPayload(userResponse)
	})
	// Remove User
	api.UserRemoveUserHandler = userApi.RemoveUserHandlerFunc(func(params userApi.RemoveUserParams, session *models.Principal) middleware.Responder {
		err := getRemoveUserResponse(session, params)
		if err != nil {
			return userApi.NewRemoveUserDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewRemoveUserNoContent()
	})
	// Update User-Groups
	api.UserUpdateUserGroupsHandler = userApi.UpdateUserGroupsHandlerFunc(func(params userApi.UpdateUserGroupsParams, session *models.Principal) middleware.Responder {
		userUpdateResponse, err := getUpdateUserGroupsResponse(session, params)
		if err != nil {
			return userApi.NewUpdateUserGroupsDefault(err.Code).WithPayload(err.APIError)
		}

		return userApi.NewUpdateUserGroupsOK().WithPayload(userUpdateResponse)
	})
	// Get User
	api.UserGetUserInfoHandler = userApi.GetUserInfoHandlerFunc(func(params userApi.GetUserInfoParams, session *models.Principal) middleware.Responder {
		userInfoResponse, err := getUserInfoResponse(session, params)
		if err != nil {
			return userApi.NewGetUserInfoDefault(err.Code).WithPayload(err.APIError)
		}

		return userApi.NewGetUserInfoOK().WithPayload(userInfoResponse)
	})
	// Update User
	api.UserUpdateUserInfoHandler = userApi.UpdateUserInfoHandlerFunc(func(params userApi.UpdateUserInfoParams, session *models.Principal) middleware.Responder {
		userUpdateResponse, err := getUpdateUserResponse(session, params)
		if err != nil {
			return userApi.NewUpdateUserInfoDefault(err.Code).WithPayload(err.APIError)
		}

		return userApi.NewUpdateUserInfoOK().WithPayload(userUpdateResponse)
	})
	// Update User-Groups Bulk
	api.UserBulkUpdateUsersGroupsHandler = userApi.BulkUpdateUsersGroupsHandlerFunc(func(params userApi.BulkUpdateUsersGroupsParams, session *models.Principal) middleware.Responder {
		err := getAddUsersListToGroupsResponse(session, params)
		if err != nil {
			return userApi.NewBulkUpdateUsersGroupsDefault(err.Code).WithPayload(err.APIError)
		}

		return userApi.NewBulkUpdateUsersGroupsOK()
	})
	api.BucketListUsersWithAccessToBucketHandler = bucketApi.ListUsersWithAccessToBucketHandlerFunc(func(params bucketApi.ListUsersWithAccessToBucketParams, session *models.Principal) middleware.Responder {
		response, err := getListUsersWithAccessToBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewListUsersWithAccessToBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewListUsersWithAccessToBucketOK().WithPayload(response)
	})
	// Change User Password
	api.AccountChangeUserPasswordHandler = accountApi.ChangeUserPasswordHandlerFunc(func(params accountApi.ChangeUserPasswordParams, session *models.Principal) middleware.Responder {
		err := getChangeUserPasswordResponse(session, params)
		if err != nil {
			return accountApi.NewChangeUserPasswordDefault(err.Code).WithPayload(err.APIError)
		}
		return accountApi.NewChangeUserPasswordCreated()
	})
	// Check number of Service Accounts for listed users
	api.UserCheckUserServiceAccountsHandler = userApi.CheckUserServiceAccountsHandlerFunc(func(params userApi.CheckUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		userSAList, err := getCheckUserSAResponse(session, params)
		if err != nil {
			return userApi.NewCheckUserServiceAccountsDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewCheckUserServiceAccountsOK().WithPayload(userSAList)
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
func getListUsersResponse(session *models.Principal, params userApi.ListUsersParams) (*models.ListUsersResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	users, err := listUsers(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// serialize output
	listUsersResponse := &models.ListUsersResponse{
		Users: users,
	}
	return listUsersResponse, nil
}

// addUser invokes adding a users on `MinioAdmin` and builds the response `models.User`
func addUser(ctx context.Context, client MinioAdmin, accessKey, secretKey *string, groups []string, policies []string) (*models.User, error) {
	// Calls into MinIO to add a new user if there's an errors return it
	if err := client.addUser(ctx, *accessKey, *secretKey); err != nil {
		return nil, err
	}
	// set groups for the newly created user
	var userWithGroups *models.User
	if len(groups) > 0 {
		var errUG error
		userWithGroups, errUG = updateUserGroups(ctx, client, *accessKey, groups)

		if errUG != nil {
			return nil, errUG
		}
	}
	// set policies for the newly created user
	if len(policies) > 0 {
		policyString := strings.Join(policies, ",")
		if err := SetPolicy(ctx, client, policyString, *accessKey, "user"); err != nil {
			return nil, err
		}
	}

	memberOf := []string{}
	status := "enabled"
	if userWithGroups != nil {
		memberOf = userWithGroups.MemberOf
		status = userWithGroups.Status
	}

	userRet := &models.User{
		AccessKey: *accessKey,
		MemberOf:  memberOf,
		Policy:    policies,
		Status:    status,
	}
	return userRet, nil
}

func getUserAddResponse(session *models.Principal, params userApi.AddUserParams) (*models.User, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	var userExists bool

	_, err = adminClient.getUserInfo(ctx, *params.Body.AccessKey)
	userExists = err == nil

	if userExists {
		return nil, ErrorWithContext(ctx, ErrNonUniqueAccessKey)
	}
	user, err := addUser(
		ctx,
		adminClient,
		params.Body.AccessKey,
		params.Body.SecretKey,
		params.Body.Groups,
		params.Body.Policies,
	)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return user, nil
}

// removeUser invokes removing an user on `MinioAdmin`, then we return the response from API
func removeUser(ctx context.Context, client MinioAdmin, accessKey string) error {
	return client.removeUser(ctx, accessKey)
}

func getRemoveUserResponse(session *models.Principal, params userApi.RemoveUserParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	if session.AccountAccessKey == params.Name {
		return ErrorWithContext(ctx, ErrAvoidSelfAccountDelete)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	if err := removeUser(ctx, adminClient, params.Name); err != nil {
		return ErrorWithContext(ctx, err)
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

func getUserInfoResponse(session *models.Principal, params userApi.GetUserInfoParams) (*models.User, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	user, err := getUserInfo(ctx, adminClient, params.Name)
	if err != nil {
		// User doesn't exist, return 404
		if madmin.ToErrorResponse(err).Code == "XMinioAdminNoSuchUser" {
			errorCode := 404
			errorMessage := "User doesn't exist"
			return nil, &CodedAPIError{Code: errorCode, APIError: &models.APIError{Message: errorMessage, DetailedMessage: err.Error()}}
		}
		return nil, ErrorWithContext(ctx, err)
	}

	var policies []string
	if user.PolicyName == "" {
		policies = []string{}
	} else {
		policies = strings.Split(user.PolicyName, ",")
	}

	hasPolicy := true

	if len(policies) == 0 {
		hasPolicy = false
		for i := 0; i < len(user.MemberOf); i++ {
			group, err := adminClient.getGroupDescription(ctx, user.MemberOf[i])
			if err != nil {
				continue
			}
			if group.Policy != "" {
				hasPolicy = true
				break
			}
		}
	}

	userInformation := &models.User{
		AccessKey: params.Name,
		MemberOf:  user.MemberOf,
		Policy:    policies,
		Status:    string(user.Status),
		HasPolicy: hasPolicy,
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

			// Compare if groupName is in the arrays
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

func getUpdateUserGroupsResponse(session *models.Principal, params userApi.UpdateUserGroupsParams) (*models.User, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	user, err := updateUserGroups(ctx, adminClient, params.Name, params.Body.Groups)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
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

func getUpdateUserResponse(session *models.Principal, params userApi.UpdateUserInfoParams) (*models.User, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	status := *params.Body.Status
	groups := params.Body.Groups

	if err := setUserStatus(ctx, adminClient, params.Name, status); err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	userElem, errUG := updateUserGroups(ctx, adminClient, params.Name, groups)

	if errUG != nil {
		return nil, ErrorWithContext(ctx, errUG)
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
		errorFromUpdate := <-err // We store the errors to avoid Data Race
		if errorFromUpdate != nil {
			// If there is an errors, we store the errors strings so we can join them after we receive all errors
			errorsList = append(errorsList, errorFromUpdate.Error()) // We wait until all the channels have been closed.
		}
	}

	// If there are errors, we throw the final errors with the errors inside
	if len(errorsList) > 0 {
		errGen := fmt.Errorf("error in users-groups assignation: %q", strings.Join(errorsList, ","))
		return errGen
	}

	return nil
}

func getAddUsersListToGroupsResponse(session *models.Principal, params userApi.BulkUpdateUsersGroupsParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	usersList := params.Body.Users
	groupsList := params.Body.Groups

	if err := addUsersListToGroups(ctx, adminClient, usersList, groupsList); err != nil {
		return ErrorWithContext(ctx, err)
	}

	return nil
}

func getListUsersWithAccessToBucketResponse(session *models.Principal, params bucketApi.ListUsersWithAccessToBucketParams) ([]string, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	list, err := listUsersWithAccessToBucket(ctx, adminClient, params.Bucket)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return list, nil
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

func listUsersWithAccessToBucket(ctx context.Context, adminClient MinioAdmin, bucket string) ([]string, error) {
	users, err := adminClient.listUsers(ctx)
	if err != nil {
		return nil, err
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
				ErrorWithContext(ctx, fmt.Errorf("unable to fetch policy %s: %v", policyName, err))
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
		ErrorWithContext(ctx, fmt.Errorf("unable to list groups: %v", err))
		return retval, nil
	}

	for _, groupName := range groups {
		info, err := groupInfo(ctx, adminClient, groupName)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("unable to fetch group info %s: %v", groupName, err))
			continue
		}
		policy, err := adminClient.getPolicy(ctx, info.Policy)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("unable to fetch group policy %s: %v", info.Policy, err))
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
func getChangeUserPasswordResponse(session *models.Principal, params accountApi.ChangeUserPasswordParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	// params will contain selectedUser and newSecretKey credentials for the user
	user := *params.Body.SelectedUser
	newSecretKey := *params.Body.NewSecretKey

	// changes password of user to newSecretKey
	if err := changeUserPassword(ctx, adminClient, user, newSecretKey); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func getCheckUserSAResponse(session *models.Principal, params userApi.CheckUserServiceAccountsParams) (*models.UserServiceAccountSummary, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	var userServiceAccountList []*models.UserServiceAccountItem
	hasSA := false
	for _, user := range params.SelectedUsers {
		listServAccs, err := adminClient.listServiceAccounts(ctx, user)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		numSAs := int64(len(listServAccs.Accounts))
		if numSAs > 0 {
			hasSA = true
		}
		userAccountItem := &models.UserServiceAccountItem{
			UserName: user,
			NumSAs:   numSAs,
		}
		userServiceAccountList = append(userServiceAccountList, userAccountItem)
	}

	userAccountList := &models.UserServiceAccountSummary{
		UserServiceAccountList: userServiceAccountList,
		HasSA:                  hasSA,
	}

	return userAccountList, nil
}

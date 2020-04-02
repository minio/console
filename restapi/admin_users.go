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
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/m3/mcs/restapi/operations"

	"github.com/minio/m3/mcs/restapi/operations/admin_api"

	"github.com/minio/m3/mcs/models"
)

func registerUsersHandlers(api *operations.McsAPI) {
	// List Users
	api.AdminAPIListUsersHandler = admin_api.ListUsersHandlerFunc(func(params admin_api.ListUsersParams, principal interface{}) middleware.Responder {
		listUsersResponse, err := getListUsersResponse()
		if err != nil {
			return admin_api.NewListUsersDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListUsersOK().WithPayload(listUsersResponse)
	})
	// Add User
	api.AdminAPIAddUserHandler = admin_api.AddUserHandlerFunc(func(params admin_api.AddUserParams, principal interface{}) middleware.Responder {
		userResponse, err := getUserAddResponse(params)
		if err != nil {
			return admin_api.NewAddUserDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewAddUserCreated().WithPayload(userResponse)
	})
}

func listUsers(client MinioAdmin) ([]*models.User, error) {

	// Get list of all users in the MinIO
	// This call requires explicit authentication, no anonymous requests are
	// allowed for listing users.
	ctx := context.Background()
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
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	users, err := listUsers(adminClient)
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
func addUser(client MinioAdmin, accessKey, secretKey *string) (*models.User, error) {
	// Calls into MinIO to add a new user if there's an error return it
	ctx := context.Background()
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
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	user, err := addUser(adminClient, params.Body.AccessKey, params.Body.SecretKey)
	if err != nil {
		log.Println("error adding user:", err)
		return nil, err
	}
	return user, nil
}

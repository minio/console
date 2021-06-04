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
	"strings"
	"time"

	"github.com/minio/console/restapi/operations/admin_api"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	iampolicy "github.com/minio/pkg/iam/policy"
)

func registerServiceAccountsHandlers(api *operations.ConsoleAPI) {
	// Create Service Account
	api.UserAPICreateServiceAccountHandler = user_api.CreateServiceAccountHandlerFunc(func(params user_api.CreateServiceAccountParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateServiceAccountResponse(session, params.Body)
		if err != nil {
			return user_api.NewCreateServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewCreateServiceAccountCreated().WithPayload(creds)
	})
	// List Service Accounts for User
	api.UserAPIListUserServiceAccountsHandler = user_api.ListUserServiceAccountsHandlerFunc(func(params user_api.ListUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		serviceAccounts, err := getUserServiceAccountsResponse(session, "")
		if err != nil {
			return user_api.NewListUserServiceAccountsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewListUserServiceAccountsOK().WithPayload(serviceAccounts)
	})

	// Delete a User's service account
	api.UserAPIDeleteServiceAccountHandler = user_api.DeleteServiceAccountHandlerFunc(func(params user_api.DeleteServiceAccountParams, session *models.Principal) middleware.Responder {
		if err := getDeleteServiceAccountResponse(session, params.AccessKey); err != nil {
			return user_api.NewDeleteServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewDeleteServiceAccountNoContent()
	})

	// List Service Accounts for User
	api.AdminAPIListAUserServiceAccountsHandler = admin_api.ListAUserServiceAccountsHandlerFunc(func(params admin_api.ListAUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		serviceAccounts, err := getUserServiceAccountsResponse(session, params.Name)
		if err != nil {
			return user_api.NewListUserServiceAccountsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewListUserServiceAccountsOK().WithPayload(serviceAccounts)
	})

}

// createServiceAccount adds a service account to the userClient and assigns a policy to him if defined.
func createServiceAccount(ctx context.Context, userClient MinioAdmin, policy string) (*models.ServiceAccountCreds, error) {
	// By default a nil policy will be used so the service account inherit the parent account policy, otherwise
	// we override with the user provided iam policy
	var iamPolicy *iampolicy.Policy
	if strings.TrimSpace(policy) != "" {
		iamp, err := iampolicy.ParseConfig(bytes.NewReader([]byte(policy)))
		if err != nil {
			return nil, err
		}
		iamPolicy = iamp
	}

	creds, err := userClient.addServiceAccount(ctx, iamPolicy)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey}, nil
}

// getCreateServiceAccountResponse creates a service account with the defined policy for the user that
//   is requestingit ,it first gets the credentials of the user and creates a client which is going to
//   make the call to create the Service Account
func getCreateServiceAccountResponse(session *models.Principal, serviceAccount *models.ServiceAccountRequest) (*models.ServiceAccountCreds, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	userAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := adminClient{client: userAdmin}

	saCreds, err := createServiceAccount(ctx, userAdminClient, serviceAccount.Policy)
	if err != nil {
		return nil, prepareError(err)
	}
	return saCreds, nil
}

// getUserServiceAccount gets list of the user's service accounts
func getUserServiceAccounts(ctx context.Context, userClient MinioAdmin, user string) (models.ServiceAccounts, error) {
	listServAccs, err := userClient.listServiceAccounts(ctx, user)
	if err != nil {
		return nil, err
	}
	serviceAccounts := models.ServiceAccounts{}
	for _, acc := range listServAccs.Accounts {
		serviceAccounts = append(serviceAccounts, acc)
	}
	return serviceAccounts, nil
}

// getUserServiceAccountsResponse authenticates the user and calls
// getUserServiceAccounts to list the user's service accounts
func getUserServiceAccountsResponse(session *models.Principal, user string) (models.ServiceAccounts, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	userAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := adminClient{client: userAdmin}

	serviceAccounts, err := getUserServiceAccounts(ctx, userAdminClient, user)
	if err != nil {
		return nil, prepareError(err)
	}
	return serviceAccounts, nil
}

// deleteServiceAccount calls delete service account api
func deleteServiceAccount(ctx context.Context, userClient MinioAdmin, accessKey string) error {
	return userClient.deleteServiceAccount(ctx, accessKey)
}

// getDeleteServiceAccountResponse authenticates the user and calls deleteServiceAccount
func getDeleteServiceAccountResponse(session *models.Principal, accessKey string) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	userAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := adminClient{client: userAdmin}

	if err := deleteServiceAccount(ctx, userAdminClient, accessKey); err != nil {
		return prepareError(err)
	}
	return nil
}

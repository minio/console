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
	"encoding/json"
	"errors"
	"strings"

	"github.com/minio/console/pkg/utils"

	userApi "github.com/minio/console/restapi/operations/user"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	saApi "github.com/minio/console/restapi/operations/service_account"
	"github.com/minio/madmin-go"
	iampolicy "github.com/minio/pkg/iam/policy"
)

func registerServiceAccountsHandlers(api *operations.ConsoleAPI) {
	// Create Service Account
	api.ServiceAccountCreateServiceAccountHandler = saApi.CreateServiceAccountHandlerFunc(func(params saApi.CreateServiceAccountParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateServiceAccountResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewCreateServiceAccountCreated().WithPayload(creds)
	})
	// Create User Service Account
	api.UserCreateAUserServiceAccountHandler = userApi.CreateAUserServiceAccountHandlerFunc(func(params userApi.CreateAUserServiceAccountParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateAUserServiceAccountResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return userApi.NewCreateAUserServiceAccountCreated().WithPayload(creds)
	})
	// Create User Service Account
	api.UserCreateServiceAccountCredentialsHandler = userApi.CreateServiceAccountCredentialsHandlerFunc(func(params userApi.CreateServiceAccountCredentialsParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateAUserServiceAccountCredsResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return userApi.NewCreateServiceAccountCredentialsCreated().WithPayload(creds)
	})
	api.ServiceAccountCreateServiceAccountCredsHandler = saApi.CreateServiceAccountCredsHandlerFunc(func(params saApi.CreateServiceAccountCredsParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateServiceAccountCredsResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return userApi.NewCreateServiceAccountCredentialsCreated().WithPayload(creds)
	})
	// List Service Accounts for User
	api.ServiceAccountListUserServiceAccountsHandler = saApi.ListUserServiceAccountsHandlerFunc(func(params saApi.ListUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
		defer cancel()
		serviceAccounts, err := getUserServiceAccountsResponse(ctx, session, "")
		if err != nil {
			return saApi.NewListUserServiceAccountsDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewListUserServiceAccountsOK().WithPayload(serviceAccounts)
	})

	// Delete a User's service account
	api.ServiceAccountDeleteServiceAccountHandler = saApi.DeleteServiceAccountHandlerFunc(func(params saApi.DeleteServiceAccountParams, session *models.Principal) middleware.Responder {
		if err := getDeleteServiceAccountResponse(session, params); err != nil {
			return saApi.NewDeleteServiceAccountDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewDeleteServiceAccountNoContent()
	})

	// List Service Accounts for User
	api.UserListAUserServiceAccountsHandler = userApi.ListAUserServiceAccountsHandlerFunc(func(params userApi.ListAUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
		defer cancel()
		serviceAccounts, err := getUserServiceAccountsResponse(ctx, session, params.Name)
		if err != nil {
			return saApi.NewListUserServiceAccountsDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewListUserServiceAccountsOK().WithPayload(serviceAccounts)
	})

	api.ServiceAccountGetServiceAccountPolicyHandler = saApi.GetServiceAccountPolicyHandlerFunc(func(params saApi.GetServiceAccountPolicyParams, session *models.Principal) middleware.Responder {
		serviceAccounts, err := getServiceAccountPolicyResponse(session, params)
		if err != nil {
			return saApi.NewGetServiceAccountPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewGetServiceAccountPolicyOK().WithPayload(serviceAccounts)
	})

	api.ServiceAccountSetServiceAccountPolicyHandler = saApi.SetServiceAccountPolicyHandlerFunc(func(params saApi.SetServiceAccountPolicyParams, session *models.Principal) middleware.Responder {
		err := getSetServiceAccountPolicyResponse(session, params)
		if err != nil {
			return saApi.NewSetServiceAccountPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewSetServiceAccountPolicyOK()
	})

	// Delete multiple service accounts
	api.ServiceAccountDeleteMultipleServiceAccountsHandler = saApi.DeleteMultipleServiceAccountsHandlerFunc(func(params saApi.DeleteMultipleServiceAccountsParams, session *models.Principal) middleware.Responder {
		if err := getDeleteMultipleServiceAccountsResponse(session, params); err != nil {
			return saApi.NewDeleteMultipleServiceAccountsDefault(int(err.Code)).WithPayload(err)
		}
		return saApi.NewDeleteMultipleServiceAccountsNoContent()
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
	creds, err := userClient.addServiceAccount(ctx, iamPolicy, "", "", "")
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

// createServiceAccount adds a service account with the given credentials to the userClient and assigns a policy to him if defined.
func createServiceAccountCreds(ctx context.Context, userClient MinioAdmin, policy string, accessKey string, secretKey string) (*models.ServiceAccountCreds, error) {
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
	creds, err := userClient.addServiceAccount(ctx, iamPolicy, "", accessKey, secretKey)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

// getCreateServiceAccountResponse creates a service account with the defined policy for the user that
//   is requestingit ,it first gets the credentials of the user and creates a client which is going to
//   make the call to create the Service Account
func getCreateServiceAccountResponse(session *models.Principal, params saApi.CreateServiceAccountParams) (*models.ServiceAccountCreds, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	saCreds, err := createServiceAccount(ctx, userAdminClient, params.Body.Policy)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return saCreds, nil
}

// createServiceAccount adds a service account to a given user and assigns a policy to him if defined.
func createAUserServiceAccount(ctx context.Context, userClient MinioAdmin, policy string, user string) (*models.ServiceAccountCreds, error) {
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

	creds, err := userClient.addServiceAccount(ctx, iamPolicy, user, "", "")
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

func createAUserServiceAccountCreds(ctx context.Context, userClient MinioAdmin, policy string, user string, accessKey string, secretKey string) (*models.ServiceAccountCreds, error) {
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

	creds, err := userClient.addServiceAccount(ctx, iamPolicy, user, accessKey, secretKey)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

// getCreateServiceAccountResponse creates a service account with the defined policy for the user that
//   is requesting it ,it first gets the credentials of the user and creates a client which is going to
//   make the call to create the Service Account
func getCreateAUserServiceAccountResponse(session *models.Principal, params userApi.CreateAUserServiceAccountParams) (*models.ServiceAccountCreds, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	name, err := utils.DecodeBase64(params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	saCreds, err := createAUserServiceAccount(ctx, userAdminClient, params.Body.Policy, name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return saCreds, nil
}

// getCreateServiceAccountCredsResponse creates a service account with the defined policy for the user that
//   is requesting it, and with the credentials provided
func getCreateAUserServiceAccountCredsResponse(session *models.Principal, params userApi.CreateServiceAccountCredentialsParams) (*models.ServiceAccountCreds, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	serviceAccount := params.Body
	user, err := utils.DecodeBase64(params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	if user == serviceAccount.AccessKey {
		return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
	}
	accounts, err := userAdminClient.listServiceAccounts(ctx, user)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	for i := 0; i < len(accounts.Accounts); i++ {
		if accounts.Accounts[i] == serviceAccount.AccessKey {
			return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
		}
	}
	saCreds, err := createAUserServiceAccountCreds(ctx, userAdminClient, serviceAccount.Policy, user, serviceAccount.AccessKey, serviceAccount.SecretKey)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return saCreds, nil
}

func getCreateServiceAccountCredsResponse(session *models.Principal, params saApi.CreateServiceAccountCredsParams) (*models.ServiceAccountCreds, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	serviceAccount := params.Body
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	if session.AccountAccessKey == serviceAccount.AccessKey {
		return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
	}

	accounts, err := userAdminClient.listServiceAccounts(ctx, "")
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	for i := 0; i < len(accounts.Accounts); i++ {
		if accounts.Accounts[i] == serviceAccount.AccessKey {
			return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
		}
	}

	saCreds, err := createServiceAccountCreds(ctx, userAdminClient, serviceAccount.Policy, serviceAccount.AccessKey, serviceAccount.SecretKey)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
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
func getUserServiceAccountsResponse(ctx context.Context, session *models.Principal, user string) (models.ServiceAccounts, *models.Error) {
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	user, err = utils.DecodeBase64(user)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	serviceAccounts, err := getUserServiceAccounts(ctx, userAdminClient, user)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return serviceAccounts, nil
}

// deleteServiceAccount calls delete service account api
func deleteServiceAccount(ctx context.Context, userClient MinioAdmin, accessKey string) error {
	return userClient.deleteServiceAccount(ctx, accessKey)
}

// getDeleteServiceAccountResponse authenticates the user and calls deleteServiceAccount
func getDeleteServiceAccountResponse(session *models.Principal, params saApi.DeleteServiceAccountParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	accessKey, err := utils.DecodeBase64(params.AccessKey)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	if err := deleteServiceAccount(ctx, userAdminClient, accessKey); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// getServiceAccountPolicy gets policy for a service account
func getServiceAccountPolicy(ctx context.Context, userClient MinioAdmin, accessKey string) (string, error) {
	serviceAccountInfo, err := userClient.infoServiceAccount(ctx, accessKey)
	if err != nil {
		return "", err
	}
	var policy iampolicy.Policy
	json.Unmarshal([]byte(serviceAccountInfo.Policy), &policy)
	if policy.Statements == nil {
		return "", nil
	}
	return serviceAccountInfo.Policy, nil
}

// getServiceAccountPolicyResponse authenticates the user and calls
// getServiceAccountPolicy to get the policy for a service account
func getServiceAccountPolicyResponse(session *models.Principal, params saApi.GetServiceAccountPolicyParams) (string, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	accessKey, err := utils.DecodeBase64(params.AccessKey)
	if err != nil {
		return "", ErrorWithContext(ctx, err)
	}
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return "", ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	serviceAccounts, err := getServiceAccountPolicy(ctx, userAdminClient, accessKey)
	if err != nil {
		return "", ErrorWithContext(ctx, err)
	}
	return serviceAccounts, nil
}

// setServiceAccountPolicy sets policy for a service account
func setServiceAccountPolicy(ctx context.Context, userClient MinioAdmin, accessKey string, policy string) error {
	err := userClient.updateServiceAccount(ctx, accessKey, madmin.UpdateServiceAccountReq{NewPolicy: json.RawMessage(policy)})
	return err
}

// getSetServiceAccountPolicyResponse authenticates the user and calls
// getSetServiceAccountPolicy to set the policy for a service account
func getSetServiceAccountPolicyResponse(session *models.Principal, params saApi.SetServiceAccountPolicyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	accessKey, err := utils.DecodeBase64(params.AccessKey)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	policy := *params.Policy.Policy
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	err = setServiceAccountPolicy(ctx, userAdminClient, accessKey, policy)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// getDeleteMultipleServiceAccountsResponse authenticates the user and calls deleteServiceAccount for each account listed in selectedSAs
func getDeleteMultipleServiceAccountsResponse(session *models.Principal, params saApi.DeleteMultipleServiceAccountsParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	selectedSAs := params.SelectedSA
	userAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	for _, sa := range selectedSAs {
		if err := deleteServiceAccount(ctx, userAdminClient, sa); err != nil {
			return ErrorWithContext(ctx, err)
		}
	}
	return nil
}

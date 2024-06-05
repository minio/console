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
	"encoding/json"
	"errors"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	saApi "github.com/minio/console/api/operations/service_account"
	userApi "github.com/minio/console/api/operations/user"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	iampolicy "github.com/minio/pkg/v3/policy"
)

func registerServiceAccountsHandlers(api *operations.ConsoleAPI) {
	// Create Service Account
	api.ServiceAccountCreateServiceAccountHandler = saApi.CreateServiceAccountHandlerFunc(func(params saApi.CreateServiceAccountParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateServiceAccountResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewCreateServiceAccountCreated().WithPayload(creds)
	})
	// Create User Service Account
	api.UserCreateAUserServiceAccountHandler = userApi.CreateAUserServiceAccountHandlerFunc(func(params userApi.CreateAUserServiceAccountParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateAUserServiceAccountResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewCreateAUserServiceAccountCreated().WithPayload(creds)
	})
	// Create User Service Account
	api.UserCreateServiceAccountCredentialsHandler = userApi.CreateServiceAccountCredentialsHandlerFunc(func(params userApi.CreateServiceAccountCredentialsParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateAUserServiceAccountCredsResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewCreateServiceAccountCredentialsCreated().WithPayload(creds)
	})
	api.ServiceAccountCreateServiceAccountCredsHandler = saApi.CreateServiceAccountCredsHandlerFunc(func(params saApi.CreateServiceAccountCredsParams, session *models.Principal) middleware.Responder {
		creds, err := getCreateServiceAccountCredsResponse(session, params)
		if err != nil {
			return saApi.NewCreateServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return userApi.NewCreateServiceAccountCredentialsCreated().WithPayload(creds)
	})
	// List Service Accounts for User
	api.ServiceAccountListUserServiceAccountsHandler = saApi.ListUserServiceAccountsHandlerFunc(func(params saApi.ListUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
		defer cancel()
		serviceAccounts, err := getUserServiceAccountsResponse(ctx, session, "")
		if err != nil {
			return saApi.NewListUserServiceAccountsDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewListUserServiceAccountsOK().WithPayload(serviceAccounts)
	})

	// Delete a User's service account
	api.ServiceAccountDeleteServiceAccountHandler = saApi.DeleteServiceAccountHandlerFunc(func(params saApi.DeleteServiceAccountParams, session *models.Principal) middleware.Responder {
		if err := getDeleteServiceAccountResponse(session, params); err != nil {
			return saApi.NewDeleteServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewDeleteServiceAccountNoContent()
	})

	// List Service Accounts for User
	api.UserListAUserServiceAccountsHandler = userApi.ListAUserServiceAccountsHandlerFunc(func(params userApi.ListAUserServiceAccountsParams, session *models.Principal) middleware.Responder {
		ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
		defer cancel()
		serviceAccounts, err := getUserServiceAccountsResponse(ctx, session, params.Name)
		if err != nil {
			return saApi.NewListUserServiceAccountsDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewListUserServiceAccountsOK().WithPayload(serviceAccounts)
	})

	api.ServiceAccountGetServiceAccountHandler = saApi.GetServiceAccountHandlerFunc(func(params saApi.GetServiceAccountParams, session *models.Principal) middleware.Responder {
		serviceAccounts, err := getServiceAccountInfo(session, params)
		if err != nil {
			return saApi.NewGetServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewGetServiceAccountOK().WithPayload(serviceAccounts)
	})

	api.ServiceAccountUpdateServiceAccountHandler = saApi.UpdateServiceAccountHandlerFunc(func(params saApi.UpdateServiceAccountParams, session *models.Principal) middleware.Responder {
		err := updateSetServiceAccountResponse(session, params)
		if err != nil {
			return saApi.NewUpdateServiceAccountDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewUpdateServiceAccountOK()
	})

	// Delete multiple service accounts
	api.ServiceAccountDeleteMultipleServiceAccountsHandler = saApi.DeleteMultipleServiceAccountsHandlerFunc(func(params saApi.DeleteMultipleServiceAccountsParams, session *models.Principal) middleware.Responder {
		if err := getDeleteMultipleServiceAccountsResponse(session, params); err != nil {
			return saApi.NewDeleteMultipleServiceAccountsDefault(err.Code).WithPayload(err.APIError)
		}
		return saApi.NewDeleteMultipleServiceAccountsNoContent()
	})
}

// createServiceAccount adds a service account to the userClient and assigns a policy to him if defined.
func createServiceAccount(ctx context.Context, userClient MinioAdmin, policy string, name string, description string, expiry *time.Time, comment string) (*models.ServiceAccountCreds, error) {
	creds, err := userClient.addServiceAccount(ctx, policy, "", "", "", name, description, expiry, comment)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

// createServiceAccount adds a service account with the given credentials to the
// userClient and assigns a policy to him if defined.
func createServiceAccountCreds(ctx context.Context, userClient MinioAdmin, policy string, accessKey string, secretKey string, name string, description string, expiry *time.Time, comment string) (*models.ServiceAccountCreds, error) {
	creds, err := userClient.addServiceAccount(ctx, policy, "", accessKey, secretKey, name, description, expiry, comment)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

// getCreateServiceAccountResponse creates a service account with the defined policy for the user that
// is requesting, it first gets the credentials of the user and creates a client which is going to
// make the call to create the Service Account
func getCreateServiceAccountResponse(session *models.Principal, params saApi.CreateServiceAccountParams) (*models.ServiceAccountCreds, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	var expiry *time.Time
	if params.Body.Expiry != "" {
		parsedExpiry, err := time.Parse(time.RFC3339, params.Body.Expiry)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		expiry = &parsedExpiry
	}
	saCreds, err := createServiceAccount(ctx, userAdminClient, params.Body.Policy, params.Body.Name, params.Body.Description, expiry, params.Body.Comment)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return saCreds, nil
}

// createServiceAccount adds a service account to a given user and assigns a policy to him if defined.
func createAUserServiceAccount(ctx context.Context, userClient MinioAdmin, policy string, user string, name string, description string, expiry *time.Time, comment string) (*models.ServiceAccountCreds, error) {
	creds, err := userClient.addServiceAccount(ctx, policy, user, "", "", name, description, expiry, comment)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

func createAUserServiceAccountCreds(ctx context.Context, userClient MinioAdmin, policy string, user string, accessKey string, secretKey string, name string, description string, expiry *time.Time, comment string) (*models.ServiceAccountCreds, error) {
	creds, err := userClient.addServiceAccount(ctx, policy, user, accessKey, secretKey, name, description, expiry, comment)
	if err != nil {
		return nil, err
	}
	return &models.ServiceAccountCreds{AccessKey: creds.AccessKey, SecretKey: creds.SecretKey, URL: getMinIOServer()}, nil
}

// getCreateServiceAccountResponse creates a service account with the defined policy for the user that
// is requesting it ,it first gets the credentials of the user and creates a client which is going to
// make the call to create the Service Account
func getCreateAUserServiceAccountResponse(session *models.Principal, params userApi.CreateAUserServiceAccountParams) (*models.ServiceAccountCreds, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	var expiry *time.Time
	if params.Body.Expiry != "" {
		parsedExpiry, err := time.Parse(time.RFC3339, params.Body.Expiry)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		expiry = &parsedExpiry
	}
	saCreds, err := createAUserServiceAccount(ctx, userAdminClient, params.Body.Policy, params.Name, params.Body.Name, params.Body.Description, expiry, params.Body.Comment)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return saCreds, nil
}

// getCreateServiceAccountCredsResponse creates a service account with the defined policy for the user that
// is requesting it, and with the credentials provided
func getCreateAUserServiceAccountCredsResponse(session *models.Principal, params userApi.CreateServiceAccountCredentialsParams) (*models.ServiceAccountCreds, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	serviceAccount := params.Body
	if params.Name == serviceAccount.AccessKey {
		return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
	}
	accounts, err := userAdminClient.listServiceAccounts(ctx, params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	for i := 0; i < len(accounts.Accounts); i++ {
		if accounts.Accounts[i].AccessKey == serviceAccount.AccessKey {
			return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
		}
	}

	var expiry *time.Time
	if serviceAccount.Expiry != "" {
		parsedExpiry, err := time.Parse(time.RFC3339, serviceAccount.Expiry)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		expiry = &parsedExpiry
	}
	saCreds, err := createAUserServiceAccountCreds(ctx, userAdminClient, serviceAccount.Policy, params.Name, serviceAccount.AccessKey, serviceAccount.SecretKey, serviceAccount.Name, serviceAccount.Description, expiry, serviceAccount.Comment)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return saCreds, nil
}

func getCreateServiceAccountCredsResponse(session *models.Principal, params saApi.CreateServiceAccountCredsParams) (*models.ServiceAccountCreds, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	serviceAccount := params.Body
	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
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
		if accounts.Accounts[i].AccessKey == serviceAccount.AccessKey {
			return nil, ErrorWithContext(ctx, errors.New("Access Key already in use"))
		}
	}

	var expiry *time.Time
	if params.Body.Expiry != "" {
		parsedExpiry, err := time.Parse(time.RFC3339, params.Body.Expiry)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		expiry = &parsedExpiry
	}

	saCreds, err := createServiceAccountCreds(ctx, userAdminClient, serviceAccount.Policy, serviceAccount.AccessKey, serviceAccount.SecretKey, params.Body.Name, params.Body.Description, expiry, params.Body.Comment)
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
	saList := models.ServiceAccounts{}

	for _, acc := range listServAccs.Accounts {
		if acc.AccountStatus != "" {
			// Newer releases of MinIO would support enhanced listServiceAccounts()
			// we can avoid infoServiceAccount() at that point, this scales well
			// for 100's of service accounts.
			expiry := ""
			if acc.Expiration != nil {
				expiry = acc.Expiration.Format(time.RFC3339)
			}

			saList = append(saList, &models.ServiceAccountsItems0{
				AccountStatus: acc.AccountStatus,
				Description:   acc.Description,
				Expiration:    expiry,
				Name:          acc.Name,
				AccessKey:     acc.AccessKey,
			})
			continue
		}

		aInfo, err := userClient.infoServiceAccount(ctx, acc.AccessKey)
		if err != nil {
			continue
		}
		expiry := ""
		if aInfo.Expiration != nil {
			expiry = aInfo.Expiration.Format(time.RFC3339)
		}

		saList = append(saList, &models.ServiceAccountsItems0{
			AccountStatus: aInfo.AccountStatus,
			Description:   aInfo.Description,
			Expiration:    expiry,
			Name:          aInfo.Name,
			AccessKey:     acc.AccessKey,
		})
	}
	return saList, nil
}

// getUserServiceAccountsResponse authenticates the user and calls
// getUserServiceAccounts to list the user's service accounts
func getUserServiceAccountsResponse(ctx context.Context, session *models.Principal, user string) (models.ServiceAccounts, *CodedAPIError) {
	userAdmin, err := NewMinioAdminClient(ctx, session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
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
func getDeleteServiceAccountResponse(session *models.Principal, params saApi.DeleteServiceAccountParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}
	if err := deleteServiceAccount(ctx, userAdminClient, params.AccessKey); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// getServiceAccountDetails gets policy for a service account
func getServiceAccountDetails(ctx context.Context, userClient MinioAdmin, accessKey string) (*models.ServiceAccount, error) {
	saInfo, err := userClient.infoServiceAccount(ctx, accessKey)
	if err != nil {
		return nil, err
	}

	var policyJSON string
	var policy iampolicy.Policy
	json.Unmarshal([]byte(saInfo.Policy), &policy)
	if policy.Statements == nil {
		policyJSON = ""
	} else {
		policyJSON = saInfo.Policy
	}

	expiry := ""
	if saInfo.Expiration != nil {
		expiry = saInfo.Expiration.Format(time.RFC3339)
	}

	sa := models.ServiceAccount{
		AccountStatus: saInfo.AccountStatus,
		Description:   saInfo.Description,
		Expiration:    expiry,
		ImpliedPolicy: saInfo.ImpliedPolicy,
		Name:          saInfo.Name,
		ParentUser:    saInfo.ParentUser,
		Policy:        policyJSON,
	}
	return &sa, nil
}

// getServiceAccountInfo authenticates the user and calls
// getServiceAccountInfo to get the policy for a service account
func getServiceAccountInfo(session *models.Principal, params saApi.GetServiceAccountParams) (*models.ServiceAccount, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	serviceAccount, err := getServiceAccountDetails(ctx, userAdminClient, params.AccessKey)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return serviceAccount, nil
}

// setServiceAccountPolicy sets policy for a service account
func updateServiceAccountDetails(ctx context.Context, userClient MinioAdmin, accessKey string, policy string, expiry *time.Time, name string, description string, status string, secretKey string) error {
	req := madmin.UpdateServiceAccountReq{
		NewPolicy:      json.RawMessage(policy),
		NewSecretKey:   secretKey,
		NewStatus:      status,
		NewName:        name,
		NewDescription: description,
		NewExpiration:  expiry,
	}

	err := userClient.updateServiceAccount(ctx, accessKey, req)
	return err
}

// updateSetServiceAccountResponse authenticates the user and calls
// getSetServiceAccountPolicy to set the policy for a service account
func updateSetServiceAccountResponse(session *models.Principal, params saApi.UpdateServiceAccountParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	policy := *params.Body.Policy
	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := AdminClient{Client: userAdmin}

	var expiry *time.Time
	if params.Body.Expiry != "" {
		parsedExpiry, err := time.Parse(time.RFC3339, params.Body.Expiry)
		if err != nil {
			return ErrorWithContext(ctx, err)
		}
		expiry = &parsedExpiry
	}
	err = updateServiceAccountDetails(ctx, userAdminClient, params.AccessKey, policy, expiry, params.Body.Name, params.Body.Description, params.Body.Status, params.Body.SecretKey)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// getDeleteMultipleServiceAccountsResponse authenticates the user and calls deleteServiceAccount for each account listed in selectedSAs
func getDeleteMultipleServiceAccountsResponse(session *models.Principal, params saApi.DeleteMultipleServiceAccountsParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	selectedSAs := params.SelectedSA
	userAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
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

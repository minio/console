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
	"bytes"
	"context"
	"log"
	"strings"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
	iampolicy "github.com/minio/minio/pkg/iam/policy"
)

func registerServiceAccountsHandlers(api *operations.McsAPI) {
	// Create Service Account
	api.UserAPICreateServiceAccountHandler = user_api.CreateServiceAccountHandlerFunc(func(params user_api.CreateServiceAccountParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		creds, err := getCreateServiceAccountResponse(sessionID, params.Body)
		if err != nil {
			return user_api.NewCreateServiceAccountDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewCreateServiceAccountCreated().WithPayload(creds)
	})
}

// createServiceAccount adds a service account to the userClient and assigns a policy to him if defined.
func createServiceAccount(ctx context.Context, userClient MinioAdmin, policy string) (*models.ServiceAccountCreds, error) {
	iamPolicy := &iampolicy.Policy{}
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
func getCreateServiceAccountResponse(userSessionID string, serviceAccount *models.ServiceAccount) (*models.ServiceAccountCreds, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	userAdmin, err := newMAdminClient(userSessionID)
	if err != nil {
		log.Println("error creating user Client:", err)
		return nil, err
	}
	// create a MinIO user Admin Client interface implementation
	// defining the client to be used
	userAdminClient := adminClient{client: userAdmin}

	saCreds, err := createServiceAccount(ctx, userAdminClient, serviceAccount.Policy)
	if err != nil {
		log.Println("error creating service account:", err)
		return nil, err
	}
	return saCreds, nil
}

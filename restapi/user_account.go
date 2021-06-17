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
	"net/http"
	"time"

	iampolicy "github.com/minio/pkg/iam/policy"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

func registerAccountHandlers(api *operations.ConsoleAPI) {
	// change user password
	api.UserAPIAccountChangePasswordHandler = user_api.AccountChangePasswordHandlerFunc(func(params user_api.AccountChangePasswordParams, session *models.Principal) middleware.Responder {
		changePasswordResponse, err := getChangePasswordResponse(session, params)
		if err != nil {
			return user_api.NewAccountChangePasswordDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to update the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(changePasswordResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginCreated().WithPayload(changePasswordResponse).WriteResponse(w, p)
		})
	})
	// Checks if user can perform an action
	api.UserAPIHasPermissionToHandler = user_api.HasPermissionToHandlerFunc(func(params user_api.HasPermissionToParams, session *models.Principal) middleware.Responder {
		hasPermissionRespose, err := getUserHasPermissionsResponse(session, params)
		if err != nil {
			return user_api.NewHasPermissionToDefault(500).WithPayload(err)
		}
		// Custom response writer to update the session cookies
		return user_api.NewHasPermissionToCreated().WithPayload(hasPermissionRespose)
	})
}

// changePassword validate current current user password and if it's correct set the new password
func changePassword(ctx context.Context, client MinioAdmin, session *models.Principal, newSecretKey string) error {
	return client.changePassword(ctx, session.AccountAccessKey, newSecretKey)
}

// getChangePasswordResponse will validate user knows what is the current password (avoid account hijacking), update user account password
// and authenticate the user generating a new session token/cookie
func getChangePasswordResponse(session *models.Principal, params user_api.AccountChangePasswordParams) (*models.LoginResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	// changePassword operations requires an AdminClient initialized with parent account credentials not
	// STS credentials
	parentAccountClient, err := newAdminClient(&models.Principal{
		STSAccessKeyID:     session.AccountAccessKey,
		STSSecretAccessKey: *params.Body.CurrentSecretKey,
	})
	if err != nil {
		return nil, prepareError(err)
	}
	// parentAccountClient will contain access and secret key credentials for the user
	userClient := adminClient{client: parentAccountClient}
	accessKey := session.AccountAccessKey
	newSecretKey := *params.Body.NewSecretKey

	// currentSecretKey will compare currentSecretKey against the stored secret key inside the encrypted session
	if err := changePassword(ctx, userClient, session, newSecretKey); err != nil {
		return nil, prepareError(errChangePassword, nil, err)
	}
	// user credentials are updated at this point, we need to generate a new admin client and authenticate using
	// the new credentials
	credentials, err := getConsoleCredentials(ctx, accessKey, newSecretKey)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// authenticate user and generate new session token
	sessionID, err := login(credentials)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

func getUserHasPermissionsResponse(session *models.Principal, params user_api.HasPermissionToParams) (*models.HasPermissionResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	userPolicy, err := getAccountPolicy(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}

	var perms []*models.PermissionAction

	for _, p := range params.Body.Actions {
		canPerform := userCanDo(iampolicy.Args{
			Action:     iampolicy.Action(p.Action),
			BucketName: p.BucketName,
		}, userPolicy)
		perms = append(perms, &models.PermissionAction{
			Can: canPerform,
			ID:  p.ID,
		})
	}

	return &models.HasPermissionResponse{
		Permissions: perms,
	}, nil
}

func userCanDo(arg iampolicy.Args, userPolicy *iampolicy.Policy) bool {
	// check in all the statements if any allows the passed action
	for _, stmt := range userPolicy.Statements {
		if stmt.IsAllowed(arg) {
			return true
		}
	}
	return false
}

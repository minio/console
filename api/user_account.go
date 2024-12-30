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
	"net/http"

	authApi "github.com/minio/console/api/operations/auth"

	"github.com/minio/console/pkg/auth"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	accountApi "github.com/minio/console/api/operations/account"
	"github.com/minio/console/models"
)

func registerAccountHandlers(api *operations.ConsoleAPI) {
	// change user password
	api.AccountAccountChangePasswordHandler = accountApi.AccountChangePasswordHandlerFunc(func(params accountApi.AccountChangePasswordParams, session *models.Principal) middleware.Responder {
		changePasswordResponse, err := getChangePasswordResponse(session, params)
		if err != nil {
			return accountApi.NewAccountChangePasswordDefault(err.Code).WithPayload(err.APIError)
		}
		// Custom response writer to update the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(changePasswordResponse.SessionID)
			http.SetCookie(w, &cookie)
			authApi.NewLoginNoContent().WriteResponse(w, p)
		})
	})
}

// changePassword validate current current user password and if it's correct set the new password
func changePassword(ctx context.Context, client MinioAdmin, session *models.Principal, newSecretKey string) error {
	return client.changePassword(ctx, session.AccountAccessKey, newSecretKey)
}

// getChangePasswordResponse will validate user knows what is the current password (avoid account hijacking), update user account password
// and authenticate the user generating a new session token/cookie
func getChangePasswordResponse(session *models.Principal, params accountApi.AccountChangePasswordParams) (*models.LoginResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	clientIP := getClientIP(params.HTTPRequest)
	client := GetConsoleHTTPClient(clientIP)

	// changePassword operations requires an AdminClient initialized with parent account credentials not
	// STS credentials
	parentAccountClient, err := NewMinioAdminClient(params.HTTPRequest.Context(), &models.Principal{
		STSAccessKeyID:     session.AccountAccessKey,
		STSSecretAccessKey: *params.Body.CurrentSecretKey,
	})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// parentAccountClient will contain access and secret key credentials for the user
	userClient := AdminClient{Client: parentAccountClient}
	accessKey := session.AccountAccessKey
	newSecretKey := *params.Body.NewSecretKey

	// currentSecretKey will compare currentSecretKey against the stored secret key inside the encrypted session
	if err := changePassword(ctx, userClient, session, newSecretKey); err != nil {
		return nil, ErrorWithContext(ctx, ErrChangePassword, nil, err)
	}
	// user credentials are updated at this point, we need to generate a new admin client and authenticate using
	// the new credentials
	credentials, err := getConsoleCredentials(accessKey, newSecretKey, client)
	if err != nil {
		return nil, ErrorWithContext(ctx, ErrInvalidLogin, nil, err)
	}
	// authenticate user and generate new session token
	sessionID, err := login(credentials, &auth.SessionFeatures{HideMenu: session.Hm})
	if err != nil {
		return nil, ErrorWithContext(ctx, ErrInvalidLogin, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

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

	"github.com/minio/madmin-go"

	"github.com/minio/minio-go/v7/pkg/credentials"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/minio/console/restapi/operations"
	authApi "github.com/minio/console/restapi/operations/auth"
)

func registerLoginHandlers(api *operations.ConsoleAPI) {
	// GET login strategy
	api.AuthLoginDetailHandler = authApi.LoginDetailHandlerFunc(func(params authApi.LoginDetailParams) middleware.Responder {
		loginDetails, err := getLoginDetailsResponse(params.HTTPRequest)
		if err != nil {
			return authApi.NewLoginDetailDefault(int(err.Code)).WithPayload(err)
		}
		return authApi.NewLoginDetailOK().WithPayload(loginDetails)
	})
	// POST login using user credentials
	api.AuthLoginHandler = authApi.LoginHandlerFunc(func(params authApi.LoginParams) middleware.Responder {
		loginResponse, err := getLoginResponse(params.Body)
		if err != nil {
			return authApi.NewLoginDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			authApi.NewLoginNoContent().WriteResponse(w, p)
		})
	})
	// POST login using external IDP
	api.AuthLoginOauth2AuthHandler = authApi.LoginOauth2AuthHandlerFunc(func(params authApi.LoginOauth2AuthParams) middleware.Responder {
		loginResponse, err := getLoginOauth2AuthResponse(params.HTTPRequest, params.Body)
		if err != nil {
			return authApi.NewLoginOauth2AuthDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			authApi.NewLoginOauth2AuthNoContent().WriteResponse(w, p)
		})
	})
}

// login performs a check of ConsoleCredentials against MinIO, generates some claims and returns the jwt
// for subsequent authentication
func login(credentials ConsoleCredentialsI, sessionFeatures *auth.SessionFeatures) (*string, error) {
	// try to obtain consoleCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		return nil, err
	}
	// if we made it here, the consoleCredentials work, generate a jwt with claims
	token, err := auth.NewEncryptedTokenForClient(&tokens, credentials.GetAccountAccessKey(), sessionFeatures)
	if err != nil {
		LogError("error authenticating user: %v", err)
		return nil, errInvalidCredentials
	}
	return &token, nil
}

// getAccountInfo will return the current user information
func getAccountInfo(ctx context.Context, client MinioAdmin) (*madmin.AccountInfo, error) {
	accountInfo, err := client.AccountInfo(ctx)
	if err != nil {
		return nil, err
	}
	return &accountInfo, nil
}

// getConsoleCredentials will return ConsoleCredentials interface
func getConsoleCredentials(accessKey, secretKey string) (*ConsoleCredentials, error) {
	creds, err := NewConsoleCredentials(accessKey, secretKey, GetMinIORegion())
	if err != nil {
		return nil, err
	}
	return &ConsoleCredentials{
		ConsoleCredentials: creds,
		AccountAccessKey:   accessKey,
	}, nil
}

// getLoginResponse performs login() and serializes it to the handler's output
func getLoginResponse(lr *models.LoginRequest) (*models.LoginResponse, *models.Error) {
	// prepare console credentials
	consoleCreds, err := getConsoleCredentials(*lr.AccessKey, *lr.SecretKey)
	if err != nil {
		return nil, prepareError(err, errInvalidCredentials, err)
	}
	sf := &auth.SessionFeatures{}
	if lr.Features != nil {
		sf.HideMenu = lr.Features.HideMenu
	}
	sessionID, err := login(consoleCreds, sf)
	if err != nil {
		return nil, prepareError(err, errInvalidCredentials, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

// getLoginDetailsResponse returns information regarding the Console authentication mechanism.
func getLoginDetailsResponse(r *http.Request) (*models.LoginDetails, *models.Error) {
	loginStrategy := models.LoginDetailsLoginStrategyForm
	redirectURL := ""

	if oauth2.IsIDPEnabled() {
		loginStrategy = models.LoginDetailsLoginStrategyRedirect
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(nil, r, GetConsoleHTTPClient())
		if err != nil {
			return nil, prepareError(err, errOauth2Provider)
		}
		// Validate user against IDP
		identityProvider := &auth.IdentityProvider{Client: oauth2Client}
		redirectURL = identityProvider.GenerateLoginURL()
	}

	loginDetails := &models.LoginDetails{
		LoginStrategy: loginStrategy,
		Redirect:      redirectURL,
	}
	return loginDetails, nil
}

// verifyUserAgainstIDP will verify user identity against the configured IDP and return MinIO credentials
func verifyUserAgainstIDP(ctx context.Context, provider auth.IdentityProviderI, code, state string) (*credentials.Credentials, error) {
	userCredentials, err := provider.VerifyIdentity(ctx, code, state)
	if err != nil {
		LogError("error validating user identity against idp: %v", err)
		return nil, errInvalidCredentials
	}
	return userCredentials, nil
}

func getLoginOauth2AuthResponse(r *http.Request, lr *models.LoginOauth2AuthRequest) (*models.LoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if oauth2.IsIDPEnabled() {
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(nil, r, GetConsoleHTTPClient())
		if err != nil {
			return nil, prepareError(err)
		}
		// initialize new identity provider
		identityProvider := auth.IdentityProvider{Client: oauth2Client}
		// Validate user against IDP
		userCredentials, err := verifyUserAgainstIDP(ctx, identityProvider, *lr.Code, *lr.State)
		if err != nil {
			return nil, prepareError(err)
		}
		// initialize admin client
		// login user against console and generate session token
		token, err := login(&ConsoleCredentials{
			ConsoleCredentials: userCredentials,
			AccountAccessKey:   "",
		}, nil)
		if err != nil {
			return nil, prepareError(err)
		}
		// serialize output
		loginResponse := &models.LoginResponse{
			SessionID: *token,
		}
		return loginResponse, nil
	}
	return nil, prepareError(ErrorGeneric)
}

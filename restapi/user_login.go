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
	"net/http"
	"time"

	"github.com/minio/minio-go/v7/pkg/credentials"

	iampolicy "github.com/minio/pkg/iam/policy"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

func registerLoginHandlers(api *operations.ConsoleAPI) {
	// GET login strategy
	api.UserAPILoginDetailHandler = user_api.LoginDetailHandlerFunc(func(params user_api.LoginDetailParams) middleware.Responder {
		loginDetails, err := getLoginDetailsResponse(params.HTTPRequest)
		if err != nil {
			return user_api.NewLoginDetailDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewLoginDetailOK().WithPayload(loginDetails)
	})
	// POST login using user credentials
	api.UserAPILoginHandler = user_api.LoginHandlerFunc(func(params user_api.LoginParams) middleware.Responder {
		loginResponse, err := getLoginResponse(params.Body)
		if err != nil {
			return user_api.NewLoginDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginNoContent().WriteResponse(w, p)
		})
	})
	// POST login using external IDP
	api.UserAPILoginOauth2AuthHandler = user_api.LoginOauth2AuthHandlerFunc(func(params user_api.LoginOauth2AuthParams) middleware.Responder {
		loginResponse, err := getLoginOauth2AuthResponse(params.HTTPRequest, params.Body)
		if err != nil {
			return user_api.NewLoginOauth2AuthDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginOauth2AuthNoContent().WriteResponse(w, p)
		})
	})
}

// login performs a check of ConsoleCredentials against MinIO, generates some claims and returns the jwt
// for subsequent authentication
func login(credentials ConsoleCredentialsI) (*string, error) {
	// try to obtain consoleCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		return nil, err
	}
	// if we made it here, the consoleCredentials work, generate a jwt with claims
	token, err := auth.NewEncryptedTokenForClient(&tokens, credentials.GetAccountAccessKey())
	if err != nil {
		LogError("error authenticating user: %v", err)
		return nil, errInvalidCredentials
	}
	return &token, nil
}

// getAccountPolicy will return the associated policy of the current account
func getAccountPolicy(ctx context.Context, client MinioAdmin) (*iampolicy.Policy, error) {
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	accountInfo, err := client.AccountInfo(ctx)
	if err != nil {
		return nil, err
	}
	return iampolicy.ParseConfig(bytes.NewReader(accountInfo.Policy))
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
	consolCreds, err := getConsoleCredentials(*lr.AccessKey, *lr.SecretKey)
	if err != nil {
		return nil, prepareError(err, errInvalidCredentials, err)
	}
	sessionID, err := login(consolCreds)
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
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
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
		})
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

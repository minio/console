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
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

func registerLoginHandlers(api *operations.ConsoleAPI) {
	// get login strategy
	api.UserAPILoginDetailHandler = user_api.LoginDetailHandlerFunc(func(params user_api.LoginDetailParams) middleware.Responder {
		loginDetails, err := getLoginDetailsResponse()
		if err != nil {
			return user_api.NewLoginDetailDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewLoginDetailOK().WithPayload(loginDetails)
	})
	// post login
	api.UserAPILoginHandler = user_api.LoginHandlerFunc(func(params user_api.LoginParams) middleware.Responder {
		loginResponse, err := getLoginResponse(params.Body)
		if err != nil {
			return user_api.NewLoginDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginCreated().WithPayload(loginResponse).WriteResponse(w, p)
		})
	})
	api.UserAPILoginOauth2AuthHandler = user_api.LoginOauth2AuthHandlerFunc(func(params user_api.LoginOauth2AuthParams) middleware.Responder {
		loginResponse, err := getLoginOauth2AuthResponse(params.Body)
		if err != nil {
			return user_api.NewLoginOauth2AuthDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginOauth2AuthCreated().WithPayload(loginResponse).WriteResponse(w, p)
		})
	})
	api.UserAPILoginOperatorHandler = user_api.LoginOperatorHandlerFunc(func(params user_api.LoginOperatorParams) middleware.Responder {
		loginResponse, err := getLoginOperatorResponse(params.Body)
		if err != nil {
			return user_api.NewLoginOperatorDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginOperatorCreated().WithPayload(loginResponse).WriteResponse(w, p)
		})
	})
}

// login performs a check of consoleCredentials against MinIO, generates some claims and returns the jwt
// for subsequent authentication
func login(credentials ConsoleCredentialsI) (*string, error) {
	// try to obtain consoleCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		return nil, err
	}
	// if we made it here, the consoleCredentials work, generate a jwt with claims
	token, err := auth.NewEncryptedTokenForClient(&tokens, credentials.GetAccountAccessKey(), credentials.GetActions())
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
	accountInfo, err := client.accountInfo(ctx)
	if err != nil {
		return nil, err
	}
	return iampolicy.ParseConfig(bytes.NewReader(accountInfo.Policy))
}

// getConsoleCredentials will return consoleCredentials interface including the associated policy of the current account
func getConsoleCredentials(ctx context.Context, accessKey, secretKey string) (*consoleCredentials, error) {
	creds, err := newConsoleCredentials(accessKey, secretKey, getMinIORegion())
	if err != nil {
		return nil, err
	}
	// cCredentials will be sts credentials, account credentials will be need it in the scenario the user wish
	// to change its password
	cCredentials := &consoleCredentials{
		consoleCredentials: creds,
		accountAccessKey:   accessKey,
	}
	tokens, err := cCredentials.Get()
	if err != nil {
		return nil, err
	}
	// initialize admin client
	mAdminClient, err := newAdminClient(&models.Principal{
		STSAccessKeyID:     tokens.AccessKeyID,
		STSSecretAccessKey: tokens.SecretAccessKey,
		STSSessionToken:    tokens.SessionToken,
	})
	if err != nil {
		return nil, err
	}
	userAdminClient := adminClient{client: mAdminClient}
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	policy, err := getAccountPolicy(ctx, userAdminClient)
	if err != nil {
		return nil, err
	}
	// by default every user starts with an empty array of available actions
	// therefore we would have access only to pages that doesn't require any privilege
	// ie: service-account page
	var actions []string
	// if a policy is assigned to this user we parse the actions from there
	if policy != nil {
		actions = acl.GetActionsStringFromPolicy(policy)
	}
	cCredentials.actions = actions
	return cCredentials, nil
}

// getLoginResponse performs login() and serializes it to the handler's output
func getLoginResponse(lr *models.LoginRequest) (*models.LoginResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// prepare console credentials
	consolCreds, err := getConsoleCredentials(ctx, *lr.AccessKey, *lr.SecretKey)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	sessionID, err := login(consolCreds)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

// getLoginDetailsResponse returns information regarding the Console authentication mechanism.
func getLoginDetailsResponse() (*models.LoginDetails, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	loginStrategy := models.LoginDetailsLoginStrategyForm
	redirectURL := ""

	if oauth2.IsIdpEnabled() {
		loginStrategy = models.LoginDetailsLoginStrategyRedirect
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(ctx, nil, GetConsoleSTSClient())
		if err != nil {
			return nil, prepareError(err)
		}
		// Validate user against IDP
		identityProvider := &auth.IdentityProvider{Client: oauth2Client}
		redirectURL = identityProvider.GenerateLoginURL()
	} else if acl.GetOperatorMode() {
		loginStrategy = models.LoginDetailsLoginStrategyServiceDashAccount
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

func getLoginOauth2AuthResponse(lr *models.LoginOauth2AuthRequest) (*models.LoginResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	if acl.GetOperatorMode() {
		creds, err := newConsoleCredentials("", getK8sSAToken(), "")
		if err != nil {
			return nil, prepareError(err)
		}
		credentials := consoleCredentials{consoleCredentials: creds, actions: []string{}}
		token, err := login(credentials)
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		// serialize output
		loginResponse := &models.LoginResponse{
			SessionID: *token,
		}
		return loginResponse, nil
	} else if oauth2.IsIdpEnabled() {
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(ctx, nil, GetConsoleSTSClient())
		if err != nil {
			return nil, prepareError(err)
		}
		// initialize new identity provider
		identityProvider := auth.IdentityProvider{Client: oauth2Client}
		// Validate user against IDP
		userCredentials, err := verifyUserAgainstIDP(ctx, identityProvider, *lr.Code, *lr.State)
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		creds, err := userCredentials.Get()
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		// initialize admin client
		mAdminClient, err := newAdminClient(&models.Principal{
			STSAccessKeyID:     creds.AccessKeyID,
			STSSecretAccessKey: creds.SecretAccessKey,
			STSSessionToken:    creds.SessionToken,
		})
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		userAdminClient := adminClient{client: mAdminClient}
		// Obtain the current policy assigned to this user
		// necessary for generating the list of allowed endpoints
		policy, err := getAccountPolicy(ctx, userAdminClient)
		if err != nil {
			return nil, prepareError(errorGeneric, nil, err)
		}
		// by default every user starts with an empty array of available actions
		// therefore we would have access only to pages that doesn't require any privilege
		// ie: service-account page
		var actions []string
		// if a policy is assigned to this user we parse the actions from there
		if policy != nil {
			actions = acl.GetActionsStringFromPolicy(policy)
		}
		// login user against console and generate session token
		token, err := login(&consoleCredentials{
			consoleCredentials: userCredentials,
			accountAccessKey:   "",
			actions:            actions,
		})
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		// serialize output
		loginResponse := &models.LoginResponse{
			SessionID: *token,
		}
		return loginResponse, nil
	}
	return nil, prepareError(errorGeneric)
}

// getLoginOperatorResponse validate the provided service account token against k8s api
func getLoginOperatorResponse(lmr *models.LoginOperatorRequest) (*models.LoginResponse, *models.Error) {
	creds, err := newConsoleCredentials("", *lmr.Jwt, "")
	if err != nil {
		return nil, prepareError(err)
	}
	consoleCreds := consoleCredentials{consoleCredentials: creds, actions: []string{}}
	token, err := login(consoleCreds)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *token,
	}
	return loginResponse, nil
}

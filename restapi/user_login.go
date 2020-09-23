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
	"context"
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/minio/console/pkg/auth/utils"
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
		return user_api.NewLoginCreated().WithPayload(loginResponse)
	})
	api.UserAPILoginOauth2AuthHandler = user_api.LoginOauth2AuthHandlerFunc(func(params user_api.LoginOauth2AuthParams) middleware.Responder {
		loginResponse, err := getLoginOauth2AuthResponse(params.Body)
		if err != nil {
			return user_api.NewLoginOauth2AuthDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewLoginOauth2AuthCreated().WithPayload(loginResponse)
	})
	api.UserAPILoginOperatorHandler = user_api.LoginOperatorHandlerFunc(func(params user_api.LoginOperatorParams) middleware.Responder {
		loginResponse, err := getLoginOperatorResponse(params.Body)
		if err != nil {
			return user_api.NewLoginOperatorDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewLoginOperatorCreated().WithPayload(loginResponse)
	})
}

// login performs a check of consoleCredentials against MinIO, generates some claims and returns the jwt
// for subsequent authentication
func login(credentials ConsoleCredentials, actions []string) (*string, error) {
	// try to obtain consoleCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		return nil, err
	}
	// if we made it here, the consoleCredentials work, generate a jwt with claims
	jwt, err := auth.NewEncryptedTokenForClient(&tokens, actions)
	if err != nil {
		log.Println("error authenticating user", err)
		return nil, errInvalidCredentials
	}
	return &jwt, nil
}

func getConfiguredRegionForLogin(client MinioAdmin) (string, error) {
	location := ""
	configuration, err := getConfig(client, "region")
	if err != nil {
		log.Println("error obtaining MinIO region:", err)
		return location, errorGeneric
	}
	// region is an array of 1 element
	if len(configuration) > 0 {
		location = configuration[0].Value
	}
	return location, nil
}

// getLoginResponse performs login() and serializes it to the handler's output
func getLoginResponse(lr *models.LoginRequest) (*models.LoginResponse, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newSuperMAdminClient()
	if err != nil {
		return nil, prepareError(err)
	}
	adminClient := adminClient{client: mAdmin}
	// obtain the configured MinIO region
	// need it for user authentication
	location, err := getConfiguredRegionForLogin(adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	creds, err := newConsoleCredentials(*lr.AccessKey, *lr.SecretKey, location)
	if err != nil {
		return nil, prepareError(err)
	}
	credentials := consoleCredentials{consoleCredentials: creds}
	// obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	userInfo, err := adminClient.getUserInfo(ctx, *lr.AccessKey)
	if err != nil {
		return nil, prepareError(err)
	}
	policy, _ := adminClient.getPolicy(ctx, userInfo.PolicyName)
	// by default every user starts with an empty array of available actions
	// therefore we would have access only to pages that doesn't require any privilege
	// ie: service-account page
	var actions []string
	// if a policy is assigned to this user we parse the actions from there
	if policy != nil {
		actions = acl.GetActionsStringFromPolicy(policy)
	}
	sessionID, err := login(credentials, actions)
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
	ctx := context.Background()
	loginStrategy := models.LoginDetailsLoginStrategyForm
	redirectURL := ""
	if acl.GetOperatorMode() {
		loginStrategy = models.LoginDetailsLoginStrategyServiceAccount
	} else if oauth2.IsIdpEnabled() {
		loginStrategy = models.LoginDetailsLoginStrategyRedirect
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(ctx, nil)
		if err != nil {
			return nil, prepareError(err)
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

func loginOauth2Auth(ctx context.Context, provider *auth.IdentityProvider, code, state string) (*oauth2.User, error) {
	userIdentity, err := provider.VerifyIdentity(ctx, code, state)
	if err != nil {
		log.Println("error validating user identity against idp:", err)
		return nil, errInvalidCredentials
	}
	return userIdentity, nil
}

func getLoginOauth2AuthResponse(lr *models.LoginOauth2AuthRequest) (*models.LoginResponse, *models.Error) {
	ctx := context.Background()
	if oauth2.IsIdpEnabled() {
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(ctx, nil)
		if err != nil {
			return nil, prepareError(err)
		}
		// initialize new identity provider
		identityProvider := &auth.IdentityProvider{Client: oauth2Client}
		// Validate user against IDP
		identity, err := loginOauth2Auth(ctx, identityProvider, *lr.Code, *lr.State)
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		mAdmin, err := newSuperMAdminClient()
		if err != nil {
			return nil, prepareError(err)
		}
		adminClient := adminClient{client: mAdmin}
		accessKey := identity.Email
		secretKey := utils.RandomCharString(32)
		// obtain the configured MinIO region
		// need it for user authentication
		location, err := getConfiguredRegionForLogin(adminClient)
		if err != nil {
			return nil, prepareError(err)
		}
		// create user in MinIO
		if _, err := addUser(ctx, adminClient, &accessKey, &secretKey, []string{}); err != nil {
			return nil, prepareError(err)
		}
		// rollback user if there's an error after this point
		defer func() {
			if err != nil {
				if errRemove := removeUser(ctx, adminClient, accessKey); errRemove != nil {
					log.Println("error removing user:", errRemove)
				}
			}
		}()
		// assign the "consoleAdmin" policy to this user
		policyName := oauth2.GetIDPPolicyForUser()
		if err := setPolicy(ctx, adminClient, policyName, accessKey, models.PolicyEntityUser); err != nil {
			return nil, prepareError(err)
		}
		// obtain the current policy details, necessary for generating the list of allowed endpoints
		policy, err := adminClient.getPolicy(ctx, policyName)
		if err != nil {
			return nil, prepareError(err)
		}
		actions := acl.GetActionsStringFromPolicy(policy)
		// User was created correctly, create a new session/JWT
		creds, err := newConsoleCredentials(accessKey, secretKey, location)
		if err != nil {
			return nil, prepareError(err)
		}
		credentials := consoleCredentials{consoleCredentials: creds}
		jwt, err := login(credentials, actions)
		if err != nil {
			return nil, prepareError(errInvalidCredentials, nil, err)
		}
		// serialize output
		loginResponse := &models.LoginResponse{
			SessionID: *jwt,
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
	credentials := consoleCredentials{consoleCredentials: creds}
	var actions []string
	jwt, err := login(credentials, actions)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *jwt,
	}
	return loginResponse, nil
}

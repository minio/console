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
	"errors"
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/pkg/acl"
	"github.com/minio/mcs/pkg/auth"
	"github.com/minio/mcs/pkg/auth/idp/oauth2"
	"github.com/minio/mcs/pkg/auth/utils"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
)

var (
	errorGeneric          = errors.New("an error occurred, please try again")
	errInvalidCredentials = errors.New("invalid Credentials")
)

func registerLoginHandlers(api *operations.McsAPI) {
	// get login strategy
	api.UserAPILoginDetailHandler = user_api.LoginDetailHandlerFunc(func(params user_api.LoginDetailParams) middleware.Responder {
		loginDetails, err := getLoginDetailsResponse()
		if err != nil {
			return user_api.NewLoginDetailDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewLoginDetailOK().WithPayload(loginDetails)
	})
	// post login
	api.UserAPILoginHandler = user_api.LoginHandlerFunc(func(params user_api.LoginParams) middleware.Responder {
		loginResponse, err := getLoginResponse(params.Body)
		if err != nil {
			return user_api.NewLoginDefault(401).WithPayload(&models.Error{Code: 401, Message: swag.String(err.Error())})
		}
		return user_api.NewLoginCreated().WithPayload(loginResponse)
	})
	api.UserAPILoginOauth2AuthHandler = user_api.LoginOauth2AuthHandlerFunc(func(params user_api.LoginOauth2AuthParams) middleware.Responder {
		loginResponse, err := getLoginOauth2AuthResponse(params.Body)
		if err != nil {
			return user_api.NewLoginOauth2AuthDefault(401).WithPayload(&models.Error{Code: 401, Message: swag.String(err.Error())})
		}
		return user_api.NewLoginOauth2AuthCreated().WithPayload(loginResponse)
	})
	api.UserAPILoginMkubeHandler = user_api.LoginMkubeHandlerFunc(func(params user_api.LoginMkubeParams) middleware.Responder {
		loginResponse, err := getLoginMkubeResponse(params.Body)
		if err != nil {
			return user_api.NewLoginMkubeDefault(401).WithPayload(&models.Error{Code: 401, Message: swag.String(err.Error())})
		}
		return user_api.NewLoginMkubeCreated().WithPayload(loginResponse)
	})
}

// login performs a check of mcsCredentials against MinIO, generates some claims and returns the jwt
// for subsequent authentication
func login(credentials MCSCredentials, actions []string) (*string, error) {
	// try to obtain mcsCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		log.Println("error authenticating user", err)
		return nil, errInvalidCredentials
	}
	// if we made it here, the mcsCredentials work, generate a jwt with claims
	jwt, err := auth.NewJWTWithClaimsForClient(&tokens, actions, getMinIOServer())
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
func getLoginResponse(lr *models.LoginRequest) (*models.LoginResponse, error) {
	ctx := context.Background()
	mAdmin, err := newSuperMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, errorGeneric
	}
	adminClient := adminClient{client: mAdmin}
	// obtain the configured MinIO region
	// need it for user authentication
	location, err := getConfiguredRegionForLogin(adminClient)
	if err != nil {
		return nil, err
	}
	creds, err := newMcsCredentials(*lr.AccessKey, *lr.SecretKey, location)
	if err != nil {
		log.Println("error login:", err)
		return nil, errInvalidCredentials
	}
	credentials := mcsCredentials{mcsCredentials: creds}
	// obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	userInfo, err := adminClient.getUserInfo(ctx, *lr.AccessKey)
	if err != nil {
		log.Println("error login:", err)
		return nil, errInvalidCredentials
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
		return nil, err
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

// getLoginDetailsResponse returns information regarding the MCS authentication mechanism.
func getLoginDetailsResponse() (*models.LoginDetails, error) {
	ctx := context.Background()
	loginStrategy := models.LoginDetailsLoginStrategyForm
	redirectURL := ""
	if acl.GetOperatorOnly() {
		loginStrategy = models.LoginDetailsLoginStrategyServiceAccount
	} else if oauth2.IsIdpEnabled() {
		loginStrategy = models.LoginDetailsLoginStrategyRedirect
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(ctx, nil)
		if err != nil {
			log.Println("error getting new oauth2 provider client", err)
			return nil, errorGeneric
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
		return nil, errorGeneric
	}
	return userIdentity, nil
}

func getLoginOauth2AuthResponse(lr *models.LoginOauth2AuthRequest) (*models.LoginResponse, error) {
	ctx := context.Background()
	if oauth2.IsIdpEnabled() {
		// initialize new oauth2 client
		oauth2Client, err := oauth2.NewOauth2ProviderClient(ctx, nil)
		if err != nil {
			log.Println("error getting new oauth2 client:", err)
			return nil, errorGeneric
		}
		// initialize new identity provider
		identityProvider := &auth.IdentityProvider{Client: oauth2Client}
		// Validate user against IDP
		identity, err := loginOauth2Auth(ctx, identityProvider, *lr.Code, *lr.State)
		if err != nil {
			return nil, err
		}
		mAdmin, err := newSuperMAdminClient()
		if err != nil {
			log.Println("error creating Madmin Client:", err)
			return nil, errorGeneric
		}
		adminClient := adminClient{client: mAdmin}
		accessKey := identity.Email
		secretKey := utils.RandomCharString(32)
		// obtain the configured MinIO region
		// need it for user authentication
		location, err := getConfiguredRegionForLogin(adminClient)
		if err != nil {
			return nil, err
		}
		// create user in MinIO
		if _, err := addUser(ctx, adminClient, &accessKey, &secretKey, []string{}); err != nil {
			log.Println("error adding user:", err)
			return nil, errorGeneric
		}
		// rollback user if there's an error after this point
		defer func() {
			if err != nil {
				if errRemove := removeUser(ctx, adminClient, accessKey); errRemove != nil {
					log.Println("error removing user:", errRemove)
				}
			}
		}()
		// assign the "mcsAdmin" policy to this user
		policyName := oauth2.GetIDPPolicyForUser()
		if err := setPolicy(ctx, adminClient, policyName, accessKey, models.PolicyEntityUser); err != nil {
			log.Println("error setting policy:", err)
			return nil, errorGeneric
		}
		// obtain the current policy details, necessary for generating the list of allowed endpoints
		policy, err := adminClient.getPolicy(ctx, policyName)
		if err != nil {
			log.Println("error reading policy:", err)
			return nil, errorGeneric
		}
		actions := acl.GetActionsStringFromPolicy(policy)
		// User was created correctly, create a new session/JWT
		creds, err := newMcsCredentials(accessKey, secretKey, location)
		if err != nil {
			log.Println("error login:", err)
			return nil, errorGeneric
		}
		credentials := mcsCredentials{mcsCredentials: creds}
		jwt, err := login(credentials, actions)
		if err != nil {
			return nil, err
		}
		// serialize output
		loginResponse := &models.LoginResponse{
			SessionID: *jwt,
		}
		return loginResponse, nil
	}
	return nil, errorGeneric
}

// getLoginMkubeResponse validate the provided service account token against mkube
func getLoginMkubeResponse(lmr *models.LoginMkubeRequest) (*models.LoginResponse, error) {
	creds, err := newMcsCredentials("", *lmr.Jwt, "")
	if err != nil {
		log.Println("error login:", err)
		return nil, errInvalidCredentials
	}
	credentials := mcsCredentials{mcsCredentials: creds}
	var actions []string
	jwt, err := login(credentials, actions)
	if err != nil {
		return nil, err
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *jwt,
	}
	return loginResponse, nil
}

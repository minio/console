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
	"encoding/base64"
	"encoding/json"
	"net/http"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/minio/console/restapi/operations"
	authApi "github.com/minio/console/restapi/operations/auth"
	"github.com/minio/madmin-go/v2"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/pkg/env"
)

func registerLoginHandlers(api *operations.ConsoleAPI) {
	// GET login strategy
	api.AuthLoginDetailHandler = authApi.LoginDetailHandlerFunc(func(params authApi.LoginDetailParams) middleware.Responder {
		loginDetails, err := getLoginDetailsResponse(params, GlobalMinIOConfig.OpenIDProviders)
		if err != nil {
			return authApi.NewLoginDetailDefault(int(err.Code)).WithPayload(err)
		}
		return authApi.NewLoginDetailOK().WithPayload(loginDetails)
	})
	// POST login using user credentials
	api.AuthLoginHandler = authApi.LoginHandlerFunc(func(params authApi.LoginParams) middleware.Responder {
		loginResponse, err := getLoginResponse(params)
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
		loginResponse, err := getLoginOauth2AuthResponse(params, GlobalMinIOConfig.OpenIDProviders)
		if err != nil {
			return authApi.NewLoginOauth2AuthDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			http.SetCookie(w, &http.Cookie{
				Path:     "/",
				Name:     "idp-refresh-token",
				Value:    loginResponse.IDPRefreshToken,
				HttpOnly: true,
				Secure:   len(GlobalPublicCerts) > 0,
				SameSite: http.SameSiteLaxMode,
			})
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
		return nil, ErrInvalidLogin
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
func getLoginResponse(params authApi.LoginParams) (*models.LoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	lr := params.Body
	var err error
	var consoleCreds *ConsoleCredentials
	// if we receive an STS we use that instead of the credentials
	if lr.Sts != "" {
		creds := credentials.NewStaticV4(lr.AccessKey, lr.SecretKey, lr.Sts)
		consoleCreds = &ConsoleCredentials{
			ConsoleCredentials: creds,
			AccountAccessKey:   lr.AccessKey,
		}
	} else {
		// prepare console credentials
		consoleCreds, err = getConsoleCredentials(lr.AccessKey, lr.SecretKey)
		if err != nil {
			return nil, ErrorWithContext(ctx, err, ErrInvalidLogin)
		}
	}

	sf := &auth.SessionFeatures{}
	if lr.Features != nil {
		sf.HideMenu = lr.Features.HideMenu
	}
	sessionID, err := login(consoleCreds, sf)
	if err != nil {
		return nil, ErrorWithContext(ctx, err, ErrInvalidLogin)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

// isKubernetes returns true if minio is running in kubernetes.
func isKubernetes() bool {
	// Kubernetes env used to validate if we are
	// indeed running inside a kubernetes pod
	// is KUBERNETES_SERVICE_HOST
	// https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kubelet_pods.go#L541
	return env.Get("KUBERNETES_SERVICE_HOST", "") != ""
}

// getLoginDetailsResponse returns information regarding the Console authentication mechanism.
func getLoginDetailsResponse(params authApi.LoginDetailParams, openIDProviders oauth2.OpenIDPCfg) (*models.LoginDetails, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	loginStrategy := models.LoginDetailsLoginStrategyForm
	var redirectRules []*models.RedirectRule

	r := params.HTTPRequest
	var loginDetails *models.LoginDetails
	if len(openIDProviders) >= 1 {
		loginStrategy = models.LoginDetailsLoginStrategyRedirect
		for name, provider := range openIDProviders {
			// initialize new oauth2 client
			oauth2Client, err := openIDProviders.NewOauth2ProviderClient(name, nil, r, GetConsoleHTTPClient(""))
			if err != nil {
				return nil, ErrorWithContext(ctx, err, ErrOauth2Provider)
			}
			// Validate user against IDP
			identityProvider := &auth.IdentityProvider{
				KeyFunc: provider.GetStateKeyFunc(),
				Client:  oauth2Client,
			}

			displayName := "Login with SSO"

			if provider.DisplayName != "" {
				displayName = provider.DisplayName
			}

			redirectRule := models.RedirectRule{
				Redirect:    identityProvider.GenerateLoginURL(),
				DisplayName: displayName,
			}

			redirectRules = append(redirectRules, &redirectRule)
		}
	}
	loginDetails = &models.LoginDetails{
		LoginStrategy: loginStrategy,
		RedirectRules: redirectRules,
		IsK8S:         isKubernetes(),
	}
	return loginDetails, nil
}

// verifyUserAgainstIDP will verify user identity against the configured IDP and return MinIO credentials
func verifyUserAgainstIDP(ctx context.Context, provider auth.IdentityProviderI, code, state string) (*credentials.Credentials, error) {
	userCredentials, err := provider.VerifyIdentity(ctx, code, state)
	if err != nil {
		LogError("error validating user identity against idp: %v", err)
		return nil, err
	}
	return userCredentials, nil
}

func getLoginOauth2AuthResponse(params authApi.LoginOauth2AuthParams, openIDProviders oauth2.OpenIDPCfg) (*models.LoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	r := params.HTTPRequest
	lr := params.Body

	if openIDProviders != nil {
		// we read state
		rState := *lr.State

		decodedRState, err := base64.StdEncoding.DecodeString(rState)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}

		var requestItems oauth2.LoginURLParams

		err = json.Unmarshal(decodedRState, &requestItems)

		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}

		IDPName := requestItems.IDPName
		state := requestItems.State
		providerCfg := openIDProviders[IDPName]
		oauth2Client, err := openIDProviders.NewOauth2ProviderClient(IDPName, nil, r, GetConsoleHTTPClient(""))
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		// initialize new identity provider

		identityProvider := auth.IdentityProvider{
			KeyFunc: providerCfg.GetStateKeyFunc(),
			Client:  oauth2Client,
			RoleARN: providerCfg.RoleArn,
		}
		// Validate user against IDP
		userCredentials, err := verifyUserAgainstIDP(ctx, identityProvider, *lr.Code, state)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		// initialize admin client
		// login user against console and generate session token
		token, err := login(&ConsoleCredentials{
			ConsoleCredentials: userCredentials,
			AccountAccessKey:   "",
		}, nil)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		// serialize output
		loginResponse := &models.LoginResponse{
			SessionID:       *token,
			IDPRefreshToken: identityProvider.Client.RefreshToken,
		}
		return loginResponse, nil
	}
	return nil, ErrorWithContext(ctx, ErrDefault)
}

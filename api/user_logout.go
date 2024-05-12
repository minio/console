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
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/go-openapi/errors"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	authApi "github.com/minio/console/api/operations/auth"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth/idp/oauth2"
)

func registerLogoutHandlers(api *operations.ConsoleAPI) {
	// logout from console
	api.AuthLogoutHandler = authApi.LogoutHandlerFunc(func(params authApi.LogoutParams, session *models.Principal) middleware.Responder {
		err := getLogoutResponse(session, params)
		if err != nil {
			api.Logger("IDP logout failed: %v", err.APIError.DetailedMessage)
		}
		// Custom response writer to expire the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			if err != nil {
				w.Header().Set("IDP-Logout", fmt.Sprintf("%v", err.APIError.DetailedMessage))
			}
			expiredCookie := ExpireSessionCookie()
			// this will tell the browser to clear the cookie and invalidate user session
			// additionally we are deleting the cookie from the client side
			http.SetCookie(w, &expiredCookie)
			http.SetCookie(w, &http.Cookie{
				Path:     "/",
				Name:     "idp-refresh-token",
				Value:    "",
				MaxAge:   -1,
				Expires:  time.Now().Add(-100 * time.Hour),
				HttpOnly: true,
				Secure:   len(GlobalPublicCerts) > 0,
				SameSite: http.SameSiteLaxMode,
			})
			authApi.NewLogoutOK().WriteResponse(w, p)
		})
	})
}

// logout() call Expire() on the provided ConsoleCredentials
func logout(credentials ConsoleCredentialsI) {
	credentials.Expire()
}

// getLogoutResponse performs logout() and returns nil or errors
func getLogoutResponse(session *models.Principal, params authApi.LogoutParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	state := params.Body.State
	if state != "" {
		if err := logoutFromIDPProvider(params.HTTPRequest, state); err != nil {
			return ErrorWithContext(ctx, err)
		}
	}
	creds := getConsoleCredentialsFromSession(session)
	credentials := ConsoleCredentials{ConsoleCredentials: creds}
	logout(credentials)
	return nil
}

func logoutFromIDPProvider(r *http.Request, state string) error {
	decodedRState, err := base64.StdEncoding.DecodeString(state)
	if err != nil {
		return err
	}
	var requestItems oauth2.LoginURLParams
	err = json.Unmarshal(decodedRState, &requestItems)
	if err != nil {
		return err
	}
	providerCfg := GlobalMinIOConfig.OpenIDProviders[requestItems.IDPName]
	refreshToken, err := r.Cookie("idp-refresh-token")
	if err != nil {
		return err
	}
	if providerCfg.EndSessionEndpoint != "" {
		params := url.Values{}
		params.Add("client_id", providerCfg.ClientID)
		params.Add("client_secret", providerCfg.ClientSecret)
		params.Add("refresh_token", refreshToken.Value)
		client := &http.Client{
			Transport: GlobalTransport,
		}
		result, err := client.PostForm(providerCfg.EndSessionEndpoint, params)
		if err != nil {
			return errors.New(500, "failed to logout: %v", err.Error())
		}
		if result.StatusCode != 204 {
			return errors.New(int32(result.StatusCode), "failed to logout")
		}
	}

	return nil
}

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
	"errors"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
	"github.com/minio/mcs/restapi/sessions"
)

func registerLogoutHandlers(api *operations.McsAPI) {
	// logout from mcs
	api.UserAPILogoutHandler = user_api.LogoutHandlerFunc(func(params user_api.LogoutParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		if err := getLogoutResponse(sessionID); err != nil {
			return user_api.NewLogoutDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewLogoutOK()
	})
}

// logout() deletes provided bearer token from in memory sessions map
// then checks that the session actually got removed
func logout(sessionID string) error {
	sessionsMap := sessions.GetInstance()
	sessionsMap.DeleteSession(sessionID)
	if sessionsMap.ValidSession(sessionID) {
		return errors.New("something went wrong deleting your session, please try again")
	}
	return nil
}

// getLogoutResponse performs logout() and returns nil or error
func getLogoutResponse(sessionID string) error {
	if err := logout(sessionID); err != nil {
		return err
	}
	return nil
}

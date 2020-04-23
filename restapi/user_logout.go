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
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
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

// logout() call Expire() on the provided minioCredentials
func logout(credentials MCSCredentials) {
	credentials.Expire()
}

// getLogoutResponse performs logout() and returns nil or error
func getLogoutResponse(jwt string) error {
	creds, err := getMcsCredentialsFromJWT(jwt)
	if err != nil {
		log.Println(err)
		return err
	}
	credentials := mcsCredentials{minioCredentials: creds}
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return err
	}
	logout(credentials)
	return nil
}

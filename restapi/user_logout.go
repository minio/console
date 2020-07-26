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
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

func registerLogoutHandlers(api *operations.ConsoleAPI) {
	// logout from console
	api.UserAPILogoutHandler = user_api.LogoutHandlerFunc(func(params user_api.LogoutParams, session *models.Principal) middleware.Responder {
		getLogoutResponse(session)
		return user_api.NewLogoutOK()
	})
}

// logout() call Expire() on the provided consoleCredentials
func logout(credentials ConsoleCredentials) {
	credentials.Expire()
}

// getLogoutResponse performs logout() and returns nil or error
func getLogoutResponse(session *models.Principal) {
	creds := getConsoleCredentialsFromSession(session)
	credentials := consoleCredentials{consoleCredentials: creds}
	logout(credentials)
}

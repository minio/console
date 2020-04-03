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
	"github.com/minio/m3/mcs/models"
	"github.com/minio/m3/mcs/restapi/operations"
	"github.com/minio/m3/mcs/restapi/operations/user_api"
)

func registerSessionHandlers(api *operations.McsAPI) {
	// session check
	api.UserAPISessionCheckHandler = user_api.SessionCheckHandlerFunc(func(params user_api.SessionCheckParams, principal *models.Principal) middleware.Responder {
		sessionResp := getSessionResponse()
		return user_api.NewSessionCheckOK().WithPayload(sessionResp)
	})

}

// getSessionResponse returns only if the session is valid
func getSessionResponse() *models.SessionResponse {
	// serialize output
	sessionResp := &models.SessionResponse{
		Status: models.SessionResponseStatusOk,
	}
	return sessionResp
}

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
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/pkg/acl"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
)

var (
	errorGenericInvalidSession = errors.New("invalid session")
)

func registerSessionHandlers(api *operations.McsAPI) {
	// session check
	api.UserAPISessionCheckHandler = user_api.SessionCheckHandlerFunc(func(params user_api.SessionCheckParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		sessionResp, err := getSessionResponse(sessionID)
		if err != nil {
			return user_api.NewSessionCheckDefault(401).WithPayload(&models.Error{Code: 401, Message: swag.String(err.Error())})
		}
		return user_api.NewSessionCheckOK().WithPayload(sessionResp)
	})

}

// getSessionResponse parse the jwt of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(sessionID string) (*models.SessionResponse, error) {
	// serialize output
	claims, err := GetClaimsFromJWT(sessionID)
	if err != nil {
		log.Println("error getting claims from JWT", err)
		return nil, errorGenericInvalidSession
	}
	sessionResp := &models.SessionResponse{
		Pages:  acl.GetAuthorizedEndpoints(claims.Actions),
		Status: models.SessionResponseStatusOk,
	}
	return sessionResp, nil
}

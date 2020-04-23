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
	"github.com/minio/mcs/pkg/auth"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/user_api"
)

func registerLoginHandlers(api *operations.McsAPI) {
	// get login strategy
	api.UserAPILoginDetailHandler = user_api.LoginDetailHandlerFunc(func(params user_api.LoginDetailParams) middleware.Responder {
		loginDetails := getLoginDetailsResponse()
		return user_api.NewLoginDetailOK().WithPayload(loginDetails)
	})
	// post login
	api.UserAPILoginHandler = user_api.LoginHandlerFunc(func(params user_api.LoginParams) middleware.Responder {
		loginResponse, err := getLoginResponse(params.Body)
		if err != nil {
			return user_api.NewLoginDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewLoginCreated().WithPayload(loginResponse)
	})
}

var ErrInvalidCredentials = errors.New("invalid minioCredentials")

// login performs a check of minioCredentials against MinIO
func login(credentials MCSCredentials) (*string, error) {
	// try to obtain minioCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		return nil, ErrInvalidCredentials
	}
	// if we made it here, the minioCredentials work, generate a jwt with claims
	jwt, err := auth.NewJWTWithClaimsForClient(&tokens, getMinIOServer())
	if err != nil {
		return nil, ErrInvalidCredentials
	}
	return &jwt, nil
}

// getLoginResponse performs login() and serializes it to the handler's output
func getLoginResponse(lr *models.LoginRequest) (*models.LoginResponse, error) {
	creds, err := newMcsCredentials(*lr.AccessKey, *lr.SecretKey, "")
	if err != nil {
		log.Println("error login:", err)
		return nil, err
	}
	credentials := mcsCredentials{minioCredentials: creds}
	sessionID, err := login(credentials)
	if err != nil {
		log.Println("error login:", err)
		return nil, err
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *sessionID,
	}
	return loginResponse, nil
}

// getLoginDetailsResponse returns wether an IDP is configured or not.
func getLoginDetailsResponse() *models.LoginDetails {
	// TODO: Add support for login using external IDPs
	// serialize output
	loginDetails := &models.LoginDetails{
		LoginStrategy: models.LoginDetailsLoginStrategyForm,
	}
	return loginDetails
}

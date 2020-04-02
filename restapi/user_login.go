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

	"github.com/minio/mc/pkg/probe"

	"github.com/minio/m3/mcs/restapi/sessions"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/m3/mcs/models"
	"github.com/minio/m3/mcs/restapi/operations"
	"github.com/minio/m3/mcs/restapi/operations/user_api"
	mcCmd "github.com/minio/mc/cmd"
)

// Wraps the code at mc/cmd
type McCmd interface {
	BuildS3Config(url, accessKey, secretKey, api, lookup string) (*mcCmd.Config, *probe.Error)
}

// Implementation of McCmd
type mcCmdWrapper struct {
}

func (mc mcCmdWrapper) BuildS3Config(url, accessKey, secretKey, api, lookup string) (*mcCmd.Config, *probe.Error) {
	return mcCmd.BuildS3Config(url, accessKey, secretKey, api, lookup)
}

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

var ErrInvalidCredentials = errors.New("invalid credentials")

// login performs a check of credentials against MinIO
func login(mc McCmd, accessKey, secretKey *string) (*string, error) {
	// Probe the credentials
	cfg, pErr := mc.BuildS3Config(getMinIOServer(), *accessKey, *secretKey, "", "auto")
	if pErr != nil {
		log.Println(pErr)
		return nil, ErrInvalidCredentials
	}
	// if we made it here, the credentials work, generate a session
	sessionID := sessions.GetInstance().NewSession(cfg)

	return &sessionID, nil
}

// getLoginResponse performs login() and serializes it to the handler's output
func getLoginResponse(lr *models.LoginRequest) (*models.LoginResponse, error) {
	mc := mcCmdWrapper{}
	sessionID, err := login(&mc, lr.AccessKey, lr.SecretKey)
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

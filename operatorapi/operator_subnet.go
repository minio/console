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

package operatorapi

import (
	"context"
	"errors"

	xhttp "github.com/minio/console/pkg/http"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
	"github.com/minio/console/restapi"
)

func registerOperatorSubnetHandlers(api *operations.OperatorAPI) {
	api.OperatorAPIOperatorSubnetLoginHandler = operator_api.OperatorSubnetLoginHandlerFunc(func(params operator_api.OperatorSubnetLoginParams, session *models.Principal) middleware.Responder {
		resp, err := getOperatorSubnetLoginResponse(session, params)
		if err != nil {
			return operator_api.NewOperatorSubnetLoginDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewOperatorSubnetLoginOK().WithPayload(resp)
	})
	api.OperatorAPIOperatorSubnetLoginMFAHandler = operator_api.OperatorSubnetLoginMFAHandlerFunc(func(params operator_api.OperatorSubnetLoginMFAParams, session *models.Principal) middleware.Responder {
		resp, err := getOperatorSubnetLoginMFAResponse(session, params)
		if err != nil {
			return operator_api.NewOperatorSubnetLoginMFADefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewOperatorSubnetLoginMFAOK().WithPayload(resp)
	})
	api.OperatorAPIOperatorSubnetAPIKeyHandler = operator_api.OperatorSubnetAPIKeyHandlerFunc(func(params operator_api.OperatorSubnetAPIKeyParams, session *models.Principal) middleware.Responder {
		// TODO: Implement
		return operator_api.NewOperatorSubnetAPIKeyOK()
	})
	api.OperatorAPIOperatorSubnetRegisterAPIKeyHandler = operator_api.OperatorSubnetRegisterAPIKeyHandlerFunc(func(params operator_api.OperatorSubnetRegisterAPIKeyParams, session *models.Principal) middleware.Responder {
		// TODO: Implement
		return operator_api.NewOperatorSubnetRegisterAPIKeyOK()
	})
}

func getOperatorSubnetLoginResponse(session *models.Principal, params operator_api.OperatorSubnetLoginParams) (*models.OperatorSubnetLoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	username := params.Body.Username
	password := params.Body.Password
	if username == "" || password == "" {
		return nil, restapi.ErrorWithContext(ctx, errors.New("empty credentials"))
	}
	subnetHTTPClient := &xhttp.Client{Client: restapi.GetConsoleHTTPClient()}
	token, mfa, err := restapi.SubnetLogin(subnetHTTPClient, username, password)
	if err != nil {
		return nil, restapi.ErrorWithContext(ctx, err)
	}
	return &models.OperatorSubnetLoginResponse{
		AccessToken: token,
		MfaToken:    mfa,
	}, nil
}

func getOperatorSubnetLoginMFAResponse(session *models.Principal, params operator_api.OperatorSubnetLoginMFAParams) (*models.OperatorSubnetLoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	subnetHTTPClient := &xhttp.Client{Client: restapi.GetConsoleHTTPClient()}
	res, err := restapi.SubnetLoginWithMFA(subnetHTTPClient, *params.Body.Username, *params.Body.MfaToken, *params.Body.Otp)
	if err != nil {
		return nil, restapi.ErrorWithContext(ctx, err)
	}
	return &models.OperatorSubnetLoginResponse{
		AccessToken: res.AccessToken,
	}, nil
}

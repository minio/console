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

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/madmin-go"
)

func validateDistributedMode(session *models.Principal) bool {
	ctx := context.Background()
	mAdmin, err := NewMinioAdminClient(session)

	// We couldn't create the client, return false
	if err != nil {
		return false
	}
	// create a minioClient interface implementation
	client := AdminClient{Client: mAdmin}

	info, err := client.AccountInfo(ctx)

	// We couldn't retrieve admin information, default to true for legacy reasons
	// TODO: Revert to false after August 15th 2021
	if err != nil {
		return true
	}

	backendInfo := info.Server

	return backendInfo.Type == madmin.Erasure
}

func registerSessionHandlers(api *operations.ConsoleAPI) {
	// session check
	api.UserAPISessionCheckHandler = user_api.SessionCheckHandlerFunc(func(params user_api.SessionCheckParams, session *models.Principal) middleware.Responder {
		sessionResp, err := getSessionResponse(session)
		if err != nil {
			return user_api.NewSessionCheckDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewSessionCheckOK().WithPayload(sessionResp)
	})
}

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(session *models.Principal) (*models.SessionResponse, *models.Error) {
	// serialize output
	if session == nil {
		return nil, prepareError(errorGenericInvalidSession)
	}

	sessionResp := &models.SessionResponse{
		Pages:           acl.GetAuthorizedEndpoints(session.Actions),
		Features:        getListOfEnabledFeatures(),
		Status:          models.SessionResponseStatusOk,
		Operator:        false,
		DistributedMode: validateDistributedMode(session),
	}
	return sessionResp, nil
}

// getListOfEnabledFeatures returns a list of features
func getListOfEnabledFeatures() []string {
	var features []string
	logSearchURL := getLogSearchURL()

	if logSearchURL != "" {
		features = append(features, "log-search")
	}

	return features
}

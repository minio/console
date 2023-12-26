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

	systemApi "github.com/minio/console/api/operations/system"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/models"
)

func registerAdminArnsHandlers(api *operations.ConsoleAPI) {
	// return a list of arns
	api.SystemArnListHandler = systemApi.ArnListHandlerFunc(func(params systemApi.ArnListParams, session *models.Principal) middleware.Responder {
		arnsResp, err := getArnsResponse(session, params)
		if err != nil {
			return systemApi.NewArnListDefault(err.Code).WithPayload(err.APIError)
		}
		return systemApi.NewArnListOK().WithPayload(arnsResp)
	})
}

// getArns invokes admin info and returns a list of arns
func getArns(ctx context.Context, client MinioAdmin) (*models.ArnsResponse, error) {
	serverInfo, err := client.serverInfo(ctx)
	if err != nil {
		return nil, err
	}
	// build response
	return &models.ArnsResponse{
		Arns: serverInfo.SQSARN,
	}, nil
}

// getArnsResponse returns a list of active arns in the instance
func getArnsResponse(session *models.Principal, params systemApi.ArnListParams) (*models.ArnsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	// serialize output
	arnsList, err := getArns(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return arnsList, nil
}

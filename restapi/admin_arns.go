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
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerAdminArnsHandlers(api *operations.ConsoleAPI) {
	// return a list of arns
	api.AdminAPIArnListHandler = admin_api.ArnListHandlerFunc(func(params admin_api.ArnListParams, session *models.Principal) middleware.Responder {
		arnsResp, err := getArnsResponse(session)
		if err != nil {
			return admin_api.NewArnListDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewArnListOK().WithPayload(arnsResp)
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
func getArnsResponse(session *models.Principal) (*models.ArnsResponse, *models.Error) {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	arnsList, err := getArns(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	return arnsList, nil
}

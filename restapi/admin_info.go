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
	"context"
	"log"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/admin_api"
)

func registerAdminInfoHandlers(api *operations.McsAPI) {
	// return usage stats
	api.AdminAPIAdminInfoHandler = admin_api.AdminInfoHandlerFunc(func(params admin_api.AdminInfoParams, principal *models.Principal) middleware.Responder {
		infoResp, err := getAdminInfoResponse()
		if err != nil {
			return admin_api.NewAdminInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewAdminInfoOK().WithPayload(infoResp)
	})

}

type UsageInfo struct {
	Buckets int64
	Objects int64
	Usage   int64
}

// getAdminInfo invokes admin info and returns a parsed `UsageInfo` structure
func getAdminInfo(ctx context.Context, client MinioAdmin) (*UsageInfo, error) {
	serverInfo, err := client.serverInfo(ctx)
	if err != nil {
		return nil, err
	}
	// we are trimming uint64 to int64 this will report an incorrect measurement for numbers greater than
	// 9,223,372,036,854,775,807
	return &UsageInfo{
		Buckets: int64(serverInfo.Buckets.Count),
		Objects: int64(serverInfo.Objects.Count),
		Usage:   int64(serverInfo.Usage.Size),
	}, nil
}

// getAdminInfoResponse returns the response containing total buckets, objects and usage.
func getAdminInfoResponse() (*models.AdminInfoResponse, error) {
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	usage, err := getAdminInfo(ctx, adminClient)
	if err != nil {
		log.Println("error getting information:", err)
		return nil, err
	}
	sessionResp := &models.AdminInfoResponse{
		Buckets: usage.Buckets,
		Objects: usage.Objects,
		Usage:   usage.Usage,
	}
	return sessionResp, nil
}

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
	"io"
	"net/http"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	"github.com/minio/madmin-go"
)

func registerProfilingHandler(api *operations.ConsoleAPI) {
	// Start Profiling
	api.AdminAPIProfilingStartHandler = admin_api.ProfilingStartHandlerFunc(func(params admin_api.ProfilingStartParams, session *models.Principal) middleware.Responder {
		profilingStartResponse, err := getProfilingStartResponse(session, params.Body)
		if err != nil {
			return admin_api.NewProfilingStartDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewProfilingStartCreated().WithPayload(profilingStartResponse)
	})
	// Stop and download profiling data
	api.AdminAPIProfilingStopHandler = admin_api.ProfilingStopHandlerFunc(func(params admin_api.ProfilingStopParams, session *models.Principal) middleware.Responder {
		profilingStopResponse, err := getProfilingStopResponse(session)
		if err != nil {
			return admin_api.NewProfilingStopDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the content-disposition header to tell the
		// HTTP client the name and extension of the file we are returning
		return middleware.ResponderFunc(func(w http.ResponseWriter, _ runtime.Producer) {
			defer profilingStopResponse.Close()

			w.Header().Set("Content-Type", "application/octet-stream")
			w.Header().Set("Content-Disposition", "attachment; filename=profile.zip")
			io.Copy(w, profilingStopResponse)
		})
	})
}

// startProfiling() starts the profiling on the Minio server
// Enable 1 of the 7 profiling mechanisms: "cpu","mem","block","mutex","trace","threads","goroutines"
// in the Minio server, returns []*models.StartProfilingItem that contains individual status of this operation
// for each Minio node, ie:
//
//	{
//		"Success": true,
//		"nodeName": "127.0.0.1:9000"
//		"error": ""
//	}
func startProfiling(ctx context.Context, client MinioAdmin, profilerType models.ProfilerType) ([]*models.StartProfilingItem, error) {
	profilingResults, err := client.startProfiling(ctx, madmin.ProfilerType(profilerType))
	if err != nil {
		return nil, err
	}
	var items []*models.StartProfilingItem
	for _, result := range profilingResults {
		items = append(items, &models.StartProfilingItem{
			Success:  result.Success,
			Error:    result.Error,
			NodeName: result.NodeName,
		})
	}
	return items, nil
}

// getProfilingStartResponse performs startProfiling() and serializes it to the handler's output
func getProfilingStartResponse(session *models.Principal, params *models.ProfilingStartRequest) (*models.StartProfilingList, *models.Error) {
	ctx := context.Background()
	if params == nil {
		return nil, prepareError(errPolicyBodyNotInRequest)
	}
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	profilingItems, err := startProfiling(ctx, adminClient, *params.Type)
	if err != nil {
		return nil, prepareError(err)
	}
	profilingList := &models.StartProfilingList{
		StartResults: profilingItems,
		Total:        int64(len(profilingItems)),
	}
	return profilingList, nil
}

// stopProfiling() stop the profiling on the Minio server and returns
// the generated Zip file as io.ReadCloser
func stopProfiling(ctx context.Context, client MinioAdmin) (io.ReadCloser, error) {
	profilingData, err := client.stopProfiling(ctx)
	if err != nil {
		return nil, err
	}
	return profilingData, nil
}

// getProfilingStopResponse() performs setPolicy() and serializes it to the handler's output
func getProfilingStopResponse(session *models.Principal) (io.ReadCloser, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	profilingData, err := stopProfiling(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	return profilingData, nil
}

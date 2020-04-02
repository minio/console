// This file is part of MinIO Kubernetes Cloud
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
	"io"
	"log"
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/m3/mcs/models"
	"github.com/minio/m3/mcs/restapi/operations"
	"github.com/minio/m3/mcs/restapi/operations/admin_api"
	"github.com/minio/minio/pkg/madmin"
)

func registerProfilingHandler(api *operations.McsAPI) {
	// Start Profiling
	api.AdminAPIProfilingStartHandler = admin_api.ProfilingStartHandlerFunc(func(params admin_api.ProfilingStartParams, principal interface{}) middleware.Responder {
		profilingStartResponse, err := getProfilingStartResponse(params.Body)
		if err != nil {
			return admin_api.NewProfilingStartDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewProfilingStartCreated().WithPayload(profilingStartResponse)
	})
	// Stop and download profiling data
	api.AdminAPIProfilingStopHandler = admin_api.ProfilingStopHandlerFunc(func(params admin_api.ProfilingStopParams, principal interface{}) middleware.Responder {
		profilingStopResponse, err := getProfilingStopResponse()
		if err != nil {
			return admin_api.NewProfilingStopDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		// Custom response writer to set the content-disposition header to tell the
		// HTTP client the name and extension of the file we are returning
		return middleware.ResponderFunc(func(w http.ResponseWriter, _ runtime.Producer) {
			w.Header().Set("Content-Type", "application/octet-stream")
			w.Header().Set("Content-Disposition", "attachment; filename=profile.zip")
			if _, err := io.Copy(w, profilingStopResponse); err != nil {
				log.Println(err)
			} else {
				if err := profilingStopResponse.Close(); err != nil {
					log.Println(err)
				}
			}
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
func getProfilingStartResponse(params *models.ProfilingStartRequest) (*models.StartProfilingList, error) {
	ctx := context.Background()
	if params == nil {
		log.Println("error profiling type not in body request")
		return nil, errors.New(500, "error AddPolicy body not in request")
	}
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	profilingItems, err := startProfiling(ctx, adminClient, params.Type)
	if err != nil {
		log.Println("error starting profiling:", err)
		return nil, err
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
func getProfilingStopResponse() (io.ReadCloser, error) {
	ctx := context.Background()
	mAdmin, err := newMAdminClient()
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	profilingData, err := stopProfiling(ctx, adminClient)
	if err != nil {
		log.Println("error stopping profiling:", err)
		return nil, err
	}
	return profilingData, nil
}

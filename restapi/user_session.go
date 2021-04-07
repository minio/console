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

	"github.com/minio/minio/pkg/madmin"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/minio/pkg/env"
)

func registerSessionHandlers(api *operations.ConsoleAPI) {
	// session check
	api.UserAPISessionCheckHandler = user_api.SessionCheckHandlerFunc(func(params user_api.SessionCheckParams, session *models.Principal) middleware.Responder {
		sessionResp, err := getSessionResponse(session)
		if err != nil {
			return user_api.NewSessionCheckDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewSessionCheckOK().WithPayload(sessionResp)
	})

	api.UserAPIGetServerInfoHandler = user_api.GetServerInfoHandlerFunc(func(params user_api.GetServerInfoParams, principal *models.Principal) middleware.Responder {
		sessionResp, err := getStorageInfo(principal)
		if err != nil {
			return user_api.NewGetServerInfoDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewGetServerInfoOK().WithPayload(sessionResp)
	})
}

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(session *models.Principal) (*models.SessionResponse, *models.Error) {
	// serialize output
	if session == nil {
		return nil, prepareError(errorGenericInvalidSession)
	}
	sessionResp := &models.SessionResponse{
		Pages:    acl.GetAuthorizedEndpoints(session.Actions),
		Features: getListOfEnabledFeatures(),
		Status:   models.SessionResponseStatusOk,
		Operator: acl.GetOperatorMode(),
	}
	return sessionResp, nil
}

// getListOfEnabledFeatures returns a list of features
func getListOfEnabledFeatures() []string {
	var features []string
	ilm := env.IsSet("_CONSOLE_ILM_SUPPORT")
	if ilm {
		features = append(features, "ilm")
	}
	return features
}

func infoBackendToModelBackend(bd madmin.BackendDisks) map[string]int32 {
	out := make(map[string]int32)
	for k, v := range bd {
		out[k] = int32(v)
	}
	return out
}

func infoDisksToModelDisks(disks []madmin.Disk) []*models.Disk {
	out := []*models.Disk{}
	for _, disk := range disks {
		out = append(out, &models.Disk{
			Availspace:      int64(disk.AvailableSpace),
			Endpoint:        disk.Endpoint,
			Healing:         disk.Healing,
			Model:           disk.Model,
			Path:            disk.DrivePath,
			Readlatency:     float32(disk.AvailableSpace),
			Readthroughput:  float32(disk.AvailableSpace),
			RootDisk:        disk.RootDisk,
			State:           disk.State,
			Totalspace:      int64(disk.TotalSpace),
			Usedspace:       int64(disk.UsedSpace),
			Utilization:     float32(disk.AvailableSpace),
			UUID:            disk.UUID,
			Writelatency:    float32(disk.WriteLatency),
			Writethroughput: float32(disk.WriteThroughPut),
		})
	}
	return out
}

func getStorageInfo(session *models.Principal) (*models.ServerInfoResponse, *models.Error) {
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	info, err := adminClient.storageInfo(context.Background())

	if err != nil {
		return nil, prepareError(err)
	}

	resp := models.ServerInfoResponse{
		Disks: infoDisksToModelDisks(info.Disks),
		Backend: &models.Backend{
			OfflineDisks:     infoBackendToModelBackend(info.Backend.OfflineDisks),
			OnlineDisks:      infoBackendToModelBackend(info.Backend.OnlineDisks),
			RRSCParity:       int32(info.Backend.RRSCParity),
			StandardSCParity: int32(info.Backend.StandardSCParity),
			Type:             int64(info.Backend.Type),
		},
	}

	return &resp, nil

}

// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
//

package restapi

import (
	"context"

	"github.com/minio/madmin-go/v2"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	upgradeSvc "github.com/minio/console/restapi/operations/upgrade"
)

func registerUpgradeHandlers(api *operations.ConsoleAPI) {
	// Put Upgrade Instance Handlers
	api.UpgradeUpgradeInstanceHandler = upgradeSvc.UpgradeInstanceHandlerFunc(func(params upgradeSvc.UpgradeInstanceParams, session *models.Principal) middleware.Responder {
		resp, err := GetUpgradeInstanceResponse(session, params)
		if err != nil {
			return upgradeSvc.NewUpgradeInstanceDefault(int(err.Code)).WithPayload(err)
		}
		return upgradeSvc.NewUpgradeInstanceOK().WithPayload(resp)
	})
}

func GetUpgradeInstanceResponse(session *models.Principal, params upgradeSvc.UpgradeInstanceParams) (*models.UpgradeResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	adminClient := AdminClient{Client: mAdmin}

	response, err := upgradeInstance(ctx, adminClient, params.Body.CustomURL)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return &models.UpgradeResponse{CurrentVersion: response.CurrentVersion, UpdatedVersion: response.UpdatedVersion}, nil
}

func upgradeInstance(ctx context.Context, client MinioAdmin, customURL string) (us madmin.ServerUpdateStatus, err error) {
	updateURL := ""

	if customURL != "" {
		updateURL = customURL
	}

	return client.serverUpdate(ctx, updateURL)
}

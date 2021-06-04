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

func registerServiceHandlers(api *operations.ConsoleAPI) {
	// Restart Service
	api.AdminAPIRestartServiceHandler = admin_api.RestartServiceHandlerFunc(func(params admin_api.RestartServiceParams, session *models.Principal) middleware.Responder {
		if err := getRestartServiceResponse(session); err != nil {
			return admin_api.NewRestartServiceDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewRestartServiceNoContent()
	})
}

// serviceRestart - restarts the MinIO cluster
func serviceRestart(ctx context.Context, client MinioAdmin) error {
	if err := client.serviceRestart(ctx); err != nil {
		return err
	}
	// copy behavior from minio/mc mainAdminServiceRestart()
	//
	// Max. time taken by the server to shutdown is 5 seconds.
	// This can happen when there are lot of s3 requests pending when the server
	// receives a restart command.
	// Sleep for 6 seconds and then check if the server is online.
	time.Sleep(6 * time.Second)

	// Fetch the service status of the specified MinIO server
	_, err := client.serverInfo(ctx)
	if err != nil {
		return err
	}
	return nil
}

// getRestartServiceResponse performs serviceRestart()
func getRestartServiceResponse(session *models.Principal) *models.Error {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := serviceRestart(ctx, adminClient); err != nil {
		return prepareError(err)
	}
	return nil
}

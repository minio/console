// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
	"net/http"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/utils"
	"github.com/minio/console/restapi/operations"
	systemApi "github.com/minio/console/restapi/operations/system"
)

func registerVersionHandlers(api *operations.ConsoleAPI) {
	api.SystemCheckMinIOVersionHandler = systemApi.CheckMinIOVersionHandlerFunc(func(params systemApi.CheckMinIOVersionParams) middleware.Responder {
		versionResponse, err := getVersionResponse()
		if err != nil {
			return systemApi.NewCheckMinIOVersionDefault(int(err.Code)).WithPayload(err)
		}
		return systemApi.NewCheckMinIOVersionOK().WithPayload(versionResponse)
	})
}

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getVersionResponse() (*models.CheckVersionResponse, *models.Error) {
	ver, err := utils.GetLatestMinIOImage(&utils.HTTPClient{
		Client: &http.Client{
			Timeout: 15 * time.Second,
		}})
	if err != nil {
		return nil, prepareError(err)
	}
	return &models.CheckVersionResponse{
		LatestVersion: *ver,
	}, nil
}

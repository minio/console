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
	"context"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	systemApi "github.com/minio/console/restapi/operations/system"
)

func registerNodesHandler(api *operations.ConsoleAPI) {

	api.SystemListNodesHandler = systemApi.ListNodesHandlerFunc(func(params systemApi.ListNodesParams, session *models.Principal) middleware.Responder {
		listNodesResponse, err := getListNodesResponse(session)
		if err != nil {
			return systemApi.NewListNodesDefault(int(err.Code)).WithPayload(err)
		}
		return systemApi.NewListNodesOK().WithPayload(listNodesResponse)
	})
}

// getListNodesResponse returns a list of available node endpoints .
func getListNodesResponse(session *models.Principal) ([]string, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	var nodeList []string

	adminResources, _ := mAdmin.ServerInfo(ctx)

	for _, n := range adminResources.Servers {
		nodeList = append(nodeList, n.Endpoint)
	}

	return nodeList, nil
}

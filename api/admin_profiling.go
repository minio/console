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
	"io"
	"net/http"

	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/minio/websocket"
)

var items []*models.StartProfilingItem

type profileOptions struct {
	Types string
}

func getProfileOptionsFromReq(req *http.Request) (*profileOptions, error) {
	pOptions := profileOptions{}
	pOptions.Types = req.FormValue("types")
	return &pOptions, nil
}

func startProfiling(ctx context.Context, conn WSConn, client MinioAdmin, pOpts *profileOptions) error {
	profilingResults, err := client.startProfiling(ctx, madmin.ProfilerType(pOpts.Types))
	if err != nil {
		return err
	}
	items = []*models.StartProfilingItem{}
	for _, result := range profilingResults {
		items = append(items, &models.StartProfilingItem{
			Success:  result.Success,
			Error:    result.Error,
			NodeName: result.NodeName,
		})
	}
	zippedData, err := client.stopProfiling(ctx)
	if err != nil {
		return err
	}
	message, err := io.ReadAll(zippedData)
	if err != nil {
		return err
	}
	return conn.writeMessage(websocket.BinaryMessage, message)
}

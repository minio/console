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
	"time"

	"github.com/minio/madmin-go/v3"
	"github.com/minio/websocket"
)

type profileOptions struct {
	Types    string
	Duration time.Duration
}

func getProfileOptionsFromReq(req *http.Request) (*profileOptions, error) {
	pOptions := profileOptions{}
	pOptions.Types = req.FormValue("types")
	pOptions.Duration = 10 * time.Second // TODO: make this configurable
	return &pOptions, nil
}

func startProfiling(ctx context.Context, conn WSConn, client MinioAdmin, pOpts *profileOptions) error {
	data, err := client.startProfiling(ctx, madmin.ProfilerType(pOpts.Types), pOpts.Duration)
	if err != nil {
		return err
	}
	message, err := io.ReadAll(data)
	if err != nil {
		return err
	}
	return conn.writeMessage(websocket.BinaryMessage, message)
}

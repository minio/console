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
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/dustin/go-humanize"
	"github.com/minio/madmin-go/v3"
	"github.com/minio/websocket"
)

// getSpeedtesthOptionsFromReq gets duration, size & concurrent requests from a websocket
// path come as : `/speedtest?duration=2h&size=12MiB&concurrent=10`
func getSpeedtestOptionsFromReq(req *http.Request) (*madmin.SpeedtestOpts, error) {
	optionsSet := madmin.SpeedtestOpts{}

	queryPairs := req.URL.Query()

	paramDuration := queryPairs.Get("duration")

	if paramDuration == "" {
		paramDuration = "10s"
	}

	duration, err := time.ParseDuration(paramDuration)
	if err != nil {
		return nil, fmt.Errorf("unable to parse duration: %s", paramDuration)
	}

	if duration <= 0 {
		return nil, fmt.Errorf("duration cannot be 0 or negative")
	}

	optionsSet.Duration = duration

	paramSize := queryPairs.Get("size")

	if paramSize == "" {
		paramSize = "64MiB"
	}

	size, err := humanize.ParseBytes(paramSize)
	if err != nil {
		return nil, fmt.Errorf("unable to parse object size")
	}

	optionsSet.Size = int(size)

	paramConcurrent := queryPairs.Get("concurrent")

	if paramConcurrent == "" {
		paramConcurrent = "32"
	}

	concurrent, err := strconv.Atoi(paramConcurrent)
	if err != nil {
		return nil, fmt.Errorf("invalid concurrent value: %s", paramConcurrent)
	}

	if concurrent <= 0 {
		return nil, fmt.Errorf("concurrency cannot be '0' or negative")
	}

	optionsSet.Concurrency = concurrent

	autotune := queryPairs.Get("autotune")

	if autotune == "true" {
		optionsSet.Autotune = true
	}

	return &optionsSet, nil
}

func startSpeedtest(ctx context.Context, conn WSConn, client MinioAdmin, speedtestOpts *madmin.SpeedtestOpts) error {
	speedtestRes, err := client.speedtest(ctx, *speedtestOpts)
	if err != nil {
		LogError("error initializing speedtest: %v", err)
		return err
	}

	for result := range speedtestRes {
		// Serializing message
		bytes, err := json.Marshal(result)
		if err != nil {
			LogError("error serializing json: %v", err)
			return err
		}
		// Send Message through websocket connection
		err = conn.writeMessage(websocket.TextMessage, bytes)
		if err != nil {
			LogError("error writing speedtest response: %v", err)
			return err
		}
	}

	return nil
}

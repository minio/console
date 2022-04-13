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
	"bytes"
	"context"
	b64 "encoding/base64"
	"encoding/json"
	"net/http"
	"time"

	"errors"

	"github.com/klauspost/compress/gzip"

	"github.com/gorilla/websocket"
	"github.com/minio/madmin-go"
)

// startHealthInfo starts fetching mc.ServerHealthInfo and
// sends messages with the corresponding data on the websocket connection
func startHealthInfo(ctx context.Context, conn WSConn, client MinioAdmin, deadline *time.Duration) error {
	if deadline == nil {
		return errors.New("duration can't be nil on startHealthInfo")
	}

	// Fetch info of all servers (cluster or single server)
	healthDataTypes := []madmin.HealthDataType{
		madmin.HealthDataTypePerfDrive,
		madmin.HealthDataTypePerfNet,
		madmin.HealthDataTypeMinioInfo,
		madmin.HealthDataTypeMinioConfig,
		madmin.HealthDataTypeSysCPU,
		madmin.HealthDataTypeSysDriveHw,
		madmin.HealthDataTypeSysDocker,
		madmin.HealthDataTypeSysOsInfo,
		madmin.HealthDataTypeSysLoad,
		madmin.HealthDataTypeSysMem,
		madmin.HealthDataTypeSysNet,
		madmin.HealthDataTypeSysProcess,
	}

	var err error
	// Fetch info of all servers (cluster or single server)
	healthInfo, version, err := client.serverHealthInfo(ctx, healthDataTypes, *deadline)
	if err != nil {
		return err
	}

	compressedDiag, err := tarGZ(healthInfo, version)
	if err != nil {
		return err
	}
	encodedDiag := b64.StdEncoding.EncodeToString(compressedDiag)

	type messageReport struct {
		Encoded          string      `json:"encoded"`
		ServerHealthInfo interface{} `json:"serverHealthInfo"`
	}

	report := messageReport{
		Encoded:          encodedDiag,
		ServerHealthInfo: healthInfo,
	}
	message, err := json.Marshal(report)
	if err != nil {
		return err
	}

	// Send Message through websocket connection
	return conn.writeMessage(websocket.TextMessage, message)
}

// compress and tar MinIO diagnostics output
func tarGZ(healthInfo interface{}, version string) ([]byte, error) {
	buffer := bytes.NewBuffer(nil)
	gzWriter := gzip.NewWriter(buffer)

	enc := json.NewEncoder(gzWriter)

	header := struct {
		Version string `json:"version"`
	}{Version: version}

	if err := enc.Encode(header); err != nil {
		return nil, err
	}

	if err := enc.Encode(healthInfo); err != nil {
		return nil, err
	}
	err := gzWriter.Close()
	if err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}

// getHealthInfoOptionsFromReq gets duration for startHealthInfo request
// path come as : `/health-info?deadline=2h`
func getHealthInfoOptionsFromReq(req *http.Request) (*time.Duration, error) {
	deadlineDuration, err := time.ParseDuration(req.FormValue("deadline"))
	if err != nil {
		return nil, err
	}
	return &deadlineDuration, nil
}

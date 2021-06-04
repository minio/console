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
	"encoding/json"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/minio/madmin-go"
)

const logTimeFormat string = "15:04:05 MST 01/02/2006"

// startConsoleLog starts log of the servers
func startConsoleLog(ctx context.Context, conn WSConn, client MinioAdmin) error {
	// TODO: accept parameters as variables
	// name of node, default = "" (all)
	node := ""
	// number of log lines
	lineCount := 100
	// type of logs "minio"|"application"|"all" default = "all"
	logKind := "all"
	// Start listening on all Console Log activity.
	logCh := client.getLogs(ctx, node, lineCount, logKind)

	for {
		select {
		case <-ctx.Done():
			return nil
		case logInfo, ok := <-logCh:
			// zero value returned because the channel is closed and empty
			if !ok {
				return nil
			}
			if logInfo.Err != nil {
				LogError("error on console logs: %v", logInfo.Err)
				return logInfo.Err
			}

			// Serialize message to be sent
			bytes, err := json.Marshal(serializeConsoleLogInfo(&logInfo))
			if err != nil {
				LogError("error on json.Marshal: %v", err)
				return err
			}

			// Send Message through websocket connection
			err = conn.writeMessage(websocket.TextMessage, bytes)
			if err != nil {
				LogError("error writeMessage: %v", err)
				return err
			}
		}
	}
}

func serializeConsoleLogInfo(l *madmin.LogInfo) (logInfo madmin.LogInfo) {
	logInfo = *l
	if logInfo.ConsoleMsg != "" {
		if strings.HasPrefix(logInfo.ConsoleMsg, "\n") {
			logInfo.ConsoleMsg = strings.TrimPrefix(logInfo.ConsoleMsg, "\n")
		}
	}
	if logInfo.Time != "" {
		logInfo.Time = getLogTime(logInfo.Time)
	}
	return logInfo
}

func getLogTime(lt string) string {
	tm, err := time.Parse(time.RFC3339Nano, lt)
	if err != nil {
		return lt
	}
	return tm.Format(logTimeFormat)
}

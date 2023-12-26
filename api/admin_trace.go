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
	"net/http"
	"strings"
	"time"

	"github.com/minio/madmin-go/v3"
	"github.com/minio/websocket"
)

// shortTraceMsg Short trace record
type shortTraceMsg struct {
	Host       string    `json:"host"`
	Time       string    `json:"time"`
	Client     string    `json:"client"`
	CallStats  callStats `json:"callStats"`
	FuncName   string    `json:"api"`
	Path       string    `json:"path"`
	Query      string    `json:"query"`
	StatusCode int       `json:"statusCode"`
	StatusMsg  string    `json:"statusMsg"`
}

type callStats struct {
	Rx       int    `json:"rx"`
	Tx       int    `json:"tx"`
	Duration string `json:"duration"`
	Ttfb     string `json:"timeToFirstByte"`
}

// trace filters
func matchTrace(opts TraceRequest, traceInfo madmin.ServiceTraceInfo) bool {
	statusCode := int(opts.statusCode)
	method := opts.method
	funcName := opts.funcName
	apiPath := opts.path

	if statusCode == 0 && method == "" && funcName == "" && apiPath == "" {
		// no specific filtering found trace all the requests
		return true
	}

	// Filter request path if passed by the user
	if apiPath != "" {
		pathToLookup := strings.ToLower(apiPath)
		pathFromTrace := strings.ToLower(traceInfo.Trace.Path)

		return strings.Contains(pathFromTrace, pathToLookup)
	}

	// Filter response status codes if passed by the user
	if statusCode > 0 && traceInfo.Trace.HTTP != nil {
		statusCodeFromTrace := traceInfo.Trace.HTTP.RespInfo.StatusCode

		return statusCodeFromTrace == statusCode
	}

	// Filter request method if passed by the user
	if method != "" && traceInfo.Trace.HTTP != nil {
		methodFromTrace := traceInfo.Trace.HTTP.ReqInfo.Method

		return methodFromTrace == method
	}

	if funcName != "" {
		funcToLookup := strings.ToLower(funcName)
		funcFromTrace := strings.ToLower(traceInfo.Trace.FuncName)

		return strings.Contains(funcFromTrace, funcToLookup)
	}

	return true
}

// startTraceInfo starts trace of the servers
func startTraceInfo(ctx context.Context, conn WSConn, client MinioAdmin, opts TraceRequest) error {
	// Start listening on all trace activity.
	traceCh := client.serviceTrace(ctx, opts.threshold, opts.s3, opts.internal, opts.storage, opts.os, opts.onlyErrors)
	for {
		select {
		case <-ctx.Done():
			return nil
		case traceInfo, ok := <-traceCh:
			// zero value returned because the channel is closed and empty
			if !ok {
				return nil
			}
			if traceInfo.Err != nil {
				LogError("error on serviceTrace: %v", traceInfo.Err)
				return traceInfo.Err
			}
			if matchTrace(opts, traceInfo) {
				// Serialize message to be sent
				traceInfoBytes, err := json.Marshal(shortTrace(&traceInfo))
				if err != nil {
					LogError("error on json.Marshal: %v", err)
					return err
				}
				// Send Message through websocket connection
				err = conn.writeMessage(websocket.TextMessage, traceInfoBytes)
				if err != nil {
					LogError("error writeMessage: %v", err)
					return err
				}
			}
		}
	}
}

// shortTrace creates a shorter Trace Info message.
// Same implementation as github/minio/mc/cmd/admin-trace.go
func shortTrace(info *madmin.ServiceTraceInfo) shortTraceMsg {
	t := info.Trace
	s := shortTraceMsg{}

	s.Time = t.Time.Format(time.RFC3339)
	s.Path = t.Path
	s.FuncName = t.FuncName
	s.CallStats.Duration = t.Duration.String()
	if info.Trace.HTTP != nil {
		s.Query = t.HTTP.ReqInfo.RawQuery
		s.StatusCode = t.HTTP.RespInfo.StatusCode
		s.StatusMsg = http.StatusText(t.HTTP.RespInfo.StatusCode)
		s.CallStats.Rx = t.HTTP.CallStats.InputBytes
		s.CallStats.Tx = t.HTTP.CallStats.OutputBytes
		s.CallStats.Ttfb = t.HTTP.CallStats.TimeToFirstByte.String()
		if host, ok := t.HTTP.ReqInfo.Headers["Host"]; ok {
			s.Host = strings.Join(host, "")
		}
		cSlice := strings.Split(t.HTTP.ReqInfo.Client, ":")
		s.Client = cSlice[0]
	}

	return s
}

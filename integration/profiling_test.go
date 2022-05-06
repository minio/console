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

package integration

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestStartProfiling(t *testing.T) {
	testAsser := assert.New(t)

	tests := []struct {
		name string
	}{
		{
			name: "start/stop profiling",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			files := map[string]bool{
				"profile-127.0.0.1:9000-goroutines.txt":                false,
				"profile-127.0.0.1:9000-goroutines-before.txt":         false,
				"profile-127.0.0.1:9000-goroutines-before,debug=2.txt": false,
				"profile-127.0.0.1:9000-threads-before.pprof":          false,
				"profile-127.0.0.1:9000-mem.pprof":                     false,
				"profile-127.0.0.1:9000-threads.pprof":                 false,
				"profile-127.0.0.1:9000-cpu.pprof":                     false,
				"profile-127.0.0.1:9000-mem-before.pprof":              false,
				"profile-127.0.0.1:9000-block.pprof":                   false,
				"profile-127.0.0.1:9000-trace.trace":                   false,
				"profile-127.0.0.1:9000-mutex.pprof":                   false,
				"profile-127.0.0.1:9000-mutex-before.pprof":            false,
			}

			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			destination := "/api/v1/profiling/start"
			finalURL := fmt.Sprintf("http://localhost:9090%s", destination)
			request, err := http.NewRequest("POST", finalURL, strings.NewReader("{\"type\":\"cpu,mem,block,mutex,trace,threads,goroutines\"}"))
			if err != nil {
				log.Println(err)
				return
			}

			request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
			request.Header.Add("Content-Type", "application/json")

			response, err := client.Do(request)

			testAsser.Nil(err, fmt.Sprintf("%s returned an error: %v", tt.name, err))
			testAsser.Equal(201, response.StatusCode)

			time.Sleep(5 * time.Second)

			destination = "/api/v1/profiling/stop"
			finalURL = fmt.Sprintf("http://localhost:9090%s", destination)
			request, err = http.NewRequest("POST", finalURL, nil)
			if err != nil {
				log.Println(err)
				return
			}

			request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
			request.Header.Add("Content-Type", "application/json")

			response, err = client.Do(request)

			testAsser.Nil(err, fmt.Sprintf("%s returned an error: %v", tt.name, err))
			testAsser.Equal(200, response.StatusCode)
			zipFileBytes, err := io.ReadAll(response.Body)
			if err != nil {
				testAsser.Nil(err, fmt.Sprintf("%s returned an error: %v", tt.name, err))
			}
			filetype := http.DetectContentType(zipFileBytes)
			testAsser.Equal("application/zip", filetype)

			zipReader, err := zip.NewReader(bytes.NewReader(zipFileBytes), int64(len(zipFileBytes)))
			if err != nil {
				testAsser.Nil(err, fmt.Sprintf("%s returned an error: %v", tt.name, err))
			}

			// Read all the files from zip archive
			for _, zipFile := range zipReader.File {
				files[zipFile.Name] = true
			}

			for k, v := range files {
				testAsser.Equal(true, v, fmt.Sprintf("%s : compressed file expected to have %v file inside", tt.name, k))
			}
		})
	}
}

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
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_ConfigAPI(t *testing.T) {
	assert := assert.New(t)

	type args struct {
		api string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Config - Valid",
			args: args{
				api: "/configs",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), requestDataBody)
			if err != nil {
				log.Println(err)
				return
			}
			request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
			request.Header.Add("Content-Type", "application/json")
			response, err := client.Do(request)
			if err != nil {
				log.Println(err)
				return
			}
			if response != nil {
				assert.Equal(tt.expectedStatus, response.StatusCode, tt.name+" Failed")
			}
		})
	}
}

func Test_SetConfigAPI(t *testing.T) {
	assert := assert.New(t)

	type args struct {
		name      string
		keyValues []map[string]interface{}
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Set Config - Valid",
			args: args{
				name:      "region",
				keyValues: []map[string]interface{}{{"key": "name", "value": "testServer"}, {"key": "region", "value": "us-west-1"}},
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Set Config - Invalid",
			args: args{
				name:      "regiontest",
				keyValues: []map[string]interface{}{{"key": "name", "value": "testServer"}, {"key": "region", "value": "us-west-1"}},
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}

			requestDataPolicy["key_values"] = tt.args.keyValues

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"PUT", fmt.Sprintf("http://localhost:9090/api/v1/configs/%s", tt.args.name), requestDataBody)
			if err != nil {
				log.Println(err)
				return
			}
			request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
			request.Header.Add("Content-Type", "application/json")
			response, err := client.Do(request)
			if err != nil {
				log.Println(err)
				return
			}
			if response != nil {
				assert.Equal(tt.expectedStatus, response.StatusCode, tt.name+" Failed")
			}
		})
	}
}

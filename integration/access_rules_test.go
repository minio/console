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

func Test_AddAccessRuleAPI(t *testing.T) {
	assert := assert.New(t)

	AddBucket("testaccessruleadd", false, false, nil, nil)

	type args struct {
		prefix string
		access string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Create Access Rule - Valid",
			args: args{
				prefix: "/test/",
				access: "readonly",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Create Group - Invalid",
			args: args{
				prefix: "/test/",
				access: "readonl",
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
			requestDataPolicy["prefix"] = tt.args.prefix
			requestDataPolicy["access"] = tt.args.access

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"PUT", "http://localhost:9090/api/v1/bucket/testaccessruleadd/access-rules", requestDataBody)
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
				assert.Equal(tt.expectedStatus, response.StatusCode, "Status Code is incorrect")
			}
		})
	}
}

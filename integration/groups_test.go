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

func Test_AddGroupAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("member1", "testtest", []string{}, []string{"consoleAdmin"})

	type args struct {
		api     string
		group   string
		members []string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Create Group - Valid",
			args: args{
				api:     "/groups",
				group:   "test",
				members: []string{"member1"},
			},
			expectedStatus: 201,
			expectedError:  nil,
		},
		{
			name: "Create Group - Invalid",
			args: args{
				api:     "/groups",
				group:   "test",
				members: []string{},
			},
			expectedStatus: 400,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			// Add policy

			requestDataPolicy := map[string]interface{}{}
			requestDataPolicy["group"] = tt.args.group
			requestDataPolicy["members"] = tt.args.members

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"POST", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), requestDataBody)
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

func Test_DeleteGroupAPI(t *testing.T) {
	assert := assert.New(t)

	AddGroup("grouptests1", []string{})

	type args struct {
		api string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
		verb           string
	}{
		{
			name: "Delete Group - Valid",
			verb: "DELETE",
			args: args{
				api: "/group?name=grouptests1",
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Access Group After Delete - Invalid",
			verb: "GET",
			args: args{
				api: "/group?name=grouptests1",
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

			// Add policy

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				tt.verb, fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), requestDataBody)
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

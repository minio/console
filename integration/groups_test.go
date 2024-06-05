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
	"net/url"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_AddGroupAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("member1", "testtest", []string{}, []string{"consoleAdmin"})

	type args struct {
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
				group:   "test",
				members: []string{"member1"},
			},
			expectedStatus: 201,
			expectedError:  nil,
		},
		{
			name: "Create Group - Invalid",
			args: args{
				group:   "test",
				members: []string{},
			},
			expectedStatus: 400,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}
			requestDataPolicy["group"] = tt.args.group
			requestDataPolicy["members"] = tt.args.members

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"POST", "http://localhost:9090/api/v1/groups", requestDataBody)
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

func Test_GetGroupAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("member2", "testtest", []string{}, []string{"consoleAdmin"})
	AddGroup("getgroup1", []string{"member2"})

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
			name: "Get Group - Valid",
			args: args{
				api: "getgroup1",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Get Group - Invalid",
			args: args{
				api: "askfjalkd",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1/group/%s", url.PathEscape(tt.args.api)), requestDataBody)
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

func Test_ListGroupsAPI(t *testing.T) {
	assert := assert.New(t)

	tests := []struct {
		name           string
		expectedStatus int
		expectedError  error
	}{
		{
			name:           "Get Group - Valid",
			expectedStatus: 200,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"GET", "http://localhost:9090/api/v1/groups", requestDataBody)
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

func Test_PutGroupsAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("member3", "testtest", []string{}, []string{"consoleAdmin"})
	AddGroup("putgroup1", []string{})

	type args struct {
		api     string
		members []string
		status  string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Put Group - Valid",
			args: args{
				api:     "putgroup1",
				members: []string{"member3"},
				status:  "enabled",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Put Group - Invalid",
			args: args{
				api:     "gdgfdfgd",
				members: []string{"member3"},
				status:  "enabled",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}

			requestDataPolicy["members"] = tt.args.members
			requestDataPolicy["status"] = tt.args.status

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"PUT", fmt.Sprintf("http://localhost:9090/api/v1/group/%s", url.PathEscape(tt.args.api)), requestDataBody)
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
			args: args{
				api: "grouptests1",
			},
			verb:           "DELETE",
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Delete Group - Invalid",
			args: args{
				api: "grouptests12345",
			},
			verb:           "DELETE",
			expectedStatus: 404,
			expectedError:  nil,
		},
		{
			name: "Access Group After Delete - Invalid",
			args: args{
				api: "grouptests1",
			},
			verb:           "GET",
			expectedStatus: 500,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				tt.verb, fmt.Sprintf("http://localhost:9090/api/v1/group/%s", url.PathEscape(tt.args.api)), requestDataBody)
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

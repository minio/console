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

	"github.com/go-openapi/swag"

	"github.com/stretchr/testify/assert"
)

func Test_PolicyAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("testuser1", "testtest", []string{},[]string{"readwrite"})

	type args struct {
		api         string
		method      string
		name        string
		policy      *string
		entityType  string
		entityName  string
		policyName  []string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Create Policy - Valid",
			args: args{
				api:  "/policies",
				method: "POST",
				name: "test",
				policy: swag.String(`
  {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketLocation",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    }
  ]
}`),
			},
			expectedStatus: 201,
			expectedError:  nil,
		},

		{
			name: "Create Policy - Invalid",
			args: args{
				api:  "/policies",
				method: "POST",
				name: "test2",
				policy: swag.String(`
  {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketLocation"
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    }
  ]
}`),
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
		{
			name: "Set Policy - Valid",
			args: args{
				api:    "/set-policy",
				method: "PUT",
				policyName: []string{"consoleAdmin"},
				entityType: "user",
				entityName: "testuser1",
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Set Policy - Invalid",
			args: args{
				api:    "/set-policy",
				method: "PUT",
				policyName: []string{"test3"},
				entityType: "user",
				entityName: "testuser1",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
		{
			name: "List Policies",
			args: args{
				api:    "/policies",
				method: "GET",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Delete Policies - Valid",
			args: args{
				api:    "/policy?name=test",
				method: "DELETE",
			},
			expectedStatus: 204,
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
			requestDataPolicy["name"] = tt.args.name
			if tt.args.policy != nil {
				requestDataPolicy["policy"] = *tt.args.policy
			}
			requestDataPolicy["entityName"] = tt.args.entityName
			requestDataPolicy["entityType"] = tt.args.entityType
			if tt.args.policyName != nil {
				requestDataPolicy["name"] = tt.args.policyName
			}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				tt.args.method, fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), requestDataBody)
			fmt.Println(requestDataPolicy)
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

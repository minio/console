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
	"io"
	"log"
	"net/http"
	"net/url"
	"testing"
	"time"

	"github.com/go-openapi/swag"

	"github.com/stretchr/testify/assert"
)

func AddPolicy(name, definition string) (*http.Response, error) {
	/*
		This is an atomic function to add user and can be reused across
		different functions.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}

	requestDataAdd := map[string]interface{}{
		"name":   name,
		"policy": definition,
	}

	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/policies", requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	return response, err
}

func SetPolicy(policies []string, entityName, entityType string) (*http.Response, error) {
	/*
		This is an atomic function to add user and can be reused across
		different functions.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}

	requestDataAdd := map[string]interface{}{
		"name":       policies,
		"entityType": entityType,
		"entityName": entityName,
	}

	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT", "http://localhost:9090/api/v1/set-policy", requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	return response, err
}

func Test_AddPolicyAPI(t *testing.T) {
	assert := assert.New(t)

	type args struct {
		api    string
		name   string
		policy *string
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
			name: "Create Policy - Space in Name",
			args: args{
				api:  "/policies",
				name: "space test",
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
			expectedStatus: 201, // Changed the expected status from 400 to 201, as spaces are now allowed in policy names.
			expectedError:  nil,
		},
		{
			name: "Create Policy - Reserved character in name",
			args: args{
				api:  "/policies",
				name: "space/test?",
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
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			requestDataPolicy := map[string]interface{}{}
			requestDataPolicy["name"] = tt.args.name
			if tt.args.policy != nil {
				requestDataPolicy["policy"] = *tt.args.policy
			}

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
				assert.Equal(tt.expectedStatus, response.StatusCode, tt.name+" Failed")
			}
		})
	}
}

func Test_SetPolicyAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("policyuser1", "testtest", []string{}, []string{"readwrite"})
	AddGroup("testgroup123", []string{})
	AddPolicy("setpolicytest", `
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
  }`)

	type args struct {
		api        string
		entityType string
		entityName string
		policyName []string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Set Policy - Valid",
			args: args{
				api:        "/set-policy",
				policyName: []string{"setpolicytest"},
				entityType: "user",
				entityName: "policyuser1",
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Set Policy - Invalid",
			args: args{
				api:        "/set-policy",
				policyName: []string{"test3"},
				entityType: "user",
				entityName: "policyuser1",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
		{
			name: "Set Policy Group - Valid",
			args: args{
				api:        "/set-policy",
				policyName: []string{"setpolicytest"},
				entityType: "group",
				entityName: "testgroup123",
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Set Policy Group - Invalid",
			args: args{
				api:        "/set-policy",
				policyName: []string{"test3"},
				entityType: "group",
				entityName: "testgroup123",
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
			requestDataPolicy["entityName"] = tt.args.entityName
			requestDataPolicy["entityType"] = tt.args.entityType
			if tt.args.policyName != nil {
				requestDataPolicy["name"] = tt.args.policyName
			}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"PUT", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), requestDataBody)
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

func Test_SetPolicyMultipleAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("policyuser2", "testtest", []string{}, []string{"readwrite"})
	AddUser("policyuser3", "testtest", []string{}, []string{"readwrite"})
	AddGroup("testgroup1234", []string{})
	AddPolicy("setpolicytest2", `
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
  }`)

	type args struct {
		api    string
		users  []string
		groups []string
		name   []string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Set Policy - Valid",
			args: args{
				api:   "/set-policy-multi",
				name:  []string{"setpolicytest2"},
				users: []string{"policyuser2", "policyuser3"},
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Set Policy - Invalid",
			args: args{
				api:   "/set-policy-multi",
				name:  []string{"test3"},
				users: []string{"policyuser2", "policyuser3"},
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
		{
			name: "Set Policy Group - Valid",
			args: args{
				api:    "/set-policy-multi",
				name:   []string{"setpolicytest2"},
				groups: []string{"testgroup1234"},
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Set Policy Group - Valid",
			args: args{
				api:    "/set-policy-multi",
				name:   []string{"setpolicytest23"},
				groups: []string{"testgroup1234"},
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
			requestDataPolicy["name"] = tt.args.name
			requestDataPolicy["users"] = tt.args.users
			requestDataPolicy["groups"] = tt.args.groups

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"PUT", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), requestDataBody)
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

func Test_ListPoliciesAPI(t *testing.T) {
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
			name: "List Policies",
			args: args{
				api: "/policies",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), nil)
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

func Test_GetPolicyAPI(t *testing.T) {
	assert := assert.New(t)

	AddPolicy("test/policy?", `
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
  }`)

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
			name: "Get Policies - Invalid",
			args: args{
				api: "test3",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
		{
			name: "Get Policies - Valid",
			args: args{
				api: "test/policy?",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1/policy/%s", url.PathEscape(tt.args.api)), nil)
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

func Test_PolicyListUsersAPI(t *testing.T) {
	assert := assert.New(t)

	AddUser("policyuser4", "testtest", []string{}, []string{"readwrite"})
	AddPolicy("policylistusers", `
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
  }`)
	SetPolicy([]string{"policylistusers"}, "policyuser4", "user")

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
			name: "List Users for Policy - Valid",
			args: args{
				api: "/policies/" + url.PathEscape("policylistusers") + "/users",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "List Users for Policy - Invalid",
			args: args{
				api: "/policies/" + url.PathEscape("test2") + "/users",
			},
			expectedStatus: 404,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), nil)
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
				bodyBytes, _ := io.ReadAll(response.Body)
				assert.Equal(tt.expectedStatus, response.StatusCode, tt.name+" Failed")
				if response.StatusCode == 200 {
					assert.Equal("[\"policyuser4\"]\n", string(bodyBytes))
				}
			}
		})
	}
}

func Test_PolicyListGroupsAPI(t *testing.T) {
	assert := assert.New(t)

	AddGroup("testgroup12345", []string{})
	AddPolicy("policylistgroups", `
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
  }`)
	SetPolicy([]string{"policylistgroups"}, "testgroup12345", "group")

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
			name: "List Users for Policy - Valid",
			args: args{
				api: "/policies/" + url.PathEscape("policylistgroups") + "/groups",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "List Users for Policy - Invalid",
			args: args{
				api: "/policies/" + url.PathEscape("test3") + "/groups",
			},
			expectedStatus: 404,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), nil)
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
				bodyBytes, _ := io.ReadAll(response.Body)
				assert.Equal(tt.expectedStatus, response.StatusCode, tt.name+" Failed")
				if response.StatusCode == 200 {
					assert.Equal("[\"testgroup12345\"]\n", string(bodyBytes))
				}
			}
		})
	}
}

func Test_DeletePolicyAPI(t *testing.T) {
	assert := assert.New(t)

	AddPolicy("testdelete", `
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
  }`)
	type args struct {
		api    string
		method string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Delete Policies - Valid",
			args: args{
				api:    "testdelete",
				method: "DELETE",
			},
			expectedStatus: 204,
			expectedError:  nil,
		},
		{
			name: "Get Policy After Delete - Invalid",
			args: args{
				api:    "testdelete",
				method: "GET",
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

			request, err := http.NewRequest(
				tt.args.method, fmt.Sprintf("http://localhost:9090/api/v1/policy/%s", url.PathEscape(tt.args.api)), nil)
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

func Test_GetAUserPolicyAPI(t *testing.T) {
	assert := assert.New(t)
	// Create a User with a Policy to use for testing
	groups := []string{}
	policies := []string{"readwrite"}
	_, err := AddUser("getuserpolicyuser", "secretKey", groups, policies)
	if err != nil {
		log.Println(err)
		return
	}

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
			name: "Get User Policy - Invalid",
			args: args{
				api: "/user/" + url.PathEscape("failname") + "/policies",
			},
			expectedStatus: 401,
			expectedError:  nil,
		},
		{
			name: "Get User Policy - Valid",
			args: args{
				api: "/user/" + url.PathEscape("getuserpolicyuser") + "/policies",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}
			request, err := http.NewRequest(
				"GET", fmt.Sprintf("http://localhost:9090/api/v1%s", tt.args.api), nil)
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

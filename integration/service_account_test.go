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

	"github.com/go-openapi/swag"

	"github.com/stretchr/testify/assert"
)

func TestAddServiceAccount(t *testing.T) {
	/*
		This is an atomic API Test to add a user service account, the intention
		is simple, add a user and make sure the response is 201 meaning that the
		user got added successfully.
		After test completion, it is expected that user is removed, so other
		tests like users.ts can run over clean data and we don't collide against
		it.
	*/

	assert := assert.New(t)

	client := &http.Client{
		Timeout: 3 * time.Second,
	}

	// Add service account
	requestDataAddServiceAccount := map[string]interface{}{
		"accessKey": "testuser1",
		"secretKey": "password",
		"policy": `{
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
}`,
	}

	requestDataJSON, _ := json.Marshal(requestDataAddServiceAccount)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/service-account-credentials", requestDataBody)
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
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// {{baseUrl}}/user?name=proident velit
	// Investiga como se borra en el browser.
	request, err = http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/service-accounts/"+url.PathEscape("testuser1"), nil)
	if err != nil {
		log.Println(err)
		return
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err = client.Do(request)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("DELETE StatusCode:", response.StatusCode)
		assert.Equal(204, response.StatusCode, "has to be 204 when delete user")
	}
}

func Test_ServiceAccountsAPI(t *testing.T) {
	assert := assert.New(t)

	type args struct {
		api    string
		policy *string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Create Service Account - Default",
			args: args{
				api:    "/service-accounts",
				policy: nil,
			},
			expectedStatus: 201,
			expectedError:  nil,
		},
		{
			name: "Create Service Account - Valid Policy",
			args: args{
				api: "/service-accounts",
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
			name: "Create Service Account - Invalid Policy",
			args: args{
				api: "/service-accounts",
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
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			// Add service account

			requestDataPolicy := map[string]interface{}{}
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
				assert.Equal(tt.expectedStatus, response.StatusCode, "Status Code is incorrect")
			}
		})
	}
}

func DeleteMultipleServiceAccounts(serviceAccounts []string) (*http.Response, error) {
	/*
		Helper function to delete multiple service accounts
		URL: http://localhost:9001/api/v1/service-accounts/delete-multi
		HTTP Verb: DELETE
		Data: ["U3RADB7J2ZZHELR0WSBB","ZE8H1HYOA6AVGKFCV6YU"]
		Response: Status Code: 204 No Content
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	requestDataJSON, _ := json.Marshal(serviceAccounts)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/service-accounts/delete-multi", requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func TestCreateServiceAccountForUserWithCredentials(t *testing.T) {
	/*
		To test creation of service account for a user.
	*/

	// Test's variables
	userName := "testcreateserviceaccountforuserwithcredentials1"
	assert := assert.New(t)
	policy := ""

	// 1. Create the user
	groups := []string{}
	policies := []string{}
	secretKey := "testcreateserviceaccountforuserwithcrede"
	response, err := AddUser(userName, "secretKey", groups, policies)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// Table driven testing part
	type args struct {
		accessKey string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
	}{
		{
			name:           "Service Account With Valid Credentials",
			expectedStatus: 201,
			args: args{
				accessKey: "testcreateserviceacc",
			},
		},
		{
			name:           "Service Account With Invalid Credentials",
			expectedStatus: 500,
			args: args{
				accessKey: "tooooooooooooooooooooolongggggggggggggggggg",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			// 2. Create the service account for the user
			createServiceAccountWithCredentialsResponse,
				createServiceAccountWithCredentialsError := CreateServiceAccountForUserWithCredentials(
				userName,
				policy,
				tt.args.accessKey,
				secretKey,
			)
			if createServiceAccountWithCredentialsError != nil {
				log.Println(createServiceAccountWithCredentialsError)
				assert.Fail("Error in createServiceAccountWithCredentialsError")
			}
			if createServiceAccountWithCredentialsResponse != nil {
				fmt.Println("StatusCode:", createServiceAccountWithCredentialsResponse.StatusCode)
				assert.Equal(
					tt.expectedStatus, // different status expected per table's row
					createServiceAccountWithCredentialsResponse.StatusCode,
					inspectHTTPResponse(createServiceAccountWithCredentialsResponse),
				)
			}

			// 3. Verify the service account for the user
			listOfAccountsResponse,
				listOfAccountsError := ReturnsAListOfServiceAccountsForAUser(userName)
			if listOfAccountsError != nil {
				log.Println(listOfAccountsError)
				assert.Fail("Error in listOfAccountsError")
			}
			finalResponse := inspectHTTPResponse(listOfAccountsResponse)
			if listOfAccountsResponse != nil {
				fmt.Println("StatusCode:", listOfAccountsResponse.StatusCode)
				assert.Equal(
					200, listOfAccountsResponse.StatusCode,
					finalResponse,
				)
			}
		})
	}

	// Delete Multiple Service Accounts
	serviceAccount := make([]string, 1)
	serviceAccount[0] = "testcreateserviceacc"
	response, err = DeleteMultipleServiceAccounts(serviceAccount)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("StatusCode:", response.StatusCode)
		assert.Equal(
			204,
			response.StatusCode,
			inspectHTTPResponse(response),
		)
	}
}

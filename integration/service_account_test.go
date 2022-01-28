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

	iampolicy "github.com/minio/pkg/iam/policy"
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
	fmt.Println(".......................TestServiceAccountPolicy(): Create Data to add user")
	requestDataAddServiceAccount := map[string]interface{}{
		"accessKey": "testuser1",
		"secretKey": "password",
		"policy": "{" +
			"\n    \"Version\": \"2012-10-17\"," +
			"\n    \"Statement\": [" +
			"\n        {" +
			"\n            \"Effect\": \"Allow\"," +
			"\n            \"Action\": [" +
			"\n                \"s3:GetBucketLocation\"," +
			"\n                \"s3:GetObject\"" +
			"\n            ]," +
			"\n            \"Resource\": [" +
			"\n                \"arn:aws:s3:::*\"" +
			"\n            ]" +
			"\n        }" +
			"\n    ]" +
			"\n}",
	}

	fmt.Println("..............................TestServiceAccountPolicy(): Prepare the POST")
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

	fmt.Println(".................................TestServiceAccountPolicy(): Make the POST")
	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("..................................TestServiceAccountPolicy(): Verification")
	fmt.Println(".................................TestServiceAccountPolicy(): POST response")
	fmt.Println(response)
	fmt.Println("....................................TestServiceAccountPolicy(): POST error")
	fmt.Println(err)
	if response != nil {
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	fmt.Println("...................................TestServiceAccountPolicy(): Remove user")

	// Test policy
	fmt.Println(".......................TestAddUserServiceAccount(): Create Data to add user")
	request, err = http.NewRequest(
		"GET", "http://localhost:9090/api/v1/service-accounts/testuser1/policy", nil)
	if err != nil {
		log.Println(err)
		return
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println(".................................TestAddServiceAccount(): Make the POST")
	response, err = client.Do(request)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("..................................TestAddServiceAccount(): Verification")
	fmt.Println(".................................TestAddServiceAccount(): POST response")
	fmt.Println(response)
	fmt.Println("....................................TestAddServiceAccount(): POST error")
	fmt.Println(err)
	if response != nil {
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
		buf := new(bytes.Buffer)
		buf.ReadFrom(response.Body)
		var actual *iampolicy.Policy
		var expected *iampolicy.Policy
		json.Unmarshal(buf.Bytes(), actual)
		policy, err := json.Marshal(requestDataAddServiceAccount["policy"])
		if err != nil {
			log.Println(err)
			return
		}
		json.Unmarshal(policy, expected)
		assert.Equal(expected, actual)
	}

	fmt.Println("...................................TestServiceAccountPolicy(): Remove service account")

	// {{baseUrl}}/user?name=proident velit
	// Investiga como se borra en el browser.
	request, err = http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/service-accounts/testuser1", nil)
	if err != nil {
		log.Println(err)
		return
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println("...............................TestServiceAccountPolicy(): Make the DELETE")
	response, err = client.Do(request)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("..................................TestServiceAccountPolicy(): Verification")
	fmt.Println("...............................TestServiceAccountPolicy(): DELETE response")
	fmt.Println(response)
	fmt.Println("..................................TestServiceAccountPolicy(): DELETE error")
	fmt.Println(err)
	if response != nil {
		fmt.Println("DELETE StatusCode:", response.StatusCode)
		assert.Equal(204, response.StatusCode, "has to be 204 when delete user")
	}

}

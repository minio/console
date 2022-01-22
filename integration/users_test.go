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

func TestAddUser(t *testing.T) {
	/*
		This is an atomic API Test to add a user via api/v1/users, the intention
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

	var x [0]string
	fmt.Println(x)

	fmt.Println(".......................TestAddUser(): Create Data to add user")
	requestDataAdd := map[string]interface{}{
		"accessKey": "accessKey",
		"secretKey": "secretKey",
		"groups":    x,
		"policies":  x,
	}

	fmt.Println("..............................TestAddUser(): Prepare the POST")
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/users", requestDataBody)
	if err != nil {
		log.Println(err)
		return
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println(".................................TestAddUser(): Make the POST")
	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("..................................TestAddUser(): Verification")
	fmt.Println(".................................TestAddUser(): POST response")
	fmt.Println(response)
	fmt.Println("....................................TestAddUser(): POST error")
	fmt.Println(err)
	if response != nil {
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	fmt.Println("...................................TestAddUser(): Remove user")
	// {{baseUrl}}/user?name=proident velit
	// Investiga como se borra en el browser.
	request, err = http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/user?name=accessKey", nil)
	if err != nil {
		log.Println(err)
		return
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println("...............................TestAddUser(): Make the DELETE")
	response, err = client.Do(request)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("..................................TestAddUser(): Verification")
	fmt.Println("...............................TestAddUser(): DELETE response")
	fmt.Println(response)
	fmt.Println("..................................TestAddUser(): DELETE error")
	fmt.Println(err)
	if response != nil {
		fmt.Println("DELETE StatusCode:", response.StatusCode)
		assert.Equal(204, response.StatusCode, "has to be 204 when delete user")
	}

}

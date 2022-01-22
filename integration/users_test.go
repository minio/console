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
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func AddUser(accessKey string, secretKey string, groups []string, policies []string) (*http.Response, error) {
	/*
		This is an atomic function to add user and can be reused across
		different functions.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}

	fmt.Println(".......................TestAddUser(): Create Data to add user")
	requestDataAdd := map[string]interface{}{
		"accessKey": accessKey,
		"secretKey": secretKey,
		"groups":    groups,
		"policies":  policies,
	}

	fmt.Println("..............................TestAddUser(): Prepare the POST")
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/users", requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println(".................................TestAddUser(): Make the POST")
	response, err := client.Do(request)
	return response, err
}

func DeleteUser(bucketName string) (*http.Response, error) {
	/*
		This is an atomic function to delete user and can be reused across
		different functions.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	fmt.Println("...................................TestAddUser(): Remove user")
	request, err := http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/user?name="+bucketName, nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println("...............................TestAddUser(): Make the DELETE")
	response, err := client.Do(request)
	return response, err
}

func ListUsers(offset string, limit string) (*http.Response, error) {
	/*
		This is an atomic function to list users.
		{{baseUrl}}/users?offset=-5480083&limit=-5480083
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	fmt.Println("...................................TestAddUser(): Remove user")
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/users?offset="+offset+"&limit="+limit,
		nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	fmt.Println("...............................TestAddUser(): Make the DELETE")
	response, err := client.Do(request)
	return response, err
}

func TestAddUser(t *testing.T) {
	/*
		This is an API Test to add a user via api/v1/users, the intention
		is simple, add a user and make sure the response is 201 meaning that the
		user got added successfully.
		After test completion, it is expected that user is removed, so other
		tests like users.ts can run over clean data and we don't collide against
		it.
	*/

	assert := assert.New(t)

	// With no groups & no policies
	var groups = []string{}
	var policies = []string{}

	fmt.Println(".................................TestAddUser(): Make the POST")
	response, err := AddUser("accessKey", "secretKey", groups, policies)
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

	response, err = DeleteUser("accessKey")
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

func TestListUsers(t *testing.T) {
	/*
		This test is intended to list users via API.
		1. First, it creates the users
		2. Then, it lists the users <------ 200 is expected when listing them.
		3. Finally, it deletes the users
	*/

	assert := assert.New(t)

	// With no groups & no policies
	var groups = []string{}
	var policies = []string{}

	// 1. Create the users
	numberOfUsers := 5
	for i := 1; i < numberOfUsers; i++ {
		fmt.Println("............................TestListUsers(): Adding users")
		fmt.Println(strconv.Itoa(i) + "accessKey" + strconv.Itoa(i))
		response, err := AddUser(
			strconv.Itoa(i)+"accessKey"+strconv.Itoa(i),
			"secretKey"+strconv.Itoa(i), groups, policies)
		if err != nil {
			log.Println(err)
			return
		}
		fmt.Println("............................TestListUsers(): Verification")
		fmt.Println("...........................TestListUsers(): POST response")
		fmt.Println(response)
		fmt.Println("..............................TestListUsers(): POST error")
		fmt.Println(err)
		if response != nil {
			fmt.Println("POST StatusCode:", response.StatusCode)
			assert.Equal(201, response.StatusCode,
				"Status Code is incorrect on index: "+strconv.Itoa(i))
		}

		b, err := io.ReadAll(response.Body)
		if err != nil {
			log.Fatalln(err)
		}
		fmt.Println(string(b))
	}

	// 2. List the users
	listResponse, listError := ListUsers("-5480083", "-5480083")
	if listError != nil {
		log.Fatalln(listError)
	}
	if listResponse != nil {
		fmt.Println("POST StatusCode:", listResponse.StatusCode)
		assert.Equal(200, listResponse.StatusCode,
			"TestListUsers(): Status Code is incorrect when listing users")
	}
	b, err := io.ReadAll(listResponse.Body)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(string(b))

	// 3. Delete the users
	for i := 1; i < numberOfUsers; i++ {
		response, err := DeleteUser(
			strconv.Itoa(i) + "accessKey" + strconv.Itoa(i))
		if err != nil {
			log.Println(err)
			return
		}
		fmt.Println("............................TestListUsers(): Verification")
		fmt.Println(".........................TestListUsers(): DELETE response")
		fmt.Println(response)
		fmt.Println("............................TestListUsers(): DELETE error")
		fmt.Println(err)
		if response != nil {
			fmt.Println("DELETE StatusCode:", response.StatusCode)
			assert.Equal(204,
				response.StatusCode, "has to be 204 when delete user")
		}
	}
}

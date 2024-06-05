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
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func AddUser(accessKey, secretKey string, groups, policies []string) (*http.Response, error) {
	/*
		This is an atomic function to add user and can be reused across
		different functions.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}

	requestDataAdd := map[string]interface{}{
		"accessKey": accessKey,
		"secretKey": secretKey,
		"groups":    groups,
		"policies":  policies,
	}

	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/users", requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	return response, err
}

func DeleteUser(userName string) (*http.Response, error) {
	/*
		This is an atomic function to delete user and can be reused across
		different functions.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	request, err := http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/user/"+url.PathEscape(userName), nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func ListUsers(offset, limit string) (*http.Response, error) {
	/*
		This is an atomic function to list users.
		{{baseUrl}}/users?offset=-5480083&limit=-5480083
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/users?offset="+offset+"&limit="+limit,
		nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func GetUserInformation(userName string) (*http.Response, error) {
	/*
		Helper function to get user information via API:
		{{baseUrl}}/user?name=proident velit
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/user/"+url.PathEscape(userName),
		nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func UpdateUserInformation(name, status string, groups []string) (*http.Response, error) {
	/*
		Helper function to update user information:
		PUT: {{baseUrl}}/user?name=proident velit
		Body:
		{
			"status": "nisi voluptate amet ea",
			"groups": [
				"ipsum eu cupidatat",
				"aliquip non nulla"
			]
		}
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	requestDataAdd := map[string]interface{}{
		"status": status,
		"groups": groups,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT", "http://localhost:9090/api/v1/user/"+url.PathEscape(name), requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func RemoveUser(name string) (*http.Response, error) {
	/*
		Helper function to remove user.
		DELETE: {{baseUrl}}/user?name=proident velit
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	request, err := http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/user/"+url.PathEscape(name), nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func UpdateGroupsForAUser(userName string, groups []string) (*http.Response, error) {
	/*
		Helper function to update groups for a user
		PUT: {{baseUrl}}/user/groups?name=username
		{
			"groups":[
				"groupone",
				"grouptwo"
			]
		}
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	requestDataAdd := map[string]interface{}{
		"groups": groups,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/user/"+url.PathEscape(userName)+"/groups",
		requestDataBody,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func CreateServiceAccountForUser(userName, policy string) (*http.Response, error) {
	/*
		Helper function to Create Service Account for user
		POST: api/v1/user/username/service-accounts
		{
			"policy": "ad magna"
		}
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	requestDataAdd := map[string]interface{}{
		"policy": policy,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/user/"+url.PathEscape(userName)+"/service-accounts",
		requestDataBody,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func CreateServiceAccountForUserWithCredentials(userName, policy, accessKey, secretKey string) (*http.Response, error) {
	// Helper function to test "Create Service Account for User With Credentials" end point.
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	requestDataAdd := map[string]interface{}{
		"policy":    policy,
		"accessKey": accessKey,
		"secretKey": secretKey,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/user/"+url.PathEscape(userName)+"/service-account-credentials",
		requestDataBody,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func ReturnsAListOfServiceAccountsForAUser(userName string) (*http.Response, error) {
	/*
		Helper function to return a list of service accounts for a user.
		GET: {{baseUrl}}/user/:name/service-accounts
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/user/"+url.PathEscape(userName)+"/service-accounts",
		nil,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func AddGroup(group string, members []string) (*http.Response, error) {
	/*
		Helper function to add a group.
	*/
	client := &http.Client{
		Timeout: 3 * time.Second,
	}
	requestDataAdd := map[string]interface{}{
		"group":   group,
		"members": members,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/groups",
		requestDataBody,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	return response, err
}

func UsersGroupsBulk(users, groups []string) (*http.Response, error) {
	/*
		Helper function to test Bulk functionality to Add Users to Groups.
		PUT: {{baseUrl}}/users-groups-bulk
		{
			"users": [
				"magna id",
				"enim sit tempor incididunt"
			],
			"groups": [
				"nisi est esse",
				"fugiat eu"
			]
		}
	*/
	requestDataAdd := map[string]interface{}{
		"users":  users,
		"groups": groups,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/users-groups-bulk",
		requestDataBody,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
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
	groups := []string{}
	policies := []string{}
	response, err := AddUser("accessKey", "secretKey", groups, policies)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	response, err = DeleteUser("accessKey")
	if err != nil {
		log.Println(err)
		return
	}
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
	groups := []string{}
	policies := []string{}

	// 1. Create the users
	numberOfUsers := 5
	for i := 1; i < numberOfUsers; i++ {
		response, err := AddUser(
			strconv.Itoa(i)+"accessKey"+strconv.Itoa(i),
			"secretKey"+strconv.Itoa(i), groups, policies)
		if err != nil {
			log.Println(err)
			return
		}
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
		if response != nil {
			fmt.Println("DELETE StatusCode:", response.StatusCode)
			assert.Equal(204,
				response.StatusCode, "has to be 204 when delete user")
		}
	}
}

func TestGetUserInfo(t *testing.T) {
	/*
		Test to get the user information via API.
	*/

	// 1. Create the user
	fmt.Println("TestGetUserInfo(): 1. Create the user")
	assert := assert.New(t)
	groups := []string{}
	policies := []string{}
	response, err := AddUser("accessKey", "secretKey", groups, policies)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Get user information
	fmt.Println("TestGetUserInfo(): 2. Get user information")
	response, err = GetUserInformation("accessKey")
	if err != nil {
		log.Println(err)
		assert.Fail("There was an error in the response")
		return
	}

	// 3. Verify user information
	fmt.Println("TestGetUserInfo(): 3. Verify user information")
	if response != nil {
		fmt.Println("POST StatusCode:", response.StatusCode)
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}
	b, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(string(b))
	expected := "{\"accessKey\":\"accessKey\",\"memberOf\":null,\"policy\":[],\"status\":\"enabled\"}\n"
	obtained := string(b)
	assert.Equal(expected, obtained, "User Information is wrong")
}

func TestUpdateUserInfoSuccessfulResponse(t *testing.T) {
	/*
		Update User Information Test with Successful Response
	*/

	assert := assert.New(t)

	// 1. Create an active user
	groups := []string{}
	policies := []string{}
	addUserResponse, addUserError := AddUser(
		"updateuser", "secretKey", groups, policies)
	if addUserError != nil {
		log.Println(addUserError)
		return
	}
	if addUserResponse != nil {
		fmt.Println("StatusCode:", addUserResponse.StatusCode)
		assert.Equal(
			201, addUserResponse.StatusCode, "Status Code is incorrect")
	}

	// 2. Deactivate the user
	// '{"status":"disabled","groups":[]}'
	updateUserResponse, UpdateUserError := UpdateUserInformation(
		"updateuser", "disabled", groups)

	// 3. Verify user got deactivated
	if UpdateUserError != nil {
		log.Println(UpdateUserError)
		return
	}
	if updateUserResponse != nil {
		fmt.Println("StatusCode:", updateUserResponse.StatusCode)
		assert.Equal(
			200, updateUserResponse.StatusCode, "Status Code is incorrect")
	}
	b, err := io.ReadAll(updateUserResponse.Body)
	if err != nil {
		log.Fatalln(err)
	}
	assert.True(strings.Contains(string(b), "disabled"))
}

func TestUpdateUserInfoGenericErrorResponse(t *testing.T) {
	/*
		Update User Information Test with Generic Error Response
	*/

	assert := assert.New(t)

	// 1. Create an active user
	groups := []string{}
	policies := []string{}
	addUserResponse, addUserError := AddUser(
		"updateusererror", "secretKey", groups, policies)
	if addUserError != nil {
		log.Println(addUserError)
		return
	}
	if addUserResponse != nil {
		fmt.Println("StatusCode:", addUserResponse.StatusCode)
		assert.Equal(
			201, addUserResponse.StatusCode, "Status Code is incorrect")
	}

	// 2. Deactivate the user with wrong status
	updateUserResponse, UpdateUserError := UpdateUserInformation(
		"updateusererror", "inactive", groups)

	// 3. Verify user got deactivated
	if UpdateUserError != nil {
		log.Println(UpdateUserError)
		assert.Fail("There was an error while updating user info")
		return
	}
	if updateUserResponse != nil {
		fmt.Println("StatusCode:", updateUserResponse.StatusCode)
		assert.Equal(
			500, updateUserResponse.StatusCode, "Status Code is incorrect")
	}
	b, err := io.ReadAll(updateUserResponse.Body)
	if err != nil {
		log.Fatalln(err)
	}
	assert.True(strings.Contains(string(b), "status not valid"))
}

func TestRemoveUserSuccessfulResponse(t *testing.T) {
	/*
		To test removing a user from API
	*/

	assert := assert.New(t)

	// 1. Create an active user
	groups := []string{}
	policies := []string{}
	addUserResponse, addUserError := AddUser(
		"testremoveuser1", "secretKey", groups, policies)
	if addUserError != nil {
		log.Println(addUserError)
		return
	}
	if addUserResponse != nil {
		fmt.Println("StatusCode:", addUserResponse.StatusCode)
		assert.Equal(
			201, addUserResponse.StatusCode, "Status Code is incorrect")
	}

	// 2. Remove the user
	removeUserResponse, removeUserError := RemoveUser("testremoveuser1")
	if removeUserError != nil {
		log.Println(removeUserError)
		return
	}
	if removeUserResponse != nil {
		fmt.Println("StatusCode:", removeUserResponse.StatusCode)
		assert.Equal(
			204, removeUserResponse.StatusCode, "Status Code is incorrect")
	}

	// 3. Verify the user got removed
	getUserInfoResponse, getUserInfoError := GetUserInformation(
		"testremoveuser1")
	if getUserInfoError != nil {
		log.Println(getUserInfoError)
		assert.Fail("There was an error in the response")
		return
	}
	if getUserInfoResponse != nil {
		fmt.Println("StatusCode:", getUserInfoResponse.StatusCode)
		assert.Equal(
			404, getUserInfoResponse.StatusCode, "Status Code is incorrect")
	}
	finalResponse := inspectHTTPResponse(getUserInfoResponse)
	fmt.Println(finalResponse)
	assert.True(strings.Contains(
		finalResponse, "The specified user does not exist"), finalResponse)
}

func TestUpdateGroupsForAUser(t *testing.T) {
	/*
		To test Update Groups For a User End Point.
	*/

	// 1. Create the user
	numberOfGroups := 3
	groupName := "updategroupforausergroup"
	userName := "updategroupsforauser1"
	assert := assert.New(t)
	groups := []string{}
	policies := []string{}
	response, err := AddUser(userName, "secretKey", groups, policies)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Update the groups of the created user with newGroups
	newGroups := make([]string, 3)
	for i := 0; i < numberOfGroups; i++ {
		newGroups[i] = groupName + strconv.Itoa(i)
	}
	response, err = UpdateGroupsForAUser(userName, newGroups)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("StatusCode:", response.StatusCode)
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}

	// 3. Verify the newGroups were updated accordingly
	getUserInfoResponse, getUserInfoErr := GetUserInformation(userName)
	if getUserInfoErr != nil {
		log.Println(getUserInfoErr)
		assert.Fail("There was an error in the response")
		return
	}
	if getUserInfoResponse != nil {
		fmt.Println("StatusCode:", getUserInfoResponse.StatusCode)
		assert.Equal(
			200, getUserInfoResponse.StatusCode, "Status Code is incorrect")
	}
	finalResponse := inspectHTTPResponse(getUserInfoResponse)
	for i := 0; i < numberOfGroups; i++ {
		assert.True(strings.Contains(
			finalResponse, groupName+strconv.Itoa(i)), finalResponse)
	}
}

func TestCreateServiceAccountForUser(t *testing.T) {
	/*
		To test creation of service account for a user.
	*/

	// Test's variables
	userName := "testcreateserviceaccountforuser1"
	assert := assert.New(t)
	policy := ""

	// 1. Create the user
	groups := []string{}
	policies := []string{}
	response, err := AddUser(userName, "secretKey", groups, policies)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		fmt.Println("StatusCode:", response.StatusCode)
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Create the service account for the user
	createServiceAccountResponse,
		createServiceAccountError := CreateServiceAccountForUser(
		userName,
		policy,
	)
	if createServiceAccountError != nil {
		log.Println(createServiceAccountError)
		assert.Fail("Error in createServiceAccountError")
	}
	if createServiceAccountResponse != nil {
		fmt.Println("StatusCode:", createServiceAccountResponse.StatusCode)
		assert.Equal(
			201, createServiceAccountResponse.StatusCode,
			inspectHTTPResponse(createServiceAccountResponse),
		)
	}

	// 3. Verify the service account for the user
	listOfAccountsResponse, listOfAccountsError := ReturnsAListOfServiceAccountsForAUser(userName)

	fmt.Println(listOfAccountsResponse, listOfAccountsError)

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
}

func TestUsersGroupsBulk(t *testing.T) {
	/*
		To test UsersGroupsBulk End Point
	*/

	// Vars
	assert := assert.New(t)
	numberOfUsers := 5
	numberOfGroups := 1
	// var groups = []string{}
	policies := []string{}
	username := "testusersgroupbulk"
	groupName := "testusersgroupsbulkgroupone"
	members := []string{}
	users := make([]string, numberOfUsers)
	groups := make([]string, numberOfGroups)

	// 1. Create some users
	for i := 0; i < numberOfUsers; i++ {
		users[i] = username + strconv.Itoa(i)
		response, err := AddUser(
			users[i],
			"secretKey"+strconv.Itoa(i), []string{}, policies)
		if err != nil {
			log.Println(err)
			return
		}
		if response != nil {
			fmt.Println("POST StatusCode:", response.StatusCode)
			assert.Equal(201, response.StatusCode,
				"Status Code is incorrect on index: "+strconv.Itoa(i))
		}
	}

	// 2. Create a group with no members
	responseAddGroup, errorAddGroup := AddGroup(groupName, members)
	if errorAddGroup != nil {
		log.Println(errorAddGroup)
		return
	}
	finalResponse := inspectHTTPResponse(responseAddGroup)
	if responseAddGroup != nil {
		fmt.Println("POST StatusCode:", responseAddGroup.StatusCode)
		assert.Equal(
			201,
			responseAddGroup.StatusCode,
			finalResponse,
		)
	}

	// 3. Add users to the group
	groups[0] = groupName
	responseUsersGroupsBulk, errorUsersGroupsBulk := UsersGroupsBulk(
		users,
		groups,
	)
	if errorUsersGroupsBulk != nil {
		log.Println(errorUsersGroupsBulk)
		return
	}
	finalResponse = inspectHTTPResponse(responseUsersGroupsBulk)
	if responseUsersGroupsBulk != nil {
		fmt.Println("POST StatusCode:", responseUsersGroupsBulk.StatusCode)
		assert.Equal(
			200,
			responseUsersGroupsBulk.StatusCode,
			finalResponse,
		)
	}

	// 4. Verify users got added to the group
	for i := 0; i < numberOfUsers; i++ {
		responseGetUserInfo, errGetUserInfo := GetUserInformation(
			username + strconv.Itoa(i),
		)
		if errGetUserInfo != nil {
			log.Println(errGetUserInfo)
			assert.Fail("There was an error in the response")
			return
		}
		finalResponse = inspectHTTPResponse(responseGetUserInfo)
		if responseGetUserInfo != nil {
			assert.Equal(200, responseGetUserInfo.StatusCode, finalResponse)
		}
		// Make sure the user belongs to the created group
		assert.True(strings.Contains(finalResponse, groupName))
	}
}

func Test_GetUserPolicyAPI(t *testing.T) {
	assert := assert.New(t)

	// 1. Create an active user with valid policy
	groups := []string{}
	policies := []string{"readwrite"}
	addUserResponse, addUserError := AddUser(
		"getpolicyuser", "secretKey", groups, policies)
	if addUserError != nil {
		log.Println(addUserError)
		return
	}
	if addUserResponse != nil {
		fmt.Println("StatusCode:", addUserResponse.StatusCode)
		assert.Equal(
			201, addUserResponse.StatusCode, "Status Code is incorrect")
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
			name: "Get User Policies",
			args: args{
				api: "/user/policy",
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

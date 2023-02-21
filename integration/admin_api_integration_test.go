// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

// These tests are for AdminAPI Tag based on swagger-console.yml

package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path"
	"testing"
	"time"

	"github.com/minio/console/models"

	"github.com/stretchr/testify/assert"
)

func RestartService() (*http.Response, error) {
	/*
		Helper function to restart service
		HTTP Verb: POST
		URL: /api/v1/service/restart
	*/
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/service/restart",
		nil,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2000 * time.Second, // increased timeout since restart takes time, more than other APIs.
	}
	response, err := client.Do(request)
	return response, err
}

func GetNodes() (*http.Response, error) {
	/*
		Helper function to get nodes
		HTTP Verb: GET
		URL: /api/v1/nodes
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/nodes",
		nil,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2000 * time.Second, // increased timeout since restart takes time, more than other APIs.
	}
	response, err := client.Do(request)
	return response, err
}

func NotifyPostgres() (*http.Response, error) {
	/*
		Helper function to add Postgres Notification
		HTTP Verb: PUT
		URL: api/v1/configs/notify_postgres
		Body:
		{
			"key_values":[
				{
					"key":"connection_string",
					"value":"user=postgres password=password host=localhost dbname=postgres port=5432 sslmode=disable"
				},
				{
					"key":"table",
					"value":"accountsssss"
				},
				{
					"key":"format",
					"value":"namespace"
				},
				{
					"key":"queue_limit",
					"value":"10000"
				},
				{
					"key":"comment",
					"value":"comment"
				}
			]
		}
	*/
	Body := models.SetConfigRequest{
		KeyValues: []*models.ConfigurationKV{
			{
				Key:   "connection_string",
				Value: "user=postgres password=password host=173.18.0.4 dbname=postgres port=5432 sslmode=disable",
			},
			{
				Key:   "table",
				Value: "accountsssss",
			},
			{
				Key:   "format",
				Value: "namespace",
			},
			{
				Key:   "queue_limit",
				Value: "10000",
			},
			{
				Key:   "comment",
				Value: "comment",
			},
		},
	}

	requestDataJSON, _ := json.Marshal(Body)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/configs/notify_postgres",
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

func TestNotifyPostgres(t *testing.T) {
	// Variables
	asserter := assert.New(t)

	// Test
	response, err := NotifyPostgres()
	finalResponse := inspectHTTPResponse(response)
	asserter.Nil(err)
	if err != nil {
		log.Println(err)
		asserter.Fail(finalResponse)
		return
	}
	if response != nil {
		asserter.Equal(200, response.StatusCode, finalResponse)
	}
}

func TestRestartService(t *testing.T) {
	asserter := assert.New(t)
	restartResponse, restartError := RestartService()
	asserter.Nil(restartError)
	if restartError != nil {
		log.Println(restartError)
		return
	}
	addObjRsp := inspectHTTPResponse(restartResponse)
	if restartResponse != nil {
		asserter.Equal(
			204,
			restartResponse.StatusCode,
			addObjRsp,
		)
	}
}

func ListPoliciesWithBucket(bucketName string) (*http.Response, error) {
	/*
		Helper function to List Policies With Given Bucket
		HTTP Verb: GET
		URL: /bucket-policy/{bucket}
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/bucket-policy/"+bucketName, nil)
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

func TestListPoliciesWithBucket(t *testing.T) {
	// Test Variables
	bucketName := "testlistpolicieswithbucket"
	asserter := assert.New(t)

	// Test
	response, err := ListPoliciesWithBucket(bucketName)
	asserter.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	parsedResponse := inspectHTTPResponse(response)
	if response != nil {
		asserter.Equal(
			200,
			response.StatusCode,
			parsedResponse,
		)
	}
}

func ListUsersWithAccessToBucket(bucketName string) (*http.Response, error) {
	/*
		Helper function to List Users With Access to a Given Bucket
		HTTP Verb: GET
		URL: /bucket-users/{bucket}
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/bucket-users/"+bucketName, nil)
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

func TestListUsersWithAccessToBucket(t *testing.T) {
	// Test Variables
	bucketName := "testlistuserswithaccesstobucket1"
	asserter := assert.New(t)

	// Test
	response, err := ListUsersWithAccessToBucket(bucketName)
	asserter.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	parsedResponse := inspectHTTPResponse(response)
	if response != nil {
		asserter.Equal(
			200,
			response.StatusCode,
			parsedResponse,
		)
	}
}

func TestGetNodes(t *testing.T) {
	asserter := assert.New(t)
	getNodesResponse, getNodesError := GetNodes()
	asserter.Nil(getNodesError)
	if getNodesError != nil {
		log.Println(getNodesError)
		return
	}
	addObjRsp := inspectHTTPResponse(getNodesResponse)
	if getNodesResponse != nil {
		asserter.Equal(
			200,
			getNodesResponse.StatusCode,
			addObjRsp,
		)
	}
}

func ArnList() (*http.Response, error) {
	/*
		Helper function to get arn list
		HTTP Verb: GET
		URL: /api/v1/admin/arns
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/admin/arns", nil)
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

func TestArnList(t *testing.T) {
	asserter := assert.New(t)
	resp, err := ArnList()
	asserter.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	objRsp := inspectHTTPResponse(resp)
	if resp != nil {
		asserter.Equal(
			200,
			resp.StatusCode,
			objRsp,
		)
	}
}

func ExportConfig() (*http.Response, error) {
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/configs/export", nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func ImportConfig() (*http.Response, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	formFile, _ := writer.CreateFormFile("file", "sample-import-config.txt")
	fileDir, _ := os.Getwd()
	fileName := "sample-import-config.txt"
	filePath := path.Join(fileDir, fileName)
	file, _ := os.Open(filePath)
	io.Copy(formFile, file)
	writer.Close()
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/configs/import",
		bytes.NewReader(body.Bytes()),
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	rsp, _ := client.Do(request)
	if rsp.StatusCode != http.StatusOK {
		log.Printf("Request failed with response code: %d", rsp.StatusCode)
	}
	return rsp, err
}

func TestExportConfig(t *testing.T) {
	asserter := assert.New(t)
	resp, err := ExportConfig()
	asserter.Nil(err)
	objRsp := inspectHTTPResponse(resp)
	if resp != nil {
		asserter.Equal(
			200,
			resp.StatusCode,
			objRsp,
		)
	}
}

func TestImportConfig(t *testing.T) {
	asserter := assert.New(t)
	resp, err := ImportConfig()
	asserter.Nil(err)
	objRsp := inspectHTTPResponse(resp)
	if resp != nil {
		asserter.Equal(
			200,
			resp.StatusCode,
			objRsp,
		)
	}
}

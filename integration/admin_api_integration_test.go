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
	"log"
	"net/http"
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
				Value: "user=postgres password=password host=173.18.0.3 dbname=postgres port=5432 sslmode=disable",
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
	assert := assert.New(t)

	// Test
	response, err := NotifyPostgres()
	finalResponse := inspectHTTPResponse(response)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail(finalResponse)
		return
	}
	if response != nil {
		assert.Equal(200, response.StatusCode, finalResponse)
	}

}

func TestRestartService(t *testing.T) {

	assert := assert.New(t)
	restartResponse, restartError := RestartService()
	assert.Nil(restartError)
	if restartError != nil {
		log.Println(restartError)
		return
	}
	addObjRsp := inspectHTTPResponse(restartResponse)
	if restartResponse != nil {
		assert.Equal(
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
	assert := assert.New(t)

	// Test
	response, err := ListPoliciesWithBucket(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	parsedResponse := inspectHTTPResponse(response)
	if response != nil {
		assert.Equal(
			200,
			response.StatusCode,
			parsedResponse,
		)
	}

}

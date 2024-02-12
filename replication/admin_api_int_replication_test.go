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

// These tests are for AdminAPI Tag based on swagger-console.yml

package replication

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/minio/console/models"
	"github.com/stretchr/testify/assert"
)

const apiURL = "http://localhost:9090/api/v1/admin/site-replication"

func makeExecuteReq(method string, body io.Reader) (*http.Response, error) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	request, err := http.NewRequest(
		method,
		apiURL,
		body,
	)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func AddSiteReplicationInfo(sites []map[string]interface{}) (int, error) {
	requestDataJSON, _ := json.Marshal(sites)
	requestDataBody := bytes.NewReader(requestDataJSON)
	response, err := makeExecuteReq("POST", requestDataBody)
	if err != nil {
		log.Println(response)
		return -1, err
	}
	if response != nil {
		return response.StatusCode, nil
	}

	return -1, nil
}

func EditSiteReplicationInfo(editedSite map[string]interface{}) (int, error) {
	requestDataJSON, _ := json.Marshal(editedSite)
	requestDataBody := bytes.NewReader(requestDataJSON)
	response, err := makeExecuteReq("PUT", requestDataBody)
	if err != nil {
		return -1, err
	}
	if response != nil {
		return response.StatusCode, nil
	}

	return -1, nil
}

func DeleteSiteReplicationInfo(delReq map[string]interface{}) (int, error) {
	requestDataJSON, _ := json.Marshal(delReq)
	requestDataBody := bytes.NewReader(requestDataJSON)
	response, err := makeExecuteReq("DELETE", requestDataBody)
	if err != nil {
		return -1, err
	}
	if response != nil {
		return response.StatusCode, nil
	}

	return -1, nil
}

func TestGetSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	response, err := makeExecuteReq("GET", nil)

	// defer response.Body.Close()

	tgt := &models.SiteReplicationInfoResponse{}
	json.NewDecoder(response.Body).Decode(tgt)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}
}

func TestAddSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	fmt.Println("Add Site Replication")

	sites := make([]map[string]interface{}, 2)
	sites[0] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://localhost:9000",
		"secretKey": "minioadmin",
		"name":      "sitellhost9000",
	}
	sites[1] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://minio1:9001", // Docker container .
		// "endpoint":  "http://localhost:9001", for local development
		"secretKey": "minioadmin",
		"name":      "sitellhost9001",
	}

	errorSites1 := make([]map[string]interface{}, 2)
	errorSites1[0] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://localhost:9000",
		"secretKey": "minioadmin",
		"name":      "sitellhost9000",
	}
	errorSites1[1] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://non-existent:9001",
		"secretKey": "minioadmin",
		"name":      "sitellhost9001",
	}

	errorSites2 := make([]map[string]interface{}, 2)
	errorSites2[0] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://localhost:9000",
		"secretKey": "minioadmin",
		"name":      "sitellhost9000",
	}
	errorSites2[1] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://localhost:9000",
		"secretKey": "minioadmin",
		"name":      "sitellhost9000",
	}
	type args struct {
		sites []map[string]interface{}
	}
	tests := []struct {
		name          string
		args          args
		expStatusCode int
		expectedError bool
	}{
		// valid sites for replication config
		{
			name: "Add Two sites for Replication",
			args: args{
				sites: sites,
			},
			expStatusCode: 200,
			expectedError: false,
		},

		// context deadline error
		{
			name: "Add Invalid Site name for Replication",
			args: args{
				sites: errorSites1,
			},
			expStatusCode: 500,
			expectedError: true,
		},

		// site already added  error 500
		{
			name: "Add same Site name for Replication",
			args: args{
				sites: errorSites2,
			},
			expStatusCode: 500,
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			actualStatusCode, err := AddSiteReplicationInfo(tt.args.sites)
			fmt.Println("TestAddSiteReplicationInfo: ", actualStatusCode)

			if tt.expStatusCode > 0 {
				assert.Equal(tt.expStatusCode, actualStatusCode, "Expected Status Code is incorrect")
				return
			}
			if tt.expectedError {
				assert.NotEmpty(err)
				return
			}
		})
	}
}

func TestEditSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	getResponse, err := makeExecuteReq("GET", nil)
	if err != nil {
		assert.Fail("Unable to get Site replication info")
	}
	getResObj := &models.SiteReplicationInfoResponse{}
	json.NewDecoder(getResponse.Body).Decode(getResObj)
	var secondDeploymentID string
	fmt.Println("Edit Site Replication")
	fmt.Println("Editing a valid site deployment id::", secondDeploymentID)
	updatedSiteInfo := map[string]interface{}{
		"deploymentID": secondDeploymentID,
		"endpoint":     "http://minio2:9002", // replace it with docker name
		// "endpoint": "http://localhost:9002", // local dev
		"name": "sitellhost9002",
	}
	invalidUpdatedSiteInfo := map[string]interface{}{
		"deploymentID": secondDeploymentID,
		"endpoint":     "non-existenet:9002",
		"name":         "sitellhost9002",
	}
	invalidUpdatedSiteInfo1 := map[string]interface{}{}
	tests := []struct {
		name          string
		args          map[string]interface{}
		expStatusCode int
		expectedError bool
	}{
		{
			name:          "Edit an existing valid site",
			args:          updatedSiteInfo,
			expStatusCode: -1,
			expectedError: false,
		},
		{
			name:          "Edit with an invalid site endpoint",
			args:          invalidUpdatedSiteInfo,
			expStatusCode: 500,
			expectedError: false,
		},
		{
			name:          "Edit with an invalid empty site ",
			args:          invalidUpdatedSiteInfo1,
			expStatusCode: 500,
			expectedError: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			actualStatusCode, err := EditSiteReplicationInfo(tt.args)
			fmt.Println("TestEditSiteReplicationInfo: ", actualStatusCode)
			if tt.expStatusCode > 0 {
				assert.Equal(tt.expStatusCode, actualStatusCode, "Expected Status Code is incorrect")
				return
			}
			if tt.expectedError {
				assert.NotEmpty(err)
				return
			}
		})
	}
}

func TestDeleteSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	delReq := map[string]interface{}{
		"all": true,
		"sites": []string{
			"sitellhost9000",
			"sitellhost9001",
			"sitellhost9002",
		},
	}
	invalidDelReq := map[string]interface{}{
		"all": false,
		"sites": []string{
			"sitellhost9000",
		},
	}
	invalidDelReq1 := map[string]interface{}{
		"all":   true,
		"sites": []string{},
	}
	tests := []struct {
		name          string
		args          map[string]interface{}
		expStatusCode int
		expectedError bool
	}{
		{
			name:          "Delete Valid Sites already added",
			args:          delReq,
			expStatusCode: 204,
			expectedError: false,
		},
		{
			name:          "Delete Invalid Sites ",
			args:          invalidDelReq,
			expStatusCode: 500,
			expectedError: true,
		},
		{
			name:          "Invalid delete request",
			args:          invalidDelReq1,
			expStatusCode: 500,
			expectedError: true,
		},
	}
	fmt.Println("Delete Site Replication")
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			actualStatusCode, err := DeleteSiteReplicationInfo(tt.args)
			fmt.Println("TestDeleteSiteReplicationInfo: ", actualStatusCode)
			if tt.expStatusCode > 0 {
				assert.Equal(tt.expStatusCode, actualStatusCode, "Expected Status Code is incorrect")
				return
			}
			if tt.expectedError {
				assert.NotEmpty(err)
				return
			}
		})
	}
}

// Status API

func makeStatusExecuteReq(method string, url string) (*http.Response, error) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	request, err := http.NewRequest(
		method,
		url,
		nil,
	)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	return response, nil
}

func TestGetSiteReplicationStatus(t *testing.T) {
	assert := assert.New(t)

	const (
		baseAPIURL          = "http://localhost:9090/api/v1/admin/site-replication/status?"
		lookupDefaultParams = "users=false&groups=false&buckets=false&policies=false&"
	)

	tests := []struct {
		name          string
		args          string
		expStatusCode int
		expectedError bool
	}{
		{
			name:          "Default replication status",
			args:          baseAPIURL + "users=true&groups=true&buckets=true&policies=true",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Specific bucket  lookup replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-bucket&entityType=bucket",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Invalid specific bucket  lookup replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-bucket-non-existent&entityType=bucket",
			expStatusCode: 200,
			expectedError: true,
		},
		{
			name:          "Specific user lookup replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-user&entityType=user",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Invalid user lookup replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-user-non-existent&entityType=user",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Specific group lookup replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-group&entityType=group",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Invalid group lookup replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-group-non-existent&entityType=group",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Specific  policy replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=consoleAdmin&entityType=policy",
			expStatusCode: 200,
			expectedError: false,
		},
		{
			name:          "Invalid  policy replication status",
			args:          baseAPIURL + lookupDefaultParams + "entityValue=test-policies&entityType=policy",
			expStatusCode: 200,
			expectedError: false,
		},
	}

	for ti, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			response, err := makeStatusExecuteReq("GET", tt.args)
			tgt := &models.SiteReplicationStatusResponse{}
			json.NewDecoder(response.Body).Decode(tgt)
			log.Println(err, response)
			if err != nil {
				log.Println(err)

				if tt.expectedError {
					assert.NotEmpty(err)
				}
				return
			}
			if response != nil {
				assert.Equal(tt.expStatusCode, response.StatusCode, "Status Code for", ti)
			}
		})
	}
}

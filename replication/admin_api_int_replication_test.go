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

func AddSiteReplicationInfo() (*http.Response, error) {

	sites := make([]map[string]interface{}, 2)
	sites[0] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://localhost:9000",
		"secretKey": "minioadmin",
		"name":      "sitellhost9000",
	}
	sites[1] = map[string]interface{}{
		"accessKey": "minioadmin",
		"endpoint":  "http://minio1:9001",
		"secretKey": "minioadmin",
		"name":      "sitellhost9001",
	}

	requestDataJSON, _ := json.Marshal(sites)
	requestDataBody := bytes.NewReader(requestDataJSON)

	return makeExecuteReq("POST", requestDataBody)

}

func EditSiteReplicationInfo() (*http.Response, error) {

	getResponse, err := makeExecuteReq("GET", nil)
	//defer response.Body.Close()

	if err != nil {
		return nil, err
	}

	getResObj := &models.SiteReplicationInfoResponse{}
	json.NewDecoder(getResponse.Body).Decode(getResObj)

	//fmt.Println("Edit Got::", getResObj, getResObj.Sites[0], getResObj.Sites[1])
	var secondDeploymentID string
	if getResObj != nil {
		if len(getResObj.Sites) > 0 {
			secondDeploymentID = getResObj.Sites[1].DeploymentID
		}
	} else {
		return nil, nil
	}

	fmt.Println("Editing::", getResObj.Sites[1])
	fmt.Println("Editing::", secondDeploymentID)
	pSiteInfo := map[string]interface{}{
		"deploymentID": secondDeploymentID,
		"endpoint":     "http://minio2:9002",
		"name":         "sitellhost9002",
	}

	requestDataJSON, _ := json.Marshal(pSiteInfo)
	requestDataBody := bytes.NewReader(requestDataJSON)
	return makeExecuteReq("PUT", requestDataBody)

}

func DeleteSiteReplicationInfo() (*http.Response, error) {

	delReq := map[string]interface{}{
		"all": true,
		"sites": []string{
			"sitellhost9000",
			"sitellhost9001",
			"sitellhost9002",
		},
	}
	requestDataJSON, _ := json.Marshal(delReq)
	requestDataBody := bytes.NewReader(requestDataJSON)

	return makeExecuteReq("DELETE", requestDataBody)

}

func TestGetSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)

	response, err := makeExecuteReq("GET", nil)
	//defer response.Body.Close()

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
	response, err := AddSiteReplicationInfo()

	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}
	fmt.Println("TestAddSiteReplicationInfo: ", response.StatusCode)

}

func TestEditSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)

	response, err := EditSiteReplicationInfo()

	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.NotEmpty(response)
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}

}

func TestDeleteSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)

	fmt.Println("Delete Site Replication")
	response, err := DeleteSiteReplicationInfo()
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(204, response.StatusCode, "Status Code is incorrect")
	}
	fmt.Println("TestDeleteReplicationInfo: ", response.StatusCode)

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

	reqUrls := [5]string{
		//default
		"http://localhost:9090/api/v1/admin/site-replication/status?users=true&groups=true&buckets=true&policies=true",
		//specific bucket  lookup
		"http://localhost:9090/api/v1/admin/site-replication/status?users=false&groups=false&buckets=false&policies=false&entityValue=test-bucket&entityType=bucket",
		//specific-user  lookup
		"http://localhost:9090/api/v1/admin/site-replication/status?users=false&groups=false&buckets=false&policies=false&entityValue=test-user&entityType=user",
		//specific-group  lookup
		"http://localhost:9090/api/v1/admin/site-replication/status?users=false&groups=false&buckets=false&policies=false&entityValue=test-group&entityType=group",
		//specific-policy  lookup
		"http://localhost:9090/api/v1/admin/site-replication/status?users=false&groups=false&buckets=false&policies=false&entityValue=test-policies&entityType=policiy",
	}

	for i, url := range reqUrls {

		response, err := makeStatusExecuteReq("GET", url)

		tgt := &models.SiteReplicationStatusResponse{}
		json.NewDecoder(response.Body).Decode(tgt)

		if err != nil {
			log.Println(err)
			return
		}
		if response != nil {
			assert.Equal(200, response.StatusCode, "Status Code for", i)
		}
	}
}

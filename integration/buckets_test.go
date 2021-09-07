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

package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/go-openapi/loads"
	"github.com/minio/console/restapi"
	"github.com/minio/console/restapi/operations"

	"github.com/minio/console/models"

	"github.com/stretchr/testify/assert"
)

var token string

func initConsoleServer() (*restapi.Server, error) {

	//os.Setenv("CONSOLE_MINIO_SERVER", "localhost:9000")

	swaggerSpec, err := loads.Embedded(restapi.SwaggerJSON, restapi.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	noLog := func(string, ...interface{}) {
		// nothing to log
	}

	// Initialize MinIO loggers
	restapi.LogInfo = noLog
	restapi.LogError = noLog

	api := operations.NewConsoleAPI(swaggerSpec)
	api.Logger = noLog

	server := restapi.NewServer(api)
	// register all APIs
	server.ConfigureAPI()

	//restapi.GlobalRootCAs, restapi.GlobalPublicCerts, restapi.GlobalTLSCertsManager = globalRootCAs, globalPublicCerts, globalTLSCerts

	consolePort, _ := strconv.Atoi("9090")

	server.Host = "0.0.0.0"
	server.Port = consolePort
	restapi.Port = "9090"
	restapi.Hostname = "0.0.0.0"

	return server, nil
}

func TestMain(m *testing.M) {

	// start console server
	go func() {
		fmt.Println("start server")
		srv, err := initConsoleServer()
		if err != nil {
			log.Println(err)
			log.Println("init fail")
			return
		}
		srv.Serve()

	}()

	fmt.Println("sleeping")
	time.Sleep(2 * time.Second)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	// get login credentials

	requestData := map[string]string{
		"accessKey": "minioadmin",
		"secretKey": "minioadmin",
	}

	requestDataJSON, _ := json.Marshal(requestData)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, err := http.NewRequest("POST", "http://localhost:9090/api/v1/login", requestDataBody)
	if err != nil {
		log.Println(err)
		return
	}

	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)

	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		bodyBytes, _ := ioutil.ReadAll(response.Body)

		loginResponse := models.LoginResponse{}
		err = json.Unmarshal(bodyBytes, &loginResponse)
		if err != nil {
			log.Println(err)
		}

		token = loginResponse.SessionID

	}

	code := m.Run()

	requestDataAdd := map[string]interface{}{
		"name": "test1",
	}

	requestDataJSON, _ = json.Marshal(requestDataAdd)

	requestDataBody = bytes.NewReader(requestDataJSON)

	// get list of buckets
	request, err = http.NewRequest("DELETE", "http://localhost:9090/api/v1/buckets/test1", requestDataBody)
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
	}

	os.Exit(code)
}

func TestAddBucket(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	requestDataAdd := map[string]interface{}{
		"name":       "test1",
		"versioning": false,
		"locking":    false,
	}

	requestDataJSON, _ := json.Marshal(requestDataAdd)

	requestDataBody := bytes.NewReader(requestDataJSON)

	// get list of buckets
	request, err := http.NewRequest("POST", "http://localhost:9090/api/v1/buckets", requestDataBody)
	if err != nil {
		log.Println(err)
		return
	}

	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}
}

func TestBucketVersioning(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	request, err := http.NewRequest("GET", "http://localhost:9090/api/v1/session", nil)
	if err != nil {
		log.Println(err)
		return
	}

	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))

	response, err := client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	var distributedSystem bool

	if response != nil {

		bodyBytes, _ := ioutil.ReadAll(response.Body)

		sessionResponse := models.SessionResponse{}
		err = json.Unmarshal(bodyBytes, &sessionResponse)
		if err != nil {
			log.Println(err)
		}

		distributedSystem = sessionResponse.DistributedMode

	}

	requestDataVersioning := map[string]interface{}{
		"name":       "test2",
		"versioning": true,
		"locking":    false,
	}

	requestDataJSON, _ := json.Marshal(requestDataVersioning)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, err = http.NewRequest("POST", "http://localhost:9090/api/v1/buckets", requestDataBody)
	if err != nil {
		log.Println(err)
		return
	}

	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	response, err = client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println("Versioned bucket creation test status:", response.Status)
	if distributedSystem {
		assert.Equal(201, response.StatusCode, "Versioning test Status Code is incorrect - bucket failed to create")
	} else {
		assert.NotEqual(201, response.StatusCode, "Versioning test Status Code is incorrect -  versioned bucket created on non-distributed system")
	}

	request, err = http.NewRequest("DELETE", "http://localhost:9090/api/v1/buckets/test2", requestDataBody)
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
	}

}

func TestBucketsGet(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	// get list of buckets
	request, err := http.NewRequest("GET", "http://localhost:9090/api/v1/buckets", nil)
	if err != nil {
		log.Println(err)
		return
	}

	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))

	response, err := client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
		bodyBytes, _ := ioutil.ReadAll(response.Body)

		listBuckets := models.ListBucketsResponse{}
		err = json.Unmarshal(bodyBytes, &listBuckets)
		if err != nil {
			log.Println(err)
			assert.Nil(err)
		}

		assert.Greater(len(listBuckets.Buckets), 0, "No bucket was returned")
		assert.Greater(listBuckets.Total, int64(0), "Total buckets is 0")

	}

}

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
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/go-openapi/loads"
	"github.com/minio/console/restapi"
	"github.com/minio/console/restapi/operations"

	"github.com/minio/console/models"

	"github.com/stretchr/testify/assert"
)

var token string

func inspectHTTPResponse(httpResponse *http.Response) string {
	/*
		Helper function to inspect the content of a HTTP response.
	*/
	b, err := io.ReadAll(httpResponse.Body)
	if err != nil {
		log.Fatalln(err)
	}
	return "Http Response: " + string(b)
}

func printMessage(message string) {
	/*
		Helper function to print HTTP response.
	*/
	fmt.Println(message)
}

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
		for _, cookie := range response.Cookies() {
			if cookie.Name == "token" {
				token = cookie.Value
				break
			}
		}
	}

	if token == "" {
		log.Println("authentication token not found in cookies response")
		return
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

func AddBucket(BucketName string, Versioning bool, Locking bool) (*http.Response, error) {
	/*
	   This is an atomic function that we can re-use to create a bucket on any
	   desired test.
	*/
	// Needed Parameters for API Call
	requestDataAdd := map[string]interface{}{
		"name":       BucketName,
		"versioning": Versioning,
		"locking":    Locking,
	}

	// Creating the Call by adding the URL and Headers
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest("POST", "http://localhost:9090/api/v1/buckets", requestDataBody)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")

	// Performing the call
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func ListBuckets() (*http.Response, error) {
	/*
		Helper function to list buckets
		HTTP Verb: GET
		{{baseUrl}}/buckets?sort_by=proident velit&offset=-5480083&limit=-5480083
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/buckets", nil)
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

func BucketInfo(name string) (*http.Response, error) {
	/*
		Helper function to test Bucket Info End Point
		GET: {{baseUrl}}/buckets/:name
	*/
	bucketInformationRequest, bucketInformationError := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/buckets/"+name, nil)
	if bucketInformationError != nil {
		log.Println(bucketInformationError)
	}
	bucketInformationRequest.Header.Add("Cookie",
		fmt.Sprintf("token=%s", token))
	bucketInformationRequest.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(bucketInformationRequest)
	return response, err
}

func PutBucketsTags(bucketName string, tags map[string]string) (*http.Response, error) {
	/*
		Helper function to put bucket's tags.
		PUT: {{baseUrl}}/buckets/:bucket_name/tags
		{
			"tags": {}
		}
	*/
	requestDataAdd := map[string]interface{}{
		"tags": tags,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest("PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/tags",
		requestDataBody)
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

func TestAddBucket(t *testing.T) {
	assert := assert.New(t)

	response, err := AddBucket("test1", false, false)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}
}

func TestAddBucketLocking(t *testing.T) {
	/*
		This function is to test that locking can't be activated if versioning
		is not enabled.
		Then, locking will be activated because versioning is activated as well.
	*/
	assert := assert.New(t)

	/*
		This is invalid, versioning has to be true for locking to be true, but
		test will see and make sure this is not allowed and that we get proper
		error for this scenario.
	*/
	response, err := AddBucket("test1", false, true)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		assert.Equal(400, response.StatusCode, "400 is expected for this test")
	}

	msg := "TestAddBucketLocking(): Valid scenario versioning true locking true"
	fmt.Println(msg)

	/*
		This is valid, versioning is true, then locking can be true as well.
	*/
	response, err = AddBucket("thujun", true, true)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	// Verification part, bucket should be created with versioning enabled and
	// locking enabled, we expect 201 when created.
	if response != nil {
		assert.Equal(201, response.StatusCode, "201 is expected for this test")
	}

	defer response.Body.Close()

	/*
		To convert an HTTP response body to a string in Go, so you can read the
		error from the API in case the bucket is invalid for some reason
	*/
	b, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(string(b))

}

func TestGetBucket(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	response, err := AddBucket("test3", false, false)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	// get bucket
	request, err := http.NewRequest("GET", "http://localhost:9090/api/v1/buckets/test3", nil)
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

	if response != nil {
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}
}

func TestSetBucketTags(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	// put bucket
	response, err := AddBucket("test4", false, false)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	requestDataTags := map[string]interface{}{
		"tags": map[string]interface{}{
			"test": "TAG",
		},
	}

	requestTagsJSON, _ := json.Marshal(requestDataTags)

	requestTagsBody := bytes.NewBuffer(requestTagsJSON)

	request, err := http.NewRequest(http.MethodPut, "http://localhost:9090/api/v1/buckets/test4/tags", requestTagsBody)
	request.Close = true
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

	// get bucket
	request, err = http.NewRequest("GET", "http://localhost:9090/api/v1/buckets/test4", nil)
	request.Close = true
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

	bodyBytes, _ := ioutil.ReadAll(response.Body)

	bucket := models.Bucket{}
	err = json.Unmarshal(bodyBytes, &bucket)
	if err != nil {
		log.Println(err)
	}

	assert.Equal("TAG", bucket.Details.Tags["test"], "Failed to add tag")
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

	response, err = AddBucket("test2", true, false)
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

	request, error := http.NewRequest("DELETE", "http://localhost:9090/api/v1/buckets/test2", requestDataBody)
	if error != nil {
		log.Println(error)
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

func TestListBuckets(t *testing.T) {
	/*
		Test the list of buckets without query parameters.
	*/
	assert := assert.New(t)

	// 1. Create buckets
	var numberOfBuckets = 3
	for i := 1; i <= numberOfBuckets; i++ {
		response, err := AddBucket(
			"testlistbuckets"+strconv.Itoa(i), false, false)
		assert.Nil(err)
		if err != nil {
			log.Println(err)
			assert.Fail("Error creating the buckets")
			return
		}
		if response != nil {
			b, err := io.ReadAll(response.Body)
			if err != nil {
				log.Fatalln(err)
			}
			assert.Equal(201, response.StatusCode,
				"Status Code is incorrect: "+string(b)+
					" Bucket name: TestListBuckets"+strconv.Itoa(i))
		}
	}

	// 2. List buckets
	listBucketsResponse, listBucketsError := ListBuckets()
	assert.Nil(listBucketsError)
	if listBucketsError != nil {
		log.Println(listBucketsError)
		assert.Fail("Error listing the buckets")
		return
	}

	// 3. Verify list of buckets
	b, err := io.ReadAll(listBucketsResponse.Body)
	if listBucketsResponse != nil {
		if err != nil {
			log.Fatalln(err)
		}
		assert.Equal(200, listBucketsResponse.StatusCode,
			"Status Code is incorrect: "+string(b))
	}
	for i := 1; i <= numberOfBuckets; i++ {
		assert.True(strings.Contains(string(b),
			"testlistbuckets"+strconv.Itoa(i)))
	}
}

func TestBucketInformationSuccessfulResponse(t *testing.T) {
	/*
		Test Bucket Info End Point with a Successful Response.
	*/

	// 1. Create the bucket
	assert := assert.New(t)
	response, err := AddBucket("bucketinformation1", false, false)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Add a tag to the bucket
	tags := make(map[string]string)
	tags["tag1"] = "tag1"
	putBucketTagResponse, putBucketTagError := PutBucketsTags(
		"bucketinformation1", tags)
	if putBucketTagError != nil {
		log.Println(putBucketTagError)
		assert.Fail("Error creating the bucket")
		return
	}
	if putBucketTagResponse != nil {
		assert.Equal(
			200, putBucketTagResponse.StatusCode,
			inspectHTTPResponse(putBucketTagResponse))
	}

	// 3. Get the information
	bucketInfoResponse, bucketInfoError := BucketInfo("bucketinformation1")
	if bucketInfoError != nil {
		log.Println(bucketInfoError)
		assert.Fail("Error getting the bucket information")
		return
	}
	debugResponse := inspectHTTPResponse(bucketInfoResponse) // call it once
	if bucketInfoResponse != nil {
		assert.Equal(200, bucketInfoResponse.StatusCode,
			debugResponse)
	}
	printMessage(debugResponse)

	// 4. Verify the information
	assert.True(
		strings.Contains(debugResponse, "bucketinformation1"),
		inspectHTTPResponse(bucketInfoResponse))
	assert.True(
		strings.Contains(debugResponse, "tag1"),
		inspectHTTPResponse(bucketInfoResponse))
}

func TestBucketInformationGenericErrorResponse(t *testing.T) {
	/*
		Test Bucket Info End Point with a Generic Error Response.
	*/
	// 1. Create the bucket
	assert := assert.New(t)
	response, err := AddBucket("bucketinformation2", false, false)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Add a tag to the bucket
	tags := make(map[string]string)
	tags["tag2"] = "tag2"
	putBucketTagResponse, putBucketTagError := PutBucketsTags(
		"bucketinformation2", tags)
	if putBucketTagError != nil {
		log.Println(putBucketTagError)
		assert.Fail("Error creating the bucket")
		return
	}
	if putBucketTagResponse != nil {
		assert.Equal(
			200, putBucketTagResponse.StatusCode,
			inspectHTTPResponse(putBucketTagResponse))
	}

	// 3. Get the information
	bucketInfoResponse, bucketInfoError := BucketInfo("bucketinformation3")
	if bucketInfoError != nil {
		log.Println(bucketInfoError)
		assert.Fail("Error getting the bucket information")
		return
	}
	finalResponse := inspectHTTPResponse(bucketInfoResponse)
	if bucketInfoResponse != nil {
		assert.Equal(200, bucketInfoResponse.StatusCode)
	}

	// 4. Verify the information
	// Since bucketinformation3 hasn't been created, then it is expected that
	// tag2 is not part of the response, this is why assert.False is used.
	assert.False(strings.Contains(finalResponse, "tag2"), finalResponse)
}

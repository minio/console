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
	b64 "encoding/base64"
	"encoding/json"
	"errors"
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

func encodeBase64(fileName string) string {
	/*
		Helper function to encode in base64 the file name so we can get the path
	*/
	path := b64.StdEncoding.EncodeToString([]byte(fileName))
	return path
}

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

func AddBucket(name string, locking bool, versioning bool, quota map[string]interface{}, retention map[string]interface{}) (*http.Response, error) {
	/*
	   This is an atomic function that we can re-use to create a bucket on any
	   desired test.
	*/
	// Needed Parameters for API Call
	requestDataAdd := map[string]interface{}{
		"name":       name,
		"locking":    locking,
		"versioning": versioning,
		"quota":      quota,
		"retention":  retention,
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

func DeleteBucket(name string) (*http.Response, error) {
	/*
		Helper function to delete bucket.
		DELETE: {{baseUrl}}/buckets/:name
	*/
	request, err := http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/buckets/"+name, nil)
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

func SetBucketRetention(bucketName string, mode string, unit string, validity int) (*http.Response, error) {
	/*
		Helper function to set bucket's retention
		PUT: {{baseUrl}}/buckets/:bucket_name/retention
		{
			"mode":"compliance",
			"unit":"years",
			"validity":2
		}
	*/
	requestDataAdd := map[string]interface{}{
		"mode":     mode,
		"unit":     unit,
		"validity": validity,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest("PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/retention",
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

func GetBucketRetention(bucketName string) (*http.Response, error) {
	/*
		Helper function to get the bucket's retention
	*/
	request, err := http.NewRequest("GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/retention",
		nil)
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

func PutObjectTags(bucketName string, prefix string, tags map[string]string, versionID string) (*http.Response, error) {
	/*
		Helper function to put object's tags.
		PUT: /buckets/{bucket_name}/objects/tags?prefix=prefix
		{
			"tags": {}
		}
	*/
	requestDataAdd := map[string]interface{}{
		"tags": tags,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/buckets/"+
			bucketName+"/objects/tags?prefix="+prefix+"&version_id="+versionID,
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

func DownloadObject(bucketName string, path string) (*http.Response, error) {
	/*
	   Helper function to download an object from a bucket.
	   GET: {{baseUrl}}/buckets/bucketName/objects/download?prefix=file
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects/download?prefix="+
			path,
		nil,
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

func UploadAnObject(bucketName string, fileName string) (*http.Response, error) {
	/*
		Helper function to upload a file to a bucket for testing.
		POST {{baseUrl}}/buckets/:bucket_name/objects/upload
	*/
	boundary := "WebKitFormBoundaryWtayBM7t9EUQb8q3"
	boundaryStart := "------" + boundary + "\r\n"
	contentDispositionOne := "Content-Disposition: form-data; name=\"2\"; "
	contentDispositionTwo := "filename=\"" + fileName + "\"\r\n"
	contenType := "Content-Type: text/plain\r\n\r\na\n\r\n"
	boundaryEnd := "------" + boundary + "--\r\n"
	file := boundaryStart + contentDispositionOne + contentDispositionTwo +
		contenType + boundaryEnd
	arrayOfBytes := []byte(file)
	requestDataBody := bytes.NewReader(arrayOfBytes)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects/upload",
		requestDataBody,
	)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add(
		"Content-Type",
		"multipart/form-data; boundary=----"+boundary,
	)
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func DeleteMultipleObjects(bucketName string, files []map[string]interface{}) (*http.Response, error) {
	/*
	   Helper function to delete multiple objects in a container.
	   POST: /buckets/{bucket_name}/delete-objects
	   files: [
	     {
	       "path": "veniam tempor in",
	       "versionID": "ea dolor Duis",
	       "recursive": false
	     },
	     {
	       "path": "proident eu esse",
	       "versionID": "eiusmod amet commodo",
	       "recursive": true
	       }
	   ]
	*/
	requestDataAdd := map[string]interface{}{
		"files": files,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/delete-objects",
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

func DeleteObject(bucketName string, path string, recursive bool, allVersions bool) (*http.Response, error) {
	/*
	   Helper function to delete an object from a given bucket.
	   DELETE:
	   {{baseUrl}}/buckets/bucketName/objects?path=Y2VzYXJpby50eHQ=&recursive=false&all_versions=false
	*/
	url := "http://localhost:9090/api/v1/buckets/" + bucketName + "/objects?path=" +
		path + "&recursive=" + strconv.FormatBool(recursive) + "&all_versions=" +
		strconv.FormatBool(allVersions)
	request, err := http.NewRequest(
		"DELETE",
		url,
		nil,
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

func ListObjects(bucketName string, prefix string, withVersions string) (*http.Response, error) {
	/*
		Helper function to list objects in a bucket.
		GET: {{baseUrl}}/buckets/:bucket_name/objects
	*/
	request, err := http.NewRequest("GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects?prefix="+prefix+"&with_versions="+withVersions,
		nil)
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

func SharesAnObjectOnAUrl(bucketName string, prefix string, versionID string, expires string) (*http.Response, error) {
	// Helper function to share an object on a url
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects/share?prefix="+prefix+"&version_id="+versionID+"&expires="+expires,
		nil,
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

func PutObjectsRetentionStatus(bucketName string, prefix string, versionID string, mode string, expires string, governanceBypass bool) (*http.Response, error) {
	requestDataAdd := map[string]interface{}{
		"mode":              mode,
		"expires":           expires,
		"governance_bypass": governanceBypass,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects/retention?prefix="+prefix+"&version_id="+versionID,
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

func GetsTheMetadataOfAnObject(bucketName string, prefix string) (*http.Response, error) {
	/*
		Gets the metadata of an object
		GET
		{{baseUrl}}/buckets/:bucket_name/objects/metadata?prefix=proident velit
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects/metadata?prefix="+prefix,
		nil,
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

func RestoreObjectToASelectedVersion(bucketName string, prefix string, versionID string) (*http.Response, error) {
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/objects/restore?prefix="+prefix+"&version_id="+versionID,
		nil,
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

func BucketSetPolicy(bucketName string, access string, definition string) (*http.Response, error) {
	/*
		Helper function to set policy on a bucket
		Name: Bucket Set Policy
		HTTP Verb: PUT
		URL: {{baseUrl}}/buckets/:name/set-policy
		Body:
		{
			"access": "PRIVATE",
			"definition": "dolo"
		}
	*/
	requestDataAdd := map[string]interface{}{
		"access":     access,
		"definition": definition,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/set-policy",
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

func DeleteObjectsRetentionStatus(bucketName string, prefix string, versionID string) (*http.Response, error) {
	/*
		Helper function to Delete Object Retention Status
		DELETE:
		{{baseUrl}}/buckets/:bucket_name/objects/retention?prefix=proident velit&version_id=proident velit
	*/
	url := "http://localhost:9090/api/v1/buckets/" + bucketName + "/objects/retention?prefix=" +
		prefix + "&version_id=" + versionID
	request, err := http.NewRequest(
		"DELETE",
		url,
		nil,
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

func TestAddBucket(t *testing.T) {
	assert := assert.New(t)
	type args struct {
		bucketName string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
	}{
		{
			name:           "Add Bucket with valid name",
			expectedStatus: 201,
			args: args{
				bucketName: "test1",
			},
		},
		{
			name:           "Add Bucket with invalid name",
			expectedStatus: 500,
			args: args{
				bucketName: "*&^###Test1ThisMightBeInvalid555",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			response, err := AddBucket(
				tt.args.bucketName, false, false, nil, nil)
			assert.Nil(err)
			if err != nil {
				log.Println(err)
				assert.Fail("Error while adding the bucket")
				return
			}
			finalResponse := inspectHTTPResponse(response)
			if response != nil {
				assert.Equal(tt.expectedStatus,
					response.StatusCode, finalResponse)
			}
		})
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
	response, err := AddBucket("test1", true, false, nil, nil)
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
	response, err = AddBucket("thujun", true, true, nil, nil)
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

	response, err := AddBucket("test3", false, false, nil, nil)
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
	response, err := AddBucket("test4", false, false, nil, nil)
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

	response, err = AddBucket("test2", true, false, nil, nil)
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
			"testlistbuckets"+strconv.Itoa(i), false, false, nil, nil)
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

func TestDeleteBucket(t *testing.T) {
	/*
		Test to delete a bucket
	*/
	// 1. Create the bucket
	assert := assert.New(t)
	response, err := AddBucket("testdeletebucket1", false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Delete the bucket
	deleteBucketResponse, deleteBucketError := DeleteBucket("testdeletebucket1")
	assert.Nil(deleteBucketError)
	if deleteBucketError != nil {
		log.Println(deleteBucketError)
		return
	}
	if deleteBucketResponse != nil {
		assert.Equal(
			204, deleteBucketResponse.StatusCode, "Status Code is incorrect")
	}

	// 3. Verify the bucket is gone by trying to put a tag
	tags := make(map[string]string)
	tags["tag1"] = "tag1"
	putBucketTagResponse, putBucketTagError := PutBucketsTags(
		"testdeletebucket1", tags)
	if putBucketTagError != nil {
		log.Println(putBucketTagError)
		assert.Fail("Error adding a tag to the bucket")
		return
	}
	finalResponse := inspectHTTPResponse(putBucketTagResponse)
	if putBucketTagResponse != nil {
		assert.Equal(
			500, putBucketTagResponse.StatusCode,
			finalResponse)
	}
	assert.True(
		strings.Contains(finalResponse, "The specified bucket does not exist"))
}

func TestBucketInformationSuccessfulResponse(t *testing.T) {
	/*
		Test Bucket Info End Point with a Successful Response.
	*/

	// 1. Create the bucket
	assert := assert.New(t)
	response, err := AddBucket("bucketinformation1", false, false, nil, nil)
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
	response, err := AddBucket("bucketinformation2", false, false, nil, nil)
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

func TestBucketRetention(t *testing.T) {
	/*
		To test bucket retention feature
	*/
	// 1. Create the bucket with 2 years validity retention
	assert := assert.New(t)
	/*
		{
			"name":"setbucketretention1",
			"versioning":true,
			"locking":true,
			"retention":
				{
					"mode":"compliance",
					"unit":"years",
					"validity":2
				}
		}
	*/
	retention := make(map[string]interface{})
	retention["mode"] = "compliance"
	retention["unit"] = "years"
	retention["validity"] = 2
	response, err := AddBucket("setbucketretention1", true, true, nil, retention)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Set the bucket's retention from 2 years to 3 years
	setBucketRetentionResponse, setBucketRetentionError := SetBucketRetention(
		"setbucketretention1",
		"compliance",
		"years",
		3,
	)
	assert.Nil(setBucketRetentionError)
	if setBucketRetentionError != nil {
		log.Println(setBucketRetentionError)
		assert.Fail("Error creating the bucket")
		return
	}
	if setBucketRetentionResponse != nil {
		assert.Equal(200, setBucketRetentionResponse.StatusCode,
			inspectHTTPResponse(setBucketRetentionResponse))
	}

	// 3. Verify the bucket's retention was properly set.
	getBucketRetentionResponse, getBucketRetentionError := GetBucketRetention(
		"setbucketretention1",
	)
	assert.Nil(getBucketRetentionError)
	if getBucketRetentionError != nil {
		log.Println(getBucketRetentionError)
		assert.Fail("Error creating the bucket")
		return
	}
	finalResponse := inspectHTTPResponse(getBucketRetentionResponse)
	if getBucketRetentionResponse != nil {
		assert.Equal(
			200,
			getBucketRetentionResponse.StatusCode,
			finalResponse,
		)
	}
	expected := "Http Response: {\"mode\":\"compliance\",\"unit\":\"years\",\"validity\":3}\n"
	assert.Equal(expected, finalResponse, finalResponse)
}

func TestPutObjectTag(t *testing.T) {
	/*
		Test to put a tag to an object
	*/

	// Vars
	assert := assert.New(t)
	bucketName := "testputobjecttagbucketone"
	fileName := "testputobjecttagbucketone.txt"
	path := encodeBase64(fileName)
	tags := make(map[string]string)
	tags["tag"] = "testputobjecttagbucketonetagone"
	versionID := "null"

	// 1. Create the bucket
	response, err := AddBucket(bucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Upload the object to the bucket
	uploadResponse, uploadError := UploadAnObject(bucketName, fileName)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			inspectHTTPResponse(uploadResponse),
		)
	}

	// 3. Put a tag to the object
	putTagResponse, putTagError := PutObjectTags(
		bucketName, path, tags, versionID)
	assert.Nil(putTagError)
	if putTagError != nil {
		log.Println(putTagError)
		return
	}
	putObjectTagresult := inspectHTTPResponse(putTagResponse)
	if putTagResponse != nil {
		assert.Equal(
			200, putTagResponse.StatusCode, putObjectTagresult)
	}

	// 4. Verify the object's tag is set
	listResponse, listError := ListObjects(bucketName, path, "false")
	assert.Nil(listError)
	if listError != nil {
		log.Println(listError)
		return
	}
	finalResponse := inspectHTTPResponse(listResponse)
	if listResponse != nil {
		assert.Equal(200, listResponse.StatusCode,
			finalResponse)
	}
	assert.True(
		strings.Contains(finalResponse, tags["tag"]),
		finalResponse)
}

func TestDeleteMultipleObjects(t *testing.T) {
	/*
	   Function to test the deletion of multiple objects from a given bucket.
	*/

	// Variables
	assert := assert.New(t)
	bucketName := "testdeletemultipleobjsbucket1"
	numberOfFiles := 5
	fileName := "testdeletemultipleobjs"

	// 1. Create a bucket for this particular test
	response, err := AddBucket(bucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Add couple of objects to this bucket
	for i := 1; i <= numberOfFiles; i++ {
		uploadResponse, uploadError := UploadAnObject(
			bucketName, fileName+strconv.Itoa(i)+".txt")
		assert.Nil(uploadError)
		if uploadError != nil {
			log.Println(uploadError)
			return
		}
		if uploadResponse != nil {
			assert.Equal(200, uploadResponse.StatusCode,
				inspectHTTPResponse(uploadResponse))
		}
	}

	// 3. Delete these objects
	for i := 1; i <= numberOfFiles; i++ {
		deleteResponse, deleteError := DeleteObject(
			bucketName, encodeBase64(
				fileName+strconv.Itoa(i)+".txt"), false, false)
		assert.Nil(deleteError)
		if deleteError != nil {
			log.Println(deleteError)
			return
		}
		if deleteResponse != nil {
			assert.Equal(200, deleteResponse.StatusCode,
				inspectHTTPResponse(deleteResponse))
		}
	}

	// 4. List the objects, empty list is expected!
	listResponse, listError := ListObjects(bucketName, "", "false")
	assert.Nil(listError)
	if listError != nil {
		log.Println(listError)
		return
	}
	finalResponse := inspectHTTPResponse(listResponse)
	if listResponse != nil {
		assert.Equal(200, listResponse.StatusCode,
			finalResponse)
	}

	// 5. Verify empty list is obtained as we deleted all the objects
	expected := "Http Response: {\"objects\":null}\n"
	assert.Equal(expected, finalResponse, finalResponse)
}

func TestDownloadObject(t *testing.T) {
	/*
	   Test to download an object from a given bucket.
	*/

	// Vars
	assert := assert.New(t)
	bucketName := "testdownloadobjbucketone"
	fileName := "testdownloadobjectfilenameone"
	path := encodeBase64(fileName)
	workingDirectory, getWdErr := os.Getwd()
	if getWdErr != nil {
		assert.Fail("Couldn't get the directory")
	}

	// 1. Create the bucket
	response, err := AddBucket(bucketName, true, true, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Upload an object to the bucket
	uploadResponse, uploadError := UploadAnObject(bucketName, fileName)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			inspectHTTPResponse(uploadResponse),
		)
	}

	// 3. Download the object from the bucket
	downloadResponse, downloadError := DownloadObject(bucketName, path)
	assert.Nil(downloadError)
	if downloadError != nil {
		log.Println(downloadError)
		assert.Fail("Error downloading the object")
		return
	}
	finalResponse := inspectHTTPResponse(downloadResponse)
	if downloadResponse != nil {
		assert.Equal(
			200,
			downloadResponse.StatusCode,
			finalResponse,
		)
	}

	// 4. Verify the file was downloaded
	files, err := ioutil.ReadDir(workingDirectory)
	if err != nil {
		log.Fatal(err)
	}
	for _, file := range files {
		fmt.Println(file.Name(), file.IsDir())
	}
	if _, err := os.Stat(workingDirectory); errors.Is(err, os.ErrNotExist) {
		// path/to/whatever does not exist
		assert.Fail("File wasn't downloaded")
	}
}

func TestUploadObjectToBucket(t *testing.T) {
	/*
		Function to test the upload of an object to a bucket.
	*/

	// Test's variables
	assert := assert.New(t)
	bucketName := "testuploadobjecttobucket1"
	fileName := "sample.txt"

	// 1. Create the bucket
	response, err := AddBucket(bucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Upload the object to the bucket
	uploadResponse, uploadError := UploadAnObject(bucketName, fileName)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}

	// 3. Verify the object was uploaded
	finalResponse := inspectHTTPResponse(uploadResponse)
	if uploadResponse != nil {
		assert.Equal(200, uploadResponse.StatusCode, finalResponse)
	}
}

func TestDeleteObject(t *testing.T) {
	/*
	   Test to delete an object from a given bucket.
	*/

	// Variables
	assert := assert.New(t)
	bucketName := "testdeleteobjectbucket1"
	fileName := "testdeleteobjectfile"
	path := "dGVzdGRlbGV0ZW9iamVjdGZpbGUxLnR4dA==" // fileName encoded base64
	numberOfFiles := 2

	// 1. Create bucket
	response, err := AddBucket(bucketName, true, true, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Add two objects to the bucket created.
	for i := 1; i <= numberOfFiles; i++ {
		uploadResponse, uploadError := UploadAnObject(
			bucketName, fileName+strconv.Itoa(i)+".txt")
		assert.Nil(uploadError)
		if uploadError != nil {
			log.Println(uploadError)
			return
		}
		if uploadResponse != nil {
			assert.Equal(200, uploadResponse.StatusCode,
				inspectHTTPResponse(uploadResponse))
		}
	}

	// 3. Delete only one object from the bucket.
	deleteResponse, deleteError := DeleteObject(bucketName, path, false, false)
	assert.Nil(deleteError)
	if deleteError != nil {
		log.Println(deleteError)
		return
	}
	if deleteResponse != nil {
		assert.Equal(200, deleteResponse.StatusCode,
			inspectHTTPResponse(deleteResponse))
	}

	// 4. List the objects in the bucket and make sure the object is gone
	listResponse, listError := ListObjects(bucketName, "", "false")
	assert.Nil(listError)
	if listError != nil {
		log.Println(listError)
		return
	}
	finalResponse := inspectHTTPResponse(listResponse)
	if listResponse != nil {
		assert.Equal(200, listResponse.StatusCode,
			finalResponse)
	}
	// Expected only one file: "testdeleteobjectfile2.txt"
	// "testdeleteobjectfile1.txt" should be gone by now.
	assert.True(
		strings.Contains(
			finalResponse,
			"testdeleteobjectfile2.txt"), finalResponse) // Still there
	assert.False(
		strings.Contains(
			finalResponse,
			"testdeleteobjectfile1.txt"), finalResponse) // Gone
}

func TestListObjects(t *testing.T) {
	/*
	   To test list objects end point.
	*/

	// Test's variables
	assert := assert.New(t)
	bucketName := "testlistobjecttobucket1"
	fileName := "testlistobjecttobucket1.txt"

	// 1. Create the bucket
	response, err := AddBucket(bucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Upload the object to the bucket
	uploadResponse, uploadError := UploadAnObject(bucketName, fileName)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	if uploadResponse != nil {
		assert.Equal(200, uploadResponse.StatusCode,
			inspectHTTPResponse(uploadResponse))
	}

	// 3. List the object
	listResponse, listError := ListObjects(bucketName, "", "false")
	assert.Nil(listError)
	if listError != nil {
		log.Println(listError)
		return
	}
	finalResponse := inspectHTTPResponse(listResponse)
	if listResponse != nil {
		assert.Equal(200, listResponse.StatusCode,
			finalResponse)
	}

	// 4. Verify the object was listed
	assert.True(
		strings.Contains(finalResponse, "testlistobjecttobucket1"),
		finalResponse)
}

func TestShareObjectOnURL(t *testing.T) {
	/*
		Test to share an object via URL
	*/

	// Vars
	assert := assert.New(t)
	bucketName := "testshareobjectonurl"
	fileName := "testshareobjectonurl.txt"
	validPrefix := encodeBase64(fileName)
	tags := make(map[string]string)
	tags["tag"] = "testputobjecttagbucketonetagone"
	versionID := "null"

	// 1. Create the bucket
	response, err := AddBucket(bucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Upload the object to the bucket
	uploadResponse, uploadError := UploadAnObject(bucketName, fileName)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			inspectHTTPResponse(uploadResponse),
		)
	}

	type args struct {
		prefix string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Share File with valid prefix",
			expectedStatus: 200,
			args: args{
				prefix: validPrefix,
			},
		},
		{
			name:           "Share file with invalid prefix",
			expectedStatus: 500,
			args: args{
				prefix: "invalidprefix",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			// 3. Share the object on a URL
			shareResponse, shareError := SharesAnObjectOnAUrl(bucketName, tt.args.prefix, versionID, "604800s")
			assert.Nil(shareError)
			if shareError != nil {
				log.Println(shareError)
				return
			}
			finalResponse := inspectHTTPResponse(shareResponse)
			if shareResponse != nil {
				assert.Equal(
					tt.expectedStatus,
					shareResponse.StatusCode,
					finalResponse,
				)
			}

		})
	}
}

func TestPutObjectsRetentionStatus(t *testing.T) {

	// Variables
	assert := assert.New(t)
	bucketName := "testputobjectslegalholdstatus"
	fileName := "testputobjectslegalholdstatus.txt"
	prefix := "dGVzdHB1dG9iamVjdHNsZWdhbGhvbGRzdGF0dXMudHh0" // encoded base64

	// 1. Create bucket
	response, err := AddBucket(bucketName, true, true, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Add object
	uploadResponse, uploadError := UploadAnObject(
		bucketName,
		fileName,
	)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	addObjRsp := inspectHTTPResponse(uploadResponse)
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			addObjRsp,
		)
	}

	// Get versionID
	listResponse, listError := ListObjects(bucketName, prefix, "true")
	fmt.Println(listError)
	bodyBytes, _ := ioutil.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err = json.Unmarshal(bodyBytes, &listObjs)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	validVersionID := listObjs.Objects[0].VersionID

	type args struct {
		versionID string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid VersionID when putting object's retention status",
			expectedStatus: 200,
			args: args{
				versionID: validVersionID,
			},
		},
		{
			name:           "Invalid VersionID when putting object's retention status",
			expectedStatus: 500,
			args: args{
				versionID: "*&^###Test1ThisMightBeInvalid555",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 3. Put Objects Legal Status
			putResponse, putError := PutObjectsRetentionStatus(
				bucketName,
				prefix,
				tt.args.versionID,
				"compliance",
				"2033-01-13T23:59:59Z",
				false,
			)
			if putError != nil {
				log.Println(putError)
				assert.Fail("Error creating the bucket")
			}
			if putResponse != nil {
				assert.Equal(
					tt.expectedStatus,
					putResponse.StatusCode,
					inspectHTTPResponse(putResponse),
				)
			}
		})
	}
}

func TestGetsTheMetadataOfAnObject(t *testing.T) {

	// Vars
	assert := assert.New(t)
	bucketName := "testgetsthemetadataofanobject"
	fileName := "testshareobjectonurl.txt"
	validPrefix := encodeBase64(fileName)
	tags := make(map[string]string)
	tags["tag"] = "testputobjecttagbucketonetagone"

	// 1. Create the bucket
	response, err := AddBucket(bucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, "Status Code is incorrect")
	}

	// 2. Upload the object to the bucket
	uploadResponse, uploadError := UploadAnObject(bucketName, fileName)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			inspectHTTPResponse(uploadResponse),
		)
	}

	type args struct {
		prefix string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Get metadata with valid prefix",
			expectedStatus: 200,
			args: args{
				prefix: validPrefix,
			},
		},
		{
			name:           "Get metadata with invalid prefix",
			expectedStatus: 500,
			args: args{
				prefix: "invalidprefix",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			// 3. Get the metadata from an object
			getRsp, getErr := GetsTheMetadataOfAnObject(
				bucketName, tt.args.prefix)
			assert.Nil(getErr)
			if getErr != nil {
				log.Println(getErr)
				return
			}
			if getRsp != nil {
				assert.Equal(
					tt.expectedStatus,
					getRsp.StatusCode,
					inspectHTTPResponse(getRsp),
				)
			}

		})
	}
}

func TestPutBucketsTags(t *testing.T) {
	// Focused test for "Put Bucket's tags" endpoint

	// 1. Create the bucket
	assert := assert.New(t)
	validBucketName := "testputbuckettags1"
	response, err := AddBucket(validBucketName, false, false, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	type args struct {
		bucketName string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Put a tag to a valid bucket",
			expectedStatus: 200,
			args: args{
				bucketName: validBucketName,
			},
		},
		{
			name:           "Put a tag to an invalid bucket",
			expectedStatus: 500,
			args: args{
				bucketName: "invalidbucketname",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			// 2. Add a tag to the bucket
			tags := make(map[string]string)
			tags["tag2"] = "tag2"
			putBucketTagResponse, putBucketTagError := PutBucketsTags(
				tt.args.bucketName, tags)
			if putBucketTagError != nil {
				log.Println(putBucketTagError)
				assert.Fail("Error creating the bucket")
				return
			}
			if putBucketTagResponse != nil {
				assert.Equal(
					tt.expectedStatus, putBucketTagResponse.StatusCode,
					inspectHTTPResponse(putBucketTagResponse))
			}

		})
	}
}

func TestRestoreObjectToASelectedVersion(t *testing.T) {

	// Variables
	assert := assert.New(t)
	bucketName := "testrestoreobjectstoselectedversion"
	fileName := "testrestoreobjectstoselectedversion.txt"
	validPrefix := encodeBase64(fileName)

	// 1. Create bucket
	response, err := AddBucket(bucketName, true, true, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Add object
	uploadResponse, uploadError := UploadAnObject(
		bucketName,
		fileName,
	)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	addObjRsp := inspectHTTPResponse(uploadResponse)
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			addObjRsp,
		)
	}

	// 3. Get versionID
	listResponse, listError := ListObjects(bucketName, validPrefix, "true")
	fmt.Println(listError)
	bodyBytes, _ := ioutil.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err = json.Unmarshal(bodyBytes, &listObjs)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	versionID := listObjs.Objects[0].VersionID

	type args struct {
		prefix string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid prefix when restoring object",
			expectedStatus: 200,
			args: args{
				prefix: validPrefix,
			},
		},
		{
			name:           "Invalid prefix when restoring object",
			expectedStatus: 500,
			args: args{
				prefix: "fakefile",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 4. Restore Object to a selected version
			restResp, restErr := RestoreObjectToASelectedVersion(
				bucketName,
				tt.args.prefix,
				versionID,
			)
			assert.Nil(restErr)
			if restErr != nil {
				log.Println(restErr)
				return
			}
			finalResponse := inspectHTTPResponse(restResp)
			if restResp != nil {
				assert.Equal(
					tt.expectedStatus,
					restResp.StatusCode,
					finalResponse,
				)
			}
		})
	}
}

func TestBucketSetPolicy(t *testing.T) {

	// Variables
	assert := assert.New(t)
	validBucketName := "testbucketsetpolicy"

	// 1. Create bucket
	response, err := AddBucket(validBucketName, true, true, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Set a bucket's policy using table driven tests
	type args struct {
		bucketName string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid bucket when setting a policy",
			expectedStatus: 200,
			args: args{
				bucketName: validBucketName,
			},
		},
		{
			name:           "Invalid bucket when setting a bucket",
			expectedStatus: 500,
			args: args{
				bucketName: "wlkjsdkalsjdklajsdlkajsdlkajsdlkajsdklajsdkljaslkdjaslkdj",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			// Set Policy
			restResp, restErr := BucketSetPolicy(
				tt.args.bucketName,
				"PUBLIC",
				"",
			)
			assert.Nil(restErr)
			if restErr != nil {
				log.Println(restErr)
				return
			}
			finalResponse := inspectHTTPResponse(restResp)
			if restResp != nil {
				assert.Equal(
					tt.expectedStatus,
					restResp.StatusCode,
					finalResponse,
				)
			}

		})
	}
}

func TestDeleteObjectsRetentionStatus(t *testing.T) {

	// Variables
	assert := assert.New(t)
	bucketName := "testdeleteobjectslegalholdstatus"
	fileName := "testdeleteobjectslegalholdstatus.txt"
	validPrefix := encodeBase64(fileName)

	// 1. Create bucket
	response, err := AddBucket(bucketName, true, true, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error creating the bucket")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 2. Add object
	uploadResponse, uploadError := UploadAnObject(
		bucketName,
		fileName,
	)
	assert.Nil(uploadError)
	if uploadError != nil {
		log.Println(uploadError)
		return
	}
	addObjRsp := inspectHTTPResponse(uploadResponse)
	if uploadResponse != nil {
		assert.Equal(
			200,
			uploadResponse.StatusCode,
			addObjRsp,
		)
	}

	// Get versionID
	listResponse, listError := ListObjects(bucketName, validPrefix, "true")
	fmt.Println(listError)
	bodyBytes, _ := ioutil.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err = json.Unmarshal(bodyBytes, &listObjs)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	versionID := listObjs.Objects[0].VersionID

	// 3. Put Objects Retention Status
	putResponse, putError := PutObjectsRetentionStatus(
		bucketName,
		validPrefix,
		versionID,
		"governance",
		"2033-01-11T23:59:59Z",
		false,
	)
	if putError != nil {
		log.Println(putError)
		assert.Fail("Error creating the bucket")
	}
	if putResponse != nil {
		assert.Equal(
			200,
			putResponse.StatusCode,
			inspectHTTPResponse(putResponse),
		)
	}

	type args struct {
		prefix string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid prefix when deleting object's retention status",
			expectedStatus: 200,
			args: args{
				prefix: validPrefix,
			},
		},
		{
			name:           "Invalid prefix when deleting object's retention status",
			expectedStatus: 500,
			args: args{
				prefix: "fakefile",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 4. Delete Objects Retention Status
			putResponse, putError := DeleteObjectsRetentionStatus(
				bucketName,
				tt.args.prefix,
				versionID,
			)
			if putError != nil {
				log.Println(putError)
				assert.Fail("Error creating the bucket")
			}
			if putResponse != nil {
				assert.Equal(
					tt.expectedStatus,
					putResponse.StatusCode,
					inspectHTTPResponse(putResponse),
				)
			}
		})
	}

}

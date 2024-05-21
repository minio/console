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

// These tests are for UserAPI Tag based on swagger-console.yml

package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"

	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/stretchr/testify/assert"
)

type AddBucketOps struct {
	Name       string
	Locking    bool
	Versioning map[string]interface{}
	Quota      map[string]interface{}
	Retention  map[string]interface{}
	Endpoint   *string
	UseToken   *string
}

func AddBucket(name string, locking bool, versioning, quota, retention map[string]interface{}) (*http.Response, error) {
	return AddBucketWithOpts(&AddBucketOps{
		Name:       name,
		Locking:    locking,
		Versioning: versioning,
		Quota:      quota,
		Retention:  retention,
		Endpoint:   nil,
	})
}

func AddBucketWithOpts(opts *AddBucketOps) (*http.Response, error) {
	/*
	   This is an atomic function that we can re-use to create a bucket on any
	   desired test.
	*/
	// Needed Parameters for API Call
	requestDataAdd := map[string]interface{}{
		"name":       opts.Name,
		"locking":    opts.Locking,
		"versioning": opts.Versioning,
		"quota":      opts.Quota,
		"retention":  opts.Retention,
	}

	endpoint := "http://localhost:9090/api/v1/buckets"
	if opts.Endpoint != nil {
		endpoint = fmt.Sprintf("%s/api/v1/buckets", *opts.Endpoint)
	}

	// Creating the Call by adding the URL and Headers
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest("POST", endpoint, requestDataBody)
	if err != nil {
		log.Println(err)
	}
	if opts.UseToken != nil {
		request.Header.Add("Cookie", fmt.Sprintf("token=%s", *opts.UseToken))
	} else {
		request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	}
	request.Header.Add("Content-Type", "application/json")

	// Performing the call
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func getTokenForEndpoint(endpoint string) string {
	var loginToken string
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

	request, err := http.NewRequest("POST", fmt.Sprintf("%s/api/v1/login", endpoint), requestDataBody)
	if err != nil {
		log.Println(err)
		return ""
	}

	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return ""
	}

	if response != nil {
		for _, cookie := range response.Cookies() {
			if cookie.Name == "token" {
				loginToken = cookie.Value
				break
			}
		}
	}
	return loginToken
}

func setupBucket(name string, locking bool, versioning, quota, retention map[string]interface{}, assert *assert.Assertions, expected int) bool {
	return setupBucketForEndpoint(name, locking, versioning, quota, retention, assert, expected, nil, nil)
}

func setupBucketForEndpoint(name string, locking bool, versioning, quota, retention map[string]interface{}, assert *assert.Assertions, expected int, endpoint, endpointToken *string) bool {
	/*
		The intention of this function is to return either true or false to
		reduce the code by performing the verification in one place only.
	*/
	// Verify if there is an error and return either true or false
	response, err := AddBucketWithOpts(&AddBucketOps{
		Name:       name,
		Locking:    locking,
		Versioning: versioning,
		Quota:      quota,
		Retention:  retention,
		Endpoint:   endpoint,
		UseToken:   endpointToken,
	})
	if err != nil {
		assert.Fail("Error adding the bucket")
		return false
	}
	if response != nil {
		if response.StatusCode >= 200 && response.StatusCode <= 299 {
			fmt.Println("setupBucketForEndpoint(): HTTP Status is in the 2xx range")
			return true
		}
		if response.StatusCode != expected {
			assert.Fail(inspectHTTPResponse(response))
			return false
		}
	}
	return true
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

func SetBucketRetention(bucketName, mode, unit string, validity int) (*http.Response, error) {
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

func PutObjectTags(bucketName, prefix string, tags map[string]string, versionID string) (*http.Response, error) {
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

func DeleteMultipleObjects(bucketName string, files []map[string]interface{}) (*http.Response, error) {
	/*
		Helper function to delete multiple objects in a container.
		POST: /buckets/{bucket_name}/delete-objects
		Example of the data being sent:
		[
			{
				"path": "testdeletemultipleobjs1.txt",
				"versionID": "",
				"recursive": false
			},
			{
				"path": "testdeletemultipleobjs2.txt",
				"versionID": "",
				"recursive": false
			},
		]
	*/
	requestDataJSON, _ := json.Marshal(files)
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

func DownloadObject(bucketName, path string) (*http.Response, error) {
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

func UploadAnObject(bucketName, fileName string) (*http.Response, error) {
	/*
		Helper function to upload a file to a bucket for testing.
		POST {{baseUrl}}/buckets/:bucket_name/objects/upload
	*/
	boundary := "WebKitFormBoundaryWtayBM7t9EUQb8q3"
	boundaryStart := "------" + boundary + "\r\n"
	contentDispositionOne := "Content-Disposition: form-data; name=\"2\"; "
	contentDispositionTwo := "filename=\"" + fileName + "\"\r\n"
	contentType := "Content-Type: text/plain\r\n\r\na\n\r\n"
	boundaryEnd := "------" + boundary + "--\r\n"
	file := boundaryStart + contentDispositionOne + contentDispositionTwo +
		contentType + boundaryEnd
	arrayOfBytes := []byte(file)
	requestDataBody := bytes.NewReader(arrayOfBytes)
	apiURL := "http://localhost:9090/api/v1/buckets/" + url.PathEscape(bucketName) + "/objects/upload" + "?prefix=" + url.QueryEscape(fileName)
	request, err := http.NewRequest(
		"POST",
		apiURL,
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

func DeleteObject(bucketName, path string, recursive, allVersions bool) (*http.Response, error) {
	/*
	   Helper function to delete an object from a given bucket.
	   DELETE:
	   {{baseUrl}}/buckets/bucketName/objects?path=Y2VzYXJpby50eHQ=&recursive=false&all_versions=false
	*/
	url := "http://localhost:9090/api/v1/buckets/" + url.PathEscape(bucketName) + "/objects?prefix=" +
		url.QueryEscape(path) + "&recursive=" + strconv.FormatBool(recursive) + "&all_versions=" +
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

func ListObjects(bucketName, prefix string, withVersions bool) (*http.Response, error) {
	/*
		Helper function to list objects in a bucket.
		GET: {{baseUrl}}/buckets/:bucket_name/objects
	*/
	request, err := http.NewRequest("GET",
		"http://localhost:9090/api/v1/buckets/"+url.PathEscape(bucketName)+"/objects?prefix="+url.QueryEscape(prefix)+"&with_versions="+strconv.FormatBool(withVersions),
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

func SharesAnObjectOnAUrl(bucketName, prefix, versionID, expires string) (*http.Response, error) {
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

func PutObjectsRetentionStatus(bucketName, prefix, versionID, mode, expires string, governanceBypass bool) (*http.Response, error) {
	requestDataAdd := map[string]interface{}{
		"mode":              mode,
		"expires":           expires,
		"governance_bypass": governanceBypass,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	apiURL := "http://localhost:9090/api/v1/buckets/" + bucketName + "/objects/retention?prefix=" + prefix + "&version_id=" + versionID

	request, err := http.NewRequest(
		"PUT",
		apiURL,
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

func GetsTheMetadataOfAnObject(bucketName, prefix string) (*http.Response, error) {
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

func RestoreObjectToASelectedVersion(bucketName, prefix, versionID string) (*http.Response, error) {
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

func BucketSetPolicy(bucketName, access, definition string) (*http.Response, error) {
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

func DeleteObjectsRetentionStatus(bucketName, prefix, versionID string) (*http.Response, error) {
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

func ListBucketEvents(bucketName string) (*http.Response, error) {
	/*
		Helper function to list bucket's events
		Name: List Bucket Events
		HTTP Verb: GET
		URL: {{baseUrl}}/buckets/:bucket_name/events
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/events",
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

func PutBucketQuota(bucketName string, enabled bool, quotaType string, amount int) (*http.Response, error) {
	/*
		Helper function to put bucket quota
		Name: Bucket Quota
		URL: {{baseUrl}}/buckets/:name/quota
		HTTP Verb: PUT
		Body:
		{
			"enabled": false,
			"quota_type": "fifo",
			"amount": 18462288
		}
	*/
	requestDataAdd := map[string]interface{}{
		"enabled":    enabled,
		"quota_type": quotaType,
		"amount":     amount,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/quota",
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

func GetBucketQuota(bucketName string) (*http.Response, error) {
	/*
		Helper function to get bucket quota
		Name: Get Bucket Quota
		URL: {{baseUrl}}/buckets/:name/quota
		HTTP Verb: GET
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/quota",
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

func PutObjectsLegalholdStatus(bucketName, prefix, status, versionID string) (*http.Response, error) {
	// Helper function to test "Put Object's legalhold status" end point
	requestDataAdd := map[string]interface{}{
		"status": status,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	apiURL := "http://localhost:9090/api/v1/buckets/" + bucketName + "/objects/legalhold?prefix=" + prefix + "&version_id=" + versionID
	request, err := http.NewRequest(
		"PUT",
		apiURL,
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

func TestPutObjectsLegalholdStatus(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "testputobjectslegalholdstatus"
	objName := "testputobjectslegalholdstatus.txt"
	objectNameEncoded := url.QueryEscape(objName)
	status := "enabled"

	// 1. Create bucket
	if !setupBucket(bucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
	}

	// 2. Add object
	uploadResponse, uploadError := UploadAnObject(
		bucketName,
		objName,
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
	listResponse, _ := ListObjects(bucketName, "", true)
	bodyBytes, _ := io.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err := json.Unmarshal(bodyBytes, &listObjs)
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
			name:           "Valid VersionID when putting object's legal hold status",
			expectedStatus: 200,
			args: args{
				versionID: validVersionID,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			// 3. Put Objects Legal Status
			putResponse, putError := PutObjectsLegalholdStatus(
				bucketName,
				objectNameEncoded,
				status,
				tt.args.versionID,
			)
			if putError != nil {
				log.Println(putError)
				assert.Fail("Error putting object's legal hold status")
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

func TestGetBucketQuota(t *testing.T) {
	// Variables
	assert := assert.New(t)
	validBucket := "testgetbucketquota"

	// 1. Create bucket
	if !setupBucket(validBucket, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
	}

	// 2. Put Bucket Quota
	restResp, restErr := PutBucketQuota(
		validBucket,
		true,          // enabled
		"hard",        // quotaType
		1099511627776, // amount
	)
	assert.Nil(restErr)
	if restErr != nil {
		log.Println(restErr)
		return
	}
	finalResponse := inspectHTTPResponse(restResp)
	if restResp != nil {
		assert.Equal(
			200,
			restResp.StatusCode,
			finalResponse,
		)
	}

	// 3. Get Bucket Quota
	type args struct {
		bucketName string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid bucket when getting quota",
			expectedStatus: 200,
			args: args{
				bucketName: validBucket,
			},
		},
		{
			name:           "Invalid bucket when getting quota",
			expectedStatus: 500,
			args: args{
				bucketName: "askdaklsjdkasjdklasjdklasjdklajsdklasjdklasjdlkas",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			restResp, restErr := GetBucketQuota(
				tt.args.bucketName,
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

func TestPutBucketQuota(t *testing.T) {
	// Variables
	assert := assert.New(t)
	validBucket := "testputbucketquota"

	// 1. Create bucket
	if !setupBucket(validBucket, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
	}

	// 2. Put Bucket Quota
	type args struct {
		bucketName string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid bucket when putting quota",
			expectedStatus: 200,
			args: args{
				bucketName: validBucket,
			},
		},
		{
			name:           "Invalid bucket when putting quota",
			expectedStatus: 500,
			args: args{
				bucketName: "lksdjakldjklajdlkasjdklasjdkljaskdljaslkdjalksjdklasjdklajsdlkajs",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			restResp, restErr := PutBucketQuota(
				tt.args.bucketName,
				true,          // enabled
				"hard",        // quotaType
				1099511627776, // amount
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

func TestListBucketEvents(t *testing.T) {
	// Variables
	assert := assert.New(t)
	validBucket := "testlistbucketevents"

	// 1. Create bucket
	if !setupBucket(validBucket, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
	}

	// 2. List bucket events
	type args struct {
		bucketName string
	}
	tests := []struct {
		name           string
		expectedStatus int
		args           args
	}{
		{
			name:           "Valid bucket when listing events",
			expectedStatus: 200,
			args: args{
				bucketName: validBucket,
			},
		},
		{
			name:           "Invalid bucket when listing events",
			expectedStatus: 500,
			args: args{
				bucketName: "alksdjalksdjklasjdklasjdlkasjdkljaslkdjaskldjaklsjd",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			restResp, restErr := ListBucketEvents(
				tt.args.bucketName,
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
	validPrefix := url.QueryEscape(fileName)

	// 1. Create bucket
	if !setupBucket(bucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
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
	listResponse, _ := ListObjects(bucketName, validPrefix, true)
	bodyBytes, _ := io.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err := json.Unmarshal(bodyBytes, &listObjs)
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
		assert.Fail("Error putting the object retention status")
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
		t.Run(tt.name, func(_ *testing.T) {
			// 4. Delete Objects Retention Status
			putResponse, putError := DeleteObjectsRetentionStatus(
				bucketName,
				tt.args.prefix,
				versionID,
			)
			if putError != nil {
				log.Println(putError)
				assert.Fail("Error deleting the object retention status")
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

func TestBucketSetPolicy(t *testing.T) {
	// Variables
	assert := assert.New(t)
	validBucketName := "testbucketsetpolicy"

	// 1. Create bucket
	if !setupBucket(validBucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
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
		t.Run(tt.name, func(_ *testing.T) {
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

func TestRestoreObjectToASelectedVersion(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "testrestoreobjectstoselectedversion"
	fileName := "testrestoreobjectstoselectedversion.txt"
	validPrefix := url.QueryEscape(fileName)

	// 1. Create bucket
	if !setupBucket(bucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
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
	listResponse, _ := ListObjects(bucketName, validPrefix, true)
	bodyBytes, _ := io.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err := json.Unmarshal(bodyBytes, &listObjs)
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
		t.Run(tt.name, func(_ *testing.T) {
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

func TestPutBucketsTags(t *testing.T) {
	// Focused test for "Put Bucket's tags" endpoint

	// 1. Create the bucket
	assert := assert.New(t)
	validBucketName := "testputbuckettags1"
	if !setupBucket(validBucketName, false, nil, nil, nil, assert, 200) {
		return
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
		t.Run(tt.name, func(_ *testing.T) {
			// 2. Add a tag to the bucket
			tags := make(map[string]string)
			tags["tag2"] = "tag2"
			putBucketTagResponse, putBucketTagError := PutBucketsTags(
				tt.args.bucketName, tags)
			if putBucketTagError != nil {
				log.Println(putBucketTagError)
				assert.Fail("Error putting the bucket's tags")
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

func TestGetsTheMetadataOfAnObject(t *testing.T) {
	// Vars
	assert := assert.New(t)
	bucketName := "testgetsthemetadataofanobject"
	fileName := "testshareobjectonurl.txt"
	validPrefix := url.QueryEscape(fileName)
	tags := make(map[string]string)
	tags["tag"] = "testputobjecttagbucketonetagone"

	// 1. Create the bucket
	if !setupBucket(bucketName, false, nil, nil, nil, assert, 200) {
		return
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
		t.Run(tt.name, func(_ *testing.T) {
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

func TestPutObjectsRetentionStatus(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "testputobjectsretentionstatus"
	fileName := "testputobjectsretentionstatus.txt"
	prefix := url.QueryEscape(fileName)

	// 1. Create bucket
	if !setupBucket(bucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
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
	listResponse, _ := ListObjects(bucketName, prefix, true)
	bodyBytes, _ := io.ReadAll(listResponse.Body)
	listObjs := models.ListObjectsResponse{}
	err := json.Unmarshal(bodyBytes, &listObjs)
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
				versionID: url.QueryEscape(validVersionID),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
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
				assert.Fail("Error putting the object's retention status")
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

func TestShareObjectOnURL(t *testing.T) {
	/*
		Test to share an object via URL
	*/

	// Vars
	assert := assert.New(t)
	bucketName := "testshareobjectonurl"
	fileName := "testshareobjectonurl.txt"
	validPrefix := url.QueryEscape(fileName)
	tags := make(map[string]string)
	tags["tag"] = "testputobjecttagbucketonetagone"
	versionID := "null"

	// 1. Create the bucket
	if !setupBucket(bucketName, false, nil, nil, nil, assert, 200) {
		return
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
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
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

func TestListObjects(t *testing.T) {
	/*
	   To test list objects end point.
	*/

	// Test's variables
	assert := assert.New(t)
	bucketName := "testlistobjecttobucket1"
	fileName := "testlistobjecttobucket1.txt"

	// 1. Create the bucket
	if !setupBucket(bucketName, false, nil, nil, nil, assert, 200) {
		return
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
	listResponse, listError := ListObjects(bucketName, "", false)
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

func TestDeleteObject(t *testing.T) {
	/*
	   Test to delete an object from a given bucket.
	*/

	// Variables
	assert := assert.New(t)
	bucketName := "testdeleteobjectbucket1"
	fileName := "testdeleteobjectfile"
	numberOfFiles := 2

	// 1. Create bucket
	if !setupBucket(bucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
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

	objPathFull := fileName + "1.txt" // would be encoded in DeleteObject util method.
	// 3. Delete only one object from the bucket.
	deleteResponse, deleteError := DeleteObject(bucketName, objPathFull, false, false)
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
	listResponse, listError := ListObjects(bucketName, "", false)
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

func TestUploadObjectToBucket(t *testing.T) {
	/*
		Function to test the upload of an object to a bucket.
	*/

	// Test's variables
	assert := assert.New(t)
	bucketName := "testuploadobjecttobucket1"
	fileName := "sample.txt"

	// 1. Create the bucket
	if !setupBucket(bucketName, false, nil, nil, nil, assert, 200) {
		return
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

func TestDownloadObject(t *testing.T) {
	/*
	   Test to download an object from a given bucket.
	*/

	// Vars
	assert := assert.New(t)
	bucketName := "testdownloadobjbucketone"
	fileName := "testdownloadobjectfilenameone"
	path := url.QueryEscape(fileName)
	workingDirectory, getWdErr := os.Getwd()
	if getWdErr != nil {
		assert.Fail("Couldn't get the directory")
	}

	// 1. Create the bucket
	if !setupBucket(bucketName, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
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
	files, err := os.ReadDir(workingDirectory)
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
	if !setupBucket(bucketName, false, nil, nil, nil, assert, 200) {
		return
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

	// Prepare the files for deletion
	files := make([]map[string]interface{}, numberOfFiles)
	for i := 1; i <= numberOfFiles; i++ {
		files[i-1] = map[string]interface{}{
			"path":      fileName + strconv.Itoa(i) + ".txt",
			"versionID": "",
			"recursive": false,
		}
	}

	// 3. Delete these objects all at once
	deleteResponse, deleteError := DeleteMultipleObjects(
		bucketName,
		files,
	)
	assert.Nil(deleteError)
	if deleteError != nil {
		log.Println(deleteError)
		return
	}
	if deleteResponse != nil {
		assert.Equal(200, deleteResponse.StatusCode,
			inspectHTTPResponse(deleteResponse))
	}

	// 4. List the objects, empty list is expected!
	listResponse, listError := ListObjects(bucketName, "", false)
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

func TestPutObjectTag(t *testing.T) {
	/*
		Test to put a tag to an object
	*/

	// Vars
	assert := assert.New(t)
	bucketName := "testputobjecttagbucketone"
	fileName := "testputobjecttagbucketone.txt"
	path := url.QueryEscape(fileName)
	tags := make(map[string]string)
	tags["tag"] = "testputobjecttagbucketonetagone"
	versionID := "null"

	// 1. Create the bucket
	if !setupBucket(bucketName, false, nil, nil, nil, assert, 200) {
		return
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
	listResponse, listError := ListObjects(bucketName, path, false)
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
	if !setupBucket("setbucketretention1", true, map[string]interface{}{"enabled": true}, nil, retention, assert, 200) {
		return
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
		assert.Fail("Error setting the bucket retention")
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
		assert.Fail("Error getting the bucket's retention")
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

func TestBucketInformationGenericErrorResponse(t *testing.T) {
	/*
		Test Bucket Info End Point with a Generic Error Response.
	*/

	// 1. Create the bucket
	assert := assert.New(t)
	if !setupBucket("bucketinformation2", false, nil, nil, nil, assert, 200) {
		return
	}

	// 2. Add a tag to the bucket
	tags := make(map[string]string)
	tags["tag2"] = "tag2"
	putBucketTagResponse, putBucketTagError := PutBucketsTags(
		"bucketinformation2", tags)
	if putBucketTagError != nil {
		log.Println(putBucketTagError)
		assert.Fail("Error putting the bucket's tags")
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

func TestBucketInformationSuccessfulResponse(t *testing.T) {
	/*
		Test Bucket Info End Point with a Successful Response.
	*/

	// 1. Create the bucket
	assert := assert.New(t)
	if !setupBucket("bucketinformation1", false, nil, nil, nil, assert, 200) {
		return
	}

	// 2. Add a tag to the bucket
	tags := make(map[string]string)
	tags["tag1"] = "tag1"
	putBucketTagResponse, putBucketTagError := PutBucketsTags(
		"bucketinformation1", tags)
	if putBucketTagError != nil {
		log.Println(putBucketTagError)
		assert.Fail("Error putting the bucket's tags")
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
	fmt.Println(debugResponse)

	// 4. Verify the information
	assert.True(
		strings.Contains(debugResponse, "bucketinformation1"),
		inspectHTTPResponse(bucketInfoResponse))
	assert.True(
		strings.Contains(debugResponse, "tag1"),
		inspectHTTPResponse(bucketInfoResponse))
}

func TestDeleteBucket(t *testing.T) {
	/*
		Test to delete a bucket
	*/
	assert := assert.New(t)
	type args struct {
		bucketName       string
		createBucketName string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
	}{
		{
			name:           "Delete a bucket",
			expectedStatus: 204,
			args: args{
				bucketName:       "testdeletebucket1",
				createBucketName: "testdeletebucket1",
			},
		}, {
			name:           "Delete invalid bucket",
			expectedStatus: 404,
			args: args{
				bucketName:       "nonexistingbucket",
				createBucketName: "",
			},
		},
	}

	// Initialize minio client object.
	minioClient, err := minio.New("localhost:9000", &minio.Options{
		Creds:  credentials.NewStaticV4("minioadmin", "minioadmin", ""),
		Secure: false,
	})
	if err != nil {
		log.Fatalln(err)
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			// Create bucket if needed for the test
			if tt.args.createBucketName != "" {
				if err := minioClient.MakeBucket(context.Background(), tt.args.createBucketName, minio.MakeBucketOptions{}); err != nil {
					assert.Failf("Failed to create bucket", "Could not create bucket %s: %v", tt.args.createBucketName, err)
				}
			}

			// Delete the bucket
			deleteBucketResponse, deleteBucketError := DeleteBucket(tt.args.bucketName)
			assert.Nil(deleteBucketError)
			if deleteBucketResponse != nil {
				assert.Equal(
					tt.expectedStatus, deleteBucketResponse.StatusCode, "Status Code is incorrect")
			}
		})
	}
}

func TestListBuckets(t *testing.T) {
	/*
		Test the list of buckets without query parameters.
	*/

	assert := assert.New(t)

	// 1. Create buckets
	numberOfBuckets := 3
	for i := 1; i <= numberOfBuckets; i++ {
		if !setupBucket("testlistbuckets"+strconv.Itoa(i), false, nil, nil, nil, assert, 200) {
			return
		}
	}

	// Waiting to retrieve the new list of buckets
	time.Sleep(3 * time.Second)

	// 2. List buckets
	listBucketsResponse, listBucketsError := ListBuckets()
	assert.Nil(listBucketsError)
	assert.NotNil(listBucketsResponse)
	assert.NotNil(listBucketsResponse.Body)
	// 3. Verify list of buckets
	b, _ := io.ReadAll(listBucketsResponse.Body)
	assert.Equal(200, listBucketsResponse.StatusCode,
		"Status Code is incorrect: "+string(b))
	for i := 1; i <= numberOfBuckets; i++ {
		assert.True(strings.Contains(string(b),
			"testlistbuckets"+strconv.Itoa(i)))
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
		bodyBytes, _ := io.ReadAll(response.Body)

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

		bodyBytes, _ := io.ReadAll(response.Body)

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

	if !setupBucket("test2", true, nil, nil, nil, assert, 200) {
		return
	}

	// Read the HTTP Response and make sure we get: {"is_versioned":true}
	getVersioningResult, getVersioningError := GetBucketVersioning("test2")
	assert.Nil(getVersioningError)
	if getVersioningError != nil {
		log.Println(getVersioningError)
		return
	}
	if getVersioningResult != nil {
		assert.Equal(
			200, getVersioningResult.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ := io.ReadAll(getVersioningResult.Body)
	structBucketRepl := models.BucketVersioningResponse{
		ExcludeFolders:   false,
		ExcludedPrefixes: nil,
		MFADelete:        "",
		Status:           "",
	}
	err = json.Unmarshal(bodyBytes, &structBucketRepl)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	assert.Equal(
		structBucketRepl.Status,
		"Enabled",
		structBucketRepl.Status,
	)

	fmt.Println("Versioned bucket creation test status:", response.Status)
	if distributedSystem {
		assert.Equal(200, response.StatusCode, "Versioning test Status Code is incorrect - bucket failed to create")
	} else {
		assert.NotEqual(200, response.StatusCode, "Versioning test Status Code is incorrect -  versioned bucket created on non-distributed system")
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

func TestSetBucketTags(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	// put bucket
	if !setupBucket("test4", false, nil, nil, nil, assert, 200) {
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

	_, err = client.Do(request)
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

	response, err := client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	bodyBytes, _ := io.ReadAll(response.Body)

	bucket := models.Bucket{}
	err = json.Unmarshal(bodyBytes, &bucket)
	if err != nil {
		log.Println(err)
	}

	assert.Equal("TAG", bucket.Details.Tags["test"], "Failed to add tag")
}

func TestGetBucket(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	if !setupBucket("test3", false, nil, nil, nil, assert, 200) {
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

	response, err := client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		assert.Equal(200, response.StatusCode, "Status Code is incorrect")
	}
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
			expectedStatus: 200,
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
		t.Run(tt.name, func(_ *testing.T) {
			if !setupBucket(tt.args.bucketName, false, nil, nil, nil, assert, tt.expectedStatus) {
				return
			}
		})
	}
}

func CreateBucketEvent(bucketName string, ignoreExisting bool, arn, prefix, suffix string, events []string) (*http.Response, error) {
	/*
		Helper function to create bucket event
		POST: /buckets/{bucket_name}/events
		{
			"configuration":
				{
					"arn":"arn:minio:sqs::_:postgresql",
					"events":["put"],
					"prefix":"",
					"suffix":""
				},
			"ignoreExisting":true
		}
	*/
	configuration := map[string]interface{}{
		"arn":    arn,
		"events": events,
		"prefix": prefix,
		"suffix": suffix,
	}
	requestDataAdd := map[string]interface{}{
		"configuration":  configuration,
		"ignoreExisting": ignoreExisting,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/events",
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

func DeleteBucketEvent(bucketName, arn string, events []string, prefix, suffix string) (*http.Response, error) {
	/*
		Helper function to test Delete Bucket Event
		DELETE: /buckets/{bucket_name}/events/{arn}
		{
			"events":["put"],
			"prefix":"",
			"suffix":""
		}
	*/
	requestDataAdd := map[string]interface{}{
		"events": events,
		"prefix": prefix,
		"suffix": suffix,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"DELETE",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/events/"+arn,
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

func TestDeleteBucketEvent(t *testing.T) {
	// Variables
	assert := assert.New(t)

	// 1. Add postgres notification
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

	// 2. Restart the system
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

	// 3. Subscribe bucket to event
	events := make([]string, 1)
	events[0] = "put"
	eventResponse, eventError := CreateBucketEvent(
		"testputobjectslegalholdstatus", // bucket name
		true,                            // ignore existing param
		"arn:minio:sqs::_:postgresql",   // arn
		"",                              // prefix
		"",                              // suffix
		events,                          // events
	)
	assert.Nil(eventError)
	if eventError != nil {
		log.Println(eventError)
		return
	}
	finalResponseEvent := inspectHTTPResponse(eventResponse)
	if eventResponse != nil {
		assert.Equal(
			201,
			eventResponse.StatusCode,
			finalResponseEvent,
		)
	}

	// 4. Delete Bucket Event
	events[0] = "put"
	deletEventResponse, deventError := DeleteBucketEvent(
		"testputobjectslegalholdstatus", // bucket name
		"arn:minio:sqs::_:postgresql",   // arn
		events,                          // events
		"",                              // prefix
		"",                              // suffix
	)
	assert.Nil(deventError)
	if deventError != nil {
		log.Println(deventError)
		return
	}
	efinalResponseEvent := inspectHTTPResponse(deletEventResponse)
	if deletEventResponse != nil {
		assert.Equal(
			204,
			deletEventResponse.StatusCode,
			efinalResponseEvent,
		)
	}
}

func SetMultiBucketReplication(accessKey, secretKey, targetURL, region, originBucket, destinationBucket, syncMode string, bandwidth, healthCheckPeriod int, prefix, tags string, replicateDeleteMarkers, replicateDeletes bool, priority int, storageClass string, replicateMetadata bool) (*http.Response, error) {
	/*
		Helper function
		URL: /buckets-replication
		HTTP Verb: POST
		Body:
		{
			"accessKey":"Q3AM3UQ867SPQQA43P2F",
			"secretKey":"zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
			"targetURL":"https://play.min.io",
			"region":"",
			"bucketsRelation":[
				{
					"originBucket":"test",
					"destinationBucket":"versioningenabled"
				}
			],
			"syncMode":"async",
			"bandwidth":107374182400,
			"healthCheckPeriod":60,
			"prefix":"",
			"tags":"",
			"replicateDeleteMarkers":true,
			"replicateDeletes":true,
			"priority":1,
			"storageClass":"",
			"replicateMetadata":true
		}
	*/
	bucketsRelationArray := make([]map[string]interface{}, 1)
	bucketsRelationIndex0 := map[string]interface{}{
		"originBucket":      originBucket,
		"destinationBucket": destinationBucket,
	}
	bucketsRelationArray[0] = bucketsRelationIndex0
	requestDataAdd := map[string]interface{}{
		"accessKey":              accessKey,
		"secretKey":              secretKey,
		"targetURL":              targetURL,
		"region":                 region,
		"bucketsRelation":        bucketsRelationArray,
		"syncMode":               syncMode,
		"bandwidth":              bandwidth,
		"healthCheckPeriod":      healthCheckPeriod,
		"prefix":                 prefix,
		"tags":                   tags,
		"replicateDeleteMarkers": replicateDeleteMarkers,
		"replicateDeletes":       replicateDeletes,
		"priority":               priority,
		"storageClass":           storageClass,
		"replicateMetadata":      replicateMetadata,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/buckets-replication",
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

func GetBucketReplication(bucketName string) (*http.Response, error) {
	/*
		URL: /buckets/{bucket_name}/replication
		HTTP Verb: GET
	*/
	request, err := http.NewRequest("GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/replication",
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

func DeletesAllReplicationRulesOnABucket(bucketName string) (*http.Response, error) {
	/*
		Helper function to delete all replication rules in a bucket
		URL: /buckets/{bucket_name}/delete-all-replication-rules
		HTTP Verb: DELETE
	*/
	request, err := http.NewRequest(
		"DELETE",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/delete-all-replication-rules",
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

func DeleteMultipleReplicationRules(bucketName string, rules []string) (*http.Response, error) {
	/*
		Helper function to delete multiple replication rules in a bucket
		URL: /buckets/{bucket_name}/delete-multiple-replication-rules
		HTTP Verb: DELETE
	*/
	body := map[string]interface{}{
		"rules": rules,
	}
	requestDataJSON, _ := json.Marshal(body)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"DELETE",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/delete-selected-replication-rules",
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

func DeleteBucketReplicationRule(bucketName, ruleID string) (*http.Response, error) {
	/*
		Helper function to delete a bucket's replication rule
		URL: /buckets/{bucket_name}/replication/{rule_id}
		HTTP Verb: DELETE
	*/
	request, err := http.NewRequest(
		"DELETE",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/replication/"+ruleID,
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

func TestReplication(t *testing.T) {
	// Vars
	assert := assert.New(t)
	originBucket := "testputobjectslegalholdstatus"
	destinationBuckets := []string{"testgetbucketquota", "testputbucketquota", "testlistbucketevents"} // an array of strings to iterate over

	// 1. Set replication rules with DIFFERENT PRIORITY <------- NOT SAME BUT DIFFERENT! 1, 2, etc.
	for index, destinationBucket := range destinationBuckets {
		response, err := SetMultiBucketReplication(
			"minioadmin",             // accessKey string
			"minioadmin",             // secretKey string
			"http://localhost:9000/", // targetURL string
			"",                       // region string
			originBucket,             // originBucket string
			destinationBucket,        // destinationBucket string
			"async",                  // syncMode string
			107374182400,             // bandwidth int
			60,                       // healthCheckPeriod int
			"",                       // prefix string
			"",                       // tags string
			true,                     // replicateDeleteMarkers bool
			true,                     // replicateDeletes bool
			index+1,                  // priority int
			"",                       // storageClass string
			true,                     // replicateMetadata bool
		)
		assert.Nil(err)
		if err != nil {
			log.Println(err)
			return
		}
		finalResponse := inspectHTTPResponse(response)
		if response != nil {
			assert.Equal(200, response.StatusCode, finalResponse)
		}

	}

	// 2. Get replication, at this point four rules are expected
	response, err := GetBucketReplication(originBucket)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(200, response.StatusCode, "error invalid status")
	}

	// 3. Get rule ID and status from response's body
	bodyBytes, _ := io.ReadAll(response.Body)
	structBucketRepl := models.BucketReplicationResponse{}
	err = json.Unmarshal(bodyBytes, &structBucketRepl)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}

	assert.Greater(len(structBucketRepl.Rules), 0, "Number of expected rules is 0")
	if len(structBucketRepl.Rules) == 0 || len(structBucketRepl.Rules) < 3 {
		return
	}
	// 4. Verify rules are enabled
	for index := 0; index < 3; index++ {
		Status := structBucketRepl.Rules[index].Status
		assert.Equal(Status, "Enabled")
	}

	// 5. Delete 3rd and 4th rules with endpoint for multiple rules:
	// /buckets/{bucket_name}/replication/{rule_id}
	ruleIDs := []string{structBucketRepl.Rules[2].ID} // To delete 3rd rule with the multi delete function
	response, err = DeleteMultipleReplicationRules(
		originBucket,
		ruleIDs,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	finalResponse := inspectHTTPResponse(response)
	if response != nil {
		assert.Equal(204, response.StatusCode, finalResponse)
	}

	// 6. Delete 2nd rule only with dedicated end point for single rules:
	// /buckets/{bucket_name}/replication/{rule_id}
	ruleID := structBucketRepl.Rules[1].ID // To delete 2nd rule in a single way
	response, err = DeleteBucketReplicationRule(
		originBucket,
		ruleID,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	finalResponse = inspectHTTPResponse(response)
	if response != nil {
		// https://github.com/minio/minio/pull/14972
		// Disallow deletion of arn when active replication config
		// 204 is no longer expected but 500
		assert.Equal(500, response.StatusCode, finalResponse)
	}

	// 7. Delete remaining Bucket Replication Rule with generic end point:
	// /buckets/{bucket_name}/delete-all-replication-rules
	response, err = DeletesAllReplicationRulesOnABucket(
		originBucket,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	finalResponse = inspectHTTPResponse(response)
	if response != nil {
		assert.Equal(204, response.StatusCode, finalResponse)
	}

	// 8. Get replication, at this point zero rules are expected
	response, err = GetBucketReplication(originBucket)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(200, response.StatusCode, "error invalid status")
	}

	// 9. Get rule ID and status from response's body
	bodyBytes, _ = io.ReadAll(response.Body)
	structBucketRepl = models.BucketReplicationResponse{}
	err = json.Unmarshal(bodyBytes, &structBucketRepl)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	expected := 0
	actual := len(structBucketRepl.Rules)
	assert.Equal(expected, actual, "Delete failed")
}

func GetBucketVersioning(bucketName string) (*http.Response, error) {
	/*
		Helper function to get bucket's versioning
	*/
	endPoint := "versioning"
	return BaseGetFunction(bucketName, endPoint)
}

func ReturnsTheStatusOfObjectLockingSupportOnTheBucket(bucketName string) (*http.Response, error) {
	/*
		Helper function to test end point below:
		URL: /buckets/{bucket_name}/object-locking:
		HTTP Verb: GET
	*/
	endPoint := "object-locking"
	return BaseGetFunction(bucketName, endPoint)
}

func BaseGetFunction(bucketName, endPoint string) (*http.Response, error) {
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/"+endPoint, nil)
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

func TestReturnsTheStatusOfObjectLockingSupportOnTheBucket(t *testing.T) {
	// Test for end point: /buckets/{bucket_name}/object-locking

	// Vars
	assert := assert.New(t)
	bucketName := "testputobjectslegalholdstatus"

	// 1. Get the status
	response, err := ReturnsTheStatusOfObjectLockingSupportOnTheBucket(
		bucketName,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if response != nil {
		assert.Equal(200, response.StatusCode, "error invalid status")
	}

	// 2. Verify the status to be enabled for this bucket
	bodyBytes, _ := io.ReadAll(response.Body)
	structBucketLocking := models.BucketObLockingResponse{}
	err = json.Unmarshal(bodyBytes, &structBucketLocking)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	assert.Equal(
		structBucketLocking.ObjectLockingEnabled,
		true,
		structBucketLocking,
	)
}

func SetBucketVersioning(bucketName string, versioning map[string]interface{}, endpoint, useToken *string) (*http.Response, error) {
	/*
		Helper function to set Bucket Versioning
	*/
	requestDataAdd := map[string]interface{}{
		"versioning": versioning,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	endpointURL := fmt.Sprintf("http://localhost:9090/api/v1/buckets/%s/versioning", bucketName)
	if endpoint != nil {
		endpointURL = fmt.Sprintf("%s/api/v1/buckets/%s/versioning", *endpoint, bucketName)
	}
	request, err := http.NewRequest("PUT",
		endpointURL,
		requestDataBody)
	if err != nil {
		log.Println(err)
	}
	if useToken != nil {
		request.Header.Add("Cookie", fmt.Sprintf("token=%s", *useToken))
	} else {
		request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	}
	request.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func TestSetBucketVersioning(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucket := "test-set-bucket-versioning"
	locking := false
	versioning := map[string]interface{}{"enabled": true}

	// 1. Create bucket with versioning as true and locking as false
	if !setupBucket(bucket, locking, versioning, nil, nil, assert, 200) {
		return
	}

	// 2. Set versioning as False i.e Suspend versioning
	response, err := SetBucketVersioning(bucket, map[string]interface{}{"enabled": false}, nil, nil)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		assert.Fail("Error setting the bucket versioning")
		return
	}
	if response != nil {
		assert.Equal(201, response.StatusCode, inspectHTTPResponse(response))
	}

	// 3. Read the HTTP Response and make sure is disabled.
	getVersioningResult, getVersioningError := GetBucketVersioning(bucket)
	assert.Nil(getVersioningError)
	if getVersioningError != nil {
		log.Println(getVersioningError)
		return
	}
	if getVersioningResult != nil {
		assert.Equal(
			200, getVersioningResult.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ := io.ReadAll(getVersioningResult.Body)
	result := models.BucketVersioningResponse{
		ExcludeFolders:   false,
		ExcludedPrefixes: nil,
		MFADelete:        "",
		Status:           "",
	}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	assert.Equal("Suspended", result.Status, result)
}

func EnableBucketEncryption(bucketName, encType, kmsKeyID string) (*http.Response, error) {
	// Helper function to enable bucket encryption
	// HTTP Verb: POST
	// URL: /buckets/{bucket_name}/encryption/enable
	// Body:
	// {
	// 	"encType":"sse-s3",
	// 	"kmsKeyID":""
	// }
	requestDataAdd := map[string]interface{}{
		"encType":  encType,
		"kmsKeyID": kmsKeyID,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST", "http://localhost:9090/api/v1/buckets/"+bucketName+"/encryption/enable", requestDataBody)
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

func TestEnableBucketEncryption(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "test-enable-bucket-encryption"
	locking := false
	encType := "sse-s3"
	kmsKeyID := ""

	// 1. Add bucket
	if !setupBucket(bucketName, locking, nil, nil, nil, assert, 200) {
		return
	}

	// 2. Enable Bucket's Encryption
	resp, err := EnableBucketEncryption(bucketName, encType, kmsKeyID)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}

	// 3. Get Bucket Encryption Information to verify it got encrypted.
	resp, err = GetBucketEncryptionInformation(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ := io.ReadAll(resp.Body)
	result := models.BucketEncryptionInfo{}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	assert.Equal("AES256", result.Algorithm, result)

	// 4. Disable Bucket's Encryption
	resp, err = DisableBucketEncryption(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}

	// 5. Verify encryption got disabled.
	resp, err = GetBucketEncryptionInformation(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			404, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ = io.ReadAll(resp.Body)
	result2 := models.APIError{}
	err = json.Unmarshal(bodyBytes, &result2)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	dereferencedPointerDetailedMessage := result2.DetailedMessage
	assert.Equal("error server side encryption configuration not found", dereferencedPointerDetailedMessage, dereferencedPointerDetailedMessage)
}

func GetBucketEncryptionInformation(bucketName string) (*http.Response, error) {
	/*
		Helper function to get bucket encryption information
		HTTP Verb: GET
		URL: api/v1/buckets/<bucket-name>/encryption/info
		Response: {"algorithm":"AES256"}
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/buckets/"+bucketName+"/encryption/info", nil)
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

func DisableBucketEncryption(bucketName string) (*http.Response, error) {
	/*
		Helper function to disable bucket's encryption
		HTTP Verb: POST
		URL: /buckets/{bucket_name}/encryption/disable
	*/
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/encryption/disable",
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

func UpdateLifecycleRule(bucketName, ltype string, disable bool, prefix, tags string, expiredObjectDeleteMarker bool, expiryDays, noncurrentversionExpirationDays int64, lifecycleID string) (*http.Response, error) {
	// Helper function to update lifecycle rule
	// HTTP Verb: PUT
	// URL: /buckets/{bucket_name}/lifecycle/{lifecycle_id}
	// Body Example:
	// {
	// 	"type":"expiry",
	// 	"disable":false,
	// 	"prefix":"",
	// 	"tags":"",
	// 	"expired_object_delete_marker":false,
	// 	"expiry_days":2,
	// 	"noncurrentversion_expiration_days":0
	// }

	requestDataAdd := map[string]interface{}{
		"type":                              ltype,
		"disable":                           disable,
		"prefix":                            prefix,
		"tags":                              tags,
		"expired_object_delete_marker":      expiredObjectDeleteMarker,
		"expiry_days":                       expiryDays,
		"noncurrentversion_expiration_days": noncurrentversionExpirationDays,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest("PUT",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/lifecycle/"+lifecycleID,
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

func GetBucketLifeCycle(bucketName string) (*http.Response, error) {
	// Get Bucket Lifecycle
	// HTTP Verb: GET
	// URL: /buckets/{bucket_name}/lifecycle
	// Response Example:
	// {
	// 	"lifecycle": [
	// 		{
	// 			"expiration": {
	// 				"date": "0001-01-01T00:00:00Z",
	// 				"days": 1
	// 			},
	// 			"id": "c8nmpte49b3m6uu3pac0",
	// 			"status": "Enabled",
	// 			"tags": null,
	// 			"transition": {
	// 				"date": "0001-01-01T00:00:00Z"
	// 			}
	// 		}
	// 	]
	// }
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/buckets/"+bucketName+"/lifecycle", nil)
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

func AddBucketLifecycle(bucketName, ltype, prefix, tags string, expiredObjectDeleteMarker bool, expiryDays, noncurrentversionExpirationDays int64) (*http.Response, error) {
	// Helper function to add bucket lifecycle
	// URL: /buckets/{bucket_name}/lifecycle
	// HTTP Verb: POST
	// Body Example:
	// {
	// 	"type":"expiry",
	// 	"prefix":"",
	// 	"tags":"",
	// 	"expired_object_delete_marker":false,
	// 	"expiry_days":1,
	// 	"noncurrentversion_expiration_days":null
	// }
	// Needed Parameters for API Call
	requestDataAdd := map[string]interface{}{
		"type":                              ltype,
		"prefix":                            prefix,
		"tags":                              tags,
		"expired_object_delete_marker":      expiredObjectDeleteMarker,
		"expiry_days":                       expiryDays,
		"noncurrentversion_expiration_days": noncurrentversionExpirationDays,
	}

	// Creating the Call by adding the URL and Headers
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/lifecycle",
		requestDataBody,
	)
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

func DeleteLifecycleRule(bucketName, lifecycleID string) (*http.Response, error) {
	// Helper function to delete lifecycle rule
	// HTTP Verb: DELETE
	// URL: /buckets/{bucket_name}/lifecycle/{lifecycle_id}
	request, err := http.NewRequest(
		"DELETE", "http://localhost:9090/api/v1/buckets/"+bucketName+"/lifecycle/"+lifecycleID, nil)
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

func TestBucketLifeCycle(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "test-bucket-life-cycle"
	locking := false
	ltype := "expiry"
	prefix := ""
	tags := ""
	var expiryDays int64 = 1
	var expiryDays2 int64 = 2
	disable := false
	expiredObjectDeleteMarker := false
	var noncurrentversionExpirationDays int64

	// 1. Add bucket
	if !setupBucket(bucketName, locking, nil, nil, nil, assert, 200) {
		return
	}

	// 2. Add Bucket Lifecycle
	resp, err := AddBucketLifecycle(
		bucketName,
		ltype,
		prefix,
		tags,
		expiredObjectDeleteMarker,
		expiryDays,
		noncurrentversionExpirationDays,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			201, resp.StatusCode, "Status Code is incorrect")
	}

	// 3. Get Bucket LifeCycle
	resp, err = GetBucketLifeCycle(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ := io.ReadAll(resp.Body)
	result := models.BucketLifecycleResponse{}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	Status := &result.Lifecycle[0].Status
	Days := &result.Lifecycle[0].Expiration.Days
	lifecycleID := &result.Lifecycle[0].ID
	assert.Equal(expiryDays, *Days, *Days)    // Checking it is one day expiration
	assert.Equal("Enabled", *Status, *Status) // Checking it's enabled

	// 4. Update from 1 day expiration to 2 days expiration
	resp, err = UpdateLifecycleRule(
		bucketName,
		ltype,
		disable,
		prefix,
		tags,
		expiredObjectDeleteMarker,
		expiryDays2,
		noncurrentversionExpirationDays,
		*lifecycleID,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}

	// 5. Verify 2 expiration days got updated
	resp, err = GetBucketLifeCycle(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ = io.ReadAll(resp.Body)
	result = models.BucketLifecycleResponse{}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	Days = &result.Lifecycle[0].Expiration.Days
	assert.Equal(expiryDays2, *Days, *Days) // Checking it is two days expiration

	// 6. Delete Bucket Lifecycle
	resp, err = DeleteLifecycleRule(bucketName, *lifecycleID)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			204, resp.StatusCode, "Status Code is incorrect")
	}

	// 6. Verify bucket lifecycle got deleted
	resp, err = GetBucketLifeCycle(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			404, resp.StatusCode, "Status Code is incorrect")
	}
}

func SetAccessRuleWithBucket(bucketName, prefix, access string) (*http.Response, error) {
	/*
		Helper function to Set Access Rule within Bucket
		HTTP Verb: PUT
		URL: /bucket/{bucket}/access-rules
		Data Example:
		{
			"prefix":"prefix",
			"access":"readonly"
		}
	*/
	requestDataAdd := map[string]interface{}{
		"prefix": prefix,
		"access": access,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"PUT",
		"http://localhost:9090/api/v1/bucket/"+bucketName+"/access-rules",
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

func ListAccessRulesWithBucket(bucketName string) (*http.Response, error) {
	/*
		Helper function to List Access Rules Within Bucket
		HTTP Verb: GET
		URL: /bucket/{bucket}/access-rules
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/bucket/"+bucketName+"/access-rules", nil)
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

func DeleteAccessRuleWithBucket(bucketName, prefix string) (*http.Response, error) {
	/*
		Helper function to Delete Access Rule With Bucket
		HTTP Verb: DELETE
		URL: /bucket/{bucket}/access-rules
		Data Example: {"prefix":"prefix"}
	*/
	requestDataAdd := map[string]interface{}{
		"prefix": prefix,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"DELETE",
		"http://localhost:9090/api/v1/bucket/"+bucketName+"/access-rules",
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

func TestAccessRule(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "test-access-rule-bucket"
	locking := false
	prefix := "prefix"
	access := "readonly"

	// 1. Add bucket
	if !setupBucket(bucketName, locking, nil, nil, nil, assert, 200) {
		return
	}

	// 2. Set Access Rule With Bucket
	resp, err := SetAccessRuleWithBucket(
		bucketName,
		prefix,
		access,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}

	// 3. List Access Rule
	resp, err = ListAccessRulesWithBucket(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ := io.ReadAll(resp.Body)
	result := models.ListAccessRulesResponse{}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	Access := &result.AccessRules[0].Access
	Prefix := &result.AccessRules[0].Prefix
	assert.Equal("readonly", *Access, *Access)
	assert.Equal("prefix", *Prefix, *Prefix)

	// 4. Delete Access Rule
	resp, err = DeleteAccessRuleWithBucket(
		bucketName,
		prefix,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}

	// 5. Verify access rule was deleted
	resp, err = ListAccessRulesWithBucket(bucketName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ = io.ReadAll(resp.Body)
	result = models.ListAccessRulesResponse{}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	AccessRules := &result.AccessRules // The array has to be empty, no index accessible
	if len(*AccessRules) == 0 {
		fmt.Println("Cool, access rules are gone from this bucket")
	} else {
		assert.Fail("Access Rule not deleted")
	}
}

func GetBucketRewind(bucketName, date string) (*http.Response, error) {
	/*
		Helper function to get objects in a bucket for a rewind date
		HTTP Verb: GET
		URL: /buckets/{bucket_name}/rewind/{date}
	*/
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/"+bucketName+"/rewind/"+date,
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

func TestGetBucketRewind(t *testing.T) {
	// Variables
	assert := assert.New(t)
	bucketName := "test-get-bucket-rewind"
	date := "2006-01-02T15:04:05Z"

	// Test
	resp, err := GetBucketRewind(bucketName, date)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, inspectHTTPResponse(resp))
	}
}

func GetRemoteBucket() (*http.Response, error) {
	request, err := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/remote-buckets",
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

func GetRemoteBucketARN(sourceBucket string) (*http.Response, error) {
	request, err := http.NewRequest(
		"GET",
		fmt.Sprintf("http://localhost:9090/api/v1/remote-buckets/%s", sourceBucket),
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

func AddRemoteBucket(accessKey, secretKey, targetURL, sourceBucket, targetBucket string) (*http.Response, error) {
	// Needed Parameters for API Call
	bucketsRelationArray := make([]map[string]interface{}, 1)
	bucketsRelationIndex0 := map[string]interface{}{
		"originBucket":      sourceBucket,
		"destinationBucket": targetBucket,
	}
	bucketsRelationArray[0] = bucketsRelationIndex0
	requestDataAdd := map[string]interface{}{
		"accessKey":              accessKey,
		"secretKey":              secretKey,
		"targetURL":              targetURL,
		"sourceBucket":           sourceBucket,
		"targetBucket":           targetBucket,
		"region":                 "",
		"bucketsRelation":        bucketsRelationArray,
		"syncMode":               "async",
		"bandwidth":              107374182400,
		"healthCheckPeriod":      60,
		"prefix":                 "",
		"tags":                   "",
		"replicateDeleteMarkers": true,
		"replicateDeletes":       true,
		"priority":               1,
		"storageClass":           "",
		"replicateMetadata":      true,
	}

	// Creating the Call by adding the URL and Headers
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/remote-buckets",
		requestDataBody,
	)
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

func DeleteRemoteBucket(sourceBucket string, arn string) (*http.Response, error) {
	// Needed Parameters for API Call
	request, err := http.NewRequest(
		"DELETE",
		fmt.Sprintf("http://localhost:9090/api/v1/remote-buckets/%s/%s", sourceBucket, arn),
		nil,
	)
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

func TestAddRemoteBucket(t *testing.T) {
	// Variables
	assert := assert.New(t)
	accessKey := "minioadmin"
	secretKey := "minioadmin"
	targetURL := "http://173.18.0.3:9001"
	sourceBucket := "source"
	targetBucket := "targetbucket"
	fmt.Println("targetBucket: ", targetBucket)

	// 1. Create bucket
	if !setupBucket("source", true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
	}
	// 1.1. Create target bucket
	targetEndpoint := "http://localhost:9092"
	targetToken := getTokenForEndpoint(targetEndpoint)
	if !setupBucketForEndpoint(targetBucket, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200, &targetEndpoint, &targetToken) {
		log.Println("bucket already exists")
	}
	_, err := SetBucketVersioning(targetBucket, map[string]interface{}{"enabled": false}, &targetURL, &targetToken)
	if err != nil {
		log.Println("bucket already has versioning")
	}

	// 2. Add Remote Bucket
	resp, err := AddRemoteBucket(
		accessKey,
		secretKey,
		targetURL,
		sourceBucket,
		targetBucket,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			201, resp.StatusCode, inspectHTTPResponse(resp))
	}

	// 3. Verify Remote Bucket was created
	resp, err = GetRemoteBucket()
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	finalResponse := inspectHTTPResponse(resp)
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, finalResponse)
	}
	fmt.Println("finalResponse: ", finalResponse)
	assert.Equal(strings.Contains(finalResponse, targetBucket), true)
}

func TestDeleteRemoteBucket(t *testing.T) {
	// Variables
	assert := assert.New(t)
	accessKey := "minioadmin"
	secretKey := "minioadmin"
	targetURL := "http://173.18.0.3:9001"
	sourceBucket := "deletesource"
	targetBucket := "targetbucket2"
	fmt.Println("targetBucket: ", targetBucket)

	// 1. Create bucket
	if !setupBucket("deletesource", true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200) {
		return
	}
	// 1.1. Create target bucket
	targetEndpoint := "http://localhost:9092"
	targetToken := getTokenForEndpoint(targetEndpoint)
	if !setupBucketForEndpoint(targetBucket, true, map[string]interface{}{"enabled": true}, nil, nil, assert, 200, &targetEndpoint, &targetToken) {
		log.Println("bucket already exists")
	}
	_, err := SetBucketVersioning(targetBucket, map[string]interface{}{"enabled": false}, &targetURL, &targetToken)
	if err != nil {
		log.Println("bucket already has versioning")
	}

	// 2. Add Remote Bucket
	resp, err := AddRemoteBucket(
		accessKey,
		secretKey,
		targetURL,
		sourceBucket,
		targetBucket,
	)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			201, resp.StatusCode, inspectHTTPResponse(resp))
	}

	// 3. Get ARN
	resp, err = GetRemoteBucketARN(sourceBucket)
	assert.Nil(err)
	assert.NotNil(resp)
	assert.NotNil(resp.Body)
	bodyBytes, _ := io.ReadAll(resp.Body)
	remoteBucket := models.RemoteBucket{}
	err = json.Unmarshal(bodyBytes, &remoteBucket)
	assert.Nil(err)
	assert.Equal(200, resp.StatusCode, inspectHTTPResponse(resp))

	// 4. Delete Remote Bucket
	if remoteBucket.RemoteARN != nil {
		resp, err = DeleteRemoteBucket(sourceBucket, *remoteBucket.RemoteARN)
		assert.Nil(err)
		if err != nil {
			log.Println(err)
			return
		}
		finalResponse := inspectHTTPResponse(resp)
		if resp != nil {
			assert.Equal(
				204, resp.StatusCode, finalResponse)
		}
	} else {
		assert.Fail("No remote arn response")
	}
}

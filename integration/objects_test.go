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
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"strings"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"

	"github.com/stretchr/testify/assert"
)

func TestObjectGet(t *testing.T) {
	// for setup we'll create a bucket and upload a file
	endpoint := "localhost:9000"
	accessKeyID := "minioadmin"
	secretAccessKey := "minioadmin"

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: false,
	})
	if err != nil {
		log.Fatalln(err)
	}
	bucketName := fmt.Sprintf("testbucket-%d", rand.Intn(1000-1)+1)
	err = minioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{Region: "us-east-1", ObjectLocking: true})
	if err != nil {
		fmt.Println(err)
	}
	// upload a simple file
	fakeFile := "12345678"
	fileReader := strings.NewReader(fakeFile)

	_, err = minioClient.PutObject(
		context.Background(),
		bucketName,
		"myobject", fileReader, int64(len(fakeFile)), minio.PutObjectOptions{ContentType: "application/octet-stream"})
	if err != nil {
		fmt.Println(err)
		return
	}
	_, err = minioClient.PutObject(
		context.Background(),
		bucketName,
		"myobject.jpg", fileReader, int64(len(fakeFile)), minio.PutObjectOptions{ContentType: "application/octet-stream"})
	if err != nil {
		fmt.Println(err)
		return
	}

	assert := assert.New(t)
	type args struct {
		encodedPrefix string
		versionID     string
		bytesRange    string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Preview Object",
			args: args{
				encodedPrefix: "myobject",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Preview image",
			args: args{
				encodedPrefix: "myobject.jpg",
			},
			expectedStatus: 200,
			expectedError:  nil,
		},
		{
			name: "Get Range of bytes",
			args: args{
				encodedPrefix: "myobject.jpg",
				bytesRange:    "bytes=1-4",
			},
			expectedStatus: 206,
			expectedError:  nil,
		},
		{
			name: "Get Range of bytes empty start",
			args: args{
				encodedPrefix: "myobject.jpg",
				bytesRange:    "bytes=-4",
			},
			expectedStatus: 206,
			expectedError:  nil,
		},
		{
			name: "Get Invalid Range of bytes",
			args: args{
				encodedPrefix: "myobject.jpg",
				bytesRange:    "bytes=9-12",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
		{
			name: "Get Larger Range of bytes empty start",
			args: args{
				encodedPrefix: "myobject.jpg",
				bytesRange:    "bytes=-12",
			},
			expectedStatus: 206,
			expectedError:  nil,
		},
		{
			name: "Get invalid seek start Range of bytes",
			args: args{
				encodedPrefix: "myobject.jpg",
				bytesRange:    "bytes=12-16",
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := &http.Client{
				Timeout: 3 * time.Second,
			}
			destination := fmt.Sprintf("/api/v1/buckets/%s/objects/download?preview=true&prefix=%s&version_id=%s", url.PathEscape(bucketName), url.QueryEscape(tt.args.encodedPrefix), url.QueryEscape(tt.args.versionID))
			finalURL := fmt.Sprintf("http://localhost:9090%s", destination)
			request, err := http.NewRequest("GET", finalURL, nil)
			if err != nil {
				log.Println(err)
				return
			}
			request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
			request.Header.Add("Content-Type", "application/json")
			if tt.args.bytesRange != "" {
				request.Header.Add("Range", tt.args.bytesRange)
			}

			response, err := client.Do(request)
			fmt.Printf("Console server Response: %v\nErr: %v\n", response, err)

			assert.NotNil(response, fmt.Sprintf("%s response object is nil", tt.name))
			assert.Nil(err, fmt.Sprintf("%s returned an error: %v", tt.name, err))
			if response != nil {
				assert.Equal(tt.expectedStatus, response.StatusCode, fmt.Sprintf("%s returned the wrong status code", tt.name))
			}
		})
	}
}

func downloadMultipleFiles(bucketName string, objects []string) (*http.Response, error) {
	requestURL := fmt.Sprintf("http://localhost:9090/api/v1/buckets/%s/objects/download-multiple", url.PathEscape(bucketName))

	postReqParams, _ := json.Marshal(objects)
	reqBody := bytes.NewReader(postReqParams)

	request, err := http.NewRequest(
		"POST", requestURL, reqBody)
	if err != nil {
		log.Println(err)
		return nil, nil
	}

	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func TestDownloadMultipleFiles(t *testing.T) {
	assert := assert.New(t)
	type args struct {
		bucketName string
		objectLis  []string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  bool
	}{
		{
			name: "Test empty Bucket",
			args: args{
				bucketName: "",
			},
			expectedStatus: 400,
			expectedError:  true,
		},
		{
			name: "Test empty object list",
			args: args{
				bucketName: "test-bucket",
			},
			expectedStatus: 400,
			expectedError:  true,
		},
		{
			name: "Test with bucket and object list",
			args: args{
				bucketName: "test-bucket",
				objectLis: []string{
					"my-object.txt",
					"test-prefix/",
					"test-prefix/nested-prefix/",
					"test-prefix/nested-prefix/deep-nested/",
				},
			},
			expectedStatus: 200,
			expectedError:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			resp, err := downloadMultipleFiles(tt.args.bucketName, tt.args.objectLis)
			if tt.expectedError {
				assert.Nil(err)
				if err != nil {
					log.Println(err)
					return
				}
			}
			if resp != nil {
				assert.NotNil(resp)
			}
		})
	}
}

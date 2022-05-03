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
	"github.com/minio/console/models"
	"github.com/minio/console/restapi"
	"github.com/minio/madmin-go"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func AddRemoteBucket(accessKey string, secretKey string, targetURL string, sourceBucket string, targetBucket string) (string, error) {
	ctx := context.Background()
	mAdminClient, err := restapi.NewMinioAdminClient(&models.Principal{
		STSAccessKeyID:     "minioadmin",
		STSSecretAccessKey: "minioadmin",
	})
	u, err := url.Parse(targetURL)

	host := u.Host
	if u.Port() == "" {
		port := 80
		host = host + ":" + strconv.Itoa(port)
	}
	creds := &madmin.Credentials{AccessKey: accessKey, SecretKey: secretKey}
	remoteBucket := &madmin.BucketTarget{
		TargetBucket:    targetBucket,
		Secure:          false,
		Credentials:     creds,
		Endpoint:        host,
		Path:            "",
		API:             "s3v4",
		Type:            "replication",
		Region:          "",
		ReplicationSync: true,
	}
	bucketARN, err := mAdminClient.SetRemoteTarget(ctx, sourceBucket, remoteBucket)

	return bucketARN, err

}

func Test_AddRemoteBucketAPI(t *testing.T) {
	assert := assert.New(t)

	AddBucket("remotebucketsource", false, true, nil, nil)

	type args struct {
		accessKey    string
		secretKey    string
		targetURL    string
		sourceBucket string
		targetBucket string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Create Remote Bucket - Valid",
			args: args{
				accessKey:    "minioadmin",
				secretKey:    "minioadmin",
				targetURL:    "https://play.min.io/",
				sourceBucket: "remotebucketsource",
				targetBucket: os.Getenv("THETARGET"),
			},
			expectedStatus: 201,
			expectedError:  nil,
		},
		{
			name: "Create Remote Bucket - Invalid",
			args: args{
				accessKey:    "minioadmin",
				secretKey:    "minioadmin123",
				targetURL:    "https://play.min.io/",
				sourceBucket: "remotebucketsource",
				targetBucket: os.Getenv("THETARGET"),
			},
			expectedStatus: 500,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			// Add policy

			requestDataPolicy := map[string]interface{}{}
			requestDataPolicy["accessKey"] = tt.args.accessKey
			requestDataPolicy["secretKey"] = tt.args.secretKey
			requestDataPolicy["targetURL"] = tt.args.targetURL
			requestDataPolicy["sourceBucket"] = tt.args.sourceBucket
			requestDataPolicy["targetBucket"] = tt.args.targetBucket

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"POST", "http://localhost:9090/api/v1/remote-buckets", requestDataBody)
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
				assert.Equal(tt.expectedStatus, response.StatusCode, "Status Code is incorrect")
			}

		})
	}

}

func Test_ListRemoteBucketAPI(t *testing.T) {
	assert := assert.New(t)

	tests := []struct {
		name           string
		expectedStatus int
		expectedError  error
	}{
		{
			name: "List Remote Bucket - Valid",
			expectedStatus: 200,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			// Add policy

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"GET", "http://localhost:9090/api/v1/remote-buckets", requestDataBody)
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
				assert.Equal(tt.expectedStatus, response.StatusCode, "Status Code is incorrect")
			}

		})
	}

}

func Test_GetRemoteBucketAPI(t *testing.T) {
	assert := assert.New(t)

	type args struct {
		api            string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Get Remote Bucket - Valid",
			args: args{
				"remotebucketsource",
				},
			expectedStatus: 200,
			expectedError:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			// Add policy

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"GET", "http://localhost:9090/api/v1/remote-buckets", requestDataBody)
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
				assert.Equal(tt.expectedStatus, response.StatusCode, "Status Code is incorrect")
			}

		})
	}

}

func Test_DeleteRemoteBucketAPI(t *testing.T) {
	assert := assert.New(t)

	AddBucket("remotebucketdeletesource", false, true, map[string]interface{}{}, map[string]interface{}{})
	arn, _ := AddRemoteBucket("minioadmin", "minioadmin", "https://play.min.io/", "remotebucketdeletesource", os.Getenv("THETARGET"))

	type args struct {
		api string
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
		verb           string
	}{
		{
			name: "Delete Remote Bucket - Valid",
			args: args{
				api: fmt.Sprintf("/remote-buckets/%s/%s", os.Getenv("THETARGET"), arn),
			},
			expectedStatus: 201,
			expectedError:  nil,
			verb:           "DELETE",
		},
		{
			name: "Delete Remote Bucket - Invalid",
			args: args{
				api: "/remote-buckets/fakebucket/fakearn",
			},
			expectedStatus: 500,
			expectedError:  nil,
			verb:           "DELETE",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			client := &http.Client{
				Timeout: 3 * time.Second,
			}

			// Add policy

			requestDataPolicy := map[string]interface{}{}

			requestDataJSON, _ := json.Marshal(requestDataPolicy)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				tt.verb, fmt.Sprintf("http://localhost:9090/api/v1/remote-buckets%s", tt.args.api), requestDataBody)
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
				assert.Equal(tt.expectedStatus, response.StatusCode, "Status Code is incorrect")
			}

		})
	}

}

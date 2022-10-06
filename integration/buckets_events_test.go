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
	"io/ioutil"
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_AddEventAPI(t *testing.T) {
	assert := assert.New(t)

	AddBucket("testevents5", false, false, map[string]interface{}{}, map[string]interface{}{})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		_, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error reading body: %v", err)
			http.Error(w, "can't read body", http.StatusBadRequest)
		}
	})

	server := &http.Server{Addr: ":8081", Handler: nil}
	go func() {
		server.ListenAndServe()
	}()

	type notificationConfig struct {
		id                    string
		arn                   string
		notificationEventType []string
		prefix                string
		suffix                string
	}
	type bucketEventConfiguration struct {
		configuration  notificationConfig
		ignoreExisting bool
	}
	type args struct {
		bucketName string
		conf       bucketEventConfiguration
	}
	tests := []struct {
		name           string
		args           args
		expectedStatus int
		expectedError  error
	}{
		{
			name: "Create Bucket Event - Valid",
			args: args{
				bucketName: "test",
				conf: bucketEventConfiguration{
					ignoreExisting: true,
					configuration: notificationConfig{
						id:                    "",
						arn:                   "arn:minio:sqs::_:webhook",
						notificationEventType: []string{"delete"},
						prefix:                "",
						suffix:                "",
					},
				},
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

			requestDataEvents := map[string]interface{}{}
			requestDataEvents["conf"] = map[string]interface{}{}
			requestDataEvents["conf"].(map[string]interface{})["ignoreExisting"] = tt.args.conf.ignoreExisting
			requestDataEvents["conf"].(map[string]interface{})["configuration"] = map[string]interface{}{}
			requestDataEvents["conf"].(map[string]interface{})["configuration"].(map[string]interface{})["id"] = tt.args.conf.configuration.id
			requestDataEvents["conf"].(map[string]interface{})["configuration"].(map[string]interface{})["arn"] = tt.args.conf.configuration.arn
			requestDataEvents["conf"].(map[string]interface{})["configuration"].(map[string]interface{})["notificationEventType"] = tt.args.conf.configuration.notificationEventType
			requestDataEvents["conf"].(map[string]interface{})["configuration"].(map[string]interface{})["prefix"] = tt.args.conf.configuration.prefix
			requestDataEvents["conf"].(map[string]interface{})["configuration"].(map[string]interface{})["suffix"] = tt.args.conf.configuration.suffix

			requestDataJSON, _ := json.Marshal(requestDataEvents)
			requestDataBody := bytes.NewReader(requestDataJSON)
			request, err := http.NewRequest(
				"POST", "http://localhost:8081/api/v1/buckets/testevents5/events", requestDataBody)
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
	server.Shutdown(context.Background())
}

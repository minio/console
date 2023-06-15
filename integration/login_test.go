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
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/minio/console/models"

	"github.com/stretchr/testify/assert"
)

func TestLoginStrategy(t *testing.T) {
	assert := assert.New(t)

	// image for now:
	// minio: 9000
	// console: 9090

	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	// copy query params
	request, err := http.NewRequest("GET", "http://localhost:9090/api/v1/login", nil)
	if err != nil {
		log.Println(err)
		return
	}

	response, err := client.Do(request)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}

	if response != nil {
		bodyBytes, _ := io.ReadAll(response.Body)

		loginDetails := models.LoginDetails{}

		err = json.Unmarshal(bodyBytes, &loginDetails)
		if err != nil {
			log.Println(err)
		}
		assert.Nil(err)

		assert.Equal(models.LoginDetailsLoginStrategyForm, loginDetails.LoginStrategy, "Login Details don't match")

	}
}

func TestLogout(t *testing.T) {
	assert := assert.New(t)

	// image for now:
	// minio: 9000
	// console: 9090

	client := &http.Client{
		Timeout: 2 * time.Second,
	}
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

	assert.NotNil(response, "Login response is nil")
	assert.Nil(err, "Login errored out")

	var loginToken string

	for _, cookie := range response.Cookies() {
		if cookie.Name == "token" {
			loginToken = cookie.Value
			break
		}
	}

	if loginToken == "" {
		log.Println("authentication token not found in cookies response")
		return
	}
	logoutRequest := bytes.NewReader([]byte("{}"))
	request, err = http.NewRequest("POST", "http://localhost:9090/api/v1/logout", logoutRequest)
	if err != nil {
		log.Println(err)
		return
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", loginToken))
	request.Header.Add("Content-Type", "application/json")

	response, err = client.Do(request)
	assert.NotNil(response, "Logout response is nil")
	assert.Nil(err, "Logout errored out")
	assert.Equal(response.StatusCode, 200)
}

func TestBadLogin(t *testing.T) {
	assert := assert.New(t)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	requestData := map[string]string{
		"accessKey": "minioadmin",
		"secretKey": "minioadminbad",
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

	assert.Equal(401, response.StatusCode, "Login request not rejected")
	assert.NotNil(response, "Login response is  nil")
	assert.Nil(err, "Login errored out")
}

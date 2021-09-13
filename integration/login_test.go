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
	"encoding/json"
	"io/ioutil"
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
		bodyBytes, _ := ioutil.ReadAll(response.Body)

		loginDetails := models.LoginDetails{}

		err = json.Unmarshal(bodyBytes, &loginDetails)
		if err != nil {
			log.Println(err)
		}
		assert.Nil(err)

		assert.Equal(models.LoginDetailsLoginStrategyForm, loginDetails.LoginStrategy, "Login Details don't match")

	}

}

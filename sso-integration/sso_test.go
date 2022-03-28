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

package ssointegration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/go-openapi/loads"
	"github.com/minio/console/restapi"
	"github.com/minio/console/restapi/operations"
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
	consolePort, _ := strconv.Atoi("9090")

	server.Host = "0.0.0.0"
	server.Port = consolePort
	restapi.Port = "9090"
	restapi.Hostname = "0.0.0.0"

	return server, nil
}

func TestMain(t *testing.T) {

	assert := assert.New(t)

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

	// execute bash script to get the code and state
	cmd, err := exec.Command("./logssorun2.sh").Output()
	if err != nil {
		fmt.Printf("error %s", err)
	}
	output := string(cmd)

	fmt.Println(" ")
	fmt.Println(" ")
	fmt.Println("output:")
	fmt.Println(output)
	fmt.Println(" ")
	fmt.Println(" ")

	temp := strings.Split(output, "\n")

	fmt.Println(" ")
	fmt.Println(" ")
	fmt.Println("temp:")
	fmt.Println(temp)
	fmt.Println(" ")
	fmt.Println(" ")

	fmt.Println("index0")
	fmt.Println(temp[0])

	if int(len(temp)) >= 2 {
		fmt.Println("index 1")
		fmt.Println(temp[1])
	} else {
		assert.Fail("temp len is less than 2", len(temp))
		return
	}

	// get login credentials
	codeVarIable := string(strings.TrimSpace(temp[0]))
	stateVarIabl := string(strings.TrimSpace(temp[1]))
	requestData := map[string]string{
		"code":  codeVarIable,
		"state": stateVarIabl,
	}
	requestDataJSON, _ := json.Marshal(requestData)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, _ := http.NewRequest(
		"POST",
		"http://localhost:9001/api/v1/login/oauth2/auth",
		requestDataBody,
	)
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
	}

	if response != nil {
		for _, cookie := range response.Cookies() {
			if cookie.Name == "token" {
				token = cookie.Value
				break
			}
		}
	}
	fmt.Println(response.Status)
	if token == "" {
		assert.Fail("authentication token not found in cookies response")
	} else {
		fmt.Println(token)
	}

}

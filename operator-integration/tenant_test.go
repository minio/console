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

package operatorintegration

import (
	"bytes"
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"testing"
	"time"

	"github.com/go-openapi/loads"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi"
	"github.com/minio/console/restapi/operations"
	"github.com/stretchr/testify/assert"
)

var token string

func decodeBase64(value string) string {
	/*
		Helper function to decode in base64
	*/
	result, err := b64.StdEncoding.DecodeString(value)
	if err != nil {
		log.Fatal("error:", err)
	}
	return string(result)
}

func printMessage(message string) {
	/*
		Helper function to print HTTP response.
	*/
	fmt.Println(message)
}

func printLoggingMessage(message string, functionName string) {
	/*
		Helper function to have standard output across the tests.
	*/
	finalString := "......................." + functionName + "(): " + message
	printMessage(finalString)
}

func printStartFunc(functionName string) {
	/*
		Common function for all tests to tell that test has started
	*/
	printMessage("")
	printLoggingMessage("started", functionName)
}

func printEndFunc(functionName string) {
	/*
		Helper function for all tests to tell that test has ended, is completed
	*/
	printLoggingMessage("completed", functionName)
	printMessage("")
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
	printStartFunc("TestMain")
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

	// kubectl to get token
	app := "kubectl"
	arg0 := "get"
	arg1 := "serviceaccount"
	arg2 := "console-sa"
	arg3 := "--namespace"
	arg4 := "minio-operator"
	arg5 := "-o"
	arg6 := "jsonpath=\"{.secrets[0].name}\""
	cmd := exec.Command(app, arg0, arg1, arg2, arg3, arg4, arg5, arg6)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
		return
	}
	secret := out.String() // "console-sa-token-kxdw2" <-- secret
	app2 := "kubectl"
	argu0 := "--namespace"
	argu1 := "minio-operator"
	argu2 := "get"
	argu3 := "secret"
	argu4 := secret[1 : len(secret)-1]
	argu5 := "-o"
	argu6 := "jsonpath=\"{.data.token}\""
	cmd2 := exec.Command(app2, argu0, argu1, argu2, argu3, argu4, argu5, argu6)
	var out2 bytes.Buffer
	var stderr2 bytes.Buffer
	cmd2.Stdout = &out2
	cmd2.Stderr = &stderr2
	err2 := cmd2.Run()
	if err2 != nil {
		fmt.Println(fmt.Sprint(err2) + ": -> " + stderr2.String())
		return
	}
	secret2 := out2.String()
	secret3 := decodeBase64(secret2[1 : len(secret2)-1])
	requestData := map[string]string{
		"jwt": secret3,
	}

	requestDataJSON, _ := json.Marshal(requestData)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, err := http.NewRequest("POST", "http://localhost:9090/api/v1/login/operator", requestDataBody)
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
	printEndFunc("TestMain")
	os.Exit(code)
}

func ListTenants() (*http.Response, error) {
	/*
		Helper function to list buckets
		HTTP Verb: GET
		URL: http://localhost:9090/api/v1/tenants
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/tenants", nil)
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

func TestListTenants(t *testing.T) {
	// Tenants can be listed via API: https://github.com/miniohq/engineering/issues/591
	printStartFunc("TestListTenants")
	assert := assert.New(t)
	resp, err := ListTenants()
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	result := models.ListTenantsResponse{}
	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		log.Println(err)
		assert.Nil(err)
	}
	TenantName := &result.Tenants[0].Name // The array has to be empty, no index accessible
	fmt.Println(*TenantName)
	assert.Equal("storage-lite", *TenantName, *TenantName)
	printEndFunc("TestListTenants")
}

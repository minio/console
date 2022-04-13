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
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/go-openapi/loads"
	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi"
	"github.com/minio/console/operatorapi/operations"
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

func printLoggingMessage(message string, functionName string) {
	/*
		Helper function to have standard output across the tests.
	*/
	finalString := "......................." + functionName + "(): " + message
	fmt.Println(finalString)
}

func printStartFunc(functionName string) {
	/*
		Common function for all tests to tell that test has started
	*/
	fmt.Println("")
	printLoggingMessage("started", functionName)
}

func printEndFunc(functionName string) {
	/*
		Helper function for all tests to tell that test has ended, is completed
	*/
	printLoggingMessage("completed", functionName)
	fmt.Println("")
}

func initConsoleServer() (*operatorapi.Server, error) {

	//os.Setenv("CONSOLE_MINIO_SERVER", "localhost:9000")

	swaggerSpec, err := loads.Embedded(operatorapi.SwaggerJSON, operatorapi.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	noLog := func(string, ...interface{}) {
		// nothing to log
	}

	// Initialize MinIO loggers
	operatorapi.LogInfo = noLog
	operatorapi.LogError = noLog

	api := operations.NewOperatorAPI(swaggerSpec)
	api.Logger = noLog

	server := operatorapi.NewServer(api)
	// register all APIs
	server.ConfigureAPI()

	consolePort, _ := strconv.Atoi("9090")

	server.Host = "0.0.0.0"
	server.Port = consolePort
	operatorapi.Port = "9090"
	operatorapi.Hostname = "0.0.0.0"

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

func CreateTenant(tenantName string, namespace string, accessKey string, secretKey string, accessKeys []string, idp map[string]interface{}, tls map[string]interface{}, prometheusConfiguration map[string]interface{}, logSearchConfiguration map[string]interface{}, erasureCodingParity int, pools []map[string]interface{}, exposeConsole bool, exposeMinIO bool, image string, serviceName string, enablePrometheus bool, enableConsole bool, enableTLS bool, secretKeys []string) (*http.Response, error) {
	/*
		Helper function to create a tenant
		HTTP Verb: POST
		API: /api/v1/tenants
	*/
	requestDataAdd := map[string]interface{}{
		"name":                    tenantName,
		"namespace":               namespace,
		"access_key":              accessKey,
		"secret_key":              secretKey,
		"access_keys":             accessKeys,
		"secret_keys":             secretKeys,
		"enable_tls":              enableTLS,
		"enable_console":          enableConsole,
		"enable_prometheus":       enablePrometheus,
		"service_name":            serviceName,
		"image":                   image,
		"expose_minio":            exposeMinIO,
		"expose_console":          exposeConsole,
		"pools":                   pools,
		"erasureCodingParity":     erasureCodingParity,
		"logSearchConfiguration":  logSearchConfiguration,
		"prometheusConfiguration": prometheusConfiguration,
		"tls":                     tls,
		"idp":                     idp,
	}
	requestDataJSON, _ := json.Marshal(requestDataAdd)
	requestDataBody := bytes.NewReader(requestDataJSON)
	request, err := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/tenants",
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

func TestCreateTenant(t *testing.T) {
	printStartFunc("TestCreateTenant")

	// Variables
	assert := assert.New(t)
	erasureCodingParity := 2
	tenantName := "new-tenant"
	namespace := "default"
	accessKey := ""
	secretKey := ""
	var accessKeys []string
	var secretKeys []string
	var minio []string
	var caCertificates []string
	var consoleCAcertificates []string
	enableTLS := true
	enableConsole := true
	enablePrometheus := true
	serviceName := ""
	image := ""
	exposeMinIO := true
	exposeConsole := true
	values := make([]string, 1)
	values[0] = "new-tenant"
	values2 := make([]string, 1)
	values2[0] = "pool-0"
	keys := make([]map[string]interface{}, 1)
	keys[0] = map[string]interface{}{
		"access_key": "IGLksSXdiU3fjcRI",
		"secret_key": "EqeCPZ1xBYdnygizxxRWnkH09N2350nO",
	}
	pools := make([]map[string]interface{}, 1)
	matchExpressions := make([]map[string]interface{}, 2)
	matchExpressions[0] = map[string]interface{}{
		"key":      "v1.min.io/tenant",
		"operator": "In",
		"values":   values,
	}
	matchExpressions[1] = map[string]interface{}{
		"key":      "v1.min.io/pool",
		"operator": "In",
		"values":   values2,
	}
	requiredDuringSchedulingIgnoredDuringExecution := make([]map[string]interface{}, 1)
	requiredDuringSchedulingIgnoredDuringExecution[0] = map[string]interface{}{
		"labelSelector": map[string]interface{}{
			"matchExpressions": matchExpressions,
		},
		"topologyKey": "kubernetes.io/hostname",
	}
	pools0 := map[string]interface{}{
		"name":               "pool-0",
		"servers":            4,
		"volumes_per_server": 1,
		"volume_configuration": map[string]interface{}{
			"size":               26843545600,
			"storage_class_name": "standard",
		},
		"securityContext": nil,
		"affinity": map[string]interface{}{
			"podAntiAffinity": map[string]interface{}{
				"requiredDuringSchedulingIgnoredDuringExecution": requiredDuringSchedulingIgnoredDuringExecution,
			},
		},
		"resources": map[string]interface{}{
			"requests": map[string]interface{}{
				"cpu":    2,
				"memory": 2,
			},
		},
	}
	logSearchConfiguration := map[string]interface{}{
		"image":               "",
		"postgres_image":      "",
		"postgres_init_image": "",
	}
	prometheusConfiguration := map[string]interface{}{
		"image":         "",
		"sidecar_image": "",
		"init_image":    "",
	}
	tls := map[string]interface{}{
		"minio":                   minio,
		"ca_certificates":         caCertificates,
		"console_ca_certificates": consoleCAcertificates,
	}
	idp := map[string]interface{}{
		"keys": keys,
	}
	pools[0] = pools0

	// 1. Create Tenant
	resp, err := CreateTenant(
		tenantName,
		namespace,
		accessKey,
		secretKey,
		accessKeys,
		idp,
		tls,
		prometheusConfiguration,
		logSearchConfiguration,
		erasureCodingParity,
		pools,
		exposeConsole,
		exposeMinIO,
		image,
		serviceName,
		enablePrometheus,
		enableConsole,
		enableTLS,
		secretKeys,
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

	printEndFunc("TestCreateTenant")
}

func ListTenantsByNameSpace(namespace string) (*http.Response, error) {
	/*
		Helper function to list buckets
		HTTP Verb: GET
		URL: http://localhost:9090/api/v1/namespaces/{namespace}/tenants
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/namespaces/"+namespace+"/tenants", nil)
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

func TestListTenantsByNameSpace(t *testing.T) {
	assert := assert.New(t)
	namespace := "default"
	resp, err := ListTenantsByNameSpace(namespace)
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
	assert.Equal("new-tenant", *TenantName, *TenantName)
}

func ListNodeLabels() (*http.Response, error) {
	/*
		Helper function to list buckets
		HTTP Verb: GET
		URL: http://localhost:9090/api/v1/nodes/labels
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/nodes/labels", nil)
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

func TestListNodeLabels(t *testing.T) {
	assert := assert.New(t)
	resp, err := ListNodeLabels()
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
	// "beta.kubernetes.io/arch" is a label of our nodes and is expected
	assert.True(
		strings.Contains(finalResponse, "beta.kubernetes.io/arch"),
		finalResponse)
}

func GetPodEvents(nameSpace string, tenant string, podName string) (*http.Response, error) {
	/*
		Helper function to get events for pod
		URL: /namespaces/{namespace}/tenants/{tenant}/pods/{podName}/events
		HTTP Verb: GET
	*/
	request, err := http.NewRequest(
		"GET", "http://localhost:9090/api/v1/namespaces/"+nameSpace+"/tenants/"+tenant+"/pods/"+podName+"/events", nil)
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

func TestGetPodEvents(t *testing.T) {
	assert := assert.New(t)
	namespace := "tenant-lite"
	tenant := "storage-lite"
	podName := "storage-lite-pool-0-0"
	resp, err := GetPodEvents(namespace, tenant, podName)
	assert.Nil(err)
	if err != nil {
		log.Println(err)
		return
	}
	if resp != nil {
		assert.Equal(
			200, resp.StatusCode, "Status Code is incorrect")
	}
}

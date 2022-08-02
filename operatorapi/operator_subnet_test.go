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

package operatorapi

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
	"github.com/minio/console/pkg/subnet"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type OperatorSubnetTestSuite struct {
	suite.Suite
	assert             *assert.Assertions
	loginServer        *httptest.Server
	loginWithError     bool
	loginMFAServer     *httptest.Server
	loginMFAWithError  bool
	getAPIKeyServer    *httptest.Server
	getAPIKeyWithError bool
}

func (suite *OperatorSubnetTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.loginServer = httptest.NewServer(http.HandlerFunc(suite.loginHandler))
	suite.loginMFAServer = httptest.NewServer(http.HandlerFunc(suite.loginMFAHandler))
	suite.getAPIKeyServer = httptest.NewServer(http.HandlerFunc(suite.getAPIKeyHandler))
}

func (suite *OperatorSubnetTestSuite) loginHandler(
	w http.ResponseWriter, r *http.Request,
) {
	if suite.loginWithError {
		w.WriteHeader(400)
	} else {
		fmt.Fprintf(w, `{"mfa_required": true, "mfa_token": "mockToken"}`)
	}
}

func (suite *OperatorSubnetTestSuite) loginMFAHandler(
	w http.ResponseWriter, r *http.Request,
) {
	if suite.loginMFAWithError {
		w.WriteHeader(400)
	} else {
		fmt.Fprintf(w, `{"token_info": {"access_token": "mockToken"}}`)
	}
}

func (suite *OperatorSubnetTestSuite) getAPIKeyHandler(
	w http.ResponseWriter, r *http.Request,
) {
	if suite.getAPIKeyWithError {
		w.WriteHeader(400)
	} else {
		fmt.Fprintf(w, `{"api_key": "mockAPIKey"}`)
	}
}

func (suite *OperatorSubnetTestSuite) TearDownSuite() {
}

func (suite *OperatorSubnetTestSuite) TestRegisterOperatorSubnetHanlders() {
	api := &operations.OperatorAPI{}
	suite.assert.Nil(api.OperatorAPIOperatorSubnetLoginHandler)
	suite.assert.Nil(api.OperatorAPIOperatorSubnetLoginMFAHandler)
	suite.assert.Nil(api.OperatorAPIOperatorSubnetAPIKeyHandler)
	suite.assert.Nil(api.OperatorAPIOperatorSubnetRegisterAPIKeyHandler)
	registerOperatorSubnetHandlers(api)
	suite.assert.NotNil(api.OperatorAPIOperatorSubnetLoginHandler)
	suite.assert.NotNil(api.OperatorAPIOperatorSubnetLoginMFAHandler)
	suite.assert.NotNil(api.OperatorAPIOperatorSubnetAPIKeyHandler)
	suite.assert.NotNil(api.OperatorAPIOperatorSubnetRegisterAPIKeyHandler)
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetLoginHandlerWithEmptyCredentials() {
	params, api := suite.initSubnetLoginRequest("", "")
	response := api.OperatorAPIOperatorSubnetLoginHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetLoginDefault)
	suite.assert.True(ok)
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetLoginHandlerWithServerError() {
	params, api := suite.initSubnetLoginRequest("mockusername", "mockpassword")
	suite.loginWithError = true
	os.Setenv(subnet.ConsoleSubnetURL, suite.loginServer.URL)
	response := api.OperatorAPIOperatorSubnetLoginHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetLoginDefault)
	suite.assert.True(ok)
	os.Unsetenv(subnet.ConsoleSubnetURL)
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetLoginHandlerWithoutError() {
	params, api := suite.initSubnetLoginRequest("mockusername", "mockpassword")
	suite.loginWithError = false
	os.Setenv(subnet.ConsoleSubnetURL, suite.loginServer.URL)
	response := api.OperatorAPIOperatorSubnetLoginHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetLoginOK)
	suite.assert.True(ok)
	os.Unsetenv(subnet.ConsoleSubnetURL)
}

func (suite *OperatorSubnetTestSuite) initSubnetLoginRequest(username, password string) (params operator_api.OperatorSubnetLoginParams, api operations.OperatorAPI) {
	registerOperatorSubnetHandlers(&api)
	params.Body = &models.OperatorSubnetLoginRequest{Username: username, Password: password}
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetLoginMFAHandlerWithServerError() {
	params, api := suite.initSubnetLoginMFARequest("mockusername", "mockMFA", "mockOTP")
	suite.loginMFAWithError = true
	os.Setenv(subnet.ConsoleSubnetURL, suite.loginMFAServer.URL)
	response := api.OperatorAPIOperatorSubnetLoginMFAHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetLoginMFADefault)
	suite.assert.True(ok)
	os.Unsetenv(subnet.ConsoleSubnetURL)
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetLoginMFAHandlerWithoutError() {
	params, api := suite.initSubnetLoginMFARequest("mockusername", "mockMFA", "mockOTP")
	suite.loginMFAWithError = false
	os.Setenv(subnet.ConsoleSubnetURL, suite.loginMFAServer.URL)
	response := api.OperatorAPIOperatorSubnetLoginMFAHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetLoginMFAOK)
	suite.assert.True(ok)
	os.Unsetenv(subnet.ConsoleSubnetURL)
}

func (suite *OperatorSubnetTestSuite) initSubnetLoginMFARequest(username, mfa, otp string) (params operator_api.OperatorSubnetLoginMFAParams, api operations.OperatorAPI) {
	registerOperatorSubnetHandlers(&api)
	params.Body = &models.OperatorSubnetLoginMFARequest{Username: &username, MfaToken: &mfa, Otp: &otp}
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetAPIKeyHandlerWithServerError() {
	params, api := suite.initSubnetAPIKeyRequest()
	suite.getAPIKeyWithError = true
	os.Setenv(subnet.ConsoleSubnetURL, suite.getAPIKeyServer.URL)
	response := api.OperatorAPIOperatorSubnetAPIKeyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetAPIKeyDefault)
	suite.assert.True(ok)
	os.Unsetenv(subnet.ConsoleSubnetURL)
}

func (suite *OperatorSubnetTestSuite) TestOperatorSubnetAPIKeyHandlerWithoutError() {
	params, api := suite.initSubnetAPIKeyRequest()
	suite.getAPIKeyWithError = false
	os.Setenv(subnet.ConsoleSubnetURL, suite.getAPIKeyServer.URL)
	response := api.OperatorAPIOperatorSubnetAPIKeyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.OperatorSubnetAPIKeyOK)
	suite.assert.True(ok)
	os.Unsetenv(subnet.ConsoleSubnetURL)
}

func (suite *OperatorSubnetTestSuite) initSubnetAPIKeyRequest() (params operator_api.OperatorSubnetAPIKeyParams, api operations.OperatorAPI) {
	registerOperatorSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{URL: &url.URL{}}
	return params, api
}

func TestOperatorSubnet(t *testing.T) {
	suite.Run(t, new(OperatorSubnetTestSuite))
}

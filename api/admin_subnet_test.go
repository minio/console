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

package api

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"

	"github.com/minio/console/api/operations"
	subnetApi "github.com/minio/console/api/operations/subnet"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type AdminSubnetTestSuite struct {
	suite.Suite
	assert        *assert.Assertions
	currentServer string
	isServerSet   bool
	server        *httptest.Server
	adminClient   AdminClientMock
}

func (suite *AdminSubnetTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.adminClient = AdminClientMock{}
	minioGetConfigKVMock = func(_ string) ([]byte, error) {
		return []byte("subnet license=mock api_key=mock proxy=http://mock.com"), nil
	}
	MinioServerInfoMock = func(_ context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{Servers: []madmin.ServerProperties{{}}}, nil
	}
}

func (suite *AdminSubnetTestSuite) SetupTest() {
	suite.server = httptest.NewServer(http.HandlerFunc(suite.serverHandler))
	suite.currentServer, suite.isServerSet = os.LookupEnv(ConsoleMinIOServer)
	os.Setenv(ConsoleMinIOServer, suite.server.URL)
}

func (suite *AdminSubnetTestSuite) serverHandler(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(400)
}

func (suite *AdminSubnetTestSuite) TearDownSuite() {
}

func (suite *AdminSubnetTestSuite) TearDownTest() {
	if suite.isServerSet {
		os.Setenv(ConsoleMinIOServer, suite.currentServer)
	} else {
		os.Unsetenv(ConsoleMinIOServer)
	}
}

func (suite *AdminSubnetTestSuite) TestRegisterSubnetHandlers() {
	api := &operations.ConsoleAPI{}
	suite.assertHandlersAreNil(api)
	registerSubnetHandlers(api)
	suite.assertHandlersAreNotNil(api)
}

func (suite *AdminSubnetTestSuite) assertHandlersAreNil(api *operations.ConsoleAPI) {
	suite.assert.Nil(api.SubnetSubnetLoginHandler)
	suite.assert.Nil(api.SubnetSubnetLoginMFAHandler)
	suite.assert.Nil(api.SubnetSubnetRegisterHandler)
	suite.assert.Nil(api.SubnetSubnetInfoHandler)
	suite.assert.Nil(api.SubnetSubnetRegTokenHandler)
	suite.assert.Nil(api.SubnetSubnetAPIKeyHandler)
}

func (suite *AdminSubnetTestSuite) assertHandlersAreNotNil(api *operations.ConsoleAPI) {
	suite.assert.NotNil(api.SubnetSubnetLoginHandler)
	suite.assert.NotNil(api.SubnetSubnetLoginMFAHandler)
	suite.assert.NotNil(api.SubnetSubnetRegisterHandler)
	suite.assert.NotNil(api.SubnetSubnetInfoHandler)
	suite.assert.NotNil(api.SubnetSubnetRegTokenHandler)
	suite.assert.NotNil(api.SubnetSubnetAPIKeyHandler)
}

func (suite *AdminSubnetTestSuite) TestSubnetLoginWithSubnetClientError() {
	params, api := suite.initSubnetLoginRequest("", "", "")
	response := api.SubnetSubnetLoginHandler.Handle(params, &models.Principal{})
	_, ok := response.(*subnetApi.SubnetLoginDefault)
	suite.assert.True(ok)
}

func (suite *AdminSubnetTestSuite) TestSubnetLoginResponseWithApiKeyError() {
	params, _ := suite.initSubnetLoginRequest("mock", "", "")
	res, err := subnetLoginResponse(context.TODO(), suite.adminClient, params)
	suite.assert.NotNil(err)
	suite.assert.Nil(res)
}

func (suite *AdminSubnetTestSuite) TestSubnetLoginResponseWithCredentialsError() {
	params, _ := suite.initSubnetLoginRequest("", "mock", "mock")
	res, err := subnetLoginResponse(context.TODO(), suite.adminClient, params)
	suite.assert.NotNil(err)
	suite.assert.Nil(res)
}

func (suite *AdminSubnetTestSuite) initSubnetLoginRequest(apiKey, username, password string) (params subnetApi.SubnetLoginParams, api operations.ConsoleAPI) {
	registerSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Body = &models.SubnetLoginRequest{}
	params.Body.APIKey = apiKey
	params.Body.Username = username
	params.Body.Password = password
	return params, api
}

func (suite *AdminSubnetTestSuite) TestSubnetLoginMFAWithSubnetClientError() {
	params, api := suite.initSubnetLoginMFARequest("", "", "")
	response := api.SubnetSubnetLoginMFAHandler.Handle(params, &models.Principal{})
	_, ok := response.(*subnetApi.SubnetLoginMFADefault)
	suite.assert.True(ok)
}

func (suite *AdminSubnetTestSuite) TestSubnetLoginWithMFAResponseError() {
	params, _ := suite.initSubnetLoginMFARequest("mock", "mock", "mock")
	res, err := subnetLoginWithMFAResponse(context.TODO(), suite.adminClient, params)
	suite.assert.NotNil(err)
	suite.assert.Nil(res)
}

func (suite *AdminSubnetTestSuite) initSubnetLoginMFARequest(username, mfaToken, otp string) (params subnetApi.SubnetLoginMFAParams, api operations.ConsoleAPI) {
	registerSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Body = &models.SubnetLoginMFARequest{}
	params.Body.Username = &username
	params.Body.MfaToken = &mfaToken
	params.Body.Otp = &otp
	return params, api
}

func (suite *AdminSubnetTestSuite) TestSubnetRegisterClientError() {
	params, api := suite.initSubnetRegisterRequest("", "")
	response := api.SubnetSubnetRegisterHandler.Handle(params, &models.Principal{})
	_, ok := response.(*subnetApi.SubnetRegisterDefault)
	suite.assert.True(ok)
}

func (suite *AdminSubnetTestSuite) TestSubnetRegisterResponseError() {
	params, _ := suite.initSubnetRegisterRequest("mock", "mock")
	err := subnetRegisterResponse(context.TODO(), suite.adminClient, params)
	suite.assert.NotNil(err)
}

func (suite *AdminSubnetTestSuite) initSubnetRegisterRequest(token, accountID string) (params subnetApi.SubnetRegisterParams, api operations.ConsoleAPI) {
	registerSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Body = &models.SubnetRegisterRequest{}
	params.Body.Token = &token
	params.Body.AccountID = &accountID
	return params, api
}

func (suite *AdminSubnetTestSuite) TestSubnetInfoError() {
	params, api := suite.initSubnetInfoRequest()
	response := api.SubnetSubnetInfoHandler.Handle(params, &models.Principal{})
	_, ok := response.(*subnetApi.SubnetInfoDefault)
	suite.assert.True(ok)
}

func (suite *AdminSubnetTestSuite) initSubnetInfoRequest() (params subnetApi.SubnetInfoParams, api operations.ConsoleAPI) {
	registerSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *AdminSubnetTestSuite) TestSubnetRegTokenError() {
	params, api := suite.initSubnetRegTokenRequest()
	response := api.SubnetSubnetRegTokenHandler.Handle(params, &models.Principal{})
	_, ok := response.(*subnetApi.SubnetRegTokenDefault)
	suite.assert.True(ok)
}

func (suite *AdminSubnetTestSuite) TestSubnetRegTokenResponse() {
	res, err := subnetRegTokenResponse(context.TODO(), suite.adminClient)
	suite.assert.Nil(err)
	suite.assert.NotEqual("", res)
}

func (suite *AdminSubnetTestSuite) initSubnetRegTokenRequest() (params subnetApi.SubnetRegTokenParams, api operations.ConsoleAPI) {
	registerSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *AdminSubnetTestSuite) TestSubnetAPIKeyWithClientError() {
	params, api := suite.initSubnetAPIKeyRequest()
	response := api.SubnetSubnetAPIKeyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*subnetApi.SubnetAPIKeyDefault)
	suite.assert.True(ok)
}

func (suite *AdminSubnetTestSuite) TestSubnetAPIKeyResponseError() {
	params, _ := suite.initSubnetAPIKeyRequest()
	res, err := subnetAPIKeyResponse(context.TODO(), suite.adminClient, params)
	suite.assert.NotNil(err)
	suite.assert.Nil(res)
}

func (suite *AdminSubnetTestSuite) initSubnetAPIKeyRequest() (params subnetApi.SubnetAPIKeyParams, api operations.ConsoleAPI) {
	registerSubnetHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.HTTPRequest.URL = &url.URL{}
	return params, api
}

func TestAdminSubnet(t *testing.T) {
	suite.Run(t, new(AdminSubnetTestSuite))
}

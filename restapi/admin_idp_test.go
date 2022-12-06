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

package restapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/idp"
	"github.com/minio/madmin-go/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

func (ac adminClientMock) addOrUpdateIDPConfig(ctx context.Context, idpType, cfgName, cfgData string, update bool) (restart bool, err error) {
	return true, nil
}

func (ac adminClientMock) listIDPConfig(ctx context.Context, idpType string) ([]madmin.IDPListItem, error) {
	return []madmin.IDPListItem{{Name: "mock"}}, nil
}

func (ac adminClientMock) deleteIDPConfig(ctx context.Context, idpType, cfgName string) (restart bool, err error) {
	return true, nil
}

func (ac adminClientMock) getIDPConfig(ctx context.Context, cfgType, cfgName string) (c madmin.IDPConfig, err error) {
	return madmin.IDPConfig{Info: []madmin.IDPCfgInfo{{Key: "mock", Value: "mock"}}}, nil
}

type IDPTestSuite struct {
	suite.Suite
	assert        *assert.Assertions
	currentServer string
	isServerSet   bool
	server        *httptest.Server
	adminClient   adminClientMock
}

func (suite *IDPTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.adminClient = adminClientMock{}
	minioServiceRestartMock = func(ctx context.Context) error {
		return nil
	}
}

func (suite *IDPTestSuite) SetupTest() {
	suite.server = httptest.NewServer(http.HandlerFunc(suite.serverHandler))
	suite.currentServer, suite.isServerSet = os.LookupEnv(ConsoleMinIOServer)
	os.Setenv(ConsoleMinIOServer, suite.server.URL)
}

func (suite *IDPTestSuite) serverHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(400)
}

func (suite *IDPTestSuite) TearDownSuite() {
}

func (suite *IDPTestSuite) TearDownTest() {
	if suite.isServerSet {
		os.Setenv(ConsoleMinIOServer, suite.currentServer)
	} else {
		os.Unsetenv(ConsoleMinIOServer)
	}
}

func (suite *IDPTestSuite) TestRegisterIDPHandlers() {
	api := &operations.ConsoleAPI{}
	suite.assertHandlersAreNil(api)
	registerIDPHandlers(api)
	suite.assertHandlersAreNotNil(api)
}

func (suite *IDPTestSuite) assertHandlersAreNil(api *operations.ConsoleAPI) {
	suite.assert.Nil(api.IdpCreateConfigurationHandler)
	suite.assert.Nil(api.IdpListConfigurationsHandler)
	suite.assert.Nil(api.IdpUpdateConfigurationHandler)
	suite.assert.Nil(api.IdpGetConfigurationHandler)
	suite.assert.Nil(api.IdpGetConfigurationHandler)
	suite.assert.Nil(api.IdpDeleteConfigurationHandler)
}

func (suite *IDPTestSuite) assertHandlersAreNotNil(api *operations.ConsoleAPI) {
	suite.assert.NotNil(api.IdpCreateConfigurationHandler)
	suite.assert.NotNil(api.IdpListConfigurationsHandler)
	suite.assert.NotNil(api.IdpUpdateConfigurationHandler)
	suite.assert.NotNil(api.IdpGetConfigurationHandler)
	suite.assert.NotNil(api.IdpGetConfigurationHandler)
	suite.assert.NotNil(api.IdpDeleteConfigurationHandler)
}

func (suite *IDPTestSuite) TestCreateIDPConfigurationHandlerWithError() {
	params, api := suite.initCreateIDPConfigurationRequest()
	response := api.IdpCreateConfigurationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*idp.CreateConfigurationDefault)
	suite.assert.True(ok)
}

func (suite *IDPTestSuite) initCreateIDPConfigurationRequest() (params idp.CreateConfigurationParams, api operations.ConsoleAPI) {
	registerIDPHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Body = &models.IdpServerConfiguration{}
	params.Type = "ldap"
	return params, api
}

func (suite *IDPTestSuite) TestCreateIDPConfigurationWithoutError() {
	ctx := context.Background()
	_, err := createOrUpdateIDPConfig(ctx, "ldap", "", "", false, suite.adminClient)
	suite.assert.Nil(err)
}

func (suite *IDPTestSuite) TestCreateIDPConfigurationWithWrongType() {
	ctx := context.Background()
	_, err := createOrUpdateIDPConfig(ctx, "", "", "", false, suite.adminClient)
	suite.assert.NotNil(err)
}

func (suite *IDPTestSuite) TestUpdateIDPConfigurationHandlerWithError() {
	params, api := suite.initUpdateIDPConfigurationRequest()
	response := api.IdpUpdateConfigurationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*idp.UpdateConfigurationDefault)
	suite.assert.True(ok)
}

func (suite *IDPTestSuite) initUpdateIDPConfigurationRequest() (params idp.UpdateConfigurationParams, api operations.ConsoleAPI) {
	registerIDPHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Body = &models.IdpServerConfiguration{}
	params.Type = "ldap"
	return params, api
}

func (suite *IDPTestSuite) TestUpdateIDPConfigurationWithoutError() {
	ctx := context.Background()
	_, err := createOrUpdateIDPConfig(ctx, "ldap", "", "", true, suite.adminClient)
	suite.assert.Nil(err)
}

func (suite *IDPTestSuite) TestUpdateIDPConfigurationWithWrongType() {
	ctx := context.Background()
	_, err := createOrUpdateIDPConfig(ctx, "", "", "", true, suite.adminClient)
	suite.assert.NotNil(err)
}

func (suite *IDPTestSuite) TestListIDPConfigurationHandlerWithError() {
	params, api := suite.initListIDPConfigurationsRequest()
	response := api.IdpListConfigurationsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*idp.ListConfigurationsDefault)
	suite.assert.True(ok)
}

func (suite *IDPTestSuite) initListIDPConfigurationsRequest() (params idp.ListConfigurationsParams, api operations.ConsoleAPI) {
	registerIDPHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Type = "ldap"
	return params, api
}

func (suite *IDPTestSuite) TestListIDPConfigurationsWithoutError() {
	ctx := context.Background()
	res, err := listIDPConfigurations(ctx, "ldap", suite.adminClient)
	suite.assert.NotNil(res)
	suite.assert.Nil(err)
}

func (suite *IDPTestSuite) TestListIDPConfigurationsWithWrongType() {
	ctx := context.Background()
	res, err := listIDPConfigurations(ctx, "", suite.adminClient)
	suite.assert.Nil(res)
	suite.assert.NotNil(err)
}

func (suite *IDPTestSuite) TestDeleteIDPConfigurationHandlerWithError() {
	params, api := suite.initDeleteIDPConfigurationRequest()
	response := api.IdpDeleteConfigurationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*idp.DeleteConfigurationDefault)
	suite.assert.True(ok)
}

func (suite *IDPTestSuite) initDeleteIDPConfigurationRequest() (params idp.DeleteConfigurationParams, api operations.ConsoleAPI) {
	registerIDPHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Type = "ldap"
	return params, api
}

func (suite *IDPTestSuite) TestDeleteIDPConfigurationWithoutError() {
	ctx := context.Background()
	_, err := deleteIDPConfig(ctx, "ldap", "", suite.adminClient)
	suite.assert.Nil(err)
}

func (suite *IDPTestSuite) TestDeleteIDPConfigurationWithWrongType() {
	ctx := context.Background()
	_, err := deleteIDPConfig(ctx, "", "", suite.adminClient)
	suite.assert.NotNil(err)
}

func (suite *IDPTestSuite) TestGetIDPConfigurationHandlerWithError() {
	params, api := suite.initGetIDPConfigurationRequest()
	response := api.IdpGetConfigurationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*idp.GetConfigurationDefault)
	suite.assert.True(ok)
}

func (suite *IDPTestSuite) initGetIDPConfigurationRequest() (params idp.GetConfigurationParams, api operations.ConsoleAPI) {
	registerIDPHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Type = "ldap"
	return params, api
}

func (suite *IDPTestSuite) TestGetIDPConfigurationWithoutError() {
	ctx := context.Background()
	res, err := getIDPConfiguration(ctx, "ldap", "", suite.adminClient)
	suite.assert.NotNil(res)
	suite.assert.Nil(err)
}

func (suite *IDPTestSuite) TestGetIDPConfigurationWithWrongType() {
	ctx := context.Background()
	res, err := getIDPConfiguration(ctx, "", "", suite.adminClient)
	suite.assert.Nil(res)
	suite.assert.NotNil(err)
}

func TestIDP(t *testing.T) {
	suite.Run(t, new(IDPTestSuite))
}

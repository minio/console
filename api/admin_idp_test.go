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
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/madmin-go/v3"

	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/idp"
	"github.com/minio/console/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type IDPTestSuite struct {
	suite.Suite
	assert        *assert.Assertions
	currentServer string
	isServerSet   bool
	server        *httptest.Server
	adminClient   AdminClientMock
}

func (suite *IDPTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.adminClient = AdminClientMock{}
	minioServiceRestartMock = func(_ context.Context) error {
		return nil
	}
}

func (suite *IDPTestSuite) SetupTest() {
	suite.server = httptest.NewServer(http.HandlerFunc(suite.serverHandler))
	suite.currentServer, suite.isServerSet = os.LookupEnv(ConsoleMinIOServer)
	os.Setenv(ConsoleMinIOServer, suite.server.URL)
}

func (suite *IDPTestSuite) serverHandler(w http.ResponseWriter, _ *http.Request) {
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

func TestGetEntitiesResult(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "getEntitiesResult()"

	usersList := []string{"user1", "user2", "user3"}
	policiesList := []string{"policy1", "policy2", "policy3"}
	groupsList := []string{"group1", "group3", "group5"}

	policyMap := []madmin.PolicyEntities{
		{Policy: "testPolicy0", Groups: groupsList, Users: usersList},
		{Policy: "testPolicy1", Groups: groupsList, Users: usersList},
	}

	usersMap := []madmin.UserPolicyEntities{
		{User: "testUser0", Policies: policiesList},
		{User: "testUser1", Policies: policiesList},
	}

	groupsMap := []madmin.GroupPolicyEntities{
		{Group: "group0", Policies: policiesList},
		{Group: "group1", Policies: policiesList},
	}

	// Test-1: getEntitiesResult list all information provided
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mockResponse := madmin.PolicyEntitiesResult{
		PolicyMappings: policyMap,
		GroupMappings:  groupsMap,
		UserMappings:   usersMap,
	}
	minioGetLDAPPolicyEntitiesMock = func(_ context.Context, _ madmin.PolicyEntitiesQuery) (madmin.PolicyEntitiesResult, error) {
		return mockResponse, nil
	}

	entities, err := getEntitiesResult(ctx, client, usersList, groupsList, policiesList)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	for i, groupIt := range entities.Groups {
		assert.Equal(fmt.Sprintf("group%d", i), groupIt.Group)

		for i, polItm := range groupIt.Policies {
			assert.Equal(policiesList[i], polItm)
		}
	}

	for i, usrIt := range entities.Users {
		assert.Equal(fmt.Sprintf("testUser%d", i), usrIt.User)

		for i, polItm := range usrIt.Policies {
			assert.Equal(policiesList[i], polItm)
		}
	}

	for i, policyIt := range entities.Policies {
		assert.Equal(fmt.Sprintf("testPolicy%d", i), policyIt.Policy)

		for i, userItm := range policyIt.Users {
			assert.Equal(usersList[i], userItm)
		}

		for i, grItm := range policyIt.Groups {
			assert.Equal(groupsList[i], grItm)
		}
	}

	// Test-2: getEntitiesResult error is returned from getLDAPPolicyEntities()
	minioGetLDAPPolicyEntitiesMock = func(_ context.Context, _ madmin.PolicyEntitiesQuery) (madmin.PolicyEntitiesResult, error) {
		return madmin.PolicyEntitiesResult{}, errors.New("error")
	}

	_, err = getEntitiesResult(ctx, client, usersList, groupsList, policiesList)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

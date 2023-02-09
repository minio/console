// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	release "github.com/minio/console/restapi/operations/release"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type ReleasesTestSuite struct {
	suite.Suite
	assert        *assert.Assertions
	currentServer string
	isServerSet   bool
	getServer     *httptest.Server
	withError     bool
}

func (suite *ReleasesTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.getServer = httptest.NewServer(http.HandlerFunc(suite.getHandler))
	suite.currentServer, suite.isServerSet = os.LookupEnv(releaseServiceHostEnvVar)
	os.Setenv(releaseServiceHostEnvVar, suite.getServer.URL)
}

func (suite *ReleasesTestSuite) TearDownSuite() {
	if suite.isServerSet {
		os.Setenv(releaseServiceHostEnvVar, suite.currentServer)
	} else {
		os.Unsetenv(releaseServiceHostEnvVar)
	}
}

func (suite *ReleasesTestSuite) getHandler(
	w http.ResponseWriter, r *http.Request,
) {
	if suite.withError {
		w.WriteHeader(400)
	} else {
		w.WriteHeader(200)
		response := []*models.ReleaseListResponse{{}}
		bytes, _ := json.Marshal(response)
		fmt.Fprintf(w, string(bytes))
	}
}

func (suite *ReleasesTestSuite) TestRegisterReleasesHandlers() {
	api := &operations.ConsoleAPI{}
	suite.assert.Nil(api.ReleaseListReleasesHandler)
	registerReleasesHandlers(api)
	suite.assert.NotNil(api.ReleaseListReleasesHandler)
}

func (suite *ReleasesTestSuite) TestGetReleasesWithError() {
	api := &operations.ConsoleAPI{}
	current := "mock"
	registerReleasesHandlers(api)
	params := release.NewListReleasesParams()
	params.Current = &current
	params.HTTPRequest = &http.Request{}
	suite.withError = true
	response := api.ReleaseListReleasesHandler.Handle(params, &models.Principal{})
	_, ok := response.(*release.ListReleasesDefault)
	suite.assert.True(ok)
}

func (suite *ReleasesTestSuite) TestGetReleasesWithoutError() {
	api := &operations.ConsoleAPI{}
	registerReleasesHandlers(api)
	params := release.NewListReleasesParams()
	params.HTTPRequest = &http.Request{}
	suite.withError = false
	response := api.ReleaseListReleasesHandler.Handle(params, &models.Principal{})
	_, ok := response.(*release.ListReleasesOK)
	suite.assert.True(ok)
}

// func (suite *ReleasesTestSuite) TestPostMPIntegrationHandlerWithError() {
// 	api := &operations.OperatorAPI{}
// 	registerMarketplaceHandlers(api)
// 	params := operator_api.NewPostMPIntegrationParams()
// 	params.Body = &models.MpIntegration{Email: ""}
// 	params.HTTPRequest = &http.Request{}
// 	params.HTTPRequest.Header = map[string][]string{}
// 	params.HTTPRequest.AddCookie(&http.Cookie{Value: "token", Name: "token"})
// 	response := api.OperatorAPIPostMPIntegrationHandler.Handle(params, &models.Principal{})
// 	_, ok := response.(*operator_api.PostMPIntegrationDefault)
// 	suite.assert.True(ok)
// }

// func (suite *ReleasesTestSuite) TestGetMPEmailWithError() {
// 	testWithError = true
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()
// 	email, err := getMPEmail(ctx, &suite.kClient)
// 	suite.assert.NotNil(err)
// 	suite.assert.Empty(email)
// }

// func (suite *ReleasesTestSuite) TestGetMPEmailNoError() {
// 	testWithError = false
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()
// 	isSet, err := getMPEmail(ctx, &suite.kClient)
// 	suite.assert.Nil(err)
// 	suite.assert.True(isSet)
// }

// func (suite *ReleasesTestSuite) TestSetMPIntegrationNoEmail() {
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()
// 	err := setMPIntegration(ctx, "", false, &suite.kClient)
// 	suite.assert.NotNil(err)
// }

// func (suite *ReleasesTestSuite) TestSetMPIntegrationWithError() {
// 	testWithError = true
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()
// 	os.Setenv(mpHostEnvVar, "  ")
// 	err := setMPIntegration(ctx, "mock@mock.com", false, &suite.kClient)
// 	suite.assert.NotNil(err)
// 	os.Unsetenv(mpHostEnvVar)
// }

// func (suite *ReleasesTestSuite) TestSetMPIntegrationNoError() {
// 	testWithError = false
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()
// 	os.Setenv(mpHostEnvVar, suite.getServer.URL)
// 	err := setMPIntegration(ctx, "mock@mock.com", false, &suite.kClient)
// 	suite.assert.Nil(err)
// 	os.Unsetenv(mpHostEnvVar)
// }

// func (suite *ReleasesTestSuite) TestSetMPIntegrationWithRequestError() {
// 	testWithError = false
// 	testServerWithError = true
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()
// 	os.Setenv(mpHostEnvVar, suite.getServer.URL)
// 	err := setMPIntegration(ctx, "mock@mock.com", false, &suite.kClient)
// 	suite.assert.NotNil(err)
// 	os.Unsetenv(mpHostEnvVar)
// }

func TestReleases(t *testing.T) {
	suite.Run(t, new(ReleasesTestSuite))
}

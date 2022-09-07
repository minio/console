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
	"net/http"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	kmsAPI "github.com/minio/console/restapi/operations/k_m_s"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type KMSTestSuite struct {
	suite.Suite
	assert *assert.Assertions
}

func (suite *KMSTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
}

func (suite *KMSTestSuite) TearDownSuite() {
}

func (suite *KMSTestSuite) TestRegisterKMSHandlers() {
	api := &operations.ConsoleAPI{}
	suite.assertHandlersAreNil(api)
	registerKMSHandlers(api)
	suite.assertHandlersAreNotNil(api)
}

func (suite *KMSTestSuite) assertHandlersAreNil(api *operations.ConsoleAPI) {
	suite.assert.Nil(api.KmsKMSStatusHandler)
	suite.assert.Nil(api.KmsKMSCreateKeyHandler)
	suite.assert.Nil(api.KmsKMSImportKeyHandler)
	suite.assert.Nil(api.KmsKMSListKeysHandler)
	suite.assert.Nil(api.KmsKMSKeyStatusHandler)
	suite.assert.Nil(api.KmsKMSDeleteKeyHandler)
	suite.assert.Nil(api.KmsKMSSetPolicyHandler)
	suite.assert.Nil(api.KmsKMSAssignPolicyHandler)
	suite.assert.Nil(api.KmsKMSDescribePolicyHandler)
	suite.assert.Nil(api.KmsKMSGetPolicyHandler)
	suite.assert.Nil(api.KmsKMSListPoliciesHandler)
	suite.assert.Nil(api.KmsKMSDeletePolicyHandler)
	suite.assert.Nil(api.KmsKMSDescribeIdentityHandler)
	suite.assert.Nil(api.KmsKMSDescribeSelfIdentityHandler)
	suite.assert.Nil(api.KmsKMSListIdentitiesHandler)
	suite.assert.Nil(api.KmsKMSDeleteIdentityHandler)
}

func (suite *KMSTestSuite) assertHandlersAreNotNil(api *operations.ConsoleAPI) {
	suite.assert.NotNil(api.KmsKMSStatusHandler)
	suite.assert.NotNil(api.KmsKMSCreateKeyHandler)
	suite.assert.NotNil(api.KmsKMSImportKeyHandler)
	suite.assert.NotNil(api.KmsKMSListKeysHandler)
	suite.assert.NotNil(api.KmsKMSKeyStatusHandler)
	suite.assert.NotNil(api.KmsKMSDeleteKeyHandler)
	suite.assert.NotNil(api.KmsKMSSetPolicyHandler)
	suite.assert.NotNil(api.KmsKMSAssignPolicyHandler)
	suite.assert.NotNil(api.KmsKMSDescribePolicyHandler)
	suite.assert.NotNil(api.KmsKMSGetPolicyHandler)
	suite.assert.NotNil(api.KmsKMSListPoliciesHandler)
	suite.assert.NotNil(api.KmsKMSDeletePolicyHandler)
	suite.assert.NotNil(api.KmsKMSDescribeIdentityHandler)
	suite.assert.NotNil(api.KmsKMSDescribeSelfIdentityHandler)
	suite.assert.NotNil(api.KmsKMSListIdentitiesHandler)
	suite.assert.NotNil(api.KmsKMSDeleteIdentityHandler)
}

func (suite *KMSTestSuite) TestKMSStatusHandlerWithError() {
	params, api := suite.initKMSStatusRequest()
	response := api.KmsKMSStatusHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSStatusDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSStatusRequest() (params kmsAPI.KMSStatusParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSCreateKeyHandlerWithError() {
	params, api := suite.initKMSCreateKeyRequest()
	response := api.KmsKMSCreateKeyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSCreateKeyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSCreateKeyRequest() (params kmsAPI.KMSCreateKeyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSImportKeyHandlerWithError() {
	params, api := suite.initKMSImportKeyRequest()
	response := api.KmsKMSImportKeyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSImportKeyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSImportKeyRequest() (params kmsAPI.KMSImportKeyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSListKeysHandlerWithError() {
	params, api := suite.initKMSListKeysRequest()
	response := api.KmsKMSListKeysHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSListKeysDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSListKeysRequest() (params kmsAPI.KMSListKeysParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSKeyStatusHandlerWithError() {
	params, api := suite.initKMSKeyStatusRequest()
	response := api.KmsKMSKeyStatusHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSKeyStatusDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSKeyStatusRequest() (params kmsAPI.KMSKeyStatusParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSDeleteKeyHandlerWithError() {
	params, api := suite.initKMSDeleteKeyRequest()
	response := api.KmsKMSDeleteKeyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSDeleteKeyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSDeleteKeyRequest() (params kmsAPI.KMSDeleteKeyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSSetPolicyHandlerWithError() {
	params, api := suite.initKMSSetPolicyRequest()
	response := api.KmsKMSSetPolicyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSSetPolicyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSSetPolicyRequest() (params kmsAPI.KMSSetPolicyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSAssignPolicyHandlerWithError() {
	params, api := suite.initKMSAssignPolicyRequest()
	response := api.KmsKMSAssignPolicyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSAssignPolicyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSAssignPolicyRequest() (params kmsAPI.KMSAssignPolicyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSDescribePolicyHandlerWithError() {
	params, api := suite.initKMSDescribePolicyRequest()
	response := api.KmsKMSDescribePolicyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSDescribePolicyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSDescribePolicyRequest() (params kmsAPI.KMSDescribePolicyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSGetPolicyHandlerWithError() {
	params, api := suite.initKMSGetPolicyRequest()
	response := api.KmsKMSGetPolicyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSGetPolicyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSGetPolicyRequest() (params kmsAPI.KMSGetPolicyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSListPoliciesHandlerWithError() {
	params, api := suite.initKMSListPoliciesRequest()
	response := api.KmsKMSListPoliciesHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSListPoliciesDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSListPoliciesRequest() (params kmsAPI.KMSListPoliciesParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSDeletePolicyHandlerWithError() {
	params, api := suite.initKMSDeletePolicyRequest()
	response := api.KmsKMSDeletePolicyHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSDeletePolicyDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSDeletePolicyRequest() (params kmsAPI.KMSDeletePolicyParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSDescribeIdentityHandlerWithError() {
	params, api := suite.initKMSDescribeIdentityRequest()
	response := api.KmsKMSDescribeIdentityHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSDescribeIdentityDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSDescribeIdentityRequest() (params kmsAPI.KMSDescribeIdentityParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSDescribeSelfIdentityHandlerWithError() {
	params, api := suite.initKMSDescribeSelfIdentityRequest()
	response := api.KmsKMSDescribeSelfIdentityHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSDescribeSelfIdentityDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSDescribeSelfIdentityRequest() (params kmsAPI.KMSDescribeSelfIdentityParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSListIdentitiesHandlerWithError() {
	params, api := suite.initKMSListIdentitiesRequest()
	response := api.KmsKMSListIdentitiesHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSListIdentitiesDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSListIdentitiesRequest() (params kmsAPI.KMSListIdentitiesParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *KMSTestSuite) TestKMSDeleteIdentityHandlerWithError() {
	params, api := suite.initKMSDeleteIdentityRequest()
	response := api.KmsKMSDeleteIdentityHandler.Handle(params, &models.Principal{})
	_, ok := response.(*kmsAPI.KMSDeleteIdentityDefault)
	suite.assert.True(ok)
}

func (suite *KMSTestSuite) initKMSDeleteIdentityRequest() (params kmsAPI.KMSDeleteIdentityParams, api operations.ConsoleAPI) {
	registerKMSHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func TestKMS(t *testing.T) {
	suite.Run(t, new(KMSTestSuite))
}

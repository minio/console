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

package operatorapi

import (
	"net/http"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type TenantTestSuite struct {
	suite.Suite
	assert   *assert.Assertions
	opClient opClientMock
}

func (suite *TenantTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.opClient = opClientMock{}
}

func (suite *TenantTestSuite) SetupTest() {
}

func (suite *TenantTestSuite) TearDownSuite() {
}

func (suite *TenantTestSuite) TearDownTest() {
}

func (suite *TenantTestSuite) TestRegisterTenantLogsHandlers() {
	api := &operations.OperatorAPI{}
	suite.assertHandlersAreNil(api)
	registerTenantHandlers(api)
	suite.assertHandlersAreNotNil(api)
}

func (suite *TenantTestSuite) assertHandlersAreNil(api *operations.OperatorAPI) {
	suite.assert.Nil(api.OperatorAPICreateTenantHandler)
	suite.assert.Nil(api.OperatorAPIListAllTenantsHandler)
	suite.assert.Nil(api.OperatorAPIListTenantsHandler)
	suite.assert.Nil(api.OperatorAPITenantDetailsHandler)
	suite.assert.Nil(api.OperatorAPITenantConfigurationHandler)
	suite.assert.Nil(api.OperatorAPIUpdateTenantConfigurationHandler)
	suite.assert.Nil(api.OperatorAPITenantSecurityHandler)
	suite.assert.Nil(api.OperatorAPIUpdateTenantSecurityHandler)
	suite.assert.Nil(api.OperatorAPISetTenantAdministratorsHandler)
	suite.assert.Nil(api.OperatorAPITenantIdentityProviderHandler)
	suite.assert.Nil(api.OperatorAPIUpdateTenantIdentityProviderHandler)
	suite.assert.Nil(api.OperatorAPIDeleteTenantHandler)
	suite.assert.Nil(api.OperatorAPIDeletePodHandler)
	suite.assert.Nil(api.OperatorAPIUpdateTenantHandler)
	suite.assert.Nil(api.OperatorAPITenantAddPoolHandler)
	suite.assert.Nil(api.OperatorAPIGetTenantUsageHandler)
	suite.assert.Nil(api.OperatorAPIGetTenantPodsHandler)
	suite.assert.Nil(api.OperatorAPIGetPodLogsHandler)
	suite.assert.Nil(api.OperatorAPIGetPodEventsHandler)
	suite.assert.Nil(api.OperatorAPIDescribePodHandler)
	suite.assert.Nil(api.OperatorAPIGetTenantMonitoringHandler)
	suite.assert.Nil(api.OperatorAPISetTenantMonitoringHandler)
	suite.assert.Nil(api.OperatorAPITenantUpdatePoolsHandler)
	suite.assert.Nil(api.OperatorAPITenantUpdateCertificateHandler)
	suite.assert.Nil(api.OperatorAPITenantUpdateEncryptionHandler)
	suite.assert.Nil(api.OperatorAPITenantDeleteEncryptionHandler)
	suite.assert.Nil(api.OperatorAPITenantEncryptionInfoHandler)
	suite.assert.Nil(api.OperatorAPIGetTenantYAMLHandler)
	suite.assert.Nil(api.OperatorAPIPutTenantYAMLHandler)
	suite.assert.Nil(api.OperatorAPIGetTenantEventsHandler)
	suite.assert.Nil(api.OperatorAPIUpdateTenantDomainsHandler)
}

func (suite *TenantTestSuite) assertHandlersAreNotNil(api *operations.OperatorAPI) {
	suite.assert.NotNil(api.OperatorAPICreateTenantHandler)
	suite.assert.NotNil(api.OperatorAPIListAllTenantsHandler)
	suite.assert.NotNil(api.OperatorAPIListTenantsHandler)
	suite.assert.NotNil(api.OperatorAPITenantDetailsHandler)
	suite.assert.NotNil(api.OperatorAPITenantConfigurationHandler)
	suite.assert.NotNil(api.OperatorAPIUpdateTenantConfigurationHandler)
	suite.assert.NotNil(api.OperatorAPITenantSecurityHandler)
	suite.assert.NotNil(api.OperatorAPIUpdateTenantSecurityHandler)
	suite.assert.NotNil(api.OperatorAPISetTenantAdministratorsHandler)
	suite.assert.NotNil(api.OperatorAPITenantIdentityProviderHandler)
	suite.assert.NotNil(api.OperatorAPIUpdateTenantIdentityProviderHandler)
	suite.assert.NotNil(api.OperatorAPIDeleteTenantHandler)
	suite.assert.NotNil(api.OperatorAPIDeletePodHandler)
	suite.assert.NotNil(api.OperatorAPIUpdateTenantHandler)
	suite.assert.NotNil(api.OperatorAPITenantAddPoolHandler)
	suite.assert.NotNil(api.OperatorAPIGetTenantUsageHandler)
	suite.assert.NotNil(api.OperatorAPIGetTenantPodsHandler)
	suite.assert.NotNil(api.OperatorAPIGetPodLogsHandler)
	suite.assert.NotNil(api.OperatorAPIGetPodEventsHandler)
	suite.assert.NotNil(api.OperatorAPIDescribePodHandler)
	suite.assert.NotNil(api.OperatorAPIGetTenantMonitoringHandler)
	suite.assert.NotNil(api.OperatorAPISetTenantMonitoringHandler)
	suite.assert.NotNil(api.OperatorAPITenantUpdatePoolsHandler)
	suite.assert.NotNil(api.OperatorAPITenantUpdateCertificateHandler)
	suite.assert.NotNil(api.OperatorAPITenantUpdateEncryptionHandler)
	suite.assert.NotNil(api.OperatorAPITenantDeleteEncryptionHandler)
	suite.assert.NotNil(api.OperatorAPITenantEncryptionInfoHandler)
	suite.assert.NotNil(api.OperatorAPIGetTenantYAMLHandler)
	suite.assert.NotNil(api.OperatorAPIPutTenantYAMLHandler)
	suite.assert.NotNil(api.OperatorAPIGetTenantEventsHandler)
	suite.assert.NotNil(api.OperatorAPIUpdateTenantDomainsHandler)
}

func (suite *TenantTestSuite) TestCreateTenantHandlerWithError() {
	params, api := suite.initCreateTenantRequest()
	response := api.OperatorAPICreateTenantHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.CreateTenantDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initCreateTenantRequest() (params operator_api.CreateTenantParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	ns := "mock-namespace"
	name := "mock-tenant-name"
	params.Body = &models.CreateTenantRequest{
		Image:     "",
		Namespace: &ns,
		Name:      &name,
	}
	return params, api
}

func (suite *TenantTestSuite) TestListAllTenantsHandlerWithoutError() {
	params, api := suite.initListAllTenantsRequest()
	response := api.OperatorAPIListAllTenantsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.ListTenantsOK)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initListAllTenantsRequest() (params operator_api.ListAllTenantsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *TenantTestSuite) TestListTenantsHandlerWithoutError() {
	params, api := suite.initListTenantsRequest()
	response := api.OperatorAPIListTenantsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.ListTenantsOK)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initListTenantsRequest() (params operator_api.ListTenantsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	return params, api
}

func (suite *TenantTestSuite) TestTenantDetailsHandlerWithError() {
	params, api := suite.initTenantDetailsRequest()
	response := api.OperatorAPITenantDetailsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantDetailsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantDetailsRequest() (params operator_api.TenantDetailsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantConfigurationHandlerWithError() {
	params, api := suite.initTenantConfigurationRequest()
	response := api.OperatorAPITenantConfigurationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantConfigurationDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantConfigurationRequest() (params operator_api.TenantConfigurationParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestUpdateTenantConfigurationHandlerWithError() {
	params, api := suite.initUpdateTenantConfigurationRequest()
	response := api.OperatorAPIUpdateTenantConfigurationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.UpdateTenantConfigurationDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initUpdateTenantConfigurationRequest() (params operator_api.UpdateTenantConfigurationParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantSecurityHandlerWithError() {
	params, api := suite.initTenantSecurityRequest()
	response := api.OperatorAPITenantSecurityHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantSecurityDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantSecurityRequest() (params operator_api.TenantSecurityParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestUpdateTenantSecurityHandlerWithError() {
	params, api := suite.initUpdateTenantSecurityRequest()
	response := api.OperatorAPIUpdateTenantSecurityHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.UpdateTenantSecurityDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initUpdateTenantSecurityRequest() (params operator_api.UpdateTenantSecurityParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestSetTenantAdministratorsHandlerWithError() {
	params, api := suite.initSetTenantAdministratorsRequest()
	response := api.OperatorAPISetTenantAdministratorsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.SetTenantAdministratorsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initSetTenantAdministratorsRequest() (params operator_api.SetTenantAdministratorsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantIdentityProviderHandlerWithError() {
	params, api := suite.initTenantIdentityProviderRequest()
	response := api.OperatorAPITenantIdentityProviderHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantIdentityProviderDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantIdentityProviderRequest() (params operator_api.TenantIdentityProviderParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestUpdateTenantIdentityProviderHandlerWithError() {
	params, api := suite.initUpdateTenantIdentityProviderRequest()
	response := api.OperatorAPIUpdateTenantIdentityProviderHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.UpdateTenantIdentityProviderDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initUpdateTenantIdentityProviderRequest() (params operator_api.UpdateTenantIdentityProviderParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestDeleteTenantHandlerWithError() {
	params, api := suite.initDeleteTenantRequest()
	response := api.OperatorAPIDeleteTenantHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.DeleteTenantDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initDeleteTenantRequest() (params operator_api.DeleteTenantParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestDeletePodHandlerWithoutError() {
	params, api := suite.initDeletePodRequest()
	response := api.OperatorAPIDeletePodHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.DeletePodNoContent)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initDeletePodRequest() (params operator_api.DeletePodParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.PodName = "mock-tenantmock-pod"
	return params, api
}

func (suite *TenantTestSuite) TestUpdateTenantHandlerWithError() {
	params, api := suite.initUpdateTenantRequest()
	response := api.OperatorAPIUpdateTenantHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.UpdateTenantDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initUpdateTenantRequest() (params operator_api.UpdateTenantParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.Body = &models.UpdateTenantRequest{
		Image: "mock-image",
	}
	return params, api
}

func (suite *TenantTestSuite) TestTenantAddPoolHandlerWithError() {
	params, api := suite.initTenantAddPoolRequest()
	response := api.OperatorAPITenantAddPoolHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantAddPoolDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantAddPoolRequest() (params operator_api.TenantAddPoolParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestGetTenantUsageHandlerWithError() {
	params, api := suite.initGetTenantUsageRequest()
	response := api.OperatorAPIGetTenantUsageHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetTenantUsageDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetTenantUsageRequest() (params operator_api.GetTenantUsageParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestGetTenantPodsHandlerWithoutError() {
	params, api := suite.initGetTenantPodsRequest()
	response := api.OperatorAPIGetTenantPodsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetTenantPodsOK)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetTenantPodsRequest() (params operator_api.GetTenantPodsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestGetPodLogsHandlerWithError() {
	params, api := suite.initGetPodLogsRequest()
	response := api.OperatorAPIGetPodLogsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetPodLogsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetPodLogsRequest() (params operator_api.GetPodLogsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.PodName = "mokc-pod"
	return params, api
}

func (suite *TenantTestSuite) TestGetPodEventsHandlerWithError() {
	params, api := suite.initGetPodEventsRequest()
	response := api.OperatorAPIGetPodEventsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetPodEventsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetPodEventsRequest() (params operator_api.GetPodEventsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.PodName = "mock-pod"
	return params, api
}

func (suite *TenantTestSuite) TestDescribePodHandlerWithError() {
	params, api := suite.initDescribePodRequest()
	response := api.OperatorAPIDescribePodHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.DescribePodDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initDescribePodRequest() (params operator_api.DescribePodParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.PodName = "mock-pod"
	return params, api
}

func (suite *TenantTestSuite) TestGetTenantMonitoringHandlerWithError() {
	params, api := suite.initGetTenantMonitoringRequest()
	response := api.OperatorAPIGetTenantMonitoringHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetTenantMonitoringDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetTenantMonitoringRequest() (params operator_api.GetTenantMonitoringParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestSetTenantMonitoringHandlerWithError() {
	params, api := suite.initSetTenantMonitoringRequest()
	response := api.OperatorAPISetTenantMonitoringHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.SetTenantMonitoringDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initSetTenantMonitoringRequest() (params operator_api.SetTenantMonitoringParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantUpdatePoolsHandlerWithError() {
	params, api := suite.initTenantUpdatePoolsRequest()
	response := api.OperatorAPITenantUpdatePoolsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantUpdatePoolsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantUpdatePoolsRequest() (params operator_api.TenantUpdatePoolsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.Body = &models.PoolUpdateRequest{
		Pools: []*models.Pool{},
	}
	return params, api
}

func (suite *TenantTestSuite) TestTenantUpdateCertificateHandlerWithError() {
	params, api := suite.initTenantUpdateCertificateRequest()
	response := api.OperatorAPITenantUpdateCertificateHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantUpdateCertificateDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantUpdateCertificateRequest() (params operator_api.TenantUpdateCertificateParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantUpdateEncryptionHandlerWithError() {
	params, api := suite.initTenantUpdateEncryptionRequest()
	response := api.OperatorAPITenantUpdateEncryptionHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantUpdateEncryptionDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantUpdateEncryptionRequest() (params operator_api.TenantUpdateEncryptionParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantDeleteEncryptionHandlerWithError() {
	params, api := suite.initTenantDeleteEncryptionRequest()
	response := api.OperatorAPITenantDeleteEncryptionHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantDeleteEncryptionDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantDeleteEncryptionRequest() (params operator_api.TenantDeleteEncryptionParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestTenantEncryptionInfoHandlerWithError() {
	params, api := suite.initTenantEncryptionInfoRequest()
	response := api.OperatorAPITenantEncryptionInfoHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.TenantEncryptionInfoDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initTenantEncryptionInfoRequest() (params operator_api.TenantEncryptionInfoParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestGetTenantYAMLHandlerWithError() {
	params, api := suite.initGetTenantYAMLRequest()
	response := api.OperatorAPIGetTenantYAMLHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetTenantYAMLDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetTenantYAMLRequest() (params operator_api.GetTenantYAMLParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestPutTenantYAMLHandlerWithError() {
	params, api := suite.initPutTenantYAMLRequest()
	response := api.OperatorAPIPutTenantYAMLHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.PutTenantYAMLDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initPutTenantYAMLRequest() (params operator_api.PutTenantYAMLParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	params.Body = &models.TenantYAML{
		Yaml: "",
	}
	return params, api
}

func (suite *TenantTestSuite) TestGetTenantEventsHandlerWithError() {
	params, api := suite.initGetTenantEventsRequest()
	response := api.OperatorAPIGetTenantEventsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetTenantEventsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initGetTenantEventsRequest() (params operator_api.GetTenantEventsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace"
	params.Tenant = "mock-tenant"
	return params, api
}

func (suite *TenantTestSuite) TestUpdateTenantDomainsHandlerWithError() {
	params, api := suite.initUpdateTenantDomainsRequest()
	response := api.OperatorAPIUpdateTenantDomainsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.UpdateTenantDomainsDefault)
	suite.assert.True(ok)
}

func (suite *TenantTestSuite) initUpdateTenantDomainsRequest() (params operator_api.UpdateTenantDomainsParams, api operations.OperatorAPI) {
	registerTenantHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.Namespace = "mock-namespace-domain"
	params.Tenant = "mock-tenant-domain"
	params.Body = &models.UpdateDomainsRequest{
		Domains: &models.DomainsConfiguration{},
	}
	return params, api
}

// func (suite *TenantTestSuite) TestGetTenantLogsInfoWithoutLogAndNoError() {
// 	tenant := suite.createMockTenant(false, true)
// 	tenantLogs := getTenantLogsInfo(tenant)
// 	suite.assert.True(tenantLogs.Disabled)
// }

// func (suite *TenantTestSuite) TestGetTenantLogsInfoWithLogAndNoError() {
// 	tenant := suite.createMockTenant(true, true)
// 	tenantLogs := getTenantLogsInfo(tenant)
// 	suite.assert.False(tenantLogs.Disabled)
// 	suite.assert.NotNil(tenantLogs.Labels)
// 	suite.assert.NotNil(tenantLogs.Annotations)
// }

// func (suite *TenantTestSuite) TestSetTenantLogsWithoutError() {
// 	opClientTenantUpdateMock = func(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error) {
// 		return tenant, nil
// 	}
// 	tenant := suite.createMockTenant(true, true)
// 	success, err := setTenantLogs(context.Background(), tenant, suite.opClient, suite.createMockParams())
// 	suite.assert.True(success)
// 	suite.assert.Nil(err)
// }

// func (suite *TenantTestSuite) TestSetTenantLogsWithoutDBAndError() {
// 	opClientTenantUpdateMock = func(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error) {
// 		return tenant, nil
// 	}
// 	tenant := suite.createMockTenant(true, false)
// 	params := suite.createMockParams()
// 	params.Data.LogDBCPURequest = ""
// 	params.Data.LogDBMemRequest = ""
// 	success, err := setTenantLogs(context.Background(), tenant, suite.opClient, params)
// 	suite.assert.True(success)
// 	suite.assert.Nil(err)
// }

// func (suite *TenantTestSuite) TestSetTenantLogsWithError() {
// 	opClientTenantUpdateMock = func(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error) {
// 		return nil, errors.New("mock-error")
// 	}
// 	tenant := suite.createMockTenant(true, true)
// 	success, err := setTenantLogs(context.Background(), tenant, suite.opClient, suite.createMockParams())
// 	suite.assert.False(success)
// 	suite.assert.NotNil(err)
// }

// func (suite *TenantTestSuite) TestEnableTenantLoggingWithoutError() {
// 	opClientTenantUpdateMock = func(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error) {
// 		return tenant, nil
// 	}
// 	tenant := suite.createMockTenant(true, true)
// 	success, err := enableTenantLogging(context.Background(), tenant, suite.opClient, "mock-tenant")
// 	suite.assert.True(success)
// 	suite.assert.Nil(err)
// }

// func (suite *TenantTestSuite) TestEnableTenantLoggingWithError() {
// 	opClientTenantUpdateMock = func(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error) {
// 		return nil, errors.New("mock-error")
// 	}
// 	tenant := suite.createMockTenant(true, true)
// 	success, err := enableTenantLogging(context.Background(), tenant, suite.opClient, "mock-tenant")
// 	suite.assert.False(success)
// 	suite.assert.NotNil(err)
// }

// func (suite *TenantTestSuite) createMockParams() operator_api.SetTenantLogsParams {
// 	runAsUser := "1000"
// 	runAsGroup := "1000"
// 	fsGroup := "1000"
// 	return operator_api.SetTenantLogsParams{
// 		Data: &models.TenantLogs{
// 			Labels: []*models.Label{
// 				{
// 					Key:   "key",
// 					Value: "value",
// 				},
// 			},
// 			Annotations: []*models.Annotation{
// 				{
// 					Key:   "key",
// 					Value: "value",
// 				},
// 			},
// 			NodeSelector: []*models.NodeSelector{
// 				{
// 					Key:   "key",
// 					Value: "value",
// 				},
// 			},
// 			LogCPURequest: "5Gi",
// 			LogMemRequest: "5Gi",
// 			DbLabels: []*models.Label{
// 				{
// 					Key:   "key",
// 					Value: "value",
// 				},
// 			},
// 			DbAnnotations: []*models.Annotation{
// 				{
// 					Key:   "key",
// 					Value: "value",
// 				},
// 			},
// 			DbNodeSelector: []*models.NodeSelector{
// 				{
// 					Key:   "key",
// 					Value: "value",
// 				},
// 			},
// 			LogDBCPURequest: "5Gi",
// 			LogDBMemRequest: "5Gi",
// 			Image:           "mock-image",
// 			SecurityContext: &models.SecurityContext{
// 				RunAsUser:  &runAsUser,
// 				RunAsGroup: &runAsGroup,
// 				FsGroup:    fsGroup,
// 			},
// 			DiskCapacityGB:     "10",
// 			ServiceAccountName: "mock-service-account-name",
// 			DbImage:            "mock-db-image",
// 			DbSecurityContext: &models.SecurityContext{
// 				RunAsUser:  &runAsUser,
// 				RunAsGroup: &runAsGroup,
// 				FsGroup:    fsGroup,
// 			},
// 		},
// 	}
// }

// func (suite *TenantTestSuite) createMockTenant(withSpecLog, withDB bool) *miniov2.Tenant {
// 	cap := 10
// 	runAsUser := int64(1000)
// 	runAsGroup := int64(1000)
// 	fsGroup := int64(1000)
// 	tenant := &miniov2.Tenant{}
// 	if withSpecLog {
// 		tenant.Spec.Log = &miniov2.LogConfig{
// 			Annotations: map[string]string{
// 				"key": "value",
// 			},
// 			Labels: map[string]string{
// 				"key": "value",
// 			},
// 			NodeSelector: map[string]string{
// 				"key": "value",
// 			},
// 			Db: &miniov2.LogDbConfig{
// 				Annotations: map[string]string{
// 					"key": "value",
// 				},
// 				Labels: map[string]string{
// 					"key": "value",
// 				},
// 				NodeSelector: map[string]string{
// 					"key": "value",
// 				},
// 				SecurityContext: &corev1.PodSecurityContext{
// 					RunAsUser:  &runAsUser,
// 					RunAsGroup: &runAsGroup,
// 					FSGroup:    &fsGroup,
// 				},
// 				Resources: corev1.ResourceRequirements{
// 					Requests: corev1.ResourceList{
// 						corev1.ResourceCPU:    resource.MustParse("100m"),
// 						corev1.ResourceMemory: resource.MustParse("100Mi"),
// 					},
// 				},
// 			},
// 			SecurityContext: &corev1.PodSecurityContext{
// 				RunAsUser:  &runAsUser,
// 				RunAsGroup: &runAsGroup,
// 				FSGroup:    &fsGroup,
// 			},
// 			Audit: &miniov2.AuditConfig{
// 				DiskCapacityGB: &cap,
// 			},
// 			Resources: corev1.ResourceRequirements{
// 				Requests: corev1.ResourceList{
// 					corev1.ResourceCPU:    resource.MustParse("100m"),
// 					corev1.ResourceMemory: resource.MustParse("100Mi"),
// 				},
// 			},
// 		}
// 		if !withDB {
// 			tenant.Spec.Log.Db = nil
// 		}
// 	}
// 	return tenant
// }

// func (suite *TenantTestSuite) TestSetTenantLogsHandlerWithError() {
// 	params, api := suite.initSetTenantLogsRequest()
// 	response := api.OperatorAPISetTenantLogsHandler.Handle(params, &models.Principal{})
// 	_, ok := response.(*operator_api.SetTenantLogsDefault)
// 	suite.assert.True(ok)
// }

// func (suite *TenantTestSuite) initSetTenantLogsRequest() (params operator_api.SetTenantLogsParams, api operations.OperatorAPI) {
// 	registerTenantLogsHandlers(&api)
// 	params.HTTPRequest = &http.Request{}
// 	params.Namespace = "mock-namespace"
// 	params.Tenant = "mock-name"
// 	return params, api
// }

// func (suite *TenantTestSuite) TestEnableTenantLoggingHandlerWithError() {
// 	params, api := suite.initEnableTenantLoggingRequest()
// 	response := api.OperatorAPIEnableTenantLoggingHandler.Handle(params, &models.Principal{})
// 	_, ok := response.(*operator_api.EnableTenantLoggingDefault)
// 	suite.assert.True(ok)
// }

// func (suite *TenantTestSuite) initEnableTenantLoggingRequest() (params operator_api.EnableTenantLoggingParams, api operations.OperatorAPI) {
// 	registerTenantLogsHandlers(&api)
// 	params.HTTPRequest = &http.Request{}
// 	params.Namespace = "mock-namespace"
// 	params.Tenant = "mock-name"
// 	return params, api
// }

// func (suite *TenantTestSuite) TestDisableTenantLoggingHandlerWithError() {
// 	params, api := suite.initDisableTenantLoggingRequest()
// 	response := api.OperatorAPIDisableTenantLoggingHandler.Handle(params, &models.Principal{})
// 	_, ok := response.(*operator_api.DisableTenantLoggingDefault)
// 	suite.assert.True(ok)
// }

// func (suite *TenantTestSuite) initDisableTenantLoggingRequest() (params operator_api.DisableTenantLoggingParams, api operations.OperatorAPI) {
// 	registerTenantLogsHandlers(&api)
// 	params.HTTPRequest = &http.Request{}
// 	params.Namespace = "mock-namespace"
// 	params.Tenant = "mock-name"
// 	return params, api
// }

func TestTenant(t *testing.T) {
	suite.Run(t, new(TenantTestSuite))
}

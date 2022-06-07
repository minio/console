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
	"context"
	"errors"
	"net/http"
	"os"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

var (
	testWithError                = false
	errMock                      = errors.New("mock error")
	k8sClientGetConfigMapMock    func(ctx context.Context, namespace, configMap string, opts metav1.GetOptions) (*corev1.ConfigMap, error)
	k8sClientCreateConfigMapMock func(ctx context.Context, namespace string, cm *corev1.ConfigMap, opts metav1.CreateOptions) (*corev1.ConfigMap, error)
	k8sClientUpdateConfigMapMock func(ctx context.Context, namespace string, cm *corev1.ConfigMap, opts metav1.UpdateOptions) (*corev1.ConfigMap, error)
	k8sClientDeleteConfigMapMock func(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error
)

type MarketplaceTestSuite struct {
	suite.Suite
	assert    *assert.Assertions
	kClient   k8sClientMock
	namespace string
}

func (c k8sClientMock) getConfigMap(ctx context.Context, namespace, configMap string, opts metav1.GetOptions) (*corev1.ConfigMap, error) {
	return k8sClientGetConfigMapMock(ctx, namespace, configMap, opts)
}

func (c k8sClientMock) createConfigMap(ctx context.Context, namespace string, cm *corev1.ConfigMap, opts metav1.CreateOptions) (*corev1.ConfigMap, error) {
	return k8sClientCreateConfigMapMock(ctx, namespace, cm, opts)
}

func (c k8sClientMock) updateConfigMap(ctx context.Context, namespace string, cm *corev1.ConfigMap, opts metav1.UpdateOptions) (*corev1.ConfigMap, error) {
	return k8sClientUpdateConfigMapMock(ctx, namespace, cm, opts)
}

func (c k8sClientMock) deleteConfigMap(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
	return k8sClientDeleteConfigMapMock(ctx, namespace, name, opts)
}

func (suite *MarketplaceTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.namespace = "default"
	k8sClientGetConfigMapMock = suite.getConfigMapMock
	k8sClientCreateConfigMapMock = suite.createConfigMapMock
	k8sClientUpdateConfigMapMock = suite.updateConfigMapMock
	k8sClientDeleteConfigMapMock = suite.deleteConfigMapMock
	os.Setenv(mpConfigMapKey, "mp-mock-config")
}

func (suite *MarketplaceTestSuite) TearDownSuite() {
	os.Unsetenv(mpConfigMapKey)
}

func (suite *MarketplaceTestSuite) getConfigMapMock(ctx context.Context, namespace, configMap string, opts metav1.GetOptions) (*corev1.ConfigMap, error) {
	if testWithError {
		return nil, errMock
	}
	return &corev1.ConfigMap{Data: map[string]string{mpEmail: "mock@mock.com"}}, nil
}

func (suite *MarketplaceTestSuite) createConfigMapMock(ctx context.Context, namespace string, cm *corev1.ConfigMap, opts metav1.CreateOptions) (*corev1.ConfigMap, error) {
	if testWithError {
		return nil, errMock
	}
	return &corev1.ConfigMap{}, nil
}

func (suite *MarketplaceTestSuite) updateConfigMapMock(ctx context.Context, namespace string, cm *corev1.ConfigMap, opts metav1.UpdateOptions) (*corev1.ConfigMap, error) {
	if testWithError {
		return nil, errMock
	}
	return &corev1.ConfigMap{}, nil
}

func (suite *MarketplaceTestSuite) deleteConfigMapMock(ctx context.Context, namespace string, name string, opts metav1.DeleteOptions) error {
	if testWithError {
		return errMock
	}
	return nil
}

func (suite *MarketplaceTestSuite) TestRegisterMarketplaceHandlers() {
	api := &operations.OperatorAPI{}
	suite.assert.Nil(api.OperatorAPIGetMPIntegrationHandler)
	suite.assert.Nil(api.OperatorAPIPostMPIntegrationHandler)
	suite.assert.Nil(api.OperatorAPIPatchMPIntegrationHandler)
	suite.assert.Nil(api.OperatorAPIDeleteMPIntegrationHandler)
	registerMarketplaceHandlers(api)
	suite.assert.NotNil(api.OperatorAPIGetMPIntegrationHandler)
	suite.assert.NotNil(api.OperatorAPIPostMPIntegrationHandler)
	suite.assert.NotNil(api.OperatorAPIPatchMPIntegrationHandler)
	suite.assert.NotNil(api.OperatorAPIDeleteMPIntegrationHandler)
}

// TODO
// WIP - Complete successful tests to RUD handlers
// WIP - Add tests to POST handler
// WIP - Check how to mock k8s objects for tests with no error

func (suite *MarketplaceTestSuite) TestGetMPIntegrationHandlerWithError() {
	api := &operations.OperatorAPI{}
	registerMarketplaceHandlers(api)
	params := operator_api.NewGetMPIntegrationParams()
	params.HTTPRequest = &http.Request{}
	response := api.OperatorAPIGetMPIntegrationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.GetMPIntegrationDefault)
	suite.assert.True(ok)
}

func (suite *MarketplaceTestSuite) TestPatchMPIntegrationHandlerWithError() {
	api := &operations.OperatorAPI{}
	registerMarketplaceHandlers(api)
	params := operator_api.NewPatchMPIntegrationParams()
	params.HTTPRequest = &http.Request{}
	params.Body = &models.MpIntegration{Email: "mock@mock.com"}
	response := api.OperatorAPIPatchMPIntegrationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.PatchMPIntegrationDefault)
	suite.assert.True(ok)
}

func (suite *MarketplaceTestSuite) TestDeleteMPIntegrationHandlerWithError() {
	api := &operations.OperatorAPI{}
	registerMarketplaceHandlers(api)
	params := operator_api.NewDeleteMPIntegrationParams()
	params.HTTPRequest = &http.Request{}
	response := api.OperatorAPIDeleteMPIntegrationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*operator_api.DeleteMPIntegrationDefault)
	suite.assert.True(ok)
}

func (suite *MarketplaceTestSuite) TestGetMPEmailWithError() {
	testWithError = true
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	email, err := getMPEmail(ctx, &suite.kClient)
	suite.assert.NotNil(err)
	suite.assert.Empty(email)
}

func (suite *MarketplaceTestSuite) TestGetMPEmailNoError() {
	testWithError = false
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	email, err := getMPEmail(ctx, &suite.kClient)
	suite.assert.Nil(err)
	suite.assert.NotEmpty(email)
}

func (suite *MarketplaceTestSuite) TestSetMPIntegrationNoEmail() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := setMPIntegration(ctx, "", false, &suite.kClient)
	suite.assert.NotNil(err)
}

func (suite *MarketplaceTestSuite) TestSetMPIntegrationWithError() {
	testWithError = true
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := setMPIntegration(ctx, "mock@mock.com", false, &suite.kClient)
	suite.assert.NotNil(err)
}

func (suite *MarketplaceTestSuite) TestSetMPIntegrationNoError() {
	testWithError = false
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := setMPIntegration(ctx, "mock@mock.com", false, &suite.kClient)
	suite.assert.Nil(err)
}

func (suite *MarketplaceTestSuite) TestSetMPIntegrationOverrideNoError() {
	testWithError = false
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := setMPIntegration(ctx, "mock@mock.com", true, &suite.kClient)
	suite.assert.Nil(err)
}

func (suite *MarketplaceTestSuite) TestDeleteMPIntegrationWithError() {
	testWithError = true
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := deleteMPIntegration(ctx, &suite.kClient)
	suite.assert.NotNil(err)
}

func (suite *MarketplaceTestSuite) TestDeleteMPIntegrationNoError() {
	testWithError = false
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := deleteMPIntegration(ctx, &suite.kClient)
	suite.assert.Nil(err)
}

func TestMarketplace(t *testing.T) {
	suite.Run(t, new(MarketplaceTestSuite))
}

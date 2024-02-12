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

package api

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/console/pkg/utils"

	"github.com/go-openapi/swag"
	"github.com/minio/console/api/operations"
	bucketApi "github.com/minio/console/api/operations/bucket"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type RemoteBucketsTestSuite struct {
	suite.Suite
	assert           *assert.Assertions
	currentServer    string
	isServerSet      bool
	server           *httptest.Server
	adminClient      AdminClientMock
	minioClient      minioClientMock
	mockRemoteBucket *models.RemoteBucket
	mockBucketTarget *madmin.BucketTarget
	mockListBuckets  *models.ListBucketsResponse
}

func (suite *RemoteBucketsTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.adminClient = AdminClientMock{}
	suite.minioClient = minioClientMock{}
	suite.mockObjects()
}

func (suite *RemoteBucketsTestSuite) mockObjects() {
	suite.mockListBuckets = &models.ListBucketsResponse{
		Buckets: []*models.Bucket{},
		Total:   0,
	}
	suite.mockRemoteBucket = &models.RemoteBucket{
		AccessKey:    swag.String("accessKey"),
		SecretKey:    "secretKey",
		RemoteARN:    swag.String("remoteARN"),
		Service:      "replication",
		SourceBucket: swag.String("sourceBucket"),
		TargetBucket: "targetBucket",
		TargetURL:    "targetURL",
		Status:       "",
	}
	suite.mockBucketTarget = &madmin.BucketTarget{
		Credentials: &madmin.Credentials{
			AccessKey: *suite.mockRemoteBucket.AccessKey,
			SecretKey: suite.mockRemoteBucket.SecretKey,
		},
		Arn:          *suite.mockRemoteBucket.RemoteARN,
		SourceBucket: *suite.mockRemoteBucket.SourceBucket,
		TargetBucket: suite.mockRemoteBucket.TargetBucket,
		Endpoint:     suite.mockRemoteBucket.TargetURL,
	}
}

func (suite *RemoteBucketsTestSuite) SetupTest() {
	suite.server = httptest.NewServer(http.HandlerFunc(suite.serverHandler))
	suite.currentServer, suite.isServerSet = os.LookupEnv(ConsoleMinIOServer)
	os.Setenv(ConsoleMinIOServer, suite.server.URL)
}

func (suite *RemoteBucketsTestSuite) serverHandler(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(400)
}

func (suite *RemoteBucketsTestSuite) TearDownSuite() {
}

func (suite *RemoteBucketsTestSuite) TearDownTest() {
	if suite.isServerSet {
		os.Setenv(ConsoleMinIOServer, suite.currentServer)
	} else {
		os.Unsetenv(ConsoleMinIOServer)
	}
}

func (suite *RemoteBucketsTestSuite) TestRegisterRemoteBucketsHandlers() {
	api := &operations.ConsoleAPI{}
	suite.assertHandlersAreNil(api)
	registerAdminBucketRemoteHandlers(api)
	suite.assertHandlersAreNotNil(api)
}

func (suite *RemoteBucketsTestSuite) assertHandlersAreNil(api *operations.ConsoleAPI) {
	suite.assert.Nil(api.BucketListRemoteBucketsHandler)
	suite.assert.Nil(api.BucketRemoteBucketDetailsHandler)
	suite.assert.Nil(api.BucketDeleteRemoteBucketHandler)
	suite.assert.Nil(api.BucketAddRemoteBucketHandler)
	suite.assert.Nil(api.BucketSetMultiBucketReplicationHandler)
	suite.assert.Nil(api.BucketListExternalBucketsHandler)
	suite.assert.Nil(api.BucketDeleteBucketReplicationRuleHandler)
	suite.assert.Nil(api.BucketDeleteAllReplicationRulesHandler)
	suite.assert.Nil(api.BucketDeleteSelectedReplicationRulesHandler)
	suite.assert.Nil(api.BucketUpdateMultiBucketReplicationHandler)
}

func (suite *RemoteBucketsTestSuite) assertHandlersAreNotNil(api *operations.ConsoleAPI) {
	suite.assert.NotNil(api.BucketListRemoteBucketsHandler)
	suite.assert.NotNil(api.BucketRemoteBucketDetailsHandler)
	suite.assert.NotNil(api.BucketDeleteRemoteBucketHandler)
	suite.assert.NotNil(api.BucketAddRemoteBucketHandler)
	suite.assert.NotNil(api.BucketSetMultiBucketReplicationHandler)
	suite.assert.NotNil(api.BucketListExternalBucketsHandler)
	suite.assert.NotNil(api.BucketDeleteBucketReplicationRuleHandler)
	suite.assert.NotNil(api.BucketDeleteAllReplicationRulesHandler)
	suite.assert.NotNil(api.BucketDeleteSelectedReplicationRulesHandler)
	suite.assert.NotNil(api.BucketUpdateMultiBucketReplicationHandler)
}

func (suite *RemoteBucketsTestSuite) TestListRemoteBucketsHandlerWithError() {
	params, api := suite.initListRemoteBucketsRequest()
	response := api.BucketListRemoteBucketsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.ListRemoteBucketsDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initListRemoteBucketsRequest() (params bucketApi.ListRemoteBucketsParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestListRemoteBucketsWithoutError() {
	ctx := context.Background()
	minioListRemoteBucketsMock = func(_ context.Context, _, _ string) (targets []madmin.BucketTarget, err error) {
		return []madmin.BucketTarget{{
			Credentials: &madmin.Credentials{
				AccessKey: "accessKey",
				SecretKey: "secretKey",
			},
		}}, nil
	}
	res, err := listRemoteBuckets(ctx, &suite.adminClient)
	suite.assert.NotNil(res)
	suite.assert.Nil(err)
}

func (suite *RemoteBucketsTestSuite) TestRemoteBucketDetailsHandlerWithError() {
	params, api := suite.initRemoteBucketDetailsRequest()
	response := api.BucketRemoteBucketDetailsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.RemoteBucketDetailsDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initRemoteBucketDetailsRequest() (params bucketApi.RemoteBucketDetailsParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestGetRemoteBucketWithoutError() {
	ctx := context.Background()
	minioGetRemoteBucketMock = func(_ context.Context, _, _ string) (targets *madmin.BucketTarget, err error) {
		return suite.mockBucketTarget, nil
	}
	res, err := getRemoteBucket(ctx, &suite.adminClient, "bucketName")
	suite.assert.Nil(err)
	suite.assert.NotNil(res)
	suite.assert.Equal(suite.mockRemoteBucket, res)
}

func (suite *RemoteBucketsTestSuite) TestDeleteRemoteBucketHandlerWithError() {
	params, api := suite.initDeleteRemoteBucketRequest()
	response := api.BucketDeleteRemoteBucketHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.DeleteRemoteBucketDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initDeleteRemoteBucketRequest() (params bucketApi.DeleteRemoteBucketParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestAddRemoteBucketHandlerWithError() {
	params, api := suite.initAddRemoteBucketRequest()
	response := api.BucketAddRemoteBucketHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.AddRemoteBucketDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initAddRemoteBucketRequest() (params bucketApi.AddRemoteBucketParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	url := "^&*&^%^"
	accessKey := "accessKey"
	secretKey := "secretKey"
	params.HTTPRequest = &http.Request{}
	params.Body = &models.CreateRemoteBucket{
		TargetURL: &url,
		AccessKey: &accessKey,
		SecretKey: &secretKey,
	}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestAddRemoteBucketWithoutError() {
	ctx := context.Background()
	minioAddRemoteBucketMock = func(_ context.Context, _ string, _ *madmin.BucketTarget) (string, error) {
		return "bucketName", nil
	}
	url := "https://localhost"
	accessKey := "accessKey"
	secretKey := "secretKey"
	targetBucket := "targetBucket"
	syncMode := "async"
	sourceBucket := "sourceBucket"
	data := models.CreateRemoteBucket{
		TargetURL:         &url,
		TargetBucket:      &targetBucket,
		AccessKey:         &accessKey,
		SecretKey:         &secretKey,
		SyncMode:          &syncMode,
		HealthCheckPeriod: 10,
		SourceBucket:      &sourceBucket,
	}
	res, err := addRemoteBucket(ctx, &suite.adminClient, data)
	suite.assert.NotNil(res)
	suite.assert.Nil(err)
}

func (suite *RemoteBucketsTestSuite) TestSetMultiBucketReplicationHandlerWithError() {
	params, api := suite.initSetMultiBucketReplicationRequest()
	response := api.BucketSetMultiBucketReplicationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.SetMultiBucketReplicationOK)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initSetMultiBucketReplicationRequest() (params bucketApi.SetMultiBucketReplicationParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	accessKey := "accessKey"
	secretKey := "secretKey"
	targetURL := "https://localhost"
	syncMode := "async"
	params.HTTPRequest = &http.Request{}
	params.Body = &models.MultiBucketReplication{
		BucketsRelation:   []*models.MultiBucketsRelation{{}},
		AccessKey:         &accessKey,
		SecretKey:         &secretKey,
		Region:            "region",
		TargetURL:         &targetURL,
		SyncMode:          &syncMode,
		Bandwidth:         10,
		HealthCheckPeriod: 10,
	}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestListExternalBucketsHandlerWithError() {
	params, api := suite.initListExternalBucketsRequest()
	response := api.BucketListExternalBucketsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.ListExternalBucketsDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initListExternalBucketsRequest() (params bucketApi.ListExternalBucketsParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	url := "http://localhost:9000"
	accessKey := "accessKey"
	secretKey := "secretKey"
	tls := false
	params.HTTPRequest = &http.Request{}
	params.Body = &models.ListExternalBucketsParams{
		TargetURL: &url,
		AccessKey: &accessKey,
		SecretKey: &secretKey,
		UseTLS:    &tls,
	}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestListExternalBucketsWithError() {
	ctx := context.Background()
	minioAccountInfoMock = func(_ context.Context) (madmin.AccountInfo, error) {
		return madmin.AccountInfo{}, errors.New("error")
	}
	res, err := listExternalBuckets(ctx, &suite.adminClient)
	suite.assert.NotNil(err)
	suite.assert.Nil(res)
}

func (suite *RemoteBucketsTestSuite) TestListExternalBucketsWithoutError() {
	ctx := context.Background()
	minioAccountInfoMock = func(_ context.Context) (madmin.AccountInfo, error) {
		return madmin.AccountInfo{
			Buckets: []madmin.BucketAccessInfo{},
		}, nil
	}
	res, err := listExternalBuckets(ctx, &suite.adminClient)
	suite.assert.Nil(err)
	suite.assert.NotNil(res)
	suite.assert.Equal(suite.mockListBuckets, res)
}

func (suite *RemoteBucketsTestSuite) TestDeleteBucketReplicationRuleHandlerWithError() {
	params, api := suite.initDeleteBucketReplicationRuleRequest()
	response := api.BucketDeleteBucketReplicationRuleHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.DeleteBucketReplicationRuleDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initDeleteBucketReplicationRuleRequest() (params bucketApi.DeleteBucketReplicationRuleParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestDeleteAllReplicationRulesHandlerWithError() {
	params, api := suite.initDeleteAllReplicationRulesRequest()
	response := api.BucketDeleteAllReplicationRulesHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.DeleteAllReplicationRulesDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initDeleteAllReplicationRulesRequest() (params bucketApi.DeleteAllReplicationRulesParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *RemoteBucketsTestSuite) TestDeleteSelectedReplicationRulesHandlerWithError() {
	params, api := suite.initDeleteSelectedReplicationRulesRequest()
	response := api.BucketDeleteSelectedReplicationRulesHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.DeleteSelectedReplicationRulesDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initDeleteSelectedReplicationRulesRequest() (params bucketApi.DeleteSelectedReplicationRulesParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	params.HTTPRequest = &http.Request{}
	params.BucketName = "bucketName"
	params.Rules = &models.BucketReplicationRuleList{
		Rules: []string{"rule1", "rule2"},
	}

	return params, api
}

func (suite *RemoteBucketsTestSuite) TestUpdateMultiBucketReplicationHandlerWithError() {
	params, api := suite.initUpdateMultiBucketReplicationRequest()
	response := api.BucketUpdateMultiBucketReplicationHandler.Handle(params, &models.Principal{})
	_, ok := response.(*bucketApi.UpdateMultiBucketReplicationDefault)
	suite.assert.True(ok)
}

func (suite *RemoteBucketsTestSuite) initUpdateMultiBucketReplicationRequest() (params bucketApi.UpdateMultiBucketReplicationParams, api operations.ConsoleAPI) {
	registerAdminBucketRemoteHandlers(&api)
	r := &http.Request{}
	ctx := context.WithValue(context.Background(), utils.ContextClientIP, "127.0.0.1")
	rc := r.WithContext(ctx)
	params.HTTPRequest = rc
	params.Body = &models.MultiBucketReplicationEdit{}
	return params, api
}

func TestRemoteBuckets(t *testing.T) {
	suite.Run(t, new(RemoteBucketsTestSuite))
}

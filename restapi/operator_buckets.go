// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/operator_api"
)

func registerOperatorBucketsHandlers(api *operations.ConsoleAPI) {
	// list buckets
	api.OperatorAPIOperatorListBucketsHandler = operator_api.OperatorListBucketsHandlerFunc(func(params operator_api.OperatorListBucketsParams, session *models.Principal) middleware.Responder {
		listBucketsResponse, err := getOperatorListBucketsResponse(session, params.Namespace, params.Tenant)
		if err != nil {
			return operator_api.NewOperatorListBucketsDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewOperatorListBucketsOK().WithPayload(listBucketsResponse)
	})
}

// getListBucketsResponse performs listBuckets() and serializes it to the handler's output
func getOperatorListBucketsResponse(session *models.Principal, namespace, tenant string) (*models.ListBucketsResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}
	k8sClient := &k8sClient{
		client: clientSet,
	}

	minTenant, err := getTenant(ctx, opClient, namespace, tenant)
	if err != nil {
		return nil, prepareError(err)
	}
	minTenant.EnsureDefaults()

	svcURL := GetTenantServiceURL(minTenant)
	// getTenantAdminClient will use all certificates under ~/.console/certs/CAs to trust the TLS connections with MinIO tenants
	mAdmin, err := getTenantAdminClient(
		ctx,
		k8sClient,
		minTenant,
		svcURL,
	)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	buckets, err := getAccountInfo(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}

	// serialize output
	listBucketsResponse := &models.ListBucketsResponse{
		Buckets: buckets,
		Total:   int64(len(buckets)),
	}
	return listBucketsResponse, nil
}

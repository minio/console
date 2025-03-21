// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	bucektApi "github.com/minio/console/api/operations/bucket"

	"github.com/minio/console/models"
)

func registerBucketQuotaHandlers(api *operations.ConsoleAPI) {
	// get bucket quota
	api.BucketGetBucketQuotaHandler = bucektApi.GetBucketQuotaHandlerFunc(func(params bucektApi.GetBucketQuotaParams, session *models.Principal) middleware.Responder {
		resp, err := getBucketQuotaResponse(session, params)
		if err != nil {
			return bucektApi.NewGetBucketQuotaDefault(err.Code).WithPayload(err.APIError)
		}
		return bucektApi.NewGetBucketQuotaOK().WithPayload(resp)
	})
}

func getBucketQuotaResponse(session *models.Principal, params bucektApi.GetBucketQuotaParams) (*models.BucketQuota, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	quota, err := getBucketQuota(ctx, &adminClient, &params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return quota, nil
}

func getBucketQuota(ctx context.Context, ac *AdminClient, bucket *string) (*models.BucketQuota, error) {
	quota, err := ac.getBucketQuota(ctx, *bucket)
	if err != nil {
		return nil, err
	}
	return &models.BucketQuota{
		Quota: int64(quota.Quota),
		Type:  string(quota.Type),
	}, nil
}

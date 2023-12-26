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

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	siteRepApi "github.com/minio/console/api/operations/site_replication"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

func registerSiteReplicationStatusHandler(api *operations.ConsoleAPI) {
	api.SiteReplicationGetSiteReplicationStatusHandler = siteRepApi.GetSiteReplicationStatusHandlerFunc(func(params siteRepApi.GetSiteReplicationStatusParams, session *models.Principal) middleware.Responder {
		rInfo, err := getSRStatusResponse(session, params)
		if err != nil {
			return siteRepApi.NewGetSiteReplicationStatusDefault(err.Code).WithPayload(err.APIError)
		}
		return siteRepApi.NewGetSiteReplicationStatusOK().WithPayload(rInfo)
	})
}

func getSRStatusResponse(session *models.Principal, params siteRepApi.GetSiteReplicationStatusParams) (*models.SiteReplicationStatusResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	res, err := getSRStats(ctx, adminClient, params)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return res, nil
}

func getSRStats(ctx context.Context, client MinioAdmin, params siteRepApi.GetSiteReplicationStatusParams) (info *models.SiteReplicationStatusResponse, err error) {
	srParams := madmin.SRStatusOptions{
		Buckets:  *params.Buckets,
		Policies: *params.Policies,
		Users:    *params.Users,
		Groups:   *params.Groups,
	}
	if params.EntityType != nil && params.EntityValue != nil {
		srParams.Entity = madmin.GetSREntityType(*params.EntityType)
		srParams.EntityValue = *params.EntityValue
	}

	srInfo, err := client.getSiteReplicationStatus(ctx, srParams)

	retInfo := models.SiteReplicationStatusResponse{
		BucketStats:  &srInfo.BucketStats,
		Enabled:      srInfo.Enabled,
		GroupStats:   srInfo.GroupStats,
		MaxBuckets:   int64(srInfo.MaxBuckets),
		MaxGroups:    int64(srInfo.MaxGroups),
		MaxPolicies:  int64(srInfo.MaxPolicies),
		MaxUsers:     int64(srInfo.MaxUsers),
		PolicyStats:  &srInfo.PolicyStats,
		Sites:        &srInfo.Sites,
		StatsSummary: srInfo.StatsSummary,
		UserStats:    &srInfo.UserStats,
	}

	if err != nil {
		return nil, err
	}
	return &retInfo, nil
}

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

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	siteRepApi "github.com/minio/console/api/operations/site_replication"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

func registerSiteReplicationHandler(api *operations.ConsoleAPI) {
	api.SiteReplicationGetSiteReplicationInfoHandler = siteRepApi.GetSiteReplicationInfoHandlerFunc(func(params siteRepApi.GetSiteReplicationInfoParams, session *models.Principal) middleware.Responder {
		rInfo, err := getSRInfoResponse(session, params)
		if err != nil {
			return siteRepApi.NewGetSiteReplicationInfoDefault(err.Code).WithPayload(err.APIError)
		}
		return siteRepApi.NewGetSiteReplicationInfoOK().WithPayload(rInfo)
	})

	api.SiteReplicationSiteReplicationInfoAddHandler = siteRepApi.SiteReplicationInfoAddHandlerFunc(func(params siteRepApi.SiteReplicationInfoAddParams, session *models.Principal) middleware.Responder {
		eInfo, err := getSRAddResponse(session, params)
		if err != nil {
			return siteRepApi.NewSiteReplicationInfoAddDefault(err.Code).WithPayload(err.APIError)
		}
		return siteRepApi.NewSiteReplicationInfoAddOK().WithPayload(eInfo)
	})

	api.SiteReplicationSiteReplicationRemoveHandler = siteRepApi.SiteReplicationRemoveHandlerFunc(func(params siteRepApi.SiteReplicationRemoveParams, session *models.Principal) middleware.Responder {
		remRes, err := getSRRemoveResponse(session, params)
		if err != nil {
			return siteRepApi.NewSiteReplicationRemoveDefault(err.Code).WithPayload(err.APIError)
		}
		return siteRepApi.NewSiteReplicationRemoveNoContent().WithPayload(remRes)
	})

	api.SiteReplicationSiteReplicationEditHandler = siteRepApi.SiteReplicationEditHandlerFunc(func(params siteRepApi.SiteReplicationEditParams, session *models.Principal) middleware.Responder {
		eInfo, err := getSREditResponse(session, params)
		if err != nil {
			return siteRepApi.NewSiteReplicationRemoveDefault(err.Code).WithPayload(err.APIError)
		}
		return siteRepApi.NewSiteReplicationEditOK().WithPayload(eInfo)
	})
}

func getSRInfoResponse(session *models.Principal, params siteRepApi.GetSiteReplicationInfoParams) (*models.SiteReplicationInfoResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}

	res, err := getSRConfig(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return res, nil
}

func getSRAddResponse(session *models.Principal, params siteRepApi.SiteReplicationInfoAddParams) (*models.SiteReplicationAddResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}

	res, err := addSiteReplication(ctx, adminClient, &params)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return res, nil
}

func getSREditResponse(session *models.Principal, params siteRepApi.SiteReplicationEditParams) (*models.PeerSiteEditResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	eRes, err := editSiteReplication(ctx, adminClient, &params)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return eRes, nil
}

func getSRRemoveResponse(session *models.Principal, params siteRepApi.SiteReplicationRemoveParams) (*models.PeerSiteRemoveResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	rRes, err := removeSiteReplication(ctx, adminClient, &params)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return rRes, nil
}

func getSRConfig(ctx context.Context, client MinioAdmin) (info *models.SiteReplicationInfoResponse, err error) {
	srInfo, err := client.getSiteReplicationInfo(ctx)
	if err != nil {
		return nil, err
	}
	var sites []*models.PeerInfo

	if len(srInfo.Sites) > 0 {
		for _, s := range srInfo.Sites {
			pInfo := &models.PeerInfo{
				DeploymentID: s.DeploymentID,
				Endpoint:     s.Endpoint,
				Name:         s.Name,
			}
			sites = append(sites, pInfo)
		}
	}
	res := &models.SiteReplicationInfoResponse{
		Enabled:                 srInfo.Enabled,
		Name:                    srInfo.Name,
		ServiceAccountAccessKey: srInfo.ServiceAccountAccessKey,
		Sites:                   sites,
	}
	return res, nil
}

func addSiteReplication(ctx context.Context, client MinioAdmin, params *siteRepApi.SiteReplicationInfoAddParams) (info *models.SiteReplicationAddResponse, err error) {
	var rSites []madmin.PeerSite

	if len(params.Body) > 0 {
		for _, aSite := range params.Body {
			pInfo := &madmin.PeerSite{
				AccessKey: aSite.AccessKey,
				Name:      aSite.Name,
				SecretKey: aSite.SecretKey,
				Endpoint:  aSite.Endpoint,
			}
			rSites = append(rSites, *pInfo)
		}
	}
	qs := runtime.Values(params.HTTPRequest.URL.Query())
	_, qhkReplicateILMExpiry, _ := qs.GetOK("replicate-ilm-expiry")
	var opts madmin.SRAddOptions
	if qhkReplicateILMExpiry {
		opts.ReplicateILMExpiry = true
	}
	cc, err := client.addSiteReplicationInfo(ctx, rSites, opts)
	if err != nil {
		return nil, err
	}

	res := &models.SiteReplicationAddResponse{
		ErrorDetail:             cc.ErrDetail,
		InitialSyncErrorMessage: cc.InitialSyncErrorMessage,
		Status:                  cc.Status,
		Success:                 cc.Success,
	}

	return res, nil
}

func editSiteReplication(ctx context.Context, client MinioAdmin, params *siteRepApi.SiteReplicationEditParams) (info *models.PeerSiteEditResponse, err error) {
	peerSiteInfo := &madmin.PeerInfo{
		Endpoint:     params.Body.Endpoint,     // only endpoint can be edited.
		Name:         params.Body.Name,         // does not get updated.
		DeploymentID: params.Body.DeploymentID, // readonly
	}
	qs := runtime.Values(params.HTTPRequest.URL.Query())
	_, qhkDisableILMExpiryReplication, _ := qs.GetOK("disable-ilm-expiry-replication")
	_, qhkEnableILMExpiryReplication, _ := qs.GetOK("enable-ilm-expiry-replication")
	var opts madmin.SREditOptions
	if qhkDisableILMExpiryReplication {
		opts.DisableILMExpiryReplication = true
	}
	if qhkEnableILMExpiryReplication {
		opts.EnableILMExpiryReplication = true
	}
	eRes, err := client.editSiteReplicationInfo(ctx, *peerSiteInfo, opts)
	if err != nil {
		return nil, err
	}

	editRes := &models.PeerSiteEditResponse{
		ErrorDetail: eRes.ErrDetail,
		Status:      eRes.Status,
		Success:     eRes.Success,
	}
	return editRes, nil
}

func removeSiteReplication(ctx context.Context, client MinioAdmin, params *siteRepApi.SiteReplicationRemoveParams) (info *models.PeerSiteRemoveResponse, err error) {
	delAll := params.Body.All
	siteNames := params.Body.Sites

	var req *madmin.SRRemoveReq
	if delAll {
		req = &madmin.SRRemoveReq{
			RemoveAll: delAll,
		}
	} else {
		req = &madmin.SRRemoveReq{
			SiteNames: siteNames,
			RemoveAll: delAll,
		}
	}

	rRes, err := client.deleteSiteReplicationInfo(ctx, *req)
	if err != nil {
		return nil, err
	}

	removeRes := &models.PeerSiteRemoveResponse{
		ErrorDetail: rRes.ErrDetail,
		Status:      rRes.Status,
	}
	return removeRes, nil
}

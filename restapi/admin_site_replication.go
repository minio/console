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
	"context"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	"github.com/minio/madmin-go"
)

func registerSiteReplicationHandler(api *operations.ConsoleAPI) {

	api.AdminAPIGetSiteReplicationInfoHandler = admin_api.GetSiteReplicationInfoHandlerFunc(func(params admin_api.GetSiteReplicationInfoParams, session *models.Principal) middleware.Responder {
		rInfo, err := getSRInfoResponse(session)
		if err != nil {
			return admin_api.NewGetSiteReplicationInfoDefault(500).WithPayload(prepareError(err))
		}
		return admin_api.NewGetSiteReplicationInfoOK().WithPayload(rInfo)

	})

	api.AdminAPISiteReplicationInfoAddHandler = admin_api.SiteReplicationInfoAddHandlerFunc(func(params admin_api.SiteReplicationInfoAddParams, session *models.Principal) middleware.Responder {
		eInfo, err := getSRAddResponse(session, &params)
		if err != nil {
			return admin_api.NewSiteReplicationInfoAddDefault(500).WithPayload(err)
		}
		return admin_api.NewSiteReplicationInfoAddOK().WithPayload(eInfo)
	})

	api.AdminAPISiteReplicationRemoveHandler = admin_api.SiteReplicationRemoveHandlerFunc(func(params admin_api.SiteReplicationRemoveParams, session *models.Principal) middleware.Responder {
		remRes, err := getSRRemoveResponse(session, &params)
		if err != nil {
			return admin_api.NewSiteReplicationRemoveDefault(500).WithPayload(err)
		}
		return admin_api.NewSiteReplicationRemoveNoContent().WithPayload(remRes)
	})

	api.AdminAPISiteReplicationEditHandler = admin_api.SiteReplicationEditHandlerFunc(func(params admin_api.SiteReplicationEditParams, session *models.Principal) middleware.Responder {

		eInfo, err := getSREditResponse(session, &params)
		if err != nil {
			return admin_api.NewSiteReplicationRemoveDefault(500).WithPayload(err)
		}

		return admin_api.NewSiteReplicationEditOK().WithPayload(eInfo)
	})

}

func getSRInfoResponse(session *models.Principal) (info *models.SiteReplicationInfoResponse, err error) {
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, err
	}
	adminClient := AdminClient{Client: mAdmin}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	res, err := getSRConfig(ctx, adminClient)

	if err != nil {
		return nil, err
	}
	return res, nil

}
func getSRAddResponse(session *models.Principal, params *admin_api.SiteReplicationInfoAddParams) (*models.SiteReplicationAddResponse, *models.Error) {

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	res, err := addSiteReplication(ctx, adminClient, params)
	if err != nil {
		return nil, prepareError(err)
	}
	return res, nil

}
func getSREditResponse(session *models.Principal, params *admin_api.SiteReplicationEditParams) (*models.PeerSiteEditResponse, *models.Error) {
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	eRes, err := editSiteReplication(ctx, adminClient, params)

	if err != nil {
		return nil, prepareError(err)
	}

	return eRes, nil

}
func getSRRemoveResponse(session *models.Principal, params *admin_api.SiteReplicationRemoveParams) (*models.PeerSiteRemoveResponse, *models.Error) {
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	rRes, err := removeSiteReplication(ctx, adminClient, params)
	if err != nil {
		return nil, prepareError(err)
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
			var pInfo = &models.PeerInfo{
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
func addSiteReplication(ctx context.Context, client MinioAdmin, params *admin_api.SiteReplicationInfoAddParams) (info *models.SiteReplicationAddResponse, err error) {
	var rSites []madmin.PeerSite

	if len(params.Body) > 0 {
		for _, aSite := range params.Body {
			var pInfo = &madmin.PeerSite{
				AccessKey: aSite.AccessKey,
				Name:      aSite.Name,
				SecretKey: aSite.SecretKey,
				Endpoint:  aSite.Endpoint,
			}
			rSites = append(rSites, *pInfo)
		}
	}
	cc, err := client.addSiteReplicationInfo(ctx, rSites)

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
func editSiteReplication(ctx context.Context, client MinioAdmin, params *admin_api.SiteReplicationEditParams) (info *models.PeerSiteEditResponse, err error) {

	peerSiteInfo := &madmin.PeerInfo{
		Endpoint:     params.Body.Endpoint,     //only endpoint can be edited.
		Name:         params.Body.Name,         //does not get updated.
		DeploymentID: params.Body.DeploymentID, //readonly
	}
	eRes, err := client.editSiteReplicationInfo(ctx, *peerSiteInfo)
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
func removeSiteReplication(ctx context.Context, client MinioAdmin, params *admin_api.SiteReplicationRemoveParams) (info *models.PeerSiteRemoveResponse, err error) {
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

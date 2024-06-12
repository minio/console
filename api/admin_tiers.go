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
	"encoding/base64"
	"strconv"

	"github.com/dustin/go-humanize"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/tiering"
	tieringApi "github.com/minio/console/api/operations/tiering"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

func registerAdminTiersHandlers(api *operations.ConsoleAPI) {
	// return a list of notification endpoints
	api.TieringTiersListHandler = tieringApi.TiersListHandlerFunc(func(params tieringApi.TiersListParams, session *models.Principal) middleware.Responder {
		tierList, err := getTiersResponse(session, params)
		if err != nil {
			return tieringApi.NewTiersListDefault(err.Code).WithPayload(err.APIError)
		}
		return tieringApi.NewTiersListOK().WithPayload(tierList)
	})
	api.TieringTiersListNamesHandler = tiering.TiersListNamesHandlerFunc(func(params tiering.TiersListNamesParams, session *models.Principal) middleware.Responder {
		tierList, err := getTiersNameResponse(session, params)
		if err != nil {
			return tieringApi.NewTiersListDefault(err.Code).WithPayload(err.APIError)
		}
		return tieringApi.NewTiersListNamesOK().WithPayload(tierList)
	})
	// add a new tiers
	api.TieringAddTierHandler = tieringApi.AddTierHandlerFunc(func(params tieringApi.AddTierParams, session *models.Principal) middleware.Responder {
		err := getAddTierResponse(session, params)
		if err != nil {
			return tieringApi.NewAddTierDefault(err.Code).WithPayload(err.APIError)
		}
		return tieringApi.NewAddTierCreated()
	})
	// get a tier
	api.TieringGetTierHandler = tieringApi.GetTierHandlerFunc(func(params tieringApi.GetTierParams, session *models.Principal) middleware.Responder {
		notifEndpoints, err := getGetTierResponse(session, params)
		if err != nil {
			return tieringApi.NewGetTierDefault(err.Code).WithPayload(err.APIError)
		}
		return tieringApi.NewGetTierOK().WithPayload(notifEndpoints)
	})
	// edit credentials for a tier
	api.TieringEditTierCredentialsHandler = tieringApi.EditTierCredentialsHandlerFunc(func(params tieringApi.EditTierCredentialsParams, session *models.Principal) middleware.Responder {
		err := getEditTierCredentialsResponse(session, params)
		if err != nil {
			return tieringApi.NewEditTierCredentialsDefault(err.Code).WithPayload(err.APIError)
		}
		return tieringApi.NewEditTierCredentialsOK()
	})
	// remove an empty tier
	api.TieringRemoveTierHandler = tieringApi.RemoveTierHandlerFunc(func(params tieringApi.RemoveTierParams, session *models.Principal) middleware.Responder {
		err := getRemoveTierResponse(session, params)
		if err != nil {
			return tieringApi.NewRemoveTierDefault(err.Code).WithPayload(err.APIError)
		}
		return tieringApi.NewRemoveTierNoContent()
	})
}

// getTiers returns a list of tiers with their stats
func getTiers(ctx context.Context, client MinioAdmin) (*models.TierListResponse, error) {
	tiers, err := client.listTiers(ctx)
	if err != nil {
		return nil, err
	}

	tierStatsInfo, err := client.tierStats(ctx)
	if err != nil {
		return nil, err
	}
	tiersStatsMap := make(map[string]madmin.TierStats, len(tierStatsInfo))
	for _, stat := range tierStatsInfo {
		tiersStatsMap[stat.Name] = stat.Stats
	}

	var tiersList []*models.Tier
	for _, tierData := range tiers {
		// Default Tier Stats
		tierStats := madmin.TierStats{
			NumObjects:  0,
			NumVersions: 0,
			TotalSize:   0,
		}
		if stats, ok := tiersStatsMap[tierData.Name]; ok {
			tierStats = stats
		}

		status := client.verifyTierStatus(ctx, tierData.Name) == nil

		switch tierData.Type {
		case madmin.S3:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeS3,
				S3: &models.TierS3{
					Accesskey:    tierData.S3.AccessKey,
					Bucket:       tierData.S3.Bucket,
					Endpoint:     tierData.S3.Endpoint,
					Name:         tierData.Name,
					Prefix:       tierData.S3.Prefix,
					Region:       tierData.S3.Region,
					Secretkey:    tierData.S3.SecretKey,
					Storageclass: tierData.S3.StorageClass,
					Usage:        humanize.IBytes(tierStats.TotalSize),
					Objects:      strconv.Itoa(tierStats.NumObjects),
					Versions:     strconv.Itoa(tierStats.NumVersions),
				},
				Status: status,
			})
		case madmin.MinIO:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeMinio,
				Minio: &models.TierMinio{
					Accesskey: tierData.MinIO.AccessKey,
					Bucket:    tierData.MinIO.Bucket,
					Endpoint:  tierData.MinIO.Endpoint,
					Name:      tierData.Name,
					Prefix:    tierData.MinIO.Prefix,
					Region:    tierData.MinIO.Region,
					Secretkey: tierData.MinIO.SecretKey,
					Usage:     humanize.IBytes(tierStats.TotalSize),
					Objects:   strconv.Itoa(tierStats.NumObjects),
					Versions:  strconv.Itoa(tierStats.NumVersions),
				},
				Status: status,
			})
		case madmin.GCS:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeGcs,
				Gcs: &models.TierGcs{
					Bucket:   tierData.GCS.Bucket,
					Creds:    tierData.GCS.Creds,
					Endpoint: tierData.GCS.Endpoint,
					Name:     tierData.Name,
					Prefix:   tierData.GCS.Prefix,
					Region:   tierData.GCS.Region,
					Usage:    humanize.IBytes(tierStats.TotalSize),
					Objects:  strconv.Itoa(tierStats.NumObjects),
					Versions: strconv.Itoa(tierStats.NumVersions),
				},
				Status: status,
			})
		case madmin.Azure:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeAzure,
				Azure: &models.TierAzure{
					Accountkey:  tierData.Azure.AccountKey,
					Accountname: tierData.Azure.AccountName,
					Bucket:      tierData.Azure.Bucket,
					Endpoint:    tierData.Azure.Endpoint,
					Name:        tierData.Name,
					Prefix:      tierData.Azure.Prefix,
					Region:      tierData.Azure.Region,
					Usage:       humanize.IBytes(tierStats.TotalSize),
					Objects:     strconv.Itoa(tierStats.NumObjects),
					Versions:    strconv.Itoa(tierStats.NumVersions),
				},
				Status: status,
			})
		case madmin.Unsupported:
			tiersList = append(tiersList, &models.Tier{
				Type:   models.TierTypeUnsupported,
				Status: status,
			})
		}
	}
	// build response
	return &models.TierListResponse{
		Items: tiersList,
	}, nil
}

// getTiersResponse returns a response with a list of tiers
func getTiersResponse(session *models.Principal, params tieringApi.TiersListParams) (*models.TierListResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	// serialize output
	tiersResp, err := getTiers(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return tiersResp, nil
}

// getTiersNameResponse returns a response with a list of tiers' names
func getTiersNameResponse(session *models.Principal, params tieringApi.TiersListNamesParams) (*models.TiersNameListResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	// serialize output
	tiersResp, err := getTiersName(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return tiersResp, nil
}

// getTiersName fetches listTiers and returns a list of the tiers' names
func getTiersName(ctx context.Context, client MinioAdmin) (*models.TiersNameListResponse, error) {
	tiers, err := client.listTiers(ctx)
	if err != nil {
		return nil, err
	}

	tiersNameList := make([]string, len(tiers))
	for i, tierData := range tiers {
		tiersNameList[i] = tierData.Name
	}

	return &models.TiersNameListResponse{
		Items: tiersNameList,
	}, nil
}

func addTier(ctx context.Context, client MinioAdmin, params *tieringApi.AddTierParams) error {
	var cfg *madmin.TierConfig
	var err error

	switch params.Body.Type {

	case models.TierTypeS3:
		cfg, err = madmin.NewTierS3(
			params.Body.S3.Name,
			params.Body.S3.Accesskey,
			params.Body.S3.Secretkey,
			params.Body.S3.Bucket,
			madmin.S3Region(params.Body.S3.Region),
			madmin.S3Prefix(params.Body.S3.Prefix),
			madmin.S3Endpoint(params.Body.S3.Endpoint),
			madmin.S3StorageClass(params.Body.S3.Storageclass),
		)
		if err != nil {
			return err
		}
	case models.TierTypeMinio:
		cfg, err = madmin.NewTierMinIO(
			params.Body.Minio.Name,
			params.Body.Minio.Endpoint,
			params.Body.Minio.Accesskey,
			params.Body.Minio.Secretkey,
			params.Body.Minio.Bucket,
			madmin.MinIORegion(params.Body.Minio.Region),
			madmin.MinIOPrefix(params.Body.Minio.Prefix),
		)
		if err != nil {
			return err
		}
	case models.TierTypeGcs:
		gcsOpts := []madmin.GCSOptions{}
		prefix := params.Body.Gcs.Prefix
		if prefix != "" {
			gcsOpts = append(gcsOpts, madmin.GCSPrefix(prefix))
		}

		region := params.Body.Gcs.Region
		if region != "" {
			gcsOpts = append(gcsOpts, madmin.GCSRegion(region))
		}
		base64Text := make([]byte, base64.StdEncoding.EncodedLen(len(params.Body.Gcs.Creds)))
		l, _ := base64.StdEncoding.Decode(base64Text, []byte(params.Body.Gcs.Creds))

		cfg, err = madmin.NewTierGCS(
			params.Body.Gcs.Name,
			base64Text[:l],
			params.Body.Gcs.Bucket,
			gcsOpts...,
		)
		if err != nil {
			return err
		}
	case models.TierTypeAzure:
		cfg, err = madmin.NewTierAzure(
			params.Body.Azure.Name,
			params.Body.Azure.Accountname,
			params.Body.Azure.Accountkey,
			params.Body.Azure.Bucket,
			madmin.AzurePrefix(params.Body.Azure.Prefix),
			madmin.AzureEndpoint(params.Body.Azure.Endpoint),
			madmin.AzureRegion(params.Body.Azure.Region),
		)
		if err != nil {
			return err
		}
	case models.TierTypeUnsupported:
		cfg = &madmin.TierConfig{
			Type: madmin.Unsupported,
		}

	}

	err = client.addTier(ctx, cfg)
	if err != nil {
		return err
	}
	return nil
}

// getAddTierResponse returns the response of admin tier
func getAddTierResponse(session *models.Principal, params tieringApi.AddTierParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	// serialize output
	errTier := addTier(ctx, adminClient, &params)
	if errTier != nil {
		return ErrorWithContext(ctx, errTier)
	}
	return nil
}

func getTier(ctx context.Context, client MinioAdmin, params *tieringApi.GetTierParams) (*models.Tier, error) {
	tiers, err := client.listTiers(ctx)
	if err != nil {
		return nil, err
	}
	for i := range tiers {
		switch tiers[i].Type {
		case madmin.S3:
			if params.Type != models.TierTypeS3 || tiers[i].Name != params.Name {
				continue
			}
			return &models.Tier{
				Type: models.TierTypeS3,
				S3: &models.TierS3{
					Accesskey:    tiers[i].S3.AccessKey,
					Bucket:       tiers[i].S3.Bucket,
					Endpoint:     tiers[i].S3.Endpoint,
					Name:         tiers[i].Name,
					Prefix:       tiers[i].S3.Prefix,
					Region:       tiers[i].S3.Region,
					Secretkey:    tiers[i].S3.SecretKey,
					Storageclass: tiers[i].S3.StorageClass,
				},
			}, err
		case madmin.GCS:
			if params.Type != models.TierTypeGcs || tiers[i].Name != params.Name {
				continue
			}
			return &models.Tier{
				Type: models.TierTypeGcs,
				Gcs: &models.TierGcs{
					Bucket:   tiers[i].GCS.Bucket,
					Creds:    tiers[i].GCS.Creds,
					Endpoint: tiers[i].GCS.Endpoint,
					Name:     tiers[i].Name,
					Prefix:   tiers[i].GCS.Prefix,
					Region:   tiers[i].GCS.Region,
				},
			}, nil
		case madmin.Azure:
			if params.Type != models.TierTypeAzure || tiers[i].Name != params.Name {
				continue
			}
			return &models.Tier{
				Type: models.TierTypeAzure,
				Azure: &models.TierAzure{
					Accountkey:  tiers[i].Azure.AccountKey,
					Accountname: tiers[i].Azure.AccountName,
					Bucket:      tiers[i].Azure.Bucket,
					Endpoint:    tiers[i].Azure.Endpoint,
					Name:        tiers[i].Name,
					Prefix:      tiers[i].Azure.Prefix,
					Region:      tiers[i].Azure.Region,
				},
			}, nil
		}
	}

	// build response
	return nil, ErrNotFound
}

// getGetTierResponse returns a tier
func getGetTierResponse(session *models.Principal, params tieringApi.GetTierParams) (*models.Tier, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	// serialize output
	addTierResp, err := getTier(ctx, adminClient, &params)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return addTierResp, nil
}

func editTierCredentials(ctx context.Context, client MinioAdmin, params *tieringApi.EditTierCredentialsParams) error {
	base64Text := make([]byte, base64.StdEncoding.EncodedLen(len(params.Body.Creds)))
	l, err := base64.StdEncoding.Decode(base64Text, []byte(params.Body.Creds))
	if err != nil {
		return err
	}

	creds := madmin.TierCreds{
		AccessKey: params.Body.AccessKey,
		SecretKey: params.Body.SecretKey,
		CredsJSON: base64Text[:l],
	}
	return client.editTierCreds(ctx, params.Name, creds)
}

// getEditTierCredentialsResponse returns the result of editing credentials for a tier
func getEditTierCredentialsResponse(session *models.Principal, params tieringApi.EditTierCredentialsParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	// serialize output
	err = editTierCredentials(ctx, adminClient, &params)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func removeTier(ctx context.Context, client MinioAdmin, params *tieringApi.RemoveTierParams) error {
	return client.removeTier(ctx, params.Name)
}

func getRemoveTierResponse(session *models.Principal, params tieringApi.RemoveTierParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	// serialize output
	err = removeTier(ctx, adminClient, &params)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

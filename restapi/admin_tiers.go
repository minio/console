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

package restapi

import (
	"context"
	"encoding/base64"
	"time"

	"github.com/minio/madmin-go"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerAdminTiersHandlers(api *operations.ConsoleAPI) {
	// return a list of notification endpoints
	api.AdminAPITiersListHandler = admin_api.TiersListHandlerFunc(func(params admin_api.TiersListParams, session *models.Principal) middleware.Responder {
		tierList, err := getTiersResponse(session)
		if err != nil {
			return admin_api.NewTiersListDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTiersListOK().WithPayload(tierList)
	})
	// add a new tiers
	api.AdminAPIAddTierHandler = admin_api.AddTierHandlerFunc(func(params admin_api.AddTierParams, session *models.Principal) middleware.Responder {
		err := getAddTierResponse(session, &params)
		if err != nil {
			return admin_api.NewAddTierDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAddTierCreated()
	})
	// get a tier
	api.AdminAPIGetTierHandler = admin_api.GetTierHandlerFunc(func(params admin_api.GetTierParams, session *models.Principal) middleware.Responder {
		notifEndpoints, err := getGetTierResponse(session, &params)
		if err != nil {
			return admin_api.NewGetTierDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetTierOK().WithPayload(notifEndpoints)
	})
	// edit credentials for a tier
	api.AdminAPIEditTierCredentialsHandler = admin_api.EditTierCredentialsHandlerFunc(func(params admin_api.EditTierCredentialsParams, session *models.Principal) middleware.Responder {
		err := getEditTierCredentialsResponse(session, &params)
		if err != nil {
			return admin_api.NewEditTierCredentialsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewEditTierCredentialsOK()
	})

}

// getNotificationEndpoints invokes admin info and returns a list of notification endpoints
func getTiers(ctx context.Context, client MinioAdmin) (*models.TierListResponse, error) {
	tiers, err := client.listTiers(ctx)
	if err != nil {
		return nil, err
	}

	var tiersList []*models.Tier
	for i := range tiers {

		switch tiers[i].Type {
		case madmin.S3:
			tiersList = append(tiersList, &models.Tier{
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
			})
		case madmin.GCS:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeGcs,
				Gcs: &models.TierGcs{
					Bucket:   tiers[i].GCS.Bucket,
					Creds:    tiers[i].GCS.Creds,
					Endpoint: tiers[i].GCS.Endpoint,
					Name:     tiers[i].Name,
					Prefix:   tiers[i].GCS.Prefix,
					Region:   tiers[i].GCS.Region,
				},
			})
		case madmin.Azure:
			tiersList = append(tiersList, &models.Tier{
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
			})
		case madmin.Unsupported:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeUnsupported,
			})

		}
	}

	// build response
	return &models.TierListResponse{
		Items: tiersList,
	}, nil
}

// getTiersResponse returns a response with a list of tiers
func getTiersResponse(session *models.Principal) (*models.TierListResponse, *models.Error) {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	tiersResp, err := getTiers(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	return tiersResp, nil
}

func addTier(ctx context.Context, client MinioAdmin, params *admin_api.AddTierParams) error {

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
func getAddTierResponse(session *models.Principal, params *admin_api.AddTierParams) *models.Error {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	errTier := addTier(ctx, adminClient, params)
	if errTier != nil {
		return prepareError(errTier)
	}
	return nil
}

func getTier(ctx context.Context, client MinioAdmin, params *admin_api.GetTierParams) (*models.Tier, error) {

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
	return nil, ErrorGenericNotFound
}

// getGetTierResponse returns a tier
func getGetTierResponse(session *models.Principal, params *admin_api.GetTierParams) (*models.Tier, *models.Error) {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	addTierResp, err := getTier(ctx, adminClient, params)
	if err != nil {
		return nil, prepareError(err)
	}
	return addTierResp, nil
}

func editTierCredentials(ctx context.Context, client MinioAdmin, params *admin_api.EditTierCredentialsParams) error {
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
func getEditTierCredentialsResponse(session *models.Principal, params *admin_api.EditTierCredentialsParams) *models.Error {
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	err = editTierCredentials(ctx, adminClient, params)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

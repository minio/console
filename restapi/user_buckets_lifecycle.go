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
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/rs/xid"

	"github.com/minio/mc/pkg/probe"

	"github.com/minio/mc/cmd/ilm"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/lifecycle"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

func registerBucketsLifecycleHandlers(api *operations.ConsoleAPI) {
	api.UserAPIGetBucketLifecycleHandler = user_api.GetBucketLifecycleHandlerFunc(func(params user_api.GetBucketLifecycleParams, session *models.Principal) middleware.Responder {
		listBucketLifecycleResponse, err := getBucketLifecycleResponse(session, params)
		if err != nil {
			return user_api.NewGetBucketLifecycleDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewGetBucketLifecycleOK().WithPayload(listBucketLifecycleResponse)
	})
	api.UserAPIAddBucketLifecycleHandler = user_api.AddBucketLifecycleHandlerFunc(func(params user_api.AddBucketLifecycleParams, session *models.Principal) middleware.Responder {
		err := getAddBucketLifecycleResponse(session, params)
		if err != nil {
			return user_api.NewAddBucketLifecycleDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewAddBucketLifecycleCreated()
	})
}

// getBucketLifecycle() gets lifecycle lists for a bucket from MinIO API and returns their implementations
func getBucketLifecycle(ctx context.Context, client MinioClient, bucketName string) (*models.BucketLifecycleResponse, error) {
	lifecycleList, err := client.getLifecycleRules(ctx, bucketName)
	if err != nil {
		return nil, err
	}

	var rules []*models.ObjectBucketLifecycle

	for _, rule := range lifecycleList.Rules {

		var tags []*models.LifecycleTag

		for _, tagData := range rule.RuleFilter.And.Tags {
			tags = append(tags, &models.LifecycleTag{
				Key:   tagData.Key,
				Value: tagData.Value,
			})
		}

		rules = append(rules, &models.ObjectBucketLifecycle{
			ID:         rule.ID,
			Status:     rule.Status,
			Prefix:     rule.RuleFilter.And.Prefix,
			Expiration: &models.ExpirationResponse{Date: rule.Expiration.Date.Format(time.RFC3339), Days: int64(rule.Expiration.Days), DeleteMarker: rule.Expiration.DeleteMarker.IsEnabled()},
			Transition: &models.TransitionResponse{Date: rule.Transition.Date.Format(time.RFC3339), Days: int64(rule.Transition.Days), StorageClass: rule.Transition.StorageClass},
			Tags:       tags,
		})
	}

	// serialize output
	lifecycleBucketsResponse := &models.BucketLifecycleResponse{
		Lifecycle: rules,
	}

	return lifecycleBucketsResponse, nil
}

// getBucketLifecycleResponse performs getBucketLifecycle() and serializes it to the handler's output
func getBucketLifecycleResponse(session *models.Principal, params user_api.GetBucketLifecycleParams) (*models.BucketLifecycleResponse, *models.Error) {
	ctx := context.Background()
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	bucketEvents, err := getBucketLifecycle(ctx, minioClient, params.BucketName)
	if err != nil {
		return nil, prepareError(errBucketLifeCycleNotConfigured, err)
	}
	return bucketEvents, nil
}

// addBucketLifecycle gets lifecycle lists for a bucket from MinIO API and returns their implementations
func addBucketLifecycle(ctx context.Context, client MinioClient, params user_api.AddBucketLifecycleParams) error {
	// Configuration that is already set.
	lfcCfg, err := client.getLifecycleRules(ctx, params.BucketName)
	if err != nil {
		if e := err; minio.ToErrorResponse(e).Code == "NoSuchLifecycleConfiguration" {
			lfcCfg = lifecycle.NewConfiguration()
		} else {
			return err
		}
	}

	id := xid.New().String()

	opts := ilm.LifecycleOptions{}

	// Verify if transition items are set
	if params.Body.ExpiryDate == "" && params.Body.ExpiryDays == 0 {
		if params.Body.TransitionDate != "" && params.Body.TransitionDays != 0 {
			return errors.New("only one transition configuration can be set (days or date)")
		}

		if params.Body.ExpiryDate != "" || params.Body.ExpiryDays != 0 {
			return errors.New("expiry cannot be set when transition is being configured")
		}

		if params.Body.NoncurrentversionExpirationDays != 0 {
			return errors.New("non current version Expiration Days cannot be set when transition is being configured")
		}

		if params.Body.TransitionDate != "" {
			opts = ilm.LifecycleOptions{
				ID:                                      id,
				Prefix:                                  params.Body.Prefix,
				Status:                                  !params.Body.Disable,
				IsTagsSet:                               params.Body.Tags != "",
				IsStorageClassSet:                       params.Body.StorageClass != "",
				Tags:                                    params.Body.Tags,
				TransitionDate:                          params.Body.TransitionDate,
				StorageClass:                            strings.ToUpper(params.Body.StorageClass),
				ExpiredObjectDeleteMarker:               params.Body.ExpiredObjectDeleteMarker,
				NoncurrentVersionTransitionDays:         int(params.Body.NoncurrentversionTransitionDays),
				NoncurrentVersionTransitionStorageClass: strings.ToUpper(params.Body.NoncurrentversionTransitionStorageClass),
			}
		} else if params.Body.TransitionDays != 0 {
			opts = ilm.LifecycleOptions{
				ID:                                      id,
				Prefix:                                  params.Body.Prefix,
				Status:                                  !params.Body.Disable,
				IsTagsSet:                               params.Body.Tags != "",
				IsStorageClassSet:                       params.Body.StorageClass != "",
				Tags:                                    params.Body.Tags,
				TransitionDays:                          strconv.Itoa(int(params.Body.TransitionDays)),
				StorageClass:                            strings.ToUpper(params.Body.StorageClass),
				ExpiredObjectDeleteMarker:               params.Body.ExpiredObjectDeleteMarker,
				NoncurrentVersionTransitionDays:         int(params.Body.NoncurrentversionTransitionDays),
				NoncurrentVersionTransitionStorageClass: strings.ToUpper(params.Body.NoncurrentversionTransitionStorageClass),
			}
		}
	} else if params.Body.TransitionDate == "" && params.Body.TransitionDays == 0 {
		// Verify if expiry items are set
		if params.Body.ExpiryDate != "" && params.Body.ExpiryDays != 0 {
			return errors.New("only one expiry configuration can be set (days or date)")
		}

		if params.Body.TransitionDate != "" || params.Body.TransitionDays != 0 {
			return errors.New("transition cannot be set when expiry is being configured")
		}

		if params.Body.NoncurrentversionTransitionDays != 0 {
			return errors.New("non current version Transition Days cannot be set when expiry is being configured")
		}

		if params.Body.NoncurrentversionTransitionStorageClass != "" {
			return errors.New("non current version Transition Storage Class cannot be set when expiry is being configured")
		}

		if params.Body.ExpiryDate != "" {
			opts = ilm.LifecycleOptions{
				ID:                              id,
				Prefix:                          params.Body.Prefix,
				Status:                          !params.Body.Disable,
				IsTagsSet:                       params.Body.Tags != "",
				IsStorageClassSet:               params.Body.StorageClass != "",
				Tags:                            params.Body.Tags,
				ExpiryDate:                      params.Body.ExpiryDate,
				ExpiredObjectDeleteMarker:       params.Body.ExpiredObjectDeleteMarker,
				NoncurrentVersionExpirationDays: int(params.Body.NoncurrentversionExpirationDays),
			}
		} else if params.Body.ExpiryDays != 0 {
			opts = ilm.LifecycleOptions{
				ID:                              id,
				Prefix:                          params.Body.Prefix,
				Status:                          !params.Body.Disable,
				IsTagsSet:                       params.Body.Tags != "",
				IsStorageClassSet:               params.Body.StorageClass != "",
				Tags:                            params.Body.Tags,
				ExpiryDays:                      strconv.Itoa(int(params.Body.ExpiryDays)),
				ExpiredObjectDeleteMarker:       params.Body.ExpiredObjectDeleteMarker,
				NoncurrentVersionExpirationDays: int(params.Body.NoncurrentversionExpirationDays),
			}
		}

	} else {
		// Non set, we return error
		return errors.New("no valid configuration is set")
	}

	var err2 *probe.Error
	lfcCfg, err2 = opts.ToConfig(lfcCfg)
	if err2.ToGoError() != nil {
		return err2.ToGoError()
	}

	return client.setBucketLifecycle(ctx, params.BucketName, lfcCfg)
}

// getAddBucketLifecycleResponse returns the respose of adding a bucket lifecycle response
func getAddBucketLifecycleResponse(session *models.Principal, params user_api.AddBucketLifecycleParams) *models.Error {
	ctx := context.Background()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	err = addBucketLifecycle(ctx, minioClient, params)
	if err != nil {
		return prepareError(err)
	}

	return nil
}

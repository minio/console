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
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"

	"github.com/rs/xid"

	"github.com/minio/mc/cmd/ilm"

	"github.com/minio/minio-go/v7/pkg/lifecycle"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	bucketApi "github.com/minio/console/api/operations/bucket"
	"github.com/minio/console/models"
)

type MultiLifecycleResult struct {
	BucketName string
	Error      string
}

func registerBucketsLifecycleHandlers(api *operations.ConsoleAPI) {
	api.BucketGetBucketLifecycleHandler = bucketApi.GetBucketLifecycleHandlerFunc(func(params bucketApi.GetBucketLifecycleParams, session *models.Principal) middleware.Responder {
		listBucketLifecycleResponse, err := getBucketLifecycleResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketLifecycleDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketLifecycleOK().WithPayload(listBucketLifecycleResponse)
	})
	api.BucketAddBucketLifecycleHandler = bucketApi.AddBucketLifecycleHandlerFunc(func(params bucketApi.AddBucketLifecycleParams, session *models.Principal) middleware.Responder {
		err := getAddBucketLifecycleResponse(session, params)
		if err != nil {
			return bucketApi.NewAddBucketLifecycleDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewAddBucketLifecycleCreated()
	})
	api.BucketUpdateBucketLifecycleHandler = bucketApi.UpdateBucketLifecycleHandlerFunc(func(params bucketApi.UpdateBucketLifecycleParams, session *models.Principal) middleware.Responder {
		err := getEditBucketLifecycleRule(session, params)
		if err != nil {
			return bucketApi.NewUpdateBucketLifecycleDefault(err.Code).WithPayload(err.APIError)
		}

		return bucketApi.NewUpdateBucketLifecycleOK()
	})
	api.BucketDeleteBucketLifecycleRuleHandler = bucketApi.DeleteBucketLifecycleRuleHandlerFunc(func(params bucketApi.DeleteBucketLifecycleRuleParams, session *models.Principal) middleware.Responder {
		err := getDeleteBucketLifecycleRule(session, params)
		if err != nil {
			return bucketApi.NewDeleteBucketLifecycleRuleDefault(err.Code).WithPayload(err.APIError)
		}

		return bucketApi.NewDeleteBucketLifecycleRuleNoContent()
	})
	api.BucketAddMultiBucketLifecycleHandler = bucketApi.AddMultiBucketLifecycleHandlerFunc(func(params bucketApi.AddMultiBucketLifecycleParams, session *models.Principal) middleware.Responder {
		multiBucketResponse, err := getAddMultiBucketLifecycleResponse(session, params)
		if err != nil {
			bucketApi.NewAddMultiBucketLifecycleDefault(err.Code).WithPayload(err.APIError)
		}

		return bucketApi.NewAddMultiBucketLifecycleOK().WithPayload(multiBucketResponse)
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
		if rule.RuleFilter.Tag.Key != "" {
			tags = append(tags, &models.LifecycleTag{
				Key:   rule.RuleFilter.Tag.Key,
				Value: rule.RuleFilter.Tag.Value,
			})
		}
		rulePrefix := rule.RuleFilter.And.Prefix

		if rulePrefix == "" {
			rulePrefix = rule.RuleFilter.Prefix
		}

		rules = append(rules, &models.ObjectBucketLifecycle{
			ID:     rule.ID,
			Status: rule.Status,
			Prefix: rulePrefix,
			Expiration: &models.ExpirationResponse{
				Date:                              rule.Expiration.Date.Format(time.RFC3339),
				Days:                              int64(rule.Expiration.Days),
				DeleteMarker:                      rule.Expiration.DeleteMarker.IsEnabled(),
				DeleteAll:                         bool(rule.Expiration.DeleteAll),
				NoncurrentExpirationDays:          int64(rule.NoncurrentVersionExpiration.NoncurrentDays),
				NewerNoncurrentExpirationVersions: int64(rule.NoncurrentVersionExpiration.NewerNoncurrentVersions),
			},
			Transition: &models.TransitionResponse{
				Date:                     rule.Transition.Date.Format(time.RFC3339),
				Days:                     int64(rule.Transition.Days),
				StorageClass:             rule.Transition.StorageClass,
				NoncurrentStorageClass:   rule.NoncurrentVersionTransition.StorageClass,
				NoncurrentTransitionDays: int64(rule.NoncurrentVersionTransition.NoncurrentDays),
			},
			Tags: tags,
		})
	}

	// serialize output
	lifecycleBucketsResponse := &models.BucketLifecycleResponse{
		Lifecycle: rules,
	}

	return lifecycleBucketsResponse, nil
}

// getBucketLifecycleResponse performs getBucketLifecycle() and serializes it to the handler's output
func getBucketLifecycleResponse(session *models.Principal, params bucketApi.GetBucketLifecycleParams) (*models.BucketLifecycleResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	bucketEvents, err := getBucketLifecycle(ctx, minioClient, params.BucketName)
	if err != nil {
		return nil, ErrorWithContext(ctx, ErrBucketLifeCycleNotConfigured, err)
	}
	return bucketEvents, nil
}

// addBucketLifecycle gets lifecycle lists for a bucket from MinIO API and returns their implementations
func addBucketLifecycle(ctx context.Context, client MinioClient, params bucketApi.AddBucketLifecycleParams) error {
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

	// Verify if transition rule is requested
	switch params.Body.Type {
	case models.AddBucketLifecycleTypeTransition:
		if params.Body.TransitionDays == 0 && params.Body.NoncurrentversionTransitionDays == 0 {
			return errors.New("you must provide a value for transition days or date")
		}

		status := !params.Body.Disable
		opts = ilm.LifecycleOptions{
			ID:                        id,
			Prefix:                    &params.Body.Prefix,
			Status:                    &status,
			Tags:                      &params.Body.Tags,
			ExpiredObjectDeleteMarker: &params.Body.ExpiredObjectDeleteMarker,
			ExpiredObjectAllversions:  &params.Body.ExpiredObjectDeleteAll,
		}

		if params.Body.NoncurrentversionTransitionDays > 0 {
			noncurrentVersionTransitionDays := int(params.Body.NoncurrentversionTransitionDays)
			noncurrentVersionTransitionStorageClass := strings.ToUpper(params.Body.NoncurrentversionTransitionStorageClass)
			opts.NoncurrentVersionTransitionDays = &noncurrentVersionTransitionDays
			opts.NoncurrentVersionTransitionStorageClass = &noncurrentVersionTransitionStorageClass
		} else if params.Body.TransitionDays > 0 {
			tdays := strconv.Itoa(int(params.Body.TransitionDays))
			sclass := strings.ToUpper(params.Body.StorageClass)
			opts.TransitionDays = &tdays
			opts.StorageClass = &sclass
		}

	case models.AddBucketLifecycleTypeExpiry:
		// Verify if expiry items are set
		if params.Body.NoncurrentversionTransitionDays != 0 {
			return errors.New("non current version Transition Days cannot be set when expiry is being configured")
		}

		if params.Body.NoncurrentversionTransitionStorageClass != "" {
			return errors.New("non current version Transition Storage Class cannot be set when expiry is being configured")
		}

		status := !params.Body.Disable
		opts = ilm.LifecycleOptions{
			ID:                        id,
			Prefix:                    &params.Body.Prefix,
			Status:                    &status,
			Tags:                      &params.Body.Tags,
			ExpiredObjectDeleteMarker: &params.Body.ExpiredObjectDeleteMarker,
			ExpiredObjectAllversions:  &params.Body.ExpiredObjectDeleteAll,
		}

		if params.Body.NewerNoncurrentversionExpirationVersions > 0 {
			versions := int(params.Body.NewerNoncurrentversionExpirationVersions)
			opts.NewerNoncurrentExpirationVersions = &versions
		}
		switch {
		case params.Body.NoncurrentversionExpirationDays > 0:
			days := int(params.Body.NoncurrentversionExpirationDays)
			opts.NoncurrentVersionExpirationDays = &days
		case params.Body.ExpiryDays > 0:
			days := strconv.Itoa(int(params.Body.ExpiryDays))
			opts.ExpiryDays = &days
		}
	default:
		// Non set, we return errors
		return errors.New("no valid lifecycle configuration requested")
	}

	newRule, merr := opts.ToILMRule()
	if merr != nil {
		return merr.ToGoError()
	}

	lfcCfg.Rules = append(lfcCfg.Rules, newRule)

	return client.setBucketLifecycle(ctx, params.BucketName, lfcCfg)
}

// getAddBucketLifecycleResponse returns the response of adding a bucket lifecycle response
func getAddBucketLifecycleResponse(session *models.Principal, params bucketApi.AddBucketLifecycleParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	err = addBucketLifecycle(ctx, minioClient, params)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	return nil
}

// editBucketLifecycle gets lifecycle lists for a bucket from MinIO API and updates the selected lifecycle rule
func editBucketLifecycle(ctx context.Context, client MinioClient, params bucketApi.UpdateBucketLifecycleParams) error {
	// Configuration that is already set.
	lfcCfg, err := client.getLifecycleRules(ctx, params.BucketName)
	if err != nil {
		if e := err; minio.ToErrorResponse(e).Code == "NoSuchLifecycleConfiguration" {
			lfcCfg = lifecycle.NewConfiguration()
		} else {
			return err
		}
	}

	id := params.LifecycleID

	opts := ilm.LifecycleOptions{}

	// Verify if transition items are set
	switch *params.Body.Type {
	case models.UpdateBucketLifecycleTypeTransition:
		if params.Body.TransitionDays == 0 && params.Body.NoncurrentversionTransitionDays == 0 {
			return errors.New("you must select transition days or non-current transition days configuration")
		}

		status := !params.Body.Disable
		opts = ilm.LifecycleOptions{
			ID:                        id,
			Prefix:                    &params.Body.Prefix,
			Status:                    &status,
			Tags:                      &params.Body.Tags,
			ExpiredObjectDeleteMarker: &params.Body.ExpiredObjectDeleteMarker,
			ExpiredObjectAllversions:  &params.Body.ExpiredObjectDeleteAll,
		}

		if params.Body.NoncurrentversionTransitionDays > 0 {
			noncurrentVersionTransitionDays := int(params.Body.NoncurrentversionTransitionDays)
			noncurrentVersionTransitionStorageClass := strings.ToUpper(params.Body.NoncurrentversionTransitionStorageClass)
			opts.NoncurrentVersionTransitionDays = &noncurrentVersionTransitionDays
			opts.NoncurrentVersionTransitionStorageClass = &noncurrentVersionTransitionStorageClass

		} else {
			tdays := strconv.Itoa(int(params.Body.TransitionDays))
			sclass := strings.ToUpper(params.Body.StorageClass)
			opts.TransitionDays = &tdays
			opts.StorageClass = &sclass
		}
	case models.UpdateBucketLifecycleTypeExpiry: // Verify if expiry configuration is set
		if params.Body.NoncurrentversionTransitionDays != 0 {
			return errors.New("non current version Transition Days cannot be set when expiry is being configured")
		}

		if params.Body.NoncurrentversionTransitionStorageClass != "" {
			return errors.New("non current version Transition Storage Class cannot be set when expiry is being configured")
		}

		status := !params.Body.Disable
		opts = ilm.LifecycleOptions{
			ID:                        id,
			Prefix:                    &params.Body.Prefix,
			Status:                    &status,
			Tags:                      &params.Body.Tags,
			ExpiredObjectDeleteMarker: &params.Body.ExpiredObjectDeleteMarker,
			ExpiredObjectAllversions:  &params.Body.ExpiredObjectDeleteAll,
		}

		if params.Body.NoncurrentversionExpirationDays > 0 {
			days := int(params.Body.NoncurrentversionExpirationDays)
			opts.NoncurrentVersionExpirationDays = &days
		} else {
			days := strconv.Itoa(int(params.Body.ExpiryDays))
			opts.ExpiryDays = &days
		}
	default:
		// Non set, we return errors
		return errors.New("no valid configuration requested")
	}

	var rule *lifecycle.Rule
	for i := range lfcCfg.Rules {
		if lfcCfg.Rules[i].ID == opts.ID {
			rule = &lfcCfg.Rules[i]
			break
		}
	}
	if rule == nil {
		return errors.New("unable to find the matching rule to update")
	}

	err2 := ilm.ApplyRuleFields(rule, opts)
	if err2.ToGoError() != nil {
		return fmt.Errorf("Unable to generate new lifecycle rule: %v", err2.ToGoError())
	}

	return client.setBucketLifecycle(ctx, params.BucketName, lfcCfg)
}

// getEditBucketLifecycleRule returns the response of bucket lifecycle tier edit
func getEditBucketLifecycleRule(session *models.Principal, params bucketApi.UpdateBucketLifecycleParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	err = editBucketLifecycle(ctx, minioClient, params)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	return nil
}

// deleteBucketLifecycle deletes lifecycle rule by passing an empty rule to a selected ID
func deleteBucketLifecycle(ctx context.Context, client MinioClient, params bucketApi.DeleteBucketLifecycleRuleParams) error {
	// Configuration that is already set.
	lfcCfg, err := client.getLifecycleRules(ctx, params.BucketName)
	if err != nil {
		if e := err; minio.ToErrorResponse(e).Code == "NoSuchLifecycleConfiguration" {
			lfcCfg = lifecycle.NewConfiguration()
		} else {
			return err
		}
	}

	if len(lfcCfg.Rules) == 0 {
		return errors.New("no rules available to delete")
	}

	var newRules []lifecycle.Rule

	for _, rule := range lfcCfg.Rules {
		if rule.ID != params.LifecycleID {
			newRules = append(newRules, rule)
		}
	}

	if len(newRules) == len(lfcCfg.Rules) && len(lfcCfg.Rules) > 0 {
		// rule doesn't exist
		return fmt.Errorf("lifecycle rule for id '%s' doesn't exist", params.LifecycleID)
	}

	lfcCfg.Rules = newRules

	return client.setBucketLifecycle(ctx, params.BucketName, lfcCfg)
}

// getDeleteBucketLifecycleRule returns the response of bucket lifecycle tier delete
func getDeleteBucketLifecycleRule(session *models.Principal, params bucketApi.DeleteBucketLifecycleRuleParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	err = deleteBucketLifecycle(ctx, minioClient, params)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	return nil
}

// addMultiBucketLifecycle creates multibuckets lifecycle assignments
func addMultiBucketLifecycle(ctx context.Context, client MinioClient, params bucketApi.AddMultiBucketLifecycleParams) []MultiLifecycleResult {
	bucketsRelation := params.Body.Buckets

	// Parallel Lifecycle rules set

	parallelLifecycleBucket := func(bucketName string) chan MultiLifecycleResult {
		remoteProc := make(chan MultiLifecycleResult)

		lifecycleParams := models.AddBucketLifecycle{
			Type:                                    *params.Body.Type,
			StorageClass:                            params.Body.StorageClass,
			TransitionDays:                          params.Body.TransitionDays,
			Prefix:                                  params.Body.Prefix,
			NoncurrentversionTransitionDays:         params.Body.NoncurrentversionTransitionDays,
			NoncurrentversionTransitionStorageClass: params.Body.NoncurrentversionTransitionStorageClass,
			NoncurrentversionExpirationDays:         params.Body.NoncurrentversionExpirationDays,
			Tags:                                    params.Body.Tags,
			ExpiryDays:                              params.Body.ExpiryDays,
			Disable:                                 false,
			ExpiredObjectDeleteMarker:               params.Body.ExpiredObjectDeleteMarker,
			ExpiredObjectDeleteAll:                  params.Body.ExpiredObjectDeleteMarker,
		}

		go func() {
			defer close(remoteProc)

			lifecycleParams := bucketApi.AddBucketLifecycleParams{
				BucketName: bucketName,
				Body:       &lifecycleParams,
			}

			// We add lifecycle rule & expect a response
			err := addBucketLifecycle(ctx, client, lifecycleParams)

			errorReturn := ""

			if err != nil {
				errorReturn = err.Error()
			}

			retParams := MultiLifecycleResult{
				BucketName: bucketName,
				Error:      errorReturn,
			}

			remoteProc <- retParams
		}()
		return remoteProc
	}

	var lifecycleManagement []chan MultiLifecycleResult

	for _, bucketName := range bucketsRelation {
		rBucket := parallelLifecycleBucket(bucketName)
		lifecycleManagement = append(lifecycleManagement, rBucket)
	}

	var resultsList []MultiLifecycleResult
	for _, result := range lifecycleManagement {
		res := <-result
		resultsList = append(resultsList, res)
	}

	return resultsList
}

// getAddMultiBucketLifecycleResponse returns the response of multibucket lifecycle assignment
func getAddMultiBucketLifecycleResponse(session *models.Principal, params bucketApi.AddMultiBucketLifecycleParams) (*models.MultiLifecycleResult, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	multiCycleResult := addMultiBucketLifecycle(ctx, minioClient, params)

	var returnList []*models.MulticycleResultItem

	for _, resultItem := range multiCycleResult {
		multicycleRS := models.MulticycleResultItem{
			BucketName: resultItem.BucketName,
			Error:      resultItem.Error,
		}

		returnList = append(returnList, &multicycleRS)
	}

	finalResult := models.MultiLifecycleResult{Results: returnList}

	return &finalResult, nil
}

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
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"

	"github.com/minio/madmin-go/v3"
	"github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio-go/v7/pkg/sse"
	"github.com/minio/minio-go/v7/pkg/tags"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/api/operations"
	bucketApi "github.com/minio/console/api/operations/bucket"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth/token"
	"github.com/minio/minio-go/v7/pkg/policy"
	"github.com/minio/minio-go/v7/pkg/replication"
	minioIAMPolicy "github.com/minio/pkg/v3/policy"
)

func registerBucketsHandlers(api *operations.ConsoleAPI) {
	// list buckets
	api.BucketListBucketsHandler = bucketApi.ListBucketsHandlerFunc(func(params bucketApi.ListBucketsParams, session *models.Principal) middleware.Responder {
		listBucketsResponse, err := getListBucketsResponse(session, params)
		if err != nil {
			return bucketApi.NewListBucketsDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewListBucketsOK().WithPayload(listBucketsResponse)
	})
	// make bucket
	api.BucketMakeBucketHandler = bucketApi.MakeBucketHandlerFunc(func(params bucketApi.MakeBucketParams, session *models.Principal) middleware.Responder {
		makeBucketResponse, err := getMakeBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewMakeBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewMakeBucketOK().WithPayload(makeBucketResponse)
	})
	// delete bucket
	api.BucketDeleteBucketHandler = bucketApi.DeleteBucketHandlerFunc(func(params bucketApi.DeleteBucketParams, session *models.Principal) middleware.Responder {
		if err := getDeleteBucketResponse(session, params); err != nil {
			return bucketApi.NewMakeBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewDeleteBucketNoContent()
	})
	// get bucket info
	api.BucketBucketInfoHandler = bucketApi.BucketInfoHandlerFunc(func(params bucketApi.BucketInfoParams, session *models.Principal) middleware.Responder {
		bucketInfoResp, err := getBucketInfoResponse(session, params)
		if err != nil {
			return bucketApi.NewBucketInfoDefault(err.Code).WithPayload(err.APIError)
		}

		return bucketApi.NewBucketInfoOK().WithPayload(bucketInfoResp)
	})
	// set bucket policy
	api.BucketBucketSetPolicyHandler = bucketApi.BucketSetPolicyHandlerFunc(func(params bucketApi.BucketSetPolicyParams, session *models.Principal) middleware.Responder {
		bucketSetPolicyResp, err := getBucketSetPolicyResponse(session, params)
		if err != nil {
			return bucketApi.NewBucketSetPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewBucketSetPolicyOK().WithPayload(bucketSetPolicyResp)
	})
	// set bucket tags
	api.BucketPutBucketTagsHandler = bucketApi.PutBucketTagsHandlerFunc(func(params bucketApi.PutBucketTagsParams, session *models.Principal) middleware.Responder {
		err := getPutBucketTagsResponse(session, params)
		if err != nil {
			return bucketApi.NewPutBucketTagsDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewPutBucketTagsOK()
	})
	// get bucket versioning
	api.BucketGetBucketVersioningHandler = bucketApi.GetBucketVersioningHandlerFunc(func(params bucketApi.GetBucketVersioningParams, session *models.Principal) middleware.Responder {
		getBucketVersioning, err := getBucketVersionedResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketVersioningDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketVersioningOK().WithPayload(getBucketVersioning)
	})
	// update bucket versioning
	api.BucketSetBucketVersioningHandler = bucketApi.SetBucketVersioningHandlerFunc(func(params bucketApi.SetBucketVersioningParams, session *models.Principal) middleware.Responder {
		err := setBucketVersioningResponse(session, params)
		if err != nil {
			return bucketApi.NewSetBucketVersioningDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewSetBucketVersioningCreated()
	})
	// get bucket replication
	api.BucketGetBucketReplicationHandler = bucketApi.GetBucketReplicationHandlerFunc(func(params bucketApi.GetBucketReplicationParams, session *models.Principal) middleware.Responder {
		getBucketReplication, err := getBucketReplicationResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketReplicationDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketReplicationOK().WithPayload(getBucketReplication)
	})
	// get single bucket replication rule
	api.BucketGetBucketReplicationRuleHandler = bucketApi.GetBucketReplicationRuleHandlerFunc(func(params bucketApi.GetBucketReplicationRuleParams, session *models.Principal) middleware.Responder {
		getBucketReplicationRule, err := getBucketReplicationRuleResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketReplicationRuleDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketReplicationRuleOK().WithPayload(getBucketReplicationRule)
	})

	// enable bucket encryption
	api.BucketEnableBucketEncryptionHandler = bucketApi.EnableBucketEncryptionHandlerFunc(func(params bucketApi.EnableBucketEncryptionParams, session *models.Principal) middleware.Responder {
		if err := enableBucketEncryptionResponse(session, params); err != nil {
			return bucketApi.NewEnableBucketEncryptionDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewEnableBucketEncryptionOK()
	})
	// disable bucket encryption
	api.BucketDisableBucketEncryptionHandler = bucketApi.DisableBucketEncryptionHandlerFunc(func(params bucketApi.DisableBucketEncryptionParams, session *models.Principal) middleware.Responder {
		if err := disableBucketEncryptionResponse(session, params); err != nil {
			return bucketApi.NewDisableBucketEncryptionDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewDisableBucketEncryptionOK()
	})
	// get bucket encryption info
	api.BucketGetBucketEncryptionInfoHandler = bucketApi.GetBucketEncryptionInfoHandlerFunc(func(params bucketApi.GetBucketEncryptionInfoParams, session *models.Principal) middleware.Responder {
		response, err := getBucketEncryptionInfoResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketEncryptionInfoDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketEncryptionInfoOK().WithPayload(response)
	})
	// set bucket retention config
	api.BucketSetBucketRetentionConfigHandler = bucketApi.SetBucketRetentionConfigHandlerFunc(func(params bucketApi.SetBucketRetentionConfigParams, session *models.Principal) middleware.Responder {
		if err := getSetBucketRetentionConfigResponse(session, params); err != nil {
			return bucketApi.NewSetBucketRetentionConfigDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewSetBucketRetentionConfigOK()
	})
	// get bucket retention config
	api.BucketGetBucketRetentionConfigHandler = bucketApi.GetBucketRetentionConfigHandlerFunc(func(params bucketApi.GetBucketRetentionConfigParams, session *models.Principal) middleware.Responder {
		response, err := getBucketRetentionConfigResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketRetentionConfigDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketRetentionConfigOK().WithPayload(response)
	})
	// get bucket object locking status
	api.BucketGetBucketObjectLockingStatusHandler = bucketApi.GetBucketObjectLockingStatusHandlerFunc(func(params bucketApi.GetBucketObjectLockingStatusParams, session *models.Principal) middleware.Responder {
		getBucketObjectLockingStatus, err := getBucketObjectLockingResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketObjectLockingStatusDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketObjectLockingStatusOK().WithPayload(getBucketObjectLockingStatus)
	})
	// get objects rewind for a bucket
	api.BucketGetBucketRewindHandler = bucketApi.GetBucketRewindHandlerFunc(func(params bucketApi.GetBucketRewindParams, session *models.Principal) middleware.Responder {
		getBucketRewind, err := getBucketRewindResponse(session, params)
		if err != nil {
			return bucketApi.NewGetBucketRewindDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetBucketRewindOK().WithPayload(getBucketRewind)
	})
	// get max allowed share link expiration time
	api.BucketGetMaxShareLinkExpHandler = bucketApi.GetMaxShareLinkExpHandlerFunc(func(params bucketApi.GetMaxShareLinkExpParams, session *models.Principal) middleware.Responder {
		val, err := getMaxShareLinkExpirationResponse(session, params)
		if err != nil {
			return bucketApi.NewGetMaxShareLinkExpDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewGetMaxShareLinkExpOK().WithPayload(val)
	})
}

type VersionState string

const (
	VersionEnable  VersionState = "enable"
	VersionSuspend VersionState = "suspend"
)

// removeBucket deletes a bucket
func doSetVersioning(ctx context.Context, client MCClient, state VersionState, excludePrefix []string, excludeFolders bool) error {
	err := client.setVersioning(ctx, string(state), excludePrefix, excludeFolders)
	if err != nil {
		return err.Cause
	}

	return nil
}

func setBucketVersioningResponse(session *models.Principal, params bucketApi.SetBucketVersioningParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	bucketName := params.BucketName
	s3Client, err := newS3BucketClient(session, bucketName, "", getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	amcClient := mcClient{client: s3Client}

	versioningState := VersionSuspend

	if params.Body.Enabled {
		versioningState = VersionEnable
	}

	var excludePrefixes []string

	if params.Body.ExcludePrefixes != nil {
		excludePrefixes = params.Body.ExcludePrefixes
	}

	excludeFolders := params.Body.ExcludeFolders

	if err := doSetVersioning(ctx, amcClient, versioningState, excludePrefixes, excludeFolders); err != nil {
		return ErrorWithContext(ctx, fmt.Errorf("error setting versioning for bucket: %s", err))
	}
	return nil
}

func getBucketReplicationResponse(session *models.Principal, params bucketApi.GetBucketReplicationParams) (*models.BucketReplicationResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// we will tolerate this call failing
	res, err := minioClient.getBucketReplication(ctx, params.BucketName)
	if err != nil {
		ErrorWithContext(ctx, err)
	}

	var rules []*models.BucketReplicationRule

	for _, rule := range res.Rules {
		repDelMarkerStatus := rule.DeleteMarkerReplication.Status == replication.Enabled
		repDelStatus := rule.DeleteReplication.Status == replication.Enabled

		rules = append(rules, &models.BucketReplicationRule{
			DeleteMarkerReplication: repDelMarkerStatus,
			DeletesReplication:      repDelStatus,
			Destination:             &models.BucketReplicationDestination{Bucket: rule.Destination.Bucket},
			Tags:                    rule.Tags(),
			Prefix:                  rule.Prefix(),
			ID:                      rule.ID,
			Priority:                int32(rule.Priority),
			Status:                  string(rule.Status),
			StorageClass:            rule.Destination.StorageClass,
		})
	}

	// serialize output
	bucketRResponse := &models.BucketReplicationResponse{
		Rules: rules,
	}
	return bucketRResponse, nil
}

func getBucketReplicationRuleResponse(session *models.Principal, params bucketApi.GetBucketReplicationRuleParams) (*models.BucketReplicationRule, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation

	// defining the client to be used
	minioClient := minioClient{client: mClient}

	replicationRules, err := minioClient.getBucketReplication(ctx, params.BucketName)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	var foundRule replication.Rule
	found := false

	for i := range replicationRules.Rules {
		if replicationRules.Rules[i].ID == params.RuleID {
			foundRule = replicationRules.Rules[i]
			found = true
			break
		}
	}

	if !found {
		return nil, ErrorWithContext(ctx, errors.New("no rule is set with this ID"))
	}

	repDelMarkerStatus := foundRule.DeleteMarkerReplication.Status == replication.Enabled
	repDelStatus := foundRule.DeleteReplication.Status == replication.Enabled
	existingObjects := foundRule.ExistingObjectReplication.Status == replication.Enabled
	metadataModifications := foundRule.SourceSelectionCriteria.ReplicaModifications.Status == replication.Enabled

	returnRule := &models.BucketReplicationRule{
		DeleteMarkerReplication: repDelMarkerStatus,
		DeletesReplication:      repDelStatus,
		Destination:             &models.BucketReplicationDestination{Bucket: foundRule.Destination.Bucket},
		Tags:                    foundRule.Tags(),
		Prefix:                  foundRule.Prefix(),
		ID:                      foundRule.ID,
		Priority:                int32(foundRule.Priority),
		Status:                  string(foundRule.Status),
		StorageClass:            foundRule.Destination.StorageClass,
		ExistingObjects:         existingObjects,
		MetadataReplication:     metadataModifications,
	}

	return returnRule, nil
}

func getBucketVersionedResponse(session *models.Principal, params bucketApi.GetBucketVersioningParams) (*models.BucketVersioningResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// we will tolerate this call failing
	res, err := minioClient.getBucketVersioning(ctx, params.BucketName)
	if err != nil {
		ErrorWithContext(ctx, fmt.Errorf("error versioning bucket: %v", err))
	}

	excludedPrefixes := make([]*models.BucketVersioningResponseExcludedPrefixesItems0, len(res.ExcludedPrefixes))
	for i, v := range res.ExcludedPrefixes {
		excludedPrefixes[i] = &models.BucketVersioningResponseExcludedPrefixesItems0{
			Prefix: v.Prefix,
		}
	}

	// serialize output
	bucketVResponse := &models.BucketVersioningResponse{
		ExcludeFolders:   res.ExcludeFolders,
		ExcludedPrefixes: excludedPrefixes,
		MFADelete:        res.MFADelete,
		Status:           res.Status,
	}
	return bucketVResponse, nil
}

// getAccountBuckets fetches a list of all buckets allowed to that particular client from MinIO Servers
func getAccountBuckets(ctx context.Context, client MinioAdmin) ([]*models.Bucket, error) {
	info, err := client.AccountInfo(ctx)
	if err != nil {
		return []*models.Bucket{}, err
	}
	bucketInfos := []*models.Bucket{}
	for _, bucket := range info.Buckets {
		bucketElem := &models.Bucket{
			CreationDate: bucket.Created.Format(time.RFC3339),
			Details: &models.BucketDetails{
				Quota: nil,
			},
			RwAccess: &models.BucketRwAccess{
				Read:  bucket.Access.Read,
				Write: bucket.Access.Write,
			},
			Name:    swag.String(bucket.Name),
			Objects: int64(bucket.Objects),
			Size:    int64(bucket.Size),
		}

		if bucket.Details != nil {
			if bucket.Details.Tagging != nil {
				bucketElem.Details.Tags = bucket.Details.Tagging.ToMap()
			}

			bucketElem.Details.Locking = bucket.Details.Locking
			bucketElem.Details.Replication = bucket.Details.Replication
			bucketElem.Details.Versioning = bucket.Details.Versioning
			bucketElem.Details.VersioningSuspended = bucket.Details.VersioningSuspended
			if bucket.Details.Quota != nil {
				bucketElem.Details.Quota = &models.BucketDetailsQuota{
					Quota: int64(bucket.Details.Quota.Quota),
					Type:  string(bucket.Details.Quota.Type),
				}
			}
		}

		bucketInfos = append(bucketInfos, bucketElem)
	}
	return bucketInfos, nil
}

// getListBucketsResponse performs listBuckets() and serializes it to the handler's output
func getListBucketsResponse(session *models.Principal, params bucketApi.ListBucketsParams) (*models.ListBucketsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	buckets, err := getAccountBuckets(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// serialize output
	listBucketsResponse := &models.ListBucketsResponse{
		Buckets: buckets,
		Total:   int64(len(buckets)),
	}
	return listBucketsResponse, nil
}

// makeBucket creates a bucket for an specific minio client
func makeBucket(ctx context.Context, client MinioClient, bucketName string, objectLocking bool) error {
	// creates a new bucket with bucketName with a context to control cancellations and timeouts.
	return client.makeBucketWithContext(ctx, bucketName, "", objectLocking)
}

// getMakeBucketResponse performs makeBucket() to create a bucket with its access policy
func getMakeBucketResponse(session *models.Principal, params bucketApi.MakeBucketParams) (*models.MakeBucketsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	// bucket request needed to proceed
	br := params.Body
	if br == nil {
		return nil, ErrorWithContext(ctx, ErrBucketBodyNotInRequest)
	}
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// if we need retention, then object locking needs to be enabled
	if br.Retention != nil {
		br.Locking = true
	}

	if err := makeBucket(ctx, minioClient, *br.Name, br.Locking); err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// make sure to delete bucket if an errors occurs after bucket was created
	defer func() {
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error creating bucket: %v", err))
			if err := removeBucket(minioClient, *br.Name); err != nil {
				ErrorWithContext(ctx, fmt.Errorf("error removing bucket: %v", err))
			}
		}
	}()

	versioningEnabled := false

	if br.Versioning != nil && br.Versioning.Enabled {
		versioningEnabled = true
	}

	// enable versioning if indicated or retention enabled
	if versioningEnabled || br.Retention != nil {
		s3Client, err := newS3BucketClient(session, *br.Name, "", getClientIP(params.HTTPRequest))
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		// create a mc S3Client interface implementation
		// defining the client to be used
		amcClient := mcClient{client: s3Client}

		excludePrefixes := []string{}
		excludeFolders := false

		if br.Versioning.ExcludeFolders && !br.Locking {
			excludeFolders = true
		}

		if br.Versioning.ExcludePrefixes != nil && !br.Locking {
			excludePrefixes = br.Versioning.ExcludePrefixes
		}

		if err = doSetVersioning(ctx, amcClient, VersionEnable, excludePrefixes, excludeFolders); err != nil {
			return nil, ErrorWithContext(ctx, fmt.Errorf("error setting versioning for bucket: %s", err))
		}
	}

	// if it has support for
	if br.Quota != nil && br.Quota.Enabled != nil && *br.Quota.Enabled {
		mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		// create a minioClient interface implementation
		// defining the client to be used
		adminClient := AdminClient{Client: mAdmin}
		// we will tolerate this call failing
		if err := setBucketQuota(ctx, &adminClient, br.Name, br.Quota); err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error versioning bucket: %v", err))
		}
	}

	// Set Bucket Retention Configuration if defined
	if br.Retention != nil {
		err = setBucketRetentionConfig(ctx, minioClient, *br.Name, *br.Retention.Mode, *br.Retention.Unit, br.Retention.Validity)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
	}
	return &models.MakeBucketsResponse{BucketName: *br.Name}, nil
}

// setBucketAccessPolicy set the access permissions on an existing bucket.
func setBucketAccessPolicy(ctx context.Context, client MinioClient, bucketName string, access models.BucketAccess, policyDefinition string) error {
	if strings.TrimSpace(bucketName) == "" {
		return fmt.Errorf("error: bucket name not present")
	}
	if strings.TrimSpace(string(access)) == "" {
		return fmt.Errorf("error: bucket access not present")
	}
	// Prepare policyJSON corresponding to the access type
	if access != models.BucketAccessPRIVATE && access != models.BucketAccessPUBLIC && access != models.BucketAccessCUSTOM {
		return fmt.Errorf("access: `%s` not supported", access)
	}

	bucketAccessPolicy := policy.BucketAccessPolicy{Version: minioIAMPolicy.DefaultVersion}
	if access == models.BucketAccessCUSTOM {
		err := client.setBucketPolicyWithContext(ctx, bucketName, policyDefinition)
		if err != nil {
			return err
		}
		return nil
	}
	bucketPolicy := consoleAccess2policyAccess(access)
	bucketAccessPolicy.Statements = policy.SetPolicy(bucketAccessPolicy.Statements,
		bucketPolicy, bucketName, "")
	policyJSON, err := json.Marshal(bucketAccessPolicy)
	if err != nil {
		return err
	}
	return client.setBucketPolicyWithContext(ctx, bucketName, string(policyJSON))
}

// getBucketSetPolicyResponse calls setBucketAccessPolicy() to set a access policy to a bucket
// and returns the serialized output.
func getBucketSetPolicyResponse(session *models.Principal, params bucketApi.BucketSetPolicyParams) (*models.Bucket, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	// get updated bucket details and return it
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	bucketName := params.Name
	req := params.Body
	if err := setBucketAccessPolicy(ctx, minioClient, bucketName, *req.Access, req.Definition); err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// set bucket access policy
	bucket, err := getBucketInfo(ctx, minioClient, adminClient, bucketName)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return bucket, nil
}

// putBucketTags sets tags for a bucket
func getPutBucketTagsResponse(session *models.Principal, params bucketApi.PutBucketTagsParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	req := params.Body
	bucketName := params.BucketName

	newTagSet, err := tags.NewTags(req.Tags, true)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	err = minioClient.SetBucketTagging(ctx, bucketName, newTagSet)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// removeBucket deletes a bucket
func removeBucket(client MinioClient, bucketName string) error {
	return client.removeBucket(context.Background(), bucketName)
}

// getDeleteBucketResponse performs removeBucket() to delete a bucket
func getDeleteBucketResponse(session *models.Principal, params bucketApi.DeleteBucketParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	if params.Name == "" {
		return ErrorWithContext(ctx, ErrBucketNameNotInRequest)
	}
	bucketName := params.Name

	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := removeBucket(minioClient, bucketName); err != nil {
		resp := ErrorWithContext(ctx, err)
		errResp := minio.ToErrorResponse(err)
		if errResp.Code == "NoSuchBucket" {
			resp.Code = 404
		}
		return resp
	}
	return nil
}

// getBucketInfo return bucket information including name, policy access, size and creation date
func getBucketInfo(ctx context.Context, client MinioClient, adminClient MinioAdmin, bucketName string) (*models.Bucket, error) {
	var bucketAccess models.BucketAccess
	policyStr, err := client.getBucketPolicy(context.Background(), bucketName)
	if err != nil {
		// we can tolerate this errors
		ErrorWithContext(ctx, fmt.Errorf("error getting bucket policy: %v", err))
	}

	if policyStr == "" {
		bucketAccess = models.BucketAccessPRIVATE
	} else {
		var p policy.BucketAccessPolicy
		if err = json.Unmarshal([]byte(policyStr), &p); err != nil {
			return nil, err
		}
		policyAccess := policy.GetPolicy(p.Statements, bucketName, "")
		if len(p.Statements) > 0 && policyAccess == policy.BucketPolicyNone {
			bucketAccess = models.BucketAccessCUSTOM
		} else {
			bucketAccess = policyAccess2consoleAccess(policyAccess)
		}
	}
	bucketTags, err := client.GetBucketTagging(ctx, bucketName)
	if err != nil {
		// we can tolerate this errors
		ErrorWithContext(ctx, fmt.Errorf("error getting bucket tags: %v", err))
	}
	bucketDetails := &models.BucketDetails{}
	if bucketTags != nil {
		bucketDetails.Tags = bucketTags.ToMap()
	}

	info, err := adminClient.AccountInfo(ctx)
	if err != nil {
		return nil, err
	}

	var bucketInfo madmin.BucketAccessInfo

	for _, bucket := range info.Buckets {
		if bucket.Name == bucketName {
			bucketInfo = bucket
			break
		}
	}

	return &models.Bucket{
		Name:         &bucketName,
		Access:       &bucketAccess,
		Definition:   policyStr,
		CreationDate: bucketInfo.Created.Format(time.RFC3339),
		Size:         int64(bucketInfo.Size),
		Details:      bucketDetails,
		Objects:      int64(bucketInfo.Objects),
	}, nil
}

// getBucketInfoResponse calls getBucketInfo() to get the bucket's info
func getBucketInfoResponse(session *models.Principal, params bucketApi.BucketInfoParams) (*models.Bucket, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	bucket, err := getBucketInfo(ctx, minioClient, adminClient, params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return bucket, nil
}

// policyAccess2consoleAccess gets the equivalent of policy.BucketPolicy to models.BucketAccess
func policyAccess2consoleAccess(bucketPolicy policy.BucketPolicy) (bucketAccess models.BucketAccess) {
	switch bucketPolicy {
	case policy.BucketPolicyReadWrite:
		bucketAccess = models.BucketAccessPUBLIC
	case policy.BucketPolicyNone:
		bucketAccess = models.BucketAccessPRIVATE
	default:
		bucketAccess = models.BucketAccessCUSTOM
	}
	return bucketAccess
}

// consoleAccess2policyAccess gets the equivalent of models.BucketAccess to policy.BucketPolicy
func consoleAccess2policyAccess(bucketAccess models.BucketAccess) (bucketPolicy policy.BucketPolicy) {
	switch bucketAccess {
	case models.BucketAccessPUBLIC:
		bucketPolicy = policy.BucketPolicyReadWrite
	case models.BucketAccessPRIVATE:
		bucketPolicy = policy.BucketPolicyNone
	}
	return bucketPolicy
}

// enableBucketEncryption will enable bucket encryption based on two encryption algorithms, sse-s3 (server side encryption with external KMS) or sse-kms (aws s3 kms key)
func enableBucketEncryption(ctx context.Context, client MinioClient, bucketName string, encryptionType models.BucketEncryptionType, kmsKeyID string) error {
	var config *sse.Configuration
	switch encryptionType {
	case models.BucketEncryptionTypeSseDashKms:
		config = sse.NewConfigurationSSEKMS(kmsKeyID)
	case models.BucketEncryptionTypeSseDashS3:
		config = sse.NewConfigurationSSES3()
	default:
		return ErrInvalidEncryptionAlgorithm
	}
	return client.setBucketEncryption(ctx, bucketName, config)
}

// enableBucketEncryptionResponse calls enableBucketEncryption() to create new encryption configuration for provided bucket name
func enableBucketEncryptionResponse(session *models.Principal, params bucketApi.EnableBucketEncryptionParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := enableBucketEncryption(ctx, minioClient, params.BucketName, *params.Body.EncType, params.Body.KmsKeyID); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// disableBucketEncryption will disable bucket for the provided bucket name
func disableBucketEncryption(ctx context.Context, client MinioClient, bucketName string) error {
	return client.removeBucketEncryption(ctx, bucketName)
}

// disableBucketEncryptionResponse calls disableBucketEncryption()
func disableBucketEncryptionResponse(session *models.Principal, params bucketApi.DisableBucketEncryptionParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := disableBucketEncryption(ctx, minioClient, params.BucketName); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func getBucketEncryptionInfo(ctx context.Context, client MinioClient, bucketName string) (*models.BucketEncryptionInfo, error) {
	bucketInfo, err := client.getBucketEncryption(ctx, bucketName)
	if err != nil {
		return nil, err
	}
	if len(bucketInfo.Rules) == 0 {
		return nil, ErrDefault
	}
	return &models.BucketEncryptionInfo{Algorithm: bucketInfo.Rules[0].Apply.SSEAlgorithm, KmsMasterKeyID: bucketInfo.Rules[0].Apply.KmsMasterKeyID}, nil
}

func getBucketEncryptionInfoResponse(session *models.Principal, params bucketApi.GetBucketEncryptionInfoParams) (*models.BucketEncryptionInfo, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	bucketInfo, err := getBucketEncryptionInfo(ctx, minioClient, params.BucketName)
	if err != nil {
		return nil, ErrorWithContext(ctx, ErrSSENotConfigured, err)
	}
	return bucketInfo, nil
}

// setBucketRetentionConfig sets object lock configuration on a bucket
func setBucketRetentionConfig(ctx context.Context, client MinioClient, bucketName string, mode models.ObjectRetentionMode, unit models.ObjectRetentionUnit, validity *int32) error {
	if validity == nil {
		return errors.New("retention validity can't be nil")
	}

	var retentionMode minio.RetentionMode
	switch mode {
	case models.ObjectRetentionModeGovernance:
		retentionMode = minio.Governance
	case models.ObjectRetentionModeCompliance:
		retentionMode = minio.Compliance
	default:
		return errors.New("invalid retention mode")
	}

	var retentionUnit minio.ValidityUnit
	switch unit {
	case models.ObjectRetentionUnitDays:
		retentionUnit = minio.Days
	case models.ObjectRetentionUnitYears:
		retentionUnit = minio.Years
	default:
		return errors.New("invalid retention unit")
	}

	retentionValidity := uint(*validity)
	return client.setObjectLockConfig(ctx, bucketName, &retentionMode, &retentionValidity, &retentionUnit)
}

func getSetBucketRetentionConfigResponse(session *models.Principal, params bucketApi.SetBucketRetentionConfigParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = setBucketRetentionConfig(ctx, minioClient, params.BucketName, *params.Body.Mode, *params.Body.Unit, params.Body.Validity)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func getBucketRetentionConfig(ctx context.Context, client MinioClient, bucketName string) (*models.GetBucketRetentionConfig, error) {
	m, v, u, err := client.getBucketObjectLockConfig(ctx, bucketName)
	if err != nil {
		errResp := minio.ToErrorResponse(probe.NewError(err).ToGoError())
		if errResp.Code == "ObjectLockConfigurationNotFoundError" {
			return &models.GetBucketRetentionConfig{}, nil
		}
		return nil, err
	}

	// These values can be empty when all are empty, it means
	// object was created with object locking enabled but
	// does not have any default object locking configuration.
	if m == nil && v == nil && u == nil {
		return &models.GetBucketRetentionConfig{}, nil
	}

	var mode models.ObjectRetentionMode
	var unit models.ObjectRetentionUnit

	if m != nil {
		switch *m {
		case minio.Governance:
			mode = models.ObjectRetentionModeGovernance
		case minio.Compliance:
			mode = models.ObjectRetentionModeCompliance
		default:
			return nil, errors.New("invalid retention mode")
		}
	}

	if u != nil {
		switch *u {
		case minio.Days:
			unit = models.ObjectRetentionUnitDays
		case minio.Years:
			unit = models.ObjectRetentionUnitYears
		default:
			return nil, errors.New("invalid retention unit")
		}
	}

	var validity int32
	if v != nil {
		validity = int32(*v)
	}

	config := &models.GetBucketRetentionConfig{
		Mode:     mode,
		Unit:     unit,
		Validity: validity,
	}
	return config, nil
}

func getBucketRetentionConfigResponse(session *models.Principal, params bucketApi.GetBucketRetentionConfigParams) (*models.GetBucketRetentionConfig, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	bucketName := params.BucketName
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	config, err := getBucketRetentionConfig(ctx, minioClient, bucketName)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return config, nil
}

func getBucketObjectLockingResponse(session *models.Principal, params bucketApi.GetBucketObjectLockingStatusParams) (*models.BucketObLockingResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	bucketName := params.BucketName
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, fmt.Errorf("error creating MinIO Client: %v", err))
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// we will tolerate this call failing
	_, _, _, _, err = minioClient.getObjectLockConfig(ctx, bucketName)
	if err != nil {
		if minio.ToErrorResponse(err).Code == "ObjectLockConfigurationNotFoundError" {
			return &models.BucketObLockingResponse{
				ObjectLockingEnabled: false,
			}, nil
		}
		return nil, ErrorWithContext(ctx, err)
	}

	// serialize output
	return &models.BucketObLockingResponse{
		ObjectLockingEnabled: true,
	}, nil
}

func getBucketRewindResponse(session *models.Principal, params bucketApi.GetBucketRewindParams) (*models.RewindResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	prefix := ""
	if params.Prefix != nil {
		prefix = *params.Prefix
	}
	s3Client, err := newS3BucketClient(session, params.BucketName, prefix, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, fmt.Errorf("error creating S3Client: %v", err))
	}

	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}

	parsedDate, errDate := time.Parse(time.RFC3339, params.Date)

	if errDate != nil {
		return nil, ErrorWithContext(ctx, errDate)
	}

	var rewindItems []*models.RewindItem

	for content := range mcClient.client.List(ctx, cmd.ListOptions{TimeRef: parsedDate, WithDeleteMarkers: true}) {
		// build object name
		name := strings.ReplaceAll(content.URL.Path, fmt.Sprintf("/%s/", params.BucketName), "")

		listElement := &models.RewindItem{
			LastModified: content.Time.Format(time.RFC3339),
			Size:         content.Size,
			VersionID:    content.VersionID,
			DeleteFlag:   content.IsDeleteMarker,
			Action:       "",
			Name:         name,
		}

		rewindItems = append(rewindItems, listElement)
	}

	return &models.RewindResponse{
		Objects: rewindItems,
	}, nil
}

func getMaxShareLinkExpirationResponse(session *models.Principal, params bucketApi.GetMaxShareLinkExpParams) (*models.MaxShareLinkExpResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	maxShareLinkExpSeconds, err := getMaxShareLinkExpirationSeconds(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.MaxShareLinkExpResponse{Exp: swag.Int64(maxShareLinkExpSeconds)}, nil
}

// getMaxShareLinkExpirationSeconds returns the max share link expiration time in seconds which is the sts token expiration time
func getMaxShareLinkExpirationSeconds(session *models.Principal) (int64, error) {
	creds := getConsoleCredentialsFromSession(session)
	val, err := creds.GetWithContext(&credentials.CredContext{Client: http.DefaultClient})
	if err != nil {
		return 0, err
	}

	if val.SignerType.IsAnonymous() {
		return 0, ErrAccessDenied
	}
	maxShareLinkExp := token.GetConsoleSTSDuration()

	return int64(maxShareLinkExp.Seconds()), nil
}

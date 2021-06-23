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
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/sse"

	"errors"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/minio-go/v7/pkg/policy"
	minioIAMPolicy "github.com/minio/pkg/iam/policy"
)

func registerBucketsHandlers(api *operations.ConsoleAPI) {
	// list buckets
	api.UserAPIListBucketsHandler = user_api.ListBucketsHandlerFunc(func(params user_api.ListBucketsParams, session *models.Principal) middleware.Responder {
		listBucketsResponse, err := getListBucketsResponse(session)
		if err != nil {
			return user_api.NewListBucketsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewListBucketsOK().WithPayload(listBucketsResponse)
	})
	// make bucket
	api.UserAPIMakeBucketHandler = user_api.MakeBucketHandlerFunc(func(params user_api.MakeBucketParams, session *models.Principal) middleware.Responder {
		if err := getMakeBucketResponse(session, params.Body); err != nil {
			return user_api.NewMakeBucketDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewMakeBucketCreated()
	})
	// delete bucket
	api.UserAPIDeleteBucketHandler = user_api.DeleteBucketHandlerFunc(func(params user_api.DeleteBucketParams, session *models.Principal) middleware.Responder {
		if err := getDeleteBucketResponse(session, params); err != nil {
			return user_api.NewMakeBucketDefault(int(err.Code)).WithPayload(err)

		}
		return user_api.NewDeleteBucketNoContent()
	})
	// get bucket info
	api.UserAPIBucketInfoHandler = user_api.BucketInfoHandlerFunc(func(params user_api.BucketInfoParams, session *models.Principal) middleware.Responder {
		bucketInfoResp, err := getBucketInfoResponse(session, params)
		if err != nil {
			return user_api.NewBucketInfoDefault(int(err.Code)).WithPayload(err)
		}

		return user_api.NewBucketInfoOK().WithPayload(bucketInfoResp)
	})
	// set bucket policy
	api.UserAPIBucketSetPolicyHandler = user_api.BucketSetPolicyHandlerFunc(func(params user_api.BucketSetPolicyParams, session *models.Principal) middleware.Responder {
		bucketSetPolicyResp, err := getBucketSetPolicyResponse(session, params.Name, params.Body)
		if err != nil {
			return user_api.NewBucketSetPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewBucketSetPolicyOK().WithPayload(bucketSetPolicyResp)
	})
	// get bucket versioning
	api.UserAPIGetBucketVersioningHandler = user_api.GetBucketVersioningHandlerFunc(func(params user_api.GetBucketVersioningParams, session *models.Principal) middleware.Responder {
		getBucketVersioning, err := getBucketVersionedResponse(session, params.BucketName)
		if err != nil {
			return user_api.NewGetBucketVersioningDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewGetBucketVersioningOK().WithPayload(getBucketVersioning)
	})
	// update bucket versioning
	api.UserAPISetBucketVersioningHandler = user_api.SetBucketVersioningHandlerFunc(func(params user_api.SetBucketVersioningParams, session *models.Principal) middleware.Responder {
		err := setBucketVersioningResponse(session, params.BucketName, &params)
		if err != nil {
			return user_api.NewSetBucketVersioningDefault(500).WithPayload(err)
		}
		return user_api.NewSetBucketVersioningCreated()
	})
	// get bucket replication
	api.UserAPIGetBucketReplicationHandler = user_api.GetBucketReplicationHandlerFunc(func(params user_api.GetBucketReplicationParams, session *models.Principal) middleware.Responder {
		getBucketReplication, err := getBucketReplicationdResponse(session, params.BucketName)
		if err != nil {
			return user_api.NewGetBucketReplicationDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewGetBucketReplicationOK().WithPayload(getBucketReplication)
	})
	// enable bucket encryption
	api.UserAPIEnableBucketEncryptionHandler = user_api.EnableBucketEncryptionHandlerFunc(func(params user_api.EnableBucketEncryptionParams, session *models.Principal) middleware.Responder {
		if err := enableBucketEncryptionResponse(session, params); err != nil {
			return user_api.NewEnableBucketEncryptionDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewEnableBucketEncryptionOK()
	})
	// disable bucket encryption
	api.UserAPIDisableBucketEncryptionHandler = user_api.DisableBucketEncryptionHandlerFunc(func(params user_api.DisableBucketEncryptionParams, session *models.Principal) middleware.Responder {
		if err := disableBucketEncryptionResponse(session, params); err != nil {
			return user_api.NewDisableBucketEncryptionDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewDisableBucketEncryptionOK()
	})
	// get bucket encryption info
	api.UserAPIGetBucketEncryptionInfoHandler = user_api.GetBucketEncryptionInfoHandlerFunc(func(params user_api.GetBucketEncryptionInfoParams, session *models.Principal) middleware.Responder {
		response, err := getBucketEncryptionInfoResponse(session, params)
		if err != nil {
			return user_api.NewGetBucketEncryptionInfoDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewGetBucketEncryptionInfoOK().WithPayload(response)
	})
	// set bucket retention config
	api.UserAPISetBucketRetentionConfigHandler = user_api.SetBucketRetentionConfigHandlerFunc(func(params user_api.SetBucketRetentionConfigParams, session *models.Principal) middleware.Responder {
		if err := getSetBucketRetentionConfigResponse(session, params); err != nil {
			return user_api.NewSetBucketRetentionConfigDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewSetBucketRetentionConfigOK()
	})
	// get bucket retention config
	api.UserAPIGetBucketRetentionConfigHandler = user_api.GetBucketRetentionConfigHandlerFunc(func(params user_api.GetBucketRetentionConfigParams, session *models.Principal) middleware.Responder {
		response, err := getBucketRetentionConfigResponse(session, params.BucketName)
		if err != nil {
			return user_api.NewGetBucketRetentionConfigDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewGetBucketRetentionConfigOK().WithPayload(response)
	})
	// get bucket object locking status
	api.UserAPIGetBucketObjectLockingStatusHandler = user_api.GetBucketObjectLockingStatusHandlerFunc(func(params user_api.GetBucketObjectLockingStatusParams, session *models.Principal) middleware.Responder {
		getBucketObjectLockingStatus, err := getBucketObLockingResponse(session, params.BucketName)
		if err != nil {
			return user_api.NewGetBucketObjectLockingStatusDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewGetBucketObjectLockingStatusOK().WithPayload(getBucketObjectLockingStatus)
	})
	// get objects rewind for a bucket
	api.UserAPIGetBucketRewindHandler = user_api.GetBucketRewindHandlerFunc(func(params user_api.GetBucketRewindParams, session *models.Principal) middleware.Responder {
		getBucketRewind, err := getBucketRewindResponse(session, params)
		if err != nil {
			return user_api.NewGetBucketRewindDefault(500).WithPayload(err)
		}
		return user_api.NewGetBucketRewindOK().WithPayload(getBucketRewind)
	})
}

type VersionState string

const (
	VersionEnable  VersionState = "enable"
	VersionSuspend              = "suspend"
)

// removeBucket deletes a bucket
func doSetVersioning(client MCClient, state VersionState) error {
	err := client.setVersioning(context.Background(), string(state))
	if err != nil {
		LogError("error setting versioning for bucket: %s", err.Cause)
		return err.Cause
	}

	return nil
}

func setBucketVersioningResponse(session *models.Principal, bucketName string, params *user_api.SetBucketVersioningParams) *models.Error {
	s3Client, err := newS3BucketClient(session, bucketName, "")
	if err != nil {
		return prepareError(err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	amcClient := mcClient{client: s3Client}

	var versioningState VersionState = VersionSuspend

	if params.Body.Versioning {
		versioningState = VersionEnable
	}

	if err := doSetVersioning(amcClient, versioningState); err != nil {
		return prepareError(err)
	}
	return nil
}

func getBucketReplicationdResponse(session *models.Principal, bucketName string) (*models.BucketReplicationResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mClient, err := newMinioClient(session)
	if err != nil {
		LogError("error creating MinIO Client: %v", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// we will tolerate this call failing
	res, err := minioClient.getBucketReplication(ctx, bucketName)
	if err != nil {
		LogError("error versioning bucket: %v", err)
	}

	var rules []*models.BucketReplicationRule

	for _, rule := range res.Rules {
		repDelMarkerStatus := false
		if rule.DeleteMarkerReplication.Status == "enable" {
			repDelMarkerStatus = true
		}
		repDelStatus := false
		if rule.DeleteReplication.Status == "enable" {
			repDelMarkerStatus = true
		}

		rules = append(rules, &models.BucketReplicationRule{
			DeleteMarkerReplication: repDelMarkerStatus,
			DeletesReplication:      repDelStatus,
			Destination:             &models.BucketReplicationDestination{Bucket: rule.Destination.Bucket},
			Tags:                    rule.Tags(),
			Prefix:                  rule.Prefix(),
			ID:                      rule.ID,
			Priority:                int32(rule.Priority),
			Status:                  string(rule.Status),
		})
	}

	// serialize output
	listBucketsResponse := &models.BucketReplicationResponse{
		Rules: rules,
	}
	return listBucketsResponse, nil
}

func getBucketVersionedResponse(session *models.Principal, bucketName string) (*models.BucketVersioningResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mClient, err := newMinioClient(session)
	if err != nil {
		LogError("error creating MinIO Client: %v", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// we will tolerate this call failing
	res, err := minioClient.getBucketVersioning(ctx, bucketName)
	if err != nil {
		LogError("error versioning bucket: %v", err)
	}

	// serialize output
	listBucketsResponse := &models.BucketVersioningResponse{
		IsVersioned: res.Status == "Enabled",
	}
	return listBucketsResponse, nil
}

// getAccountInfo fetches a list of all buckets allowed to that particular client from MinIO Servers
func getAccountInfo(ctx context.Context, client MinioAdmin) ([]*models.Bucket, error) {
	info, err := client.accountInfo(ctx)
	if err != nil {
		return []*models.Bucket{}, err
	}

	var bucketInfos []*models.Bucket
	for _, bucket := range info.Buckets {
		bucketElem := &models.Bucket{Name: swag.String(bucket.Name), CreationDate: bucket.Created.Format(time.RFC3339), Size: int64(bucket.Size)}
		bucketInfos = append(bucketInfos, bucketElem)
	}
	return bucketInfos, nil
}

// getListBucketsResponse performs listBuckets() and serializes it to the handler's output
func getListBucketsResponse(session *models.Principal) (*models.ListBucketsResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mAdmin, err := newAdminClient(session)
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

// makeBucket creates a bucket for an specific minio client
func makeBucket(ctx context.Context, client MinioClient, bucketName string, objectLocking bool) error {
	// creates a new bucket with bucketName with a context to control cancellations and timeouts.
	return client.makeBucketWithContext(ctx, bucketName, "", objectLocking)
}

// getMakeBucketResponse performs makeBucket() to create a bucket with its access policy
func getMakeBucketResponse(session *models.Principal, br *models.MakeBucketRequest) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	// bucket request needed to proceed
	if br == nil {
		return prepareError(errBucketBodyNotInRequest)
	}
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// if we need retention, then object locking needs to be enabled
	if br.Retention != nil {
		br.Locking = true
	}

	if err := makeBucket(ctx, minioClient, *br.Name, br.Locking); err != nil {
		return prepareError(err)
	}

	// make sure to delete bucket if an error occurs after bucket was created
	defer func() {
		if err != nil {
			LogError("error creating bucket: %v", err)
			if err := removeBucket(minioClient, *br.Name); err != nil {
				LogError("error removing bucket: %v", err)
			}
		}
	}()

	// enable versioning if indicated or retention enabled
	if br.Versioning || br.Retention != nil {
		s3Client, err := newS3BucketClient(session, *br.Name, "")
		if err != nil {
			return prepareError(err)
		}
		// create a mc S3Client interface implementation
		// defining the client to be used
		amcClient := mcClient{client: s3Client}

		if err = doSetVersioning(amcClient, VersionEnable); err != nil {
			return prepareError(err)
		}
	}

	// if it has support for
	if br.Quota != nil && br.Quota.Enabled != nil && *br.Quota.Enabled {
		mAdmin, err := newAdminClient(session)
		if err != nil {
			return prepareError(err)
		}
		// create a minioClient interface implementation
		// defining the client to be used
		adminClient := adminClient{client: mAdmin}
		// we will tolerate this call failing
		if err := setBucketQuota(ctx, &adminClient, br.Name, br.Quota); err != nil {
			LogError("error versioning bucket:", err)
		}
	}

	// Set Bucket Retention Configuration if defined
	if br.Retention != nil {
		err = setBucketRetentionConfig(ctx, minioClient, *br.Name, *br.Retention.Mode, *br.Retention.Unit, br.Retention.Validity)
		if err != nil {
			return prepareError(err)
		}
	}
	return nil
}

// setBucketAccessPolicy set the access permissions on an existing bucket.
func setBucketAccessPolicy(ctx context.Context, client MinioClient, bucketName string, access models.BucketAccess) error {
	if strings.TrimSpace(bucketName) == "" {
		return fmt.Errorf("error: bucket name not present")
	}
	if strings.TrimSpace(string(access)) == "" {
		return fmt.Errorf("error: bucket access not present")
	}
	// Prepare policyJSON corresponding to the access type
	if access != models.BucketAccessPRIVATE && access != models.BucketAccessPUBLIC {
		return fmt.Errorf("access: `%s` not supported", access)
	}
	bucketPolicy := consoleAccess2policyAccess(access)

	bucketAccessPolicy := policy.BucketAccessPolicy{Version: minioIAMPolicy.DefaultVersion}
	bucketAccessPolicy.Statements = policy.SetPolicy(bucketAccessPolicy.Statements,
		policy.BucketPolicy(bucketPolicy), bucketName, "")
	// implemented like minio/mc/ s3Client.SetAccess()
	if len(bucketAccessPolicy.Statements) == 0 {
		return client.setBucketPolicyWithContext(ctx, bucketName, "")
	}
	policyJSON, err := json.Marshal(bucketAccessPolicy)
	if err != nil {
		return err
	}
	return client.setBucketPolicyWithContext(ctx, bucketName, string(policyJSON))
}

// getBucketSetPolicyResponse calls setBucketAccessPolicy() to set a access policy to a bucket
//   and returns the serialized output.
func getBucketSetPolicyResponse(session *models.Principal, bucketName string, req *models.SetBucketPolicyRequest) (*models.Bucket, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// set bucket access policy
	if err := setBucketAccessPolicy(ctx, minioClient, bucketName, *req.Access); err != nil {
		return nil, prepareError(err)
	}
	// get updated bucket details and return it
	bucket, err := getBucketInfo(minioClient, bucketName)
	if err != nil {
		return nil, prepareError(err)
	}
	return bucket, nil
}

// removeBucket deletes a bucket
func removeBucket(client MinioClient, bucketName string) error {
	return client.removeBucket(context.Background(), bucketName)
}

// getDeleteBucketResponse performs removeBucket() to delete a bucket
func getDeleteBucketResponse(session *models.Principal, params user_api.DeleteBucketParams) *models.Error {
	if params.Name == "" {
		return prepareError(errBucketNameNotInRequest)
	}
	bucketName := params.Name

	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := removeBucket(minioClient, bucketName); err != nil {
		return prepareError(err)
	}
	return nil
}

// getBucketInfo return bucket information including name, policy access, size and creation date
func getBucketInfo(client MinioClient, bucketName string) (*models.Bucket, error) {
	policyStr, err := client.getBucketPolicy(context.Background(), bucketName)
	if err != nil {
		return nil, err
	}
	var policyAccess policy.BucketPolicy
	if policyStr == "" {
		policyAccess = policy.BucketPolicyNone
	} else {
		var p policy.BucketAccessPolicy
		if err = json.Unmarshal([]byte(policyStr), &p); err != nil {
			return nil, err
		}
		policyAccess = policy.GetPolicy(p.Statements, bucketName, "")
	}
	bucketAccess := policyAccess2consoleAccess(policyAccess)
	if bucketAccess == models.BucketAccessPRIVATE && policyStr != "" {
		bucketAccess = models.BucketAccessCUSTOM
	}
	bucket := &models.Bucket{
		Name:         &bucketName,
		Access:       &bucketAccess,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	return bucket, nil
}

// getBucketInfoResponse calls getBucketInfo() to get the bucket's info
func getBucketInfoResponse(session *models.Principal, params user_api.BucketInfoParams) (*models.Bucket, *models.Error) {
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	bucket, err := getBucketInfo(minioClient, params.Name)
	if err != nil {
		return nil, prepareError(err)
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
		return errInvalidEncryptionAlgorithm
	}
	return client.setBucketEncryption(ctx, bucketName, config)
}

// enableBucketEncryptionResponse calls enableBucketEncryption() to create new encryption configuration for provided bucket name
func enableBucketEncryptionResponse(session *models.Principal, params user_api.EnableBucketEncryptionParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := enableBucketEncryption(ctx, minioClient, params.BucketName, *params.Body.EncType, params.Body.KmsKeyID); err != nil {
		return prepareError(err)
	}
	return nil
}

// disableBucketEncryption will disable bucket for the provided bucket name
func disableBucketEncryption(ctx context.Context, client MinioClient, bucketName string) error {
	return client.removeBucketEncryption(ctx, bucketName)
}

// disableBucketEncryptionResponse calls disableBucketEncryption()
func disableBucketEncryptionResponse(session *models.Principal, params user_api.DisableBucketEncryptionParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := disableBucketEncryption(ctx, minioClient, params.BucketName); err != nil {
		return prepareError(err)
	}
	return nil
}

func getBucketEncryptionInfo(ctx context.Context, client MinioClient, bucketName string) (*models.BucketEncryptionInfo, error) {
	bucketInfo, err := client.getBucketEncryption(ctx, bucketName)
	if err != nil {
		return nil, err
	}
	if len(bucketInfo.Rules) == 0 {
		return nil, errorGeneric
	}
	return &models.BucketEncryptionInfo{Algorithm: bucketInfo.Rules[0].Apply.SSEAlgorithm, KmsMasterKeyID: bucketInfo.Rules[0].Apply.KmsMasterKeyID}, nil
}

func getBucketEncryptionInfoResponse(session *models.Principal, params user_api.GetBucketEncryptionInfoParams) (*models.BucketEncryptionInfo, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	bucketInfo, err := getBucketEncryptionInfo(ctx, minioClient, params.BucketName)
	if err != nil {
		return nil, prepareError(errSSENotConfigured, err)
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

func getSetBucketRetentionConfigResponse(session *models.Principal, params user_api.SetBucketRetentionConfigParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = setBucketRetentionConfig(ctx, minioClient, params.BucketName, *params.Body.Mode, *params.Body.Unit, params.Body.Validity)
	if err != nil {
		return prepareError(err)
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
	var mode models.ObjectRetentionMode
	var unit models.ObjectRetentionUnit
	switch *m {
	case minio.Governance:
		mode = models.ObjectRetentionModeGovernance
	case minio.Compliance:
		mode = models.ObjectRetentionModeCompliance
	default:
		return nil, errors.New("invalid retention mode")
	}

	switch *u {
	case minio.Days:
		unit = models.ObjectRetentionUnitDays
	case minio.Years:
		unit = models.ObjectRetentionUnitYears
	default:
		return nil, errors.New("invalid retention unit")
	}

	config := &models.GetBucketRetentionConfig{
		Mode:     mode,
		Unit:     unit,
		Validity: int32(*v),
	}
	return config, nil
}

func getBucketRetentionConfigResponse(session *models.Principal, bucketName string) (*models.GetBucketRetentionConfig, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	config, err := getBucketRetentionConfig(ctx, minioClient, bucketName)
	if err != nil {
		return nil, prepareError(err)
	}
	return config, nil
}

func getBucketObLockingResponse(session *models.Principal, bucketName string) (*models.BucketObLockingResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mClient, err := newMinioClient(session)
	if err != nil {
		LogError("error creating MinIO Client: %v", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// we will tolerate this call failing
	_, _, _, _, err = minioClient.getObjectLockConfig(ctx, bucketName)
	if err != nil {
		if err.Error() == "Object Lock configuration does not exist for this bucket" {
			return &models.BucketObLockingResponse{
				ObjectLockingEnabled: false,
			}, nil
		}
		LogError("error object locking bucket: %v", err)
	}

	// serialize output
	listBucketsResponse := &models.BucketObLockingResponse{
		ObjectLockingEnabled: true,
	}
	return listBucketsResponse, nil
}

func getBucketRewindResponse(session *models.Principal, params user_api.GetBucketRewindParams) (*models.RewindResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	var prefix = ""

	if params.Prefix != nil {
		prefix = *params.Prefix
	}

	s3Client, err := newS3BucketClient(session, params.BucketName, prefix)
	if err != nil {
		LogError("error creating S3Client: %v", err)
		return nil, prepareError(err)
	}

	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}

	parsedDate, errDate := time.Parse(time.RFC3339, params.Date)

	if errDate != nil {
		return nil, prepareError(errDate)
	}

	var rewindItems []*models.RewindItem

	for content := range mcClient.client.List(ctx, cmd.ListOptions{TimeRef: parsedDate, WithDeleteMarkers: true}) {
		// build object name
		name := strings.Replace(content.URL.Path, fmt.Sprintf("/%s/", params.BucketName), "", -1)

		listElement := &models.RewindItem{
			LastModified: content.Time.Format(time.RFC3339),
			Size:         content.Size,
			VersionID:    content.VersionID,
			DeleteFlag:   content.IsDeleteMarker,
			Action:       "",
			Name:         name,
		}

		cont, _ := json.Marshal(content)
		fmt.Println(string(cont))

		rewindItems = append(rewindItems, listElement)
	}

	return &models.RewindResponse{
		Objects: rewindItems,
	}, nil
}

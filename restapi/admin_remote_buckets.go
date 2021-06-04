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
	"fmt"
	"net/url"
	"strconv"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/madmin-go"
	"github.com/minio/minio-go/v7/pkg/replication"
)

type RemoteBucketResult struct {
	OriginBucket string
	TargetBucket string
	Error        string
}

func registerAdminBucketRemoteHandlers(api *operations.ConsoleAPI) {
	// return list of remote buckets
	api.UserAPIListRemoteBucketsHandler = user_api.ListRemoteBucketsHandlerFunc(func(params user_api.ListRemoteBucketsParams, session *models.Principal) middleware.Responder {
		listResp, err := getListRemoteBucketsResponse(session)
		if err != nil {
			return user_api.NewListRemoteBucketsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewListRemoteBucketsOK().WithPayload(listResp)
	})

	// return information about a specific bucket
	api.UserAPIRemoteBucketDetailsHandler = user_api.RemoteBucketDetailsHandlerFunc(func(params user_api.RemoteBucketDetailsParams, session *models.Principal) middleware.Responder {
		response, err := getRemoteBucketDetailsResponse(session, params)
		if err != nil {
			return user_api.NewRemoteBucketDetailsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewRemoteBucketDetailsOK().WithPayload(response)
	})

	// delete remote bucket
	api.UserAPIDeleteRemoteBucketHandler = user_api.DeleteRemoteBucketHandlerFunc(func(params user_api.DeleteRemoteBucketParams, session *models.Principal) middleware.Responder {
		err := getDeleteRemoteBucketResponse(session, params)
		if err != nil {
			return user_api.NewDeleteRemoteBucketDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewDeleteRemoteBucketNoContent()
	})

	// set remote bucket
	api.UserAPIAddRemoteBucketHandler = user_api.AddRemoteBucketHandlerFunc(func(params user_api.AddRemoteBucketParams, session *models.Principal) middleware.Responder {
		err := getAddRemoteBucketResponse(session, params)
		if err != nil {
			return user_api.NewAddRemoteBucketDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewAddRemoteBucketCreated()
	})

	// set multi-bucket replication
	api.UserAPISetMultiBucketReplicationHandler = user_api.SetMultiBucketReplicationHandlerFunc(func(params user_api.SetMultiBucketReplicationParams, session *models.Principal) middleware.Responder {
		response, err := setMultiBucketReplicationResponse(session, params)

		if err != nil {
			return user_api.NewSetMultiBucketReplicationDefault(500).WithPayload(err)
		}

		return user_api.NewSetMultiBucketReplicationOK().WithPayload(response)
	})

	// list external buckets
	api.UserAPIListExternalBucketsHandler = user_api.ListExternalBucketsHandlerFunc(func(params user_api.ListExternalBucketsParams, session *models.Principal) middleware.Responder {
		response, err := listExternalBucketsResponse(params)

		if err != nil {
			return user_api.NewListExternalBucketsDefault(500).WithPayload(err)
		}

		return user_api.NewListExternalBucketsOK().WithPayload(response)
	})

	// delete replication rule
	api.UserAPIDeleteBucketReplicationRuleHandler = user_api.DeleteBucketReplicationRuleHandlerFunc(func(params user_api.DeleteBucketReplicationRuleParams, session *models.Principal) middleware.Responder {
		err := deleteReplicationRuleResponse(session, params)

		if err != nil {
			return user_api.NewDeleteBucketReplicationRuleDefault(500).WithPayload(err)
		}

		return user_api.NewDeleteBucketReplicationRuleNoContent()
	})
}

func getListRemoteBucketsResponse(session *models.Principal) (*models.ListRemoteBucketsResponse, error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return nil, err
	}
	adminClient := adminClient{client: mAdmin}
	buckets, err := listRemoteBuckets(ctx, adminClient)
	if err != nil {
		LogError("error listing remote buckets: %v", err)
		return nil, err
	}
	return &models.ListRemoteBucketsResponse{
		Buckets: buckets,
		Total:   int64(len(buckets)),
	}, nil
}

func getRemoteBucketDetailsResponse(session *models.Principal, params user_api.RemoteBucketDetailsParams) (*models.RemoteBucket, error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return nil, err
	}
	adminClient := adminClient{client: mAdmin}
	bucket, err := getRemoteBucket(ctx, adminClient, params.Name)
	if err != nil {
		LogError("error getting remote bucket details: %v", err)
		return nil, err
	}
	return bucket, nil
}

func getDeleteRemoteBucketResponse(session *models.Principal, params user_api.DeleteRemoteBucketParams) error {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return err
	}
	adminClient := adminClient{client: mAdmin}
	err = deleteRemoteBucket(ctx, adminClient, params.SourceBucketName, params.Arn)
	if err != nil {
		LogError("error deleting remote bucket: %v", err)
		return err
	}
	return err
}

func getAddRemoteBucketResponse(session *models.Principal, params user_api.AddRemoteBucketParams) error {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return err
	}
	adminClient := adminClient{client: mAdmin}
	_, err = addRemoteBucket(ctx, adminClient, *params.Body)
	if err != nil {
		LogError("error adding remote bucket: %v", err)
		return err
	}
	return err
}

func listRemoteBuckets(ctx context.Context, client MinioAdmin) ([]*models.RemoteBucket, error) {
	var remoteBuckets []*models.RemoteBucket
	buckets, err := client.listRemoteBuckets(ctx, "", "")
	if err != nil {
		return nil, err
	}
	for _, bucket := range buckets {
		remoteBucket := &models.RemoteBucket{
			AccessKey:         swag.String(bucket.Credentials.AccessKey),
			RemoteARN:         swag.String(bucket.Arn),
			SecretKey:         bucket.Credentials.SecretKey,
			Service:           "replication",
			SourceBucket:      swag.String(bucket.SourceBucket),
			Status:            "",
			TargetBucket:      bucket.TargetBucket,
			TargetURL:         bucket.Endpoint,
			SyncMode:          "async",
			Bandwidth:         bucket.BandwidthLimit,
			HealthCheckPeriod: int64(bucket.HealthCheckDuration.Seconds()),
		}
		if bucket.ReplicationSync {
			remoteBucket.SyncMode = "sync"
		}
		remoteBuckets = append(remoteBuckets, remoteBucket)
	}
	return remoteBuckets, nil
}

func getRemoteBucket(ctx context.Context, client MinioAdmin, name string) (*models.RemoteBucket, error) {
	remoteBucket, err := client.getRemoteBucket(ctx, name, "")
	if err != nil {
		return nil, err
	}
	if remoteBucket == nil {
		return nil, errors.New("bucket not found")
	}
	return &models.RemoteBucket{
		AccessKey:    &remoteBucket.Credentials.AccessKey,
		RemoteARN:    &remoteBucket.Arn,
		SecretKey:    remoteBucket.Credentials.SecretKey,
		Service:      "replication",
		SourceBucket: &remoteBucket.SourceBucket,
		Status:       "",
		TargetBucket: remoteBucket.TargetBucket,
		TargetURL:    remoteBucket.Endpoint,
	}, nil
}

func deleteRemoteBucket(ctx context.Context, client MinioAdmin, sourceBucketName, arn string) error {
	return client.removeRemoteBucket(ctx, sourceBucketName, arn)
}

func addRemoteBucket(ctx context.Context, client MinioAdmin, params models.CreateRemoteBucket) (string, error) {
	TargetURL := *params.TargetURL
	accessKey := *params.AccessKey
	secretKey := *params.SecretKey
	u, err := url.Parse(TargetURL)
	if err != nil {
		return "", errors.New("malformed Remote target URL")
	}
	secure := u.Scheme == "https"
	host := u.Host
	if u.Port() == "" {
		port := 80
		if secure {
			port = 443
		}
		host = host + ":" + strconv.Itoa(port)
	}
	creds := &madmin.Credentials{AccessKey: accessKey, SecretKey: secretKey}
	remoteBucket := &madmin.BucketTarget{
		TargetBucket:    *params.TargetBucket,
		Secure:          secure,
		Credentials:     creds,
		Endpoint:        host,
		Path:            "",
		API:             "s3v4",
		Type:            "replication",
		Region:          params.Region,
		ReplicationSync: *params.SyncMode == "sync",
	}
	if *params.SyncMode == "async" {
		remoteBucket.BandwidthLimit = params.Bandwidth
	}
	if params.HealthCheckPeriod > 0 {
		remoteBucket.HealthCheckDuration = time.Duration(params.HealthCheckPeriod) * time.Second
	}
	bucketARN, err := client.addRemoteBucket(ctx, *params.SourceBucket, remoteBucket)

	return bucketARN, err
}

func addBucketReplicationItem(ctx context.Context, session *models.Principal, minClient minioClient, bucketName, prefix, arn, destinationBucket string, repDelMark, repDels, repMeta bool, tags string) error {
	// we will tolerate this call failing
	cfg, err := minClient.getBucketReplication(ctx, bucketName)
	if err != nil {
		LogError("error fetching replication configuration for bucket %s: %v", bucketName, err)
	}

	// add rule
	maxPrio := 0
	for _, r := range cfg.Rules {
		if r.Priority > maxPrio {
			maxPrio = r.Priority
		}
	}
	maxPrio++

	s3Client, err := newS3BucketClient(session, bucketName, prefix)
	if err != nil {
		LogError("error creating S3Client: %v", err)
		return err
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}

	repDelMarkStatus := "disable"
	if repDelMark {
		repDelMarkStatus = "enable"
	}

	repDelsStatus := "disable"
	if repDels {
		repDelsStatus = "enable"
	}

	repMetaStatus := "disable"
	if repMeta {
		repMetaStatus = "enable"
	}

	opts := replication.Options{
		RoleArn:                arn,
		Priority:               fmt.Sprintf("%d", maxPrio),
		RuleStatus:             "enable",
		DestBucket:             destinationBucket,
		Op:                     replication.AddOption,
		TagString:              tags,
		ReplicateDeleteMarkers: repDelMarkStatus,
		ReplicateDeletes:       repDelsStatus,
		ReplicaSync:            repMetaStatus,
	}

	err2 := mcClient.setReplication(ctx, &cfg, opts)
	if err2 != nil {
		LogError("error creating replication for bucket:", err2.Cause)
		return err2.Cause
	}
	return nil
}

func setMultiBucketReplication(ctx context.Context, session *models.Principal, client MinioAdmin, minClient minioClient, params user_api.SetMultiBucketReplicationParams) []RemoteBucketResult {
	bucketsRelation := params.Body.BucketsRelation

	// Parallel remote bucket adding
	parallelRemoteBucket := func(bucketRelationData *models.MultiBucketsRelation) chan RemoteBucketResult {
		remoteProc := make(chan RemoteBucketResult)
		sourceBucket := bucketRelationData.OriginBucket
		targetBucket := bucketRelationData.DestinationBucket

		go func() {
			defer close(remoteProc)

			createRemoteBucketParams := models.CreateRemoteBucket{
				AccessKey:    params.Body.AccessKey,
				SecretKey:    params.Body.SecretKey,
				SourceBucket: &sourceBucket,
				TargetBucket: &targetBucket,
				Region:       params.Body.Region,
				TargetURL:    params.Body.TargetURL,
				SyncMode:     params.Body.SyncMode,
				Bandwidth:    params.Body.Bandwidth,
			}

			// We add the remote bucket reference & store the arn or errors returned
			arn, err := addRemoteBucket(ctx, client, createRemoteBucketParams)

			if err == nil {
				err = addBucketReplicationItem(
					ctx,
					session,
					minClient,
					sourceBucket,
					params.Body.Prefix,
					arn,
					targetBucket,
					params.Body.ReplicateDeleteMarkers,
					params.Body.ReplicateDeletes,
					params.Body.ReplicateMetadata,
					params.Body.Tags)
			}

			var errorReturn = ""

			if err != nil {
				errorReturn = err.Error()
			}

			retParams := RemoteBucketResult{
				OriginBucket: sourceBucket,
				TargetBucket: targetBucket,
				Error:        errorReturn,
			}

			remoteProc <- retParams
		}()
		return remoteProc
	}

	var bucketsManagement []chan RemoteBucketResult

	for _, bucketName := range bucketsRelation {
		// We generate the ARNs for each bucket
		rBucket := parallelRemoteBucket(bucketName)
		bucketsManagement = append(bucketsManagement, rBucket)
	}

	resultsList := []RemoteBucketResult{}
	for _, result := range bucketsManagement {
		res := <-result
		resultsList = append(resultsList, res)
	}

	return resultsList
}

func setMultiBucketReplicationResponse(session *models.Principal, params user_api.SetMultiBucketReplicationParams) (*models.MultiBucketResponseState, *models.Error) {
	ctx := context.Background()

	mAdmin, err := newAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client:", err)
		return nil, prepareError(err)
	}
	adminClient := adminClient{client: mAdmin}

	mClient, err := newMinioClient(session)
	if err != nil {
		LogError("error creating MinIO Client:", err)
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	mnClient := minioClient{client: mClient}

	replicationResults := setMultiBucketReplication(ctx, session, adminClient, mnClient, params)

	if replicationResults == nil {
		err = errors.New("error setting buckets replication")
		return nil, prepareError(err)
	}

	resParsed := []*models.MultiBucketResponseItem{}

	for _, repResult := range replicationResults {
		responseItem := models.MultiBucketResponseItem{
			ErrorString:  repResult.Error,
			OriginBucket: repResult.OriginBucket,
			TargetBucket: repResult.TargetBucket,
		}

		resParsed = append(resParsed, &responseItem)
	}

	resultsParsed := models.MultiBucketResponseState{
		ReplicationState: resParsed,
	}

	return &resultsParsed, nil
}

func listExternalBucketsResponse(params user_api.ListExternalBucketsParams) (*models.ListBucketsResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	remoteAdmin, err := newAdminFromCreds(*params.Body.AccessKey, *params.Body.SecretKey, *params.Body.TargetURL, *params.Body.UseTLS)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	remoteClient := adminClient{client: remoteAdmin}
	buckets, err := getAccountInfo(ctx, remoteClient)
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

func deleteReplicationRule(ctx context.Context, session *models.Principal, bucketName, ruleID string) error {
	mClient, err := newMinioClient(session)
	if err != nil {
		LogError("error creating MinIO Client: %v", err)
		return err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minClient := minioClient{client: mClient}

	cfg, err := minClient.getBucketReplication(ctx, bucketName)
	if err != nil {
		LogError("error versioning bucket: %v", err)
	}

	s3Client, err := newS3BucketClient(session, bucketName, "")
	if err != nil {
		LogError("error creating S3Client: %v", err)
		return err
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}

	opts := replication.Options{
		ID: ruleID,
		Op: replication.RemoveOption,
	}

	err2 := mcClient.setReplication(ctx, &cfg, opts)
	if err2 != nil {
		return err2.Cause
	}
	return nil
}

func deleteReplicationRuleResponse(session *models.Principal, params user_api.DeleteBucketReplicationRuleParams) *models.Error {
	ctx := context.Background()

	err := deleteReplicationRule(ctx, session, params.BucketName, params.RuleID)

	if err != nil {
		return prepareError(err)
	}
	return nil
}

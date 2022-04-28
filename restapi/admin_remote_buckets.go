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

	"github.com/minio/madmin-go"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	bucketApi "github.com/minio/console/restapi/operations/bucket"
	"github.com/minio/minio-go/v7/pkg/replication"
)

type RemoteBucketResult struct {
	OriginBucket string
	TargetBucket string
	Error        string
}

func registerAdminBucketRemoteHandlers(api *operations.ConsoleAPI) {
	// return list of remote buckets
	api.BucketListRemoteBucketsHandler = bucketApi.ListRemoteBucketsHandlerFunc(func(params bucketApi.ListRemoteBucketsParams, session *models.Principal) middleware.Responder {
		listResp, err := getListRemoteBucketsResponse(session)
		if err != nil {
			return bucketApi.NewListRemoteBucketsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return bucketApi.NewListRemoteBucketsOK().WithPayload(listResp)
	})

	// return information about a specific bucket
	api.BucketRemoteBucketDetailsHandler = bucketApi.RemoteBucketDetailsHandlerFunc(func(params bucketApi.RemoteBucketDetailsParams, session *models.Principal) middleware.Responder {
		response, err := getRemoteBucketDetailsResponse(session, params)
		if err != nil {
			return bucketApi.NewRemoteBucketDetailsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return bucketApi.NewRemoteBucketDetailsOK().WithPayload(response)
	})

	// delete remote bucket
	api.BucketDeleteRemoteBucketHandler = bucketApi.DeleteRemoteBucketHandlerFunc(func(params bucketApi.DeleteRemoteBucketParams, session *models.Principal) middleware.Responder {
		err := getDeleteRemoteBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewDeleteRemoteBucketDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return bucketApi.NewDeleteRemoteBucketNoContent()
	})

	// set remote bucket
	api.BucketAddRemoteBucketHandler = bucketApi.AddRemoteBucketHandlerFunc(func(params bucketApi.AddRemoteBucketParams, session *models.Principal) middleware.Responder {
		err := getAddRemoteBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewAddRemoteBucketDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return bucketApi.NewAddRemoteBucketCreated()
	})

	// set multi-bucket replication
	api.BucketSetMultiBucketReplicationHandler = bucketApi.SetMultiBucketReplicationHandlerFunc(func(params bucketApi.SetMultiBucketReplicationParams, session *models.Principal) middleware.Responder {
		response, err := setMultiBucketReplicationResponse(session, params)

		if err != nil {
			return bucketApi.NewSetMultiBucketReplicationDefault(500).WithPayload(err)
		}

		return bucketApi.NewSetMultiBucketReplicationOK().WithPayload(response)
	})

	// list external buckets
	api.BucketListExternalBucketsHandler = bucketApi.ListExternalBucketsHandlerFunc(func(params bucketApi.ListExternalBucketsParams, session *models.Principal) middleware.Responder {
		response, err := listExternalBucketsResponse(params)

		if err != nil {
			return bucketApi.NewListExternalBucketsDefault(500).WithPayload(err)
		}

		return bucketApi.NewListExternalBucketsOK().WithPayload(response)
	})

	// delete replication rule
	api.BucketDeleteBucketReplicationRuleHandler = bucketApi.DeleteBucketReplicationRuleHandlerFunc(func(params bucketApi.DeleteBucketReplicationRuleParams, session *models.Principal) middleware.Responder {
		err := deleteReplicationRuleResponse(session, params)

		if err != nil {
			return bucketApi.NewDeleteBucketReplicationRuleDefault(500).WithPayload(err)
		}

		return bucketApi.NewDeleteBucketReplicationRuleNoContent()
	})

	// delete all replication rules for a bucket
	api.BucketDeleteAllReplicationRulesHandler = bucketApi.DeleteAllReplicationRulesHandlerFunc(func(params bucketApi.DeleteAllReplicationRulesParams, session *models.Principal) middleware.Responder {
		err := deleteBucketReplicationRulesResponse(session, params)

		if err != nil {
			return bucketApi.NewDeleteAllReplicationRulesDefault(500).WithPayload(err)
		}

		return bucketApi.NewDeleteAllReplicationRulesNoContent()
	})

	// delete selected replication rules for a bucket
	api.BucketDeleteSelectedReplicationRulesHandler = bucketApi.DeleteSelectedReplicationRulesHandlerFunc(func(params bucketApi.DeleteSelectedReplicationRulesParams, session *models.Principal) middleware.Responder {
		err := deleteSelectedReplicationRulesResponse(session, params)

		if err != nil {
			return bucketApi.NewDeleteSelectedReplicationRulesDefault(500).WithPayload(err)
		}

		return bucketApi.NewDeleteSelectedReplicationRulesNoContent()
	})

	//update local bucket replication config item
	api.BucketUpdateMultiBucketReplicationHandler = bucketApi.UpdateMultiBucketReplicationHandlerFunc(func(params bucketApi.UpdateMultiBucketReplicationParams, session *models.Principal) middleware.Responder {
		err := updateBucketReplicationResponse(session, params)
		if err != nil {
			return bucketApi.NewUpdateMultiBucketReplicationDefault(500).WithPayload(err)
		}
		return bucketApi.NewUpdateMultiBucketReplicationCreated()
	})
}

func getListRemoteBucketsResponse(session *models.Principal) (*models.ListRemoteBucketsResponse, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return nil, err
	}
	adminClient := AdminClient{Client: mAdmin}
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

func getRemoteBucketDetailsResponse(session *models.Principal, params bucketApi.RemoteBucketDetailsParams) (*models.RemoteBucket, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return nil, err
	}
	adminClient := AdminClient{Client: mAdmin}
	bucket, err := getRemoteBucket(ctx, adminClient, params.Name)
	if err != nil {
		LogError("error getting remote bucket details: %v", err)
		return nil, err
	}
	return bucket, nil
}

func getDeleteRemoteBucketResponse(session *models.Principal, params bucketApi.DeleteRemoteBucketParams) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return err
	}
	adminClient := AdminClient{Client: mAdmin}
	err = deleteRemoteBucket(ctx, adminClient, params.SourceBucketName, params.Arn)
	if err != nil {
		LogError("error deleting remote bucket: %v", err)
		return err
	}
	return err
}

func getAddRemoteBucketResponse(session *models.Principal, params bucketApi.AddRemoteBucketParams) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client: %v", err)
		return err
	}
	adminClient := AdminClient{Client: mAdmin}
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

func addBucketReplicationItem(ctx context.Context, session *models.Principal, minClient minioClient, bucketName, prefix, destinationARN string, repDelMark, repDels, repMeta bool, tags string, priority int32, storageClass string) error {
	// we will tolerate this call failing
	cfg, err := minClient.getBucketReplication(ctx, bucketName)
	if err != nil {
		LogError("error fetching replication configuration for bucket %s: %v", bucketName, err)
	}

	// add rule
	maxPrio := 0

	if priority <= 0 { // We pick next priority by default
		for _, r := range cfg.Rules {
			if r.Priority > maxPrio {
				maxPrio = r.Priority
			}
		}
		maxPrio++
	} else { // User picked priority, we try to set this manually
		maxPrio = int(priority)
	}

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
		Priority:                fmt.Sprintf("%d", maxPrio),
		RuleStatus:              "enable",
		DestBucket:              destinationARN,
		Op:                      replication.AddOption,
		TagString:               tags,
		ExistingObjectReplicate: "enable", // enabled by default
		ReplicateDeleteMarkers:  repDelMarkStatus,
		ReplicateDeletes:        repDelsStatus,
		ReplicaSync:             repMetaStatus,
		StorageClass:            storageClass,
	}

	err2 := mcClient.setReplication(ctx, &cfg, opts)
	if err2 != nil {
		LogError("error creating replication for bucket:", err2.Cause)
		return err2.Cause
	}
	return nil
}

func editBucketReplicationItem(ctx context.Context, session *models.Principal, minClient minioClient, ruleID, bucketName, prefix, destinationARN string, ruleStatus, repDelMark, repDels, repMeta, existingObjectRep bool, tags string, priority int32, storageClass string) error {
	// we will tolerate this call failing
	cfg, err := minClient.getBucketReplication(ctx, bucketName)
	if err != nil {
		LogError("error fetching replication configuration for bucket %s: %v", bucketName, err)
	}

	maxPrio := int(priority)

	s3Client, err := newS3BucketClient(session, bucketName, prefix)
	if err != nil {
		LogError("error creating S3Client: %v", err)
		return err
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}

	ruleState := "disable"
	if ruleStatus {
		ruleState = "enable"
	}

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

	existingRepStatus := "disable"
	if existingObjectRep {
		existingRepStatus = "enable"
	}

	opts := replication.Options{
		ID:                      ruleID,
		Priority:                fmt.Sprintf("%d", maxPrio),
		RuleStatus:              ruleState,
		DestBucket:              destinationARN,
		Op:                      replication.SetOption,
		TagString:               tags,
		IsTagSet:                true,
		ExistingObjectReplicate: existingRepStatus,
		ReplicateDeleteMarkers:  repDelMarkStatus,
		ReplicateDeletes:        repDelsStatus,
		ReplicaSync:             repMetaStatus,
		StorageClass:            storageClass,
		IsSCSet:                 true,
	}

	err2 := mcClient.setReplication(ctx, &cfg, opts)
	if err2 != nil {
		LogError("error modifying replication for bucket:", err2.Cause)
		return err2.Cause
	}
	return nil
}

func setMultiBucketReplication(ctx context.Context, session *models.Principal, client MinioAdmin, minClient minioClient, params bucketApi.SetMultiBucketReplicationParams) []RemoteBucketResult {
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
					params.Body.ReplicateDeleteMarkers,
					params.Body.ReplicateDeletes,
					params.Body.ReplicateMetadata,
					params.Body.Tags,
					params.Body.Priority,
					params.Body.StorageClass)
			}

			var errorReturn = ""

			if err != nil {
				deleteRemoteBucket(ctx, client, sourceBucket, arn)
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

func setMultiBucketReplicationResponse(session *models.Principal, params bucketApi.SetMultiBucketReplicationParams) (*models.MultiBucketResponseState, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Madmin Client:", err)
		return nil, prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}

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

func listExternalBucketsResponse(params bucketApi.ListExternalBucketsParams) (*models.ListBucketsResponse, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	remoteAdmin, err := newAdminFromCreds(*params.Body.AccessKey, *params.Body.SecretKey, *params.Body.TargetURL, *params.Body.UseTLS)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	remoteClient := AdminClient{Client: remoteAdmin}
	buckets, err := getAccountBuckets(ctx, remoteClient)
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

func getARNFromID(conf *replication.Config, rule string) string {
	for i := range conf.Rules {
		if conf.Rules[i].ID == rule {
			return conf.Rules[i].Destination.Bucket
		}
	}
	return ""
}

func getARNsFromIDs(conf *replication.Config, rules []string) []string {
	temp := make(map[string]string)
	for i := range conf.Rules {
		temp[conf.Rules[i].ID] = conf.Rules[i].Destination.Bucket
	}
	var retval []string
	for i := range rules {
		if val, ok := temp[rules[i]]; ok {
			retval = append(retval, val)
		}
	}
	return retval
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

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Admin Client: %v", err)
		return err
	}
	admClient := AdminClient{Client: mAdmin}

	err3 := deleteRemoteBucket(ctx, admClient, bucketName, getARNFromID(&cfg, ruleID))
	if err3 != nil {
		return err3
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

func deleteAllReplicationRules(ctx context.Context, session *models.Principal, bucketName string) error {
	s3Client, err := newS3BucketClient(session, bucketName, "")
	if err != nil {
		LogError("error creating S3Client: %v", err)
		return err
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}

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

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Admin Client: %v", err)
		return err
	}
	admClient := AdminClient{Client: mAdmin}

	for i := range cfg.Rules {
		err3 := deleteRemoteBucket(ctx, admClient, bucketName, cfg.Rules[i].Destination.Bucket)
		if err3 != nil {
			return err3
		}
	}

	err2 := mcClient.deleteAllReplicationRules(ctx)

	if err2 != nil {
		return err
	}

	return nil

}

func deleteSelectedReplicationRules(ctx context.Context, session *models.Principal, bucketName string, rules []string) error {
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

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		LogError("error creating Admin Client: %v", err)
		return err
	}
	admClient := AdminClient{Client: mAdmin}

	ARNs := getARNsFromIDs(&cfg, rules)

	for i := range rules {
		err3 := deleteRemoteBucket(ctx, admClient, bucketName, ARNs[i])
		if err3 != nil {
			return err3
		}

		opts := replication.Options{
			ID: rules[i],
			Op: replication.RemoveOption,
		}
		err2 := mcClient.setReplication(ctx, &cfg, opts)
		if err2 != nil {
			return err2.Cause
		}
	}
	return nil
}

func deleteReplicationRuleResponse(session *models.Principal, params bucketApi.DeleteBucketReplicationRuleParams) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := deleteReplicationRule(ctx, session, params.BucketName, params.RuleID)

	if err != nil {
		return prepareError(err)
	}
	return nil
}

func deleteBucketReplicationRulesResponse(session *models.Principal, params bucketApi.DeleteAllReplicationRulesParams) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := deleteAllReplicationRules(ctx, session, params.BucketName)

	if err != nil {
		return prepareError(err)
	}
	return nil
}

func deleteSelectedReplicationRulesResponse(session *models.Principal, params bucketApi.DeleteSelectedReplicationRulesParams) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := deleteSelectedReplicationRules(ctx, session, params.BucketName, params.Rules.Rules)

	if err != nil {
		return prepareError(err)
	}
	return nil
}

func updateBucketReplicationResponse(session *models.Principal, params bucketApi.UpdateMultiBucketReplicationParams) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	mClient, err := newMinioClient(session)
	if err != nil {
		LogError("error creating MinIO Client:", err)
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minClient := minioClient{client: mClient}

	err = editBucketReplicationItem(
		ctx,
		session,
		minClient,
		params.RuleID,
		params.BucketName,
		params.Body.Prefix,
		params.Body.Arn,
		params.Body.RuleState,
		params.Body.ReplicateDeleteMarkers,
		params.Body.ReplicateDeletes,
		params.Body.ReplicateMetadata,
		params.Body.ReplicateExistingObjects,
		params.Body.Tags,
		params.Body.Priority,
		params.Body.StorageClass)

	if err != nil {
		return prepareError(err)
	}

	return nil
}

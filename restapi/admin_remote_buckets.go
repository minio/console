// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
	"log"
	"net/url"
	"strconv"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/minio/pkg/auth"
	"github.com/minio/minio/pkg/madmin"
)

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

}

func getListRemoteBucketsResponse(session *models.Principal) (*models.ListRemoteBucketsResponse, error) {
	ctx := context.Background()
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	adminClient := adminClient{client: mAdmin}
	buckets, err := listRemoteBuckets(ctx, adminClient)
	if err != nil {
		log.Println("error listing remote buckets:", err)
		return nil, err
	}
	return &models.ListRemoteBucketsResponse{
		Buckets: buckets,
		Total:   int64(len(buckets)),
	}, nil
}

func getRemoteBucketDetailsResponse(session *models.Principal, params user_api.RemoteBucketDetailsParams) (*models.RemoteBucket, error) {
	ctx := context.Background()
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return nil, err
	}
	adminClient := adminClient{client: mAdmin}
	bucket, err := getRemoteBucket(ctx, adminClient, params.Name)
	if err != nil {
		log.Println("error getting remote bucket details:", err)
		return nil, err
	}
	return bucket, nil
}

func getDeleteRemoteBucketResponse(session *models.Principal, params user_api.DeleteRemoteBucketParams) error {
	ctx := context.Background()
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return err
	}
	adminClient := adminClient{client: mAdmin}
	err = deleteRemoteBucket(ctx, adminClient, params.SourceBucketName, params.Arn)
	if err != nil {
		log.Println("error deleting remote bucket: ", err)
		return err
	}
	return err
}

func getAddRemoteBucketResponse(session *models.Principal, params user_api.AddRemoteBucketParams) error {
	ctx := context.Background()
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		log.Println("error creating Madmin Client:", err)
		return err
	}
	adminClient := adminClient{client: mAdmin}
	err = addRemoteBucket(ctx, adminClient, *params.Body)
	if err != nil {
		log.Println("error adding remote bucket: ", err)
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
			AccessKey:    swag.String(bucket.Credentials.AccessKey),
			RemoteARN:    swag.String(bucket.Arn),
			SecretKey:    bucket.Credentials.SecretKey,
			Service:      "replication",
			SourceBucket: swag.String(bucket.SourceBucket),
			Status:       "",
			TargetBucket: bucket.TargetBucket,
			TargetURL:    bucket.Endpoint,
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

func addRemoteBucket(ctx context.Context, client MinioAdmin, params models.CreateRemoteBucket) error {
	TargetURL := *params.TargetURL
	accessKey := *params.AccessKey
	secretKey := *params.SecretKey
	u, err := url.Parse(TargetURL)
	if err != nil {
		return errors.New("malformed Remote target URL")
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
	creds := &auth.Credentials{AccessKey: accessKey, SecretKey: secretKey}
	remoteBucket := &madmin.BucketTarget{
		TargetBucket: *params.TargetBucket,
		Secure:       secure,
		Credentials:  creds,
		Endpoint:     host,
		Path:         "",
		API:          "s3v4",
		Type:         "replication",
		Region:       params.Region,
	}
	_, err = client.addRemoteBucket(ctx, *params.SourceBucket, remoteBucket)
	return err
}

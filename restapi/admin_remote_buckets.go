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
	"log"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
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

}

func listRemoteBuckets(ctx context.Context, client MinioAdmin) ([]*models.RemoteBucket, error) {
	var remoteBuckets []*models.RemoteBucket
	buckets, err := client.listRemoteBuckets(ctx, "", "")
	if err != nil {
		return nil, err
	}
	for _, bucket := range buckets {
		log.Println(bucket)
		//SourceBucket string            `json:"sourcebucket"`
		//Endpoint     string            `json:"endpoint"`
		//Credentials  *auth.Credentials `json:"credentials"`
		//TargetBucket string            `json:"targetbucket"`
		//Secure       bool              `json:"secure"`
		//Path         string            `json:"path,omitempty"`
		//API          string            `json:"api,omitempty"`
		//Arn          string            `json:"arn,omitempty"`
		//Type         ServiceType       `json:"type"`
		//Region       string            `json:"omitempty"`
		remoteBuckets = append(remoteBuckets, &models.RemoteBucket{
			AccessKey:    &bucket.Credentials.AccessKey,
			RemoteARN:    &bucket.Arn,
			SecretKey:    bucket.Credentials.SecretKey,
			Service:      "replication",
			SourceBucket: &bucket.SourceBucket,
			Status:       "",
			TargetBucket: bucket.TargetBucket,
			TargetURL:    bucket.Endpoint,
		})
	}
	log.Println(remoteBuckets)
	return remoteBuckets, nil
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
		log.Println("error listing groups:", err)
		return nil, err
	}
	return &models.ListRemoteBucketsResponse{
		Buckets: buckets,
		Total:   int64(len(buckets)),
	}, nil
}

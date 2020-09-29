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
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/minio-go/v7"
)

func registerObjectsHandlers(api *operations.ConsoleAPI) {
	// list objects
	api.UserAPIListObjectsHandler = user_api.ListObjectsHandlerFunc(func(params user_api.ListObjectsParams, session *models.Principal) middleware.Responder {
		resp, err := getListObjectsResponse(session, params)
		if err != nil {
			return user_api.NewListObjectsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewListObjectsOK().WithPayload(resp)
	})
}

// listBucketObjects gets an array of objects in a bucket
func listBucketObjects(ctx context.Context, client MinioClient, bucketName string, prefix string, recursive bool) ([]*models.BucketObject, error) {
	var objects []*models.BucketObject
	for lsObj := range client.listObjects(ctx, bucketName, minio.ListObjectsOptions{Prefix: prefix, Recursive: recursive}) {
		if lsObj.Err != nil {
			return nil, lsObj.Err
		}
		obj := &models.BucketObject{
			Name:         lsObj.Key,
			Size:         lsObj.Size,
			LastModified: lsObj.LastModified.String(),
			ContentType:  lsObj.ContentType,
		}
		objects = append(objects, obj)
	}
	return objects, nil
}

// getListObjectsResponse returns a list of objects
func getListObjectsResponse(session *models.Principal, params user_api.ListObjectsParams) (*models.ListObjectsResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	var prefix string
	var recursive bool
	if params.Prefix != nil {
		prefix = *params.Prefix
	}
	if params.Recursive != nil {
		recursive = *params.Recursive
	}
	// bucket request needed to proceed
	if params.BucketName == "" {
		return nil, prepareError(errBucketNameNotInRequest)
	}
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	objs, err := listBucketObjects(ctx, minioClient, params.BucketName, prefix, recursive)
	if err != nil {
		return nil, prepareError(err)
	}

	resp := &models.ListObjectsResponse{
		Objects: objs,
		Total:   int64(len(objs)),
	}
	return resp, nil
}

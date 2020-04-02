// This file is part of MinIO Kubernetes Cloud
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
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/m3/mcs/models"
	"github.com/minio/m3/mcs/restapi/operations"
	"github.com/minio/m3/mcs/restapi/operations/user_api"
	"github.com/minio/minio-go/v6/pkg/policy"
	minioIAMPolicy "github.com/minio/minio/pkg/iam/policy"
)

func registerBucketsHandlers(api *operations.McsAPI) {
	// list buckets
	api.UserAPIListBucketsHandler = user_api.ListBucketsHandlerFunc(func(params user_api.ListBucketsParams, principal interface{}) middleware.Responder {
		listBucketsResponse, err := getListBucketsResponse()
		if err != nil {
			return user_api.NewListBucketsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewListBucketsOK().WithPayload(listBucketsResponse)
	})
	// make bucket
	api.UserAPIMakeBucketHandler = user_api.MakeBucketHandlerFunc(func(params user_api.MakeBucketParams, principal interface{}) middleware.Responder {
		if err := getMakeBucketResponse(params.Body); err != nil {
			return user_api.NewMakeBucketDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewMakeBucketCreated()
	})
	// delete bucket
	api.UserAPIDeleteBucketHandler = user_api.DeleteBucketHandlerFunc(func(params user_api.DeleteBucketParams, principal interface{}) middleware.Responder {
		if err := getDeleteBucketResponse(params); err != nil {
			return user_api.NewMakeBucketDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})

		}
		return user_api.NewDeleteBucketNoContent()
	})
	// get bucket info
	api.UserAPIBucketInfoHandler = user_api.BucketInfoHandlerFunc(func(params user_api.BucketInfoParams, principal interface{}) middleware.Responder {
		bucketInfoResp, err := getBucketInfoResponse(params)
		if err != nil {
			return user_api.NewBucketInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}

		return user_api.NewBucketInfoOK().WithPayload(bucketInfoResp)
	})
	// set bucket policy
	api.UserAPIBucketSetPolicyHandler = user_api.BucketSetPolicyHandlerFunc(func(params user_api.BucketSetPolicyParams, principal interface{}) middleware.Responder {
		bucketSetPolicyResp, err := getBucketSetPolicyResponse(params.Name, params.Body)
		if err != nil {
			return user_api.NewBucketSetPolicyDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return user_api.NewBucketSetPolicyOK().WithPayload(bucketSetPolicyResp)
	})
}

// listBuckets fetches a list of all buckets from MinIO Servers
func listBuckets(ctx context.Context, client MinioClient) ([]*models.Bucket, error) {
	// Get list of all buckets owned by an authenticated user.
	// This call requires explicit authentication, no anonymous requests are
	// allowed for listing buckets.
	buckets, err := client.listBucketsWithContext(ctx)
	if err != nil {
		return []*models.Bucket{}, err
	}

	var bucketInfos []*models.Bucket
	for _, bucket := range buckets {
		bucketElem := &models.Bucket{Name: swag.String(bucket.Name), CreationDate: bucket.CreationDate.String()}
		bucketInfos = append(bucketInfos, bucketElem)
	}

	return bucketInfos, nil
}

// getListBucketsResponse performs listBuckets() and serializes it to the handler's output
func getListBucketsResponse() (*models.ListBucketsResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mClient, err := newMinioClient()
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	buckets, err := listBuckets(ctx, minioClient)
	if err != nil {
		log.Println("error listing buckets:", err)
		return nil, err
	}
	// serialize output
	listBucketsResponse := &models.ListBucketsResponse{
		Buckets: buckets,
		Total:   int64(len(buckets)),
	}
	return listBucketsResponse, nil
}

// makeBucket creates a bucket for an specific minio client
func makeBucket(ctx context.Context, client MinioClient, bucketName string, access models.BucketAccess) error {
	// creates a new bucket with bucketName with a context to control cancellations and timeouts.
	if err := client.makeBucketWithContext(ctx, bucketName, "us-east-1"); err != nil {
		return err
	}
	if err := setBucketAccessPolicy(ctx, client, bucketName, access); err != nil {
		return fmt.Errorf("bucket created but error occurred while setting policy: %s", err.Error())
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
	bucketPolicy := mcsAccess2policyAccess(access)

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

// getMakeBucketResponse performs makeBucket() to create a bucket with its access policy
func getMakeBucketResponse(br *models.MakeBucketRequest) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	// bucket request needed to proceed
	if br == nil {
		log.Println("error bucket body not in request")
		return errors.New(500, "error bucket body not in request")
	}
	mClient, err := newMinioClient()
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	if err := makeBucket(ctx, minioClient, *br.Name, br.Access); err != nil {
		log.Println("error making bucket:", err)
		return err
	}
	return nil
}

// getBucketSetPolicyResponse calls setBucketAccessPolicy() to set a access policy to a bucket
//   and returns the serialized output.
func getBucketSetPolicyResponse(bucketName string, req *models.SetBucketPolicyRequest) (*models.Bucket, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	mClient, err := newMinioClient()
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	// set bucket access policy
	if err := setBucketAccessPolicy(ctx, minioClient, bucketName, req.Access); err != nil {
		log.Println("error setting bucket access policy:", err)
		return nil, err
	}
	// get updated bucket details and return it
	bucket, err := getBucketInfo(minioClient, bucketName)
	if err != nil {
		log.Println("error getting bucket's info:", err)
		return nil, err
	}
	return bucket, nil
}

// removeBucket deletes a bucket
func removeBucket(client MinioClient, bucketName string) error {
	if err := client.removeBucket(bucketName); err != nil {
		return err
	}
	return nil
}

// getDeleteBucketResponse performs removeBucket() to delete a bucket
func getDeleteBucketResponse(params user_api.DeleteBucketParams) error {
	if params.Name == "" {
		log.Println("error bucket name not in request")
		return errors.New(500, "error bucket name not in request")
	}
	bucketName := params.Name

	mClient, err := newMinioClient()
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	return removeBucket(minioClient, bucketName)
}

// getBucketInfo return bucket information including name, policy access, size and creation date
func getBucketInfo(client MinioClient, bucketName string) (*models.Bucket, error) {
	policyStr, err := client.getBucketPolicy(bucketName)
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
	bucketAccess := policyAccess2mcsAccess(policyAccess)
	if bucketAccess == models.BucketAccessPRIVATE && policyStr != "" {
		bucketAccess = models.BucketAccessCUSTOM
	}
	bucket := &models.Bucket{
		Name:         &bucketName,
		Access:       bucketAccess,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	return bucket, nil
}

// getBucketInfoResponse calls getBucketInfo() to get the bucket's info
func getBucketInfoResponse(params user_api.BucketInfoParams) (*models.Bucket, error) {
	mClient, err := newMinioClient()
	if err != nil {
		log.Println("error creating MinIO Client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	bucket, err := getBucketInfo(minioClient, params.Name)
	if err != nil {
		log.Println("error getting bucket's info:", err)
		return nil, err
	}
	return bucket, nil

}

// policyAccess2mcsAccess gets the equivalent of policy.BucketPolicy to models.BucketAccess
func policyAccess2mcsAccess(bucketPolicy policy.BucketPolicy) (bucketAccess models.BucketAccess) {
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

// mcsAccess2policyAccess gets the equivalent of models.BucketAccess to policy.BucketPolicy
func mcsAccess2policyAccess(bucketAccess models.BucketAccess) (bucketPolicy policy.BucketPolicy) {
	switch bucketAccess {
	case models.BucketAccessPUBLIC:
		bucketPolicy = policy.BucketPolicyReadWrite
	case models.BucketAccessPRIVATE:
		bucketPolicy = policy.BucketPolicyNone
	}
	return bucketPolicy
}

// This file is part of MinIO Orchestrator
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

	"github.com/minio/minio-go/v6"
)

func init() {
	// All minio-go API operations shall be performed only once,
	// another way to look at this is we are turning off retries.
	minio.MaxRetry = 1
}

// Config - see http://docs.amazonwebservices.com/AmazonS3/latest/dev/index.html?RESTAuthentication.html
type Config struct {
	AccessKey   string
	SecretKey   string
	Signature   string
	HostURL     string
	AppName     string
	AppVersion  string
	AppComments []string
	Debug       bool
	Insecure    bool
	Lookup      minio.BucketLookupType
}

// Define MinioClient interface with all functions to be implemented
// by mock when testing, it should include all MinioClient respective api calls
// that are used within this project.
type MinioClient interface {
	listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error)
	makeBucketWithContext(ctx context.Context, bucketName, location string) error
	setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error
	removeBucket(bucketName string) error
	getBucketNotification(bucketName string) (bucketNotification minio.BucketNotification, err error)
	getBucketPolicy(bucketName string) (string, error)
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type minioClient struct {
	client *minio.Client
}

// implements minio.ListBucketsWithContext(ctx)
func (mc minioClient) listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error) {
	return mc.client.ListBucketsWithContext(ctx)
}

// implements minio.MakeBucketWithContext(ctx, bucketName, location)
func (mc minioClient) makeBucketWithContext(ctx context.Context, bucketName, location string) error {
	return mc.client.MakeBucketWithContext(ctx, bucketName, location)
}

// implements minio.SetBucketPolicyWithContext(ctx, bucketName, policy)
func (mc minioClient) setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error {
	return mc.client.SetBucketPolicyWithContext(ctx, bucketName, policy)
}

// implements minio.RemoveBucket(bucketName)
func (mc minioClient) removeBucket(bucketName string) error {
	return mc.client.RemoveBucket(bucketName)
}

// implements minio.GetBucketNotification(bucketName)
func (mc minioClient) getBucketNotification(bucketName string) (bucketNotification minio.BucketNotification, err error) {
	return mc.client.GetBucketNotification(bucketName)
}

// implements minio.GetBucketPolicy(bucketName)
func (mc minioClient) getBucketPolicy(bucketName string) (string, error) {
	return mc.client.GetBucketPolicy(bucketName)
}

// newMinioClient creates a new MinIO client to talk to the server
func newMinioClient() (*minio.Client, error) {
	endpoint := getMinIOEndpoint()
	accessKeyID := getAccessKey()
	secretAccessKey := getSecretKey()
	useSSL := getMinIOEndpointSSL()

	// Initialize minio client object.
	minioClient, err := minio.NewV4(endpoint, accessKeyID, secretAccessKey, useSSL)
	if err != nil {
		return nil, err
	}

	return minioClient, nil
}

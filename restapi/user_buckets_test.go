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
	"fmt"
	"reflect"
	"testing"

	"time"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/sse"
	"github.com/minio/minio/pkg/madmin"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioListBucketsWithContextMock func(ctx context.Context) ([]minio.BucketInfo, error)
var minioMakeBucketWithContextMock func(ctx context.Context, bucketName, location string, objectLock bool) error
var minioSetBucketPolicyWithContextMock func(ctx context.Context, bucketName, policy string) error
var minioRemoveBucketMock func(bucketName string) error
var minioGetBucketPolicyMock func(bucketName string) (string, error)
var minioSetBucketEncryptionMock func(ctx context.Context, bucketName string, config *sse.Configuration) error
var minioRemoveBucketEncryptionMock func(ctx context.Context, bucketName string) error
var minioGetBucketEncryptionMock func(ctx context.Context, bucketName string) (*sse.Configuration, error)

// Define a mock struct of minio Client interface implementation
type minioClientMock struct {
}

// mock function of listBucketsWithContext()
func (mc minioClientMock) listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error) {
	return minioListBucketsWithContextMock(ctx)
}

// mock function of makeBucketsWithContext()
func (mc minioClientMock) makeBucketWithContext(ctx context.Context, bucketName, location string, objectLock bool) error {
	return minioMakeBucketWithContextMock(ctx, bucketName, location, objectLock)
}

// mock function of setBucketPolicyWithContext()
func (mc minioClientMock) setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error {
	return minioSetBucketPolicyWithContextMock(ctx, bucketName, policy)
}

// mock function of removeBucket()
func (mc minioClientMock) removeBucket(ctx context.Context, bucketName string) error {
	return minioRemoveBucketMock(bucketName)
}

// mock function of getBucketPolicy()
func (mc minioClientMock) getBucketPolicy(ctx context.Context, bucketName string) (string, error) {
	return minioGetBucketPolicyMock(bucketName)
}

func (mc minioClientMock) setBucketEncryption(ctx context.Context, bucketName string, config *sse.Configuration) error {
	return minioSetBucketEncryptionMock(ctx, bucketName, config)
}

func (mc minioClientMock) removeBucketEncryption(ctx context.Context, bucketName string) error {
	return minioRemoveBucketEncryptionMock(ctx, bucketName)
}

func (mc minioClientMock) getBucketEncryption(ctx context.Context, bucketName string) (*sse.Configuration, error) {
	return minioGetBucketEncryptionMock(ctx, bucketName)
}

var minioAccountUsageInfoMock func(ctx context.Context) (madmin.AccountUsageInfo, error)

// mock function of dataUsageInfo() needed for list bucket's usage
func (ac adminClientMock) accountUsageInfo(ctx context.Context) (madmin.AccountUsageInfo, error) {
	return minioAccountUsageInfoMock(ctx)
}

func TestListBucket(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()
	// Test-1 : getaAcountUsageInfo() Get response from minio client with two buckets
	mockBucketList := madmin.AccountUsageInfo{
		AccountName: "test",
		Buckets: []madmin.BucketUsageInfo{
			{Name: "bucket-1", Created: time.Now(), Size: 1024},
			{Name: "bucket-2", Created: time.Now().Add(time.Hour * 1), Size: 0},
		},
	}
	// mock function response from listBucketsWithContext(ctx)
	minioAccountUsageInfoMock = func(ctx context.Context) (madmin.AccountUsageInfo, error) {
		return mockBucketList, nil
	}
	// get list buckets response this response should have Name, CreationDate, Size and Access
	// as part of of each bucket
	function := "getaAcountUsageInfo()"
	bucketList, err := getAccountUsageInfo(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(mockBucketList.Buckets), len(bucketList), fmt.Sprintf("Failed on %s: length of bucket's lists is not the same", function))
	for i, b := range bucketList {
		assert.Equal(mockBucketList.Buckets[i].Name, *b.Name)
		assert.Equal(mockBucketList.Buckets[i].Created.String(), b.CreationDate)
		assert.Equal(mockBucketList.Buckets[i].Name, *b.Name)
		assert.Equal(int64(mockBucketList.Buckets[i].Size), b.Size)
	}

	// Test-2 : getaAcountUsageInfo() Return and see that the error is handled correctly and returned
	minioAccountUsageInfoMock = func(ctx context.Context) (madmin.AccountUsageInfo, error) {
		return madmin.AccountUsageInfo{}, errors.New("error")
	}
	_, err = getAccountUsageInfo(ctx, adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestMakeBucket(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	function := "makeBucket()"
	ctx := context.Background()
	// Test-1: makeBucket() create a bucket
	// mock function response from makeBucketWithContext(ctx)
	minioMakeBucketWithContextMock = func(ctx context.Context, bucketName, location string, objectLock bool) error {
		return nil
	}
	if err := makeBucket(ctx, minClient, "bucktest1", true); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 makeBucket() make sure errors are handled correctly when error on MakeBucketWithContext
	minioMakeBucketWithContextMock = func(ctx context.Context, bucketName, location string, objectLock bool) error {
		return errors.New("error")
	}
	if err := makeBucket(ctx, minClient, "bucktest1", true); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestDeleteBucket(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	function := "removeBucket()"

	// Test-1: removeBucket() delete a bucket
	// mock function response from removeBucket(bucketName)
	minioRemoveBucketMock = func(bucketName string) error {
		return nil
	}
	if err := removeBucket(minClient, "bucktest1"); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: removeBucket() make sure errors are handled correctly when error on DeleteBucket()
	// mock function response from removeBucket(bucketName)
	minioRemoveBucketMock = func(bucketName string) error {
		return errors.New("error")
	}
	if err := removeBucket(minClient, "bucktest1"); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestBucketInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	function := "getBucketInfo()"

	// Test-1: getBucketInfo() get a bucket with PRIVATE access
	// if not policy set on bucket, access should be PRIVATE
	mockPolicy := ""
	minioGetBucketPolicyMock = func(bucketName string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet := "csbucket"
	outputExpected := &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.BucketAccessPRIVATE,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	bucketInfo, err := getBucketInfo(minClient, bucketToSet)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(outputExpected.Name, bucketInfo.Name)
	assert.Equal(outputExpected.Access, bucketInfo.Access)
	assert.Equal(outputExpected.CreationDate, bucketInfo.CreationDate)
	assert.Equal(outputExpected.Size, bucketInfo.Size)

	// Test-2: getBucketInfo() get a bucket with PUBLIC access
	// mock policy for bucket csbucket with readWrite access (should return PUBLIC)
	mockPolicy = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetBucketLocation\",\"s3:ListBucket\",\"s3:ListBucketMultipartUploads\"],\"Resource\":[\"arn:aws:s3:::csbucket\"]},{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetObject\",\"s3:ListMultipartUploadParts\",\"s3:PutObject\",\"s3:AbortMultipartUpload\",\"s3:DeleteObject\"],\"Resource\":[\"arn:aws:s3:::csbucket/*\"]}]}"
	minioGetBucketPolicyMock = func(bucketName string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.BucketAccessPUBLIC,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	bucketInfo, err = getBucketInfo(minClient, bucketToSet)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(outputExpected.Name, bucketInfo.Name)
	assert.Equal(outputExpected.Access, bucketInfo.Access)
	assert.Equal(outputExpected.CreationDate, bucketInfo.CreationDate)
	assert.Equal(outputExpected.Size, bucketInfo.Size)

	// Test-3: getBucketInfo() get a bucket with CUSTOM access
	// if bucket has a custom policy set it should return CUSTOM
	mockPolicy = "{\"Version\":\"2012-10-17\",\"Statement\":[]}"
	minioGetBucketPolicyMock = func(bucketName string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.BucketAccessCUSTOM,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	bucketInfo, err = getBucketInfo(minClient, bucketToSet)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(outputExpected.Name, bucketInfo.Name)
	assert.Equal(outputExpected.Access, bucketInfo.Access)
	assert.Equal(outputExpected.CreationDate, bucketInfo.CreationDate)
	assert.Equal(outputExpected.Size, bucketInfo.Size)

	// Test-4: getBucketInfo() returns an error while parsing invalid policy
	mockPolicy = "policyinvalid"
	minioGetBucketPolicyMock = func(bucketName string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.BucketAccessCUSTOM,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	_, err = getBucketInfo(minClient, bucketToSet)
	if assert.Error(err) {
		assert.Equal("invalid character 'p' looking for beginning of value", err.Error())
	}

	// Test-4: getBucketInfo() handle GetBucketPolicy error correctly
	mockPolicy = ""
	minioGetBucketPolicyMock = func(bucketName string) (string, error) {
		return "", errors.New("error")
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.BucketAccessCUSTOM,
		CreationDate: "", // to be implemented
		Size:         0,  // to be implemented
	}
	_, err = getBucketInfo(minClient, bucketToSet)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestSetBucketAccess(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	// mock minIO client
	minClient := minioClientMock{}

	function := "setBucketAccessPolicy()"
	// Test-1: setBucketAccessPolicy() set a bucket's access policy
	// mock function response from setBucketPolicyWithContext(ctx)
	minioSetBucketPolicyWithContextMock = func(ctx context.Context, bucketName, policy string) error {
		return nil
	}
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", models.BucketAccessPUBLIC); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: setBucketAccessPolicy() set private access
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", models.BucketAccessPRIVATE); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-3: setBucketAccessPolicy() set invalid access, expected error
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", "other"); assert.Error(err) {
		assert.Equal("access: `other` not supported", err.Error())
	}

	// Test-4: setBucketAccessPolicy() set access on empty bucket name, expected error
	if err := setBucketAccessPolicy(ctx, minClient, "", models.BucketAccessPRIVATE); assert.Error(err) {
		assert.Equal("error: bucket name not present", err.Error())
	}

	// Test-5: setBucketAccessPolicy() set empty access on bucket, expected error
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", ""); assert.Error(err) {
		assert.Equal("error: bucket access not present", err.Error())
	}

	// Test-5: setBucketAccessPolicy() handle error on setPolicy call
	minioSetBucketPolicyWithContextMock = func(ctx context.Context, bucketName, policy string) error {
		return errors.New("error")
	}
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", models.BucketAccessPUBLIC); assert.Error(err) {
		assert.Equal("error", err.Error())
	}

}

func Test_enableBucketEncryption(t *testing.T) {
	ctx := context.Background()
	minClient := minioClientMock{}
	type args struct {
		ctx                            context.Context
		client                         MinioClient
		bucketName                     string
		encryptionType                 models.BucketEncryptionType
		kmsKeyID                       string
		mockEnableBucketEncryptionFunc func(ctx context.Context, bucketName string, config *sse.Configuration) error
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Bucket encryption enabled correctly",
			args: args{
				ctx:            ctx,
				client:         minClient,
				bucketName:     "test",
				encryptionType: "sse-s3",
				mockEnableBucketEncryptionFunc: func(ctx context.Context, bucketName string, config *sse.Configuration) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			name: "Error when enabling bucket encryption",
			args: args{
				ctx:            ctx,
				client:         minClient,
				bucketName:     "test",
				encryptionType: "sse-s3",
				mockEnableBucketEncryptionFunc: func(ctx context.Context, bucketName string, config *sse.Configuration) error {
					return errorGenericInvalidSession
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			minioSetBucketEncryptionMock = tt.args.mockEnableBucketEncryptionFunc
			if err := enableBucketEncryption(tt.args.ctx, tt.args.client, tt.args.bucketName, tt.args.encryptionType, tt.args.kmsKeyID); (err != nil) != tt.wantErr {
				t.Errorf("enableBucketEncryption() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_disableBucketEncryption(t *testing.T) {
	ctx := context.Background()
	minClient := minioClientMock{}
	type args struct {
		ctx                   context.Context
		client                MinioClient
		bucketName            string
		mockBucketDisableFunc func(ctx context.Context, bucketName string) error
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Bucket encryption disabled correctly",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mockBucketDisableFunc: func(ctx context.Context, bucketName string) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			name: "Error when disabling bucket encryption",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mockBucketDisableFunc: func(ctx context.Context, bucketName string) error {
					return errorGeneric
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			minioRemoveBucketEncryptionMock = tt.args.mockBucketDisableFunc
			if err := disableBucketEncryption(tt.args.ctx, tt.args.client, tt.args.bucketName); (err != nil) != tt.wantErr {
				t.Errorf("disableBucketEncryption() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_getBucketEncryptionInfo(t *testing.T) {
	ctx := context.Background()
	minClient := minioClientMock{}
	type args struct {
		ctx                     context.Context
		client                  MinioClient
		bucketName              string
		mockBucketEncryptionGet func(ctx context.Context, bucketName string) (*sse.Configuration, error)
	}
	tests := []struct {
		name    string
		args    args
		want    *models.BucketEncryptionInfo
		wantErr bool
	}{
		{
			name: "Bucket encryption info returned correctly",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mockBucketEncryptionGet: func(ctx context.Context, bucketName string) (*sse.Configuration, error) {
					return &sse.Configuration{
						Rules: []sse.Rule{
							{
								Apply: sse.ApplySSEByDefault{SSEAlgorithm: "AES256", KmsMasterKeyID: ""},
							},
						},
					}, nil
				},
			},
			wantErr: false,
			want: &models.BucketEncryptionInfo{
				Algorithm:      "AES256",
				KmsMasterKeyID: "",
			},
		},
		{
			name: "Bucket encryption info with no rules",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mockBucketEncryptionGet: func(ctx context.Context, bucketName string) (*sse.Configuration, error) {
					return &sse.Configuration{
						Rules: []sse.Rule{},
					}, nil
				},
			},
			wantErr: true,
		},
		{
			name: "Error when obtaining bucket encryption info",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mockBucketEncryptionGet: func(ctx context.Context, bucketName string) (*sse.Configuration, error) {
					return nil, errSSENotConfigured
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			minioGetBucketEncryptionMock = tt.args.mockBucketEncryptionGet
			got, err := getBucketEncryptionInfo(tt.args.ctx, tt.args.client, tt.args.bucketName)
			if (err != nil) != tt.wantErr {
				t.Errorf("getBucketEncryptionInfo() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getBucketEncryptionInfo() got = %v, want %v", got, tt.want)
			}
		})
	}
}

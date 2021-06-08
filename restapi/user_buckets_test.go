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
	"reflect"
	"testing"

	"time"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/sse"
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
var minioSetObjectLockConfigMock func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error
var minioGetBucketObjectLockConfigMock func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
var minioGetObjectLockConfigMock func(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
var minioSetVersioningMock func(ctx context.Context, state string) *probe.Error

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

func (mc minioClientMock) setObjectLockConfig(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
	return minioSetObjectLockConfigMock(ctx, bucketName, mode, validity, unit)
}

func (mc minioClientMock) getBucketObjectLockConfig(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
	return minioGetBucketObjectLockConfigMock(ctx, bucketName)
}
func (mc minioClientMock) getObjectLockConfig(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
	return minioGetObjectLockConfigMock(ctx, bucketName)
}

func (c s3ClientMock) setVersioning(ctx context.Context, state string) *probe.Error {
	return minioSetVersioningMock(ctx, state)
}

var minioAccountInfoMock func(ctx context.Context) (madmin.AccountInfo, error)

// mock function of dataUsageInfo() needed for list bucket's usage
func (ac adminClientMock) accountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return minioAccountInfoMock(ctx)
}

func TestListBucket(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()
	// Test-1 : getaAcountUsageInfo() Get response from minio client with two buckets
	mockBucketList := madmin.AccountInfo{
		AccountName: "test",
		Buckets: []madmin.BucketAccessInfo{
			{Name: "bucket-1", Created: time.Now(), Size: 1024},
			{Name: "bucket-2", Created: time.Now().Add(time.Hour * 1), Size: 0},
		},
	}
	// mock function response from listBucketsWithContext(ctx)
	minioAccountInfoMock = func(ctx context.Context) (madmin.AccountInfo, error) {
		return mockBucketList, nil
	}
	// get list buckets response this response should have Name, CreationDate, Size and Access
	// as part of of each bucket
	function := "getaAcountUsageInfo()"
	bucketList, err := getAccountInfo(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of buckets is correct
	assert.Equal(len(mockBucketList.Buckets), len(bucketList), fmt.Sprintf("Failed on %s: length of bucket's lists is not the same", function))
	for i, b := range bucketList {
		assert.Equal(mockBucketList.Buckets[i].Name, *b.Name)
		assert.Equal(mockBucketList.Buckets[i].Created.Format(time.RFC3339), b.CreationDate)
		assert.Equal(mockBucketList.Buckets[i].Name, *b.Name)
		assert.Equal(int64(mockBucketList.Buckets[i].Size), b.Size)
	}

	// Test-2 : getaAcountUsageInfo() Return and see that the error is handled correctly and returned
	minioAccountInfoMock = func(ctx context.Context) (madmin.AccountInfo, error) {
		return madmin.AccountInfo{}, errors.New("error")
	}
	_, err = getAccountInfo(ctx, adminClient)
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
		Access:       models.NewBucketAccess(models.BucketAccessPRIVATE),
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
		Access:       models.NewBucketAccess(models.BucketAccessPUBLIC),
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
		Access:       models.NewBucketAccess(models.BucketAccessCUSTOM),
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
		Access:       models.NewBucketAccess(models.BucketAccessCUSTOM),
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
		Access:       models.NewBucketAccess(models.BucketAccessCUSTOM),
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

func Test_SetBucketRetentionConfig(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	minClient := minioClientMock{}
	type args struct {
		ctx                     context.Context
		client                  MinioClient
		bucketName              string
		mode                    models.ObjectRetentionMode
		unit                    models.ObjectRetentionUnit
		validity                *int32
		mockBucketRetentionFunc func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error
	}
	tests := []struct {
		name          string
		args          args
		expectedError error
	}{
		{
			name: "Set Bucket Retention Config",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mode:       models.ObjectRetentionModeCompliance,
				unit:       models.ObjectRetentionUnitDays,
				validity:   swag.Int32(2),
				mockBucketRetentionFunc: func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					return nil
				},
			},
			expectedError: nil,
		},
		{
			name: "Set Bucket Retention Config 2",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mode:       models.ObjectRetentionModeGovernance,
				unit:       models.ObjectRetentionUnitYears,
				validity:   swag.Int32(2),
				mockBucketRetentionFunc: func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					return nil
				},
			},
			expectedError: nil,
		},
		{
			name: "Invalid validity",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mode:       models.ObjectRetentionModeCompliance,
				unit:       models.ObjectRetentionUnitDays,
				validity:   nil,
				mockBucketRetentionFunc: func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					return nil
				},
			},
			expectedError: errors.New("retention validity can't be nil"),
		},
		{
			name: "Invalid retention mode",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mode:       models.ObjectRetentionMode("othermode"),
				unit:       models.ObjectRetentionUnitDays,
				validity:   swag.Int32(2),
				mockBucketRetentionFunc: func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					return nil
				},
			},
			expectedError: errors.New("invalid retention mode"),
		},
		{
			name: "Invalid retention unit",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mode:       models.ObjectRetentionModeCompliance,
				unit:       models.ObjectRetentionUnit("otherunit"),
				validity:   swag.Int32(2),
				mockBucketRetentionFunc: func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					return nil
				},
			},
			expectedError: errors.New("invalid retention unit"),
		},
		{
			name: "Handle error on objec lock function",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				mode:       models.ObjectRetentionModeCompliance,
				unit:       models.ObjectRetentionUnitDays,
				validity:   swag.Int32(2),
				mockBucketRetentionFunc: func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					return errors.New("error func")
				},
			},
			expectedError: errors.New("error func"),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			minioSetObjectLockConfigMock = tt.args.mockBucketRetentionFunc
			err := setBucketRetentionConfig(tt.args.ctx, tt.args.client, tt.args.bucketName, tt.args.mode, tt.args.unit, tt.args.validity)
			if tt.expectedError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.expectedError.Error(), err.Error(), fmt.Sprintf("setObjectRetention() error: `%s`, wantErr: `%s`", err, tt.expectedError))
			} else {
				assert.Nil(err, fmt.Sprintf("setBucketRetentionConfig() error: %v, wantErr: %v", err, tt.expectedError))
			}
		})
	}
}

func Test_GetBucketRetentionConfig(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	minClient := minioClientMock{}
	type args struct {
		ctx              context.Context
		client           MinioClient
		bucketName       string
		getRetentionFunc func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	}
	tests := []struct {
		name             string
		args             args
		expectedResponse *models.GetBucketRetentionConfig
		expectedError    error
	}{
		{
			name: "Get Bucket Retention Config",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				getRetentionFunc: func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					m := minio.Governance
					u := minio.Days
					return &m, swag.Uint(2), &u, nil
				},
			},
			expectedResponse: &models.GetBucketRetentionConfig{
				Mode:     models.ObjectRetentionModeGovernance,
				Unit:     models.ObjectRetentionUnitDays,
				Validity: int32(2),
			},
			expectedError: nil,
		},
		{
			name: "Handle Error on minio func",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				getRetentionFunc: func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					return nil, nil, nil, errors.New("error func")
				},
			},
			expectedResponse: nil,
			expectedError:    errors.New("error func"),
		},
		{
			// Description: if minio return NoSuchObjectLockConfiguration, don't panic
			// and return empty response
			name: "Handle NoLock Config error",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				getRetentionFunc: func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					return nil, nil, nil, minio.ErrorResponse{
						Code:    "ObjectLockConfigurationNotFoundError",
						Message: "Object Lock configuration does not exist for this bucket",
					}
				},
			},
			expectedResponse: &models.GetBucketRetentionConfig{},
			expectedError:    nil,
		},
		{
			name: "Return error on invalid mode",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				getRetentionFunc: func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					m := minio.RetentionMode("other")
					u := minio.Days
					return &m, swag.Uint(2), &u, nil
				},
			},
			expectedResponse: nil,
			expectedError:    errors.New("invalid retention mode"),
		},
		{
			name: "Return error on invalid unit",
			args: args{
				ctx:        ctx,
				client:     minClient,
				bucketName: "test",
				getRetentionFunc: func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					m := minio.Governance
					u := minio.ValidityUnit("otherUnit")
					return &m, swag.Uint(2), &u, nil
				},
			},
			expectedResponse: nil,
			expectedError:    errors.New("invalid retention unit"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			minioGetBucketObjectLockConfigMock = tt.args.getRetentionFunc
			resp, err := getBucketRetentionConfig(tt.args.ctx, tt.args.client, tt.args.bucketName)

			if tt.expectedError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.expectedError.Error(), err.Error(), fmt.Sprintf("getBucketRetentionConfig() error: `%s`, wantErr: `%s`", err, tt.expectedError))
			} else {
				assert.Nil(err, fmt.Sprintf("getBucketRetentionConfig() error: %v, wantErr: %v", err, tt.expectedError))
				if !reflect.DeepEqual(resp, tt.expectedResponse) {
					t.Errorf("getBucketRetentionConfig() resp: %v, expectedResponse: %v", resp, tt.expectedResponse)
					return
				}
			}
		})
	}
}

func Test_SetBucketVersioning(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	errorMsg := "Error Message"
	minClient := s3ClientMock{}
	type args struct {
		ctx               context.Context
		state             VersionState
		bucketName        string
		client            s3ClientMock
		setVersioningFunc func(ctx context.Context, state string) *probe.Error
	}
	tests := []struct {
		name          string
		args          args
		expectedError error
	}{
		{
			name: "Set Bucket Version Success",
			args: args{
				ctx:        ctx,
				state:      VersionEnable,
				bucketName: "test",
				client:     minClient,
				setVersioningFunc: func(ctx context.Context, state string) *probe.Error {
					return nil
				},
			},
			expectedError: nil,
		},
		{
			name: "Set Bucket Version Error",
			args: args{
				ctx:        ctx,
				state:      VersionEnable,
				bucketName: "test",
				client:     minClient,
				setVersioningFunc: func(ctx context.Context, state string) *probe.Error {
					return probe.NewError(errors.New(errorMsg))
				},
			},
			expectedError: errors.New(errorMsg),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			minioSetVersioningMock = tt.args.setVersioningFunc

			err := doSetVersioning(tt.args.client, tt.args.state)

			fmt.Println(t.Name())
			fmt.Println("Expected:", tt.expectedError, "Error:", err)

			if tt.expectedError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.expectedError.Error(), err.Error(), fmt.Sprintf("getBucketRetentionConfig() error: `%s`, wantErr: `%s`", err, tt.expectedError))
			}
		})
	}
}

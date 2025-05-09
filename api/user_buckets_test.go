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

package api

import (
	"context"
	"errors"
	"fmt"
	"os"
	"reflect"
	"testing"
	"time"

	"github.com/minio/minio-go/v7/pkg/notification"

	"github.com/minio/console/pkg/auth/token"
	"github.com/minio/console/pkg/utils"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/sse"
	"github.com/minio/minio-go/v7/pkg/tags"
	"github.com/stretchr/testify/assert"
)

// Define a mock struct of mc S3Client interface implementation
type s3ClientMock struct {
	addNotificationConfigMock    func(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error
	removeNotificationConfigMock func(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error
	setVersioningMock            func(ctx context.Context, state string, excludePrefix []string, excludeFolders bool) *probe.Error
}

// implements mc.S3Client.AddNotificationConfigMock()
func (c s3ClientMock) addNotificationConfig(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
	return c.addNotificationConfigMock(ctx, arn, events, prefix, suffix, ignoreExisting)
}

// implements mc.S3Client.DeleteBucketEventNotification()
func (c s3ClientMock) removeNotificationConfig(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error {
	return c.removeNotificationConfigMock(ctx, arn, event, prefix, suffix)
}

func (c s3ClientMock) setVersioning(ctx context.Context, state string, excludePrefix []string, excludeFolders bool) *probe.Error {
	return c.setVersioningMock(ctx, state, excludePrefix, excludeFolders)
}

// Define a mock struct of minio Client interface implementation
type minioClientMock struct {
	getBucketNotificationMock      func(ctx context.Context, bucketName string) (bucketNotification notification.Configuration, err error)
	listBucketsWithContextMock     func(ctx context.Context) ([]minio.BucketInfo, error)
	makeBucketWithContextMock      func(ctx context.Context, bucketName, location string, objectLock bool) error
	setBucketPolicyWithContextMock func(ctx context.Context, bucketName, policy string) error
	removeBucketMock               func(bucketName string) error
	getBucketPolicyMock            func(bucketName string) (string, error)
	setBucketEncryptionMock        func(ctx context.Context, bucketName string, config *sse.Configuration) error
	removeBucketEncryptionMock     func(ctx context.Context, bucketName string) error
	getBucketEncryptionMock        func(ctx context.Context, bucketName string) (*sse.Configuration, error)
	setObjectLockConfigMock        func(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error
	getBucketObjectLockConfigMock  func(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	getObjectLockConfigMock        func(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	copyObjectMock                 func(ctx context.Context, dst minio.CopyDestOptions, src minio.CopySrcOptions) (minio.UploadInfo, error)
	setBucketTaggingMock           func(ctx context.Context, bucketName string, tags *tags.Tags) error
	removeBucketTaggingMock        func(ctx context.Context, bucketName string) error
}

// mock function of getBucketNotification()
func (mc minioClientMock) getBucketNotification(ctx context.Context, bucketName string) (bucketNotification notification.Configuration, err error) {
	return mc.getBucketNotificationMock(ctx, bucketName)
}

// mock function of listBucketsWithContext()
func (mc minioClientMock) listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error) {
	return mc.listBucketsWithContextMock(ctx)
}

// mock function of makeBucketsWithContext()
func (mc minioClientMock) makeBucketWithContext(ctx context.Context, bucketName, location string, objectLock bool) error {
	return mc.makeBucketWithContextMock(ctx, bucketName, location, objectLock)
}

// mock function of setBucketPolicyWithContext()
func (mc minioClientMock) setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error {
	return mc.setBucketPolicyWithContextMock(ctx, bucketName, policy)
}

// mock function of removeBucket()
func (mc minioClientMock) removeBucket(_ context.Context, bucketName string) error {
	return mc.removeBucketMock(bucketName)
}

// mock function of getBucketPolicy()
func (mc minioClientMock) getBucketPolicy(_ context.Context, bucketName string) (string, error) {
	return mc.getBucketPolicyMock(bucketName)
}

func (mc minioClientMock) setBucketEncryption(ctx context.Context, bucketName string, config *sse.Configuration) error {
	return mc.setBucketEncryptionMock(ctx, bucketName, config)
}

func (mc minioClientMock) removeBucketEncryption(ctx context.Context, bucketName string) error {
	return mc.removeBucketEncryptionMock(ctx, bucketName)
}

func (mc minioClientMock) getBucketEncryption(ctx context.Context, bucketName string) (*sse.Configuration, error) {
	return mc.getBucketEncryptionMock(ctx, bucketName)
}

func (mc minioClientMock) setObjectLockConfig(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
	return mc.setObjectLockConfigMock(ctx, bucketName, mode, validity, unit)
}

func (mc minioClientMock) getBucketObjectLockConfig(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
	return mc.getBucketObjectLockConfigMock(ctx, bucketName)
}

func (mc minioClientMock) getObjectLockConfig(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
	return mc.getObjectLockConfigMock(ctx, bucketName)
}

func (mc minioClientMock) copyObject(ctx context.Context, dst minio.CopyDestOptions, src minio.CopySrcOptions) (minio.UploadInfo, error) {
	return mc.copyObjectMock(ctx, dst, src)
}

func (mc minioClientMock) GetBucketTagging(ctx context.Context, bucketName string) (*tags.Tags, error) {
	return minioGetBucketTaggingMock(ctx, bucketName)
}

func (mc minioClientMock) SetBucketTagging(ctx context.Context, bucketName string, tags *tags.Tags) error {
	return mc.setBucketTaggingMock(ctx, bucketName, tags)
}

func (mc minioClientMock) RemoveBucketTagging(ctx context.Context, bucketName string) error {
	return mc.removeBucketTaggingMock(ctx, bucketName)
}

func minioGetBucketTaggingMock(ctx context.Context, bucketName string) (*tags.Tags, error) {
	fmt.Println(ctx)
	fmt.Println(bucketName)
	retval, _ := tags.NewTags(map[string]string{}, true)
	return retval, nil
}

func TestMakeBucket(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	function := "makeBucket()"
	ctx := context.Background()
	// Test-1: makeBucket() create a bucket
	// mock function response from makeBucketWithContext(ctx)
	minClient.makeBucketWithContextMock = func(_ context.Context, _, _ string, _ bool) error {
		return nil
	}
	if err := makeBucket(ctx, minClient, "bucktest1", true); err != nil {
		t.Errorf("Failed on %s:, errors occurred: %s", function, err.Error())
	}

	// Test-2 makeBucket() make sure errors are handled correctly when errors on MakeBucketWithContext
	minClient.makeBucketWithContextMock = func(_ context.Context, _, _ string, _ bool) error {
		return errors.New("error")
	}
	if err := makeBucket(ctx, minClient, "bucktest1", true); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestBucketInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	minClient := minioClientMock{}
	adminClient := AdminClientMock{}
	ctx := context.Background()
	function := "getBucketInfo()"

	// Test-1: getBucketInfo() get a bucket with PRIVATE access
	// if not policy set on bucket, access should be PRIVATE
	mockPolicy := ""
	minClient.getBucketPolicyMock = func(_ string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet := "csbucket"
	outputExpected := &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.NewBucketAccess(models.BucketAccessPRIVATE),
		CreationDate: "0001-01-01T00:00:00Z",
		Size:         0,
		Objects:      0,
	}
	infoPolicy := `
{
	"Version": "2012-10-17",
	"Statement": [{
			"Action": [
				"admin:*"
			],
			"Effect": "Allow",
			"Sid": ""
		},
		{
			"Action": [
				"s3:*"
			],
			"Effect": "Allow",
			"Resource": [
				"arn:aws:s3:::*"
			],
			"Sid": ""
		}
	]
}`
	mockBucketList := madmin.AccountInfo{
		AccountName: "test",
		Buckets: []madmin.BucketAccessInfo{
			{Name: "bucket-1", Created: time.Now(), Size: 1024},
			{Name: "bucket-2", Created: time.Now().Add(time.Hour * 1), Size: 0},
		},
		Policy: []byte(infoPolicy),
	}
	// mock function response from listBucketsWithContext(ctx)
	adminClient.minioAccountInfoMock = func(_ context.Context) (madmin.AccountInfo, error) {
		return mockBucketList, nil
	}

	bucketInfo, err := getBucketInfo(ctx, minClient, adminClient, bucketToSet)
	if err != nil {
		t.Errorf("Failed on %s:, errors occurred: %s", function, err.Error())
	}
	assert.Equal(outputExpected.Name, bucketInfo.Name)
	assert.Equal(outputExpected.Access, bucketInfo.Access)
	assert.Equal(outputExpected.CreationDate, bucketInfo.CreationDate)
	assert.Equal(outputExpected.Size, bucketInfo.Size)
	assert.Equal(outputExpected.Objects, bucketInfo.Objects)

	// Test-2: getBucketInfo() get a bucket with PUBLIC access
	// mock policy for bucket csbucket with readWrite access (should return PUBLIC)
	mockPolicy = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetBucketLocation\",\"s3:ListBucket\",\"s3:ListBucketMultipartUploads\"],\"Resource\":[\"arn:aws:s3:::csbucket\"]},{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetObject\",\"s3:ListMultipartUploadParts\",\"s3:PutObject\",\"s3:AbortMultipartUpload\",\"s3:DeleteObject\"],\"Resource\":[\"arn:aws:s3:::csbucket/*\"]}]}"
	minClient.getBucketPolicyMock = func(_ string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.NewBucketAccess(models.BucketAccessPUBLIC),
		CreationDate: "0001-01-01T00:00:00Z",
		Size:         0,
		Objects:      0,
	}
	bucketInfo, err = getBucketInfo(ctx, minClient, adminClient, bucketToSet)
	if err != nil {
		t.Errorf("Failed on %s:, errors occurred: %s", function, err.Error())
	}
	assert.Equal(outputExpected.Name, bucketInfo.Name)
	assert.Equal(outputExpected.Access, bucketInfo.Access)
	assert.Equal(outputExpected.CreationDate, bucketInfo.CreationDate)
	assert.Equal(outputExpected.Size, bucketInfo.Size)
	assert.Equal(outputExpected.Objects, bucketInfo.Objects)

	// Test-3: getBucketInfo() get a bucket with PRIVATE access
	// if bucket has a null statement, the bucket is PRIVATE
	mockPolicy = "{\"Version\":\"2012-10-17\",\"Statement\":[]}"
	minClient.getBucketPolicyMock = func(_ string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.NewBucketAccess(models.BucketAccessPRIVATE),
		CreationDate: "0001-01-01T00:00:00Z",
		Size:         0,
		Objects:      0,
	}
	bucketInfo, err = getBucketInfo(ctx, minClient, adminClient, bucketToSet)
	if err != nil {
		t.Errorf("Failed on %s:, errors occurred: %s", function, err.Error())
	}
	assert.Equal(outputExpected.Name, bucketInfo.Name)
	assert.Equal(outputExpected.Access, bucketInfo.Access)
	assert.Equal(outputExpected.CreationDate, bucketInfo.CreationDate)
	assert.Equal(outputExpected.Size, bucketInfo.Size)
	assert.Equal(outputExpected.Objects, bucketInfo.Objects)

	// Test-4: getBucketInfo() returns an errors while parsing invalid policy
	mockPolicy = "policyinvalid"
	minClient.getBucketPolicyMock = func(_ string) (string, error) {
		return mockPolicy, nil
	}
	bucketToSet = "csbucket"
	outputExpected = &models.Bucket{
		Name:         swag.String(bucketToSet),
		Access:       models.NewBucketAccess(models.BucketAccessCUSTOM),
		CreationDate: "",
		Size:         0,
	}
	_, err = getBucketInfo(ctx, minClient, adminClient, bucketToSet)
	if assert.Error(err) {
		assert.Equal("invalid character 'p' looking for beginning of value", err.Error())
	}

	// Test-4: getBucketInfo() handle GetBucketPolicy errors correctly
	// Test removed since we can tolerate this scenario now
}

func TestSetBucketAccess(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	// mock minIO client
	minClient := minioClientMock{}

	function := "setBucketAccessPolicy()"
	// Test-1: setBucketAccessPolicy() set a bucket's access policy
	// mock function response from setBucketPolicyWithContext(ctx)
	minClient.setBucketPolicyWithContextMock = func(_ context.Context, _, _ string) error {
		return nil
	}
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", models.BucketAccessPUBLIC, ""); err != nil {
		t.Errorf("Failed on %s:, errors occurred: %s", function, err.Error())
	}

	// Test-2: setBucketAccessPolicy() set private access
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", models.BucketAccessPRIVATE, ""); err != nil {
		t.Errorf("Failed on %s:, errors occurred: %s", function, err.Error())
	}

	// Test-3: setBucketAccessPolicy() set invalid access, expected errors
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", "other", ""); assert.Error(err) {
		assert.Equal("access: `other` not supported", err.Error())
	}

	// Test-4: setBucketAccessPolicy() set access on empty bucket name, expected errors
	if err := setBucketAccessPolicy(ctx, minClient, "", models.BucketAccessPRIVATE, ""); assert.Error(err) {
		assert.Equal("error: bucket name not present", err.Error())
	}

	// Test-5: setBucketAccessPolicy() set empty access on bucket, expected errors
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", "", ""); assert.Error(err) {
		assert.Equal("error: bucket access not present", err.Error())
	}

	// Test-5: setBucketAccessPolicy() handle errors on SetPolicy call
	minClient.setBucketPolicyWithContextMock = func(_ context.Context, _, _ string) error {
		return errors.New("error")
	}
	if err := setBucketAccessPolicy(ctx, minClient, "bucktest1", models.BucketAccessPUBLIC, ""); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func Test_disableBucketEncryption(t *testing.T) {
	ctx := context.Background()
	type args struct {
		ctx                   context.Context
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
				bucketName: "test",
				mockBucketDisableFunc: func(_ context.Context, _ string) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			name: "Error when disabling bucket encryption",
			args: args{
				ctx:        ctx,
				bucketName: "test",
				mockBucketDisableFunc: func(_ context.Context, _ string) error {
					return ErrDefault
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			minClient := minioClientMock{}
			minClient.removeBucketEncryptionMock = tt.args.mockBucketDisableFunc
			if err := disableBucketEncryption(tt.args.ctx, minClient, tt.args.bucketName); (err != nil) != tt.wantErr {
				t.Errorf("disableBucketEncryption() errors = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_GetBucketRetentionConfig(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	type args struct {
		ctx              context.Context
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
				bucketName: "test",
				getRetentionFunc: func(_ context.Context, _ string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
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
			name: "Get Bucket Retention Config Compliance",
			args: args{
				ctx:        ctx,
				bucketName: "test",
				getRetentionFunc: func(_ context.Context, _ string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					m := minio.Compliance
					u := minio.Days
					return &m, swag.Uint(2), &u, nil
				},
			},
			expectedResponse: &models.GetBucketRetentionConfig{
				Mode:     models.ObjectRetentionModeCompliance,
				Unit:     models.ObjectRetentionUnitDays,
				Validity: int32(2),
			},
			expectedError: nil,
		},
		{
			name: "Handle Error on minio func",
			args: args{
				ctx:        ctx,
				bucketName: "test",
				getRetentionFunc: func(_ context.Context, _ string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					return nil, nil, nil, errors.New("error func")
				},
			},
			expectedResponse: nil,
			expectedError:    errors.New("error func"),
		},
		{
			// Description: if minio return NoSuchObjectLockConfiguration, don't panic
			// and return empty response
			name: "Handle NoLock Config errors",
			args: args{
				ctx:        ctx,
				bucketName: "test",
				getRetentionFunc: func(_ context.Context, _ string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
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
			name: "Return errors on invalid mode",
			args: args{
				ctx:        ctx,
				bucketName: "test",
				getRetentionFunc: func(_ context.Context, _ string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
					m := minio.RetentionMode("other")
					u := minio.Days
					return &m, swag.Uint(2), &u, nil
				},
			},
			expectedResponse: nil,
			expectedError:    errors.New("invalid retention mode"),
		},
		{
			name: "Return errors on invalid unit",
			args: args{
				ctx:        ctx,
				bucketName: "test",
				getRetentionFunc: func(_ context.Context, _ string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
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
		t.Run(tt.name, func(_ *testing.T) {
			minClient := minioClientMock{}
			minClient.getBucketObjectLockConfigMock = tt.args.getRetentionFunc
			resp, err := getBucketRetentionConfig(tt.args.ctx, minClient, tt.args.bucketName)

			if tt.expectedError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.expectedError.Error(), err.Error(), fmt.Sprintf("getBucketRetentionConfig() errors: `%s`, wantErr: `%s`", err, tt.expectedError))
			} else {
				assert.Nil(err, fmt.Sprintf("getBucketRetentionConfig() errors: %v, wantErr: %v", err, tt.expectedError))
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
	ctx := context.WithValue(context.Background(), utils.ContextClientIP, "127.0.0.1")
	errorMsg := "Error Message"
	type args struct {
		ctx               context.Context
		state             VersionState
		excludePrefix     []string
		excludeFolders    bool
		bucketName        string
		setVersioningFunc func(ctx context.Context, state string, excludePrefix []string, excludeFolders bool) *probe.Error
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
				setVersioningFunc: func(_ context.Context, _ string, _ []string, _ bool) *probe.Error {
					return nil
				},
			},
			expectedError: nil,
		},
		{
			name: "Set Bucket Version with Prefixes Success",
			args: args{
				ctx:           ctx,
				state:         VersionEnable,
				excludePrefix: []string{"prefix1", "prefix2"},
				bucketName:    "test",
				setVersioningFunc: func(_ context.Context, _ string, _ []string, _ bool) *probe.Error {
					return nil
				},
			},
			expectedError: nil,
		},
		{
			name: "Set Bucket Version with Excluded Folders Success",
			args: args{
				ctx:            ctx,
				state:          VersionEnable,
				excludePrefix:  []string{"prefix1", "prefix2"},
				excludeFolders: true,
				bucketName:     "test",
				setVersioningFunc: func(_ context.Context, _ string, _ []string, _ bool) *probe.Error {
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
				setVersioningFunc: func(_ context.Context, _ string, _ []string, _ bool) *probe.Error {
					return probe.NewError(errors.New(errorMsg))
				},
			},
			expectedError: errors.New(errorMsg),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			s3Client := s3ClientMock{}
			s3Client.setVersioningMock = tt.args.setVersioningFunc

			err := doSetVersioning(tt.args.ctx, s3Client, tt.args.state, tt.args.excludePrefix, tt.args.excludeFolders)

			fmt.Println(t.Name())
			fmt.Println("Expected:", tt.expectedError, "Error:", err)

			if tt.expectedError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.expectedError.Error(), err.Error(), fmt.Sprintf("getBucketRetentionConfig() errors: `%s`, wantErr: `%s`", err, tt.expectedError))
			}
		})
	}
}

func mustTags(tagsMap map[string]string) *tags.Tags {
	tags, _ := tags.NewTags(tagsMap, false)
	return tags
}

func Test_getAccountBuckets(t *testing.T) {
	type args struct {
		ctx            context.Context
		mockBucketList madmin.AccountInfo
		mockError      error
	}

	// Declaring layout constant
	const layout = "Jan 2, 2006 at 3:04pm (MST)"
	// Calling Parse() method with its parameters
	tm, _ := time.Parse(layout, "Feb 4, 2014 at 6:05pm (PST)")
	tests := []struct {
		name    string
		args    args
		want    []*models.Bucket
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "Test list Buckets",
			args: args{
				ctx: context.Background(),
				mockBucketList: madmin.AccountInfo{
					AccountName: "test",
					Buckets: []madmin.BucketAccessInfo{
						{Name: "bucket-1", Created: tm, Size: 1024},
						{Name: "bucket-2", Created: tm, Size: 0},
					},
					Policy: []byte(`
			{
				"Version": "2012-10-17",
				"Statement": [{
						"Action": [
							"admin:*"
						],
						"Effect": "Allow",
						"Sid": ""
					},
					{
						"Action": [
							"s3:*"
						],
						"Effect": "Allow",
						"Resource": [
							"arn:aws:s3:::*"
						],
						"Sid": ""
					}
				]
			}`),
				},
			},
			want: []*models.Bucket{
				{
					Name:         swag.String("bucket-1"),
					CreationDate: tm.Format(time.RFC3339),
					Details:      &models.BucketDetails{},
					RwAccess:     &models.BucketRwAccess{},
					Size:         1024,
				},
				{
					Name:         swag.String("bucket-2"),
					CreationDate: tm.Format(time.RFC3339),
					Details:      &models.BucketDetails{},
					RwAccess:     &models.BucketRwAccess{},
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "Test list Buckets Details",
			args: args{
				ctx: context.Background(),
				mockBucketList: madmin.AccountInfo{
					AccountName: "test",
					Buckets: []madmin.BucketAccessInfo{
						{
							Name: "bucket-1", Created: tm, Size: 1024,
							Details: &madmin.BucketDetails{
								Versioning:          true,
								VersioningSuspended: false,
								Locking:             false,
								Replication:         false,
								Tagging:             nil,
								Quota:               nil,
							},
						},
						{Name: "bucket-2", Created: tm, Size: 0},
					},
					Policy: []byte(`
			{
				"Version": "2012-10-17",
				"Statement": [{
						"Action": [
							"admin:*"
						],
						"Effect": "Allow",
						"Sid": ""
					},
					{
						"Action": [
							"s3:*"
						],
						"Effect": "Allow",
						"Resource": [
							"arn:aws:s3:::*"
						],
						"Sid": ""
					}
				]
			}`),
				},
			},
			want: []*models.Bucket{
				{
					Name:         swag.String("bucket-1"),
					CreationDate: tm.Format(time.RFC3339),
					Details: &models.BucketDetails{
						Locking:             false,
						Quota:               nil,
						Replication:         false,
						Tags:                nil,
						Versioning:          true,
						VersioningSuspended: false,
					},
					RwAccess: &models.BucketRwAccess{},
					Size:     1024,
				},
				{
					Name:         swag.String("bucket-2"),
					CreationDate: tm.Format(time.RFC3339),
					Details:      &models.BucketDetails{},
					RwAccess:     &models.BucketRwAccess{},
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "Test list Buckets Details Tags",
			args: args{
				ctx: context.Background(),
				mockBucketList: madmin.AccountInfo{
					AccountName: "test",
					Buckets: []madmin.BucketAccessInfo{
						{
							Name: "bucket-1", Created: tm, Size: 1024,
							Details: &madmin.BucketDetails{
								Versioning:          true,
								VersioningSuspended: false,
								Locking:             false,
								Replication:         false,
								Tagging: mustTags(map[string]string{
									"key": "val",
								}),
								Quota: nil,
							},
						},
						{Name: "bucket-2", Created: tm, Size: 0},
					},
					Policy: []byte(`
			{
				"Version": "2012-10-17",
				"Statement": [{
						"Action": [
							"admin:*"
						],
						"Effect": "Allow",
						"Sid": ""
					},
					{
						"Action": [
							"s3:*"
						],
						"Effect": "Allow",
						"Resource": [
							"arn:aws:s3:::*"
						],
						"Sid": ""
					}
				]
			}`),
				},
			},
			want: []*models.Bucket{
				{
					Name:         swag.String("bucket-1"),
					CreationDate: tm.Format(time.RFC3339),
					Details: &models.BucketDetails{
						Locking:     false,
						Quota:       nil,
						Replication: false,
						Tags: map[string]string{
							"key": "val",
						},
						Versioning:          true,
						VersioningSuspended: false,
					},
					RwAccess: &models.BucketRwAccess{},
					Size:     1024,
				},
				{
					Name:         swag.String("bucket-2"),
					CreationDate: tm.Format(time.RFC3339),
					Details:      &models.BucketDetails{},
					RwAccess:     &models.BucketRwAccess{},
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "Test list Buckets Details Quota",
			args: args{
				ctx: context.Background(),
				mockBucketList: madmin.AccountInfo{
					AccountName: "test",
					Buckets: []madmin.BucketAccessInfo{
						{
							Name: "bucket-1", Created: tm, Size: 1024,
							Details: &madmin.BucketDetails{
								Versioning:          true,
								VersioningSuspended: false,
								Locking:             false,
								Replication:         false,
								Tagging:             nil,
								Quota: &madmin.BucketQuota{
									Quota: 10,
									Type:  madmin.HardQuota,
								},
							},
						},
						{Name: "bucket-2", Created: tm, Size: 0},
					},
					Policy: []byte(`
			{
				"Version": "2012-10-17",
				"Statement": [{
						"Action": [
							"admin:*"
						],
						"Effect": "Allow",
						"Sid": ""
					},
					{
						"Action": [
							"s3:*"
						],
						"Effect": "Allow",
						"Resource": [
							"arn:aws:s3:::*"
						],
						"Sid": ""
					}
				]
			}`),
				},
			},
			want: []*models.Bucket{
				{
					Name:         swag.String("bucket-1"),
					CreationDate: tm.Format(time.RFC3339),
					Details: &models.BucketDetails{
						Locking: false,
						Quota: &models.BucketDetailsQuota{
							Quota: 10,
							Type:  "hard",
						},
						Replication:         false,
						Tags:                nil,
						Versioning:          true,
						VersioningSuspended: false,
					},
					RwAccess: &models.BucketRwAccess{},
					Size:     1024,
				},
				{
					Name:         swag.String("bucket-2"),
					CreationDate: tm.Format(time.RFC3339),
					Details:      &models.BucketDetails{},
					RwAccess:     &models.BucketRwAccess{},
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "Test list Buckets Error",
			args: args{
				ctx:            context.Background(),
				mockBucketList: madmin.AccountInfo{},
				mockError:      errors.New("some errors"),
			},
			want:    []*models.Bucket{},
			wantErr: assert.Error,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			client := AdminClientMock{}
			// mock function response from listBucketsWithContext(ctx)
			client.minioAccountInfoMock = func(_ context.Context) (madmin.AccountInfo, error) {
				return tt.args.mockBucketList, tt.args.mockError
			}

			got, err := getAccountBuckets(tt.args.ctx, client)
			if !tt.wantErr(t, err, fmt.Sprintf("getAccountBuckets(%v, %v)", tt.args.ctx, client)) {
				return
			}
			assert.EqualValues(t, tt.want, got, "getAccountBuckets(%v, %v)", tt.args.ctx, client)
		})
	}
}

func Test_getMaxShareLinkExpirationSeconds(t *testing.T) {
	type args struct {
		session *models.Principal
	}
	tests := []struct {
		name     string
		args     args
		want     int64
		wantErr  bool
		preFunc  func()
		postFunc func()
	}{
		{
			name: "empty session returns error",
			args: args{
				session: nil,
			},
			want:    0,
			wantErr: true,
		},
		{
			name: "invalid/expired session returns error",
			args: args{
				session: &models.Principal{
					STSAccessKeyID:     "",
					STSSecretAccessKey: "",
					STSSessionToken:    "",
				},
			},
			want:    0,
			wantErr: true,
		},
		{
			name: "valid session, returns value from env variable",
			args: args{
				session: &models.Principal{
					STSAccessKeyID:     "VQH975JV49JYDLK7F81G",
					STSSecretAccessKey: "zZ2oMQrZwPWGEf1yyHneWFK2JBlGkVjYTJnfw75X",
					STSSessionToken:    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJWUUg5NzVKVjQ5SllETEs3RjgxRyIsImV4cCI6MTY5Nzc0Mzg1MywicGFyZW50IjoibWluaW9hZG1pbiJ9.tRJVb3gbRFswKyNsxz_Dbw1SHoIQRRgA3xmXpXE4shScCsQXDydc7U_F9QOjL_BQDcgs65ZqWo3N2CIPmWoGDA",
				},
			},
			want:    3600,
			wantErr: false,
			preFunc: func() {
				os.Setenv(token.ConsoleSTSDuration, "1h")
			},
			postFunc: func() {
				os.Unsetenv(token.ConsoleSTSDuration)
			},
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(_ *testing.T) {
			if tt.preFunc != nil {
				tt.preFunc()
			}
			expTime, err := getMaxShareLinkExpirationSeconds(tt.args.session)
			if (err != nil) != tt.wantErr {
				t.Errorf("getMaxShareLinkExpirationSeconds() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(expTime, tt.want) {
				t.Errorf("getMaxShareLinkExpirationSeconds() got = %v, want %v", expTime, tt.want)
			}
			if tt.postFunc != nil {
				tt.postFunc()
			}
		})
	}
}

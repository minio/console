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
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"reflect"
	"testing"
	"time"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/tags"
	"github.com/stretchr/testify/assert"
)

var minioListObjectsMock func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
var minioGetObjectLegalHoldMock func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error)
var minioGetObjectRetentionMock func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error)
var minioPutObjectMock func(ctx context.Context, bucketName, objectName string, reader io.Reader, objectSize int64, opts minio.PutObjectOptions) (info minio.UploadInfo, err error)
var minioPutObjectLegalHoldMock func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error
var minioPutObjectRetentionMock func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error
var minioGetObjectTaggingMock func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error)
var minioPutObjectTaggingMock func(ctx context.Context, bucketName, objectName string, otags *tags.Tags, opts minio.PutObjectTaggingOptions) error

var mcListMock func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
var mcRemoveMock func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error
var mcGetMock func(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error)
var mcShareDownloadMock func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error)

// mock functions for minioClientMock
func (ac minioClientMock) listObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	return minioListObjectsMock(ctx, bucket, opts)
}
func (ac minioClientMock) getObjectLegalHold(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
	return minioGetObjectLegalHoldMock(ctx, bucketName, objectName, opts)
}

func (ac minioClientMock) getObjectRetention(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
	return minioGetObjectRetentionMock(ctx, bucketName, objectName, versionID)
}

func (ac minioClientMock) putObject(ctx context.Context, bucketName, objectName string, reader io.Reader, objectSize int64, opts minio.PutObjectOptions) (info minio.UploadInfo, err error) {
	return minioPutObjectMock(ctx, bucketName, objectName, reader, objectSize, opts)
}

func (ac minioClientMock) putObjectLegalHold(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error {
	return minioPutObjectLegalHoldMock(ctx, bucketName, objectName, opts)
}

func (ac minioClientMock) putObjectRetention(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
	return minioPutObjectRetentionMock(ctx, bucketName, objectName, opts)
}

func (ac minioClientMock) getObjectTagging(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
	return minioGetObjectTaggingMock(ctx, bucketName, objectName, opts)
}

func (ac minioClientMock) putObjectTagging(ctx context.Context, bucketName, objectName string, otags *tags.Tags, opts minio.PutObjectTaggingOptions) error {
	return minioPutObjectTaggingMock(ctx, bucketName, objectName, otags, opts)
}

// mock functions for s3ClientMock
func (c s3ClientMock) list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
	return mcListMock(ctx, opts)
}
func (c s3ClientMock) remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
	return mcRemoveMock(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
}

func (c s3ClientMock) get(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error) {
	return mcGetMock(ctx, opts)
}

func (c s3ClientMock) shareDownload(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
	return mcShareDownloadMock(ctx, versionID, expires)
}

func Test_listObjects(t *testing.T) {
	ctx := context.Background()
	t1 := time.Now()
	tretention := time.Now()
	minClient := minioClientMock{}
	type args struct {
		bucketName           string
		prefix               string
		recursive            bool
		withVersions         bool
		listFunc             func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
		objectLegalHoldFunc  func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error)
		objectRetentionFunc  func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error)
		objectGetTaggingFunc func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error)
	}
	tests := []struct {
		test         string
		args         args
		expectedResp []*models.BucketObject
		wantError    error
	}{
		{
			test: "Return objects",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							{
								Key:          "obj1",
								LastModified: t1,
								Size:         int64(1024),
								ContentType:  "content",
							},
							{
								Key:          "obj2",
								LastModified: t1,
								Size:         int64(512),
								ContentType:  "content",
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					tagMap := map[string]string{
						"tag1": "value1",
					}
					otags, err := tags.MapToObjectTags(tagMap)
					if err != nil {
						return nil, err
					}
					return otags, nil
				},
			},
			expectedResp: []*models.BucketObject{
				{
					Name:               "obj1",
					LastModified:       t1.Format(time.RFC3339),
					Size:               int64(1024),
					ContentType:        "content",
					LegalHoldStatus:    string(minio.LegalHoldEnabled),
					RetentionMode:      string(minio.Governance),
					RetentionUntilDate: tretention.Format(time.RFC3339),
					Tags: map[string]string{
						"tag1": "value1",
					},
				}, {
					Name:               "obj2",
					LastModified:       t1.Format(time.RFC3339),
					Size:               int64(512),
					ContentType:        "content",
					LegalHoldStatus:    string(minio.LegalHoldEnabled),
					RetentionMode:      string(minio.Governance),
					RetentionUntilDate: tretention.Format(time.RFC3339),
					Tags: map[string]string{
						"tag1": "value1",
					},
				},
			},
			wantError: nil,
		},
		{
			test: "Return zero objects",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					defer close(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					tagMap := map[string]string{
						"tag1": "value1",
					}
					otags, err := tags.MapToObjectTags(tagMap)
					if err != nil {
						return nil, err
					}
					return otags, nil
				},
			},
			expectedResp: nil,
			wantError:    nil,
		},
		{
			test: "Handle error if present on object",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							{
								Key:          "obj2",
								LastModified: t1,
								Size:         int64(512),
								ContentType:  "content",
							},
							{
								Err: errors.New("error here"),
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					tagMap := map[string]string{
						"tag1": "value1",
					}
					otags, err := tags.MapToObjectTags(tagMap)
					if err != nil {
						return nil, err
					}
					return otags, nil
				},
			},
			expectedResp: nil,
			wantError:    errors.New("error here"),
		},
		{
			// Description: deleted objects with IsDeleteMarker
			// should not call legsalhold, tag or retention funcs
			test: "Return deleted objects",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							{
								Key:            "obj1",
								LastModified:   t1,
								Size:           int64(1024),
								ContentType:    "content",
								IsDeleteMarker: true,
							},
							{
								Key:          "obj2",
								LastModified: t1,
								Size:         int64(512),
								ContentType:  "content",
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					tagMap := map[string]string{
						"tag1": "value1",
					}
					otags, err := tags.MapToObjectTags(tagMap)
					if err != nil {
						return nil, err
					}
					return otags, nil
				},
			},
			expectedResp: []*models.BucketObject{
				{
					Name:           "obj1",
					LastModified:   t1.Format(time.RFC3339),
					Size:           int64(1024),
					ContentType:    "content",
					IsDeleteMarker: true,
				}, {
					Name:               "obj2",
					LastModified:       t1.Format(time.RFC3339),
					Size:               int64(512),
					ContentType:        "content",
					LegalHoldStatus:    string(minio.LegalHoldEnabled),
					RetentionMode:      string(minio.Governance),
					RetentionUntilDate: tretention.Format(time.RFC3339),
					Tags: map[string]string{
						"tag1": "value1",
					},
				},
			},
			wantError: nil,
		},
		{
			// Description: deleted objects with
			// error on legalhold, tags or retention funcs
			// should only log errors
			test: "Return deleted objects, error on legalhold and retention",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							{
								Key:          "obj1",
								LastModified: t1,
								Size:         int64(1024),
								ContentType:  "content",
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					return nil, errors.New("error legal")
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					return nil, nil, errors.New("error retention")
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					return nil, errors.New("error get tags")
				},
			},
			expectedResp: []*models.BucketObject{
				{
					Name:         "obj1",
					LastModified: t1.Format(time.RFC3339),
					Size:         int64(1024),
					ContentType:  "content",
				},
			},
			wantError: nil,
		},
		{
			// Description: if the prefix end with a `/` meaning it is a folder,
			// it should not fetch retention, legalhold nor tags for each object
			// it should only fetch it for single objects with or without versionID
			test: "Don't get object retention/legalhold/tags for folders",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix/folder/",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							{
								Key:          "obj1",
								LastModified: t1,
								Size:         int64(1024),
								ContentType:  "content",
							},
							{
								Key:          "obj2",
								LastModified: t1,
								Size:         int64(512),
								ContentType:  "content",
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					tagMap := map[string]string{
						"tag1": "value1",
					}
					otags, err := tags.MapToObjectTags(tagMap)
					if err != nil {
						return nil, err
					}
					return otags, nil
				},
			},
			expectedResp: []*models.BucketObject{
				{
					Name:         "obj1",
					LastModified: t1.Format(time.RFC3339),
					Size:         int64(1024),
					ContentType:  "content",
				}, {
					Name:         "obj2",
					LastModified: t1.Format(time.RFC3339),
					Size:         int64(512),
					ContentType:  "content",
				},
			},
			wantError: nil,
		},
		{
			// Description: if the prefix is "" meaning it is all contents within a bucket,
			// it should not fetch retention, legalhold nor tags for each object
			// it should only fetch it for single objects with or without versionID
			test: "Don't get object retention/legalhold/tags for empty prefix",
			args: args{
				bucketName:   "bucket1",
				prefix:       "",
				recursive:    true,
				withVersions: false,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							{
								Key:          "obj1",
								LastModified: t1,
								Size:         int64(1024),
								ContentType:  "content",
							},
							{
								Key:          "obj2",
								LastModified: t1,
								Size:         int64(512),
								ContentType:  "content",
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
					tagMap := map[string]string{
						"tag1": "value1",
					}
					otags, err := tags.MapToObjectTags(tagMap)
					if err != nil {
						return nil, err
					}
					return otags, nil
				},
			},
			expectedResp: []*models.BucketObject{
				{
					Name:         "obj1",
					LastModified: t1.Format(time.RFC3339),
					Size:         int64(1024),
					ContentType:  "content",
				}, {
					Name:         "obj2",
					LastModified: t1.Format(time.RFC3339),
					Size:         int64(512),
					ContentType:  "content",
				},
			},
			wantError: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			minioListObjectsMock = tt.args.listFunc
			minioGetObjectLegalHoldMock = tt.args.objectLegalHoldFunc
			minioGetObjectRetentionMock = tt.args.objectRetentionFunc
			minioGetObjectTaggingMock = tt.args.objectGetTaggingFunc
			resp, err := listBucketObjects(ctx, minClient, tt.args.bucketName, tt.args.prefix, tt.args.recursive, tt.args.withVersions)
			if !reflect.DeepEqual(err, tt.wantError) {
				t.Errorf("listBucketObjects() error: %v, wantErr: %v", err, tt.wantError)
				return
			}
			if !reflect.DeepEqual(resp, tt.expectedResp) {
				ji, _ := json.Marshal(resp)
				vi, _ := json.Marshal(tt.expectedResp)
				t.Errorf("\ngot: %s \nwant: %s", ji, vi)
			}
		})
	}
}

func Test_deleteObjects(t *testing.T) {
	ctx := context.Background()
	client := s3ClientMock{}
	type args struct {
		bucket     string
		path       string
		versionID  string
		recursive  bool
		listFunc   func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
		removeFunc func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Remove single object",
			args: args{
				path:      "obj.txt",
				versionID: "",
				recursive: false,
				removeFunc: func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
					errorCh := make(chan *probe.Error)
					go func() {
						defer close(errorCh)
						for {
							return
						}
					}()
					return errorCh
				},
			},
			wantError: nil,
		},
		{
			test: "Error on Remove single object",
			args: args{
				path:      "obj.txt",
				versionID: "",
				recursive: false,
				removeFunc: func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
					errorCh := make(chan *probe.Error)
					go func() {
						defer close(errorCh)
						for {
							errorCh <- probe.NewError(errors.New("probe error"))
							return
						}
					}()
					return errorCh
				},
			},
			wantError: errors.New("probe error"),
		},
		{
			test: "Remove multiple objects",
			args: args{
				path:      "path/",
				versionID: "",
				recursive: true,
				removeFunc: func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
					errorCh := make(chan *probe.Error)
					go func() {
						defer close(errorCh)
						for {
							return
						}
					}()
					return errorCh
				},
				listFunc: func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent)
					go func() {
						defer close(ch)
						for {
							ch <- &mc.ClientContent{}
							return
						}
					}()
					return ch
				},
			},
			wantError: nil,
		},
		{
			// Description handle error when error happens on list function
			// while deleting multiple objects
			test: "Error on Remove multiple objects 1",
			args: args{
				path:      "path/",
				versionID: "",
				recursive: true,
				removeFunc: func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
					errorCh := make(chan *probe.Error)
					go func() {
						defer close(errorCh)
						for {
							return
						}
					}()
					return errorCh
				},
				listFunc: func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent)
					go func() {
						defer close(ch)
						for {
							ch <- &mc.ClientContent{Err: probe.NewError(errors.New("probe error"))}
							return
						}
					}()
					return ch
				},
			},
			wantError: errors.New("probe error"),
		},
		{
			// Description handle error when error happens on remove function
			// while deleting multiple objects
			test: "Error on Remove multiple objects 2",
			args: args{
				path:      "path/",
				versionID: "",
				recursive: true,
				removeFunc: func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
					errorCh := make(chan *probe.Error)
					go func() {
						defer close(errorCh)
						for {
							errorCh <- probe.NewError(errors.New("probe error"))
							return
						}
					}()
					return errorCh
				},
				listFunc: func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent)
					go func() {
						defer close(ch)
						for {
							ch <- &mc.ClientContent{}
							return
						}
					}()
					return ch
				},
			},
			wantError: errors.New("probe error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			mcListMock = tt.args.listFunc
			mcRemoveMock = tt.args.removeFunc
			err := deleteObjects(ctx, client, tt.args.bucket, tt.args.path, tt.args.versionID, tt.args.recursive)
			if !reflect.DeepEqual(err, tt.wantError) {
				t.Errorf("deleteObjects() error: %v, wantErr: %v", err, tt.wantError)
				return
			}
		})
	}
}

func Test_shareObject(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	client := s3ClientMock{}
	type args struct {
		versionID string
		expires   string
		shareFunc func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error)
	}
	tests := []struct {
		test      string
		args      args
		wantError error
		expected  string
	}{
		{
			test: "Get share object url",
			args: args{
				versionID: "2121434",
				expires:   "30s",
				shareFunc: func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: nil,
			expected:  "http://someurl",
		},
		{
			test: "handle invalid expire duration",
			args: args{
				versionID: "2121434",
				expires:   "invalid",
				shareFunc: func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: errors.New("time: invalid duration \"invalid\""),
		},
		{
			test: "handle empty expire duration",
			args: args{
				versionID: "2121434",
				expires:   "",
				shareFunc: func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: nil,
			expected:  "http://someurl",
		},
		{
			test: "handle error on share func",
			args: args{
				versionID: "2121434",
				expires:   "3h",
				shareFunc: func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
					return "", probe.NewError(errors.New("probe error"))
				},
			},
			wantError: errors.New("probe error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			mcShareDownloadMock = tt.args.shareFunc
			url, err := getShareObjectURL(ctx, client, tt.args.versionID, tt.args.expires)
			if tt.wantError != nil {
				if !reflect.DeepEqual(err, tt.wantError) {
					t.Errorf("getShareObjectURL() error: `%s`, wantErr: `%s`", err, tt.wantError)
					return
				}
			} else {
				assert.Equal(*url, tt.expected)
			}

		})
	}
}

func Test_putObjectLegalHold(t *testing.T) {
	ctx := context.Background()
	client := minioClientMock{}
	type args struct {
		bucket        string
		prefix        string
		versionID     string
		status        models.ObjectLegalHoldStatus
		legalHoldFunc func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Put Object Legal hold enabled status",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				status:    models.ObjectLegalHoldStatusEnabled,
				legalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error {
					return nil
				},
			},
			wantError: nil,
		},
		{
			test: "Put Object Legal hold disabled status",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				status:    models.ObjectLegalHoldStatusDisabled,
				legalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error {
					return nil
				},
			},
			wantError: nil,
		},
		{
			test: "Handle error on legalhold func",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				status:    models.ObjectLegalHoldStatusDisabled,
				legalHoldFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error {
					return errors.New("new error")
				},
			},
			wantError: errors.New("new error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			minioPutObjectLegalHoldMock = tt.args.legalHoldFunc
			err := setObjectLegalHold(ctx, client, tt.args.bucket, tt.args.prefix, tt.args.versionID, tt.args.status)
			if !reflect.DeepEqual(err, tt.wantError) {
				t.Errorf("setObjectLegalHold() error: %v, wantErr: %v", err, tt.wantError)
				return
			}
		})
	}
}

func Test_putObjectRetention(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	client := minioClientMock{}
	type args struct {
		bucket        string
		prefix        string
		versionID     string
		opts          *models.PutObjectRetentionRequest
		retentionFunc func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Put Object retention governance",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				opts: &models.PutObjectRetentionRequest{
					Expires:          swag.String("2006-01-02T15:04:05Z"),
					GovernanceBypass: false,
					Mode:             models.NewObjectRetentionMode(models.ObjectRetentionModeGovernance),
				},
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: nil,
		},
		{
			test: "Put Object retention compliance",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				opts: &models.PutObjectRetentionRequest{
					Expires:          swag.String("2006-01-02T15:04:05Z"),
					GovernanceBypass: false,
					Mode:             models.NewObjectRetentionMode(models.ObjectRetentionModeCompliance),
				},
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: nil,
		},
		{
			test: "Empty opts should return error",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				opts:      nil,
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: errors.New("object retention options can't be nil"),
		},
		{
			test: "Empty expire on opts should return error",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				opts: &models.PutObjectRetentionRequest{
					Expires:          nil,
					GovernanceBypass: false,
					Mode:             models.NewObjectRetentionMode(models.ObjectRetentionModeCompliance),
				},
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: errors.New("object retention expires can't be nil"),
		},
		{
			test: "Handle invalid expire time",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				opts: &models.PutObjectRetentionRequest{
					Expires:          swag.String("invalidtime"),
					GovernanceBypass: false,
					Mode:             models.NewObjectRetentionMode(models.ObjectRetentionModeCompliance),
				},
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: errors.New("parsing time \"invalidtime\" as \"2006-01-02T15:04:05Z07:00\": cannot parse \"invalidtime\" as \"2006\""),
		},
		{
			test: "Handle error on retention func",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				opts: &models.PutObjectRetentionRequest{
					Expires:          swag.String("2006-01-02T15:04:05Z"),
					GovernanceBypass: false,
					Mode:             models.NewObjectRetentionMode(models.ObjectRetentionModeCompliance),
				},
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return errors.New("new Error")
				},
			},
			wantError: errors.New("new Error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			minioPutObjectRetentionMock = tt.args.retentionFunc
			err := setObjectRetention(ctx, client, tt.args.bucket, tt.args.prefix, tt.args.versionID, tt.args.opts)
			if tt.wantError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.wantError.Error(), err.Error(), fmt.Sprintf("setObjectRetention() error: `%s`, wantErr: `%s`", err, tt.wantError))
			} else {
				assert.Nil(err, fmt.Sprintf("setObjectRetention() error: %v, wantErr: %v", err, tt.wantError))
			}

		})
	}
}

func Test_deleteObjectRetention(t *testing.T) {
	assert := assert.New(t)
	ctx := context.Background()
	client := minioClientMock{}
	type args struct {
		bucket        string
		prefix        string
		versionID     string
		retentionFunc func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Delete Object retention governance",
			args: args{
				bucket:    "buck1",
				versionID: "someversion",
				prefix:    "folder/file.txt",
				retentionFunc: func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: nil,
		}}
	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			minioPutObjectRetentionMock = tt.args.retentionFunc
			err := deleteObjectRetention(ctx, client, tt.args.bucket, tt.args.prefix, tt.args.versionID)
			if tt.wantError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.wantError.Error(), err.Error(), fmt.Sprintf("deleteObjectRetention() error: `%s`, wantErr: `%s`", err, tt.wantError))
			} else {
				assert.Nil(err, fmt.Sprintf("deleteObjectRetention() error: %v, wantErr: %v", err, tt.wantError))
			}
		})
	}
}

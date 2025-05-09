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
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"reflect"
	"testing"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations/object"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/tags"
	"github.com/stretchr/testify/assert"
)

var (
	minioListObjectsMock        func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
	minioGetObjectLegalHoldMock func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error)
	minioGetObjectRetentionMock func(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error)
	minioPutObjectMock          func(ctx context.Context, bucketName, objectName string, reader io.Reader, objectSize int64, opts minio.PutObjectOptions) (info minio.UploadInfo, err error)
	minioPutObjectLegalHoldMock func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error
	minioPutObjectRetentionMock func(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error
	minioGetObjectTaggingMock   func(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error)
	minioPutObjectTaggingMock   func(ctx context.Context, bucketName, objectName string, otags *tags.Tags, opts minio.PutObjectTaggingOptions) error
	minioStatObjectMock         func(ctx context.Context, bucketName, prefix string, opts minio.GetObjectOptions) (objectInfo minio.ObjectInfo, err error)
)

var (
	mcListMock          func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
	mcRemoveMock        func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass, forceDelete bool, contentCh <-chan *mc.ClientContent) <-chan mc.RemoveResult
	mcGetMock           func(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error)
	mcShareDownloadMock func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error)
)

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

func (ac minioClientMock) statObject(ctx context.Context, bucketName, prefix string, opts minio.GetObjectOptions) (objectInfo minio.ObjectInfo, err error) {
	return minioStatObjectMock(ctx, bucketName, prefix, opts)
}

// mock functions for s3ClientMock
func (c s3ClientMock) list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
	return mcListMock(ctx, opts)
}

func (c s3ClientMock) remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass, forceDelete bool, contentCh <-chan *mc.ClientContent) <-chan mc.RemoveResult {
	return mcRemoveMock(ctx, isIncomplete, isRemoveBucket, isBypass, forceDelete, contentCh)
}

func (c s3ClientMock) get(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error) {
	return mcGetMock(ctx, opts)
}

func (c s3ClientMock) shareDownload(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
	return mcShareDownloadMock(ctx, versionID, expires)
}

func Test_listObjects(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	t1 := time.Now()
	tretention := time.Now()
	minClient := minioClientMock{}
	type args struct {
		bucketName           string
		prefix               string
		recursive            bool
		withVersions         bool
		withMetadata         bool
		limit                *int32
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					defer close(objectStatCh)
					return objectStatCh
				},
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					return nil, errors.New("error legal")
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					return nil, nil, errors.New("error retention")
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
			test: "Return objects",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				withMetadata: false,
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
			test: "Limit 1",
			args: args{
				bucketName:   "bucket1",
				prefix:       "prefix",
				recursive:    true,
				withVersions: false,
				withMetadata: false,
				limit:        swag.Int32(1),
				listFunc: func(_ context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
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
				objectLegalHoldFunc: func(_ context.Context, _, _ string, _ minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
					s := minio.LegalHoldEnabled
					return &s, nil
				},
				objectRetentionFunc: func(_ context.Context, _, _, _ string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
					m := minio.Governance
					return &m, &tretention, nil
				},
				objectGetTaggingFunc: func(_ context.Context, _, _ string, _ minio.GetObjectTaggingOptions) (*tags.Tags, error) {
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
				},
			},
			wantError: nil,
		},
	}

	t.Parallel()
	for _, tt := range tests {
		tt := tt
		t.Run(tt.test, func(_ *testing.T) {
			minioListObjectsMock = tt.args.listFunc
			minioGetObjectLegalHoldMock = tt.args.objectLegalHoldFunc
			minioGetObjectRetentionMock = tt.args.objectRetentionFunc
			minioGetObjectTaggingMock = tt.args.objectGetTaggingFunc
			resp, err := listBucketObjects(ListObjectsOpts{
				ctx:          ctx,
				client:       minClient,
				bucketName:   tt.args.bucketName,
				prefix:       tt.args.prefix,
				recursive:    tt.args.recursive,
				withVersions: tt.args.withVersions,
				withMetadata: tt.args.withMetadata,
				limit:        tt.args.limit,
			})
			switch {
			case err == nil && tt.wantError != nil:
				t.Errorf("listBucketObjects() error: %v, wantErr: %v", err, tt.wantError)
			case err != nil && tt.wantError == nil:
				t.Errorf("listBucketObjects() error: %v, wantErr: %v", err, tt.wantError)
			case err != nil && tt.wantError != nil:
				if err.Error() != tt.wantError.Error() {
					t.Errorf("listBucketObjects() error: %v, wantErr: %v", err, tt.wantError)
				}
			}
			if err == nil {
				if !reflect.DeepEqual(resp, tt.expectedResp) {
					ji, _ := json.Marshal(resp)
					vi, _ := json.Marshal(tt.expectedResp)
					t.Errorf("\ngot: %s \nwant: %s", ji, vi)
				}
			}
		})
	}
}

func Test_deleteObjects(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	s3Client1 := s3ClientMock{}
	type args struct {
		bucket     string
		path       string
		versionID  string
		recursive  bool
		nonCurrent bool
		listFunc   func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
		removeFunc func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass, forceDelete bool, contentCh <-chan *mc.ClientContent) <-chan mc.RemoveResult
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Remove single object",
			args: args{
				path:       "obj.txt",
				versionID:  "",
				recursive:  false,
				nonCurrent: false,
				removeFunc: func(_ context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					resultCh := make(chan mc.RemoveResult, 1)
					resultCh <- mc.RemoveResult{Err: nil}
					close(resultCh)
					return resultCh
				},
			},
			wantError: nil,
		},
		{
			test: "Error on Remove single object",
			args: args{
				path:       "obj.txt",
				versionID:  "",
				recursive:  false,
				nonCurrent: false,
				removeFunc: func(_ context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					resultCh := make(chan mc.RemoveResult, 1)
					resultCh <- mc.RemoveResult{Err: probe.NewError(errors.New("probe error"))}
					close(resultCh)
					return resultCh
				},
			},
			wantError: errors.New("probe error"),
		},
		{
			test: "Remove multiple objects",
			args: args{
				path:       "path/",
				versionID:  "",
				recursive:  true,
				nonCurrent: false,
				removeFunc: func(_ context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					resultCh := make(chan mc.RemoveResult, 1)
					resultCh <- mc.RemoveResult{Err: nil}
					close(resultCh)
					return resultCh
				},
				listFunc: func(_ context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent, 1)
					ch <- &mc.ClientContent{}
					close(ch)
					return ch
				},
			},
			wantError: nil,
		},
		{
			// Description handle error when error happens on remove function
			// while deleting multiple objects
			test: "Error on Remove multiple objects",
			args: args{
				path:       "path/",
				versionID:  "",
				recursive:  true,
				nonCurrent: false,
				removeFunc: func(_ context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					resultCh := make(chan mc.RemoveResult, 1)
					resultCh <- mc.RemoveResult{Err: probe.NewError(errors.New("probe error"))}
					close(resultCh)
					return resultCh
				},
				listFunc: func(_ context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent, 1)
					ch <- &mc.ClientContent{}
					close(ch)
					return ch
				},
			},
			wantError: errors.New("probe error"),
		},
		{
			test: "Remove non current objects - no error",
			args: args{
				path:       "path/",
				versionID:  "",
				recursive:  true,
				nonCurrent: true,
				removeFunc: func(_ context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					resultCh := make(chan mc.RemoveResult, 1)
					resultCh <- mc.RemoveResult{Err: nil}
					close(resultCh)
					return resultCh
				},
				listFunc: func(_ context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent, 1)
					ch <- &mc.ClientContent{}
					close(ch)
					return ch
				},
			},
			wantError: nil,
		},
		{
			// Description handle error when error happens on remove function
			// while deleting multiple objects
			test: "Error deleting non current objects",
			args: args{
				path:       "path/",
				versionID:  "",
				recursive:  true,
				nonCurrent: true,
				removeFunc: func(_ context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					resultCh := make(chan mc.RemoveResult, 1)
					resultCh <- mc.RemoveResult{Err: probe.NewError(errors.New("probe error"))}
					close(resultCh)
					return resultCh
				},
				listFunc: func(_ context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent, 1)
					ch <- &mc.ClientContent{}
					close(ch)
					return ch
				},
			},
			wantError: errors.New("probe error"),
		},
	}

	t.Parallel()
	for _, tt := range tests {
		tt := tt
		t.Run(tt.test, func(_ *testing.T) {
			mcListMock = tt.args.listFunc
			mcRemoveMock = tt.args.removeFunc
			err := deleteObjects(ctx, s3Client1, tt.args.bucket, tt.args.path, tt.args.versionID, tt.args.recursive, false, tt.args.nonCurrent, false)
			switch {
			case err == nil && tt.wantError != nil:
				t.Errorf("deleteObjects() error: %v, wantErr: %v", err, tt.wantError)
			case err != nil && tt.wantError == nil:
				t.Errorf("deleteObjects() error: %v, wantErr: %v", err, tt.wantError)
			case err != nil && tt.wantError != nil:
				if err.Error() != tt.wantError.Error() {
					t.Errorf("deleteObjects() error: %v, wantErr: %v", err, tt.wantError)
				}
			}
		})
	}
}

func Test_shareObject(t *testing.T) {
	tAssert := assert.New(t)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client := s3ClientMock{}
	type args struct {
		r         *http.Request
		versionID string
		expires   string
		shareFunc func(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error)
	}
	tests := []struct {
		test       string
		args       args
		setEnvVars func()
		wantError  error
		expected   string
	}{
		{
			test: "return sharefunc url base64 encoded with host name",
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "30s",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},

			wantError: nil,
			expected:  "http://localhost:9090/api/v1/download-shared-object/aHR0cDovL3NvbWV1cmw",
		},
		{
			test: "return https scheme if url uses TLS",
			args: args{
				r: &http.Request{
					TLS:  &tls.ConnectionState{},
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "30s",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},

			wantError: nil,
			expected:  "https://localhost:9090/api/v1/download-shared-object/aHR0cDovL3NvbWV1cmw",
		},
		{
			test: "returns invalid expire duration if expiration is invalid",
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "invalid",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: errors.New("time: invalid duration \"invalid\""),
		},
		{
			test: "add default expiration if expiration is empty",
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: nil,
			expected:  "http://localhost:9090/api/v1/download-shared-object/aHR0cDovL3NvbWV1cmw",
		},
		{
			test: "return error if sharefunc returns error",
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "3h",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "", probe.NewError(errors.New("probe error"))
				},
			},
			wantError: errors.New("probe error"),
		},
		{
			test: "return shareFunc url base64 encoded url-safe",
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "3h",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					// https://127.0.0.1:9000/cestest/Audio%20icon.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256 using StdEncoding adds an extra `/` making it not url safe
					return "https://127.0.0.1:9000/cestest/Audio%20icon.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256", nil
				},
			},
			wantError: nil,
			expected:  "http://localhost:9090/api/v1/download-shared-object/aHR0cHM6Ly8xMjcuMC4wLjE6OTAwMC9jZXN0ZXN0L0F1ZGlvJTIwaWNvbi5zdmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTY",
		},
		{
			test: "returns redirect url with share link if redirect url env variable set",
			setEnvVars: func() {
				t.Setenv(ConsoleBrowserRedirectURL, "http://proxy-url.com:9012/console/subpath")
			},
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "30s",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: nil,
			expected:  "http://proxy-url.com:9012/console/subpath/api/v1/download-shared-object/aHR0cDovL3NvbWV1cmw",
		},
		{
			test: "returns redirect url with share link if redirect url env variable set with trailing slash",
			setEnvVars: func() {
				t.Setenv(ConsoleBrowserRedirectURL, "http://proxy-url.com:9012/console/subpath/")
			},
			args: args{
				r: &http.Request{
					TLS:  nil,
					Host: "localhost:9090",
				},
				versionID: "2121434",
				expires:   "30s",
				shareFunc: func(_ context.Context, _ string, _ time.Duration) (string, *probe.Error) {
					return "http://someurl", nil
				},
			},
			wantError: nil,
			expected:  "http://proxy-url.com:9012/console/subpath/api/v1/download-shared-object/aHR0cDovL3NvbWV1cmw",
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(_ *testing.T) {
			mcShareDownloadMock = tt.args.shareFunc
			if tt.setEnvVars != nil {
				tt.setEnvVars()
			}
			url, err := getShareObjectURL(ctx, client, tt.args.r, tt.args.versionID, tt.args.expires)
			if tt.wantError != nil {
				if !reflect.DeepEqual(err, tt.wantError) {
					t.Errorf("getShareObjectURL() error: `%s`, wantErr: `%s`", err, tt.wantError)
					return
				}
			} else {
				tAssert.Equal(tt.expected, *url)
			}
		})
	}
}

func Test_deleteObjectRetention(t *testing.T) {
	tAssert := assert.New(t)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
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
				retentionFunc: func(_ context.Context, _, _ string, _ minio.PutObjectRetentionOptions) error {
					return nil
				},
			},
			wantError: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.test, func(_ *testing.T) {
			minioPutObjectRetentionMock = tt.args.retentionFunc
			err := deleteObjectRetention(ctx, client, tt.args.bucket, tt.args.prefix, tt.args.versionID)
			if tt.wantError != nil {
				fmt.Println(t.Name())
				tAssert.Equal(tt.wantError.Error(), err.Error(), fmt.Sprintf("deleteObjectRetention() error: `%s`, wantErr: `%s`", err, tt.wantError))
			} else {
				tAssert.Nil(err, fmt.Sprintf("deleteObjectRetention() error: %v, wantErr: %v", err, tt.wantError))
			}
		})
	}
}

func Test_getObjectInfo(t *testing.T) {
	tAssert := assert.New(t)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client := minioClientMock{}

	type args struct {
		bucketName string
		prefix     string
		versionID  string
		statFunc   func(ctx context.Context, bucketName string, prefix string, opts minio.GetObjectOptions) (objectInfo minio.ObjectInfo, err error)
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Test function not returns an error",
			args: args{
				bucketName: "bucket1",
				prefix:     "someprefix",
				versionID:  "version123",
				statFunc: func(_ context.Context, _ string, _ string, _ minio.GetObjectOptions) (minio.ObjectInfo, error) {
					return minio.ObjectInfo{}, nil
				},
			},
			wantError: nil,
		},
		{
			test: "Test function returns an error",
			args: args{
				bucketName: "bucket2",
				prefix:     "someprefi2",
				versionID:  "version456",
				statFunc: func(_ context.Context, _ string, _ string, _ minio.GetObjectOptions) (minio.ObjectInfo, error) {
					return minio.ObjectInfo{}, errors.New("new Error")
				},
			},
			wantError: errors.New("new Error"),
		},
	}
	for _, tt := range tests {
		t.Run(tt.test, func(_ *testing.T) {
			minioStatObjectMock = tt.args.statFunc
			_, err := getObjectInfo(ctx, client, tt.args.bucketName, tt.args.prefix, tt.args.versionID)
			if tt.wantError != nil {
				fmt.Println(t.Name())
				tAssert.Equal(tt.wantError.Error(), err.Error(), fmt.Sprintf("getObjectInfo() error: `%s`, wantErr: `%s`", err, tt.wantError))
			} else {
				tAssert.Nil(err, fmt.Sprintf("getObjectInfo() error: %v, wantErr: %v", err, tt.wantError))
			}
		})
	}
}

func Test_getScheme(t *testing.T) {
	type args struct {
		rawurl string
	}
	tests := []struct {
		name       string
		args       args
		wantScheme string
		wantPath   string
	}{
		{
			name: "expected",
			args: args{
				rawurl: "http://domain.com",
			},
			wantScheme: "http",
			wantPath:   "//domain.com",
		},
		{
			name: "no scheme",
			args: args{
				rawurl: "domain.com",
			},
			wantScheme: "",
			wantPath:   "domain.com",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			gotScheme, gotPath := getScheme(tt.args.rawurl)
			assert.Equalf(t, tt.wantScheme, gotScheme, "getScheme(%v)", tt.args.rawurl)
			assert.Equalf(t, tt.wantPath, gotPath, "getScheme(%v)", tt.args.rawurl)
		})
	}
}

func Test_splitSpecial(t *testing.T) {
	type args struct {
		s            string
		delimiter    string
		cutdelimiter bool
	}
	tests := []struct {
		name  string
		args  args
		want  string
		want1 string
	}{
		{
			name: "Expected",
			args: args{
				s:            "[s , s]",
				delimiter:    ",",
				cutdelimiter: false,
			},
			want:  "[s ",
			want1: ", s]",
		},
		{
			name: "no delimited",
			args: args{
				s:            "[s s]",
				delimiter:    "",
				cutdelimiter: false,
			},
			want:  "",
			want1: "[s s]",
		},
		{
			name: "Expected not delim",
			args: args{
				s:            "[s , s]",
				delimiter:    ",",
				cutdelimiter: true,
			},
			want:  "[s ",
			want1: " s]",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got, got1 := splitSpecial(tt.args.s, tt.args.delimiter, tt.args.cutdelimiter)
			assert.Equalf(t, tt.want, got, "splitSpecial(%v, %v, %v)", tt.args.s, tt.args.delimiter, tt.args.cutdelimiter)
			assert.Equalf(t, tt.want1, got1, "splitSpecial(%v, %v, %v)", tt.args.s, tt.args.delimiter, tt.args.cutdelimiter)
		})
	}
}

func Test_getHost(t *testing.T) {
	type args struct {
		authority string
	}
	tests := []struct {
		name     string
		args     args
		wantHost string
	}{
		{
			name: "Expected",
			args: args{
				authority: "username@domain.com",
			},
			wantHost: "",
		},
		{
			name: "Expected 2",
			args: args{
				authority: "domain.com",
			},
			wantHost: "domain.com",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			assert.Equalf(t, tt.wantHost, getHost(tt.args.authority), "getHost(%v)", tt.args.authority)
		})
	}
}

func Test_newClientURL(t *testing.T) {
	type args struct {
		urlStr string
	}
	tests := []struct {
		name string
		args args
		want mc.ClientURL
	}{
		{
			name: "Expected",
			args: args{
				urlStr: "http://domain.com",
			},
			want: mc.ClientURL{
				Type:            0,
				Scheme:          "http",
				Host:            "domain.com",
				Path:            "/",
				SchemeSeparator: "://",
				Separator:       47,
			},
		},
		{
			name: "Expected file",
			args: args{
				urlStr: "file.jpeg",
			},
			want: mc.ClientURL{
				Type:      fileSystem,
				Path:      "file.jpeg",
				Separator: filepath.Separator,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			assert.Equalf(t, tt.want, *newClientURL(tt.args.urlStr), "newClientURL(%v)", tt.args.urlStr)
		})
	}
}

func Test_getMultipleFilesDownloadResponse(t *testing.T) {
	type args struct {
		session *models.Principal
		params  object.DownloadMultipleObjectsParams
	}

	tests := []struct {
		name  string
		args  args
		want  middleware.Responder
		want1 *CodedAPIError
	}{
		{
			name: "test no objects sent for download",
			args: args{
				session: nil,
				params: object.DownloadMultipleObjectsParams{
					HTTPRequest: &http.Request{},
					BucketName:  "test-bucket",
					ObjectList:  nil,
				},
			},
			want:  nil,
			want1: nil,
		},
		{
			name: "few objects sent for download",
			args: args{
				session: nil,
				params: object.DownloadMultipleObjectsParams{
					HTTPRequest: &http.Request{},
					BucketName:  "test-bucket",
					ObjectList:  []string{"test.txt", ",y-obj.doc", "z-obj.png"},
				},
			},
			want:  nil,
			want1: nil,
		},
		{
			name: "few prefixes and a file sent for download",
			args: args{
				session: nil,
				params: object.DownloadMultipleObjectsParams{
					HTTPRequest: &http.Request{},
					BucketName:  "test-bucket",
					ObjectList:  []string{"my-folder/", "my-folder/test-nested", "z-obj.png"},
				},
			},
			want:  nil,
			want1: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got, got1 := getMultipleFilesDownloadResponse(tt.args.session, tt.args.params)
			assert.Equal(t, tt.want1, got1)
			assert.NotNil(t, got)
		})
	}
}

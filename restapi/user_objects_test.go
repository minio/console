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
	"encoding/json"
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7"
)

var minioListObjectsMock func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo

// mock function of listObjects() needed for list objects

func (ac minioClientMock) listObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	return minioListObjectsMock(ctx, bucket, opts)
}

func Test_listObjects(t *testing.T) {
	ctx := context.Background()
	t1 := time.Now()
	minClient := minioClientMock{}
	type args struct {
		bucketName string
		prefix     string
		recursive  bool
		listFunc   func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
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
				bucketName: "bucket1",
				prefix:     "prefix",
				recursive:  true,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							minio.ObjectInfo{
								Key:          "obj1",
								LastModified: t1,
								Size:         int64(1024),
								ContentType:  "content",
							},
							minio.ObjectInfo{
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
			},
			expectedResp: []*models.BucketObject{
				&models.BucketObject{
					Name:         "obj1",
					LastModified: t1.String(),
					Size:         int64(1024),
					ContentType:  "content",
				}, &models.BucketObject{
					Name:         "obj2",
					LastModified: t1.String(),
					Size:         int64(512),
					ContentType:  "content",
				},
			},
			wantError: nil,
		},
		{
			test: "Return zero objects",
			args: args{
				bucketName: "bucket1",
				prefix:     "prefix",
				recursive:  true,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					defer close(objectStatCh)
					return objectStatCh
				},
			},
			expectedResp: nil,
			wantError:    nil,
		},
		{
			test: "Handle error if present on object",
			args: args{
				bucketName: "bucket1",
				prefix:     "prefix",
				recursive:  true,
				listFunc: func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
					objectStatCh := make(chan minio.ObjectInfo, 1)
					go func(objectStatCh chan<- minio.ObjectInfo) {
						defer close(objectStatCh)
						for _, bucket := range []minio.ObjectInfo{
							minio.ObjectInfo{
								Key:          "obj2",
								LastModified: t1,
								Size:         int64(512),
								ContentType:  "content",
							},
							minio.ObjectInfo{
								Err: errors.New("error here"),
							},
						} {
							objectStatCh <- bucket
						}
					}(objectStatCh)
					return objectStatCh
				},
			},
			expectedResp: nil,
			wantError:    errors.New("error here"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(t *testing.T) {
			minioListObjectsMock = tt.args.listFunc
			resp, err := listBucketObjects(ctx, minClient, tt.args.bucketName, tt.args.prefix, tt.args.recursive)
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

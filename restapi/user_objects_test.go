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
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
)

var minioListObjectsMock func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
var mcListMock func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
var mcRemoveMock func(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error

// mock function of listObjects() needed for list objects
func (ac minioClientMock) listObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	return minioListObjectsMock(ctx, bucket, opts)
}

// implements mc.S3Client.List()
func (c s3ClientMock) list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
	return mcListMock(ctx, opts)
}

// implements mc.S3Client.Remove()
func (c s3ClientMock) remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
	return mcRemoveMock(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
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

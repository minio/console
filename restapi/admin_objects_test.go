// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
	"testing"
	"time"

	"github.com/minio/console/models"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/minio-go/v7"
	"github.com/stretchr/testify/assert"
)

func TestWSRewindObjects(t *testing.T) {
	assert := assert.New(t)
	client := s3ClientMock{}
	mockWSConn := mockConn{}

	tests := []struct {
		name         string
		wantErr      bool
		testOptions  rewindListOpts
		testMessages []*mc.ClientContent
	}{
		{
			name:    "Get list with multiple elements",
			wantErr: false,
			testOptions: rewindListOpts{
				BucketName: "buckettest",
				Prefix:     "/",
				Date:       time.Now(),
			},
			testMessages: []*mc.ClientContent{
				{
					BucketName: "buckettest",
					URL:        mc.ClientURL{Path: "/file1.txt"},
				},
				{
					BucketName: "buckettest",
					URL:        mc.ClientURL{Path: "/file2.txt"},
				},
				{
					BucketName: "buckettest",
					URL:        mc.ClientURL{Path: "/path1"},
				},
			},
		},
		{
			name:    "Empty list of elements",
			wantErr: false,
			testOptions: rewindListOpts{
				BucketName: "emptybucket",
				Prefix:     "/",
				Date:       time.Now(),
			},
			testMessages: []*mc.ClientContent{},
		},
		{
			name:    "Get list with one element",
			wantErr: false,
			testOptions: rewindListOpts{
				BucketName: "buckettest",
				Prefix:     "/",
				Date:       time.Now(),
			},
			testMessages: []*mc.ClientContent{
				{
					BucketName: "buckettestsingle",
					URL:        mc.ClientURL{Path: "/file12.txt"},
				},
			},
		},
		{
			name:    "Get data from subpaths",
			wantErr: false,
			testOptions: rewindListOpts{
				BucketName: "buckettest",
				Prefix:     "/path1/path2",
				Date:       time.Now(),
			},
			testMessages: []*mc.ClientContent{
				{
					BucketName: "buckettestsingle",
					URL:        mc.ClientURL{Path: "/path1/path2/file12.txt"},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			testReceiver := make(chan models.RewindItem, len(tt.testMessages))

			mcListMock = func(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
				ch := make(chan *mc.ClientContent)
				go func() {
					defer close(ch)
					for _, m := range tt.testMessages {
						ch <- m
					}
				}()
				return ch
			}

			// mock connection WriteMessage() no error
			connWriteMessageMock = func(messageType int, data []byte) error {
				// emulate that receiver gets the message written
				var t models.RewindItem

				_ = json.Unmarshal(data, &t)

				testReceiver <- t
				return nil
			}

			if err := startRewindListing(ctx, mockWSConn, client, &tt.testOptions); err != nil && !tt.wantErr {
				t.Errorf("Failed on startRewindListing:, error occurred: %s", err.Error())
			}

			close(testReceiver)

			// check that the TestReceiver got the same number of data from Console.
			if !tt.wantErr {
				totalItems := 0
				for data := range testReceiver {
					// Compare elements as we are defining the channel responses
					assert.Equal(tt.testMessages[totalItems].URL.Path, data.Name)
					totalItems++
				}
				assert.Equal(len(tt.testMessages), totalItems)
			}
		})
	}
}

func TestWSListObjects(t *testing.T) {
	assert := assert.New(t)
	client := minioClientMock{}
	mockWSConn := mockConn{}

	tests := []struct {
		name         string
		wantErr      bool
		testOptions  objectsListOpts
		testMessages []minio.ObjectInfo
	}{
		{
			name:    "Get list with multiple elements",
			wantErr: false,
			testOptions: objectsListOpts{
				BucketName: "buckettest",
				Prefix:     "/",
			},
			testMessages: []minio.ObjectInfo{
				{
					Key:          "/file1.txt",
					Size:         500,
					IsLatest:     true,
					LastModified: time.Now(),
				},
				{
					Key:          "/file2.txt",
					Size:         500,
					IsLatest:     true,
					LastModified: time.Now(),
				},
				{
					Key: "/path1",
				},
			},
		},
		{
			name:    "Empty list of elements",
			wantErr: false,
			testOptions: objectsListOpts{
				BucketName: "emptybucket",
				Prefix:     "/",
			},
			testMessages: []minio.ObjectInfo{},
		},
		{
			name:    "Get list with one element",
			wantErr: false,
			testOptions: objectsListOpts{
				BucketName: "buckettest",
				Prefix:     "/",
			},
			testMessages: []minio.ObjectInfo{
				{
					Key:          "/file2.txt",
					Size:         500,
					IsLatest:     true,
					LastModified: time.Now(),
				},
			},
		},
		{
			name:    "Get data from subpaths",
			wantErr: false,
			testOptions: objectsListOpts{
				BucketName: "buckettest",
				Prefix:     "/path1/path2",
			},
			testMessages: []minio.ObjectInfo{
				{
					Key:          "/path1/path2/file1.txt",
					Size:         500,
					IsLatest:     true,
					LastModified: time.Now(),
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			testReceiver := make(chan models.BucketObject, len(tt.testMessages))

			minioListObjectsMock = func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
				ch := make(chan minio.ObjectInfo)
				go func() {
					defer close(ch)
					for _, m := range tt.testMessages {
						ch <- m
					}
				}()
				return ch
			}

			// mock connection WriteMessage() no error
			connWriteMessageMock = func(messageType int, data []byte) error {
				// emulate that receiver gets the message written
				var t models.BucketObject

				_ = json.Unmarshal(data, &t)

				testReceiver <- t
				return nil
			}

			if err := startObjectsListing(ctx, mockWSConn, client, &tt.testOptions); err != nil && !tt.wantErr {
				t.Errorf("Failed on startRewindListing:, error occurred: %s", err.Error())
			}

			close(testReceiver)

			// check that the TestReceiver got the same number of data from Console.
			if !tt.wantErr {
				totalItems := 0
				for data := range testReceiver {
					// Compare elements as we are defining the channel responses
					assert.Equal(tt.testMessages[totalItems].Key, data.Name)
					totalItems++
				}
				assert.Equal(len(tt.testMessages), totalItems)
			}
		})
	}
}

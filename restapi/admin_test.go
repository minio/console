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

	"github.com/minio/minio/pkg/madmin"
)

// Define a mock struct of Admin Client interface implementation
type adminClientMock struct{}

// Common mocks

// assigning mock at runtime instead of compile time
var minioServerInfoMock func(ctx context.Context) (madmin.InfoMessage, error)

// mock function of serverInfo()
func (ac adminClientMock) serverInfo(ctx context.Context) (madmin.InfoMessage, error) {
	return minioServerInfoMock(ctx)
}

func (ac adminClientMock) listRemoteBuckets(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error) {
	return nil, nil
}
func (ac adminClientMock) getRemoteBucket(ctx context.Context, bucket, arnType string) (targets *madmin.BucketTarget, err error) {
	return nil, nil
}
func (ac adminClientMock) removeRemoteBucket(ctx context.Context, bucket, arn string) error {
	return nil
}
func (ac adminClientMock) addRemoteBucket(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error) {
	return "", nil
}

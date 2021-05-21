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
	"testing"

	"github.com/minio/madmin-go"
	asrt "github.com/stretchr/testify/assert"
)

func TestAdminInfo(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	// Test-1 : getAdminInfo() returns proper information
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{
			Buckets: madmin.Buckets{Count: 10},
			Objects: madmin.Objects{Count: 10},
			Usage:   madmin.Usage{Size: 10},
		}, nil
	}
	ctx := context.Background()
	serverInfo, err := getAdminInfo(ctx, adminClient)
	assert.NotNil(serverInfo, "server info was returned nil")
	if serverInfo != nil {
		var actual64 int64 = 10
		assert.Equal(serverInfo.Buckets, actual64, "Incorrect bucket count")
		assert.Equal(serverInfo.Objects, actual64, "Incorrect object count")
		assert.Equal(serverInfo.Usage, actual64, "Incorrect usage size")
	}
	assert.Nil(err, "Error should have been nil")

	// Test-2 : getAdminInfo(ctx) fails for whatever reason
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{}, errors.New("some reason")
	}

	serverInfo, err = getAdminInfo(ctx, adminClient)
	assert.Nil(serverInfo, "server info was not returned nil")
	assert.NotNil(err, "An error should have ben returned")

}

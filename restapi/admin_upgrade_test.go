// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"fmt"
	"testing"

	"github.com/minio/madmin-go/v2"
	"github.com/stretchr/testify/assert"
)

func TestAdminUpgrade(t *testing.T) {
	assert := assert.New(t)
	adminClient := AdminClientMock{}
	function := "startTraceInfo(ctx, )"
	originVersion := "2022-01-04T12-45-32Z"
	updatedVersion := "2023-02-21T11-51-15Z"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Test-1: Service updated MinIO successfully
	minioServerUpdateMock = func(ctx context.Context, urlUpdate string) (madmin.ServerUpdateStatus, error) {
		return madmin.ServerUpdateStatus{UpdatedVersion: updatedVersion, CurrentVersion: originVersion}, nil
	}

	updated, err := upgradeInstance(ctx, adminClient, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// check that the upgradeInstance returned the correct information
	assert.Equal(updated.UpdatedVersion, updatedVersion)
	assert.Equal(updated.CurrentVersion, originVersion)

	// Test-2: Service failed to update MinIO
	minioServerUpdateMock = func(ctx context.Context, urlUpdate string) (madmin.ServerUpdateStatus, error) {
		return madmin.ServerUpdateStatus{}, fmt.Errorf("error updating server")
	}

	updated, err = upgradeInstance(ctx, adminClient, "")

	if assert.Error(err) {
		assert.Equal("error updating server", err.Error())
	}

	// Test-3: No extra errors happen with custom URL
	minioServerUpdateMock = func(ctx context.Context, urlUpdate string) (madmin.ServerUpdateStatus, error) {
		return madmin.ServerUpdateStatus{UpdatedVersion: updatedVersion, CurrentVersion: originVersion}, nil
	}

	updated, err = upgradeInstance(ctx, adminClient, "http://custom-url.com")

	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// check that the upgradeInstance returned the correct information
	assert.Equal(updated.UpdatedVersion, updatedVersion)
	assert.Equal(updated.CurrentVersion, originVersion)
}

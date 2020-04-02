// This file is part of MinIO Kubernetes Cloud
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
	"testing"

	"errors"

	"github.com/minio/minio/pkg/madmin"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioServiceRestartMock func(ctx context.Context) error
var minioServerInfoMock func(ctx context.Context) (madmin.InfoMessage, error)

// mock function of serviceRestart()
func (ac adminClientMock) serviceRestart(ctx context.Context) error {
	return minioServiceRestartMock(ctx)
}

// mock function of serverInfo()
func (ac adminClientMock) serverInfo(ctx context.Context) (madmin.InfoMessage, error) {
	return minioServerInfoMock(ctx)
}

func TestServiceRestart(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	ctx := context.Background()
	function := "serviceRestart()"
	// Test-1 : serviceRestart() restart services no error
	// mock function response from listGroups()
	minioServiceRestartMock = func(ctx context.Context) error {
		return nil
	}
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{}, nil
	}
	if err := serviceRestart(ctx, adminClient); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2 : serviceRestart() returns error on client.serviceRestart call
	// and see that the error is handled correctly and returned
	minioServiceRestartMock = func(ctx context.Context) error {
		return errors.New("error")
	}
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{}, nil
	}
	if err := serviceRestart(ctx, adminClient); assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-3 : serviceRestart() returns error on client.serverInfo() call
	// and see that the error is handled correctly and returned
	minioServiceRestartMock = func(ctx context.Context) error {
		return nil
	}
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{}, errors.New("error on server info")
	}
	if err := serviceRestart(ctx, adminClient); assert.Error(err) {
		assert.Equal("error on server info", err.Error())
	}
}

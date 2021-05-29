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

	"github.com/minio/minio/pkg/madmin"
	asrt "github.com/stretchr/testify/assert"
)

func TestArnsList(t *testing.T) {
	assert := asrt.New(t)
	adminClient := adminClientMock{}
	// Test-1 : getArns() returns proper arn list
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{
			SQSARN: []string{"uno"},
		}, nil
	}
	ctx := context.Background()
	arnsList, err := getArns(ctx, adminClient)
	assert.NotNil(arnsList, "arn list was returned nil")
	if arnsList != nil {
		assert.Equal(len(arnsList.Arns), 1, "Incorrect arns count")
	}
	assert.Nil(err, "Error should have been nil")

	// Test-2 : getArns(ctx) fails for whatever reason
	minioServerInfoMock = func(ctx context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{}, errors.New("some reason")
	}

	arnsList, err = getArns(ctx, adminClient)
	assert.Nil(arnsList, "arn list was not returned nil")
	assert.NotNil(err, "An error should have been returned")

}

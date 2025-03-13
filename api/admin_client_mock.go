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

package api

import (
	"context"

	"github.com/minio/madmin-go/v3"
)

type AdminClientMock struct {
	minioAccountInfoMock func(ctx context.Context) (madmin.AccountInfo, error)
}

func (ac AdminClientMock) kmsStatus(_ context.Context) (madmin.KMSStatus, error) {
	return madmin.KMSStatus{Name: "name", DefaultKeyID: "key", Endpoints: map[string]madmin.ItemState{"localhost": madmin.ItemState("online")}}, nil
}

func (ac AdminClientMock) AccountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return ac.minioAccountInfoMock(ctx)
}

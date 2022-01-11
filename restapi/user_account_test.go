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

	"github.com/minio/console/models"
)

var minioChangePasswordMock func(ctx context.Context, accessKey, secretKey string) error

func Test_changePassword(t *testing.T) {
	client := adminClientMock{}
	type args struct {
		ctx              context.Context
		client           adminClientMock
		session          *models.Principal
		currentSecretKey string
		newSecretKey     string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
		mock    func()
	}{
		{
			name: "password changed successfully",
			args: args{
				client: client,
				ctx:    context.Background(),
				session: &models.Principal{
					AccountAccessKey: "TESTTEST",
				},
				currentSecretKey: "TESTTEST",
				newSecretKey:     "TESTTEST2",
			},
			mock: func() {
				minioChangePasswordMock = func(ctx context.Context, accessKey, secretKey string) error {
					return nil
				}
			},
		},
		{
			name: "error when changing password",
			args: args{
				client: client,
				ctx:    context.Background(),
				session: &models.Principal{
					AccountAccessKey: "TESTTEST",
				},
				currentSecretKey: "TESTTEST",
				newSecretKey:     "TESTTEST2",
			},
			mock: func() {
				minioChangePasswordMock = func(ctx context.Context, accessKey, secretKey string) error {
					return errors.New("there was an error, please try again")
				}
			},
			wantErr: true,
		},
		{
			name: "error because current password doesn't match",
			args: args{
				client: client,
				ctx:    context.Background(),
				session: &models.Principal{
					AccountAccessKey: "TESTTEST",
				},
				currentSecretKey: "TESTTEST",
				newSecretKey:     "TESTTEST2",
			},
			mock: func() {
				minioChangePasswordMock = func(ctx context.Context, accessKey, secretKey string) error {
					return errors.New("there was an error, please try again")
				}
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mock != nil {
				tt.mock()
			}
			if err := changePassword(tt.args.ctx, tt.args.client, tt.args.session, tt.args.newSecretKey); (err != nil) != tt.wantErr {
				t.Errorf("changePassword() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

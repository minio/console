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
	"encoding/json"
	"errors"
	"testing"

	iampolicy "github.com/minio/minio/pkg/iam/policy"

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

func Test_useCanDo(t *testing.T) {
	type args struct {
		arg        iampolicy.Args
		userPolicy string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "Create Bucket",
			args: args{
				arg: iampolicy.Args{
					Action: "s3:CreateBucket",
				},
				userPolicy: `{
								"Version": "2012-10-17",
								"Statement": [
									{
										"Effect": "Allow",
										"Action": [
											"admin:*"
										]
									},
									{
										"Effect": "Allow",
										"Action": [
											"s3:*"
										],
										"Resource": [
											"arn:aws:s3:::*"
										]
									}
								]
							}`,
			},
			want: true,
		},
		{
			name: "Create Bucket, No Admin",
			args: args{
				arg: iampolicy.Args{
					Action: "s3:CreateBucket",
				},
				userPolicy: `{
								"Version": "2012-10-17",
								"Statement": [
									{
										"Effect": "Allow",
										"Action": [
											"s3:*"
										],
										"Resource": [
											"arn:aws:s3:::*"
										]
									}
								]
							}`,
			},
			want: true,
		},
		{
			name: "Create Bucket, By Prefix",
			args: args{
				arg: iampolicy.Args{
					Action: "s3:CreateBucket",
				},
				userPolicy: `{
							 "Version": "2012-10-17",
							 "Statement": [
							  {
							   "Effect": "Allow",
							   "Action": [
								"s3:*"
							   ],
							   "Resource": [
								"arn:aws:s3:::bucket1"
							   ]
							  }
							 ]
							}`,
			},
			want: false,
		},
		{
			name: "Create Bucket, With Bucket Name",
			args: args{
				arg: iampolicy.Args{
					Action:     "s3:CreateBucket",
					BucketName: "bucket2",
				},
				userPolicy: `{
							 "Version": "2012-10-17",
							 "Statement": [
							  {
							   "Effect": "Allow",
							   "Action": [
								"s3:*"
							   ],
							   "Resource": [
								"arn:aws:s3:::bucket1"
							   ]
							  }
							 ]
							}`,
			},
			want: false,
		},
		{
			name: "Can't Create Bucket",
			args: args{
				arg: iampolicy.Args{
					Action:     "s3:CreateBucket",
					BucketName: "bucket2",
				},
				userPolicy: `{
							"Version": "2012-10-17",
							"Statement": [
								{
									"Sid": "VisualEditor1",
									"Effect": "Allow",
									"Action": "s3:ListBucket",
									"Resource": [
										"arn:aws:s3:::bucket1",
										"arn:aws:s3:::bucket1/*",
										"arn:aws:s3:::lkasdkljasd090901",
										"arn:aws:s3:::lkasdkljasd090901/*"
										]
								}
							]
						}`,
			},
			want: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var pol iampolicy.Policy
			if err := json.Unmarshal([]byte(tt.args.userPolicy), &pol); err != nil {
				t.Errorf("Policy can't be parsed: %s", err)
			}
			if got := userCanDo(tt.args.arg, &pol); got != tt.want {
				t.Errorf("userCanDo() = %v, want %v", got, tt.want)
			}
		})
	}
}

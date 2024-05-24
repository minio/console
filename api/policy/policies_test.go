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

package policy

import (
	"bytes"
	"reflect"
	"testing"

	"github.com/minio/madmin-go/v3"
	minioIAMPolicy "github.com/minio/pkg/v3/policy"
)

func TestReplacePolicyVariables(t *testing.T) {
	type args struct {
		claims      map[string]interface{}
		accountInfo *madmin.AccountInfo
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		{
			name: "Bad Policy",
			args: args{
				claims: nil,
				accountInfo: &madmin.AccountInfo{
					AccountName: "test",
					Server:      madmin.BackendInfo{},
					Policy:      []byte(""),
					Buckets:     nil,
				},
			},
			want:    "",
			wantErr: true,
		},
		{
			name: "Replace basic AWS",
			args: args{
				claims: nil,
				accountInfo: &madmin.AccountInfo{
					AccountName: "test",
					Server:      madmin.BackendInfo{},
					Policy: []byte(`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${aws:username}",
        "arn:aws:s3:::${aws:userid}"
      ]
    }
  ]
}`),
					Buckets: nil,
				},
			},
			want: `{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                "s3:ListBucket"
              ],
              "Resource": [
                "arn:aws:s3:::test",
                "arn:aws:s3:::test"
              ]
            }
          ]
        }`,
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got := ReplacePolicyVariables(tt.args.claims, tt.args.accountInfo)
			policy, err := minioIAMPolicy.ParseConfig(bytes.NewReader(got))
			if (err != nil) != tt.wantErr {
				t.Errorf("ReplacePolicyVariables() error = %v, wantErr %v", err, tt.wantErr)
			}
			wantPolicy, err := minioIAMPolicy.ParseConfig(bytes.NewReader([]byte(tt.want)))
			if (err != nil) != tt.wantErr {
				t.Errorf("ReplacePolicyVariables() error = %v, wantErr %v", err, tt.wantErr)
			}
			if !reflect.DeepEqual(policy, wantPolicy) {
				t.Errorf("ReplacePolicyVariables() = %s, want %v", got, tt.want)
			}
		})
	}
}

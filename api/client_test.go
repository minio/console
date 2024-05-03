// This file is part of MinIO Console Server
// Copyright (c) 2024 MinIO, Inc.
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

import "testing"

func Test_computeObjectURLWithoutEncode(t *testing.T) {
	type args struct {
		bucketName string
		prefix     string
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		{
			name: "http://localhost:9000/bucket-1/小飼弾小飼弾小飼弾.jp",
			args: args{
				bucketName: "bucket-1",
				prefix:     "小飼弾小飼弾小飼弾.jpg",
			},
			want:    "http://localhost:9000/bucket-1/小飼弾小飼弾小飼弾.jpg",
			wantErr: false,
		},
		{
			name: "http://localhost:9000/bucket-1/a a - a a & a a - a a a.jpg",
			args: args{
				bucketName: "bucket-1",
				prefix:     "a a - a a & a a - a a a.jpg",
			},
			want:    "http://localhost:9000/bucket-1/a a - a a & a a - a a a.jpg",
			wantErr: false,
		},
		{
			name: "http://localhost:9000/bucket-1/02%20-%20FLY%20ME%20TO%20THE%20MOON%20.jpg",
			args: args{
				bucketName: "bucket-1",
				prefix:     "02%20-%20FLY%20ME%20TO%20THE%20MOON%20.jpg",
			},
			want:    "http://localhost:9000/bucket-1/02%20-%20FLY%20ME%20TO%20THE%20MOON%20.jpg",
			wantErr: false,
		},
		{
			name: "http://localhost:9000/bucket-1/!@#$%^&*()_+.jpg",
			args: args{
				bucketName: "bucket-1",
				prefix:     "!@#$%^&*()_+.jpg",
			},
			want:    "http://localhost:9000/bucket-1/!@#$%^&*()_+.jpg",
			wantErr: false,
		},
		{
			name: "http://localhost:9000/bucket-1/test/test2/小飼弾小飼弾小飼弾.jpg",
			args: args{
				bucketName: "bucket-1",
				prefix:     "test/test2/小飼弾小飼弾小飼弾.jpg",
			},
			want:    "http://localhost:9000/bucket-1/test/test2/小飼弾小飼弾小飼弾.jpg",
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got, err := computeObjectURLWithoutEncode(tt.args.bucketName, tt.args.prefix)
			if (err != nil) != tt.wantErr {
				t.Errorf("computeObjectURLWithoutEncode() errors = %v, wantErr %v", err, tt.wantErr)
			}
			if err == nil {
				if got != tt.want {
					t.Errorf("computeObjectURLWithoutEncode() got = %v, want %v", got, tt.want)
				}
			}
		})
	}
}

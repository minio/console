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

package subnet

import (
	"reflect"
	"testing"

	"github.com/minio/minio/pkg/licverifier"
)

func TestGetLicenseInfoFromJWT(t *testing.T) {
	license := "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I"
	publicKeys := []string{`-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEbo+e1wpBY4tBq9AONKww3Kq7m6QP/TBQ
mr/cKCUyBL7rcAvg0zNq1vcSrUSGlAmY3SEDCu3GOKnjG/U4E7+p957ocWSV+mQU
9NKlTdQFGF3+aO6jbQ4hX/S5qPyF+a3z
-----END PUBLIC KEY-----`}

	mockLicense, _ := GetLicenseInfoFromJWT(license, publicKeys)

	type args struct {
		license    string
		publicKeys []string
	}
	tests := []struct {
		name    string
		args    args
		want    *licverifier.LicenseInfo
		wantErr bool
	}{
		{
			name: "error because missing license",
			args: args{
				license:    "",
				publicKeys: OfflinePublicKeys,
			},
			wantErr: true,
		},
		{
			name: "error because invalid license",
			args: args{
				license:    "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I",
				publicKeys: []string{"eaeaeae"},
			},
			wantErr: true,
		},
		{
			name: "license successfully verified",
			args: args{
				license: "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZW5pbitjMUBtaW5pby5pbyIsInRlYW1OYW1lIjoiY29uc29sZS1jdXN0b21lciIsImV4cCI6MS42Mzk5NTI2MTE2MDkxNDQ3MzJlOSwiaXNzIjoic3VibmV0QG1pbmlvLmlvIiwiY2FwYWNpdHkiOjI1LCJpYXQiOjEuNjA4NDE2NjExNjA5MTQ0NzMyZTksImFjY291bnRJZCI6MTc2LCJzZXJ2aWNlVHlwZSI6IlNUQU5EQVJEIn0.ndtf8V_FJTvhXeemVLlORyDev6RJaSPhZ2djkMVK9SvXD0srR_qlYJATPjC4NljkS71nXMGVDov5uCTuUL97x6FGQEKDruA-z24x_2Zr8kof4LfBb3HUHudCR8QvE--I",
				publicKeys: []string{`-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEbo+e1wpBY4tBq9AONKww3Kq7m6QP/TBQ
mr/cKCUyBL7rcAvg0zNq1vcSrUSGlAmY3SEDCu3GOKnjG/U4E7+p957ocWSV+mQU
9NKlTdQFGF3+aO6jbQ4hX/S5qPyF+a3z
-----END PUBLIC KEY-----`},
			},
			wantErr: false,
			want:    mockLicense,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetLicenseInfoFromJWT(tt.args.license, tt.args.publicKeys)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetLicenseInfoFromJWT() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetLicenseInfoFromJWT() got = %v, want %v", got, tt.want)
			}
		})
	}
}

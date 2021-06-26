// This file is part of MinIO Console
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

// +build operator

package acl

import (
	"reflect"
	"testing"
)

func validateEndpoints(t *testing.T, configs []endpoint) {
	for _, tt := range configs {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetAuthorizedEndpoints(tt.args.actions); !reflect.DeepEqual(len(got), tt.want) {
				t.Errorf("GetAuthorizedEndpoints() = %v, want %v", len(got), tt.want)
			}
		})
	}
}

func TestOperatorOnlyEndpoints(t *testing.T) {
	tests := []endpoint{
		{
			name: "Operator Only - all admin endpoints",
			args: args{
				[]string{
					"admin:*",
				},
			},
			want: 13,
		},
		{
			name: "Operator Only - all s3 endpoints",
			args: args{
				[]string{
					"s3:*",
				},
			},
			want: 13,
		},
		{
			name: "Operator Only - all admin and s3 endpoints",
			args: args{
				[]string{
					"admin:*",
					"s3:*",
				},
			},
			want: 13,
		},
		{
			name: "Operator Only - default endpoints",
			args: args{
				[]string{},
			},
			want: 13,
		},
	}

	validateEndpoints(t, tests)
}

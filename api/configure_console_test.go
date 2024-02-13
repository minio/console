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

package api

import (
	"os"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_parseSubPath(t *testing.T) {
	type args struct {
		v string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "Empty",
			args: args{
				v: "",
			},
			want: "/",
		},
		{
			name: "Slash",
			args: args{
				v: "/",
			},
			want: "/",
		},
		{
			name: "Double Slash",
			args: args{
				v: "//",
			},
			want: "/",
		},
		{
			name: "No slashes",
			args: args{
				v: "route",
			},
			want: "/route/",
		},
		{
			name: "No trailing slashes",
			args: args{
				v: "/route",
			},
			want: "/route/",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			assert.Equalf(t, tt.want, parseSubPath(tt.args.v), "parseSubPath(%v)", tt.args.v)
		})
	}
}

func Test_getSubPath(t *testing.T) {
	type args struct {
		envValue string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "Empty",
			args: args{
				envValue: "",
			},
			want: "/",
		},
		{
			name: "Slash",
			args: args{
				envValue: "/",
			},
			want: "/",
		},
		{
			name: "Valid Value",
			args: args{
				envValue: "/subpath/",
			},
			want: "/subpath/",
		},
		{
			name: "No starting slash",
			args: args{
				envValue: "subpath/",
			},
			want: "/subpath/",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			t.Setenv(SubPath, tt.args.envValue)
			defer os.Unsetenv(SubPath)
			subPathOnce = sync.Once{}
			assert.Equalf(t, tt.want, getSubPath(), "getSubPath()")
		})
	}
}

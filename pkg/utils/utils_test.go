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

package utils

import (
	"context"
	"net/url"
	"testing"
)

func TestDecodeInput(t *testing.T) {
	type args struct {
		s string
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		{
			name: "chinese characters",
			args: args{
				s: "%E5%B0%8F%E9%A3%BC%E5%BC%BE%E5%B0%8F%E9%A3%BC%E5%BC%BE%E5%B0%8F%E9%A3%BC%E5%BC%BE%2F%E5%B0%8F%E9%A3%BC%E5%BC%BE%E5%B0%8F%E9%A3%BC%E5%BC%BE%E5%B0%8F%E9%A3%BC%E5%BC%BE",
			},
			want:    "小飼弾小飼弾小飼弾/小飼弾小飼弾小飼弾",
			wantErr: false,
		},
		{
			name: "spaces and & symbol",
			args: args{
				s: "a%20a%20-%20a%20a%20%26%20a%20a%20-%20a%20a%20a",
			},
			want:    "a a - a a & a a - a a a",
			wantErr: false,
		},
		{
			name: "the infamous fly me to the moon",
			args: args{
				s: "02%2520-%2520FLY%2520ME%2520TO%2520THE%2520MOON%2520",
			},
			want:    "02%20-%20FLY%20ME%20TO%20THE%20MOON%20",
			wantErr: false,
		},
		{
			name: "random symbols",
			args: args{
				s: "!%40%23%24%25%5E%26*()_%2B",
			},
			want:    "!@#$%^&*()_+",
			wantErr: false,
		},
		{
			name: "name with / symbols",
			args: args{
				s: "test%2Ftest2%2F%E5%B0%8F%E9%A3%BC%E5%BC%BE%E5%B0%8F%E9%A3%BC%E5%BC%BE%E5%B0%8F%E9%A3%BC%E5%BC%BE.jpg",
			},
			want:    "test/test2/小飼弾小飼弾小飼弾.jpg",
			wantErr: false,
		},
		{
			name: "decoding fails",
			args: args{
				s: "%%this should fail%%",
			},
			want:    "",
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got, err := url.QueryUnescape(tt.args.s)
			if (err != nil) != tt.wantErr {
				t.Errorf("DecodeBase64() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("DecodeBase64() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestClientIPFromContext(t *testing.T) {
	type args struct {
		ctx context.Context
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "working return",
			args: args{
				ctx: context.Background(),
			},
			want: "127.0.0.1",
		},
		{
			name: "context contains ip",
			args: args{
				ctx: context.WithValue(context.Background(), ContextClientIP, "10.0.0.1"),
			},
			want: "10.0.0.1",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if got := ClientIPFromContext(tt.args.ctx); got != tt.want {
				t.Errorf("ClientIPFromContext() = %v, want %v", got, tt.want)
			}
		})
	}
}

// This file is part of MinIO Orchestrator
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

package acl

import (
	"reflect"
	"testing"

	iampolicy "github.com/minio/minio/pkg/iam/policy"
)

type args struct {
	actions []string
}

type endpoint struct {
	name string
	args args
	want int
}

func validateEndpoints(t *testing.T, configs []endpoint) {
	for _, tt := range configs {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetAuthorizedEndpoints(tt.args.actions); !reflect.DeepEqual(len(got), tt.want) {
				t.Errorf("GetAuthorizedEndpoints() = %v, want %v", len(got), tt.want)
			}
		})
	}
}

func TestGetAuthorizedEndpoints(t *testing.T) {
	tests := []endpoint{
		{
			name: "dashboard endpoint",
			args: args{
				[]string{"admin:ServerInfo"},
			},
			want: 6,
		},
		{
			name: "policies endpoint",
			args: args{
				[]string{
					"admin:CreatePolicy",
					"admin:DeletePolicy",
					"admin:GetPolicy",
					"admin:AttachUserOrGroupPolicy",
					"admin:ListUserPolicies",
				},
			},
			want: 6,
		},
		{
			name: "all admin endpoints",
			args: args{
				[]string{
					"admin:*",
				},
			},
			want: 17,
		},
		{
			name: "all s3 endpoints",
			args: args{
				[]string{
					"s3:*",
				},
			},
			want: 8,
		},
		{
			name: "all admin and s3 endpoints",
			args: args{
				[]string{
					"admin:*",
					"s3:*",
				},
			},
			want: 20,
		},
		{
			name: "no endpoints",
			args: args{
				[]string{},
			},
			want: 0,
		},
	}

	validateEndpoints(t, tests)
}

func TestOperatorOnlyEndpoints(t *testing.T) {
	operatorOnly = true

	tests := []endpoint{
		{
			name: "Operator Only - all admin endpoints",
			args: args{
				[]string{
					"admin:*",
				},
			},
			want: 2,
		},
		{
			name: "Operator Only - all s3 endpoints",
			args: args{
				[]string{
					"s3:*",
				},
			},
			want: 2,
		},
		{
			name: "Operator Only - all admin and s3 endpoints",
			args: args{
				[]string{
					"admin:*",
					"s3:*",
				},
			},
			want: 2,
		},
		{
			name: "Operator Only - no endpoints",
			args: args{
				[]string{},
			},
			want: 0,
		},
	}

	validateEndpoints(t, tests)
}

func TestGetActionsStringFromPolicy(t *testing.T) {
	type args struct {
		policy *iampolicy.Policy
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{
			name: "parse ReadOnly policy",
			args: args{
				policy: &iampolicy.ReadOnly,
			},
			want: 2,
		},
		{
			name: "parse WriteOnly policy",
			args: args{
				policy: &iampolicy.WriteOnly,
			},
			want: 1,
		},
		{
			name: "parse AdminDiagnostics policy",
			args: args{
				policy: &iampolicy.AdminDiagnostics,
			},
			want: 6,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetActionsStringFromPolicy(tt.args.policy); !reflect.DeepEqual(len(got), tt.want) {
				t.Errorf("GetActionsStringFromPolicy() = %v, want %v", len(got), tt.want)
			}
		})
	}
}

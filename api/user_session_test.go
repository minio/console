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
	"context"
	"os"
	"reflect"
	"testing"

	"github.com/minio/console/pkg/utils"

	"github.com/minio/console/models"
	"github.com/stretchr/testify/assert"
)

func Test_getSessionResponse(t *testing.T) {
	type args struct {
		ctx     context.Context
		session *models.Principal
	}
	ctx := context.WithValue(context.Background(), utils.ContextClientIP, "127.0.0.1")
	tests := []struct {
		name     string
		args     args
		want     *models.SessionResponse
		wantErr  bool
		preFunc  func()
		postFunc func()
	}{
		{
			name: "empty session",
			args: args{
				ctx:     ctx,
				session: nil,
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "malformed session",
			args: args{
				ctx: ctx,
				session: &models.Principal{
					STSAccessKeyID:     "W257A03HTI7L30F7YCRD",
					STSSecretAccessKey: "g+QVorWQR8aSy+k3OHOoYn0qKpENld72faCMfYps",
					STSSessionToken:    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJXMjU3QTAzSFRJN0wzMEY3WUNSRCIsImV4cCI6MTY1MTAxNjU1OCwicGFyZW50IjoibWluaW8ifQ.uFFIIEQ6qM_QvMM297ODi_uK2IA1pwvsDbyBGErkQKqtbY_Ynte8GUkNsSHBEMCT9Fr7uUwaxK41kUqjtbqAwA",
					AccountAccessKey:   "minio",
					Hm:                 false,
				},
			},
			want:    nil,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(_ *testing.T) {
			if tt.preFunc != nil {
				tt.preFunc()
			}
			session, err := getSessionResponse(tt.args.ctx, tt.args.session)
			if (err != nil) != tt.wantErr {
				t.Errorf("getSessionResponse() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(session, tt.want) {
				t.Errorf("getSessionResponse() got = %v, want %v", session, tt.want)
			}
			if tt.postFunc != nil {
				tt.postFunc()
			}
		})
	}
}

func Test_getListOfEnabledFeatures(t *testing.T) {
	type args struct {
		session *models.Principal
	}
	tests := []struct {
		name     string
		args     args
		want     []string
		preFunc  func()
		postFunc func()
	}{
		{
			name: "all features are enabled",
			args: args{
				session: &models.Principal{
					STSAccessKeyID:     "",
					STSSecretAccessKey: "",
					STSSessionToken:    "",
					AccountAccessKey:   "",
					Hm:                 true,
				},
			},
			want: []string{"hide-menu"},
			preFunc: func() {
				os.Setenv(ConsoleLogQueryURL, "http://logsearchapi:8080")
			},
			postFunc: func() {
				os.Unsetenv(ConsoleLogQueryURL)
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if tt.preFunc != nil {
				tt.preFunc()
			}
			assert.Equalf(t, tt.want, getListOfEnabledFeatures(tt.args.session), "getListOfEnabledFeatures(%v)", tt.args.session)
			if tt.postFunc != nil {
				tt.postFunc()
			}
		})
	}
}

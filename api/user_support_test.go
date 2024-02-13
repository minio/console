// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"errors"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

func Test_getCallHomeRule(t *testing.T) {
	type args struct {
		ctx     context.Context
		session *models.Principal
	}
	ctx := context.Background()
	tests := []struct {
		name               string
		args               args
		helpConfigKVGlobal func(envOnly bool) (madmin.Help, error)
		helpConfigKV       func(subSys, key string, envOnly bool) (madmin.Help, error)
		getConfigKV        func(key string) ([]byte, error)
		want               *models.CallHomeGetResponse
		wantErr            bool
	}{
		{
			name: "subsys is not supported, dont crash / return anything",
			args: args{
				ctx:     ctx,
				session: nil,
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{}, errors.New("feature is not supported")
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte{}, nil
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp:        madmin.HelpKVS{},
				}, nil
			},
			want:    nil,
			wantErr: false,
		},
		{
			name: "callhome enabled",
			args: args{
				ctx:     ctx,
				session: nil,
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "callhome", Description: "enable callhome for the cluster", Optional: true, Type: "string", MultipleTargets: false},
					},
				}, nil
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "callhome",
					Description:     "enable callhome for the cluster",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "frequency", Type: "duration", Optional: true, MultipleTargets: false},
						{Key: "enable", Type: "on|off", Optional: true, MultipleTargets: false},
					},
				}, nil
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte(`callhome:_ frequency=24h enable=on`), nil
			},
			want: &models.CallHomeGetResponse{
				DiagnosticsStatus: true,
			},
			wantErr: false,
		},
		{
			name: "callhome is disabled",
			args: args{
				ctx:     ctx,
				session: nil,
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "callhome", Description: "enable callhome for the cluster", Optional: true, Type: "string", MultipleTargets: false},
					},
				}, nil
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "callhome",
					Description:     "enable callhome for the cluster",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "frequency", Type: "duration", Optional: true, MultipleTargets: false},
						{Key: "enable", Type: "on|off", Optional: true, MultipleTargets: false},
					},
				}, nil
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte(`callhome:_ frequency=24h enable=off`), nil
			},
			want: &models.CallHomeGetResponse{
				DiagnosticsStatus: false,
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(_ *testing.T) {
			adminClient := AdminClientMock{}

			minioGetConfigKVMock = tt.getConfigKV
			minioHelpConfigKVMock = tt.helpConfigKV
			minioHelpConfigKVGlobalMock = tt.helpConfigKVGlobal

			response, err := getCallHomeRule(tt.args.ctx, adminClient)
			if (err != nil) != tt.wantErr {
				t.Errorf("getCallHomeRule() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.want != nil {
				if response.DiagnosticsStatus != tt.want.DiagnosticsStatus {
					t.Errorf("getCallHomeRule() got status = %v, want status %v", response.DiagnosticsStatus, tt.want.DiagnosticsStatus)
				}
			}
		})
	}
}

func Test_setCallHomeConfiguration(t *testing.T) {
	type args struct {
		ctx       context.Context
		session   *models.Principal
		diagState bool
	}
	ctx := context.Background()
	tests := []struct {
		name               string
		args               args
		helpConfigKVGlobal func(envOnly bool) (madmin.Help, error)
		helpConfigKV       func(subSys, key string, envOnly bool) (madmin.Help, error)
		getConfigKV        func(key string) ([]byte, error)
		setConfigEnv       func(kv string) (restart bool, err error)
		wantErr            bool
		error              error
	}{
		{
			name: "subsys is not supported, return error",
			args: args{
				ctx:       ctx,
				session:   nil,
				diagState: false,
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{}, errors.New("feature is not supported")
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte{}, nil
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp:        madmin.HelpKVS{},
				}, nil
			},
			setConfigEnv: func(_ string) (restart bool, err error) {
				return false, nil
			},
			wantErr: true,
			error:   errors.New("unable to find subnet configuration"),
		},
		{
			name: "cluster not registered",
			args: args{
				ctx:       ctx,
				session:   nil,
				diagState: false,
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "subnet",
					Description:     "set subnet config for the cluster e.g. api key",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "license", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "api_key", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "proxy", Type: "string", Optional: true, MultipleTargets: false},
					},
				}, nil
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte(`subnet license= api_key= proxy=http://127.0.0.1 `), nil
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "callhome", Description: "enable callhome for the cluster", Optional: true, Type: "string", MultipleTargets: false},
					},
				}, nil
			},
			setConfigEnv: func(_ string) (restart bool, err error) {
				return false, nil
			},
			wantErr: true,
			error:   errors.New("please register this cluster in subnet to continue"),
		},
		{
			name: "enable without errors",
			args: args{
				ctx:       ctx,
				session:   nil,
				diagState: true,
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "subnet",
					Description:     "set subnet config for the cluster e.g. api key",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "license", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "api_key", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "proxy", Type: "string", Optional: true, MultipleTargets: false},
					},
				}, nil
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte(`subnet license= api_key=testAPIKey proxy=http://127.0.0.1 `), nil
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "callhome", Description: "enable callhome for the cluster", Optional: true, Type: "string", MultipleTargets: false},
					},
				}, nil
			},
			setConfigEnv: func(_ string) (restart bool, err error) {
				return false, nil
			},
			wantErr: false,
			error:   nil,
		},
		{
			name: "disable without errors",
			args: args{
				ctx:       ctx,
				session:   nil,
				diagState: false,
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "subnet",
					Description:     "set subnet config for the cluster e.g. api key",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "license", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "api_key", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "proxy", Type: "string", Optional: true, MultipleTargets: false},
					},
				}, nil
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte(`subnet license= api_key=testAPIKey proxy=http://127.0.0.1 `), nil
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "callhome", Description: "enable callhome for the cluster", Optional: true, Type: "string", MultipleTargets: false},
					},
				}, nil
			},
			setConfigEnv: func(_ string) (restart bool, err error) {
				return false, nil
			},
			wantErr: false,
			error:   nil,
		},
		{
			name: "Error setting diagState",
			args: args{
				ctx:       ctx,
				session:   nil,
				diagState: false,
			},
			helpConfigKV: func(_, _ string, _ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "subnet",
					Description:     "set subnet config for the cluster e.g. api key",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "license", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "api_key", Type: "string", Optional: true, MultipleTargets: false},
						{Key: "proxy", Type: "string", Optional: true, MultipleTargets: false},
					},
				}, nil
			},
			getConfigKV: func(_ string) ([]byte, error) {
				return []byte(`subnet license= api_key=testAPIKey proxy=http://127.0.0.1 `), nil
			},
			helpConfigKVGlobal: func(_ bool) (madmin.Help, error) {
				return madmin.Help{
					SubSys:          "",
					Description:     "",
					MultipleTargets: false,
					KeysHelp: madmin.HelpKVS{
						{Key: "callhome", Description: "enable callhome for the cluster", Optional: true, Type: "string", MultipleTargets: false},
					},
				}, nil
			},
			setConfigEnv: func(_ string) (restart bool, err error) {
				return false, errors.New("new error detected")
			},
			wantErr: true,
			error:   errors.New("new error detected"),
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(_ *testing.T) {
			adminClient := AdminClientMock{}

			minioGetConfigKVMock = tt.getConfigKV
			minioHelpConfigKVMock = tt.helpConfigKV
			minioHelpConfigKVGlobalMock = tt.helpConfigKVGlobal
			minioSetConfigKVMock = tt.setConfigEnv

			err := setCallHomeConfiguration(tt.args.ctx, adminClient, tt.args.diagState, false)

			if (err != nil) != tt.wantErr {
				t.Errorf("setCallHomeConfiguration() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if tt.wantErr {
				if tt.error.Error() != err.Error() {
					t.Errorf("setCallHomeConfiguration() error mismatch, error = %v, wantErr %v", err.Error(), tt.error.Error())
					return
				}
			}
		})
	}
}

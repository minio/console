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

package api

import (
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"testing"
	"time"

	madmin "github.com/minio/madmin-go/v3"
)

func Test_serverHealthInfo(t *testing.T) {
	var testReceiver chan madmin.HealthInfo

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client := AdminClientMock{}
	mockWSConn := mockConn{}
	deadlineDuration, _ := time.ParseDuration("1h")

	type args struct {
		deadline     time.Duration
		wsWriteMock  func(messageType int, data []byte) error
		mockMessages []madmin.HealthInfo
	}
	tests := []struct {
		test      string
		args      args
		wantError error
	}{
		{
			test: "Return simple health info, no errors",
			args: args{
				deadline:     deadlineDuration,
				mockMessages: []madmin.HealthInfo{{}, {}},
				wsWriteMock: func(_ int, data []byte) error {
					// mock connection WriteMessage() no error
					// emulate that receiver gets the message written
					var t madmin.HealthInfo
					_ = json.Unmarshal(data, &t)
					testReceiver <- t
					return nil
				},
			},
			wantError: nil,
		},
		{
			test: "Return simple health info2, no errors",
			args: args{
				deadline:     deadlineDuration,
				mockMessages: []madmin.HealthInfo{{}},
				wsWriteMock: func(_ int, data []byte) error {
					// mock connection WriteMessage() no error
					// emulate that receiver gets the message written
					var t madmin.HealthInfo
					_ = json.Unmarshal(data, &t)
					testReceiver <- t
					return nil
				},
			},
			wantError: nil,
		},
		{
			test: "Handle error on ws write",
			args: args{
				deadline:     deadlineDuration,
				mockMessages: []madmin.HealthInfo{{}},
				wsWriteMock: func(_ int, data []byte) error {
					// mock connection WriteMessage() no error
					// emulate that receiver gets the message written
					var t madmin.HealthInfo
					_ = json.Unmarshal(data, &t)
					return errors.New("error on write")
				},
			},
			wantError: errors.New("error on write"),
		},
		{
			test: "Handle error on health function",
			args: args{
				deadline: deadlineDuration,
				mockMessages: []madmin.HealthInfo{
					{
						Error: "error on healthInfo",
					},
				},
				wsWriteMock: func(_ int, data []byte) error {
					// mock connection WriteMessage() no error
					// emulate that receiver gets the message written
					var t madmin.HealthInfo
					_ = json.Unmarshal(data, &t)
					return nil
				},
			},
			wantError: nil,
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.test, func(_ *testing.T) {
			// make testReceiver channel
			testReceiver = make(chan madmin.HealthInfo, len(tt.args.mockMessages))
			// mock function same for all tests, changes mockMessages
			minioServerHealthInfoMock = func(_ context.Context,
				_ time.Duration,
			) (interface{}, string, error) {
				info := tt.args.mockMessages[0]
				return info, madmin.HealthInfoVersion, nil
			}
			connWriteMessageMock = tt.args.wsWriteMock
			err := startHealthInfo(ctx, mockWSConn, client, &deadlineDuration)
			// close test mock channel
			close(testReceiver)
			// check that the TestReceiver got the same number of data from Console.
			index := 0
			for info := range testReceiver {
				if !reflect.DeepEqual(info, tt.args.mockMessages[index]) {
					t.Errorf("startHealthInfo() got: %v, want: %v", info, tt.args.mockMessages[index])
					return
				}
				index++
			}
			if !reflect.DeepEqual(err, tt.wantError) {
				t.Errorf("startHealthInfo() error: %v, wantError: %v", err, tt.wantError)
				return
			}
		})
	}
}

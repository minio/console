// This file is part of MinIO Console Server
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

package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
	"time"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	logsearchServer "github.com/minio/operator/logsearchapi/server"
	asrt "github.com/stretchr/testify/assert"
)

func TestLogSearch(t *testing.T) {
	responseItem := []logsearchServer.ReqInfoRow{
		{
			Time:                  time.Time{},
			APIName:               "GetConfigKV",
			Bucket:                "",
			Object:                "",
			TimeToResponseNs:      45254653,
			RemoteHost:            "10.116.1.94",
			RequestID:             "16595A4E30CCFE79",
			UserAgent:             "MinIO (linux; amd64) madmin-go/0.0.1",
			ResponseStatus:        "OK",
			ResponseStatusCode:    200,
			RequestContentLength:  nil,
			ResponseContentLength: nil,
		}, {
			Time:                  time.Time{},
			APIName:               "AssumeRole",
			Bucket:                "",
			Object:                "",
			TimeToResponseNs:      307423794,
			RemoteHost:            "127.0.0.1",
			RequestID:             "16595A4DA906FBA9",
			UserAgent:             "Go-http-client/1.1",
			ResponseStatus:        "OK",
			ResponseStatusCode:    200,
			RequestContentLength:  nil,
			ResponseContentLength: nil,
		},
	}

	assert := asrt.New(t)
	type args struct {
		apiResponse     string
		apiResponseCode int
	}

	response, _ := json.Marshal(responseItem)

	successfulResponse := &models.LogSearchResponse{
		Results: responseItem,
	}

	tests := []struct {
		name             string
		args             args
		expectedResponse *models.LogSearchResponse
		expectedError    *models.Error
	}{
		{
			name: "200 Success response",
			args: args{
				apiResponse:     fmt.Sprintf("%s\n", response),
				apiResponseCode: 200,
			},
			expectedResponse: successfulResponse,
			expectedError:    nil,
		},
		{
			name: "500 unsuccessful response",
			args: args{
				apiResponse:     "Some random error",
				apiResponseCode: 500,
			},
			expectedResponse: nil,
			expectedError: &models.Error{
				Code:    500,
				Message: swag.String("Error retrieving logs"),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			testRequest := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(tt.args.apiResponseCode)
				fmt.Fprintln(w, tt.args.apiResponse)
			}))
			defer testRequest.Close()

			resp, err := logSearch(testRequest.URL)

			if tt.expectedError != nil {
				fmt.Println(t.Name())
				assert.Equal(tt.expectedError.Code, err.Code, fmt.Sprintf("logSearch() error code: `%v`, wantErr: `%v`", err.Code, tt.expectedError))
				assert.Equal(tt.expectedError.Message, err.Message, fmt.Sprintf("logSearch() error message: `%v`, wantErr: `%v`", err.Message, tt.expectedError))
			} else {
				assert.Nil(err, fmt.Sprintf("logSearch() error: %v, wantErr: %v", err, tt.expectedError))
				if !reflect.DeepEqual(resp, tt.expectedResponse) {
					t.Errorf("logSearch() resp: %v, expectedResponse: %v", resp, tt.expectedResponse)
					return
				}
			}
		})
	}
}

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
	"errors"
	"fmt"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/support"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/subnet"
	"golang.org/x/net/context"
)

type ConfigurationSetItem struct {
	Value  string
	Enable bool
}

func registerSupportHandlers(api *operations.ConsoleAPI) {
	// callhome handlers
	api.SupportGetCallHomeOptionValueHandler = support.GetCallHomeOptionValueHandlerFunc(func(params support.GetCallHomeOptionValueParams, session *models.Principal) middleware.Responder {
		callhomeResp, err := getCallHomeOptionResponse(session, params)
		if err != nil {
			return support.NewGetCallHomeOptionValueDefault(err.Code).WithPayload(err.APIError)
		}

		return support.NewGetCallHomeOptionValueOK().WithPayload(callhomeResp)
	})

	api.SupportSetCallHomeStatusHandler = support.SetCallHomeStatusHandlerFunc(func(params support.SetCallHomeStatusParams, session *models.Principal) middleware.Responder {
		err := editCallHomeOptionResponse(session, params)
		if err != nil {
			return support.NewSetCallHomeStatusDefault(err.Code).WithPayload(err.APIError)
		}

		return support.NewSetCallHomeStatusNoContent()
	})
}

// getCallHomeOptionResponse returns the selected option value
func getCallHomeOptionResponse(session *models.Principal, params support.GetCallHomeOptionValueParams) (*models.CallHomeGetResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	minioClient := AdminClient{Client: mAdmin}

	response, err := getCallHomeRule(ctx, minioClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return response, nil
}

func getCallHomeRule(ctx context.Context, client MinioAdmin) (*models.CallHomeGetResponse, error) {
	// We verify if callhome SubSys is supported
	supportedSubSys, err := minioConfigSupportsSubSys(ctx, client, "callhome")
	if err != nil {
		return nil, err
	}

	var returnResponse models.CallHomeGetResponse

	// SubSys is not supported, hence callhome is disabled.
	if !supportedSubSys {
		returnResponse.DiagnosticsStatus = false
		returnResponse.LogsStatus = false

		return &returnResponse, nil
	}

	diagnosticsProps, err := getConfig(ctx, client, "callhome")
	if err != nil {
		return nil, err
	}

	diagnosticsSt := true

	for _, properties := range diagnosticsProps {
		for _, property := range properties.KeyValues {
			if property.Key == "enable" {
				diagnosticsSt = property.Value == "on"
			}
		}
	}

	loggerSt := true

	loggerProps, err := getConfig(ctx, client, "logger_webhook:subnet")

	// Logger not defined, then it is disabled.
	if err != nil {
		loggerSt = false
	} else {
		for _, logger := range loggerProps {
			for _, property := range logger.KeyValues {
				if property.Key == "enable" {
					loggerSt = property.Value == "on"
				}
			}
		}
	}

	returnModel := models.CallHomeGetResponse{DiagnosticsStatus: diagnosticsSt, LogsStatus: loggerSt}

	return &returnModel, nil
}

// editCallHomeOptionResponse returns if there was an error setting the option
func editCallHomeOptionResponse(session *models.Principal, params support.SetCallHomeStatusParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	minioClient := AdminClient{Client: mAdmin}

	err = setCallHomeConfiguration(ctx, minioClient, *params.Body.DiagState, *params.Body.LogsState)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}

	return nil
}

func configureCallHomeDiagnostics(ctx context.Context, client MinioAdmin, diagState bool) error {
	// We verify if callhome SubSys is supported
	supportedSubSys, err := minioConfigSupportsSubSys(ctx, client, "callhome")
	if err != nil {
		return err
	}

	// SubSys is not supported, hence callhome not available
	if !supportedSubSys {
		return errors.New("your version of MinIO doesn't support this configuration")
	}

	enableStr := "off"
	if diagState {
		enableStr = "on"
	}
	configStr := "callhome enable=" + enableStr
	_, err = client.setConfigKV(ctx, configStr)
	if err != nil {
		return err
	}

	return nil
}

func configureCallHomeLogs(ctx context.Context, client MinioAdmin, logState bool, apiKey string) error {
	var configStr string
	if logState {
		configStr = fmt.Sprintf("logger_webhook:subnet endpoint=%s auth_token=%s enable=on",
			subnet.LogWebhookURL(), apiKey)
	} else {
		configStr = "logger_webhook:subnet enable=off"
	}

	// Call set config API
	_, err := client.setConfigKV(ctx, configStr)
	if err != nil {
		return err
	}

	return nil
}

func setCallHomeConfiguration(ctx context.Context, client MinioAdmin, diagState, logsState bool) error {
	tokenConfig, err := GetSubnetKeyFromMinIOConfig(ctx, client)
	if err != nil {
		return err
	}

	apiKey := tokenConfig.APIKey

	if len(apiKey) == 0 {
		return errors.New("please register this cluster in subnet to continue")
	}

	err = configureCallHomeDiagnostics(ctx, client, diagState)
	if err != nil {
		return err
	}

	err = configureCallHomeLogs(ctx, client, logsState, apiKey)
	if err != nil {
		return err
	}

	return nil
}

func minioConfigSupportsSubSys(ctx context.Context, client MinioAdmin, subSys string) (bool, error) {
	help, err := client.helpConfigKVGlobal(ctx, false)
	if err != nil {
		return false, err
	}

	for _, h := range help.KeysHelp {
		if h.Key == subSys {
			return true, nil
		}
	}

	return false, nil
}

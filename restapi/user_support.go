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

package restapi

import (
	"fmt"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/subnet"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/support"
	"github.com/minio/console/restapi/operations/user_api"
	"github.com/minio/madmin-go"
	"golang.org/x/net/context"
)

type ConfigurationSetItem struct {
	Value  string
	Enable bool
}

func registerSupportHandlers(api *operations.ConsoleAPI) {
	// callhome
	api.SupportGetCallHomeOptionValueHandler = support.GetCallHomeOptionValueHandlerFunc(func(params support.GetCallHomeOptionValueParams, session *models.Principal) middleware.Responder {
		callhomeResp, err := getCallHomeOption(session, params)
		if err != nil {
			user_api.NewGetCallHomeOptionValueDefault(int(err.Code)).WithPayload(err)
		}

		return user_api.NewGetCallHomeOptionValueOK().WithPayload(callhomeResp)
	})

	api.SupportGetCallHomeSetOptionHandler = support.GetCallHomeSetOptionHandlerFunc(func(params support.GetCallHomeSetOptionParams, session *models.Principal) middleware.Responder {
		response, err := getSetCallHomeOption(session, params)
		if err != nil {
			user_api.NewGetCallHomeSetOptionDefault(int(err.Code)).WithPayload(err)
		}

		return user_api.NewGetCallHomeSetOptionOK().WithPayload(response)
	})
}

// getCallHomeOption returns the selected option value
func getCallHomeOption(session *models.Principal, params support.GetCallHomeOptionValueParams) (*models.CallHomeGetResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	response, err := getCallHomeRule(ctx, mAdmin, params.Rule)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return response, nil
}

func getCallHomeRule(ctx context.Context, mAdmin *madmin.AdminClient, rule string) (*models.CallHomeGetResponse, error) {
	if rule == "logs" {
		susSysKey := "logger_webhook:subnet"
		kvs, err := getSysKeyFromMinIOConfig(ctx, mAdmin, susSysKey)
		if err != nil {
			return nil, err
		}

		val := "off"

		ep, found := kvs.Lookup("endpoint")

		if found && len(ep) > 0 {
			// subnet webhook is configured. check if it is enabled
			enable, found := kvs.Lookup("enable")

			if found {
				val = enable
			} else {
				// if the 'enable' key is not found, it means that the webhook is enabled according specifications
				val = "on"
			}
		}

		response := models.CallHomeGetResponse{
			RuleName: rule,
			Value:    val,
		}

		return &response, nil
	}

	return nil, errors.New(404, "invalid rule requested")
}

// getSetCallHomeOption returns if there was an error setting the option
func getSetCallHomeOption(session *models.Principal, params support.GetCallHomeSetOptionParams) (*models.CallHomeSetRuleResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	configurations := ConfigurationSetItem{
		Enable: params.Body.Enable,
		Value:  params.Body.Value,
	}

	response, err := setCallHomeConfiguration(ctx, mAdmin, params.Rule, configurations)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return response, nil
}

func setCallHomeConfiguration(ctx context.Context, mAdmin *madmin.AdminClient, rule string, configs ConfigurationSetItem) (*models.CallHomeSetRuleResponse, error) {
	minioClient := AdminClient{Client: mAdmin}

	tokenConfig, err := GetSubnetKeyFromMinIOConfig(ctx, minioClient)
	if err != nil {
		return nil, err
	}

	apiKey := tokenConfig.APIKey

	if len(apiKey) == 0 {
		return nil, errors.New(403, "please register this cluster in subnet to continue")
	}

	enableStr := "off"
	if configs.Enable {
		enableStr = "on"
	}

	endpoint := ""

	if rule == "logs" {
		endpoint = subnet.GetLogWebhookURL()
	}

	if endpoint == "" {
		return nil, errors.New(500, "please indicate a valid rule to modify")
	}

	input := fmt.Sprintf("logger_webhook:subnet endpoint=%s auth_token=%s enable=%s",
		endpoint, apiKey, enableStr)

	// Call set config API
	restart, err := mAdmin.SetConfigKV(ctx, input)
	if err != nil {
		return nil, err
	}

	response := models.CallHomeSetRuleResponse{
		Restart: restart,
	}

	return &response, nil
}

func getSysKeyFromMinIOConfig(ctx context.Context, client *madmin.AdminClient, subSysKey string) (madmin.KVS, error) {
	sh, err := client.HelpConfigKV(ctx, subSysKey, "", false)
	if err != nil {
		return nil, fmt.Errorf("unable to get config keys for %s: %w", subSysKey, err)
	}

	buf, err := client.GetConfigKV(ctx, subSysKey)
	if err != nil {
		return nil, fmt.Errorf("unable to get server config for %s: %w", subSysKey, err)
	}

	tgt, err := madmin.ParseSubSysTarget(buf, sh)
	if err != nil {
		return nil, fmt.Errorf("unable to parse sub-system target '%s': %w", subSysKey, err)
	}

	return tgt.KVS, nil
}

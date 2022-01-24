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
//

package subnet

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/minio/console/models"
	"github.com/minio/madmin-go"
	mc "github.com/minio/mc/cmd"
	"github.com/tidwall/gjson"

	"github.com/minio/console/cluster"
)

func LoginWithMFA(client cluster.HTTPClientI, username, mfaToken, otp string) (*LoginResp, error) {
	mfaLoginReq := MfaReq{Username: username, OTP: otp, Token: mfaToken}
	resp, err := subnetPostReq(client, subnetMFAURL(), mfaLoginReq, nil)
	if err != nil {
		return nil, err
	}
	token := gjson.Get(resp, "token_info.access_token")
	if token.Exists() {
		return &LoginResp{AccessToken: token.String(), MfaToken: ""}, nil
	}
	return nil, errors.New("access token not found in response")
}

func Login(client cluster.HTTPClientI, username, password string) (*LoginResp, error) {
	loginReq := map[string]string{
		"username": username,
		"password": password,
	}
	respStr, err := subnetPostReq(client, subnetLoginURL(), loginReq, nil)
	if err != nil {
		return nil, err
	}
	mfaRequired := gjson.Get(respStr, "mfa_required").Bool()
	if mfaRequired {
		mfaToken := gjson.Get(respStr, "mfa_token").String()
		if mfaToken == "" {
			return nil, errors.New("missing mfa token")
		}
		return &LoginResp{AccessToken: "", MfaToken: mfaToken}, nil
	}
	token := gjson.Get(respStr, "token_info.access_token")
	if token.Exists() {
		return &LoginResp{AccessToken: token.String(), MfaToken: ""}, nil
	}
	return nil, errors.New("access token not found in response")
}

func GetOrganizations(client cluster.HTTPClientI, token string) ([]*models.SubnetOrganization, error) {
	headers := subnetAuthHeaders(token)
	respStr, err := subnetGetReq(client, subnetOrgsURL(), headers)
	if err != nil {
		return nil, err
	}
	var organizations []*models.SubnetOrganization
	err = json.Unmarshal([]byte(respStr), &organizations)
	if err != nil {
		log.Println(err)
	}
	return organizations, nil
}

func Register(client cluster.HTTPClientI, admInfo madmin.InfoMessage, apiKey, token, accountID string) (string, error) {
	var headers map[string]string
	regInfo := GetClusterRegInfo(admInfo)
	regURL := subnetRegisterURL()
	if apiKey != "" {
		regURL += "?api_key=" + apiKey
	} else {
		if accountID == "" || token == "" {
			return "", errors.New("missing accountID or authentication token")
		}
		headers = subnetAuthHeaders(token)
		regURL += "?aid=" + accountID
	}
	regToken, err := GenerateRegToken(regInfo)
	if err != nil {
		return "", err
	}
	reqPayload := mc.ClusterRegistrationReq{Token: regToken}
	resp, err := subnetPostReq(client, regURL, reqPayload, headers)
	if err != nil {
		return "", err
	}
	subnetAPIKey := gjson.Parse(resp).Get("api_key").String()
	if subnetAPIKey != "" {
		return subnetAPIKey, nil
	}
	return "", errors.New("subnet api key not found")
}

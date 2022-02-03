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
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/minio/pkg/licverifier"

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
	if err = json.Unmarshal([]byte(respStr), &organizations); err != nil {
		return nil, err
	}
	return organizations, nil
}

type LicenseTokenConfig struct {
	APIKey  string
	License string
	Proxy   string
}

func Register(client cluster.HTTPClientI, admInfo madmin.InfoMessage, apiKey, token, accountID string) (*LicenseTokenConfig, error) {
	var headers map[string]string
	regInfo := GetClusterRegInfo(admInfo)
	regURL := subnetRegisterURL()
	if apiKey != "" {
		regURL += "?api_key=" + apiKey
	} else {
		if accountID == "" || token == "" {
			return nil, errors.New("missing accountID or authentication token")
		}
		headers = subnetAuthHeaders(token)
		regURL += "?aid=" + accountID
	}
	regToken, err := GenerateRegToken(regInfo)
	if err != nil {
		return nil, err
	}
	reqPayload := mc.ClusterRegistrationReq{Token: regToken}
	resp, err := subnetPostReq(client, regURL, reqPayload, headers)
	if err != nil {
		return nil, err
	}
	respJSON := gjson.Parse(resp)
	subnetAPIKey := respJSON.Get("api_key").String()
	licenseJwt := respJSON.Get("license").String()

	if subnetAPIKey != "" || licenseJwt != "" {
		return &LicenseTokenConfig{
			APIKey:  subnetAPIKey,
			License: licenseJwt,
		}, nil
	}
	return nil, errors.New("subnet api key not found")
}

const publicKey = "/downloads/license-pubkey.pem"

// downloadSubnetPublicKey will download the current subnet public key.
func downloadSubnetPublicKey(client cluster.HTTPClientI) (string, error) {
	// Get the public key directly from Subnet
	url := fmt.Sprintf("%s%s", subnetBaseURL(), publicKey)
	resp, err := client.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(resp.Body)
	if err != nil {
		return "", err
	}
	return buf.String(), err
}

// ParseLicense parses the license with the bundle public key and return it's information
func ParseLicense(client cluster.HTTPClientI, license string) (*licverifier.LicenseInfo, error) {
	var publicKeys []string

	subnetPubKey, err := downloadSubnetPublicKey(client)
	if err != nil {
		log.Print(err)
		// there was an issue getting the subnet public key
		// use hardcoded public keys instead
		publicKeys = OfflinePublicKeys
	} else {
		publicKeys = append(publicKeys, subnetPubKey)
	}

	licenseInfo, err := GetLicenseInfoFromJWT(license, publicKeys)
	if err != nil {
		return nil, err
	}

	return licenseInfo, nil
}

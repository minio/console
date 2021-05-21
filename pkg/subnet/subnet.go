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
	"io/ioutil"
	"log"
	"net/http"

	"github.com/minio/console/cluster"
	"github.com/minio/pkg/licverifier"
)

// subnetLoginRequest body request for subnet login
type subnetLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// tokenInfo
type tokenInfo struct {
	AccessToken string  `json:"access_token"`
	ExpiresIn   float64 `json:"expires_in"`
	TokenType   string  `json:"token_type"`
}

// subnetLoginResponse body resonse from subnet after login
type subnetLoginResponse struct {
	HasMembership bool      `json:"has_memberships"`
	TokenInfo     tokenInfo `json:"token_info"`
}

// LicenseMetadata claims in subnet license
type LicenseMetadata struct {
	Email       string `json:"email"`
	Issuer      string `json:"issuer"`
	TeamName    string `json:"teamName"`
	ServiceType string `json:"serviceType"`
	RequestedAt string `json:"requestedAt"`
	ExpiresAt   string `json:"expiresAt"`
	AccountID   int64  `json:"accountId"`
	Capacity    int64  `json:"capacity"`
}

// subnetLicenseResponse body response returned by subnet license endpoint
type subnetLicenseResponse struct {
	License  string          `json:"license"`
	Metadata LicenseMetadata `json:"metadata"`
}

// subnetLoginRequest body request for subnet login
type subnetRefreshRequest struct {
	License string `json:"license"`
}

// getNewLicenseFromExistingLicense will perform license refresh based on the provided license key
func getNewLicenseFromExistingLicense(client cluster.HTTPClientI, licenseKey string) (string, error) {
	request := subnetRefreshRequest{
		License: licenseKey,
	}
	// http body for login request
	payloadBytes, err := json.Marshal(request)
	if err != nil {
		return "", err
	}
	subnetURL := GetSubnetURL()
	url := fmt.Sprintf("%s%s", subnetURL, refreshLicenseKeyEndpoint)
	resp, err := client.Post(url, "application/json", bytes.NewReader(payloadBytes))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	subnetLicense := &subnetLicenseResponse{}
	// Parse subnet login response
	err = json.Unmarshal(bodyBytes, subnetLicense)
	if err != nil {
		return "", err
	}
	return subnetLicense.License, nil
}

// getLicenseFromCredentials will perform authentication against subnet using
// user provided credentials and return the current subnet license key
func getLicenseFromCredentials(client cluster.HTTPClientI, username, password string) (string, error) {
	request := subnetLoginRequest{
		Username: username,
		Password: password,
	}
	// http body for login request
	payloadBytes, err := json.Marshal(request)
	if err != nil {
		return "", err
	}
	subnetURL := GetSubnetURL()
	url := fmt.Sprintf("%s%s", subnetURL, loginEndpoint)
	// Authenticate against subnet using email/password provided by user
	resp, err := client.Post(url, "application/json", bytes.NewReader(payloadBytes))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	subnetSession := &subnetLoginResponse{}
	// Parse subnet login response
	err = json.Unmarshal(bodyBytes, subnetSession)
	if err != nil {
		return "", err
	}

	// Get license key using session token
	token := subnetSession.TokenInfo.AccessToken
	url = fmt.Sprintf("%s%s", subnetURL, licenseKeyEndpoint)
	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err = client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	bodyBytes, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	userLicense := &subnetLicenseResponse{}
	// Parse subnet license response
	err = json.Unmarshal(bodyBytes, userLicense)
	if err != nil {
		return "", err
	}
	return userLicense.License, nil
}

// downloadSubnetPublicKey will download the current subnet public key.
func downloadSubnetPublicKey(client cluster.HTTPClientI) (string, error) {
	// Get the public key directly from Subnet
	url := fmt.Sprintf("%s%s", GetSubnetURL(), publicKey)
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

// ValidateLicense will download the current subnet public key, if the public key its not available for license
// verification then console will fall back to verification with hardcoded public keys
func ValidateLicense(client cluster.HTTPClientI, licenseKey, email, password string) (licInfo *licverifier.LicenseInfo, license string, err error) {
	var publicKeys []string
	if email != "" && password != "" {
		// fetch subnet license key using user credentials
		license, err = getLicenseFromCredentials(client, email, password)
		if err != nil {
			return nil, "", err
		}
	} else if licenseKey != "" {
		license = licenseKey
	} else {
		return nil, "", errors.New("invalid license")
	}
	subnetPubKey, err := downloadSubnetPublicKey(client)
	if err != nil {
		log.Print(err)
		// there was an issue getting the subnet public key
		// use hardcoded public keys instead
		publicKeys = OfflinePublicKeys
	} else {
		publicKeys = append(publicKeys, subnetPubKey)
	}
	licInfo, err = GetLicenseInfoFromJWT(license, publicKeys)
	if err != nil {
		return nil, "", err
	}
	return licInfo, license, nil
}

func RefreshLicense(client cluster.HTTPClientI, licenseKey string) (licInfo *licverifier.LicenseInfo, license string, err error) {
	if licenseKey != "" {
		license, err = getNewLicenseFromExistingLicense(client, licenseKey)
		if err != nil {
			return nil, "", err
		}
		licenseInfo, rawLicense, err := ValidateLicense(client, license, "", "")
		if err != nil {
			return nil, "", err
		}
		return licenseInfo, rawLicense, nil
	}
	return nil, "", errors.New("invalid license")
}

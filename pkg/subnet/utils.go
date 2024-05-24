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

package subnet

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"time"

	"github.com/mattn/go-ieproxy"
	xhttp "github.com/minio/console/pkg/http"
	"github.com/tidwall/gjson"

	"github.com/minio/madmin-go/v3"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/pkg/v3/env"
)

const (
	subnetRespBodyLimit = 1 << 20 // 1 MiB
)

func subnetBaseURL() string {
	return env.Get(ConsoleSubnetURL, "https://subnet.min.io")
}

func subnetRegisterURL() string {
	return subnetBaseURL() + "/api/cluster/register"
}

func subnetLoginURL() string {
	return subnetBaseURL() + "/api/auth/login"
}

func subnetOrgsURL() string {
	return subnetBaseURL() + "/api/auth/organizations"
}

func subnetMFAURL() string {
	return subnetBaseURL() + "/api/auth/mfa-login"
}

func subnetAPIKeyURL() string {
	return subnetBaseURL() + "/api/auth/api-key"
}

func LogWebhookURL() string {
	return subnetBaseURL() + "/api/logs"
}

func UploadURL(uploadType string, filename string) string {
	return fmt.Sprintf("%s/api/%s/upload?filename=%s", subnetBaseURL(), uploadType, filename)
}

func UploadAuthHeaders(apiKey string) map[string]string {
	return map[string]string{"x-subnet-api-key": apiKey}
}

func GenerateRegToken(clusterRegInfo mc.ClusterRegistrationInfo) (string, error) {
	token, e := json.Marshal(clusterRegInfo)
	if e != nil {
		return "", e
	}

	return base64.StdEncoding.EncodeToString(token), nil
}

func subnetAuthHeaders(authToken string) map[string]string {
	return map[string]string{"Authorization": "Bearer " + authToken}
}

func httpDo(client xhttp.ClientI, req *http.Request) (*http.Response, error) {
	return client.Do(req)
}

func subnetReqDo(client xhttp.ClientI, r *http.Request, headers map[string]string) (string, error) {
	for k, v := range headers {
		r.Header.Add(k, v)
	}

	ct := r.Header.Get("Content-Type")
	if len(ct) == 0 {
		r.Header.Add("Content-Type", "application/json")
	}

	resp, e := httpDo(client, r)
	if e != nil {
		return "", e
	}

	defer resp.Body.Close()
	respBytes, e := io.ReadAll(io.LimitReader(resp.Body, subnetRespBodyLimit))
	if e != nil {
		return "", e
	}
	respStr := string(respBytes)

	if resp.StatusCode == http.StatusOK {
		return respStr, nil
	}
	return respStr, fmt.Errorf("Request failed with code %d and errors: %s", resp.StatusCode, respStr)
}

func subnetGetReq(client xhttp.ClientI, reqURL string, headers map[string]string) (string, error) {
	r, e := http.NewRequest(http.MethodGet, reqURL, nil)
	if e != nil {
		return "", e
	}
	return subnetReqDo(client, r, headers)
}

func subnetPostReq(client xhttp.ClientI, reqURL string, payload interface{}, headers map[string]string) (string, error) {
	body, e := json.Marshal(payload)
	if e != nil {
		return "", e
	}
	r, e := http.NewRequest(http.MethodPost, reqURL, bytes.NewReader(body))
	if e != nil {
		return "", e
	}
	return subnetReqDo(client, r, headers)
}

func GetClusterRegInfo(admInfo madmin.InfoMessage) mc.ClusterRegistrationInfo {
	return mc.GetClusterRegInfo(admInfo, admInfo.DeploymentID)
}

func GetSubnetAPIKeyUsingLicense(lic string) (string, error) {
	return getSubnetAPIKeyUsingAuthHeaders(map[string]string{"x-subnet-license": lic})
}

func getSubnetAPIKeyUsingAuthHeaders(authHeaders map[string]string) (string, error) {
	resp, e := subnetGetReqMC(subnetAPIKeyURL(), authHeaders)
	if e != nil {
		return "", e
	}
	return extractSubnetCred("api_key", gjson.Parse(resp))
}

func extractSubnetCred(key string, resp gjson.Result) (string, error) {
	result := resp.Get(key)
	if result.Index == 0 {
		return "", fmt.Errorf("Couldn't extract %s from SUBNET response: %s", key, resp)
	}
	return result.String(), nil
}

func subnetGetReqMC(reqURL string, headers map[string]string) (string, error) {
	r, e := http.NewRequest(http.MethodGet, reqURL, nil)
	if e != nil {
		return "", e
	}
	return subnetReqDoMC(r, headers)
}

func subnetReqDoMC(r *http.Request, headers map[string]string) (string, error) {
	for k, v := range headers {
		r.Header.Add(k, v)
	}

	ct := r.Header.Get("Content-Type")
	if len(ct) == 0 {
		r.Header.Add("Content-Type", "application/json")
	}

	resp, e := httpClientSubnet(0).Do(r)
	if e != nil {
		return "", e
	}

	defer resp.Body.Close()
	respBytes, e := io.ReadAll(io.LimitReader(resp.Body, subnetRespBodyLimit))
	if e != nil {
		return "", e
	}
	respStr := string(respBytes)

	if resp.StatusCode == http.StatusOK {
		return respStr, nil
	}
	return respStr, fmt.Errorf("Request failed with code %d with error: %s", resp.StatusCode, respStr)
}

func httpClientSubnet(reqTimeout time.Duration) *http.Client {
	return &http.Client{
		Timeout: reqTimeout,
		Transport: &http.Transport{
			DialContext: (&net.Dialer{
				Timeout: 10 * time.Second,
			}).DialContext,
			Proxy: ieproxy.GetProxyFunc(),
			TLSClientConfig: &tls.Config{
				// Can't use SSLv3 because of POODLE and BEAST
				// Can't use TLSv1.0 because of POODLE and BEAST using CBC cipher
				// Can't use TLSv1.1 because of RC4 cipher usage
				MinVersion: tls.VersionTLS12,
			},
			IdleConnTimeout:       90 * time.Second,
			TLSHandshakeTimeout:   10 * time.Second,
			ExpectContinueTimeout: 10 * time.Second,
		},
	}
}

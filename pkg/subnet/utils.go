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

package subnet

import (
	"bytes"
	"compress/gzip"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net"
	"net/http"
	"time"

	"github.com/mattn/go-ieproxy"
	xhttp "github.com/minio/console/pkg/http"
	"github.com/tidwall/gjson"

	"github.com/minio/madmin-go/v3"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/pkg/v2/env"
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

func ProcessUploadInfo(info interface{}, uploadType string, filename string) ([]byte, string, error) {
	if uploadType == "health" {
		return processHealthReport(info, filename)
	}
	return nil, "", errors.New("invalid SUBNET upload type")
}

func UploadFileToSubnet(info []byte, client *xhttp.Client, reqURL string, headers map[string]string, formDataType string) (string, error) {
	req, e := subnetUploadReq(info, reqURL, formDataType)
	if e != nil {
		return "", e
	}
	resp, e := subnetReqDo(client, req, headers)
	return resp, e
}

func processHealthReport(info interface{}, filename string) ([]byte, string, error) {
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	zipWriter := gzip.NewWriter(&body)
	version := "3"
	enc := json.NewEncoder(zipWriter)

	header := struct {
		Version string `json:"version"`
	}{Version: version}

	if e := enc.Encode(header); e != nil {
		return nil, "", e
	}

	if e := enc.Encode(info); e != nil {
		return nil, "", e
	}
	zipWriter.Close()
	temp := body
	part, e := writer.CreateFormFile("file", filename)
	if e != nil {
		return nil, "", e
	}
	if _, e = io.Copy(part, &temp); e != nil {
		return nil, "", e
	}

	writer.Close()
	return body.Bytes(), writer.FormDataContentType(), nil
}

func subnetUploadReq(body []byte, url string, formDataType string) (*http.Request, error) {
	uploadDataBody := bytes.NewReader(body)
	r, e := http.NewRequest(http.MethodPost, url, uploadDataBody)
	if e != nil {
		return nil, e
	}
	r.Header.Add("Content-Type", formDataType)

	return r, nil
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
	noOfPools := 1
	noOfDrives := 0
	for _, srvr := range admInfo.Servers {
		if srvr.PoolNumber > noOfPools {
			noOfPools = srvr.PoolNumber
		}
		noOfDrives += len(srvr.Disks)
	}

	totalSpace, usedSpace := getDriveSpaceInfo(admInfo)

	return mc.ClusterRegistrationInfo{
		DeploymentID: admInfo.DeploymentID,
		ClusterName:  admInfo.DeploymentID,
		UsedCapacity: admInfo.Usage.Size,
		Info: mc.ClusterInfo{
			MinioVersion:    admInfo.Servers[0].Version,
			NoOfServerPools: noOfPools,
			NoOfServers:     len(admInfo.Servers),
			NoOfDrives:      noOfDrives,
			TotalDriveSpace: totalSpace,
			UsedDriveSpace:  usedSpace,
			NoOfBuckets:     admInfo.Buckets.Count,
			NoOfObjects:     admInfo.Objects.Count,
		},
	}
}

func getDriveSpaceInfo(admInfo madmin.InfoMessage) (uint64, uint64) {
	total := uint64(0)
	used := uint64(0)
	for _, srvr := range admInfo.Servers {
		for _, d := range srvr.Disks {
			total += d.TotalSpace
			used += d.UsedSpace
		}
	}
	return total, used
}

func GetSubnetAPIKeyUsingLicense(lic string) (string, error) {
	return getSubnetAPIKeyUsingAuthHeaders(subnetLicenseAuthHeaders(lic))
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

func subnetLicenseAuthHeaders(lic string) map[string]string {
	return map[string]string{"x-subnet-license": lic}
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

	resp, e := subnetHTTPDo(r)
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

func subnetHTTPDo(req *http.Request) (*http.Response, error) {
	return getSubnetClient().Do(req)
}

func getSubnetClient() *http.Client {
	client := httpClientSubnet(0)
	return client
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

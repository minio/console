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

package restapi

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	release "github.com/minio/console/restapi/operations/release"
	"github.com/minio/pkg/env"
)

var (
	releaseServiceHostEnvVar  = "RELEASE_SERVICE_HOST"
	defaultReleaseServiceHost = "http://localhost:9678"
)

func registerReleasesHandlers(api *operations.ConsoleAPI) {
	api.ReleaseListReleasesHandler = release.ListReleasesHandlerFunc(func(params release.ListReleasesParams, session *models.Principal) middleware.Responder {
		resp, err := GetReleaseListResponse(session, params)
		if err != nil {
			return release.NewListReleasesDefault(int(err.Code)).WithPayload(err)
		}
		return release.NewListReleasesOK().WithPayload(resp)
	})
}

func GetReleaseListResponse(session *models.Principal, params release.ListReleasesParams) (*models.ReleaseListResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	currentRelease := ""
	if params.Current != nil {
		currentRelease = *params.Current
	}
	license, err := getSubnetLicense(ctx, session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	token := fmt.Sprintf("%s|||%s", license.APIKey, license.DeploymentID)
	return releaseList(ctx, currentRelease, string(token))
}

func releaseList(ctx context.Context, currentRelease, token string) (*models.ReleaseListResponse, *models.Error) {
	serviceURL := getReleaseServiceURL()
	releases, err := getReleases(serviceURL, currentRelease, token)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return releases, nil
}

func getReleaseServiceURL() string {
	host := env.Get(releaseServiceHostEnvVar, defaultReleaseServiceHost)
	return fmt.Sprintf("%s/api/v1/latest", host)
}

func getReleases(endpoint, currentRelease, token string) (*models.ReleaseListResponse, error) {
	rl := &models.ReleaseInfo{}
	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := &url.Values{}
	q.Add("since", currentRelease)
	req.URL.RawQuery = q.Encode()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := GetConsoleHTTPClient("")
	client.Timeout = time.Second * 5

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error getting releases %s", resp.Status)
	}
	err = json.NewDecoder(resp.Body).Decode(&rl)
	if err != nil {
		return nil, err
	}

	var retData []*models.ReleaseInfo

	if rl != nil {
		retData = append(retData, rl)
	}

	retVar := &models.ReleaseListResponse{
		Results: retData,
	}

	return retVar, nil
}

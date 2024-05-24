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
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/minio/console/pkg/utils"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	release "github.com/minio/console/api/operations/release"
	"github.com/minio/console/models"
	"github.com/minio/pkg/v3/env"
)

var (
	releaseServiceHostEnvVar  = "RELEASE_SERVICE_HOST"
	defaultReleaseServiceHost = "https://enterprise-updates.ic.min.dev"
)

func registerReleasesHandlers(api *operations.ConsoleAPI) {
	api.ReleaseListReleasesHandler = release.ListReleasesHandlerFunc(func(params release.ListReleasesParams, session *models.Principal) middleware.Responder {
		resp, err := GetReleaseListResponse(session, params)
		if err != nil {
			return release.NewListReleasesDefault(err.Code).WithPayload(err.APIError)
		}
		return release.NewListReleasesOK().WithPayload(resp)
	})
}

func GetReleaseListResponse(_ *models.Principal, params release.ListReleasesParams) (*models.ReleaseListResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	repo := params.Repo
	currentRelease := ""
	if params.Current != nil {
		currentRelease = *params.Current
	}
	search := ""
	if params.Search != nil {
		search = *params.Search
	}
	filter := ""
	if params.Filter != nil {
		filter = *params.Filter
	}
	ctx = context.WithValue(ctx, utils.ContextClientIP, getClientIP(params.HTTPRequest))
	return releaseList(ctx, repo, currentRelease, search, filter)
}

func releaseList(ctx context.Context, repo, currentRelease, search, filter string) (*models.ReleaseListResponse, *CodedAPIError) {
	serviceURL := getReleaseServiceURL()
	clientIP := utils.ClientIPFromContext(ctx)
	releases, err := getReleases(serviceURL, repo, currentRelease, search, filter, clientIP)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return releases, nil
}

func getReleaseServiceURL() string {
	host := env.Get(releaseServiceHostEnvVar, defaultReleaseServiceHost)
	return fmt.Sprintf("%s/releases", host)
}

func getReleases(endpoint, repo, currentRelease, search, filter, clientIP string) (*models.ReleaseListResponse, error) {
	rl := &models.ReleaseListResponse{}
	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	q := &url.Values{}
	q.Add("repo", repo)
	q.Add("search", search)
	q.Add("filter", filter)
	q.Add("current", currentRelease)
	req.URL.RawQuery = q.Encode()
	req.Header.Set("Content-Type", "application/json")

	client := GetConsoleHTTPClient(clientIP)
	client.Timeout = time.Second * 5

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error getting releases: %s", resp.Status)
	}
	err = json.NewDecoder(resp.Body).Decode(&rl)
	if err != nil {
		return nil, err
	}
	return rl, nil
}

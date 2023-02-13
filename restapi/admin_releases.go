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
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	release "github.com/minio/console/restapi/operations/release"
	"github.com/minio/pkg/env"
)

var (
	releaseServiceHostEnvVar  = "RELEASE_SERVICE_HOST"
	defaultReleaseServiceHost = "https://enterprise-updates.ic.min.dev"
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
	return releaseList(ctx, repo, currentRelease, search, filter)
}

func releaseList(ctx context.Context, repo, currentRelease, search, filter string) (*models.ReleaseListResponse, *models.Error) {
	serviceURL := getReleaseServiceURL()
	releases, err := getReleases(serviceURL, repo, currentRelease, search, filter)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return releases, nil
}

func getReleaseServiceURL() string {
	host := env.Get(releaseServiceHostEnvVar, defaultReleaseServiceHost)
	return fmt.Sprintf("%s/releases", host)
}

func getReleases(url, repo, currentRelease, search, filter string) (*models.ReleaseListResponse, error) {
	rl := &models.ReleaseListResponse{}
	client := &http.Client{Timeout: time.Second * 5}
	req, err := http.NewRequest("GET", url, nil)
	q := req.URL.Query()
	q.Add("repo", repo)
	q.Add("current", currentRelease)
	q.Add("search", search)
	q.Add("filter", filter)
	req.URL.RawQuery = q.Encode()
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
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

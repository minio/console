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

package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	logApi "github.com/minio/console/restapi/operations/logging"
	iampolicy "github.com/minio/pkg/iam/policy"
)

func registerLogSearchHandlers(api *operations.ConsoleAPI) {
	// log search
	api.LoggingLogSearchHandler = logApi.LogSearchHandlerFunc(func(params logApi.LogSearchParams, session *models.Principal) middleware.Responder {
		searchResp, err := getLogSearchResponse(session, params)
		if err != nil {
			return logApi.NewLogSearchDefault(int(err.Code)).WithPayload(err)
		}
		return logApi.NewLogSearchOK().WithPayload(searchResp)
	})
}

// getLogSearchResponse performs a query to Log Search if Enabled
func getLogSearchResponse(session *models.Principal, params logApi.LogSearchParams) (*models.LogSearchResponse, *models.Error) {
	sessionResp, err := getSessionResponse(session)
	if err != nil {
		return nil, err
	}
	var allowedToQueryLogSearchAPI bool
	if permissions, ok := sessionResp.Permissions[ConsoleResourceName]; ok {
		for _, permission := range permissions {
			if permission == iampolicy.HealthInfoAdminAction {
				allowedToQueryLogSearchAPI = true
				break
			}
		}
	}

	if !allowedToQueryLogSearchAPI {
		return nil, &models.Error{
			Code:            int32(403),
			Message:         swag.String("Forbidden"),
			DetailedMessage: swag.String("The Log Search API not available."),
		}
	}

	token := getLogSearchAPIToken()
	endpoint := fmt.Sprintf("%s/api/query?token=%s&q=reqinfo", getLogSearchURL(), token)
	for _, fp := range params.Fp {
		endpoint = fmt.Sprintf("%s&fp=%s", endpoint, fp)
	}

	endpoint = fmt.Sprintf("%s&%s=ok", endpoint, *params.Order)

	// timeStart
	if params.TimeStart != nil && *params.TimeStart != "" {
		endpoint = fmt.Sprintf("%s&timeStart=%s", endpoint, *params.TimeStart)
	}
	// page size and page number
	endpoint = fmt.Sprintf("%s&pageSize=%d", endpoint, *params.PageSize)
	endpoint = fmt.Sprintf("%s&pageNo=%d", endpoint, *params.PageNo)

	return logSearch(endpoint)
}

func logSearch(endpoint string) (*models.LogSearchResponse, *models.Error) {
	httpClnt := GetConsoleHTTPClient()
	resp, err := httpClnt.Get(endpoint)
	if err != nil {
		return nil, &models.Error{
			Code:            int32(500),
			Message:         swag.String("Log Search API not available."),
			DetailedMessage: swag.String("The Log Search API cannot be reached. Please review the URL and try again."),
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, &models.Error{
			Code:    int32(resp.StatusCode),
			Message: swag.String(fmt.Sprintf("error retrieving logs: %s", http.StatusText(resp.StatusCode))),
		}
	}

	var results []map[string]interface{}
	if err = json.NewDecoder(resp.Body).Decode(&results); err != nil {
		return nil, prepareError(err)
	}

	return &models.LogSearchResponse{
		Results: results,
	}, nil
}

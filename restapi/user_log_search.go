// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
	"io/ioutil"
	"log"
	"net/http"

	"github.com/go-openapi/swag"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	logsearchServer "github.com/minio/operator/logsearchapi/server"
)

func registerLogSearchHandlers(api *operations.ConsoleAPI) {
	// log search
	api.UserAPILogSearchHandler = user_api.LogSearchHandlerFunc(func(params user_api.LogSearchParams, session *models.Principal) middleware.Responder {
		searchResp, err := getLogSearchResponse(params)
		if err != nil {
			return user_api.NewLogSearchDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewLogSearchOK().WithPayload(searchResp)
	})
}
func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

// getLogSearchResponse performs a query to Log Search if Enabled
func getLogSearchResponse(params user_api.LogSearchParams) (*models.LogSearchResponse, *models.Error) {
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
	resp, err := http.Get(endpoint)
	if err != nil {
		return nil, prepareError(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Error Status Code", resp.StatusCode)
		_, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, prepareError(err)
		}

		return nil, &models.Error{
			Code:    500,
			Message: swag.String("Error retrieving logs"),
		}
	}

	var results []logsearchServer.ReqInfoRow

	if err := json.NewDecoder(resp.Body).Decode(&results); err != nil {
		return nil, prepareError(err)
	}
	response := models.LogSearchResponse{
		Results: results,
	}

	return &response, nil
}

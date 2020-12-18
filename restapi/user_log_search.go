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
			return user_api.NewSessionCheckDefault(int(err.Code)).WithPayload(err)
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
	endpoint := fmt.Sprintf("http://localhost:8080/api/query?token=%s&q=%s", token, params.Q)
	for _, fp := range params.Fp {
		endpoint = fmt.Sprintf("%s&fp=%s", endpoint, fp)
	}

	endpoint = fmt.Sprintf("%s&%s=ok", endpoint, *params.Order)

	// timestart
	if params.TimeStart != nil && *params.TimeStart != "" {
		endpoint = fmt.Sprintf("%s&timeStart=%s", endpoint, *params.TimeStart)
	}
	// page size and page number
	endpoint = fmt.Sprintf("%s&pageSize=%d", endpoint, *params.PageSize)
	endpoint = fmt.Sprintf("%s&pageNo=%d", endpoint, *params.PageNo)

	resp, err := http.Get(endpoint)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	switch params.Q {
	case "reqinfo":
		var results []logsearchServer.ReqInfoRow

		if err := json.NewDecoder(resp.Body).Decode(&results); err != nil {
			log.Println(err)
			return nil, &models.Error{
				Code:    500,
				Message: swag.String(err.Error()),
			}
		}
		response := models.LogSearchResponse{
			Results: results,
		}

		return &response, nil
	case "raw":
		var results []logsearchServer.LogEventRow

		if err := json.NewDecoder(resp.Body).Decode(&results); err != nil {
			log.Println(err)
			return nil, &models.Error{
				Code:    500,
				Message: swag.String(err.Error()),
			}
		}
		response := models.LogSearchResponse{
			Results: results,
		}

		return &response, nil
	default:
		return nil, &models.Error{
			Code:    500,
			Message: swag.String("bad q value")}
	}

}

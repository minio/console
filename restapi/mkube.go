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
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	apiErrors "github.com/go-openapi/errors"
	"github.com/minio/mcs/pkg/auth"
	"github.com/minio/mcs/pkg/auth/mkube"
)

// serverMkube handles calls for mkube
func serverMkube(client *http.Client, w http.ResponseWriter, req *http.Request) {
	// extract the service account token inside the jwt encrypted claims
	claims, err := auth.GetClaimsFromTokenInRequest(req)
	if err != nil {
		apiErrors.ServeError(w, req, err)
		return
	}
	m3SAToken := claims.SessionToken
	if m3SAToken == "" {
		apiErrors.ServeError(w, req, errors.New("service M3 is not available"))
		return
	}
	// destination of the request, the mkube server
	req.URL.Path = strings.Replace(req.URL.Path, "/mkube", "", 1)
	targetURL := fmt.Sprintf("%s%s", mkube.GetMkubeEndpoint(), req.URL.String())
	body := new(bytes.Buffer)
	_, err = body.ReadFrom(req.Body)
	if err != nil {
		apiErrors.ServeError(w, req, err)
		return
	}
	// set the HTTP method, url, and m3Req body
	m3Req, err := http.NewRequest(req.Method, targetURL, body)
	if err != nil {
		apiErrors.ServeError(w, req, err)
		log.Println("error creating m3 request:", err)
		return
	}

	// Set the m3Req authorization headers
	// Authorization Header needs to be like "Authorization Bearer <jwt_token>"
	token := fmt.Sprintf("Bearer %s", m3SAToken)
	m3Req.Header.Add("Authorization", token)
	m3Req.Header.Add("Content-type", "application/json; charset=utf-8")
	resp, err := client.Do(m3Req)
	if err != nil {
		log.Println("error on m3 request:", err)
		if strings.Contains(err.Error(), "connection refused") {
			apiErrors.ServeError(w, req, errors.New("service M3 is not available"))
			return
		}
		apiErrors.ServeError(w, req, err)
		return
	}
	defer resp.Body.Close()
	w.Header().Add("Content-Type", resp.Header.Get("Content-Type"))
	// Write the m3 response to the response writer
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		w.Write(scanner.Bytes())
	}
	if err := scanner.Err(); err != nil {
		log.Println("error scanning m3 response:", err)
		apiErrors.ServeError(w, req, err)
	}

}

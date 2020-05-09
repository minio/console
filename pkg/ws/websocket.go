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

// Package ws contains websocket utils for mcs project
package ws

import (
	"net/http"
	"strings"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/swag"
)

// GetTokenFromRequest returns a token from a http Request
// either defined on a cookie `token` or on Authorization header.
//
// Authorization Header needs to be like "Authorization Bearer <jwt_token>"
func GetTokenFromRequest(r *http.Request) (*string, error) {
	// Get Auth token
	var reqToken string

	// Token might come either as a Cookie or as a Header
	// if not set in cookie, check if it is set on Header.
	tokenCookie, err := r.Cookie("token")
	if err != nil {
		headerToken := r.Header.Get("Authorization")
		// reqToken should come as "Bearer <token>"
		splitHeaderToken := strings.Split(headerToken, "Bearer")
		if len(splitHeaderToken) <= 1 {
			return nil, errors.New(http.StatusBadRequest, "Authentication not valid")
		}
		reqToken = strings.TrimSpace(splitHeaderToken[1])
	} else {
		reqToken = strings.TrimSpace(tokenCookie.Value)
	}
	return swag.String(reqToken), nil
}

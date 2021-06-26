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

// +build !operator

package restapi

import (
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
)

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(session *models.Principal) (*models.SessionResponse, *models.Error) {
	// serialize output
	if session == nil {
		return nil, prepareError(errorGenericInvalidSession)
	}
	sessionResp := &models.SessionResponse{
		Pages:    acl.GetAuthorizedEndpoints(session.Actions),
		Features: getListOfEnabledFeatures(),
		Status:   models.SessionResponseStatusOk,
		Operator: false,
	}
	return sessionResp, nil
}

// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

package operatorapi

import (
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
)

func registerOperatorSubnetHandlers(api *operations.OperatorAPI) {
	api.OperatorAPIOperatorSubnetLoginHandler = operator_api.OperatorSubnetLoginHandlerFunc(func(params operator_api.OperatorSubnetLoginParams, session *models.Principal) middleware.Responder {
		// TODO: Implement
		return operator_api.NewOperatorSubnetLoginOK()
	})
	api.OperatorAPIOperatorSubnetLoginMFAHandler = operator_api.OperatorSubnetLoginMFAHandlerFunc(func(params operator_api.OperatorSubnetLoginMFAParams, session *models.Principal) middleware.Responder {
		// TODO: Implement
		return operator_api.NewOperatorSubnetLoginMFAOK()
	})
	api.OperatorAPIOperatorSubnetAPIKeyHandler = operator_api.OperatorSubnetAPIKeyHandlerFunc(func(params operator_api.OperatorSubnetAPIKeyParams, session *models.Principal) middleware.Responder {
		// TODO: Implement
		return operator_api.NewOperatorSubnetAPIKeyOK()
	})
	api.OperatorAPIOperatorSubnetRegisterAPIKeyHandler = operator_api.OperatorSubnetRegisterAPIKeyHandlerFunc(func(params operator_api.OperatorSubnetRegisterAPIKeyParams, session *models.Principal) middleware.Responder {
		// TODO: Implement
		return operator_api.NewOperatorSubnetRegisterAPIKeyOK()
	})
}

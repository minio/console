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
//

package restapi

import (
	"context"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	kmsAPI "github.com/minio/console/restapi/operations/k_m_s"
)

func registerKMSHandlers(api *operations.ConsoleAPI) {
	api.KmsKMSStatusHandler = kmsAPI.KMSStatusHandlerFunc(func(params kmsAPI.KMSStatusParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSStatusResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSStatusDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSStatusOK().WithPayload(resp)
	})
	registerKMSKeyHandlers(api)
	registerKMSPolicyHandlers(api)
	registerKMSIdentityHandlers(api)
}

func registerKMSKeyHandlers(api *operations.ConsoleAPI) {
	api.KmsKMSCreateKeyHandler = kmsAPI.KMSCreateKeyHandlerFunc(func(params kmsAPI.KMSCreateKeyParams, session *models.Principal) middleware.Responder {
		err := GetKMSCreateKeyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSCreateKeyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSCreateKeyCreated()
	})

	api.KmsKMSImportKeyHandler = kmsAPI.KMSImportKeyHandlerFunc(func(params kmsAPI.KMSImportKeyParams, session *models.Principal) middleware.Responder {
		err := GetKMSImportKeyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSImportKeyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSImportKeyCreated()
	})

	api.KmsKMSListKeysHandler = kmsAPI.KMSListKeysHandlerFunc(func(params kmsAPI.KMSListKeysParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSListKeysResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSListKeysDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSListKeysOK().WithPayload(resp)
	})

	api.KmsKMSKeyStatusHandler = kmsAPI.KMSKeyStatusHandlerFunc(func(params kmsAPI.KMSKeyStatusParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSKeyStatusResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSKeyStatusDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSKeyStatusOK().WithPayload(resp)
	})

	api.KmsKMSDeleteKeyHandler = kmsAPI.KMSDeleteKeyHandlerFunc(func(params kmsAPI.KMSDeleteKeyParams, session *models.Principal) middleware.Responder {
		err := GetKMSDeleteKeyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSDeleteKeyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSDeleteKeyOK()
	})
}

func GetKMSStatusResponse(session *models.Principal, params kmsAPI.KMSStatusParams) (*models.KmsStatusResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSCreateKeyResponse(session *models.Principal, params kmsAPI.KMSCreateKeyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

func GetKMSImportKeyResponse(session *models.Principal, params kmsAPI.KMSImportKeyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

func GetKMSListKeysResponse(session *models.Principal, params kmsAPI.KMSListKeysParams) (*models.KmsListKeysResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSKeyStatusResponse(session *models.Principal, params kmsAPI.KMSKeyStatusParams) (*models.KmsKeyStatusResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSDeleteKeyResponse(session *models.Principal, params kmsAPI.KMSDeleteKeyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

func registerKMSPolicyHandlers(api *operations.ConsoleAPI) {
	api.KmsKMSSetPolicyHandler = kmsAPI.KMSSetPolicyHandlerFunc(func(params kmsAPI.KMSSetPolicyParams, session *models.Principal) middleware.Responder {
		err := GetKMSSetPolicyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSSetPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSSetPolicyOK()
	})

	api.KmsKMSAssignPolicyHandler = kmsAPI.KMSAssignPolicyHandlerFunc(func(params kmsAPI.KMSAssignPolicyParams, session *models.Principal) middleware.Responder {
		err := GetKMSAssignPolicyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSAssignPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSAssignPolicyOK()
	})

	api.KmsKMSDescribePolicyHandler = kmsAPI.KMSDescribePolicyHandlerFunc(func(params kmsAPI.KMSDescribePolicyParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSDescribePolicyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSDescribePolicyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSDescribePolicyOK().WithPayload(resp)
	})

	api.KmsKMSGetPolicyHandler = kmsAPI.KMSGetPolicyHandlerFunc(func(params kmsAPI.KMSGetPolicyParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSGetPolicyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSGetPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSGetPolicyOK().WithPayload(resp)
	})

	api.KmsKMSListPoliciesHandler = kmsAPI.KMSListPoliciesHandlerFunc(func(params kmsAPI.KMSListPoliciesParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSListPoliciesResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSListPoliciesDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSListPoliciesOK().WithPayload(resp)
	})
	api.KmsKMSDeletePolicyHandler = kmsAPI.KMSDeletePolicyHandlerFunc(func(params kmsAPI.KMSDeletePolicyParams, session *models.Principal) middleware.Responder {
		err := GetKMSDeletePolicyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSDeletePolicyDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSDeletePolicyOK()
	})
}

func GetKMSSetPolicyResponse(session *models.Principal, params kmsAPI.KMSSetPolicyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

func GetKMSAssignPolicyResponse(session *models.Principal, params kmsAPI.KMSAssignPolicyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

func GetKMSDescribePolicyResponse(session *models.Principal, params kmsAPI.KMSDescribePolicyParams) (*models.KmsDescribePolicyResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSGetPolicyResponse(session *models.Principal, params kmsAPI.KMSGetPolicyParams) (*models.KmsGetPolicyResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSListPoliciesResponse(session *models.Principal, params kmsAPI.KMSListPoliciesParams) (*models.KmsListPoliciesResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSDeletePolicyResponse(session *models.Principal, params kmsAPI.KMSDeletePolicyParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

func registerKMSIdentityHandlers(api *operations.ConsoleAPI) {
	api.KmsKMSDescribeIdentityHandler = kmsAPI.KMSDescribeIdentityHandlerFunc(func(params kmsAPI.KMSDescribeIdentityParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSDescribeIdentityResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSDescribeIdentityDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSDescribeIdentityOK().WithPayload(resp)
	})

	api.KmsKMSDescribeSelfIdentityHandler = kmsAPI.KMSDescribeSelfIdentityHandlerFunc(func(params kmsAPI.KMSDescribeSelfIdentityParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSDescribeSelfIdentityResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSDescribeSelfIdentityDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSDescribeSelfIdentityOK().WithPayload(resp)
	})

	api.KmsKMSListIdentitiesHandler = kmsAPI.KMSListIdentitiesHandlerFunc(func(params kmsAPI.KMSListIdentitiesParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSListIdentitiesResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSListIdentitiesDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSListIdentitiesOK().WithPayload(resp)
	})
	api.KmsKMSDeleteIdentityHandler = kmsAPI.KMSDeleteIdentityHandlerFunc(func(params kmsAPI.KMSDeleteIdentityParams, session *models.Principal) middleware.Responder {
		err := GetKMSDeleteIdentityResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSDeleteIdentityDefault(int(err.Code)).WithPayload(err)
		}
		return kmsAPI.NewKMSDeleteIdentityOK()
	})
}

func GetKMSDescribeIdentityResponse(session *models.Principal, params kmsAPI.KMSDescribeIdentityParams) (*models.KmsDescribeIdentityResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSDescribeSelfIdentityResponse(session *models.Principal, params kmsAPI.KMSDescribeSelfIdentityParams) (*models.KmsDescribeSelfIdentityResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSListIdentitiesResponse(session *models.Principal, params kmsAPI.KMSListIdentitiesParams) (*models.KmsListIdentitiesResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return nil, ErrorWithContext(ctx, ErrDefault)
}

func GetKMSDeleteIdentityResponse(session *models.Principal, params kmsAPI.KMSDeleteIdentityParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	return ErrorWithContext(ctx, ErrDefault)
}

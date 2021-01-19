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
	"context"
	"errors"

	"github.com/go-openapi/swag"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"

	"github.com/minio/minio/pkg/madmin"

	"github.com/minio/console/models"
)

func registerBucketQuotaHandlers(api *operations.ConsoleAPI) {
	// set bucket quota
	api.UserAPISetBucketQuotaHandler = user_api.SetBucketQuotaHandlerFunc(func(params user_api.SetBucketQuotaParams, session *models.Principal) middleware.Responder {
		err := setBucketQuotaResponse(session, params)
		if err != nil {
			return user_api.NewSetBucketQuotaDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewSetBucketQuotaOK()
	})
}

func setBucketQuotaResponse(session *models.Principal, params user_api.SetBucketQuotaParams) *models.Error {
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := setBucketQuota(params.HTTPRequest.Context(), &adminClient, &params.Name, params.Body); err != nil {
		return &models.Error{
			Code:    500,
			Message: swag.String(err.Error()),
		}
	}
	return nil
}

func setBucketQuota(ctx context.Context, ac *adminClient, bucket *string, bucketQuota *models.SetBucketQuota) error {
	if bucketQuota == nil {
		return errors.New("nil bucket quota was provided")
	}
	if *bucketQuota.Enabled {
		var quotaType madmin.QuotaType
		switch bucketQuota.QuotaType {
		case models.SetBucketQuotaQuotaTypeFifo:
			quotaType = madmin.FIFOQuota
		case models.SetBucketQuotaQuotaTypeHard:
			quotaType = madmin.HardQuota
		}
		if err := ac.setBucketQuota(ctx, *bucket, &madmin.BucketQuota{
			Quota: uint64(bucketQuota.Amount),
			Type:  quotaType,
		}); err != nil {
			return err
		}
	} else {
		if err := ac.client.SetBucketQuota(ctx, *bucket, &madmin.BucketQuota{}); err != nil {
			return err
		}
	}
	return nil
}

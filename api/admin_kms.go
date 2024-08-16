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

package api

import (
	"context"
	"sort"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	kmsAPI "github.com/minio/console/api/operations/k_m_s"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
)

func registerKMSHandlers(api *operations.ConsoleAPI) {
	registerKMSStatusHandlers(api)
	registerKMSKeyHandlers(api)
}

func registerKMSStatusHandlers(api *operations.ConsoleAPI) {
	api.KmsKMSStatusHandler = kmsAPI.KMSStatusHandlerFunc(func(params kmsAPI.KMSStatusParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSStatusResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSStatusDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSStatusOK().WithPayload(resp)
	})

	api.KmsKMSMetricsHandler = kmsAPI.KMSMetricsHandlerFunc(func(params kmsAPI.KMSMetricsParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSMetricsResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSMetricsDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSMetricsOK().WithPayload(resp)
	})

	api.KmsKMSAPIsHandler = kmsAPI.KMSAPIsHandlerFunc(func(params kmsAPI.KMSAPIsParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSAPIsResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSAPIsDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSAPIsOK().WithPayload(resp)
	})

	api.KmsKMSVersionHandler = kmsAPI.KMSVersionHandlerFunc(func(params kmsAPI.KMSVersionParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSVersionResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSVersionDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSVersionOK().WithPayload(resp)
	})
}

func GetKMSStatusResponse(session *models.Principal, params kmsAPI.KMSStatusParams) (*models.KmsStatusResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return kmsStatus(ctx, AdminClient{Client: mAdmin})
}

func kmsStatus(ctx context.Context, minioClient MinioAdmin) (*models.KmsStatusResponse, *CodedAPIError) {
	st, err := minioClient.kmsStatus(ctx)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.KmsStatusResponse{
		DefaultKeyID: st.DefaultKeyID,
		Name:         st.Name,
		Endpoints:    parseStatusEndpoints(st.Endpoints),
	}, nil
}

func parseStatusEndpoints(endpoints map[string]madmin.ItemState) (kmsEndpoints []*models.KmsEndpoint) {
	for key, value := range endpoints {
		kmsEndpoints = append(kmsEndpoints, &models.KmsEndpoint{URL: key, Status: string(value)})
	}
	return kmsEndpoints
}

func GetKMSMetricsResponse(session *models.Principal, params kmsAPI.KMSMetricsParams) (*models.KmsMetricsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return kmsMetrics(ctx, AdminClient{Client: mAdmin})
}

func kmsMetrics(ctx context.Context, minioClient MinioAdmin) (*models.KmsMetricsResponse, *CodedAPIError) {
	metrics, err := minioClient.kmsMetrics(ctx)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.KmsMetricsResponse{
		RequestOK:        &metrics.RequestOK,
		RequestErr:       &metrics.RequestErr,
		RequestFail:      &metrics.RequestFail,
		RequestActive:    &metrics.RequestActive,
		AuditEvents:      &metrics.AuditEvents,
		ErrorEvents:      &metrics.ErrorEvents,
		LatencyHistogram: parseHistogram(metrics.LatencyHistogram),
		Uptime:           &metrics.UpTime,
		Cpus:             &metrics.CPUs,
		UsableCPUs:       &metrics.UsableCPUs,
		Threads:          &metrics.Threads,
		HeapAlloc:        &metrics.HeapAlloc,
		HeapObjects:      metrics.HeapObjects,
		StackAlloc:       &metrics.StackAlloc,
	}, nil
}

func parseHistogram(histogram map[int64]int64) (records []*models.KmsLatencyHistogram) {
	for duration, total := range histogram {
		records = append(records, &models.KmsLatencyHistogram{Duration: duration, Total: total})
	}
	cp := func(i, j int) bool {
		return records[i].Duration < records[j].Duration
	}
	sort.Slice(records, cp)
	return records
}

func GetKMSAPIsResponse(session *models.Principal, params kmsAPI.KMSAPIsParams) (*models.KmsAPIsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return kmsAPIs(ctx, AdminClient{Client: mAdmin})
}

func kmsAPIs(ctx context.Context, minioClient MinioAdmin) (*models.KmsAPIsResponse, *CodedAPIError) {
	apis, err := minioClient.kmsAPIs(ctx)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.KmsAPIsResponse{
		Results: parseApis(apis),
	}, nil
}

func parseApis(apis []madmin.KMSAPI) (data []*models.KmsAPI) {
	for _, api := range apis {
		data = append(data, &models.KmsAPI{
			Method:  api.Method,
			Path:    api.Path,
			MaxBody: api.MaxBody,
			Timeout: api.Timeout,
		})
	}
	return data
}

func GetKMSVersionResponse(session *models.Principal, params kmsAPI.KMSVersionParams) (*models.KmsVersionResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return kmsVersion(ctx, AdminClient{Client: mAdmin})
}

func kmsVersion(ctx context.Context, minioClient MinioAdmin) (*models.KmsVersionResponse, *CodedAPIError) {
	version, err := minioClient.kmsVersion(ctx)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.KmsVersionResponse{
		Version: version.Version,
	}, nil
}

func registerKMSKeyHandlers(api *operations.ConsoleAPI) {
	api.KmsKMSCreateKeyHandler = kmsAPI.KMSCreateKeyHandlerFunc(func(params kmsAPI.KMSCreateKeyParams, session *models.Principal) middleware.Responder {
		err := GetKMSCreateKeyResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSCreateKeyDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSCreateKeyCreated()
	})

	api.KmsKMSListKeysHandler = kmsAPI.KMSListKeysHandlerFunc(func(params kmsAPI.KMSListKeysParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSListKeysResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSListKeysDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSListKeysOK().WithPayload(resp)
	})

	api.KmsKMSKeyStatusHandler = kmsAPI.KMSKeyStatusHandlerFunc(func(params kmsAPI.KMSKeyStatusParams, session *models.Principal) middleware.Responder {
		resp, err := GetKMSKeyStatusResponse(session, params)
		if err != nil {
			return kmsAPI.NewKMSKeyStatusDefault(err.Code).WithPayload(err.APIError)
		}
		return kmsAPI.NewKMSKeyStatusOK().WithPayload(resp)
	})
}

func GetKMSCreateKeyResponse(session *models.Principal, params kmsAPI.KMSCreateKeyParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return createKey(ctx, *params.Body.Key, AdminClient{Client: mAdmin})
}

func createKey(ctx context.Context, key string, minioClient MinioAdmin) *CodedAPIError {
	if err := minioClient.createKey(ctx, key); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func GetKMSListKeysResponse(session *models.Principal, params kmsAPI.KMSListKeysParams) (*models.KmsListKeysResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	pattern := ""
	if params.Pattern != nil {
		pattern = *params.Pattern
	}
	return listKeys(ctx, pattern, AdminClient{Client: mAdmin})
}

func listKeys(ctx context.Context, pattern string, minioClient MinioAdmin) (*models.KmsListKeysResponse, *CodedAPIError) {
	results, err := minioClient.listKeys(ctx, pattern)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.KmsListKeysResponse{Results: parseKeys(results)}, nil
}

// printDate - human friendly formatted date.
const (
	printDate = "2006-01-02 15:04:05 MST"
)

func parseKeys(results []madmin.KMSKeyInfo) (data []*models.KmsKeyInfo) {
	for _, key := range results {
		data = append(data, &models.KmsKeyInfo{
			CreatedAt: key.CreatedAt.Format(printDate),
			CreatedBy: key.CreatedBy,
			Name:      key.Name,
		})
	}
	return data
}

func GetKMSKeyStatusResponse(session *models.Principal, params kmsAPI.KMSKeyStatusParams) (*models.KmsKeyStatusResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return keyStatus(ctx, params.Name, AdminClient{Client: mAdmin})
}

func keyStatus(ctx context.Context, key string, minioClient MinioAdmin) (*models.KmsKeyStatusResponse, *CodedAPIError) {
	ks, err := minioClient.keyStatus(ctx, key)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.KmsKeyStatusResponse{
		KeyID:         ks.KeyID,
		EncryptionErr: ks.EncryptionErr,
		DecryptionErr: ks.DecryptionErr,
	}, nil
}

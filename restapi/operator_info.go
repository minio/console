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
	"fmt"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"
)

func registerOperatorTenantInfoHandlers(api *operations.ConsoleAPI) {
	// return usage stats
	api.AdminAPITenantInfoHandler = admin_api.TenantInfoHandlerFunc(func(params admin_api.TenantInfoParams, session *models.Principal) middleware.Responder {
		infoResp, err := getTenantInfoResponse(session, params)
		if err != nil {
			return admin_api.NewTenantInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantInfoOK().WithPayload(infoResp)
	})
	// return single widget results
	api.AdminAPITenantWidgetDetailsHandler = admin_api.TenantWidgetDetailsHandlerFunc(func(params admin_api.TenantWidgetDetailsParams, session *models.Principal) middleware.Responder {
		infoResp, err := getTenantWidgetResponse(session, params)
		if err != nil {
			return admin_api.NewDashboardWidgetDetailsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewDashboardWidgetDetailsOK().WithPayload(infoResp)
	})
}

func getTenantInfoResponse(session *models.Principal, params admin_api.TenantInfoParams) (*models.AdminInfoResponse, *models.Error) {
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}
	k8sClient := &k8sClient{
		client: clientSet,
	}

	tenant, err := getTenant(params.HTTPRequest.Context(), opClient, params.Namespace, params.Tenant)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	tenant.EnsureDefaults()

	svcURL := GetTenantServiceURL(tenant)
	// getTenantAdminClient will use all certificates under ~/.console/certs/CAs to trust the TLS connections with MinIO tenants
	mAdmin, err := getTenantAdminClient(
		params.HTTPRequest.Context(),
		k8sClient,
		tenant,
		svcURL,
	)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}

	prometheusURL := getPrometheusURLForTenant(tenant)

	sessionResp, err2 := getUsageWidgetsForDeployment(prometheusURL, mAdmin)
	if err2 != nil {
		return nil, err2
	}

	return sessionResp, nil
}

func getTenantWidgetResponse(session *models.Principal, params admin_api.TenantWidgetDetailsParams) (*models.WidgetDetails, *models.Error) {

	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}

	tenant, err := getTenant(params.HTTPRequest.Context(), opClient, params.Namespace, params.Tenant)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	tenant.EnsureDefaults()

	prometheusURL := getPrometheusURLForTenant(tenant)
	prometheusJobID := getPrometheusJobID()
	// check for special values
	if tenant.HasConsoleEnabled() {
		for _, env := range tenant.Spec.Console.Env {
			if env.Name == "CONSOLE_PROMETHEUS_JOB_ID" {
				prometheusJobID = env.Value
			}
		}

	}

	return getWidgetDetails(prometheusURL, prometheusJobID, params.WidgetID, params.Step, params.Start, params.End)
}

func getPrometheusURLForTenant(tenant *miniov2.Tenant) string {
	prometheusURL := fmt.Sprintf("http://%s.%s:%d", tenant.PrometheusHLServiceName(), tenant.Namespace, miniov2.PrometheusAPIPort)
	// check for special values
	if tenant.HasConsoleEnabled() {
		for _, env := range tenant.Spec.Console.Env {
			if env.Name == "CONSOLE_PROMETHEUS_URL" {
				prometheusURL = env.Value
			}
		}

	}
	return prometheusURL
}

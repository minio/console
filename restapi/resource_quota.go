// This file is part of MinIO Kubernetes Cloud
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
	"context"
	"log"

	"github.com/minio/mcs/cluster"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/admin_api"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func registerResourceQuotaHandlers(api *operations.McsAPI) {
	// Get Resource Quota
	api.AdminAPIGetResourceQuotaHandler = admin_api.GetResourceQuotaHandlerFunc(func(params admin_api.GetResourceQuotaParams, session *models.Principal) middleware.Responder {
		resp, err := getResourceQuotaResponse(session, params)
		if err != nil {
			return admin_api.NewGetResourceQuotaDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewGetResourceQuotaOK().WithPayload(resp)

	})
}

func getResourceQuota(ctx context.Context, client K8sClient, namespace, resourcequota string) (*models.ResourceQuota, error) {
	resourceQuota, err := client.getResourceQuota(ctx, namespace, resourcequota, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	rq := models.ResourceQuota{Name: resourceQuota.Name}
	resourceElementss := make(map[string]models.ResourceQuotaElement)
	for name, quantity := range resourceQuota.Status.Hard {
		// Create Resource element with hard limit
		element := models.ResourceQuotaElement{
			Name: string(name),
			Hard: quantity.Value(),
		}
		resourceElementss[string(name)] = element
	}
	for name, quantity := range resourceQuota.Status.Used {
		// Update resource element with Used quota
		if r, ok := resourceElementss[string(name)]; ok {
			r.Used = quantity.Value()
			// Element will only be returned if it has Hard and Used status
			rq.Elements = append(rq.Elements, &r)
		}
	}
	return &rq, nil
}

func getResourceQuotaResponse(session *models.Principal, params admin_api.GetResourceQuotaParams) (*models.ResourceQuota, error) {
	ctx := context.Background()
	client, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
		log.Println("error getting k8sClient:", err)
		return nil, err
	}
	k8sClient := &k8sClient{
		client: client,
	}
	resourceQuota, err := getResourceQuota(ctx, k8sClient, params.Namespace, params.ResourceQuotaName)
	if err != nil {
		log.Println("error getting resource quota:", err)
		return nil, err

	}
	return resourceQuota, nil
}

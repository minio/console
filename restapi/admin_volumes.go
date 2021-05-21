// This file is part of MinIO Kubernetes Cloud
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

	miniov1 "github.com/minio/operator/pkg/apis/minio.min.io/v1"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func registerVolumesHandlers(api *operations.ConsoleAPI) {
	api.AdminAPIListPVCsHandler = admin_api.ListPVCsHandlerFunc(func(params admin_api.ListPVCsParams, session *models.Principal) middleware.Responder {
		payload, err := getPVCsResponse(session)

		if err != nil {
			return admin_api.NewListPVCsDefault(int(err.Code)).WithPayload(err)
		}

		return admin_api.NewListPVCsOK().WithPayload(payload)
	})
}

func getPVCsResponse(session *models.Principal) (*models.ListPVCsResponse, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.K8sClient(session.STSSessionToken)

	if err != nil {
		return nil, prepareError(err)
	}

	// Filter Tenant PVCs. They keep their v1 tenant annotation
	listOpts := metav1.ListOptions{
		LabelSelector: miniov1.TenantLabel,
	}

	// List all PVCs
	listAllPvcs, err2 := clientset.CoreV1().PersistentVolumeClaims("").List(ctx, listOpts)

	if err2 != nil {
		return nil, prepareError(err2)
	}

	var ListPVCs []*models.PvcsListResponse

	for _, pvc := range listAllPvcs.Items {
		pvcResponse := models.PvcsListResponse{
			Name:         pvc.Name,
			Age:          pvc.CreationTimestamp.String(),
			Capacity:     pvc.Status.Capacity.Storage().String(),
			Namespace:    pvc.Namespace,
			Status:       string(pvc.Status.Phase),
			StorageClass: *pvc.Spec.StorageClassName,
			Volume:       pvc.Spec.VolumeName,
		}

		ListPVCs = append(ListPVCs, &pvcResponse)
	}

	PVCsResponse := models.ListPVCsResponse{
		Pvcs: ListPVCs,
	}

	return &PVCsResponse, nil
}

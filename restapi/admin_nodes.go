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
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/minio/console/cluster"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/client-go/kubernetes/typed/core/v1"
)

func registerNodesHandlers(api *operations.ConsoleAPI) {
	api.AdminAPIGetClusterResourcesHandler = admin_api.GetClusterResourcesHandlerFunc(func(params admin_api.GetClusterResourcesParams, session *models.Principal) middleware.Responder {
		resp, err := getClusterResourcesResponse(session)
		if err != nil {
			return admin_api.NewGetClusterResourcesDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewGetClusterResourcesOK().WithPayload(resp)
	})
}

// getClusterResources get cluster nodes and collects taints, available and allocatable resources of the node
func getClusterResources(ctx context.Context, clientset v1.CoreV1Interface) (*models.ClusterResources, error) {
	// get all nodes from cluster
	nodes, err := clientset.Nodes().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	// construct ClusterResources response
	res := &models.ClusterResources{}

	for _, n := range nodes.Items {
		// Get Total Resources
		totalResources := make(map[string]int64)
		for resource, quantity := range n.Status.Capacity {
			totalResources[string(resource)] = quantity.Value()
		}

		// Get Allocatable Resources
		allocatableResources := make(map[string]int64)
		for resource, quantity := range n.Status.Allocatable {
			allocatableResources[string(resource)] = quantity.Value()
		}

		// Get Node taints and split them by effect
		taints := &models.NodeTaints{}
		for _, t := range n.Spec.Taints {
			var taint string
			// when value is not defined the taint string is created without `=`
			if strings.TrimSpace(t.Value) != "" {
				taint = fmt.Sprintf("%s=%s:%s", t.Key, t.Value, t.Effect)
			} else {
				taint = fmt.Sprintf("%s:%s", t.Key, t.Effect)
			}
			switch t.Effect {
			case corev1.TaintEffectNoSchedule:
				taints.NoSchedule = append(taints.NoSchedule, taint)
			case corev1.TaintEffectNoExecute:
				taints.NoExecute = append(taints.NoExecute, taint)
			case corev1.TaintEffectPreferNoSchedule:
				taints.PreferNoSchedule = append(taints.PreferNoSchedule, taint)
			default:
				continue
			}
		}

		// create node object an add it to the nodes list
		nodeInfo := &models.NodeInfo{
			Name:                 n.Name,
			Taints:               taints,
			AllocatableResources: allocatableResources,
			TotalResources:       totalResources,
		}
		res.Nodes = append(res.Nodes, nodeInfo)
	}
	return res, nil
}

func getClusterResourcesResponse(session *models.Principal) (*models.ClusterResources, error) {
	ctx := context.Background()
	client, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
		log.Println("error getting k8sClient:", err)
		return nil, err
	}

	clusterResources, err := getClusterResources(ctx, client.CoreV1())
	if err != nil {
		log.Println("error getting cluster's resources:", err)
		return nil, err

	}
	return clusterResources, nil
}

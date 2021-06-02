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
	"sort"

	"github.com/minio/minio-go/v7/pkg/set"

	"github.com/minio/console/restapi/operations/operator_api"

	"github.com/minio/console/cluster"

	"errors"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/client-go/kubernetes/typed/core/v1"
)

func registerNodesHandlers(api *operations.ConsoleAPI) {
	api.AdminAPIGetMaxAllocatableMemHandler = admin_api.GetMaxAllocatableMemHandlerFunc(func(params admin_api.GetMaxAllocatableMemParams, principal *models.Principal) middleware.Responder {
		resp, err := getMaxAllocatableMemoryResponse(params.HTTPRequest.Context(), principal, params.NumNodes)
		if err != nil {
			return admin_api.NewGetMaxAllocatableMemDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetMaxAllocatableMemOK().WithPayload(resp)
	})

	api.OperatorAPIListNodeLabelsHandler = operator_api.ListNodeLabelsHandlerFunc(func(params operator_api.ListNodeLabelsParams, principal *models.Principal) middleware.Responder {
		resp, err := getNodeLabelsResponse(params.HTTPRequest.Context(), principal)
		if err != nil {
			return operator_api.NewListNodeLabelsDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewListNodeLabelsOK().WithPayload(*resp)
	})
}

// getMaxAllocatableMemory get max allocatable memory given a desired number of nodes
func getMaxAllocatableMemory(ctx context.Context, clientset v1.CoreV1Interface, numNodes int32) (*models.MaxAllocatableMemResponse, error) {
	if numNodes == 0 {
		return nil, errors.New("error NumNodes must be greated than 0")
	}

	// get all nodes from cluster
	nodes, err := clientset.Nodes().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	availableMemSizes := []int64{}
OUTER:
	for _, n := range nodes.Items {
		// Don't consider node if it has a NoSchedule or NoExecute Taint
		for _, t := range n.Spec.Taints {
			switch t.Effect {
			case corev1.TaintEffectNoSchedule:
				continue OUTER
			case corev1.TaintEffectNoExecute:
				continue OUTER
			default:
				continue
			}
		}
		if quantity, ok := n.Status.Allocatable[corev1.ResourceMemory]; ok {
			availableMemSizes = append(availableMemSizes, quantity.Value())
		}
	}

	maxAllocatableMemory := getMaxClusterMemory(numNodes, availableMemSizes)

	res := &models.MaxAllocatableMemResponse{
		MaxMemory: maxAllocatableMemory,
	}

	return res, nil
}

// getMaxClusterMemory returns the maximum memory size that can be used
// across numNodes (number of nodes)
func getMaxClusterMemory(numNodes int32, nodesMemorySizes []int64) int64 {
	if int32(len(nodesMemorySizes)) < numNodes || numNodes == 0 {
		return 0
	}

	// sort nodesMemorySizes int64 array
	sort.Slice(nodesMemorySizes, func(i, j int) bool { return nodesMemorySizes[i] < nodesMemorySizes[j] })
	maxIndex := 0
	maxAllocatableMemory := nodesMemorySizes[maxIndex]

	for i, size := range nodesMemorySizes {
		// maxAllocatableMemory is the minimum value of nodesMemorySizes array
		// only within the size of numNodes, if more nodes are available
		// then the maxAllocatableMemory is equal to the next minimum value
		// on the sorted nodesMemorySizes array.
		// e.g. with numNodes = 4;
		//   			maxAllocatableMemory of [2,4,8,8] => 2
		//      		maxAllocatableMemory of [2,4,8,8,16] => 4
		if int32(i) < numNodes {
			maxAllocatableMemory = min(maxAllocatableMemory, size)
		} else {
			maxIndex++
			maxAllocatableMemory = nodesMemorySizes[maxIndex]
		}
	}
	return maxAllocatableMemory
}

// min returns the smaller of x or y.
func min(x, y int64) int64 {
	if x > y {
		return y
	}
	return x
}

func getMaxAllocatableMemoryResponse(ctx context.Context, session *models.Principal, numNodes int32) (*models.MaxAllocatableMemResponse, *models.Error) {
	client, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	clusterResources, err := getMaxAllocatableMemory(ctx, client.CoreV1(), numNodes)
	if err != nil {
		return nil, prepareError(err)
	}
	return clusterResources, nil
}

func getNodeLabels(ctx context.Context, clientset v1.CoreV1Interface) (*models.NodeLabels, error) {
	// get all nodes from cluster
	nodes, err := clientset.Nodes().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	// make a map[string]set to avoid duplicate values
	keyValueSet := map[string]set.StringSet{}

	for _, node := range nodes.Items {
		for k, v := range node.Labels {
			if _, ok := keyValueSet[k]; !ok {
				keyValueSet[k] = set.NewStringSet()
			}
			keyValueSet[k].Add(v)
		}
	}

	// convert to output
	res := models.NodeLabels{}
	for k, valSet := range keyValueSet {
		res[k] = valSet.ToSlice()
	}

	return &res, nil
}

func getNodeLabelsResponse(ctx context.Context, session *models.Principal) (*models.NodeLabels, *models.Error) {
	client, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	clusterResources, err := getNodeLabels(ctx, client.CoreV1())
	if err != nil {
		return nil, prepareError(err)
	}
	return clusterResources, nil
}

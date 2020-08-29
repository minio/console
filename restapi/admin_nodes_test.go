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
	"encoding/json"
	"reflect"
	"testing"

	"github.com/minio/console/models"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func Test_GetClusterResources(t *testing.T) {
	type args struct {
		ctx  context.Context
		objs []runtime.Object
	}
	tests := []struct {
		name     string
		args     args
		expected *models.ClusterResources
		wantErr  bool
	}{
		{
			name: "Get Nodes Taints and Resources",
			args: args{
				ctx: context.Background(),
				objs: []runtime.Object{
					&corev1.Node{
						ObjectMeta: metav1.ObjectMeta{
							Name: "node1",
						},
						Spec: corev1.NodeSpec{
							Taints: []corev1.Taint{
								corev1.Taint{
									Key:    "node.kubernetes.io/unreachable",
									Effect: corev1.TaintEffectNoSchedule,
								},
								corev1.Taint{
									Key:    "own.minio.io/taint",
									Effect: corev1.TaintEffectNoExecute,
									Value:  "val",
								},
								corev1.Taint{
									Key:    "node.kubernetes.io/unschedulable",
									Effect: corev1.TaintEffectPreferNoSchedule,
								},
							},
						},
						Status: corev1.NodeStatus{
							Capacity: corev1.ResourceList{
								corev1.ResourceMemory: resource.MustParse("2Ki"),
								corev1.ResourceCPU:    resource.MustParse("4Ki"),
							},
						},
					},
					&corev1.Node{
						ObjectMeta: metav1.ObjectMeta{
							Name: "node2",
						},
						Spec: corev1.NodeSpec{
							Taints: []corev1.Taint{
								corev1.Taint{
									Key:    "node.kubernetes.io/unreachable",
									Effect: corev1.TaintEffectNoSchedule,
								},
							},
						},
						Status: corev1.NodeStatus{
							Capacity: corev1.ResourceList{
								corev1.ResourceMemory: resource.MustParse("1Ki"),
								corev1.ResourceCPU:    resource.MustParse("2Ki"),
							},
							Allocatable: corev1.ResourceList{
								corev1.ResourceMemory: resource.MustParse("512"),
								corev1.ResourceCPU:    resource.MustParse("1Ki"),
							},
						},
					},
				},
			},
			expected: &models.ClusterResources{
				Nodes: []*models.NodeInfo{
					&models.NodeInfo{
						Name: "node1",
						Taints: &models.NodeTaints{
							NoExecute: []string{
								"own.minio.io/taint=val:NoExecute",
							},
							NoSchedule: []string{
								"node.kubernetes.io/unreachable:NoSchedule",
							},
							PreferNoSchedule: []string{
								"node.kubernetes.io/unschedulable:PreferNoSchedule",
							},
						},
						TotalResources: map[string]int64{
							"memory": int64(2048),
							"cpu":    int64(4096),
						},
						AllocatableResources: map[string]int64{},
					},
					&models.NodeInfo{
						Name: "node2",
						Taints: &models.NodeTaints{
							NoSchedule: []string{
								"node.kubernetes.io/unreachable:NoSchedule",
							},
						},
						TotalResources: map[string]int64{
							"memory": int64(1024),
							"cpu":    int64(2048),
						},
						AllocatableResources: map[string]int64{
							"memory": int64(512),
							"cpu":    int64(1024),
						},
					},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		kubeClient := fake.NewSimpleClientset(tt.args.objs...)
		t.Run(tt.name, func(t *testing.T) {
			got, err := getClusterResources(tt.args.ctx, kubeClient.CoreV1())
			if (err != nil) != tt.wantErr {
				t.Errorf("deleteTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
			if !reflect.DeepEqual(got, tt.expected) {
				ji, _ := json.Marshal(got)
				vi, _ := json.Marshal(tt.expected)
				t.Errorf("\ngot: %s \nwant: %s", ji, vi)
			}
		})
	}
}

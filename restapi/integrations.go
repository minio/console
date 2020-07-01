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
	"time"

	"github.com/minio/mcs/cluster"
	gkev1beta2 "github.com/minio/mcs/pkg/apis/networking.gke.io/v1beta2"
	gkeClientset "github.com/minio/mcs/pkg/clientgen/clientset/versioned"
	corev1 "k8s.io/api/core/v1"
	extensionsBeta1 "k8s.io/api/extensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/informers"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/cache"
)

func gkeIntegration(clientset *kubernetes.Clientset, tenantName string, namespace string, k8sToken string) error {
	// wait for the first pod to be created
	doneCh := make(chan struct{})
	factory := informers.NewSharedInformerFactory(clientset, 0)

	informerClosed := false

	go func() {
		time.Sleep(time.Second * 15)
		if !informerClosed {
			informerClosed = true
			close(doneCh)
		}
	}()

	podInformer := factory.Core().V1().Pods().Informer()
	podInformer.AddEventHandler(cache.ResourceEventHandlerFuncs{
		AddFunc: func(obj interface{}) {
			pod := obj.(*corev1.Pod)
			// monitor for pods with v1.min.io/instance annotation
			if strings.HasPrefix(pod.Name, tenantName) {
				if !informerClosed {
					informerClosed = true
					close(doneCh)
				}
			}
		},
	})

	go podInformer.Run(doneCh)
	//block until the informer exits
	<-doneCh
	log.Println("informer closed")

	tenantDomain := fmt.Sprintf("%s.cloud.min.dev", tenantName)
	tenantMcsDomain := fmt.Sprintf("console.%s.cloud.min.dev", tenantName)

	// customization for demo, add the ingress for this new tenant
	// create ManagedCertificate
	manCertName := fmt.Sprintf("%s-cert", tenantName)
	managedCert := gkev1beta2.ManagedCertificate{
		ObjectMeta: metav1.ObjectMeta{
			Name: manCertName,
		},
		Spec: gkev1beta2.ManagedCertificateSpec{
			Domains: []string{
				tenantDomain,
				tenantMcsDomain,
			},
		},
		Status: gkev1beta2.ManagedCertificateStatus{
			DomainStatus: []gkev1beta2.DomainStatus{},
		},
	}

	mkClientSet, err := gkeClientset.NewForConfig(cluster.GetK8sConfig(k8sToken))
	if err != nil {
		return err
	}

	_, err = mkClientSet.NetworkingV1beta2().ManagedCertificates(namespace).Create(context.Background(), &managedCert, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	// get a nodeport port for this tenant and create a nodeport for it
	tenantNodePort := 9000

	targetPort := intstr.IntOrString{
		Type:   intstr.Int,
		IntVal: 9000,
	}

	tenantNpSvc := fmt.Sprintf("%s-np", tenantName)
	npSvc := corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: tenantNpSvc,
		},
		Spec: corev1.ServiceSpec{

			Selector: map[string]string{
				"v1.min.io/instance": tenantName,
			},
			Type: corev1.ServiceTypeNodePort,
			Ports: []corev1.ServicePort{
				{
					Protocol:   corev1.ProtocolTCP,
					Port:       int32(tenantNodePort),
					TargetPort: targetPort,
				},
			},
		},
	}

	_, err = clientset.CoreV1().Services(namespace).Create(context.Background(), &npSvc, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	//NOW FOR MCS
	// create mcsManagedCertificate

	// get a nodeport port for this tenant and create a nodeport for it
	tenantMcsNodePort := 9090

	targetMcsPort := intstr.IntOrString{
		Type:   intstr.Int,
		IntVal: 9090,
	}

	tenantMcsnpMcsSvc := fmt.Sprintf("%s-mcs-np", tenantName)
	npMcsSvc := corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: tenantMcsnpMcsSvc,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{
				"v1.min.io/mcs": fmt.Sprintf("%s-mcs", tenantName),
			},
			Type: corev1.ServiceTypeNodePort,
			Ports: []corev1.ServicePort{
				{
					Protocol:   corev1.ProtocolTCP,
					Port:       int32(tenantMcsNodePort),
					TargetPort: targetMcsPort,
				},
			},
		},
	}

	_, err = clientset.CoreV1().Services(namespace).Create(context.Background(), &npMcsSvc, metav1.CreateOptions{})
	if err != nil {
		return err
	}
	// udpate ingress with this new service
	m3Ingress, err := clientset.ExtensionsV1beta1().Ingresses(namespace).Get(context.Background(), "mkube-ingress", metav1.GetOptions{})
	if err != nil {
		return err
	}

	certsInIngress := m3Ingress.ObjectMeta.Annotations["networking.gke.io/managed-certificates"]
	allCerts := strings.Split(certsInIngress, ",")
	allCerts = append(allCerts, manCertName)
	m3Ingress.ObjectMeta.Annotations["networking.gke.io/managed-certificates"] = strings.Join(allCerts, ",")

	tenantNodePortIoS := intstr.IntOrString{
		Type:   intstr.Int,
		IntVal: int32(tenantNodePort),
	}

	tenantMcsNodePortIoS := intstr.IntOrString{
		Type:   intstr.Int,
		IntVal: int32(tenantMcsNodePort),
	}

	m3Ingress.Spec.Rules = append(m3Ingress.Spec.Rules, extensionsBeta1.IngressRule{
		Host: tenantDomain,
		IngressRuleValue: extensionsBeta1.IngressRuleValue{
			HTTP: &extensionsBeta1.HTTPIngressRuleValue{
				Paths: []extensionsBeta1.HTTPIngressPath{
					{
						Backend: extensionsBeta1.IngressBackend{
							ServiceName: tenantNpSvc,
							ServicePort: tenantNodePortIoS,
						},
					},
				},
			},
		},
	})
	m3Ingress.Spec.Rules = append(m3Ingress.Spec.Rules, extensionsBeta1.IngressRule{
		Host: tenantMcsDomain,
		IngressRuleValue: extensionsBeta1.IngressRuleValue{
			HTTP: &extensionsBeta1.HTTPIngressRuleValue{
				Paths: []extensionsBeta1.HTTPIngressPath{
					{
						Backend: extensionsBeta1.IngressBackend{
							ServiceName: tenantMcsnpMcsSvc,
							ServicePort: tenantMcsNodePortIoS,
						},
					},
				},
			},
		},
	})

	_, err = clientset.ExtensionsV1beta1().Ingresses(namespace).Update(context.Background(), m3Ingress, metav1.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}

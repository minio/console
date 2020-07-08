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
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"k8s.io/apimachinery/pkg/api/resource"
	types "k8s.io/apimachinery/pkg/types"

	corev1 "k8s.io/api/core/v1"

	"github.com/minio/mcs/cluster"
	madmin "github.com/minio/minio/pkg/madmin"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/mcs/models"
	"github.com/minio/mcs/restapi/operations"
	"github.com/minio/mcs/restapi/operations/admin_api"
	operator "github.com/minio/minio-operator/pkg/apis/operator.min.io/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func registerTenantHandlers(api *operations.McsAPI) {
	// Add Tenant
	api.AdminAPICreateTenantHandler = admin_api.CreateTenantHandlerFunc(func(params admin_api.CreateTenantParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		resp, err := getTenantCreatedResponse(sessionID, params)
		if err != nil {
			return admin_api.NewCreateTenantDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewCreateTenantOK().WithPayload(resp)
	})
	// List All Tenants of all namespaces
	api.AdminAPIListAllTenantsHandler = admin_api.ListAllTenantsHandlerFunc(func(params admin_api.ListAllTenantsParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		resp, err := getListAllTenantsResponse(sessionID, params)
		if err != nil {
			return admin_api.NewListTenantsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListTenantsOK().WithPayload(resp)

	})
	// List Tenants by namespace
	api.AdminAPIListTenantsHandler = admin_api.ListTenantsHandlerFunc(func(params admin_api.ListTenantsParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		resp, err := getListTenantsResponse(sessionID, params)
		if err != nil {
			return admin_api.NewListTenantsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListTenantsOK().WithPayload(resp)

	})
	// Detail Tenant
	api.AdminAPITenantInfoHandler = admin_api.TenantInfoHandlerFunc(func(params admin_api.TenantInfoParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		resp, err := getTenantInfoResponse(sessionID, params)
		if err != nil {
			return admin_api.NewTenantInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewTenantInfoOK().WithPayload(resp)

	})

	// Delete Tenant
	api.AdminAPIDeleteTenantHandler = admin_api.DeleteTenantHandlerFunc(func(params admin_api.DeleteTenantParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		err := getDeleteTenantResponse(sessionID, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewTenantInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String("Unable to delete tenant")})
		}
		return admin_api.NewTenantInfoOK()

	})

	// Update Tenant
	api.AdminAPIUpdateTenantHandler = admin_api.UpdateTenantHandlerFunc(func(params admin_api.UpdateTenantParams, principal *models.Principal) middleware.Responder {
		sessionID := string(*principal)
		err := getUpdateTenantResponse(sessionID, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewUpdateTenantDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String("Unable to update tenant")})
		}
		return admin_api.NewUpdateTenantCreated()
	})
}

// deleteTenantAction performs the actions of deleting a tenant
func deleteTenantAction(ctx context.Context, operatorClient OperatorClient, nameSpace, instanceName string) error {
	err := operatorClient.MinIOInstanceDelete(ctx, nameSpace, instanceName, metav1.DeleteOptions{})
	if err != nil {
		return err
	}
	return nil
}

// getDeleteTenantResponse gets the output of deleting a minio instance
func getDeleteTenantResponse(token string, params admin_api.DeleteTenantParams) error {
	opClientClientSet, err := cluster.OperatorClient(token)
	if err != nil {
		return err
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	return deleteTenantAction(context.Background(), opClient, params.Namespace, params.Tenant)
}

func identifyMinioInstanceScheme(mi *operator.MinIOInstance) string {
	scheme := "http"
	if mi.RequiresAutoCertSetup() || mi.RequiresExternalCertSetup() {
		scheme = "https"
	}
	return scheme
}

func getTenantAdminClient(ctx context.Context, client K8sClient, namespace, tenantName, serviceName, scheme string) (*madmin.AdminClient, error) {
	// get admin credentials from secret
	creds, err := client.getSecret(ctx, namespace, fmt.Sprintf("%s-secret", tenantName), metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	accessKey, ok := creds.Data["accesskey"]
	if !ok {
		log.Println("tenant's secret doesn't contain accesskey")
		return nil, errorGeneric
	}
	secretkey, ok := creds.Data["secretkey"]
	if !ok {
		log.Println("tenant's secret doesn't contain secretkey")
		return nil, errorGeneric
	}
	service, err := client.getService(ctx, namespace, serviceName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	mAdmin, pErr := NewAdminClient(scheme+"://"+net.JoinHostPort(service.Spec.ClusterIP, strconv.Itoa(operator.MinIOPort)), string(accessKey), string(secretkey))
	if pErr != nil {
		return nil, pErr.Cause
	}
	return mAdmin, nil
}

func getMinioInstance(ctx context.Context, operatorClient OperatorClient, namespace, tenantName string) (*operator.MinIOInstance, error) {
	minInst, err := operatorClient.MinIOInstanceGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return minInst, nil
}

func getTenantInfo(minioInstance *operator.MinIOInstance, tenantInfo *usageInfo) *models.Tenant {
	var instanceCount int64
	var volumeCount int64
	for _, zone := range minioInstance.Spec.Zones {
		instanceCount = instanceCount + int64(zone.Servers)
		volumeCount = volumeCount + int64(zone.Servers*int32(minioInstance.Spec.VolumesPerServer))
	}

	var zones []*models.Zone

	for _, z := range minioInstance.Spec.Zones {
		zones = append(zones, &models.Zone{
			Name:    z.Name,
			Servers: int64(z.Servers),
		})
	}

	return &models.Tenant{
		CreationDate:     minioInstance.ObjectMeta.CreationTimestamp.String(),
		InstanceCount:    instanceCount,
		Name:             minioInstance.Name,
		VolumesPerServer: int64(minioInstance.Spec.VolumesPerServer),
		VolumeCount:      volumeCount,
		VolumeSize:       minioInstance.Spec.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value(),
		TotalSize:        int64(minioInstance.Spec.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value() * volumeCount),
		ZoneCount:        int64(len(minioInstance.Spec.Zones)),
		CurrentState:     minioInstance.Status.CurrentState,
		Zones:            zones,
		Namespace:        minioInstance.ObjectMeta.Namespace,
		Image:            minioInstance.Spec.Image,
		UsedSize:         tenantInfo.DisksUsage,
	}
}

func getTenantInfoResponse(token string, params admin_api.TenantInfoParams) (*models.Tenant, error) {
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	opClientClientSet, err := cluster.OperatorClient(token)
	if err != nil {
		return nil, err
	}
	clientset, err := cluster.K8sClient(token)
	if err != nil {
		log.Println("error getting k8sClient:", err)
		return nil, err
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}
	k8sClient := &k8sClient{
		client: clientset,
	}

	minInst, err := getMinioInstance(ctx, opClient, params.Namespace, params.Tenant)
	if err != nil {
		log.Println("error getting minioInstance:", err)
		return nil, err
	}
	minioInstanceScheme := identifyMinioInstanceScheme(minInst)
	mAdmin, err := getTenantAdminClient(ctx, k8sClient, params.Namespace, params.Tenant, minInst.Spec.ServiceName, minioInstanceScheme)
	if err != nil {
		log.Println("error getting tenant's admin client:", err)
		return nil, err
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// serialize output
	adminInfo, err := getAdminInfo(ctx, adminClient)
	if err != nil {
		log.Println("error getting admin info:", err)
		return nil, err
	}
	info := getTenantInfo(minInst, adminInfo)
	return info, nil
}

func listTenants(ctx context.Context, operatorClient OperatorClient, namespace string, limit *int32) (*models.ListTenantsResponse, error) {
	listOpts := metav1.ListOptions{
		Limit: 10,
	}

	if limit != nil {
		listOpts.Limit = int64(*limit)
	}

	minInstances, err := operatorClient.MinIOInstanceList(ctx, namespace, listOpts)
	if err != nil {
		return nil, err
	}

	var tenants []*models.TenantList

	for _, minInst := range minInstances.Items {

		var instanceCount int64
		var volumeCount int64
		for _, zone := range minInst.Spec.Zones {
			instanceCount = instanceCount + int64(zone.Servers)
			volumeCount = volumeCount + int64(zone.Servers*int32(minInst.Spec.VolumesPerServer))
		}

		tenants = append(tenants, &models.TenantList{
			CreationDate:  minInst.ObjectMeta.CreationTimestamp.String(),
			Name:          minInst.ObjectMeta.Name,
			ZoneCount:     int64(len(minInst.Spec.Zones)),
			InstanceCount: instanceCount,
			VolumeCount:   volumeCount,
			VolumeSize:    minInst.Spec.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value(),
			CurrentState:  minInst.Status.CurrentState,
			Namespace:     minInst.ObjectMeta.Namespace,
		})
	}

	return &models.ListTenantsResponse{
		Tenants: tenants,
		Total:   0,
	}, nil
}

func getListAllTenantsResponse(token string, params admin_api.ListAllTenantsParams) (*models.ListTenantsResponse, error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(token)
	if err != nil {
		log.Println("error getting operator client:", err)
		return nil, err
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	listT, err := listTenants(ctx, opClient, "", params.Limit)
	if err != nil {
		log.Println("error listing tenants:", err)
		return nil, err
	}
	return listT, nil
}

// getListTenantsResponse list tenants by namespace
func getListTenantsResponse(token string, params admin_api.ListTenantsParams) (*models.ListTenantsResponse, error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(token)
	if err != nil {
		log.Println("error getting operator client:", err)
		return nil, err
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	listT, err := listTenants(ctx, opClient, params.Namespace, params.Limit)
	if err != nil {
		log.Println("error listing tenants:", err)
		return nil, err
	}
	return listT, nil
}

func getTenantCreatedResponse(token string, params admin_api.CreateTenantParams) (*models.CreateTenantResponse, error) {
	minioImage := params.Body.Image
	if minioImage == "" {
		minImg, err := cluster.GetMinioImage()
		if err != nil {
			return nil, err
		}
		minioImage = *minImg
	}

	// if access/secret are provided, use them, else create a random pair
	accessKey := RandomCharString(16)
	secretKey := RandomCharString(32)
	if params.Body.AccessKey != "" {
		accessKey = params.Body.AccessKey
	}
	if params.Body.SecretKey != "" {
		secretKey = params.Body.SecretKey
	}
	secretName := fmt.Sprintf("%s-secret", *params.Body.Name)
	imm := true
	instanceSecret := corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: secretName,
		},
		Immutable: &imm,
		Data: map[string][]byte{
			"accesskey": []byte(accessKey),
			"secretkey": []byte(secretKey),
		},
	}

	clientset, err := cluster.K8sClient(token)
	if err != nil {
		return nil, err
	}
	ns := *params.Body.Namespace
	_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &instanceSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}

	enableSSL := true
	if params.Body.EnableSsl != nil {
		enableSSL = *params.Body.EnableSsl
	}
	enableMCS := true
	if params.Body.EnableMcs != nil {
		enableMCS = *params.Body.EnableMcs
	}

	volumeSize, err := resource.ParseQuantity(*params.Body.VolumeConfiguration.Size)
	if err != nil {
		return nil, err
	}

	memorySize, err := resource.ParseQuantity(getTenantMemorySize())
	if err != nil {
		return nil, err
	}

	volTemp := corev1.PersistentVolumeClaimSpec{
		AccessModes: []corev1.PersistentVolumeAccessMode{
			corev1.ReadWriteOnce,
		},
		Resources: corev1.ResourceRequirements{
			Requests: corev1.ResourceList{
				corev1.ResourceStorage: volumeSize,
				corev1.ResourceMemory:  memorySize,
			},
		},
	}

	if params.Body.VolumeConfiguration.StorageClass != "" {
		volTemp.StorageClassName = &params.Body.VolumeConfiguration.StorageClass
	}

	//Construct a MinIO Instance with everything we are getting from parameters
	minInst := operator.MinIOInstance{
		ObjectMeta: metav1.ObjectMeta{
			Name: *params.Body.Name,
		},
		Spec: operator.MinIOInstanceSpec{
			Image:     minioImage,
			Mountpath: "/export",
			CredsSecret: &corev1.LocalObjectReference{
				Name: secretName,
			},
			RequestAutoCert: enableSSL,
			VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
				ObjectMeta: metav1.ObjectMeta{
					Name: "data",
				},
				Spec: volTemp,
			},
		},
	}
	// optionals are set below

	if enableMCS {
		mcsSelector := fmt.Sprintf("%s-mcs", *params.Body.Name)

		mcsSecretName := fmt.Sprintf("%s-secret", mcsSelector)
		imm := true
		instanceSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: mcsSecretName,
			},
			Immutable: &imm,
			Data: map[string][]byte{
				"MCS_HMAC_JWT_SECRET":  []byte(RandomCharString(16)),
				"MCS_PBKDF_PASSPHRASE": []byte(RandomCharString(16)),
				"MCS_PBKDF_SALT":       []byte(RandomCharString(8)),
				"MCS_ACCESS_KEY":       []byte(RandomCharString(16)),
				"MCS_SECRET_KEY":       []byte(RandomCharString(32)),
			},
		}
		_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &instanceSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}

		minInst.Spec.MCS = &operator.MCSConfig{
			Replicas:  2,
			Image:     "minio/mcs:v0.1.1",
			MCSSecret: &corev1.LocalObjectReference{Name: mcsSecretName},
		}
	}

	// set the service name if provided
	if params.Body.ServiceName != "" {
		minInst.Spec.ServiceName = params.Body.ServiceName
	}
	// set the zones if they are provided
	if len(params.Body.Zones) > 0 {
		for _, zone := range params.Body.Zones {
			minInst.Spec.Zones = append(minInst.Spec.Zones, operator.Zone{
				Name:    zone.Name,
				Servers: int32(zone.Servers),
			})
		}
	}

	// Set Volumes Per Server if provided, default 1
	minInst.Spec.VolumesPerServer = 1
	if params.Body.VolumesPerServer > 0 {
		minInst.Spec.VolumesPerServer = int(params.Body.VolumesPerServer)
	}
	// Set Mount Path if provided
	if params.Body.MounthPath != "" {
		minInst.Spec.Mountpath = params.Body.MounthPath
	}
	// add annotations
	if len(params.Body.Annotations) > 0 {
		if minInst.Spec.Metadata == nil {
			minInst.Spec.Metadata = &metav1.ObjectMeta{}
		}
		minInst.Spec.Metadata.Annotations = params.Body.Annotations
	}

	opClient, err := cluster.OperatorClient(token)
	if err != nil {
		return nil, err
	}

	_, err = opClient.OperatorV1().MinIOInstances(ns).Create(context.Background(), &minInst, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}

	// Integratrions
	if os.Getenv("GKE_INTEGRATION") != "" {
		err := gkeIntegration(clientset, *params.Body.Name, ns, token)
		if err != nil {
			return nil, err
		}
	}

	return &models.CreateTenantResponse{
		AccessKey: accessKey,
		SecretKey: secretKey,
	}, nil
}

// updateTenantAction does an update on the minioInstance by patching the desired changes
func updateTenantAction(ctx context.Context, operatorClient OperatorClient, httpCl cluster.HTTPClientI, nameSpace string, params admin_api.UpdateTenantParams) error {
	imageToUpdate := params.Body.Image
	minInst, err := operatorClient.MinIOInstanceGet(ctx, nameSpace, params.Tenant, metav1.GetOptions{})
	if err != nil {
		return err
	}

	// if image to update is empty we'll use the latest image by default
	if strings.TrimSpace(imageToUpdate) != "" {
		minInst.Spec.Image = params.Body.Image
	} else {
		im, err := cluster.GetLatestMinioImage(httpCl)
		if err != nil {
			return err
		}
		minInst.Spec.Image = *im
	}

	payloadBytes, err := json.Marshal(minInst)
	if err != nil {
		return err
	}
	_, err = operatorClient.MinIOInstancePatch(ctx, nameSpace, minInst.Name, types.MergePatchType, payloadBytes, metav1.PatchOptions{})
	if err != nil {
		return err
	}
	return nil
}

func getUpdateTenantResponse(token string, params admin_api.UpdateTenantParams) error {
	ctx := context.Background()
	// TODO: use namespace of the tenant not from the controller
	currentNamespace := cluster.GetNs()

	opClientClientSet, err := cluster.OperatorClient(token)
	if err != nil {
		log.Println("error getting operator client:", err)
		return err
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}
	httpC := &cluster.HTTPClient{
		Client: &http.Client{
			Timeout: 4 * time.Second,
		},
	}
	if err := updateTenantAction(ctx, opClient, httpC, currentNamespace, params); err != nil {
		log.Println("error patching MinioInstance:", err)
		return err
	}

	return nil
}

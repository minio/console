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
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/apimachinery/pkg/types"

	corev1 "k8s.io/api/core/v1"

	"github.com/minio/console/cluster"
	"github.com/minio/minio/pkg/madmin"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	operator "github.com/minio/operator/pkg/apis/minio.min.io/v1"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/client-go/kubernetes/typed/core/v1"
)

type imageRegistry struct {
	Auths map[string]imageRegistryCredentials `json:"auths"`
}

type imageRegistryCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Auth     string `json:"auth"`
}

func registerTenantHandlers(api *operations.ConsoleAPI) {
	// Add Tenant
	api.AdminAPICreateTenantHandler = admin_api.CreateTenantHandlerFunc(func(params admin_api.CreateTenantParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantCreatedResponse(session, params)
		if err != nil {
			return admin_api.NewCreateTenantDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewCreateTenantOK().WithPayload(resp)
	})
	// List All Tenants of all namespaces
	api.AdminAPIListAllTenantsHandler = admin_api.ListAllTenantsHandlerFunc(func(params admin_api.ListAllTenantsParams, session *models.Principal) middleware.Responder {
		resp, err := getListAllTenantsResponse(session, params)
		if err != nil {
			return admin_api.NewListTenantsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListTenantsOK().WithPayload(resp)

	})
	// List Tenants by namespace
	api.AdminAPIListTenantsHandler = admin_api.ListTenantsHandlerFunc(func(params admin_api.ListTenantsParams, session *models.Principal) middleware.Responder {
		resp, err := getListTenantsResponse(session, params)
		if err != nil {
			return admin_api.NewListTenantsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListTenantsOK().WithPayload(resp)

	})
	// Detail Tenant
	api.AdminAPITenantInfoHandler = admin_api.TenantInfoHandlerFunc(func(params admin_api.TenantInfoParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantInfoResponse(session, params)
		if err != nil {
			return admin_api.NewTenantInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantInfoOK().WithPayload(resp)

	})

	// Delete Tenant
	api.AdminAPIDeleteTenantHandler = admin_api.DeleteTenantHandlerFunc(func(params admin_api.DeleteTenantParams, session *models.Principal) middleware.Responder {
		err := getDeleteTenantResponse(session, params)
		if err != nil {
			return admin_api.NewTenantInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantInfoOK()

	})

	// Update Tenant
	api.AdminAPIUpdateTenantHandler = admin_api.UpdateTenantHandlerFunc(func(params admin_api.UpdateTenantParams, session *models.Principal) middleware.Responder {
		err := getUpdateTenantResponse(session, params)
		if err != nil {
			return admin_api.NewUpdateTenantDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewUpdateTenantCreated()
	})

	// Add Tenant Zones
	api.AdminAPITenantAddZoneHandler = admin_api.TenantAddZoneHandlerFunc(func(params admin_api.TenantAddZoneParams, session *models.Principal) middleware.Responder {
		err := getTenantAddZoneResponse(session, params)
		if err != nil {
			return admin_api.NewTenantAddZoneDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantAddZoneCreated()
	})

	// Get Tenant Usage
	api.AdminAPIGetTenantUsageHandler = admin_api.GetTenantUsageHandlerFunc(func(params admin_api.GetTenantUsageParams, session *models.Principal) middleware.Responder {
		payload, err := getTenantUsageResponse(session, params)
		if err != nil {
			return admin_api.NewGetTenantUsageDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetTenantUsageOK().WithPayload(payload)
	})

	// Update Tenant Zones
	api.AdminAPITenantUpdateZonesHandler = admin_api.TenantUpdateZonesHandlerFunc(func(params admin_api.TenantUpdateZonesParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantUpdateZoneResponse(session, params)
		if err != nil {
			return admin_api.NewTenantUpdateZonesDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantUpdateZonesOK().WithPayload(resp)
	})

	// Update Tenant Certificates
	api.AdminAPITenantUpdateCertificateHandler = admin_api.TenantUpdateCertificateHandlerFunc(func(params admin_api.TenantUpdateCertificateParams, session *models.Principal) middleware.Responder {
		err := getTenantUpdateCertificatesResponse(session, params)
		if err != nil {
			return admin_api.NewTenantUpdateCertificateDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantUpdateCertificateCreated()
	})

	// Update Tenant Encryption Configuration
	api.AdminAPITenantUpdateEncryptionHandler = admin_api.TenantUpdateEncryptionHandlerFunc(func(params admin_api.TenantUpdateEncryptionParams, session *models.Principal) middleware.Responder {
		err := getTenantUpdateEncryptionResponse(session, params)
		if err != nil {
			return admin_api.NewTenantUpdateEncryptionDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantUpdateEncryptionCreated()
	})
}

// getDeleteTenantResponse gets the output of deleting a minio instance
func getDeleteTenantResponse(session *models.Principal, params admin_api.DeleteTenantParams) *models.Error {
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return prepareError(err)
	}
	// get Kubernetes Client
	clientset, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
		return prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	deleteTenantPVCs := false
	if params.Body != nil {
		deleteTenantPVCs = params.Body.DeletePvcs
	}
	if err = deleteTenantAction(context.Background(), opClient, clientset.CoreV1(), params.Namespace, params.Tenant, deleteTenantPVCs); err != nil {
		return prepareError(err)
	}
	return nil
}

// deleteTenantAction performs the actions of deleting a tenant
//
// It also adds the option of deleting the tenant's underlying pvcs if deletePvcs set
func deleteTenantAction(
	ctx context.Context,
	operatorClient OperatorClientI,
	clientset v1.CoreV1Interface,
	namespace, tenantName string,
	deletePvcs bool) error {

	err := operatorClient.TenantDelete(ctx, namespace, tenantName, metav1.DeleteOptions{})
	if err != nil {
		// try to delete pvc even if the tenant doesn't exist anymore but only if deletePvcs is set to true,
		// else, we return the error
		if (deletePvcs && !k8sErrors.IsNotFound(err)) || !deletePvcs {
			return err
		}
	}

	if deletePvcs {
		opts := metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", operator.TenantLabel, tenantName),
		}
		err = clientset.PersistentVolumeClaims(namespace).DeleteCollection(ctx, metav1.DeleteOptions{}, opts)
		if err != nil {
			return err
		}
		// delete all tenant's secrets only if deletePvcs = true
		return clientset.Secrets(namespace).DeleteCollection(ctx, metav1.DeleteOptions{}, opts)
	}
	return nil
}

// GetTenantServiceURL gets tenant's service url with the proper scheme and port
func GetTenantServiceURL(mi *operator.Tenant) (svcURL string) {
	scheme := "http"
	port := operator.MinIOPortLoadBalancerSVC
	if mi.AutoCert() || mi.ExternalCert() {
		scheme = "https"
		port = operator.MinIOTLSPortLoadBalancerSVC
	}
	svc := fmt.Sprintf("%s.%s.svc.cluster.local", mi.MinIOCIServiceName(), mi.Namespace)
	return fmt.Sprintf("%s://%s", scheme, net.JoinHostPort(svc, strconv.Itoa(port)))
}

func getTenantAdminClient(ctx context.Context, client K8sClientI, tenant *operator.Tenant, svcURL string, insecure bool) (*madmin.AdminClient, error) {
	if tenant == nil || tenant.Spec.CredsSecret == nil {
		return nil, errors.New("invalid arguments")
	}
	// get admin credentials from secret
	creds, err := client.getSecret(ctx, tenant.Namespace, tenant.Spec.CredsSecret.Name, metav1.GetOptions{})
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
	// TODO:
	// We need to avoid using minio root credentials to talk to tenants, and instead use a different user credentials
	// when that its implemented we also need to check here if the tenant has LDAP enabled so we authenticate first against AD
	tenantAccessKey := string(accessKey)
	tenantSecretKey := string(secretkey)
	sessionToken := ""
	mAdmin, pErr := NewAdminClientWithInsecure(svcURL, tenantAccessKey, tenantSecretKey, sessionToken, insecure)
	if pErr != nil {
		return nil, pErr.Cause
	}
	return mAdmin, nil
}

func getTenant(ctx context.Context, operatorClient OperatorClientI, namespace, tenantName string) (*operator.Tenant, error) {
	minInst, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return minInst, nil
}

func isPrometheusEnabled(annotations map[string]string) bool {
	if annotations == nil {
		return false
	}
	// if one of the following prometheus annotations are not present
	// we consider the tenant as not integrated with prometheus
	if _, ok := annotations[prometheusPath]; !ok {
		return false
	}
	if _, ok := annotations[prometheusPort]; !ok {
		return false
	}
	if _, ok := annotations[prometheusScrape]; !ok {
		return false
	}
	return true
}

func getTenantInfo(tenant *operator.Tenant) *models.Tenant {
	var zones []*models.Zone
	consoleImage := ""
	var totalSize int64
	for _, z := range tenant.Spec.Zones {
		zones = append(zones, parseTenantZone(&z))
		zoneSize := int64(z.Servers) * int64(z.VolumesPerServer) * z.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value()
		totalSize = totalSize + zoneSize
	}
	var deletion string
	if tenant.ObjectMeta.DeletionTimestamp != nil {
		deletion = tenant.ObjectMeta.DeletionTimestamp.String()
	}

	if tenant.HasConsoleEnabled() {
		consoleImage = tenant.Spec.Console.Image
	}

	return &models.Tenant{
		CreationDate:     tenant.ObjectMeta.CreationTimestamp.String(),
		DeletionDate:     deletion,
		Name:             tenant.Name,
		TotalSize:        totalSize,
		CurrentState:     tenant.Status.CurrentState,
		Zones:            zones,
		Namespace:        tenant.ObjectMeta.Namespace,
		Image:            tenant.Spec.Image,
		ConsoleImage:     consoleImage,
		EnablePrometheus: isPrometheusEnabled(tenant.Annotations),
	}
}

func getTenantInfoResponse(session *models.Principal, params admin_api.TenantInfoParams) (*models.Tenant, *models.Error) {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}

	minTenant, err := getTenant(ctx, opClient, params.Namespace, params.Tenant)
	if err != nil {
		return nil, prepareError(err)
	}

	info := getTenantInfo(minTenant)
	return info, nil
}

func listTenants(ctx context.Context, operatorClient OperatorClientI, namespace string, limit *int32) (*models.ListTenantsResponse, error) {
	listOpts := metav1.ListOptions{
		Limit: 10,
	}

	if limit != nil {
		listOpts.Limit = int64(*limit)
	}

	minTenants, err := operatorClient.TenantList(ctx, namespace, listOpts)
	if err != nil {
		return nil, err
	}

	var tenants []*models.TenantList

	for _, tenant := range minTenants.Items {
		var totalSize int64
		var instanceCount int64
		var volumeCount int64
		for _, zone := range tenant.Spec.Zones {
			instanceCount = instanceCount + int64(zone.Servers)
			volumeCount = volumeCount + int64(zone.Servers*zone.VolumesPerServer)
			if zone.VolumeClaimTemplate != nil {
				zoneSize := int64(zone.VolumesPerServer) * int64(zone.Servers) * zone.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value()
				totalSize = totalSize + zoneSize
			}
		}

		var deletion string
		if tenant.ObjectMeta.DeletionTimestamp != nil {
			deletion = tenant.ObjectMeta.DeletionTimestamp.String()
		}

		tenants = append(tenants, &models.TenantList{
			CreationDate:  tenant.ObjectMeta.CreationTimestamp.String(),
			DeletionDate:  deletion,
			Name:          tenant.ObjectMeta.Name,
			ZoneCount:     int64(len(tenant.Spec.Zones)),
			InstanceCount: instanceCount,
			VolumeCount:   volumeCount,
			CurrentState:  tenant.Status.CurrentState,
			Namespace:     tenant.ObjectMeta.Namespace,
			TotalSize:     totalSize,
		})
	}

	return &models.ListTenantsResponse{
		Tenants: tenants,
		Total:   int64(len(tenants)),
	}, nil
}

func getListAllTenantsResponse(session *models.Principal, params admin_api.ListAllTenantsParams) (*models.ListTenantsResponse, *models.Error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	listT, err := listTenants(ctx, opClient, "", params.Limit)
	if err != nil {
		return nil, prepareError(err)
	}
	return listT, nil
}

// getListTenantsResponse list tenants by namespace
func getListTenantsResponse(session *models.Principal, params admin_api.ListTenantsParams) (*models.ListTenantsResponse, *models.Error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	listT, err := listTenants(ctx, opClient, params.Namespace, params.Limit)
	if err != nil {
		return nil, prepareError(err)
	}
	return listT, nil
}

func getTenantCreatedResponse(session *models.Principal, params admin_api.CreateTenantParams) (response *models.CreateTenantResponse, mError *models.Error) {
	tenantReq := params.Body
	minioImage := tenantReq.Image
	ctx := context.Background()
	consoleHasTLS := false

	if minioImage == "" {
		minImg, err := cluster.GetMinioImage()
		// we can live without figuring out the latest version of MinIO, Operator will use a hardcoded value
		if err == nil {
			minioImage = *minImg
		}
	}
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.SessionToken)
	k8sClient := k8sClient{
		client: clientSet,
	}
	if err != nil {
		return nil, prepareError(err)
	}

	ns := *tenantReq.Namespace

	// if access/secret are provided, use them, else create a random pair
	accessKey := RandomCharString(16)
	secretKey := RandomCharString(32)

	if tenantReq.AccessKey != "" {
		accessKey = tenantReq.AccessKey
	}
	if tenantReq.SecretKey != "" {
		secretKey = tenantReq.SecretKey
	}

	tenantName := *tenantReq.Name
	secretName := fmt.Sprintf("%s-secret", tenantName)
	imm := true

	instanceSecret := corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: secretName,
			Labels: map[string]string{
				operator.TenantLabel: tenantName,
			},
		},
		Immutable: &imm,
		Data: map[string][]byte{
			"accesskey": []byte(accessKey),
			"secretkey": []byte(secretKey),
		},
	}

	_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &instanceSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, prepareError(err)
	}
	// delete secrets created if an error occurred during tenant creation,
	defer func() {
		if mError != nil {
			log.Printf("deleting secrets created for failed tenant: %s if any\n", tenantName)
			opts := metav1.ListOptions{
				LabelSelector: fmt.Sprintf("%s=%s", operator.TenantLabel, tenantName),
			}
			err = clientSet.CoreV1().Secrets(ns).DeleteCollection(ctx, metav1.DeleteOptions{}, opts)
			if err != nil {
				log.Println("error deleting tenant's secrets:", err)
			}
		}
	}()

	var envrionmentVariables []corev1.EnvVar
	// Check the Erasure Coding Parity for validity and pass it to Tenant
	if tenantReq.ErasureCodingParity > 0 {
		if tenantReq.ErasureCodingParity < 2 || tenantReq.ErasureCodingParity > 8 {
			return nil, prepareError(errorInvalidErasureCodingValue)
		}
		envrionmentVariables = append(envrionmentVariables, corev1.EnvVar{
			Name:  "MINIO_STORAGE_CLASS_STANDARD",
			Value: fmt.Sprintf("EC:%d", tenantReq.ErasureCodingParity),
		})
	}

	//Construct a MinIO Instance with everything we are getting from parameters
	minInst := operator.Tenant{
		ObjectMeta: metav1.ObjectMeta{
			Name:   tenantName,
			Labels: tenantReq.Labels,
		},
		Spec: operator.TenantSpec{
			Image:     minioImage,
			Mountpath: "/export",
			CredsSecret: &corev1.LocalObjectReference{
				Name: secretName,
			},
			Env: envrionmentVariables,
		},
	}
	idpEnabled := false
	// Enable IDP (Active Directory) for MinIO
	if tenantReq.Idp != nil && tenantReq.Idp.ActiveDirectory != nil {
		url := *tenantReq.Idp.ActiveDirectory.URL
		userNameFormat := *tenantReq.Idp.ActiveDirectory.UsernameFormat
		userSearchFilter := *tenantReq.Idp.ActiveDirectory.UserSearchFilter
		tlsSkipVerify := tenantReq.Idp.ActiveDirectory.SkipTLSVerification
		serverInsecure := tenantReq.Idp.ActiveDirectory.ServerInsecure
		groupSearchDN := tenantReq.Idp.ActiveDirectory.GroupSearchBaseDn
		groupSearchFilter := tenantReq.Idp.ActiveDirectory.GroupSearchFilter
		groupNameAttribute := tenantReq.Idp.ActiveDirectory.GroupNameAttribute
		if url != "" && userNameFormat != "" && userSearchFilter != "" {
			// CONSOLE_LDAP_ENABLED
			idpEnabled = true
			minInst.Spec.Env = append(minInst.Spec.Env, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_SERVER_ADDR",
				Value: userNameFormat,
			}, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_USERNAME_FORMAT",
				Value: userNameFormat,
			}, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_USERNAME_SEARCH_FILTER",
				Value: userSearchFilter,
			}, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_USERNAME_SEARCH_FILTER",
				Value: userSearchFilter,
			}, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_GROUP_SEARCH_BASE_DN",
				Value: groupSearchDN,
			}, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_GROUP_SEARCH_FILTER",
				Value: groupSearchFilter,
			}, corev1.EnvVar{
				Name:  "MINIO_IDENTITY_LDAP_GROUP_NAME_ATTRIBUTE",
				Value: groupNameAttribute,
			})

			if tlsSkipVerify {
				minInst.Spec.Env = append(minInst.Spec.Env, corev1.EnvVar{
					Name:  "MINIO_IDENTITY_LDAP_TLS_SKIP_VERIFY",
					Value: "on",
				})
			}
			if serverInsecure {
				minInst.Spec.Env = append(minInst.Spec.Env, corev1.EnvVar{
					Name:  "MINIO_IDENTITY_LDAP_SERVER_INSECURE",
					Value: "on",
				})
			}
		}
	}

	isEncryptionEnabled := false

	if tenantReq.EnableTLS != nil {
		// if enableTLS is defined in the create tenant request we assign the value
		// to the RequestAutoCert attribute in the tenant spec
		minInst.Spec.RequestAutoCert = tenantReq.EnableTLS
		if *tenantReq.EnableTLS {
			// requestAutoCert is enabled, MinIO will be deployed with TLS enabled and encryption can be enabled
			isEncryptionEnabled = true
			consoleHasTLS = true
		}
	}
	// External TLS certificates for MinIO
	if tenantReq.TLS != nil && len(tenantReq.TLS.Minio) > 0 {
		isEncryptionEnabled = true
		// Certificates used by the MinIO instance
		externalCertSecretName := fmt.Sprintf("%s-instance-external-certificates", secretName)
		externalCertSecret, err := createOrReplaceExternalCertSecrets(ctx, &k8sClient, ns, tenantReq.TLS.Minio, externalCertSecretName, tenantName)
		if err != nil {
			return nil, prepareError(err)
		}
		minInst.Spec.ExternalCertSecret = externalCertSecret
	}
	// If encryption configuration is present and TLS will be enabled (using AutoCert or External certificates)
	if tenantReq.Encryption != nil && isEncryptionEnabled {
		// KES client mTLSCertificates used by MinIO instance
		if tenantReq.Encryption.Client != nil {
			tenantExternalClientCertSecretName := fmt.Sprintf("%s-tenant-external-client-cert", secretName)
			certificates := []*models.KeyPairConfiguration{tenantReq.Encryption.Client}
			certificateSecrets, err := createOrReplaceExternalCertSecrets(ctx, &k8sClient, ns, certificates, tenantExternalClientCertSecretName, tenantName)
			if err != nil {
				return nil, prepareError(errorGeneric)
			}
			if len(certificateSecrets) > 0 {
				minInst.Spec.ExternalClientCertSecret = certificateSecrets[0]
			}
		}

		// KES configuration for Tenant instance
		minInst.Spec.KES, err = getKESConfiguration(ctx, &k8sClient, ns, tenantReq.Encryption, secretName, tenantName)
		if err != nil {
			return nil, prepareError(errorGeneric)
		}
		// Set Labels, Annotations and Node Selector for KES
		minInst.Spec.KES.Labels = tenantReq.Encryption.Labels
		minInst.Spec.KES.Annotations = tenantReq.Encryption.Annotations
		minInst.Spec.KES.NodeSelector = tenantReq.Encryption.NodeSelector
	}

	// optionals are set below
	var consoleAccess string
	var consoleSecret string

	enableConsole := true
	if tenantReq.EnableConsole != nil && *tenantReq.EnableConsole {
		enableConsole = *tenantReq.EnableConsole
	}

	if enableConsole {
		consoleSelector := fmt.Sprintf("%s-console", tenantName)
		consoleSecretName := fmt.Sprintf("%s-secret", consoleSelector)
		consoleAccess = RandomCharString(16)
		consoleSecret = RandomCharString(32)
		imm := true
		instanceSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: consoleSecretName,
				Labels: map[string]string{
					operator.TenantLabel: tenantName,
				},
			},
			Immutable: &imm,
			Data: map[string][]byte{
				"CONSOLE_PBKDF_PASSPHRASE": []byte(RandomCharString(16)),
				"CONSOLE_PBKDF_SALT":       []byte(RandomCharString(8)),
				"CONSOLE_ACCESS_KEY":       []byte(consoleAccess),
				"CONSOLE_SECRET_KEY":       []byte(consoleSecret),
			},
		}

		minInst.Spec.Console = &operator.ConsoleConfiguration{
			Replicas:      1,
			Image:         ConsoleImageVersion,
			ConsoleSecret: &corev1.LocalObjectReference{Name: consoleSecretName},
			Resources: corev1.ResourceRequirements{
				Requests: map[corev1.ResourceName]resource.Quantity{
					"memory": resource.MustParse("64Mi"),
				},
			},
		}
		if tenantReq.TLS != nil && tenantReq.TLS.Console != nil {
			consoleHasTLS = true
			// Certificates used by the console instance
			externalCertSecretName := fmt.Sprintf("%s-console-external-certificates", secretName)
			certificates := []*models.KeyPairConfiguration{tenantReq.TLS.Console}
			externalCertSecret, err := createOrReplaceExternalCertSecrets(ctx, &k8sClient, ns, certificates, externalCertSecretName, tenantName)
			if err != nil {
				return nil, prepareError(errorGeneric)
			}
			if len(externalCertSecret) > 0 {
				minInst.Spec.Console.ExternalCertSecret = externalCertSecret[0]
			}
		}

		// If IDP is not already enabled via LDAP (Active Directory) and OIDC configuration is present then
		// enable oidc for console
		if !idpEnabled && tenantReq.Idp != nil && tenantReq.Idp.Oidc != nil {
			url := *tenantReq.Idp.Oidc.URL
			clientID := *tenantReq.Idp.Oidc.ClientID
			secretID := *tenantReq.Idp.Oidc.SecretID
			if url != "" && clientID != "" && secretID != "" {
				instanceSecret.Data["CONSOLE_IDP_URL"] = []byte(url)
				instanceSecret.Data["CONSOLE_IDP_CLIENT_ID"] = []byte(clientID)
				instanceSecret.Data["CONSOLE_IDP_SECRET"] = []byte(secretID)
				consoleScheme := "http"
				consolePort := 9090
				// If Console will be deployed with TLS enabled (using AutoCert or External certificates)
				if consoleHasTLS {
					consoleScheme = "https"
					consolePort = 9443
				}
				// https://[HOSTNAME]:9443 will be replaced by javascript in the browser to use the actual hostname
				// assigned to Console, eg: https://localhost:9443
				instanceSecret.Data["CONSOLE_IDP_CALLBACK"] = []byte(fmt.Sprintf("%s://[HOSTNAME]:%d/oauth_callback", consoleScheme, consolePort))
			}
		}

		_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &instanceSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, prepareError(errorGeneric)
		}

		// Set Labels, Annotations and Node Selector for Console
		if tenantReq.Console != nil {
			minInst.Spec.Console.Annotations = tenantReq.Console.Annotations
			minInst.Spec.Console.Labels = tenantReq.Console.Labels
			minInst.Spec.Console.NodeSelector = tenantReq.Console.NodeSelector
		}
	}

	// add annotations
	var annotations map[string]string

	if len(tenantReq.Annotations) > 0 {
		annotations = tenantReq.Annotations
		minInst.Annotations = annotations
	}
	// set the zones if they are provided
	for _, zone := range tenantReq.Zones {
		zone, err := parseTenantZoneRequest(zone)
		if err != nil {
			return nil, prepareError(err)
		}
		minInst.Spec.Zones = append(minInst.Spec.Zones, *zone)
	}

	// Set Mount Path if provided
	if tenantReq.MounthPath != "" {
		minInst.Spec.Mountpath = tenantReq.MounthPath
	}

	// We accept either `image_pull_secret` or the individual details of the `image_registry` but not both
	var imagePullSecret string

	if tenantReq.ImagePullSecret != "" {
		imagePullSecret = tenantReq.ImagePullSecret
	} else if imagePullSecret, err = setImageRegistry(ctx, tenantReq.ImageRegistry, clientSet.CoreV1(), ns, tenantName); err != nil {
		return nil, prepareError(err)
	}
	// pass the image pull secret to the Tenant
	if imagePullSecret != "" {
		minInst.Spec.ImagePullSecret = corev1.LocalObjectReference{
			Name: imagePullSecret,
		}
	}

	// prometheus annotations support
	if tenantReq.EnablePrometheus != nil && *tenantReq.EnablePrometheus && minInst.Annotations != nil {
		minInst.Annotations[prometheusPath] = "/minio/prometheus/metrics"
		minInst.Annotations[prometheusPort] = fmt.Sprint(operator.MinIOPort)
		minInst.Annotations[prometheusScrape] = "true"
	}

	// set console image if provided
	if tenantReq.ConsoleImage != "" {
		minInst.Spec.Console.Image = tenantReq.ConsoleImage
	}

	opClient, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	_, err = opClient.MinioV1().Tenants(ns).Create(context.Background(), &minInst, metav1.CreateOptions{})
	if err != nil {
		return nil, prepareError(err)
	}

	// Integratrions
	if os.Getenv("GKE_INTEGRATION") != "" {
		err := gkeIntegration(clientSet, tenantName, ns, session.SessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
	}
	response = &models.CreateTenantResponse{}
	// Attach Console Credentials
	if enableConsole {
		response.Console = &models.CreateTenantResponseConsole{
			AccessKey: consoleAccess,
			SecretKey: consoleSecret,
		}
	}
	return response, nil
}

// setImageRegistry creates a secret to store the private registry credentials, if one exist it updates the existing one
// returns the name of the secret created/updated
func setImageRegistry(ctx context.Context, req *models.ImageRegistry, clientset v1.CoreV1Interface, namespace, tenantName string) (string, error) {
	if req == nil || req.Registry == nil || req.Username == nil || req.Password == nil {
		return "", nil
	}

	credentials := make(map[string]imageRegistryCredentials)
	// username:password encoded
	authData := []byte(fmt.Sprintf("%s:%s", *req.Username, *req.Password))
	authStr := base64.StdEncoding.EncodeToString(authData)

	credentials[*req.Registry] = imageRegistryCredentials{
		Username: *req.Username,
		Password: *req.Password,
		Auth:     authStr,
	}
	imRegistry := imageRegistry{
		Auths: credentials,
	}
	imRegistryJSON, err := json.Marshal(imRegistry)
	if err != nil {
		return "", err
	}

	pullSecretName := fmt.Sprintf("%s-regcred", tenantName)
	secretCredentials := map[string][]byte{
		corev1.DockerConfigJsonKey: []byte(string(imRegistryJSON)),
	}
	// Get or Create secret if it doesn't exist
	currentSecret, err := clientset.Secrets(namespace).Get(ctx, pullSecretName, metav1.GetOptions{})
	if err != nil {
		if k8sErrors.IsNotFound(err) {
			instanceSecret := corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name: pullSecretName,
					Labels: map[string]string{
						operator.TenantLabel: tenantName,
					},
				},
				Data: secretCredentials,
				Type: corev1.SecretTypeDockerConfigJson,
			}
			_, err = clientset.Secrets(namespace).Create(ctx, &instanceSecret, metav1.CreateOptions{})
			if err != nil {
				return "", err
			}
			return pullSecretName, nil
		}
		return "", err
	}
	currentSecret.Data = secretCredentials
	_, err = clientset.Secrets(namespace).Update(ctx, currentSecret, metav1.UpdateOptions{})
	if err != nil {
		return "", err
	}
	return pullSecretName, nil
}

// updateTenantAction does an update on the minioTenant by patching the desired changes
func updateTenantAction(ctx context.Context, operatorClient OperatorClientI, clientset v1.CoreV1Interface, httpCl cluster.HTTPClientI, namespace string, params admin_api.UpdateTenantParams) error {
	imageToUpdate := params.Body.Image
	imageRegistryReq := params.Body.ImageRegistry

	minInst, err := operatorClient.TenantGet(ctx, namespace, params.Tenant, metav1.GetOptions{})
	if err != nil {
		return err
	}
	// we can take either the `image_pull_secret` of the `image_registry` but not both
	if params.Body.ImagePullSecret != "" {
		minInst.Spec.ImagePullSecret.Name = params.Body.ImagePullSecret
	} else {
		// update the image pull secret content
		if _, err := setImageRegistry(ctx, imageRegistryReq, clientset, namespace, params.Tenant); err != nil {
			log.Println("error setting image registry secret:", err)
			return err
		}
	}

	// update the console image
	if strings.TrimSpace(params.Body.ConsoleImage) != "" && minInst.Spec.Console != nil {
		minInst.Spec.Console.Image = params.Body.ConsoleImage
	}

	// if image to update is empty we'll use the latest image by default
	if strings.TrimSpace(imageToUpdate) != "" {
		minInst.Spec.Image = imageToUpdate
	} else {
		im, err := cluster.GetLatestMinioImage(httpCl)
		// if we can't get the MinIO image, we won' auto-update it unless it's explicit by name
		if err == nil {
			minInst.Spec.Image = *im
		}
	}

	// Prometheus Annotations
	currentAnnotations := minInst.Annotations
	prometheusAnnotations := map[string]string{
		prometheusPath:   "/minio/prometheus/metrics",
		prometheusPort:   fmt.Sprint(operator.MinIOPort),
		prometheusScrape: "true",
	}
	if params.Body.EnablePrometheus && currentAnnotations != nil {
		// add prometheus annotations to the tenant
		minInst.Annotations = addAnnotations(currentAnnotations, prometheusAnnotations)
		// add prometheus annotations to the each zone
		if minInst.Spec.Zones != nil {
			for _, zone := range minInst.Spec.Zones {
				zoneAnnotations := zone.VolumeClaimTemplate.GetObjectMeta().GetAnnotations()
				zone.VolumeClaimTemplate.GetObjectMeta().SetAnnotations(addAnnotations(zoneAnnotations, prometheusAnnotations))
			}
		}
	} else {
		// remove prometheus annotations to the tenant
		minInst.Annotations = removeAnnotations(currentAnnotations, prometheusAnnotations)
		// add prometheus annotations from each zone
		if minInst.Spec.Zones != nil {
			for _, zone := range minInst.Spec.Zones {
				zoneAnnotations := zone.VolumeClaimTemplate.GetObjectMeta().GetAnnotations()
				zone.VolumeClaimTemplate.GetObjectMeta().SetAnnotations(removeAnnotations(zoneAnnotations, prometheusAnnotations))
			}
		}
	}

	payloadBytes, err := json.Marshal(minInst)
	if err != nil {
		return err
	}
	_, err = operatorClient.TenantPatch(ctx, namespace, minInst.Name, types.MergePatchType, payloadBytes, metav1.PatchOptions{})
	if err != nil {
		return err
	}
	return nil
}

// addAnnotations will merge two annotation maps
func addAnnotations(annotationsOne, annotationsTwo map[string]string) map[string]string {
	if annotationsOne == nil {
		annotationsOne = map[string]string{}
	}
	for key, value := range annotationsTwo {
		annotationsOne[key] = value
	}
	return annotationsOne
}

// removeAnnotations will remove keys from the first annotations map based on the second one
func removeAnnotations(annotationsOne, annotationsTwo map[string]string) map[string]string {
	if annotationsOne == nil {
		annotationsOne = map[string]string{}
	}
	for key := range annotationsTwo {
		delete(annotationsOne, key)
	}
	return annotationsOne
}

func getUpdateTenantResponse(session *models.Principal, params admin_api.UpdateTenantParams) *models.Error {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return prepareError(err)
	}
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
		return prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	httpC := &cluster.HTTPClient{
		Client: &http.Client{
			Timeout: 4 * time.Second,
		},
	}
	if err := updateTenantAction(ctx, opClient, clientSet.CoreV1(), httpC, params.Namespace, params); err != nil {
		return prepareError(err, errors.New("unable to update tenant"))
	}
	return nil
}

// addTenantZone creates a zone to a defined tenant
func addTenantZone(ctx context.Context, operatorClient OperatorClientI, params admin_api.TenantAddZoneParams) error {
	tenant, err := operatorClient.TenantGet(ctx, params.Namespace, params.Tenant, metav1.GetOptions{})
	if err != nil {
		return err
	}

	zoneParams := params.Body
	zone, err := parseTenantZoneRequest(zoneParams)
	if err != nil {
		return err
	}
	tenant.Spec.Zones = append(tenant.Spec.Zones, *zone)
	payloadBytes, err := json.Marshal(tenant)
	if err != nil {
		return err
	}

	_, err = operatorClient.TenantPatch(ctx, params.Namespace, tenant.Name, types.MergePatchType, payloadBytes, metav1.PatchOptions{})
	if err != nil {
		return err
	}
	return nil
}

func getTenantAddZoneResponse(session *models.Principal, params admin_api.TenantAddZoneParams) *models.Error {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	if err := addTenantZone(ctx, opClient, params); err != nil {
		return prepareError(err, errors.New("unable to add zone"))
	}
	return nil
}

// getTenantUsageResponse returns the usage of a tenant
func getTenantUsageResponse(session *models.Principal, params admin_api.GetTenantUsageParams) (*models.TenantUsage, *models.Error) {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	clientSet, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}
	k8sClient := &k8sClient{
		client: clientSet,
	}

	minTenant, err := getTenant(ctx, opClient, params.Namespace, params.Tenant)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	minTenant.EnsureDefaults()

	svcURL := GetTenantServiceURL(minTenant)

	mAdmin, err := getTenantAdminClient(
		ctx,
		k8sClient,
		minTenant,
		svcURL,
		true)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// serialize output
	adminInfo, err := getAdminInfo(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	info := &models.TenantUsage{Used: adminInfo.Usage, DiskUsed: adminInfo.DisksUsage}
	return info, nil
}

// parseTenantZoneRequest parse zone request and returns the equivalent
// operator.Zone object
func parseTenantZoneRequest(zoneParams *models.Zone) (*operator.Zone, error) {
	if zoneParams.VolumeConfiguration == nil {
		return nil, errors.New("a volume configuration must be specified")
	}

	if zoneParams.VolumeConfiguration.Size == nil || *zoneParams.VolumeConfiguration.Size <= int64(0) {
		return nil, errors.New("volume size must be greater than 0")
	}

	if zoneParams.Servers == nil || *zoneParams.Servers <= 0 {
		return nil, errors.New("number of servers must be greater than 0")
	}

	if zoneParams.VolumesPerServer == nil || *zoneParams.VolumesPerServer <= 0 {
		return nil, errors.New("number of volumes per server must be greater than 0")
	}

	volumeSize := resource.NewQuantity(*zoneParams.VolumeConfiguration.Size, resource.DecimalExponent)
	volTemp := corev1.PersistentVolumeClaimSpec{
		AccessModes: []corev1.PersistentVolumeAccessMode{
			corev1.ReadWriteOnce,
		},
		Resources: corev1.ResourceRequirements{
			Requests: corev1.ResourceList{
				corev1.ResourceStorage: *volumeSize,
			},
		},
	}
	if zoneParams.VolumeConfiguration.StorageClassName != "" {
		volTemp.StorageClassName = &zoneParams.VolumeConfiguration.StorageClassName
	}

	// parse resources' requests
	resourcesRequests := make(corev1.ResourceList)
	resourcesLimits := make(corev1.ResourceList)
	if zoneParams.Resources != nil {
		for key, val := range zoneParams.Resources.Requests {
			resourcesRequests[corev1.ResourceName(key)] = *resource.NewQuantity(val, resource.BinarySI)
		}
		for key, val := range zoneParams.Resources.Limits {
			resourcesLimits[corev1.ResourceName(key)] = *resource.NewQuantity(val, resource.BinarySI)
		}
	}

	// parse Node Affinity
	nodeSelectorTerms := []corev1.NodeSelectorTerm{}
	preferredSchedulingTerm := []corev1.PreferredSchedulingTerm{}
	if zoneParams.Affinity != nil && zoneParams.Affinity.NodeAffinity != nil {
		if zoneParams.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution != nil {
			for _, elem := range zoneParams.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms {
				term := parseModelsNodeSelectorTerm(elem)
				nodeSelectorTerms = append(nodeSelectorTerms, term)
			}
		}
		for _, elem := range zoneParams.Affinity.NodeAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			pst := corev1.PreferredSchedulingTerm{
				Weight:     *elem.Weight,
				Preference: parseModelsNodeSelectorTerm(elem.Preference),
			}
			preferredSchedulingTerm = append(preferredSchedulingTerm, pst)
		}
	}
	var nodeAffinity *corev1.NodeAffinity
	if len(nodeSelectorTerms) > 0 || len(preferredSchedulingTerm) > 0 {
		nodeAffinity = &corev1.NodeAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution: &corev1.NodeSelector{
				NodeSelectorTerms: nodeSelectorTerms,
			},
			PreferredDuringSchedulingIgnoredDuringExecution: preferredSchedulingTerm,
		}
	}

	// parse Pod Affinity
	podAffinityTerms := []corev1.PodAffinityTerm{}
	weightedPodAffinityTerms := []corev1.WeightedPodAffinityTerm{}
	if zoneParams.Affinity != nil && zoneParams.Affinity.PodAffinity != nil {
		for _, elem := range zoneParams.Affinity.PodAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAffinityTerms = append(podAffinityTerms, parseModelPodAffinityTerm(elem))
		}
		for _, elem := range zoneParams.Affinity.PodAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			wAffinityTerm := corev1.WeightedPodAffinityTerm{
				Weight:          *elem.Weight,
				PodAffinityTerm: parseModelPodAffinityTerm(elem.PodAffinityTerm),
			}
			weightedPodAffinityTerms = append(weightedPodAffinityTerms, wAffinityTerm)
		}
	}
	var podAffinity *corev1.PodAffinity
	if len(podAffinityTerms) > 0 || len(weightedPodAffinityTerms) > 0 {
		podAffinity = &corev1.PodAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution:  podAffinityTerms,
			PreferredDuringSchedulingIgnoredDuringExecution: weightedPodAffinityTerms,
		}
	}

	// parse Pod Anti Affinity
	podAntiAffinityTerms := []corev1.PodAffinityTerm{}
	weightedPodAntiAffinityTerms := []corev1.WeightedPodAffinityTerm{}
	if zoneParams.Affinity != nil && zoneParams.Affinity.PodAntiAffinity != nil {
		for _, elem := range zoneParams.Affinity.PodAntiAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAntiAffinityTerms = append(podAntiAffinityTerms, parseModelPodAffinityTerm(elem))
		}
		for _, elem := range zoneParams.Affinity.PodAntiAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			wAffinityTerm := corev1.WeightedPodAffinityTerm{
				Weight:          *elem.Weight,
				PodAffinityTerm: parseModelPodAffinityTerm(elem.PodAffinityTerm),
			}
			weightedPodAntiAffinityTerms = append(weightedPodAntiAffinityTerms, wAffinityTerm)
		}
	}
	var podAntiAffinity *corev1.PodAntiAffinity
	if len(podAntiAffinityTerms) > 0 || len(weightedPodAntiAffinityTerms) > 0 {
		podAntiAffinity = &corev1.PodAntiAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution:  podAntiAffinityTerms,
			PreferredDuringSchedulingIgnoredDuringExecution: weightedPodAntiAffinityTerms,
		}
	}

	var affinity *corev1.Affinity
	if nodeAffinity != nil || podAffinity != nil || podAntiAffinity != nil {
		affinity = &corev1.Affinity{
			NodeAffinity:    nodeAffinity,
			PodAffinity:     podAffinity,
			PodAntiAffinity: podAntiAffinity,
		}
	}

	// parse tolerations
	tolerations := []corev1.Toleration{}
	for _, elem := range zoneParams.Tolerations {
		var tolerationSeconds *int64
		if elem.TolerationSeconds != nil {
			// elem.TolerationSeconds.Seconds is allowed to be nil
			tolerationSeconds = elem.TolerationSeconds.Seconds
		}

		toleration := corev1.Toleration{
			Key:               elem.Key,
			Operator:          corev1.TolerationOperator(elem.Operator),
			Value:             elem.Value,
			Effect:            corev1.TaintEffect(elem.Effect),
			TolerationSeconds: tolerationSeconds,
		}
		tolerations = append(tolerations, toleration)
	}

	// Pass annotations to the volume
	vct := &corev1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name:        "data",
			Labels:      zoneParams.VolumeConfiguration.Labels,
			Annotations: zoneParams.VolumeConfiguration.Annotations,
		},
		Spec: volTemp,
	}

	zone := &operator.Zone{
		Name:                zoneParams.Name,
		Servers:             int32(*zoneParams.Servers),
		VolumesPerServer:    *zoneParams.VolumesPerServer,
		VolumeClaimTemplate: vct,
		Resources: corev1.ResourceRequirements{
			Requests: resourcesRequests,
			Limits:   resourcesLimits,
		},
		NodeSelector: zoneParams.NodeSelector,
		Affinity:     affinity,
		Tolerations:  tolerations,
	}
	return zone, nil
}

func parseModelPodAffinityTerm(term *models.PodAffinityTerm) corev1.PodAffinityTerm {
	labelMatchExpressions := []metav1.LabelSelectorRequirement{}
	for _, exp := range term.LabelSelector.MatchExpressions {
		labelSelectorReq := metav1.LabelSelectorRequirement{
			Key:      *exp.Key,
			Operator: metav1.LabelSelectorOperator(*exp.Operator),
			Values:   exp.Values,
		}
		labelMatchExpressions = append(labelMatchExpressions, labelSelectorReq)
	}

	podAffinityTerm := corev1.PodAffinityTerm{
		LabelSelector: &metav1.LabelSelector{
			MatchExpressions: labelMatchExpressions,
			MatchLabels:      term.LabelSelector.MatchLabels,
		},
		Namespaces:  term.Namespaces,
		TopologyKey: *term.TopologyKey,
	}
	return podAffinityTerm
}

func parseModelsNodeSelectorTerm(elem *models.NodeSelectorTerm) corev1.NodeSelectorTerm {
	var term corev1.NodeSelectorTerm
	for _, matchExpression := range elem.MatchExpressions {
		matchExp := corev1.NodeSelectorRequirement{
			Key:      *matchExpression.Key,
			Operator: corev1.NodeSelectorOperator(*matchExpression.Operator),
			Values:   matchExpression.Values,
		}
		term.MatchExpressions = append(term.MatchExpressions, matchExp)
	}
	for _, matchField := range elem.MatchFields {
		matchF := corev1.NodeSelectorRequirement{
			Key:      *matchField.Key,
			Operator: corev1.NodeSelectorOperator(*matchField.Operator),
			Values:   matchField.Values,
		}
		term.MatchFields = append(term.MatchFields, matchF)
	}
	return term
}

// parseTenantZone operator Zone object and returns the equivalent
// models.Zone object
func parseTenantZone(zone *operator.Zone) *models.Zone {
	var size *int64
	var storageClassName string
	if zone.VolumeClaimTemplate != nil {
		size = swag.Int64(zone.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value())
		if zone.VolumeClaimTemplate.Spec.StorageClassName != nil {
			storageClassName = *zone.VolumeClaimTemplate.Spec.StorageClassName
		}
	}

	// parse resources' requests
	var resources *models.ZoneResources
	resourcesRequests := make(map[string]int64)
	resourcesLimits := make(map[string]int64)
	for key, val := range zone.Resources.Requests {
		resourcesRequests[key.String()] = val.Value()
	}
	for key, val := range zone.Resources.Limits {
		resourcesLimits[key.String()] = val.Value()
	}
	if len(resourcesRequests) > 0 || len(resourcesLimits) > 0 {
		resources = &models.ZoneResources{
			Limits:   resourcesLimits,
			Requests: resourcesRequests,
		}
	}

	// parse Node Affinity
	nodeSelectorTerms := []*models.NodeSelectorTerm{}
	preferredSchedulingTerm := []*models.ZoneAffinityNodeAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{}

	if zone.Affinity != nil && zone.Affinity.NodeAffinity != nil {
		if zone.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution != nil {
			for _, elem := range zone.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms {
				term := parseNodeSelectorTerm(&elem)
				nodeSelectorTerms = append(nodeSelectorTerms, term)
			}
		}
		for _, elem := range zone.Affinity.NodeAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			pst := &models.ZoneAffinityNodeAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{
				Weight:     swag.Int32(elem.Weight),
				Preference: parseNodeSelectorTerm(&elem.Preference),
			}
			preferredSchedulingTerm = append(preferredSchedulingTerm, pst)
		}
	}

	var nodeAffinity *models.ZoneAffinityNodeAffinity
	if len(nodeSelectorTerms) > 0 || len(preferredSchedulingTerm) > 0 {
		nodeAffinity = &models.ZoneAffinityNodeAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution: &models.ZoneAffinityNodeAffinityRequiredDuringSchedulingIgnoredDuringExecution{
				NodeSelectorTerms: nodeSelectorTerms,
			},
			PreferredDuringSchedulingIgnoredDuringExecution: preferredSchedulingTerm,
		}
	}

	// parse Pod Affinity
	podAffinityTerms := []*models.PodAffinityTerm{}
	weightedPodAffinityTerms := []*models.ZoneAffinityPodAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{}

	if zone.Affinity != nil && zone.Affinity.PodAffinity != nil {
		for _, elem := range zone.Affinity.PodAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAffinityTerms = append(podAffinityTerms, parsePodAffinityTerm(&elem))
		}
		for _, elem := range zone.Affinity.PodAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			wAffinityTerm := &models.ZoneAffinityPodAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{
				Weight:          swag.Int32(elem.Weight),
				PodAffinityTerm: parsePodAffinityTerm(&elem.PodAffinityTerm),
			}
			weightedPodAffinityTerms = append(weightedPodAffinityTerms, wAffinityTerm)
		}
	}
	var podAffinity *models.ZoneAffinityPodAffinity
	if len(podAffinityTerms) > 0 || len(weightedPodAffinityTerms) > 0 {
		podAffinity = &models.ZoneAffinityPodAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution:  podAffinityTerms,
			PreferredDuringSchedulingIgnoredDuringExecution: weightedPodAffinityTerms,
		}
	}

	// parse Pod Anti Affinity
	podAntiAffinityTerms := []*models.PodAffinityTerm{}
	weightedPodAntiAffinityTerms := []*models.ZoneAffinityPodAntiAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{}

	if zone.Affinity != nil && zone.Affinity.PodAntiAffinity != nil {
		for _, elem := range zone.Affinity.PodAntiAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAntiAffinityTerms = append(podAntiAffinityTerms, parsePodAffinityTerm(&elem))
		}
		for _, elem := range zone.Affinity.PodAntiAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			wAffinityTerm := &models.ZoneAffinityPodAntiAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{
				Weight:          swag.Int32(elem.Weight),
				PodAffinityTerm: parsePodAffinityTerm(&elem.PodAffinityTerm),
			}
			weightedPodAntiAffinityTerms = append(weightedPodAntiAffinityTerms, wAffinityTerm)
		}
	}

	var podAntiAffinity *models.ZoneAffinityPodAntiAffinity
	if len(podAntiAffinityTerms) > 0 || len(weightedPodAntiAffinityTerms) > 0 {
		podAntiAffinity = &models.ZoneAffinityPodAntiAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution:  podAntiAffinityTerms,
			PreferredDuringSchedulingIgnoredDuringExecution: weightedPodAntiAffinityTerms,
		}
	}

	// build affinity object
	var affinity *models.ZoneAffinity
	if nodeAffinity != nil || podAffinity != nil || podAntiAffinity != nil {
		affinity = &models.ZoneAffinity{
			NodeAffinity:    nodeAffinity,
			PodAffinity:     podAffinity,
			PodAntiAffinity: podAntiAffinity,
		}
	}

	// parse tolerations
	var tolerations models.ZoneTolerations
	for _, elem := range zone.Tolerations {
		var tolerationSecs *models.ZoneTolerationSeconds
		if elem.TolerationSeconds != nil {
			tolerationSecs = &models.ZoneTolerationSeconds{
				Seconds: elem.TolerationSeconds,
			}
		}
		toleration := &models.ZoneTolerationsItems0{
			Key:               elem.Key,
			Operator:          string(elem.Operator),
			Value:             elem.Value,
			Effect:            string(elem.Effect),
			TolerationSeconds: tolerationSecs,
		}
		tolerations = append(tolerations, toleration)
	}

	zoneModel := &models.Zone{
		Name:             zone.Name,
		Servers:          swag.Int64(int64(zone.Servers)),
		VolumesPerServer: swag.Int32(zone.VolumesPerServer),
		VolumeConfiguration: &models.ZoneVolumeConfiguration{
			Size:             size,
			StorageClassName: storageClassName,
		},
		NodeSelector: zone.NodeSelector,
		Resources:    resources,
		Affinity:     affinity,
		Tolerations:  tolerations,
	}
	return zoneModel
}

func parsePodAffinityTerm(term *corev1.PodAffinityTerm) *models.PodAffinityTerm {
	labelMatchExpressions := []*models.PodAffinityTermLabelSelectorMatchExpressionsItems0{}
	for _, exp := range term.LabelSelector.MatchExpressions {
		labelSelectorReq := &models.PodAffinityTermLabelSelectorMatchExpressionsItems0{
			Key:      swag.String(exp.Key),
			Operator: swag.String(string(exp.Operator)),
			Values:   exp.Values,
		}
		labelMatchExpressions = append(labelMatchExpressions, labelSelectorReq)
	}

	podAffinityTerm := &models.PodAffinityTerm{
		LabelSelector: &models.PodAffinityTermLabelSelector{
			MatchExpressions: labelMatchExpressions,
			MatchLabels:      term.LabelSelector.MatchLabels,
		},
		Namespaces:  term.Namespaces,
		TopologyKey: swag.String(term.TopologyKey),
	}
	return podAffinityTerm
}

func parseNodeSelectorTerm(term *corev1.NodeSelectorTerm) *models.NodeSelectorTerm {
	var t models.NodeSelectorTerm
	for _, matchExpression := range term.MatchExpressions {
		matchExp := &models.NodeSelectorTermMatchExpressionsItems0{
			Key:      swag.String(matchExpression.Key),
			Operator: swag.String(string(matchExpression.Operator)),
			Values:   matchExpression.Values,
		}
		t.MatchExpressions = append(t.MatchExpressions, matchExp)
	}
	for _, matchField := range term.MatchFields {
		matchF := &models.NodeSelectorTermMatchFieldsItems0{
			Key:      swag.String(matchField.Key),
			Operator: swag.String(string(matchField.Operator)),
			Values:   matchField.Values,
		}
		t.MatchFields = append(t.MatchFields, matchF)
	}
	return &t
}

func getTenantUpdateZoneResponse(session *models.Principal, params admin_api.TenantUpdateZonesParams) (*models.Tenant, *models.Error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}

	t, err := updateTenantZones(ctx, opClient, params.Namespace, params.Tenant, params.Body.Zones)
	if err != nil {
		log.Println("error updating Tenant's zones:", err)
		return nil, prepareError(err)
	}

	// parse it to models.Tenant
	tenant := getTenantInfo(t)
	return tenant, nil
}

// updateTenantZones Sets the Tenant's zones to the ones provided by the request
//
// It does the equivalent to a PUT request on Tenant's zones
func updateTenantZones(
	ctx context.Context,
	operatorClient OperatorClientI,
	namespace string,
	tenantName string,
	zonesReq []*models.Zone) (*operator.Tenant, error) {

	minInst, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	// set the zones if they are provided
	var newZoneArray []operator.Zone
	for _, zone := range zonesReq {
		zone, err := parseTenantZoneRequest(zone)
		if err != nil {
			return nil, err
		}
		newZoneArray = append(newZoneArray, *zone)
	}

	// replace zones array
	minInst.Spec.Zones = newZoneArray

	minInst = minInst.DeepCopy()
	minInst.EnsureDefaults()

	payloadBytes, err := json.Marshal(minInst)
	if err != nil {
		return nil, err
	}
	tenantUpdated, err := operatorClient.TenantPatch(ctx, namespace, minInst.Name, types.MergePatchType, payloadBytes, metav1.PatchOptions{})
	if err != nil {
		return nil, err
	}
	return tenantUpdated, nil
}

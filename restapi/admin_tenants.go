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
	"bytes"
	"context"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/minio/console/pkg/auth/utils"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/serializer"

	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/apimachinery/pkg/types"

	corev1 "k8s.io/api/core/v1"

	"github.com/minio/console/cluster"
	"github.com/minio/madmin-go"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sJson "k8s.io/apimachinery/pkg/runtime/serializer/json"
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
	api.AdminAPITenantDetailsHandler = admin_api.TenantDetailsHandlerFunc(func(params admin_api.TenantDetailsParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantDetailsResponse(session, params)
		if err != nil {
			return admin_api.NewTenantDetailsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantDetailsOK().WithPayload(resp)

	})

	// Tenant Security details
	api.AdminAPITenantSecurityHandler = admin_api.TenantSecurityHandlerFunc(func(params admin_api.TenantSecurityParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantSecurityResponse(session, params)
		if err != nil {
			return admin_api.NewTenantSecurityDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantSecurityOK().WithPayload(resp)

	})

	// Update Tenant Security configuration
	api.AdminAPIUpdateTenantSecurityHandler = admin_api.UpdateTenantSecurityHandlerFunc(func(params admin_api.UpdateTenantSecurityParams, session *models.Principal) middleware.Responder {
		err := getUpdateTenantSecurityResponse(session, params)
		if err != nil {
			return admin_api.NewUpdateTenantSecurityDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewUpdateTenantSecurityNoContent()

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

	// Add Tenant Pools
	api.AdminAPITenantAddPoolHandler = admin_api.TenantAddPoolHandlerFunc(func(params admin_api.TenantAddPoolParams, session *models.Principal) middleware.Responder {
		err := getTenantAddPoolResponse(session, params)
		if err != nil {
			return admin_api.NewTenantAddPoolDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantAddPoolCreated()
	})

	// Get Tenant Usage
	api.AdminAPIGetTenantUsageHandler = admin_api.GetTenantUsageHandlerFunc(func(params admin_api.GetTenantUsageParams, session *models.Principal) middleware.Responder {
		payload, err := getTenantUsageResponse(session, params)
		if err != nil {
			return admin_api.NewGetTenantUsageDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetTenantUsageOK().WithPayload(payload)
	})

	api.AdminAPIGetTenantPodsHandler = admin_api.GetTenantPodsHandlerFunc(func(params admin_api.GetTenantPodsParams, session *models.Principal) middleware.Responder {
		payload, err := getTenantPodsResponse(session, params)
		if err != nil {
			return admin_api.NewGetTenantPodsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetTenantPodsOK().WithPayload(payload)
	})

	api.AdminAPIGetPodLogsHandler = admin_api.GetPodLogsHandlerFunc(func(params admin_api.GetPodLogsParams, session *models.Principal) middleware.Responder {
		payload, err := getPodLogsResponse(session, params)
		if err != nil {
			return admin_api.NewGetPodLogsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetPodLogsOK().WithPayload(payload)
	})

	api.AdminAPIGetPodEventsHandler = admin_api.GetPodEventsHandlerFunc(func(params admin_api.GetPodEventsParams, session *models.Principal) middleware.Responder {
		payload, err := getPodEventsResponse(session, params)
		if err != nil {
			return admin_api.NewGetPodEventsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetPodEventsOK().WithPayload(payload)
	})

	// Update Tenant Pools
	api.AdminAPITenantUpdatePoolsHandler = admin_api.TenantUpdatePoolsHandlerFunc(func(params admin_api.TenantUpdatePoolsParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantUpdatePoolResponse(session, params)
		if err != nil {
			return admin_api.NewTenantUpdatePoolsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTenantUpdatePoolsOK().WithPayload(resp)
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

	// Get Tenant YAML
	api.AdminAPIGetTenantYAMLHandler = admin_api.GetTenantYAMLHandlerFunc(func(params admin_api.GetTenantYAMLParams, principal *models.Principal) middleware.Responder {
		payload, err := getTenantYAML(principal, params)
		if err != nil {
			return admin_api.NewGetTenantYAMLDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetTenantYAMLOK().WithPayload(payload)
	})
	// Update Tenant YAML
	api.AdminAPIPutTenantYAMLHandler = admin_api.PutTenantYAMLHandlerFunc(func(params admin_api.PutTenantYAMLParams, principal *models.Principal) middleware.Responder {
		err := getUpdateTenantYAML(principal, params)
		if err != nil {
			return admin_api.NewPutTenantYAMLDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewPutTenantYAMLCreated()
	})
}

// getDeleteTenantResponse gets the output of deleting a minio instance
func getDeleteTenantResponse(session *models.Principal, params admin_api.DeleteTenantParams) *models.Error {
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err)
	}
	// get Kubernetes Client
	clientset, err := cluster.K8sClient(session.STSSessionToken)
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
			LabelSelector: fmt.Sprintf("%s=%s", miniov2.TenantLabel, tenantName),
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
func GetTenantServiceURL(mi *miniov2.Tenant) (svcURL string) {
	scheme := "http"
	port := miniov2.MinIOPortLoadBalancerSVC
	if mi.AutoCert() || mi.ExternalCert() {
		scheme = "https"
		port = miniov2.MinIOTLSPortLoadBalancerSVC
	}
	return fmt.Sprintf("%s://%s", scheme, net.JoinHostPort(mi.MinIOFQDNServiceName(), strconv.Itoa(port)))
}

func getTenantAdminClient(ctx context.Context, client K8sClientI, tenant *miniov2.Tenant, svcURL string) (*madmin.AdminClient, error) {
	tenantCreds, err := getTenantCreds(ctx, client, tenant)
	if err != nil {
		return nil, err
	}
	sessionToken := ""
	mAdmin, pErr := NewAdminClientWithInsecure(svcURL, tenantCreds.accessKey, tenantCreds.secretKey, sessionToken, false)
	if pErr != nil {
		return nil, pErr.Cause
	}
	return mAdmin, nil
}

type tenantKeys struct {
	accessKey string
	secretKey string
}

func getTenantCreds(ctx context.Context, client K8sClientI, tenant *miniov2.Tenant) (*tenantKeys, error) {
	if tenant == nil || tenant.Spec.CredsSecret == nil {
		return nil, errors.New("invalid arguments")
	}
	// get admin credentials from secret
	creds, err := client.getSecret(ctx, tenant.Namespace, tenant.Spec.CredsSecret.Name, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	tenantAccessKey, ok := creds.Data["accesskey"]
	if !ok {
		LogError("tenant's secret doesn't contain accesskey")
		return nil, errorGeneric
	}
	tenantSecretKey, ok := creds.Data["secretkey"]
	if !ok {
		LogError("tenant's secret doesn't contain secretkey")
		return nil, errorGeneric
	}
	// TODO:
	// We need to avoid using minio root credentials to talk to tenants, and instead use a different user credentials
	// when that its implemented we also need to check here if the tenant has LDAP enabled so we authenticate first against AD
	return &tenantKeys{accessKey: string(tenantAccessKey), secretKey: string(tenantSecretKey)}, nil
}

func getTenant(ctx context.Context, operatorClient OperatorClientI, namespace, tenantName string) (*miniov2.Tenant, error) {
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

func getTenantInfo(tenant *miniov2.Tenant) *models.Tenant {
	var pools []*models.Pool
	consoleImage := ""
	var totalSize int64
	for _, p := range tenant.Spec.Pools {
		pools = append(pools, parseTenantPool(&p))
		poolSize := int64(p.Servers) * int64(p.VolumesPerServer) * p.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value()
		totalSize = totalSize + poolSize
	}
	var deletion string
	if tenant.ObjectMeta.DeletionTimestamp != nil {
		deletion = tenant.ObjectMeta.DeletionTimestamp.Format(time.RFC3339)
	}

	if tenant.HasConsoleEnabled() {
		consoleImage = tenant.Spec.Console.Image
	}

	return &models.Tenant{
		CreationDate:     tenant.ObjectMeta.CreationTimestamp.Format(time.RFC3339),
		DeletionDate:     deletion,
		Name:             tenant.Name,
		TotalSize:        totalSize,
		CurrentState:     tenant.Status.CurrentState,
		Pools:            pools,
		Namespace:        tenant.ObjectMeta.Namespace,
		Image:            tenant.Spec.Image,
		ConsoleImage:     consoleImage,
		EnablePrometheus: isPrometheusEnabled(tenant.Annotations),
	}
}

func getTenantDetailsResponse(session *models.Principal, params admin_api.TenantDetailsParams) (*models.Tenant, *models.Error) {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
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

	// detect if AD is enabled
	adEnabled := false
	for _, env := range minTenant.Spec.Env {
		if env.Name == "MINIO_IDENTITY_LDAP_SERVER_ADDR" && env.Value != "" {
			adEnabled = true
		}
	}

	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	k8sClient := k8sClient{
		client: clientSet,
	}

	// detect if OpenID is enabled

	oicEnabled := false
	consoleSelector := fmt.Sprintf("%s-console", minTenant.Name)
	consoleSecretName := fmt.Sprintf("%s-secret", consoleSelector)
	consoleSecret, err := clientSet.CoreV1().Secrets(minTenant.Namespace).Get(ctx, consoleSecretName, metav1.GetOptions{})
	// we can tolerate not getting this secret
	if err != nil {
		LogError("unable to fetch existing secrets for %s: %v", minTenant.Name, err)
	}
	if consoleSecret != nil {
		if _, ok := consoleSecret.Data["CONSOLE_IDP_URL"]; ok {
			oicEnabled = true
		}
	}
	if minTenant.HasConsoleEnabled() {
		for _, env := range minTenant.Spec.Console.Env {
			if env.Name == "CONSOLE_IDP_URL" {
				oicEnabled = true
			}
		}
	}

	info.LogEnabled = minTenant.HasLogEnabled()
	info.MonitoringEnabled = minTenant.HasPrometheusEnabled()
	info.EncryptionEnabled = minTenant.HasKESEnabled()
	info.IdpAdEnabled = adEnabled
	info.IdpOicEnabled = oicEnabled
	info.MinioTLS = minTenant.TLS()
	info.ConsoleTLS = minTenant.AutoCert() || minTenant.ConsoleExternalCert()
	info.ConsoleEnabled = minTenant.HasConsoleEnabled()

	if minTenant.Spec.Console != nil {
		// obtain current subnet license for tenant (if exists)
		license, _ := getSubscriptionLicense(context.Background(), &k8sClient, params.Namespace, minTenant.Spec.Console.ConsoleSecret.Name)
		if license != "" {
			client := &cluster.HTTPClient{
				Client: GetConsoleSTSClient(),
			}
			licenseInfo, _, _ := subscriptionValidate(client, license, "", "")
			// if licenseInfo is present attach it to the tenantInfo response
			if licenseInfo != nil {
				info.SubnetLicense = licenseInfo
			}
		}
	}

	// attach status information
	info.Status = &models.TenantStatus{
		HealthStatus:  string(minTenant.Status.HealthStatus),
		DrivesHealing: minTenant.Status.DrivesHealing,
		DrivesOffline: minTenant.Status.DrivesOffline,
		DrivesOnline:  minTenant.Status.DrivesOnline,
		WriteQuorum:   minTenant.Status.WriteQuorum,
	}

	// get tenant service
	minTenant.EnsureDefaults()
	//minio service
	minSvc, err := k8sClient.getService(ctx, minTenant.Namespace, minTenant.MinIOCIServiceName(), metav1.GetOptions{})
	if err != nil {
		// we can tolerate this error
		LogError("Unable to get MinIO service name: %v, continuing", err)
	}
	//console service
	conSvc, err := k8sClient.getService(ctx, minTenant.Namespace, minTenant.ConsoleCIServiceName(), metav1.GetOptions{})
	if err != nil {
		// we can tolerate this error
		LogError("Unable to get MinIO console service name: %v, continuing", err)
	}

	schema := "http"
	consoleSchema := "http"
	consolePort := ":9090"
	if minTenant.TLS() {
		schema = "https"
	}
	if minTenant.AutoCert() || minTenant.ConsoleExternalCert() {
		consoleSchema = "https"
		consolePort = ":9443"
	}
	var minioEndpoint string
	var consoleEndpoint string
	if minSvc != nil && len(minSvc.Status.LoadBalancer.Ingress) > 0 {
		if minSvc.Status.LoadBalancer.Ingress[0].IP != "" {
			minioEndpoint = fmt.Sprintf("%s://%s", schema, minSvc.Status.LoadBalancer.Ingress[0].IP)
		}

		if minSvc.Status.LoadBalancer.Ingress[0].Hostname != "" {
			minioEndpoint = fmt.Sprintf("%s://%s", schema, minSvc.Status.LoadBalancer.Ingress[0].Hostname)
		}

	}
	if conSvc != nil && len(conSvc.Status.LoadBalancer.Ingress) > 0 {
		if conSvc.Status.LoadBalancer.Ingress[0].IP != "" {
			consoleEndpoint = fmt.Sprintf("%s://%s%s", consoleSchema, conSvc.Status.LoadBalancer.Ingress[0].IP, consolePort)
		}
		if conSvc.Status.LoadBalancer.Ingress[0].Hostname != "" {
			consoleEndpoint = fmt.Sprintf("%s://%s%s", consoleSchema, conSvc.Status.LoadBalancer.Ingress[0].Hostname, consolePort)
		}
	}
	if minioEndpoint != "" || consoleEndpoint != "" {
		info.Endpoints = &models.TenantEndpoints{
			Console: consoleEndpoint,
			Minio:   minioEndpoint,
		}
	}

	return info, nil
}

// parseTenantCertificates convert public key pem certificates stored in k8s secrets for a given Tenant into x509 certificates
func parseTenantCertificates(ctx context.Context, clientSet K8sClientI, namespace string, secrets []*miniov2.LocalCertificateReference) ([]*models.CertificateInfo, error) {
	var certificates []*models.CertificateInfo
	publicKey := "public.crt"
	// Iterate over TLS secrets and build array of CertificateInfo structure
	// that will be used to display information about certs in the UI
	for _, secret := range secrets {
		keyPair, err := clientSet.getSecret(ctx, namespace, secret.Name, metav1.GetOptions{})
		if err != nil {
			return nil, err
		}
		if secret.Type == "kubernetes.io/tls" || secret.Type == "cert-manager.io/v1alpha2" {
			publicKey = "tls.crt"
		}
		// Extract public key from certificate TLS secret
		if rawCert, ok := keyPair.Data[publicKey]; ok {
			block, _ := pem.Decode(rawCert)
			if block == nil {
				// If certificate failed to decode skip
				continue
			}
			cert, err := x509.ParseCertificate(block.Bytes)
			if err != nil {
				return nil, err
			}
			certificates = append(certificates, &models.CertificateInfo{
				SerialNumber: cert.SerialNumber.String(),
				Name:         secret.Name,
				Domains:      cert.DNSNames,
				Expiry:       cert.NotAfter.String(),
			})
		}
	}
	return certificates, nil
}

func getTenantSecurity(ctx context.Context, clientSet K8sClientI, tenant *miniov2.Tenant) (response *models.TenantSecurityResponse, err error) {
	var minioExternalCertificates []*models.CertificateInfo
	var minioExternalCaCertificates []*models.CertificateInfo
	var consoleExternalCertificates []*models.CertificateInfo
	var consoleExternalCaCertificates []*models.CertificateInfo
	// Certificates used by MinIO server
	if minioExternalCertificates, err = parseTenantCertificates(ctx, clientSet, tenant.Namespace, tenant.Spec.ExternalCertSecret); err != nil {
		return nil, err
	}
	// CA Certificates used by MinIO server
	if minioExternalCaCertificates, err = parseTenantCertificates(ctx, clientSet, tenant.Namespace, tenant.Spec.ExternalCaCertSecret); err != nil {
		return nil, err
	}
	if tenant.HasConsoleEnabled() {
		// Certificate used by Console server
		if tenant.Spec.Console.ExternalCertSecret != nil {
			if consoleExternalCertificates, err = parseTenantCertificates(ctx, clientSet, tenant.Namespace, []*miniov2.LocalCertificateReference{tenant.Spec.Console.ExternalCertSecret}); err != nil {
				return nil, err
			}
		}
		// CA Certificates used by Console server
		if consoleExternalCaCertificates, err = parseTenantCertificates(ctx, clientSet, tenant.Namespace, tenant.Spec.Console.ExternalCaCertSecret); err != nil {
			return nil, err
		}
	}
	return &models.TenantSecurityResponse{
		AutoCert: tenant.AutoCert(),
		CustomCertificates: &models.TenantSecurityResponseCustomCertificates{
			Minio:      minioExternalCertificates,
			MinioCAs:   minioExternalCaCertificates,
			Console:    consoleExternalCertificates,
			ConsoleCAs: consoleExternalCaCertificates,
		},
	}, nil
}

func getTenantSecurityResponse(session *models.Principal, params admin_api.TenantSecurityParams) (*models.TenantSecurityResponse, *models.Error) {
	// 5 seconds timeout
	ctx := context.Background()
	//ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	//defer cancel()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
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
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	k8sClient := k8sClient{
		client: clientSet,
	}
	if err != nil {
		return nil, prepareError(err)
	}
	info, err := getTenantSecurity(ctx, &k8sClient, minTenant)
	if err != nil {
		return nil, prepareError(err)
	}
	return info, nil
}

func getUpdateTenantSecurityResponse(session *models.Principal, params admin_api.UpdateTenantSecurityParams) *models.Error {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err)
	}
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err)
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	if err := updateTenantSecurity(ctx, opClient, &k8sClient, params.Namespace, params); err != nil {
		return prepareError(err, errors.New("unable to update tenant"))
	}
	return nil
}

// updateTenantSecurity
func updateTenantSecurity(ctx context.Context, operatorClient OperatorClientI, client K8sClientI, namespace string, params admin_api.UpdateTenantSecurityParams) error {
	minInst, err := operatorClient.TenantGet(ctx, namespace, params.Tenant, metav1.GetOptions{})
	if err != nil {
		return err
	}
	// Update AutoCert
	minInst.Spec.RequestAutoCert = &params.Body.AutoCert
	var newMinIOExternalCertSecret []*miniov2.LocalCertificateReference
	var newMinIOExternalCaCertSecret []*miniov2.LocalCertificateReference
	var newConsoleExternalCertSecret *miniov2.LocalCertificateReference
	var newConsoleExternalCaCertSecret []*miniov2.LocalCertificateReference
	// Remove Certificate Secrets from MinIO (Tenant.Spec.ExternalCertSecret)
	for _, certificate := range minInst.Spec.ExternalCertSecret {
		skip := false
		for _, certificateToBeDeleted := range params.Body.CustomCertificates.SecretsToBeDeleted {
			if certificate.Name == certificateToBeDeleted {
				skip = true
				break
			}
		}
		if skip {
			continue
		}
		newMinIOExternalCertSecret = append(newMinIOExternalCertSecret, certificate)
	}
	// Remove Certificate Secrets from MinIO CAs (Tenant.Spec.ExternalCaCertSecret)
	for _, certificate := range minInst.Spec.ExternalCaCertSecret {
		skip := false
		for _, certificateToBeDeleted := range params.Body.CustomCertificates.SecretsToBeDeleted {
			if certificate.Name == certificateToBeDeleted {
				skip = true
				break
			}
		}
		if skip {
			continue
		}
		newMinIOExternalCaCertSecret = append(newMinIOExternalCaCertSecret, certificate)
	}
	if minInst.HasConsoleEnabled() {
		// Remove Certificate Secrets from Console (Tenant.Spec.Console.ExternalCertSecret)
		if minInst.ConsoleExternalCert() {
			newConsoleExternalCertSecret = minInst.Spec.Console.ExternalCertSecret
			for _, certificateToBeDeleted := range params.Body.CustomCertificates.SecretsToBeDeleted {
				if newConsoleExternalCertSecret.Name == certificateToBeDeleted {
					newConsoleExternalCertSecret = nil
					break
				}
			}
		}
		// Remove Certificate Secrets from Console CAs (Tenant.Spec.Console.ExternalCaCertSecret)
		for _, certificate := range minInst.Spec.Console.ExternalCaCertSecret {
			skip := false
			for _, certificateToBeDeleted := range params.Body.CustomCertificates.SecretsToBeDeleted {
				if certificate.Name == certificateToBeDeleted {
					skip = true
					break
				}
			}
			if skip {
				continue
			}
			newConsoleExternalCaCertSecret = append(newConsoleExternalCaCertSecret, certificate)
		}
	}

	//Create new Certificate Secrets for MinIO
	secretName := fmt.Sprintf("%s-%s", minInst.Name, strings.ToLower(utils.RandomCharString(5)))
	externalCertSecretName := fmt.Sprintf("%s-external-certificates", secretName)
	externalCertSecrets, err := createOrReplaceExternalCertSecrets(ctx, client, minInst.Namespace, params.Body.CustomCertificates.Minio, externalCertSecretName, minInst.Name)
	if err != nil {
		return err
	}
	newMinIOExternalCertSecret = append(newMinIOExternalCertSecret, externalCertSecrets...)

	// Create new CAs Certificate Secrets for MinIO
	var caCertificates []tenantSecret
	for i, caCertificate := range params.Body.CustomCertificates.MinioCAs {
		certificateContent, err := base64.StdEncoding.DecodeString(caCertificate)
		if err != nil {
			return err
		}
		caCertificates = append(caCertificates, tenantSecret{
			Name: fmt.Sprintf("%s-ca-certificate-%d", secretName, i),
			Content: map[string][]byte{
				"public.crt": certificateContent,
			},
		})
	}
	if len(caCertificates) > 0 {
		certificateSecrets, err := createOrReplaceSecrets(ctx, client, minInst.Namespace, caCertificates, minInst.Name)
		if err != nil {
			return err
		}
		newMinIOExternalCaCertSecret = append(newMinIOExternalCaCertSecret, certificateSecrets...)
	}

	// Create new Certificate Secrets for Console
	consoleExternalCertSecretName := fmt.Sprintf("%s-console-external-certificates", secretName)
	consoleExternalCertSecrets, err := createOrReplaceExternalCertSecrets(ctx, client, minInst.Namespace, params.Body.CustomCertificates.Console, consoleExternalCertSecretName, minInst.Name)
	if err != nil {
		return err
	}
	if len(consoleExternalCertSecrets) > 0 {
		newConsoleExternalCertSecret = consoleExternalCertSecrets[0]
	}

	// Create new CAs Certificate Secrets for Console
	var consoleCaCertificates []tenantSecret
	for i, caCertificate := range params.Body.CustomCertificates.ConsoleCAs {
		certificateContent, err := base64.StdEncoding.DecodeString(caCertificate)
		if err != nil {
			return err
		}
		consoleCaCertificates = append(consoleCaCertificates, tenantSecret{
			Name: fmt.Sprintf("%s-console-ca-certificate-%d", secretName, i),
			Content: map[string][]byte{
				"public.crt": certificateContent,
			},
		})
	}
	if len(consoleCaCertificates) > 0 {
		certificateSecrets, err := createOrReplaceSecrets(ctx, client, minInst.Namespace, consoleCaCertificates, minInst.Name)
		if err != nil {
			return err
		}
		newConsoleExternalCaCertSecret = append(newConsoleExternalCaCertSecret, certificateSecrets...)
	}

	// Update External Certificates
	minInst.Spec.ExternalCertSecret = newMinIOExternalCertSecret
	minInst.Spec.ExternalCaCertSecret = newMinIOExternalCaCertSecret
	if minInst.HasConsoleEnabled() {
		minInst.Spec.Console.ExternalCertSecret = newConsoleExternalCertSecret
		minInst.Spec.Console.ExternalCaCertSecret = newConsoleExternalCaCertSecret
	}
	_, err = operatorClient.TenantUpdate(ctx, minInst, metav1.UpdateOptions{})
	if err != nil {
		return err
	}
	// Remove Certificate Secrets from Tenant namespace
	for _, secretName := range params.Body.CustomCertificates.SecretsToBeDeleted {
		err = client.deleteSecret(ctx, minInst.Namespace, secretName, metav1.DeleteOptions{})
		if err != nil {
			LogError("error deleting secret: %v", err)
		}
	}
	return nil
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
		for _, pool := range tenant.Spec.Pools {
			instanceCount = instanceCount + int64(pool.Servers)
			volumeCount = volumeCount + int64(pool.Servers*pool.VolumesPerServer)
			if pool.VolumeClaimTemplate != nil {
				poolSize := int64(pool.VolumesPerServer) * int64(pool.Servers) * pool.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value()
				totalSize = totalSize + poolSize
			}
		}

		var deletion string
		if tenant.ObjectMeta.DeletionTimestamp != nil {
			deletion = tenant.ObjectMeta.DeletionTimestamp.Format(time.RFC3339)
		}

		tenants = append(tenants, &models.TenantList{
			CreationDate:  tenant.ObjectMeta.CreationTimestamp.Format(time.RFC3339),
			DeletionDate:  deletion,
			Name:          tenant.ObjectMeta.Name,
			PoolCount:     int64(len(tenant.Spec.Pools)),
			InstanceCount: instanceCount,
			VolumeCount:   volumeCount,
			CurrentState:  tenant.Status.CurrentState,
			Namespace:     tenant.ObjectMeta.Namespace,
			TotalSize:     totalSize,
			HealthStatus:  string(tenant.Status.HealthStatus),
		})
	}

	return &models.ListTenantsResponse{
		Tenants: tenants,
		Total:   int64(len(tenants)),
	}, nil
}

func getListAllTenantsResponse(session *models.Principal, params admin_api.ListAllTenantsParams) (*models.ListTenantsResponse, *models.Error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
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
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
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
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
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

	imm := true
	var instanceSecret corev1.Secret
	var users []*corev1.LocalObjectReference

	// Create the secret for the root credentials
	secretName := fmt.Sprintf("%s-secret", tenantName)
	instanceSecret = corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: secretName,
			Labels: map[string]string{
				miniov2.TenantLabel: tenantName,
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
			LogError("deleting secrets created for failed tenant: %s if any: %v", tenantName, mError)
			opts := metav1.ListOptions{
				LabelSelector: fmt.Sprintf("%s=%s", miniov2.TenantLabel, tenantName),
			}
			err = clientSet.CoreV1().Secrets(ns).DeleteCollection(ctx, metav1.DeleteOptions{}, opts)
			if err != nil {
				LogError("error deleting tenant's secrets: %v", err)
			}
		}
	}()

	var environmentVariables []corev1.EnvVar
	// Check the Erasure Coding Parity for validity and pass it to Tenant
	if tenantReq.ErasureCodingParity > 0 {
		if tenantReq.ErasureCodingParity < 2 || tenantReq.ErasureCodingParity > 8 {
			return nil, prepareError(errorInvalidErasureCodingValue)
		}
		environmentVariables = append(environmentVariables, corev1.EnvVar{
			Name:  "MINIO_STORAGE_CLASS_STANDARD",
			Value: fmt.Sprintf("EC:%d", tenantReq.ErasureCodingParity),
		})
	}

	//Construct a MinIO Instance with everything we are getting from parameters
	minInst := miniov2.Tenant{
		ObjectMeta: metav1.ObjectMeta{
			Name:   tenantName,
			Labels: tenantReq.Labels,
		},
		Spec: miniov2.TenantSpec{
			Image:     minioImage,
			Mountpath: "/export",
			CredsSecret: &corev1.LocalObjectReference{
				Name: secretName,
			},
			Env: environmentVariables,
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

	// Create the secret any built-in user passed if no external IDP was configured
	if tenantReq.Idp != nil && len(tenantReq.Idp.Keys) > 0 && tenantReq.Idp.ActiveDirectory == nil && tenantReq.Idp.Oidc == nil {
		for i := 0; i < len(tenantReq.Idp.Keys); i++ {
			userSecretName := fmt.Sprintf("%s-user-%d", tenantName, i)
			users = append(users, &corev1.LocalObjectReference{Name: userSecretName})
			userSecret := corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name: userSecretName,
					Labels: map[string]string{
						miniov2.TenantLabel: tenantName,
					},
				},
				Immutable: &imm,
				Data: map[string][]byte{
					"CONSOLE_ACCESS_KEY": []byte(*tenantReq.Idp.Keys[i].AccessKey),
					"CONSOLE_SECRET_KEY": []byte(*tenantReq.Idp.Keys[i].SecretKey),
				},
			}
			_, err := clientSet.CoreV1().Secrets(ns).Create(ctx, &userSecret, metav1.CreateOptions{})
			if err != nil {
				return nil, prepareError(err)
			}
		}
		// attach the users to the tenant
		minInst.Spec.Users = users
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
	// External TLS CA certificates for MinIO
	if tenantReq.TLS != nil && len(tenantReq.TLS.CaCertificates) > 0 {
		var caCertificates []tenantSecret
		for i, caCertificate := range tenantReq.TLS.CaCertificates {
			certificateContent, err := base64.StdEncoding.DecodeString(caCertificate)
			if err != nil {
				return nil, prepareError(errorGeneric, nil, err)
			}
			caCertificates = append(caCertificates, tenantSecret{
				Name: fmt.Sprintf("ca-certificate-%d", i),
				Content: map[string][]byte{
					"public.crt": certificateContent,
				},
			})
		}
		if len(caCertificates) > 0 {
			certificateSecrets, err := createOrReplaceSecrets(ctx, &k8sClient, ns, caCertificates, tenantName)
			if err != nil {
				return nil, prepareError(errorGeneric, nil, err)
			}
			minInst.Spec.ExternalCaCertSecret = certificateSecrets
		}
	}
	// optionals are set below
	var tenantUserAccessKey string
	var tenantUserSecretKey string
	keyElementEmpty := len(tenantReq.Idp.Keys) == 1 && (*tenantReq.Idp.Keys[0].AccessKey == "" && *tenantReq.Idp.Keys[0].SecretKey == "")

	enableConsole := true
	if tenantReq.EnableConsole != nil && *tenantReq.EnableConsole {
		enableConsole = *tenantReq.EnableConsole
	}

	if enableConsole {
		consoleSelector := fmt.Sprintf("%s-console", tenantName)
		consoleSecretName := fmt.Sprintf("%s-secret", consoleSelector)
		consoleSecretData := map[string][]byte{
			"CONSOLE_PBKDF_PASSPHRASE": []byte(RandomCharString(16)),
			"CONSOLE_PBKDF_SALT":       []byte(RandomCharString(8)),
		}
		// If Subnet License is present in k8s secrets, copy that to the CONSOLE_SUBNET_LICENSE env variable
		// of the console tenant
		license, _ := getSubscriptionLicense(ctx, &k8sClient, cluster.Namespace, OperatorSubnetLicenseSecretName)
		if license != "" {
			consoleSecretData[ConsoleSubnetLicense] = []byte(license)
		}
		imm := true
		instanceSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: consoleSecretName,
				Labels: map[string]string{
					miniov2.TenantLabel: tenantName,
				},
			},
			Immutable: &imm,
			Data:      consoleSecretData,
		}

		minInst.Spec.Console = &miniov2.ConsoleConfiguration{
			Replicas:      1,
			Image:         getConsoleImage(),
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

		// External TLS CA certificates for Console
		if tenantReq.TLS != nil && len(tenantReq.TLS.ConsoleCaCertificates) > 0 {
			var caCertificates []tenantSecret
			for i, caCertificate := range tenantReq.TLS.ConsoleCaCertificates {
				certificateContent, err := base64.StdEncoding.DecodeString(caCertificate)
				if err != nil {
					return nil, prepareError(errorGeneric, nil, err)
				}
				caCertificates = append(caCertificates, tenantSecret{
					Name: fmt.Sprintf("console-ca-certificate-%d", i),
					Content: map[string][]byte{
						"public.crt": certificateContent,
					},
				})
			}
			if len(caCertificates) > 0 {
				certificateSecrets, err := createOrReplaceSecrets(ctx, &k8sClient, ns, caCertificates, tenantName)
				if err != nil {
					return nil, prepareError(errorGeneric, nil, err)
				}
				minInst.Spec.Console.ExternalCaCertSecret = certificateSecrets
			}
		}
	}

	// add annotations
	var annotations map[string]string

	if len(tenantReq.Annotations) > 0 {
		annotations = tenantReq.Annotations
		minInst.Annotations = annotations
	}
	// set the pools if they are provided
	for _, pool := range tenantReq.Pools {
		pool, err := parseTenantPoolRequest(pool)
		if err != nil {
			LogError("parseTenantPoolRequest failed: %v", err)
			return nil, prepareError(err)
		}
		minInst.Spec.Pools = append(minInst.Spec.Pools, *pool)
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
		minInst.Annotations[prometheusPort] = fmt.Sprint(miniov2.MinIOPort)
		minInst.Annotations[prometheusScrape] = "true"
	}

	// set console image if provided
	if tenantReq.ConsoleImage != "" {
		minInst.Spec.Console.Image = tenantReq.ConsoleImage
	}

	//Default class name for Log search
	diskSpaceFromAPI := int64(5) // Default is 5
	logSearchStorageClass := ""  // Default is ""
	logSearchImage := ""
	logSearchPgImage := ""

	if tenantReq.LogSearchConfiguration != nil {
		if tenantReq.LogSearchConfiguration.StorageSize != nil {
			diskSpaceFromAPI = int64(*tenantReq.LogSearchConfiguration.StorageSize)
		}
		if tenantReq.LogSearchConfiguration.StorageClass != "" {
			logSearchStorageClass = tenantReq.LogSearchConfiguration.StorageClass
		}

		if tenantReq.LogSearchConfiguration.StorageClass == "" && len(tenantReq.Pools) > 0 {
			logSearchStorageClass = tenantReq.Pools[0].VolumeConfiguration.StorageClassName
		}

		if tenantReq.LogSearchConfiguration.Image != "" {
			logSearchImage = tenantReq.LogSearchConfiguration.Image
		}
		if tenantReq.LogSearchConfiguration.PostgresImage != "" {
			logSearchPgImage = tenantReq.LogSearchConfiguration.PostgresImage
		}

	}

	logSearchDiskSpace := resource.NewQuantity(diskSpaceFromAPI, resource.DecimalExponent)

	// default activate lgo search and prometheus
	minInst.Spec.Log = &miniov2.LogConfig{
		Audit: &miniov2.AuditConfig{DiskCapacityGB: swag.Int(10)},
		Db: &miniov2.LogDbConfig{
			VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
				ObjectMeta: metav1.ObjectMeta{
					Name: tenantName + "-log",
				},
				Spec: corev1.PersistentVolumeClaimSpec{
					AccessModes: []corev1.PersistentVolumeAccessMode{
						corev1.ReadWriteOnce,
					},
					Resources: corev1.ResourceRequirements{
						Requests: corev1.ResourceList{
							corev1.ResourceStorage: *logSearchDiskSpace,
						},
					},
					StorageClassName: &logSearchStorageClass,
				},
			},
		},
	}
	if logSearchImage != "" {
		minInst.Spec.Log.Image = logSearchImage
	}
	if logSearchPgImage != "" {
		minInst.Spec.Log.Db.Image = logSearchPgImage
	}

	prometheusDiskSpace := 5     // Default is 5 by API
	prometheusStorageClass := "" // Default is ""
	prometheusImage := ""        // Default is ""

	if tenantReq.PrometheusConfiguration != nil {
		if tenantReq.PrometheusConfiguration.StorageSize != nil {
			prometheusDiskSpace = int(*tenantReq.PrometheusConfiguration.StorageSize)
		}
		if tenantReq.PrometheusConfiguration.StorageClass != "" {
			prometheusStorageClass = tenantReq.PrometheusConfiguration.StorageClass
		}

		// Default class name for prometheus
		if tenantReq.PrometheusConfiguration.StorageClass == "" && len(tenantReq.Pools) > 0 {
			prometheusStorageClass = tenantReq.Pools[0].VolumeConfiguration.StorageClassName
		}

		if tenantReq.PrometheusConfiguration.Image != "" {
			prometheusImage = tenantReq.PrometheusConfiguration.Image
		}
	}

	minInst.Spec.Prometheus = &miniov2.PrometheusConfig{
		DiskCapacityDB:   swag.Int(prometheusDiskSpace),
		StorageClassName: &prometheusStorageClass,
	}
	if prometheusImage != "" {
		minInst.Spec.Prometheus.Image = prometheusImage
	}

	// expose services
	if tenantReq.ExposeMinio || tenantReq.ExposeConsole {
		minInst.Spec.ExposeServices = &miniov2.ExposeServices{
			MinIO:   tenantReq.ExposeMinio,
			Console: tenantReq.ExposeConsole,
		}
	}

	opClient, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	_, err = opClient.MinioV2().Tenants(ns).Create(context.Background(), &minInst, metav1.CreateOptions{})
	if err != nil {
		LogError("Creating new tenant failed with: %v", err)
		return nil, prepareError(err)
	}

	// Integrations
	if os.Getenv("GKE_INTEGRATION") != "" {
		err := gkeIntegration(clientSet, tenantName, ns, session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
	}
	response = &models.CreateTenantResponse{}
	// Attach Console Credentials
	if enableConsole {
		var itemsToReturn []*models.TenantResponseItem

		if len(tenantReq.Idp.Keys) == 0 || keyElementEmpty {
			itemsToReturn = append(itemsToReturn, &models.TenantResponseItem{AccessKey: tenantUserAccessKey, SecretKey: tenantUserSecretKey})
		} else { // IDP Keys
			for _, item := range tenantReq.Idp.Keys {
				itemsToReturn = append(itemsToReturn, &models.TenantResponseItem{AccessKey: *item.AccessKey, SecretKey: *item.SecretKey})
			}
		}

		response.Console = itemsToReturn
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
						miniov2.TenantLabel: tenantName,
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
			LogError("error setting image registry secret: %v", err)
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
		prometheusPort:   fmt.Sprint(miniov2.MinIOPort),
		prometheusScrape: "true",
	}
	if params.Body.EnablePrometheus && currentAnnotations != nil {
		// add prometheus annotations to the tenant
		minInst.Annotations = addAnnotations(currentAnnotations, prometheusAnnotations)
		// add prometheus annotations to the each pool
		if minInst.Spec.Pools != nil {
			for _, pool := range minInst.Spec.Pools {
				poolAnnotations := pool.VolumeClaimTemplate.GetObjectMeta().GetAnnotations()
				pool.VolumeClaimTemplate.GetObjectMeta().SetAnnotations(addAnnotations(poolAnnotations, prometheusAnnotations))
			}
		}
	} else {
		// remove prometheus annotations to the tenant
		minInst.Annotations = removeAnnotations(currentAnnotations, prometheusAnnotations)
		// add prometheus annotations from each pool
		if minInst.Spec.Pools != nil {
			for _, pool := range minInst.Spec.Pools {
				poolAnnotations := pool.VolumeClaimTemplate.GetObjectMeta().GetAnnotations()
				pool.VolumeClaimTemplate.GetObjectMeta().SetAnnotations(removeAnnotations(poolAnnotations, prometheusAnnotations))
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
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err)
	}
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
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

// addTenantPool creates a pool to a defined tenant
func addTenantPool(ctx context.Context, operatorClient OperatorClientI, params admin_api.TenantAddPoolParams) error {
	tenant, err := operatorClient.TenantGet(ctx, params.Namespace, params.Tenant, metav1.GetOptions{})
	if err != nil {
		return err
	}

	poolParams := params.Body
	pool, err := parseTenantPoolRequest(poolParams)
	if err != nil {
		return err
	}
	tenant.Spec.Pools = append(tenant.Spec.Pools, *pool)
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

func getTenantAddPoolResponse(session *models.Principal, params admin_api.TenantAddPoolParams) *models.Error {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	if err := addTenantPool(ctx, opClient, params); err != nil {
		return prepareError(err, errors.New("unable to add pool"))
	}
	return nil
}

// getTenantUsageResponse returns the usage of a tenant
func getTenantUsageResponse(session *models.Principal, params admin_api.GetTenantUsageParams) (*models.TenantUsage, *models.Error) {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

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

	minTenant, err := getTenant(ctx, opClient, params.Namespace, params.Tenant)
	if err != nil {
		return nil, prepareError(err, errorUnableToGetTenantUsage)
	}
	minTenant.EnsureDefaults()

	svcURL := GetTenantServiceURL(minTenant)
	// getTenantAdminClient will use all certificates under ~/.console/certs/CAs to trust the TLS connections with MinIO tenants
	mAdmin, err := getTenantAdminClient(
		ctx,
		k8sClient,
		minTenant,
		svcURL,
	)
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

func getTenantPodsResponse(session *models.Principal, params admin_api.GetTenantPodsParams) ([]*models.TenantPod, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	listOpts := metav1.ListOptions{
		LabelSelector: fmt.Sprintf("%s=%s", miniov2.TenantLabel, params.Tenant),
	}
	pods, err := clientset.CoreV1().Pods(params.Namespace).List(ctx, listOpts)
	if err != nil {
		return nil, prepareError(err)
	}
	retval := []*models.TenantPod{}
	for _, pod := range pods.Items {
		var restarts int64
		if len(pod.Status.ContainerStatuses) > 0 {
			restarts = int64(pod.Status.ContainerStatuses[0].RestartCount)
		}
		retval = append(retval, &models.TenantPod{
			Name:        swag.String(pod.Name),
			Status:      string(pod.Status.Phase),
			TimeCreated: pod.CreationTimestamp.Unix(),
			PodIP:       pod.Status.PodIP,
			Restarts:    restarts,
			Node:        pod.Spec.NodeName})
	}
	return retval, nil
}

func getPodLogsResponse(session *models.Principal, params admin_api.GetPodLogsParams) (string, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return "", prepareError(err)
	}
	listOpts := &corev1.PodLogOptions{}
	logs := clientset.CoreV1().Pods(params.Namespace).GetLogs(params.PodName, listOpts)
	buff, err := logs.DoRaw(ctx)
	if err != nil {
		return "", prepareError(err)
	}
	return string(buff), nil
}

func getPodEventsResponse(session *models.Principal, params admin_api.GetPodEventsParams) (models.EventListWrapper, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	pod, err := clientset.CoreV1().Pods(params.Namespace).Get(ctx, params.PodName, metav1.GetOptions{})
	if err != nil {
		return nil, prepareError(err)
	}
	events, err := clientset.CoreV1().Events(params.Namespace).List(ctx, metav1.ListOptions{FieldSelector: fmt.Sprintf("involvedObject.uid=%s", pod.UID)})
	if err != nil {
		return nil, prepareError(err)
	}
	retval := models.EventListWrapper{}
	for i := 0; i < len(events.Items); i++ {
		retval = append(retval, &models.EventListElement{
			Namespace: events.Items[i].Namespace,
			LastSeen:  events.Items[i].LastTimestamp.Unix(),
			Message:   events.Items[i].Message,
			EventType: events.Items[i].Type,
			Reason:    events.Items[i].Reason,
		})
	}
	sort.SliceStable(retval, func(i int, j int) bool {
		return retval[i].LastSeen < retval[j].LastSeen
	})
	return retval, nil
}

// parseTenantPoolRequest parse pool request and returns the equivalent
// miniov2.Pool object
func parseTenantPoolRequest(poolParams *models.Pool) (*miniov2.Pool, error) {
	if poolParams.VolumeConfiguration == nil {
		return nil, errors.New("a volume configuration must be specified")
	}

	if poolParams.VolumeConfiguration.Size == nil || *poolParams.VolumeConfiguration.Size <= int64(0) {
		return nil, errors.New("volume size must be greater than 0")
	}

	if poolParams.Servers == nil || *poolParams.Servers <= 0 {
		return nil, errors.New("number of servers must be greater than 0")
	}

	if poolParams.VolumesPerServer == nil || *poolParams.VolumesPerServer <= 0 {
		return nil, errors.New("number of volumes per server must be greater than 0")
	}

	volumeSize := resource.NewQuantity(*poolParams.VolumeConfiguration.Size, resource.DecimalExponent)
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
	if poolParams.VolumeConfiguration.StorageClassName != "" {
		volTemp.StorageClassName = &poolParams.VolumeConfiguration.StorageClassName
	}

	// parse resources' requests
	resourcesRequests := make(corev1.ResourceList)
	resourcesLimits := make(corev1.ResourceList)
	if poolParams.Resources != nil {
		for key, val := range poolParams.Resources.Requests {
			resourcesRequests[corev1.ResourceName(key)] = *resource.NewQuantity(val, resource.BinarySI)
		}
		for key, val := range poolParams.Resources.Limits {
			resourcesLimits[corev1.ResourceName(key)] = *resource.NewQuantity(val, resource.BinarySI)
		}
	}

	// parse Node Affinity
	nodeSelectorTerms := []corev1.NodeSelectorTerm{}
	preferredSchedulingTerm := []corev1.PreferredSchedulingTerm{}
	if poolParams.Affinity != nil && poolParams.Affinity.NodeAffinity != nil {
		if poolParams.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution != nil {
			for _, elem := range poolParams.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms {
				term := parseModelsNodeSelectorTerm(elem)
				nodeSelectorTerms = append(nodeSelectorTerms, term)
			}
		}
		for _, elem := range poolParams.Affinity.NodeAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
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
	if poolParams.Affinity != nil && poolParams.Affinity.PodAffinity != nil {
		for _, elem := range poolParams.Affinity.PodAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAffinityTerms = append(podAffinityTerms, parseModelPodAffinityTerm(elem))
		}
		for _, elem := range poolParams.Affinity.PodAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
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
	if poolParams.Affinity != nil && poolParams.Affinity.PodAntiAffinity != nil {
		for _, elem := range poolParams.Affinity.PodAntiAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAntiAffinityTerms = append(podAntiAffinityTerms, parseModelPodAffinityTerm(elem))
		}
		for _, elem := range poolParams.Affinity.PodAntiAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
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
	for _, elem := range poolParams.Tolerations {
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
			Labels:      poolParams.VolumeConfiguration.Labels,
			Annotations: poolParams.VolumeConfiguration.Annotations,
		},
		Spec: volTemp,
	}

	pool := &miniov2.Pool{
		Name:                poolParams.Name,
		Servers:             int32(*poolParams.Servers),
		VolumesPerServer:    *poolParams.VolumesPerServer,
		VolumeClaimTemplate: vct,
		Resources: corev1.ResourceRequirements{
			Requests: resourcesRequests,
			Limits:   resourcesLimits,
		},
		NodeSelector: poolParams.NodeSelector,
		Affinity:     affinity,
		Tolerations:  tolerations,
	}
	return pool, nil
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

// parseTenantPool miniov2 pool object and returns the equivalent
// models.Pool object
func parseTenantPool(pool *miniov2.Pool) *models.Pool {
	var size *int64
	var storageClassName string
	if pool.VolumeClaimTemplate != nil {
		size = swag.Int64(pool.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value())
		if pool.VolumeClaimTemplate.Spec.StorageClassName != nil {
			storageClassName = *pool.VolumeClaimTemplate.Spec.StorageClassName
		}
	}

	// parse resources' requests
	var resources *models.PoolResources
	resourcesRequests := make(map[string]int64)
	resourcesLimits := make(map[string]int64)
	for key, val := range pool.Resources.Requests {
		resourcesRequests[key.String()] = val.Value()
	}
	for key, val := range pool.Resources.Limits {
		resourcesLimits[key.String()] = val.Value()
	}
	if len(resourcesRequests) > 0 || len(resourcesLimits) > 0 {
		resources = &models.PoolResources{
			Limits:   resourcesLimits,
			Requests: resourcesRequests,
		}
	}

	// parse Node Affinity
	nodeSelectorTerms := []*models.NodeSelectorTerm{}
	preferredSchedulingTerm := []*models.PoolAffinityNodeAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{}

	if pool.Affinity != nil && pool.Affinity.NodeAffinity != nil {
		if pool.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution != nil {
			for _, elem := range pool.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms {
				term := parseNodeSelectorTerm(&elem)
				nodeSelectorTerms = append(nodeSelectorTerms, term)
			}
		}
		for _, elem := range pool.Affinity.NodeAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			pst := &models.PoolAffinityNodeAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{
				Weight:     swag.Int32(elem.Weight),
				Preference: parseNodeSelectorTerm(&elem.Preference),
			}
			preferredSchedulingTerm = append(preferredSchedulingTerm, pst)
		}
	}

	var nodeAffinity *models.PoolAffinityNodeAffinity
	if len(nodeSelectorTerms) > 0 || len(preferredSchedulingTerm) > 0 {
		nodeAffinity = &models.PoolAffinityNodeAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution: &models.PoolAffinityNodeAffinityRequiredDuringSchedulingIgnoredDuringExecution{
				NodeSelectorTerms: nodeSelectorTerms,
			},
			PreferredDuringSchedulingIgnoredDuringExecution: preferredSchedulingTerm,
		}
	}

	// parse Pod Affinity
	podAffinityTerms := []*models.PodAffinityTerm{}
	weightedPodAffinityTerms := []*models.PoolAffinityPodAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{}

	if pool.Affinity != nil && pool.Affinity.PodAffinity != nil {
		for _, elem := range pool.Affinity.PodAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAffinityTerms = append(podAffinityTerms, parsePodAffinityTerm(&elem))
		}
		for _, elem := range pool.Affinity.PodAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			wAffinityTerm := &models.PoolAffinityPodAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{
				Weight:          swag.Int32(elem.Weight),
				PodAffinityTerm: parsePodAffinityTerm(&elem.PodAffinityTerm),
			}
			weightedPodAffinityTerms = append(weightedPodAffinityTerms, wAffinityTerm)
		}
	}
	var podAffinity *models.PoolAffinityPodAffinity
	if len(podAffinityTerms) > 0 || len(weightedPodAffinityTerms) > 0 {
		podAffinity = &models.PoolAffinityPodAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution:  podAffinityTerms,
			PreferredDuringSchedulingIgnoredDuringExecution: weightedPodAffinityTerms,
		}
	}

	// parse Pod Anti Affinity
	podAntiAffinityTerms := []*models.PodAffinityTerm{}
	weightedPodAntiAffinityTerms := []*models.PoolAffinityPodAntiAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{}

	if pool.Affinity != nil && pool.Affinity.PodAntiAffinity != nil {
		for _, elem := range pool.Affinity.PodAntiAffinity.RequiredDuringSchedulingIgnoredDuringExecution {
			podAntiAffinityTerms = append(podAntiAffinityTerms, parsePodAffinityTerm(&elem))
		}
		for _, elem := range pool.Affinity.PodAntiAffinity.PreferredDuringSchedulingIgnoredDuringExecution {
			wAffinityTerm := &models.PoolAffinityPodAntiAffinityPreferredDuringSchedulingIgnoredDuringExecutionItems0{
				Weight:          swag.Int32(elem.Weight),
				PodAffinityTerm: parsePodAffinityTerm(&elem.PodAffinityTerm),
			}
			weightedPodAntiAffinityTerms = append(weightedPodAntiAffinityTerms, wAffinityTerm)
		}
	}

	var podAntiAffinity *models.PoolAffinityPodAntiAffinity
	if len(podAntiAffinityTerms) > 0 || len(weightedPodAntiAffinityTerms) > 0 {
		podAntiAffinity = &models.PoolAffinityPodAntiAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution:  podAntiAffinityTerms,
			PreferredDuringSchedulingIgnoredDuringExecution: weightedPodAntiAffinityTerms,
		}
	}

	// build affinity object
	var affinity *models.PoolAffinity
	if nodeAffinity != nil || podAffinity != nil || podAntiAffinity != nil {
		affinity = &models.PoolAffinity{
			NodeAffinity:    nodeAffinity,
			PodAffinity:     podAffinity,
			PodAntiAffinity: podAntiAffinity,
		}
	}

	// parse tolerations
	var tolerations models.PoolTolerations
	for _, elem := range pool.Tolerations {
		var tolerationSecs *models.PoolTolerationSeconds
		if elem.TolerationSeconds != nil {
			tolerationSecs = &models.PoolTolerationSeconds{
				Seconds: elem.TolerationSeconds,
			}
		}
		toleration := &models.PoolTolerationsItems0{
			Key:               elem.Key,
			Operator:          string(elem.Operator),
			Value:             elem.Value,
			Effect:            string(elem.Effect),
			TolerationSeconds: tolerationSecs,
		}
		tolerations = append(tolerations, toleration)
	}

	poolModel := &models.Pool{
		Name:             pool.Name,
		Servers:          swag.Int64(int64(pool.Servers)),
		VolumesPerServer: swag.Int32(pool.VolumesPerServer),
		VolumeConfiguration: &models.PoolVolumeConfiguration{
			Size:             size,
			StorageClassName: storageClassName,
		},
		NodeSelector: pool.NodeSelector,
		Resources:    resources,
		Affinity:     affinity,
		Tolerations:  tolerations,
	}
	return poolModel
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

func getTenantUpdatePoolResponse(session *models.Principal, params admin_api.TenantUpdatePoolsParams) (*models.Tenant, *models.Error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}

	t, err := updateTenantPools(ctx, opClient, params.Namespace, params.Tenant, params.Body.Pools)
	if err != nil {
		LogError("error updating Tenant's pools: %v", err)
		return nil, prepareError(err)
	}

	// parse it to models.Tenant
	tenant := getTenantInfo(t)
	return tenant, nil
}

// updateTenantPools Sets the Tenant's pools to the ones provided by the request
//
// It does the equivalent to a PUT request on Tenant's pools
func updateTenantPools(
	ctx context.Context,
	operatorClient OperatorClientI,
	namespace string,
	tenantName string,
	poolsReq []*models.Pool) (*miniov2.Tenant, error) {

	minInst, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	// set the pools if they are provided
	var newPoolArray []miniov2.Pool
	for _, pool := range poolsReq {
		pool, err := parseTenantPoolRequest(pool)
		if err != nil {
			return nil, err
		}
		newPoolArray = append(newPoolArray, *pool)
	}

	// replace pools array
	minInst.Spec.Pools = newPoolArray

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

func getTenantYAML(session *models.Principal, params admin_api.GetTenantYAMLParams) (*models.TenantYAML, *models.Error) {
	// get Kubernetes Client

	opClient, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	tenant, err := opClient.MinioV2().Tenants(params.Namespace).Get(params.HTTPRequest.Context(), params.Tenant, metav1.GetOptions{})
	if err != nil {
		return nil, prepareError(err)
	}
	// remove managed fields
	tenant.ManagedFields = []metav1.ManagedFieldsEntry{}

	//yb, err := yaml.Marshal(tenant)
	serializer := k8sJson.NewSerializerWithOptions(
		k8sJson.DefaultMetaFactory, nil, nil,
		k8sJson.SerializerOptions{
			Yaml:   true,
			Pretty: true,
			Strict: true,
		},
	)
	buf := new(bytes.Buffer)

	err = serializer.Encode(tenant, buf)
	if err != nil {
		return nil, prepareError(err)
	}

	yb := buf.String()

	return &models.TenantYAML{Yaml: yb}, nil
}

func getUpdateTenantYAML(session *models.Principal, params admin_api.PutTenantYAMLParams) *models.Error {
	// https://godoc.org/k8s.io/apimachinery/pkg/runtime#Scheme
	scheme := runtime.NewScheme()

	// https://godoc.org/k8s.io/apimachinery/pkg/runtime/serializer#CodecFactory
	codecFactory := serializer.NewCodecFactory(scheme)

	// https://godoc.org/k8s.io/apimachinery/pkg/runtime#Decoder
	deserializer := codecFactory.UniversalDeserializer()

	tenantObject, _, err := deserializer.Decode([]byte(params.Body.Yaml), nil, &miniov2.Tenant{})
	if err != nil {
		return &models.Error{Code: 400, Message: swag.String(err.Error())}
	}
	inTenant := tenantObject.(*miniov2.Tenant)
	// get Kubernetes Client
	opClient, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err)
	}

	tenant, err := opClient.MinioV2().Tenants(params.Namespace).Get(params.HTTPRequest.Context(), params.Tenant, metav1.GetOptions{})
	if err != nil {
		return prepareError(err)
	}
	upTenant := tenant.DeepCopy()
	// only update safe fields: spec, metadata.finalizers, metadata.labels and metadata.annotations
	upTenant.Labels = inTenant.Labels
	upTenant.Annotations = inTenant.Annotations
	upTenant.Finalizers = inTenant.Finalizers
	upTenant.Spec = inTenant.Spec

	_, err = opClient.MinioV2().Tenants(params.Namespace).Update(params.HTTPRequest.Context(), upTenant, metav1.UpdateOptions{})
	if err != nil {
		return &models.Error{Code: 400, Message: swag.String(err.Error())}
	}

	return nil
}

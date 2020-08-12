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
	"crypto"
	"encoding/base64"
	"encoding/hex"
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

	"github.com/minio/console/pkg/kes"
	"gopkg.in/yaml.v2"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"

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
			log.Println(err)
			return admin_api.NewCreateTenantDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewCreateTenantOK().WithPayload(resp)
	})
	// List All Tenants of all namespaces
	api.AdminAPIListAllTenantsHandler = admin_api.ListAllTenantsHandlerFunc(func(params admin_api.ListAllTenantsParams, session *models.Principal) middleware.Responder {
		resp, err := getListAllTenantsResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewListTenantsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListTenantsOK().WithPayload(resp)

	})
	// List Tenants by namespace
	api.AdminAPIListTenantsHandler = admin_api.ListTenantsHandlerFunc(func(params admin_api.ListTenantsParams, session *models.Principal) middleware.Responder {
		resp, err := getListTenantsResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewListTenantsDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewListTenantsOK().WithPayload(resp)

	})
	// Detail Tenant
	api.AdminAPITenantInfoHandler = admin_api.TenantInfoHandlerFunc(func(params admin_api.TenantInfoParams, session *models.Principal) middleware.Responder {
		resp, err := getTenantInfoResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewTenantInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String(err.Error())})
		}
		return admin_api.NewTenantInfoOK().WithPayload(resp)

	})

	// Delete Tenant
	api.AdminAPIDeleteTenantHandler = admin_api.DeleteTenantHandlerFunc(func(params admin_api.DeleteTenantParams, session *models.Principal) middleware.Responder {
		err := getDeleteTenantResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewTenantInfoDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String("Unable to delete tenant")})
		}
		return admin_api.NewTenantInfoOK()

	})

	// Update Tenant
	api.AdminAPIUpdateTenantHandler = admin_api.UpdateTenantHandlerFunc(func(params admin_api.UpdateTenantParams, session *models.Principal) middleware.Responder {
		err := getUpdateTenantResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewUpdateTenantDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String("Unable to update tenant")})
		}
		return admin_api.NewUpdateTenantCreated()
	})

	api.AdminAPITenantAddZoneHandler = admin_api.TenantAddZoneHandlerFunc(func(params admin_api.TenantAddZoneParams, session *models.Principal) middleware.Responder {
		err := getTenantAddZoneResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewTenantAddZoneDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String("Unable to add zone")})
		}
		return admin_api.NewTenantAddZoneCreated()
	})

	api.AdminAPIGetTenantUsageHandler = admin_api.GetTenantUsageHandlerFunc(func(params admin_api.GetTenantUsageParams, session *models.Principal) middleware.Responder {
		payload, err := getTenantUsageResponse(session, params)
		if err != nil {
			log.Println(err)
			return admin_api.NewGetTenantUsageDefault(500).WithPayload(&models.Error{Code: 500, Message: swag.String("Unable to get tenant usage")})
		}
		return admin_api.NewGetTenantUsageOK().WithPayload(payload)
	})
}

// deleteTenantAction performs the actions of deleting a tenant
func deleteTenantAction(ctx context.Context, operatorClient OperatorClient, nameSpace, instanceName string) error {
	err := operatorClient.TenantDelete(ctx, nameSpace, instanceName, metav1.DeleteOptions{})
	if err != nil {
		return err
	}
	return nil
}

// getDeleteTenantResponse gets the output of deleting a minio instance
func getDeleteTenantResponse(session *models.Principal, params admin_api.DeleteTenantParams) error {
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return err
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	return deleteTenantAction(context.Background(), opClient, params.Namespace, params.Tenant)
}

func getTenantScheme(mi *operator.Tenant) string {
	scheme := "http"
	if mi.AutoCert() || mi.ExternalCert() {
		scheme = "https"
	}
	return scheme
}

func getTenantAdminClient(ctx context.Context, client K8sClient, namespace, tenantName, serviceName, scheme string, insecure bool) (*madmin.AdminClient, error) {
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
	mAdmin, pErr := NewAdminClientWithInsecure(scheme+"://"+net.JoinHostPort(serviceName, strconv.Itoa(operator.MinIOPort)), string(accessKey), string(secretkey), insecure)
	if pErr != nil {
		return nil, pErr.Cause
	}
	return mAdmin, nil
}

func getTenant(ctx context.Context, operatorClient OperatorClient, namespace, tenantName string) (*operator.Tenant, error) {
	minInst, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return minInst, nil
}

func getTenantInfo(tenant *operator.Tenant) *models.Tenant {
	var zones []*models.Zone

	var totalSize int64
	for _, z := range tenant.Spec.Zones {
		zones = append(zones, parseTenantZone(&z))
		zoneSize := int64(z.Servers) * int64(z.VolumesPerServer) * z.VolumeClaimTemplate.Spec.Resources.Requests.Storage().Value()
		totalSize = totalSize + zoneSize
	}

	return &models.Tenant{
		CreationDate: tenant.ObjectMeta.CreationTimestamp.String(),
		Name:         tenant.Name,
		TotalSize:    totalSize,
		CurrentState: tenant.Status.CurrentState,
		Zones:        zones,
		Namespace:    tenant.ObjectMeta.Namespace,
		Image:        tenant.Spec.Image,
	}
}

func getTenantInfoResponse(session *models.Principal, params admin_api.TenantInfoParams) (*models.Tenant, error) {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, err
	}

	opClient := &operatorClient{
		client: opClientClientSet,
	}

	minTenant, err := getTenant(ctx, opClient, params.Namespace, params.Tenant)
	if err != nil {
		log.Println("error getting minioTenant:", err)
		return nil, err
	}

	info := getTenantInfo(minTenant)
	return info, nil
}

func listTenants(ctx context.Context, operatorClient OperatorClient, namespace string, limit *int32) (*models.ListTenantsResponse, error) {
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

		tenants = append(tenants, &models.TenantList{
			CreationDate:  tenant.ObjectMeta.CreationTimestamp.String(),
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

func getListAllTenantsResponse(session *models.Principal, params admin_api.ListAllTenantsParams) (*models.ListTenantsResponse, error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
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
func getListTenantsResponse(session *models.Principal, params admin_api.ListTenantsParams) (*models.ListTenantsResponse, error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
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

func getTenantCreatedResponse(session *models.Principal, params admin_api.CreateTenantParams) (*models.CreateTenantResponse, error) {
	tenantReq := params.Body
	minioImage := tenantReq.Image
	ctx := context.Background()

	if minioImage == "" {
		minImg, err := cluster.GetMinioImage()
		if err != nil {
			return nil, err
		}
		minioImage = *minImg
	}
	// get Kubernetes Client
	clientset, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
		return nil, err
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

	secretName := fmt.Sprintf("%s-secret", *tenantReq.Name)
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

	_, err = clientset.CoreV1().Secrets(ns).Create(ctx, &instanceSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}

	var envrionmentVariables []corev1.EnvVar
	// Check the Erasure Coding Parity for validity and pass it to Tenant
	if tenantReq.ErasureCodingParity > 0 {
		if tenantReq.ErasureCodingParity < 2 && tenantReq.ErasureCodingParity > 8 {
			return nil, errors.New("invalid Erasure Coding Value")
		}
		envrionmentVariables = append(envrionmentVariables, corev1.EnvVar{
			Name:  "MINIO_STORAGE_CLASS_STANDARD",
			Value: fmt.Sprintf("EC:%d", tenantReq.ErasureCodingParity),
		})
	}

	//Construct a MinIO Instance with everything we are getting from parameters
	minInst := operator.Tenant{
		ObjectMeta: metav1.ObjectMeta{
			Name: *tenantReq.Name,
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

	isEncryptionAvailable := false
	if tenantReq.EnableTLS != nil && *tenantReq.EnableTLS {
		// If user request autoCert, Operator will generate certificate keypair for MinIO (server), Console (server) and KES (server and app mTLS)
		isEncryptionAvailable = true
		minInst.Spec.RequestAutoCert = *tenantReq.EnableTLS
	}

	if !minInst.Spec.RequestAutoCert && tenantReq.TLS != nil && tenantReq.TLS.Minio != nil {
		// User provided TLS certificates for MinIO
		isEncryptionAvailable = true
		externalTLSCertificateSecretName := fmt.Sprintf("%s-instance-external-certificates", secretName)
		// disable autoCert
		minInst.Spec.RequestAutoCert = false

		tlsCrt, err := base64.StdEncoding.DecodeString(*tenantReq.TLS.Minio.Crt)
		if err != nil {
			return nil, err
		}

		tlsKey, err := base64.StdEncoding.DecodeString(*tenantReq.TLS.Minio.Key)
		if err != nil {
			return nil, err
		}

		externalTLSCertificateSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: externalTLSCertificateSecretName,
			},
			Type:      corev1.SecretTypeTLS,
			Immutable: &imm,
			Data: map[string][]byte{
				"tls.crt": tlsCrt,
				"tls.key": tlsKey,
			},
		}
		_, err = clientset.CoreV1().Secrets(ns).Create(ctx, &externalTLSCertificateSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}
		// Certificates used by the minio instance
		minInst.Spec.ExternalCertSecret = &operator.LocalCertificateReference{
			Name: externalTLSCertificateSecretName,
			Type: "kubernetes.io/tls",
		}
	}

	if tenantReq.Encryption != nil && isEncryptionAvailable {
		// Enable auto encryption
		minInst.Spec.Env = append(minInst.Spec.Env, corev1.EnvVar{
			Name:  "MINIO_KMS_AUTO_ENCRYPTION",
			Value: "on",
		})
		// KES client mTLSCertificates used by MinIO instance, only if autoCert is not enabled
		if !minInst.Spec.RequestAutoCert {
			minInst.Spec.ExternalClientCertSecret, err = getTenantExternalClientCertificates(ctx, clientset, ns, tenantReq.Encryption, secretName)
			if err != nil {
				return nil, err
			}
		}
		// KES configuration for Tenant instance
		minInst.Spec.KES, err = getKESConfiguration(ctx, clientset, ns, tenantReq.Encryption, secretName, minInst.Spec.RequestAutoCert)
		if err != nil {
			return nil, err
		}
	}

	// optionals are set below
	var consoleAccess string
	var consoleSecret string

	enableConsole := true
	if tenantReq.EnableConsole != nil && *tenantReq.EnableConsole {
		enableConsole = *tenantReq.EnableConsole
	}

	if enableConsole {
		consoleSelector := fmt.Sprintf("%s-console", *tenantReq.Name)
		consoleSecretName := fmt.Sprintf("%s-secret", consoleSelector)
		consoleAccess = RandomCharString(16)
		consoleSecret = RandomCharString(32)
		imm := true
		instanceSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: consoleSecretName,
			},
			Immutable: &imm,
			Data: map[string][]byte{
				"CONSOLE_HMAC_JWT_SECRET":  []byte(RandomCharString(16)),
				"CONSOLE_PBKDF_PASSPHRASE": []byte(RandomCharString(16)),
				"CONSOLE_PBKDF_SALT":       []byte(RandomCharString(8)),
				"CONSOLE_ACCESS_KEY":       []byte(consoleAccess),
				"CONSOLE_SECRET_KEY":       []byte(consoleSecret),
			},
		}

		// Enable IDP (Open ID Connect) for console
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
				if minInst.Spec.RequestAutoCert {
					consoleScheme = "https"
					consolePort = 9443
				}
				// https://[HOSTNAME]:9443 will be replaced by javascript in the browser to use the actual hostname
				// assigned to Console, eg: https://localhost:9443
				instanceSecret.Data["CONSOLE_IDP_CALLBACK"] = []byte(fmt.Sprintf("%s://[HOSTNAME]:%d/oauth_callback", consoleScheme, consolePort))
			}
		}

		_, err = clientset.CoreV1().Secrets(ns).Create(ctx, &instanceSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}

		const consoleVersion = "minio/console:v0.3.12"
		minInst.Spec.Console = &operator.ConsoleConfiguration{
			Replicas:      1,
			Image:         consoleVersion,
			ConsoleSecret: &corev1.LocalObjectReference{Name: consoleSecretName},
			Resources: corev1.ResourceRequirements{
				Requests: map[corev1.ResourceName]resource.Quantity{
					"memory": resource.MustParse("64Mi"),
				},
			},
		}

		if !minInst.Spec.RequestAutoCert && tenantReq.TLS != nil && tenantReq.TLS.Console != nil {
			consoleExternalTLSCertificateSecretName := fmt.Sprintf("%s-console-external-certificates", secretName)
			tlsCrt, err := base64.StdEncoding.DecodeString(*tenantReq.TLS.Console.Crt)
			if err != nil {
				return nil, err
			}
			tlsKey, err := base64.StdEncoding.DecodeString(*tenantReq.TLS.Console.Key)
			if err != nil {
				return nil, err
			}
			consoleExternalTLSCertificateSecret := corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name: consoleExternalTLSCertificateSecretName,
				},
				Type:      corev1.SecretTypeTLS,
				Immutable: &imm,
				Data: map[string][]byte{
					"tls.crt": tlsCrt,
					"tls.key": tlsKey,
				},
			}
			_, err = clientset.CoreV1().Secrets(ns).Create(ctx, &consoleExternalTLSCertificateSecret, metav1.CreateOptions{})
			if err != nil {
				return nil, err
			}
			// Certificates used by the minio instance
			minInst.Spec.Console.ExternalCertSecret = &operator.LocalCertificateReference{
				Name: consoleExternalTLSCertificateSecretName,
				Type: "kubernetes.io/tls",
			}
		}

	}

	// set the service name if provided
	if tenantReq.ServiceName != "" {
		minInst.Spec.ServiceName = tenantReq.ServiceName
	}
	// add annotations
	var annotations map[string]string
	if len(tenantReq.Annotations) > 0 {
		if minInst.Spec.Metadata == nil {
			minInst.Spec.Metadata = &metav1.ObjectMeta{}
		}
		annotations = tenantReq.Annotations
		minInst.Spec.Metadata.Annotations = annotations
	}
	// set the zones if they are provided
	for _, zone := range tenantReq.Zones {
		zone, err := parseTenantZoneRequest(zone, annotations)
		if err != nil {
			return nil, err
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
	} else if imagePullSecret, err = setImageRegistry(ctx, *tenantReq.Name, tenantReq.ImageRegistry, clientset.CoreV1(), ns); err != nil {
		log.Println("error setting image registry secret:", err)
		return nil, err
	}
	// pass the image pull secret to the Tenant
	if imagePullSecret != "" {
		minInst.Spec.ImagePullSecret = corev1.LocalObjectReference{
			Name: imagePullSecret,
		}
	}

	// set console image if provided
	if tenantReq.ConsoleImage != "" {
		minInst.Spec.Console.Image = tenantReq.ConsoleImage
	}

	opClient, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		return nil, err
	}

	_, err = opClient.MinioV1().Tenants(ns).Create(context.Background(), &minInst, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}

	// Integratrions
	if os.Getenv("GKE_INTEGRATION") != "" {
		err := gkeIntegration(clientset, *tenantReq.Name, ns, session.SessionToken)
		if err != nil {
			return nil, err
		}
	}
	response := &models.CreateTenantResponse{
		AccessKey: accessKey,
		SecretKey: secretKey,
	}
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
func setImageRegistry(ctx context.Context, tenantName string, req *models.ImageRegistry, clientset v1.CoreV1Interface, namespace string) (string, error) {
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

	instanceSecret := corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: pullSecretName,
		},
		Data: map[string][]byte{
			corev1.DockerConfigJsonKey: []byte(string(imRegistryJSON)),
		},
		Type: corev1.SecretTypeDockerConfigJson,
	}

	// Get or Create secret if it doesn't exist
	_, err = clientset.Secrets(namespace).Get(ctx, pullSecretName, metav1.GetOptions{})
	if err != nil {
		if k8sErrors.IsNotFound(err) {
			_, err = clientset.Secrets(namespace).Create(ctx, &instanceSecret, metav1.CreateOptions{})
			if err != nil {
				return "", err
			}
			return "", nil
		}
		return "", err
	}
	_, err = clientset.Secrets(namespace).Update(ctx, &instanceSecret, metav1.UpdateOptions{})
	if err != nil {
		return "", err
	}
	return pullSecretName, nil
}

// updateTenantAction does an update on the minioTenant by patching the desired changes
func updateTenantAction(ctx context.Context, operatorClient OperatorClient, clientset v1.CoreV1Interface, httpCl cluster.HTTPClientI, namespace string, params admin_api.UpdateTenantParams) error {
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
		if _, err := setImageRegistry(ctx, params.Tenant, imageRegistryReq, clientset, namespace); err != nil {
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

func getUpdateTenantResponse(session *models.Principal, params admin_api.UpdateTenantParams) error {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		log.Println("error getting operator client:", err)
		return err
	}
	// get Kubernetes Client
	clientset, err := cluster.K8sClient(session.SessionToken)
	if err != nil {
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

	if err := updateTenantAction(ctx, opClient, clientset.CoreV1(), httpC, params.Namespace, params); err != nil {
		log.Println("error patching Tenant:", err)
		return err
	}
	return nil
}

// addTenantZone creates a zone to a defined tenant
func addTenantZone(ctx context.Context, operatorClient OperatorClient, params admin_api.TenantAddZoneParams) error {
	tenant, err := operatorClient.TenantGet(ctx, params.Namespace, params.Tenant, metav1.GetOptions{})
	if err != nil {
		return err
	}

	zoneParams := params.Body
	zone, err := parseTenantZoneRequest(zoneParams, tenant.ObjectMeta.Annotations)
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

func getTenantAddZoneResponse(session *models.Principal, params admin_api.TenantAddZoneParams) error {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		log.Println("error getting operator client:", err)
		return err
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	if err := addTenantZone(ctx, opClient, params); err != nil {
		log.Println("error patching Tenant:", err)
		return err
	}
	return nil
}

// getTenantUsageResponse returns the usage of a tenant
func getTenantUsageResponse(session *models.Principal, params admin_api.GetTenantUsageParams) (*models.TenantUsage, error) {
	// 5 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opClientClientSet, err := cluster.OperatorClient(session.SessionToken)
	if err != nil {
		log.Println("error operator client", err)
		return nil, err
	}
	clientset, err := cluster.K8sClient(session.SessionToken)
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

	minTenant, err := getTenant(ctx, opClient, params.Namespace, params.Tenant)
	if err != nil {
		log.Println("error getting minioTenant:", err)
		return nil, err
	}
	minTenant.EnsureDefaults()
	tenantScheme := getTenantScheme(minTenant)

	svcName := fmt.Sprintf("%s.%s.svc.cluster.local", minTenant.MinIOCIServiceName(), minTenant.Namespace)

	mAdmin, err := getTenantAdminClient(
		ctx,
		k8sClient,
		params.Namespace,
		params.Tenant,
		svcName,
		tenantScheme,
		true)
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
	info := &models.TenantUsage{Used: adminInfo.Usage, DiskUsed: adminInfo.DisksUsage}
	return info, nil
}

// parseTenantZoneRequest parse zone request and returns the equivalent
// operator.Zone object
func parseTenantZoneRequest(zoneParams *models.Zone, annotations map[string]string) (*operator.Zone, error) {
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
			Name: "data",
		},
		Spec: volTemp,
	}
	if len(annotations) > 0 {
		vct.ObjectMeta.Annotations = annotations
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

func getTenantExternalClientCertificates(ctx context.Context, clientSet *kubernetes.Clientset, ns string, encryptionCfg *models.EncryptionConfiguration, secretName string) (clientCertificates *operator.LocalCertificateReference, err error) {
	instanceExternalClientCertificateSecretName := fmt.Sprintf("%s-instance-external-client-mtls-certificates", secretName)
	// If there's an error during this process we delete all KES configuration secrets
	defer func() {
		if err != nil {
			errDelete := clientSet.CoreV1().Secrets(ns).Delete(ctx, instanceExternalClientCertificateSecretName, metav1.DeleteOptions{})
			if errDelete != nil {
				log.Print(errDelete)
			}
			return
		}
	}()
	imm := true
	// Secret to store KES clients TLS mTLSCertificates (mTLS authentication)
	clientTLSCrt, err := base64.StdEncoding.DecodeString(*encryptionCfg.Client.Crt)
	if err != nil {
		return nil, err
	}
	clientTLSKey, err := base64.StdEncoding.DecodeString(*encryptionCfg.Client.Key)
	if err != nil {
		return nil, err
	}
	instanceExternalClientCertificateSecret := corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: instanceExternalClientCertificateSecretName,
		},
		Type:      corev1.SecretTypeTLS,
		Immutable: &imm,
		Data: map[string][]byte{
			"tls.crt": clientTLSCrt,
			"tls.key": clientTLSKey,
		},
	}
	_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &instanceExternalClientCertificateSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	// KES client mTLSCertificates used by MinIO instance
	clientCertificates = &operator.LocalCertificateReference{
		Name: instanceExternalClientCertificateSecretName,
		Type: "kubernetes.io/tls",
	}
	return clientCertificates, nil
}

func getKESConfiguration(ctx context.Context, clientSet *kubernetes.Clientset, ns string, encryptionCfg *models.EncryptionConfiguration, secretName string, autoCert bool) (kesConfiguration *operator.KESConfig, err error) {
	// secrets used by the KES configuration
	instanceExternalClientCertificateSecretName := fmt.Sprintf("%s-instance-external-client-mtls-certificates", secretName)
	kesExternalCertificateSecretName := fmt.Sprintf("%s-kes-external-mtls-certificates", secretName)
	kesClientCertSecretName := fmt.Sprintf("%s-kes-mtls-certificates", secretName)
	kesConfigurationSecretName := fmt.Sprintf("%s-kes-configuration", secretName)
	// If there's an error during this process we delete all KES configuration secrets
	defer func() {
		if err != nil {
			errDelete := clientSet.CoreV1().Secrets(ns).Delete(ctx, instanceExternalClientCertificateSecretName, metav1.DeleteOptions{})
			if errDelete != nil {
				log.Print(errDelete)
			}
			errDelete = clientSet.CoreV1().Secrets(ns).Delete(ctx, kesExternalCertificateSecretName, metav1.DeleteOptions{})
			if errDelete != nil {
				log.Print(errDelete)
			}
			errDelete = clientSet.CoreV1().Secrets(ns).Delete(ctx, kesClientCertSecretName, metav1.DeleteOptions{})
			if errDelete != nil {
				log.Print(errDelete)
			}
			errDelete = clientSet.CoreV1().Secrets(ns).Delete(ctx, kesConfigurationSecretName, metav1.DeleteOptions{})
			if errDelete != nil {
				log.Print(errDelete)
			}
			return
		}
	}()

	imm := true
	kesConfiguration = &operator.KESConfig{
		Image:    "minio/kes:v0.11.0",
		Replicas: 1,
		Metadata: nil,
	}
	// Using custom image for KES
	if encryptionCfg.Image != "" {
		kesConfiguration.Image = encryptionCfg.Image
	}
	// if autoCert is enabled then Operator will generate the client certificates, calculate the client cert identity
	// and pass it to KES via the $MINIO_KES_IDENTITY variable
	clientCrtIdentity := "$MINIO_KES_IDENTITY"
	// Generate server certificates for KES only if autoCert is disabled
	if !autoCert {
		serverTLSCrt, err := base64.StdEncoding.DecodeString(*encryptionCfg.Server.Crt)
		if err != nil {
			return nil, err
		}
		serverTLSKey, err := base64.StdEncoding.DecodeString(*encryptionCfg.Server.Key)
		if err != nil {
			return nil, err
		}
		// Secret to store KES server TLS mTLSCertificates
		kesExternalCertificateSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: kesExternalCertificateSecretName,
			},
			Type:      corev1.SecretTypeTLS,
			Immutable: &imm,
			Data: map[string][]byte{
				"tls.crt": serverTLSCrt,
				"tls.key": serverTLSKey,
			},
		}
		_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &kesExternalCertificateSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}
		// External mTLSCertificates used by KES
		kesConfiguration.ExternalCertSecret = &operator.LocalCertificateReference{
			Name: kesExternalCertificateSecretName,
			Type: "kubernetes.io/tls",
		}

		// Client certificate for KES used by Minio to mTLS
		clientTLSCrt, err := base64.StdEncoding.DecodeString(*encryptionCfg.Client.Crt)
		if err != nil {
			return nil, err
		}
		// Calculate the client cert identity based on the clientTLSCrt
		h := crypto.SHA256.New()
		certificate, err := kes.ParseCertificate(clientTLSCrt)
		if err != nil {
			return nil, err
		}
		h.Write(certificate.RawSubjectPublicKeyInfo)
		clientCrtIdentity = hex.EncodeToString(h.Sum(nil))
	}

	// Default kesConfiguration for KES
	kesConfig := kes.ServerConfig{
		Addr: "0.0.0.0:7373",
		Root: "disabled",
		TLS: kes.TLS{
			KeyPath:  "/tmp/kes/server.key",
			CertPath: "/tmp/kes/server.crt",
		},
		Policies: map[string]kes.Policy{
			"default-policy": {
				Paths: []string{
					"/v1/key/create/my-minio-key",
					"/v1/key/generate/my-minio-key",
					"/v1/key/decrypt/my-minio-key",
				},
				Identities: []kes.Identity{
					kes.Identity(clientCrtIdentity),
				},
			},
		},
		Cache: kes.Cache{
			Expiry: &kes.Expiry{
				Any:    5 * time.Minute,
				Unused: 20 * time.Second,
			},
		},
		Log: kes.Log{
			Error: "on",
			Audit: "off",
		},
		Keys: kes.Keys{},
	}

	// operator will mount the mTLSCertificates in the following paths
	// therefore we set these values in the KES yaml kesConfiguration
	var mTLSClientCrtPath = "/tmp/kes/client.crt"
	var mTLSClientKeyPath = "/tmp/kes/client.key"
	var mTLSClientCaPath = "/tmp/kes/ca.crt"
	// map to hold mTLSCertificates for KES mTLS against Vault
	mTLSCertificates := map[string][]byte{}

	// if encryption is enabled and encryption is configured to use Vault
	if encryptionCfg.Vault != nil {
		// Initialize Vault Config

		kesConfig.Keys.Vault = &kes.Vault{
			Endpoint:   *encryptionCfg.Vault.Endpoint,
			EnginePath: encryptionCfg.Vault.Engine,
			Namespace:  encryptionCfg.Vault.Namespace,
			Prefix:     encryptionCfg.Vault.Prefix,
			Status: &kes.VaultStatus{
				Ping: 10 * time.Second,
			},
		}
		// Vault AppRole credentials
		if encryptionCfg.Vault.Approle != nil {
			kesConfig.Keys.Vault.AppRole = &kes.AppRole{
				EnginePath: encryptionCfg.Vault.Approle.Engine,
				ID:         *encryptionCfg.Vault.Approle.ID,
				Secret:     *encryptionCfg.Vault.Approle.Secret,
				Retry:      15 * time.Second,
			}
		} else {
			return nil, errors.New("approle credentials missing for kes")
		}

		// Vault mTLS kesConfiguration
		if encryptionCfg.Vault.TLS != nil {
			vaultTLSConfig := encryptionCfg.Vault.TLS
			kesConfig.Keys.Vault.TLS = &kes.VaultTLS{}
			if vaultTLSConfig.Crt != "" {
				clientCrt, err := base64.StdEncoding.DecodeString(vaultTLSConfig.Crt)
				if err != nil {
					return nil, err
				}
				mTLSCertificates["client.crt"] = clientCrt
				kesConfig.Keys.Vault.TLS.CertPath = mTLSClientCrtPath
			}
			if vaultTLSConfig.Key != "" {
				clientKey, err := base64.StdEncoding.DecodeString(vaultTLSConfig.Key)
				if err != nil {
					return nil, err
				}
				mTLSCertificates["client.key"] = clientKey
				kesConfig.Keys.Vault.TLS.KeyPath = mTLSClientKeyPath
			}
			if vaultTLSConfig.Ca != "" {
				caCrt, err := base64.StdEncoding.DecodeString(vaultTLSConfig.Ca)
				if err != nil {
					return nil, err
				}
				mTLSCertificates["ca.crt"] = caCrt
				kesConfig.Keys.Vault.TLS.CAPath = mTLSClientCaPath
			}
		}
	} else if encryptionCfg.Aws != nil {
		// Initialize AWS
		kesConfig.Keys.Aws = &kes.Aws{
			SecretsManager: &kes.AwsSecretManager{},
		}
		// AWS basic kesConfiguration
		if encryptionCfg.Aws.Secretsmanager != nil {
			kesConfig.Keys.Aws.SecretsManager.Endpoint = *encryptionCfg.Aws.Secretsmanager.Endpoint
			kesConfig.Keys.Aws.SecretsManager.Region = *encryptionCfg.Aws.Secretsmanager.Region
			kesConfig.Keys.Aws.SecretsManager.KmsKey = encryptionCfg.Aws.Secretsmanager.Kmskey
			// AWS credentials
			if encryptionCfg.Aws.Secretsmanager.Credentials != nil {
				kesConfig.Keys.Aws.SecretsManager.Login = &kes.AwsSecretManagerLogin{
					AccessKey:    *encryptionCfg.Aws.Secretsmanager.Credentials.Accesskey,
					SecretKey:    *encryptionCfg.Aws.Secretsmanager.Credentials.Secretkey,
					SessionToken: encryptionCfg.Aws.Secretsmanager.Credentials.Token,
				}
			}
		}
	} else if encryptionCfg.Gemalto != nil {
		// Initialize Gemalto
		kesConfig.Keys.Gemalto = &kes.Gemalto{
			KeySecure: &kes.GemaltoKeySecure{},
		}
		// Gemalto Configuration
		if encryptionCfg.Gemalto.Keysecure != nil {
			kesConfig.Keys.Gemalto.KeySecure.Endpoint = *encryptionCfg.Gemalto.Keysecure.Endpoint
			// Gemalto TLS kesConfiguration
			if encryptionCfg.Gemalto.Keysecure.TLS != nil {
				if encryptionCfg.Gemalto.Keysecure.TLS.Ca != nil {
					caCrt, err := base64.StdEncoding.DecodeString(*encryptionCfg.Gemalto.Keysecure.TLS.Ca)
					if err != nil {
						return nil, err
					}
					mTLSCertificates["ca.crt"] = caCrt
					kesConfig.Keys.Gemalto.KeySecure.TLS = &kes.GemaltoTLS{
						CAPath: mTLSClientCaPath,
					}
				}
			}
			// Gemalto Login
			if encryptionCfg.Gemalto.Keysecure.Credentials != nil {
				kesConfig.Keys.Gemalto.KeySecure.Credentials = &kes.GemaltoCredentials{
					Token:  *encryptionCfg.Gemalto.Keysecure.Credentials.Token,
					Domain: *encryptionCfg.Gemalto.Keysecure.Credentials.Domain,
					Retry:  15 * time.Second,
				}
			}
		}
	}

	// if mTLSCertificates contains elements we create the kubernetes secret
	if len(mTLSCertificates) > 0 {
		// Secret to store KES mTLS kesConfiguration
		kesClientCertSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: kesClientCertSecretName,
			},
			Immutable: &imm,
			Data:      mTLSCertificates,
		}
		_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &kesClientCertSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}
		// kubernetes generic secret
		kesConfiguration.ClientCertSecret = &operator.LocalCertificateReference{
			Name: kesClientCertSecretName,
		}
	}

	// Generate Yaml kesConfiguration for KES
	serverConfigYaml, err := yaml.Marshal(kesConfig)
	if err != nil {
		return nil, err
	}
	// Secret to store KES server kesConfiguration
	kesConfigurationSecret := corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: kesConfigurationSecretName,
		},
		Immutable: &imm,
		Data: map[string][]byte{
			"server-config.yaml": serverConfigYaml,
		},
	}
	_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &kesConfigurationSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	// Configuration used by KES
	kesConfiguration.Configuration = &corev1.LocalObjectReference{
		Name: kesConfigurationSecretName,
	}
	return kesConfiguration, nil
}

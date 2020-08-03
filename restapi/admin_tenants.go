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
	kes2 "github.com/minio/kes"
	"gopkg.in/yaml.v2"
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
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

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

func getTenant(ctx context.Context, operatorClient OperatorClient, namespace, tenantName string) (*operator.Tenant, error) {
	minInst, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return minInst, nil
}

func getTenantInfo(tenant *operator.Tenant) *models.Tenant {
	var instanceCount int64
	var volumeCount int64
	for _, zone := range tenant.Spec.Zones {
		instanceCount = instanceCount + int64(zone.Servers)
		volumeCount = volumeCount + int64(zone.Servers*zone.VolumesPerServer)
	}

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
	minioImage := params.Body.Image

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

	ns := *params.Body.Namespace

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

	_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &instanceSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}

	//Construct a MinIO Instance with everything we are getting from parameters
	minInst := operator.Tenant{
		ObjectMeta: metav1.ObjectMeta{
			Name: *params.Body.Name,
		},
		Spec: operator.TenantSpec{
			Image:     minioImage,
			Mountpath: "/export",
			CredsSecret: &corev1.LocalObjectReference{
				Name: secretName,
			},
			Env: []corev1.EnvVar{},
		},
	}
	idpEnabled := false
	// Enable IDP (Active Directory) for MinIO
	if params.Body.Idp != nil && params.Body.Idp.ActiveDirectory != nil {
		url := *params.Body.Idp.ActiveDirectory.URL
		userNameFormat := *params.Body.Idp.ActiveDirectory.UsernameFormat
		userSearchFilter := *params.Body.Idp.ActiveDirectory.UserSearchFilter
		tlsSkipVerify := params.Body.Idp.ActiveDirectory.SkipSslVerification
		serverInsecure := params.Body.Idp.ActiveDirectory.ServerInsecure
		groupSearchDN := params.Body.Idp.ActiveDirectory.GroupSearchBaseDn
		groupSearchFilter := params.Body.Idp.ActiveDirectory.GroupSearchFilter
		groupNameAttribute := params.Body.Idp.ActiveDirectory.GroupNameAttribute
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

	// operator request AutoCert feature
	encryption := false
	if params.Body.EnableSsl != nil {
		encryption = true
		minInst.Spec.RequestAutoCert = *params.Body.EnableSsl
	}

	// User provided TLS certificates (this will take priority over autoCert)
	if params.Body.TLS != nil && params.Body.TLS.Crt != nil && params.Body.TLS.Key != nil {
		encryption = true
		externalTLSCertificateSecretName := fmt.Sprintf("%s-instance-external-certificates", secretName)
		// disable autoCert
		minInst.Spec.RequestAutoCert = false

		tlsCrt, err := base64.StdEncoding.DecodeString(*params.Body.TLS.Crt)
		if err != nil {
			return nil, err
		}

		tlsKey, err := base64.StdEncoding.DecodeString(*params.Body.TLS.Key)
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
		_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &externalTLSCertificateSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}
		// Certificates used by the minio instance
		minInst.Spec.ExternalCertSecret = &operator.LocalCertificateReference{
			Name: externalTLSCertificateSecretName,
			Type: "kubernetes.io/tls",
		}
	}

	if params.Body.Encryption != nil && encryption {
		// Enable auto encryption
		minInst.Spec.Env = append(minInst.Spec.Env, corev1.EnvVar{
			Name:  "MINIO_KMS_AUTO_ENCRYPTION",
			Value: "on",
		})

		if params.Body.Encryption.MasterKey != "" {
			// Configure MinIO to use MINIO_KMS_MASTER_KEY legacy key
			// https://docs.min.io/docs/minio-vault-legacy.html
			minInst.Spec.Env = append(minInst.Spec.Env, corev1.EnvVar{
				Name:  "MINIO_KMS_MASTER_KEY",
				Value: params.Body.Encryption.MasterKey,
			})
		} else {
			// KES configuration for Tenant instance
			minInst.Spec.KES = &operator.KESConfig{
				Image:    "minio/kes:latest",
				Replicas: 1,
				Metadata: nil,
			}
			// Using custom image for KES
			if params.Body.Encryption.Image != "" {
				minInst.Spec.KES.Image = params.Body.Encryption.Image
			}
			// Secret to store KES server TLS certificates
			// TODO check if AutoCert it's already configured
			serverTLSCrt, err := base64.StdEncoding.DecodeString(*params.Body.Encryption.Server.Crt)
			if err != nil {
				return nil, err
			}
			serverTLSKey, err := base64.StdEncoding.DecodeString(*params.Body.Encryption.Server.Key)
			if err != nil {
				return nil, err
			}
			kesExternalCertificateSecretName := fmt.Sprintf("%s-kes-external-certificates", secretName)
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
			_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &kesExternalCertificateSecret, metav1.CreateOptions{})
			if err != nil {
				return nil, err
			}
			// External certificates used by KES
			minInst.Spec.KES.ExternalCertSecret = &operator.LocalCertificateReference{
				Name: kesExternalCertificateSecretName,
				Type: "kubernetes.io/tls",
			}

			// Secret to store KES clients TLS certificates (mTLS authentication)
			clientTLSCrt, err := base64.StdEncoding.DecodeString(*params.Body.Encryption.Client.Crt)
			if err != nil {
				return nil, err
			}
			clientTLSKey, err := base64.StdEncoding.DecodeString(*params.Body.Encryption.Client.Key)
			if err != nil {
				return nil, err
			}
			instanceExternalClientCertificateSecretName := fmt.Sprintf("%s-instance-external-client-certificates", secretName)
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
			_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &instanceExternalClientCertificateSecret, metav1.CreateOptions{})
			if err != nil {
				return nil, err
			}
			// KES client certificates used by MinIO instance
			minInst.Spec.ExternalClientCertSecret = &operator.LocalCertificateReference{
				Name: instanceExternalClientCertificateSecretName,
				Type: "kubernetes.io/tls",
			}
			// Calculate the client cert identity based on the clientTLSCrt
			h := crypto.SHA256.New()
			certificate, err := kes.ParseCertificate(clientTLSCrt)
			if err != nil {
				return nil, err
			}
			h.Write(certificate.RawSubjectPublicKeyInfo)
			clientCrtIdentity := hex.EncodeToString(h.Sum(nil))
			// Default configuration for KES
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
						Identities: []kes2.Identity{
							kes2.Identity(clientCrtIdentity),
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
			// if encryption is enabled and encryption is configured to use Vault
			if params.Body.Encryption.Vault != nil {
				// Initialize Vault Config
				kesConfig.Keys.Vault = &kes.Vault{
					Endpoint:   *params.Body.Encryption.Vault.Endpoint,
					EnginePath: params.Body.Encryption.Vault.Engine,
					Namespace:  params.Body.Encryption.Vault.Namespace,
					Prefix:     params.Body.Encryption.Vault.Prefix,
					Status: &kes.VaultStatus{
						Ping: 10 * time.Second,
					},
				}
				// Vault AppRole credentials
				if params.Body.Encryption.Vault.Approle != nil {
					kesConfig.Keys.Vault.AppRole = &kes.AppRole{
						EnginePath: params.Body.Encryption.Vault.Approle.Engine,
						ID:         *params.Body.Encryption.Vault.Approle.ID,
						Secret:     *params.Body.Encryption.Vault.Approle.Secret,
						Retry:      15 * time.Second,
					}
				} else {
					return nil, errors.New("approle credentials missing for kes")
				}
			} else if params.Body.Encryption.Aws != nil {
				// Initialize AWS
				kesConfig.Keys.Aws = &kes.Aws{
					SecretsManager: &kes.AwsSecretManager{},
				}
				// AWS basic configuration
				if params.Body.Encryption.Aws.Secretsmanager != nil {
					kesConfig.Keys.Aws.SecretsManager.Endpoint = *params.Body.Encryption.Aws.Secretsmanager.Endpoint
					kesConfig.Keys.Aws.SecretsManager.Region = *params.Body.Encryption.Aws.Secretsmanager.Region
					kesConfig.Keys.Aws.SecretsManager.KmsKey = params.Body.Encryption.Aws.Secretsmanager.Kmskey
					// AWS credentials
					if params.Body.Encryption.Aws.Secretsmanager.Credentials != nil {
						kesConfig.Keys.Aws.SecretsManager.Login = &kes.AwsSecretManagerLogin{
							AccessKey:    *params.Body.Encryption.Aws.Secretsmanager.Credentials.Accesskey,
							SecretKey:    *params.Body.Encryption.Aws.Secretsmanager.Credentials.Secretkey,
							SessionToken: params.Body.Encryption.Aws.Secretsmanager.Credentials.Token,
						}
					}
				}
			} else if params.Body.Encryption.Gemalto != nil {
				// Initialize Gemalto
				kesConfig.Keys.Gemalto = &kes.Gemalto{
					KeySecure: &kes.GemaltoKeySecure{},
				}
				// Gemalto Configuration
				if params.Body.Encryption.Gemalto.Keysecure != nil {
					kesConfig.Keys.Gemalto.KeySecure.Endpoint = *params.Body.Encryption.Gemalto.Keysecure.Endpoint
					// Gemalto TLS configuration
					if params.Body.Encryption.Gemalto.Keysecure.TLS != nil {
						kesConfig.Keys.Gemalto.KeySecure.TLS = &kes.GemaltoTLS{
							CAPath: *params.Body.Encryption.Gemalto.Keysecure.TLS.Ca,
						}
					}
					// Gemalto Login
					if params.Body.Encryption.Gemalto.Keysecure.Credentials != nil {
						kesConfig.Keys.Gemalto.KeySecure.Credentials = &kes.GemaltoCredentials{
							Token:  *params.Body.Encryption.Gemalto.Keysecure.Credentials.Token,
							Domain: *params.Body.Encryption.Gemalto.Keysecure.Credentials.Domain,
							Retry:  15 * time.Second,
						}
					}
				}
			}
			// Generate Yaml configuration for KES
			serverConfigYaml, err := yaml.Marshal(kesConfig)
			if err != nil {
				return nil, err
			}
			// Secret to store KES server configuration
			kesConfigurationSecretName := fmt.Sprintf("%s-kes-configuration", secretName)
			kesConfigurationSecret := corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name: kesConfigurationSecretName,
				},
				Immutable: &imm,
				Data: map[string][]byte{
					"server-config.yaml": serverConfigYaml,
				},
			}
			_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &kesConfigurationSecret, metav1.CreateOptions{})
			if err != nil {
				return nil, err
			}
			// Configuration used by KES
			minInst.Spec.KES.Configuration = &corev1.LocalObjectReference{
				Name: kesConfigurationSecretName,
			}
		}
	}

	// optionals are set below
	var consoleAccess string
	var consoleSecret string

	enableConsole := true
	if params.Body.EnableConsole != nil {
		enableConsole = *params.Body.EnableConsole
	}

	if enableConsole {
		consoleSelector := fmt.Sprintf("%s-console", *params.Body.Name)
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
		if !idpEnabled && params.Body.Idp != nil && params.Body.Idp.Oidc != nil {
			url := *params.Body.Idp.Oidc.URL
			clientID := *params.Body.Idp.Oidc.ClientID
			secretID := *params.Body.Idp.Oidc.SecretID
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

		_, err = clientset.CoreV1().Secrets(ns).Create(context.Background(), &instanceSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}

		const consoleVersion = "minio/console:v0.3.6"
		minInst.Spec.Console = &operator.ConsoleConfiguration{
			Replicas:      2,
			Image:         consoleVersion,
			ConsoleSecret: &corev1.LocalObjectReference{Name: consoleSecretName},
			Resources: corev1.ResourceRequirements{
				Requests: map[corev1.ResourceName]resource.Quantity{
					"memory": resource.MustParse("64Mi"),
				},
			},
		}
	}

	// set the service name if provided
	if params.Body.ServiceName != "" {
		minInst.Spec.ServiceName = params.Body.ServiceName
	}
	// set the zones if they are provided
	for _, zone := range params.Body.Zones {
		zone, err := parseTenantZoneRequest(zone)
		if err != nil {
			return nil, err
		}
		minInst.Spec.Zones = append(minInst.Spec.Zones, *zone)
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
		err := gkeIntegration(clientset, *params.Body.Name, ns, session.SessionToken)
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
		response.Console = &models.CreateTenantResponseConsole{}
		response.Console.AccessKey = consoleAccess
		response.Console.SecretKey = consoleSecret
	}
	return response, nil
}

// updateTenantAction does an update on the minioTenant by patching the desired changes
func updateTenantAction(ctx context.Context, operatorClient OperatorClient, httpCl cluster.HTTPClientI, nameSpace string, params admin_api.UpdateTenantParams) error {
	imageToUpdate := params.Body.Image
	minInst, err := operatorClient.TenantGet(ctx, nameSpace, params.Tenant, metav1.GetOptions{})
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
	_, err = operatorClient.TenantPatch(ctx, nameSpace, minInst.Name, types.MergePatchType, payloadBytes, metav1.PatchOptions{})
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

	opClient := &operatorClient{
		client: opClientClientSet,
	}
	httpC := &cluster.HTTPClient{
		Client: &http.Client{
			Timeout: 4 * time.Second,
		},
	}
	if err := updateTenantAction(ctx, opClient, httpC, params.Namespace, params); err != nil {
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
	tenantScheme := getTenantScheme(minTenant)

	svcName := minTenant.Spec.ServiceName
	if svcName == "" {
		svcName = minTenant.Name
		// TODO:
		// 1 get tenant services
		// 2 filter out cluster ip svc
	}

	mAdmin, err := getTenantAdminClient(
		ctx,
		k8sClient,
		params.Namespace,
		params.Tenant,
		svcName,
		tenantScheme)
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
		toleration := corev1.Toleration{
			Key:               elem.Key,
			Operator:          corev1.TolerationOperator(elem.Operator),
			Value:             elem.Value,
			Effect:            corev1.TaintEffect(elem.Effect),
			TolerationSeconds: &elem.TolerationSeconds,
		}
		tolerations = append(tolerations, toleration)
	}

	zone := &operator.Zone{
		Name:             zoneParams.Name,
		Servers:          int32(*zoneParams.Servers),
		VolumesPerServer: *zoneParams.VolumesPerServer,
		VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
			ObjectMeta: metav1.ObjectMeta{
				Name: "data",
			},
			Spec: volTemp,
		},
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
		toleration := &models.ZoneTolerationsItems0{
			Key:               elem.Key,
			Operator:          string(elem.Operator),
			Value:             elem.Value,
			Effect:            string(elem.Effect),
			TolerationSeconds: *elem.TolerationSeconds,
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

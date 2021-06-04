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
	"crypto"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"strconv"
	"time"

	"errors"

	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/kes"
	"github.com/minio/console/restapi/operations/admin_api"
	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"
	"gopkg.in/yaml.v2"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// tenantUpdateCertificates receives the keyPair certificates (public and private keys) for Minio and Console and will try
// to replace the existing kubernetes secrets with the new values, then will restart the affected pods so the new volumes can be mounted
func tenantUpdateCertificates(ctx context.Context, operatorClient OperatorClientI, clientSet K8sClientI, namespace string, params admin_api.TenantUpdateCertificateParams) error {
	tenantName := params.Tenant
	tenant, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		return err
	}
	secretName := fmt.Sprintf("%s-secret", tenantName)
	body := params.Body
	// check if MinIO is deployed with external certs and user provided new MinIO keypair
	if tenant.ExternalCert() && body.Minio != nil {
		minioCertSecretName := fmt.Sprintf("%s-instance-external-certificates", secretName)
		// update certificates
		if _, err := createOrReplaceExternalCertSecrets(ctx, clientSet, namespace, body.Minio, minioCertSecretName, tenantName); err != nil {
			return err
		}
		// restart MinIO pods
		err := clientSet.deletePodCollection(ctx, namespace, metav1.DeleteOptions{}, metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", miniov2.TenantLabel, tenantName),
		})
		if err != nil {
			return err
		}
	}
	// check if Console is deployed with external certs and user provided new Console keypair
	if tenant.ConsoleExternalCert() && tenant.HasConsoleEnabled() && body.Console != nil {
		consoleCertSecretName := fmt.Sprintf("%s-console-external-certificates", secretName)
		// update certificates
		certificates := []*models.KeyPairConfiguration{body.Console}
		if _, err := createOrReplaceExternalCertSecrets(ctx, clientSet, namespace, certificates, consoleCertSecretName, tenantName); err != nil {
			return err
		}
		// restart Console pods
		err := clientSet.deletePodCollection(ctx, namespace, metav1.DeleteOptions{}, metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", miniov2.ConsoleTenantLabel, fmt.Sprintf("%s-console", tenantName)),
		})
		if err != nil {
			return err
		}
	}
	return nil
}

// getTenantUpdateCertificatesResponse wrapper of tenantUpdateCertificates
func getTenantUpdateCertificatesResponse(session *models.Principal, params admin_api.TenantUpdateCertificateParams) *models.Error {
	ctx := context.Background()
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err, errorUnableToUpdateTenantCertificates)
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err, errorUnableToUpdateTenantCertificates)
	}
	opClient := operatorClient{
		client: opClientClientSet,
	}
	if err := tenantUpdateCertificates(ctx, &opClient, &k8sClient, params.Namespace, params); err != nil {
		return prepareError(err, errorUnableToUpdateTenantCertificates)
	}
	return nil
}

// tenantUpdateEncryption allow user to update KES server certificates, KES client certificates (used by MinIO for mTLS) and KES configuration (KMS configuration, credentials, etc)
func tenantUpdateEncryption(ctx context.Context, operatorClient OperatorClientI, clientSet K8sClientI, namespace string, params admin_api.TenantUpdateEncryptionParams) error {
	tenantName := params.Tenant
	secretName := fmt.Sprintf("%s-secret", tenantName)
	tenant, err := operatorClient.TenantGet(ctx, namespace, tenantName, metav1.GetOptions{})
	body := params.Body
	if err != nil {
		return err
	}
	// Check if encryption is enabled for MinIO via KES
	if tenant.HasKESEnabled() {
		// check if KES is deployed with external certificates and user provided new server keypair
		if tenant.KESExternalCert() && body.Server != nil {
			kesExternalCertSecretName := fmt.Sprintf("%s-kes-external-cert", secretName)
			// update certificates
			certificates := []*models.KeyPairConfiguration{body.Server}
			if _, err := createOrReplaceExternalCertSecrets(ctx, clientSet, namespace, certificates, kesExternalCertSecretName, tenantName); err != nil {
				return err
			}
		}
		// check if Tenant is deployed with external client certificates and user provided new client keypaiir
		if tenant.ExternalClientCert() && body.Client != nil {
			tenantExternalClientCertSecretName := fmt.Sprintf("%s-tenant-external-client-cert", secretName)
			// Update certificates
			certificates := []*models.KeyPairConfiguration{body.Client}
			if _, err := createOrReplaceExternalCertSecrets(ctx, clientSet, namespace, certificates, tenantExternalClientCertSecretName, tenantName); err != nil {
				return err
			}
			// Restart MinIO pods to mount the new client secrets
			err := clientSet.deletePodCollection(ctx, namespace, metav1.DeleteOptions{}, metav1.ListOptions{
				LabelSelector: fmt.Sprintf("%s=%s", miniov2.TenantLabel, tenantName),
			})
			if err != nil {
				return err
			}
		}
		// update KES identities in kes-configuration.yaml secret
		kesConfigurationSecretName := fmt.Sprintf("%s-kes-configuration", secretName)
		kesClientCertSecretName := fmt.Sprintf("%s-kes-client-cert", secretName)
		_, _, err := createOrReplaceKesConfigurationSecrets(ctx, clientSet, namespace, body, kesConfigurationSecretName, kesClientCertSecretName, tenantName)
		if err != nil {
			return err
		}
		// Restart KES pods to mount the new configuration
		err = clientSet.deletePodCollection(ctx, namespace, metav1.DeleteOptions{}, metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", miniov2.KESInstanceLabel, fmt.Sprintf("%s-kes", tenantName)),
		})
		if err != nil {
			return err
		}
	}
	return nil
}

// getTenantUpdateEncryptionResponse is a wrapper for tenantUpdateEncryption
func getTenantUpdateEncryptionResponse(session *models.Principal, params admin_api.TenantUpdateEncryptionParams) *models.Error {
	ctx := context.Background()
	// get Kubernetes Client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err, errorUpdatingEncryptionConfig)
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(err, errorUpdatingEncryptionConfig)
	}
	opClient := operatorClient{
		client: opClientClientSet,
	}
	if err := tenantUpdateEncryption(ctx, &opClient, &k8sClient, params.Namespace, params); err != nil {
		return prepareError(err, errorUpdatingEncryptionConfig)
	}
	return nil
}

// getKESConfiguration will generate the KES server certificate secrets, the tenant client secrets for mTLS authentication between MinIO and KES and the
// kes-configuration.yaml file used by the KES service (how to connect to the external KMS, eg: Vault, AWS, Gemalto, etc)
func getKESConfiguration(ctx context.Context, clientSet K8sClientI, ns string, encryptionCfg *models.EncryptionConfiguration, secretName, tenantName string) (kesConfiguration *miniov2.KESConfig, err error) {
	// Secrets used by the KES service
	//
	// kesExternalCertSecretName is the name of the secret that will store the certificates for TLS in the KES server, eg: server.key and server.crt
	kesExternalCertSecretName := fmt.Sprintf("%s-kes-external-cert", secretName)
	// kesClientCertSecretName is the name of the secret that will store the certificates for mTLS between KES and the KMS, eg: mTLS with Vault or Gemalto KMS
	kesClientCertSecretName := fmt.Sprintf("%s-kes-client-cert", secretName)
	// kesConfigurationSecretName is the name of the secret that will store the configuration file, eg: kes-configuration.yaml
	kesConfigurationSecretName := fmt.Sprintf("%s-kes-configuration", secretName)

	kesConfiguration = &miniov2.KESConfig{
		Image:    KESImageVersion,
		Replicas: 1,
	}
	// Using custom image for KES
	if encryptionCfg.Image != "" {
		kesConfiguration.Image = encryptionCfg.Image
	}
	// Using custom replicas for KES
	if encryptionCfg.Replicas != "" {
		replicas, errReplicas := strconv.Atoi(encryptionCfg.Replicas)
		if errReplicas != nil {
			kesConfiguration.Replicas = int32(replicas)
		}
	}
	// Generate server certificates for KES
	if encryptionCfg.Server != nil {
		certificates := []*models.KeyPairConfiguration{encryptionCfg.Server}
		certificateSecrets, err := createOrReplaceExternalCertSecrets(ctx, clientSet, ns, certificates, kesExternalCertSecretName, tenantName)
		if err != nil {
			return nil, err
		}
		if len(certificateSecrets) > 0 {
			// External TLS certificates used by KES
			kesConfiguration.ExternalCertSecret = certificateSecrets[0]
		}
	}
	// Prepare kesConfiguration for KES
	serverConfigSecret, clientCertSecret, err := createOrReplaceKesConfigurationSecrets(ctx, clientSet, ns, encryptionCfg, kesConfigurationSecretName, kesClientCertSecretName, tenantName)
	if err != nil {
		return nil, err
	}
	// Configuration used by KES
	kesConfiguration.Configuration = serverConfigSecret
	kesConfiguration.ClientCertSecret = clientCertSecret

	return kesConfiguration, nil
}

type tenantSecret struct {
	Name    string
	Content map[string][]byte
}

// createOrReplaceSecrets receives an array of Tenant Secrets to be stored as k8s secrets
func createOrReplaceSecrets(ctx context.Context, clientSet K8sClientI, ns string, secrets []tenantSecret, tenantName string) ([]*miniov2.LocalCertificateReference, error) {
	var k8sSecrets []*miniov2.LocalCertificateReference
	for _, secret := range secrets {
		if len(secret.Content) > 0 && secret.Name != "" {
			// delete secret with same name if exists
			err := clientSet.deleteSecret(ctx, ns, secret.Name, metav1.DeleteOptions{})
			if err != nil {
				// log the error if any and continue
				LogError("deleting secret name %s failed: %v, continuing..", secret.Name, err)
			}
			imm := true
			k8sSecret := &corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name: secret.Name,
					Labels: map[string]string{
						miniov2.TenantLabel: tenantName,
					},
				},
				Type:      corev1.SecretTypeOpaque,
				Immutable: &imm,
				Data:      secret.Content,
			}
			_, err = clientSet.createSecret(ctx, ns, k8sSecret, metav1.CreateOptions{})
			if err != nil {
				return nil, err
			}
			k8sSecrets = append(k8sSecrets, &miniov2.LocalCertificateReference{
				Name: secret.Name,
				Type: "Opaque",
			})
		}
	}
	return k8sSecrets, nil
}

// createOrReplaceExternalCertSecrets receives an array of KeyPairs (public and private key), encoded in base64, decode it and generate an equivalent number of kubernetes
// secrets to be used by the miniov2 for TLS encryption
func createOrReplaceExternalCertSecrets(ctx context.Context, clientSet K8sClientI, ns string, keyPairs []*models.KeyPairConfiguration, secretName, tenantName string) ([]*miniov2.LocalCertificateReference, error) {
	var keyPairSecrets []*miniov2.LocalCertificateReference
	for i, keyPair := range keyPairs {
		keyPairSecretName := fmt.Sprintf("%s-%d", secretName, i)
		if keyPair == nil || keyPair.Crt == nil || keyPair.Key == nil || *keyPair.Crt == "" || *keyPair.Key == "" {
			return nil, errors.New("certificate files must not be empty")
		}
		// delete secret with same name if exists
		err := clientSet.deleteSecret(ctx, ns, keyPairSecretName, metav1.DeleteOptions{})
		if err != nil {
			// log the error if any and continue
			LogError("deleting secret name %s failed: %v, continuing..", keyPairSecretName, err)
		}
		imm := true
		tlsCrt, err := base64.StdEncoding.DecodeString(*keyPair.Crt)
		if err != nil {
			return nil, err
		}
		tlsKey, err := base64.StdEncoding.DecodeString(*keyPair.Key)
		if err != nil {
			return nil, err
		}
		externalTLSCertificateSecret := &corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: keyPairSecretName,
				Labels: map[string]string{
					miniov2.TenantLabel: tenantName,
				},
			},
			Type:      corev1.SecretTypeTLS,
			Immutable: &imm,
			Data: map[string][]byte{
				"tls.crt": tlsCrt,
				"tls.key": tlsKey,
			},
		}
		_, err = clientSet.createSecret(ctx, ns, externalTLSCertificateSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, err
		}
		// Certificates used by the minio instance
		keyPairSecrets = append(keyPairSecrets, &miniov2.LocalCertificateReference{
			Name: keyPairSecretName,
			Type: "kubernetes.io/tls",
		})
	}
	return keyPairSecrets, nil
}

func createOrReplaceKesConfigurationSecrets(ctx context.Context, clientSet K8sClientI, ns string, encryptionCfg *models.EncryptionConfiguration, kesConfigurationSecretName, kesClientCertSecretName, tenantName string) (*corev1.LocalObjectReference, *miniov2.LocalCertificateReference, error) {
	// delete KES configuration secret if exists
	if err := clientSet.deleteSecret(ctx, ns, kesConfigurationSecretName, metav1.DeleteOptions{}); err != nil {
		// log the error if any and continue
		LogError("deleting secret name %s failed: %v, continuing..", kesConfigurationSecretName, err)
	}
	// delete KES client cert secret if exists
	if err := clientSet.deleteSecret(ctx, ns, kesClientCertSecretName, metav1.DeleteOptions{}); err != nil {
		// log the error if any and continue
		LogError("deleting secret name %s failed: %v, continuing..", kesClientCertSecretName, err)
	}
	// if autoCert is enabled then Operator will generate the client certificates, calculate the client cert identity
	// and pass it to KES via the ${MINIO_KES_IDENTITY} variable
	clientCrtIdentity := "${MINIO_KES_IDENTITY}"
	// If a client certificate is provided proceed to calculate the identity
	if encryptionCfg.Client != nil {
		// Client certificate for KES used by Minio to mTLS
		clientTLSCrt, err := base64.StdEncoding.DecodeString(*encryptionCfg.Client.Crt)
		if err != nil {
			return nil, nil, err
		}
		// Calculate the client cert identity based on the clientTLSCrt
		h := crypto.SHA256.New()
		certificate, err := kes.ParseCertificate(clientTLSCrt)
		if err != nil {
			return nil, nil, err
		}
		h.Write(certificate.RawSubjectPublicKeyInfo)
		clientCrtIdentity = hex.EncodeToString(h.Sum(nil))
	}
	// Default kesConfiguration for KES
	kesConfig := &kes.ServerConfig{
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
	// miniov2 will mount the mTLSCertificates in the following paths
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
			return nil, nil, errors.New("approle credentials missing for kes")
		}
		// Vault mTLS kesConfiguration
		if encryptionCfg.Vault.TLS != nil {
			vaultTLSConfig := encryptionCfg.Vault.TLS
			kesConfig.Keys.Vault.TLS = &kes.VaultTLS{}
			if vaultTLSConfig.Crt != "" {
				clientCrt, err := base64.StdEncoding.DecodeString(vaultTLSConfig.Crt)
				if err != nil {
					return nil, nil, err
				}
				mTLSCertificates["client.crt"] = clientCrt
				kesConfig.Keys.Vault.TLS.CertPath = mTLSClientCrtPath
			}
			if vaultTLSConfig.Key != "" {
				clientKey, err := base64.StdEncoding.DecodeString(vaultTLSConfig.Key)
				if err != nil {
					return nil, nil, err
				}
				mTLSCertificates["client.key"] = clientKey
				kesConfig.Keys.Vault.TLS.KeyPath = mTLSClientKeyPath
			}
			if vaultTLSConfig.Ca != "" {
				caCrt, err := base64.StdEncoding.DecodeString(vaultTLSConfig.Ca)
				if err != nil {
					return nil, nil, err
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
						return nil, nil, err
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
	} else if encryptionCfg.Gcp != nil {
		// Initialize GCP
		kesConfig.Keys.Gcp = &kes.Gcp{
			SecretManager: &kes.GcpSecretManager{},
		}
		// GCP basic kesConfiguration
		if encryptionCfg.Gcp.Secretmanager != nil {
			kesConfig.Keys.Gcp.SecretManager.ProjectID = *encryptionCfg.Gcp.Secretmanager.ProjectID
			kesConfig.Keys.Gcp.SecretManager.Endpoint = encryptionCfg.Gcp.Secretmanager.Endpoint
			// GCP credentials
			if encryptionCfg.Gcp.Secretmanager.Credentials != nil {
				kesConfig.Keys.Gcp.SecretManager.Credentials = &kes.GcpCredentials{
					ClientEmail:  encryptionCfg.Gcp.Secretmanager.Credentials.ClientEmail,
					ClientID:     encryptionCfg.Gcp.Secretmanager.Credentials.ClientID,
					PrivateKeyID: encryptionCfg.Gcp.Secretmanager.Credentials.PrivateKeyID,
					PrivateKey:   encryptionCfg.Gcp.Secretmanager.Credentials.PrivateKey,
				}
			}
		}
	}
	imm := true
	// if mTLSCertificates contains elements we create the kubernetes secret
	var clientCertSecretReference *miniov2.LocalCertificateReference
	if len(mTLSCertificates) > 0 {
		// Secret to store KES mTLS kesConfiguration to authenticate against a KMS
		kesClientCertSecret := corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name: kesClientCertSecretName,
				Labels: map[string]string{
					miniov2.TenantLabel: tenantName,
				},
			},
			Immutable: &imm,
			Data:      mTLSCertificates,
		}
		_, err := clientSet.createSecret(ctx, ns, &kesClientCertSecret, metav1.CreateOptions{})
		if err != nil {
			return nil, nil, err
		}
		// kubernetes generic secret
		clientCertSecretReference = &miniov2.LocalCertificateReference{
			Name: kesClientCertSecretName,
		}
	}
	// Generate Yaml kesConfiguration for KES
	serverConfigYaml, err := yaml.Marshal(kesConfig)
	if err != nil {
		return nil, nil, err
	}
	// Secret to store KES server kesConfiguration
	kesConfigurationSecret := corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: kesConfigurationSecretName,
			Labels: map[string]string{
				miniov2.TenantLabel: tenantName,
			},
		},
		Immutable: &imm,
		Data: map[string][]byte{
			"server-config.yaml": serverConfigYaml,
		},
	}
	_, err = clientSet.createSecret(ctx, ns, &kesConfigurationSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, nil, err
	}
	return &corev1.LocalObjectReference{
		Name: kesConfigurationSecretName,
	}, clientCertSecretReference, nil
}

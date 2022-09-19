// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

package operatorapi

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/dustin/go-humanize"

	"github.com/minio/console/restapi"

	"github.com/minio/console/operatorapi/operations/operator_api"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"

	"github.com/go-openapi/swag"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func getTenantCreatedResponse(session *models.Principal, params operator_api.CreateTenantParams) (response *models.CreateTenantResponse, mError *models.Error) {
	tenantReq := params.Body
	minioImage := tenantReq.Image
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
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
		return nil, restapi.ErrorWithContext(ctx, err)
	}

	ns := *tenantReq.Namespace
	// if access/secret are provided, use them, else create a random pair

	accessKey := restapi.RandomCharString(16)
	secretKey := restapi.RandomCharString(32)

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

	tenantConfigurationENV := map[string]string{}

	// Create the secret for the root credentials (deprecated)
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
			"accesskey": []byte(""),
			"secretkey": []byte(""),
		},
	}

	_, err = clientSet.CoreV1().Secrets(ns).Create(ctx, &instanceSecret, metav1.CreateOptions{})
	if err != nil {
		return nil, restapi.ErrorWithContext(ctx, err)
	}

	// Enable/Disable console object browser for MinIO tenant (default is on)
	enabledConsole := "on"
	if tenantReq.EnableConsole != nil && !*tenantReq.EnableConsole {
		enabledConsole = "off"
	}
	tenantConfigurationENV["MINIO_BROWSER"] = enabledConsole
	tenantConfigurationENV["MINIO_ROOT_USER"] = accessKey
	tenantConfigurationENV["MINIO_ROOT_PASSWORD"] = secretKey

	// delete secrets created if an errors occurred during tenant creation,
	defer func() {
		if mError != nil {
			restapi.LogError("deleting secrets created for failed tenant: %s if any: %v", tenantName, mError)
			opts := metav1.ListOptions{
				LabelSelector: fmt.Sprintf("%s=%s", miniov2.TenantLabel, tenantName),
			}
			err = clientSet.CoreV1().Secrets(ns).DeleteCollection(ctx, metav1.DeleteOptions{}, opts)
			if err != nil {
				restapi.LogError("error deleting tenant's secrets: %v", err)
			}
		}
	}()

	// Check the Erasure Coding Parity for validity and pass it to Tenant
	if tenantReq.ErasureCodingParity > 0 {
		if tenantReq.ErasureCodingParity < 2 || tenantReq.ErasureCodingParity > 8 {
			return nil, restapi.ErrorWithContext(ctx, restapi.ErrInvalidErasureCodingValue)
		}
		tenantConfigurationENV["MINIO_STORAGE_CLASS_STANDARD"] = fmt.Sprintf("EC:%d", tenantReq.ErasureCodingParity)
	}

	// Construct a MinIO Instance with everything we are getting from parameters
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
		},
	}
	var tenantExternalIDPConfigured bool
	if tenantReq.Idp != nil {
		// Enable IDP (Active Directory) for MinIO
		switch {
		case tenantReq.Idp.ActiveDirectory != nil:
			tenantExternalIDPConfigured = true
			serverAddress := *tenantReq.Idp.ActiveDirectory.URL
			tlsSkipVerify := tenantReq.Idp.ActiveDirectory.SkipTLSVerification
			serverInsecure := tenantReq.Idp.ActiveDirectory.ServerInsecure
			lookupBindDN := *tenantReq.Idp.ActiveDirectory.LookupBindDn
			lookupBindPassword := tenantReq.Idp.ActiveDirectory.LookupBindPassword
			userDNSearchBaseDN := tenantReq.Idp.ActiveDirectory.UserDnSearchBaseDn
			userDNSearchFilter := tenantReq.Idp.ActiveDirectory.UserDnSearchFilter
			groupSearchBaseDN := tenantReq.Idp.ActiveDirectory.GroupSearchBaseDn
			groupSearchFilter := tenantReq.Idp.ActiveDirectory.GroupSearchFilter
			serverStartTLS := tenantReq.Idp.ActiveDirectory.ServerStartTLS

			// LDAP Server
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_SERVER_ADDR"] = serverAddress
			if tlsSkipVerify {
				tenantConfigurationENV["MINIO_IDENTITY_LDAP_TLS_SKIP_VERIFY"] = "on"
			}
			if serverInsecure {
				tenantConfigurationENV["MINIO_IDENTITY_LDAP_SERVER_INSECURE"] = "on"
			}
			if serverStartTLS {
				tenantConfigurationENV["MINIO_IDENTITY_LDAP_SERVER_STARTTLS"] = "on"
			}

			// LDAP Lookup
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_LOOKUP_BIND_DN"] = lookupBindDN
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_LOOKUP_BIND_PASSWORD"] = lookupBindPassword

			// LDAP User DN
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_USER_DN_SEARCH_BASE_DN"] = userDNSearchBaseDN
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_USER_DN_SEARCH_FILTER"] = userDNSearchFilter

			// LDAP Group
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_GROUP_SEARCH_BASE_DN"] = groupSearchBaseDN
			tenantConfigurationENV["MINIO_IDENTITY_LDAP_GROUP_SEARCH_FILTER"] = groupSearchFilter

			// Attach the list of LDAP user DNs that will be administrator for the Tenant
			for i, userDN := range tenantReq.Idp.ActiveDirectory.UserDNS {
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
						"CONSOLE_ACCESS_KEY": []byte(userDN),
					},
				}
				_, err := clientSet.CoreV1().Secrets(ns).Create(ctx, &userSecret, metav1.CreateOptions{})
				if err != nil {
					return nil, restapi.ErrorWithContext(ctx, err)
				}
			}
			// attach the users to the tenant
			minInst.Spec.Users = users
		case tenantReq.Idp.Oidc != nil:
			tenantExternalIDPConfigured = true
			// Enable IDP (OIDC) for MinIO
			configurationURL := *tenantReq.Idp.Oidc.ConfigurationURL
			clientID := *tenantReq.Idp.Oidc.ClientID
			secretID := *tenantReq.Idp.Oidc.SecretID
			claimName := *tenantReq.Idp.Oidc.ClaimName
			scopes := tenantReq.Idp.Oidc.Scopes
			callbackURL := tenantReq.Idp.Oidc.CallbackURL
			tenantConfigurationENV["MINIO_IDENTITY_OPENID_CONFIG_URL"] = configurationURL
			tenantConfigurationENV["MINIO_IDENTITY_OPENID_CLIENT_ID"] = clientID
			tenantConfigurationENV["MINIO_IDENTITY_OPENID_CLIENT_SECRET"] = secretID
			tenantConfigurationENV["MINIO_IDENTITY_OPENID_CLAIM_NAME"] = claimName
			tenantConfigurationENV["MINIO_IDENTITY_OPENID_REDIRECT_URI"] = callbackURL
			if scopes == "" {
				scopes = "openid,profile,email"
			}
			tenantConfigurationENV["MINIO_IDENTITY_OPENID_SCOPES"] = scopes
		case len(tenantReq.Idp.Keys) > 0:
			// Create the secret any built-in user passed if no external IDP was configured
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
					return nil, restapi.ErrorWithContext(ctx, err)
				}
			}
			// attach the users to the tenant
			minInst.Spec.Users = users
		}
	}

	canEncryptionBeEnabled := false

	if tenantReq.EnableTLS != nil {
		// if enableTLS is defined in the create tenant request we assign the value
		// to the RequestAutoCert attribute in the tenant spec
		minInst.Spec.RequestAutoCert = tenantReq.EnableTLS
		if *tenantReq.EnableTLS {
			// requestAutoCert is enabled, MinIO will be deployed with TLS enabled and encryption can be enabled
			canEncryptionBeEnabled = true
		}
	}
	// External server TLS certificates for MinIO
	if tenantReq.TLS != nil && len(tenantReq.TLS.MinioServerCertificates) > 0 {
		canEncryptionBeEnabled = true
		// Certificates used by the MinIO instance
		externalCertSecretName := fmt.Sprintf("%s-external-server-certificate", tenantName)
		externalCertSecret, err := createOrReplaceExternalCertSecrets(ctx, &k8sClient, ns, tenantReq.TLS.MinioServerCertificates, externalCertSecretName, tenantName)
		if err != nil {
			return nil, restapi.ErrorWithContext(ctx, err)
		}
		minInst.Spec.ExternalCertSecret = externalCertSecret
	}
	// External client TLS certificates for MinIO
	if tenantReq.TLS != nil && len(tenantReq.TLS.MinioClientCertificates) > 0 {
		// Client certificates used by the MinIO instance
		externalClientCertSecretName := fmt.Sprintf("%s-external-client-certificate", tenantName)
		externalClientCertSecret, err := createOrReplaceExternalCertSecrets(ctx, &k8sClient, ns, tenantReq.TLS.MinioClientCertificates, externalClientCertSecretName, tenantName)
		if err != nil {
			return nil, restapi.ErrorWithContext(ctx, err)
		}
		minInst.Spec.ExternalClientCertSecrets = externalClientCertSecret
	}
	// If encryption configuration is present and TLS will be enabled (using AutoCert or External certificates)
	if tenantReq.Encryption != nil && canEncryptionBeEnabled {
		// KES client mTLSCertificates used by MinIO instance
		if tenantReq.Encryption.Client != nil {
			tenantExternalClientCertSecretName := fmt.Sprintf("%s-external-client-certificate-kes", tenantName)
			certificates := []*models.KeyPairConfiguration{tenantReq.Encryption.Client}
			certificateSecrets, err := createOrReplaceExternalCertSecrets(ctx, &k8sClient, ns, certificates, tenantExternalClientCertSecretName, tenantName)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, restapi.ErrDefault)
			}
			if len(certificateSecrets) > 0 {
				minInst.Spec.ExternalClientCertSecret = certificateSecrets[0]
			}
		}

		// KES configuration for Tenant instance
		minInst.Spec.KES, err = getKESConfiguration(ctx, &k8sClient, ns, tenantReq.Encryption, secretName, tenantName)
		if err != nil {
			return nil, restapi.ErrorWithContext(ctx, restapi.ErrDefault)
		}
		// Set Labels, Annotations and Node Selector for KES
		minInst.Spec.KES.Labels = tenantReq.Encryption.Labels
		minInst.Spec.KES.Annotations = tenantReq.Encryption.Annotations
		minInst.Spec.KES.NodeSelector = tenantReq.Encryption.NodeSelector

		if tenantReq.Encryption.SecurityContext != nil {
			sc, err := convertModelSCToK8sSC(tenantReq.Encryption.SecurityContext)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, err)
			}
			minInst.Spec.KES.SecurityContext = sc
		}
	}
	// External TLS CA certificates for MinIO
	if tenantReq.TLS != nil && len(tenantReq.TLS.MinioCAsCertificates) > 0 {
		var caCertificates []tenantSecret
		for i, caCertificate := range tenantReq.TLS.MinioCAsCertificates {
			certificateContent, err := base64.StdEncoding.DecodeString(caCertificate)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, restapi.ErrDefault, nil, err)
			}
			caCertificates = append(caCertificates, tenantSecret{
				Name: fmt.Sprintf("%s-ca-certificate-%d", tenantName, i),
				Content: map[string][]byte{
					"public.crt": certificateContent,
				},
			})
		}
		if len(caCertificates) > 0 {
			certificateSecrets, err := createOrReplaceSecrets(ctx, &k8sClient, ns, caCertificates, tenantName)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, restapi.ErrDefault, nil, err)
			}
			minInst.Spec.ExternalCaCertSecret = certificateSecrets
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
			restapi.LogError("parseTenantPoolRequest failed: %v", err)
			return nil, restapi.ErrorWithContext(ctx, err)
		}
		minInst.Spec.Pools = append(minInst.Spec.Pools, *pool)
	}

	// Set Mount Path if provided
	if tenantReq.MountPath != "" {
		minInst.Spec.Mountpath = tenantReq.MountPath
	}

	// We accept either `image_pull_secret` or the individual details of the `image_registry` but not both
	var imagePullSecret string

	if tenantReq.ImagePullSecret != "" {
		imagePullSecret = tenantReq.ImagePullSecret
	} else if imagePullSecret, err = setImageRegistry(ctx, tenantReq.ImageRegistry, clientSet.CoreV1(), ns, tenantName); err != nil {
		return nil, restapi.ErrorWithContext(ctx, err)
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

	// Is Log Search enabled? (present in the parameters) if so configure
	if tenantReq.LogSearchConfiguration != nil {

		// Default class name for Log search
		diskSpaceFromAPI := int64(5) * humanize.GiByte // Default is 5Gi
		logSearchImage := ""
		logSearchPgImage := ""
		logSearchPgInitImage := ""
		var logSearchStorageClass *string // Nil means use default storage class
		var logSearchSecurityContext *corev1.PodSecurityContext
		var logSearchPgSecurityContext *corev1.PodSecurityContext

		if tenantReq.LogSearchConfiguration.StorageSize != nil {
			diskSpaceFromAPI = int64(*tenantReq.LogSearchConfiguration.StorageSize) * humanize.GiByte
		}
		if tenantReq.LogSearchConfiguration.StorageClass != "" {
			logSearchStorageClass = stringPtr(tenantReq.LogSearchConfiguration.StorageClass)
		}
		if tenantReq.LogSearchConfiguration.Image != "" {
			logSearchImage = tenantReq.LogSearchConfiguration.Image
		}
		if tenantReq.LogSearchConfiguration.PostgresImage != "" {
			logSearchPgImage = tenantReq.LogSearchConfiguration.PostgresImage
		}
		if tenantReq.LogSearchConfiguration.PostgresInitImage != "" {
			logSearchPgInitImage = tenantReq.LogSearchConfiguration.PostgresInitImage
		}
		// if security context for logSearch is present, configure it.
		if tenantReq.LogSearchConfiguration.SecurityContext != nil {
			sc, err := convertModelSCToK8sSC(tenantReq.LogSearchConfiguration.SecurityContext)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, err)
			}
			logSearchSecurityContext = sc
		}
		// if security context for logSearch is present, configure it.
		if tenantReq.LogSearchConfiguration.PostgresSecurityContext != nil {
			sc, err := convertModelSCToK8sSC(tenantReq.LogSearchConfiguration.PostgresSecurityContext)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, err)
			}
			logSearchPgSecurityContext = sc
		}

		logSearchDiskSpace := resource.NewQuantity(diskSpaceFromAPI, resource.DecimalExponent)

		// the audit max cap cannot be larger than disk size on the DB, else it won't trim the data
		auditMaxCap := 10
		if (diskSpaceFromAPI / humanize.GiByte) < int64(auditMaxCap) {
			auditMaxCap = int(diskSpaceFromAPI / humanize.GiByte)
		}

		// default activate lgo search and prometheus
		minInst.Spec.Log = &miniov2.LogConfig{
			Audit: &miniov2.AuditConfig{DiskCapacityGB: swag.Int(auditMaxCap)},
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
						StorageClassName: logSearchStorageClass,
					},
				},
			},
		}
		// set log search images if any
		if logSearchImage != "" {
			minInst.Spec.Log.Image = logSearchImage
		}
		if logSearchPgImage != "" {
			minInst.Spec.Log.Db.Image = logSearchPgImage
		}
		if logSearchPgInitImage != "" {
			minInst.Spec.Log.Db.InitImage = logSearchPgInitImage
		}
		if logSearchSecurityContext != nil {
			minInst.Spec.Log.SecurityContext = logSearchSecurityContext
		}
		if logSearchPgSecurityContext != nil {
			minInst.Spec.Log.Db.SecurityContext = logSearchPgSecurityContext
		}

	}

	// Is Prometheus/Monitoring enabled? (config present in the parameters) if so configure
	if tenantReq.PrometheusConfiguration != nil {
		prometheusDiskSpace := 5      // Default is 5 by API
		prometheusImage := ""         // Default is ""
		prometheusSidecardImage := "" // Default is ""
		prometheusInitImage := ""     // Default is ""

		var prometheusStorageClass *string // Nil means default storage class

		if tenantReq.PrometheusConfiguration.StorageSize != nil {
			prometheusDiskSpace = int(*tenantReq.PrometheusConfiguration.StorageSize)
		}
		if tenantReq.PrometheusConfiguration.StorageClass != "" {
			prometheusStorageClass = stringPtr(tenantReq.PrometheusConfiguration.StorageClass)
		}
		if tenantReq.PrometheusConfiguration.Image != "" {
			prometheusImage = tenantReq.PrometheusConfiguration.Image
		}
		if tenantReq.PrometheusConfiguration.SidecarImage != "" {
			prometheusSidecardImage = tenantReq.PrometheusConfiguration.SidecarImage
		}
		if tenantReq.PrometheusConfiguration.InitImage != "" {
			prometheusInitImage = tenantReq.PrometheusConfiguration.InitImage
		}

		minInst.Spec.Prometheus = &miniov2.PrometheusConfig{
			DiskCapacityDB:   swag.Int(prometheusDiskSpace),
			StorageClassName: prometheusStorageClass,
		}
		if prometheusImage != "" {
			minInst.Spec.Prometheus.Image = prometheusImage
		}
		if prometheusSidecardImage != "" {
			minInst.Spec.Prometheus.SideCarImage = prometheusSidecardImage
		}
		if prometheusInitImage != "" {
			minInst.Spec.Prometheus.InitImage = prometheusInitImage
		}
		// if security context for prometheus is present, configure it.
		if tenantReq.PrometheusConfiguration != nil && tenantReq.PrometheusConfiguration.SecurityContext != nil {
			sc, err := convertModelSCToK8sSC(tenantReq.PrometheusConfiguration.SecurityContext)
			if err != nil {
				return nil, restapi.ErrorWithContext(ctx, err)
			}
			minInst.Spec.Prometheus.SecurityContext = sc
		}

	}

	// expose services
	minInst.Spec.ExposeServices = &miniov2.ExposeServices{
		MinIO:   tenantReq.ExposeMinio,
		Console: tenantReq.ExposeConsole,
	}

	// set custom environment variables in configuration file
	for _, envVar := range tenantReq.EnvironmentVariables {
		tenantConfigurationENV[envVar.Key] = envVar.Value
	}

	// write tenant configuration to secret that contains config.env
	tenantConfigurationName := fmt.Sprintf("%s-env-configuration", tenantName)
	_, err = createOrReplaceSecrets(ctx, &k8sClient, ns, []tenantSecret{
		{
			Name: tenantConfigurationName,
			Content: map[string][]byte{
				"config.env": []byte(GenerateTenantConfigurationFile(tenantConfigurationENV)),
			},
		},
	}, tenantName)
	if err != nil {
		return nil, restapi.ErrorWithContext(ctx, restapi.ErrDefault, nil, err)
	}
	minInst.Spec.Configuration = &corev1.LocalObjectReference{Name: tenantConfigurationName}

	if tenantReq.Domains != nil {
		var features miniov2.Features
		var domains miniov2.TenantDomains

		// tenant domains
		if tenantReq.Domains.Console != "" {
			domains.Console = tenantReq.Domains.Console
		}

		if tenantReq.Domains.Minio != nil {
			domains.Minio = tenantReq.Domains.Minio
		}

		features.Domains = &domains

		minInst.Spec.Features = &features
	}

	opClient, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, restapi.ErrorWithContext(ctx, err)
	}

	_, err = opClient.MinioV2().Tenants(ns).Create(context.Background(), &minInst, metav1.CreateOptions{})
	if err != nil {
		restapi.LogError("Creating new tenant failed with: %v", err)
		return nil, restapi.ErrorWithContext(ctx, err)
	}

	// Integrations
	if os.Getenv("GKE_INTEGRATION") != "" {
		err := gkeIntegration(clientSet, tenantName, ns, session.STSSessionToken)
		if err != nil {
			return nil, restapi.ErrorWithContext(ctx, err)
		}
	}
	response = &models.CreateTenantResponse{
		ExternalIDP: tenantExternalIDPConfigured,
	}
	thisClient := &operatorClient{
		client: opClient,
	}

	minTenant, err := getTenant(ctx, thisClient, ns, tenantName)

	if tenantReq.Idp != nil && !tenantExternalIDPConfigured {
		for _, credential := range tenantReq.Idp.Keys {
			response.Console = append(response.Console, &models.TenantResponseItem{
				AccessKey: *credential.AccessKey,
				SecretKey: *credential.SecretKey,
				URL:       GetTenantServiceURL(minTenant),
			})
		}
	}
	return response, nil
}

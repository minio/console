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
//

package operatorapi

import (
	"context"
	"errors"
	"time"

	"github.com/minio/console/pkg/subnet"
	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"
	corev1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/minio/console/restapi"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
)

func registerSubscriptionHandlers(api *operations.OperatorAPI) {
	// Activate license subscription for a particular tenant
	api.OperatorAPISubscriptionActivateHandler = operator_api.SubscriptionActivateHandlerFunc(func(params operator_api.SubscriptionActivateParams, session *models.Principal) middleware.Responder {
		err := getSubscriptionActivateResponse(session, params.Namespace, params.Tenant)
		if err != nil {
			return operator_api.NewSubscriptionActivateDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewSubscriptionActivateNoContent()
	})
	// Refresh license for k8s cluster
	api.OperatorAPISubscriptionRefreshHandler = operator_api.SubscriptionRefreshHandlerFunc(func(params operator_api.SubscriptionRefreshParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionRefreshResponse(session)
		if err != nil {
			return operator_api.NewSubscriptionRefreshDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewSubscriptionRefreshOK().WithPayload(license)
	})
	// Validate subscription handler
	api.OperatorAPISubscriptionValidateHandler = operator_api.SubscriptionValidateHandlerFunc(func(params operator_api.SubscriptionValidateParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionValidateResponse(session, params.Body)
		if err != nil {
			return operator_api.NewSubscriptionValidateDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewSubscriptionValidateOK().WithPayload(license)
	})
	// Get subscription information handler
	api.OperatorAPISubscriptionInfoHandler = operator_api.SubscriptionInfoHandlerFunc(func(params operator_api.SubscriptionInfoParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionInfoResponse(session)
		if err != nil {
			return operator_api.NewSubscriptionInfoDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewSubscriptionInfoOK().WithPayload(license)
	})
	// Refresh license for k8s cluster
	api.OperatorAPISubscriptionRefreshHandler = operator_api.SubscriptionRefreshHandlerFunc(func(params operator_api.SubscriptionRefreshParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionRefreshResponse(session)
		if err != nil {
			return operator_api.NewSubscriptionRefreshDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewSubscriptionRefreshOK().WithPayload(license)
	})
}

// retrieveLicense returns license from K8S secrets
func retrieveLicense(ctx context.Context, sessionToken string) (string, error) {
	var license string

	// configure kubernetes client
	clientSet, err := cluster.K8sClient(sessionToken)
	if err != nil {
		return "", err
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	// Get cluster subscription license
	license, err = getSubscriptionLicense(ctx, &k8sClient, cluster.Namespace, OperatorSubnetLicenseSecretName)
	if err != nil {
		return "", err
	}

	return license, nil
}

// getSubscriptionLicense will retrieve stored license jwt from k8s secret
func getSubscriptionLicense(ctx context.Context, clientSet K8sClientI, namespace, secretName string) (string, error) {
	// retrieve license stored in k8s
	licenseSecret, err := clientSet.getSecret(ctx, namespace, secretName, metav1.GetOptions{})
	if err != nil {
		return "", err
	}
	license, ok := licenseSecret.Data[ConsoleSubnetLicense]
	if !ok {
		LogError("subnet secret does not contain a valid subnet license")
		return "", restapi.ErrorGeneric
	}
	return string(license), nil
}

// addSubscriptionLicenseToTenant replace existing console tenant secret and adds the subnet license key
func addSubscriptionLicenseToTenant(ctx context.Context, clientSet K8sClientI, opClient OperatorClientI, license string, tenant *miniov2.Tenant) error {
	// If Tenant has a configuration secret update the license there and MinIO pods doesn't need to get restarted
	if tenant.HasConfigurationSecret() {
		// Update the Tenant Configuration
		tenantConfigurationSecret, err := clientSet.getSecret(ctx, tenant.Namespace, tenant.Spec.Configuration.Name, metav1.GetOptions{})
		if err != nil {
			return err
		}
		if _, ok := tenantConfigurationSecret.Data["config.env"]; ok {
			updatedTenantConfiguration := map[string]string{}
			tenantConfigurationMap := miniov2.ParseRawConfiguration(tenantConfigurationSecret.Data["config.env"])
			for key, val := range tenantConfigurationMap {
				updatedTenantConfiguration[key] = string(val)
			}
			updatedTenantConfiguration[MinIOSubnetLicense] = license
			// removing accesskey & secretkey that are added automatically by parsing function
			// and are not need it for the tenant itself
			delete(updatedTenantConfiguration, "accesskey")
			delete(updatedTenantConfiguration, "secretkey")
			tenantConfigurationSecret.Data = map[string][]byte{
				"config.env": []byte(GenerateTenantConfigurationFile(updatedTenantConfiguration)),
			}
			_, err = clientSet.updateSecret(ctx, tenant.Namespace, tenantConfigurationSecret, metav1.UpdateOptions{})
			if err != nil {
				return err
			}
		} else {
			return errors.New("tenant configuration secret has wrong format")
		}
	} else {
		// If configuration file is not present set the license to the container env
		updatedTenant := tenant.DeepCopy()
		// reset container env vars
		updatedTenant.Spec.Env = []corev1.EnvVar{}
		var licenseIsSet bool
		for _, env := range tenant.GetEnvVars() {
			// check if license already exists and override
			if env.Name == MinIOSubnetLicense {
				updatedTenant.Spec.Env = append(updatedTenant.Spec.Env, corev1.EnvVar{
					Name:  MinIOSubnetLicense,
					Value: license,
				})
				licenseIsSet = true
			} else {
				// copy existing container env variables
				updatedTenant.Spec.Env = append(updatedTenant.Spec.Env, env)
			}
		}
		// if license didnt exists append it
		if !licenseIsSet {
			updatedTenant.Spec.Env = append(updatedTenant.Spec.Env, corev1.EnvVar{
				Name:  MinIOSubnetLicense,
				Value: license,
			})
		}
		// this will start MinIO pods rolling restart
		_, err := opClient.TenantUpdate(ctx, updatedTenant, metav1.UpdateOptions{})
		if err != nil {
			return err
		}
	}
	return nil
}

func getSubscriptionRefreshResponse(session *models.Principal) (*models.License, *models.Error) {
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	client := &cluster.HTTPClient{
		Client: restapi.GetConsoleHTTPClient(),
	}
	licenseKey, err := retrieveLicense(ctx, session.STSSessionToken)
	if err != nil {
		return nil, prepareError(errLicenseNotFound, nil, err)
	}
	newLicenseInfo, licenseRaw, err := subscriptionRefresh(client, licenseKey)
	if err != nil {
		return nil, prepareError(errLicenseNotFound, nil, err)
	}
	// configure kubernetes client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(errLicenseNotFound, nil, err)
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	// save license key to k8s and restart all console pods
	if err = saveSubscriptionLicense(ctx, &k8sClient, licenseRaw); err != nil {
		return nil, prepareError(restapi.ErrorGeneric, nil, err)
	}
	// update license for all existing tenants
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	opClient := operatorClient{
		client: opClientClientSet,
	}
	// iterate over all tenants and update licenses
	tenants, err := opClient.TenantList(ctx, "", metav1.ListOptions{})
	if err != nil {
		return nil, prepareError(err)
	}
	for _, tenant := range tenants.Items {
		if err = addSubscriptionLicenseToTenant(ctx, &k8sClient, &opClient, licenseRaw, &tenant); err != nil {
			return nil, prepareError(err)
		}
	}

	return newLicenseInfo, nil
}

// RefreshLicense will check current subnet license and try to renew it
func RefreshLicense() error {
	// Get current license
	saK8SToken := getK8sSAToken()
	licenseKey, err := retrieveLicense(context.Background(), saK8SToken)
	if licenseKey == "" {
		return errors.New("no license present")
	}
	if err != nil {
		return err
	}
	client := &cluster.HTTPClient{
		Client: restapi.GetConsoleHTTPClient(),
	}
	// Attempt to refresh license
	_, refreshedLicenseKey, err := subscriptionRefresh(client, licenseKey)
	if err != nil {
		return err
	}
	if refreshedLicenseKey == "" {
		return errors.New("license expired, please open a support ticket at https://subnet.min.io/")
	}
	// store new license in memory for console ui
	LicenseKey = refreshedLicenseKey
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	clientSet, err := cluster.K8sClient(saK8SToken)
	if err != nil {
		return err
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	return saveSubscriptionLicense(ctx, &k8sClient, refreshedLicenseKey)
}

func subscriptionRefresh(httpClient *cluster.HTTPClient, license string) (*models.License, string, error) {
	licenseInfo, rawLicense, err := subnet.RefreshLicense(httpClient, license)
	if err != nil {
		return nil, "", err
	}
	return &models.License{
		Email:           licenseInfo.Email,
		AccountID:       licenseInfo.AccountID,
		StorageCapacity: licenseInfo.StorageCapacity,
		Plan:            licenseInfo.Plan,
		ExpiresAt:       licenseInfo.ExpiresAt.String(),
		Organization:    licenseInfo.Organization,
	}, rawLicense, nil
}

// saveSubscriptionLicense will create or replace an existing subnet license secret in the k8s cluster
func saveSubscriptionLicense(ctx context.Context, clientSet K8sClientI, license string) error {
	licenseSecret, err := clientSet.getSecret(ctx, cluster.Namespace, OperatorSubnetLicenseSecretName, metav1.GetOptions{})
	if err != nil {
		if k8serrors.IsNotFound(err) {
			// Save subnet license in k8s secrets
			licenseSecret := &corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name: OperatorSubnetLicenseSecretName,
				},
				Data: map[string][]byte{
					ConsoleSubnetLicense: []byte(license),
				},
			}
			_, err = clientSet.createSecret(ctx, cluster.Namespace, licenseSecret, metav1.CreateOptions{})
			if err != nil {
				return err
			}
			return nil
		}
		return err
	}
	// update existing license
	licenseSecret.Data = map[string][]byte{
		ConsoleSubnetLicense: []byte(license),
	}
	_, err = clientSet.updateSecret(ctx, cluster.Namespace, licenseSecret, metav1.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}

// subscriptionValidate will validate the provided jwt license against the subnet public key
func subscriptionValidate(client cluster.HTTPClientI, license, email, password string) (*models.License, string, error) {
	licenseInfo, rawLicense, err := subnet.ValidateLicense(client, license, email, password)
	if err != nil {
		return nil, "", err
	}
	return &models.License{
		Email:           licenseInfo.Email,
		AccountID:       licenseInfo.AccountID,
		StorageCapacity: licenseInfo.StorageCapacity,
		Plan:            licenseInfo.Plan,
		ExpiresAt:       licenseInfo.ExpiresAt.String(),
		Organization:    licenseInfo.Organization,
	}, rawLicense, nil
}

// getSubscriptionValidateResponse
func getSubscriptionValidateResponse(session *models.Principal, params *models.SubscriptionValidateRequest) (*models.License, *models.Error) {
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client := &cluster.HTTPClient{
		Client: restapi.GetConsoleHTTPClient(),
	}
	// validate license key
	licenseInfo, license, err := subscriptionValidate(client, params.License, params.Email, params.Password)
	if err != nil {
		return nil, prepareError(errInvalidLicense, nil, err)
	}
	// configure kubernetes client
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	k8sClient := k8sClient{
		client: clientSet,
	}
	if err != nil {
		return nil, prepareError(errorGeneric, nil, err)
	}
	// save license key to k8s
	if err = saveSubscriptionLicense(ctx, &k8sClient, license); err != nil {
		return nil, prepareError(errorGeneric, nil, err)
	}
	return licenseInfo, nil
}

func getSubscriptionActivateResponse(session *models.Principal, namespace, tenantName string) *models.Error {
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return prepareError(errorGeneric, nil, err)
	}
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	if err != nil {
		return prepareError(errorGeneric, nil, err)
	}
	opClient := operatorClient{
		client: opClientClientSet,
	}
	tenant, err := getTenant(ctx, &opClient, namespace, tenantName)
	if err != nil {
		return prepareError(err, errorGeneric)
	}
	// configure kubernetes client
	k8sClient := k8sClient{
		client: clientSet,
	}
	// Get cluster subscription license
	license, err := getSubscriptionLicense(ctx, &k8sClient, cluster.Namespace, OperatorSubnetLicenseSecretName)
	if err != nil {
		return prepareError(errInvalidCredentials, nil, err)
	}
	// add subscription license to existing console Tenant
	if err = addSubscriptionLicenseToTenant(ctx, &k8sClient, &opClient, license, tenant); err != nil {
		return prepareError(err, errorGeneric)
	}
	return nil
}

// getSubscriptionInfoResponse returns information about the current configured subnet license for Console
func getSubscriptionInfoResponse(session *models.Principal) (*models.License, *models.Error) {
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	var licenseInfo *models.License
	client := &cluster.HTTPClient{
		Client: restapi.GetConsoleHTTPClient(),
	}
	licenseKey, err := retrieveLicense(ctx, session.STSSessionToken)
	if err != nil {
		return nil, prepareError(errLicenseNotFound, nil, err)
	}
	// validate license key and obtain license info
	licenseInfo, _, err = subscriptionValidate(client, licenseKey, "", "")
	if err != nil {
		return nil, prepareError(errLicenseNotFound, nil, err)
	}
	return licenseInfo, nil
}

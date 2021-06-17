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

package restapi

import (
	"context"
	"errors"
	"fmt"
	"time"

	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"

	"github.com/minio/console/pkg/acl"

	"github.com/minio/console/cluster"
	"github.com/minio/console/pkg/subnet"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerSubscriptionHandlers(api *operations.ConsoleAPI) {
	// Validate subscription handler
	api.AdminAPISubscriptionValidateHandler = admin_api.SubscriptionValidateHandlerFunc(func(params admin_api.SubscriptionValidateParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionValidateResponse(session, params.Body)
		if err != nil {
			return admin_api.NewSubscriptionValidateDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubscriptionValidateOK().WithPayload(license)
	})
	// Activate license subscription for a particular tenant
	api.AdminAPISubscriptionActivateHandler = admin_api.SubscriptionActivateHandlerFunc(func(params admin_api.SubscriptionActivateParams, session *models.Principal) middleware.Responder {
		err := getSubscriptionActivateResponse(session, params.Namespace, params.Tenant)
		if err != nil {
			return admin_api.NewSubscriptionActivateDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubscriptionActivateNoContent()
	})
	// Get subscription information handler
	api.AdminAPISubscriptionInfoHandler = admin_api.SubscriptionInfoHandlerFunc(func(params admin_api.SubscriptionInfoParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionInfoResponse(session)
		if err != nil {
			return admin_api.NewSubscriptionInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubscriptionInfoOK().WithPayload(license)
	})
	// Refresh license for k8s cluster
	api.AdminAPISubscriptionRefreshHandler = admin_api.SubscriptionRefreshHandlerFunc(func(params admin_api.SubscriptionRefreshParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionRefreshResponse(session)
		if err != nil {
			return admin_api.NewSubscriptionRefreshDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubscriptionRefreshOK().WithPayload(license)
	})
}

// retrieveLicense returns license from K8S secrets (If console is deployed in operator mode) or from
// the configured CONSOLE_SUBNET_LICENSE environment variable
func retrieveLicense(ctx context.Context, sessionToken string) (string, error) {
	var license string
	// If Console is running in operator mode retrieve License stored in K8s secrets
	if acl.GetOperatorMode() {
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
	} else {
		// If Console is running in Tenant Admin mode retrieve license from env variable
		license = GetSubnetLicense()
	}
	return license, nil
}

// addSubscriptionLicenseToTenant replace existing console tenant secret and adds the subnet license key
func addSubscriptionLicenseToTenant(ctx context.Context, clientSet K8sClientI, license, namespace, tenantName, secretName string) error {
	// Retrieve console secret for Tenant
	consoleSecret, err := clientSet.getSecret(ctx, namespace, secretName, metav1.GetOptions{})
	if err != nil {
		return err
	}
	// Copy current console secret
	dataNewSecret := consoleSecret.Data
	// Add subnet license to the new console secret
	dataNewSecret[ConsoleSubnetLicense] = []byte(license)
	// Delete existing console secret
	err = clientSet.deleteSecret(ctx, namespace, secretName, metav1.DeleteOptions{})
	if err != nil {
		return err
	}
	// Prepare the new Console Secret
	imm := true
	newConsoleSecret := &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: secretName,
			Labels: map[string]string{
				miniov2.TenantLabel: tenantName,
			},
		},
		Immutable: &imm,
		Data:      dataNewSecret,
	}
	// Create new Console secret with the subnet License
	_, err = clientSet.createSecret(ctx, namespace, newConsoleSecret, metav1.CreateOptions{})
	if err != nil {
		return err
	}
	// restart Console pods based on label:
	//  v1.min.io/console: TENANT-console
	err = clientSet.deletePodCollection(ctx, namespace, metav1.DeleteOptions{}, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("%s=%s%s", miniov2.ConsoleTenantLabel, tenantName, miniov2.ConsoleName),
	})
	if err != nil {
		return err
	}
	return nil
}

func getSubscriptionActivateResponse(session *models.Principal, namespace, tenant string) *models.Error {
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
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	minTenant, err := getTenant(ctx, opClient, namespace, tenant)
	if err != nil {
		return prepareError(err, errorGeneric)
	}
	// If console is not deployed for this tenant return an error
	if minTenant.Spec.Console == nil {
		return prepareError(ErrorGenericNotFound)
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
	if err = addSubscriptionLicenseToTenant(ctx, &k8sClient, license, namespace, tenant, minTenant.Spec.Console.ConsoleSecret.Name); err != nil {
		return prepareError(err, errorGeneric)
	}
	return nil
}

// saveSubscriptionLicense will create or replace an existing subnet license secret in the k8s cluster
func saveSubscriptionLicense(ctx context.Context, clientSet K8sClientI, license string) error {
	// Delete subnet license secret if exists
	err := clientSet.deleteSecret(ctx, cluster.Namespace, OperatorSubnetLicenseSecretName, metav1.DeleteOptions{})
	if err != nil {
		// log the error if any and continue
		LogError("unable to delete secret %s: %v", OperatorSubnetLicenseSecretName, err)
	}
	// Save subnet license in k8s secrets
	imm := true
	licenseSecret := &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: OperatorSubnetLicenseSecretName,
		},
		Immutable: &imm,
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

// updateTenantLicenseAndRestartConsole
func updateTenantLicenseAndRestartConsole(ctx context.Context, clientSet K8sClientI, license, namespace, tenantName string) error {
	consoleSelector := fmt.Sprintf("%s-console", tenantName)
	consoleSecretName := fmt.Sprintf("%s-secret", consoleSelector)
	// read current console configuration from k8s secrets
	currentConsoleSecret, err := clientSet.getSecret(ctx, namespace, consoleSecretName, metav1.GetOptions{})
	if err != nil || currentConsoleSecret == nil {
		return err
	}
	secretData := currentConsoleSecret.Data
	secretData[ConsoleSubnetLicense] = []byte(license)
	// delete existing console configuration from k8s secrets
	err = clientSet.deleteSecret(ctx, namespace, consoleSecretName, metav1.DeleteOptions{})
	if err != nil {
		// log the error if any and continue
		LogError("unable to delete secret %s: %v", consoleSecretName, err)
	}
	// Save subnet license in k8s secrets
	imm := true
	consoleConfigSecret := &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: consoleSecretName,
		},
		Immutable: &imm,
		Data:      secretData,
	}
	_, err = clientSet.createSecret(ctx, namespace, consoleConfigSecret, metav1.CreateOptions{})
	if err != nil {
		return err
	}
	// restart Console pods based on label:
	//  v1.min.io/console: TENANT-console
	err = clientSet.deletePodCollection(ctx, namespace, metav1.DeleteOptions{}, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("%s=%s%s", miniov2.ConsoleTenantLabel, tenantName, miniov2.ConsoleName),
	})
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
		Client: GetConsoleSTSClient(),
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
		return "", errorGeneric
	}
	return string(license), nil
}

// getSubscriptionInfoResponse returns information about the current configured subnet license for Console
func getSubscriptionInfoResponse(session *models.Principal) (*models.License, *models.Error) {
	var licenseInfo *models.License
	client := &cluster.HTTPClient{
		Client: GetConsoleSTSClient(),
	}
	licenseKey, err := retrieveLicense(context.Background(), session.STSSessionToken)
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

func getSubscriptionRefreshResponse(session *models.Principal) (*models.License, *models.Error) {
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	client := &cluster.HTTPClient{
		Client: GetConsoleSTSClient(),
	}
	licenseKey, err := retrieveLicense(context.Background(), session.STSSessionToken)
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
		return nil, prepareError(errorGeneric, nil, err)
	}
	// update license for all existing tenants
	opClientClientSet, err := cluster.OperatorClient(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	tenants, err := listTenants(ctx, opClient, "", nil)
	if err != nil {
		return nil, prepareError(err)
	}
	// iterate over all tenants, update console configuration and restart console pods
	for _, tenant := range tenants.Tenants {
		if err := updateTenantLicenseAndRestartConsole(ctx, &k8sClient, licenseRaw, tenant.Namespace, tenant.Name); err != nil {
			LogError("unable to updateTenantLicenseAndRestartConsole: %v", err)
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
		Client: GetConsoleSTSClient(),
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
	if acl.GetOperatorMode() {
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
	return nil
}

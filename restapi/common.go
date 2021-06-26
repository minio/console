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

package restapi

import (
	"bytes"
	"context"
	"fmt"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/subnet"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	"github.com/minio/console/restapi/operations/user_api"
	iampolicy "github.com/minio/pkg/iam/policy"

	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// getAccountPolicy will return the associated policy of the current account
func getAccountPolicy(ctx context.Context, client MinioAdmin) (*iampolicy.Policy, error) {
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	accountInfo, err := client.accountInfo(ctx)
	if err != nil {
		return nil, err
	}
	return iampolicy.ParseConfig(bytes.NewReader(accountInfo.Policy))
}

// login performs a check of consoleCredentials against MinIO, generates some claims and returns the jwt
// for subsequent authentication
func login(credentials ConsoleCredentialsI) (*string, error) {
	// try to obtain consoleCredentials,
	tokens, err := credentials.Get()
	if err != nil {
		return nil, err
	}
	// if we made it here, the consoleCredentials work, generate a jwt with claims
	token, err := auth.NewEncryptedTokenForClient(&tokens, credentials.GetAccountAccessKey(), credentials.GetActions())
	if err != nil {
		LogError("error authenticating user: %v", err)
		return nil, errInvalidCredentials
	}
	return &token, nil
}

// getConsoleCredentials will return consoleCredentials interface including the associated policy of the current account
func getConsoleCredentials(ctx context.Context, accessKey, secretKey string) (*consoleCredentials, error) {
	creds, err := newConsoleCredentials(accessKey, secretKey, getMinIORegion())
	if err != nil {
		return nil, err
	}
	// cCredentials will be sts credentials, account credentials will be need it in the scenario the user wish
	// to change its password
	cCredentials := &consoleCredentials{
		consoleCredentials: creds,
		accountAccessKey:   accessKey,
	}
	tokens, err := cCredentials.Get()
	if err != nil {
		return nil, err
	}
	// initialize admin client
	mAdminClient, err := newAdminClient(&models.Principal{
		STSAccessKeyID:     tokens.AccessKeyID,
		STSSecretAccessKey: tokens.SecretAccessKey,
		STSSessionToken:    tokens.SessionToken,
	})
	if err != nil {
		return nil, err
	}
	userAdminClient := adminClient{client: mAdminClient}
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	policy, err := getAccountPolicy(ctx, userAdminClient)
	if err != nil {
		return nil, err
	}
	// by default every user starts with an empty array of available actions
	// therefore we would have access only to pages that doesn't require any privilege
	// ie: service-account page
	var actions []string
	// if a policy is assigned to this user we parse the actions from there
	if policy != nil {
		actions = acl.GetActionsStringFromPolicy(policy)
	}
	cCredentials.actions = actions
	return cCredentials, nil
}

func registerSessionHandlers(api *operations.ConsoleAPI) {
	// session check
	api.UserAPISessionCheckHandler = user_api.SessionCheckHandlerFunc(func(params user_api.SessionCheckParams, session *models.Principal) middleware.Responder {
		sessionResp, err := getSessionResponse(session)
		if err != nil {
			return user_api.NewSessionCheckDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewSessionCheckOK().WithPayload(sessionResp)
	})
}

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

// getListOfEnabledFeatures returns a list of features
func getListOfEnabledFeatures() []string {
	var features []string
	return features
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

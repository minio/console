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

// +build operator

package restapi

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

// getLoginDetailsResponse returns information regarding the Console authentication mechanism.
func getLoginDetailsResponse() (*models.LoginDetails, *models.Error) {
	return &models.LoginDetails{
		LoginStrategy: models.LoginDetailsLoginStrategyServiceDashAccount,
	}, nil
}

func getLoginOauth2AuthResponse(lr *models.LoginOauth2AuthRequest) (*models.LoginResponse, *models.Error) {
	creds, err := newConsoleCredentials("", getK8sSAToken(), "")
	if err != nil {
		return nil, prepareError(err)
	}
	credentials := consoleCredentials{consoleCredentials: creds, actions: []string{}}
	token, err := login(credentials)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *token,
	}
	return loginResponse, nil
}

func registerLoginHandlers(api *operations.ConsoleAPI) {
	api.UserAPILoginOperatorHandler = user_api.LoginOperatorHandlerFunc(func(params user_api.LoginOperatorParams) middleware.Responder {
		loginResponse, err := getLoginOperatorResponse(params.Body)
		if err != nil {
			return user_api.NewLoginOperatorDefault(int(err.Code)).WithPayload(err)
		}
		// Custom response writer to set the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			cookie := NewSessionCookieForConsole(loginResponse.SessionID)
			http.SetCookie(w, &cookie)
			user_api.NewLoginOperatorCreated().WithPayload(loginResponse).WriteResponse(w, p)
		})
	})
}

// getLoginOperatorResponse validate the provided service account token against k8s api
func getLoginOperatorResponse(lmr *models.LoginOperatorRequest) (*models.LoginResponse, *models.Error) {
	creds, err := newConsoleCredentials("", *lmr.Jwt, "")
	if err != nil {
		return nil, prepareError(err)
	}
	consoleCreds := consoleCredentials{consoleCredentials: creds, actions: []string{}}
	token, err := login(consoleCreds)
	if err != nil {
		return nil, prepareError(errInvalidCredentials, nil, err)
	}
	// serialize output
	loginResponse := &models.LoginResponse{
		SessionID: *token,
	}
	return loginResponse, nil
}

// retrieveLicense returns license from K8S secrets (If console is deployed in operator mode)
func retrieveLicense(ctx context.Context, sessionToken string) (string, error) {
	// configure kubernetes client
	clientSet, err := cluster.K8sClient(sessionToken)
	if err != nil {
		return "", err
	}
	k8sClient := k8sClient{
		client: clientSet,
	}
	// Get cluster subscription license
	return getSubscriptionLicense(ctx, &k8sClient, cluster.Namespace, OperatorSubnetLicenseSecretName)
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

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(session *models.Principal) (*models.SessionResponse, *models.Error) {
	// serialize output
	if session == nil {
		return nil, prepareError(errorGenericInvalidSession)
	}
	sessionResp := &models.SessionResponse{
		Pages:    acl.GetAuthorizedEndpoints(session.Actions),
		Features: getListOfEnabledFeatures(),
		Status:   models.SessionResponseStatusOk,
		Operator: true,
	}
	return sessionResp, nil
}

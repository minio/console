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
	"net/http"
	"net/url"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/subnet"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	"github.com/minio/madmin-go"
)

func registerSubnetHandlers(api *operations.ConsoleAPI) {
	// Get subnet login handler
	api.AdminAPISubnetLoginHandler = admin_api.SubnetLoginHandlerFunc(func(params admin_api.SubnetLoginParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetLoginResponse(session, params)
		if err != nil {
			return admin_api.NewSubnetLoginDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubnetLoginOK().WithPayload(resp)
	})
	// Get subnet login with MFA handler
	api.AdminAPISubnetLoginMFAHandler = admin_api.SubnetLoginMFAHandlerFunc(func(params admin_api.SubnetLoginMFAParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetLoginWithMFAResponse(params)
		if err != nil {
			return admin_api.NewSubnetLoginMFADefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubnetLoginMFAOK().WithPayload(resp)
	})
	// Get subnet register
	api.AdminAPISubnetRegisterHandler = admin_api.SubnetRegisterHandlerFunc(func(params admin_api.SubnetRegisterParams, session *models.Principal) middleware.Responder {
		err := GetSubnetRegisterResponse(session, params)
		if err != nil {
			return admin_api.NewSubnetRegisterDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubnetRegisterOK()
	})
	// Get subnet info
	api.AdminAPISubnetInfoHandler = admin_api.SubnetInfoHandlerFunc(func(params admin_api.SubnetInfoParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetInfoResponse(session)
		if err != nil {
			return admin_api.NewSubnetInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubnetInfoOK().WithPayload(resp)
	})
	// Get subnet registration token
	api.AdminAPISubnetRegTokenHandler = admin_api.SubnetRegTokenHandlerFunc(func(params admin_api.SubnetRegTokenParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetRegTokenResponse(session)
		if err != nil {
			return admin_api.NewSubnetRegTokenDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubnetRegTokenOK().WithPayload(resp)
	})
}

func SubnetRegisterWithAPIKey(ctx context.Context, minioClient MinioAdmin, apiKey string) (bool, error) {
	serverInfo, err := minioClient.serverInfo(ctx)
	if err != nil {
		return false, err
	}
	registerResult, err := subnet.Register(httpClient, serverInfo, apiKey, "", "")
	if err != nil {
		return false, err
	}
	configStr := fmt.Sprintf("subnet license=%s api_key=%s", registerResult.License, registerResult.APIKey)
	_, err = minioClient.setConfigKV(ctx, configStr)
	if err != nil {
		return false, err
	}
	// cluster registered correctly
	return true, nil
}

func SubnetLogin(client cluster.HTTPClientI, username, password string) (string, string, error) {
	tokens, err := subnet.Login(client, username, password)
	if err != nil {
		return "", "", err
	}
	if tokens.MfaToken != "" {
		// user needs to complete login flow using mfa
		return "", tokens.MfaToken, nil
	}
	if tokens.AccessToken != "" {
		// register token to minio
		return tokens.AccessToken, "", nil
	}
	return "", "", errors.New("something went wrong")
}

func GetSubnetLoginResponse(session *models.Principal, params admin_api.SubnetLoginParams) (*models.SubnetLoginResponse, *models.Error) {
	ctx := context.Background()
	subnetHTTPClient, err := GetSubnetHTTPClient(params.Body.Proxy)
	if err != nil {
		return nil, prepareError(err)
	}
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	minioClient := AdminClient{Client: mAdmin}
	apiKey := params.Body.APIKey
	if apiKey != "" {
		registered, err := SubnetRegisterWithAPIKey(ctx, minioClient, apiKey)
		if err != nil {
			return nil, prepareError(err)
		}
		return &models.SubnetLoginResponse{
			Registered:    registered,
			Organizations: []*models.SubnetOrganization{},
		}, nil
	}
	username := params.Body.Username
	password := params.Body.Password
	if username != "" && password != "" {
		token, mfa, err := SubnetLogin(subnetHTTPClient, username, password)
		if err != nil {
			return nil, prepareError(err)
		}
		return &models.SubnetLoginResponse{
			MfaToken:      mfa,
			AccessToken:   token,
			Organizations: []*models.SubnetOrganization{},
		}, nil
	}
	return nil, prepareError(ErrorGeneric)
}

type SubnetRegistration struct {
	AccessToken   string
	MFAToken      string
	Organizations []models.SubnetOrganization
}

func SubnetLoginWithMFA(client cluster.HTTPClientI, username, mfaToken, otp string) (*models.SubnetLoginResponse, error) {
	tokens, err := subnet.LoginWithMFA(client, username, mfaToken, otp)
	if err != nil {
		return nil, err
	}
	if tokens.AccessToken != "" {
		organizations, errOrg := subnet.GetOrganizations(client, tokens.AccessToken)
		if errOrg != nil {
			return nil, errOrg
		}
		return &models.SubnetLoginResponse{
			AccessToken:   tokens.AccessToken,
			Organizations: organizations,
		}, nil
	}
	return nil, errors.New("something went wrong")
}

// GetSubnetHTTPClient will return a client with proxy if configured, otherwise will return the default console http client
func GetSubnetHTTPClient(proxy string) (*cluster.HTTPClient, error) {
	var subnetHTTPClient *http.Client
	if proxy != "" {
		transport := prepareSTSClientTransport(false)
		subnetHTTPClient = &http.Client{
			Transport: transport,
		}
		subnetProxyURL, err := url.Parse(proxy)
		if err != nil {
			return nil, err
		}
		subnetHTTPClient.Transport.(*http.Transport).Proxy = http.ProxyURL(subnetProxyURL)
	} else {
		subnetHTTPClient = GetConsoleHTTPClient()
	}
	clientI := &cluster.HTTPClient{
		Client: subnetHTTPClient,
	}
	return clientI, nil
}

func GetSubnetLoginWithMFAResponse(params admin_api.SubnetLoginMFAParams) (*models.SubnetLoginResponse, *models.Error) {
	subnetHTTPClient, err := GetSubnetHTTPClient(params.Body.Proxy)
	if err != nil {
		return nil, prepareError(err)
	}
	resp, err := SubnetLoginWithMFA(subnetHTTPClient, *params.Body.Username, *params.Body.MfaToken, *params.Body.Otp)
	if err != nil {
		return nil, prepareError(err)
	}
	return resp, nil
}

func GetSubnetKeyFromMinIOConfig(ctx context.Context, minioClient MinioAdmin) (*subnet.LicenseTokenConfig, error) {
	sh, err := minioClient.helpConfigKV(ctx, "subnet", "", false)
	if err != nil {
		return nil, err
	}
	buf, err := minioClient.getConfigKV(ctx, "subnet")
	if err != nil {
		return nil, err
	}
	tgt, err := madmin.ParseSubSysTarget(buf, sh)
	if err != nil {
		return nil, err
	}
	res := subnet.LicenseTokenConfig{}
	for _, kv := range tgt.KVS {
		if kv.Key == "api_key" {
			res.APIKey = kv.Value
		} else if kv.Key == "license" {
			res.License = kv.Value
		}
	}
	return &res, nil
}

func GetSubnetRegister(ctx context.Context, minioClient MinioAdmin, httpClient cluster.HTTPClientI, params admin_api.SubnetRegisterParams) error {
	serverInfo, err := minioClient.serverInfo(ctx)
	if err != nil {
		return err
	}
	registerResult, err := subnet.Register(httpClient, serverInfo, "", *params.Body.Token, *params.Body.AccountID)
	if err != nil {
		return err
	}
	configStr := fmt.Sprintf("subnet license=%s api_key=%s", registerResult.License, registerResult.APIKey)
	_, err = minioClient.setConfigKV(ctx, configStr)
	if err != nil {
		return err
	}
	return nil
}

func GetSubnetRegisterResponse(session *models.Principal, params admin_api.SubnetRegisterParams) *models.Error {
	ctx := context.Background()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}
	subnetHTTPClient, err := GetSubnetHTTPClient(params.Body.Proxy)
	if err != nil {
		return prepareError(err)
	}
	err = GetSubnetRegister(ctx, adminClient, subnetHTTPClient, params)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

func GetSubnetInfoResponse(session *models.Principal) (*models.License, *models.Error) {
	ctx := context.Background()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}
	subnetTokens, err := GetSubnetKeyFromMinIOConfig(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	if subnetTokens.APIKey == "" {
		return nil, prepareError(errLicenseNotFound)
	}
	client := &cluster.HTTPClient{
		Client: GetConsoleHTTPClient(),
	}
	licenseInfo, err := subnet.ParseLicense(client, subnetTokens.License)
	if err != nil {
		return nil, prepareError(err)
	}
	license := &models.License{
		Email:           licenseInfo.Email,
		AccountID:       licenseInfo.AccountID,
		StorageCapacity: licenseInfo.StorageCapacity,
		Plan:            licenseInfo.Plan,
		ExpiresAt:       licenseInfo.ExpiresAt.String(),
		Organization:    licenseInfo.Organization,
	}
	return license, nil

}

func GetSubnetRegToken(ctx context.Context, minioClient MinioAdmin) (string, error) {
	serverInfo, err := minioClient.serverInfo(ctx)
	if err != nil {
		return "", err
	}
	regInfo := subnet.GetClusterRegInfo(serverInfo)
	regToken, err := subnet.GenerateRegToken(regInfo)
	if err != nil {
		return "", err
	}
	return regToken, nil
}

func GetSubnetRegTokenResponse(session *models.Principal) (*models.SubnetRegTokenResponse, *models.Error) {
	ctx := context.Background()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	adminClient := AdminClient{Client: mAdmin}
	token, err := GetSubnetRegToken(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	return &models.SubnetRegTokenResponse{
		RegToken: token,
	}, nil
}

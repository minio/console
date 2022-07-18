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

	xhttp "github.com/minio/console/pkg/http"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/subnet"
	"github.com/minio/console/restapi/operations"
	subnetApi "github.com/minio/console/restapi/operations/subnet"
	"github.com/minio/madmin-go"
)

func registerSubnetHandlers(api *operations.ConsoleAPI) {
	// Get subnet login handler
	api.SubnetSubnetLoginHandler = subnetApi.SubnetLoginHandlerFunc(func(params subnetApi.SubnetLoginParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetLoginResponse(session, params)
		if err != nil {
			return subnetApi.NewSubnetLoginDefault(int(err.Code)).WithPayload(err)
		}
		return subnetApi.NewSubnetLoginOK().WithPayload(resp)
	})
	// Get subnet login with MFA handler
	api.SubnetSubnetLoginMFAHandler = subnetApi.SubnetLoginMFAHandlerFunc(func(params subnetApi.SubnetLoginMFAParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetLoginWithMFAResponse(session, params)
		if err != nil {
			return subnetApi.NewSubnetLoginMFADefault(int(err.Code)).WithPayload(err)
		}
		return subnetApi.NewSubnetLoginMFAOK().WithPayload(resp)
	})
	// Get subnet register
	api.SubnetSubnetRegisterHandler = subnetApi.SubnetRegisterHandlerFunc(func(params subnetApi.SubnetRegisterParams, session *models.Principal) middleware.Responder {
		err := GetSubnetRegisterResponse(session, params)
		if err != nil {
			return subnetApi.NewSubnetRegisterDefault(int(err.Code)).WithPayload(err)
		}
		return subnetApi.NewSubnetRegisterOK()
	})
	// Get subnet info
	api.SubnetSubnetInfoHandler = subnetApi.SubnetInfoHandlerFunc(func(params subnetApi.SubnetInfoParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetInfoResponse(session, params)
		if err != nil {
			return subnetApi.NewSubnetInfoDefault(int(err.Code)).WithPayload(err)
		}
		return subnetApi.NewSubnetInfoOK().WithPayload(resp)
	})
	// Get subnet registration token
	api.SubnetSubnetRegTokenHandler = subnetApi.SubnetRegTokenHandlerFunc(func(params subnetApi.SubnetRegTokenParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetRegTokenResponse(session, params)
		if err != nil {
			return subnetApi.NewSubnetRegTokenDefault(int(err.Code)).WithPayload(err)
		}
		return subnetApi.NewSubnetRegTokenOK().WithPayload(resp)
	})

	api.SubnetSubnetAPIKeyHandler = subnetApi.SubnetAPIKeyHandlerFunc(func(params subnetApi.SubnetAPIKeyParams, session *models.Principal) middleware.Responder {
		resp, err := GetSubnetAPIKeyResponse(session, params)
		if err != nil {
			return subnetApi.NewSubnetAPIKeyDefault(int(err.Code)).WithPayload(err)
		}
		return subnetApi.NewSubnetAPIKeyOK().WithPayload(resp)
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
	// Keep existing subnet proxy if exists
	subnetKey, err := GetSubnetKeyFromMinIOConfig(ctx, minioClient)
	if err != nil {
		return false, err
	}
	configStr := fmt.Sprintf("subnet license=%s api_key=%s proxy=%s", registerResult.License, registerResult.APIKey, subnetKey.Proxy)
	_, err = minioClient.setConfigKV(ctx, configStr)
	if err != nil {
		return false, err
	}
	// cluster registered correctly
	return true, nil
}

func SubnetLogin(client xhttp.ClientI, username, password string) (string, string, error) {
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

func GetSubnetLoginResponse(session *models.Principal, params subnetApi.SubnetLoginParams) (*models.SubnetLoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	minioClient := AdminClient{Client: mAdmin}
	subnetHTTPClient, err := GetSubnetHTTPClient(ctx, minioClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	apiKey := params.Body.APIKey
	if apiKey != "" {
		registered, err := SubnetRegisterWithAPIKey(ctx, minioClient, apiKey)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
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
			return nil, ErrorWithContext(ctx, err)
		}
		return &models.SubnetLoginResponse{
			MfaToken:      mfa,
			AccessToken:   token,
			Organizations: []*models.SubnetOrganization{},
		}, nil
	}
	return nil, ErrorWithContext(ctx, ErrDefault)
}

type SubnetRegistration struct {
	AccessToken   string
	MFAToken      string
	Organizations []models.SubnetOrganization
}

func SubnetLoginWithMFA(client xhttp.ClientI, username, mfaToken, otp string) (*models.SubnetLoginResponse, error) {
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
func GetSubnetHTTPClient(ctx context.Context, minioClient MinioAdmin) (*xhttp.Client, error) {
	var subnetHTTPClient *http.Client
	var proxy string
	envProxy := getSubnetProxy()
	subnetKey, err := GetSubnetKeyFromMinIOConfig(ctx, minioClient)
	if err != nil {
		return nil, err
	}
	if subnetKey.Proxy != "" {
		proxy = subnetKey.Proxy
	} else if envProxy != "" {
		proxy = envProxy
	}
	if proxy != "" {
		transport := PrepareSTSClientTransport(false)
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
	clientI := &xhttp.Client{
		Client: subnetHTTPClient,
	}
	return clientI, nil
}

func GetSubnetLoginWithMFAResponse(session *models.Principal, params subnetApi.SubnetLoginMFAParams) (*models.SubnetLoginResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	minioClient := AdminClient{Client: mAdmin}
	subnetHTTPClient, err := GetSubnetHTTPClient(ctx, minioClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	resp, err := SubnetLoginWithMFA(subnetHTTPClient, *params.Body.Username, *params.Body.MfaToken, *params.Body.Otp)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
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
		switch kv.Key {
		case "api_key":
			res.APIKey = kv.Value
		case "license":
			res.License = kv.Value
		case "proxy":
			res.Proxy = kv.Value
		}
	}
	return &res, nil
}

func GetSubnetRegister(ctx context.Context, minioClient MinioAdmin, httpClient xhttp.ClientI, params subnetApi.SubnetRegisterParams) error {
	serverInfo, err := minioClient.serverInfo(ctx)
	if err != nil {
		return err
	}
	registerResult, err := subnet.Register(httpClient, serverInfo, "", *params.Body.Token, *params.Body.AccountID)
	if err != nil {
		return err
	}
	// Keep existing subnet proxy if exists
	subnetKey, err := GetSubnetKeyFromMinIOConfig(ctx, minioClient)
	if err != nil {
		return err
	}
	configStr := fmt.Sprintf("subnet license=%s api_key=%s proxy=%s", registerResult.License, registerResult.APIKey, subnetKey.Proxy)
	_, err = minioClient.setConfigKV(ctx, configStr)
	if err != nil {
		return err
	}
	return nil
}

func GetSubnetRegisterResponse(session *models.Principal, params subnetApi.SubnetRegisterParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	subnetHTTPClient, err := GetSubnetHTTPClient(ctx, adminClient)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	err = GetSubnetRegister(ctx, adminClient, subnetHTTPClient, params)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func GetSubnetInfoResponse(session *models.Principal, params subnetApi.SubnetInfoParams) (*models.License, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	subnetTokens, err := GetSubnetKeyFromMinIOConfig(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	if subnetTokens.APIKey == "" {
		return nil, ErrorWithContext(ctx, ErrLicenseNotFound)
	}
	client := &xhttp.Client{
		Client: GetConsoleHTTPClient(),
	}
	licenseInfo, err := subnet.ParseLicense(client, subnetTokens.License)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
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

func GetSubnetRegTokenResponse(session *models.Principal, params subnetApi.SubnetRegTokenParams) (*models.SubnetRegTokenResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	token, err := GetSubnetRegToken(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.SubnetRegTokenResponse{
		RegToken: token,
	}, nil
}

func GetSubnetAPIKeyResponse(session *models.Principal, params subnetApi.SubnetAPIKeyParams) (*models.APIKey, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	adminClient := AdminClient{Client: mAdmin}
	subnetHTTPClient, err := GetSubnetHTTPClient(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	token := params.HTTPRequest.URL.Query().Get("token")
	apiKey, err := subnet.GetAPIKey(subnetHTTPClient, token)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return &models.APIKey{APIKey: apiKey}, nil
}

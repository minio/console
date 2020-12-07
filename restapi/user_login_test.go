// This file is part of MinIO Console Server
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
	"errors"
	"testing"

	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio/cmd/config"
	"github.com/minio/minio/pkg/madmin"
	"github.com/stretchr/testify/assert"
)

// Define a mock struct of ConsoleCredentialsI interface implementation
type consoleCredentialsMock struct{}

func (ac consoleCredentialsMock) GetActions() []string {
	return []string{}
}

func (ac consoleCredentialsMock) GetAccountAccessKey() string {
	return ""
}

func (ac consoleCredentialsMock) GetAccountSecretKey() string {
	return ""
}

// Common mocks
var consoleCredentialsGetMock func() (credentials.Value, error)

// mock function of Get()
func (ac consoleCredentialsMock) Get() (credentials.Value, error) {
	return consoleCredentialsGetMock()
}

func TestLogin(t *testing.T) {
	funcAssert := assert.New(t)
	consoleCredentials := consoleCredentialsMock{}
	// Test Case 1: Valid consoleCredentials
	consoleCredentialsGetMock = func() (credentials.Value, error) {
		return credentials.Value{
			AccessKeyID:     "fakeAccessKeyID",
			SecretAccessKey: "fakeSecretAccessKey",
			SessionToken:    "fakeSessionToken",
			SignerType:      0,
		}, nil
	}
	token, err := login(consoleCredentials)
	funcAssert.NotEmpty(token, "Token was returned empty")
	funcAssert.Nil(err, "error creating a session")

	// Test Case 2: Invalid credentials
	consoleCredentialsGetMock = func() (credentials.Value, error) {
		return credentials.Value{}, errors.New("")
	}
	_, err = login(consoleCredentials)
	funcAssert.NotNil(err, "not error returned creating a session")
}

type IdentityProviderClientMock struct{}

var idpVerifyIdentityMock func(ctx context.Context, code, state string) (*oauth2.User, error)
var idpGenerateLoginURLMock func() string

func (ac IdentityProviderClientMock) VerifyIdentity(ctx context.Context, code, state string) (*oauth2.User, error) {
	return idpVerifyIdentityMock(ctx, code, state)
}

func (ac IdentityProviderClientMock) GenerateLoginURL() string {
	return idpGenerateLoginURLMock()
}

// TestLoginOauth2Auth is the main function that test the Oauth2 Authentication
func TestLoginOauth2Auth(t *testing.T) {
	ctx := context.Background()
	funcAssert := assert.New(t)
	// mock data
	mockCode := "EAEAEAE"
	mockState := "HUEHUEHUE"
	idpClientMock := IdentityProviderClientMock{}
	identityProvider := &auth.IdentityProvider{Client: idpClientMock}
	// Test-1 : loginOauth2Auth() correctly authenticates the user
	idpVerifyIdentityMock = func(ctx context.Context, code, state string) (*oauth2.User, error) {
		return &oauth2.User{}, nil
	}
	function := "loginOauth2Auth()"
	_, err := loginOauth2Auth(ctx, identityProvider, mockCode, mockState)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2 : loginOauth2Auth() returns an error
	idpVerifyIdentityMock = func(ctx context.Context, code, state string) (*oauth2.User, error) {
		return nil, errors.New("error")
	}
	if _, err := loginOauth2Auth(ctx, identityProvider, mockCode, mockState); funcAssert.Error(err) {
		funcAssert.Equal(errInvalidCredentials.Error(), err.Error())
	}
}

func Test_getConfiguredRegion(t *testing.T) {
	client := adminClientMock{}
	type args struct {
		client adminClientMock
	}

	tests := []struct {
		name string
		args args
		want string
		mock func()
	}{
		// If MinIO returns an error, we return empty region name
		{
			name: "region",
			args: args{
				client: client,
			},
			want: "",
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(key string) ([]byte, error) {
					return nil, errors.New("invalid config")
				}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(subSys, key string, envOnly bool) (madmin.Help, error) {
					return madmin.Help{}, errors.New("no help")
				}
			},
		},
		// MinIO returns an empty region name
		{
			name: "region",
			args: args{
				client: client,
			},
			want: "",
			mock: func() {
				// mock function response from getConfig()
				minioGetConfigKVMock = func(key string) ([]byte, error) {
					return []byte("region name= "), nil
				}
				// mock function response from listConfig()
				minioHelpConfigKVMock = func(subSys, key string, envOnly bool) (madmin.Help, error) {
					return madmin.Help{
						SubSys:          config.RegionSubSys,
						Description:     "label the location of the server",
						MultipleTargets: false,
						KeysHelp: []madmin.HelpKV{
							{
								Key:             "name",
								Description:     "name of the location of the server e.g. \"us-west-rack2\"",
								Optional:        true,
								Type:            "string",
								MultipleTargets: false,
							},
							{
								Key:             "comment",
								Description:     "optionally add a comment to this setting",
								Optional:        true,
								Type:            "sentence",
								MultipleTargets: false,
							},
						},
					}, nil
				}
			},
		},
		// MinIO returns the asia region
		{
			name: "region",
			args: args{
				client: client,
			},
			want: "asia",
			mock: func() {
				minioGetConfigKVMock = func(key string) ([]byte, error) {
					return []byte("region name=asia "), nil
				}
			},
		},
	}
	for _, tt := range tests {
		tt.mock()
		t.Run(tt.name, func(t *testing.T) {
			if got, _ := getConfiguredRegionForLogin(context.Background(), tt.args.client); got != tt.want {
				t.Errorf("getConfiguredRegionForLogin() = %v, want %v", got, tt.want)
			}
		})
	}
}

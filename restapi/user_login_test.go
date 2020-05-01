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

	"github.com/minio/mcs/pkg/auth"
	"github.com/minio/mcs/pkg/auth/idp/oauth2"
	"github.com/minio/minio-go/v6/pkg/credentials"
	"github.com/stretchr/testify/assert"
)

// Define a mock struct of MCSCredentials interface implementation
type mcsCredentialsMock struct{}

// Common mocks
var mcsCredentialsGetMock func() (credentials.Value, error)

// mock function of Get()
func (ac mcsCredentialsMock) Get() (credentials.Value, error) {
	return mcsCredentialsGetMock()
}

func TestLogin(t *testing.T) {
	funcAssert := assert.New(t)
	mcsCredentials := mcsCredentialsMock{}
	// Test Case 1: Valid mcsCredentials
	mcsCredentialsGetMock = func() (credentials.Value, error) {
		return credentials.Value{
			AccessKeyID:     "fakeAccessKeyID",
			SecretAccessKey: "fakeSecretAccessKey",
			SessionToken:    "fakeSessionToken",
			SignerType:      0,
		}, nil
	}
	jwt, err := login(mcsCredentials)
	funcAssert.NotEmpty(jwt, "JWT was returned empty")
	funcAssert.Nil(err, "error creating a session")

	// Test Case 2: Invalid credentials
	mcsCredentialsGetMock = func() (credentials.Value, error) {
		return credentials.Value{}, errors.New("")
	}
	_, err = login(mcsCredentials)
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
		funcAssert.Equal("error", err.Error())
	}
}

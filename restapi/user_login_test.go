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
	"errors"
	"testing"

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

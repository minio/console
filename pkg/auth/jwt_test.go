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

package auth

import (
	"testing"

	"github.com/minio/minio-go/v6/pkg/credentials"
	"github.com/stretchr/testify/assert"
)

var audience = ""
var creds = &credentials.Value{
	AccessKeyID:     "fakeAccessKeyID",
	SecretAccessKey: "fakeSecretAccessKey",
	SessionToken:    "fakeSessionToken",
	SignerType:      0,
}
var goodToken = ""
var badToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiRDMwYWE0ekQ1bWtFaFRyWm5yOWM3NWh0Yko0MkROOWNDZVQ5RHVHUkg1U25SR3RyTXZNOXBMdnlFSVJAAAE5eWxxekhYMXllck8xUXpzMlZzRVFKeUF2ZmpOaDkrTVdoUURWZ2FhK2R5emxzSjNpK0k1dUdoeW5DNWswUW83WEY0UWszY0RtUTdUQUVROVFEbWRKdjBkdVB5L25hQk5vM3dIdlRDZHFNRDJZN3kycktJbmVUbUlFNmVveW9EWmprcW5tckVoYmMrTlhTRU81WjZqa1kwZ1E2eXZLaWhUZGxBRS9zS1lBNlc4Q1R1cm1MU0E0b0dIcGtldFZWU0VXMHEzNU9TU1VaczRXNkxHdGMxSTFWVFZLWUo3ZTlHR2REQ3hMWGtiZHQwcjl0RDNMWUhWRndra0dSZit5ZHBzS1Y3L1Jtbkp3SHNqNVVGV0w5WGVHUkZVUjJQclJTN2plVzFXeGZuYitVeXoxNVpOMzZsZ01GNnBlWFd1LzJGcEtrb2Z2QzNpY2x5Rmp0SE45ZkxYTVpVSFhnV2lsQWVSa3oiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAiLCJleHAiOjE1ODc1MTY1NzEsInN1YiI6ImZmYmY4YzljLTJlMjYtNGMwYS1iMmI0LTYyMmVhM2I1YjZhYiJ9.P392RUwzsrBeJOO3fS1xMZcF-lWiDvWZ5hM7LZOyFMmoG5QLccDU5eAPSm8obzPoznX1b7eCFLeEmKK-vKgjiQ"

func TestNewJWTWithClaimsForClient(t *testing.T) {
	funcAssert := assert.New(t)
	// Test-1 : NewJWTWithClaimsForClient() is generated correctly without errors
	function := "NewJWTWithClaimsForClient()"
	jwt, err := NewJWTWithClaimsForClient(creds, []string{""}, audience)
	if err != nil || jwt == "" {
		t.Errorf("Failed on %s:, error occurred: %s", function, err)
	}
	// saving jwt for future tests
	goodToken = jwt
	// Test-2 : NewJWTWithClaimsForClient() throws error because of empty credentials
	if _, err = NewJWTWithClaimsForClient(nil, []string{""}, audience); err != nil {
		funcAssert.Equal("provided credentials are empty", err.Error())
	}
}

func TestJWTAuthenticate(t *testing.T) {
	funcAssert := assert.New(t)
	// Test-1 : JWTAuthenticate() should correctly return the claims
	function := "JWTAuthenticate()"
	claims, err := JWTAuthenticate(goodToken)
	if err != nil || claims == nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err)
	} else {
		funcAssert.Equal(claims.AccessKeyID, creds.AccessKeyID)
		funcAssert.Equal(claims.SecretAccessKey, creds.SecretAccessKey)
		funcAssert.Equal(claims.SessionToken, creds.SessionToken)
	}
	// Test-2 : JWTAuthenticate() return an error because of a tampered jwt
	if _, err := JWTAuthenticate(badToken); err != nil {
		funcAssert.Equal("Authentication failed, check your access credentials", err.Error())
	}
	// Test-3 : JWTAuthenticate() return an error because of an empty jwt
	if _, err := JWTAuthenticate(""); err != nil {
		funcAssert.Equal("JWT token missing", err.Error())
	}
}

func TestIsJWTValid(t *testing.T) {
	funcAssert := assert.New(t)
	// Test-1 : JWTAuthenticate() provided token is valid
	funcAssert.Equal(true, IsJWTValid(goodToken))
	// Test-2 : JWTAuthenticate() provided token is invalid
	funcAssert.Equal(false, IsJWTValid(badToken))
}

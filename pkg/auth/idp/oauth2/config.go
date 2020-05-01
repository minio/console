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

// Package oauth2 contains all the necessary configurations to initialize the
// idp communication using oauth2 protocol
package oauth2

import (
	"github.com/minio/mcs/pkg/auth/utils"
	"github.com/minio/minio/pkg/env"
)

func GetIdpURL() string {
	return env.Get(McsIdpURL, "")
}

func GetIdpClientID() string {
	return env.Get(McsIdpClientID, "")
}

func GetIdpSecret() string {
	return env.Get(McsIdpSecret, "")
}

// Public endpoint used by the identity oidcProvider when redirecting the user after identity verification
func GetIdpCallbackURL() string {
	return env.Get(McsIdpCallbackURL, "")
}

func GetIdpAdminRoles() string {
	return env.Get(McsIdpAdminRoles, "")
}

func IsIdpEnabled() bool {
	return GetIdpURL() != "" &&
		GetIdpClientID() != "" &&
		GetIdpSecret() != "" &&
		GetIdpCallbackURL() != ""
}

var defaultPassphraseForIdpHmac = utils.RandomCharString(64)

// GetPassphraseForIdpHmac returns passphrase for the pbkdf2 function used to sign the oauth2 state parameter
func getPassphraseForIdpHmac() string {
	return env.Get(McsIdpHmacPassphrase, defaultPassphraseForIdpHmac)
}

var defaultSaltForIdpHmac = utils.RandomCharString(64)

// GetSaltForIdpHmac returns salt for the pbkdf2 function used to sign the oauth2 state parameter
func getSaltForIdpHmac() string {
	return env.Get(McsIdpHmacSalt, defaultSaltForIdpHmac)
}

// GetSaltForIdpHmac returns the policy to be assigned to the users authenticating via an IDP
func GetIDPPolicyForUser() string {
	return env.Get(McsIdpPolicyUser, "mcsAdmin")
}

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

// Package oauth2 contains all the necessary configurations to initialize the
// idp communication using oauth2 protocol
package oauth2

import (
	"strings"

	"github.com/minio/console/pkg/auth/utils"
	"github.com/minio/pkg/env"
)

func GetSTSEndpoint() string {
	return strings.TrimSpace(env.Get(ConsoleMinIOServer, "http://localhost:9000"))
}

func GetIDPURL() string {
	return env.Get(ConsoleIDPURL, "")
}

func GetIDPClientID() string {
	return env.Get(ConsoleIDPClientID, "")
}

func GetIDPUserInfo() bool {
	return env.Get(ConsoleIDPUserInfo, "") == "on"
}

func GetIDPSecret() string {
	return env.Get(ConsoleIDPSecret, "")
}

// Public endpoint used by the identity oidcProvider when redirecting
// the user after identity verification
func GetIDPCallbackURL() string {
	return env.Get(ConsoleIDPCallbackURL, "")
}

func GetIDPCallbackURLDynamic() bool {
	return env.Get(ConsoleIDPCallbackURLDynamic, "") == "on"
}

func IsIDPEnabled() bool {
	return GetIDPURL() != "" &&
		GetIDPClientID() != ""
}

var defaultPassphraseForIDPHmac = utils.RandomCharString(64)

// GetPassphraseForIDPHmac returns passphrase for the pbkdf2 function used to sign the oauth2 state parameter
func getPassphraseForIDPHmac() string {
	return env.Get(ConsoleIDPHmacPassphrase, defaultPassphraseForIDPHmac)
}

var defaultSaltForIDPHmac = utils.RandomCharString(64)

// GetSaltForIDPHmac returns salt for the pbkdf2 function used to sign the oauth2 state parameter
func getSaltForIDPHmac() string {
	return env.Get(ConsoleIDPHmacSalt, defaultSaltForIDPHmac)
}

// getIDPScopes return default scopes during the IDP login request
func getIDPScopes() string {
	return env.Get(ConsoleIDPScopes, "openid,profile,email")
}

// getIDPTokenExpiration return default token expiration for access token (in seconds)
func getIDPTokenExpiration() string {
	return env.Get(ConsoleIDPTokenExpiration, "3600")
}

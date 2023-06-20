// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

package policy

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/minio/madmin-go/v3"
)

// ReplacePolicyVariables replaces known variables from policies with known values
func ReplacePolicyVariables(claims map[string]interface{}, accountInfo *madmin.AccountInfo) json.RawMessage {
	// AWS Variables
	rawPolicy := bytes.ReplaceAll(accountInfo.Policy, []byte("${aws:username}"), []byte(accountInfo.AccountName))
	rawPolicy = bytes.ReplaceAll(rawPolicy, []byte("${aws:userid}"), []byte(accountInfo.AccountName))
	// JWT Variables
	rawPolicy = replaceJwtVariables(rawPolicy, claims)
	// LDAP Variables
	rawPolicy = replaceLDAPVariables(rawPolicy, claims)
	return rawPolicy
}

func replaceJwtVariables(rawPolicy []byte, claims map[string]interface{}) json.RawMessage {
	// list of valid JWT fields we will replace in policy if they are in the response
	jwtFields := []string{
		"sub",
		"iss",
		"aud",
		"jti",
		"upn",
		"name",
		"groups",
		"given_name",
		"family_name",
		"middle_name",
		"nickname",
		"preferred_username",
		"profile",
		"picture",
		"website",
		"email",
		"gender",
		"birthdate",
		"phone_number",
		"address",
		"scope",
		"client_id",
	}
	// check which fields are in the claims and replace as variable by casting the value to string
	for _, field := range jwtFields {
		if val, ok := claims[field]; ok {
			variable := fmt.Sprintf("${jwt:%s}", field)
			rawPolicy = bytes.ReplaceAll(rawPolicy, []byte(variable), []byte(fmt.Sprintf("%v", val)))
		}
	}
	return rawPolicy
}

// ReplacePolicyVariables replaces known variables from policies with known values
func replaceLDAPVariables(rawPolicy []byte, claims map[string]interface{}) json.RawMessage {
	// replace ${ldap:user}
	if val, ok := claims["ldapUser"]; ok {
		rawPolicy = bytes.ReplaceAll(rawPolicy, []byte("${ldap:user}"), []byte(fmt.Sprintf("%v", val)))
	}
	// replace ${ldap:username}
	if val, ok := claims["ldapUsername"]; ok {
		rawPolicy = bytes.ReplaceAll(rawPolicy, []byte("${ldap:username}"), []byte(fmt.Sprintf("%v", val)))
	}
	return rawPolicy
}

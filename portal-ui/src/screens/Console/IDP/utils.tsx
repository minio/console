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

export const openIDFormFields = {
  config_url: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Config URL is required" : "";
    },
    label: "Config URL",
    tooltip: "Config URL for identity provider configuration",
    placeholder:
      "https://identity-provider-url/.well-known/openid-configuration",
    type: "text",
  },
  client_id: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Client ID is required" : "";
    },
    label: "Client ID",
    tooltip: "Identity provider Client ID",
    placeholder: "Enter Client ID",
    type: "text",
  },
  client_secret: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Client Secret is required" : "";
    },
    label: "Client Secret",
    tooltip: "Identity provider Client Secret",
    placeholder: "Enter Client Secret",
    type: "password",
  },
  display_name: {
    required: false,
    label: "Display Name",
    tooltip: "Display Name",
    placeholder: "Enter Display Name",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
  claim_name: {
    required: false,
    label: "Claim Name",
    tooltip: "Claim from which MinIO will read the policy or role to use",
    placeholder: "Enter Claim Name",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
  claim_prefix: {
    required: false,
    label: "Claim Prefix",
    tooltip: "Claim Prefix",
    placeholder: "Enter Claim Prefix",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
  scopes: {
    required: false,
    label: "Scopes",
    tooltip: "Scopes",
    placeholder: "openid,profile,email",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
  redirect_uri: {
    required: false,
    label: "Redirect URI",
    tooltip: "Redirect URI",
    placeholder: "https://console-endpoint-url/oauth_callback",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
  role_policy: {
    required: false,
    label: "Role Policy",
    tooltip: "Role Policy",
    placeholder: "readonly",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
};

export const ldapFormFields = {
  server_addr: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Server Address is required" : "";
    },
    label: "Server Address",
    tooltip: 'AD/LDAP server address e.g. "myldapserver.com:636"',
    placeholder: "myldapserver.com:636",
    type: "text",
  },
  lookup_bind_dn: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Lookup Bind DN is required" : "";
    },
    label: "Lookup Bind DN",
    tooltip:
      "DN for LDAP read-only service account used to perform DN and group lookups",
    placeholder: "cn=admin,dc=min,dc=io",
    type: "text",
  },
  lookup_bind_password: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Lookup Bind Password is required" : "";
    },
    label: "Lookup Bind Password",
    tooltip:
      "Password for LDAP read-only service account used to perform DN and group lookups",
    placeholder: "admin",
    type: "password",
  },
  user_dn_search_base_dn: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "User DN Search Base DN is required" : "";
    },
    label: "User DN Search Base",
    tooltip: "Base LDAP DN to search for user DN",
    placeholder: "DC=example,DC=net",
    type: "text",
  },
  user_dn_search_filter: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "User DN Search Filter is required" : "";
    },
    label: "User DN Search Filter",
    tooltip: "Search filter to lookup user DN",
    placeholder: "(sAMAcountName=%s)",
    type: "text",
  },
  display_name: {
    required: false,
    label: "Display Name",
    tooltip: "Display Name",
    placeholder: "Enter Display Name",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
  },
  group_search_base_dn: {
    required: false,
    hasError: (s: string, editMode: boolean) => "",
    label: "Group Search Base DN",
    tooltip: "Group Search Base DN",
    placeholder: "ou=swengg,dc=min,dc=io",
    type: "text",
  },
  group_search_filter: {
    required: false,
    hasError: (s: string, editMode: boolean) => "",
    label: "Group Search Filter",
    tooltip: "Group Search Filter",
    placeholder: "(&(objectclass=groupofnames)(member=%d))",
    type: "text",
  },
};

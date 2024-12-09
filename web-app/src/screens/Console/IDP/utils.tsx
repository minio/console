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

import { LockIcon, LoginIcon } from "mds";

export const ldapHelpBoxContents = [
  {
    text: "MinIO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing MinIO.",
    icon: <LoginIcon />,
    iconDescription: "Create Configurations",
  },
  {
    text: "MinIO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. MinIO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries",
    icon: null,
    iconDescription: "",
  },
  {
    text: "MinIO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.",
    icon: null,
    iconDescription: "",
  },
];

export const openIDHelpBoxContents = [
  {
    text: "MinIO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.",
    icon: <LockIcon />,
    iconDescription: "Create Configurations",
  },
  {
    text: "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing MinIO.",
    icon: null,
    iconDescription: "",
  },
];

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
    editOnly: false,
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
    editOnly: false,
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
    editOnly: true,
  },
  claim_name: {
    required: false,
    label: "Claim Name",
    tooltip: "Claim from which MinIO will read the policy or role to use",
    placeholder: "Enter Claim Name",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  display_name: {
    required: false,
    label: "Display Name",
    tooltip: "",
    placeholder: "Enter Display Name",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  claim_prefix: {
    required: false,
    label: "Claim Prefix",
    tooltip: "",
    placeholder: "Enter Claim Prefix",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  scopes: {
    required: false,
    label: "Scopes",
    tooltip: "",
    placeholder: "openid,profile,email",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  redirect_uri: {
    required: false,
    label: "Redirect URI",
    tooltip: "",
    placeholder: "https://console-endpoint-url/oauth_callback",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  role_policy: {
    required: false,
    label: "Role Policy",
    tooltip: "",
    placeholder: "readonly",
    type: "text",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  claim_userinfo: {
    required: false,
    label: "Claim User Info",
    tooltip: "",
    placeholder: "Claim User Info",
    type: "toggle",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
  redirect_uri_dynamic: {
    required: false,
    label: "Redirect URI Dynamic",
    tooltip: "",
    placeholder: "Redirect URI Dynamic",
    type: "toggle",
    hasError: (s: string, editMode: boolean) => "",
    editOnly: false,
  },
};

export const ldapFormFields = {
  server_insecure: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Server Address is required" : "";
    },
    label: "Server Insecure",
    tooltip: "Disable SSL certificate verification ",
    placeholder: "myldapserver.com:636",
    type: "toggle",
    editOnly: false,
  },
  server_addr: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Server Address is required" : "";
    },
    label: "Server Address",
    tooltip: 'AD/LDAP server address e.g. "myldapserver.com:636"',
    placeholder: "myldapserver.com:636",
    type: "text",
    editOnly: false,
  },
  lookup_bind_dn: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "Lookup Bind DN is required" : "";
    },
    label: "Lookup Bind DN",
    tooltip:
      "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups",
    placeholder: "cn=admin,dc=min,dc=io",
    type: "text",
    editOnly: false,
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
    editOnly: true,
  },
  user_dn_search_base_dn: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "User DN Search Base DN is required" : "";
    },
    label: "User DN Search Base",
    tooltip: "",
    placeholder: "DC=example,DC=net",
    type: "text",
    editOnly: false,
  },
  user_dn_search_filter: {
    required: true,
    hasError: (s: string, editMode: boolean) => {
      return !s && editMode ? "User DN Search Filter is required" : "";
    },
    label: "User DN Search Filter",
    tooltip: "",
    placeholder: "(sAMAccountName=%s)",
    type: "text",
    editOnly: false,
  },
  group_search_base_dn: {
    required: false,
    hasError: (s: string, editMode: boolean) => "",
    label: "Group Search Base DN",
    tooltip: "",
    placeholder: "ou=swengg,dc=min,dc=io",
    type: "text",
    editOnly: false,
  },
  group_search_filter: {
    required: false,
    hasError: (s: string, editMode: boolean) => "",
    label: "Group Search Filter",
    tooltip: "",
    placeholder: "(&(objectclass=groupofnames)(member=%d))",
    type: "text",
    editOnly: false,
  },
};

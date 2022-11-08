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
import { t } from "i18next";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import CompressIcon from "@mui/icons-material/Compress";
import CodeIcon from "@mui/icons-material/Code";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LoginIcon from "@mui/icons-material/Login";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CallToActionIcon from "@mui/icons-material/CallToAction";
import { IElement, IElementValue } from "./types";
export const configurationElements: IElement[] = [
  {
    icon: <PublicIcon />,
    configuration_id: "region",
    configuration_label: t("Region"),
  },
  {
    icon: <CompressIcon />,
    configuration_id: "compression",
    configuration_label: t("Compression"),
  },
  {
    icon: <CodeIcon />,
    configuration_id: "api",
    configuration_label: t("API"),
  },
  {
    icon: <LocalHospitalIcon />,
    configuration_id: "heal",
    configuration_label: t("Heal"),
  },
  {
    icon: <FindReplaceIcon />,
    configuration_id: "scanner",
    configuration_label: t("Scanner"),
  },
  {
    icon: <VpnKeyIcon />,
    configuration_id: "etcd",
    configuration_label: t("Etcd"),
  },
  {
    icon: <LockOpenIcon />,
    configuration_id: "identity_openid",
    configuration_label: t("Identity Openid"),
  },
  {
    icon: <LoginIcon />,
    configuration_id: "identity_ldap",
    configuration_label: t("Identity LDAP"),
  },
  {
    icon: <CallToActionIcon />,
    configuration_id: "logger_webhook",
    configuration_label: t("Logger Webhook"),
  },
  {
    icon: <PendingActionsIcon />,
    configuration_id: "audit_webhook",
    configuration_label: t("Audit Webhook"),
  },
];
export const fieldsConfigurations: any = {
  region: [
    {
      name: "name",
      required: true,
      label: t("Server Location"),
      tooltip: t('Name of the location of the server e.g. "us-west-rack2"'),
      type: "string",
      placeholder: t("e.g. us-west-rack-2"),
    },
    {
      name: "comment",
      required: false,
      label: t("Comment"),
      tooltip: t("You can add a comment to this setting"),
      type: "comment",
      placeholder: t("Enter custom notes if any"),
    },
  ],
  compression: [
    {
      name: "extensions",
      required: false,
      label: t("Extensions"),
      tooltip: t(
        'Extensions to compress e.g. ".txt",".log" or ".csv", you can write one per field'
      ),
      type: "csv",
      placeholder: t("Enter an Extension"),
      withBorder: true,
    },
    {
      name: "mime_types",
      required: false,
      label: t("Mime Types"),
      tooltip: t(
        'Mime types e.g. "text/*","application/json" or "application/xml", you can write one per field'
      ),
      type: "csv",
      placeholder: t("Enter a Mime Type"),
      withBorder: true,
    },
  ],
  api: [
    {
      name: "requests_max",
      required: false,
      label: t("Requests Max"),
      tooltip: t("Maximum number of concurrent requests, e.g. '1600'"),
      type: "number",
      placeholder: t("Enter Requests Max"),
    },
    {
      name: "cors_allow_origin",
      required: false,
      label: t("Cors Allow Origin"),
      tooltip: t("List of origins allowed for CORS requests"),
      type: "csv",
      placeholder: t("Enter allowed origin e.g. https://example.com"),
    },
    {
      name: "replication_workers",
      required: false,
      label: t("Replication Workers"),
      tooltip: t("Number of replication workers, defaults to 100"),
      type: "number",
      placeholder: t("Enter Replication Workers"),
    },
    {
      name: "replication_failed_workers",
      required: false,
      label: t("Replication Failed Workers"),
      tooltip: t(
        "Number of replication workers for recently failed replicas, defaults to 4"
      ),
      type: "number",
      placeholder: t("Enter Replication Failed Workers"),
    },
  ],
  heal: [
    {
      name: "bitrotscan",
      required: false,
      label: t("Bitrot Scan"),
      tooltip: t(
        "Perform bitrot scan on disks when checking objects during scanner"
      ),
      type: "on|off",
    },
    {
      name: "max_sleep",
      required: false,
      label: t("Max Sleep"),
      tooltip: t(
        "Maximum sleep duration between objects to slow down heal operation. eg. 2s"
      ),
      type: "duration",
      placeholder: t("Enter Max Sleep duration"),
    },
    {
      name: "max_io",
      required: false,
      label: t("Max IO"),
      tooltip: t(
        "Maximum IO requests allowed between objects to slow down heal operation. eg. 3"
      ),
      type: "number",
      placeholder: t("Enter Max IO"),
    },
  ],
  scanner: [
    {
      name: "delay",
      required: false,
      label: t("Delay multiplier"),
      tooltip: t("Scanner delay multiplier, defaults to '10.0'"),
      type: "number",
      placeholder: t("Enter Delay"),
    },
    {
      name: "max_wait",
      required: false,
      label: t("Max Wait"),
      tooltip: t("Maximum wait time between operations, defaults to '15s'"),
      type: "duration",
      placeholder: t("Enter Max Wait"),
    },
    {
      name: "cycle",
      required: false,
      label: t("Cycle"),
      tooltip: t("Time duration between scanner cycles, defaults to '1m'"),
      type: "duration",
      placeholder: t("Enter Cycle"),
    },
  ],
  etcd: [
    {
      name: "endpoints",
      required: true,
      label: t("Endpoints"),
      tooltip: t(
        'List of etcd endpoints e.g. "http://localhost:2379", you can write one per field'
      ),
      type: "csv",
      placeholder: t("Enter Endpoint"),
    },
    {
      name: "path_prefix",
      required: false,
      label: t("Path Prefix"),
      tooltip: t('Namespace prefix to isolate tenants e.g. "customer1/"'),
      type: "string",
      placeholder: t("Enter Path Prefix"),
    },
    {
      name: "coredns_path",
      required: false,
      label: t("Coredns Path"),
      tooltip: t('Shared bucket DNS records, default is "/skydns"'),
      type: "string",
      placeholder: t("Enter Coredns Path"),
    },
    {
      name: "client_cert",
      required: false,
      label: t("Client Cert"),
      tooltip: t("Client cert for mTLS authentication"),
      type: "string",
      placeholder: t("Enter Client Cert"),
    },
    {
      name: "client_cert_key",
      required: false,
      label: t("Client Cert Key"),
      tooltip: t("Client cert key for mTLS authentication"),
      type: "string",
      placeholder: t("Enter Client Cert Key"),
    },
    {
      name: "comment",
      required: false,
      label: t("Comment"),
      tooltip: t("You can add a comment to this setting"),
      type: "comment",
      multiline: true,
      placeholder: t("Enter custom notes if any"),
    },
  ],
  identity_openid: [
    {
      name: "config_url",
      required: false,
      label: t("Config URL"),
      tooltip: t("Config URL for identity provider configuration"),
      type: "string",
      placeholder:
        "https://identity-provider-url/.well-known/openid-configuration",
    },
    {
      name: "client_id",
      required: false,
      label: t("Client ID"),
      type: "string",
      placeholder: t("Enter Client ID"),
    },
    {
      name: "client_secret",
      required: false,
      label: t("Secret ID"),
      type: "string",
      placeholder: t("Enter Secret ID"),
    },
    {
      name: "claim_name",
      required: false,
      label: t("Claim Name"),
      tooltip: t("Claim from which MinIO will read the policy or role to use"),
      type: "string",
      placeholder: t("Enter Claim Name"),
    },
    {
      name: "claim_prefix",
      required: false,
      label: t("Claim Prefix"),
      tooltip: t("Claim Prefix"),
      type: "string",
      placeholder: t("Enter Claim Prefix"),
    },
    {
      name: "claim_userinfo",
      required: false,
      label: t("Claim UserInfo"),
      type: "on|off",
    },
    {
      name: "redirect_uri",
      required: false,
      label: t("Redirect URI"),
      type: "string",
      placeholder: "https://console-endpoint-url/oauth_callback",
    },
    {
      name: "scopes",
      required: false,
      label: t("Scopes"),
      type: "string",
      placeholder: t("openid,profile,email"),
    },
  ],
  identity_ldap: [
    {
      name: "server_addr",
      required: true,
      label: t("Server Addr"),
      tooltip: t('AD/LDAP server address e.g. "myldapserver.com:636"'),
      type: "string",
      placeholder: t("myldapserver.com:636"),
    },
    {
      name: "tls_skip_verify",
      required: false,
      label: t("TLS Skip Verify"),
      tooltip: t(
        'Trust server TLS without verification, defaults to "off" (verify)'
      ),
      type: "on|off",
    },
    {
      name: "server_insecure",
      required: false,
      label: t("Server Insecure"),
      tooltip: t(
        'Allow plain text connection to AD/LDAP server, defaults to "off"'
      ),
      type: "on|off",
    },
    {
      name: "server_starttls",
      required: false,
      label: t("Start TLS connection to AD/LDAP server"),
      tooltip: t("Use StartTLS connection to AD/LDAP server"),
      type: "on|off",
    },
    {
      name: "lookup_bind_dn",
      required: true,
      label: t("Lookup Bind DN"),
      tooltip: t(
        "DN for LDAP read-only service account used to perform DN and group lookups"
      ),
      type: "string",
      placeholder: t("cn=admin,dc=min,dc=io"),
    },
    {
      name: "lookup_bind_password",
      required: false,
      label: t("Lookup Bind Password"),
      tooltip: t(
        "Password for LDAP read-only service account used to perform DN and group lookups"
      ),
      type: "string",
      placeholder: t("admin"),
    },
    {
      name: "user_dn_search_base_dn",
      required: false,
      label: t("User DN Search Base DN"),
      tooltip: t("Base LDAP DN to search for user DN"),
      type: "csv",
      placeholder: t("dc=myldapserver"),
    },
    {
      name: "user_dn_search_filter",
      required: false,
      label: t("User DN Search Filter"),
      tooltip: t("Search filter to lookup user DN"),
      type: "string",
      placeholder: t("(sAMAcountName=%s)"),
    },
    {
      name: "group_search_filter",
      required: false,
      label: t("Group Search Filter"),
      tooltip: t("Search filter for groups"),
      type: "string",
      placeholder: t("(&(objectclass=groupOfNames)(member=%d))"),
    },
    {
      name: "group_search_base_dn",
      required: false,
      label: t("Group Search Base DN"),
      tooltip: t("List of group search base DNs"),
      type: "csv",
      placeholder: t("dc=minioad,dc=local"),
    },
    {
      name: "comment",
      required: false,
      label: t("Comment"),
      tooltip: t("Optionally add a comment to this setting"),
      type: "comment",
      placeholder: t("Enter custom notes if any"),
    },
  ],
  logger_webhook: [
    {
      name: "endpoint",
      required: true,
      label: t("Endpoint"),
      type: "string",
      placeholder: t("Enter Endpoint"),
    },
    {
      name: "auth_token",
      required: true,
      label: t("Auth Token"),
      type: "string",
      placeholder: t("Enter Auth Token"),
    },
  ],
  audit_webhook: [
    {
      name: "endpoint",
      required: true,
      label: t("Endpoint"),
      type: "string",
      placeholder: t("Enter Endpoint"),
    },
    {
      name: "auth_token",
      required: true,
      label: t("Auth Token"),
      type: "string",
      placeholder: t("Enter Auth Token"),
    },
  ],
};
export const removeEmptyFields = (formFields: IElementValue[]) => {
  const nonEmptyFields = formFields.filter((field) => field.value !== "");
  return nonEmptyFields;
};
export const selectSAs = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSelectedSAs: Function,
  selectedSAs: string[]
) => {
  const targetD = e.target;
  const value = targetD.value;
  const checked = targetD.checked;
  let elements: string[] = [...selectedSAs]; // We clone the selectedSAs array
  if (checked) {
    // If the user has checked this field we need to push this to selectedSAs
    elements.push(value);
  } else {
    // User has unchecked this field, we need to remove it from the list
    elements = elements.filter((element) => element !== value);
  }
  setSelectedSAs(elements);
  return elements;
};

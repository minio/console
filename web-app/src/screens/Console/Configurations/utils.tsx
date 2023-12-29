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
import React from "react";
import { IElement, IElementValue, IOverrideEnv, OverrideValue } from "./types";
import {
  CodeIcon,
  CompressIcon,
  ConsoleIcon,
  FindReplaceIcon,
  FirstAidIcon,
  KeyIcon,
  LogsIcon,
  PendingItemsIcon,
  PublicIcon,
} from "mds";

export const configurationElements: IElement[] = [
  {
    icon: <PublicIcon />,
    configuration_id: "region",
    configuration_label: "Region",
  },
  {
    icon: <CompressIcon />,
    configuration_id: "compression",
    configuration_label: "Compression",
  },
  {
    icon: <CodeIcon />,
    configuration_id: "api",
    configuration_label: "API",
  },
  {
    icon: <FirstAidIcon />,
    configuration_id: "heal",
    configuration_label: "Heal",
  },
  {
    icon: <FindReplaceIcon />,
    configuration_id: "scanner",
    configuration_label: "Scanner",
  },
  {
    icon: <KeyIcon />,
    configuration_id: "etcd",
    configuration_label: "Etcd",
  },
  {
    icon: <ConsoleIcon />,
    configuration_id: "logger_webhook",
    configuration_label: "Logger Webhook",
  },
  {
    icon: <PendingItemsIcon />,
    configuration_id: "audit_webhook",
    configuration_label: "Audit Webhook",
  },
  {
    icon: <LogsIcon />,
    configuration_id: "audit_kafka",
    configuration_label: "Audit Kafka",
  },
];

export const fieldsConfigurations: any = {
  region: [
    {
      name: "name",
      required: true,
      label: "Server Location",
      tooltip: 'Name of the location of the server e.g. "us-west-rack2"',
      type: "string",
      placeholder: "e.g. us-west-rack-2",
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "You can add a comment to this setting",
      type: "comment",
      placeholder: "Enter custom notes if any",
    },
  ],
  compression: [
    {
      name: "extensions",
      required: false,
      label: "Extensions",
      tooltip:
        'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field',
      type: "csv",
      placeholder: "Enter an Extension",
      withBorder: true,
    },
    {
      name: "mime_types",
      required: false,
      label: "Mime Types",
      tooltip:
        'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field',
      type: "csv",
      placeholder: "Enter a Mime Type",
      withBorder: true,
    },
  ],
  api: [
    {
      name: "requests_max",
      required: false,
      label: "Requests Max",
      tooltip: "Maximum number of concurrent requests, e.g. '1600'",
      type: "number",
      placeholder: "Enter Requests Max",
    },
    {
      name: "cors_allow_origin",
      required: false,
      label: "Cors Allow Origin",
      tooltip: "List of origins allowed for CORS requests",
      type: "csv",
      placeholder: "Enter allowed origin e.g. https://example.com",
    },
    {
      name: "replication_workers",
      required: false,
      label: "Replication Workers",
      tooltip: "Number of replication workers, defaults to 100",
      type: "number",
      placeholder: "Enter Replication Workers",
    },
    {
      name: "replication_failed_workers",
      required: false,
      label: "Replication Failed Workers",
      tooltip:
        "Number of replication workers for recently failed replicas, defaults to 4",
      type: "number",
      placeholder: "Enter Replication Failed Workers",
    },
  ],
  heal: [
    {
      name: "bitrotscan",
      required: false,
      label: "Bitrot Scan",
      tooltip:
        "Perform bitrot scan on disks when checking objects during scanner",
      type: "on|off",
    },
    {
      name: "max_sleep",
      required: false,
      label: "Max Sleep",
      tooltip:
        "Maximum sleep duration between objects to slow down heal operation, e.g. 2s",
      type: "duration",
      placeholder: "Enter Max Sleep Duration",
    },
    {
      name: "max_io",
      required: false,
      label: "Max IO",
      tooltip:
        "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3",
      type: "number",
      placeholder: "Enter Max IO",
    },
  ],
  scanner: [
    {
      name: "delay",
      required: false,
      label: "Delay Multiplier",
      tooltip: "Scanner delay multiplier, defaults to '10.0'",
      type: "number",
      placeholder: "Enter Delay",
    },
    {
      name: "max_wait",
      required: false,
      label: "Max Wait",
      tooltip: "Maximum wait time between operations, defaults to '15s'",
      type: "duration",
      placeholder: "Enter Max Wait",
    },
    {
      name: "cycle",
      required: false,
      label: "Cycle",
      tooltip: "Time duration between scanner cycles, defaults to '1m'",
      type: "duration",
      placeholder: "Enter Cycle",
    },
  ],
  etcd: [
    {
      name: "endpoints",
      required: true,
      label: "Endpoints",
      tooltip:
        'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field',
      type: "csv",
      placeholder: "Enter Endpoint",
    },
    {
      name: "path_prefix",
      required: false,
      label: "Path Prefix",
      tooltip: 'Namespace prefix to isolate tenants e.g. "customer1/"',
      type: "string",
      placeholder: "Enter Path Prefix",
    },
    {
      name: "coredns_path",
      required: false,
      label: "Coredns Path",
      tooltip: 'Shared bucket DNS records, default is "/skydns"',
      type: "string",
      placeholder: "Enter Coredns Path",
    },
    {
      name: "client_cert",
      required: false,
      label: "Client Cert",
      tooltip: "Client cert for mTLS authentication",
      type: "string",
      placeholder: "Enter Client Cert",
    },
    {
      name: "client_cert_key",
      required: false,
      label: "Client Cert Key",
      tooltip: "Client cert key for mTLS authentication",
      type: "string",
      placeholder: "Enter Client Cert Key",
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "You can add a comment to this setting",
      type: "comment",
      multiline: true,
      placeholder: "Enter custom notes if any",
    },
  ],
  logger_webhook: [
    {
      name: "endpoint",
      required: true,
      label: "Endpoint",
      type: "string",
      placeholder: "Enter Endpoint",
    },
    {
      name: "auth_token",
      required: true,
      label: "Auth Token",
      type: "string",
      placeholder: "Enter Auth Token",
    },
  ],
  audit_webhook: [
    {
      name: "endpoint",
      required: true,
      label: "Endpoint",
      type: "string",
      placeholder: "Enter Endpoint",
    },
    {
      name: "auth_token",
      required: true,
      label: "Auth Token",
      type: "string",
      placeholder: "Enter Auth Token",
    },
  ],
  audit_kafka: [
    {
      name: "enable",
      required: false,
      label: "Enable",
      tooltip: "Enable audit_kafka target",
      type: "on|off",
      customValueProcess: (origValue: string) => {
        return origValue === "" || origValue === "on" ? "on" : "off";
      },
    },
    {
      name: "brokers",
      required: true,
      label: "Brokers",
      type: "csv",
      placeholder: "Enter Kafka Broker",
    },
    {
      name: "topic",
      required: false,
      label: "Topic",
      type: "string",
      placeholder: "Enter Kafka Topic",
      tooltip: "Kafka topic used for bucket notifications",
    },
    {
      name: "sasl",
      required: false,
      label: "Use SASL",
      tooltip:
        "Enable SASL (Simple Authentication and Security Layer) authentication",
      type: "on|off",
    },
    {
      name: "sasl_username",
      required: false,
      label: "SASL Username",
      type: "string",
      placeholder: "Enter SASL Username",
      tooltip: "Username for SASL/PLAIN or SASL/SCRAM authentication",
    },
    {
      name: "sasl_password",
      required: false,
      label: "SASL Password",
      type: "password",
      placeholder: "Enter SASL Password",
      tooltip: "Password for SASL/PLAIN or SASL/SCRAM authentication",
    },
    {
      name: "sasl_mechanism",
      required: false,
      label: "SASL Mechanism",
      type: "string",
      placeholder: "Enter SASL Mechanism",
      tooltip: "SASL authentication mechanism",
    },
    {
      name: "tls",
      required: false,
      label: "Use TLS",
      tooltip: "Enable TLS (Transport Layer Security)",
      type: "on|off",
    },
    {
      name: "tls_skip_verify",
      required: false,
      label: "Skip TLS Verification",
      tooltip: "Trust server TLS without verification",
      type: "on|off",
    },
    {
      name: "client_tls_cert",
      required: false,
      label: "Client Cert",
      tooltip: "Client cert for mTLS authentication",
      type: "string",
      placeholder: "Enter Client Cert",
    },
    {
      name: "client_tls_key",
      required: false,
      label: "Client Cert Key",
      tooltip: "Client cert key for mTLS authentication",
      type: "string",
      placeholder: "Enter Client Cert Key",
    },
    {
      name: "tls_client_auth",
      required: false,
      label: "TLS Client Auth",
      tooltip:
        "ClientAuth determines the Kafka server's policy for TLS client authorization",
      type: "string",
    },
    {
      name: "version",
      required: false,
      label: "Version",
      tooltip: "Specify the version of the Kafka cluster",
      type: "string",
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
  selectedSAs: string[],
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

export const overrideFields = (formFields: IElementValue[]): IOverrideEnv => {
  let overrideReturn: IOverrideEnv = {};

  formFields.forEach((envItem) => {
    // it has override values, we construct the value
    if (envItem.env_override) {
      const value: OverrideValue = {
        value: envItem.env_override.value || "",
        overrideEnv: envItem.env_override.name || "",
      };

      overrideReturn = { ...overrideReturn, [envItem.key]: value };
    }
  });

  return overrideReturn;
};

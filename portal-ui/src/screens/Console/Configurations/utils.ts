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
import { IConfigurationElement, IElementValue } from "./types";

export const notifyPostgres = "notify_postgres";
export const notifyMysql = "notify_mysql";
export const notifyKafka = "notify_kafka";
export const notifyAmqp = "notify_amqp";
export const notifyMqtt = "notify_mqtt";
export const notifyRedis = "notify_redis";
export const notifyNats = "notify_nats";
export const notifyElasticsearch = "notify_elasticsearch";
export const notifyWebhooks = "notify_webhooks";
export const notifyNsq = "notify_nsq";

export const configurationElements: IConfigurationElement[] = [
  { configuration_id: "region", configuration_label: "Region Configuration" },
  { configuration_id: "cache", configuration_label: "Cache Configuration" },
  {
    configuration_id: "compression",
    configuration_label: "Compression Configuration"
  },
  { configuration_id: "etcd", configuration_label: "Etcd Configuration" },
  {
    configuration_id: "identity_openid",
    configuration_label: "Identity Openid Configuration"
  },
  {
    configuration_id: "identity_ldap",
    configuration_label: "Identity LDAP Configuration"
  },
  {
    configuration_id: "policy_opa",
    configuration_label: "Policy OPA Configuration"
  },
  {
    configuration_id: "kms_vault",
    configuration_label: "KMS Vault Configuration"
  },
  { configuration_id: "kms_kes", configuration_label: "KMS KES Configuration" },
  {
    configuration_id: "logger_webhook",
    configuration_label: "Logger Webhook Configuration"
  },
  {
    configuration_id: "audit_webhook",
    configuration_label: "Audit Webhook Configuration"
  }
];

export const fieldsConfigurations: any = {
  region: [
    {
      name: "name",
      required: true,
      label: "name",
      tooltip: 'Name of the location of the server e.g. "us-west-rack2"',
      type: "string"
    },
    {
      name: "comment",
      required: false,
      label: "comment",
      tooltip: "You can add a comment to this setting",
      type: "string",
      multiline: true
    }
  ],
  cache: [
    {
      name: "drives",
      required: true,
      label: "Drives",
      tooltip:
        'Mountpoints e.g. "/optane1" or "/optane2", you can write one per field',
      type: "csv"
    },
    {
      name: "expiry",
      required: false,
      label: "Expiry",
      tooltip: 'Cache expiry duration in days e.g. "90"',
      type: "number"
    },
    {
      name: "quota",
      required: false,
      label: "Quota",
      tooltip: 'Limit cache drive usage in percentage e.g. "90"',
      type: "number"
    },
    {
      name: "exclude",
      required: false,
      label: "Exclude",
      tooltip:
        'Wildcard exclusion patterns e.g. "bucket/*.tmp" or "*.exe", you can write one per field',
      type: "csv"
    },
    {
      name: "after",
      required: false,
      label: "After",
      tooltip: "Minimum number of access before caching an object",
      type: "number"
    },
    {
      name: "watermark_low",
      required: false,
      label: "Watermark Low",
      tooltip: "Watermark Low",
      type: "number"
    },
    {
      name: "watermark_high",
      required: false,
      label: "Watermark High",
      tooltip: "Watermark High",
      type: "number"
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "You can add a comment to this setting",
      type: "string",
      multiline: true
    }
  ],
  compression: [
    {
      name: "extensions",
      required: false,
      label: "Extensions",
      tooltip:
        'Extensions to compress e.g. ".txt",".log" or ".csv", you can write one per field',
      type: "csv"
    },
    {
      name: "mime_types",
      required: false,
      label: "Mime Types",
      tooltip:
        'Mime types e.g. "text/*","application/json" or "application/xml", you can write one per field',
      type: "csv"
    }
  ],
  etcd: [
    {
      name: "endpoints",
      required: true,
      label: "Endpoints",
      tooltip:
        'List of etcd endpoints e.g. "http://localhost:2379", you can write one per field',
      type: "csv"
    },
    {
      name: "path_prefix",
      required: false,
      label: "Path Prefix",
      tooltip: 'namespace prefix to isolate tenants e.g. "customer1/"',
      type: "string"
    },
    {
      name: "coredns_path",
      required: false,
      label: "Coredns Path",
      tooltip: 'Shared bucket DNS records, default is "/skydns"',
      type: "string"
    },
    {
      name: "client_cert",
      required: false,
      label: "Client Cert",
      tooltip: "Client cert for mTLS authentication",
      type: "string"
    },
    {
      name: "client_cert_key",
      required: false,
      label: "Client Cert Key",
      tooltip: "Client cert key for mTLS authentication",
      type: "string"
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "You can add a comment to this setting",
      type: "string",
      multiline: true
    }
  ],
  identity_openid: [
    {
      name: "config_url",
      required: false,
      label: "Config URL",
      tooltip: "Config URL for Client ID configuration",
      type: "string"
    },
    {
      name: "client_id",
      required: false,
      label: "Client ID",
      type: "string"
    },
    {
      name: "claim_name",
      required: false,
      label: "Claim Name",
      tooltip: "Claim Name",
      type: "string"
    },
    {
      name: "claim_prefix",
      required: false,
      label: "Claim Prefix",
      tooltip: "Claim Prefix",
      type: "string"
    }
  ],
  identity_ldap: [
    {
      name: "server_addr",
      required: true,
      label: "Server ADDR",
      tooltip: 'AD/LDAP server address e.g. "myldapserver.com:636"',
      type: "string"
    },
    {
      name: "username_format",
      required: true,
      label: "Username Format",
      tooltip:
        'List of username bind DNs e.g. "uid=%s","cn=accounts","dc=myldapserver" or "dc=com", you can write one per field',
      type: "csv"
    },
    {
      name: "username_search_filter",
      required: true,
      label: "Username Search Filter",
      tooltip:
        'User search filter, for example "(cn=%s)" or "(sAMAccountName=%s)" or "(uid=%s)"',
      type: "string"
    },
    {
      name: "group_search_filter",
      required: true,
      label: "Group Search Filter",
      tooltip:
        'Search filter for groups e.g. "(&(objectclass=groupOfNames)(memberUid=%s))"',
      type: "string"
    },
    {
      name: "username_search_base_dn",
      required: false,
      label: "Username Search Base DN",
      tooltip: "List of username search DNs, you can write one per field",
      type: "csv"
    },
    {
      name: "group_name_attribute",
      required: false,
      label: "Group Name Attribute",
      tooltip: 'Search attribute for group name e.g. "cn"',
      type: "string"
    },
    {
      name: "sts_expiry",
      required: false,
      label: "STS Expiry",
      tooltip:
        'temporary credentials validity duration in s,m,h,d. Default is "1h"',
      type: "string"
    },
    {
      name: "tls_skip_verify",
      required: false,
      label: "TLS Skip Verify",
      tooltip:
        'Trust server TLS without verification, defaults to "off" (verify)',
      type: "on|off"
    },
    {
      name: "server_insecure",
      required: false,
      label: "Server Insecure",
      tooltip:
        'Allow plain text connection to AD/LDAP server, defaults to "off"',
      type: "on|off"
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "Optionally add a comment to this setting",
      type: "string",
      multiline: true
    }
  ],
  policy_opa: [
    {
      name: "url",
      required: true,
      label: "OPA URL",
      type: "string"
    },
    {
      name: "auth_token",
      required: true,
      label: "Auth Token",
      type: "string"
    },
    {
      name: "policy_opa",
      required: true,
      label: "Policy OPA",
      type: "string"
    }
  ],
  kms_vault: [],
  kms_kes: [],
  logger_webhook: [
    {
      name: "endpoint",
      required: true,
      label: "Endpoint",
      type: "string"
    },
    {
      name: "auth_token",
      required: true,
      label: "Auth Token",
      type: "string"
    }
  ],
  audit_webhook: [
    {
      name: "endpoint",
      required: true,
      label: "Endpoint",
      type: "string"
    },
    {
      name: "auth_token",
      required: true,
      label: "Auth Token",
      type: "string"
    }
  ]
};

const commonFields = [
  {
    name: "queue-dir",
    label: "Queue Dir",
    required: true,

    tooltip: "staging dir for undelivered messages e.g. '/home/events'",
    type: "string"
  },
  {
    name: "queue-limit",
    label: "Queue Limit",
    required: false,

    tooltip: "maximum limit for undelivered messages, defaults to '10000'",
    type: "number"
  },
  {
    name: "comment",
    label: "Comment",
    required: false,
    type: "string",
    multiline: true
  }
];

export const notificationEndpointsFields: any = {
  [notifyKafka]: [
    {
      name: "brokers",
      label: "Brokers",
      required: true,

      tooltip: "comma separated list of Kafka broker addresses",
      type: "string"
    },
    {
      name: "topic",
      label: "Topic",
      tooltip: "Kafka topic used for bucket notifications",
      type: "string"
    },
    {
      name: "sasl_username",
      label: "SASL Username",
      tooltip: "username for SASL/PLAIN or SASL/SCRAM authentication",
      type: "string"
    },
    {
      name: "sasl_password",
      label: "SASL Password",
      tooltip: "password for SASL/PLAIN or SASL/SCRAM authentication",
      type: "string"
    },
    {
      name: "sasl_mechanism",
      label: "SASL Mechanism",
      tooltip: "sasl authentication mechanism, default 'PLAIN'",
      type: "string"
    },
    {
      name: "tls_client_auth",
      label: "TLS Client Auth",
      tooltip:
        "clientAuth determines the Kafka server's policy for TLS client auth",
      type: "string"
    },
    {
      name: "sasl",
      label: "SASL",
      tooltip: "set to 'on' to enable SASL authentication",
      type: "on|off"
    },
    {
      name: "tls",
      label: "TLS",
      tooltip: "set to 'on' to enable TLS",
      type: "on|off"
    },
    {
      name: "tls_skip_verify",
      label: "TLS skip verify",
      tooltip:
        'trust server TLS without verification, defaults to "on" (verify)',
      type: "on|off"
    },
    {
      name: "client_tls_cert",
      label: "client TLS cert",
      tooltip: "path to client certificate for mTLS auth",
      type: "path"
    },
    {
      name: "client_tls_key",
      label: "client TLS key",
      tooltip: "path to client key for mTLS auth",
      type: "path"
    },
    {
      name: "version",
      label: "Version",
      tooltip: "specify the version of the Kafka cluster e.g '2.2.0'",
      type: "string"
    },
    ...commonFields
  ],
  [notifyAmqp]: [
    {
      name: "url",
      required: true,
      label: "url",
      tooltip:
        "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`",
      type: "url"
    },
    {
      name: "exchange",
      label: "exchange",
      tooltip: "name of the AMQP exchange",
      type: "string"
    },
    {
      name: "exchange_type",
      label: "exchange_type",
      tooltip: "AMQP exchange type",
      type: "string"
    },
    {
      name: "routing_key",
      label: "routing_key",
      tooltip: "routing key for publishing",
      type: "string"
    },
    {
      name: "mandatory",
      label: "mandatory",
      tooltip:
        "quietly ignore undelivered messages when set to 'off', default is 'on'",
      type: "on|off"
    },
    {
      name: "durable",
      label: "durable",
      tooltip:
        "persist queue across broker restarts when set to 'on', default is 'off'",
      type: "on|off"
    },
    {
      name: "no_wait",
      label: "no_wait",
      tooltip:
        "non-blocking message delivery when set to 'on', default is 'off'",
      type: "on|off"
    },
    {
      name: "internal",
      label: "internal",
      tooltip:
        "set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges",
      type: "on|off"
    },
    {
      name: "auto_deleted",
      label: "auto_deleted",
      tooltip:
        "auto delete queue when set to 'on', when there are no consumers",
      type: "on|off"
    },
    {
      name: "delivery_mode",
      label: "delivery_mode",
      tooltip: "set to '1' for non-persistent or '2' for persistent queue",
      type: "number"
    },
    ...commonFields
  ],
  [notifyRedis]: [
    {
      name: "address",
      required: true,
      label: "address",
      tooltip: "Redis server's address. For example: `localhost:6379`",
      type: "address"
    },
    {
      name: "key",
      required: true,
      label: "key",
      tooltip: "Redis key to store/update events, key is auto-created",
      type: "string"
    },
    {
      name: "password",
      label: "password",
      tooltip: "Redis server password",
      type: "string"
    },
    ...commonFields
  ],
  [notifyMqtt]: [
    {
      name: "broker",
      required: true,
      label: "broker",
      tooltip: "MQTT server endpoint e.g. `tcp://localhost:1883`",
      type: "uri"
    },
    {
      name: "topic",
      required: true,
      label: "topic",
      tooltip: "name of the MQTT topic to publish",
      type: "string"
    },
    {
      name: "username",
      label: "username",
      tooltip: "MQTT username",
      type: "string"
    },
    {
      name: "password",
      label: "password",
      tooltip: "MQTT password",
      type: "string"
    },
    {
      name: "qos",
      label: "qos",
      tooltip: "set the quality of service priority, defaults to '0'",
      type: "number"
    },
    {
      name: "keep_alive_interval",
      label: "keep_alive_interval",
      tooltip: "keep-alive interval for MQTT connections in s,m,h,d",
      type: "duration"
    },
    {
      name: "reconnect_interval",
      label: "reconnect_interval",
      tooltip: "reconnect interval for MQTT connections in s,m,h,d",
      type: "duration"
    },
    ...commonFields
  ],
  [notifyNats]: [
    {
      name: "address",
      required: true,
      label: "address",
      tooltip: "NATS server address e.g. '0.0.0.0:4222'",
      type: "address"
    },
    {
      name: "subject",
      required: true,
      label: "subject",
      tooltip: "NATS subscription subject",
      type: "string"
    },
    {
      name: "username",
      label: "username",
      tooltip: "NATS username",
      type: "string"
    },
    {
      name: "password",
      label: "password",
      tooltip: "NATS password",
      type: "string"
    },
    {
      name: "token",
      label: "token",
      tooltip: "NATS token",
      type: "string"
    },
    {
      name: "tls",
      label: "tls",
      tooltip: "set to 'on' to enable TLS",
      type: "on|off"
    },
    {
      name: "tls_skip_verify",
      label: "tls_skip_verify",
      tooltip:
        'trust server TLS without verification, defaults to "on" (verify)',
      type: "on|off"
    },
    {
      name: "ping_interval",
      label: "ping_interval",
      tooltip: "client ping commands interval in s,m,h,d. Disabled by default",
      type: "duration"
    },
    {
      name: "streaming",
      label: "streaming",
      tooltip: "set to 'on', to use streaming NATS server",
      type: "on|off"
    },
    {
      name: "streaming_async",
      label: "streaming_async",
      tooltip: "set to 'on', to enable asynchronous publish",
      type: "on|off"
    },
    {
      name: "streaming_max_pub_acks_in_flight",
      label: "streaming_max_pub_acks_in_flight",
      tooltip: "number of messages to publish without waiting for ACKs",
      type: "number"
    },
    {
      name: "streaming_cluster_id",
      label: "streaming_cluster_id",
      tooltip: "unique ID for NATS streaming cluster",
      type: "string"
    },
    {
      name: "cert_authority",
      label: "cert_authority",
      tooltip: "path to certificate chain of the target NATS server",
      type: "string"
    },
    {
      name: "client_cert",
      label: "client_cert",
      tooltip: "client cert for NATS mTLS auth",
      type: "string"
    },
    {
      name: "client_key",
      label: "client_key",
      tooltip: "client cert key for NATS mTLS auth",
      type: "string"
    },
    ...commonFields
  ],
  [notifyElasticsearch]: [
    {
      name: "url",
      required: true,
      label: "url",
      tooltip:
        "Elasticsearch server's address, with optional authentication info",
      type: "url"
    },
    {
      name: "index",
      required: true,
      label: "index",
      tooltip:
        "Elasticsearch index to store/update events, index is auto-created",
      type: "string"
    },
    {
      name: "format",
      required: true,
      label: "format",
      tooltip:
        "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",
      type: "enum"
    },
    ...commonFields
  ],
  [notifyWebhooks]: [
    {
      name: "endpoint",
      required: true,
      label: "endpoint",
      tooltip:
        "webhook server endpoint e.g. http://localhost:8080/minio/events",
      type: "url"
    },
    {
      name: "auth_token",
      label: "auth_token",
      tooltip: "opaque string or JWT authorization token",
      type: "string"
    },
    ...commonFields
  ],
  [notifyNsq]: [
    {
      name: "nsqd_address",
      required: true,
      label: "nsqd_address",
      tooltip: "NSQ server address e.g. '127.0.0.1:4150'",
      type: "address"
    },
    {
      name: "topic",
      required: true,
      label: "topic",
      tooltip: "NSQ topic",
      type: "string"
    },
    {
      name: "tls",
      label: "tls",
      tooltip: "set to 'on' to enable TLS",
      type: "on|off"
    },
    {
      name: "tls_skip_verify",
      label: "tls_skip_verify",
      tooltip:
        'trust server TLS without verification, defaults to "on" (verify)',
      type: "on|off"
    },
    ...commonFields
  ]
};

export const removeEmptyFields = (formFields: IElementValue[]) => {
  const nonEmptyFields = formFields.filter(field => field.value !== "");

  return nonEmptyFields;
};

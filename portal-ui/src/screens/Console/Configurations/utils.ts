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
  {
    configuration_id: "region",
    configuration_label: "Edit Region Configuration",
  },
  {
    configuration_id: "cache",
    configuration_label: "Edit Cache Configuration",
  },
  {
    configuration_id: "compression",
    configuration_label: "Edit Compression Configuration",
  },
  { configuration_id: "etcd", configuration_label: "Edit Etcd Configuration" },
  {
    configuration_id: "identity_openid",
    configuration_label: "Edit Identity Openid Configuration",
  },
  {
    configuration_id: "identity_ldap",
    configuration_label: "Edit Identity LDAP Configuration",
  },
  {
    configuration_id: "logger_webhook",
    configuration_label: "Edit Logger Webhook Configuration",
  },
  {
    configuration_id: "audit_webhook",
    configuration_label: "Edit Audit Webhook Configuration",
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
      placeholder: "Enter Comment",
    },
  ],
  cache: [
    {
      name: "drives",
      required: true,
      label: "Drives",
      tooltip:
        'Mountpoints e.g. "/optane1" or "/optane2", you can write one per field',
      type: "csv",
      placeholder: "Enter Mount Point",
    },
    {
      name: "expiry",
      required: false,
      label: "Expiry",
      tooltip: 'Cache expiry duration in days e.g. "90"',
      type: "number",
      placeholder: "Enter Number of Days",
    },
    {
      name: "quota",
      required: false,
      label: "Quota",
      tooltip: 'Limit cache drive usage in percentage e.g. "90"',
      type: "number",
      placeholder: "Enter in %",
    },
    {
      name: "exclude",
      required: false,
      label: "Exclude",
      tooltip:
        'Wildcard exclusion patterns e.g. "bucket/*.tmp" or "*.exe", you can write one per field',
      type: "csv",
      placeholder: "Enter Wildcard Exclusion Patterns",
    },
    {
      name: "after",
      required: false,
      label: "After",
      tooltip: "Minimum number of access before caching an object",
      type: "number",
      placeholder: "Enter Number of Attempts",
    },
    {
      name: "watermark_low",
      required: false,
      label: "Watermark Low",
      tooltip: "Watermark Low",
      type: "number",
      placeholder: "Enter Watermark Low",
    },
    {
      name: "watermark_high",
      required: false,
      label: "Watermark High",
      tooltip: "Watermark High",
      type: "number",
      placeholder: "Enter Watermark High",
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "You can add a comment to this setting",
      type: "comment",
      multiline: true,
      placeholder: "Enter Comment",
    },
  ],
  compression: [
    {
      name: "extensions",
      required: false,
      label: "Extensions",
      tooltip:
        'Extensions to compress e.g. ".txt",".log" or ".csv", you can write one per field',
      type: "csv",
      placeholder: "Enter an Extension",
      withBorder: true,
    },
    {
      name: "mime_types",
      required: false,
      label: "Mime Types",
      tooltip:
        'Mime types e.g. "text/*","application/json" or "application/xml", you can write one per field',
      type: "csv",
      placeholder: "Enter a Mime Type",
      withBorder: true,
    },
  ],
  etcd: [
    {
      name: "endpoints",
      required: true,
      label: "Endpoints",
      tooltip:
        'List of etcd endpoints e.g. "http://localhost:2379", you can write one per field',
      type: "csv",
      placeholder: "Enter Endpoint",
    },
    {
      name: "path_prefix",
      required: false,
      label: "Path Prefix",
      tooltip: 'namespace prefix to isolate tenants e.g. "customer1/"',
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
      placeholder: "Enter Comment",
    },
  ],
  identity_openid: [
    {
      name: "config_url",
      required: false,
      label: "Config URL",
      tooltip: "Config URL for Client ID configuration",
      type: "string",
      placeholder: "Enter Config URL",
    },
    {
      name: "client_id",
      required: false,
      label: "Client ID",
      type: "string",
      placeholder: "Enter Client ID",
    },
    {
      name: "claim_name",
      required: false,
      label: "Claim Name",
      tooltip: "Claim Name",
      type: "string",
      placeholder: "Enter Claim Name",
    },
    {
      name: "claim_prefix",
      required: false,
      label: "Claim Prefix",
      tooltip: "Claim Prefix",
      type: "string",
      placeholder: "Enter Claim Prefix",
    },
  ],
  identity_ldap: [
    {
      name: "server_addr",
      required: true,
      label: "Server Addr",
      tooltip: 'AD/LDAP server address e.g. "myldapserver.com:636"',
      type: "string",
      placeholder: "Enter Server Address",
    },
    {
      name: "username_format",
      required: true,
      label: "Username Format",
      tooltip:
        'List of username bind DNs e.g. "uid=%s","cn=accounts","dc=myldapserver" or "dc=com", you can write one per field',
      type: "csv",
      placeholder: "Enter Username Format",
    },
    {
      name: "username_search_filter",
      required: true,
      label: "Username Search Filter",
      tooltip:
        'User search filter, for example "(cn=%s)" or "(sAMAccountName=%s)" or "(uid=%s)"',
      type: "string",
      placeholder: "Enter Username Search Filter",
    },
    {
      name: "group_search_filter",
      required: true,
      label: "Group Search Filter",
      tooltip:
        'Search filter for groups e.g. "(&(objectclass=groupOfNames)(memberUid=%s))"',
      type: "string",
      placeholder: "Enter Group Search Filter",
    },
    {
      name: "username_search_base_dn",
      required: false,
      label: "Username Search Base DN",
      tooltip: "List of username search DNs, you can write one per field",
      type: "csv",
      placeholder: "Enter Username Search Base DN",
    },
    {
      name: "group_name_attribute",
      required: false,
      label: "Group Name Attribute",
      tooltip: 'Search attribute for group name e.g. "cn"',
      type: "string",
      placeholder: "Enter Group Name Attribute",
    },
    {
      name: "sts_expiry",
      required: false,
      label: "STS Expiry",
      tooltip:
        'temporary credentials validity duration in s,m,h,d. Default is "1h"',
      type: "string",
      placeholder: "Enter STS Expiry",
    },
    {
      name: "tls_skip_verify",
      required: false,
      label: "TLS Skip Verify",
      tooltip:
        'Trust server TLS without verification, defaults to "off" (verify)',
      type: "on|off",
    },
    {
      name: "server_insecure",
      required: false,
      label: "Server Insecure",
      tooltip:
        'Allow plain text connection to AD/LDAP server, defaults to "off"',
      type: "on|off",
    },
    {
      name: "comment",
      required: false,
      label: "Comment",
      tooltip: "Optionally add a comment to this setting",
      type: "comment",
      placeholder: "Enter Comment",
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
};

const commonFields = [
  {
    name: "queue-dir",
    label: "Queue Directory",
    required: true,

    tooltip: "staging dir for undelivered messages e.g. '/home/events'",
    type: "string",
    placeholder: "Enter Queue Directory",
  },
  {
    name: "queue-limit",
    label: "Queue Limit",
    required: false,

    tooltip: "maximum limit for undelivered messages, defaults to '10000'",
    type: "number",
    placeholder: "Enter Queue Limit",
  },
  {
    name: "comment",
    label: "Comment",
    required: false,
    type: "comment",
    placeholder: "Enter Comment",
  },
];

export const notificationEndpointsFields: any = {
  [notifyKafka]: [
    {
      name: "brokers",
      label: "Brokers",
      required: true,

      tooltip: "Comma separated list of Kafka broker addresses",
      type: "string",
      placeholder: "Enter Brokers",
    },
    {
      name: "topic",
      label: "Topic",
      tooltip: "Kafka topic used for bucket notifications",
      type: "string",
      placeholder: "Enter Topic",
    },
    {
      name: "sasl_username",
      label: "SASL Username",
      tooltip: "Username for SASL/PLAIN or SASL/SCRAM authentication",
      type: "string",
      placeholder: "Enter SASL Username",
    },
    {
      name: "sasl_password",
      label: "SASL Password",
      tooltip: "Password for SASL/PLAIN or SASL/SCRAM authentication",
      type: "string",
      placeholder: "Enter SASL Password",
    },
    {
      name: "sasl_mechanism",
      label: "SASL Mechanism",
      tooltip: "SASL authentication mechanism, default 'PLAIN'",
      type: "string",
    },
    {
      name: "tls_client_auth",
      label: "TLS Client Auth",
      tooltip:
        "Client Auth determines the Kafka server's policy for TLS client auth",
      type: "string",
      placeholder: "Enter TLS Client Auth",
    },
    {
      name: "sasl",
      label: "SASL",
      tooltip: "Set to 'on' to enable SASL authentication",
      type: "on|off",
    },
    {
      name: "tls",
      label: "TLS",
      tooltip: "Set to 'on' to enable TLS",
      type: "on|off",
    },
    {
      name: "tls_skip_verify",
      label: "TLS skip verify",
      tooltip:
        'Trust server TLS without verification, defaults to "on" (verify)',
      type: "on|off",
    },
    {
      name: "client_tls_cert",
      label: "client TLS cert",
      tooltip: "Path to client certificate for mTLS auth",
      type: "path",
      placeholder: "Enter TLS Client Cert",
    },
    {
      name: "client_tls_key",
      label: "client TLS key",
      tooltip: "Path to client key for mTLS auth",
      type: "path",
      placeholder: "Enter TLS Client Key",
    },
    {
      name: "version",
      label: "Version",
      tooltip: "Specify the version of the Kafka cluster e.g '2.2.0'",
      type: "string",
      placeholder: "Enter Kafka Version",
    },
    ...commonFields,
  ],
  [notifyAmqp]: [
    {
      name: "url",
      required: true,
      label: "URL",
      tooltip:
        "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`",
      type: "url",
    },
    {
      name: "exchange",
      label: "Exchange",
      tooltip: "Name of the AMQP exchange",
      type: "string",
      placeholder: "Enter Exchange",
    },
    {
      name: "exchange_type",
      label: "Exchange Type",
      tooltip: "AMQP exchange type",
      type: "string",
      placeholder: "Enter Exchange Type",
    },
    {
      name: "routing_key",
      label: "Routing Key",
      tooltip: "Routing key for publishing",
      type: "string",
      placeholder: "Enter Routing Key",
    },
    {
      name: "mandatory",
      label: "Mandatory",
      tooltip:
        "Quietly ignore undelivered messages when set to 'off', default is 'on'",
      type: "on|off",
    },
    {
      name: "durable",
      label: "Durable",
      tooltip:
        "Persist queue across broker restarts when set to 'on', default is 'off'",
      type: "on|off",
    },
    {
      name: "no_wait",
      label: "No Wait",
      tooltip:
        "Non-blocking message delivery when set to 'on', default is 'off'",
      type: "on|off",
    },
    {
      name: "internal",
      label: "Internal",
      tooltip:
        "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges",
      type: "on|off",
    },
    {
      name: "auto_deleted",
      label: "Auto Deleted",
      tooltip:
        "Auto delete queue when set to 'on', when there are no consumers",
      type: "on|off",
    },
    {
      name: "delivery_mode",
      label: "Delivery Mode",
      tooltip: "Set to '1' for non-persistent or '2' for persistent queue",
      type: "number",
      placeholder: "Enter Delivery Mode",
    },
    ...commonFields,
  ],
  [notifyRedis]: [
    {
      name: "address",
      required: true,
      label: "Address",
      tooltip: "Redis server's address. For example: `localhost:6379`",
      type: "address",
      placeholder: "Enter Address",
    },
    {
      name: "key",
      required: true,
      label: "Key",
      tooltip: "Redis key to store/update events, key is auto-created",
      type: "string",
      placeholder: "Enter Key",
    },
    {
      name: "password",
      label: "Password",
      tooltip: "Redis server password",
      type: "string",
      placeholder: "Enter Password",
    },
    ...commonFields,
  ],
  [notifyMqtt]: [
    {
      name: "broker",
      required: true,
      label: "Broker",
      tooltip: "MQTT server endpoint e.g. `tcp://localhost:1883`",
      type: "uri",
      placeholder: "Enter Brokers",
    },
    {
      name: "topic",
      required: true,
      label: "Topic",
      tooltip: "name of the MQTT topic to publish",
      type: "string",
      placeholder: "Enter Topic",
    },
    {
      name: "username",
      label: "Username",
      tooltip: "MQTT username",
      type: "string",
      placeholder: "Enter Username",
    },
    {
      name: "password",
      label: "Password",
      tooltip: "MQTT password",
      type: "string",
      placeholder: "Enter Password",
    },
    {
      name: "qos",
      label: "QOS",
      tooltip: "Set the quality of service priority, defaults to '0'",
      type: "number",
      placeholder: "Enter QOS",
    },
    {
      name: "keep_alive_interval",
      label: "Keep Alive Interval",
      tooltip: "Keep-alive interval for MQTT connections in s,m,h,d",
      type: "duration",
      placeholder: "Enter Keep Alive Internal",
    },
    {
      name: "reconnect_interval",
      label: "Reconnect Interval",
      tooltip: "Reconnect interval for MQTT connections in s,m,h,d",
      type: "duration",
      placeholder: "Enter Reconnect Interval",
    },
    ...commonFields,
  ],
  [notifyNats]: [
    {
      name: "address",
      required: true,
      label: "Address",
      tooltip: "NATS server address e.g. '0.0.0.0:4222'",
      type: "address",
      placeholder: "Enter Address",
    },
    {
      name: "subject",
      required: true,
      label: "Subject",
      tooltip: "NATS subscription subject",
      type: "string",
      placeholder: "Enter NATS Subject",
    },
    {
      name: "username",
      label: "Username",
      tooltip: "NATS username",
      type: "string",
      placeholder: "Enter NATS Username",
    },
    {
      name: "password",
      label: "Password",
      tooltip: "NATS password",
      type: "string",
      placeholder: "Enter NATS password",
    },
    {
      name: "token",
      label: "Token",
      tooltip: "NATS token",
      type: "string",
      placeholder: "Enter NATS token",
    },
    {
      name: "tls",
      label: "TLS",
      tooltip: "Set to 'on' to enable TLS",
      type: "on|off",
    },
    {
      name: "tls_skip_verify",
      label: "TLS Skip Verify",
      tooltip:
        'Trust server TLS without verification, defaults to "on" (verify)',
      type: "on|off",
    },
    {
      name: "ping_interval",
      label: "Ping Interval",
      tooltip: "Client ping commands interval in s,m,h,d. Disabled by default",
      type: "duration",
      placeholder: "Enter Ping Interval",
    },
    {
      name: "streaming",
      label: "Streaming",
      tooltip: "Set to 'on', to use streaming NATS server",
      type: "on|off",
    },
    {
      name: "streaming_async",
      label: "Streaming async",
      tooltip: "Set to 'on', to enable asynchronous publish",
      type: "on|off",
    },
    {
      name: "streaming_max_pub_acks_in_flight",
      label: "Streaming max publish ACKS in flight",
      tooltip: "Number of messages to publish without waiting for ACKs",
      type: "number",
      placeholder: "Enter Streaming in flight value",
    },
    {
      name: "streaming_cluster_id",
      label: "Streaming Cluster ID",
      tooltip: "Unique ID for NATS streaming cluster",
      type: "string",
      placeholder: "Enter Streaming Cluster ID",
    },
    {
      name: "cert_authority",
      label: "Cert Authority",
      tooltip: "Path to certificate chain of the target NATS server",
      type: "string",
      placeholder: "Enter Cert Authority",
    },
    {
      name: "client_cert",
      label: "Client Cert",
      tooltip: "Client cert for NATS mTLS auth",
      type: "string",
      placeholder: "Enter Client Cert",
    },
    {
      name: "client_key",
      label: "Client Key",
      tooltip: "Client cert key for NATS mTLS auth",
      type: "string",
      placeholder: "Enter Client Key",
    },
    ...commonFields,
  ],
  [notifyElasticsearch]: [
    {
      name: "url",
      required: true,
      label: "URL",
      tooltip:
        "Elasticsearch server's address, with optional authentication info",
      type: "url",
      placeholder: "Enter URL",
    },
    {
      name: "index",
      required: true,
      label: "Index",
      tooltip:
        "Elasticsearch index to store/update events, index is auto-created",
      type: "string",
      placeholder: "Enter Index",
    },
    {
      name: "format",
      required: true,
      label: "Format",
      tooltip:
        "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",
      type: "enum",
      placeholder: "Enter Format",
    },
    ...commonFields,
  ],
  [notifyWebhooks]: [
    {
      name: "endpoint",
      required: true,
      label: "Endpoint",
      tooltip:
        "webhook server endpoint e.g. http://localhost:8080/minio/events",
      type: "url",
      placeholder: "Enter Endpoint",
    },
    {
      name: "auth_token",
      label: "Auth Token",
      tooltip: "opaque string or JWT authorization token",
      type: "string",
      placeholder: "Enter auth_token",
    },
    ...commonFields,
  ],
  [notifyNsq]: [
    {
      name: "nsqd_address",
      required: true,
      label: "NSQD Address",
      tooltip: "NSQ server address e.g. '127.0.0.1:4150'",
      type: "address",
      placeholder: "Enter nsqd_address",
    },
    {
      name: "topic",
      required: true,
      label: "Topic",
      tooltip: "NSQ topic",
      type: "string",
      placeholder: "Enter Topic",
    },
    {
      name: "tls",
      label: "TLS",
      tooltip: "set to 'on' to enable TLS",
      type: "on|off",
    },
    {
      name: "tls_skip_verify",
      label: "TLS Skip Verify",
      tooltip:
        'trust server TLS without verification, defaults to "on" (verify)',
      type: "on|off",
    },
    ...commonFields,
  ],
};

export const removeEmptyFields = (formFields: IElementValue[]) => {
  const nonEmptyFields = formFields.filter((field) => field.value !== "");

  return nonEmptyFields;
};

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

import { NotificationEndpointItem } from "./types";

import { IElementValue } from "../Configurations/types";

export const notifyPostgres = "notify_postgres";
export const notifyMysql = "notify_mysql";
export const notifyKafka = "notify_kafka";
export const notifyAmqp = "notify_amqp";
export const notifyMqtt = "notify_mqtt";
export const notifyRedis = "notify_redis";
export const notifyNats = "notify_nats";
export const notifyElasticsearch = "notify_elasticsearch";
export const notifyWebhooks = "notify_webhook";
export const notifyNsq = "notify_nsq";

export const notificationTransform = (
  notificationElements: NotificationEndpointItem[]
) => {
  return notificationElements.map((element) => {
    return {
      service_name: `${element.service}:${element.account_id}`,
      status: element.status,
    };
  });
};

export const servicesList = [
  {
    actionTrigger: notifyPostgres,
    targetTitle: "Postgres SQL",
    logo: "/postgres-logo.svg",
  },
  {
    actionTrigger: notifyKafka,
    targetTitle: "Kafka",
    logo: "/kafka-logo.svg",
  },
  {
    actionTrigger: notifyAmqp,
    targetTitle: "AMQP",
    logo: "/amqp-logo.svg",
  },
  {
    actionTrigger: notifyMqtt,
    targetTitle: "MQTT",
    logo: "/mqtt-logo.svg",
  },
  {
    actionTrigger: notifyRedis,
    targetTitle: "Redis",
    logo: "/redis-logo.svg",
  },
  {
    actionTrigger: notifyNats,
    targetTitle: "NATS",
    logo: "/nats-logo.svg",
  },
  {
    actionTrigger: notifyMysql,
    targetTitle: "Mysql",
    logo: "/mysql-logo.svg",
  },
  {
    actionTrigger: notifyElasticsearch,
    targetTitle: "Elastic Search",
    logo: "/elasticsearch-logo.svg",
  },
  {
    actionTrigger: notifyWebhooks,
    targetTitle: "Webhook",
    logo: "/webhooks-logo.svg",
  },
  {
    actionTrigger: notifyNsq,
    targetTitle: "NSQ",
    logo: "/nsq-logo.svg",
  },
];

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

export const removeEmptyFields = (formFields: IElementValue[]) => {
  const nonEmptyFields = formFields.filter((field) => field.value !== "");

  return nonEmptyFields;
};

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

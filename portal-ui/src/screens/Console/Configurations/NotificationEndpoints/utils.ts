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
import {
  notifyAmqp,
  notifyElasticsearch,
  notifyKafka,
  notifyMqtt,
  notifyMysql,
  notifyNats,
  notifyNsq,
  notifyPostgres,
  notifyRedis,
  notifyWebhooks,
} from "../utils";

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
    logo: "/postgres.png",
  },
  {
    actionTrigger: notifyKafka,
    targetTitle: "Kafka",
    logo: "/kafka.png",
  },
  {
    actionTrigger: notifyAmqp,
    targetTitle: "AMQP",
    logo: "/amqp.png",
  },
  {
    actionTrigger: notifyMqtt,
    targetTitle: "MQTT",
    logo: "/mqtt.png",
  },
  {
    actionTrigger: notifyRedis,
    targetTitle: "Redis",
    logo: "/redis.png",
  },
  {
    actionTrigger: notifyNats,
    targetTitle: "NATS",
    logo: "/nats.png",
  },
  {
    actionTrigger: notifyMysql,
    targetTitle: "Mysql",
    logo: "/mysql.png",
  },
  {
    actionTrigger: notifyElasticsearch,
    targetTitle: "Elastic Search",
    logo: "/elasticsearch.png",
  },
  {
    actionTrigger: notifyWebhooks,
    targetTitle: "Webhook",
    logo: "",
  },
  {
    actionTrigger: notifyNsq,
    targetTitle: "NSQ",
    logo: "",
  },
];

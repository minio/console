// This file is part of MinIO Console Server
// Copyright (c) 2019 MinIO, Inc.
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

import React, { useCallback, useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import ConfPostgres from "../Configurations/ConfPostgres";
import api from "../../../common/api";
import { serverNeedsRestart } from "../../../actions";
import { connect } from "react-redux";
import ConfMySql from "../Configurations/ConfMySql";
import ConfTargetGeneric from "../Configurations/ConfTargetGeneric";
import { KVField } from "../Configurations/types";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    },
    strongText: {
      fontWeight: 700
    },
    keyName: {
      marginLeft: 5
    },
    buttonContainer: {
      textAlign: "right"
    },
    logoButton: {
      height: "80px"
    }
  });

const notifyPostgres = "notify_postgres";
const notifyMysql = "notify_mysql";
const notifyKafka = "notify_kafka";
const notifyAmqp = "notify_amqp";
const notifyMqtt = "notify_mqtt";
const notifyRedis = "notify_redis";
const notifyNats = "notify_nats";
const notifyElasticsearch = "notify_elasticsearch";
const notifyWebhooks = "notify_webhooks";
const notifyNsq = "notify_nsq";

interface IAddNotificationEndpointProps {
  open: boolean;
  closeModalAndRefresh: any;
  serverNeedsRestart: typeof serverNeedsRestart;
  classes: any;
}

const AddNotificationEndpoint = ({
  open,
  closeModalAndRefresh,
  serverNeedsRestart,
  classes
}: IAddNotificationEndpointProps) => {
  //Local States
  const [service, setService] = useState<string>("");
  const [valuesObj, setValueObj] = useState<Map<string, string>>(new Map());
  const [saving, setSaving] = useState<boolean>(false);
  const [addError, setError] = useState<string>("");

  //Effects

  useEffect(() => {
    if (saving) {
      let keyValues: Array<object> = new Array<object>();
      valuesObj.forEach((value: string, key: string) => {
        keyValues.push({ key: key, value: value });
      });

      let payload = {
        key_values: keyValues
      };
      api
        .invoke("PUT", `/api/v1/configs/${service}`, payload)
        .then(res => {
          setSaving(false);
          setError("");
          serverNeedsRestart(true);

          closeModalAndRefresh();
        })
        .catch(err => {
          setSaving(false);
          setError(err);
        });
    }
  }, [saving, serverNeedsRestart, service, valuesObj, closeModalAndRefresh]);

  //Fetch Actions
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
  };

  const onValueChange = useCallback(
    newValue => {
      setValueObj(newValue);
    },
    [setValueObj]
  );

  let srvComponent = <React.Fragment />;
  switch (service) {
    case notifyPostgres: {
      srvComponent = <ConfPostgres onChange={onValueChange} />;
      break;
    }
    case notifyMysql: {
      srvComponent = <ConfMySql onChange={onValueChange} />;
      break;
    }
    case notifyKafka: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
    case notifyAmqp: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }

    case notifyRedis: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
    case notifyMqtt: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
    case notifyNats: {
      const fields: KVField[] = [
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
          tooltip:
            "client ping commands interval in s,m,h,d. Disabled by default",
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
    case notifyElasticsearch: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
    case notifyWebhooks: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
    case notifyNsq: {
      const fields: KVField[] = [
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
        }
      ];

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
      break;
    }
  }

  let targetTitle = "";
  switch (service) {
    case notifyNsq:
      targetTitle = "NSQ";
      break;
    case notifyWebhooks:
      targetTitle = "Webhooks";
      break;
    case notifyElasticsearch:
      targetTitle = "Elastic Search";
      break;
    case notifyNats:
      targetTitle = "NATS";
      break;
    case notifyMqtt:
      targetTitle = "MQTT";
      break;
    case notifyRedis:
      targetTitle = "Redis";
      break;
    case notifyKafka:
      targetTitle = "Kafka";
      break;
    case notifyPostgres:
      targetTitle = "Postgres";
      break;
    case notifyMysql:
      targetTitle = "Mysql";
      break;
    case notifyAmqp:
      targetTitle = "AMQP";
      break;
  }

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={closeModalAndRefresh}
      title={`Add Lambda Notification Target ${targetTitle}`}
    >
      {service === "" && (
        <Grid container>
          <Grid item xs={12}>
            <p>Pick a supported service:</p>
            <table className={classes.chooseTable} style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyPostgres);
                      }}
                    >
                      <img
                        src="/postgres.png"
                        className={classes.logoButton}
                        alt="postgres"
                      />
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyKafka);
                      }}
                    >
                      <img
                        src="/kafka.png"
                        className={classes.logoButton}
                        alt="kafka"
                      />
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyAmqp);
                      }}
                    >
                      <img
                        src="/amqp.png"
                        className={classes.logoButton}
                        alt="amqp"
                      />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyMqtt);
                      }}
                    >
                      <img
                        src="/mqtt.png"
                        className={classes.logoButton}
                        alt="mqtt"
                      />
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyRedis);
                      }}
                    >
                      <img
                        src="/redis.png"
                        className={classes.logoButton}
                        alt="redis"
                      />
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyNats);
                      }}
                    >
                      <img
                        src="/nats.png"
                        className={classes.logoButton}
                        alt="nats"
                      />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyMysql);
                      }}
                    >
                      <img
                        src="/mysql.png"
                        className={classes.logoButton}
                        alt="mysql"
                      />
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyElasticsearch);
                      }}
                    >
                      <img
                        src="/elasticsearch.png"
                        className={classes.logoButton}
                        alt="elasticsearch"
                      />
                    </Button>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyWebhooks);
                      }}
                    >
                      Webhook
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setService(notifyNsq);
                      }}
                    >
                      NSQ
                    </Button>
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>

          {saving && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      )}
      {service !== "" && (
        <React.Fragment>
          {addError !== "" && (
            <Grid item xs={12}>
              <Typography
                component="p"
                variant="body1"
                className={classes.errorBlock}
              >
                {addError}
              </Typography>
            </Grid>
          )}
          <form noValidate onSubmit={submitForm}>
            {srvComponent}

            <Grid item xs={3} className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={saving}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={9} />
          </form>
        </React.Fragment>
      )}
    </ModalWrapper>
  );
};

const connector = connect(null, { serverNeedsRestart });

export default connector(withStyles(styles)(AddNotificationEndpoint));

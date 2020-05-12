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
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import ConfPostgres from "../Configurations/CustomForms/ConfPostgres";
import api from "../../../common/api";
import { serverNeedsRestart } from "../../../actions";
import { connect } from "react-redux";
import ConfMySql from "../Configurations/CustomForms/ConfMySql";
import ConfTargetGeneric from "../Configurations/ConfTargetGeneric";
import {
  notificationEndpointsFields,
  notifyPostgres,
  notifyMysql,
  notifyKafka,
  notifyAmqp,
  notifyMqtt,
  notifyRedis,
  notifyNats,
  notifyElasticsearch,
  notifyWebhooks,
  notifyNsq,
  removeEmptyFields
} from "../Configurations/utils";
import { IElementValue } from "../Configurations/types";

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
  const [valuesArr, setValueArr] = useState<IElementValue[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [addError, setError] = useState<string>("");

  //Effects

  useEffect(() => {
    if (saving) {
      const payload = {
        key_values: removeEmptyFields(valuesArr)
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
  }, [saving, serverNeedsRestart, service, valuesArr, closeModalAndRefresh]);

  //Fetch Actions
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
  };

  const onValueChange = useCallback(
    newValue => {
      setValueArr(newValue);
    },
    [setValueArr]
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
    default: {
      const fields = get(notificationEndpointsFields, service, []);

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
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
            <Grid item xs={12}>
              {srvComponent}
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
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

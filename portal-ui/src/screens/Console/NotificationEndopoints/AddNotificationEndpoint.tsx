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
  removeEmptyFields,
} from "../Configurations/utils";
import { IElementValue } from "../Configurations/types";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    logoButton: {
      height: "80px",
    },
    lambdaNotif: {
      backgroundColor: "#fff",
      border: "#393939 1px solid",
      borderRadius: 5,
      width: 101,
      height: 91,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      cursor: "pointer",
      "& img": {
        maxWidth: 71,
        maxHeight: 71,
      },
    },
    iconContainer: {
      display: "flex",
      flexDirection: "row",
      width: 455,
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    nonIconContainer: {
      marginBottom: 16,
      "& button": {
        marginRight: 16,
      },
    },
    pickTitle: {
      fontWeight: 600,
      color: "#393939",
      fontSize: 14,
      marginBottom: 16,
    },
    lambdaFormIndicator: {
      display: "flex",
      marginBottom: 40,
    },
    lambdaName: {
      fontSize: 18,
      fontWeight: 700,
      color: "#000",
      marginBottom: 6,
    },
    lambdaSubname: {
      fontSize: 12,
      color: "#000",
      fontWeight: 600,
    },
    lambdaIcon: {
      borderRadius: 5,
      border: "#393939 1px solid",
      width: 53,
      height: 48,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      "& img": {
        width: 38,
      },
    },
    ...modalBasic,
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
  classes,
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
        key_values: removeEmptyFields(valuesArr),
      };
      api
        .invoke("PUT", `/api/v1/configs/${service}`, payload)
        .then((res) => {
          setSaving(false);
          setError("");
          serverNeedsRestart(true);

          closeModalAndRefresh();
        })
        .catch((err) => {
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
    (newValue) => {
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

  const servicesList = [
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

  const nonLogos = servicesList.filter((elService) => elService.logo === "");
  const withLogos = servicesList.filter((elService) => elService.logo !== "");

  const targetElement = servicesList.find(
    (element) => element.actionTrigger === service
  );

  const goBack = () => {
    setService("");
  };

  return (
    <ModalWrapper modalOpen={open} onClose={closeModalAndRefresh} title={""}>
      {service === "" && (
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.pickTitle}>Pick a supported service:</div>
            <div className={classes.nonIconContainer}>
              {nonLogos.map((item) => {
                return (
                  <Button
                    variant="contained"
                    color="primary"
                    key={`non-icon-${item.targetTitle}`}
                    onClick={() => {
                      setService(item.actionTrigger);
                    }}
                  >
                    {item.targetTitle.toUpperCase()}
                  </Button>
                );
              })}
            </div>
            <div className={classes.iconContainer}>
              {withLogos.map((item) => {
                return (
                  <button
                    key={`icon-${item.targetTitle}`}
                    className={classes.lambdaNotif}
                    onClick={() => {
                      setService(item.actionTrigger);
                    }}
                  >
                    <img
                      src={item.logo}
                      className={classes.logoButton}
                      alt={item.targetTitle}
                    />
                  </button>
                );
              })}
            </div>
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
            <Grid item xs={12} className={classes.lambdaFormIndicator}>
              {targetElement && targetElement.logo !== "" && (
                <div className={classes.lambdaIcon}>
                  <img
                    src={targetElement.logo}
                    alt={targetElement.targetTitle}
                  />
                </div>
              )}

              <div className={classes.lambdaTitle}>
                <div className={classes.lambdaName}>
                  {targetElement ? targetElement.targetTitle : ""}
                </div>
                <div className={classes.lambdaSubname}>
                  Add Lambda Notification Target
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              {srvComponent}
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <button
                type="button"
                color="primary"
                className={classes.clearButton}
                onClick={goBack}
              >
                Back
              </button>
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

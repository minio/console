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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button } from "@mui/material";

import api from "../../../common/api";
import { serverNeedsRestart, setErrorSnackMessage } from "../../../actions";
import {
  notificationEndpointsFields,
  notifyMysql,
  notifyPostgres,
  removeEmptyFields,
} from "./utils";
import {
  modalBasic,
  settingsCommon,
} from "../Common/FormComponents/common/styleLibrary";
import { servicesList } from "./utils";
import { ErrorResponseHandler } from "../../../common/types";

import { IElementValue } from "../Configurations/types";
import PageHeader from "../Common/PageHeader/PageHeader";
import history from "../../../history";

import withSuspense from "../Common/Components/withSuspense";
import BackLink from "../../../common/BackLink";
import PageLayout from "../Common/Layout/PageLayout";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

const ConfMySql = withSuspense(
  React.lazy(() => import("./CustomForms/ConfMySql"))
);

const ConfTargetGeneric = withSuspense(
  React.lazy(() => import("./ConfTargetGeneric"))
);

const ConfPostgres = withSuspense(
  React.lazy(() => import("./CustomForms/ConfPostgres"))
);

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    ...settingsCommon,
    lambdaNotif: {
      background:
        "linear-gradient(90deg, rgba(249,249,250,1) 0%, rgba(250,250,251,1) 68%, rgba(254,254,254,1) 100%)",
      border: "#E5E5E5 1px solid",
      borderRadius: 5,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
      marginBottom: 16,
      cursor: "pointer",
      padding: 0,
      overflow: "hidden",
    },
    lambdaNotifIcon: {
      backgroundColor: "#FEFEFE",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 80,

      "& img": {
        maxWidth: 46,
        maxHeight: 46,
      },
    },
    lambdaNotifTitle: {
      color: "#07193E",
      fontSize: 16,
      fontFamily: "Lato,sans-serif",
      paddingLeft: 18,
    },
    formBox: {
      border: "1px solid #EAEAEA",
      padding: 15,
    },
  });

interface IAddNotificationEndpointProps {
  match: any;
  saveAndRefresh: any;
  serverNeedsRestart: typeof serverNeedsRestart;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
}

const AddNotificationEndpoint = ({
  match,
  saveAndRefresh,
  serverNeedsRestart,
  classes,
  setErrorSnackMessage,
}: IAddNotificationEndpointProps) => {
  //Local States
  const [valuesArr, setValueArr] = useState<IElementValue[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const service = match.params["service"];
  //Effects

  useEffect(() => {
    if (saving) {
      const payload = {
        key_values: removeEmptyFields(valuesArr),
      };
      api
        .invoke("PUT", `/api/v1/configs/${service}`, payload)
        .then(() => {
          setSaving(false);
          serverNeedsRestart(true);
          history.push(IAM_PAGES.NOTIFICATIONS_ENDPOINTS);
        })
        .catch((err: ErrorResponseHandler) => {
          setSaving(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    saving,
    serverNeedsRestart,
    service,
    valuesArr,
    saveAndRefresh,
    setErrorSnackMessage,
  ]);

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

  let srvComponent;
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

  const targetElement = servicesList.find(
    (element) => element.actionTrigger === service
  );

  return (
    <Fragment>
      <PageHeader label="Notifications" />
      <BackLink
        to="/notification-endpoints/add"
        label={" Back To Supported Services"}
      />

      <PageLayout>
        <form noValidate onSubmit={submitForm}>
          {service !== "" && (
            <Fragment>
              <Grid item xs={12}>
                {targetElement && (
                  <div
                    key={`icon-${targetElement.targetTitle}`}
                    className={classes.lambdaNotif}
                  >
                    <div className={classes.lambdaNotifIcon}>
                      <img
                        src={targetElement.logo}
                        className={classes.logoButton}
                        alt={targetElement.targetTitle}
                      />
                    </div>

                    <div className={classes.lambdaNotifTitle}>
                      <b>
                        {targetElement ? targetElement.targetTitle : ""}
                        Notification Endpoint
                      </b>
                    </div>
                  </div>
                )}
              </Grid>
              <div className={classes.formBox}>
                <Grid item xs={12} className={classes.configForm}>
                  {srvComponent}
                </Grid>
                <Grid item xs={12} className={classes.settingsButtonContainer}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                  >
                    Save Notification Target
                  </Button>
                </Grid>
              </div>
            </Fragment>
          )}
        </form>
      </PageLayout>
    </Fragment>
  );
};

const mapDispatchToProps = {
  serverNeedsRestart,
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(withStyles(styles)(AddNotificationEndpoint));

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
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import ConfPostgres from "../CustomForms/ConfPostgres";
import api from "../../../../common/api";
import { serverNeedsRestart, setErrorSnackMessage } from "../../../../actions";
import {
  notificationEndpointsFields,
  notifyMysql,
  notifyPostgres,
  removeEmptyFields,
} from "../utils";
import { IElementValue } from "../types";
import {
  modalBasic,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { servicesList } from "./utils";
import ConfMySql from "../CustomForms/ConfMySql";
import ConfTargetGeneric from "../ConfTargetGeneric";

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    ...settingsCommon,
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    lambdaFormIndicator: {
      display: "flex",
      marginBottom: 40,
    },
    customTitle: {
      ...settingsCommon.customTitle,
      marginTop: 0,
    },
    settingsFormContainer: {
      ...settingsCommon.settingsFormContainer,
      height: "calc(100vh - 422px)",
    },
  });

interface IAddNotificationEndpointProps {
  service: string;
  saveAndRefresh: any;
  serverNeedsRestart: typeof serverNeedsRestart;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
}

const AddNotificationEndpoint = ({
  service,
  saveAndRefresh,
  serverNeedsRestart,
  classes,
  setErrorSnackMessage,
}: IAddNotificationEndpointProps) => {
  //Local States
  const [valuesArr, setValueArr] = useState<IElementValue[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

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
          saveAndRefresh();
        })
        .catch((err) => {
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
      {service !== "" && (
        <Fragment>
          <form noValidate onSubmit={submitForm}>
            <Grid item xs={12} className={classes.customTitle}>
              {targetElement ? targetElement.targetTitle : ""} - Add Lambda
              Notification Target
            </Grid>
            <Grid item xs={12} className={classes.settingsFormContainer}>
              {srvComponent}
            </Grid>
            <Grid item xs={12} className={classes.settingsButtonContainer}>
              <Grid
                item
                xs={12}
                className={classes.innerSettingsButtonContainer}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={9} />
          </form>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapDispatchToProps = {
  serverNeedsRestart,
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(withStyles(styles)(AddNotificationEndpoint));

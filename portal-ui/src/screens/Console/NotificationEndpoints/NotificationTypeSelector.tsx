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

import React, { Fragment, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { servicesList } from "./utils";
import {
  settingsCommon,
  typesSelection,
} from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";
import history from "../../../history";

interface INotificationTypeSelector {
  classes: any;
}

const withLogos = servicesList.filter((elService) => elService.logo !== "");

const styles = (theme: Theme) =>
  createStyles({
    ...settingsCommon,
    mainCont: {
      paddingLeft: 50,
      paddingRight: 50,
    },
    mainTitle: {
      fontSize: 18,
      color: "#000",
      fontWeight: 600,
      marginBottom: 10,
      marginTop: 10,
    },
    ...typesSelection,
  });

const NotificationTypeSelector = ({ classes }: INotificationTypeSelector) => {
  return (
    <Fragment>
      <PageHeader label="Notification Endpoints" />
      <Grid container className={classes.mainCont}>
        <Grid item xs={12} className={classes.mainTitle}>
          Pick a supported service
        </Grid>
        <Grid item xs={12} className={classes.centerElements}>
          <div className={classes.iconContainer}>
            {withLogos.map((item) => {
              return (
                <button
                  key={`icon-${item.targetTitle}`}
                  className={classes.lambdaNotif}
                  onClick={() => {
                    history.push(
                      `/notification-endpoints/add/${item.actionTrigger}`
                    );
                  }}
                >
                  <div className={classes.lambdaNotifIcon}>
                    <img
                      src={item.logo}
                      className={classes.logoButton}
                      alt={item.targetTitle}
                    />
                  </div>

                  <div className={classes.lambdaNotifTitle}>
                    <b>{item.targetTitle}</b>
                  </div>
                </button>
              );
            })}
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(NotificationTypeSelector);

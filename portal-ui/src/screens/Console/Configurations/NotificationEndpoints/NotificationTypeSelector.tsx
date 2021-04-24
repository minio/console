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

import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { servicesList } from "./utils";
import {
  settingsCommon,
  typesSelection,
} from "../../Common/FormComponents/common/styleLibrary";

interface INotificationTypeSelector {
  classes: any;
  setService: (trigger: string) => any;
}

const nonLogos = servicesList.filter((elService) => elService.logo === "");
const withLogos = servicesList.filter((elService) => elService.logo !== "");

const styles = (theme: Theme) =>
  createStyles({
    ...settingsCommon,
    customTitle: {
      ...settingsCommon.customTitle,
      marginTop: 0,
    },
    ...typesSelection,
  });

const NotificationTypeSelector = ({
  classes,
  setService,
}: INotificationTypeSelector) => {
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.customTitle}>
            Pick a supported service
          </Grid>
          <Grid item xs={12} className={classes.centerElements}>
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
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(NotificationTypeSelector);

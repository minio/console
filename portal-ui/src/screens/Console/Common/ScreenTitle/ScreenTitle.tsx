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

import React from "react";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";

import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

interface IScreenTitle {
  classes: any;
  icon?: any;
  title?: any;
  subTitle?: any;
  actions?: any;
  className?: any;
}

const styles = (theme: Theme) =>
  createStyles({
    headerBarIcon: {
      marginRight: ".7rem",
      color: theme.palette.primary.main,
      "& .min-icon": {
        width: 44,
        height: 44,
      },
    },
    headerBarSubheader: {
      color: "grey",
    },
    screenTitle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem",
      borderBottom: "1px solid #EAEAEA",
    },
    titleColumn: {
      height: "auto",
      justifyContent: "center",
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-start",
      "& h1": {
        fontSize: "1.4rem",
      },
    },
    leftItems: {
      display: "flex",
      alignItems: "center",
    },
    rightItems: {
      display: "flex",
      alignItems: "center",
    },
  });

const ScreenTitle = ({
  classes,
  icon,
  title,
  subTitle,
  actions,
  className,
}: IScreenTitle) => {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        className={`${classes.screenTitle} ${className ? className : ""}`}
      >
        <div className={classes.leftItems}>
          {icon ? <div className={classes.headerBarIcon}>{icon}</div> : null}
          <div className={classes.titleColumn}>
            <h1 style={{ margin: 0 }}>{title}</h1>
            <span className={classes.headerBarSubheader}>{subTitle}</span>
          </div>
        </div>

        <div className={classes.rightItems}>{actions}</div>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ScreenTitle);

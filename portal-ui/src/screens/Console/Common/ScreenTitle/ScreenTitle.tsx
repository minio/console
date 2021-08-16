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
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

interface IScreenTitle {
  classes: any;
  icon?: any;
  title?: any;
  subTitle?: any;
  actions?: any;
}

const styles = (theme: Theme) =>
  createStyles({
    headerBarIcon: {
      float: "left",
      paddingTop: 10,
      marginRight: 12,
      color: theme.palette.primary.main,
    },
    headerBarSubheader: {
      color: "grey",
    },
  });

const ScreenTitle = ({
  classes,
  icon,
  title,
  subTitle,
  actions,
}: IScreenTitle) => {
  return (
    <Grid container>
      <Grid item xs={12} style={{ paddingTop: 8 }}>
        <div className={classes.headerBarIcon}>{icon}</div>
        <div style={{ float: "left" }}>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <span className={classes.headerBarSubheader}>{subTitle}</span>
        </div>
        <div style={{ float: "right", paddingTop: 12 }}>{actions}</div>
      </Grid>
      <Grid item xs={12}>
        <hr style={{ border: 0, borderTop: "1px solid #EAEAEA" }} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ScreenTitle);

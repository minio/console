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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid rgb(234, 237, 238)",
      borderRadius: 5,
      paddingTop: 10,
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 40,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: "#fbfafa",
    },
    leftItems: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      "& .min-icon": {
        width: "2.5rem",
        marginRight: ".8rem",
      },
    },
    iconSize: {
      fontSize: 64,
    },
    helpText: {
      fontSize: 16,
    },
  });

interface IHelpBox {
  classes: any;
  iconComponent: any;
  title: string;
  help: any;
}

const HelpBox = ({ classes, iconComponent, title, help }: IHelpBox) => {
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} className={classes.leftItems}>
          {iconComponent}
          {title}
        </Grid>
        <Grid item xs={12} className={classes.helpText}>
          {help}
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(HelpBox);

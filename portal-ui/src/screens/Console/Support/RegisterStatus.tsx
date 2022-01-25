//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Grid } from "@mui/material";
import VerifiedIcon from "../../../icons/VerifiedIcon";
import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

const styles = (theme: Theme) =>
  createStyles({
    registeredStatus: {
      border: "1px solid #E2E2E2",
      padding: "24px 24px 24px 24px",
      borderRadius: 2,
      marginBottom: 25,
      backgroundColor: "#FBFAFA",
      "& .min-icon": {
        width: 20,
        height: 20,
        marginLeft: 48,
        marginRight: 13,
        verticalAlign: "middle",
        marginTop: -3,
      },
      "& span": {
        fontWeight: "bold",
      },
    },
  });

interface IRegisterStatus {
  classes: any;
}

function RegisterStatus({ classes }: IRegisterStatus) {
  return (
    <Grid container>
      <Grid item xs={12} className={classes.registeredStatus}>
        Register Status:
        <VerifiedIcon />
        <span>Registered</span>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(RegisterStatus);

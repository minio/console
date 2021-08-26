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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Usage, ServerInfo } from "../types";
import { niceBytes, niceDays } from "../../../../common/utils";
import DnsIcon from "@material-ui/icons/Dns";
import EgressIcon from "../../../../icons/EgressIcon";
import ReportedUsageIcon from "../../../../icons/ReportedUsageIcon";
import { BucketsIcon } from "../../../../icons";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
      border: "#eaedee 1px solid",
      borderRadius: 5,
      boxShadow: "none",
    },
    fixedHeight: {
      height: 165,
      minWidth: 247,
      marginRight: 20,
      padding: "25px 28px",
      "& svg": {
        maxHeight: 18,
      },
    },
     infoHeight: {
      height: 180,
      minWidth: 247,
      marginRight: 20,
      padding: "25px 28px",
      "& svg": {
        maxHeight: 18,
      },
    },
    consumptionValue: {
      color: "#000000",
      fontSize: "60px",
      fontWeight: "bold",
    },
    endpoint: {
      color: "#000000",
      fontSize: "20px",
      fontWeight: "bold",
    },
     infoValue: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      marginTop: 9,
    },
    icon: {
      marginRight: 10,
      color: "#777777",
    },
    notationContainer: {
      display: "flex",
      flexWrap: "wrap",
    },
   
    elementTitle: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      marginTop: -9,
    },
  });

  interface ICardProps {
  classes: any;
  server: ServerInfo;
}

  export const ServerInfoCard = ({classes, server}: ICardProps) => {
    return(
      <Paper className={classes.infoPaper}>
              <Grid container direction="row" alignItems="center">
               
                <Grid item>
                  <Typography className={classes.endpoint}>
                    {" "}
                     {server.endpoint}
                  </Typography>
                  <Typography className={classes.infoValue}>
                    Status:  {server.state}
                  </Typography>
                  <Typography className={classes.infoValue}>
                    Uptime:  {niceDays(server.uptime)}
                  </Typography>
                  <Typography className={classes.infoValue}>
                    Version:  {server.version}
                  </Typography>
                </Grid>
              </Grid>
              
            </Paper>
    )
  }
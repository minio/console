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
import { Usage } from "../types";
import { niceBytes } from "../../../../common/utils";
import DnsIcon from "@material-ui/icons/Dns";
import EgressIcon from "../../../../icons/EgressIcon";
import ReportedUsageIcon from "../../../../icons/ReportedUsageIcon";
import ServerInfoCard from "./ServerInfoCard";
import {
  BucketsIcon,
  DashboardIcon,
  ServersIcon,
  TotalObjectsIcon,
} from "../../../../icons";

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
      marginBottom: 15,
    },
    fixedHeight: {
      height: 165,
      minWidth: 247,
      marginRight: 20,
      padding: "25px 28px",
      "& svg:not(.computerIcon)": {
        maxHeight: 18,
      },
    },
    serversContainer: {
      height: 250,
      overflow: "hidden" as const,
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
      marginTop: 20,
    },
    dashboardBG: {
      width: 390,
      height: 255,
      zIndex: -1,
      position: "fixed",
      backgroundSize: "fill",
      backgroundImage: "url(/images/BG_IllustrationDarker.svg)",
      backgroundPosition: "right bottom",
      right: 0,
      bottom: 0,
      backgroundRepeat: "no-repeat",
    },
    elementTitle: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      marginTop: -9,
    },
    smallUnit: {
      fontSize: 20,
    },
    serversListContainer: {
      overflowY: "auto",
      height: 200,
      width: "100%",
    },
    cardsContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    serversAdj: {
      maxWidth: 1380,
    },
  });

interface IDashboardProps {
  classes: any;
  usage: Usage | null;
}

const BasicDashboard = ({ classes, usage }: IDashboardProps) => {
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const serversPaperContainer = clsx(
    classes.paper,
    classes.fixedHeight,
    classes.serversContainer
  );

  const prettyUsage = (usage: string | undefined) => {
    if (usage === undefined) {
      return "0";
    }

    const niceBytesUsage = niceBytes(usage).split(" ");

    if (niceBytesUsage.length !== 2) {
      return niceBytesUsage.join(" ");
    }

    return (
      <Fragment>
        {niceBytesUsage[0]}
        <span className={classes.smallUnit}>{niceBytesUsage[1]}</span>
      </Fragment>
    );
  };

  const prettyNumber = (usage: number | undefined) => {
    if (usage === undefined) {
      return 0;
    }

    return usage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const makeServerArray = (usage: Usage | null) => {
    if (usage != null) {
      return usage.servers.sort(function (a, b) {
        var nameA = a.endpoint.toLowerCase();
        var nameB = b.endpoint.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    } else return [];
  };

  const serverArray = makeServerArray(usage);

  return (
    <Fragment>
      <div className={classes.dashboardBG} />
      <Grid container className={classes.dashboardContainer}>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} className={classes.notationContainer}>
            <Paper className={fixedHeightPaper}>
              <Grid container direction="row" alignItems="center">
                <Grid item className={classes.icon}>
                  <BucketsIcon />
                </Grid>
                <Grid item>
                  <Typography className={classes.elementTitle}>
                    All buckets
                  </Typography>
                </Grid>
              </Grid>
              <Typography className={classes.consumptionValue}>
                {usage ? prettyNumber(usage.buckets) : 0}
              </Typography>
            </Paper>
            <Paper className={fixedHeightPaper}>
              <Grid container direction="row" alignItems="center">
                <Grid item className={classes.icon}>
                  <ReportedUsageIcon />
                </Grid>
                <Grid item>
                  <Typography className={classes.elementTitle}>
                    Usage
                  </Typography>
                </Grid>
              </Grid>
              <Typography className={classes.consumptionValue}>
                {usage ? prettyUsage(usage.usage + "") : 0}
              </Typography>
            </Paper>
            <Paper className={fixedHeightPaper}>
              <Grid container direction="row" alignItems="center">
                <Grid item className={classes.icon}>
                  <TotalObjectsIcon />
                </Grid>
                <Grid item>
                  <Typography className={classes.elementTitle}>
                    {" "}
                    Total Objects
                  </Typography>
                </Grid>
              </Grid>
              <Typography className={classes.consumptionValue}>
                {usage ? prettyNumber(usage.objects) : 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} className={classes.serversAdj}>
            <Paper className={serversPaperContainer}>
              <div>
                <Grid container direction="row" alignItems="center">
                  <Grid item className={classes.icon}>
                    <ServersIcon />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.elementTitle}>
                      {" "}
                      Servers
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div className={classes.serversListContainer}>
                <div className={classes.cardsContainer}>
                  {serverArray.map((server, index) => (
                    <ServerInfoCard
                      server={server}
                      key={`serverDS-${index.toString()}`}
                    />
                  ))}
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(BasicDashboard);

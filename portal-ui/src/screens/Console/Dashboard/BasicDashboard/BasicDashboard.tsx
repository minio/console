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
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Usage } from "../types";
import { niceBytes } from "../../../../common/utils";
import ReportedUsageIcon from "../../../../icons/ReportedUsageIcon";
import ServerInfoCard from "./ServerInfoCard";
import DriveInfoCard from "./DriveInfoCard";
import {
  BucketsIcon,
  ServersIcon,
  StorageIcon,
  TotalObjectsIcon,
} from "../../../../icons";
import { Card, CardHeader } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
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

    cardsContainer: {
      maxHeight: 440,
      overflowY: "auto",
      overflowX: "hidden",
    },
  });

interface IDashboardProps {
  classes: any;
  usage: Usage | null;
}

const BasicDashboard = ({ classes, usage }: IDashboardProps) => {
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card className={classes.cardRoot}>
                <CardHeader
                  avatar={<BucketsIcon />}
                  title="Number of Buckets"
                  subheader={usage ? prettyNumber(usage.buckets) : 0}
                />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className={classes.cardRoot}>
                <CardHeader
                  avatar={<ReportedUsageIcon />}
                  title="Usage"
                  subheader={usage ? prettyUsage(usage.usage + "") : 0}
                />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className={classes.cardRoot}>
                <CardHeader
                  avatar={<TotalObjectsIcon />}
                  title="Total Objects"
                  subheader={usage ? prettyNumber(usage.objects) : 0}
                />
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card className={classes.cardRoot}>
                {usage
                  ? usage.servers.length !== 0 && (
                      <CardHeader
                        avatar={<TotalObjectsIcon />}
                        title="MinIO Version"
                        subheader={usage ? usage.servers[0].version : 0}
                      />
                    )
                  : 0}
              </Card>
            </Grid>
            <Grid item xs={6} />
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <StorageIcon />
              </Grid>
              <Grid item>
                <Typography variant="h5">Drives Status</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} className={classes.cardsContainer}>
              {serverArray.map((server, index) =>
                server.drives.map((drive) => (
                  <Grid item xs={12} key={drive.uuid}>
                    <DriveInfoCard drive={drive} />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <ServersIcon />
            </Grid>
            <Grid item>
              <Typography variant="h5">Servers Status</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            {serverArray.map((server, index) => (
              <Grid item xs={12}>
                <ServerInfoCard
                  server={server}
                  key={`serverDS-${index.toString()}`}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(BasicDashboard);

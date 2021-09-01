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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import ComputerIcon from "@material-ui/icons/Computer";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { ServerInfo } from "../types";
import { niceDays } from "../../../../common/utils";
import { Tooltip } from "@material-ui/core";
import { CircleIcon } from "../../../../icons";

const styles = (theme: Theme) =>
  createStyles({
    serverCard: {
      padding: 15,
      margin: 8,
      width: "100%",
      maxWidth: 620,
      "& .computerIcon": {
        marginRight: 10,
      },
    },
    titleContainer: {
      display: "flex",
    },
    cardIconContainer: {
      display: "flex",
      position: "relative",
      alignItems: "center",
    },
    endpoint: {
      color: "#000000",
      fontSize: 20,
      fontWeight: "bold",
      position: "relative" as const,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    stateContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    infoValue: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      margin: "5px 4px",
      display: "inline-flex",
      "& strong": {
        marginRight: 4,
      },
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16,
      },
    },
    redState: {
      color: theme.palette.error.main,
    },
    greenState: {
      color: theme.palette.success.main,
    },
    yellowState: {
      color: theme.palette.warning.main,
    },
    greyState: {
      color: "grey",
    },
    healthStatusIcon: {
      position: "absolute",
      fontSize: 10,
      left: 18,
      height: 10,
      bottom: 2,
      "& .MuiSvgIcon-root": {
        width: 10,
        height: 10,
      },
    },
    innerState: {
      fontSize: 10,
      marginLeft: 5,
      display: "flex",
      alignItems: "center",
      marginTop: -3,
    },
  });

interface ICardProps {
  classes: any;
  server: ServerInfo;
}

const ServerInfoCard = ({ classes, server }: ICardProps) => {
  console.log(server);
  const serverStatusToClass = (health_status: string) => {
    switch (health_status) {
      case "offline":
        return classes.redState;
      case "online":
        return classes.greenState;
      default:
        return classes.greyState;
    }
  };

  const networkKeys = Object.keys(server.network);

  const networkTotal = networkKeys.length;
  const totalDrives = server.drives.length;

  const activeNetwork = networkKeys.reduce((acc: number, currValue: string) => {
    const item = server.network[currValue];
    if (item === "online") {
      return acc + 1;
    }
    return acc;
  }, 0);

  const activeDisks = server.drives.filter(
    (element) => element.state === "ok"
  ).length;

  return (
    <Paper className={classes.serverCard}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12}>
          <div className={classes.titleContainer}>
            <div className={classes.cardIconContainer}>
              <ComputerIcon className="computerIcon" />
              <div className={classes.healthStatusIcon}>
                {server.state && (
                  <span className={serverStatusToClass(server.state)}>
                    <CircleIcon />
                  </span>
                )}
              </div>
            </div>{" "}
            <Tooltip title={server.endpoint} placement="bottom">
              <div className={classes.endpoint}>{server.endpoint}</div>
            </Tooltip>
          </div>
          <div className={classes.infoValue}>
            <strong>Version:</strong> {server.version}
          </div>
        </Grid>
        <Grid item xs={12} className={classes.stateContainer}>
          <span className={classes.infoValue}>
            <strong>Drives:</strong> {activeDisks}/{totalDrives}{" "}
            <span
              className={`${classes.innerState} ${
                activeDisks <= totalDrives / 2 && classes.redState
              } ${activeDisks === totalDrives / 2 + 1 && classes.yellowState} ${
                activeDisks === totalDrives && classes.greenState
              }`}
            >
              <CircleIcon />
            </span>
          </span>
          <span className={classes.infoValue}>
            <strong>Network:</strong> {activeNetwork}/{networkTotal}{" "}
            <span
              className={`${classes.innerState} ${
                activeNetwork <= networkTotal / 2 && classes.redState
              } ${
                activeNetwork === networkTotal / 2 + 1 && classes.yellowState
              } ${activeNetwork === networkTotal && classes.greenState}`}
            >
              <CircleIcon />
            </span>
          </span>
          <span className={classes.infoValue}>
            <strong>Uptime:</strong> {niceDays(server.uptime)}
          </span>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(ServerInfoCard);

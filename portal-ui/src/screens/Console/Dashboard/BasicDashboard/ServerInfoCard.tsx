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
import { ServerInfo } from "../types";
import { niceDays } from "../../../../common/utils";
import { Card, CardHeader } from "@material-ui/core";
import { CircleIcon } from "../../../../icons";
import get from "lodash/get";

const styles = (theme: Theme) =>
  createStyles({
    cardIconContainer: {
      display: "flex",
      position: "relative",
      alignItems: "center",
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
    cardHeader: {
      "& .MuiCardHeader-title": {
        fontWeight: "bolder",
      },
    },
  });

interface ICardProps {
  classes: any;
  server: ServerInfo;
}

const ServerInfoCard = ({ classes, server }: ICardProps) => {
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

  const networkKeys = Object.keys(get(server, "network", {}));

  const networkTotal = networkKeys.length;
  const totalDrives = server.drives ? server.drives.length : 0;

  const activeNetwork = networkKeys.reduce((acc: number, currValue: string) => {
    const item = server.network[currValue];
    if (item === "online") {
      return acc + 1;
    }
    return acc;
  }, 0);

  const activeDisks = server.drives
    ? server.drives.filter((element) => element.state === "ok").length
    : 0;

  return (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <div className={classes.cardIconContainer}>
            <ComputerIcon className="computerIcon" />
            <div className={classes.healthStatusIcon}>
              {server.state && (
                <span className={serverStatusToClass(server.state)}>
                  <CircleIcon />
                </span>
              )}
            </div>
          </div>
        }
        title={server.endpoint || ""}
        subheader={
          <Grid item xs={12} className={classes.stateContainer}>
            <span className={classes.infoValue}>
              <strong>Drives:</strong> {activeDisks}/{totalDrives}{" "}
              <span
                className={`${classes.innerState} ${
                  activeDisks <= totalDrives / 2 && classes.redState
                } ${
                  activeDisks === totalDrives / 2 + 1 && classes.yellowState
                } ${activeDisks === totalDrives && classes.greenState}`}
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
              <strong>Uptime:</strong>{" "}
              {server.uptime ? niceDays(server.uptime) : "N/A"}
            </span>
          </Grid>
        }
      />
    </Card>
  );
};

export default withStyles(styles)(ServerInfoCard);

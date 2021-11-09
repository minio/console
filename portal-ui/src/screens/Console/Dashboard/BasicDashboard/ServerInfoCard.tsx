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
import { ServerInfo } from "../types";
import { niceDays } from "../../../../common/utils";
import { Card, CardHeader } from "@mui/material";
import { CircleIcon, VersionIcon } from "../../../../icons";
import get from "lodash/get";
import { commonDashboardInfocard } from "../../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...commonDashboardInfocard,
  });

interface ICardProps {
  classes: any;
  server: ServerInfo;
  index: number;
}

const ServerInfoCard = ({ classes, server, index }: ICardProps) => {
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
    <Card className={classes.cardContainer}>
      <CardHeader
        className={classes.cardHeader}
        title={
          <div>
            <div className={classes.cardNumber}>Server {index}</div>
            <div className={classes.referenceTitle}>
              {server.state && (
                <span className={serverStatusToClass(server.state)}>
                  <CircleIcon />
                </span>
              )}
              {server.endpoint || ""}
            </div>
          </div>
        }
        subheader={
          <Grid item xs={12} className={classes.stateContainer}>
            <span className={classes.infoValue}>
              <span
                className={`${classes.innerState} ${
                  activeDisks <= totalDrives / 2 && classes.redState
                }  ${
                  totalDrives !== 2 &&
                  activeDisks === totalDrives / 2 + 1 &&
                  classes.yellowState
                }  ${activeDisks === totalDrives && classes.greenState}`}
              >
                <CircleIcon />
              </span>
              Drives: {activeDisks}/{totalDrives}{" "}
            </span>
            <span className={classes.infoValue}>
              <span
                className={`${classes.innerState} ${
                  activeNetwork <= networkTotal / 2 && classes.redState
                } ${
                  activeNetwork === networkTotal / 2 + 1 && classes.yellowState
                } ${activeNetwork === networkTotal && classes.greenState}`}
              >
                <CircleIcon />
              </span>
              Network: {activeNetwork}/{networkTotal}{" "}
            </span>
            <span className={classes.infoValue}>
              Uptime: {server.uptime ? niceDays(server.uptime) : "N/A"}
            </span>
            <span className={classes.infoValue}>
              <VersionIcon />
              <strong>Version</strong> {server.version ? server.version : "N/A"}
            </span>
          </Grid>
        }
      />
    </Card>
  );
};
export default withStyles(styles)(ServerInfoCard);

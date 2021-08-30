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
import HealIcon from "../../../../icons/HealIcon";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { IDriveInfo } from "../types";
import { niceBytes } from "../../../../common/utils";
import { Tooltip } from "@material-ui/core";
import HelpIcon from "../../../../icons/HelpIcon";

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
      bottom: 5,
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
  drive: IDriveInfo;
}

const DriveInfoCard = ({ classes, drive }: ICardProps) => {
  console.log(drive);
  const driveStatusToClass = (health_status: string) => {
    switch (health_status) {
      case "offline":
        return classes.redState;
      case "ok":
        return classes.greenState;
      default:
        return classes.greyState;
    }
  };

  return (
    <Paper className={classes.serverCard}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12}>
          <div className={classes.titleContainer}>
            <div className={classes.cardIconContainer}>
              <ComputerIcon className="computerIcon" />
              <div className={classes.healthStatusIcon}>
                {drive.state && (
                  <span className={driveStatusToClass(drive.state)}>⬤</span>
                )}
              </div>
            </div>{" "}
            <Tooltip title={drive.endpoint} placement="bottom">
              <div className={classes.endpoint}>{drive.endpoint}</div>
            </Tooltip>
            <span className={classes.infoValue}>
            {drive.healing && <HealIcon />}
            {drive.rootDisk  && <HelpIcon />} 
          </span>
          </div>
          
        </Grid>
        <Grid item xs={12} className={classes.stateContainer}>
          <span className={classes.infoValue}>
            <strong>Total Space:</strong> {niceBytes(drive.totalSpace.toString())}
            </span>
            <span className={classes.infoValue}>
            <strong>Used Space:</strong> {niceBytes(drive.usedSpace.toString())}
            </span>
            <span className={classes.infoValue}>
            <strong>Available Space:</strong> {niceBytes(drive.availableSpace.toString())}
          </span>
        
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(DriveInfoCard);

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
import { IDriveInfo } from "../types";
import { niceBytes } from "../../../../common/utils";
import { Card, CardHeader } from "@material-ui/core";
import { CircleIcon, StorageIcon } from "../../../../icons";

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
        deefault: return classes.greyState;
    }
  };

  return (
    <Fragment>
      <Card>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <div className={classes.cardIconContainer}>
              <StorageIcon className="computerIcon" />
              <div className={classes.healthStatusIcon}>
                {drive.state && (
                  <span className={driveStatusToClass(drive.state)}>
                    <CircleIcon />
                  </span>
                )}
              </div>
            </div>
          }
          title={drive.endpoint}
          subheader={
            <Grid item xs={12} className={classes.stateContainer}>
              <span className={classes.infoValue}>
                <strong>Capacity:</strong>{" "}
                {niceBytes(drive.totalSpace.toString())}
              </span>
              <span className={classes.infoValue}>
                <strong>Used:</strong> {niceBytes(drive.usedSpace.toString())}
              </span>
              <span className={classes.infoValue}>
                <strong>Available:</strong>{" "}
                {niceBytes(drive.availableSpace.toString())}
              </span>
            </Grid>
          }
        />
      </Card>
    </Fragment>
  );
};

export default withStyles(styles)(DriveInfoCard);

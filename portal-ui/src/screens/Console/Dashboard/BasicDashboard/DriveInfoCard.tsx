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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { IDriveInfo } from "../types";
import { niceBytes } from "../../../../common/utils";
import { Card, CardHeader } from "@mui/material";
import { CircleIcon } from "../../../../icons";
import { commonDashboardInfocard } from "../../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...commonDashboardInfocard,
  });

interface ICardProps {
  classes: any;
  drive: IDriveInfo;
}

const DriveInfoCard = ({ classes, drive }: ICardProps) => {
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
    <Fragment>
      <Card className={classes.cardContainer}>
        <CardHeader
          className={classes.cardHeader}
          title={
            <div className={classes.referenceTitle}>
              {drive.state && (
                <span className={driveStatusToClass(drive.state)}>
                  <CircleIcon />
                </span>
              )}
              {drive.endpoint || ""}
            </div>
          }
          subheader={
            <Grid item xs={12} className={classes.stateContainer}>
              <span className={classes.infoValue}>
                <strong>Capacity:</strong>{" "}
                {niceBytes(
                  drive.totalSpace ? drive.totalSpace.toString() : "0"
                )}
              </span>
              <span className={classes.infoValue}>
                <strong>Used:</strong>{" "}
                {niceBytes(drive.usedSpace ? drive.usedSpace.toString() : "0")}
              </span>
              <span className={classes.infoValue}>
                <strong>Available:</strong>{" "}
                {niceBytes(
                  drive.availableSpace ? drive.availableSpace.toString() : "0"
                )}
              </span>
            </Grid>
          }
        />
      </Card>
    </Fragment>
  );
};

export default withStyles(styles)(DriveInfoCard);

// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { IDriveInfo } from "../types";
import { niceBytes } from "../../../../common/utils";
import { Box } from "@mui/material";
import { CircleIcon, DrivesIcon } from "../../../../icons";
import { commonDashboardInfocard } from "../../Common/FormComponents/common/styleLibrary";
import { STATUS_COLORS } from "./Utils";

const styles = (theme: Theme) =>
  createStyles({
    ...commonDashboardInfocard,
  });

interface ICardProps {
  classes?: any;
  drive: IDriveInfo;
}

const driveStatusColor = (health_status: string) => {
  switch (health_status) {
    case "offline":
      return STATUS_COLORS.RED;
    case "ok":
      return STATUS_COLORS.GREEN;
    default:
      return STATUS_COLORS.YELLOW;
  }
};

const DriveInfoItem = ({ classes, drive }: ICardProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        paddingBottom: "10px",
        borderBottom: {
          xs: "1px solid #eaeaea",
        },
      }}
    >
      <Box
        sx={{
          "& .min-icon": {
            fill: "#848484",
          },
        }}
      >
        <DrivesIcon />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          marginLeft: "10px",
          flex: 1,
        }}
      >
        <Box
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            alignItems: "center",

            "& .min-icon": {
              marginRight: "10px",
              height: "10px",
              width: "10px",
              fill: driveStatusColor(drive.state),
              flexShrink: 0,
            },

            "& .drive-endpoint": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              wordBreak: "break-all",
              fontSize: {
                md: "14px",
                xs: "10px",
              },
            },
          }}
        >
          {drive.state && <CircleIcon />}
          <div className="drive-endpoint">{drive.endpoint || ""}</div>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "20px",
            marginTop: "10px",
            flexFlow: {
              sm: "row",
              xs: "column",
            },
            "& .info-label": {
              color: "#8399AB",
            },
            "& .info-value": {
              color: "#073052",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            <label className="info-label">Capacity:</label>
            <div className="info-value">
              {niceBytes(drive.totalSpace ? drive.totalSpace.toString() : "0")}
            </div>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            <label className="info-label">Used:</label>
            <div className="info-value">
              {niceBytes(drive.usedSpace ? drive.usedSpace.toString() : "0")}
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            <label className="info-label">Available:</label>
            <div className="info-value">
              {niceBytes(
                drive.availableSpace ? drive.availableSpace.toString() : "0"
              )}
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(DriveInfoItem);

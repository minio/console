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
import get from "lodash/get";
import styled from "styled-components";
import { niceBytes } from "../../../../common/utils";
import { Box, breakPoints, CircleIcon, SizeChart } from "mds";
import { ServerDrives } from "api/consoleApi";
import { STATUS_COLORS } from "./Utils";

interface ICardProps {
  drive: ServerDrives;
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

const DataContainerMain = styled.div(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  paddingLeft: "20px",
  marginTop: "10px",
  flexFlow: "row",
  "& .info-label": {
    color: get(theme, "mutedText", "#87888d"),
    fontSize: "12px",
    textAlign: "center",
  },
  "& .info-value": {
    fontSize: "18px",
    color: get(theme, "signalColors.main", "#07193E"),
    display: "flex",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  [`@media (max-width: ${breakPoints.sm}px)`]: {
    flexFlow: "column",
  },
}));

const DriveInfoItem = ({ drive }: ICardProps) => {
  const totalSpace = drive.totalSpace || 0;
  const usedSpace = drive.usedSpace || 0;

  return (
    <Box
      withBorders
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        paddingBottom: "10px",
        padding: "20px",
      }}
    >
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
              fill: driveStatusColor(drive.state || ""),
              flexShrink: 0,
            },

            "& .drive-endpoint": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              wordBreak: "break-all",
              marginRight: "8px",
              fontWeight: 600,
              fontSize: 16,
              [`@media (max-width: ${breakPoints.sm}px)`]: {
                fontSize: 10,
              },
            },
          }}
        >
          <div className="drive-endpoint">{drive.endpoint || ""}</div>
          {drive.state && <CircleIcon />}
        </Box>

        <DataContainerMain>
          <Box sx={{ flex: 1 }}>
            <SizeChart
              label={true}
              usedBytes={usedSpace}
              totalBytes={totalSpace}
              width={"120"}
              height={"120"}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "5%",
              alignItems: "center",
              flex: 2,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
              }}
            >
              <div className="info-value">
                {niceBytes(
                  drive.totalSpace ? drive.totalSpace.toString() : "0",
                )}
              </div>
              <label className="info-label">Capacity</label>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
              }}
            >
              <div className="info-value">
                {niceBytes(drive.usedSpace ? drive.usedSpace.toString() : "0")}
              </div>
              <label className="info-label">Used</label>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
              }}
            >
              <div className="info-value">
                {niceBytes(
                  drive.availableSpace ? drive.availableSpace.toString() : "0",
                )}
              </div>
              <label className="info-label">Available</label>
            </Box>
          </Box>
        </DataContainerMain>
      </Box>
    </Box>
  );
};

export default DriveInfoItem;

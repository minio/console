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

import { useMemo } from "react";
import get from "lodash/get";
import { useTheme } from "styled-components";
import { niceBytes } from "../../../../common/utils";
import { Box, breakPoints, CircleIcon, SizeChart } from "mds";
import { ServerDrives } from "api/consoleApi";
import { STATUS_COLORS } from "./Utils";

interface ICardProps {
  drive: ServerDrives;
}

const DriveInfoItem = ({ drive }: ICardProps) => {
  const theme = useTheme();

  const totalSpace = drive.totalSpace ?? 0;
  const usedSpace = drive.usedSpace ?? 0;
  const usedPercentage =
    totalSpace !== 0 ? Math.max((usedSpace / totalSpace) * 100, 0) : 0;
  const availableSpace = drive.availableSpace ?? 0;
  const availablePercentage =
    totalSpace !== 0 ? Math.max((availableSpace / totalSpace) * 100, 0) : 0;

  const driveStatusColor = useMemo(() => {
    switch (drive.state) {
      case "offline":
        return STATUS_COLORS.RED;
      case "ok":
        return STATUS_COLORS.GREEN;
      default:
        return STATUS_COLORS.YELLOW;
    }
  }, [drive.state]);

  const driveStatusText = useMemo(() => {
    switch (drive.state) {
      case "offline":
        return "Offline Drive";
      case "ok":
        return "Online Drive";
      default:
        return "Unknown";
    }
  }, [drive.state]);

  return (
    <Box
      withBorders
      sx={{
        display: "flex",
        flexFlow: "row",
        padding: 12,
        gap: 24,
        alignItems: "center",
        [`@media (max-width: ${breakPoints.xs}px)`]: {
          flexFlow: "column",
          alignItems: "start",
        },
        "& .info-label": {
          color: get(theme, "mutedText", "#87888d"),
          fontSize: 12,
        },
        "& .info-value": {
          fontSize: 18,
          color: get(theme, "signalColors.main", "#07193E"),
          display: "flex",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        "& .drive-endpoint": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal",
          wordBreak: "break-all",
          fontWeight: 600,
          fontSize: 16,
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            fontSize: 10,
          },
        },
        "& .percentage-row": {
          display: "flex",
          gap: 4,
          alignItems: "center",
          fontSize: 12,
          "& .percentage-value": {
            fontWeight: 700,
          },
        },
      }}
    >
      <SizeChart
        chartLabel="Used Capacity"
        label={true}
        usedBytes={usedSpace}
        totalBytes={totalSpace}
        width={"153"}
        height={"153"}
      />
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexFlow: "row",
            gap: 8,
            [`@media (max-width: ${breakPoints.xs}px)`]: {
              flexFlow: "column",
            },
          }}
        >
          <Box
            sx={{
              flex: "1 1 60%",
              [`@media (max-width: ${breakPoints.xs}px)`]: {
                flex: "1 1 100%",
              },
            }}
          >
            <label className="info-label">Drive Name</label>
            <Box className="drive-endpoint">{drive.endpoint ?? ""}</Box>
          </Box>
          <Box
            sx={{
              flex: "1 1 20%",
              [`@media (max-width: ${breakPoints.xs}px)`]: {
                flex: "1 1 100%",
              },
            }}
          >
            <label className="info-label">Drive Status</label>
            <Box
              sx={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                fontSize: 12,
                fontWeight: 600,
                gap: 4,
                color: driveStatusColor,
                "& .min-icon": {
                  height: 8,
                  width: 8,
                  flexShrink: 0,
                },
              }}
            >
              <CircleIcon />
              {driveStatusText}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexFlow: "row",
            gap: 36,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            <label className="info-label">Used Capacity</label>
            <Box className="info-value">{niceBytes(usedSpace.toString())}</Box>
            <Box className="percentage-row">
              <Box className="percentage-value">
                {usedPercentage.toFixed(2)}%
              </Box>
              <Box>of {niceBytes(totalSpace.toString())}</Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: 1,
              backgroundColor: get(theme, "borderColor", "#BBBBBB"),
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            <label className="info-label">Available Capacity</label>
            <Box className="info-value">
              {niceBytes(availableSpace.toString())}
            </Box>
            <Box className="percentage-row">
              <Box className="percentage-value">
                {availablePercentage.toFixed(2)}%
              </Box>
              <Box>of {niceBytes(totalSpace.toString())}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DriveInfoItem;

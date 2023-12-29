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
import styled from "styled-components";
import get from "lodash/get";
import { Box, breakPoints, CircleIcon } from "mds";
import { niceDays } from "../../../../common/utils";
import {
  getDriveStatusColor,
  getNetworkStatusColor,
  serverStatusColor,
} from "./Utils";
import { ServerProperties } from "api/consoleApi";

interface ICardProps {
  server: ServerProperties;
  index: number;
}

const ServerStatItemMain = styled.div(({ theme }) => ({
  alignItems: "baseline",
  padding: "5px",
  display: "flex",
  gap: "5px",
  "& .StatBox": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexFlow: "column",
    "& .stat-text": {
      color: get(theme, "mutedText", "#87888d"),
      fontSize: "12px",
    },
    "& .stat-value": {
      fontSize: "18px",
      color: get(theme, "signalColors.main", "#07193E"),
      display: "flex",
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      "& .stat-container": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: "column",
        marginLeft: "5px",
        maxWidth: "40px",
        "&:first-of-type(svg)": {
          fill: get(theme, "mutedText", "#87888d"),
        },
        "& .stat-indicator": {
          marginRight: "0px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          "& svg.min-icon": {
            width: "10px",
            height: "10px",
          },
          "&.good": {
            "& svg.min-icon": {
              fill: get(theme, "signalColors.good", "#4CCB92"),
            },
          },
          "&.warn": {
            "& svg.min-icon": {
              fill: get(theme, "signalColors.warning", "#FFBD62"),
            },
          },
          "&.bad": {
            "& svg.min-icon": {
              fill: get(theme, "signalColors.danger", "#C51B3F"),
            },
          },
        },
      },
    },
  },
}));

const ServerInfoItemMain = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  flexFlow: "column",
  flex: 1,
  "& .server-state": {
    marginLeft: "8px",
    "& .min-icon": {
      height: "14px",
      width: "14px",
    },
    "&.good": {
      "& svg.min-icon": {
        fill: get(theme, "signalColors.good", "#4CCB92"),
      },
    },
    "&.warn": {
      "& svg.min-icon": {
        fill: get(theme, "signalColors.warning", "#FFBD62"),
      },
    },
    "&.bad": {
      "& svg.min-icon": {
        fill: get(theme, "signalColors.danger", "#C51B3F"),
      },
    },
  },
}));

const ServerStatItem = ({
  label = "",
  value = "",
  statusColor = "warn",
  hasStatus = false,
}: {
  label?: string;
  value?: any;
  hasStatus?: boolean;
  statusColor?: "good" | "warn" | "bad";
}) => {
  return (
    <ServerStatItemMain>
      <Box className={"StatBox"}>
        <div className="stat-value">
          {value}{" "}
          <Box className={"stat-container"}>
            {hasStatus ? (
              <Box className={`stat-indicator ${statusColor}`}>
                <CircleIcon />
              </Box>
            ) : (
              <Box sx={{ width: "12px", height: "12px" }} />
            )}
          </Box>
        </div>
        <div className="stat-text">{label}</div>
      </Box>
    </ServerStatItemMain>
  );
};

const ServerInfoItem = ({ server }: ICardProps) => {
  const networkKeys = Object.keys(get(server, "network", {}));
  const networkTotal = networkKeys.length;
  const totalDrives = server.drives ? server.drives.length : 0;
  const activeNetwork = networkKeys.reduce((acc: number, currValue: string) => {
    const item = server.network ? server.network[currValue] : "";
    if (item === "online") {
      return acc + 1;
    }
    return acc;
  }, 0);
  const activeDisks = server.drives
    ? server.drives.filter((element) => element.state === "ok").length
    : 0;
  return (
    <ServerInfoItemMain>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "3px",
          gap: "15px",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: "20px",
          flexFlow: "row",
          [`@media (max-width: ${breakPoints.md}px)`]: {
            flexFlow: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {server.endpoint || ""}
          </Box>
          {server?.state && (
            <Box className={`server-state ${serverStatusColor(server.state)}`}>
              <CircleIcon />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "1.5",
            gap: "5%",
          }}
        >
          <ServerStatItem
            statusColor={getDriveStatusColor(activeDisks, totalDrives)}
            label={"Drives"}
            hasStatus={true}
            value={`${activeDisks}/${totalDrives}`}
          />
          <ServerStatItem
            statusColor={getNetworkStatusColor(activeNetwork, networkTotal)}
            label={"Network"}
            hasStatus={true}
            value={`${activeNetwork}/${networkTotal}`}
          />
          <ServerStatItem
            statusColor={"good"}
            label={"Up time"}
            value={server?.uptime ? niceDays(`${server.uptime}`) : "N/A"}
          />
        </Box>
        <ServerStatItem
          statusColor={"good"}
          label={""}
          value={
            <Box
              sx={{
                background: "rgb(235, 236, 237)",
                color: "#000000",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "2px",
                fontSize: "12px",
                marginTop: "5px",

                "& .label": {
                  fontWeight: 600,
                  marginRight: "3px",
                },
              }}
            >
              <span className="label">Version:</span>
              {server.version ? server.version : "N/A"}
            </Box>
          }
        />
      </Box>
    </ServerInfoItemMain>
  );
};
export default ServerInfoItem;

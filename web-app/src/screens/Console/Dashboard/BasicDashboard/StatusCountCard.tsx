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

const StatusCountBase = styled.div(({ theme }) => ({
  fontFamily: "Inter,sans-serif",
  maxWidth: "321px",
  display: "flex",
  marginLeft: "auto",
  marginRight: "auto",
  cursor: "default",
  color: get(theme, "signalColors.main", "#07193E"),
  "& .mainBox": {
    flex: 1,
    display: "flex",
    padding: "0 8px 0 8px",
    [`@media (max-width: ${breakPoints.sm}px)`]: {
      padding: "0 10px 0 10px",
    },
    "& .indicatorIcon": {
      width: "20px",
      height: "20px",
      marginTop: "8px",
      maxWidth: "26px",
      "& .min-icon": {
        width: "16px",
        height: "16px",
      },
    },
    "& .indicatorContainer": {
      flex: 1,
      display: "flex",
      flexFlow: "column",
      "& .indicatorLabel": {
        fontSize: "16px",
        fontWeight: 600,
      },
      "& .counterIndicator": {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        justifyContent: "space-between",
        paddingBottom: 0,
        fontSize: "55px",
        [`@media (max-width: ${breakPoints.sm}px)`]: {
          paddingBottom: 10,
          fontSize: "35px",
        },
        [`@media (max-width: ${breakPoints.lg}px)`]: {
          fontSize: "45px",
        },
        [`@media (max-width: ${breakPoints.xl}px)`]: {
          fontSize: "50px",
        },
        flexFlow: "row",
        fontWeight: 600,

        "& .stat-text": {
          color: get(theme, "mutedText", "#87888D"),
          fontSize: "12px",
          marginTop: "8px",
        },
        "& .stat-value": {
          textAlign: "center",
          height: "50px",
        },
        "& .min-icon": {
          marginRight: "8px",
          marginTop: "8px",
          height: "10px",
          width: "10px",
        },
      },
      "& .onlineCounter": {
        display: "flex",
        alignItems: "center",
        marginTop: "5px",
        "& .min-icon": {
          fill: get(theme, "signalColors.good", "#4CCB92"),
        },
      },
      "& .offlineCount": {
        display: "flex",
        alignItems: "center",
        marginTop: "8px",
        "& .min-icon": {
          fill: get(theme, "signalColors.danger", "#C51B3F"),
        },
      },
    },
  },
}));

const StatusCountCard = ({
  onlineCount = 0,
  offlineCount = 0,
  icon = null,
  label = "",
  okStatusText = "Online",
  notOkStatusText = "Offline",
}: {
  icon: any;
  onlineCount: number;
  offlineCount: number;
  label: string;
  okStatusText?: string;
  notOkStatusText?: string;
}) => {
  return (
    <StatusCountBase>
      <Box className={"mainBox"}>
        <Box className={"indicatorContainer"}>
          <Box className={"indicatorLabel"}>{label}</Box>

          <Box className={"counterIndicator"}>
            <Box>
              <Box className="stat-value">{onlineCount}</Box>
              <Box className={"onlineCounter"}>
                <CircleIcon />
                <div className="stat-text">{okStatusText}</div>
              </Box>
            </Box>

            <Box>
              <Box className="stat-value">{offlineCount}</Box>
              <Box className={"offlineCount"}>
                <CircleIcon />{" "}
                <div className="stat-text">{notOkStatusText}</div>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={"indicatorIcon"}>{icon}</Box>
      </Box>
    </StatusCountBase>
  );
};

export default StatusCountCard;

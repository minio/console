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
import styled from "styled-components";
import get from "lodash/get";
import { CircleIcon, DrivesIcon, ServersIcon, Box } from "mds";
import EntityStateStatItem from "./EntityStateStatItem";
import DualStatCard from "./DualStatCard";
import { IDashboardPanel } from "../types";

const StateIndicator = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: "5px",
  gap: 8,
  "&.online": {
    "& .min-icon": {
      margin: 0,
      fill: get(theme, "signalColors.good", "#4CCB92"),
    },
  },
  "&.offline": {
    "& .min-icon": {
      margin: 0,
      fill: get(theme, "signalColors.danger", "#C51B3F"),
    },
  },
  "& .indicatorText": {
    color: get(theme, "mutedText", "#C51B3F"),
    fontSize: 12,
  },
}));

const EntityStateItemRenderer = ({
  info,
  timeStart,
  timeEnd,
  apiPrefix,
}: {
  info: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
}) => {
  const { mergedPanels = [], id } = info;
  const [leftPanel, rightPanel] = mergedPanels;

  const lStatItem = (
    <EntityStateStatItem
      panelItem={leftPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      apiPrefix={apiPrefix}
      statLabel={
        <StateIndicator className={"online"}>
          <CircleIcon />
          <Box className="indicatorText">Online</Box>
        </StateIndicator>
      }
    />
  );
  const rStatItem = (
    <EntityStateStatItem
      panelItem={rightPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      apiPrefix={apiPrefix}
      statLabel={
        <StateIndicator className={"offline"}>
          <CircleIcon />
          <Box className="indicatorText">Offline</Box>
        </StateIndicator>
      }
    />
  );

  let statIcon = null;
  let statLabel = "";
  if (id === 500) {
    statIcon = <ServersIcon />;
    statLabel = "Servers";
  } else if (id === 501) {
    statIcon = <DrivesIcon />;
    statLabel = "Drives";
  }

  return (
    <DualStatCard
      statItemLeft={lStatItem}
      statItemRight={rStatItem}
      icon={statIcon}
      label={statLabel}
    />
  );
};
export default EntityStateItemRenderer;

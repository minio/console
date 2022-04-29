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
import EntityStateStatItem from "./EntityStateStatItem";
import { Box } from "@mui/material";
import { CircleIcon, DrivesIcon, ServersIcon } from "../../../../../icons";
import DualStatCard from "./DualStatCard";
import { IDashboardPanel } from "../types";
import { setErrorSnackMessage } from "../../../../../actions";

const EntityStateItemRenderer = ({
  info,
  timeStart,
  timeEnd,
  loading,
  apiPrefix,
  displayErrorMessage,
}: {
  info: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  loading: boolean;
  apiPrefix: string;
  displayErrorMessage: typeof setErrorSnackMessage;
}) => {
  const { mergedPanels = [], id } = info;
  const [leftPanel, rightPanel] = mergedPanels;

  const lStatItem = (
    <EntityStateStatItem
      panelItem={leftPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      propLoading={loading}
      displayErrorMessage={displayErrorMessage}
      apiPrefix={apiPrefix}
      statLabel={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
            "& .min-icon": {
              fill: "#4CCB92",
            },
          }}
        >
          <CircleIcon /> <div className="stat-text">Online</div>
        </Box>
      }
    />
  );
  const rStatItem = (
    <EntityStateStatItem
      panelItem={rightPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      propLoading={loading}
      displayErrorMessage={displayErrorMessage}
      apiPrefix={apiPrefix}
      statLabel={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
            "& .min-icon": {
              fill: "#C83B51",
            },
          }}
        >
          <CircleIcon /> <div className="stat-text">Offline</div>
        </Box>
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

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
import { Box, breakPoints, SpeedtestIcon } from "mds";
import { IDashboardPanel } from "../types";
import SingleValueWidget from "./SingleValueWidget";
import NetworkGetItem from "./NetworkGetItem";
import NetworkPutItem from "./NetworkPutItem";

const NetworkItemBase = styled.div(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  flexFlow: "row",
  gap: "15px",
  "& .unitText": {
    fontSize: "14px",
    color: get(theme, "mutedText", "#87888d"),
    marginLeft: "5px",
  },
  "& .unit": {
    color: get(theme, "mutedText", "#87888d"),
    fontSize: "18px",
    marginLeft: "12px",
    marginTop: "10px",
  },
  [`@media (max-width: ${breakPoints.sm}px)`]: {
    flexFlow: "column",
  },
}));

const NetworkItem = ({
  value,
  timeStart,
  timeEnd,
  apiPrefix,
}: {
  value: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
}) => {
  const { mergedPanels = [] } = value;
  const [leftPanel, rightPanel] = mergedPanels;

  const rightCmp = (
    <SingleValueWidget
      title={value.title}
      panelItem={leftPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      apiPrefix={apiPrefix}
      renderFn={({ valueToRender, loading, title, id }) => {
        return (
          <NetworkPutItem
            value={valueToRender}
            loading={loading}
            title={title}
            id={id}
          />
        );
      }}
    />
  );
  const leftCmp = (
    <SingleValueWidget
      title={value.title}
      panelItem={rightPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      apiPrefix={apiPrefix}
      renderFn={({ valueToRender, loading, title, id }) => {
        return (
          <NetworkGetItem
            value={valueToRender}
            loading={loading}
            title={title}
            id={id}
          />
        );
      }}
    />
  );

  return (
    <NetworkItemBase>
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        Network
      </Box>
      <Box
        sx={{
          position: "relative",
          width: 110,
          height: 110,
          marginLeft: "auto",
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            marginLeft: "0",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {leftCmp}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            marginLeft: "0",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& .value": { fontSize: "50px", fontFamily: "Inter" },
          }}
        >
          {rightCmp}
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: "15px",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          "& .min-icon": {
            height: "15px",
            width: "15px",
          },
        }}
      >
        <SpeedtestIcon />
      </Box>
    </NetworkItemBase>
  );
};

export default NetworkItem;

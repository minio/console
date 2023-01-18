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
import { IDashboardPanel } from "../types";
import { Box } from "@mui/material";
import { SpeedtestIcon } from "mds";
import SingleValueWidget from "./SingleValueWidget";
import NetworkGetItem from "./NetworkGetItem";
import NetworkPutItem from "./NetworkPutItem";

const NetworkItem = ({
  value,
  timeStart,
  timeEnd,
  propLoading,
  apiPrefix,
}: {
  value: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
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
      propLoading={propLoading}
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
      propLoading={propLoading}
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
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexFlow: {
          sm: "row",
          xs: "column",
        },
        gap: "15px",
        "& .unitText": {
          fontSize: "14px",
          color: "#5E5E5E",
          marginLeft: "5px",
        },
      }}
    >
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
          marginLeft: {
            sm: "auto",
            xs: "",
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
            color: "#000",
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
          marginLeft: {
            sm: "auto",
            xs: "",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& .value": { fontSize: "50px", fontFamily: "Inter" },
            "& .unit": {
              color: "#5E5E5E",
              fontSize: "18px",
              marginLeft: "12px",
              marginTop: "10px",
            },
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
    </Box>
  );
};

export default NetworkItem;

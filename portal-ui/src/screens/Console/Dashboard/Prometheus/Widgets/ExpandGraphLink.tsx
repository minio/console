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
import { Box, ExpandIcon } from "mds";

import { IDashboardPanel } from "../types";

import { openZoomPage } from "../../dashboardSlice";
import { useAppDispatch } from "../../../../../store";

const ExpandGraphLink = ({ panelItem }: { panelItem: IDashboardPanel }) => {
  const dispatch = useAppDispatch();
  return (
    <Box
      sx={{
        alignItems: "right",
        gap: "10px",
        "& .link-text": {
          color: "#2781B0",
          fontSize: "12px",
          fontWeight: 600,
        },

        "& .zoom-graph-icon": {
          backgroundColor: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
          "& svg": {
            color: "#D0D0D0",
            height: 16,
          },
          "&:hover": {
            "& svg": {
              color: "#404143",
            },
          },
        },
      }}
    >
      <button
        onClick={() => {
          dispatch(openZoomPage(panelItem));
        }}
        className={"zoom-graph-icon"}
      >
        <ExpandIcon />
      </button>
    </Box>
  );
};

export default ExpandGraphLink;

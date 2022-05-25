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
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { Box } from "@mui/material";
import { IDashboardPanel } from "../types";
import { useDispatch } from "react-redux";
import { openZoomPage } from "../../dashboardSlice";

const ExpandGraphLink = ({ panelItem }: { panelItem: IDashboardPanel }) => {
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
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
      <a
        href={`void:(0);`}
        rel="noreferrer noopener"
        className={"link-text"}
        onClick={(e) => {
          e.preventDefault();
          dispatch(openZoomPage(panelItem));
        }}
      >
        Expand Graph
      </a>
      <button
        onClick={() => {
          dispatch(openZoomPage(panelItem));
        }}
        className={"zoom-graph-icon"}
      >
        <ZoomOutMapIcon />
      </button>
    </Box>
  );
};

export default ExpandGraphLink;

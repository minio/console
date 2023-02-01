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
import { Box } from "@mui/material";
import { Loader, SuccessIcon } from "mds";

const TimeStatItem = ({
  icon,
  label,
  value,
  loading = false,
}: {
  icon: any;
  label: any;
  value: string;
  loading?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "center",
        gap: "8px",
        height: "33px",
        paddingLeft: "15px",
        gridTemplateColumns: {
          xs: "20px 1.5fr .5fr 20px",
        },
        background: "#EBF9EE",

        "& .min-icon": {
          height: "12px",
          width: "12px",
          fill: "#4CCB92",
        },

        "& .ok-icon": {
          height: "8px",
          width: "8px",
          fill: "#4CCB92",
          color: "#4CCB92",
        },
      }}
      className="dashboard-time-stat-item"
    >
      {loading ? <Loader style={{ width: 10, height: 10 }} /> : icon}
      <Box
        sx={{
          fontSize: "12px",
          color: "#4CCB92",
          fontWeight: 600,
        }}
      >
        {label}
      </Box>
      <Box sx={{ fontSize: "12px", color: "#4CCB92" }}>{value}</Box>
      {value !== "n/a" ? <SuccessIcon className="ok-icon" /> : null}
    </Box>
  );
};

export default TimeStatItem;

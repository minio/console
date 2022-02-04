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

import { ReportedUsageIcon } from "../../../../icons";
import { Box, Tooltip } from "@mui/material";
import React from "react";

const ReportedUsage = ({
  usageValue,
  total,
  unit,
}: {
  usageValue: string;
  total: number | string;
  unit: string;
}) => {
  return (
    <Box
      sx={{
        maxHeight: "110px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "19px",

        padding: "10px",
        "& .unit-value": {
          fontSize: "50px",
          color: "#07193E",
        },
        "& .unit-type": {
          fontSize: "18px",
          color: "#5E5E5E",
          marginTop: "20px",
          marginLeft: "5px",
        },

        "& .usage-label": {
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: 600,
          marginRight: "20px",
          marginTop: "-10px",
          "& .min-icon": {
            marginLeft: "10px",
            height: 16,
            width: 16,
          },
        },
      }}
    >
      <div className="usage-label">
        <span>Reported Usage</span> <ReportedUsageIcon />
      </div>

      <Tooltip title={`${usageValue} Bytes`}>
        <label
          className={"unit-value"}
          style={{
            fontWeight: 600,
          }}
        >
          {total}
        </label>
      </Tooltip>
      <label className={"unit-type"}>{unit}</label>
    </Box>
  );
};

export default ReportedUsage;

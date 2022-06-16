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
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { Box } from "@mui/material";
import { CircleIcon } from "../../../icons";

const LicenseBadge = () => {
  const licenseInfo = useSelector(
    (state: AppState) => state?.system?.licenseInfo
  );

  const { plan = "" } = licenseInfo || {};

  if (plan) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        border: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -19,
          top: -29,
          zIndex: 400,
          border: 0,
        }}
        style={{
          border: 0,
        }}
      >
        <CircleIcon
          style={{
            fill: "#c83b51",
            border: "1px solid #002148",
            borderRadius: "100%",
            width: 12,
            height: 12,
          }}
        />
      </Box>
    </Box>
  );
};

export default LicenseBadge;

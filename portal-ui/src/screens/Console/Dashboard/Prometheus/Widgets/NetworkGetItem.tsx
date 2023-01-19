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
import { Box } from "@mui/material";
import { Loader } from "mds";
import { NetworkGetIcon } from "mds";

const NetworkGetItem = ({
  value,
  loading,
}: {
  value: any;
  loading: boolean;
  title?: any;
  id?: number;
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
          gap: "10px",
          "& .min-icon": {
            height: "15px",
            width: "15px",
            fill: "#4ccb92",
          },
        }}
      >
        <Box
          sx={{
            fontSize: "18px",
            color: "#696969",
          }}
        >
          GET
        </Box>
        {loading ? (
          <Loader style={{ width: "15px", height: "15px" }} />
        ) : (
          <NetworkGetIcon />
        )}
      </Box>
      <Box
        sx={{
          fontSize: "50px",
          fontFamily: "Inter",
          fontWeight: 600,
        }}
      >
        {value}
      </Box>
    </Box>
  );
};

export default NetworkGetItem;

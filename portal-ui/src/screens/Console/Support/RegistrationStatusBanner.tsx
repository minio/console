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
import { VerifiedIcon, Box, breakPoints } from "mds";

const RegistrationStatusBanner = ({ email = "" }: { email?: string }) => {
  return (
    <Box
      sx={{
        height: 67,
        color: "#ffffff",
        display: "flex",
        position: "relative",
        top: -30,
        left: -32,
        width: "calc(100% + 64px)",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2781B0",
        padding: "0 25px 0 25px",
        "& .registered-box, .reg-badge-box": {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        },

        "& .reg-badge-box": {
          marginLeft: "20px",

          "& .min-icon": {
            fill: "#2781B0",
          },
        },
      }}
    >
      <Box className="registered-box">
        <Box sx={{ fontSize: "16px", fontWeight: 400 }}>Register status:</Box>
        <Box className="reg-badge-box">
          <VerifiedIcon />
          <Box
            sx={{
              fontWeight: 600,
            }}
          >
            Registered
          </Box>
        </Box>
      </Box>

      <Box
        className="registered-acc-box"
        sx={{
          alignItems: "center",
          justifyContent: "flex-start",
          display: "flex",
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            display: "none",
          },
        }}
      >
        <Box sx={{ fontSize: "16px", fontWeight: 400 }}>Registered to:</Box>
        <Box sx={{ marginLeft: "8px", fontWeight: 600 }}>{email}</Box>
      </Box>
    </Box>
  );
};
export default RegistrationStatusBanner;

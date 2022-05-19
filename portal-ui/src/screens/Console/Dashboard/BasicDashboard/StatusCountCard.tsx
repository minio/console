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
import { CircleIcon } from "../../../../icons";

export const StatusCountCard = ({
  onlineCount = 0,
  offlineCount = 0,
  icon = null,
  label = "",
  okStatusText = "Online",
  notOkStatusText = "Offline",
}: {
  icon: any;
  onlineCount: number;
  offlineCount: number;
  label: string;
  okStatusText?: string;
  notOkStatusText?: string;
}) => {
  return (
    <Box
      sx={{
        fontFamily: "Lato,sans-serif",
        color: "#07193E",
        maxWidth: "321px",
        display: "flex",
        marginLeft: "auto",
        marginRight: "auto",
        cursor: "default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          padding: {
            sm: "0 8px 0 8px",
            xs: "0 10px 0 10px",
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Box
            sx={{
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {label}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              justifyContent: "space-between",
              paddingBottom: {
                md: "0px",
                xs: "10px",
              },
              fontSize: {
                xl: "55px",
                lg: "50px",
                md: "45px",
                xs: "35px",
              },
              flexFlow: "row",
              fontWeight: 600,

              "& .stat-text": {
                color: "#696969",
                fontSize: "12px",
                marginTop: "8px",
              },
              "& .stat-value": {
                textAlign: "center",
                height: "50px",
              },
              "& .min-icon": {
                marginRight: "8px",
                marginTop: "8px",
                height: "10px",
                width: "10px",
              },
            }}
          >
            <Box>
              <Box className="stat-value">{onlineCount}</Box>
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
                <CircleIcon />
                <div className="stat-text">{okStatusText}</div>
              </Box>
            </Box>

            <Box>
              <Box className="stat-value">{offlineCount}</Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                  "& .min-icon": {
                    fill: "#C83B51",
                  },
                }}
              >
                <CircleIcon />{" "}
                <div className="stat-text">{notOkStatusText}</div>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "20px",
            height: "20px",
            marginTop: "8px",
            maxWidth: "26px",
            "& .min-icon": {
              width: "16px",
              height: "16px",
            },
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

export default StatusCountCard;

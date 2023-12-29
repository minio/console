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
import styled from "styled-components";
import get from "lodash/get";
import { Box, breakPoints, Loader, Tooltip } from "mds";

const StatCardMain = styled.div(({ theme }) => ({
  fontFamily: "Inter,sans-serif",
  color: get(theme, "signalColors.main", "#07193E"),
  maxWidth: "300px",
  display: "flex",
  marginLeft: "auto",
  marginRight: "auto",
  cursor: "default",
  position: "relative",
  width: "100%",
}));

const NumericStatCard = ({
  value,
  label = "",
  icon = null,
  loading = false,
}: {
  value: string | number;
  label?: any;
  icon?: any;
  loading?: boolean;
}) => {
  const getContent = () => {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          padding: "0 8px 0 8px",
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            padding: "0 10px 0 10px",
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexFlow: "column",
            marginTop: "12px",
            zIndex: 10,
            overflow: "hidden",
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

          <Tooltip tooltip={value} placement="bottom">
            <Box
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 187,
                flexFlow: "row",
                fontSize: 55,
                [`@media (max-width: ${breakPoints.sm}px)`]: {
                  fontSize: 35,
                  maxWidth: 200,
                  flexFlow: "column",
                },
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  fontSize: 35,
                },
                [`@media (max-width: ${breakPoints.lg}px)`]: {
                  fontSize: 36,
                },
                [`@media (max-width: ${breakPoints.xl}px)`]: {
                  fontSize: 50,
                },
              }}
            >
              {value}
            </Box>
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: "8px",
            maxWidth: "26px",
            "& .min-icon": {
              width: "16px",
              height: "16px",
            },
          }}
        >
          {}
          {loading ? (
            <Loader style={{ width: "16px", height: "16px" }} />
          ) : (
            icon
          )}
        </Box>
      </Box>
    );
  };

  return <StatCardMain>{getContent()}</StatCardMain>;
};

export default NumericStatCard;

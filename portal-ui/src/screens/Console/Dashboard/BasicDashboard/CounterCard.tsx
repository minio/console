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
import get from "lodash/get";
import styled from "styled-components";
import { Box, breakPoints, Tooltip } from "mds";

const CounterCardMain = styled.div(({ theme }) => ({
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

const CounterCard = ({
  counterValue,
  label = "",
  icon = null,
  actions = null,
}: {
  counterValue: string | number;
  label?: any;
  icon?: any;
  actions?: any;
}) => {
  return (
    <CounterCardMain>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          padding: "0 8px 0 8px",
          position: "absolute",
          [`@media (max-width: ${breakPoints.md}px)`]: {
            padding: "0 10px 0 10px",
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexFlow: "column",
            marginTop: "8px",
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

          <Tooltip tooltip={counterValue} placement="bottom">
            <Box
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 187,
                flexFlow: "row",
                fontSize: counterValue.toString().length >= 5 ? 50 : 55,
                [`@media (max-width: ${breakPoints.sm}px)`]: {
                  flexFlow: "column",
                  maxWidth: 200,
                  fontSize: counterValue.toString().length >= 5 ? 20 : 35,
                },
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  fontSize: counterValue.toString().length >= 5 ? 28 : 35,
                },
                [`@media (max-width: ${breakPoints.lg}px)`]: {
                  fontSize: counterValue.toString().length >= 5 ? 28 : 36,
                },
                [`@media (max-width: ${breakPoints.xl}px)`]: {
                  fontSize: counterValue.toString().length >= 5 ? 45 : 50,
                },
              }}
            >
              {counterValue}
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
          {icon}

          <Box
            sx={{
              display: "flex",
            }}
          >
            {actions}
          </Box>
        </Box>
      </Box>
    </CounterCardMain>
  );
};

export default CounterCard;

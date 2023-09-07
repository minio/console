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
import { Box, Loader, NetworkPutIcon } from "mds";

const NetworkPutBase = styled.div(({ theme }) => ({
  "& .putLabel": {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: "10px",

    "& .min-icon": {
      height: 15,
      width: 15,
      fill: get(theme, "signalColors.info", "#2781B0"),
    },

    "& .putText": {
      fontSize: "18px",
      color: get(theme, "mutedText", "#87888d"),
      fontWeight: "bold",
    },
    "& .valueText": {
      fontSize: 50,
      fontFamily: "Inter",
      fontWeight: 600,
    },
  },
}));

const NetworkPutItem = ({
  value,
  loading,
}: {
  value: any;
  loading: boolean;
  title?: any;
  id?: number;
}) => {
  return (
    <NetworkPutBase>
      <Box className={"putLabel"}>
        <Box className={"putText"}>PUT</Box>
        {loading ? (
          <Loader style={{ width: "15px", height: "15px" }} />
        ) : (
          <NetworkPutIcon />
        )}
      </Box>
      <Box className={"valueText"}>{value}</Box>
    </NetworkPutBase>
  );
};

export default NetworkPutItem;

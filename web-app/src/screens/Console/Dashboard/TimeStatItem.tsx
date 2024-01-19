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
import { Box, Loader, SuccessIcon } from "mds";

const TimeStatBase = styled.div(({ theme }) => ({
  display: "grid",
  alignItems: "center",
  gap: 8,
  height: 33,
  paddingLeft: 15,
  gridTemplateColumns: "20px 1.5fr .5fr 20px",
  background: get(theme, "boxBackground", "#FBFAFA"), // #EBF9EE
  "& .min-icon": {
    height: "12px",
    width: "12px",
    fill: get(theme, "signalColors.good", "#4CCB92"),
  },
  "& .ok-icon": {
    height: "8px",
    width: "8px",
    fill: get(theme, "signalColors.good", "#4CCB92"),
    color: get(theme, "signalColors.good", "#4CCB92"),
  },
  "& .timeStatLabel": {
    fontSize: "12px",
    color: get(theme, "signalColors.good", "#4CCB92"),
    fontWeight: 600,
  },
  "& .timeStatValue": {
    fontSize: "12px",
    color: get(theme, "signalColors.good", "#4CCB92"),
  },
}));

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
    <TimeStatBase className="dashboard-time-stat-item">
      {loading ? <Loader style={{ width: 10, height: 10 }} /> : icon}
      <Box className={"timeStatLabel"}>{label}</Box>
      <Box className={"timeStatValue"}>{value}</Box>
      {value !== "n/a" ? <SuccessIcon className="ok-icon" /> : null}
    </TimeStatBase>
  );
};

export default TimeStatItem;

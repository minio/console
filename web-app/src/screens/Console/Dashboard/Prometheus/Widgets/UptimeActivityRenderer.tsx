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
import { Box } from "mds";
import TimeStatItem from "../../TimeStatItem";

type SimpleWidgetRenderProps = {
  valueToRender?: any;
  loading?: boolean;
  title?: any;
  id?: number;
  iconWidget?: any;
};
const UptimeActivityRenderer = ({
  valueToRender = "",
  loading = false,
  iconWidget = null,
}: SimpleWidgetRenderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: 47,
        borderRadius: 2,

        "& .dashboard-time-stat-item": {
          height: "100%",
          width: "100%",
        },
      }}
    >
      <TimeStatItem
        loading={loading}
        icon={iconWidget}
        label={<Box>Uptime</Box>}
        value={valueToRender}
      />
    </Box>
  );
};

export default UptimeActivityRenderer;

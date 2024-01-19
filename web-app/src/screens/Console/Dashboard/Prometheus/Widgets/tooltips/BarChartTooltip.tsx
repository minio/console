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
import { tooltipCommon } from "../../../../Common/FormComponents/common/styleLibrary";

const BarChartTooltip = ({
  active,
  payload,
  label,
  barChartConfiguration,
}: any) => {
  if (active) {
    return (
      <Box sx={tooltipCommon.customTooltip}>
        <Box sx={tooltipCommon.timeStampTitle}>{label}</Box>
        {payload &&
          payload.map((pl: any, index: number) => {
            return (
              <Box
                sx={tooltipCommon.labelContainer}
                key={`pltiem-${index}-${label}`}
              >
                <Box
                  sx={tooltipCommon.labelColor}
                  style={{
                    backgroundColor: barChartConfiguration[index].color,
                  }}
                />
                <Box
                  sx={{
                    ...tooltipCommon.itemValue,
                    "& span.valueContainer": {
                      ...tooltipCommon.valueContainer,
                    },
                  }}
                >
                  <span className={"valueContainer"}>{pl.value}</span>
                </Box>
              </Box>
            );
          })}
      </Box>
    );
  }

  return null;
};

export default BarChartTooltip;

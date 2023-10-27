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
import { getTimeFromTimestamp } from "../../../../../../common/utils";
import { tooltipCommon } from "../../../../Common/FormComponents/common/styleLibrary";

const LineChartTooltip = ({
  active,
  payload,
  label,
  linearConfiguration,
  yAxisFormatter,
}: any) => {
  if (active) {
    return (
      <Box sx={tooltipCommon.customTooltip}>
        <Box sx={tooltipCommon.timeStampTitle}>
          {getTimeFromTimestamp(label, true)}
        </Box>
        {payload &&
          payload.map((pl: any, index: number) => {
            return (
              <Box
                sx={tooltipCommon.labelContainer}
                key={`lbPl-${index}-${linearConfiguration[index].keyLabel}`}
              >
                <Box
                  sx={tooltipCommon.labelColor}
                  style={{
                    backgroundColor: linearConfiguration[index].lineColor,
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
                  <span className={"valueContainer"}>
                    {linearConfiguration[index].keyLabel}:{" "}
                    {yAxisFormatter(pl.value)}
                  </span>
                </Box>
              </Box>
            );
          })}
      </Box>
    );
  }

  return null;
};

export default LineChartTooltip;

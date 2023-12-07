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

import React, { Fragment } from "react";
import get from "lodash/get";
import styled from "styled-components";
import { Box, HelpTip } from "mds";
import { Cell, Pie, PieChart } from "recharts";

const ReportedUsageMain = styled.div(({ theme }) => ({
  maxHeight: "110px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "19px",

  padding: "10px",
  "& .unit-value": {
    fontSize: "50px",
    color: get(theme, "signalColors.main", "#07193E"),
  },
  "& .unit-type": {
    fontSize: "18px",
    color: get(theme, "mutedText", "#87888d"),
    marginTop: "20px",
    marginLeft: "5px",
  },

  "& .usage-label": {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: 600,
    marginRight: "20px",
    marginTop: "-10px",
    "& .min-icon": {
      marginLeft: "10px",
      height: 16,
      width: 16,
    },
  },
}));
export const usageClarifyingContent = (
  <Fragment>
    <div>
      <strong> Not what you expected?</strong>
      <br />
      This Usage value is comparable to <strong>mc du --versions</strong> which
      represents the size of all object versions that exist in the buckets.
      <br />
      Running{" "}
      <a
        target="_blank"
        href="https://min.io/docs/minio/linux/reference/minio-mc/mc-du.html"
      >
        mc du
      </a>{" "}
      without the <strong>--versions</strong> flag or{" "}
      <a target="_blank" href="https://man7.org/linux/man-pages/man1/df.1.html">
        df
      </a>{" "}
      will provide different values corresponding to the size of all{" "}
      <strong>current</strong> versions and the physical disk space occupied
      respectively.
    </div>
  </Fragment>
);

const ReportedUsage = ({
  usageValue,
  total,
  unit,
}: {
  usageValue: string;
  total: number | string;
  unit: string;
}) => {
  const plotValues = [
    { value: total, color: "#D6D6D6", label: "Free Space" },
    {
      value: usageValue,
      color: "#073052",
      label: "Used Space",
    },
  ];

  return (
    <ReportedUsageMain>
      <Box>
        <div className="usage-label">
          <span>Reported Usage</span>
        </div>

        <HelpTip content={usageClarifyingContent} placement="left">
          <label
            className={"unit-value"}
            style={{
              fontWeight: 600,
            }}
          >
            {total}
          </label>
          <label className={"unit-type"}>{unit}</label>
        </HelpTip>
      </Box>

      <Box>
        <Box sx={{ flex: 1 }}>
          <div
            style={{
              position: "relative",
              width: 105,
              height: 105,
              top: "-8px",
            }}
          >
            <div>
              <PieChart width={105} height={105}>
                <Pie
                  data={plotValues}
                  cx={"50%"}
                  cy={"50%"}
                  dataKey="value"
                  outerRadius={45}
                  innerRadius={35}
                  startAngle={-70}
                  endAngle={360}
                  animationDuration={1}
                >
                  {plotValues.map((entry, index) => (
                    <Cell key={`cellCapacity-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </Box>
      </Box>
    </ReportedUsageMain>
  );
};

export default ReportedUsage;

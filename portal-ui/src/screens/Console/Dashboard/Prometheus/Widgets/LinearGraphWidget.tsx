// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ILinearGraphConfiguration } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { niceBytes } from "../../../../../common/utils";

interface ILinearGraphWidget {
  classes: any;
  title: string;
  linearConfiguration: ILinearGraphConfiguration[];
  data: object[];
  hideYAxis?: boolean;
  yAxisFormatter?: (item: string) => string;
  xAxisFormatter?: (item: string) => string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
  });

const LinearGraphWidget = ({
  classes,
  title,
  linearConfiguration,
  data,
  hideYAxis = false,
  yAxisFormatter = (item: string) => item,
  xAxisFormatter = (item: string) => item,
}: ILinearGraphWidget) => {
  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      <div className={classes.contentContainer}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              tickFormatter={xAxisFormatter}
              interval={5}
              tick={{ fontSize: "70%", transform: "rotateZ(45)" }}
              tickCount={10}
            />
            <YAxis
              domain={[0, (dataMax) => dataMax * 4]}
              hide={hideYAxis}
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: "70%" }}
            />
            <Tooltip formatter={(item) => yAxisFormatter(item.toString())} />
            <Legend />
            {linearConfiguration.map((section, index) => {
              return (
                <Area
                  key={`area-${section.dataKey}-${index.toString()}`}
                  type="monotone"
                  dataKey={section.dataKey}
                  stroke={section.lineColor}
                  fill={section.fillColor}
                  fillOpacity={0.3}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default withStyles(styles)(LinearGraphWidget);

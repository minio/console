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
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Text,
  YAxis,
  Tooltip,
} from "recharts";
import { IBarChartConfiguration } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import BarChartTooltip from "./tooltips/BarChartTooltip";

interface IBarChartWidget {
  classes: any;
  title: string;
  barChartConfiguration: IBarChartConfiguration[];
  data: object[];
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
  });

const CustomizedAxisTick = ({ x, y, payload }: any) => {
  return (
    <text
      width={50}
      fontSize={"63%"}
      textAnchor="end"
      fill="#333"
      transform={`translate(${x},${y})`}
      dy={3}
    >
      {payload.value}
    </text>
  );
};

const BarChartWidget = ({
  classes,
  title,
  barChartConfiguration,
  data,
}: IBarChartWidget) => {
  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      <div className={classes.contentContainer}>
        <ResponsiveContainer>
          <BarChart data={data} layout={"vertical"} barCategoryGap={1}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              interval={0}
              tick={<CustomizedAxisTick />}
              tickLine={false}
              axisLine={false}
              width={150}
            />
            {barChartConfiguration.map((bar) => (
              <Bar
                key={`bar-${bar.dataKey}`}
                dataKey={bar.dataKey}
                fill={bar.color}
                background={bar.background}
              />
            ))}
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.3)" }}
              content={
                <BarChartTooltip
                  barChartConfiguration={barChartConfiguration}
                />
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default withStyles(styles)(BarChartWidget);

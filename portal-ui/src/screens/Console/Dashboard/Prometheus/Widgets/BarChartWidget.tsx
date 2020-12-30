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
import { Bar, BarChart, ResponsiveContainer, XAxis, Text } from "recharts";
import { IBarChartConfiguration } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";

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
    <g transform={`translate(${x},${y})`}>
      <Text
        width={50}
        scaleToFit
        textAnchor="middle"
        verticalAnchor="start"
        angle={0}
        fill="#333"
      >
        {payload.value}
      </Text>
    </g>
  );
};

const CustomLabel = ({ x, y, value, fill, width }: any) => {
  return (
    <text
      x={x + width / 2}
      y={y}
      dy={-4}
      fontSize="70%"
      fill={fill}
      textAnchor="middle"
    >
      {value}
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
          <BarChart data={data}>
            <XAxis dataKey="name" interval={0} tick={<CustomizedAxisTick />} />
            {barChartConfiguration.map((bar) => (
              <Bar
                key={`bar-${bar.dataKey}`}
                dataKey={bar.dataKey}
                fill={bar.color}
                label={<CustomLabel />}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default withStyles(styles)(BarChartWidget);

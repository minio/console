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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ILinearGraphConfiguration } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import LineChartTooltip from "./tooltips/LineChartTooltip";

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
    containerElements: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100% - 18px)",
    },
    chartCont: {
      position: "relative",
      flexGrow: 1,
      minHeight: "65%",
      height: 1,
    },
    legendChart: {
      display: "flex",
      flexWrap: "wrap",
      flex: "0 1 auto",
      maxHeight: "35%",
      margin: 0,
      overflowY: "auto",
      position: "relative",
      textAlign: "center",
    },
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
      <div className={classes.containerElements}>
        <div className={classes.chartCont}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: hideYAxis ? 20 : 5,
                bottom: 0,
              }}
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
                tick={{ fontSize: "70%" }}
                tickCount={10}
              />
              <YAxis
                domain={[0, (dataMax) => dataMax * 4]}
                hide={hideYAxis}
                tickFormatter={yAxisFormatter}
                tick={{ fontSize: "70%" }}
              />
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
              <Tooltip
                content={
                  <LineChartTooltip
                    linearConfiguration={linearConfiguration}
                    yAxisFormatter={yAxisFormatter}
                  />
                }
                wrapperStyle={{
                  zIndex: 5000,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={classes.legendChart}>
          {linearConfiguration.map((section, index) => {
            return (
              <div
                className={classes.singleLegendContainer}
                key={`legend-${section.keyLabel}-${index.toString()}`}
              >
                <div
                  className={classes.colorContainer}
                  style={{ backgroundColor: section.lineColor }}
                />
                <div className={classes.legendLabel}>{section.keyLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(LinearGraphWidget);

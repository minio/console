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
import get from "lodash/get";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { IPieChartConfiguration } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";

interface IPieChartWidget {
  classes: any;
  title: string;
  pieChartConfiguration: IPieChartConfiguration;
  dataInner: object[];
  dataOuter?: object[];
  middleLabel?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
  });

const PieChartWidget = ({
  classes,
  title,
  pieChartConfiguration,
  dataInner,
  dataOuter,
  middleLabel = "",
}: IPieChartWidget) => {
  const innerColors = get(pieChartConfiguration, "innerChart.colorList", []);
  const outerColors = get(pieChartConfiguration, "outerChart.colorList", []);

  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      <div className={classes.contentContainer}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 5, bottom: 5 }}>
            {dataOuter && (
              <Pie
                data={dataOuter}
                cx={"50%"}
                cy={"50%"}
                dataKey="value"
                innerRadius={get(
                  pieChartConfiguration,
                  "outerChart.innerRadius",
                  0
                )}
                outerRadius={get(
                  pieChartConfiguration,
                  "outerChart.outerRadius",
                  "80%"
                )}
                startAngle={get(
                  pieChartConfiguration,
                  "outerChart.startAngle",
                  0
                )}
                endAngle={get(
                  pieChartConfiguration,
                  "outerChart.endAngle",
                  360
                )}
                fill="#201763"
              >
                {dataOuter.map((entry, index) => (
                  <Cell
                    key={`cellOuter-${index}`}
                    fill={
                      typeof outerColors[index] == "undefined"
                        ? "#393939"
                        : outerColors[index]
                    }
                  />
                ))}
              </Pie>
            )}
            {dataInner && (
              <Pie
                data={dataInner}
                dataKey="value"
                cx={"50%"}
                cy={"50%"}
                innerRadius={get(
                  pieChartConfiguration,
                  "innerChart.innerRadius",
                  0
                )}
                outerRadius={get(
                  pieChartConfiguration,
                  "innerChart.outerRadius",
                  "80%"
                )}
                startAngle={get(
                  pieChartConfiguration,
                  "innerChart.startAngle",
                  0
                )}
                endAngle={get(
                  pieChartConfiguration,
                  "innerChart.endAngle",
                  360
                )}
                fill="#201763"
              >
                {dataInner.map((entry, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        typeof innerColors[index] == "undefined"
                          ? "#393939"
                          : innerColors[index]
                      }
                    />
                  );
                })}
              </Pie>
            )}
            {middleLabel && (
              <text
                x={"50%"}
                y={"50%"}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={600}
                fontSize={14}
              >
                {middleLabel}
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default withStyles(styles)(PieChartWidget);

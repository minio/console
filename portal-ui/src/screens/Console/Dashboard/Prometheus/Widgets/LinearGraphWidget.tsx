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

import React, { useEffect, useState } from "react";
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
import { IDashboardPanel } from "../types";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../../actions";
import api from "../../../../../common/api";
import { widgetDetailsToPanel } from "../utils";
import { CircularProgress } from "@material-ui/core";

interface ILinearGraphWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: MaterialUiPickersDate;
  timeEnd: MaterialUiPickersDate;
  displayErrorMessage: any;
  hideYAxis?: boolean;
  yAxisFormatter?: (item: string) => string;
  xAxisFormatter?: (item: string) => string;
  panelWidth?: number;
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
    loadingAlign: {
      margin: "auto",
    },
  });

const LinearGraphWidget = ({
  classes,
  title,
  displayErrorMessage,
  timeStart,
  timeEnd,
  panelItem,
  hideYAxis = false,
  yAxisFormatter = (item: string) => item,
  xAxisFormatter = (item: string) => item,
  panelWidth = 0,
}: ILinearGraphWidget) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<object[]>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  useEffect(() => {
    if (loading) {
      let stepCalc = 0;
      if (timeStart !== null && timeEnd !== null) {
        const secondsInPeriod = timeEnd.unix() - timeStart.unix();
        const periods = Math.floor(secondsInPeriod / 60);

        stepCalc = periods < 1 ? 15 : periods;
      }

      api
        .invoke(
          "GET",
          `/api/v1/admin/info/widgets/${panelItem.id}/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.unix()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.unix()}` : ""
          }`
        )
        .then((res: any) => {
          const widgetsWithValue = widgetDetailsToPanel(res, panelItem);
          setData(widgetsWithValue.data);
          setResult(widgetsWithValue);
          setLoading(false);
        })
        .catch((err) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage]);

  let intervalCount = 5;

  if (panelWidth !== 0) {
    if (panelWidth > 400) {
      intervalCount = 5;
    } else if (panelWidth > 350) {
      intervalCount = 10;
    } else if (panelWidth > 300) {
      intervalCount = 15;
    } else if (panelWidth > 250) {
      intervalCount = 20;
    } else {
      intervalCount = 30;
    }
  }

  const linearConfiguration = result
    ? (result?.widgetConfiguration as ILinearGraphConfiguration[])
    : [];

  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      <div className={classes.containerElements}>
        {loading && <CircularProgress className={classes.loadingAlign} />}
        {!loading && (
          <React.Fragment>
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
                    tickFormatter={(value: any) => xAxisFormatter(value)}
                    interval={intervalCount}
                    tick={{ fontSize: "70%" }}
                    tickCount={10}
                  />
                  <YAxis
                    domain={[0, (dataMax: number) => dataMax * 4]}
                    hide={hideYAxis}
                    tickFormatter={(value: any) => yAxisFormatter(value)}
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
                    <div className={classes.legendLabel}>
                      {section.keyLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(LinearGraphWidget));

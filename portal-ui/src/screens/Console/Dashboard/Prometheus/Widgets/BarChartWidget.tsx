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
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IBarChartConfiguration } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import BarChartTooltip from "./tooltips/BarChartTooltip";
import { setErrorSnackMessage } from "../../../../../actions";
import { connect } from "react-redux";
import { IDashboardPanel } from "../types";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import api from "../../../../../common/api";
import { widgetDetailsToPanel } from "../utils";
import { CircularProgress } from "@material-ui/core";

interface IBarChartWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: MaterialUiPickersDate;
  timeEnd: MaterialUiPickersDate;
  propLoading: boolean;
  displayErrorMessage: any;
  apiPrefix: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    loadingAlign: {
      width: "100%",
      paddingTop: "15px",
      textAlign: "center",
      margin: "auto",
    },
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
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  displayErrorMessage,
  apiPrefix,
}: IBarChartWidget) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);

  useEffect(() => {
    if (propLoading) {
      setLoading(true);
    }
  }, [propLoading]);

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
          `/api/v1/${apiPrefix}/info/widgets/${
            panelItem.id
          }/?step=${stepCalc}&${
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
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage, apiPrefix]);

  const barChartConfiguration = result
    ? (result.widgetConfiguration as IBarChartConfiguration[])
    : [];

  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      {loading && (
        <div className={classes.loadingAlign}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div className={classes.contentContainer}>
          <ResponsiveContainer>
            <BarChart
              data={data as object[]}
              layout={"vertical"}
              barCategoryGap={1}
            >
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
      )}
    </div>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(BarChartWidget));

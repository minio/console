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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { IBarChartConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import BarChartTooltip from "./tooltips/BarChartTooltip";
import { setErrorSnackMessage } from "../../../../../actions";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import api from "../../../../../common/api";
import { openZoomPage } from "../../actions";
import { useTheme } from "@mui/styles";

interface IBarChartWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  displayErrorMessage: any;
  apiPrefix: string;
  zoomActivated?: boolean;
  openZoomPage: typeof openZoomPage;
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

const CustomizedAxisTick = ({ y, payload }: any) => {
  return (
    <text
      width={50}
      fontSize={"63%"}
      textAnchor="start"
      fill="#333"
      transform={`translate(5,${y})`}
      fontWeight={700}
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
  zoomActivated = false,
  openZoomPage,
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
        .catch((err: ErrorResponseHandler) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage, apiPrefix]);

  const barChartConfiguration = result
    ? (result.widgetConfiguration as IBarChartConfiguration[])
    : [];

  let greatestIndex = 0;
  let currentValue = 0;

  if (barChartConfiguration.length === 1) {
    const dataGraph = barChartConfiguration[0];
    data.forEach((item: any, index: number) => {
      if (item[dataGraph.dataKey] > currentValue) {
        currentValue = item[dataGraph.dataKey];
        greatestIndex = index;
      }
    });
  }

  const theme = useTheme();
  const biggerThanMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div className={zoomActivated ? "" : classes.singleValueContainer}>
      {!zoomActivated && (
        <div className={classes.titleContainer}>
          {title}{" "}
          <button
            onClick={() => {
              openZoomPage(panelItem);
            }}
            className={classes.zoomChartIcon}
          >
            <ZoomOutMapIcon />
          </button>
        </div>
      )}
      {loading && (
        <div className={classes.loadingAlign}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div
          className={
            zoomActivated ? classes.zoomChartCont : classes.contentContainer
          }
        >
          <ResponsiveContainer width="99%">
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
                hide={!biggerThanMd}
              />
              {barChartConfiguration.map((bar) => (
                <Bar
                  key={`bar-${bar.dataKey}`}
                  dataKey={bar.dataKey}
                  fill={bar.color}
                  background={bar.background}
                  barSize={zoomActivated ? 25 : 12}
                >
                  {barChartConfiguration.length === 1 ? (
                    <Fragment>
                      {data.map((_: any, index: number) => (
                        <Cell
                          key={`chart-bar-${index.toString()}`}
                          fill={
                            index === greatestIndex
                              ? bar.greatestColor
                              : bar.color
                          }
                        />
                      ))}
                    </Fragment>
                  ) : null}
                </Bar>
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
  openZoomPage: openZoomPage,
});

export default withStyles(styles)(connector(BarChartWidget));

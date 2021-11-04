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
  Area,
  AreaChart,
  CartesianGrid,
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
import { ILinearGraphConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { setErrorSnackMessage } from "../../../../../actions";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import api from "../../../../../common/api";
import LineChartTooltip from "./tooltips/LineChartTooltip";
import { openZoomPage } from "../../actions";
import { useTheme } from "@mui/styles";

interface ILinearGraphWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  displayErrorMessage: any;
  apiPrefix: string;
  hideYAxis?: boolean;
  yAxisFormatter?: (item: string) => string;
  xAxisFormatter?: (item: string) => string;
  areaWidget?: boolean;
  zoomActivated?: boolean;
  openZoomPage: typeof openZoomPage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    containerElements: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      flexGrow: 1,
    },
    verticalAlignment: {
      flexDirection: "column",
    },
    chartCont: {
      position: "relative",
      height: 140,
      width: "100%",
    },
    legendChart: {
      display: "flex",
      flexDirection: "column",
      flex: "0 1 auto",
      maxHeight: 130,
      margin: 0,
      overflowY: "auto",
      position: "relative",
      textAlign: "center",
      width: "100%",
      justifyContent: "flex-start",
      color: "#404143",
      fontWeight: "bold",
      fontSize: 12,
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
  propLoading,
  panelItem,
  apiPrefix,
  hideYAxis = false,
  areaWidget = false,
  yAxisFormatter = (item: string) => item,
  xAxisFormatter = (item: string) => item,
  zoomActivated = false,
  openZoomPage,
}: ILinearGraphWidget) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<object[]>([]);
  const [dataMax, setDataMax] = useState<number>(0);
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
          let maxVal = 0;
          for (const dp of widgetsWithValue.data) {
            for (const key in dp) {
              if (key === "name") {
                continue;
              }
              const val = parseInt(dp[key]);
              if (maxVal < val) {
                maxVal = val;
              }
            }
          }
          setDataMax(maxVal);
        })
        .catch((err: ErrorResponseHandler) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage, apiPrefix]);

  let intervalCount = Math.floor(data.length / 5);

  const linearConfiguration = result
    ? (result?.widgetConfiguration as ILinearGraphConfiguration[])
    : [];

  const CustomizedDot = (prop: any) => {
    const { cx, cy, index } = prop;

    if (index % 3 !== 0) {
      return null;
    }
    return <circle cx={cx} cy={cy} r={3} strokeWidth={0} fill="#07264A" />;
  };

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
      <div
        className={
          zoomActivated ? classes.verticalAlignment : classes.containerElements
        }
      >
        {loading && <CircularProgress className={classes.loadingAlign} />}
        {!loading && (
          <React.Fragment>
            <div
              className={
                zoomActivated ? classes.zoomChartCont : classes.chartCont
              }
            >
              <ResponsiveContainer width="99%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 20,
                    left: hideYAxis ? 20 : 5,
                    bottom: 0,
                  }}
                >
                  {areaWidget && (
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#ABC8F2"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ABC8F2"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  )}
                  <CartesianGrid
                    strokeDasharray={areaWidget ? "0 0" : "3 3"}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                    stroke={"#07264A30"}
                    vertical={!areaWidget}
                  />
                  <XAxis
                    dataKey="name"
                    tickFormatter={(value: any) => xAxisFormatter(value)}
                    interval={intervalCount}
                    tick={{
                      fontSize: "70%",
                      fontWeight: "bold",
                      color: "#404143",
                    }}
                    tickCount={10}
                    stroke={"#082045"}
                  />
                  <YAxis
                    type={"number"}
                    domain={[0, dataMax * 1.1]}
                    hide={hideYAxis}
                    tickFormatter={(value: any) => yAxisFormatter(value)}
                    tick={{
                      fontSize: "70%",
                      fontWeight: "bold",
                      color: "#404143",
                    }}
                    stroke={"#082045"}
                  />
                  {linearConfiguration.map((section, index) => {
                    return (
                      <Area
                        key={`area-${section.dataKey}-${index.toString()}`}
                        type="monotone"
                        dataKey={section.dataKey}
                        stroke={section.lineColor}
                        fill={areaWidget ? "url(#colorUv)" : section.fillColor}
                        fillOpacity={areaWidget ? 0.3 : 0}
                        strokeWidth={areaWidget ? 0 : 2}
                        dot={areaWidget ? <CustomizedDot /> : false}
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
            {!areaWidget && (
              <Fragment>
                {zoomActivated && (
                  <Fragment>
                    <strong>Series</strong>
                    <br />
                    <br />
                  </Fragment>
                )}
                {biggerThanMd && (
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
                )}
              </Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
  openZoomPage: openZoomPage,
});

export default withStyles(styles)(connector(LinearGraphWidget));

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

import React, { Fragment, useEffect, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, useMediaQuery, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { ILinearGraphConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import api from "../../../../../common/api";
import LineChartTooltip from "./tooltips/LineChartTooltip";
import { useTheme } from "@mui/styles";
import Loader from "../../../Common/Loader/Loader";
import ExpandGraphLink from "./ExpandGraphLink";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { useAppDispatch } from "../../../../../store";
import DownloadWidgetDataButton from "../../DownloadWidgetDataButton";

interface ILinearGraphWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  apiPrefix: string;
  hideYAxis?: boolean;
  yAxisFormatter?: (item: string) => string;
  xAxisFormatter?: (item: string, var1: boolean, var2: boolean) => string;
  areaWidget?: boolean;
  zoomActivated?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
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
      width: 40,
      height: 40,
      textAlign: "center",
      margin: "15px auto",
    },
  });

const LinearGraphWidget = ({
  classes,
  title,
  timeStart,
  timeEnd,
  propLoading,
  panelItem,
  apiPrefix,
  hideYAxis = false,
  areaWidget = false,
  yAxisFormatter = (item: string) => item,
  xAxisFormatter = (item: string, var1: boolean, var2: boolean) => item,
  zoomActivated = false,
}: ILinearGraphWidget) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [hover, setHover] = useState<boolean>(false);
  const [data, setData] = useState<object[]>([]);
  const [dataMax, setDataMax] = useState<number>(0);
  const [result, setResult] = useState<IDashboardPanel | null>(null);

  const componentRef = useRef<HTMLElement>();

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
              let val = parseInt(dp[key]);

              if (isNaN(val)) {
                val = 0;
              }

              if (maxVal < val) {
                maxVal = val;
              }
            }
          }
          setDataMax(maxVal);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  let intervalCount = Math.floor(data.length / 5);

  const onHover = () => {
    setHover(true);
  };
  const onStopHover = () => {
    setHover(false);
  };

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

  let dspLongDate = false;

  if (zoomActivated) {
    dspLongDate = true;
  }

  return (
    <Box
      className={zoomActivated ? "" : classes.singleValueContainer}
      onMouseOver={onHover}
      onMouseLeave={onStopHover}
    >
      {!zoomActivated && (
        <Grid container alignItems={"left"}>
          <Grid item xs={10} alignItems={"start"}>
            <div className={classes.titleContainer}>{title}</div>
          </Grid>
          <Grid
            item
            xs={1}
            display={"flex"}
            justifyContent={"flex-end"}
            alignContent={"flex-end"}
          >
            {hover && <ExpandGraphLink panelItem={panelItem} />}
          </Grid>
          <Grid item xs={1} display={"flex"} justifyContent={"flex-end"}>
            <DownloadWidgetDataButton
              title={title}
              componentRef={componentRef}
              data={data}
            />
          </Grid>
        </Grid>
      )}
      <Box
        sx={
          zoomActivated
            ? { flexDirection: "column" }
            : {
                height: "100%",
                display: "grid",
                gridTemplateColumns: {
                  md: "1fr 1fr",
                  sm: "1fr",
                },
              }
        }
        style={areaWidget ? { gridTemplateColumns: "1fr" } : {}}
        ref={componentRef}
      >
        {loading && <Loader className={classes.loadingAlign} />}
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
                        <stop offset="0%" stopColor="#2781B0" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#ffffff"
                          stopOpacity={0}
                        />

                        <stop
                          offset="95%"
                          stopColor="#ffffff"
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    </defs>
                  )}
                  <CartesianGrid
                    strokeDasharray={areaWidget ? "2 2" : "5 5"}
                    strokeWidth={1}
                    strokeOpacity={1}
                    stroke={"#eee0e0"}
                    vertical={!areaWidget}
                  />
                  <XAxis
                    dataKey="name"
                    tickFormatter={(value: any) =>
                      xAxisFormatter(value, dspLongDate, true)
                    }
                    interval={intervalCount}
                    tick={{
                      fontSize: "68%",
                      fontWeight: "normal",
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
                      fontSize: "68%",
                      fontWeight: "normal",
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
                        isAnimationActive={false}
                        stroke={!areaWidget ? section.lineColor : "#D7E5F8"}
                        fill={areaWidget ? "url(#colorUv)" : section.fillColor}
                        fillOpacity={areaWidget ? 0.65 : 0}
                        strokeWidth={!areaWidget ? 3 : 0}
                        strokeLinecap={"round"}
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
      </Box>
    </Box>
  );
};

export default withStyles(styles)(LinearGraphWidget);

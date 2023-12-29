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

import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, breakPoints, Grid, Loader } from "mds";
import { ILinearGraphConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";
import api from "../../../../../common/api";
import LineChartTooltip from "./tooltips/LineChartTooltip";
import ExpandGraphLink from "./ExpandGraphLink";
import DownloadWidgetDataButton from "../../DownloadWidgetDataButton";

interface ILinearGraphWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
  hideYAxis?: boolean;
  yAxisFormatter?: (item: string) => string;
  xAxisFormatter?: (item: string, var1: boolean, var2: boolean) => string;
  areaWidget?: boolean;
  zoomActivated?: boolean;
}

const LinearGraphMain = styled.div(({ theme }) => ({
  ...widgetCommon(theme),
  "& .chartCont": {
    position: "relative",
    height: 140,
    width: "100%",
  },
  "& .legendChart": {
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
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: "bold",
    fontSize: 12,
    [`@media (max-width: ${breakPoints.md}px)`]: {
      display: "none",
    },
  },
  "& .loadingAlign": {
    width: 40,
    height: 40,
    textAlign: "center",
    margin: "15px auto",
  },
}));

const LinearGraphWidget = ({
  title,
  timeStart,
  timeEnd,
  panelItem,
  apiPrefix,
  hideYAxis = false,
  areaWidget = false,
  yAxisFormatter = (item: string) => item,
  xAxisFormatter = (item: string, var1: boolean, var2: boolean) => item,
  zoomActivated = false,
}: ILinearGraphWidget) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [data, setData] = useState<object[]>([]);
  const [csvData, setCsvData] = useState<object[]>([]);
  const [dataMax, setDataMax] = useState<number>(0);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

  const componentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
  }, [widgetVersion]);

  useEffect(() => {
    if (loading) {
      let stepCalc = 0;
      if (timeStart !== null && timeEnd !== null) {
        const secondsInPeriod =
          timeEnd.toUnixInteger() - timeStart.toUnixInteger();
        const periods = Math.floor(secondsInPeriod / 60);

        stepCalc = periods < 1 ? 15 : periods;
      }

      api
        .invoke(
          "GET",
          `/api/v1/${apiPrefix}/info/widgets/${
            panelItem.id
          }/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.toUnixInteger()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.toUnixInteger()}` : ""
          }`,
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

  useEffect(() => {
    const fmtData = data.map((el: any) => {
      const date = new Date(el?.name * 1000);
      return {
        ...el,
        name: date,
      };
    });

    setCsvData(fmtData);
  }, [data]);

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

  let dspLongDate = false;

  if (zoomActivated) {
    dspLongDate = true;
  }

  return (
    <LinearGraphMain>
      <Box
        className={zoomActivated ? "" : "singleValueContainer"}
        onMouseOver={onHover}
        onMouseLeave={onStopHover}
      >
        {!zoomActivated && (
          <Grid container>
            <Grid item xs={10} sx={{ alignItems: "start" }}>
              <Box className={"titleContainer"}>{title}</Box>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignContent: "flex-end",
              }}
            >
              {hover && <ExpandGraphLink panelItem={panelItem} />}
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              {componentRef !== null && (
                <DownloadWidgetDataButton
                  title={title}
                  componentRef={componentRef}
                  data={csvData}
                />
              )}
            </Grid>
          </Grid>
        )}
        <div ref={componentRef}>
          <Box
            sx={
              zoomActivated
                ? { flexDirection: "column" }
                : {
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    [`@media (max-width: ${breakPoints.md}px)`]: {
                      gridTemplateColumns: "1fr",
                    },
                  }
            }
            style={areaWidget ? { gridTemplateColumns: "1fr" } : {}}
          >
            {loading && <Loader className={"loadingAlign"} />}
            {!loading && (
              <Fragment>
                <Box className={zoomActivated ? "zoomChartCont" : "chartCont"}>
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
                          <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2781B0"
                              stopOpacity={1}
                            />
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
                            fill={
                              areaWidget ? "url(#colorUv)" : section.fillColor
                            }
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
                </Box>
                {!areaWidget && (
                  <Fragment>
                    {zoomActivated && (
                      <Fragment>
                        <strong>Series</strong>
                        <br />
                        <br />
                      </Fragment>
                    )}

                    <Box className={"legendChart"}>
                      {linearConfiguration.map((section, index) => {
                        return (
                          <Box
                            className={"singleLegendContainer"}
                            key={`legend-${
                              section.keyLabel
                            }-${index.toString()}`}
                          >
                            <Box
                              className={"colorContainer"}
                              style={{ backgroundColor: section.lineColor }}
                            />
                            <Box className={"legendLabel"}>
                              {section.keyLabel}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Box>
        </div>
      </Box>
    </LinearGraphMain>
  );
};

export default LinearGraphWidget;

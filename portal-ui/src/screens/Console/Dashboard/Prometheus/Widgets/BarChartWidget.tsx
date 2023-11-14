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
import { Box, breakPoints, Grid, Loader } from "mds";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IBarChartConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";
import ExpandGraphLink from "./ExpandGraphLink";
import DownloadWidgetDataButton from "../../DownloadWidgetDataButton";
import BarChartTooltip from "./tooltips/BarChartTooltip";
import api from "../../../../../common/api";

interface IBarChartWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
  zoomActivated?: boolean;
}

const BarChartMain = styled.div(({ theme }) => ({
  ...widgetCommon(theme),
  loadingAlign: {
    width: "100%",
    paddingTop: "15px",
    textAlign: "center",
    margin: "auto",
  },
}));

const CustomizedAxisTick = ({ y, payload }: any) => {
  return (
    <text
      width={50}
      fontSize={"69.7%"}
      textAnchor="start"
      fill="#333"
      transform={`translate(5,${y})`}
      fontWeight={400}
      dy={3}
    >
      {payload.value}
    </text>
  );
};

const BarChartWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  apiPrefix,
  zoomActivated = false,
}: IBarChartWidget) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [biggerThanMd, setBiggerThanMd] = useState<boolean>(
    window.innerWidth >= breakPoints.md,
  );

  const componentRef = useRef<HTMLElement>();
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

  const onHover = () => {
    setHover(true);
  };
  const onStopHover = () => {
    setHover(false);
  };

  useEffect(() => {
    setLoading(true);
  }, [widgetVersion]);

  useEffect(() => {
    const handleWindowResize = () => {
      let extMD = false;
      if (window.innerWidth >= breakPoints.md) {
        extMD = true;
      }
      setBiggerThanMd(extMD);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

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

  return (
    <BarChartMain>
      <Box
        className={zoomActivated ? "" : "singleValueContainer"}
        onMouseOver={onHover}
        onMouseLeave={onStopHover}
      >
        {!zoomActivated && (
          <Grid container>
            <Grid
              item
              xs={10}
              sx={{ alignItems: "start", justifyItems: "start" }}
            >
              <div className={"titleContainer"}>{title}</div>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              {hover && <ExpandGraphLink panelItem={panelItem} />}
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <DownloadWidgetDataButton
                title={title}
                componentRef={componentRef}
                data={data}
              />
            </Grid>
          </Grid>
        )}
        {loading && (
          <Box className={"loadingAlign"}>
            <Loader />
          </Box>
        )}
        {!loading && (
          <div
            ref={componentRef as React.RefObject<HTMLDivElement>}
            className={zoomActivated ? "zoomChartCont" : "contentContainer"}
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
                  style={{
                    fontSize: "12px",
                    fontWeight: 100,
                  }}
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
      </Box>
    </BarChartMain>
  );
};

export default BarChartWidget;

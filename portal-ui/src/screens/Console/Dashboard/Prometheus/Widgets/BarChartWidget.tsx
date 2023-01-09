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
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IBarChartConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import BarChartTooltip from "./tooltips/BarChartTooltip";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import api from "../../../../../common/api";
import { useTheme } from "@mui/styles";
import { Loader } from "mds";
import ExpandGraphLink from "./ExpandGraphLink";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";
import DownloadWidgetDataButton from "../../DownloadWidgetDataButton";
import { useSelector } from "react-redux";

interface IBarChartWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  apiPrefix: string;
  zoomActivated?: boolean;
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
  classes,
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  apiPrefix,
  zoomActivated = false,
}: IBarChartWidget) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  const [hover, setHover] = useState<boolean>(false);
  const componentRef = useRef<HTMLElement>();
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion
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

  const theme = useTheme();
  const biggerThanMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div
      className={zoomActivated ? "" : classes.singleValueContainer}
      onMouseOver={onHover}
      onMouseLeave={onStopHover}
    >
      {!zoomActivated && (
        <Grid container>
          <Grid item xs={10} alignItems={"start"} justifyItems={"start"}>
            <div className={classes.titleContainer}>{title}</div>
          </Grid>
          <Grid item xs={1} display={"flex"} justifyContent={"flex-end"}>
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
      {loading && (
        <div className={classes.loadingAlign}>
          <Loader />
        </div>
      )}
      {!loading && (
        <div
          ref={componentRef as React.RefObject<HTMLDivElement>}
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
    </div>
  );
};

export default withStyles(styles)(BarChartWidget);

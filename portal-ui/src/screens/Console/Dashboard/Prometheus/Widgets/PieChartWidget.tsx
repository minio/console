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
import get from "lodash/get";
import styled from "styled-components";
import { Box, Loader } from "mds";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import api from "../../../../../common/api";
import { IPieChartConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { splitSizeMetric, widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";

interface IPieChartWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
}

const PieChartMain = styled.div(({ theme }) => ({
  ...widgetCommon(theme),
  "& .loadingAlign": {
    width: "100%",
    paddingTop: "15px",
    textAlign: "center",
    margin: "auto",
  },
  "& .pieChartLabel": {
    fontSize: 60,
    color: get(theme, "signalColors.main", "#07193E"),
    fontWeight: "bold",
    width: "100%",
    "& .unitText": {
      color: get(theme, "mutedText", "#87888d"),
      fontSize: 12,
    },
  },
  "& .chartContainer": {
    width: "100%",
    height: 140,
  },
}));

const PieChartWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  apiPrefix,
}: IPieChartWidget) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataInner, setDataInner] = useState<object[]>([]);
  const [dataOuter, setDataOuter] = useState<object[]>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

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
          setDataInner(widgetsWithValue.data);
          setDataOuter(widgetsWithValue.dataOuter as object[]);
          setResult(widgetsWithValue);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  const pieChartConfiguration = result
    ? (result.widgetConfiguration as IPieChartConfiguration)
    : [];
  const middleLabel = result?.innerLabel;

  const innerColors = get(pieChartConfiguration, "innerChart.colorList", []);
  const outerColors = get(pieChartConfiguration, "outerChart.colorList", []);

  return (
    <PieChartMain>
      <Box className={"singleValueContainer"}>
        <Box className={"titleContainer"}>{title}</Box>
        {loading && (
          <Box className={"loadingAlign"}>
            <Loader />
          </Box>
        )}
        {!loading && (
          <Box className={"contentContainer"}>
            <span className={"pieChartLabel"}>
              {middleLabel && splitSizeMetric(middleLabel)}
            </span>
            <Box className={"chartContainer"}>
              <ResponsiveContainer width="99%">
                <PieChart margin={{ top: 5, bottom: 5 }}>
                  {dataOuter && (
                    <Pie
                      data={dataOuter as object[]}
                      cx={"50%"}
                      cy={"50%"}
                      dataKey="value"
                      innerRadius={get(
                        pieChartConfiguration,
                        "outerChart.innerRadius",
                        0,
                      )}
                      outerRadius={get(
                        pieChartConfiguration,
                        "outerChart.outerRadius",
                        "80%",
                      )}
                      startAngle={get(
                        pieChartConfiguration,
                        "outerChart.startAngle",
                        0,
                      )}
                      endAngle={get(
                        pieChartConfiguration,
                        "outerChart.endAngle",
                        360,
                      )}
                      fill="#201763"
                    >
                      {dataOuter.map((entry, index) => (
                        <Cell
                          key={`cellOuter-${index}`}
                          fill={
                            typeof outerColors[index] === "undefined"
                              ? "#393939"
                              : outerColors[index]
                          }
                        />
                      ))}
                    </Pie>
                  )}
                  {dataInner && (
                    <Pie
                      data={dataInner as object[]}
                      dataKey="value"
                      cx={"50%"}
                      cy={"50%"}
                      innerRadius={get(
                        pieChartConfiguration,
                        "innerChart.innerRadius",
                        0,
                      )}
                      outerRadius={get(
                        pieChartConfiguration,
                        "innerChart.outerRadius",
                        "80%",
                      )}
                      startAngle={get(
                        pieChartConfiguration,
                        "innerChart.startAngle",
                        0,
                      )}
                      endAngle={get(
                        pieChartConfiguration,
                        "innerChart.endAngle",
                        360,
                      )}
                      fill="#201763"
                    >
                      {dataInner.map((entry, index) => {
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              typeof innerColors[index] === "undefined"
                                ? "#393939"
                                : innerColors[index]
                            }
                          />
                        );
                      })}
                    </Pie>
                  )}
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </Box>
    </PieChartMain>
  );
};

export default PieChartWidget;

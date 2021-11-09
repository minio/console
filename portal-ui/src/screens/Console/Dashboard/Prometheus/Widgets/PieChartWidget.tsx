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
import { connect } from "react-redux";
import { CircularProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { IPieChartConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../../actions";
import { IDashboardPanel } from "../types";
import { splitSizeMetric, widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import get from "lodash/get";
import api from "../../../../../common/api";

interface IPieChartWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
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
    pieChartLabel: {
      fontSize: 60,
      color: "#07193E",
      fontWeight: "bold",
      width: "100%",
      "& .unitText": {
        color: "#767676",
        fontSize: 12,
      },
    },
    chartContainer: {
      width: "100%",
      height: 140,
    },
  });

const PieChartWidget = ({
  classes,
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  displayErrorMessage,
  apiPrefix,
}: IPieChartWidget) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataInner, setDataInner] = useState<object[]>([]);
  const [dataOuter, setDataOuter] = useState<object[]>([]);
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
          setDataInner(widgetsWithValue.data);
          setDataOuter(widgetsWithValue.dataOuter as object[]);
          setResult(widgetsWithValue);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage, apiPrefix]);

  const pieChartConfiguration = result
    ? (result.widgetConfiguration as IPieChartConfiguration)
    : [];
  const middleLabel = result?.innerLabel;

  const innerColors = get(pieChartConfiguration, "innerChart.colorList", []);
  const outerColors = get(pieChartConfiguration, "outerChart.colorList", []);

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
          <span className={classes.pieChartLabel}>
            {middleLabel && splitSizeMetric(middleLabel)}
          </span>
          <div className={classes.chartContainer}>
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
          </div>
        </div>
      )}
    </div>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(PieChartWidget));

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
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDataSRep } from "./types";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../../actions";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { CircularProgress } from "@mui/material";
import { ErrorResponseHandler } from "../../../../../common/types";
import api from "../../../../../common/api";
import { representationNumber } from "../../../../../common/utils";

interface ISingleRepWidget {
  classes: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  displayErrorMessage: any;
  color: string;
  fillColor: string;
  apiPrefix: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    loadingAlign: {
      width: "100%",
      paddingTop: "5px",
      textAlign: "center",
      margin: "auto",
    },
  });

const SingleRepWidget = ({
  classes,
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  displayErrorMessage,
  color,
  fillColor,
  apiPrefix,
}: ISingleRepWidget) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<IDataSRep[]>([]);
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
          setResult(widgetsWithValue);
          setData(widgetsWithValue.data);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage, apiPrefix]);
  const gradientID = `colorGradient-${title.split(" ").join("-")}`;

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
          <ResponsiveContainer width="99%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={1} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis
                domain={[0, (dataMax: number) => dataMax * 2]}
                hide={true}
              />
              <Area
                type="monotone"
                dataKey={"value"}
                stroke={color}
                fill={`url(#${gradientID})`}
                fillOpacity={1}
              />
              <text
                x={"0%"}
                y={"80%"}
                textAnchor="start"
                dominantBaseline="auto"
                fontWeight={700}
                fontSize={65}
                fill={"#07193E"}
              >
                {result
                  ? representationNumber(parseInt(result.innerLabel || "0"))
                  : ""}
              </text>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(SingleRepWidget));

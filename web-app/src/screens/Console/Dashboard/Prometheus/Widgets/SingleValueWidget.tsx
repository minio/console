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
import { useSelector } from "react-redux";
import { Box, Loader } from "mds";
import styled from "styled-components";
import get from "lodash/get";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { splitSizeMetric, widgetDetailsToPanel } from "../utils";
import { IDashboardPanel } from "../types";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";
import api from "../../../../../common/api";

interface ISingleValueWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
  renderFn?: (arg: Record<string, any>) => any;
}

const SingleValueWidgetMain = styled.div(({ theme }) => ({
  display: "flex",
  height: 140,
  flexDirection: "column",
  justifyContent: "center",
  "& .unitText": {
    color: get(theme, "mutedText", "#87888d"),
    fontSize: 12,
  },
  "& .loadingAlign": {
    width: "100%",
    textAlign: "center",
    margin: "auto",
  },
  "& .metric": {
    fontSize: 60,
    lineHeight: 1,
    color: get(theme, "signalColors.main", "#07193E"),
    fontWeight: 700,
  },
  "& .titleElement": {
    fontSize: 10,
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: 700,
  },
  ...widgetCommon(theme),
}));

const SingleValueWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  apiPrefix,
  renderFn,
}: ISingleValueWidget) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<string>("");
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
          setData(widgetsWithValue.data);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  const valueToRender = splitSizeMetric(data);

  if (renderFn) {
    return renderFn({ valueToRender, loading, title, id: panelItem.id });
  }
  return (
    <SingleValueWidgetMain>
      {loading && (
        <Box className={"loadingAlign"}>
          <Loader />
        </Box>
      )}
      {!loading && (
        <Fragment>
          <Box className={"metric"}>{splitSizeMetric(data)}</Box>
          <Box className={"titleElement"}>{title}</Box>
        </Fragment>
      )}
    </SingleValueWidgetMain>
  );
};

export default SingleValueWidget;

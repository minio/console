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
import styled from "styled-components";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { Loader } from "mds";
import api from "../../../../../common/api";
import { widgetDetailsToPanel } from "../utils";
import { IDashboardPanel } from "../types";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";

interface ISimpleWidget {
  iconWidget: any;
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
  renderFn?: undefined | null | ((arg: Record<string, any>) => any);
}

const SimpleWidgetMain = styled.span(({ theme }) => ({
  display: "inline-flex",
  color: get(theme, "signalColors.main", "#07193E"),
  alignItems: "center",
  "& .icon": {
    color: get(theme, "signalColors.main", "#07193E"),
    fill: get(theme, "signalColors.main", "#07193E"),
    marginRight: 5,
    marginLeft: 12,
  },
  "& .widgetLabel": {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: 10,
  },
  "& .widgetValue": {
    marginRight: 25,
  },
}));

const SimpleWidget = ({
  iconWidget,
  title,
  panelItem,
  timeStart,
  timeEnd,
  apiPrefix,
  renderFn,
}: ISimpleWidget) => {
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

  if (renderFn) {
    return renderFn({
      valueToRender: data,
      loading,
      title,
      id: panelItem.id,
      iconWidget: iconWidget,
    });
  }
  return (
    <Fragment>
      {loading && (
        <div className={"loadingAlign"}>
          <Loader />
        </div>
      )}
      {!loading && (
        <SimpleWidgetMain>
          <span className={"icon"}>{iconWidget ? iconWidget : null}</span>
          <span className={"widgetLabel"}>{title}: </span>
          <span className={"widgetValue"}>{data}</span>
        </SimpleWidgetMain>
      )}
    </Fragment>
  );
};

export default SimpleWidget;

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
import { connect, useSelector } from "react-redux";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { representationNumber } from "../../../../../common/utils";
import api from "../../../../../common/api";
import DashboardItemBox from "../../DashboardItemBox";
import BucketsCountItem from "./BucketsCountItem";
import ObjectsCountItem from "./ObjectsCountItem";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";

interface ISingleRepWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;

  color?: string;
  fillColor?: string;
  apiPrefix: string;
}

const SingleRepWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,

  apiPrefix,
}: ISingleRepWidget) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
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
          setResult(widgetsWithValue);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  let repNumber = "";

  if (result) {
    const resultRep = parseInt(result.innerLabel || "0");

    if (!isNaN(resultRep)) {
      repNumber = representationNumber(resultRep);
    } else {
      repNumber = "0";
    }
  }

  const renderById = (id: number) => {
    if (id === 66) {
      return (
        <DashboardItemBox>
          <BucketsCountItem
            loading={loading}
            title={title}
            value={result ? repNumber : ""}
          />
        </DashboardItemBox>
      );
    }
    if (id === 44) {
      return (
        <DashboardItemBox>
          <ObjectsCountItem
            loading={loading}
            title={title}
            value={result ? repNumber : ""}
          />
        </DashboardItemBox>
      );
    }

    return null;
  };

  return renderById(panelItem.id);
};

const connector = connect(null, {
  setErrorSnackMessage: setErrorSnackMessage,
});

export default connector(SingleRepWidget);

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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import api from "../../../../../common/api";
import { splitSizeMetric, widgetDetailsToPanel } from "../utils";
import { IDashboardPanel } from "../types";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../../actions";
import { CircularProgress } from "@mui/material";
import { ErrorResponseHandler } from "../../../../../common/types";

interface ISingleValueWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  displayErrorMessage: any;
  classes: any;
  apiPrefix: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    contentContainer: {
      ...widgetCommon.contentContainer,
      fontWeight: 700,
      color: "#072045",
      fontSize: 18,
      textAlign: "center" as const,
    },
    loadingAlign: {
      width: "100%",
      textAlign: "center",
      margin: "auto",
    },
    metric: {
      fontSize: 60,
      lineHeight: 1,
      color: "#07193E",
      fontWeight: 700,
    },
    titleElement: {
      fontSize: 10,
      color: "#767676",
      fontWeight: 700,
    },
    containerAlignment: {
      display: "flex",
      height: 140,
      flexDirection: "column",
      justifyContent: "center",
      "& .unitText": {
        color: "#767676",
        fontSize: 12,
      },
    },
  });

const SingleValueWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  displayErrorMessage,
  classes,
  apiPrefix,
}: ISingleValueWidget) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>("");

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
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, displayErrorMessage, apiPrefix]);
  return (
    <div className={classes.containerAlignment}>
      {loading && (
        <div className={classes.loadingAlign}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <Fragment>
          <div className={classes.metric}>{splitSizeMetric(data)}</div>
          <div className={classes.titleElement}>{title}</div>
        </Fragment>
      )}
    </div>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(SingleValueWidget));

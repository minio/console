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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { CircularProgress } from "@mui/material";
import api from "../../../../../common/api";
import { widgetDetailsToPanel } from "../utils";
import { IDashboardPanel } from "../types";
import { setErrorSnackMessage } from "../../../../../actions";
import { ErrorResponseHandler } from "../../../../../common/types";

interface ISimpleWidget {
  classes: any;
  iconWidget: any;
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
    mainWidgetContainer: {
      display: "inline-flex",
      color: "#072A4D",
      alignItems: "center",
    },
    icon: {
      color: "#072A4D",
      fill: "#072A4D",
      marginRight: 5,
      marginLeft: 12,
    },
    widgetLabel: {
      fontWeight: "bold",
      textTransform: "uppercase",
      marginRight: 10,
    },
    widgetValue: {
      marginRight: 25,
    },
  });

const SimpleWidget = ({
  classes,
  iconWidget,
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  displayErrorMessage,
  apiPrefix,
}: ISimpleWidget) => {
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
    <Fragment>
      {loading && (
        <div className={classes.loadingAlign}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <span className={classes.mainWidgetContainer}>
          <span className={classes.icon}>{iconWidget ? iconWidget : null}</span>
          <span className={classes.widgetLabel}>{title}: </span>
          <span className={classes.widgetValue}>{data}</span>
        </span>
      )}
    </Fragment>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(SimpleWidget));

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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import PrDashboard from "./Prometheus/PrDashboard";
import PageHeader from "../Common/PageHeader/PageHeader";
import Grid from "@material-ui/core/Grid";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import BasicDashboard from "./BasicDashboard/BasicDashboard";
import { LinearProgress } from "@material-ui/core";
import api from "../../../common/api";
import { Usage } from "./types";
import { setErrorSnackMessage } from "../../../actions";

interface IDashboardSimple {
  classes: any;
  displayErrorMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

const Dashboard = ({ classes, displayErrorMessage }: IDashboardSimple) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [basicResult, setBasicResult] = useState<Usage | null>(null);

  const fetchUsage = useCallback(() => {
    api
      .invoke("GET", `/api/v1/admin/info`)
      .then((res: Usage) => {
        setBasicResult(res);
        setLoading(false);
      })
      .catch((err) => {
        displayErrorMessage(err);
        setLoading(false);
      });
  }, [setBasicResult, setLoading, displayErrorMessage]);

  useEffect(() => {
    if (loading) {
      fetchUsage();
    }
  }, [loading, fetchUsage]);

  const widgets = get(basicResult, "widgets", null);

  return (
    <Fragment>
      <PageHeader label="Dashboard" />
      <Grid container>
        {loading ? (
          <Grid item xs={12} className={classes.container}>
            <LinearProgress />
          </Grid>
        ) : (
          <Fragment>
            {widgets !== null ? (
              <Grid container className={classes.container}>
                <PrDashboard />
              </Grid>
            ) : (
              <Grid container className={classes.container}>
                <BasicDashboard usage={basicResult} />
              </Grid>
            )}
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(Dashboard));

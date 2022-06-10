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

import get from "lodash/get";
import PrDashboard from "./Prometheus/PrDashboard";
import PageHeader from "../Common/PageHeader/PageHeader";
import Grid from "@mui/material/Grid";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import api from "../../../common/api";
import { Usage } from "./types";

import { ErrorResponseHandler } from "../../../common/types";
import BasicDashboard from "./BasicDashboard/BasicDashboard";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IDashboardSimple {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

const Dashboard = ({ classes }: IDashboardSimple) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [basicResult, setBasicResult] = useState<Usage | null>(null);

  const fetchUsage = useCallback(() => {
    api
      .invoke("GET", `/api/v1/admin/info`)
      .then((res: Usage) => {
        setBasicResult(res);
        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
        setLoading(false);
      });
  }, [setBasicResult, setLoading, dispatch]);

  useEffect(() => {
    if (loading) {
      fetchUsage();
    }
  }, [loading, fetchUsage]);

  const widgets = get(basicResult, "widgets", null);

  return (
    <Fragment>
      <PageHeader label="Metrics" />
      {loading ? (
        <Grid container>
          <Grid item xs={12} className={classes.container}>
            <LinearProgress />
          </Grid>
        </Grid>
      ) : (
        <Fragment>
          {widgets !== null ? (
            <PrDashboard />
          ) : (
            <BasicDashboard usage={basicResult} />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(Dashboard);

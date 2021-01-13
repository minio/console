// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useEffect, useState, Fragment } from "react";
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

interface IDashboardSimple {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

const Dashboard = ({ classes }: IDashboardSimple) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [basicResult, setBasicResult] = useState<Usage | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (loading) {
      fetchUsage();
    }
  }, [loading]);

  const fetchUsage = () => {
    api
      .invoke("GET", `/api/v1/admin/info`)
      .then((res: Usage) => {
        setBasicResult(res);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

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
              <PrDashboard />
            ) : (
              <BasicDashboard usage={basicResult} error={error} />
            )}
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(Dashboard);

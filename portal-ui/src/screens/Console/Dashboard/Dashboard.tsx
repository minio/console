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

import React, { Fragment } from "react";
import PrDashboard from "./Prometheus/PrDashboard";
import PageHeader from "../Common/PageHeader/PageHeader";
import Grid from "@material-ui/core/Grid";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

interface IDashboardSimple {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

const Dashboard = ({ classes }: IDashboardSimple) => {
  return (
    <Fragment>
      <PageHeader label="Dashboard" />
      <div className={classes.dashboardBG} />
      <Grid container className={classes.dashboardContainer}>
        <PrDashboard />
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(Dashboard);

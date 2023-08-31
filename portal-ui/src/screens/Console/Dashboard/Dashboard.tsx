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
import PrDashboard from "./Prometheus/PrDashboard";
import Grid from "@mui/material/Grid";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

import { AppState, useAppDispatch } from "../../../store";
import { getUsageAsync } from "./dashboardThunks";
import { useSelector } from "react-redux";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { selFeatures } from "../consoleSlice";
import HelpMenu from "../HelpMenu";
import { setHelpName } from "../../../systemSlice";
import { ProgressBar } from "mds";

interface IDashboardSimple {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader,
  });

const Dashboard = ({ classes }: IDashboardSimple) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  const usage = useSelector((state: AppState) => state.dashboard.usage);
  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");
  let hideMenu = false;
  if (features?.includes("hide-menu")) {
    hideMenu = true;
  } else if (obOnly) {
    hideMenu = true;
  }

  useEffect(() => {
    if (loading) {
      setLoading(false);
      dispatch(getUsageAsync());
    }
  }, [loading, dispatch]);

  useEffect(() => {
    dispatch(setHelpName("metrics"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {!hideMenu && (
        <PageHeaderWrapper label="Metrics" actions={<HelpMenu />} />
      )}
      {loading ? (
        <Grid container>
          <Grid item xs={12} className={classes.container}>
            <ProgressBar />
          </Grid>
        </Grid>
      ) : (
        <PrDashboard usage={usage} />
      )}
    </Fragment>
  );
};

export default withStyles(styles)(Dashboard);

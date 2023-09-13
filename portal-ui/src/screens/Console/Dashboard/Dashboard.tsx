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
import { Grid, ProgressBar } from "mds";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../store";
import { getUsageAsync } from "./dashboardThunks";
import { selFeatures } from "../consoleSlice";
import { setHelpName } from "../../../systemSlice";
import PrDashboard from "./Prometheus/PrDashboard";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const Dashboard = () => {
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
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        </Grid>
      ) : (
        <PrDashboard usage={usage} />
      )}
    </Fragment>
  );
};

export default Dashboard;

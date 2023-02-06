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
import InfoDashboard from "./InfoDashboard";
import { LinearProgress } from "@mui/material";
import { AppState, useAppDispatch } from "../../../store";
import { getUsageAsync } from "./dashboardThunks";
import { useSelector } from "react-redux";
import { PageHeader } from "mds";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  const usage = useSelector((state: AppState) => state.dashboard.usage);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      dispatch(getUsageAsync());
    }
  }, [loading, dispatch]);

  return (
    <Fragment>
      <PageHeader label="Metrics" />
      {loading ? <LinearProgress /> : <InfoDashboard usage={usage} />}
    </Fragment>
  );
};

export default Dashboard;

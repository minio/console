// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React from "react";
import Grid from "@mui/material/Grid";
import { Box, LinearProgress } from "@mui/material";
import { useAppDispatch } from "../../../store";
import PageLayout from "../Common/Layout/PageLayout";
import { Usage } from "./types";
import BasicDashboard from "./BasicDashboard/BasicDashboard";
import { Button, SyncIcon } from "mds";
import { getUsageAsync } from "./dashboardThunks";

interface IPrDashboard {
  usage: Usage | null;
}

const InfoDashboard = ({ usage }: IPrDashboard) => {
  const dispatch = useAppDispatch();

  return (
    <PageLayout>
      <Grid item xs={12}>
        <Box
          sx={{
            marginBottom: "20px",
          }}
        >
          <Grid container>
            <Grid item xs>
              <Grid container direction="row-reverse">
                <Grid item>
                  <Button
                    id={"sync"}
                    type="button"
                    variant="callAction"
                    onClick={() => {
                      dispatch(getUsageAsync());
                    }}
                    icon={<SyncIcon />}
                    label={"Sync"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {!usage && <LinearProgress />}
        {usage && <BasicDashboard usage={usage} />}
      </Grid>
    </PageLayout>
  );
};

export default InfoDashboard;

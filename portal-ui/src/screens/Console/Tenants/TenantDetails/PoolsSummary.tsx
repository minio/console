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

import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  actionsTray,
  containerForHeader,
  tableStyles,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";

import { AppState } from "../../../../store";

import PoolsListing from "./Pools/Details/PoolsListing";
import PoolDetails from "./Pools/Details/PoolDetails";
import BackLink from "../../../../common/BackLink";
import { setOpenPoolDetails } from "../tenantsSlice";

interface IPoolsSummary {
  classes: any;
  history: any;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...actionsTray,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const PoolsSummary = ({ classes, history, match }: IPoolsSummary) => {
  const dispatch = useDispatch();

  const selectedPool = useSelector(
    (state: AppState) => state.tenants.tenantDetails.selectedPool
  );
  const poolDetailsOpen = useSelector(
    (state: AppState) => state.tenants.tenantDetails.poolDetailsOpen
  );

  return (
    <Fragment>
      {poolDetailsOpen && (
        <Grid item xs={12}>
          <BackLink
            executeOnClick={() => {
              dispatch(setOpenPoolDetails(false));
            }}
            label={"Pools list"}
            to={match.url}
          />
        </Grid>
      )}
      <h1 className={classes.sectionTitle}>
        {poolDetailsOpen ? `Pool Details - ${selectedPool || ""}` : "Pools"}
      </h1>
      <Grid container>
        {poolDetailsOpen ? (
          <PoolDetails history={history} />
        ) : (
          <PoolsListing
            setPoolDetailsView={() => {
              dispatch(setOpenPoolDetails(true));
            }}
            history={history}
          />
        )}
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(PoolsSummary);

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
import { connect } from "react-redux";
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
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import {
  setOpenPoolDetails,
  setSelectedPool,
  setTenantDetailsLoad,
} from "../actions";
import PoolsListing from "./Pools/Details/PoolsListing";
import PoolDetails from "./Pools/Details/PoolDetails";
import BackLink from "../../../../common/BackLink";

interface IPoolsSummary {
  classes: any;
  loadingTenant: boolean;
  history: any;
  match: any;
  selectedPool: string | null;
  poolDetailsOpen: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
  setSelectedPool: typeof setSelectedPool;
  setOpenPoolDetails: typeof setOpenPoolDetails;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...actionsTray,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const PoolsSummary = ({
  classes,
  history,
  selectedPool,
  match,
  poolDetailsOpen,
  setOpenPoolDetails,
}: IPoolsSummary) => {
  return (
    <Fragment>
      {poolDetailsOpen && (
        <Grid item xs={12}>
          <BackLink
            executeOnClick={() => {
              setOpenPoolDetails(false);
            }}
            label={"Back to Pools list"}
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
              setOpenPoolDetails(true);
            }}
            history={history}
          />
        )}
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  selectedPool: state.tenants.tenantDetails.selectedPool,
  tenant: state.tenants.tenantDetails.tenantInfo,
  poolDetailsOpen: state.tenants.tenantDetails.poolDetailsOpen,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setTenantDetailsLoad,
  setSelectedPool,
  setOpenPoolDetails,
});

export default withStyles(styles)(connector(PoolsSummary));

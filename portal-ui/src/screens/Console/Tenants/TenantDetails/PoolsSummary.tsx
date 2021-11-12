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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  actionsTray,
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AddIcon } from "../../../../icons";
import { IPool, ITenant } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddPoolModal from "./AddPoolModal";
import InputAdornment from "@mui/material/InputAdornment";
import { AppState } from "../../../../store";
import { setTenantDetailsLoad } from "../actions";
import SearchIcon from "../../../../icons/SearchIcon";

interface IPoolsSummary {
  classes: any;
  tenant: ITenant | null;
  loadingTenant: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    redState: {
      color: theme.palette.error.main,
    },
    yellowState: {
      color: theme.palette.warning.main,
    },
    greenState: {
      color: theme.palette.success.main,
    },
    greyState: {
      color: "grey",
    },
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  });

const PoolsSummary = ({
  classes,
  tenant,
  loadingTenant,
  setTenantDetailsLoad,
}: IPoolsSummary) => {
  const [pools, setPools] = useState<IPool[]>([]);
  const [addPoolOpen, setAddPool] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (tenant) {
      const resPools = !tenant.pools ? [] : tenant.pools;
      setPools(resPools);
    }
  }, [tenant]);

  const onClosePoolAndRefresh = (reload: boolean) => {
    setAddPool(false);

    if (reload) {
      setTenantDetailsLoad(true);
    }
  };

  const filteredPools = pools.filter((pool) => {
    if (pool.name.toLowerCase().includes(filter.toLowerCase())) {
      return true;
    }

    return false;
  });

  return (
    <Fragment>
      {addPoolOpen && tenant !== null && (
        <AddPoolModal
          open={addPoolOpen}
          onClosePoolAndReload={onClosePoolAndRefresh}
          tenant={tenant}
        />
      )}

      <h1 className={classes.sectionTitle}>Pools</h1>
      <Grid container>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Filter"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
            onClick={() => {
              setAddPool(true);
            }}
          >
            Expand Tenant
          </Button>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>

        <Grid item xs={12}>
          <TableWrapper
            itemActions={[]}
            columns={[
              { label: "Name", elementKey: "name" },
              { label: "Capacity", elementKey: "capacity" },
              { label: "# of Instances", elementKey: "servers" },
              { label: "# of Drives", elementKey: "volumes" },
            ]}
            isLoading={loadingTenant}
            records={filteredPools}
            entityName="Servers"
            idField="name"
            customEmptyMessage="No Pools found"
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setTenantDetailsLoad,
});

export default withStyles(styles)(connector(PoolsSummary));

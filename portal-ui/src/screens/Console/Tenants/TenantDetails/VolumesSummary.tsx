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
import get from "lodash/get";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, InputAdornment, TextField } from "@mui/material";
import {
  actionsTray,
  containerForHeader,
  searchField,
  tableStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { IStoragePVCs } from "../../Storage/types";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import SearchIcon from "../../../../icons/SearchIcon";
import { IPodListElement } from "../ListTenants/types";
import withSuspense from "../../Common/Components/withSuspense";
import { setTenantDetailsLoad } from "../actions";
import { AppState } from "../../../../store";

const DeletePVC = withSuspense(React.lazy(() => import("./DeletePVC")));

interface ITenantVolumesProps {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  history: any;
  match: any;
  loadingTenant: boolean;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    tableWrapper: {
      height: "450px",
    },
    ...actionsTray,
    ...searchField,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const TenantVolumes = ({
  classes,
  setErrorSnackMessage,
  history,
  match,
  loadingTenant,
}: ITenantVolumesProps) => {
  const [records, setRecords] = useState<IStoragePVCs[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPVC, setSelectedPVC] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  useEffect(() => {
    if (loading) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/pvcs`
        )
        .then((res: IStoragePVCs) => {
          let volumes = get(res, "pvcs", []);
          setRecords(volumes ? volumes : []);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loading, setErrorSnackMessage, tenantName, tenantNamespace]);

  const confirmDeletePVC = (pvcItem: IStoragePVCs) => {
    const delPvc = {
      ...pvcItem,
      tenant: tenantName,
      namespace: tenantNamespace,
    };
    setSelectedPVC(delPvc);
    setDeleteOpen(true);
  };

  const filteredRecords: IStoragePVCs[] = records.filter((elementItem) =>
    elementItem.name.includes(filter)
  );

  const PVCViewAction = (PVC: IPodListElement) => {
    history.push(
      `/namespaces/${tenantNamespace}/tenants/${tenantName}/pvcs/${PVC.name}`
    );
    return;
  };

  const closeDeleteModalAndRefresh = (reloadData: boolean) => {
    setDeleteOpen(false);
    setLoading(true);
  };

  useEffect(() => {
    if (loadingTenant) {
      setLoading(true);
    }
  }, [loadingTenant]);

  return (
    <Fragment>
      {deleteOpen && (
        <DeletePVC
          deleteOpen={deleteOpen}
          selectedPVC={selectedPVC}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <h1 className={classes.sectionTitle}>Volumes</h1>
      <Grid item xs={12} className={classes.actionsTray}>
        <TextField
          placeholder="Search Volumes (PVCs)"
          className={classes.searchField}
          id="search-resource"
          label=""
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          variant="standard"
        />
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} className={classes.tableBlock}>
        <TableWrapper
          itemActions={[
            { type: "view", onClick: PVCViewAction },
            { type: "delete", onClick: confirmDeletePVC },
          ]}
          columns={[
            {
              label: "Name",
              elementKey: "name",
            },
            {
              label: "Status",
              elementKey: "status",
              width: 120,
            },
            {
              label: "Capacity",
              elementKey: "capacity",
              width: 120,
            },
            {
              label: "Storage Class",
              elementKey: "storageClass",
            },
          ]}
          isLoading={loading}
          records={filteredRecords}
          entityName="PVCs"
          idField="name"
          customPaperHeight={classes.tableWrapper}
        />
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(mapState, mapDispatchToProps);

export default withStyles(styles)(connector(TenantVolumes));

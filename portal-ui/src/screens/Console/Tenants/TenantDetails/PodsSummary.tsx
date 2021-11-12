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
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { niceDays } from "../../../../common/utils";
import { IPodListElement } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { AppState } from "../../../../store";
import { setTenantDetailsLoad } from "../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import DeletePod from "./DeletePod";

interface IPodsSummary {
  classes: any;
  match: any;
  history: any;
  loadingTenant: boolean;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const PodsSummary = ({
  classes,
  match,
  history,
  loadingTenant,
}: IPodsSummary) => {
  const [pods, setPods] = useState<IPodListElement[]>([]);
  const [loadingPods, setLoadingPods] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedPod, setSelectedPod] = useState<any>(null);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const podViewAction = (pod: IPodListElement) => {
    history.push(
      `/namespaces/${tenantNamespace}/tenants/${tenantName}/pods/${pod.name}`
    );
    return;
  };

  const closeDeleteModalAndRefresh = (reloadData: boolean) => {
    setDeleteOpen(false);
  };

  const confirmDeletePod = (pod: IPodListElement) => {
    pod.tenant = tenantName;
    pod.namespace = tenantNamespace;
    setSelectedPod(pod);
    setDeleteOpen(true);
  };

  const podTableActions = [
    { type: "view", onClick: podViewAction },
    { type: "delete", onClick: confirmDeletePod },
  ];

  useEffect(() => {
    if (loadingTenant) {
      setLoadingPods(true);
    }
  }, [loadingTenant]);

  useEffect(() => {
    if (loadingPods) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/pods`
        )
        .then((result: IPodListElement[]) => {
          for (let i = 0; i < result.length; i++) {
            let currentTime = (Date.now() / 1000) | 0;
            result[i].time = niceDays(
              (currentTime - parseInt(result[i].timeCreated)).toString()
            );
          }
          setPods(result);
          setLoadingPods(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage({
            errorMessage: "Error loading pods",
            detailedError: err.detailedError,
          });
        });
    }
  }, [loadingPods, tenantName, tenantNamespace]);

  return (
    <Fragment>
      {deleteOpen && (
        <DeletePod
          deleteOpen={deleteOpen}
          selectedPod={selectedPod}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <h1 className={classes.sectionTitle}>Pods</h1>
      <TableWrapper
        columns={[
          { label: "Name", elementKey: "name" },
          { label: "Status", elementKey: "status" },
          { label: "Age", elementKey: "time" },
          { label: "Pod IP", elementKey: "podIP" },
          {
            label: "Restarts",
            elementKey: "restarts",
            renderFunction: (input) => {
              return input !== null ? input : 0;
            },
          },
          { label: "Node", elementKey: "node" },
        ]}
        isLoading={loadingPods}
        records={pods}
        itemActions={podTableActions}
        entityName="Servers"
        idField="name"
      />
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(PodsSummary));

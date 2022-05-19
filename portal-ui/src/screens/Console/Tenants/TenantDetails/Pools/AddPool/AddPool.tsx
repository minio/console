// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { generatePoolName, niceBytes } from "../../../../../../common/utils";
import { LinearProgress } from "@mui/material";
import { IAddPoolRequest } from "../../../ListTenants/types";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import PageLayout from "../../../../Common/Layout/PageLayout";
import GenericWizard from "../../../../Common/GenericWizard/GenericWizard";
import { IWizardElement } from "../../../../Common/GenericWizard/types";
import history from "../../../../../../history";
import PoolResources from "./PoolResources";
import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";
import TenantsIcon from "../../../../../../icons/TenantsIcon";

import { AppState } from "../../../../../../store";
import { useDispatch, useSelector } from "react-redux";
import PoolConfiguration from "./PoolConfiguration";
import PoolPodPlacement from "./PoolPodPlacement";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { getDefaultAffinity, getNodeSelector } from "../../utils";
import api from "../../../../../../common/api";
import BackLink from "../../../../../../common/BackLink";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { resetPoolForm, setTenantDetailsLoad } from "../../../tenantsSlice";

interface IAddPoolProps {
  classes: any;
  open: boolean;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    bottomContainer: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      margin: "auto",
      justifyContent: "center",
      "& div": {
        width: 150,
        "@media (max-width: 900px)": {
          flexFlow: "column",
        },
      },
    },
    pageBox: {
      border: "1px solid #EAEAEA",
      borderTop: 0,
    },
    addPoolTitle: {
      border: "1px solid #EAEAEA",
      borderBottom: 0,
    },
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const requiredPages = ["setup", "affinity", "configure"];

const AddPool = ({ classes, open, match }: IAddPoolProps) => {
  const dispatch = useDispatch();

  const tenant = useSelector(
    (state: AppState) => state.tenants.tenantDetails.tenantInfo
  );
  const selectedStorageClass = useSelector(
    (state: AppState) => state.tenants.addPool.fields.setup.storageClass
  );
  const validPages = useSelector(
    (state: AppState) => state.tenants.addPool.validPages
  );
  const numberOfNodes = useSelector(
    (state: AppState) => state.tenants.addPool.fields.setup.numberOfNodes
  );
  const volumeSize = useSelector(
    (state: AppState) => state.tenants.addPool.fields.setup.volumeSize
  );
  const volumesPerServer = useSelector(
    (state: AppState) => state.tenants.addPool.fields.setup.volumesPerServer
  );
  const affinityType = useSelector(
    (state: AppState) => state.tenants.addPool.fields.affinity.podAffinity
  );
  const nodeSelectorLabels = useSelector(
    (state: AppState) =>
      state.tenants.addPool.fields.affinity.nodeSelectorLabels
  );
  const withPodAntiAffinity = useSelector(
    (state: AppState) =>
      state.tenants.addPool.fields.affinity.withPodAntiAffinity
  );
  const tolerations = useSelector(
    (state: AppState) => state.tenants.addPool.fields.tolerations
  );
  const securityContextEnabled = useSelector(
    (state: AppState) =>
      state.tenants.addPool.fields.configuration.securityContextEnabled
  );
  const securityContext = useSelector(
    (state: AppState) =>
      state.tenants.addPool.fields.configuration.securityContext
  );

  const [addSending, setAddSending] = useState<boolean>(false);

  const poolsURL = `/namespaces/${tenant?.namespace || ""}/tenants/${
    tenant?.name || ""
  }/pools`;

  useEffect(() => {
    if (addSending && tenant) {
      const poolName = generatePoolName(tenant.pools);

      let affinityObject = {};

      switch (affinityType) {
        case "default":
          affinityObject = {
            affinity: getDefaultAffinity(tenant.name, poolName),
          };
          break;
        case "nodeSelector":
          affinityObject = {
            affinity: getNodeSelector(
              nodeSelectorLabels,
              withPodAntiAffinity,
              tenant.name,
              poolName
            ),
          };
          break;
      }

      const tolerationValues = tolerations.filter(
        (toleration) => toleration.key.trim() !== ""
      );

      const data: IAddPoolRequest = {
        name: poolName,
        servers: numberOfNodes,
        volumes_per_server: volumesPerServer,
        volume_configuration: {
          size: volumeSize * 1073741824,
          storage_class_name: selectedStorageClass,
          labels: null,
        },
        tolerations: tolerationValues,
        securityContext: securityContextEnabled ? securityContext : null,
        ...affinityObject,
      };

      api
        .invoke(
          "POST",
          `/api/v1/namespaces/${tenant.namespace}/tenants/${tenant.name}/pools`,
          data
        )
        .then(() => {
          setAddSending(false);
          dispatch(resetPoolForm());
          dispatch(setTenantDetailsLoad(true));
          history.push(poolsURL);
        })
        .catch((err: ErrorResponseHandler) => {
          setAddSending(false);
          dispatch(setErrorSnackMessage(err));
        });
    }
  }, [
    addSending,
    poolsURL,
    affinityType,
    nodeSelectorLabels,
    numberOfNodes,
    securityContext,
    securityContextEnabled,
    selectedStorageClass,
    tenant,
    tolerations,
    volumeSize,
    volumesPerServer,
    withPodAntiAffinity,
    dispatch,
  ]);

  const cancelButton = {
    label: "Cancel",
    type: "other",
    enabled: true,
    action: () => {
      dispatch(resetPoolForm());
      history.push(poolsURL);
    },
  };

  const createButton = {
    label: "Create",
    type: "submit",
    enabled:
      !addSending &&
      selectedStorageClass !== "" &&
      requiredPages.every((v) => validPages.includes(v)),
    action: () => {
      setAddSending(true);
    },
  };

  const wizardSteps: IWizardElement[] = [
    {
      label: "Setup",
      componentRender: <PoolResources />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Configuration",
      advancedOnly: true,
      componentRender: <PoolConfiguration />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Pod Placement",
      advancedOnly: true,
      componentRender: <PoolPodPlacement />,
      buttons: [cancelButton, createButton],
    },
  ];

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader
          label={
            <Fragment>
              <BackLink to={poolsURL} label={`Tenant Pools`} />
            </Fragment>
          }
        />
        <PageLayout>
          <Grid item xs={12} className={classes.addPoolTitle}>
            <ScreenTitle
              icon={<TenantsIcon />}
              title={`Add New Pool to ${tenant?.name || ""}`}
              subTitle={
                <Fragment>
                  Namespace: {tenant?.namespace || ""} / Current Capacity:{" "}
                  {niceBytes((tenant?.total_size || 0).toString(10))}
                </Fragment>
              }
            />
          </Grid>

          {addSending && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
          <Grid item xs={12} className={classes.pageBox}>
            <GenericWizard wizardSteps={wizardSteps} />
          </Grid>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(AddPool);

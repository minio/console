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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import PageLayout from "../../../../Common/Layout/PageLayout";
import GenericWizard from "../../../../Common/GenericWizard/GenericWizard";
import api from "../../../../../../common/api";
import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";
import TenantsIcon from "../../../../../../icons/TenantsIcon";
import BackLink from "../../../../../../common/BackLink";
import EditPoolResources from "./EditPoolResources";
import EditPoolConfiguration from "./EditPoolConfiguration";
import EditPoolPlacement from "./EditPoolPlacement";
import history from "../../../../../../history";
import { IWizardElement } from "../../../../Common/GenericWizard/types";
import { LinearProgress } from "@mui/material";
import { generatePoolName, niceBytes } from "../../../../../../common/utils";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import {
  IEditPoolItem,
  IEditPoolRequest,
  ITenant,
} from "../../../ListTenants/types";
import {
  isPoolPageValid,
  resetPoolForm,
  setInitialPoolDetails,
  setPoolField,
  setTenantDetailsLoad,
} from "../../../actions";
import { AppState } from "../../../../../../store";
import {
  ErrorResponseHandler,
  ITolerationModel,
} from "../../../../../../common/types";
import { getDefaultAffinity, getNodeSelector } from "../../utils";
import { ISecurityContext } from "../../../types";
import { setErrorSnackMessage } from "../../../../../../actions";

interface IEditPoolProps {
  tenant: ITenant | null;
  classes: any;
  open: boolean;
  match: any;
  selectedStorageClass: string;
  selectedPool: string | null;
  validPages: string[];
  numberOfNodes: number;
  volumeSize: number;
  volumesPerServer: number;
  affinityType: string;
  nodeSelectorLabels: string;
  withPodAntiAffinity: boolean;
  securityContextEnabled: boolean;
  tolerations: ITolerationModel[];
  securityContext: ISecurityContext;
  resetPoolForm: typeof resetPoolForm;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
  setInitialPoolDetails: typeof setInitialPoolDetails;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
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
    factorElements: {
      display: "flex",
      justifyContent: "flex-start",
      marginLeft: 30,
    },
    sizeNumber: {
      fontSize: 35,
      fontWeight: 700,
      textAlign: "center",
    },
    sizeDescription: {
      fontSize: 14,
      color: "#777",
      textAlign: "center",
    },
    pageBox: {
      border: "1px solid #EAEAEA",
      borderTop: 0,
    },
    editPoolTitle: {
      border: "1px solid #EAEAEA",
      borderBottom: 0,
    },
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const requiredPages = ["setup", "affinity", "configure"];

const EditPool = ({
  tenant,
  classes,
  resetPoolForm,
  selectedPool,
  selectedStorageClass,
  validPages,
  numberOfNodes,
  volumeSize,
  affinityType,
  nodeSelectorLabels,
  withPodAntiAffinity,
  tolerations,
  securityContextEnabled,
  securityContext,
  volumesPerServer,
  setTenantDetailsLoad,
  setInitialPoolDetails,
  setErrorSnackMessage,
}: IEditPoolProps) => {
  const [editSending, setEditSending] = useState<boolean>(false);

  const poolsURL = `/namespaces/${tenant?.namespace || ""}/tenants/${
    tenant?.name || ""
  }/pools`;

  useEffect(() => {
    if (selectedPool) {
      const poolDetails = tenant?.pools.find(
        (pool) => pool.name === selectedPool
      );

      if (poolDetails) {
        setInitialPoolDetails(poolDetails);
      } else {
        history.push("/tenants");
      }
    }
  }, [selectedPool, setInitialPoolDetails, tenant]);

  useEffect(() => {
    if (editSending && tenant) {
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

      const cleanPools = tenant.pools
        .filter((pool) => pool.name !== selectedPool)
        .map((pool) => {
          let securityContextOption = null;

          if (pool.securityContext) {
            if (
              !!pool.securityContext.runAsUser ||
              !!pool.securityContext.runAsGroup ||
              !!pool.securityContext.fsGroup
            ) {
              securityContextOption = { ...pool.securityContext };
            }
          }

          const request: IEditPoolItem = {
            ...pool,
            securityContext: securityContextOption,
          };

          return request;
        });

      const data: IEditPoolRequest = {
        pools: [
          ...cleanPools,
          {
            name: selectedPool || poolName,
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
          },
        ],
      };

      api
        .invoke(
          "PUT",
          `/api/v1/namespaces/${tenant.namespace}/tenants/${tenant.name}/pools`,
          data
        )
        .then(() => {
          setEditSending(false);
          resetPoolForm();
          setTenantDetailsLoad(true);
          history.push(poolsURL);
        })
        .catch((err: ErrorResponseHandler) => {
          setEditSending(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    selectedPool,
    setErrorSnackMessage,
    editSending,
    poolsURL,
    resetPoolForm,
    setTenantDetailsLoad,
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
  ]);

  const cancelButton = {
    label: "Cancel",
    type: "other",
    enabled: true,
    action: () => {
      resetPoolForm();
      history.push(poolsURL);
    },
  };

  const createButton = {
    label: "Update",
    type: "submit",
    enabled:
      !editSending &&
      selectedStorageClass !== "" &&
      requiredPages.every((v) => validPages.includes(v)),
    action: () => {
      setEditSending(true);
    },
  };

  const wizardSteps: IWizardElement[] = [
    {
      label: "Pool Resources",
      componentRender: <EditPoolResources />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Configuration",
      advancedOnly: true,
      componentRender: <EditPoolConfiguration />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Pod Placement",
      advancedOnly: true,
      componentRender: <EditPoolPlacement />,
      buttons: [cancelButton, createButton],
    },
  ];

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader
          label={
            <Fragment>
              <BackLink to={poolsURL} label={`Pool Details`} />
            </Fragment>
          }
        />
        <PageLayout>
          <Grid item xs={12} className={classes.editPoolTitle}>
            <ScreenTitle
              icon={<TenantsIcon />}
              title={`Edit Pool - ${selectedPool}`}
              subTitle={
                <Fragment>
                  Namespace: {tenant?.namespace || ""} / Current Capacity:{" "}
                  {niceBytes((tenant?.total_size || 0).toString(10))} / Tenant:{" "}
                  {tenant?.name || ""}
                </Fragment>
              }
            />
          </Grid>

          {editSending && (
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

const mapState = (state: AppState) => {
  const editPool = state.tenants.editPool;
  return {
    tenant: state.tenants.tenantDetails.tenantInfo,
    selectedPool: state.tenants.tenantDetails.selectedPool,
    selectedStorageClass: editPool.fields.setup.storageClass,
    validPages: editPool.validPages,
    storageClasses: editPool.storageClasses,
    numberOfNodes: editPool.fields.setup.numberOfNodes,
    volumeSize: editPool.fields.setup.volumeSize,
    volumesPerServer: editPool.fields.setup.volumesPerServer,
    affinityType: editPool.fields.affinity.podAffinity,
    nodeSelectorLabels: editPool.fields.affinity.nodeSelectorLabels,
    withPodAntiAffinity: editPool.fields.affinity.withPodAntiAffinity,
    tolerations: editPool.fields.tolerations,
    securityContextEnabled:
      editPool.fields.configuration.securityContextEnabled,
    securityContext: editPool.fields.configuration.securityContext,
  };
};

const connector = connect(mapState, {
  resetPoolForm,
  setPoolField,
  isPoolPageValid,
  setErrorSnackMessage,
  setTenantDetailsLoad,
  setInitialPoolDetails,
});

export default withStyles(styles)(connector(EditPool));

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
import { Link, Redirect, Route, Router, Switch } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { setErrorSnackMessage, setSnackBarMessage } from "../../../../actions";
import {
  setTenantDetailsLoad,
  setTenantInfo,
  setTenantName,
  setTenantTab,
} from "../actions";
import { ITenant } from "../ListTenants/types";
import {
  containerForHeader,
  pageContentStyles,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { CircleIcon, TrashIcon } from "../../../../icons";
import { niceBytes } from "../../../../common/utils";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import EditIcon from "../../../../icons/EditIcon";
import RefreshIcon from "../../../../icons/RefreshIcon";
import TenantsIcon from "../../../../icons/TenantsIcon";
import PageLayout from "../../Common/Layout/PageLayout";
import BackLink from "../../../../common/BackLink";
import VerticalTabs from "../../Common/VerticalTabs/VerticalTabs";
import BoxIconButton from "../../Common/BoxIconButton/BoxIconButton";
import withSuspense from "../../Common/Components/withSuspense";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";

const TenantYAML = withSuspense(React.lazy(() => import("./TenantYAML")));
const TenantSummary = withSuspense(React.lazy(() => import("./TenantSummary")));
const TenantLicense = withSuspense(React.lazy(() => import("./TenantLicense")));
const PoolsSummary = withSuspense(React.lazy(() => import("./PoolsSummary")));
const PodsSummary = withSuspense(React.lazy(() => import("./PodsSummary")));
const TenantLogging = withSuspense(React.lazy(() => import("./TenantLogging")));
const TenantEvents = withSuspense(React.lazy(() => import("./TenantEvents")));
const VolumesSummary = withSuspense(
  React.lazy(() => import("./VolumesSummary"))
);
const TenantMetrics = withSuspense(React.lazy(() => import("./TenantMetrics")));
const TenantTrace = withSuspense(React.lazy(() => import("./TenantTrace")));
const TenantVolumes = withSuspense(
  React.lazy(() => import("./pvcs/TenantVolumes"))
);
const TenantSecurity = withSuspense(
  React.lazy(() => import("./TenantSecurity"))
);
const TenantEncryption = withSuspense(
  React.lazy(() => import("./TenantEncryption"))
);
const DeleteTenant = withSuspense(
  React.lazy(() => import("../ListTenants/DeleteTenant"))
);
const PodDetails = withSuspense(React.lazy(() => import("./pods/PodDetails")));
const TenantMonitoring = withSuspense(
  React.lazy(() => import("./TenantMonitoring"))
);

interface ITenantDetailsProps {
  classes: any;
  match: any;
  history: any;
  loadingTenant: boolean;
  currentTab: string;
  selectedTenant: string;
  tenantInfo: ITenant | null;
  selectedNamespace: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
  setTenantName: typeof setTenantName;
  setTenantInfo: typeof setTenantInfo;
  setTenantTab: typeof setTenantTab;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    pageContainer: {
      border: "1px solid #EAEAEA",
      width: "100%",
      height: "100%",
    },
    contentSpacer: {
      ...pageContentStyles.contentSpacer,
      minHeight: 400,
    },
    redState: {
      color: theme.palette.error.main,
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    yellowState: {
      color: theme.palette.warning.main,
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    greenState: {
      color: theme.palette.success.main,
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    greyState: {
      color: "grey",
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    healthStatusIcon: {
      position: "relative",
      fontSize: 10,
      left: 26,
      height: 10,
      top: 4,
    },
    ...containerForHeader(theme.spacing(4)),
    tenantActionButton: {
      "& span": {
        fontSize: 14,
        "@media (max-width: 900px)": {
          display: "none",
        },
      },
      "& .min-icon": {
        width: 12,
        marginLeft: 5,

        "@media (max-width: 900px)": {
          width: 16,
          marginLeft: 0,
        },
      },
    },
    deleteBtn: {
      color: "#f44336",
      border: "1px solid rgba(244, 67, 54, 0.5)",
    },
  });

const TenantDetails = ({
  classes,
  match,
  history,
  loadingTenant,
  currentTab,
  selectedTenant,
  tenantInfo,
  selectedNamespace,
  setErrorSnackMessage,
  setSnackBarMessage,
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
}: ITenantDetailsProps) => {
  const [yamlScreenOpen, setYamlScreenOpen] = useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!loadingTenant) {
      if (
        tenantName !== selectedTenant ||
        tenantNamespace !== selectedNamespace
      ) {
        setTenantName(tenantName, tenantNamespace);
        setTenantDetailsLoad(true);
      }
    }
  }, [
    loadingTenant,
    selectedTenant,
    selectedNamespace,
    setTenantDetailsLoad,
    setTenantInfo,
    setTenantName,
    tenantName,
    tenantNamespace,
  ]);

  useEffect(() => {
    if (loadingTenant) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}`
        )
        .then((res: ITenant) => {
          // add computed fields
          const resPools = !res.pools ? [] : res.pools;

          let totalInstances = 0;
          let totalVolumes = 0;
          let poolNamedIndex = 0;
          for (let pool of resPools) {
            const cap =
              pool.volumes_per_server *
              pool.servers *
              pool.volume_configuration.size;
            pool.label = `pool-${poolNamedIndex}`;
            if (pool.name === undefined || pool.name === "") {
              pool.name = pool.label;
            }
            pool.capacity = niceBytes(cap + "");
            pool.volumes = pool.servers * pool.volumes_per_server;
            totalInstances += pool.servers;
            totalVolumes += pool.volumes;
            poolNamedIndex += 1;
          }
          res.total_instances = totalInstances;
          res.total_volumes = totalVolumes;

          setTenantInfo(res);
          setTenantDetailsLoad(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setTenantDetailsLoad(false);
        });
    }
  }, [
    loadingTenant,
    tenantNamespace,
    tenantName,
    setTenantInfo,
    setTenantDetailsLoad,
    setErrorSnackMessage,
  ]);

  const path = get(match, "path", "/");
  const splitSections = path.split("/");

  let highlightedTab = splitSections[splitSections.length - 1] || "summary";
  if (highlightedTab === ":podName" || highlightedTab === "pods") {
    // It has SUB Route
    highlightedTab = "pods";
  }
  const [activeTab, setActiveTab] = useState(highlightedTab);

  useEffect(() => {
    setActiveTab(highlightedTab);
  }, [highlightedTab]);

  const editYaml = () => {
    setYamlScreenOpen(true);
  };

  const closeYAMLModalAndRefresh = () => {
    setYamlScreenOpen(false);
    setTenantDetailsLoad(true);
  };

  const getRoutePath = (newValue: string) => {
    return `/namespaces/${tenantNamespace}/tenants/${tenantName}/${newValue}`;
  };

  const confirmDeleteTenant = () => {
    setDeleteOpen(true);
  };

  const closeDeleteModalAndRefresh = (reloadData: boolean) => {
    setDeleteOpen(false);

    if (reloadData) {
      setSnackBarMessage("Tenant Deleted");
      history.push(`/tenants`);
    }
  };

  const healthStatusToClass = (health_status: string) => {
    return health_status === "red"
      ? classes.redState
      : health_status === "yellow"
      ? classes.yellowState
      : health_status === "green"
      ? classes.greenState
      : classes.greyState;
  };

  return (
    <Fragment>
      {yamlScreenOpen && (
        <TenantYAML
          open={yamlScreenOpen}
          closeModalAndRefresh={closeYAMLModalAndRefresh}
          tenant={tenantName}
          namespace={tenantNamespace}
        />
      )}
      {deleteOpen && tenantInfo !== null && (
        <DeleteTenant
          deleteOpen={deleteOpen}
          selectedTenant={tenantInfo}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader
        label={
          <Fragment>
            <Link to={"/tenants"} className={classes.breadcrumLink}>
              Tenants
            </Link>
          </Fragment>
        }
      />
      <BackLink to={"/tenants"} label={"Return to Tenants"} />
      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <div className={classes.healthStatusIcon}>
                  {tenantInfo && tenantInfo.status && (
                    <span
                      className={healthStatusToClass(
                        tenantInfo.status.health_status
                      )}
                    >
                      <CircleIcon />
                    </span>
                  )}
                </div>
                <TenantsIcon />
              </Fragment>
            }
            title={match.params["tenantName"]}
            subTitle={
              <Fragment>
                Namespace: {tenantNamespace} / Capacity:{" "}
                {niceBytes((tenantInfo?.total_size || 0).toString(10))}
              </Fragment>
            }
            actions={
              <div>
                <BoxIconButton
                  tooltip={"Delete"}
                  variant="outlined"
                  aria-label="Delete"
                  onClick={() => {
                    confirmDeleteTenant();
                  }}
                  color="secondary"
                  classes={{
                    root: `${classes.tenantActionButton} ${classes.deleteBtn}`,
                  }}
                  size="large"
                >
                  <span>Delete Tenant</span> <TrashIcon />
                </BoxIconButton>
                <BoxIconButton
                  classes={{
                    root: classes.tenantActionButton,
                  }}
                  tooltip={"Edit YAML"}
                  color="primary"
                  variant="outlined"
                  aria-label="Edit YAML"
                  onClick={() => {
                    editYaml();
                  }}
                  size="large"
                >
                  <span>Edit Tenant</span>
                  <EditIcon />
                </BoxIconButton>
                <BoxIconButton
                  classes={{
                    root: classes.tenantActionButton,
                  }}
                  tooltip={"Refresh"}
                  color="primary"
                  variant="outlined"
                  aria-label="Refresh List"
                  onClick={() => {
                    setTenantDetailsLoad(true);
                  }}
                >
                  <span>Reload</span> <RefreshIcon />
                </BoxIconButton>
              </div>
            }
          />
        </Grid>

        <VerticalTabs
          selectedTab={activeTab}
          isRouteTabs
          routes={
            <div className={classes.contentSpacer}>
              <Router history={history}>
                <Switch>
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_SUMMARY}
                    component={TenantSummary}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_METRICS}
                    component={TenantMetrics}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_TRACE}
                    component={TenantTrace}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_SECURITY}
                    component={TenantSecurity}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_ENCRYPTION}
                    component={TenantEncryption}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_POOLS}
                    component={PoolsSummary}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_PODS}
                    component={PodDetails}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_PODS_LIST}
                    component={PodsSummary}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_PVCS}
                    component={TenantVolumes}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_VOLUMES}
                    component={VolumesSummary}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_LICENSE}
                    component={TenantLicense}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_MONITORING}
                    component={TenantMonitoring}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_LOGGING}
                    component={TenantLogging}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT_EVENTS}
                    component={TenantEvents}
                  />
                  <Route
                    path={IAM_PAGES.NAMESPACE_TENANT}
                    component={() => (
                      <Redirect
                        to={`/namespaces/${tenantNamespace}/tenants/${tenantName}/summary`}
                      />
                    )}
                  />
                </Switch>
              </Router>
            </div>
          }
        >
          {{
            tabConfig: {
              label: "Summary",
              value: "summary",
              component: Link,
              to: getRoutePath("summary"),
            },
          }}
          {{
            tabConfig: {
              label: "Metrics",
              value: "metrics",
              component: Link,
              to: getRoutePath("metrics"),
            },
          }}
          {{
            tabConfig: {
              label: "Security",
              value: "security",
              component: Link,
              to: getRoutePath("security"),
            },
          }}
          {{
            tabConfig: {
              label: "Encryption",
              value: "encryption",
              component: Link,
              to: getRoutePath("encryption"),
            },
          }}
          {{
            tabConfig: {
              label: "Pools",
              value: "pools",
              component: Link,
              to: getRoutePath("pools"),
            },
          }}
          {{
            tabConfig: {
              label: "Pods",
              value: "pods",
              component: Link,
              to: getRoutePath("pods"),
            },
          }}

          {{
            tabConfig: {
              label: "Monitoring",
              value: "monitoring",
              component: Link,
              to: getRoutePath("monitoring"),
            },
          }}
          {{
            tabConfig: {
              label: "Logging",
              value: "logging",
              component: Link,
              to: getRoutePath("logging"),
            },
          }}
          {{
            tabConfig: {
              label: "Volumes",
              value: "volumes",
              component: Link,
              to: getRoutePath("volumes"),
            },
          }}
          {{
            tabConfig: {
              label: "Events",
              value: "events",
              component: Link,
              to: getRoutePath("events"),
            },
          }}
          {{
            tabConfig: {
              label: "License",
              value: "license",
              component: Link,
              to: getRoutePath("license"),
            },
          }}
        </VerticalTabs>
      </PageLayout>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  currentTab: state.tenants.tenantDetails.currentTab,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  selectedNamespace: state.tenants.tenantDetails.currentNamespace,
  tenantInfo: state.tenants.tenantDetails.tenantInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setSnackBarMessage,
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
});

export default withStyles(styles)(connector(TenantDetails));

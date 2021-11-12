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
import { Box, Tab, Tabs, Tooltip } from "@mui/material";
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
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import PageHeader from "../../Common/PageHeader/PageHeader";
import TenantYAML from "./TenantYAML";
import TenantSummary from "./TenantSummary";
import TenantLicense from "./TenantLicense";
import PoolsSummary from "./PoolsSummary";
import PodsSummary from "./PodsSummary";
import VolumesSummary from "./VolumesSummary";
import TenantMetrics from "./TenantMetrics";
import TenantSecurity from "./TenantSecurity";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { CircleIcon, DeleteIcon } from "../../../../icons";
import DeleteTenant from "../ListTenants/DeleteTenant";
import PodDetails from "./pods/PodDetails";
import { niceBytes } from "../../../../common/utils";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import EditIcon from "../../../../icons/EditIcon";
import RefreshIcon from "../../../../icons/RefreshIcon";
import TenantsIcon from "../../../../icons/TenantsIcon";
import BoxIconButton from "../../Common/BoxIconButton/BoxIconButton";

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
    redState: {
      color: theme.palette.error.main,
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16,
      },
    },
    yellowState: {
      color: theme.palette.warning.main,
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16,
      },
    },
    greenState: {
      color: theme.palette.success.main,
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16,
      },
    },
    greyState: {
      color: "grey",
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16,
      },
    },
    healthStatusIcon: {
      position: "relative",
      fontSize: 10,
      left: 26,
      height: 10,
      bottom: 16,
    },
    ...containerForHeader(theme.spacing(4)),
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

  useEffect(() => {
    const path = get(match, "path", "/");
    const splitSections = path.split("/");
    const section = splitSections[splitSections.length - 1];

    switch (section) {
      case "pools":
      case "pods":
      case ":podName":
      case "volumes":
      case "metrics":
      case "license":
      case "security":
        setTenantTab(section);
        break;
      default:
        setTenantTab("summary");
    }
  }, [match, setTenantTab]);

  const editYaml = () => {
    setYamlScreenOpen(true);
  };

  const closeYAMLModalAndRefresh = () => {
    setYamlScreenOpen(false);
    setTenantDetailsLoad(true);
  };

  const changeRoute = (newValue: string) => {
    setTenantTab(newValue);
    history.push(
      `/namespaces/${tenantNamespace}/tenants/${tenantName}/${newValue}`
    );
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

  interface ListMenuItem {
    label: string;
    value: string;
    onclick: (val: string) => void;
    selected: () => boolean;
  }

  const menu: ListMenuItem[] = [
    {
      label: "Summary",
      value: "summary",
      onclick: (val) => {
        changeRoute(val);
      },
      selected: () => {
        return currentTab === "summary";
      },
    },
    {
      label: "Metrics",
      value: "metrics",
      onclick: (val) => {
        changeRoute("metrics");
      },
      selected: () => {
        return currentTab === "metrics";
      },
    },
    {
      label: "Security",
      value: "security",
      onclick: (val) => {
        changeRoute("security");
      },
      selected: () => {
        return currentTab === "security";
      },
    },
    {
      label: "Pools",
      value: "pools",
      onclick: (val) => {
        changeRoute("pools");
      },
      selected: () => {
        return currentTab === "pools";
      },
    },
    {
      label: "Pods",
      value: "pods",
      onclick: (val) => {
        changeRoute("pods");
      },
      selected: () => {
        return currentTab === "pods" || currentTab === ":podName";
      },
    },
    {
      label: "Volumes",
      value: "volumes",
      onclick: (val) => {
        changeRoute("volumes");
      },
      selected: () => {
        return currentTab === "volumes";
      },
    },
    {
      label: "License",
      value: "license",
      onclick: (val) => {
        changeRoute("license");
      },
      selected: () => {
        return currentTab === "license";
      },
    },
  ];

  let value = menu[0].value;
  for (const mli of menu) {
    if (mli.selected()) {
      value = mli.value;
      break;
    }
  }

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
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <TenantsIcon width={40} />
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
                <Tooltip title={"Delete"}>
                  <BoxIconButton
                    color="primary"
                    aria-label="Delete"
                    onClick={() => {
                      confirmDeleteTenant();
                    }}
                    size="large"
                  >
                    <DeleteIcon />
                  </BoxIconButton>
                </Tooltip>
                <Tooltip title={"Edit YAML"}>
                  <BoxIconButton
                    color="primary"
                    aria-label="Edit YAML"
                    onClick={() => {
                      editYaml();
                    }}
                    size="large"
                  >
                    <EditIcon />
                  </BoxIconButton>
                </Tooltip>
                <Tooltip title={"Refresh"}>
                  <BoxIconButton
                    color="primary"
                    aria-label="Refresh List"
                    onClick={() => {
                      setTenantDetailsLoad(true);
                    }}
                  >
                    <RefreshIcon />
                  </BoxIconButton>
                </Tooltip>
              </div>
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Box display={{ xs: "none", sm: "none", md: "block" }}>
            <List component="nav" dense={true}>
              {menu.map((mli) => {
                return (
                  <ListItem
                    button
                    selected={mli.selected()}
                    onClick={() => {
                      mli.onclick(mli.value);
                    }}
                  >
                    <ListItemText primary={mli.label} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box display={{ xs: "block", sm: "block", md: "none" }}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {menu.map((mli) => {
                return (
                  <Tab
                    label={mli.label}
                    value={mli.value}
                    onClick={() => {
                      mli.onclick(mli.value);
                    }}
                  />
                );
              })}
            </Tabs>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <Router history={history}>
            <Switch>
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/summary"
                component={TenantSummary}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/metrics"
                component={TenantMetrics}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/security"
                component={TenantSecurity}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/pools"
                component={PoolsSummary}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/pods/:podName"
                component={PodDetails}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/pods"
                component={PodsSummary}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/volumes"
                component={VolumesSummary}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName/license"
                component={TenantLicense}
              />
              <Route
                path="/namespaces/:tenantNamespace/tenants/:tenantName"
                component={() => (
                  <Redirect
                    to={`/namespaces/${tenantNamespace}/tenants/${tenantName}/summary`}
                  />
                )}
              />
            </Switch>
          </Router>
        </Grid>
      </Grid>
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

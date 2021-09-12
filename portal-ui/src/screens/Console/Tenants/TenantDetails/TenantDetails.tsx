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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip } from "@material-ui/core";
import get from "lodash/get";
import Grid from "@material-ui/core/Grid";
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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { CircleIcon, DeleteIcon } from "../../../../icons";
import DeleteTenant from "../ListTenants/DeleteTenant";
import PodDetails from "./pods/PodDetails";
import { niceBytes } from "../../../../common/utils";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import EditIcon from "../../../../icons/EditIcon";
import RefreshIcon from "../../../../icons/RefreshIcon";
import TenantsIcon from "../../../../icons/TenantsIcon";

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
              <Fragment>
                <Tooltip title={"Delete"}>
                  <IconButton
                    color="primary"
                    aria-label="Delete"
                    component="span"
                    onClick={() => {
                      confirmDeleteTenant();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Edit YAML"}>
                  <IconButton
                    color="primary"
                    aria-label="Edit YAML"
                    component="span"
                    onClick={() => {
                      editYaml();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Refresh"}>
                  <IconButton
                    color="primary"
                    aria-label="Refresh List"
                    component="span"
                    onClick={() => {
                      setTenantDetailsLoad(true);
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Grid>
        <Grid item xs={2}>
          <List component="nav" dense={true}>
            <ListItem
              button
              selected={currentTab === "summary"}
              onClick={() => {
                changeRoute("summary");
              }}
            >
              <ListItemText primary="Summary" />
            </ListItem>
            <ListItem
              button
              selected={currentTab === "metrics"}
              onClick={() => {
                changeRoute("metrics");
              }}
            >
              <ListItemText primary="Metrics" />
            </ListItem>
            <ListItem
              button
              selected={currentTab === "security"}
              onClick={() => {
                changeRoute("security");
              }}
            >
              <ListItemText primary="Security" />
            </ListItem>
            <ListItem
              button
              selected={currentTab === "pools"}
              onClick={() => {
                changeRoute("pools");
              }}
            >
              <ListItemText primary="Pools" />
            </ListItem>
            <ListItem
              button
              selected={currentTab === "pods" || currentTab === ":podName"}
              onClick={() => {
                changeRoute("pods");
              }}
            >
              <ListItemText primary="Pods" />
            </ListItem>
            <ListItem
              button
              selected={currentTab === "volumes"}
              onClick={() => {
                changeRoute("volumes");
              }}
            >
              <ListItemText primary="Volumes" />
            </ListItem>
            <ListItem
              button
              selected={currentTab === "license"}
              onClick={() => {
                changeRoute("license");
              }}
            >
              <ListItemText primary="License" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10}>
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

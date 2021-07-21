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
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import get from "lodash/get";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { setErrorSnackMessage } from "../../../../actions";
import {
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
} from "../actions";
import { ITenant } from "../ListTenants/types";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import PageHeader from "../../Common/PageHeader/PageHeader";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TenantYAML from "./TenantYAML";
import TenantSummary from "./TenantSummary";
import TenantLicense from "./TenantLicense";
import PoolsSummary from "./PoolsSummary";
import PodsSummary from "./PodsSummary";
import { AppState } from "../../../../store";
import TenantMetrics from "./TenantMetrics";
import TenantSecurity from "./TenantSecurity";
import RefreshIcon from "@material-ui/icons/Refresh";

interface ITenantDetailsProps {
  classes: any;
  match: any;
  history: any;
  loadingTenant: boolean;
  currentTab: string;
  selectedTenant: string;
  selectedNamespace: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
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
    ...containerForHeader(theme.spacing(4)),
  });

const TenantDetails = ({
  classes,
  match,
  history,
  loadingTenant,
  currentTab,
  selectedTenant,
  selectedNamespace,
  setErrorSnackMessage,
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
}: ITenantDetailsProps) => {
  const [yamlScreenOpen, setYamlScreenOpen] = useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];
  const [anchorEl, setAnchorEl] = React.useState(null);

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
        .catch((err) => {
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
      case "metrics":
      case "license":
      case "security":
        setTenantTab(section);
        break;
      default:
        setTenantTab("summary");
    }
  }, [match, setTenantTab]);

  const handleTenantMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const editYaml = () => {
    setAnchorEl(null);
    setYamlScreenOpen(true);
  };

  const closeYAMLModalAndRefresh = () => {
    setYamlScreenOpen(false);
    setTenantDetailsLoad(true);
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
      <PageHeader
        label={
          <Fragment>
            <Link to={"/tenants"} className={classes.breadcrumLink}>
              Tenant
            </Link>
            {` > ${match.params["tenantName"]}`}
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleTenantMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={editYaml}
            >
              <MenuItem key="yaml" onClick={editYaml}>
                Edit YAML
              </MenuItem>
            </Menu>
          </Fragment>
        }
        actions={
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
        }
      />
      <Grid item xs={12} className={classes.container} />
      <Grid container>
        <Grid item xs={12}>
          <Tabs
            value={currentTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, newValue: string) => {
              setTenantTab(newValue);
              history.push(
                `/namespaces/${tenantNamespace}/tenants/${tenantName}/${newValue}`
              );
            }}
            aria-label="tenant-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="summary" label="Summary" />
            <Tab value="metrics" label="Metrics" />
            <Tab value="security" label="Security" />
            <Tab value="pools" label="Pools" />
            <Tab value="pods" label="Pods" />
            <Tab value="license" label="License" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
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
                path="/namespaces/:tenantNamespace/tenants/:tenantName/pods"
                component={PodsSummary}
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
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
});

export default withStyles(styles)(connector(TenantDetails));

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

import React, { Fragment, Suspense, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, LinearProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import history from "../../history";
import { Redirect, Route, Router, Switch, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../../store";
import {
  serverIsLoading,
  serverNeedsRestart,
  setMenuOpen,
  setSnackBarMessage,
} from "../../actions";
import { ISessionResponse } from "./types";
import { snackBarMessage } from "../../types";
import { snackBarCommon } from "./Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../common/types";

import Menu from "./Menu/Menu";
import api from "../../common/api";

import MainError from "./Common/MainError/MainError";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
  IAM_SCOPES,
  S3_ALL_RESOURCES,
} from "../../common/SecureComponent/permissions";
import { hasPermission } from "../../common/SecureComponent";
import { IRouteRule } from "./Menu/types";
import LoadingComponent from "../../common/LoadingComponent";

const Trace = React.lazy(() => import("./Trace/Trace"));
const Heal = React.lazy(() => import("./Heal/Heal"));
const Watch = React.lazy(() => import("./Watch/Watch"));
const HealthInfo = React.lazy(() => import("./HealthInfo/HealthInfo"));
const Hop = React.lazy(() => import("./Tenants/TenantDetails/hop/Hop"));

const AddTenant = React.lazy(() => import("./Tenants/AddTenant/AddTenant"));

const NotificationEndpoints = React.lazy(
  () => import("./NotificationEndpoints/NotificationEndpoints")
);
const AddNotificationEndpoint = React.lazy(
  () => import("./NotificationEndpoints/AddNotificationEndpoint")
);
const NotificationTypeSelector = React.lazy(
  () => import("./NotificationEndpoints/NotificationTypeSelector")
);

const ListTiersConfiguration = React.lazy(
  () => import("./Configurations/TiersConfiguration/ListTiersConfiguration")
);
const TierTypeSelector = React.lazy(
  () => import("./Configurations/TiersConfiguration/TierTypeSelector")
);
const AddTierConfiguration = React.lazy(
  () => import("./Configurations/TiersConfiguration/AddTierConfiguration")
);
const ListTenants = React.lazy(
  () => import("./Tenants/ListTenants/ListTenants")
);

const ErrorLogs = React.lazy(() => import("./Logs/ErrorLogs/ErrorLogs"));
const LogsSearchMain = React.lazy(
  () => import("./Logs/LogSearch/LogsSearchMain")
);
const GroupsDetails = React.lazy(() => import("./Groups/GroupsDetails"));

const Tools = React.lazy(() => import("./Tools/Tools"));
const Health = React.lazy(() => import("./Health"));
const IconsScreen = React.lazy(() => import("./Common/IconsScreen"));

const Speedtest = React.lazy(() => import("./Speedtest/Speedtest"));

const ObjectManager = React.lazy(
  () => import("./Common/ObjectManager/ObjectManager")
);

const Buckets = React.lazy(() => import("./Buckets/Buckets"));
const Policies = React.lazy(() => import("./Policies/Policies"));
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));

const Account = React.lazy(() => import("./Account/Account"));
const Users = React.lazy(() => import("./Users/Users"));
const Groups = React.lazy(() => import("./Groups/Groups"));

const TenantDetails = React.lazy(
  () => import("./Tenants/TenantDetails/TenantDetails")
);
const License = React.lazy(() => import("./License/License"));
const ConfigurationOptions = React.lazy(
  () => import("./Configurations/ConfigurationPanels/ConfigurationOptions")
);

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& .MuiPaper-root.MuiSnackbarContent-root": {
        borderRadius: "0px 0px 5px 5px",
        boxShadow: "none",
      },
    },
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
      position: "relative",
    },
    warningBar: {
      background: theme.palette.primary.main,
      color: "white",
      heigh: "60px",
      widht: "100%",
      lineHeight: "60px",
      textAlign: "center",
    },
    progress: {
      height: "3px",
      backgroundColor: "#eaeaea",
    },
    ...snackBarCommon,
  });

interface IConsoleProps {
  open: boolean;
  needsRestart: boolean;
  isServerLoading: boolean;
  classes: any;
  setMenuOpen: typeof setMenuOpen;
  serverNeedsRestart: typeof serverNeedsRestart;
  serverIsLoading: typeof serverIsLoading;
  session: ISessionResponse;
  loadingProgress: number;
  snackBarMessage: snackBarMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  operatorMode: boolean;
  distributedSetup: boolean;
  features: string[] | null;
}

const Console = ({
  classes,
  open,
  needsRestart,
  isServerLoading,
  serverNeedsRestart,
  serverIsLoading,
  session,
  loadingProgress,
  snackBarMessage,
  setSnackBarMessage,
  operatorMode,
  distributedSetup,
  features,
}: IConsoleProps) => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;
  const restartServer = () => {
    serverIsLoading(true);
    api
      .invoke("POST", "/api/v1/service/restart", {})
      .then((res) => {
        console.log("success restarting service");
        console.log(res);
        serverIsLoading(false);
        serverNeedsRestart(false);
      })
      .catch((err: ErrorResponseHandler) => {
        if (err.errorMessage === "Error 502") {
          serverNeedsRestart(false);
        }
        serverIsLoading(false);
        console.log("failure restarting service");
        console.log(err);
      });
  };

  const consoleAdminRoutes: IRouteRule[] = [
    {
      component: Buckets,
      path: IAM_PAGES.BUCKETS,
      forceDisplay: true,
    },
    {
      component: Dashboard,
      path: IAM_PAGES.DASHBOARD,
    },
    {
      component: Buckets,
      path: IAM_PAGES.ADD_BUCKETS,
      customPermissionFnc: () => {
        return hasPermission("*", IAM_PAGES_PERMISSIONS[IAM_PAGES.ADD_BUCKETS]);
      },
    },
    {
      component: Buckets,
      path: IAM_PAGES.BUCKETS_ADMIN_VIEW,
      customPermissionFnc: () => {
        const path = window.location.pathname;
        const resource = path.match(/buckets\/(.*)\/admin*/);
        return (
          resource &&
          resource.length > 0 &&
          hasPermission(
            resource[1],
            IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_ADMIN_VIEW]
          )
        );
      },
    },
    {
      component: Buckets,
      path: IAM_PAGES.BUCKETS_BROWSE_VIEW,
      customPermissionFnc: () => {
        const path = window.location.pathname;
        const resource = path.match(/buckets\/(.*)\/browse*/);
        return (
          resource &&
          resource.length > 0 &&
          hasPermission(
            resource[1],
            IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_BROWSE_VIEW]
          )
        );
      },
    },
    {
      component: Watch,
      path: IAM_PAGES.TOOLS_WATCH,
    },
    {
      component: Speedtest,
      path: IAM_PAGES.TOOLS_SPEEDTEST,
    },
    {
      component: Users,
      path: IAM_PAGES.USERS_VIEW,
    },
    {
      component: Users,
      path: IAM_PAGES.USERS,
      fsHidden: ldapIsEnabled,
      customPermissionFnc: () =>
        hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.ADMIN_LIST_USERS]) ||
        hasPermission(S3_ALL_RESOURCES, [IAM_SCOPES.ADMIN_CREATE_USER]),
    },
    {
      component: Groups,
      path: IAM_PAGES.GROUPS,
      fsHidden: ldapIsEnabled,
    },
    {
      component: GroupsDetails,
      path: IAM_PAGES.GROUPS_VIEW,
    },
    {
      component: Policies,
      path: IAM_PAGES.POLICIES_VIEW,
    },
    {
      component: Policies,
      path: IAM_PAGES.POLICIES,
    },
    {
      component: Heal,
      path: IAM_PAGES.TOOLS_HEAL,
    },
    {
      component: Trace,
      path: IAM_PAGES.TOOLS_TRACE,
    },
    {
      component: HealthInfo,
      path: IAM_PAGES.TOOLS_DIAGNOSTICS,
    },
    {
      component: ErrorLogs,
      path: IAM_PAGES.TOOLS_LOGS,
    },
    {
      component: LogsSearchMain,
      path: IAM_PAGES.TOOLS_AUDITLOGS,
    },
    {
      component: Health,
      path: IAM_PAGES.HEALTH,
    },
    {
      component: Tools,
      path: IAM_PAGES.REGISTER_SUPPORT,
    },
    {
      component: Tools,
      path: IAM_PAGES.CALL_HOME,
    },
    {
      component: Tools,
      path: IAM_PAGES.TOOLS_WATCH,
    },
    {
      component: Tools,
      path: IAM_PAGES.PROFILE,
    },
    {
      component: Tools,
      path: IAM_PAGES.TOOLS_INSPECT,
    },
    {
      component: ConfigurationOptions,
      path: IAM_PAGES.SETTINGS,
    },
    {
      component: ConfigurationOptions,
      path: IAM_PAGES.SETTINGS_VIEW,
    },
    {
      component: AddNotificationEndpoint,
      path: IAM_PAGES.NOTIFICATIONS_ENDPOINTS_ADD_SERVICE,
    },
    {
      component: NotificationTypeSelector,
      path: IAM_PAGES.NOTIFICATIONS_ENDPOINTS_ADD,
    },
    {
      component: NotificationEndpoints,
      path: IAM_PAGES.NOTIFICATIONS_ENDPOINTS,
    },
    {
      component: AddTierConfiguration,
      path: IAM_PAGES.TIERS_ADD_SERVICE,
      fsHidden: !distributedSetup,
    },
    {
      component: TierTypeSelector,
      path: IAM_PAGES.TIERS_ADD,
      fsHidden: !distributedSetup,
    },
    {
      component: ListTiersConfiguration,
      path: IAM_PAGES.TIERS,
    },
    {
      component: Account,
      path: IAM_PAGES.ACCOUNT,
      forceDisplay: true, // user has implicit access to service-accounts
    },
    {
      component: License,
      path: IAM_PAGES.LICENSE,
      forceDisplay: true,
    },
  ];

  const operatorConsoleRoutes: IRouteRule[] = [
    {
      component: ListTenants,
      path: IAM_PAGES.TENANTS,
      forceDisplay: true,
    },
    {
      component: AddTenant,
      path: IAM_PAGES.TENANTS_ADD,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT,
      forceDisplay: true,
    },
    {
      component: Hop,
      path: IAM_PAGES.NAMESPACE_TENANT_HOP,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_PODS,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_PVCS,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_SUMMARY,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_METRICS,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_TRACE,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_PODS_LIST,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_POOLS,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_VOLUMES,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_LICENSE,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_SECURITY,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_ENCRYPTION,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_MONITORING,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_LOGGING,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT_EVENTS,
      forceDisplay: true,
    },
    {
      component: License,
      path: IAM_PAGES.LICENSE,
      forceDisplay: true,
    },
  ];

  const allowedRoutes = (
    operatorMode ? operatorConsoleRoutes : consoleAdminRoutes
  ).filter(
    (route: any) =>
      (route.forceDisplay ||
        (route.customPermissionFnc
          ? route.customPermissionFnc()
          : hasPermission(
              CONSOLE_UI_RESOURCE,
              IAM_PAGES_PERMISSIONS[route.path]
            ))) &&
      !route.fsHidden
  );

  const closeSnackBar = () => {
    setOpenSnackbar(false);
    setSnackBarMessage("");
  };

  useEffect(() => {
    if (snackBarMessage.message === "") {
      setOpenSnackbar(false);
      return;
    }
    // Open SnackBar
    if (snackBarMessage.type !== "error") {
      setOpenSnackbar(true);
    }
  }, [snackBarMessage]);

  const location = useLocation();

  let hideMenu = false;
  if (features?.includes("hide-menu")) {
    hideMenu = true;
  } else if (location.pathname.endsWith("/hop")) {
    hideMenu = true;
  }

  return (
    <Fragment>
      {session && session.status === "ok" ? (
        <div className={classes.root}>
          <CssBaseline />
          {!hideMenu && <Menu />}

          <main className={classes.content}>
            {needsRestart && (
              <div className={classes.warningBar}>
                {isServerLoading ? (
                  <Fragment>
                    The server is restarting.
                    <LinearProgress className={classes.progress} />
                  </Fragment>
                ) : (
                  <Fragment>
                    The instance needs to be restarted for configuration changes
                    to take effect.{" "}
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => {
                        restartServer();
                      }}
                    >
                      Restart
                    </Button>
                  </Fragment>
                )}
              </div>
            )}
            {loadingProgress < 100 && (
              <LinearProgress
                className={classes.progress}
                variant="determinate"
                value={loadingProgress}
              />
            )}
            <MainError />
            <div className={classes.snackDiv}>
              <Snackbar
                open={openSnackbar}
                onClose={() => {
                  closeSnackBar();
                }}
                autoHideDuration={
                  snackBarMessage.type === "error" ? 10000 : 5000
                }
                message={snackBarMessage.message}
                className={classes.snackBarExternal}
                ContentProps={{
                  className: `${classes.snackBar} ${
                    snackBarMessage.type === "error"
                      ? classes.errorSnackBar
                      : ""
                  }`,
                }}
              />
            </div>
            <Suspense fallback={<LoadingComponent />}>
              <ObjectManager />
            </Suspense>
            <Router history={history}>
              <Switch>
                {allowedRoutes.map((route: any) => (
                  <Route
                    key={route.path}
                    exact
                    path={route.path}
                    children={(routerProps) => (
                      <Suspense fallback={<LoadingComponent />}>
                        <route.component {...routerProps} {...route.props} />
                      </Suspense>
                    )}
                  />
                ))}
                <Route key={"/icons"} exact path={"/icons"}>
                  <Suspense fallback={<LoadingComponent />}>
                    <IconsScreen />
                  </Suspense>
                </Route>
                {allowedRoutes.length > 0 ? (
                  <Redirect to={allowedRoutes[0].path} />
                ) : null}
              </Switch>
            </Router>
          </main>
        </div>
      ) : null}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  open: state.system.sidebarOpen,
  needsRestart: state.system.serverNeedsRestart,
  isServerLoading: state.system.serverIsLoading,
  session: state.console.session,
  loadingProgress: state.system.loadingProgress,
  snackBarMessage: state.system.snackBar,
  operatorMode: state.system.operatorMode,
  distributedSetup: state.system.distributedSetup,
  features: state.console.session.features,
});

const connector = connect(mapState, {
  setMenuOpen,
  serverNeedsRestart,
  serverIsLoading,
  setSnackBarMessage,
});

export default withStyles(styles)(connector(Console));

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

const Trace = React.lazy(() => import("./Trace/Trace"));
const Heal = React.lazy(() => import("./Heal/Heal"));
const Watch = React.lazy(() => import("./Watch/Watch"));
const HealthInfo = React.lazy(() => import("./HealthInfo/HealthInfo"));
const Storage = React.lazy(() => import("./Storage/Storage"));
const Metrics = React.lazy(() => import("./Dashboard/Metrics"));
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

const IconsScreen = React.lazy(() => import("./Common/IconsScreen"));

const Speedtest = React.lazy(() => import("./Speedtest/Speedtest"));


const drawerWidth = 245;

const Buckets = React.lazy(() => import("./Buckets/Buckets"));
const Policies = React.lazy(() => import("./Policies/Policies"));
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));

const Account = React.lazy(() => import("./Account/Account"));
const Users = React.lazy(() => import("./Users/Users"));
const Groups = React.lazy(() => import("./Groups/Groups"));
const ConfigurationMain = React.lazy(
  () => import("./Configurations/ConfigurationMain")
);
const TenantDetails = React.lazy(
  () => import("./Tenants/TenantDetails/TenantDetails")
);
const License = React.lazy(() => import("./License/License"));
const ConfigurationOptions = React.lazy(() => import("./Configurations/ConfigurationPanels/ConfigurationOptions"));

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& .MuiPaper-root.MuiSnackbarContent-root": {
        borderRadius: "0px 0px 5px 5px",
        boxShadow: "none",
      },
    },
    toolbar: {
      background: theme.palette.background.default,
      color: "black",
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: "hidden",
      background:
        "transparent linear-gradient(90deg, #073052 0%, #081C42 100%) 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 7px #00000014",
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
      position: "relative",
    },
    container: {
      paddingBottom: theme.spacing(4),
      margin: 0,
      width: "100%",
      maxWidth: "initial",
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      minHeight: 240,
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
  title: string;
  classes: any;
  setMenuOpen: typeof setMenuOpen;
  serverNeedsRestart: typeof serverNeedsRestart;
  serverIsLoading: typeof serverIsLoading;
  session: ISessionResponse;
  loadingProgress: number;
  snackBarMessage: snackBarMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
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
}: IConsoleProps) => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

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

  const allowedPages = !session
    ? []
    : session.pages.reduce((result: any, item: any, index: any) => {
        result[item] = true;
        return result;
      }, {});
  const routes = [
    {
      component: Dashboard,
      path: "/dashboard",
    },
    {
      component: Metrics,
      path: "/metrics",
    },
    {
      component: Buckets,
      path: "/add-bucket",
    },
    {
      component: Buckets,
      path: "/buckets",
    },
    {
      component: Buckets,
      path: "/buckets/*",
    },
    {
      component: Watch,
      path: "/tools/watch",
    },
    {
      component: Speedtest,
      path: "/tools/speedtest",
    },
    {
      component: Users,
      path: "/users/:userName+",
    },
    {
      component: Users,
      path: "/users",
    },
    {
      component: Groups,
      path: "/groups",
    },
    {
      component: GroupsDetails,
      path: "/groups/:groupName+",
    },
    {
      component: Policies,
      path: "/policies/*",
    },
    {
      component: Policies,
      path: "/policies",
    },
    {
      component: Heal,
      path: "/tools/heal",
    },
    {
      component: Trace,
      path: "/tools/trace",
    },
    {
      component: HealthInfo,
      path: "/tools/diagnostics",
    },
    {
      component: ErrorLogs,
      path: "/tools/logs",
    },
    {
      component: LogsSearchMain,
      path: "/tools/audit-logs",
    },
    {
      component: Tools,
      path: "/tools",
    },
    {
      component: ConfigurationOptions,
      path: "/settings",
    },
    {
      component: ConfigurationOptions,
      path: "/settings/:option",
    },
    {
      component: AddNotificationEndpoint,
      path: "/notification-endpoints/add/:service",
    },
    {
      component: NotificationTypeSelector,
      path: "/notification-endpoints/add",
    },
    {
      component: NotificationEndpoints,
      path: "/notification-endpoints",
    },
    {
      component: AddTierConfiguration,
      path: "/tiers/add/:service",
    },
    {
      component: TierTypeSelector,
      path: "/tiers/add",
    },
    {
      component: ListTiersConfiguration,
      path: "/tiers",
    },
    {
      component: Account,
      path: "/account",
      props: {
        changePassword: (!session ? [] : session.pages).includes(
          "/account/change-password"
        ),
      },
    },
    {
      component: ListTenants,
      path: "/tenants",
    },
    {
      component: AddTenant,
      path: "/tenants/add",
    },
    {
      component: Storage,
      path: "/storage",
    },
    {
      component: Storage,
      path: "/storage/volumes",
    },
    {
      component: Storage,
      path: "/storage/drives",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName",
    },
    {
      component: Hop,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/hop",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/pods/:podName",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/summary",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/metrics",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/pods",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/pools",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/volumes",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/license",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName/security",
    },
    {
      component: License,
      path: "/license",
    },
  ];
  const allowedRoutes = routes.filter((route: any) => allowedPages[route.path]);

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
  if (location.pathname === "/metrics") {
    hideMenu = true;
  } else if (location.pathname.endsWith("/hop")) {
    hideMenu = true;
  }

  return (
    <Fragment>
      {session && session.status === "ok" ? (
        <div className={classes.root}>
          <CssBaseline />
          {!hideMenu && <Menu pages={session.pages} />}

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
            <Router history={history}>
              <Switch>
                {allowedRoutes.map((route: any) => (
                  <Route
                    key={route.path}
                    exact
                    path={route.path}
                    children={(routerProps) => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <route.component {...routerProps} {...route.props} />
                      </Suspense>
                    )}
                  />
                ))}
                <Route key={"/icons"} exact path={"/icons"}>
                  <Suspense fallback={<div>Loading...</div>}>
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
});

const connector = connect(mapState, {
  setMenuOpen,
  serverNeedsRestart,
  serverIsLoading,
  setSnackBarMessage,
});

export default withStyles(styles)(connector(Console));

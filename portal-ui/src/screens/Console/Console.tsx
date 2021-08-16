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

import React, { Fragment, useState, useEffect } from "react";
import clsx from "clsx";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
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
import Buckets from "./Buckets/Buckets";
import Policies from "./Policies/Policies";
import Dashboard from "./Dashboard/Dashboard";
import Menu from "./Menu/Menu";
import api from "../../common/api";
import Account from "./Account/Account";
import Users from "./Users/Users";
import Groups from "./Groups/Groups";
import ConfigurationMain from "./Configurations/ConfigurationMain";
import WebhookPanel from "./Configurations/ConfigurationPanels/WebhookPanel";
import TenantsMain from "./Tenants/TenantsMain";
import TenantDetails from "./Tenants/TenantDetails/TenantDetails";
import ObjectBrowser from "./ObjectBrowser/ObjectBrowser";
import ObjectRouting from "./Buckets/ListBuckets/Objects/ListObjects/ObjectRouting";
import License from "./License/License";
import Trace from "./Trace/Trace";
import LogsMain from "./Logs/LogsMain";
import Heal from "./Heal/Heal";
import Watch from "./Watch/Watch";
import HealthInfo from "./HealthInfo/HealthInfo";
import Storage from "./Storage/Storage";
import Metrics from "./Dashboard/Metrics";
import Hop from "./Tenants/TenantDetails/hop/Hop";
import MainError from "./Common/MainError/MainError";

const drawerWidth = 245;

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
        serverIsLoading(false);
        console.log("failure restarting service");
        console.log(err);
      });
  };

  const allowedPages = session.pages.reduce(
    (result: any, item: any, index: any) => {
      result[item] = true;
      return result;
    },
    {}
  );
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
      path: "/buckets",
    },
    {
      component: Buckets,
      path: "/buckets/*",
    },
    {
      component: ObjectBrowser,
      path: "/object-browser",
    },
    {
      component: ObjectRouting,
      path: "/object-browser/:bucket",
    },
    {
      component: ObjectRouting,
      path: "/object-browser/:bucket/*",
    },
    {
      component: Watch,
      path: "/watch",
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
      component: Policies,
      path: "/policies/:policyName",
    },
    {
      component: Policies,
      path: "/policies",
    },
    {
      component: Heal,
      path: "/heal",
    },
    {
      component: Trace,
      path: "/trace",
    },
    {
      component: LogsMain,
      path: "/logs",
    },
    {
      component: HealthInfo,
      path: "/health-info",
    },
    {
      component: ConfigurationMain,
      path: "/settings",
    },
    {
      component: Account,
      path: "/account",
      props: {
        changePassword: session.pages.includes("/account/change-password"),
      },
    },
    {
      component: WebhookPanel,
      path: "/webhook/logger",
    },
    {
      component: WebhookPanel,
      path: "/webhook/audit",
    },
    {
      component: TenantsMain,
      path: "/tenants",
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
      {session.status === "ok" ? (
        <div className={classes.root}>
          <CssBaseline />
          {!hideMenu && (
            <Drawer
              variant="permanent"
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose
                ),
              }}
              open={open}
            >
              <Menu pages={session.pages} />
            </Drawer>
          )}

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
            <Container className={classes.container}>
              <Router history={history}>
                <Switch>
                  {allowedRoutes.map((route: any) => (
                    <Route
                      key={route.path}
                      exact
                      path={route.path}
                      children={(routerProps) => (
                        <route.component {...routerProps} {...route.props} />
                      )}
                    />
                  ))}
                  {allowedRoutes.length > 0 ? (
                    <Redirect to={allowedRoutes[0].path} />
                  ) : null}
                </Switch>
              </Router>
            </Container>
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

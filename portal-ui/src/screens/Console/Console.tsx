// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useEffect } from "react";
import clsx from "clsx";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
import history from "../../history";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../../store";
import {
  serverIsLoading,
  serverNeedsRestart,
  setMenuOpen,
} from "../../actions";
import Buckets from "./Buckets/Buckets";
import Policies from "./Policies/Policies";
import Permissions from "./Permissions/Permissions";
import Dashboard from "./Dashboard/Dashboard";
import Menu from "./Menu/Menu";
import api from "../../common/api";
import ServiceAccounts from "./ServiceAccounts/ServiceAccounts";
import Users from "./Users/Users";
import Groups from "./Groups/Groups";
import ListNotificationEndpoints from "./NotificationEndopoints/ListNotificationEndpoints";
import ConfigurationsList from "./Configurations/ConfigurationPanels/ConfigurationsList";
import { Button, LinearProgress } from "@material-ui/core";
import WebhookPanel from "./Configurations/ConfigurationPanels/WebhookPanel";
import Trace from "./Trace/Trace";
import Logs from "./Logs/Logs";
import Heal from "./Heal/Heal";
import Watch from "./Watch/Watch";
import ListTenants from "./Tenants/ListTenants/ListTenants";
import { ISessionResponse } from "./types";
import { saveSessionResponse } from "./actions";
import TenantDetails from "./Tenants/TenantDetails/TenantDetails";
import { clearSession } from "../../common/utils";
import ObjectBrowser from "./ObjectBrowser/ObjectBrowser";
import ListObjects from "./Buckets/ListBuckets/Objects/ListObjects/ListObjects";
import License from "./License/License";

const drawerWidth = 245;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
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
  saveSessionResponse: typeof saveSessionResponse;
  session: ISessionResponse;
}

const Console = ({
  classes,
  open,
  needsRestart,
  isServerLoading,
  serverNeedsRestart,
  serverIsLoading,
  saveSessionResponse,
  session,
}: IConsoleProps) => {
  useEffect(() => {
    api
      .invoke("GET", `/api/v1/session`)
      .then((res) => {
        saveSessionResponse(res);
      })
      .catch(() => {
        // if server returns 401 for /api/v1/session call invoke function will internally call clearSession()
        // and redirecto to window.location.href = "/"; and this code will be not reached
        // in case that not happen we clear session here and redirect as well
        clearSession();
        window.location.href = "/login";
      });
  }, [saveSessionResponse]);

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
      .catch((err) => {
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
      component: Buckets,
      path: "/buckets",
    },
    {
      component: Buckets,
      path: "/buckets/:bucketName",
    },
    {
      component: ObjectBrowser,
      path: "/object-browser",
    },
    {
      component: ListObjects,
      path: "/object-browser/:bucket",
    },
    {
      component: ListObjects,
      path: "/object-browser/:bucket/*",
    },
    {
      component: Watch,
      path: "/watch",
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
      path: "/policies",
    },
    {
      component: Trace,
      path: "/trace",
    },
    {
      component: Logs,
      path: "/logs",
    },
    {
      component: Heal,
      path: "/heal",
    },
    {
      component: ListNotificationEndpoints,
      path: "/notification-endpoints",
    },
    {
      component: ConfigurationsList,
      path: "/configurations-list",
    },
    {
      component: Permissions,
      path: "/permissions",
    },
    {
      component: ServiceAccounts,
      path: "/service-accounts",
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
      component: ListTenants,
      path: "/tenants",
    },
    {
      component: TenantDetails,
      path: "/namespaces/:tenantNamespace/tenants/:tenantName",
    },
    {
      component: License,
      path: "/license",
    },
  ];
  const allowedRoutes = routes.filter((route: any) => allowedPages[route.path]);

  return (
    <React.Fragment>
      {session.status === "ok" ? (
        <div className={classes.root}>
          <CssBaseline />
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

          <main className={classes.content}>
            {needsRestart && (
              <div className={classes.warningBar}>
                {isServerLoading ? (
                  <React.Fragment>
                    The server is restarting.
                    <LinearProgress />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
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
                  </React.Fragment>
                )}
              </div>
            )}
            <Container className={classes.container}>
              <Router history={history}>
                <Switch>
                  {allowedRoutes.map((route: any) => (
                    <Route
                      key={route.path}
                      exact
                      path={route.path}
                      component={route.component}
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
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  open: state.system.sidebarOpen,
  needsRestart: state.system.serverNeedsRestart,
  isServerLoading: state.system.serverIsLoading,
  session: state.console.session,
});

const connector = connect(mapState, {
  setMenuOpen,
  serverNeedsRestart,
  serverIsLoading,
  saveSessionResponse,
});

export default connector(withStyles(styles)(Console));

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

import React from "react";
import clsx from "clsx";
import {
  createStyles,
  StyledProps,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

import history from "../../history";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Router,
  Switch,
  withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../../store";
import {
  serverIsLoading,
  serverNeedsRestart,
  setMenuOpen
} from "../../actions";
import { ThemedComponentProps } from "@material-ui/core/styles/withTheme";
import Buckets from "./Buckets/Buckets";
import Policies from "./Policies/Policies";
import Permissions from "./Permissions/Permissions";
import Dashboard from "./Dashboard/Dashboard";
import Menu from "./Menu";
import api from "../../common/api";
import storage from "local-storage-fallback";
import NotFoundPage from "../NotFoundPage";
import ServiceAccounts from "./ServiceAccounts/ServiceAccounts";
import Users from "./Users/Users";
import Groups from "./Groups/Groups";
import ListNotificationEndpoints from "./NotificationEndopoints/ListNotificationEndpoints";
import ConfigurationsList from "./Configurations/ConfigurationPanels/ConfigurationsList";
import { Button, LinearProgress } from "@material-ui/core";
import WebhookPanel from "./Configurations/ConfigurationPanels/WebhookPanel";
import Trace from "./Trace/Trace";
import Logs from "./Logs/Logs";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        MinIO
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 254;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    toolbar: {
      background: theme.palette.background.default,
      color: "black",
      paddingRight: 24 // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: 36
    },
    menuButtonHidden: {
      display: "none"
    },
    title: {
      flexGrow: 1
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    },
    appBarSpacer: {
      height: "5px"
    },
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto"
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4)
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column"
    },
    fixedHeight: {
      minHeight: 240
    },
    warningBar: {
      background: theme.palette.primary.main,
      color: "white",
      heigh: "60px",
      widht: "100%",
      lineHeight: "60px",
      textAlign: "center"
    }
  });

const mapState = (state: AppState) => ({
  open: state.system.sidebarOpen,
  needsRestart: state.system.serverNeedsRestart,
  isServerLoading: state.system.serverIsLoading
});

const connector = connect(mapState, {
  setMenuOpen,
  serverNeedsRestart,
  serverIsLoading
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
}

class Console extends React.Component<
  IConsoleProps & RouteComponentProps & StyledProps & ThemedComponentProps
> {
  componentDidMount(): void {
    api
      .invoke("GET", `/api/v1/session`)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        storage.removeItem("token");
        history.push("/");
      });
  }

  restartServer() {
    this.props.serverIsLoading(true);
    api
      .invoke("POST", "/api/v1/service/restart", {})
      .then(res => {
        console.log("success restarting service");
        console.log(res);
        this.props.serverIsLoading(false);
        this.props.serverNeedsRestart(false);
      })
      .catch(err => {
        this.props.serverIsLoading(false);
        console.log("failure restarting service");
        console.log(err);
      });
  }

  render() {
    const { classes, open, needsRestart, isServerLoading } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
          }}
          open={open}
        >
          {/*<div className={classes.toolbarIcon}>*/}
          {/*  <IconButton*/}
          {/*    onClick={() => {*/}
          {/*      this.props.setMenuOpen(false);*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <ChevronLeftIcon />*/}
          {/*  </IconButton>*/}
          {/*</div>*/}
          {/*<Divider />*/}

          <Menu />
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
                      this.restartServer();
                    }}
                  >
                    Restart
                  </Button>
                </React.Fragment>
              )}
            </div>
          )}
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Router history={history}>
              <Switch>
                <Route path="/buckets" component={Buckets} />
                <Route exact path="/permissions" component={Permissions} />
                <Route exact path="/policies" component={Policies} />
                <Route
                  exact
                  path="/service_accounts"
                  component={ServiceAccounts}
                />
                <Route exact path="/users" component={Users} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exct path="/groups" component={Groups} />
                <Route
                  exact
                  path="/notification-endpoints"
                  component={ListNotificationEndpoints}
                />
                <Route
                  exact
                  path="/configurations-list"
                  component={ConfigurationsList}
                />
                <Route exact path="/webhook/logger" component={WebhookPanel} />
                <Route exact path="/webhook/audit" component={WebhookPanel} />
                <Route exct path="/trace" component={Trace} />
                <Route exct path="/logs" component={Logs} />
                <Route exact path="/">
                  <Redirect to="/dashboard" />
                </Route>
                <Route component={NotFoundPage} />
              </Switch>
            </Router>

            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    );
  }
}

// );

export default withRouter(connector(withStyles(styles)(Console)));
// export default withStyles(styles)(connector(Console));
// export default compose(
//     withStyles(styles),
//     connector
// )(withRouter(Console))

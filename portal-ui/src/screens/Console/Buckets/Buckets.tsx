// This file is part of MinIO Buckets Server
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
import {
  createStyles,
  StyledProps,
  Theme,
  withStyles
} from "@material-ui/core/styles";

import history from "../../../history";
import {
  Route,
  RouteComponentProps,
  Router,
  Switch,
  withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { setMenuOpen } from "../../../actions";
import { ThemedComponentProps } from "@material-ui/core/styles/withTheme";
import NotFoundPage from "../../NotFoundPage";
import BucketList from "./ListBuckets/ListBuckets";
import ViewBucket from "./ViewBucket/ViewBucket";
import ListBuckets from "./ListBuckets/ListBuckets";

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

    menuButton: {
      marginRight: 36
    },
    menuButtonHidden: {
      display: "none"
    },
    title: {
      flexGrow: 1
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
    }
  });

const mapState = (state: AppState) => ({
  open: state.system.sidebarOpen
});

const connector = connect(mapState, { setMenuOpen });

interface BucketsProps {
  open: boolean;
  title: string;
  classes: any;
  setMenuOpen: typeof setMenuOpen;
}

class Buckets extends React.Component<
  BucketsProps & RouteComponentProps & StyledProps & ThemedComponentProps
> {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/buckets/:bucketName" component={ViewBucket} />
          <Route path="/" component={ListBuckets} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default withRouter(connector(withStyles(styles)(Buckets)));

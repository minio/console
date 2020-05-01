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
import { Redirect, Route, Router, Switch } from "react-router-dom";
import history from "./history";
import Login from "./screens/LoginPage/LoginPage";
import Console from "./screens/Console/Console";
import NotFoundPage from "./screens/NotFoundPage";
import storage from "local-storage-fallback";
import { connect } from "react-redux";
import { AppState } from "./store";
import { userLoggedIn } from "./actions";
import LoginCallback from "./screens/LoginPage/LoginCallback";

const isLoggedIn = () => {
  return (
    storage.getItem("token") !== undefined &&
    storage.getItem("token") !== null &&
    storage.getItem("token") !== ""
  );
};

const mapState = (state: AppState) => ({
  loggedIn: state.system.loggedIn
});

const connector = connect(mapState, { userLoggedIn });

interface RoutesProps {
  loggedIn: boolean;
  userLoggedIn: typeof userLoggedIn;
}

class Routes extends React.Component<RoutesProps> {
  componentDidMount(): void {
    if (isLoggedIn()) {
      this.props.userLoggedIn(true);
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/oauth_callback" component={LoginCallback} />
          <Route exact path="/login" component={Login} />
          {this.props.loggedIn ? (
            <Switch>
              <Route path="/*" component={Console} />
              <Route component={NotFoundPage} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={Login} />
              <Redirect to="/" />
            </Switch>
          )}
        </Switch>
      </Router>
    );
  }
}

export default connector(Routes);

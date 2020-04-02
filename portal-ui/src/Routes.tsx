// This file is part of MinIO Kubernetes Cloud
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
import {Route, Router, Switch} from "react-router-dom";
import history from "./history";
import Login from "./screens/LoginPage";
import Signup from "./screens/SignupPage";
import Console from "./screens/Console/Console";
import NotFoundPage from "./screens/NotFoundPage";
import storage from "local-storage-fallback";
import CreatePassword from "./screens/CreatePassword";
import {connect} from "react-redux";
import {AppState} from "./store";
import {userLoggedIn} from "./actions";

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
          <Route exact path="/create-password" component={CreatePassword} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          {this.props.loggedIn ? (
            <Switch>
              <Route path="/*" component={Console} />
              <Route component={NotFoundPage} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={Login} />
              <Route component={NotFoundPage} />
            </Switch>
          )}
        </Switch>
      </Router>
    );
  }
}

export default connector(Routes);

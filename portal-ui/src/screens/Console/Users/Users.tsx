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

import React from "react";
import history from "../../../history";
import { Route, Router, Switch, withRouter } from "react-router-dom";
import NotFoundPage from "../../NotFoundPage";

import ListUsers from "./ListUsers";
import UserDetails from "./UserDetails";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import AddUserScreen from "./AddUserScreen";

const Users = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path={IAM_PAGES.USER_ADD} exact component={AddUserScreen} />
        <Route path={IAM_PAGES.USERS_VIEW} exact component={UserDetails} />
        <Route path={IAM_PAGES.USERS} exact component={ListUsers} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default withRouter(Users);

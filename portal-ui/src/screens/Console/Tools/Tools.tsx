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
import { Route, Router, Switch } from "react-router-dom";
import history from "../../../history";
import NotFoundPage from "../../NotFoundPage";
import ToolsList from "./ToolsPanel/ToolsList";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import FeatureNotAvailablePage from "../Common/Components/FeatureNotAvailablePage";
import { SupportMenuIcon } from "../../../icons/SidebarMenus";

import withSuspense from "../Common/Components/withSuspense";

const Inspect = withSuspense(React.lazy(() => import("./Inspect")));
const Register = withSuspense(React.lazy(() => import("../Support/Register")));

const Tools = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path={IAM_PAGES.TOOLS} exact component={ToolsList} />
        <Route path={IAM_PAGES.REGISTER_SUPPORT} exact component={Register} />
        <Route
          path={IAM_PAGES.CALL_HOME}
          exact
          render={() => {
            return (
              <FeatureNotAvailablePage
                icon={<SupportMenuIcon />}
                pageHeaderText={"Support"}
                title={"Call Home"}
                message={<div>This feature is currently not available.</div>}
              />
            );
          }}
        />
        <Route
          path={IAM_PAGES.TOOLS_WATCH}
          exact
          render={() => {
            return (
              <FeatureNotAvailablePage
                icon={<SupportMenuIcon />}
                pageHeaderText={"Support"}
                title={"Inspect"}
                message={<div>This feature is currently not available.</div>}
              />
            );
          }}
        />
        <Route
          path={IAM_PAGES.PROFILE}
          exact
          render={() => {
            return (
              <FeatureNotAvailablePage
                icon={<SupportMenuIcon />}
                pageHeaderText={"Support"}
                title={"Profile"}
                message={<div>This feature is currently not available.</div>}
              />
            );
          }}
        />
        <Route path={IAM_PAGES.TOOLS_INSPECT} exact component={Inspect} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default Tools;

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
import { Box } from "@mui/material";
import Groups from "./Groups";
import GroupPolicies from "./GroupPolicies";
import AddEdit from "./AddEdit";

const GroupsContainer = () => {
  return (
    <Router history={history}>
      <Box style={{
        paddingLeft: "24",
        paddingRight: "24"
      }}>
        <Switch>
          <Route path="/groups/new" exact component={AddEdit} />
          <Route path="/groups/edit/:groupName" exact component={AddEdit} />
          <Route path="/groups/set-policies/:groupName" exact component={GroupPolicies} />
          <Route path="/" component={Groups} />
          <Route component={NotFoundPage} />
        </Switch>
      </Box>
    </Router>
  );
};

export default GroupsContainer;
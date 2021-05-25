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
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { setMenuOpen } from "../../../actions";
import NotFoundPage from "../../NotFoundPage";
import ListBuckets from "./ListBuckets/ListBuckets";
import BucketDetails from "./BucketDetails/BucketDetails";

const mapState = (state: AppState) => ({
  open: state.system.sidebarOpen,
});

const connector = connect(mapState, { setMenuOpen });

const Buckets = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/buckets/:bucketName/*" component={BucketDetails} />
        <Route path="/buckets/:bucketName" component={BucketDetails} />
        <Route path="/" component={ListBuckets} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default withRouter(connector(Buckets));

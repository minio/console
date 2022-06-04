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

import React, { Suspense } from "react";
import history from "../../../history";
import { Redirect, Route, Router, Switch, withRouter } from "react-router-dom";

import NotFoundPage from "../../NotFoundPage";
import LoadingComponent from "../../../common/LoadingComponent";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

const ListBuckets = React.lazy(() => import("./ListBuckets/ListBuckets"));
const BucketDetails = React.lazy(() => import("./BucketDetails/BucketDetails"));
const BrowserHandler = React.lazy(
  () => import("./BucketDetails/BrowserHandler")
);
const AddBucket = React.lazy(() => import("./ListBuckets/AddBucket/AddBucket"));

const Buckets = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          path={IAM_PAGES.ADD_BUCKETS}
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <AddBucket />
            </Suspense>
          )}
        />
        <Route
          path="/buckets/:bucketName/admin/*"
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <BucketDetails {...routerProps} />
            </Suspense>
          )}
        />
        <Route
          path="/buckets/:bucketName/admin"
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <BucketDetails {...routerProps} />
            </Suspense>
          )}
        />
        <Route
          path="/buckets/:bucketName/browse/:subpaths+"
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <BrowserHandler {...routerProps} />
            </Suspense>
          )}
        />
        <Route
          path="/buckets/:bucketName/browse"
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <BrowserHandler {...routerProps} />
            </Suspense>
          )}
        />
        <Route
          path="/buckets/:bucketName"
          component={() => <Redirect to={`/buckets`} />}
        />
        <Route
          path="/"
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <ListBuckets {...routerProps} />
            </Suspense>
          )}
        />
        <Route
          children={(routerProps) => (
            <Suspense fallback={<LoadingComponent />}>
              <NotFoundPage />
            </Suspense>
          )}
        />
      </Switch>
    </Router>
  );
};

export default withRouter(Buckets);

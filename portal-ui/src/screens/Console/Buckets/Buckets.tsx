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
import { Navigate, Route, Routes } from "react-router-dom";

import NotFoundPage from "../../NotFoundPage";
import LoadingComponent from "../../../common/LoadingComponent";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

const ListBuckets = React.lazy(() => import("./ListBuckets/ListBuckets"));
const BucketDetails = React.lazy(() => import("./BucketDetails/BucketDetails"));
const AddBucket = React.lazy(() => import("./ListBuckets/AddBucket/AddBucket"));

const Buckets = () => {
  return (
    <Routes>
      <Route
        path={IAM_PAGES.ADD_BUCKETS}
        element={
          <Suspense fallback={<LoadingComponent />}>
            <AddBucket />
          </Suspense>
        }
      />
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <ListBuckets />
          </Suspense>
        }
      />

      <Route
        path=":bucketName/admin/*"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <BucketDetails />
          </Suspense>
        }
      />
      <Route element={<Navigate to={`/buckets`} />} path="*" />

      <Route
        element={
          <Suspense fallback={<LoadingComponent />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default Buckets;

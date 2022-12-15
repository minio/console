// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import LoadingComponent from "../../../common/LoadingComponent";
import NotFoundPage from "../../NotFoundPage";
import OBBucketList from "./OBBucketList";

const BrowserHandler = React.lazy(
  () => import("../Buckets/BucketDetails/BrowserHandler")
);
const AddBucket = React.lazy(
  () => import("../Buckets/ListBuckets/AddBucket/AddBucket")
);

const ObjectBrowser = () => {
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
            <OBBucketList />
          </Suspense>
        }
      />
      <Route
        path="/:bucketName/*"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <BrowserHandler />
          </Suspense>
        }
      />
      <Route
        path=":bucketName/"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <BrowserHandler />
          </Suspense>
        }
      />
      <Route element={<Navigate to={`/browser`} />} path="*" />

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

export default ObjectBrowser;

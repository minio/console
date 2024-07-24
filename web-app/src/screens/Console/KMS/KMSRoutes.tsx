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

import React from "react";
import { Route, Routes } from "react-router-dom";

import withSuspense from "../Common/Components/withSuspense";
import NotFoundPage from "../../NotFoundPage";

const Status = withSuspense(React.lazy(() => import("./Status")));
const ListKeys = withSuspense(React.lazy(() => import("./ListKeys")));
const AddKey = withSuspense(React.lazy(() => import("./AddKey")));

const KMSRoutes = () => {
  return (
    <Routes>
      <Route path={"status"} element={<Status />} />
      <Route path={"keys"} element={<ListKeys />} />
      <Route path={"add-key"} element={<AddKey />} />
      <Route path={"*"} element={<NotFoundPage />} />
    </Routes>
  );
};

export default KMSRoutes;

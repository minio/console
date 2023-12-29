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
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../../NotFoundPage";
import ListUsers from "./ListUsers";
import UserDetails from "./UserDetails";
import AddUserScreen from "./AddUserScreen";
import AddUserServiceAccountScreen from "./AddUserServiceAccountScreen";

const Users = () => {
  return (
    <Routes>
      <Route path={"add-user"} element={<AddUserScreen />} />
      <Route path={":userName"} element={<UserDetails />} />
      <Route
        path={"new-user-sa/:userName"}
        element={<AddUserServiceAccountScreen />}
      />
      <Route path={"/"} element={<ListUsers />} />
      <Route element={<NotFoundPage />} />
    </Routes>
  );
};

export default Users;

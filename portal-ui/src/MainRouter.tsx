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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import LoadingComponent from "./common/LoadingComponent";
import AppConsole from "./screens/Console/ConsoleKBar";
import { baseUrl } from "./history";

const Login = React.lazy(() => import("./screens/LoginPage/LoginPage"));
const LoginCallback = React.lazy(
  () => import("./screens/LoginPage/LoginCallback")
);

const MainRouter = () => {
  return (
    <BrowserRouter basename={baseUrl}>
      <Routes>
        <Route
          path="/oauth_callback"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <LoginCallback />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <div
              style={{
                backgroundImage: `url('images/background-wave-orig2.svg'), url('images/background.svg')`,
                backgroundPosition: "center 250px, center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "2547px 980px,cover",
                backgroundBlendMode: "color-dodge",
                width: "100%",
                height: "100%",
                display: "flex",
                color: "#fff",
                overflow: "auto",
              }}
            >
              <Suspense fallback={<LoadingComponent />}>
                <Login />
              </Suspense>
            </div>
          }
        />
        <Route
          path={"/*"}
          element={<ProtectedRoute Component={AppConsole} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;

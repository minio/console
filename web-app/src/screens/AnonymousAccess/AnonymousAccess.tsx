// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { Fragment, Suspense } from "react";
import { ApplicationLogo, Button } from "mds";
import { Route, Routes } from "react-router-dom";
import { IAM_PAGES } from "../../common/SecureComponent/permissions";
import { resetSession } from "../Console/consoleSlice";
import { useAppDispatch } from "../../store";
import { resetSystem } from "../../systemSlice";
import { getLogoApplicationVariant, getLogoVar } from "../../config";
import ObjectBrowser from "../Console/ObjectBrowser/ObjectBrowser";
import LoadingComponent from "../../common/LoadingComponent";
import ObjectManager from "../Console/Common/ObjectManager/ObjectManager";
import ObjectManagerButton from "../Console/Common/ObjectManager/ObjectManagerButton";

const AnonymousAccess = () => {
  const dispatch = useAppDispatch();

  return (
    <Fragment>
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(16,47,81,1) 0%, rgba(13,28,64,1) 100%)",
          height: 100,
          width: "100%",
          alignItems: "center",
          display: "flex",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div style={{ width: 200, flexShrink: 1 }}>
          <ApplicationLogo
            applicationName={getLogoApplicationVariant()}
            subVariant={getLogoVar()}
            inverse={true}
          />
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ flexShrink: 1, display: "flex", flexDirection: "row" }}>
          <Button
            id={"go-to-login"}
            variant={"text"}
            onClick={() => {
              dispatch(resetSession());
              dispatch(resetSystem());
            }}
            sx={{ color: "white", textTransform: "initial" }}
          >
            Login
          </Button>
          <ObjectManagerButton />
        </div>
      </div>

      <Suspense fallback={<LoadingComponent />}>
        <ObjectManager />
      </Suspense>
      <Routes>
        <Route
          path={`${IAM_PAGES.OBJECT_BROWSER_VIEW}/*`}
          element={
            <Suspense fallback={<LoadingComponent />}>
              <ObjectBrowser />
            </Suspense>
          }
        />
      </Routes>
    </Fragment>
  );
};
export default AnonymousAccess;

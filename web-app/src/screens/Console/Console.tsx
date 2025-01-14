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

import React, {
  Fragment,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { MainContainer, ProgressBar, Snackbar } from "mds";
import debounce from "lodash/debounce";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selFeatures, selSession } from "./consoleSlice";

import { AppState, useAppDispatch } from "../../store";
import MainError from "./Common/MainError/MainError";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
} from "../../common/SecureComponent/permissions";
import { hasPermission } from "../../common/SecureComponent";
import { IRouteRule } from "./Menu/types";
import { menuOpen, setSnackBarMessage } from "../../systemSlice";
import MenuWrapper from "./Menu/MenuWrapper";
import LoadingComponent from "../../common/LoadingComponent";
import AddBucketModal from "./Buckets/ListBuckets/AddBucket/AddBucketModal";

const ObjectManager = React.lazy(
  () => import("./Common/ObjectManager/ObjectManager"),
);

const ObjectBrowser = React.lazy(() => import("./ObjectBrowser/ObjectBrowser"));

const Buckets = React.lazy(() => import("./Buckets/Buckets"));

const License = React.lazy(() => import("./License/License"));

const Console = () => {
  const dispatch = useAppDispatch();
  const { pathname = "" } = useLocation();
  const open = useSelector((state: AppState) => state.system.sidebarOpen);
  const session = useSelector(selSession);
  const features = useSelector(selFeatures);
  const snackBarMessage = useSelector(
    (state: AppState) => state.system.snackBar,
  );
  const loadingProgress = useSelector(
    (state: AppState) => state.system.loadingProgress,
  );
  const createBucketOpen = useSelector(
    (state: AppState) => state.addBucket.addBucketOpen,
  );

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const obOnly = !!features?.includes("object-browser-only");

  useEffect(() => {
    dispatch({ type: "socket/OBConnect" });
  }, [dispatch]);

  // Layout effect to be executed after last re-render for resizing only
  useLayoutEffect(() => {
    // Debounce to not execute constantly
    const debounceSize = debounce(() => {
      if (open && window.innerWidth <= 1024) {
        dispatch(menuOpen(false));
      }
    }, 300);

    // Added event listener for window resize
    window.addEventListener("resize", debounceSize);

    // We remove the listener on component unmount
    return () => window.removeEventListener("resize", debounceSize);
  });

  const consoleAdminRoutes: IRouteRule[] = [
    {
      component: ObjectBrowser,
      path: IAM_PAGES.OBJECT_BROWSER_VIEW,
      forceDisplay: true,
      customPermissionFnc: () => {
        const path = window.location.pathname;
        const resource = path.match(/browser\/(.*)\//);
        return (
          resource &&
          resource.length > 0 &&
          hasPermission(
            resource[1],
            IAM_PAGES_PERMISSIONS[IAM_PAGES.OBJECT_BROWSER_VIEW],
          )
        );
      },
    },
    {
      component: Buckets,
      path: IAM_PAGES.BUCKETS,
      forceDisplay: true,
    },
    {
      component: Buckets,
      path: IAM_PAGES.ADD_BUCKETS,
      customPermissionFnc: () => {
        return hasPermission("*", IAM_PAGES_PERMISSIONS[IAM_PAGES.ADD_BUCKETS]);
      },
    },
    {
      component: License,
      path: IAM_PAGES.LICENSE,
      forceDisplay: true,
    },
  ];

  const allowedRoutes = consoleAdminRoutes.filter((route: any) =>
    obOnly
      ? route.path.includes("browser")
      : (route.forceDisplay ||
          (route.customPermissionFnc
            ? route.customPermissionFnc()
            : hasPermission(
                CONSOLE_UI_RESOURCE,
                IAM_PAGES_PERMISSIONS[route.path],
              ))) &&
        !route.fsHidden,
  );

  const closeSnackBar = () => {
    setOpenSnackbar(false);
    dispatch(setSnackBarMessage(""));
  };

  useEffect(() => {
    if (snackBarMessage.message === "") {
      setOpenSnackbar(false);
      return;
    }
    // Open SnackBar
    if (snackBarMessage.type !== "error") {
      setOpenSnackbar(true);
    }
  }, [snackBarMessage]);

  let hideMenu = false;
  if (features?.includes("hide-menu") || pathname.endsWith("/hop") || obOnly) {
    hideMenu = true;
  }

  return (
    <Fragment>
      {session && session.status === "ok" ? (
        <MainContainer
          menu={!hideMenu ? <MenuWrapper /> : <Fragment />}
          mobileModeAuto={false}
        >
          <Fragment>
            {loadingProgress < 100 && (
              <ProgressBar
                barHeight={3}
                variant="determinate"
                value={loadingProgress}
                sx={{ width: "100%", position: "absolute", top: 0, left: 0 }}
              />
            )}
            {createBucketOpen && <AddBucketModal />}
            <MainError />
            <Snackbar
              onClose={closeSnackBar}
              open={openSnackbar}
              message={snackBarMessage.message}
              variant={snackBarMessage.type === "error" ? "error" : "default"}
              autoHideDuration={snackBarMessage.type === "error" ? 10 : 5}
              condensed
            />
            <Suspense fallback={<LoadingComponent />}>
              <ObjectManager />
            </Suspense>
            <Routes>
              {allowedRoutes.map((route: any) => (
                <Route
                  key={route.path}
                  path={`${route.path}/*`}
                  element={
                    <Suspense fallback={<LoadingComponent />}>
                      <route.component {...route.props} />
                    </Suspense>
                  }
                />
              ))}
              <Route
                path={"*"}
                element={
                  <Fragment>
                    {allowedRoutes.length > 0 ? (
                      <Navigate to={allowedRoutes[0].path} />
                    ) : (
                      <Fragment />
                    )}
                  </Fragment>
                }
              />
            </Routes>
          </Fragment>
        </MainContainer>
      ) : null}
    </Fragment>
  );
};

export default Console;

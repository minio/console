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

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "./store";
import LoadingComponent from "./common/LoadingComponent";
import { fetchSession } from "./screens/LoginPage/sessionThunk";
import { setLocationPath } from "./systemSlice";
import { SessionCallStates } from "./screens/Console/consoleSlice.types";

interface ProtectedRouteProps {
  Component: any;
}

const ProtectedRoute = ({ Component }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();

  const userLoggedIn = useSelector((state: AppState) => state.system.loggedIn);
  const [componentLoading, setComponentLoading] = useState<boolean>(true);
  const sessionLoadingState = useSelector(
    (state: AppState) => state.console.sessionLoadingState,
  );
  const { pathname = "" } = useLocation();

  const StorePathAndRedirect = () => {
    localStorage.setItem("redirect-path", pathname);
    return <Navigate to={{ pathname: `login` }} />;
  };

  useEffect(() => {
    dispatch(setLocationPath(pathname));
  }, [dispatch, pathname]);

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  useEffect(() => {
    if (sessionLoadingState === SessionCallStates.Done) {
      setComponentLoading(false);
    }
  }, [dispatch, sessionLoadingState]);

  // if we're still trying to retrieve user session render nothing
  if (componentLoading) {
    return <LoadingComponent />;
  }

  // redirect user to the right page based on session status
  return userLoggedIn ? <Component /> : <StorePathAndRedirect />;
};

export default ProtectedRoute;

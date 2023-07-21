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
import useApi from "./screens/Console/Common/Hooks/useApi";
import { ErrorResponseHandler } from "./common/types";
import { ReplicationSite } from "./screens/Console/Configurations/SiteReplication/SiteReplication";
import { useSelector } from "react-redux";
import { SRInfoStateType } from "./types";
import { AppState, useAppDispatch } from "./store";
import LoadingComponent from "./common/LoadingComponent";
import { fetchSession } from "./screens/LoginPage/sessionThunk";
import { setSiteReplicationInfo, setLocationPath } from "./systemSlice";
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
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
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

  const [, invokeSRInfoApi] = useApi(
    (res: any) => {
      const { name: curSiteName, enabled = false } = res || {};

      let siteList = res.site;
      if (!siteList) {
        siteList = [];
      }
      const isSiteNameInList = siteList.find((si: ReplicationSite) => {
        return si.name === curSiteName;
      });

      const isCurSite = enabled && isSiteNameInList;
      const siteReplicationDetail: SRInfoStateType = {
        enabled: enabled,
        curSite: isCurSite,
        siteName: isCurSite ? curSiteName : "",
      };

      dispatch(setSiteReplicationInfo(siteReplicationDetail));
    },
    (err: ErrorResponseHandler) => {
      // we will fail this call silently, but show it on the console
      console.error(`Error loading site replication status`, err);
    },
  );

  useEffect(() => {
    if (userLoggedIn && !componentLoading && !anonymousMode) {
      invokeSRInfoApi("GET", `api/v1/admin/site-replication`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoggedIn, componentLoading]);

  // if we're still trying to retrieve user session render nothing
  if (componentLoading) {
    return <LoadingComponent />;
  }

  // redirect user to the right page based on session status
  return userLoggedIn ? <Component /> : <StorePathAndRedirect />;
};

export default ProtectedRoute;

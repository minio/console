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

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "./common/api";
import { ISessionResponse } from "./screens/Console/types";
import useApi from "./screens/Console/Common/Hooks/useApi";
import { ErrorResponseHandler } from "./common/types";
import { ReplicationSite } from "./screens/Console/Configurations/SiteReplication/SiteReplication";
import { baseUrl } from "./history";
import { useDispatch, useSelector } from "react-redux";
import {
  globalSetDistributedSetup,
  operatorMode,
  selOpMode,
  setSiteReplicationInfo,
  userLogged,
} from "./systemSlice";
import { SRInfoStateType } from "./types";
import { AppState } from "./store";
import { saveSessionResponse } from "./screens/Console/consoleSlice";

interface ProtectedRouteProps {
  Component: any;
}

const ProtectedRoute = ({ Component }: ProtectedRouteProps) => {
  const dispatch = useDispatch();

  const isOperatorMode = useSelector(selOpMode);

  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const userLoggedIn = useSelector((state: AppState) => state.system.loggedIn);

  const { pathname = "" } = useLocation();

  const StorePathAndRedirect = () => {
    localStorage.setItem("redirect-path", pathname);
    return <Navigate to={{ pathname: `${baseUrl}login` }} />;
  };

  useEffect(() => {
    api
      .invoke("GET", `/api/v1/session`)
      .then((res: ISessionResponse) => {
        dispatch(saveSessionResponse(res));
        dispatch(userLogged(true));
        setSessionLoading(false);
        dispatch(globalSetDistributedSetup(res.distributedMode || false));
        // check for tenants presence, that indicates we are in operator mode
        if (res.operator) {
          dispatch(operatorMode(true));
          document.title = "MinIO Operator";
        }
      })
      .catch(() => setSessionLoading(false));
  }, [dispatch]);

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
    }
  );

  useEffect(() => {
    if (userLoggedIn && !sessionLoading && !isOperatorMode) {
      invokeSRInfoApi("GET", `api/v1/admin/site-replication`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoggedIn, sessionLoading]);

  // if we're still trying to retrieve user session render nothing
  if (sessionLoading) {
    return null;
  }
  // redirect user to the right page based on session status
  return userLoggedIn ? <Component /> : <StorePathAndRedirect />;
};

export default ProtectedRoute;

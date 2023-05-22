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
import { useSelector } from "react-redux";
import {
  globalSetDistributedSetup,
  setAnonymousMode,
  setOverrideStyles,
  setSiteReplicationInfo,
  userLogged,
} from "./systemSlice";
import { SRInfoStateType } from "./types";
import { AppState, useAppDispatch } from "./store";
import { saveSessionResponse } from "./screens/Console/consoleSlice";
import { getOverrideColorVariants } from "./utils/stylesUtils";
import LoadingComponent from "./common/LoadingComponent";

interface ProtectedRouteProps {
  Component: any;
}

const ProtectedRoute = ({ Component }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();

  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const userLoggedIn = useSelector((state: AppState) => state.system.loggedIn);
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode
  );
  const { pathname = "" } = useLocation();

  const StorePathAndRedirect = () => {
    localStorage.setItem("redirect-path", pathname);
    return <Navigate to={{ pathname: `login` }} />;
  };

  const pathnameParts = pathname.split("/");
  const screen = pathnameParts.length > 2 ? pathnameParts[1] : "";

  useEffect(() => {
    api
      .invoke("GET", `/api/v1/session`)
      .then((res: ISessionResponse) => {
        dispatch(saveSessionResponse(res));
        dispatch(userLogged(true));
        setSessionLoading(false);
        dispatch(globalSetDistributedSetup(res?.distributedMode || false));

        if (res.customStyles && res.customStyles !== "") {
          const overrideColorVariants = getOverrideColorVariants(
            res.customStyles
          );

          if (overrideColorVariants !== false) {
            dispatch(setOverrideStyles(overrideColorVariants));
          }
        }
      })
      .catch(() => {
        // if we are trying to browse, probe access to the requested prefix
        if (screen === "browser") {
          const bucket = pathnameParts.length >= 3 ? pathnameParts[2] : "";
          // no bucket, no business
          if (bucket === "") {
            setSessionLoading(false);
            return;
          }
          // before marking the session as done, let's check if the bucket is publicly accessible
          api
            .invoke(
              "GET",
              `/api/v1/buckets/${bucket}/objects?limit=1`,
              undefined,
              {
                "X-Anonymous": "1",
              }
            )
            .then((value) => {
              dispatch(setAnonymousMode());
              setSessionLoading(false);
            })
            .catch(() => {
              setSessionLoading(false);
            });
        } else {
          setSessionLoading(false);
        }
      });
  }, [dispatch, screen, pathnameParts]);

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
    if (userLoggedIn && !sessionLoading && !anonymousMode) {
      invokeSRInfoApi("GET", `api/v1/admin/site-replication`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoggedIn, sessionLoading]);

  // if we're still trying to retrieve user session render nothing
  if (sessionLoading) {
    return <LoadingComponent />;
  }
  // redirect user to the right page based on session status
  return userLoggedIn ? <Component /> : <StorePathAndRedirect />;
};

export default ProtectedRoute;

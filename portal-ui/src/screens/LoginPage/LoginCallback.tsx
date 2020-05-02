// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import storage from "local-storage-fallback";
import api from "../../common/api";

const LoginCallback: FC<RouteComponentProps> = ({ location }) => {
  useEffect(() => {
    const code = (location.search.match(/code=([^&]+)/) || [])[1];
    const state = (location.search.match(/state=([^&]+)/) || [])[1];
    api
      .invoke("POST", "/api/v1/login/oauth2/auth", { code, state })
      .then((res: any) => {
        if (res && res.sessionId) {
          // store the jwt token
          storage.setItem("token", res.sessionId);
          // We push to history the new URL.
          window.location.href = "/dashboard";
        }
      })
      .catch((res: any) => {
        window.location.href = "/login";
      });
  }, []);
  return null;
};

export default LoginCallback;

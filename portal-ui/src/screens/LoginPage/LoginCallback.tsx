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

import React, { FC, useEffect, useState } from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { RouteComponentProps } from "react-router";
import storage from "local-storage-fallback";
import api from "../../common/api";

const LoginCallback: FC<RouteComponentProps> = ({ location }) => {
  const [error, setError] = useState<string>("");
  const [errorDescription, setErrorDescription] = useState<string>("");
  useEffect(() => {
    const code = (location.search.match(/code=([^&]+)/) || [])[1];
    const state = (location.search.match(/state=([^&]+)/) || [])[1];
    const error = (location.search.match(/error=([^&]+)/) || [])[1];
    const errorDescription = (location.search.match(
      /error_description=([^&]+)/
    ) || [])[1];
    if (error !== undefined || errorDescription !== undefined) {
      setError(error);
      setErrorDescription(errorDescription);
    } else {
      api
        .invoke("POST", "/api/v1/login/oauth2/auth", { code, state })
        .then((res: any) => {
          if (res && res.sessionId) {
            // store the jwt token
            storage.setItem("token", res.sessionId);
            // We push to history the new URL.
            let targetPath = "/";
            if (
              localStorage.getItem("redirect-path") &&
              localStorage.getItem("redirect-path") != ""
            ) {
              targetPath = `${localStorage.getItem("redirect-path")}`;
              localStorage.setItem("redirect-path", "");
            }
            window.location.href = targetPath;
          }
        })
        .catch((res: any) => {
          window.location.href = "/login";
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [location.search]);
  return error !== "" || errorDescription !== "" ? (
    <div>
      <h2>IDP Error:</h2>
      <p>{error}</p>
      <p>{errorDescription}</p>
    </div>
  ) : null;
};

export default LoginCallback;

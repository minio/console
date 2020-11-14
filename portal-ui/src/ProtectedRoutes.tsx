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

import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "./store";
import { userLoggedIn } from "./actions";
import api from "./common/api";
import { clearSession } from "./common/utils";
import { saveSessionResponse } from "./screens/Console/actions";

const mapState = (state: AppState) => ({
  loggedIn: state.system.loggedIn,
});

const connector = connect(mapState, {
  userLoggedIn,
  saveSessionResponse,
});

interface ProtectedRouteProps {
  loggedIn: boolean;
  Component: any;
  userLoggedIn: typeof userLoggedIn;
  saveSessionResponse: typeof saveSessionResponse;
}

const ProtectedRoute = ({
  Component,
  loggedIn,
  userLoggedIn,
  saveSessionResponse,
}: ProtectedRouteProps) => {
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  useEffect(() => {
    api
      .invoke("GET", `/api/v1/session`)
      .then((res) => {
        saveSessionResponse(res);
        userLoggedIn(true);
        setSessionLoading(false);
      })
      .catch(() => setSessionLoading(false));
  }, [saveSessionResponse]);

  // if we still trying to retrieve user session render nothing
  if (sessionLoading) {
    return null;
  }
  // redirect user to the right page based on session status
  return loggedIn ? <Component /> : <Redirect to={{ pathname: "/login" }} />;
};

export default connector(ProtectedRoute);

// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../../store";
import api from "../../common/api";
import { ErrorResponseHandler } from "../../common/types";
import { setErrorSnackMessage, userLogged } from "../../systemSlice";
import { ILoginDetails } from "./types";
import { setNavigateTo } from "./loginSlice";
import { getTargetPath, LoginStrategyPayload } from "./LoginPage";

export const doLoginAsync = createAsyncThunk(
  "login/doLoginAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;
    const accessKey = state.login.accessKey;
    const secretKey = state.login.secretKey;
    const sts = state.login.sts;
    const useSTS = state.login.useSTS;

    let loginStrategyPayload: LoginStrategyPayload = {
      accessKey,
      secretKey,
    };
    if (useSTS) {
      loginStrategyPayload = {
        accessKey,
        secretKey,
        sts,
      };
    }

    console.log("PAYLOAD:", loginStrategyPayload);

    return api
      .invoke("POST", "/api/v1/login", loginStrategyPayload)
      .then((res) => {
        // We set the state in redux
        dispatch(userLogged(true));
        localStorage.setItem("userLoggedIn", accessKey);
        dispatch(setNavigateTo(getTargetPath()));
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(err));
      });
  }
);
export const getFetchConfigurationAsync = createAsyncThunk(
  "login/getFetchConfigurationAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    return api
      .invoke("GET", "/api/v1/login")
      .then((loginDetails: ILoginDetails) => {
        return loginDetails;
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
      });
  }
);

export const getVersionAsync = createAsyncThunk(
  "login/getVersionAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    return api
      .invoke("GET", "/api/v1/check-version")
      .then(
        ({
          current_version,
          latest_version,
        }: {
          current_version: string;
          latest_version: string;
        }) => {
          return latest_version;
        }
      )
      .catch((err: ErrorResponseHandler) => {
        return err.errorMessage;
      });
  }
);

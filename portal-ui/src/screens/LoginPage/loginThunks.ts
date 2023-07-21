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
import { setErrorSnackMessage, userLogged } from "../../systemSlice";
import { setNavigateTo } from "./loginSlice";
import { getTargetPath } from "./Login";
import { api } from "api";
import {
  CheckVersionResponse,
  Error,
  HttpResponse,
  LoginDetails,
  LoginRequest,
} from "api/consoleApi";
import { errorToHandler } from "api/errors";

export const doLoginAsync = createAsyncThunk(
  "login/doLoginAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;
    const accessKey = state.login.accessKey;
    const secretKey = state.login.secretKey;
    const sts = state.login.sts;
    const useSTS = state.login.useSTS;

    let payload: LoginRequest = {
      accessKey,
      secretKey,
    };
    if (useSTS) {
      payload = {
        accessKey,
        secretKey,
        sts,
      };
    }

    return api.login
      .login(payload)
      .then((res: HttpResponse<void, Error>) => {
        // We set the state in redux
        dispatch(userLogged(true));
        localStorage.setItem("userLoggedIn", accessKey);
        dispatch(setNavigateTo(getTargetPath()));
      })
      .catch(async (res: HttpResponse<void, Error>) => {
        const err = (await res.json()) as Error;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        return rejectWithValue(false);
      });
  },
);
export const getFetchConfigurationAsync = createAsyncThunk(
  "login/getFetchConfigurationAsync",
  async (_, { dispatch, rejectWithValue }) => {
    return api.login
      .loginDetail()
      .then((res: HttpResponse<LoginDetails, Error>) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch(async (res: HttpResponse<LoginDetails, Error>) => {
        const err = (await res.json()) as Error;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        return rejectWithValue(false);
      });
  },
);

export const getVersionAsync = createAsyncThunk(
  "login/getVersionAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    return api.checkVersion
      .checkMinIoVersion()
      .then((res: HttpResponse<CheckVersionResponse, Error>) => {
        if (res.data !== undefined) {
          return res.data.latest_version;
        }
      })
      .catch(async (res: HttpResponse<CheckVersionResponse, Error>) => {
        const err = (await res.json()) as Error;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        return rejectWithValue(false);
      });
  },
);

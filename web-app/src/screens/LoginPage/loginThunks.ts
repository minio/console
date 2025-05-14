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
import {
  setDarkMode,
  setErrorSnackMessage,
  userLogged,
} from "../../systemSlice";
import { setNavigateTo } from "./loginSlice";
import { getTargetPath } from "./Login";
import { api } from "api";
import { ApiError, LoginRequest } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { isDarkModeOn } from "../../utils/stylesUtils";

export const doLoginAsync = createAsyncThunk(
  "login/doLoginAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;
    const accessKey = state.login.accessKey;
    const secretKey = state.login.secretKey;

    let payload: LoginRequest = {
      accessKey,
      secretKey,
    };

    return api.login
      .login(payload)
      .then((res) => {
        const darkModeEnabled = isDarkModeOn(); // If null, then we set the dark mode as disabled per requirement. If configuration al ready set, then we establish this configuration

        // We set the state in redux
        dispatch(userLogged(true));
        localStorage.setItem("userLoggedIn", accessKey);
        dispatch(setNavigateTo(getTargetPath()));
        dispatch(setDarkMode(!!darkModeEnabled));
      })
      .catch(async (res) => {
        const err = (await res.json()) as ApiError;
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
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch(async (res) => {
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        return rejectWithValue(false);
      });
  },
);

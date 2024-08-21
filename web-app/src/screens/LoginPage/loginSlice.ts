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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginDetails } from "api/consoleApi";
import { doLoginAsync, getFetchConfigurationAsync } from "./loginThunks";

interface LoginState {
  accessKey: string;
  secretKey: string;
  sts: string;
  useSTS: boolean;
  backgroundAnimation: boolean;
  loginStrategy: LoginDetails;
  loginSending: boolean;
  loadingFetchConfiguration: boolean;
  isK8S: boolean;
  navigateTo: string;
  ssoEmbeddedIDPDisplay: boolean;
}

const initialState: LoginState = {
  accessKey: "",
  secretKey: "",
  sts: "",
  useSTS: false,
  loginStrategy: {
    loginStrategy: undefined,
    redirectRules: [],
  },
  loginSending: false,
  loadingFetchConfiguration: true,
  isK8S: false,
  backgroundAnimation: false,
  navigateTo: "",
  ssoEmbeddedIDPDisplay: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setAccessKey: (state, action: PayloadAction<string>) => {
      state.accessKey = action.payload;
    },
    setSecretKey: (state, action: PayloadAction<string>) => {
      state.secretKey = action.payload;
    },
    setUseSTS: (state, action: PayloadAction<boolean>) => {
      state.useSTS = action.payload;
    },
    setSTS: (state, action: PayloadAction<string>) => {
      state.sts = action.payload;
    },
    setNavigateTo: (state, action: PayloadAction<string>) => {
      state.navigateTo = action.payload;
    },
    setDisplayEmbeddedIDPForms: (state, action: PayloadAction<boolean>) => {
      state.ssoEmbeddedIDPDisplay = action.payload;
    },
    resetForm: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFetchConfigurationAsync.pending, (state, action) => {
        state.loadingFetchConfiguration = true;
      })
      .addCase(getFetchConfigurationAsync.rejected, (state, action) => {
        state.loadingFetchConfiguration = false;
      })
      .addCase(getFetchConfigurationAsync.fulfilled, (state, action) => {
        state.loadingFetchConfiguration = false;
        if (action.payload) {
          state.loginStrategy = action.payload;
          state.isK8S = !!action.payload.isK8S;
          state.backgroundAnimation = !!action.payload.animatedLogin;
        }
      })
      .addCase(doLoginAsync.pending, (state, action) => {
        state.loginSending = true;
      })
      .addCase(doLoginAsync.rejected, (state, action) => {
        state.loginSending = false;
      })
      .addCase(doLoginAsync.fulfilled, (state, action) => {
        state.loginSending = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setAccessKey,
  setSecretKey,
  setUseSTS,
  setSTS,
  setNavigateTo,
  setDisplayEmbeddedIDPForms,
  resetForm,
} = loginSlice.actions;

export default loginSlice.reducer;

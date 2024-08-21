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
import { SessionResponse } from "../../api/consoleApi";
import { AppState } from "../../store";
import { fetchSession } from "../../screens/LoginPage/sessionThunk";
import { SessionCallStates } from "./consoleSlice.types";

interface ConsoleState {
  session: SessionResponse;
  sessionLoadingState: SessionCallStates;
}

const initialState: ConsoleState = {
  session: {},
  sessionLoadingState: SessionCallStates.Initial,
};

const consoleSlice = createSlice({
  name: "console",
  initialState,
  reducers: {
    setSessionLoadingState: (
      state,
      action: PayloadAction<SessionCallStates>,
    ) => {
      state.sessionLoadingState = action.payload;
    },
    saveSessionResponse: (state, action: PayloadAction<SessionResponse>) => {
      state.session = action.payload;
    },
    resetSession: (state) => {
      state.session = initialState.session;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state, action) => {
        state.sessionLoadingState = SessionCallStates.Loading;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.sessionLoadingState = SessionCallStates.Done;
      });
  },
});

export const { saveSessionResponse, resetSession, setSessionLoadingState } =
  consoleSlice.actions;
export const selSession = (state: AppState) => state.console.session;
export const selFeatures = (state: AppState) =>
  state.console.session ? state.console.session.features : [];

export default consoleSlice.reducer;

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

import { createSlice } from "@reduxjs/toolkit";
import { Usage } from "./types";
import { getUsageAsync } from "./dashboardThunks";

export interface DashboardState {
  usage: Usage | null;
  loadingUsage: boolean;
  widgetLoadVersion: number;
}

const initialState: DashboardState = {
  usage: null,
  loadingUsage: true,
  widgetLoadVersion: 0,
};
export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    reloadWidgets: (state) => {
      state.widgetLoadVersion++;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsageAsync.pending, (state) => {
        state.loadingUsage = true;
      })
      .addCase(getUsageAsync.rejected, (state) => {
        state.loadingUsage = false;
      })
      .addCase(getUsageAsync.fulfilled, (state, action) => {
        state.loadingUsage = false;
        state.usage = action.payload;
      });
  },
});
export const { reloadWidgets } = dashboardSlice.actions;

export default dashboardSlice.reducer;

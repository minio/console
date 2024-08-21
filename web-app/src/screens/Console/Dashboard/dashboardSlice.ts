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
import { zoomState } from "./types";
import { IDashboardPanel } from "./Prometheus/types";
import { getUsageAsync } from "./dashboardThunks";
import { AdminInfoResponse } from "api/consoleApi";

interface DashboardState {
  zoom: zoomState;
  usage: AdminInfoResponse | null;
  status: "idle" | "loading" | "failed";
  widgetLoadVersion: number;
}

const initialState: DashboardState = {
  status: "idle",
  zoom: {
    openZoom: false,
    widgetRender: null,
  },
  usage: null,
  widgetLoadVersion: 0,
};
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    openZoomPage: (state, action: PayloadAction<IDashboardPanel>) => {
      state.zoom.openZoom = true;
      state.zoom.widgetRender = action.payload;
    },
    closeZoomPage: (state) => {
      state.zoom.openZoom = false;
      state.zoom.widgetRender = null;
    },
    reloadWidgets: (state) => {
      state.widgetLoadVersion++;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsageAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getUsageAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.usage = action.payload;
      });
  },
});
export const { openZoomPage, closeZoomPage, reloadWidgets } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;

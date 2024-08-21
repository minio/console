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
import { HealthInfoMessage } from "./types";

interface HealthInfoState {
  message: HealthInfoMessage;
}

const initialState: HealthInfoState = {
  message: {} as HealthInfoMessage,
};

const healthInfoSlice = createSlice({
  name: "trace",
  initialState,
  reducers: {
    healthInfoMessageReceived: (
      state,
      action: PayloadAction<HealthInfoMessage>,
    ) => {
      state.message = action.payload;
    },
    healthInfoResetMessage: (state) => {
      state.message = {} as HealthInfoMessage;
    },
  },
});

export const { healthInfoMessageReceived, healthInfoResetMessage } =
  healthInfoSlice.actions;

export default healthInfoSlice.reducer;

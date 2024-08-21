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
import { LogMessage } from "./types";
import { DateTime } from "luxon";

interface LogState {
  logMessages: LogMessage[];
  logsStarted: boolean;
}

const initialState: LogState = {
  logMessages: [],
  logsStarted: false,
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    logMessageReceived: (state, action: PayloadAction<LogMessage>) => {
      let msgs = state.logMessages;
      const logTime = DateTime.fromFormat(
        action.payload.time.toString(),
        "HH:mm:ss z MM/dd/yyyy",
        {
          zone: "UTC",
        },
      ).toJSDate();

      if (
        msgs.length > 0 &&
        logTime.getFullYear() === 1 &&
        action.payload.ConsoleMsg !== ""
      ) {
        for (let m in msgs) {
          if (msgs[m].time.getFullYear() === 1) {
            msgs[m].ConsoleMsg =
              `${msgs[m].ConsoleMsg}\n${action.payload.ConsoleMsg}`;
          }
        }
      } else {
        msgs.push(action.payload);
      }
      state.logMessages = msgs;
    },
    logResetMessages: (state) => {
      state.logMessages = [];
    },
    setLogsStarted: (state, action: PayloadAction<boolean>) => {
      state.logsStarted = action.payload;
    },
  },
});

export const { logMessageReceived, logResetMessages, setLogsStarted } =
  logsSlice.actions;

export default logsSlice.reducer;

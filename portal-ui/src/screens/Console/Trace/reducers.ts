// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import {
  TRACE_MESSAGE_RECEIVED,
  TRACE_RESET_MESSAGES,
  TRACE_SET_STARTED,
  TraceActionTypes,
} from "./actions";
import { TraceMessage } from "./types";

export interface TraceState {
  messages: TraceMessage[];
  traceStarted: boolean;
}

const initialState: TraceState = {
  messages: [],
  traceStarted: false,
};

export function traceReducer(
  state = initialState,
  action: TraceActionTypes
): TraceState {
  switch (action.type) {
    case TRACE_MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case TRACE_RESET_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    case TRACE_SET_STARTED:
      return {
        ...state,
        traceStarted: action.status,
      };
    default:
      return state;
  }
}

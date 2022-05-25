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
  WATCH_MESSAGE_RECEIVED,
  WATCH_RESET_MESSAGES,
  WatchActionTypes,
} from "./actions";
import { EventInfo } from "./types";

export interface WatchState {
  messages: EventInfo[];
}

const initialState: WatchState = {
  messages: [],
};

export function watchReducer(
  state = initialState,
  action: WatchActionTypes
): WatchState {
  switch (action.type) {
    case WATCH_MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case WATCH_RESET_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}

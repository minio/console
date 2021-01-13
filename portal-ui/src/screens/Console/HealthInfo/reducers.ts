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
  HEALTH_INFO_MESSAGE_RECEIVED,
  HEALTH_INFO_RESET_MESSAGE,
  HealthInfoActionTypes,
} from "./actions";
import { HealthInfoMessage } from "./types";

export interface HealthInfoState {
  message: HealthInfoMessage;
}

const initialState: HealthInfoState = {
  message: {} as HealthInfoMessage,
};

export function healthInfoReducer(
  state = initialState,
  action: HealthInfoActionTypes
): HealthInfoState {
  switch (action.type) {
    case HEALTH_INFO_MESSAGE_RECEIVED:
      return {
        ...state,
        message: action.message,
      };
    case HEALTH_INFO_RESET_MESSAGE:
      return {
        ...state,
        message: {} as HealthInfoMessage,
      };
    default:
      return state;
  }
}

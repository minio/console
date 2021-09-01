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
  REWIND_SET_ENABLE,
  REWIND_RESET_REWIND,
  REWIND_FILE_MODE_ENABLED,
  ObjectBrowserActionTypes,
} from "./actions";

export interface Route {
  route: string;
  label: string;
  type: string;
}

export interface RewindItem {
  rewindEnabled: boolean;
  bucketToRewind: string;
  dateToRewind: any;
}

export interface ObjectBrowserState {
  fileMode: boolean;
  rewind: RewindItem;
}

export interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

const defaultRewind = {
  rewindEnabled: false,
  bucketToRewind: "",
  dateToRewind: null,
};

const initialState: ObjectBrowserState = {
  fileMode: false,
  rewind: {
    ...defaultRewind,
  },
};

export function objectBrowserReducer(
  state = initialState,
  action: ObjectBrowserActionTypes
): ObjectBrowserState {
  switch (action.type) {
    case REWIND_SET_ENABLE:
      const rewindSetEnabled = {
        ...state.rewind,
        rewindEnabled: action.state,
        bucketToRewind: action.bucket,
        dateToRewind: action.dateRewind,
      };
      return { ...state, rewind: rewindSetEnabled };
    case REWIND_RESET_REWIND:
      const resetItem = {
        rewindEnabled: false,
        bucketToRewind: "",
        dateToRewind: null,
      };
      return { ...state, rewind: resetItem };
    case REWIND_FILE_MODE_ENABLED:
      return { ...state, fileMode: action.status };
    default:
      return state;
  }
}

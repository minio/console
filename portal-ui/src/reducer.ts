// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
  MENU_OPEN,
  OPERATOR_MODE,
  SERVER_IS_LOADING,
  SERVER_NEEDS_RESTART,
  SystemActionTypes,
  SystemState,
  USER_LOGGED,
  SET_LOADING_PROGRESS,
  SET_SNACK_BAR_MESSAGE,
  SET_ERROR_SNACK_MESSAGE,
  SET_SERVER_DIAG_STAT,
  SET_SNACK_MODAL_MESSAGE,
  SET_MODAL_ERROR_MESSAGE,
} from "./types";

const initialState: SystemState = {
  loggedIn: false,
  operatorMode: false,
  session: "",
  userName: "",
  sidebarOpen: true,
  serverNeedsRestart: false,
  serverIsLoading: false,
  loadingProgress: 100,
  snackBar: {
    message: "",
    type: "message",
  },
  modalSnackBar: {
    message: "",
    type: "message",
  },
  serverDiagnosticStatus: "",
};

export function systemReducer(
  state = initialState,
  action: SystemActionTypes
): SystemState {
  switch (action.type) {
    case USER_LOGGED:
      return {
        ...state,
        loggedIn: action.logged,
      };
    case OPERATOR_MODE:
      return {
        ...state,
        operatorMode: action.operatorMode,
      };
    case MENU_OPEN:
      return {
        ...state,
        sidebarOpen: action.open,
      };
    case SERVER_NEEDS_RESTART:
      return {
        ...state,
        serverNeedsRestart: action.needsRestart,
      };

    case SERVER_IS_LOADING:
      return {
        ...state,
        serverIsLoading: action.isLoading,
      };
    case SET_LOADING_PROGRESS:
      return {
        ...state,
        loadingProgress: action.loadingProgress,
      };
    case SET_SNACK_BAR_MESSAGE:
      return {
        ...state,
        snackBar: { message: action.message, type: "message" },
      };
    case SET_ERROR_SNACK_MESSAGE:
      return {
        ...state,
        snackBar: { message: action.message, type: "error" },
      };
    case SET_SNACK_MODAL_MESSAGE:
      return {
        ...state,
        modalSnackBar: { message: action.message, type: "message" },
      };
    case SET_MODAL_ERROR_MESSAGE:
      return {
        ...state,
        modalSnackBar: { message: action.message, type: "error" },
      };
    case SET_SERVER_DIAG_STAT:
      return {
        ...state,
        serverDiagnosticStatus: action.serverDiagnosticStatus,
      };
    default:
      return state;
  }
}

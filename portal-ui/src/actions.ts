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
  USER_LOGGED,
  SET_LOADING_PROGRESS,
  SET_SNACK_BAR_MESSAGE,
} from "./types";

export function userLoggedIn(loggedIn: boolean) {
  return {
    type: USER_LOGGED,
    logged: loggedIn,
  };
}

export function consoleOperatorMode(operatorMode: boolean) {
  return {
    type: OPERATOR_MODE,
    operatorMode: operatorMode,
  };
}

export function setMenuOpen(open: boolean) {
  return {
    type: MENU_OPEN,
    open: open,
  };
}

export function serverNeedsRestart(needsRestart: boolean) {
  return {
    type: SERVER_NEEDS_RESTART,
    needsRestart: needsRestart,
  };
}

export function serverIsLoading(isLoading: boolean) {
  return {
    type: SERVER_IS_LOADING,
    isLoading: isLoading,
  };
}

export const setLoadingProgress = (progress: number) => {
  return {
    type: SET_LOADING_PROGRESS,
    loadingProgress: progress,
  };
};

export const setSnackBarMessage = (message: string) => {
  return {
    type: SET_SNACK_BAR_MESSAGE,
    snackBarMessage: message,
  };
};

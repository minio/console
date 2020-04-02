// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2019 MinIO, Inc.
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

import {MENU_OPEN, SystemActionTypes, SystemState, USER_LOGGED} from "./types";

const initialState: SystemState = {
  loggedIn: false,
  session: "",
  userName: "",
  sidebarOpen:true,
};

export function systemReducer(
  state = initialState,
  action: SystemActionTypes
): SystemState {
  switch (action.type) {
    case USER_LOGGED:
      return {
        ...state,
        loggedIn: action.logged
      };
    case MENU_OPEN:
      return {
        ...state,
        sidebarOpen: action.open
      };
    default:
      return state;
  }
}

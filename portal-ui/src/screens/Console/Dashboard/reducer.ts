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

import { zoomState } from "./types";
import {
  ZoomActionTypes,
  DASHBOARD_OPEN_ZOOM,
  DASHBOARD_CLOSE_ZOOM,
} from "./actions";

export interface DashboardState {
  zoom: zoomState;
}

const initialState: DashboardState = {
  zoom: {
    openZoom: false,
    widgetRender: null,
  },
};

export function dashboardReducer(
  state = initialState,
  action: ZoomActionTypes
): DashboardState {
  switch (action.type) {
    case DASHBOARD_OPEN_ZOOM:
      return {
        ...state,
        zoom: {
          openZoom: true,
          widgetRender: { ...action.widget },
        },
      };
    case DASHBOARD_CLOSE_ZOOM:
      return {
        ...state,
        zoom: {
          openZoom: false,
          widgetRender: null,
        },
      };
    default:
      return state;
  }
}

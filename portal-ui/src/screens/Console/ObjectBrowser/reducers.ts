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
import history from "../../../history";

import {
  OBJECT_BROWSER_ADD_ROUTE,
  OBJECT_BROWSER_REMOVE_ROUTE_LEVEL,
  OBJECT_BROWSER_RESET_ROUTES_LIST,
  OBJECT_BROWSER_SET_ALL_ROUTES,
  ObjectBrowserActionTypes,
} from "./actions";

export interface Route {
  route: string;
  label: string;
}

export interface ObjectBrowserState {
  routesList: Route[];
}

const initialRoute = [{ route: "/object-browser", label: "All Buckets" }];

const initialState: ObjectBrowserState = {
  routesList: initialRoute,
};

export function objectBrowserReducer(
  state = initialState,
  action: ObjectBrowserActionTypes
): ObjectBrowserState {
  switch (action.type) {
    case OBJECT_BROWSER_ADD_ROUTE:
      const newRouteList = [
        ...state.routesList,
        { route: action.route, label: action.label },
      ];
      history.push(action.route);

      return { ...state, routesList: newRouteList };
    case OBJECT_BROWSER_RESET_ROUTES_LIST:
      return {
        ...state,
        routesList: [...initialRoute],
      };
    case OBJECT_BROWSER_REMOVE_ROUTE_LEVEL:
      const indexOfTopPath =
        state.routesList.findIndex(
          (element) => element.route === action.toRoute
        ) + 1;
      const newRouteLevels = state.routesList.slice(0, indexOfTopPath);

      return {
        ...state,
        routesList: newRouteLevels,
      };
    case OBJECT_BROWSER_SET_ALL_ROUTES:
      const splitRoutes = action.currentRoute.split("/");
      const routesArray: Route[] = [];
      let initRoute = initialRoute[0].route;

      splitRoutes.forEach((route) => {
        if (route !== "" && route !== "object-browser") {
          initRoute = `${initRoute}/${route}`;
          routesArray.push({ route: initRoute, label: route });
        }
      });

      const newSetOfRoutes = [...initialRoute, ...routesArray];

      return {
        ...state,
        routesList: newSetOfRoutes,
      };
    default:
      return state;
  }
}

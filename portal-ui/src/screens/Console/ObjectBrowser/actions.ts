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

export const OBJECT_BROWSER_ADD_ROUTE = "OBJECT_BROWSER/ADD_ROUTE";
export const OBJECT_BROWSER_RESET_ROUTES_LIST =
  "OBJECT_BROWSER/RESET_ROUTES_LIST";
export const OBJECT_BROWSER_REMOVE_ROUTE_LEVEL =
  "OBJECT_BROWSER/REMOVE_ROUTE_LEVEL";
export const OBJECT_BROWSER_SET_ALL_ROUTES = "OBJECT_BROWSER/SET_ALL_ROUTES";

interface AddRouteAction {
  type: typeof OBJECT_BROWSER_ADD_ROUTE;
  route: string;
  label: string;
}

interface ResetRoutesList {
  type: typeof OBJECT_BROWSER_RESET_ROUTES_LIST;
  reset: boolean;
}

interface RemoveRouteLevel {
  type: typeof OBJECT_BROWSER_REMOVE_ROUTE_LEVEL;
  toRoute: string;
}

interface SetAllRoutes {
  type: typeof OBJECT_BROWSER_SET_ALL_ROUTES;
  currentRoute: string;
}

export type ObjectBrowserActionTypes =
  | AddRouteAction
  | ResetRoutesList
  | RemoveRouteLevel
  | SetAllRoutes;

export const addRoute = (route: string, label: string) => {
  return {
    type: OBJECT_BROWSER_ADD_ROUTE,
    route,
    label,
  };
};

export const resetRoutesList = (reset: boolean) => {
  console.log("RESET");
  return {
    type: OBJECT_BROWSER_RESET_ROUTES_LIST,
    reset,
  };
};

export const removeRouteLevel = (toRoute: string) => {
  return {
    type: OBJECT_BROWSER_REMOVE_ROUTE_LEVEL,
    toRoute,
  };
};

export const setAllRoutes = (currentRoute: string) => {
  return {
    type: OBJECT_BROWSER_SET_ALL_ROUTES,
    currentRoute,
  };
};

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
import history from "../../../history";

import {
  OBJECT_BROWSER_ADD_ROUTE,
  OBJECT_BROWSER_CREATE_FOLDER,
  OBJECT_BROWSER_REMOVE_ROUTE_LEVEL,
  OBJECT_BROWSER_RESET_ROUTES_LIST,
  OBJECT_BROWSER_SET_ALL_ROUTES,
  OBJECT_BROWSER_SET_LAST_AS_FILE,
  OBJECT_BROWSER_DOWNLOAD_FILE_LOADER,
  OBJECT_BROWSER_DOWNLOADED_FILE,
  REWIND_SET_ENABLE,
  REWIND_RESET_REWIND,
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
  routesList: Route[];
  downloadingFiles: string[];
  rewind: RewindItem;
}

export interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

const initialRoute = [
  { route: "/object-browser", label: "All Buckets", type: "path" },
];

const defaultRewind = {
  rewindEnabled: false,
  bucketToRewind: "",
  dateToRewind: null,
};

const initialState: ObjectBrowserState = {
  routesList: initialRoute,
  downloadingFiles: [],
  rewind: {
    ...defaultRewind,
  },
};

export function objectBrowserReducer(
  state = initialState,
  action: ObjectBrowserActionTypes
): ObjectBrowserState {
  switch (action.type) {
    case OBJECT_BROWSER_ADD_ROUTE:
      const newRouteList = [
        ...state.routesList,
        { route: action.route, label: action.label, type: action.routeType },
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

          routesArray.push({
            route: initRoute,
            label: route,
            type: "path",
          });
        }
      });

      const newSetOfRoutes = [...initialRoute, ...routesArray];

      return {
        ...state,
        routesList: newSetOfRoutes,
      };
    case OBJECT_BROWSER_CREATE_FOLDER:
      const newFoldersRoutes = [...state.routesList];
      let lastRoute = state.routesList[state.routesList.length - 1].route;

      const splitElements = action.newRoute.split("/");

      splitElements.forEach((element) => {
        const folderTrim = element.trim();
        if (folderTrim !== "") {
          lastRoute = `${lastRoute}/${folderTrim}`;

          const newItem = { route: lastRoute, label: folderTrim, type: "path" };
          newFoldersRoutes.push(newItem);
        }
      });

      history.push(lastRoute);

      return {
        ...state,
        routesList: newFoldersRoutes,
      };
    case OBJECT_BROWSER_SET_LAST_AS_FILE:
      const currentList = state.routesList;
      const lastItem = currentList.slice(-1)[0];

      if (lastItem.type === "path") {
        lastItem.type = "file";
      }

      const newList = [...currentList.slice(0, -1), lastItem];

      return {
        ...state,
        routesList: newList,
      };
    case OBJECT_BROWSER_DOWNLOAD_FILE_LOADER:
      const actualFiles = [...state.downloadingFiles];

      actualFiles.push(action.path);

      return {
        ...state,
        downloadingFiles: [...actualFiles],
      };
    case OBJECT_BROWSER_DOWNLOADED_FILE:
      const downloadingFiles = state.downloadingFiles.filter(
        (item) => item !== action.path
      );

      return {
        ...state,
        downloadingFiles: [...downloadingFiles],
      };
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
    default:
      return state;
  }
}

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

export const OBJECT_BROWSER_ADD_ROUTE = "OBJECT_BROWSER/ADD_ROUTE";
export const OBJECT_BROWSER_RESET_ROUTES_LIST =
  "OBJECT_BROWSER/RESET_ROUTES_LIST";
export const OBJECT_BROWSER_REMOVE_ROUTE_LEVEL =
  "OBJECT_BROWSER/REMOVE_ROUTE_LEVEL";
export const OBJECT_BROWSER_SET_ALL_ROUTES = "OBJECT_BROWSER/SET_ALL_ROUTES";
export const OBJECT_BROWSER_CREATE_FOLDER = "OBJECT_BROWSER/CREATE_FOLDER";
export const OBJECT_BROWSER_SET_LAST_AS_FILE =
  "OBJECT_BROWSER/SET_LAST_AS_FILE";
export const OBJECT_BROWSER_DOWNLOAD_FILE_LOADER =
  "OBJECT_BROWSER/DOWNLOAD_FILE_LOADER";
export const OBJECT_BROWSER_DOWNLOADED_FILE = "OBJECT_BROWSER/DOWNLOADED_FILE";
export const REWIND_SET_ENABLE = "REWIND/SET_ENABLE";
export const REWIND_RESET_REWIND = "REWIND/RESET_REWIND";

interface AddRouteAction {
  type: typeof OBJECT_BROWSER_ADD_ROUTE;
  route: string;
  label: string;
  routeType: string;
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

interface CreateFolder {
  type: typeof OBJECT_BROWSER_CREATE_FOLDER;
  newRoute: string;
}

interface SetLastAsFile {
  type: typeof OBJECT_BROWSER_SET_LAST_AS_FILE;
}

interface SetFileDownload {
  type: typeof OBJECT_BROWSER_DOWNLOAD_FILE_LOADER;
  path: string;
}

interface FileDownloaded {
  type: typeof OBJECT_BROWSER_DOWNLOADED_FILE;
  path: string;
}

interface RewindSetEnabled {
  type: typeof REWIND_SET_ENABLE;
  bucket: string;
  state: boolean;
  dateRewind: any;
}

interface RewindReset {
  type: typeof REWIND_RESET_REWIND;
}

export type ObjectBrowserActionTypes =
  | AddRouteAction
  | ResetRoutesList
  | RemoveRouteLevel
  | SetAllRoutes
  | CreateFolder
  | SetLastAsFile
  | SetFileDownload
  | FileDownloaded
  | RewindSetEnabled
  | RewindReset;

export const addRoute = (route: string, label: string, routeType: string) => {
  return {
    type: OBJECT_BROWSER_ADD_ROUTE,
    route,
    label,
    routeType,
  };
};

export const resetRoutesList = (reset: boolean) => {
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

export const createFolder = (newRoute: string) => {
  return {
    type: OBJECT_BROWSER_CREATE_FOLDER,
    newRoute,
  };
};

export const setLastAsFile = () => {
  return {
    type: OBJECT_BROWSER_SET_LAST_AS_FILE,
  };
};

export const fileIsBeingPrepared = (path: string) => {
  return {
    type: OBJECT_BROWSER_DOWNLOAD_FILE_LOADER,
    path,
  };
};

export const fileDownloadStarted = (path: string) => {
  return {
    type: OBJECT_BROWSER_DOWNLOADED_FILE,
    path,
  };
};

export const setRewindEnable = (
  state: boolean,
  bucket: string,
  dateRewind: any
) => {
  return {
    type: REWIND_SET_ENABLE,
    state,
    bucket,
    dateRewind,
  };
};

export const resetRewind = () => {
  return {
    type: REWIND_RESET_REWIND,
  };
};

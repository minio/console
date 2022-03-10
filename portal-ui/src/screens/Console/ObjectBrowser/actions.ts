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

import { IFileItem } from "./reducers";

export const REWIND_SET_ENABLE = "REWIND/SET_ENABLE";
export const REWIND_RESET_REWIND = "REWIND/RESET_REWIND";

export const OBJECT_MANAGER_NEW_OBJECT = "OBJECT_MANAGER/NEW_OBJECT";
export const OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT =
  "OBJECT_MANAGER/UPDATE_PROGRESS_OBJECT";
export const OBJECT_MANAGER_COMPLETE_OBJECT = "OBJECT_MANAGER/COMPLETE_OBJECT";
export const OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST =
  "OBJECT_MANAGER/DELETE_FROM_OBJECT_LIST";
export const OBJECT_MANAGER_CLEAN_LIST = "OBJECT_MANAGER/CLEAN_LIST";
export const OBJECT_MANAGER_TOGGLE_LIST = "OBJECT_MANAGER/TOGGLE_LIST";
export const OBJECT_MANAGER_OPEN_LIST = "OBJECT_MANAGER/OPEN_LIST";
export const OBJECT_MANAGER_CLOSE_LIST = "OBJECT_MANAGER/CLOSE_LIST";
export const OBJECT_MANAGER_SET_SEARCH_OBJECT =
  "OBJECT_MANAGER/SET_SEARCH_OBJECT";

export const BUCKET_BROWSER_VERSIONS_MODE_ENABLED =
  "BUCKET_BROWSER/VERSIONS_MODE_ENABLED";
export const BUCKET_BROWSER_VERSIONS_SET_SEARCH =
  "BUCKET_BROWSER/VERSIONS_SET_SEARCH";
export const BUCKET_BROWSER_SET_SELECTED_VERSION =
  "BUCKET_BROWSER/SET_SELECTED_VERSION";
export const BUCKET_BROWSER_SHOW_DELETED = "BUCKET_BROWSER/SHOW_DELETED";

interface RewindSetEnabled {
  type: typeof REWIND_SET_ENABLE;
  bucket: string;
  state: boolean;
  dateRewind: any;
}

interface RewindReset {
  type: typeof REWIND_RESET_REWIND;
}

interface VersionsModeEnabled {
  type: typeof BUCKET_BROWSER_VERSIONS_MODE_ENABLED;
  status: boolean;
  objectName: string;
}

interface OMNewObject {
  type: typeof OBJECT_MANAGER_NEW_OBJECT;
  newObject: IFileItem;
}

interface OMUpdateProgress {
  type: typeof OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT;
  instanceID: string;
  progress: number;
}

interface OMCompleteObject {
  type: typeof OBJECT_MANAGER_COMPLETE_OBJECT;
  instanceID: string;
}

interface OMDeleteFromList {
  type: typeof OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST;
  instanceID: string;
}

interface OMCleanList {
  type: typeof OBJECT_MANAGER_CLEAN_LIST;
}

interface OMToggleList {
  type: typeof OBJECT_MANAGER_TOGGLE_LIST;
}

interface OMOpenList {
  type: typeof OBJECT_MANAGER_OPEN_LIST;
}

interface OMCloseList {
  type: typeof OBJECT_MANAGER_CLOSE_LIST;
}

interface SetSearchObjects {
  type: typeof OBJECT_MANAGER_SET_SEARCH_OBJECT;
  searchString: string;
}

interface SetSearchVersions {
  type: typeof BUCKET_BROWSER_VERSIONS_SET_SEARCH;
  searchString: string;
}

interface SetSelectedversion {
  type: typeof BUCKET_BROWSER_SET_SELECTED_VERSION;
  selectedVersion: string;
}

interface SetShowDeletedObjects {
  type: typeof BUCKET_BROWSER_SHOW_DELETED;
  status: boolean;
}

export type ObjectBrowserActionTypes =
  | RewindSetEnabled
  | RewindReset
  | VersionsModeEnabled
  | OMNewObject
  | OMUpdateProgress
  | OMCompleteObject
  | OMDeleteFromList
  | OMCleanList
  | OMToggleList
  | OMOpenList
  | OMCloseList
  | SetSearchObjects
  | SetSearchVersions
  | SetSelectedversion
  | SetShowDeletedObjects;

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

export const setVersionsModeEnabled = (
  status: boolean,
  objectName: string = ""
) => {
  return {
    type: BUCKET_BROWSER_VERSIONS_MODE_ENABLED,
    status,
    objectName,
  };
};

export const setNewObject = (newObject: IFileItem) => {
  return {
    type: OBJECT_MANAGER_NEW_OBJECT,
    newObject,
  };
};

export const updateProgress = (instanceID: string, progress: number) => {
  return {
    type: OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT,
    instanceID,
    progress,
  };
};

export const completeObject = (instanceID: string) => {
  return {
    type: OBJECT_MANAGER_COMPLETE_OBJECT,
    instanceID,
  };
};

export const deleteFromList = (instanceID: string) => {
  return {
    type: OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST,
    instanceID,
  };
};

export const cleanList = () => {
  return {
    type: OBJECT_MANAGER_CLEAN_LIST,
  };
};

export const toggleList = () => {
  return {
    type: OBJECT_MANAGER_TOGGLE_LIST,
  };
};

export const openList = () => {
  return {
    type: OBJECT_MANAGER_OPEN_LIST,
  };
};

export const closeList = () => {
  return {
    type: OBJECT_MANAGER_CLOSE_LIST,
  };
};

export const setSearchObjects = (searchString: string) => {
  return {
    type: OBJECT_MANAGER_SET_SEARCH_OBJECT,
    searchString,
  };
};

export const setSearchVersions = (searchString: string) => {
  return {
    type: BUCKET_BROWSER_VERSIONS_SET_SEARCH,
    searchString,
  };
};

export const setSelectedVersion = (selectedVersion: string) => {
  return {
    type: BUCKET_BROWSER_SET_SELECTED_VERSION,
    selectedVersion,
  };
};

export const setShowDeletedObjects = (status: boolean) => {
  return {
    type: BUCKET_BROWSER_SHOW_DELETED,
    status,
  };
};

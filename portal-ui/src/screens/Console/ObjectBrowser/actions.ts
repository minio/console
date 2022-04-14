// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
  BUCKET_BROWSER_LOAD_OBJECT_DETAILS,
  BUCKET_BROWSER_LOAD_VERSIONS,
  BUCKET_BROWSER_OBJECT_DETAILS_STATE,
  BUCKET_BROWSER_SET_SELECTED_VERSION,
  BUCKET_BROWSER_SHOW_DELETED,
  BUCKET_BROWSER_VERSIONS_MODE_ENABLED,
  BUCKET_BROWSER_VERSIONS_SET_SEARCH,
  OBJECT_MANAGER_CLEAN_LIST,
  OBJECT_MANAGER_CLOSE_LIST,
  OBJECT_MANAGER_COMPLETE_OBJECT,
  OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST,
  OBJECT_MANAGER_NEW_OBJECT,
  OBJECT_MANAGER_OPEN_LIST,
  OBJECT_MANAGER_SET_SEARCH_OBJECT,
  OBJECT_MANAGER_TOGGLE_LIST,
  OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT,
  REWIND_RESET_REWIND,
  REWIND_SET_ENABLE,
  IFileItem,
  BUCKET_BROWSER_SET_SELECTED_OBJECT, OBJECT_MANAGER_SET_LOADING,
} from "./types";

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

export const setLoadingVersions = (status: boolean) => {
  return {
    type: BUCKET_BROWSER_LOAD_VERSIONS,
    status,
  };
};

export const setLoadingObjectInfo = (status: boolean) => {
  return {
    type: BUCKET_BROWSER_LOAD_OBJECT_DETAILS,
    status,
  };
};

export const setObjectDetailsView = (status: boolean) => {
  return {
    type: BUCKET_BROWSER_OBJECT_DETAILS_STATE,
    status,
  };
};

export const setSelectedObjectView = (object: string | null) => {
  return {
    type: BUCKET_BROWSER_SET_SELECTED_OBJECT,
    object,
  };
};

export const setLoadingObjectsList = (status: boolean) => {
  return {
    type: OBJECT_MANAGER_SET_LOADING,
    status,
  }
};

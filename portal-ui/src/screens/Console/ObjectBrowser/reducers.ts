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
import {
  REWIND_SET_ENABLE,
  REWIND_RESET_REWIND,
  BUCKET_BROWSER_VERSIONS_MODE_ENABLED,
  ObjectBrowserActionTypes,
  OBJECT_MANAGER_NEW_OBJECT,
  OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT,
  OBJECT_MANAGER_COMPLETE_OBJECT,
  OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST,
  OBJECT_MANAGER_CLEAN_LIST,
  OBJECT_MANAGER_TOGGLE_LIST,
  OBJECT_MANAGER_CLOSE_LIST,
  OBJECT_MANAGER_OPEN_LIST,
  OBJECT_MANAGER_SET_SEARCH_OBJECT,
  BUCKET_BROWSER_VERSIONS_SET_SEARCH,
  BUCKET_BROWSER_SET_SELECTED_VERSION,
  BUCKET_BROWSER_SHOW_DELETED,
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
  rewind: RewindItem;
  objectManager: ObjectManager;
  searchObjects: string;
  versionsMode: boolean;
  versionedFile: string;
  searchVersions: string;
  selectedVersion: string;
  showDeleted: boolean;
}

export interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

export interface ObjectManager {
  objectsToManage: IFileItem[];
  managerOpen: boolean;
}

export interface IFileItem {
  type: "download" | "upload";
  instanceID: string;
  bucketName: string;
  prefix: string;
  percentage: number;
  done: boolean;
  waitingForFile: boolean;
}

const defaultRewind = {
  rewindEnabled: false,
  bucketToRewind: "",
  dateToRewind: null,
};

const initialState: ObjectBrowserState = {
  versionsMode: false,
  rewind: {
    ...defaultRewind,
  },
  objectManager: {
    objectsToManage: [],
    managerOpen: false,
  },
  searchObjects: "",
  versionedFile: "",
  searchVersions: "",
  selectedVersion: "",
  showDeleted: false,
};

export function objectBrowserReducer(
  state = initialState,
  action: ObjectBrowserActionTypes
): ObjectBrowserState {
  switch (action.type) {
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
    case BUCKET_BROWSER_VERSIONS_MODE_ENABLED:
      const objectN = !action.status ? "" : action.objectName;

      return {
        ...state,
        versionsMode: action.status,
        versionedFile: objectN,
        selectedVersion: "",
      };
    case OBJECT_MANAGER_NEW_OBJECT:
      const cloneObjects = [
        action.newObject,
        ...state.objectManager.objectsToManage,
      ];

      return {
        ...state,
        objectManager: {
          objectsToManage: cloneObjects,
          managerOpen: state.objectManager.managerOpen,
        },
      };
    case OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT:
      const copyManager = [...state.objectManager.objectsToManage];

      const itemUpdate = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.instanceID
      );

      if (itemUpdate === -1) {
        return { ...state };
      }

      copyManager[itemUpdate].percentage = action.progress;
      copyManager[itemUpdate].waitingForFile = false;

      return {
        ...state,
        objectManager: {
          objectsToManage: copyManager,
          managerOpen: state.objectManager.managerOpen,
        },
      };
    case OBJECT_MANAGER_COMPLETE_OBJECT:
      const copyObject = [...state.objectManager.objectsToManage];

      const objectToComplete = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.instanceID
      );

      if (objectToComplete === -1) {
        return { ...state };
      }

      copyObject[objectToComplete].percentage = 100;
      copyObject[objectToComplete].waitingForFile = false;
      copyObject[objectToComplete].done = true;

      return {
        ...state,
        objectManager: {
          objectsToManage: copyObject,
          managerOpen: state.objectManager.managerOpen,
        },
      };
    case OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST:
      const notObject = state.objectManager.objectsToManage.filter(
        (element) => element.instanceID !== action.instanceID
      );

      return {
        ...state,
        objectManager: {
          objectsToManage: notObject,
          managerOpen:
            notObject.length === 0 ? false : state.objectManager.managerOpen,
        },
      };
    case OBJECT_MANAGER_CLEAN_LIST:
      const nonCompletedList = state.objectManager.objectsToManage.filter(
        (item) => !item.done
      );

      return {
        ...state,
        objectManager: {
          objectsToManage: nonCompletedList,
          managerOpen:
            nonCompletedList.length === 0
              ? false
              : state.objectManager.managerOpen,
        },
      };
    case OBJECT_MANAGER_TOGGLE_LIST:
      return {
        ...state,
        objectManager: {
          ...state.objectManager,
          managerOpen: !state.objectManager.managerOpen,
        },
      };
    case OBJECT_MANAGER_OPEN_LIST:
      return {
        ...state,
        objectManager: {
          ...state.objectManager,
          managerOpen: true,
        },
      };
    case OBJECT_MANAGER_CLOSE_LIST:
      return {
        ...state,
        objectManager: {
          ...state.objectManager,
          managerOpen: false,
        },
      };
    case OBJECT_MANAGER_SET_SEARCH_OBJECT:
      return {
        ...state,
        searchObjects: action.searchString,
      };
    case BUCKET_BROWSER_VERSIONS_SET_SEARCH:
      return {
        ...state,
        searchVersions: action.searchString,
      };
    case BUCKET_BROWSER_SET_SELECTED_VERSION:
      return {
        ...state,
        selectedVersion: action.selectedVersion,
      };
    case BUCKET_BROWSER_SHOW_DELETED:
      return {
        ...state,
        showDeleted: action.status,
      };
    default:
      return state;
  }
}

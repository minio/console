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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFileItem, ObjectBrowserState } from "./types";

const defaultRewind = {
  rewindEnabled: false,
  bucketToRewind: "",
  dateToRewind: null,
};

const initialState: ObjectBrowserState = {
  versionsMode: false,
  loadingObjects: true,
  objectDetailsOpen: false,
  loadingVersions: true,
  loadingObjectInfo: true,
  rewind: {
    ...defaultRewind,
  },
  objectManager: {
    objectsToManage: [],
    managerOpen: false,
    newItems: false,
  },
  searchObjects: "",
  versionedFile: "",
  searchVersions: "",
  selectedVersion: "",
  showDeleted: false,
  selectedInternalPaths: null,
  simplePath: null,
};

export const objectBrowserSlice = createSlice({
  name: "objectBrowser",
  initialState,
  reducers: {
    setRewindEnable: (
      state,
      action: PayloadAction<{
        state: boolean;
        bucket: string;
        dateRewind: any;
      }>
    ) => {
      state.rewind.rewindEnabled = action.payload.state;
      state.rewind.bucketToRewind = action.payload.bucket;
      state.rewind.dateToRewind = action.payload.dateRewind;
    },
    resetRewind: (state) => {
      state.rewind.rewindEnabled = false;
      state.rewind.bucketToRewind = "";
      state.rewind.dateToRewind = null;
    },
    setVersionsModeEnabled: (
      state,
      action: PayloadAction<{
        status: boolean;
        objectName?: string;
      }>
    ) => {
      let objN = "";
      if (action.payload.objectName) {
        objN = action.payload.objectName;
      }
      const objectN = !action.payload.status ? "" : objN;
      state.versionsMode = action.payload.status;
      state.versionedFile = objectN;
      state.selectedVersion = "";
    },
    setNewObject: (state, action: PayloadAction<IFileItem>) => {
      state.objectManager.objectsToManage.push(action.payload);
      state.objectManager.newItems = true;
    },
    updateProgress: (
      state,
      action: PayloadAction<{
        instanceID: string;
        progress: number;
      }>
    ) => {
      const itemUpdate = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.payload.instanceID
      );

      if (itemUpdate === -1) {
        return;
      }

      state.objectManager.objectsToManage[itemUpdate].percentage =
        action.payload.progress;
      state.objectManager.objectsToManage[itemUpdate].waitingForFile = false;
    },
    completeObject: (state, action: PayloadAction<string>) => {
      const objectToComplete = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.payload
      );

      if (objectToComplete === -1) {
        return;
      }

      state.objectManager.objectsToManage[objectToComplete].percentage = 100;
      state.objectManager.objectsToManage[objectToComplete].waitingForFile =
        false;
      state.objectManager.objectsToManage[objectToComplete].done = true;
    },
    failObject: (state, action: PayloadAction<string>) => {
      const objectToFail = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.payload
      );

      state.objectManager.objectsToManage[objectToFail].failed = true;
    },
    cancelObjectInList: (state, action: PayloadAction<string>) => {
      const objectToCancel = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.payload
      );

      if (objectToCancel === -1) {
        return { ...state };
      }

      state.objectManager.objectsToManage[objectToCancel].cancelled = true;
      state.objectManager.objectsToManage[objectToCancel].done = true;
      state.objectManager.objectsToManage[objectToCancel].percentage = 0;
    },
    deleteFromList: (state, action: PayloadAction<string>) => {
      const notObject = state.objectManager.objectsToManage.filter(
        (element) => element.instanceID !== action.payload
      );

      state.objectManager.objectsToManage = notObject;
      state.objectManager.managerOpen =
        notObject.length === 0 ? false : state.objectManager.managerOpen;
    },
    cleanList: (state) => {
      const nonCompletedList = state.objectManager.objectsToManage.filter(
        (item) => item.percentage !== 100
      );
      state.objectManager.objectsToManage = nonCompletedList;
      state.objectManager.managerOpen =
        nonCompletedList.length === 0 ? false : state.objectManager.managerOpen;
      state.objectManager.newItems = false;
    },
    toggleList: (state) => {
      state.objectManager.managerOpen = !state.objectManager.managerOpen;
      state.objectManager.newItems = false;
    },
    openList: (state) => {
      state.objectManager.managerOpen = true;
    },
    closeList: (state) => {
      state.objectManager.managerOpen = false;
    },
    setSearchObjects: (state, action: PayloadAction<string>) => {
      state.searchObjects = action.payload;
    },
    setLoadingObjectsList: (state, action: PayloadAction<boolean>) => {
      state.loadingObjects = action.payload;
    },
    setSearchVersions: (state, action: PayloadAction<string>) => {
      state.searchVersions = action.payload;
    },
    setSelectedVersion: (state, action: PayloadAction<string>) => {
      state.selectedVersion = action.payload;
    },
    setShowDeletedObjects: (state, action: PayloadAction<boolean>) => {
      state.showDeleted = action.payload;
    },
    setLoadingVersions: (state, action: PayloadAction<boolean>) => {
      state.loadingVersions = action.payload;
    },
    setLoadingObjectInfo: (state, action: PayloadAction<boolean>) => {
      state.loadingObjectInfo = action.payload;
    },
    setObjectDetailsView: (state, action: PayloadAction<boolean>) => {
      state.objectDetailsOpen = action.payload;
      state.selectedInternalPaths = action.payload
        ? state.selectedInternalPaths
        : null;
    },
    setSelectedObjectView: (state, action: PayloadAction<string | null>) => {
      state.selectedInternalPaths = action.payload;
    },
    setSimplePathHandler: (state, action: PayloadAction<string>) => {
      state.simplePath = action.payload;
    },
  },
});
export const {
  setRewindEnable,
  resetRewind,
  setVersionsModeEnabled,
  setNewObject,
  updateProgress,
  completeObject,
  failObject,
  deleteFromList,
  cleanList,
  toggleList,
  openList,
  closeList,
  setSearchObjects,
  setLoadingObjectsList,
  cancelObjectInList,
  setSearchVersions,
  setSelectedVersion,
  setShowDeletedObjects,
  setLoadingVersions,
  setLoadingObjectInfo,
  setObjectDetailsView,
  setSelectedObjectView,
  setSimplePathHandler,
} = objectBrowserSlice.actions;

export default objectBrowserSlice.reducer;

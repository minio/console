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
import {
  BucketObjectItem,
  IRestoreLocalObjectList,
} from "../Buckets/ListBuckets/Objects/ListObjects/types";

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
    startedItems: [],
    currentDownloads: [],
    currentUploads: [],
  },
  searchObjects: "",
  versionedFile: "",
  searchVersions: "",
  selectedVersion: "",
  showDeleted: false,
  selectedInternalPaths: null,
  simplePath: null,
  // object browser
  records: [],
  loadRecords: true,
  loadingVersioning: true,
  isVersioned: false,
  lockingEnabled: false,
  loadingLocking: false,
  selectedObjects: [],
  downloadRenameModal: null,
  selectedPreview: null,
  previewOpen: false,
  shareFileModalOpen: false,
  isOpeningObjectDetail: false,
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

      // We cancel from in-progress lists
      const type = state.objectManager.objectsToManage[objectToComplete].type;
      const ID = state.objectManager.objectsToManage[objectToComplete].ID;

      if (type === "download") {
        state.objectManager.currentDownloads =
          state.objectManager.currentDownloads.filter((item) => item !== ID);
      } else if (type === "upload") {
        state.objectManager.currentUploads =
          state.objectManager.currentUploads.filter((item) => item !== ID);
      }
    },
    failObject: (
      state,
      action: PayloadAction<{ instanceID: string; msg: string }>
    ) => {
      const objectToFail = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.payload.instanceID
      );

      state.objectManager.objectsToManage[objectToFail].failed = true;
      state.objectManager.objectsToManage[objectToFail].waitingForFile = false;
      state.objectManager.objectsToManage[objectToFail].done = true;
      state.objectManager.objectsToManage[objectToFail].errorMessage =
        action.payload.msg;

      // We cancel from in-progress lists
      const type = state.objectManager.objectsToManage[objectToFail].type;
      const ID = state.objectManager.objectsToManage[objectToFail].ID;

      if (type === "download") {
        state.objectManager.currentDownloads =
          state.objectManager.currentDownloads.filter((item) => item !== ID);
      } else if (type === "upload") {
        state.objectManager.currentUploads =
          state.objectManager.currentUploads.filter((item) => item !== ID);
      }
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

      // We cancel from in-progress lists
      const type = state.objectManager.objectsToManage[objectToCancel].type;
      const ID = state.objectManager.objectsToManage[objectToCancel].ID;

      if (type === "download") {
        state.objectManager.currentDownloads =
          state.objectManager.currentDownloads.filter((item) => item !== ID);
      } else if (type === "upload") {
        state.objectManager.currentUploads =
          state.objectManager.currentUploads.filter((item) => item !== ID);
      }
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
    setLoadingObjects: (state, action: PayloadAction<boolean>) => {
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
    newDownloadInit: (state, action: PayloadAction<string>) => {
      state.objectManager.currentDownloads = [
        ...state.objectManager.currentDownloads,
        action.payload,
      ];
    },
    newUploadInit: (state, action: PayloadAction<string>) => {
      state.objectManager.currentUploads = [
        ...state.objectManager.currentUploads,
        action.payload,
      ];
    },
    setRecords: (state, action: PayloadAction<BucketObjectItem[]>) => {
      state.records = action.payload;
    },
    setLoadingVersioning: (state, action: PayloadAction<boolean>) => {
      state.loadingVersioning = action.payload;
    },
    setIsVersioned: (state, action: PayloadAction<boolean>) => {
      state.isVersioned = action.payload;
    },
    setLockingEnabled: (state, action: PayloadAction<boolean>) => {
      state.lockingEnabled = action.payload;
    },
    setLoadingLocking: (state, action: PayloadAction<boolean>) => {
      state.loadingLocking = action.payload;
    },
    newMessage: (state, action: PayloadAction<BucketObjectItem[]>) => {
      state.records = [...state.records, ...action.payload];
    },
    resetMessages: (state) => {
      state.records = [];
    },
    setLoadingRecords: (state, action: PayloadAction<boolean>) => {
      state.loadRecords = action.payload;
    },
    setSelectedObjects: (state, action: PayloadAction<string[]>) => {
      state.selectedObjects = action.payload;
    },
    setDownloadRenameModal: (
      state,
      action: PayloadAction<BucketObjectItem | null>
    ) => {
      state.downloadRenameModal = action.payload;
    },
    setSelectedPreview: (
      state,
      action: PayloadAction<BucketObjectItem | null>
    ) => {
      state.selectedPreview = action.payload;
    },
    setPreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.previewOpen = action.payload;
    },
    setShareFileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.shareFileModalOpen = action.payload;
    },
    restoreLocalObjectList: (
      state,
      action: PayloadAction<IRestoreLocalObjectList>
    ) => {
      const indexToReplace = state.records.findIndex(
        (element) => element.name === action.payload.prefix
      );

      if (indexToReplace >= 0) {
        state.records[indexToReplace].delete_flag =
          action.payload.objectInfo.is_delete_marker;
        state.records[indexToReplace].size = parseInt(
          action.payload.objectInfo.size || "0"
        );
      }
    },
    setIsOpeningOD: (state, action: PayloadAction<boolean>) => {
      state.isOpeningObjectDetail = action.payload;
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
  setLoadingObjects,
  cancelObjectInList,
  setSearchVersions,
  setSelectedVersion,
  setShowDeletedObjects,
  setLoadingVersions,
  setLoadingObjectInfo,
  setObjectDetailsView,
  setSelectedObjectView,
  setSimplePathHandler,
  newDownloadInit,
  newUploadInit,
  setRecords,
  resetMessages,
  setLoadingVersioning,
  setIsVersioned,
  setLoadingLocking,
  setLockingEnabled,
  newMessage,
  setSelectedObjects,
  setDownloadRenameModal,
  setSelectedPreview,
  setPreviewOpen,
  setShareFileModalOpen,
  setLoadingRecords,
  restoreLocalObjectList,
  setIsOpeningOD,
} = objectBrowserSlice.actions;

export default objectBrowserSlice.reducer;

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

import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";

export const REWIND_SET_ENABLE = "REWIND/SET_ENABLE";
export const REWIND_RESET_REWIND = "REWIND/RESET_REWIND";

export const OBJECT_MANAGER_SET_LOADING = "OBJECT_MANAGER/SET_LOADING";
export const OBJECT_MANAGER_NEW_OBJECT = "OBJECT_MANAGER/NEW_OBJECT";
export const OBJECT_MANAGER_UPDATE_PROGRESS_OBJECT =
  "OBJECT_MANAGER/UPDATE_PROGRESS_OBJECT";
export const OBJECT_MANAGER_COMPLETE_OBJECT = "OBJECT_MANAGER/COMPLETE_OBJECT";
export const OBJECT_MANAGER_ERROR_IN_OBJECT = "OBJECT_MANAGER/ERROR_IN_OBJECT";
export const OBJECT_MANAGER_DELETE_FROM_OBJECT_LIST =
  "OBJECT_MANAGER/DELETE_FROM_OBJECT_LIST";
export const OBJECT_MANAGER_CLEAN_LIST = "OBJECT_MANAGER/CLEAN_LIST";
export const OBJECT_MANAGER_TOGGLE_LIST = "OBJECT_MANAGER/TOGGLE_LIST";
export const OBJECT_MANAGER_OPEN_LIST = "OBJECT_MANAGER/OPEN_LIST";
export const OBJECT_MANAGER_CLOSE_LIST = "OBJECT_MANAGER/CLOSE_LIST";
export const OBJECT_MANAGER_SET_SEARCH_OBJECT =
  "OBJECT_MANAGER/SET_SEARCH_OBJECT";
export const OBJECT_MANAGER_CANCEL_OBJECT = "OBJECT_MANAGER/CANCEL_OBJECT";

export const BUCKET_BROWSER_VERSIONS_MODE_ENABLED =
  "BUCKET_BROWSER/VERSIONS_MODE_ENABLED";
export const BUCKET_BROWSER_VERSIONS_SET_SEARCH =
  "BUCKET_BROWSER/VERSIONS_SET_SEARCH";
export const BUCKET_BROWSER_SET_SELECTED_VERSION =
  "BUCKET_BROWSER/SET_SELECTED_VERSION";
export const BUCKET_BROWSER_SHOW_DELETED = "BUCKET_BROWSER/SHOW_DELETED";
export const BUCKET_BROWSER_LOAD_VERSIONS = "BUCKET_BROWSER/LOAD_VERSIONS";
export const BUCKET_BROWSER_LOAD_OBJECT_DETAILS =
  "BUCKET_BROWSER/LOAD_OBJECT_DETAILS";
export const BUCKET_BROWSER_OBJECT_DETAILS_STATE =
  "BUCKET_BROWSER/OBJECT_DETAILS_STATE";
export const BUCKET_BROWSER_SET_SELECTED_OBJECT =
  "BUCKET_BROWSER/SET_SELECTED_OBJECT";
export const BUCKET_BROWSER_SET_SIMPLE_PATH = "BUCKET_BROWSER/SET_SIMPLE_PATH";

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
  loadingVersions: boolean;
  loadingObjects: boolean;
  loadingObjectInfo: boolean;
  versionsMode: boolean;
  versionedFile: string;
  searchVersions: string;
  selectedVersion: string;
  showDeleted: boolean;
  objectDetailsOpen: boolean;
  selectedInternalPaths: string | null;
  simplePath: string | null;
  records: BucketObjectItem[];
  loadRecords: boolean;
  loadingVersioning: boolean;
  isVersioned: boolean;
  lockingEnabled: boolean;
  loadingLocking: boolean;
  selectedObjects: string[];
  downloadRenameModal: BucketObjectItem | null;
  selectedPreview: BucketObjectItem | null;
  previewOpen: boolean;
  shareFileModalOpen: boolean;
  isOpeningObjectDetail: boolean;
}

export interface ObjectManager {
  objectsToManage: IFileItem[];
  managerOpen: boolean;
  newItems: boolean;
  startedItems: string[];
  currentDownloads: string[];
  currentUploads: string[];
}

export interface IFileItem {
  type: "download" | "upload";
  ID: string;
  instanceID: string;
  bucketName: string;
  prefix: string;
  percentage: number;
  done: boolean;
  waitingForFile: boolean;
  failed: boolean;
  cancelled: boolean;
  errorMessage: string;
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

interface OMSetObjectError {
  type: typeof OBJECT_MANAGER_ERROR_IN_OBJECT;
  status: boolean;
  instanceID: string;
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

interface SetLoadingVersions {
  type: typeof BUCKET_BROWSER_LOAD_VERSIONS;
  status: boolean;
}

interface SetLoadingObjectInfo {
  type: typeof BUCKET_BROWSER_LOAD_OBJECT_DETAILS;
  status: boolean;
}

interface SetObjectDetailsState {
  type: typeof BUCKET_BROWSER_OBJECT_DETAILS_STATE;
  status: boolean;
}

interface SetSelectedObject {
  type: typeof BUCKET_BROWSER_SET_SELECTED_OBJECT;
  object: string | null;
}

interface SetObjectManagerLoading {
  type: typeof OBJECT_MANAGER_SET_LOADING;
  status: boolean;
}

interface CancelObjectInManager {
  type: typeof OBJECT_MANAGER_CANCEL_OBJECT;
  instanceID: string;
}

interface SetBrowserPath {
  type: typeof BUCKET_BROWSER_SET_SIMPLE_PATH;
  path: string;
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
  | OMSetObjectError
  | SetSearchObjects
  | SetSearchVersions
  | SetSelectedversion
  | SetShowDeletedObjects
  | SetLoadingVersions
  | SetLoadingObjectInfo
  | SetObjectDetailsState
  | SetSelectedObject
  | SetObjectManagerLoading
  | CancelObjectInManager
  | SetBrowserPath;

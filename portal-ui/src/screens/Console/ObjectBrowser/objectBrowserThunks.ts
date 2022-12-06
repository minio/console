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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../../../store";
import { encodeURLString, getClientOS } from "../../../common/utils";
import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import { makeid, storeCallForObjectWithID } from "./transferManager";
import { download } from "../Buckets/ListBuckets/Objects/utils";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  setDownloadRenameModal,
  setNewObject,
  setPreviewOpen,
  setSelectedPreview,
  setShareFileModalOpen,
  updateProgress,
} from "./objectBrowserSlice";

export const downloadSelected = createAsyncThunk(
  "objectBrowser/downloadSelected",
  async (bucketName: string, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    const downloadObject = (object: BucketObjectItem) => {
      const identityDownload = encodeURLString(
        `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`
      );

      const ID = makeid(8);

      const downloadCall = download(
        bucketName,
        encodeURLString(object.name),
        object.version_id,
        object.size,
        null,
        ID,
        (progress) => {
          dispatch(
            updateProgress({
              instanceID: identityDownload,
              progress: progress,
            })
          );
        },
        () => {
          dispatch(completeObject(identityDownload));
        },
        (msg: string) => {
          dispatch(failObject({ instanceID: identityDownload, msg }));
        },
        () => {
          dispatch(cancelObjectInList(identityDownload));
        }
      );
      storeCallForObjectWithID(ID, downloadCall);
      dispatch(
        setNewObject({
          ID,
          bucketName,
          done: false,
          instanceID: identityDownload,
          percentage: 0,
          prefix: object.name,
          type: "download",
          waitingForFile: true,
          failed: false,
          cancelled: false,
          errorMessage: "",
        })
      );
    };

    if (state.objectBrowser.selectedObjects.length !== 0) {
      let itemsToDownload: BucketObjectItem[] = [];

      const filterFunction = (currValue: BucketObjectItem) =>
        state.objectBrowser.selectedObjects.includes(currValue.name);

      itemsToDownload = state.objectBrowser.records.filter(filterFunction);

      // I case just one element is selected, then we trigger download modal validation.
      // We are going to enforce zip download when multiple files are selected
      if (itemsToDownload.length === 1) {
        if (
          itemsToDownload[0].name.length > 200 &&
          getClientOS().toLowerCase().includes("win")
        ) {
          dispatch(setDownloadRenameModal(itemsToDownload[0]));
          return;
        }
      }

      itemsToDownload.forEach((filteredItem) => {
        downloadObject(filteredItem);
      });
    }
  }
);

export const openPreview = createAsyncThunk(
  "objectBrowser/openPreview",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    if (state.objectBrowser.selectedObjects.length === 1) {
      let fileObject: BucketObjectItem | undefined;

      const findFunction = (currValue: BucketObjectItem) =>
        state.objectBrowser.selectedObjects.includes(currValue.name);

      fileObject = state.objectBrowser.records.find(findFunction);

      if (fileObject) {
        dispatch(setSelectedPreview(fileObject));
        dispatch(setPreviewOpen(true));
      }
    }
  }
);

export const openShare = createAsyncThunk(
  "objectBrowser/openShare",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    if (state.objectBrowser.selectedObjects.length === 1) {
      let fileObject: BucketObjectItem | undefined;

      const findFunction = (currValue: BucketObjectItem) =>
        state.objectBrowser.selectedObjects.includes(currValue.name);

      fileObject = state.objectBrowser.records.find(findFunction);

      if (fileObject) {
        dispatch(setSelectedPreview(fileObject));
        dispatch(setShareFileModalOpen(true));
      }
    }
  }
);

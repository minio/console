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
import { addBucketAsync } from "./addBucketThunks";
import { ObjectRetentionMode } from "api/consoleApi";

interface AddBucketState {
  loading: boolean;
  isDirty: boolean;
  invalidFields: string[];
  name: string;
  versioningEnabled: boolean;
  lockingEnabled: boolean;
  lockingFieldDisabled: boolean;
  quotaEnabled: boolean;
  quotaSize: string;
  quotaUnit: string;
  retentionEnabled: boolean;
  retentionMode: ObjectRetentionMode;
  retentionUnit: string;
  retentionValidity: number;
  navigateTo: string;
  excludeFolders: boolean;
  excludedPrefixes: string;
}

const initialState: AddBucketState = {
  loading: false,
  isDirty: false,
  invalidFields: [],
  name: "",
  versioningEnabled: false,
  lockingEnabled: false,
  lockingFieldDisabled: false,
  quotaEnabled: false,
  quotaSize: "1",
  quotaUnit: "Ti",
  retentionEnabled: false,
  retentionMode: ObjectRetentionMode.Compliance,
  retentionUnit: "days",
  retentionValidity: 180,
  navigateTo: "",
  excludeFolders: false,
  excludedPrefixes: "",
};

const addBucketsSlice = createSlice({
  name: "addBuckets",
  initialState,
  reducers: {
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;

      if (state.name.trim() === "") {
        state.invalidFields = [...state.invalidFields, "name"];
      } else {
        state.invalidFields = state.invalidFields.filter(
          (field) => field !== "name",
        );
      }
    },
    setVersioning: (state, action: PayloadAction<boolean>) => {
      state.versioningEnabled = action.payload;
      if (!state.versioningEnabled || !state.retentionEnabled) {
        state.retentionEnabled = false;
        state.retentionMode = ObjectRetentionMode.Compliance;
        state.retentionUnit = "days";
        state.retentionValidity = 180;
      }
    },
    setExcludeFolders: (state, action: PayloadAction<boolean>) => {
      state.excludeFolders = action.payload;
    },
    setExcludedPrefixes: (state, action: PayloadAction<string>) => {
      state.excludedPrefixes = action.payload;
    },
    setEnableObjectLocking: (state, action: PayloadAction<boolean>) => {
      state.lockingEnabled = action.payload;
    },
    setQuota: (state, action: PayloadAction<boolean>) => {
      state.quotaEnabled = action.payload;

      if (!action.payload) {
        state.quotaSize = "1";
        state.quotaUnit = "Ti";

        state.invalidFields = state.invalidFields.filter(
          (field) => field !== "quotaSize",
        );
      }
    },
    setQuotaSize: (state, action: PayloadAction<string>) => {
      state.quotaSize = action.payload;

      if (state.quotaEnabled) {
        if (
          state.quotaSize.trim() === "" ||
          parseInt(state.quotaSize) === 0 ||
          !/^\d*(?:\.\d{1,2})?$/.test(state.quotaSize)
        ) {
          state.invalidFields = [...state.invalidFields, "quotaSize"];
        } else {
          state.invalidFields = state.invalidFields.filter(
            (field) => field !== "quotaSize",
          );
        }
      }
    },
    setQuotaUnit: (state, action: PayloadAction<string>) => {
      state.quotaUnit = action.payload;
    },
    setRetention: (state, action: PayloadAction<boolean>) => {
      state.retentionEnabled = action.payload;
      if (!state.versioningEnabled || !state.retentionEnabled) {
        state.retentionEnabled = false;
        state.retentionMode = ObjectRetentionMode.Compliance;
        state.retentionUnit = "days";
        state.retentionValidity = 180;
      }

      if (state.retentionEnabled) {
        // if retention is enabled, then object locking should be enabled as well
        state.lockingEnabled = true;
        state.lockingFieldDisabled = true;
      } else {
        state.lockingFieldDisabled = false;
      }

      if (
        state.retentionEnabled &&
        (Number.isNaN(state.retentionValidity) || state.retentionValidity < 1)
      ) {
        state.invalidFields = [...state.invalidFields, "retentionValidity"];
      } else {
        state.invalidFields = state.invalidFields.filter(
          (field) => field !== "retentionValidity",
        );
      }
    },
    setRetentionMode: (state, action: PayloadAction<ObjectRetentionMode>) => {
      state.retentionMode = action.payload;
    },
    setRetentionUnit: (state, action: PayloadAction<string>) => {
      state.retentionUnit = action.payload;
    },
    setRetentionValidity: (state, action: PayloadAction<number>) => {
      state.retentionValidity = action.payload;
      if (
        state.retentionEnabled &&
        (Number.isNaN(state.retentionValidity) || state.retentionValidity < 1)
      ) {
        state.invalidFields = [...state.invalidFields, "retentionValidity"];
      } else {
        state.invalidFields = state.invalidFields.filter(
          (field) => field !== "retentionValidity",
        );
      }
    },

    resetForm: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBucketAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBucketAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addBucketAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.navigateTo = action.payload.data.bucketName
          ? "/buckets"
          : `/buckets/${action.payload.data.bucketName}/admin`;
      });
  },
});

export const {
  setName,
  setIsDirty,
  setVersioning,
  setEnableObjectLocking,
  setQuota,
  setQuotaSize,
  setQuotaUnit,
  resetForm,
  setRetention,
  setRetentionMode,
  setRetentionUnit,
  setRetentionValidity,
  setExcludedPrefixes,
  setExcludeFolders,
} = addBucketsSlice.actions;

export default addBucketsSlice.reducer;

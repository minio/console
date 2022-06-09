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

export interface AddBucketState {
  loading: boolean;
  valid: boolean;
  name: string;
  versioningEnabled: boolean;
  lockingEnabled: boolean;
  lockingFieldDisabled: boolean;
  quotaEnabled: boolean;
  quotaSize: string;
  quotaUnit: string;
  retentionEnabled: boolean;
  retentionMode: string;
  retentionUnit: string;
  retentionValidity: number;
  navigateTo: string;
}

const initialState: AddBucketState = {
  loading: false,
  valid: false,
  name: "",
  versioningEnabled: false,
  lockingEnabled: false,
  lockingFieldDisabled: false,
  quotaEnabled: false,
  quotaSize: "1",
  quotaUnit: "Ti",
  retentionEnabled: false,
  retentionMode: "compliance",
  retentionUnit: "days",
  retentionValidity: 180,
  navigateTo: "",
};

export const addBucketsSlice = createSlice({
  name: "addBuckets",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      if (state.name.trim() === "") {
        state.valid = false;
      }
    },
    setVersioning: (state, action: PayloadAction<boolean>) => {
      state.versioningEnabled = action.payload;
      if (!state.versioningEnabled || !state.retentionEnabled) {
        state.retentionEnabled = false;
        state.retentionMode = "compliance";
        state.retentionUnit = "days";
        state.retentionValidity = 180;
      }
    },
    setEnableObjectLocking: (state, action: PayloadAction<boolean>) => {
      state.lockingEnabled = action.payload;
    },
    setQuota: (state, action: PayloadAction<boolean>) => {
      state.quotaEnabled = action.payload;
    },
    setQuotaSize: (state, action: PayloadAction<string>) => {
      state.quotaSize = action.payload;

      if (state.quotaEnabled && state.valid) {
        if (state.quotaSize.trim() === "" || parseInt(state.quotaSize) === 0) {
          state.valid = false;
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
        state.retentionMode = "compliance";
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
        state.valid = false;
      }
    },
    setRetentionMode: (state, action: PayloadAction<string>) => {
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
        state.valid = false;
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
        state.navigateTo = `/buckets/${action.payload}/browse`;
      });
  },
});

export const {
  setName,
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
} = addBucketsSlice.actions;

export default addBucketsSlice.reducer;

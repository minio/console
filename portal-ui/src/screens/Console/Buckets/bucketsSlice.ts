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
import { BucketInfo } from "./types";

export interface BucketsState {
  open: boolean;
  addBucketName: string;
  addBucketVersioningEnabled: boolean;
  addBucketLockingEnabled: boolean;
  addBucketQuotaEnabled: boolean;
  addBucketQuotaType: string;
  addBucketQuotaSize: string;
  addBucketQuotaUnit: string;
  addBucketRetentionEnabled: boolean;
  addBucketRetentionMode: string;
  addBucketRetentionUnit: string;
  addBucketRetentionValidity: number;
  bucketDetails: BucketDetailsState;
}

export interface BucketDetailsState {
  selectedTab: string;
  loadingBucket: boolean;
  bucketInfo: BucketInfo | null;
}

const initialState: BucketsState = {
  open: false,
  addBucketName: "",
  addBucketVersioningEnabled: false,
  addBucketLockingEnabled: false,
  addBucketQuotaEnabled: false,
  addBucketQuotaType: "hard",
  addBucketQuotaSize: "1",
  addBucketQuotaUnit: "Ti",
  addBucketRetentionEnabled: false,
  addBucketRetentionMode: "compliance",
  addBucketRetentionUnit: "days",
  addBucketRetentionValidity: 180,
  bucketDetails: {
    selectedTab: "summary",
    loadingBucket: false,
    bucketInfo: null,
  },
};

export const bucketsSlice = createSlice({
  name: "buckets",
  initialState,
  reducers: {
    addBucketOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    addBucketName: (state, action: PayloadAction<string>) => {
      state.addBucketName = action.payload;
    },
    addBucketVersioning: (state, action: PayloadAction<boolean>) => {
      state.addBucketVersioningEnabled = action.payload;
    },
    addBucketEnableObjectLocking: (state, action: PayloadAction<boolean>) => {
      state.addBucketLockingEnabled = action.payload;
    },
    addBucketQuota: (state, action: PayloadAction<boolean>) => {
      state.addBucketQuotaEnabled = action.payload;
    },
    addBucketQuotaType: (state, action: PayloadAction<string>) => {
      state.addBucketQuotaType = action.payload;
    },
    addBucketQuotaSize: (state, action: PayloadAction<string>) => {
      state.addBucketQuotaSize = action.payload;
    },
    addBucketQuotaUnit: (state, action: PayloadAction<string>) => {
      state.addBucketQuotaUnit = action.payload;
    },
    addBucketRetention: (state, action: PayloadAction<boolean>) => {
      state.addBucketRetentionEnabled = action.payload;
    },
    addBucketRetentionMode: (state, action: PayloadAction<string>) => {
      state.addBucketRetentionMode = action.payload;
    },
    addBucketRetentionUnit: (state, action: PayloadAction<string>) => {
      state.addBucketRetentionUnit = action.payload;
    },
    addBucketRetentionValidity: (state, action: PayloadAction<number>) => {
      state.addBucketRetentionValidity = action.payload;
    },
    setBucketDetailsTab: (state, action: PayloadAction<string>) => {
      state.bucketDetails.selectedTab = action.payload;
    },
    addBucketReset: (state) => {
      state.addBucketName = "";
      state.addBucketVersioningEnabled = false;
      state.addBucketLockingEnabled = false;
      state.addBucketQuotaEnabled = false;
      state.addBucketQuotaType = "hard";
      state.addBucketQuotaSize = "1";
      state.addBucketQuotaUnit = "Ti";
      state.addBucketRetentionEnabled = false;
      state.addBucketRetentionMode = "compliance";
      state.addBucketRetentionUnit = "days";
      state.addBucketRetentionValidity = 180;
    },
    setBucketDetailsLoad: (state, action: PayloadAction<boolean>) => {
      state.bucketDetails.loadingBucket = action.payload;
    },
    setBucketInfo: (state, action: PayloadAction<BucketInfo | null>) => {
      state.bucketDetails.bucketInfo = action.payload;
    },
  },
});

export const {
  addBucketOpen,
  addBucketName,
  addBucketVersioning,
  addBucketEnableObjectLocking,
  addBucketQuota,
  addBucketQuotaType,
  addBucketQuotaSize,
  addBucketQuotaUnit,
  addBucketReset,
  addBucketRetention,
  addBucketRetentionMode,
  addBucketRetentionUnit,
  addBucketRetentionValidity,
  setBucketDetailsTab,
  setBucketDetailsLoad,
  setBucketInfo,
} = bucketsSlice.actions;

export default bucketsSlice.reducer;

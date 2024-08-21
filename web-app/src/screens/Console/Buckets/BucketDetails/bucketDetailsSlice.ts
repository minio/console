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
import { AppState } from "../../../../store";
import { Bucket } from "api/consoleApi";

interface BucketDetailsState {
  selectedTab: string;
  loadingBucket: boolean;
  bucketInfo: Bucket | null;
}

const initialState: BucketDetailsState = {
  selectedTab: "summary",
  loadingBucket: false,
  bucketInfo: null,
};

const bucketDetailsSlice = createSlice({
  name: "bucketDetails",
  initialState,
  reducers: {
    setBucketDetailsTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    },
    setBucketDetailsLoad: (state, action: PayloadAction<boolean>) => {
      state.loadingBucket = action.payload;
    },
    setBucketInfo: (state, action: PayloadAction<Bucket | null>) => {
      state.bucketInfo = action.payload;
    },
  },
});

export const { setBucketInfo, setBucketDetailsLoad } =
  bucketDetailsSlice.actions;

export const selBucketDetailsLoading = (state: AppState) =>
  state.bucketDetails.loadingBucket;
export const selBucketDetailsInfo = (state: AppState) =>
  state.bucketDetails.bucketInfo;

export default bucketDetailsSlice.reducer;

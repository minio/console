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
import { ApiError } from "api/consoleApi";

interface AddBucketState {
  loading: boolean;
  isDirty: boolean;
  addBucketOpen: boolean;
  invalidFields: string[];
  name: string;
  navigateTo: string;
  error: ApiError | null;
}

const initialState: AddBucketState = {
  loading: false,
  isDirty: false,
  addBucketOpen: false,
  invalidFields: [],
  name: "",
  navigateTo: "",
  error: null,
};

const addBucketsSlice = createSlice({
  name: "addBuckets",
  initialState,
  reducers: {
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setAddBucketOpen: (state, action: PayloadAction<boolean>) => {
      state.addBucketOpen = action.payload;
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
    resetForm: (state) => {
      state.name = "";
      state.loading = false;
      state.isDirty = false;
      state.invalidFields = [];
      state.name = "";
      state.navigateTo = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBucketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBucketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError;
      })
      .addCase(addBucketAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.navigateTo = action.payload.data.bucketName
            ? `/browser/${action.payload.data.bucketName}`
            : `/browser`;
        }
      });
  },
});

export const { setName, setAddBucketOpen, setIsDirty, resetForm } =
  addBucketsSlice.actions;

export default addBucketsSlice.reducer;

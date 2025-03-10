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
import { AppState } from "../../../../../store";
import { api } from "../../../../../api";
import { MakeBucketRequest } from "../../../../../api/consoleApi";

export const addBucketAsync = createAsyncThunk(
  "buckets/addBucketAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    const bucketName = state.addBucket.name;

    let request: MakeBucketRequest = {
      name: bucketName,
    };

    try {
      return await api.buckets.makeBucket(request);
    } catch (err: any) {
      return rejectWithValue(err.error);
    }
  },
);

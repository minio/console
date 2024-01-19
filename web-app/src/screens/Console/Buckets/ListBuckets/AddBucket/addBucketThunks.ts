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

import { getBytes } from "../../../../../common/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../../../../../store";
import { api } from "../../../../../api";
import {
  MakeBucketRequest,
  ObjectRetentionMode,
  ObjectRetentionUnit,
} from "../../../../../api/consoleApi";

export const addBucketAsync = createAsyncThunk(
  "buckets/addBucketAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    const bucketName = state.addBucket.name;
    const versioningEnabled = state.addBucket.versioningEnabled;
    const lockingEnabled = state.addBucket.lockingEnabled;
    const quotaEnabled = state.addBucket.quotaEnabled;
    const quotaSize = state.addBucket.quotaSize;
    const quotaUnit = state.addBucket.quotaUnit;
    const retentionEnabled = state.addBucket.retentionEnabled;
    const retentionMode = state.addBucket.retentionMode;
    const retentionUnit = state.addBucket.retentionUnit;
    const retentionValidity = state.addBucket.retentionValidity;
    const distributedSetup = state.system.distributedSetup;
    const siteReplicationInfo = state.system.siteReplicationInfo;
    const excludeFolders = state.addBucket.excludeFolders;
    const excludedPrefixes = state.addBucket.excludedPrefixes;

    let request: MakeBucketRequest = {
      name: bucketName,
      versioning: {
        enabled:
          distributedSetup && !siteReplicationInfo.enabled
            ? versioningEnabled
            : false,
        excludePrefixes:
          distributedSetup && !siteReplicationInfo.enabled && !lockingEnabled
            ? excludedPrefixes.split(",").filter((item) => item.trim() !== "")
            : [],
        excludeFolders:
          distributedSetup && !siteReplicationInfo.enabled && !lockingEnabled
            ? excludeFolders
            : false,
      },
      locking: distributedSetup ? lockingEnabled : false,
    };

    if (distributedSetup) {
      if (quotaEnabled) {
        const amount = getBytes(quotaSize, quotaUnit, true);
        request.quota = {
          enabled: true,
          quota_type: "hard",
          amount: parseInt(amount),
        };
      }

      if (retentionEnabled) {
        request.retention = {
          mode: retentionMode as ObjectRetentionMode,
          unit: retentionUnit as ObjectRetentionUnit,
          validity: retentionValidity,
        };
      }
    }

    return api.buckets.makeBucket(request);
  },
);

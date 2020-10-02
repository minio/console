// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import {
  ADD_BUCKET_NAME,
  ADD_BUCKET_OPEN,
  ADD_BUCKET_QUOTA,
  ADD_BUCKET_QUOTA_SIZE,
  ADD_BUCKET_QUOTA_TYPE,
  ADD_BUCKET_QUOTA_UNIT,
  ADD_BUCKET_RESET,
  ADD_BUCKET_VERSIONED,
  BucketActionTypes,
} from "./actions";

export interface BucketsState {
  open: boolean;
  addBucketName: string;
  addBucketVersioning: boolean;
  addBucketQuotaEnabled: boolean;
  addBucketQuotaType: string;
  addBucketQuotaSize: string;
  addBucketQuotaUnit: string;
}

const initialState: BucketsState = {
  open: false,
  addBucketName: "",
  addBucketVersioning: false,
  addBucketQuotaEnabled: false,
  addBucketQuotaType: "hard",
  addBucketQuotaSize: "1",
  addBucketQuotaUnit: "TiB",
};

export function bucketsReducer(
  state = initialState,
  action: BucketActionTypes
): BucketsState {
  switch (action.type) {
    case ADD_BUCKET_OPEN:
      return {
        ...state,
        open: action.open,
      };
    case ADD_BUCKET_NAME:
      return {
        ...state,
        addBucketName: action.name,
      };
    case ADD_BUCKET_VERSIONED:
      return {
        ...state,
        addBucketVersioning: action.versioned,
      };
    case ADD_BUCKET_QUOTA:
      return {
        ...state,
        addBucketQuotaEnabled: action.quota,
      };
    case ADD_BUCKET_QUOTA_TYPE:
      return {
        ...state,
        addBucketQuotaType: action.quotaType,
      };
    case ADD_BUCKET_QUOTA_SIZE:
      return {
        ...state,
        addBucketQuotaSize: action.quotaSize,
      };
    case ADD_BUCKET_QUOTA_UNIT:
      return {
        ...state,
        addBucketQuotaUnit: action.quotaUnit,
      };
    case ADD_BUCKET_RESET:
      return {
        ...state,
        addBucketName: "",
        addBucketVersioning: false,
        addBucketQuotaEnabled: false,
        addBucketQuotaType: "hard",
        addBucketQuotaSize: "1",
        addBucketQuotaUnit: "TiB",
      };
    default:
      return state;
  }
}

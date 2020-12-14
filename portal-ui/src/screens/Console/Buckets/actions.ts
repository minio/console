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

export const ADD_BUCKET_OPEN = "ADD_BUCKET_OPEN";
export const ADD_BUCKET_NAME = "ADD_BUCKET_NAME";
export const ADD_BUCKET_VERSIONED = "ADD_BUCKET_VERSIONED";
export const ADD_BUCKET_QUOTA = "ADD_BUCKET_QUOTA";
export const ADD_BUCKET_QUOTA_TYPE = "ADD_BUCKET_QUOTA_TYPE";
export const ADD_BUCKET_QUOTA_SIZE = "ADD_BUCKET_QUOTA_SIZE";
export const ADD_BUCKET_QUOTA_UNIT = "ADD_BUCKET_QUOTA_UNIT";
export const ADD_BUCKET_RESET = "ADD_BUCKET_RESET";
export const ADD_BUCKET_RETENTION = "ADD_BUCKET_RETENTION";
export const ADD_BUCKET_RETENTION_MODE = "ADD_BUCKET_RETENTION_MODE";
export const ADD_BUCKET_RETENTION_UNIT = "ADD_BUCKET_RETENTION_UNIT";
export const ADD_BUCKET_RETENTION_VALIDITY = "ADD_BUCKET_RETENTION_VALIDITY";

interface AddBucketOpenAction {
  type: typeof ADD_BUCKET_OPEN;
  open: boolean;
}

interface AddBucketNameAction {
  type: typeof ADD_BUCKET_NAME;
  name: string;
}

interface AddBucketVersionedAction {
  type: typeof ADD_BUCKET_VERSIONED;
  versioned: boolean;
}

interface AddBucketQuotaAction {
  type: typeof ADD_BUCKET_QUOTA;
  quota: boolean;
}

interface AddBucketQuotaTypeAction {
  type: typeof ADD_BUCKET_QUOTA_TYPE;
  quotaType: string;
}

interface AddBucketQuotaSizeAction {
  type: typeof ADD_BUCKET_QUOTA_SIZE;
  quotaSize: string;
}

interface AddBucketQuotaUnitAction {
  type: typeof ADD_BUCKET_QUOTA_UNIT;
  quotaUnit: string;
}
interface AddBucketResetAction {
  type: typeof ADD_BUCKET_RESET;
}

interface AddBucketRetentionAction {
  type: typeof ADD_BUCKET_RETENTION;
  retention: boolean;
}

interface AddBucketRetentionModeAction {
  type: typeof ADD_BUCKET_RETENTION_MODE;
  retentionMode: string;
}

interface AddBucketRetentionUnitAction {
  type: typeof ADD_BUCKET_RETENTION_UNIT;
  retentionUnit: string;
}
interface AddBucketRetentionValidityAction {
  type: typeof ADD_BUCKET_RETENTION_VALIDITY;
  retentionValidity: number;
}

export type BucketActionTypes =
  | AddBucketOpenAction
  | AddBucketNameAction
  | AddBucketVersionedAction
  | AddBucketQuotaAction
  | AddBucketQuotaTypeAction
  | AddBucketQuotaSizeAction
  | AddBucketQuotaUnitAction
  | AddBucketResetAction
  | AddBucketRetentionAction
  | AddBucketRetentionModeAction
  | AddBucketRetentionUnitAction
  | AddBucketRetentionValidityAction;

export function addBucketOpen(open: boolean) {
  return {
    type: ADD_BUCKET_OPEN,
    open: open,
  };
}
export function addBucketName(name: string) {
  return {
    type: ADD_BUCKET_NAME,
    name: name,
  };
}

export function addBucketVersioned(versioned: boolean) {
  return {
    type: ADD_BUCKET_VERSIONED,
    versioned: versioned,
  };
}

export function addBucketQuota(quota: boolean) {
  return {
    type: ADD_BUCKET_QUOTA,
    quota: quota,
  };
}

export function addBucketQuotaType(quotaType: string) {
  return {
    type: ADD_BUCKET_QUOTA_TYPE,
    quotaType: quotaType,
  };
}

export function addBucketQuotaSize(quotaSize: string) {
  return {
    type: ADD_BUCKET_QUOTA_SIZE,
    quotaSize: quotaSize,
  };
}

export function addBucketQuotaUnit(quotaUnit: string) {
  return {
    type: ADD_BUCKET_QUOTA_UNIT,
    quotaUnit: quotaUnit,
  };
}

export function addBucketReset() {
  return {
    type: ADD_BUCKET_RESET,
  };
}

export function addBucketRetention(retention: boolean) {
  return {
    type: ADD_BUCKET_RETENTION,
    retention: retention,
  };
}

export function addBucketRetentionMode(mode: string) {
  return {
    type: ADD_BUCKET_RETENTION_MODE,
    retentionMode: mode,
  };
}

export function addBucketRetentionUnit(unit: string) {
  return {
    type: ADD_BUCKET_RETENTION_UNIT,
    retentionUnit: unit,
  };
}

export function addBucketRetentionValidity(validity: number) {
  return {
    type: ADD_BUCKET_RETENTION_VALIDITY,
    retentionValidity: validity,
  };
}

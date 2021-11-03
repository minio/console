// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import { ErrorResponseHandler } from "./common/types";

// along with this program.  If not, see <http://www.gnu.org/licenses/>.
export interface snackBarMessage {
  message: string;
  detailedErrorMsg: string;
  type: "message" | "error";
}

export interface SystemState {
  loggedIn: boolean;
  operatorMode: boolean;
  sidebarOpen: boolean;
  session: string;
  userName: string;
  serverNeedsRestart: boolean;
  serverIsLoading: boolean;
  loadingProgress: number;
  snackBar: snackBarMessage;
  modalSnackBar: snackBarMessage;
  serverDiagnosticStatus: string;
  distributedSetup: boolean;
}

export const USER_LOGGED = "USER_LOGGED";
export const OPERATOR_MODE = "OPERATOR_MODE";
export const MENU_OPEN = "MENU_OPEN";
export const SERVER_NEEDS_RESTART = "SERVER_NEEDS_RESTART";
export const SERVER_IS_LOADING = "SERVER_IS_LOADING";
export const SET_LOADING_PROGRESS = "SET_LOADING_PROGRESS";
export const SET_SNACK_BAR_MESSAGE = "SET_SNACK_BAR_MESSAGE";
export const SET_SERVER_DIAG_STAT = "SET_SERVER_DIAG_STAT";
export const SET_ERROR_SNACK_MESSAGE = "SET_ERROR_SNACK_MESSAGE";
export const SET_SNACK_MODAL_MESSAGE = "SET_SNACK_MODAL_MESSAGE";
export const SET_MODAL_ERROR_MESSAGE = "SET_MODAL_ERROR_MESSAGE";
export const GLOBAL_SET_DISTRIBUTED_SETUP = "GLOBAL/SET_DISTRIBUTED_SETUP";

interface UserLoggedAction {
  type: typeof USER_LOGGED;
  logged: boolean;
}

interface OperatorModeAction {
  type: typeof OPERATOR_MODE;
  operatorMode: boolean;
}

interface SetMenuOpenAction {
  type: typeof MENU_OPEN;
  open: boolean;
}

interface ServerNeedsRestartAction {
  type: typeof SERVER_NEEDS_RESTART;
  needsRestart: boolean;
}

interface ServerIsLoading {
  type: typeof SERVER_IS_LOADING;
  isLoading: boolean;
}
interface SetLoadingProgress {
  type: typeof SET_LOADING_PROGRESS;
  loadingProgress: number;
}

interface SetServerDiagStat {
  type: typeof SET_SERVER_DIAG_STAT;
  serverDiagnosticStatus: string;
}

interface SetSnackBarMessage {
  type: typeof SET_SNACK_BAR_MESSAGE;
  message: string;
}

interface SetErrorSnackMessage {
  type: typeof SET_ERROR_SNACK_MESSAGE;
  message: ErrorResponseHandler;
}

interface SetModalSnackMessage {
  type: typeof SET_SNACK_MODAL_MESSAGE;
  message: string;
}

interface SetModalErrorMessage {
  type: typeof SET_MODAL_ERROR_MESSAGE;
  message: ErrorResponseHandler;
}

interface SetDistributedSetup {
  type: typeof GLOBAL_SET_DISTRIBUTED_SETUP;
  distributedSetup: boolean;
}

export type SystemActionTypes =
  | UserLoggedAction
  | OperatorModeAction
  | SetMenuOpenAction
  | ServerNeedsRestartAction
  | ServerIsLoading
  | SetLoadingProgress
  | SetServerDiagStat
  | SetSnackBarMessage
  | SetErrorSnackMessage
  | SetModalSnackMessage
  | SetModalErrorMessage
  | SetDistributedSetup;

// S3 Actions
export const S3_LIST_BUCKET = "s3:ListBucket";
export const S3_GET_BUCKET_POLICY = "s3:GetBucketPolicy";
export const S3_PUT_BUCKET_POLICY = "s3:PutBucketPolicy";
export const S3_GET_OBJECT = "s3:GetObject";
export const S3_PUT_OBJECT = "s3:PutObject";
export const S3_GET_OBJECT_LEGAL_HOLD = "s3:GetObjectLegalHold";
export const S3_PUT_OBJECT_LEGAL_HOLD = "s3:PutObjectLegalHold";
export const S3_DELETE_OBJECT = "s3:DeleteObject";
export const S3_GET_BUCKET_VERSIONING = "s3:GetBucketVersioning";
export const S3_PUT_BUCKET_VERSIONING = "s3:PutBucketVersioning";

export const S3_GET_OBJECT_RETENTION = "s3:GetObjectRetention";
export const S3_PUT_OBJECT_RETENTION = "s3:PutObjectRetention";

export const S3_GET_OBJECT_TAGGING = "s3:GetObjectTagging";
export const S3_PUT_OBJECT_TAGGING = "s3:PutObjectTagging";
export const S3_DELETE_OBJECT_TAGGING = "s3:DeleteObjectTagging";

export const S3_GET_BUCKET_ENCRYPTION_CONFIGURATION =
  "s3:GetEncryptionConfiguration";
export const S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION =
  "s3:PutEncryptionConfiguration";
export const S3_DELETE_BUCKET = "s3:DeleteBucket";
export const S3_FORCE_DELETE_BUCKET = "s3:ForceDeleteBucket";
export const S3_GET_BUCKET_NOTIFICATIONS = "s3:GetBucketNotification";
export const S3_LISTEN_BUCKET_NOTIFICATIONS = "s3:ListenBucketNotification";
export const S3_PUT_BUCKET_NOTIFICATIONS = "s3:PutBucketNotification";
export const S3_GET_REPLICATION_CONFIGURATION =
  "s3:GetReplicationConfiguration";
export const S3_PUT_REPLICATION_CONFIGURATION =
  "s3:PutReplicationConfiguration";
export const S3_GET_LIFECYCLE_CONFIGURATION = "s3:GetLifecycleConfiguration";
export const S3_PUT_LIFECYCLE_CONFIGURATION = "s3:PutLifecycleConfiguration";
export const S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION =
  "s3:GetBucketObjectLockConfiguration";
export const S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION =
  "s3:PutBucketObjectLockConfiguration";

// Admin Actions
export const ADMIN_GET_POLICY = "admin:GetPolicy";
export const ADMIN_LIST_USERS = "admin:ListUsers";
export const ADMIN_LIST_USER_POLICIES = "admin:ListUserPolicies";
export const ADMIN_SERVER_INFO = "admin:ServerInfo";
export const ADMIN_GET_BUCKET_QUOTA = "admin:GetBucketQuota";
export const ADMIN_SET_BUCKET_QUOTA = "admin:SetBucketQuota";
export const ADMIN_LIST_TIERS = "admin:ListTier";
export const ADMIN_LIST_GROUPS = "admin:ListGroups";

export const S3_ALL_ACTIONS = "s3:*";
export const ADMIN_ALL_ACTIONS = "admin:*";

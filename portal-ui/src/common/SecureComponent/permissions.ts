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
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// hasAccessToResource receives a list of user permissions to perform on a specific resource, then compares those permissions against
// a list of required permissions and return true or false depending of the level of required access (match all permissions,
// match some of the permissions)
export const hasAccessToResource = (
  userPermissionsOnBucket: string[] | null | undefined,
  requiredPermissions: string[],
  matchAll?: boolean
) => {
  if (!userPermissionsOnBucket) {
    return false;
  }

  const s3All = userPermissionsOnBucket.includes(IAM_SCOPES.S3_ALL_ACTIONS);
  const AdminAll = userPermissionsOnBucket.includes(
    IAM_SCOPES.ADMIN_ALL_ACTIONS
  );

  const permissions = requiredPermissions.filter(function (n) {
    return (
      userPermissionsOnBucket.indexOf(n) !== -1 ||
      (n.indexOf("s3:") !== -1 && s3All) ||
      (n.indexOf("admin:") !== -1 && AdminAll)
    );
  });
  return matchAll
    ? permissions.length === requiredPermissions.length
    : permissions.length > 0;
};

export const IAM_ROLES = {
  viewer: "VIEWER",
  editor: "EDITOR",
  owner: "OWNER",
  admin: "ADMIN",
};

export const IAM_SCOPES = {
  S3_LIST_BUCKET: "s3:ListBucket",
  S3_GET_BUCKET_POLICY: "s3:GetBucketPolicy",
  S3_PUT_BUCKET_POLICY: "s3:PutBucketPolicy",
  S3_GET_OBJECT: "s3:GetObject",
  S3_PUT_OBJECT: "s3:PutObject",
  S3_GET_OBJECT_LEGAL_HOLD: "s3:GetObjectLegalHold",
  S3_PUT_OBJECT_LEGAL_HOLD: "s3:PutObjectLegalHold",
  S3_DELETE_OBJECT: "s3:DeleteObject",
  S3_GET_BUCKET_VERSIONING: "s3:GetBucketVersioning",
  S3_PUT_BUCKET_VERSIONING: "s3:PutBucketVersioning",
  S3_GET_OBJECT_RETENTION: "s3:GetObjectRetention",
  S3_PUT_OBJECT_RETENTION: "s3:PutObjectRetention",
  S3_GET_OBJECT_TAGGING: "s3:GetObjectTagging",
  S3_PUT_OBJECT_TAGGING: "s3:PutObjectTagging",
  S3_DELETE_OBJECT_TAGGING: "s3:DeleteObjectTagging",
  S3_GET_BUCKET_ENCRYPTION_CONFIGURATION: "s3:GetEncryptionConfiguration",
  S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION: "s3:PutEncryptionConfiguration",
  S3_CREATE_BUCKET: "s3:CreateBucket",
  S3_DELETE_BUCKET: "s3:DeleteBucket",
  S3_FORCE_DELETE_BUCKET: "s3:ForceDeleteBucket",
  S3_GET_BUCKET_NOTIFICATIONS: "s3:GetBucketNotification",
  S3_LISTEN_BUCKET_NOTIFICATIONS: "s3:ListenBucketNotification",
  S3_PUT_BUCKET_NOTIFICATIONS: "s3:PutBucketNotification",
  S3_GET_REPLICATION_CONFIGURATION: "s3:GetReplicationConfiguration",
  S3_PUT_REPLICATION_CONFIGURATION: "s3:PutReplicationConfiguration",
  S3_GET_LIFECYCLE_CONFIGURATION: "s3:GetLifecycleConfiguration",
  S3_PUT_LIFECYCLE_CONFIGURATION: "s3:PutLifecycleConfiguration",
  S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION:
    "s3:GetBucketObjectLockConfiguration",
  S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION:
    "s3:PutBucketObjectLockConfiguration",
  ADMIN_GET_POLICY: "admin:GetPolicy",
  ADMIN_LIST_USERS: "admin:ListUsers",
  ADMIN_LIST_USER_POLICIES: "admin:ListUserPolicies",
  ADMIN_SERVER_INFO: "admin:ServerInfo",
  ADMIN_GET_BUCKET_QUOTA: "admin:GetBucketQuota",
  ADMIN_SET_BUCKET_QUOTA: "admin:SetBucketQuota",
  ADMIN_LIST_TIERS: "admin:ListTier",
  ADMIN_LIST_GROUPS: "admin:ListGroups",
  S3_GET_OBJECT_VERSION_FOR_REPLICATION: "s3:GetObjectVersionForReplication",
  S3_REPLICATE_TAGS: "s3:ReplicateTags",
  S3_REPLICATE_DELETE: "s3:ReplicateDelete",
  S3_REPLICATE_OBJECT: "s3:ReplicateObject",
  S3_PUT_OBJECT_VERSION_TAGGING: "s3:PutObjectVersionTagging",
  S3_DELETE_OBJECT_VERSION_TAGGING: "s3:DeleteObjectVersionTagging",
  S3_DELETE_OBJECT_VERSION: "s3:DeleteObjectVersion",
  S3_GET_OBJECT_VERSION_TAGGING: "s3:GetObjectVersionTagging",
  S3_GET_OBJECT_VERSION: "s3:GetObjectVersion",
  S3_PUT_BUCKET_TAGGING: "s3:PutBucketTagging",
  S3_GET_BUCKET_TAGGING: "s3:GetBucketTagging",
  S3_BYPASS_GOVERNANCE_RETENTION: "s3:BypassGovernanceRetention",
  S3_LIST_MULTIPART_UPLOAD_PARTS: "s3:ListMultipartUploadParts",
  S3_LISTEN_NOTIFICATIONS: "s3:ListenNotification",
  S3_LIST_BUCKET_MULTIPART_UPLOADS: "s3:ListBucketMultipartUploads",
  S3_LIST_BUCKET_VERSIONS: "s3:ListBucketVersions",
  S3_GET_BUCKET_POLICY_STATUS: "s3:GetBucketPolicyStatus",
  S3_LIST_ALL_MY_BUCKETS: "s3:ListAllMyBuckets",
  S3_HEAD_BUCKET: "s3:HeadBucket",
  S3_GET_BUCKET_LOCATION: "s3:GetBucketLocation",
  S3_DELETE_BUCKET_POLICY: "s3:DeleteBucketPolicy",
  S3_ABORT_MULTIPART_UPLOAD: "s3:AbortMultipartUpload",
  S3_ALL_ACTIONS: "s3:*",
  ADMIN_ALL_ACTIONS: "admin:*",
};

export const IAM_PERMISSIONS = {
  [IAM_ROLES.admin]: [
    IAM_SCOPES.S3_ALL_ACTIONS,
    IAM_SCOPES.ADMIN_ALL_ACTIONS,
    IAM_SCOPES.S3_REPLICATE_OBJECT,
    IAM_SCOPES.S3_REPLICATE_DELETE,
    IAM_SCOPES.S3_REPLICATE_TAGS,
    IAM_SCOPES.S3_GET_OBJECT_VERSION_FOR_REPLICATION,
    IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_DELETE_OBJECT_TAGGING,
    IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
    IAM_SCOPES.S3_GET_OBJECT_TAGGING,
    IAM_SCOPES.S3_PUT_OBJECT_VERSION_TAGGING,
    IAM_SCOPES.S3_DELETE_OBJECT_VERSION_TAGGING,
    IAM_SCOPES.S3_DELETE_OBJECT_VERSION,
    IAM_SCOPES.S3_GET_OBJECT_VERSION_TAGGING,
    IAM_SCOPES.S3_GET_OBJECT_VERSION,
    IAM_SCOPES.S3_PUT_BUCKET_TAGGING,
    IAM_SCOPES.S3_GET_BUCKET_TAGGING,
    IAM_SCOPES.S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION,
    IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
    IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD,
    IAM_SCOPES.S3_GET_OBJECT_LEGAL_HOLD,
    IAM_SCOPES.S3_GET_OBJECT_RETENTION,
    IAM_SCOPES.S3_PUT_OBJECT_RETENTION,
    IAM_SCOPES.S3_BYPASS_GOVERNANCE_RETENTION,
    IAM_SCOPES.S3_PUT_BUCKET_POLICY,
    IAM_SCOPES.S3_PUT_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_GET_LIFECYCLE_CONFIGURATION,
    IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
    IAM_SCOPES.S3_LIST_MULTIPART_UPLOAD_PARTS,
    IAM_SCOPES.S3_LISTEN_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_LISTEN_NOTIFICATIONS,
    IAM_SCOPES.S3_LIST_BUCKET_MULTIPART_UPLOADS,
    IAM_SCOPES.S3_LIST_BUCKET_VERSIONS,
    IAM_SCOPES.S3_GET_BUCKET_POLICY_STATUS,
    IAM_SCOPES.S3_LIST_ALL_MY_BUCKETS,
    IAM_SCOPES.S3_HEAD_BUCKET,
    IAM_SCOPES.S3_GET_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_GET_BUCKET_LOCATION,
    IAM_SCOPES.S3_DELETE_BUCKET_POLICY,
    IAM_SCOPES.S3_FORCE_DELETE_BUCKET,
    IAM_SCOPES.S3_DELETE_BUCKET,
    IAM_SCOPES.S3_CREATE_BUCKET,
    IAM_SCOPES.S3_ABORT_MULTIPART_UPLOAD,
    IAM_SCOPES.ADMIN_GET_POLICY,
    IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
    IAM_SCOPES.ADMIN_LIST_USERS,
  ],
};

export const S3_ALL_RESOURCES = "arn:aws:s3:::*";
export const CONSOLE_UI_RESOURCE = "console-ui";

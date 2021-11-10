// This file is part of MinIO Orchestrator
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

package acl

import iampolicy "github.com/minio/pkg/iam/policy"

var BucketViewerRole = iampolicy.NewActionSet(
	iampolicy.ListBucketAction,
	iampolicy.GetObjectAction,
)

var BucketEditorRole = iampolicy.NewActionSet(
	iampolicy.ListBucketAction,
	iampolicy.GetObjectAction,
	iampolicy.DeleteObjectAction,
	iampolicy.PutObjectAction,
)
var BucketAdminRole = iampolicy.NewActionSet(
	iampolicy.AbortMultipartUploadAction,
	iampolicy.CreateBucketAction,
	iampolicy.DeleteBucketAction,
	iampolicy.ForceDeleteBucketAction,
	iampolicy.DeleteBucketPolicyAction,
	iampolicy.GetBucketLocationAction,
	iampolicy.GetBucketNotificationAction,
	iampolicy.GetBucketPolicyAction,
	iampolicy.HeadBucketAction,
	iampolicy.ListAllMyBucketsAction,
	iampolicy.GetBucketPolicyStatusAction,
	iampolicy.ListBucketVersionsAction,
	iampolicy.ListBucketMultipartUploadsAction,
	iampolicy.ListenNotificationAction,
	iampolicy.ListenBucketNotificationAction,
	iampolicy.ListMultipartUploadPartsAction,
	iampolicy.PutBucketLifecycleAction,
	iampolicy.GetBucketLifecycleAction,
	iampolicy.PutBucketNotificationAction,
	iampolicy.PutBucketPolicyAction,
	iampolicy.BypassGovernanceRetentionAction,
	iampolicy.PutObjectRetentionAction,
	iampolicy.GetObjectRetentionAction,
	iampolicy.GetObjectLegalHoldAction,
	iampolicy.PutObjectLegalHoldAction,
	iampolicy.GetBucketObjectLockConfigurationAction,
	iampolicy.PutBucketObjectLockConfigurationAction,
	iampolicy.GetBucketTaggingAction,
	iampolicy.PutBucketTaggingAction,
	iampolicy.GetObjectVersionAction,
	iampolicy.GetObjectVersionTaggingAction,
	iampolicy.DeleteObjectVersionAction,
	iampolicy.DeleteObjectVersionTaggingAction,
	iampolicy.PutObjectVersionTaggingAction,
	iampolicy.GetObjectTaggingAction,
	iampolicy.PutObjectTaggingAction,
	iampolicy.DeleteObjectTaggingAction,
	iampolicy.PutBucketEncryptionAction,
	iampolicy.GetBucketEncryptionAction,
	iampolicy.PutBucketVersioningAction,
	iampolicy.GetBucketVersioningAction,
	iampolicy.GetReplicationConfigurationAction,
	iampolicy.PutReplicationConfigurationAction,
	iampolicy.ReplicateObjectAction,
	iampolicy.ReplicateDeleteAction,
	iampolicy.ReplicateTagsAction,
	iampolicy.GetObjectVersionForReplicationAction,
	iampolicy.AllActions,
	iampolicy.AllAdminActions,
)

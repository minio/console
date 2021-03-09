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

export interface Bucket {
  name: string;
  creation_date: Date;
}

export interface BucketEncryptionInfo {
  algorithm: string;
  kmsMasterKeyID: string;
}

export interface BucketInfo {
  name: string;
  access: string;
}

export interface BucketList {
  buckets: Bucket[];
  total: number;
}

export interface BucketEvent {
  id: string;
  arn: string;
  events: string[];
  prefix: string;
  suffix: string;
}

export interface BucketEventList {
  events: BucketEvent[];
  total: number;
}

export interface ArnList {
  arns: string[];
}

export interface BucketVersioning {
  is_versioned: boolean;
}

export interface BucketReplicationRuleDeleteMarker {
  status: string;
}
export interface BucketReplicationDestination {
  bucket: string;
}
export interface BucketReplicationRule {
  id: string;
  status: string;
  priority: number;
  delete_marker_replication: BucketReplicationRuleDeleteMarker;
  Destination: BucketReplicationDestination;
}

export interface BucketReplication {
  rules: BucketReplicationRule[];
}

export interface QuotaRequest {
  enabled: boolean;
  quota_type: string;
  amount: number;
}

export interface RetentionRequest {
  mode: string;
  unit: string;
  validity: number;
}

export interface MakeBucketRequest {
  name: string;
  versioning: boolean;
  quota?: QuotaRequest;
  retention?: RetentionRequest;
}

export interface ChangePasswordRequest {
  current_secret_key: string;
  new_secret_key: string;
}

export interface SubscriptionActivateRequest {
  license: string;
  email: string;
  password: string;
}

export interface IRemoteBucket {
  name: string;
  accessKey: string;
  secretKey: string;
  sourceBucket: string;
  targetURL: string;
  targetBucket: string;
  remoteARN: string;
  status: string;
  service: string;
}

interface IExpirationLifecycle {
  days: number;
  date: string;
}

interface ITransitionLifecycle {
  days: number;
  date: string;
  storage_class?: string;
}

export interface LifeCycleItem {
  id: string;
  prefix?: string;
  expiration?: IExpirationLifecycle;
  transition?: ITransitionLifecycle;
  tags?: any;
  status?: string;
}

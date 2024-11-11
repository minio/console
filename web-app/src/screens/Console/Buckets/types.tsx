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

export interface BucketReplicationDestination {
  bucket: string;
}

export interface BucketReplicationRule {
  id: string;
  status: string;
  priority: number;
  delete_marker_replication: boolean;
  deletes_replication: boolean;
  metadata_replication: boolean;
  prefix?: string;
  tags?: string;
  destination: BucketReplicationDestination;
  syncMode: string;
  storageClass?: string;
  existingObjects?: boolean;
}

export interface BucketReplication {
  rules: BucketReplicationRule[];
}

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

import { IFileInfo } from "../ObjectDetails/types";

export interface BucketObjectItem {
  name: string;
  size: number;
  etag?: string;
  last_modified: string;
  content_type?: string;
  version_id: string;
  delete_flag?: boolean;
  is_latest?: boolean;
}

export interface BucketObjectItemsList {
  objects: BucketObjectItem[];
  total?: number;
}

export interface WebsocketRequest {
  mode: "objects" | "rewind" | "close" | "cancel";
  bucket_name?: string;
  prefix?: string;
  date?: string;
  request_id: number;
}

export interface WebsocketResponse {
  request_id: number;
  error?: string;
  request_end?: boolean;
  data?: ObjectResponse[];
  prefix?: string;
}
export interface ObjectResponse {
  name: string;
  last_modified: string;
  size: number;
  version_id: string;
  delete_flag: boolean;
  is_latest: boolean;
}

export interface IRestoreLocalObjectList {
  prefix: string;
  objectInfo: IFileInfo;
}

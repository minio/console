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

export interface ITierS3 {
  name: string;
  endpoint: string;
  accesskey: string;
  secretkey: string;
  bucket: string;
  prefix: string;
  region: string;
  storageclass: string;
}

export interface ITierGCS {
  name: string;
  endpoint: string;
  creds: string;
  bucket: string;
  prefix: string;
  region: string;
  storageclass: string;
}

export interface ITierAzure {
  name: string;
  endpoint: string;
  accountname: string;
  accountkey: string;
  bucket: string;
  prefix: string;
  region: string;
  storageclass: string;
}

export interface ITierElement {
  type: "s3" | "gcs" | "azure" | "unsupported";
  s3?: ITierS3;
  gcs?: ITierGCS;
  azure?: ITierAzure;
}

export interface ITierResponse {
  items: ITierElement[];
}

export interface ITierUpdateCreds {
  access_key: string;
  secret_key: string;
  creds: string;
}

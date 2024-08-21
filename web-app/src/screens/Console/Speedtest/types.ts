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

export interface SpeedTestResponse {
  version: string;
  servers: number;
  disks: number;
  size: number;
  concurrent: number;
  PUTStats?: STStats;
  GETStats?: STStats;
}

interface STStats {
  throughputPerSec: number;
  objectsPerSec: number;
  servers: STServer[] | null;
}

export interface STServer {
  endpoint: string;
  throughputPerSec: number;
  objectsPerSec: number;
  err: string;
}

export interface IndvServerMetric {
  host: string;
  getValue: string;
  getUnit: string;
  getError?: string;
  putValue: string;
  putUnit: string;
  putError?: string;
}

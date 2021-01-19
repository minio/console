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

export interface HealDriveInfo {
  uuid: string;
  endpoint: string;
  state: string;
}

export interface MomentHealth {
  color: string;
  offline: number;
  online: number;
  missing: number;
  corrupted: number;
  drives: HealDriveInfo[];
}

export interface HealItemStatus {
  status: string;
  error: string;
  type: string;
  name: string;
  before: MomentHealth;
  after: MomentHealth;
  size: number;
}

export interface HealStatus {
  healDuration: number;
  bytesScanned: number;
  objectsScanned: number;
  itemsScanned: number;
  // Counters for healed objects and all kinds of healed items
  objectsHealed: number;
  itemsHealed: number;

  itemsHealthStatus: HealItemStatus[];
  // Map of health color code to number of objects with that
  // health color code.
  healthBeforeCols: Map<string, number>;
  healthAfterCols: Map<string, number>;
}

// colorH used to save health's percentage per color
export interface colorH {
  [Green: string]: number;
  Yellow: number;
  Red: number;
  Grey: number;
}

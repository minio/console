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

export const DIRECT_CSI_SELECT_DRIVE = "DIRECT_CSI/SELECT_DRIVE";

export interface IDirectCSIDrives {
  joinName: string;
  drive: string;
  capacity: string;
  allocated: string;
  volumes: number;
  node: string;
  status: "Available" | "Unavailable" | "InUse" | "Ready" | "Terminating";
}

export interface IDirectCSIVolumes {
  volume: string;
  capacity: string;
  node: string;
  drive: string;
}

export interface IDrivesResponse {
  drives: IDirectCSIDrives[];
}

export interface IVolumesResponse {
  volumes: IDirectCSIVolumes[];
}

export interface IDirectCSIFormatResult {
  formatIssuesList: IDirectCSIFormatResItem[];
}

export interface IDirectCSIFormatResItem {
  node: string;
  drive: string;
  error: string;
}

interface SelectDrive {
  type: typeof DIRECT_CSI_SELECT_DRIVE;
  driveName: string;
}

export interface IDirectCSIState {
  selectedDrive: string;
}

export type DirectCSITypes = SelectDrive;

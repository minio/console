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

export interface IStorageFactors {
  erasureCode: string;
  storageFactor: number;
  maxCapacity: string;
  maxFailureTolerations: number;
}

export interface IErasureCodeCalc {
  error: number;
  maxEC: string;
  erasureCodeSet: number;
  rawCapacity: string;
  defaultEC: string;
  storageFactors: IStorageFactors[];
}

export interface ErrorResponseHandler {
  errorMessage: string;
  detailedError: string;
  statusCode?: number;
}

export interface IRetentionConfig {
  mode: string;
  unit: string;
  validity: number;
}

export interface IBytesCalc {
  total: number;
  unit: string;
}

export interface IEmbeddedCustomButton {
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  hoverText?: string;
  activeColor?: string;
  activeText?: string;
}

export interface IEmbeddedCustomStyles {
  backgroundColor: string;
  fontColor: string;
  buttonStyles: IEmbeddedCustomButton;
}

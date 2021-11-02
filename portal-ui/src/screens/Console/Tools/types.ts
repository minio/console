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

import { SelectorTypes } from "../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";

export type KVFieldType =
  | "string"
  | "number"
  | "on|off"
  | "enum"
  | "path"
  | "url"
  | "address"
  | "duration"
  | "uri"
  | "sentence"
  | "csv"
  | "comment"
  | "switch";

export interface KVField {
  name: string;
  label: string;
  tooltip: string;
  required?: boolean;
  type: KVFieldType;
  options?: SelectorTypes[];
  multiline?: boolean;
  placeholder?: string;
  withBorder?: boolean;
}

export interface IConfigurationElement {
  configuration_id: string;
  configuration_label: string;
  url?: string;
}

export interface IElementValue {
  key: string;
  value: string;
}

export interface IElement {
  configuration_id: string;
  configuration_label: string;
  icon?: any;
}

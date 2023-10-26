// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { SelectorType } from "mds";

const gcsRegions: SelectorType[] = [
  { label: "Montréal", value: "NORTHAMERICA-NORTHEAST1" },
  { label: "Toronto", value: "NORTHAMERICA-NORTHEAST2" },
  { label: "Iowa", value: "US-CENTRAL1" },
  { label: "South Carolina", value: "US-EAST1" },
  { label: "Northern Virginia", value: "US-EAST4" },
  { label: "Oregon", value: "US-WEST1" },
  { label: "Los Angeles", value: "US-WEST2" },
  { label: "Salt Lake City", value: "US-WEST3" },
  { label: "Las Vegas", value: "US-WEST4" },
  { label: "São Paulo", value: "SOUTHAMERICA-EAST1" },
  { label: "Santiago", value: "SOUTHAMERICA-WEST1" },
  { label: "Warsaw", value: "EUROPE-CENTRAL2" },
  { label: "Finland", value: "EUROPE-NORTH1" },
  { label: "Belgium", value: "EUROPE-WEST1" },
  { label: "London", value: "EUROPE-WEST2" },
  { label: "Frankfurt", value: "EUROPE-WEST3" },
  { label: "Netherlands", value: "EUROPE-WEST4" },
  { label: "Zürich", value: "EUROPE-WEST6" },
  { label: "Taiwan", value: "ASIA-EAST1" },
  { label: "Hong Kong", value: "ASIA-EAST2" },
  { label: "Tokyo", value: "ASIA-NORTHEAST1" },
  { label: "Osaka", value: "ASIA-NORTHEAST2" },
  { label: "Seoul", value: "ASIA-NORTHEAST3" },
  { label: "Mumbai", value: "ASIA-SOUTH1" },
  { label: "Delhi", value: "ASIA-SOUTH2" },
  { label: "Singapore", value: "ASIA-SOUTHEAST1" },
  { label: "Jakarta", value: "ASIA-SOUTHEAST2" },
  { label: "Sydney", value: "AUSTRALIA-SOUTHEAST1" },
  { label: "Melbourne", value: "AUSTRALIA-SOUTHEAST2" },
];

export default gcsRegions;

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

const s3Regions: SelectorType[] = [
  { label: "US East (Ohio)", value: "us-east-2" },
  { label: "US East (N. Virginia)", value: "us-east-1" },
  { label: "US West (N. California)", value: "us-west-1" },
  { label: "US West (Oregon)", value: "us-west-2" },
  { label: "Africa (Cape Town)", value: "af-south-1" },
  { label: "Asia Pacific (Hong Kong)***", value: "ap-east-1" },
  { label: "Asia Pacific (Jakarta)", value: "ap-southeast-3" },
  { label: "Asia Pacific (Mumbai)", value: "ap-south-1" },
  { label: "Asia Pacific (Osaka)", value: "ap-northeast-3" },
  { label: "Asia Pacific (Seoul)", value: "ap-northeast-2" },
  { label: "Asia Pacific (Singapore)", value: "ap-southeast-1" },
  { label: "Asia Pacific (Sydney)", value: "ap-southeast-2" },
  { label: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
  { label: "Canada (Central)", value: "ca-central-1" },
  { label: "China (Beijing)", value: "cn-north-1" },
  { label: "China (Ningxia)", value: "cn-northwest-1" },
  { label: "Europe (Frankfurt)", value: "eu-central-1" },
  { label: "Europe (Ireland)", value: "eu-west-1" },
  { label: "Europe (London)", value: "eu-west-2" },
  { label: "Europe (Milan)", value: "eu-south-1" },
  { label: "Europe (Paris)", value: "eu-west-3" },
  { label: "Europe (Stockholm)", value: "eu-north-1" },
  { label: "South America (São Paulo)", value: "sa-east-1" },
  { label: "Middle East (Bahrain)", value: "me-south-1" },
  { label: "AWS GovCloud (US-East)", value: "us-gov-east-1" },
  { label: "AWS GovCloud (US-West)", value: "us-gov-west-1" },
];

export default s3Regions;

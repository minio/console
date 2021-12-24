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

import React from "react";
import { Opts } from "../../../ListTenants/utils";
import TenantSizeMK from "./TenantSizeMK";

export enum IMkEnvs {
  "aws",
  "azure",
  "gcs",
  "default",
  undefined,
}

export interface iDriveSizing {
  driveSize: string;
  sizeUnit: string;
}

export interface IntegrationConfiguration {
  typeSelection: string;
  storageClass: string;
  CPU: number;
  memory: number;
  drivesPerServer: number;
  driveSize: iDriveSizing;
}

export const AWSStorageTypes: Opts[] = [
  { label: "NVME", value: "nvme" },
  { label: "HDD", value: "hdd" },
];

export const resourcesConfigurations = {
  "mp-mode-aws": IMkEnvs.aws,
  "mp-mode-azure": IMkEnvs.azure,
  "mp-mode-gcs": IMkEnvs.gcs,
};

export const AWSConfigurations: IntegrationConfiguration[] = [
  {
    typeSelection: "nvme",
    storageClass: "nvme-i3en-12xlarge",
    CPU: 48,
    memory: 384,
    driveSize: { driveSize: "7500", sizeUnit: "Gi" },
    drivesPerServer: 4,
  },
  {
    typeSelection: "hdd",
    storageClass: "hdd-d3en-12xlarge",
    CPU: 8,
    memory: 32,
    driveSize: { driveSize: "12.7", sizeUnit: "Ti" },
    drivesPerServer: 4,
  },
];

export const mkPanelConfigurations = {
  [IMkEnvs.aws]: {
    variantSelectorLabel: "Storage Type",
    variantSelectorValues: AWSStorageTypes,
    configurations: AWSConfigurations,
    sizingComponent: <TenantSizeMK formToRender={IMkEnvs.aws} />,
  },
  [IMkEnvs.azure]: {},
  [IMkEnvs.gcs]: {},
  [IMkEnvs.default]: {},
  [IMkEnvs.undefined]: {},
};

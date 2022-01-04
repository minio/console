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
  "gcp",
  "default",
  undefined,
}

export interface IDriveSizing {
  driveSize: string;
  sizeUnit: string;
}

export interface IntegrationConfiguration {
  typeSelection: string;
  storageClass: string;
  CPU: number;
  memory: number;
  drivesPerServer: number;
  driveSize: IDriveSizing;
}

export const AWSStorageTypes: Opts[] = [
  { label: "NVME", value: "nvme" },
  { label: "HDD", value: "hdd" },
];

export const AzureStorageTypes: Opts[] = [
  { label: "Standard_L32s_v2", value: "Standard_L32s_v2" },
  { label: "Standard_L48s_v2", value: "Standard_L48s_v2" },
  { label: "Standard_L64s_v2", value: "Standard_L64s_v2" },
];

export const resourcesConfigurations = {
  "mp-mode-aws": IMkEnvs.aws,
  "mp-mode-azure": IMkEnvs.azure,
  "mp-mode-gcp": IMkEnvs.gcp,
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

export const AzureConfigurations: IntegrationConfiguration[] = [
  {
    typeSelection: "Standard_L8s_v2",
    storageClass: "local-nvme",
    CPU: 8,
    memory: 64,
    driveSize: { driveSize: "1787", sizeUnit: "Gi" },
    drivesPerServer: 1,
  },
  {
    typeSelection: "Standard_L16s_v2",
    storageClass: "local-nvme",
    CPU: 16,
    memory: 128,
    driveSize: { driveSize: "1787", sizeUnit: "Gi" },
    drivesPerServer: 2,
  },
  {
    typeSelection: "Standard_L32s_v2",
    storageClass: "local-nvme",
    CPU: 32,
    memory: 256,
    driveSize: { driveSize: "1787", sizeUnit: "Gi" },
    drivesPerServer: 4,
  },
  {
    typeSelection: "Standard_L48s_v2",
    storageClass: "local-nvme",
    CPU: 48,
    memory: 384,
    driveSize: { driveSize: "1787", sizeUnit: "Gi" },
    drivesPerServer: 6,
  },
  {
    typeSelection: "Standard_L64s_v2",
    storageClass: "local-nvme",
    CPU: 64,
    memory: 512,
    driveSize: { driveSize: "1787", sizeUnit: "Gi" },
    drivesPerServer: 8,
  },
];

export const GCPStorageTypes: Opts[] = [{ label: "SSD", value: "ssd" }];

export const GCPConfigurations: IntegrationConfiguration[] = [
  {
    typeSelection: "ssd",
    storageClass: "local-ssd",
    CPU: 32,
    memory: 128,
    driveSize: { driveSize: "368", sizeUnit: "Gi" },
    drivesPerServer: 24,
  },
];

export const mkPanelConfigurations = {
  [IMkEnvs.aws]: {
    variantSelectorLabel: "Storage Type",
    variantSelectorValues: AWSStorageTypes,
    configurations: AWSConfigurations,
    sizingComponent: <TenantSizeMK formToRender={IMkEnvs.aws} />,
  },
  [IMkEnvs.azure]: {
    variantSelectorLabel: "VM Size",
    variantSelectorValues: AzureStorageTypes,
    configurations: AzureConfigurations,
    sizingComponent: <TenantSizeMK formToRender={IMkEnvs.azure} />,
  },
  [IMkEnvs.gcp]: {
    variantSelectorLabel: "Storage Type",
    variantSelectorValues: GCPStorageTypes,
    configurations: GCPConfigurations,
    sizingComponent: <TenantSizeMK formToRender={IMkEnvs.gcp} />,
  },
  [IMkEnvs.default]: {},
  [IMkEnvs.undefined]: {},
};

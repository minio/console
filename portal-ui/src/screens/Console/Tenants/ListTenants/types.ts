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

import { SubnetInfo } from "../../License/types";
import { IAffinityModel } from "../../../../common/types";
import {
  ICertificateInfo,
  ISecurityContext,
  NodeMaxAllocatableResources,
} from "../types";

export interface IEvent {
  namespace: string;
  last_seen: number;
  seen: string;
  message: string;
  event_type: string;
  reason: string;
}

export interface IPool {
  name: string;
  servers: number;
  volumes_per_server: number;
  volume_configuration: IVolumeConfiguration;
  // computed
  capacity: string;
  volumes: number;
  label?: string;
}

export interface IPodListElement {
  name: string;
  status: string;
  timeCreated: string;
  podIP: string;
  restarts: number;
  node: string;
  time: string;
  namespace?: string;
  tenant?: string;
}

export interface IAddPoolRequest {
  name: string;
  servers: number;
  volumes_per_server: number;
  volume_configuration: IVolumeConfiguration;
  affinity?: IAffinityModel;
}

export interface IVolumeConfiguration {
  size: number;
  storage_class_name: string;
  labels: { [key: string]: any } | null;
}

export interface IEndpoints {
  minio: string;
  console: string;
}

export interface ITenantStatusUsage {
  raw: number;
  raw_usage: number;
  capacity: number;
  capacity_usage: number;
}
export interface ITenantStatus {
  write_quorum: string;
  drives_online: string;
  drives_offline: string;
  drives_healing: string;
  health_status: string;
  usage?: ITenantStatusUsage;
}

export interface ITenantEncryptionResponse {
  image: string;
  replicas: string;
  securityContext: ISecurityContext;
  server: ICertificateInfo[];
  client: ICertificateInfo[];
  /*
          gemalto:
            type: object
            $ref: "#/definitions/gemaltoConfiguration"
          aws:
            type: object
            $ref: "#/definitions/awsConfiguration"
          vault:
            type: object
            $ref: "#/definitions/vaultConfiguration"
          gcp:
            type: object
            $ref: "#/definitions/gcpConfiguration"
          azure:
            type: object
            $ref: "#/definitions/azureConfiguration"
          securityContext:
            type: object
            $ref: "#/definitions/securityContext"*/
}

export interface ITenant {
  total_size: number;
  name: string;
  namespace: string;
  image: string;
  pool_count: number;
  currentState: string;
  instance_count: 4;
  creation_date: Date;
  volume_size: number;
  volume_count: number;
  volumes_per_server: number;
  pools: IPool[];
  endpoints: IEndpoints;
  logEnabled: boolean;
  monitoringEnabled: boolean;
  encryptionEnabled: boolean;
  minioTLS: boolean;
  consoleTLS: boolean;
  consoleEnabled: boolean;
  idpAdEnabled: boolean;
  idpOidcEnabled: boolean;
  health_status: string;
  status?: ITenantStatus;
  capacity_raw?: number;
  capacity_raw_usage?: number;
  capacity?: number;
  capacity_usage?: number;
  // computed
  total_capacity: string;
  subnet_license: SubnetInfo;
  total_instances?: number;
  total_volumes?: number;
}

export interface ITenantsResponse {
  tenants: ITenant[];
}

export interface IResourcesSize {
  error: string;
  memoryRequest: number;
  memoryLimit: number;
  cpuRequest: number;
  cpuLimit: number;
}

export interface ITenantMonitoringStruct {
  image: string;
  sidecarImage: string;
  initImage: string;
  storageClassName: string;
  labels: IKeyValue[];
  annotations: IKeyValue[];
  nodeSelector: IKeyValue[];
  diskCapacityGB: string;
  serviceAccountName: string;
  prometheusEnabled: boolean;
  monitoringCPURequest: string;
  monitoringMemRequest: string;
}

export interface IKeyValue {
  key: string;
  value: string;
}

export interface ITenantMonitoringStruct {
  image: string;
  sidecarImage: string;
  initImage: string;
  storageClassName: string;
  labels: IKeyValue[];
  annotations: IKeyValue[];
  nodeSelector: IKeyValue[];
  diskCapacityGB: string;
  serviceAccountName: string;
  prometheusEnabled: boolean;
}

export interface ITenantLogsStruct {
  image: string;
  labels: IKeyValue[];
  annotations: IKeyValue[];
  nodeSelector: IKeyValue[];
  diskCapacityGB: number;
  serviceAccountName: string;
  dbImage: string;
  dbLabels: IKeyValue[];
  dbAnnotations: IKeyValue[];
  dbNodeSelector: IKeyValue[];
  dbServiceAccountName: string;
  disabled: boolean;
  logCPURequest: string;
  logMemRequest: string;
  logDBCPURequest: string;
  logDBMemRequest: string;
}

export interface ValueUnit {
  value: string;
  unit: string;
}

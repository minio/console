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

import { IErasureCodeCalc } from "../../../common/types";
import { ITenant, IResourcesSize } from "./ListTenants/types";
import { KeyPair, Opts } from "./ListTenants/utils";
import { IntegrationConfiguration } from "./AddTenant/Steps/TenantResources/utils";

export const ADD_TENANT_SET_CURRENT_PAGE = "ADD_TENANT/SET_CURRENT_PAGE";
export const ADD_TENANT_SET_ADVANCED_MODE = "ADD_TENANT/SET_ADVANCED_MODE";
export const ADD_TENANT_UPDATE_FIELD = "ADD_TENANT/UPDATE_FIELD";
export const ADD_TENANT_SET_PAGE_VALID = "ADD_TENANT/SET_PAGE_VALID";
export const ADD_TENANT_RESET_FORM = "ADD_TENANT/RESET_FORM";

// Name Tenant
export const ADD_TENANT_SET_STORAGE_CLASSES_LIST =
  "ADD_TENANT/SET_STORAGE_CLASSES_LIST";
export const ADD_TENANT_SET_LIMIT_SIZE = "ADD_TENANT/SET_LIMIT_SIZE";

// Security
export const ADD_TENANT_ADD_MINIO_KEYPAIR = "ADD_TENANT/ADD_MINIO_KEYPAIR";
export const ADD_TENANT_ADD_FILE_TO_MINIO_KEYPAIR =
  "ADD_TENANT/ADD_FILE_MINIO_KEYPAIR";
export const ADD_TENANT_DELETE_MINIO_KEYPAIR =
  "ADD_TENANT/DELETE_MINIO_KEYPAIR";
export const ADD_TENANT_ADD_CA_KEYPAIR = "ADD_TENANT/ADD_CA_KEYPAIR";
export const ADD_TENANT_ADD_FILE_TO_CA_KEYPAIR =
  "ADD_TENANT/ADD_FILE_TO_CA_KEYPAIR";
export const ADD_TENANT_DELETE_CA_KEYPAIR = "ADD_TENANT/DELETE_CA_KEYPAIR";
export const ADD_TENANT_ADD_CONSOLE_CERT = "ADD_TENANT/ADD_CONSOLE_CERT";
export const ADD_TENANT_ADD_CONSOLE_CA_KEYPAIR =
  "ADD_TENANT/ADD_CONSOLE_CA_KEYPAIR";
export const ADD_TENANT_ADD_FILE_TO_CONSOLE_CA_KEYPAIR =
  "ADD_TENANT/ADD_FILE_TO_CONSOLE_CA_KEYPAIR";
export const ADD_TENANT_DELETE_CONSOLE_CA_KEYPAIR =
  "ADD_TENANT/DELETE_CONSOLE_CA_KEYPAIR";

// Encryption
export const ADD_TENANT_ENCRYPTION_SERVER_CERT =
  "ADD_TENANT/ENCRYPTION_SERVER_CERT";
export const ADD_TENANT_ENCRYPTION_CLIENT_CERT =
  "ADD_TENANT/ENCRYPTION_CLIENT_CERT";
export const ADD_TENANT_ENCRYPTION_VAULT_CERT =
  "ADD_TENANT/ENCRYPTION_VAULT_CERT";
export const ADD_TENANT_ENCRYPTION_VAULT_CA = "ADD_TENANT/ENCRYPTION_VAULT_CA";
export const ADD_TENANT_ENCRYPTION_GEMALTO_CA =
  "ADD_TENANT/ENCRYPTION_GEMALTO_CA";

// Tenant Details
export const TENANT_DETAILS_SET_LOADING = "TENANT_DETAILS/SET_LOADING";
export const TENANT_DETAILS_SET_CURRENT_TENANT =
  "TENANT_DETAILS/SET_CURRENT_TENANT";
export const TENANT_DETAILS_SET_TENANT = "TENANT_DETAILS/SET_TENANT";
export const TENANT_DETAILS_SET_TAB = "TENANT_DETAILS/SET_TAB";
export interface ICertificateInfo {
  name: string;
  serialNumber: string;
  domains: string[];
  expiry: string;
}

export interface ICustomCertificates {
  minio: ICertificateInfo[];
  minioCAs: ICertificateInfo[];
  console: ICertificateInfo[];
  consoleCAs: ICertificateInfo[];
}

export interface ITenantSecurityResponse {
  autoCert: boolean;
  customCertificates: ICustomCertificates;
}

export interface ICreateTenant {
  page: number;
  validPages: string[];
  advancedModeOn: boolean;
  storageClasses: Opts[];
  limitSize: any;
  fields: IFieldStore;
  certificates: ICertificatesItems;
}

export interface ICertificatesItems {
  minioCertificates: KeyPair[];
  caCertificates: KeyPair[];
  consoleCaCertificates: KeyPair[];
  consoleCertificate: KeyPair;
  serverCertificate: KeyPair;
  clientCertificate: KeyPair;
  vaultCertificate: KeyPair;
  vaultCA: KeyPair;
  gemaltoCA: KeyPair;
}

export interface IFieldStore {
  nameTenant: INameTenantFields;
  configure: IConfigureFields;
  identityProvider: IIdentityProviderFields;
  security: ISecurityFields;
  encryption: IEncryptionFields;
  tenantSize: ITenantSizeFields;
  affinity: ITenantAffinity;
}

export interface INameTenantFields {
  tenantName: string;
  namespace: string;
  selectedStorageClass: string;
  selectedStorageType: string;
}

export interface ISecurityContext {
  runAsUser: string;
  runAsGroup: string;
  runAsNonRoot: boolean;
  fsGroup: string;
}

export interface IConfigureFields {
  customImage: boolean;
  imageName: string;
  customDockerhub: boolean;
  imageRegistry: string;
  imageRegistryUsername: string;
  imageRegistryPassword: string;
  exposeMinIO: boolean;
  exposeConsole: boolean;
  prometheusCustom: boolean;
  tenantCustom: boolean;
  logSearchCustom: boolean;
  logSearchVolumeSize: string;
  logSearchSizeFactor: string;
  logSearchSelectedStorageClass: string;
  logSearchImage: string;
  kesImage: string;
  logSearchPostgresImage: string;
  logSearchPostgresInitImage: string;
  prometheusVolumeSize: string;
  prometheusSizeFactor: string;
  prometheusSelectedStorageClass: string;
  prometheusImage: string;
  prometheusSidecarImage: string;
  prometheusInitImage: string;
  tenantSecurityContext: ISecurityContext;
  logSearchSecurityContext: ISecurityContext;
  logSearchPostgresSecurityContext: ISecurityContext;
  prometheusSecurityContext: ISecurityContext;
}

export interface IIdentityProviderFields {
  idpSelection: string;
  accessKeys: string[];
  secretKeys: string[];
  openIDConfigurationURL: string;
  openIDClientID: string;
  openIDSecretID: string;
  openIDCallbackURL: string;
  openIDClaimName: string;
  openIDScopes: string;
  ADURL: string;
  ADSkipTLS: boolean;
  ADServerInsecure: boolean;
  ADUserNameSearchFilter: string;
  ADUserNameFormat: string;
  ADGroupSearchBaseDN: string;
  ADGroupSearchFilter: string;
  ADGroupNameAttribute: string;
  ADUserDNs: string[];
  ADLookupBindDN: string;
  ADLookupBindPassword: string;
  ADUserDNSearchBaseDN: string;
  ADUserDNSearchFilter: string;
  ADServerStartTLS: boolean;
}

export interface ISecurityFields {
  enableTLS: boolean;
  enableAutoCert: boolean;
  enableCustomCerts: boolean;
}

export interface IEncryptionFields {
  enableEncryption: boolean;
  encryptionType: string;
  gemaltoEndpoint: string;
  gemaltoToken: string;
  gemaltoDomain: string;
  gemaltoRetry: string;
  awsEndpoint: string;
  awsRegion: string;
  awsKMSKey: string;
  awsAccessKey: string;
  awsSecretKey: string;
  awsToken: string;
  vaultEndpoint: string;
  vaultEngine: string;
  vaultNamespace: string;
  vaultPrefix: string;
  vaultAppRoleEngine: string;
  vaultId: string;
  vaultSecret: string;
  vaultRetry: string;
  vaultPing: string;
  azureEndpoint: string;
  azureTenantID: string;
  azureClientID: string;
  azureClientSecret: string;
  gcpProjectID: string;
  gcpEndpoint: string;
  gcpClientEmail: string;
  gcpClientID: string;
  gcpPrivateKeyID: string;
  gcpPrivateKey: string;
  enableCustomCertsForKES: boolean;
  replicas: string;
  kesSecurityContext: ISecurityContext;
}

export interface ITenantSizeFields {
  volumeSize: string;
  sizeFactor: string;
  drivesPerServer: string;
  nodes: string;
  memoryNode: string;
  ecParity: string;
  ecParityChoices: Opts[];
  cleanECChoices: string[];
  maxAllocableMemo: number;
  resourcesSize: IResourcesSize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  cpuToUse: string;
  limitSize: any;
  maxAllocatableResources: AllocableResourcesResponse;
  maxCPUsUse: string;
  maxMemorySize: string;
  integrationSelection: IntegrationConfiguration;
}

export interface ITenantAffinity {
  podAffinity: "default" | "nodeSelector" | "none";
  nodeSelectorLabels: string;
  withPodAntiAffinity: boolean;
}

export interface ITenantDetails {
  currentTenant: string;
  currentNamespace: string;
  loadingTenant: boolean;
  tenantInfo: ITenant | null;
  currentTab: string;
}

export interface ITenantState {
  createTenant: ICreateTenant;
  tenantDetails: ITenantDetails;
}

export interface ILabelKeyPair {
  labelKey: string;
  labelValue: string;
}

export interface AllocableResourcesResponse {
  min_allocatable_mem?: number;
  min_allocatable_cpu?: number;
  cpu_priority: NodeMaxAllocatableResources;
  mem_priority: NodeMaxAllocatableResources;
}

export interface NodeMaxAllocatableResources {
  max_allocatable_cpu: number;
  max_allocatable_mem: number;
}

interface SetTenantWizardPage {
  type: typeof ADD_TENANT_SET_CURRENT_PAGE;
  page: number;
}

interface SetAdvancedMode {
  type: typeof ADD_TENANT_SET_ADVANCED_MODE;
  state: boolean;
}

interface UpdateATField {
  type: typeof ADD_TENANT_UPDATE_FIELD;
  pageName: keyof IFieldStore;
  field: keyof FieldsToHandle;
  value: any;
}

interface SetPageValid {
  type: typeof ADD_TENANT_SET_PAGE_VALID;
  pageName: keyof IFieldStore;
  valid: boolean;
}

interface SetStorageClassesList {
  type: typeof ADD_TENANT_SET_STORAGE_CLASSES_LIST;
  storageClasses: Opts[];
}

interface SetLimitSize {
  type: typeof ADD_TENANT_SET_LIMIT_SIZE;
  limitSize: any;
}

interface AddMinioKeyPair {
  type: typeof ADD_TENANT_ADD_MINIO_KEYPAIR;
}

interface AddFileToMinioKeyPair {
  type: typeof ADD_TENANT_ADD_FILE_TO_MINIO_KEYPAIR;
  id: string;
  key: string;
  fileName: string;
  value: string;
}

interface DeleteMinioKeyPair {
  type: typeof ADD_TENANT_DELETE_MINIO_KEYPAIR;
  id: string;
}
interface AddCAKeyPair {
  type: typeof ADD_TENANT_ADD_CA_KEYPAIR;
}

interface AddFileToCAKeyPair {
  type: typeof ADD_TENANT_ADD_FILE_TO_CA_KEYPAIR;
  id: string;
  key: string;
  fileName: string;
  value: string;
}

interface DeleteCAKeyPair {
  type: typeof ADD_TENANT_DELETE_CA_KEYPAIR;
  id: string;
}
interface AddConsoleCAKeyPair {
  type: typeof ADD_TENANT_ADD_CONSOLE_CA_KEYPAIR;
}

interface AddFileToConsoleCAKeyPair {
  type: typeof ADD_TENANT_ADD_FILE_TO_CONSOLE_CA_KEYPAIR;
  id: string;
  key: string;
  fileName: string;
  value: string;
}

interface DeleteConsoleCAKeyPair {
  type: typeof ADD_TENANT_DELETE_CONSOLE_CA_KEYPAIR;
  id: string;
}

interface AddFileConsoleCert {
  type: typeof ADD_TENANT_ADD_CONSOLE_CERT;
  key: string;
  fileName: string;
  value: string;
}

// Encryption Certs
interface AddFileServerCert {
  type: typeof ADD_TENANT_ENCRYPTION_SERVER_CERT;
  key: string;
  fileName: string;
  value: string;
}

interface AddFileClientCert {
  type: typeof ADD_TENANT_ENCRYPTION_CLIENT_CERT;
  key: string;
  fileName: string;
  value: string;
}

interface AddFileVaultCert {
  type: typeof ADD_TENANT_ENCRYPTION_VAULT_CERT;
  key: string;
  fileName: string;
  value: string;
}

interface AddFileVaultCa {
  type: typeof ADD_TENANT_ENCRYPTION_VAULT_CA;
  fileName: string;
  value: string;
}

interface AddFileGemaltoCa {
  type: typeof ADD_TENANT_ENCRYPTION_GEMALTO_CA;
  fileName: string;
  value: string;
}

interface ResetForm {
  type: typeof ADD_TENANT_RESET_FORM;
}

interface SetLoadingTenant {
  type: typeof TENANT_DETAILS_SET_LOADING;
  state: boolean;
}

interface SetTenantName {
  type: typeof TENANT_DETAILS_SET_CURRENT_TENANT;
  name: string;
  namespace: string;
}

interface SetTenantDetails {
  type: typeof TENANT_DETAILS_SET_TENANT;
  tenant: ITenant | null;
}

interface SetTenantTab {
  type: typeof TENANT_DETAILS_SET_TAB;
  tab: string;
}

export type FieldsToHandle = INameTenantFields;

export type TenantsManagementTypes =
  | SetTenantWizardPage
  | SetAdvancedMode
  | UpdateATField
  | SetPageValid
  | SetStorageClassesList
  | SetLimitSize
  | AddMinioKeyPair
  | DeleteMinioKeyPair
  | AddCAKeyPair
  | DeleteCAKeyPair
  | AddConsoleCAKeyPair
  | DeleteConsoleCAKeyPair
  | AddFileConsoleCert
  | AddFileToMinioKeyPair
  | AddFileToCAKeyPair
  | AddFileToConsoleCAKeyPair
  | AddFileServerCert
  | AddFileClientCert
  | AddFileVaultCert
  | AddFileVaultCa
  | AddFileGemaltoCa
  | ResetForm
  | SetLoadingTenant
  | SetTenantName
  | SetTenantDetails
  | SetTenantTab;

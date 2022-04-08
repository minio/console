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

import {
  IAWSConfig,
  IAzureConfig,
  IErasureCodeCalc,
  IGCPConfig,
  IGemaltoCredentials,
  ITolerationModel,
} from "../../../common/types";
import { IPool, IResourcesSize, ITenant } from "./ListTenants/types";
import { KeyPair, Opts } from "./ListTenants/utils";
import { IntegrationConfiguration } from "./AddTenant/Steps/TenantResources/utils";

export const ADD_TENANT_SET_CURRENT_PAGE = "ADD_TENANT/SET_CURRENT_PAGE";
export const ADD_TENANT_UPDATE_FIELD = "ADD_TENANT/UPDATE_FIELD";
export const ADD_TENANT_SET_PAGE_VALID = "ADD_TENANT/SET_PAGE_VALID";
export const ADD_TENANT_RESET_FORM = "ADD_TENANT/RESET_FORM";

// Name Tenant
export const ADD_TENANT_SET_STORAGE_CLASSES_LIST =
  "ADD_TENANT/SET_STORAGE_CLASSES_LIST";
export const ADD_TENANT_SET_LIMIT_SIZE = "ADD_TENANT/SET_LIMIT_SIZE";
export const ADD_TENANT_SET_STORAGE_TYPE =
  "ADD_TENANT/ADD_TENANT_SET_STORAGE_TYPE";

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

// Affinity Node Selector KeyPairs
export const ADD_TENANT_SET_KEY_PAIR_VALUE = "ADD_TENANT/SET_KEY_PAIR_VALUE";

// Affinity Tolerations
export const ADD_TENANT_SET_TOLERATION_VALUE =
  "ADD_TENANT/SET_TOLERATION_VALUE";
export const ADD_TENANT_ADD_NEW_TOLERATION = "ADD_TENANT/ADD_NEW_TOLERATION";
export const ADD_TENANT_REMOVE_TOLERATION_ROW =
  "ADD_TENANT/REMOVE_TOLERATION_ROW";

// Tenant Details
export const TENANT_DETAILS_SET_LOADING = "TENANT_DETAILS/SET_LOADING";
export const TENANT_DETAILS_SET_CURRENT_TENANT =
  "TENANT_DETAILS/SET_CURRENT_TENANT";
export const TENANT_DETAILS_SET_TENANT = "TENANT_DETAILS/SET_TENANT";
export const TENANT_DETAILS_SET_TAB = "TENANT_DETAILS/SET_TAB";

// Add Pool
export const ADD_POOL_SET_POOL_STORAGE_CLASSES =
  "ADD_POOL/SET_POOL_STORAGE_CLASSES";
export const ADD_POOL_SET_PAGE_VALID = "ADD_POOL/SET_PAGE_VALID";
export const ADD_POOL_SET_VALUE = "ADD_POOL/SET_VALUE";
export const ADD_POOL_SET_LOADING = "ADD_POOL/SET_LOADING";
export const ADD_POOL_RESET_FORM = "ADD_POOL/RESET_FORM";
export const ADD_POOL_SET_KEY_PAIR_VALUE = "ADD_POOL/SET_KEY_PAIR_VALUE";

// Pool Tolerations
export const ADD_POOL_SET_TOLERATION_VALUE = "ADD_POOL/SET_TOLERATION_VALUE";
export const ADD_POOL_ADD_NEW_TOLERATION = "ADD_POOL/ADD_NEW_TOLERATION";
export const ADD_POOL_REMOVE_TOLERATION_ROW = "ADD_POOL/REMOVE_TOLERATION_ROW";

// Pool Details
export const POOL_DETAILS_SET_OPEN_DETAILS = "POOL_DETAILS/SET_OPEN_DETAILS";
export const POOL_DETAILS_SET_SELECTED_POOL = "POOL_DETAILS/SET_SELECTED_POOL";

// Edit Pool
export const EDIT_POOL_SET_INITIAL_INFO = "EDIT_POOL/SET_INITIAL_INFO";
export const EDIT_POOL_SET_POOL_STORAGE_CLASSES =
  "EDIT_POOL/SET_POOL_STORAGE_CLASSES";
export const EDIT_POOL_SET_PAGE_VALID = "EDIT_POOL/SET_PAGE_VALID";
export const EDIT_POOL_SET_VALUE = "EDIT_POOL/SET_VALUE";
export const EDIT_POOL_SET_LOADING = "EDIT_POOL/SET_LOADING";
export const EDIT_POOL_RESET_FORM = "EDIT_POOL/RESET_FORM";
export const EDIT_POOL_SET_KEY_PAIR_VALUE = "EDIT_POOL/SET_KEY_PAIR_VALUE";
export const EDIT_POOL_SET_TOLERATION_VALUE = "EDIT_POOL/SET_TOLERATION_VALUE";
export const EDIT_POOL_ADD_NEW_TOLERATION = "EDIT_POOL/ADD_NEW_TOLERATION";
export const EDIT_POOL_REMOVE_TOLERATION_ROW =
  "EDIT_POOL/REMOVE_TOLERATION_ROW";

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

export interface IVaultTLS {
  crt: ICertificateInfo;
  ca: ICertificateInfo;
}

export interface IVaultAppRole {
  engine: string;
  id: string;
  secret: string;
  retry: string;
}

export interface IVaultStatus {
  ping: string;
}

export interface IVaultConfiguration {
  endpoint: string;
  engine: string;
  namespace: string;
  prefix: string;
  approle: IVaultAppRole;
  status: IVaultStatus;
  tls: IVaultTLS;
}

export interface IGemaltoTLS {
  ca: ICertificateInfo;
}

export interface IKeysecureConfiguration {
  endpoint: string;
  credentials: IGemaltoCredentials;
  tls: IGemaltoTLS;
}

export interface IGemaltoConfiguration {
  keysecure: IKeysecureConfiguration;
}

export interface ITenantEncryptionResponse {
  image: string;
  replicas: string;
  securityContext: ISecurityContext;
  server: ICertificateInfo;
  mtls_client: ICertificateInfo;
  vault?: IVaultConfiguration;
  aws?: IAWSConfig;
  gemalto?: IGemaltoConfiguration;
  gcp?: IGCPConfig;
  azure?: IAzureConfig;
}

export interface ICreateTenant {
  page: number;
  validPages: string[];
  storageClasses: Opts[];
  limitSize: any;
  fields: IFieldStore;
  certificates: ICertificatesItems;
  nodeSelectorPairs: LabelKeyPair[];
  tolerations: ITolerationModel[];
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

export interface LabelKeyPair {
  key: string;
  value: string;
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
  prometheusEnabled: boolean;
  tenantCustom: boolean;
  logSearchEnabled: boolean;
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
  ADGroupSearchBaseDN: string;
  ADGroupSearchFilter: string;
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
  untouchedECField: boolean;
  resourcesSize: IResourcesSize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  cpuToUse: string;
  limitSize: any;
  maxAllocatableResources: AllocableResourcesResponse;
  maxCPUsUse: string;
  maxMemorySize: string;
  integrationSelection: IntegrationConfiguration;

  resourcesSpecifyLimit: boolean;

  resourcesCPURequestError: string;
  resourcesCPURequest: string;
  resourcesCPULimitError: string;
  resourcesCPULimit: string;

  resourcesMemoryRequestError: string;
  resourcesMemoryRequest: string;
  resourcesMemoryLimitError: string;
  resourcesMemoryLimit: string;
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
  poolDetailsOpen: boolean;
  selectedPool: string | null;
}

export interface ITenantState {
  createTenant: ICreateTenant;
  tenantDetails: ITenantDetails;
  addPool: IAddPool;
  editPool: IEditPool;
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

export interface IAddPoolSetup {
  numberOfNodes: number;
  volumeSize: number;
  volumesPerServer: number;
  storageClass: string;
}

export interface IPoolConfiguration {
  securityContextEnabled: boolean;
  securityContext: ISecurityContext;
}

export interface IAddPoolFields {
  setup: IAddPoolSetup;
  affinity: ITenantAffinity;
  configuration: IPoolConfiguration;
  tolerations: ITolerationModel[];
  nodeSelectorPairs: LabelKeyPair[];
}

export interface IAddPool {
  addPoolLoading: boolean;
  validPages: string[];
  storageClasses: Opts[];
  limitSize: any;
  fields: IAddPoolFields;
}

export interface IEditPoolSetup {
  numberOfNodes: number;
  volumeSize: number;
  volumesPerServer: number;
  storageClass: string;
}

export interface IEditPoolFields {
  setup: IEditPoolSetup;
  affinity: ITenantAffinity;
  configuration: IPoolConfiguration;
  tolerations: ITolerationModel[];
  nodeSelectorPairs: LabelKeyPair[];
}

export interface IEditPool {
  editPoolLoading: boolean;
  validPages: string[];
  storageClasses: Opts[];
  limitSize: any;
  fields: IEditPoolFields;
}

export interface ITenantIdentityProviderResponse {
  oidc?: {
    callback_url: string;
    claim_name: string;
    client_id: string;
    configuration_url: string;
    scopes: string;
    secret_id: string;
  };
  active_directory?: {
    lookup_bind_dn: string;
    lookup_bind_password: string;
    server_start_tls: boolean;
    skip_tls_verification: boolean;
    url: string;
    group_search_base_dn: string;
    group_search_filter: string;
    server_insecure: boolean;
    user_dn_search_base_dn: string;
    user_dn_search_filter: string;
  };
}

interface SetTenantWizardPage {
  type: typeof ADD_TENANT_SET_CURRENT_PAGE;
  page: number;
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

export interface SetStorageType {
  type: typeof ADD_TENANT_SET_STORAGE_TYPE;
  storageType: string;
  features?: string[];
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

interface SetNodeSelectorKeyPairValueArray {
  type: typeof ADD_TENANT_SET_KEY_PAIR_VALUE;
  newArray: LabelKeyPair[];
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

interface SetTolerationValue {
  type: typeof ADD_TENANT_SET_TOLERATION_VALUE;
  index: number;
  toleration: ITolerationModel;
}

interface AddNewToleration {
  type: typeof ADD_TENANT_ADD_NEW_TOLERATION;
}

interface RemoveTolerationRow {
  type: typeof ADD_TENANT_REMOVE_TOLERATION_ROW;
  index: number;
}

interface SetPoolLoading {
  type: typeof ADD_POOL_SET_LOADING;
  state: boolean;
}

interface ResetPoolForm {
  type: typeof ADD_POOL_RESET_FORM;
}

interface SetFieldValue {
  type: typeof ADD_POOL_SET_VALUE;
  page: keyof IAddPoolFields;
  field: string;
  value: any;
}

interface SetPoolPageValid {
  type: typeof ADD_POOL_SET_PAGE_VALID;
  page: string;
  status: boolean;
}

interface SetPoolStorageClasses {
  type: typeof ADD_POOL_SET_POOL_STORAGE_CLASSES;
  storageClasses: Opts[];
}

interface SetPoolTolerationValue {
  type: typeof ADD_POOL_SET_TOLERATION_VALUE;
  index: number;
  toleration: ITolerationModel;
}

interface AddNewPoolToleration {
  type: typeof ADD_POOL_ADD_NEW_TOLERATION;
}

interface RemovePoolTolerationRow {
  type: typeof ADD_POOL_REMOVE_TOLERATION_ROW;
  index: number;
}

interface SetPoolSelectorKeyPairValueArray {
  type: typeof ADD_POOL_SET_KEY_PAIR_VALUE;
  newArray: LabelKeyPair[];
}

interface SetDetailsOpen {
  type: typeof POOL_DETAILS_SET_OPEN_DETAILS;
  state: boolean;
}

interface SetSelectedPool {
  type: typeof POOL_DETAILS_SET_SELECTED_POOL;
  pool: string | null;
}

interface EditPoolSetInitialInformation {
  type: typeof EDIT_POOL_SET_INITIAL_INFO;
  pool: IPool;
}

interface EditPoolLoading {
  type: typeof EDIT_POOL_SET_LOADING;
  state: boolean;
}

interface ResetEditPoolForm {
  type: typeof EDIT_POOL_RESET_FORM;
}

interface SetEditPoolFieldValue {
  type: typeof EDIT_POOL_SET_VALUE;
  page: keyof IAddPoolFields;
  field: string;
  value: any;
}

interface EditPoolPageValid {
  type: typeof EDIT_POOL_SET_PAGE_VALID;
  page: string;
  status: boolean;
}

interface EditPoolStorageClasses {
  type: typeof EDIT_POOL_SET_POOL_STORAGE_CLASSES;
  storageClasses: Opts[];
}

interface EditPoolTolerationValue {
  type: typeof EDIT_POOL_SET_TOLERATION_VALUE;
  index: number;
  toleration: ITolerationModel;
}

interface EditPoolToleration {
  type: typeof EDIT_POOL_ADD_NEW_TOLERATION;
}

interface EditRemovePoolTolerationRow {
  type: typeof EDIT_POOL_REMOVE_TOLERATION_ROW;
  index: number;
}

interface EditPoolSelectorKeyPairValueArray {
  type: typeof EDIT_POOL_SET_KEY_PAIR_VALUE;
  newArray: LabelKeyPair[];
}

export type FieldsToHandle = INameTenantFields;

export type TenantsManagementTypes =
  | SetTenantWizardPage
  | UpdateATField
  | SetPageValid
  | SetStorageClassesList
  | SetStorageType
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
  | SetNodeSelectorKeyPairValueArray
  | SetLoadingTenant
  | SetTenantName
  | SetTenantDetails
  | SetTenantTab
  | SetTolerationValue
  | AddNewToleration
  | RemoveTolerationRow
  | SetPoolLoading
  | ResetPoolForm
  | SetFieldValue
  | SetPoolPageValid
  | SetPoolStorageClasses
  | SetPoolTolerationValue
  | AddNewPoolToleration
  | RemovePoolTolerationRow
  | SetPoolSelectorKeyPairValueArray
  | SetSelectedPool
  | SetDetailsOpen
  | EditPoolLoading
  | ResetEditPoolForm
  | SetEditPoolFieldValue
  | EditPoolPageValid
  | EditPoolStorageClasses
  | EditPoolTolerationValue
  | EditPoolToleration
  | EditRemovePoolTolerationRow
  | EditPoolSelectorKeyPairValueArray
  | EditPoolSetInitialInformation;

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AccountChangePasswordRequest {
  current_secret_key: string;
  new_secret_key: string;
}

export interface ChangeUserPasswordRequest {
  selectedUser: string;
  newSecretKey: string;
}

/** @default "sse-s3" */
export enum BucketEncryptionType {
  SseS3 = "sse-s3",
  SseKms = "sse-kms",
}

/** @default "PRIVATE" */
export enum BucketAccess {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  CUSTOM = "CUSTOM",
}

export interface UserServiceAccountItem {
  userName?: string;
  /** @format int64 */
  numSAs?: number;
}

export interface Bucket {
  /** @minLength 3 */
  name: string;
  /** @format int64 */
  size?: number;
  access?: BucketAccess;
  definition?: string;
  rw_access?: {
    write?: boolean;
    read?: boolean;
  };
  /** @format int64 */
  objects?: number;
  details?: {
    versioning?: boolean;
    versioningSuspended?: boolean;
    locking?: boolean;
    replication?: boolean;
    tags?: Record<string, string>;
    quota?: {
      /** @format int64 */
      quota?: number;
      type?: "hard";
    };
  };
  creation_date?: string;
}

export interface BucketEncryptionRequest {
  encType?: BucketEncryptionType;
  kmsKeyID?: string;
}

export interface BucketEncryptionInfo {
  kmsMasterKeyID?: string;
  algorithm?: string;
}

export interface ListBucketsResponse {
  /** list of resulting buckets */
  buckets?: Bucket[];
  /**
   * number of buckets accessible to the user
   * @format int64
   */
  total?: number;
}

export interface UserServiceAccountSummary {
  /** list of users with number of service accounts */
  userServiceAccountList?: UserServiceAccountItem[];
  hasSA?: boolean;
}

export interface ListObjectsResponse {
  /** list of resulting objects */
  objects?: BucketObject[];
  /**
   * number of objects
   * @format int64
   */
  total?: number;
}

export interface BucketObject {
  name?: string;
  /** @format int64 */
  size?: number;
  content_type?: string;
  last_modified?: string;
  is_latest?: boolean;
  is_delete_marker?: boolean;
  version_id?: string;
  user_tags?: Record<string, string>;
  expiration?: string;
  expiration_rule_id?: string;
  legal_hold_status?: string;
  retention_mode?: string;
  retention_until_date?: string;
  etag?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, string>;
  user_metadata?: Record<string, string>;
}

export interface MakeBucketRequest {
  name: string;
  locking?: boolean;
  versioning?: SetBucketVersioning;
  quota?: SetBucketQuota;
  retention?: PutBucketRetentionRequest;
}

export interface ApiError {
  message?: string;
  detailedMessage?: string;
}

export interface User {
  accessKey?: string;
  policy?: string[];
  memberOf?: string[];
  status?: string;
  hasPolicy?: boolean;
}

export interface ListUsersResponse {
  /** list of resulting users */
  users?: User[];
}

export type SelectedUsers = string[];

export interface AddUserRequest {
  accessKey: string;
  secretKey: string;
  groups: string[];
  policies: string[];
}

export interface Group {
  name?: string;
  status?: string;
  members?: string[];
  policy?: string;
}

export interface AddGroupRequest {
  group: string;
  members: string[];
}

export interface ListGroupsResponse {
  /** list of groups */
  groups?: string[];
  /**
   * total number of groups
   * @format int64
   */
  total?: number;
}

export interface Policy {
  name?: string;
  policy?: string;
}

/** @default "user" */
export enum PolicyEntity {
  User = "user",
  Group = "group",
}

export interface SetPolicyRequest {
  entityType: PolicyEntity;
  entityName: string;
}

export interface SetPolicyNameRequest {
  name: string[];
  entityType: PolicyEntity;
  entityName: string;
}

export interface SetPolicyMultipleNameRequest {
  name?: string[];
  users?: IamEntity[];
  groups?: IamEntity[];
}

export type IamEntity = string;

export interface AddPolicyRequest {
  name: string;
  policy: string;
}

export interface UpdateServiceAccountRequest {
  policy: string;
  secretKey?: string;
  name?: string;
  description?: string;
  expiry?: string;
  status?: string;
}

export interface ListPoliciesResponse {
  /** list of policies */
  policies?: Policy[];
  /**
   * total number of policies
   * @format int64
   */
  total?: number;
}

export interface ListAccessRulesResponse {
  /** list of policies */
  accessRules?: AccessRule[];
  /**
   * total number of policies
   * @format int64
   */
  total?: number;
}

export interface AccessRule {
  prefix?: string;
  access?: string;
}

export interface UpdateGroupRequest {
  members: string[];
  status: string;
}

export interface ConfigDescription {
  key?: string;
  description?: string;
}

export interface ConfigurationKV {
  key?: string;
  value?: string;
  env_override?: EnvOverride;
}

export interface EnvOverride {
  name?: string;
  value?: string;
}

export interface Configuration {
  name?: string;
  key_values?: ConfigurationKV[];
}

export interface ListConfigResponse {
  configurations?: ConfigDescription[];
  /**
   * total number of configurations
   * @format int64
   */
  total?: number;
}

export interface SetConfigRequest {
  /** @minItems 1 */
  key_values: ConfigurationKV[];
  /** Used if configuration is an event notification's target */
  arn_resource_id?: string;
}

export enum NotificationEventType {
  Put = "put",
  Delete = "delete",
  Get = "get",
  Replica = "replica",
  Ilm = "ilm",
  Scanner = "scanner",
}

export interface NotificationConfig {
  id?: string;
  arn: string;
  /** filter specific type of event. Defaults to all event (default: '[put,delete,get]') */
  events?: NotificationEventType[];
  /** filter event associated to the specified prefix */
  prefix?: string;
  /** filter event associated to the specified suffix */
  suffix?: string;
}

export interface NotificationDeleteRequest {
  /**
   * filter specific type of event. Defaults to all event (default: '[put,delete,get]')
   * @minLength 1
   */
  events: NotificationEventType[];
  /** filter event associated to the specified prefix */
  prefix: string;
  /** filter event associated to the specified suffix */
  suffix: string;
}

export interface BucketEventRequest {
  configuration: NotificationConfig;
  ignoreExisting?: boolean;
}

export interface BucketReplicationDestination {
  bucket?: string;
}

export interface BucketReplicationRule {
  id?: string;
  status?: "Enabled" | "Disabled";
  /** @format int32 */
  priority?: number;
  /** @default "async" */
  syncMode?: "async" | "sync";
  bandwidth?: string;
  healthCheckPeriod?: number;
  delete_marker_replication?: boolean;
  deletes_replication?: boolean;
  existingObjects?: boolean;
  metadata_replication?: boolean;
  prefix?: string;
  tags?: string;
  storageClass?: string;
  destination?: BucketReplicationDestination;
}

export interface BucketReplicationRuleList {
  rules?: string[];
}

export interface BucketReplicationResponse {
  rules?: BucketReplicationRule[];
}

export interface ListExternalBucketsParams {
  /** @minLength 3 */
  accessKey: string;
  /** @minLength 8 */
  secretKey: string;
  targetURL: string;
  useTLS: boolean;
  region?: string;
}

export interface MultiBucketReplication {
  /** @minLength 3 */
  accessKey: string;
  /** @minLength 8 */
  secretKey: string;
  targetURL: string;
  region?: string;
  /** @default "async" */
  syncMode?: "async" | "sync";
  /** @format int64 */
  bandwidth?: number;
  /** @format int32 */
  healthCheckPeriod?: number;
  prefix?: string;
  tags?: string;
  replicateExistingObjects?: boolean;
  replicateDeleteMarkers?: boolean;
  replicateDeletes?: boolean;
  replicateMetadata?: boolean;
  /**
   * @format int32
   * @default 0
   */
  priority?: number;
  /** @default "" */
  storageClass?: string;
  /** @minLength 1 */
  bucketsRelation: MultiBucketsRelation[];
}

export interface MultiBucketReplicationEdit {
  ruleState?: boolean;
  arn?: string;
  prefix?: string;
  /** @default "" */
  tags?: string;
  replicateDeleteMarkers?: boolean;
  replicateDeletes?: boolean;
  replicateMetadata?: boolean;
  replicateExistingObjects?: boolean;
  /**
   * @format int32
   * @default 0
   */
  priority?: number;
  /** @default "" */
  storageClass?: string;
}

export interface MultiBucketsRelation {
  originBucket?: string;
  destinationBucket?: string;
}

export interface MultiBucketResponseItem {
  originBucket?: string;
  targetBucket?: string;
  errorString?: string;
}

export interface MultiBucketResponseState {
  replicationState?: MultiBucketResponseItem[];
}

export interface AddBucketReplication {
  arn?: string;
  destination_bucket?: string;
}

export interface MakeBucketsResponse {
  bucketName?: string;
}

export interface ListBucketEventsResponse {
  events?: NotificationConfig[];
  /**
   * total number of bucket events
   * @format int64
   */
  total?: number;
}

export interface SetBucketPolicyRequest {
  access: BucketAccess;
  definition?: string;
}

export interface BucketQuota {
  quota?: number;
  type?: "hard";
}

export interface SetBucketQuota {
  enabled: boolean;
  quota_type?: "hard";
  amount?: number;
}

export interface LoginDetails {
  loginStrategy?:
    | "form"
    | "redirect"
    | "service-account"
    | "redirect-service-account";
  redirectRules?: RedirectRule[];
  isK8S?: boolean;
  animatedLogin?: boolean;
}

export interface LoginOauth2AuthRequest {
  state: string;
  code: string;
}

export interface LoginRequest {
  accessKey?: string;
  secretKey?: string;
  sts?: string;
  features?: {
    hide_menu?: boolean;
  };
}

export interface LoginResponse {
  sessionId?: string;
  IDPRefreshToken?: string;
}

export interface LogoutRequest {
  state?: string;
}

export interface Principal {
  STSAccessKeyID?: string;
  STSSecretAccessKey?: string;
  STSSessionToken?: string;
  accountAccessKey?: string;
  hm?: boolean;
  ob?: boolean;
  customStyleOb?: string;
}

export interface StartProfilingItem {
  nodeName?: string;
  success?: boolean;
  error?: string;
}

export interface StartProfilingList {
  /**
   * number of start results
   * @format int64
   */
  total?: number;
  startResults?: StartProfilingItem[];
}

export interface ProfilingStartRequest {
  type: string;
}

export interface SessionResponse {
  features?: string[];
  status?: "ok";
  operator?: boolean;
  distributedMode?: boolean;
  serverEndPoint?: string;
  permissions?: Record<string, string[]>;
  customStyles?: string;
  allowResources?: PermissionResource[];
  envConstants?: EnvironmentConstants;
}

export interface WidgetResult {
  metric?: Record<string, string>;
  values?: any[];
}

export interface ResultTarget {
  legendFormat?: string;
  resultType?: string;
  result?: WidgetResult[];
}

export interface Widget {
  title?: string;
  type?: string;
  /** @format int32 */
  id?: number;
  options?: {
    reduceOptions?: {
      calcs?: string[];
    };
  };
  targets?: ResultTarget[];
}

export interface WidgetDetails {
  title?: string;
  type?: string;
  /** @format int32 */
  id?: number;
  options?: {
    reduceOptions?: {
      calcs?: string[];
    };
  };
  targets?: ResultTarget[];
}

export interface AdminInfoResponse {
  buckets?: number;
  objects?: number;
  usage?: number;
  advancedMetricsStatus?: "not configured" | "available" | "unavailable";
  widgets?: Widget[];
  servers?: ServerProperties[];
  backend?: BackendProperties;
}

export interface ServerProperties {
  state?: string;
  endpoint?: string;
  uptime?: number;
  version?: string;
  commitID?: string;
  poolNumber?: number;
  network?: Record<string, string>;
  drives?: ServerDrives[];
}

export interface ServerDrives {
  uuid?: string;
  state?: string;
  endpoint?: string;
  drivePath?: string;
  rootDisk?: boolean;
  healing?: boolean;
  model?: string;
  totalSpace?: number;
  usedSpace?: number;
  availableSpace?: number;
}

export interface BackendProperties {
  backendType?: string;
  rrSCParity?: number;
  standardSCParity?: number;
  onlineDrives?: number;
  offlineDrives?: number;
}

export interface ArnsResponse {
  arns?: string[];
}

export interface UpdateUserGroups {
  groups: string[];
}

export enum NofiticationService {
  Webhook = "webhook",
  Amqp = "amqp",
  Kafka = "kafka",
  Mqtt = "mqtt",
  Nats = "nats",
  Nsq = "nsq",
  Mysql = "mysql",
  Postgres = "postgres",
  Elasticsearch = "elasticsearch",
  Redis = "redis",
}

export interface NotificationEndpointItem {
  service?: NofiticationService;
  account_id?: string;
  status?: string;
}

export interface NotificationEndpoint {
  service: NofiticationService;
  account_id: string;
  properties: Record<string, string>;
}

export interface SetNotificationEndpointResponse {
  service: NofiticationService;
  account_id: string;
  properties: Record<string, string>;
  restart?: boolean;
}

export interface NotifEndpointResponse {
  notification_endpoints?: NotificationEndpointItem[];
}

export interface PeerSiteRemoveResponse {
  status?: string;
  errorDetail?: string;
}

export interface PeerSiteEditResponse {
  success?: boolean;
  status?: string;
  errorDetail?: string;
}

export interface PeerSite {
  name?: string;
  endpoint?: string;
  accessKey?: string;
  secretKey?: string;
}

export interface PeerInfo {
  endpoint?: string;
  name?: string;
  deploymentID?: string;
}

export interface PeerInfoRemove {
  all?: boolean;
  sites: string[];
}

export type SiteReplicationAddRequest = PeerSite[];

export interface SiteReplicationAddResponse {
  success?: boolean;
  status?: string;
  errorDetail?: string;
  initialSyncErrorMessage?: string;
}

export interface SiteReplicationInfoResponse {
  enabled?: boolean;
  name?: string;
  sites?: PeerInfo[];
  serviceAccountAccessKey?: string;
}

export interface SiteReplicationStatusResponse {
  enabled?: boolean;
  maxBuckets?: number;
  maxUsers?: number;
  maxGroups?: number;
  maxPolicies?: number;
  sites?: object;
  statsSummary?: object;
  bucketStats?: object;
  policyStats?: object;
  userStats?: object;
  groupStats?: object;
}

export interface UpdateUser {
  status: string;
  groups: string[];
}

export interface BulkUserGroups {
  users: string[];
  groups: string[];
}

export interface ServiceAccount {
  parentUser?: string;
  accountStatus?: string;
  impliedPolicy?: boolean;
  policy?: string;
  name?: string;
  description?: string;
  expiration?: string;
}

export type ServiceAccounts = {
  accountStatus?: string;
  name?: string;
  description?: string;
  expiration?: string;
  accessKey?: string;
}[];

export interface ServiceAccountRequest {
  /** policy to be applied to the Service Account if any */
  policy?: string;
  name?: string;
  description?: string;
  expiry?: string;
  comment?: string;
}

export interface ServiceAccountRequestCreds {
  /** policy to be applied to the Service Account if any */
  policy?: string;
  accessKey?: string;
  secretKey?: string;
  name?: string;
  description?: string;
  expiry?: string;
  comment?: string;
}

export interface ServiceAccountCreds {
  accessKey?: string;
  secretKey?: string;
  url?: string;
}

export interface RemoteBucket {
  /** @minLength 3 */
  accessKey: string;
  /** @minLength 8 */
  secretKey?: string;
  sourceBucket: string;
  targetURL?: string;
  targetBucket?: string;
  remoteARN: string;
  status?: string;
  service?: "replication";
  syncMode?: string;
  /** @format int64 */
  bandwidth?: number;
  healthCheckPeriod?: number;
}

export interface CreateRemoteBucket {
  /** @minLength 3 */
  accessKey: string;
  /** @minLength 8 */
  secretKey: string;
  targetURL: string;
  sourceBucket: string;
  targetBucket: string;
  region?: string;
  /** @default "async" */
  syncMode?: "async" | "sync";
  /** @format int64 */
  bandwidth?: number;
  /** @format int32 */
  healthCheckPeriod?: number;
}

export interface ListRemoteBucketsResponse {
  /** list of remote buckets */
  buckets?: RemoteBucket[];
  /**
   * number of remote buckets accessible to user
   * @format int64
   */
  total?: number;
}

export interface BucketVersioningResponse {
  status?: string;
  MFADelete?: string;
  excludedPrefixes?: {
    prefix?: string;
  }[];
  excludeFolders?: boolean;
}

export interface SetBucketVersioning {
  enabled?: boolean;
  /** @maxLength 10 */
  excludePrefixes?: string[];
  excludeFolders?: boolean;
}

export interface BucketObLockingResponse {
  object_locking_enabled?: boolean;
}

export interface LogSearchResponse {
  /** list of log search responses */
  results?: object;
}

export enum ObjectLegalHoldStatus {
  Enabled = "enabled",
  Disabled = "disabled",
}

export interface PutObjectLegalHoldRequest {
  status: ObjectLegalHoldStatus;
}

export enum ObjectRetentionMode {
  Governance = "governance",
  Compliance = "compliance",
}

export interface PutObjectRetentionRequest {
  mode: ObjectRetentionMode;
  expires: string;
  governance_bypass?: boolean;
}

export interface PutObjectTagsRequest {
  tags?: any;
}

export interface PutBucketTagsRequest {
  tags?: any;
}

export enum ObjectRetentionUnit {
  Days = "days",
  Years = "years",
}

export interface PutBucketRetentionRequest {
  mode: ObjectRetentionMode;
  unit: ObjectRetentionUnit;
  /** @format int32 */
  validity: number;
}

export interface GetBucketRetentionConfig {
  mode?: ObjectRetentionMode;
  unit?: ObjectRetentionUnit;
  /** @format int32 */
  validity?: number;
}

export interface BucketLifecycleResponse {
  lifecycle?: ObjectBucketLifecycle[];
}

export interface ExpirationResponse {
  date?: string;
  /** @format int64 */
  days?: number;
  delete_marker?: boolean;
  delete_all?: boolean;
  /** @format int64 */
  noncurrent_expiration_days?: number;
  /** @format int64 */
  newer_noncurrent_expiration_versions?: number;
}

export interface TransitionResponse {
  date?: string;
  storage_class?: string;
  /** @format int64 */
  days?: number;
  /** @format int64 */
  noncurrent_transition_days?: number;
  noncurrent_storage_class?: string;
}

export interface LifecycleTag {
  key?: string;
  value?: string;
}

export interface ObjectBucketLifecycle {
  id?: string;
  prefix?: string;
  status?: string;
  expiration?: ExpirationResponse;
  transition?: TransitionResponse;
  tags?: LifecycleTag[];
}

export interface AddBucketLifecycle {
  /** ILM Rule type (Expiry or transition) */
  type?: "expiry" | "transition";
  /** Non required field, it matches a prefix to perform ILM operations on it */
  prefix?: string;
  /** Non required field, tags to match ILM files */
  tags?: string;
  /**
   * Required in case of expiry_date or transition fields are not set. it defines an expiry days for ILM
   * @format int32
   * @default 0
   */
  expiry_days?: number;
  /**
   * Required in case of transition_date or expiry fields are not set. it defines a transition days for ILM
   * @format int32
   * @default 0
   */
  transition_days?: number;
  /** Required only in case of transition is set. it refers to a tier */
  storage_class?: string;
  /** Non required, toggle to disable or enable rule */
  disable?: boolean;
  /** Non required, toggle to disable or enable rule */
  expired_object_delete_marker?: boolean;
  /** Non required, toggle to disable or enable rule */
  expired_object_delete_all?: boolean;
  /**
   * Non required, can be set in case of expiration is enabled
   * @format int32
   * @default 0
   */
  noncurrentversion_expiration_days?: number;
  /**
   * Non required, can be set in case of transition is enabled
   * @format int32
   * @default 0
   */
  noncurrentversion_transition_days?: number;
  /**
   * Non required, can be set in case of expiration is enabled
   * @format int32
   * @default 0
   */
  newer_noncurrentversion_expiration_versions?: number;
  /** Non required, can be set in case of transition is enabled */
  noncurrentversion_transition_storage_class?: string;
}

export interface UpdateBucketLifecycle {
  /** ILM Rule type (Expiry or transition) */
  type: "expiry" | "transition";
  /** Non required field, it matches a prefix to perform ILM operations on it */
  prefix?: string;
  /** Non required field, tags to match ILM files */
  tags?: string;
  /**
   * Required in case of expiry_date or transition fields are not set. it defines an expiry days for ILM
   * @format int32
   * @default 0
   */
  expiry_days?: number;
  /**
   * Required in case of transition_date or expiry fields are not set. it defines a transition days for ILM
   * @format int32
   * @default 0
   */
  transition_days?: number;
  /** Required only in case of transition is set. it refers to a tier */
  storage_class?: string;
  /** Non required, toggle to disable or enable rule */
  disable?: boolean;
  /** Non required, toggle to disable or enable rule */
  expired_object_delete_marker?: boolean;
  /** Non required, toggle to disable or enable rule */
  expired_object_delete_all?: boolean;
  /**
   * Non required, can be set in case of expiration is enabled
   * @format int32
   * @default 0
   */
  noncurrentversion_expiration_days?: number;
  /**
   * Non required, can be set in case of transition is enabled
   * @format int32
   * @default 0
   */
  noncurrentversion_transition_days?: number;
  /** Non required, can be set in case of transition is enabled */
  noncurrentversion_transition_storage_class?: string;
}

export interface AddMultiBucketLifecycle {
  buckets: string[];
  /** ILM Rule type (Expiry or transition) */
  type: "expiry" | "transition";
  /** Non required field, it matches a prefix to perform ILM operations on it */
  prefix?: string;
  /** Non required field, tags to match ILM files */
  tags?: string;
  /**
   * Required in case of expiry_date or transition fields are not set. it defines an expiry days for ILM
   * @format int32
   * @default 0
   */
  expiry_days?: number;
  /**
   * Required in case of transition_date or expiry fields are not set. it defines a transition days for ILM
   * @format int32
   * @default 0
   */
  transition_days?: number;
  /** Required only in case of transition is set. it refers to a tier */
  storage_class?: string;
  /** Non required, toggle to disable or enable rule */
  expired_object_delete_marker?: boolean;
  /** Non required, toggle to disable or enable rule */
  expired_object_delete_all?: boolean;
  /**
   * Non required, can be set in case of expiration is enabled
   * @format int32
   * @default 0
   */
  noncurrentversion_expiration_days?: number;
  /**
   * Non required, can be set in case of transition is enabled
   * @format int32
   * @default 0
   */
  noncurrentversion_transition_days?: number;
  /** Non required, can be set in case of transition is enabled */
  noncurrentversion_transition_storage_class?: string;
}

export interface MulticycleResultItem {
  bucketName?: string;
  error?: string;
}

export interface MultiLifecycleResult {
  results?: MulticycleResultItem[];
}

export interface PrefixAccessPair {
  prefix?: string;
  access?: string;
}

export interface PrefixWrapper {
  prefix?: string;
}

export interface SetConfigResponse {
  /** Returns wheter server needs to restart to apply changes or not */
  restart?: boolean;
}

export interface ConfigExportResponse {
  /** Returns base64 encoded value */
  value?: string;
  status?: string;
}

export interface License {
  email?: string;
  organization?: string;
  account_id?: number;
  storage_capacity?: number;
  plan?: string;
  expires_at?: string;
}

export interface ApiKey {
  apiKey?: string;
}

export interface PolicyArgs {
  id?: string;
  action?: string;
  bucket_name?: string;
}

export interface TierS3 {
  name?: string;
  endpoint?: string;
  accesskey?: string;
  secretkey?: string;
  bucket?: string;
  prefix?: string;
  region?: string;
  storageclass?: string;
  usage?: string;
  objects?: string;
  versions?: string;
}

export interface TierMinio {
  name?: string;
  endpoint?: string;
  accesskey?: string;
  secretkey?: string;
  bucket?: string;
  prefix?: string;
  region?: string;
  storageclass?: string;
  usage?: string;
  objects?: string;
  versions?: string;
}

export interface TierAzure {
  name?: string;
  endpoint?: string;
  accountname?: string;
  accountkey?: string;
  bucket?: string;
  prefix?: string;
  region?: string;
  usage?: string;
  objects?: string;
  versions?: string;
}

export interface TierGcs {
  name?: string;
  endpoint?: string;
  creds?: string;
  bucket?: string;
  prefix?: string;
  region?: string;
  usage?: string;
  objects?: string;
  versions?: string;
}

export interface DeleteFile {
  path?: string;
  versionID?: string;
  recursive?: boolean;
}

export interface UserSAs {
  path?: string;
  versionID?: string;
  recursive?: boolean;
}

export interface Tier {
  status?: boolean;
  type?: "s3" | "gcs" | "azure" | "minio" | "unsupported";
  s3?: TierS3;
  gcs?: TierGcs;
  azure?: TierAzure;
  minio?: TierMinio;
}

export interface TierListResponse {
  items?: Tier[];
}

export interface TiersNameListResponse {
  items?: string[];
}

export interface TierCredentialsRequest {
  access_key?: string;
  secret_key?: string;
  /** a base64 encoded value */
  creds?: string;
}

export interface RewindItem {
  last_modified?: string;
  /** @format int64 */
  size?: number;
  version_id?: string;
  delete_flag?: boolean;
  action?: string;
  name?: string;
  is_latest?: boolean;
}

export interface RewindResponse {
  objects?: RewindItem[];
}

export interface IamPolicy {
  version?: string;
  statement?: IamPolicyStatement[];
}

export interface IamPolicyStatement {
  effect?: string;
  action?: string[];
  resource?: string[];
  condition?: Record<string, object>;
}

export interface Metadata {
  objectMetadata?: Record<string, any>;
}

export interface SubnetLoginResponse {
  access_token?: string;
  organizations?: SubnetOrganization[];
  mfa_token?: string;
  registered?: boolean;
}

export interface SubnetLoginRequest {
  username?: string;
  password?: string;
  apiKey?: string;
}

export interface SubnetLoginMFARequest {
  username: string;
  otp: string;
  mfa_token: string;
}

export interface SubnetRegisterRequest {
  token: string;
  account_id: string;
}

export interface SubnetRegTokenResponse {
  regToken?: string;
}

export interface SubnetOrganization {
  userId?: number;
  accountId?: number;
  subscriptionStatus?: string;
  isAccountOwner?: boolean;
  company?: string;
  shortName?: string;
}

export interface PermissionResource {
  resource?: string;
  conditionOperator?: string;
  prefixes?: string[];
}

export interface AUserPolicyResponse {
  policy?: string;
}

export interface KmsStatusResponse {
  name?: string;
  defaultKeyID?: string;
  endpoints?: KmsEndpoint[];
}

export interface KmsEndpoint {
  url?: string;
  status?: string;
}

export interface KmsKeyStatusResponse {
  keyID?: string;
  encryptionErr?: string;
  decryptionErr?: string;
}

export interface KmsCreateKeyRequest {
  key: string;
}

export interface KmsListKeysResponse {
  results?: KmsKeyInfo[];
}

export interface KmsKeyInfo {
  name?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface KmsMetricsResponse {
  requestOK: number;
  requestErr: number;
  requestFail: number;
  requestActive: number;
  auditEvents: number;
  errorEvents: number;
  latencyHistogram: KmsLatencyHistogram[];
  uptime: number;
  cpus: number;
  usableCPUs: number;
  threads: number;
  heapAlloc: number;
  heapObjects?: number;
  stackAlloc: number;
}

export interface KmsLatencyHistogram {
  duration?: number;
  total?: number;
}

export interface KmsAPIsResponse {
  results?: KmsAPI[];
}

export interface KmsAPI {
  method?: string;
  path?: string;
  maxBody?: number;
  timeout?: number;
}

export interface KmsVersionResponse {
  version?: string;
}

export interface EnvironmentConstants {
  maxConcurrentUploads?: number;
  maxConcurrentDownloads?: number;
}

export interface RedirectRule {
  redirect?: string;
  displayName?: string;
  serviceType?: string;
}

export interface IdpServerConfiguration {
  name?: string;
  input?: string;
  type?: string;
  enabled?: boolean;
  info?: IdpServerConfigurationInfo[];
}

export interface IdpServerConfigurationInfo {
  key?: string;
  value?: string;
  isCfg?: boolean;
  isEnv?: boolean;
}

export interface IdpListConfigurationsResponse {
  results?: IdpServerConfiguration[];
}

export interface SetIDPResponse {
  restart?: boolean;
}

export interface ReleaseListResponse {
  results?: ReleaseInfo[];
}

export interface ReleaseInfo {
  metadata?: ReleaseMetadata;
  notesContent?: string;
  securityContent?: string;
  breakingChangesContent?: string;
  contextContent?: string;
  newFeaturesContent?: string;
}

export interface ReleaseMetadata {
  tag_name?: string;
  target_commitish?: string;
  name?: string;
  draft?: boolean;
  prerelease?: boolean;
  id?: number;
  created_at?: string;
  published_at?: string;
  url?: string;
  html_url?: string;
  assets_url?: string;
  upload_url?: string;
  zipball_url?: string;
  tarball_url?: string;
  author?: ReleaseAuthor;
  node_id?: string;
}

export interface ReleaseAuthor {
  login?: string;
  id?: number;
  node_id?: string;
  avatar_url?: string;
  html_url?: string;
  gravatar_id?: string;
  type?: string;
  site_admin?: boolean;
  url?: string;
  events_url?: string;
  following_url?: string;
  followers_url?: string;
  gists_url?: string;
  organizations_url?: string;
  receivedEvents_url?: string;
  repos_url?: string;
  starred_url?: string;
  subscriptions_url?: string;
}

export interface CallHomeGetResponse {
  diagnosticsStatus?: boolean;
  logsStatus?: boolean;
}

export interface CallHomeSetStatus {
  diagState: boolean;
  logsState: boolean;
}

export interface LdapEntitiesRequest {
  users?: string[];
  groups?: string[];
  policies?: string[];
}

export interface LdapEntities {
  timestamp?: string;
  users?: LdapUserPolicyEntity[];
  groups?: LdapGroupPolicyEntity[];
  policies?: LdapPolicyEntity[];
}

export interface LdapUserPolicyEntity {
  user?: string;
  policies?: string[];
}

export interface LdapGroupPolicyEntity {
  group?: string;
  policies?: string[];
}

export interface LdapPolicyEntity {
  policy?: string;
  users?: string[];
  groups?: string[];
}

export interface MaxShareLinkExpResponse {
  /** @format int64 */
  exp: number;
}

export type SelectedSAs = string[];

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/api/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title MinIO Console Server
 * @version 0.1.0
 * @baseUrl /api/v1
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  login = {
    /**
     * No description
     *
     * @tags Auth
     * @name LoginDetail
     * @summary Returns login strategy, form or sso.
     * @request GET:/login
     */
    loginDetail: (params: RequestParams = {}) =>
      this.request<LoginDetails, ApiError>({
        path: `/login`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name Login
     * @summary Login to Console
     * @request POST:/login
     */
    login: (body: LoginRequest, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name LoginOauth2Auth
     * @summary Identity Provider oauth2 callback endpoint.
     * @request POST:/login/oauth2/auth
     */
    loginOauth2Auth: (
      body: LoginOauth2AuthRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/login/oauth2/auth`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags Auth
     * @name Logout
     * @summary Logout from Console.
     * @request POST:/logout
     * @secure
     */
    logout: (body: LogoutRequest, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/logout`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  session = {
    /**
     * No description
     *
     * @tags Auth
     * @name SessionCheck
     * @summary Endpoint to check if your session is still valid
     * @request GET:/session
     * @secure
     */
    sessionCheck: (params: RequestParams = {}) =>
      this.request<SessionResponse, ApiError>({
        path: `/session`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  account = {
    /**
     * No description
     *
     * @tags Account
     * @name AccountChangePassword
     * @summary Change password of currently logged in user.
     * @request POST:/account/change-password
     * @secure
     */
    accountChangePassword: (
      body: AccountChangePasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/account/change-password`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name ChangeUserPassword
     * @summary Change password of currently logged in user.
     * @request POST:/account/change-user-password
     * @secure
     */
    changeUserPassword: (
      body: ChangeUserPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/account/change-user-password`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  buckets = {
    /**
     * No description
     *
     * @tags Bucket
     * @name ListBuckets
     * @summary List Buckets
     * @request GET:/buckets
     * @secure
     */
    listBuckets: (params: RequestParams = {}) =>
      this.request<ListBucketsResponse, ApiError>({
        path: `/buckets`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name MakeBucket
     * @summary Make bucket
     * @request POST:/buckets
     * @secure
     */
    makeBucket: (body: MakeBucketRequest, params: RequestParams = {}) =>
      this.request<MakeBucketsResponse, ApiError>({
        path: `/buckets`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name BucketInfo
     * @summary Bucket Info
     * @request GET:/buckets/{name}
     * @secure
     */
    bucketInfo: (name: string, params: RequestParams = {}) =>
      this.request<Bucket, ApiError>({
        path: `/buckets/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteBucket
     * @summary Delete Bucket
     * @request DELETE:/buckets/{name}
     * @secure
     */
    deleteBucket: (name: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(name)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketRetentionConfig
     * @summary Get Bucket's retention config
     * @request GET:/buckets/{bucket_name}/retention
     * @secure
     */
    getBucketRetentionConfig: (
      bucketName: string,
      params: RequestParams = {},
    ) =>
      this.request<GetBucketRetentionConfig, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/retention`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name SetBucketRetentionConfig
     * @summary Set Bucket's retention config
     * @request PUT:/buckets/{bucket_name}/retention
     * @secure
     */
    setBucketRetentionConfig: (
      bucketName: string,
      body: PutBucketRetentionRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/retention`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name ListObjects
     * @summary List Objects
     * @request GET:/buckets/{bucket_name}/objects
     * @secure
     */
    listObjects: (
      bucketName: string,
      query?: {
        prefix?: string;
        recursive?: boolean;
        with_versions?: boolean;
        with_metadata?: boolean;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListObjectsResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name DeleteObject
     * @summary Delete Object
     * @request DELETE:/buckets/{bucket_name}/objects
     * @secure
     */
    deleteObject: (
      bucketName: string,
      query: {
        prefix: string;
        version_id?: string;
        recursive?: boolean;
        all_versions?: boolean;
        non_current_versions?: boolean;
        bypass?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name DeleteMultipleObjects
     * @summary Delete Multiple Objects
     * @request POST:/buckets/{bucket_name}/delete-objects
     * @secure
     */
    deleteMultipleObjects: (
      bucketName: string,
      files: DeleteFile[],
      query?: {
        all_versions?: boolean;
        bypass?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/delete-objects`,
        method: "POST",
        query: query,
        body: files,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name ObjectsUploadCreate
     * @summary Uploads an Object.
     * @request POST:/buckets/{bucket_name}/objects/upload
     * @secure
     */
    objectsUploadCreate: (
      bucketName: string,
      query?: {
        prefix?: string;
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/upload`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name DownloadMultipleObjects
     * @summary Download Multiple Objects
     * @request POST:/buckets/{bucket_name}/objects/download-multiple
     * @secure
     */
    downloadMultipleObjects: (
      bucketName: string,
      objectList: SelectedUsers,
      params: RequestParams = {},
    ) =>
      this.request<File, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/download-multiple`,
        method: "POST",
        body: objectList,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name DownloadObject
     * @summary Download Object
     * @request GET:/buckets/{bucket_name}/objects/download
     * @secure
     */
    downloadObject: (
      bucketName: string,
      query: {
        prefix: string;
        version_id?: string;
        /** @default false */
        preview?: boolean;
        /** @default "" */
        override_file_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/download`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name ShareObject
     * @summary Shares an Object on a url
     * @request GET:/buckets/{bucket_name}/objects/share
     * @secure
     */
    shareObject: (
      bucketName: string,
      query: {
        prefix: string;
        version_id: string;
        expires?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<IamEntity, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/share`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name PutObjectLegalHold
     * @summary Put Object's legalhold status
     * @request PUT:/buckets/{bucket_name}/objects/legalhold
     * @secure
     */
    putObjectLegalHold: (
      bucketName: string,
      query: {
        prefix: string;
        version_id: string;
      },
      body: PutObjectLegalHoldRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/legalhold`,
        method: "PUT",
        query: query,
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name PutObjectRetention
     * @summary Put Object's retention status
     * @request PUT:/buckets/{bucket_name}/objects/retention
     * @secure
     */
    putObjectRetention: (
      bucketName: string,
      query: {
        prefix: string;
        version_id: string;
      },
      body: PutObjectRetentionRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/retention`,
        method: "PUT",
        query: query,
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name DeleteObjectRetention
     * @summary Delete Object retention from an object
     * @request DELETE:/buckets/{bucket_name}/objects/retention
     * @secure
     */
    deleteObjectRetention: (
      bucketName: string,
      query: {
        prefix: string;
        version_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/retention`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name PutObjectTags
     * @summary Put Object's tags
     * @request PUT:/buckets/{bucket_name}/objects/tags
     * @secure
     */
    putObjectTags: (
      bucketName: string,
      query: {
        prefix: string;
        version_id: string;
      },
      body: PutObjectTagsRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/tags`,
        method: "PUT",
        query: query,
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name PutObjectRestore
     * @summary Restore Object to a selected version
     * @request PUT:/buckets/{bucket_name}/objects/restore
     * @secure
     */
    putObjectRestore: (
      bucketName: string,
      query: {
        prefix: string;
        version_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/restore`,
        method: "PUT",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Object
     * @name GetObjectMetadata
     * @summary Gets the metadata of an object
     * @request GET:/buckets/{bucket_name}/objects/metadata
     * @secure
     */
    getObjectMetadata: (
      bucketName: string,
      query: {
        prefix: string;
        versionID?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Metadata, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/objects/metadata`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name PutBucketTags
     * @summary Put Bucket's tags
     * @request PUT:/buckets/{bucket_name}/tags
     * @secure
     */
    putBucketTags: (
      bucketName: string,
      body: PutBucketTagsRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/tags`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name BucketSetPolicy
     * @summary Bucket Set Policy
     * @request PUT:/buckets/{name}/set-policy
     * @secure
     */
    bucketSetPolicy: (
      name: string,
      body: SetBucketPolicyRequest,
      params: RequestParams = {},
    ) =>
      this.request<Bucket, ApiError>({
        path: `/buckets/${encodeURIComponent(name)}/set-policy`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketQuota
     * @summary Get Bucket Quota
     * @request GET:/buckets/{name}/quota
     * @secure
     */
    getBucketQuota: (name: string, params: RequestParams = {}) =>
      this.request<BucketQuota, ApiError>({
        path: `/buckets/${encodeURIComponent(name)}/quota`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name SetBucketQuota
     * @summary Bucket Quota
     * @request PUT:/buckets/{name}/quota
     * @secure
     */
    setBucketQuota: (
      name: string,
      body: SetBucketQuota,
      params: RequestParams = {},
    ) =>
      this.request<Bucket, ApiError>({
        path: `/buckets/${encodeURIComponent(name)}/quota`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name ListBucketEvents
     * @summary List Bucket Events
     * @request GET:/buckets/{bucket_name}/events
     * @secure
     */
    listBucketEvents: (
      bucketName: string,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListBucketEventsResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/events`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name CreateBucketEvent
     * @summary Create Bucket Event
     * @request POST:/buckets/{bucket_name}/events
     * @secure
     */
    createBucketEvent: (
      bucketName: string,
      body: BucketEventRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/events`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteBucketEvent
     * @summary Delete Bucket Event
     * @request DELETE:/buckets/{bucket_name}/events/{arn}
     * @secure
     */
    deleteBucketEvent: (
      bucketName: string,
      arn: string,
      body: NotificationDeleteRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/events/${encodeURIComponent(arn)}`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketReplication
     * @summary Bucket Replication
     * @request GET:/buckets/{bucket_name}/replication
     * @secure
     */
    getBucketReplication: (bucketName: string, params: RequestParams = {}) =>
      this.request<BucketReplicationResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/replication`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketReplicationRule
     * @summary Bucket Replication
     * @request GET:/buckets/{bucket_name}/replication/{rule_id}
     * @secure
     */
    getBucketReplicationRule: (
      bucketName: string,
      ruleId: string,
      params: RequestParams = {},
    ) =>
      this.request<BucketReplicationRule, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/replication/${encodeURIComponent(ruleId)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name UpdateMultiBucketReplication
     * @summary Update Replication rule
     * @request PUT:/buckets/{bucket_name}/replication/{rule_id}
     * @secure
     */
    updateMultiBucketReplication: (
      bucketName: string,
      ruleId: string,
      body: MultiBucketReplicationEdit,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/replication/${encodeURIComponent(ruleId)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteBucketReplicationRule
     * @summary Bucket Replication Rule Delete
     * @request DELETE:/buckets/{bucket_name}/replication/{rule_id}
     * @secure
     */
    deleteBucketReplicationRule: (
      bucketName: string,
      ruleId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/replication/${encodeURIComponent(ruleId)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteAllReplicationRules
     * @summary Deletes all replication rules from a bucket
     * @request DELETE:/buckets/{bucket_name}/delete-all-replication-rules
     * @secure
     */
    deleteAllReplicationRules: (
      bucketName: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/delete-all-replication-rules`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteSelectedReplicationRules
     * @summary Deletes selected replication rules from a bucket
     * @request DELETE:/buckets/{bucket_name}/delete-selected-replication-rules
     * @secure
     */
    deleteSelectedReplicationRules: (
      bucketName: string,
      rules: BucketReplicationRuleList,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/delete-selected-replication-rules`,
        method: "DELETE",
        body: rules,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketVersioning
     * @summary Bucket Versioning
     * @request GET:/buckets/{bucket_name}/versioning
     * @secure
     */
    getBucketVersioning: (bucketName: string, params: RequestParams = {}) =>
      this.request<BucketVersioningResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/versioning`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name SetBucketVersioning
     * @summary Set Bucket Versioning
     * @request PUT:/buckets/{bucket_name}/versioning
     * @secure
     */
    setBucketVersioning: (
      bucketName: string,
      body: SetBucketVersioning,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/versioning`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketObjectLockingStatus
     * @summary Returns the status of object locking support on the bucket
     * @request GET:/buckets/{bucket_name}/object-locking
     * @secure
     */
    getBucketObjectLockingStatus: (
      bucketName: string,
      params: RequestParams = {},
    ) =>
      this.request<BucketObLockingResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/object-locking`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name EnableBucketEncryption
     * @summary Enable bucket encryption.
     * @request POST:/buckets/{bucket_name}/encryption/enable
     * @secure
     */
    enableBucketEncryption: (
      bucketName: string,
      body: BucketEncryptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/encryption/enable`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DisableBucketEncryption
     * @summary Disable bucket encryption.
     * @request POST:/buckets/{bucket_name}/encryption/disable
     * @secure
     */
    disableBucketEncryption: (bucketName: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/encryption/disable`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketEncryptionInfo
     * @summary Get bucket encryption information.
     * @request GET:/buckets/{bucket_name}/encryption/info
     * @secure
     */
    getBucketEncryptionInfo: (bucketName: string, params: RequestParams = {}) =>
      this.request<BucketEncryptionInfo, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/encryption/info`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketLifecycle
     * @summary Bucket Lifecycle
     * @request GET:/buckets/{bucket_name}/lifecycle
     * @secure
     */
    getBucketLifecycle: (bucketName: string, params: RequestParams = {}) =>
      this.request<BucketLifecycleResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/lifecycle`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name AddBucketLifecycle
     * @summary Add Bucket Lifecycle
     * @request POST:/buckets/{bucket_name}/lifecycle
     * @secure
     */
    addBucketLifecycle: (
      bucketName: string,
      body: AddBucketLifecycle,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/lifecycle`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name AddMultiBucketLifecycle
     * @summary Add Multi Bucket Lifecycle
     * @request POST:/buckets/multi-lifecycle
     * @secure
     */
    addMultiBucketLifecycle: (
      body: AddMultiBucketLifecycle,
      params: RequestParams = {},
    ) =>
      this.request<MultiLifecycleResult, ApiError>({
        path: `/buckets/multi-lifecycle`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name UpdateBucketLifecycle
     * @summary Update Lifecycle rule
     * @request PUT:/buckets/{bucket_name}/lifecycle/{lifecycle_id}
     * @secure
     */
    updateBucketLifecycle: (
      bucketName: string,
      lifecycleId: string,
      body: UpdateBucketLifecycle,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/lifecycle/${encodeURIComponent(lifecycleId)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteBucketLifecycleRule
     * @summary Delete Lifecycle rule
     * @request DELETE:/buckets/{bucket_name}/lifecycle/{lifecycle_id}
     * @secure
     */
    deleteBucketLifecycleRule: (
      bucketName: string,
      lifecycleId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/lifecycle/${encodeURIComponent(lifecycleId)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetBucketRewind
     * @summary Get objects in a bucket for a rewind date
     * @request GET:/buckets/{bucket_name}/rewind/{date}
     * @secure
     */
    getBucketRewind: (
      bucketName: string,
      date: string,
      query?: {
        prefix?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RewindResponse, ApiError>({
        path: `/buckets/${encodeURIComponent(bucketName)}/rewind/${encodeURIComponent(date)}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name GetMaxShareLinkExp
     * @summary Get max expiration time for share link in seconds
     * @request GET:/buckets/max-share-exp
     * @secure
     */
    getMaxShareLinkExp: (params: RequestParams = {}) =>
      this.request<MaxShareLinkExpResponse, ApiError>({
        path: `/buckets/max-share-exp`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  listExternalBuckets = {
    /**
     * No description
     *
     * @tags Bucket
     * @name ListExternalBuckets
     * @summary Lists an External list of buckets using custom credentials
     * @request POST:/list-external-buckets
     * @secure
     */
    listExternalBuckets: (
      body: ListExternalBucketsParams,
      params: RequestParams = {},
    ) =>
      this.request<ListBucketsResponse, ApiError>({
        path: `/list-external-buckets`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  bucketsReplication = {
    /**
     * No description
     *
     * @tags Bucket
     * @name SetMultiBucketReplication
     * @summary Sets Multi Bucket Replication in multiple Buckets
     * @request POST:/buckets-replication
     * @secure
     */
    setMultiBucketReplication: (
      body: MultiBucketReplication,
      params: RequestParams = {},
    ) =>
      this.request<MultiBucketResponseState, ApiError>({
        path: `/buckets-replication`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  serviceAccounts = {
    /**
     * No description
     *
     * @tags ServiceAccount
     * @name ListUserServiceAccounts
     * @summary List User's Service Accounts
     * @request GET:/service-accounts
     * @secure
     */
    listUserServiceAccounts: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServiceAccounts, ApiError>({
        path: `/service-accounts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ServiceAccount
     * @name CreateServiceAccount
     * @summary Create Service Account
     * @request POST:/service-accounts
     * @secure
     */
    createServiceAccount: (
      body: ServiceAccountRequest,
      params: RequestParams = {},
    ) =>
      this.request<ServiceAccountCreds, ApiError>({
        path: `/service-accounts`,
        method: "POST",
        body: body,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ServiceAccount
     * @name DeleteMultipleServiceAccounts
     * @summary Delete Multiple Service Accounts
     * @request DELETE:/service-accounts/delete-multi
     * @secure
     */
    deleteMultipleServiceAccounts: (
      selectedSA: SelectedSAs,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/service-accounts/delete-multi`,
        method: "DELETE",
        body: selectedSA,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ServiceAccount
     * @name GetServiceAccount
     * @summary Get Service Account
     * @request GET:/service-accounts/{access_key}
     * @secure
     */
    getServiceAccount: (accessKey: string, params: RequestParams = {}) =>
      this.request<ServiceAccount, ApiError>({
        path: `/service-accounts/${encodeURIComponent(accessKey)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ServiceAccount
     * @name UpdateServiceAccount
     * @summary Set Service Account Policy
     * @request PUT:/service-accounts/{access_key}
     * @secure
     */
    updateServiceAccount: (
      accessKey: string,
      body: UpdateServiceAccountRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/service-accounts/${encodeURIComponent(accessKey)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ServiceAccount
     * @name DeleteServiceAccount
     * @summary Delete Service Account
     * @request DELETE:/service-accounts/{access_key}
     * @secure
     */
    deleteServiceAccount: (accessKey: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/service-accounts/${encodeURIComponent(accessKey)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  serviceAccountCredentials = {
    /**
     * No description
     *
     * @tags ServiceAccount
     * @name CreateServiceAccountCreds
     * @summary Create Service Account With Credentials
     * @request POST:/service-account-credentials
     * @secure
     */
    createServiceAccountCreds: (
      body: ServiceAccountRequestCreds,
      params: RequestParams = {},
    ) =>
      this.request<ServiceAccountCreds, ApiError>({
        path: `/service-account-credentials`,
        method: "POST",
        body: body,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags User
     * @name ListUsers
     * @summary List Users
     * @request GET:/users
     * @secure
     */
    listUsers: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListUsersResponse, ApiError>({
        path: `/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name AddUser
     * @summary Add User
     * @request POST:/users
     * @secure
     */
    addUser: (body: AddUserRequest, params: RequestParams = {}) =>
      this.request<User, ApiError>({
        path: `/users`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name CheckUserServiceAccounts
     * @summary Check number of service accounts for each user specified
     * @request POST:/users/service-accounts
     * @secure
     */
    checkUserServiceAccounts: (
      selectedUsers: SelectedUsers,
      params: RequestParams = {},
    ) =>
      this.request<UserServiceAccountSummary, ApiError>({
        path: `/users/service-accounts`,
        method: "POST",
        body: selectedUsers,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name GetUserInfo
     * @summary Get User Info
     * @request GET:/user/{name}
     * @secure
     */
    getUserInfo: (name: string, params: RequestParams = {}) =>
      this.request<User, ApiError>({
        path: `/user/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UpdateUserInfo
     * @summary Update User Info
     * @request PUT:/user/{name}
     * @secure
     */
    updateUserInfo: (
      name: string,
      body: UpdateUser,
      params: RequestParams = {},
    ) =>
      this.request<User, ApiError>({
        path: `/user/${encodeURIComponent(name)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name RemoveUser
     * @summary Remove user
     * @request DELETE:/user/{name}
     * @secure
     */
    removeUser: (name: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/user/${encodeURIComponent(name)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UpdateUserGroups
     * @summary Update Groups for a user
     * @request PUT:/user/{name}/groups
     * @secure
     */
    updateUserGroups: (
      name: string,
      body: UpdateUserGroups,
      params: RequestParams = {},
    ) =>
      this.request<User, ApiError>({
        path: `/user/${encodeURIComponent(name)}/groups`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policy
     * @name GetUserPolicy
     * @summary returns policies for logged in user
     * @request GET:/user/policy
     * @secure
     */
    getUserPolicy: (params: RequestParams = {}) =>
      this.request<IamEntity, ApiError>({
        path: `/user/policy`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policy
     * @name GetSaUserPolicy
     * @summary returns policies assigned for a specified user
     * @request GET:/user/{name}/policies
     * @secure
     */
    getSaUserPolicy: (name: string, params: RequestParams = {}) =>
      this.request<AUserPolicyResponse, ApiError>({
        path: `/user/${encodeURIComponent(name)}/policies`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name ListAUserServiceAccounts
     * @summary returns a list of service accounts for a user
     * @request GET:/user/{name}/service-accounts
     * @secure
     */
    listAUserServiceAccounts: (name: string, params: RequestParams = {}) =>
      this.request<ServiceAccounts, ApiError>({
        path: `/user/${encodeURIComponent(name)}/service-accounts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name CreateAUserServiceAccount
     * @summary Create Service Account for User
     * @request POST:/user/{name}/service-accounts
     * @secure
     */
    createAUserServiceAccount: (
      name: string,
      body: ServiceAccountRequest,
      params: RequestParams = {},
    ) =>
      this.request<ServiceAccountCreds, ApiError>({
        path: `/user/${encodeURIComponent(name)}/service-accounts`,
        method: "POST",
        body: body,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name CreateServiceAccountCredentials
     * @summary Create Service Account for User With Credentials
     * @request POST:/user/{name}/service-account-credentials
     * @secure
     */
    createServiceAccountCredentials: (
      name: string,
      body: ServiceAccountRequestCreds,
      params: RequestParams = {},
    ) =>
      this.request<ServiceAccountCreds, ApiError>({
        path: `/user/${encodeURIComponent(name)}/service-account-credentials`,
        method: "POST",
        body: body,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  usersGroupsBulk = {
    /**
     * No description
     *
     * @tags User
     * @name BulkUpdateUsersGroups
     * @summary Bulk functionality to Add Users to Groups
     * @request PUT:/users-groups-bulk
     * @secure
     */
    bulkUpdateUsersGroups: (body: BulkUserGroups, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/users-groups-bulk`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  groups = {
    /**
     * No description
     *
     * @tags Group
     * @name ListGroups
     * @summary List Groups
     * @request GET:/groups
     * @secure
     */
    listGroups: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListGroupsResponse, ApiError>({
        path: `/groups`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name AddGroup
     * @summary Add Group
     * @request POST:/groups
     * @secure
     */
    addGroup: (body: AddGroupRequest, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/groups`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  group = {
    /**
     * No description
     *
     * @tags Group
     * @name GroupInfo
     * @summary Group info
     * @request GET:/group/{name}
     * @secure
     */
    groupInfo: (name: string, params: RequestParams = {}) =>
      this.request<Group, ApiError>({
        path: `/group/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name RemoveGroup
     * @summary Remove group
     * @request DELETE:/group/{name}
     * @secure
     */
    removeGroup: (name: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/group/${encodeURIComponent(name)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name UpdateGroup
     * @summary Update Group Members or Status
     * @request PUT:/group/{name}
     * @secure
     */
    updateGroup: (
      name: string,
      body: UpdateGroupRequest,
      params: RequestParams = {},
    ) =>
      this.request<Group, ApiError>({
        path: `/group/${encodeURIComponent(name)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  policies = {
    /**
     * No description
     *
     * @tags Policy
     * @name ListPolicies
     * @summary List Policies
     * @request GET:/policies
     * @secure
     */
    listPolicies: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListPoliciesResponse, ApiError>({
        path: `/policies`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policy
     * @name AddPolicy
     * @summary Add Policy
     * @request POST:/policies
     * @secure
     */
    addPolicy: (body: AddPolicyRequest, params: RequestParams = {}) =>
      this.request<Policy, ApiError>({
        path: `/policies`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policy
     * @name ListUsersForPolicy
     * @summary List Users for a Policy
     * @request GET:/policies/{policy}/users
     * @secure
     */
    listUsersForPolicy: (policy: string, params: RequestParams = {}) =>
      this.request<SelectedUsers, ApiError>({
        path: `/policies/${encodeURIComponent(policy)}/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policy
     * @name ListGroupsForPolicy
     * @summary List Groups for a Policy
     * @request GET:/policies/{policy}/groups
     * @secure
     */
    listGroupsForPolicy: (policy: string, params: RequestParams = {}) =>
      this.request<SelectedUsers, ApiError>({
        path: `/policies/${encodeURIComponent(policy)}/groups`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  bucketPolicy = {
    /**
     * No description
     *
     * @tags Bucket
     * @name ListPoliciesWithBucket
     * @summary List Policies With Given Bucket
     * @request GET:/bucket-policy/{bucket}
     * @secure
     */
    listPoliciesWithBucket: (
      bucket: string,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListPoliciesResponse, ApiError>({
        path: `/bucket-policy/${encodeURIComponent(bucket)}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  bucket = {
    /**
     * No description
     *
     * @tags Bucket
     * @name SetAccessRuleWithBucket
     * @summary Add Access Rule To Given Bucket
     * @request PUT:/bucket/{bucket}/access-rules
     * @secure
     */
    setAccessRuleWithBucket: (
      bucket: string,
      prefixaccess: PrefixAccessPair,
      params: RequestParams = {},
    ) =>
      this.request<boolean, ApiError>({
        path: `/bucket/${encodeURIComponent(bucket)}/access-rules`,
        method: "PUT",
        body: prefixaccess,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name ListAccessRulesWithBucket
     * @summary List Access Rules With Given Bucket
     * @request GET:/bucket/{bucket}/access-rules
     * @secure
     */
    listAccessRulesWithBucket: (
      bucket: string,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListAccessRulesResponse, ApiError>({
        path: `/bucket/${encodeURIComponent(bucket)}/access-rules`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteAccessRuleWithBucket
     * @summary Delete Access Rule From Given Bucket
     * @request DELETE:/bucket/{bucket}/access-rules
     * @secure
     */
    deleteAccessRuleWithBucket: (
      bucket: string,
      prefix: PrefixWrapper,
      params: RequestParams = {},
    ) =>
      this.request<boolean, ApiError>({
        path: `/bucket/${encodeURIComponent(bucket)}/access-rules`,
        method: "DELETE",
        body: prefix,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  bucketUsers = {
    /**
     * No description
     *
     * @tags Bucket
     * @name ListUsersWithAccessToBucket
     * @summary List Users With Access to a Given Bucket
     * @request GET:/bucket-users/{bucket}
     * @secure
     */
    listUsersWithAccessToBucket: (
      bucket: string,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SelectedUsers, ApiError>({
        path: `/bucket-users/${encodeURIComponent(bucket)}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  policy = {
    /**
     * No description
     *
     * @tags Policy
     * @name PolicyInfo
     * @summary Policy info
     * @request GET:/policy/{name}
     * @secure
     */
    policyInfo: (name: string, params: RequestParams = {}) =>
      this.request<Policy, ApiError>({
        path: `/policy/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policy
     * @name RemovePolicy
     * @summary Remove policy
     * @request DELETE:/policy/{name}
     * @secure
     */
    removePolicy: (name: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/policy/${encodeURIComponent(name)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  configs = {
    /**
     * No description
     *
     * @tags Configuration
     * @name ListConfig
     * @summary List Configurations
     * @request GET:/configs
     * @secure
     */
    listConfig: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListConfigResponse, ApiError>({
        path: `/configs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigInfo
     * @summary Configuration info
     * @request GET:/configs/{name}
     * @secure
     */
    configInfo: (name: string, params: RequestParams = {}) =>
      this.request<Configuration[], ApiError>({
        path: `/configs/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name SetConfig
     * @summary Set Configuration
     * @request PUT:/configs/{name}
     * @secure
     */
    setConfig: (
      name: string,
      body: SetConfigRequest,
      params: RequestParams = {},
    ) =>
      this.request<SetConfigResponse, ApiError>({
        path: `/configs/${encodeURIComponent(name)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ResetConfig
     * @summary Configuration reset
     * @request POST:/configs/{name}/reset
     * @secure
     */
    resetConfig: (name: string, params: RequestParams = {}) =>
      this.request<SetConfigResponse, ApiError>({
        path: `/configs/${encodeURIComponent(name)}/reset`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ExportConfig
     * @summary Export the current config from MinIO server
     * @request GET:/configs/export
     * @secure
     */
    exportConfig: (params: RequestParams = {}) =>
      this.request<ConfigExportResponse, ApiError>({
        path: `/configs/export`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ImportCreate
     * @summary Uploads a file to import MinIO server config.
     * @request POST:/configs/import
     * @secure
     */
    importCreate: (
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/configs/import`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  setPolicy = {
    /**
     * No description
     *
     * @tags Policy
     * @name SetPolicy
     * @summary Set policy
     * @request PUT:/set-policy
     * @secure
     */
    setPolicy: (body: SetPolicyNameRequest, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/set-policy`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  setPolicyMulti = {
    /**
     * No description
     *
     * @tags Policy
     * @name SetPolicyMultiple
     * @summary Set policy to multiple users/groups
     * @request PUT:/set-policy-multi
     * @secure
     */
    setPolicyMultiple: (
      body: SetPolicyMultipleNameRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/set-policy-multi`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  service = {
    /**
     * No description
     *
     * @tags Service
     * @name RestartService
     * @summary Restart Service
     * @request POST:/service/restart
     * @secure
     */
    restartService: (params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/service/restart`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  profiling = {
    /**
     * No description
     *
     * @tags Profile
     * @name ProfilingStart
     * @summary Start recording profile data
     * @request POST:/profiling/start
     * @secure
     */
    profilingStart: (body: ProfilingStartRequest, params: RequestParams = {}) =>
      this.request<StartProfilingList, ApiError>({
        path: `/profiling/start`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profile
     * @name ProfilingStop
     * @summary Stop and download profile data
     * @request POST:/profiling/stop
     * @secure
     */
    profilingStop: (params: RequestParams = {}) =>
      this.request<File, ApiError>({
        path: `/profiling/stop`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  subnet = {
    /**
     * No description
     *
     * @tags Subnet
     * @name SubnetRegToken
     * @summary SUBNET registraton token
     * @request GET:/subnet/registration-token
     * @secure
     */
    subnetRegToken: (params: RequestParams = {}) =>
      this.request<SubnetRegTokenResponse, ApiError>({
        path: `/subnet/registration-token`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subnet
     * @name SubnetInfo
     * @summary Subnet info
     * @request GET:/subnet/info
     * @secure
     */
    subnetInfo: (params: RequestParams = {}) =>
      this.request<License, ApiError>({
        path: `/subnet/info`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subnet
     * @name SubnetApiKey
     * @summary Subnet api key
     * @request GET:/subnet/apikey
     * @secure
     */
    subnetApiKey: (
      query: {
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiKey, ApiError>({
        path: `/subnet/apikey`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subnet
     * @name SubnetRegister
     * @summary Register cluster with Subnet
     * @request POST:/subnet/register
     * @secure
     */
    subnetRegister: (body: SubnetRegisterRequest, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/subnet/register`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subnet
     * @name SubnetLogin
     * @summary Login to SUBNET
     * @request POST:/subnet/login
     * @secure
     */
    subnetLogin: (body: SubnetLoginRequest, params: RequestParams = {}) =>
      this.request<SubnetLoginResponse, ApiError>({
        path: `/subnet/login`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subnet
     * @name SubnetLoginMfa
     * @summary Login to SUBNET using mfa
     * @request POST:/subnet/login/mfa
     * @secure
     */
    subnetLoginMfa: (body: SubnetLoginMFARequest, params: RequestParams = {}) =>
      this.request<SubnetLoginResponse, ApiError>({
        path: `/subnet/login/mfa`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  admin = {
    /**
     * No description
     *
     * @tags System
     * @name AdminInfo
     * @summary Returns information about the deployment
     * @request GET:/admin/info
     * @secure
     */
    adminInfo: (
      query?: {
        /** @default false */
        defaultOnly?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminInfoResponse, ApiError>({
        path: `/admin/info`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags System
     * @name DashboardWidgetDetails
     * @summary Returns information about the deployment
     * @request GET:/admin/info/widgets/{widgetId}
     * @secure
     */
    dashboardWidgetDetails: (
      widgetId: number,
      query?: {
        start?: number;
        end?: number;
        /** @format int32 */
        step?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<WidgetDetails, ApiError>({
        path: `/admin/info/widgets/${encodeURIComponent(widgetId)}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags System
     * @name ArnList
     * @summary Returns a list of active ARNs in the instance
     * @request GET:/admin/arns
     * @secure
     */
    arnList: (params: RequestParams = {}) =>
      this.request<ArnsResponse, ApiError>({
        path: `/admin/arns`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name NotificationEndpointList
     * @summary Returns a list of active notification endpoints
     * @request GET:/admin/notification_endpoints
     * @secure
     */
    notificationEndpointList: (params: RequestParams = {}) =>
      this.request<NotifEndpointResponse, ApiError>({
        path: `/admin/notification_endpoints`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name AddNotificationEndpoint
     * @summary Allows to configure a new notification endpoint
     * @request POST:/admin/notification_endpoints
     * @secure
     */
    addNotificationEndpoint: (
      body: NotificationEndpoint,
      params: RequestParams = {},
    ) =>
      this.request<SetNotificationEndpointResponse, ApiError>({
        path: `/admin/notification_endpoints`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SiteReplication
     * @name GetSiteReplicationInfo
     * @summary Get list of Replication Sites
     * @request GET:/admin/site-replication
     * @secure
     */
    getSiteReplicationInfo: (params: RequestParams = {}) =>
      this.request<SiteReplicationInfoResponse, ApiError>({
        path: `/admin/site-replication`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SiteReplication
     * @name SiteReplicationInfoAdd
     * @summary Add a Replication Site
     * @request POST:/admin/site-replication
     * @secure
     */
    siteReplicationInfoAdd: (
      body: SiteReplicationAddRequest,
      params: RequestParams = {},
    ) =>
      this.request<SiteReplicationAddResponse, ApiError>({
        path: `/admin/site-replication`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SiteReplication
     * @name SiteReplicationEdit
     * @summary Edit a Replication Site
     * @request PUT:/admin/site-replication
     * @secure
     */
    siteReplicationEdit: (body: PeerInfo, params: RequestParams = {}) =>
      this.request<PeerSiteEditResponse, ApiError>({
        path: `/admin/site-replication`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SiteReplication
     * @name SiteReplicationRemove
     * @summary Remove a Replication Site
     * @request DELETE:/admin/site-replication
     * @secure
     */
    siteReplicationRemove: (body: PeerInfoRemove, params: RequestParams = {}) =>
      this.request<PeerSiteRemoveResponse, ApiError>({
        path: `/admin/site-replication`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SiteReplication
     * @name GetSiteReplicationStatus
     * @summary Display overall site replication status
     * @request GET:/admin/site-replication/status
     * @secure
     */
    getSiteReplicationStatus: (
      query?: {
        /**
         * Include Bucket stats
         * @default true
         */
        buckets?: boolean;
        /**
         * Include Group stats
         * @default true
         */
        groups?: boolean;
        /**
         * Include Policies stats
         * @default true
         */
        policies?: boolean;
        /**
         * Include Policies stats
         * @default true
         */
        users?: boolean;
        /** Entity Type to lookup */
        entityType?: string;
        /** Entity Value to lookup */
        entityValue?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SiteReplicationStatusResponse, ApiError>({
        path: `/admin/site-replication/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tiering
     * @name TiersList
     * @summary Returns a list of tiers for ilm
     * @request GET:/admin/tiers
     * @secure
     */
    tiersList: (params: RequestParams = {}) =>
      this.request<TierListResponse, ApiError>({
        path: `/admin/tiers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tiering
     * @name AddTier
     * @summary Allows to configure a new tier
     * @request POST:/admin/tiers
     * @secure
     */
    addTier: (body: Tier, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/admin/tiers`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tiering
     * @name TiersListNames
     * @summary Returns a list of tiers' names for ilm
     * @request GET:/admin/tiers/names
     * @secure
     */
    tiersListNames: (params: RequestParams = {}) =>
      this.request<TiersNameListResponse, ApiError>({
        path: `/admin/tiers/names`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tiering
     * @name GetTier
     * @summary Get Tier
     * @request GET:/admin/tiers/{type}/{name}
     * @secure
     */
    getTier: (
      type: "s3" | "gcs" | "azure" | "minio",
      name: string,
      params: RequestParams = {},
    ) =>
      this.request<Tier, ApiError>({
        path: `/admin/tiers/${encodeURIComponent(type)}/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tiering
     * @name EditTierCredentials
     * @summary Edit Tier Credentials
     * @request PUT:/admin/tiers/{type}/{name}/credentials
     * @secure
     */
    editTierCredentials: (
      type: "s3" | "gcs" | "azure" | "minio",
      name: string,
      body: TierCredentialsRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/admin/tiers/${encodeURIComponent(type)}/${encodeURIComponent(name)}/credentials`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tiering
     * @name RemoveTier
     * @summary Remove Tier
     * @request DELETE:/admin/tiers/{name}/remove
     * @secure
     */
    removeTier: (name: string, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/admin/tiers/${encodeURIComponent(name)}/remove`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Inspect
     * @name Inspect
     * @summary Inspect Files on Drive
     * @request GET:/admin/inspect
     * @secure
     */
    inspect: (
      query: {
        file: string;
        volume: string;
        encrypt?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, ApiError>({
        path: `/admin/inspect`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  nodes = {
    /**
     * No description
     *
     * @tags System
     * @name ListNodes
     * @summary Lists Nodes
     * @request GET:/nodes
     * @secure
     */
    listNodes: (params: RequestParams = {}) =>
      this.request<SelectedUsers, ApiError>({
        path: `/nodes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  remoteBuckets = {
    /**
     * No description
     *
     * @tags Bucket
     * @name ListRemoteBuckets
     * @summary List Remote Buckets
     * @request GET:/remote-buckets
     * @secure
     */
    listRemoteBuckets: (params: RequestParams = {}) =>
      this.request<ListRemoteBucketsResponse, ApiError>({
        path: `/remote-buckets`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name AddRemoteBucket
     * @summary Add Remote Bucket
     * @request POST:/remote-buckets
     * @secure
     */
    addRemoteBucket: (body: CreateRemoteBucket, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/remote-buckets`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name RemoteBucketDetails
     * @summary Remote Bucket Details
     * @request GET:/remote-buckets/{name}
     * @secure
     */
    remoteBucketDetails: (name: string, params: RequestParams = {}) =>
      this.request<RemoteBucket, ApiError>({
        path: `/remote-buckets/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bucket
     * @name DeleteRemoteBucket
     * @summary Delete Remote Bucket
     * @request DELETE:/remote-buckets/{source-bucket-name}/{arn}
     * @secure
     */
    deleteRemoteBucket: (
      sourceBucketName: string,
      arn: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ApiError>({
        path: `/remote-buckets/${encodeURIComponent(sourceBucketName)}/${encodeURIComponent(arn)}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  logs = {
    /**
     * No description
     *
     * @tags Logging
     * @name LogSearch
     * @summary Search the logs
     * @request GET:/logs/search
     * @secure
     */
    logSearch: (
      query?: {
        /** Filter Parameters */
        fp?: string[];
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /**
         * @format int32
         * @default 0
         */
        pageNo?: number;
        /** @default "timeDesc" */
        order?: "timeDesc" | "timeAsc";
        timeStart?: string;
        timeEnd?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LogSearchResponse, ApiError>({
        path: `/logs/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  kms = {
    /**
     * No description
     *
     * @tags KMS
     * @name KmsStatus
     * @summary KMS status
     * @request GET:/kms/status
     * @secure
     */
    kmsStatus: (params: RequestParams = {}) =>
      this.request<KmsStatusResponse, ApiError>({
        path: `/kms/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KMS
     * @name KmsMetrics
     * @summary KMS metrics
     * @request GET:/kms/metrics
     * @secure
     */
    kmsMetrics: (params: RequestParams = {}) =>
      this.request<KmsMetricsResponse, ApiError>({
        path: `/kms/metrics`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KMS
     * @name KmsapIs
     * @summary KMS apis
     * @request GET:/kms/apis
     * @secure
     */
    kmsapIs: (params: RequestParams = {}) =>
      this.request<KmsAPIsResponse, ApiError>({
        path: `/kms/apis`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KMS
     * @name KmsVersion
     * @summary KMS version
     * @request GET:/kms/version
     * @secure
     */
    kmsVersion: (params: RequestParams = {}) =>
      this.request<KmsVersionResponse, ApiError>({
        path: `/kms/version`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KMS
     * @name KmsCreateKey
     * @summary KMS create key
     * @request POST:/kms/keys
     * @secure
     */
    kmsCreateKey: (body: KmsCreateKeyRequest, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/kms/keys`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags KMS
     * @name KmsListKeys
     * @summary KMS list keys
     * @request GET:/kms/keys
     * @secure
     */
    kmsListKeys: (
      query?: {
        /** pattern to retrieve keys */
        pattern?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<KmsListKeysResponse, ApiError>({
        path: `/kms/keys`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KMS
     * @name KmsKeyStatus
     * @summary KMS key status
     * @request GET:/kms/keys/{name}
     * @secure
     */
    kmsKeyStatus: (name: string, params: RequestParams = {}) =>
      this.request<KmsKeyStatusResponse, ApiError>({
        path: `/kms/keys/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  idp = {
    /**
     * No description
     *
     * @tags idp
     * @name CreateConfiguration
     * @summary Create IDP Configuration
     * @request POST:/idp/{type}
     * @secure
     */
    createConfiguration: (
      type: string,
      body: IdpServerConfiguration,
      params: RequestParams = {},
    ) =>
      this.request<SetIDPResponse, ApiError>({
        path: `/idp/${encodeURIComponent(type)}`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags idp
     * @name ListConfigurations
     * @summary List IDP Configurations
     * @request GET:/idp/{type}
     * @secure
     */
    listConfigurations: (type: string, params: RequestParams = {}) =>
      this.request<IdpListConfigurationsResponse, ApiError>({
        path: `/idp/${encodeURIComponent(type)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags idp
     * @name GetConfiguration
     * @summary Get IDP Configuration
     * @request GET:/idp/{type}/{name}
     * @secure
     */
    getConfiguration: (
      name: string,
      type: string,
      params: RequestParams = {},
    ) =>
      this.request<IdpServerConfiguration, ApiError>({
        path: `/idp/${encodeURIComponent(type)}/${encodeURIComponent(name)}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags idp
     * @name DeleteConfiguration
     * @summary Delete IDP Configuration
     * @request DELETE:/idp/{type}/{name}
     * @secure
     */
    deleteConfiguration: (
      name: string,
      type: string,
      params: RequestParams = {},
    ) =>
      this.request<SetIDPResponse, ApiError>({
        path: `/idp/${encodeURIComponent(type)}/${encodeURIComponent(name)}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags idp
     * @name UpdateConfiguration
     * @summary Update IDP Configuration
     * @request PUT:/idp/{type}/{name}
     * @secure
     */
    updateConfiguration: (
      name: string,
      type: string,
      body: IdpServerConfiguration,
      params: RequestParams = {},
    ) =>
      this.request<SetIDPResponse, ApiError>({
        path: `/idp/${encodeURIComponent(type)}/${encodeURIComponent(name)}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  ldapEntities = {
    /**
     * No description
     *
     * @tags idp
     * @name GetLdapEntities
     * @summary Get LDAP Entities
     * @request POST:/ldap-entities
     * @secure
     */
    getLdapEntities: (body: LdapEntitiesRequest, params: RequestParams = {}) =>
      this.request<LdapEntities, ApiError>({
        path: `/ldap-entities`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  releases = {
    /**
     * No description
     *
     * @tags release
     * @name ListReleases
     * @summary Get repo releases for a given version
     * @request GET:/releases
     * @secure
     */
    listReleases: (
      query: {
        /** repo name */
        repo: string;
        /** Current Release */
        current?: string;
        /** search content */
        search?: string;
        /** filter releases */
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReleaseListResponse, ApiError>({
        path: `/releases`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  support = {
    /**
     * No description
     *
     * @tags Support
     * @name GetCallHomeOptionValue
     * @summary Get Callhome current status
     * @request GET:/support/callhome
     * @secure
     */
    getCallHomeOptionValue: (params: RequestParams = {}) =>
      this.request<CallHomeGetResponse, ApiError>({
        path: `/support/callhome`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Support
     * @name SetCallHomeStatus
     * @summary Sets callhome status
     * @request PUT:/support/callhome
     * @secure
     */
    setCallHomeStatus: (body: CallHomeSetStatus, params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/support/callhome`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  downloadSharedObject = {
    /**
     * No description
     *
     * @tags Public
     * @name DownloadSharedObject
     * @summary Downloads an object from a presigned url
     * @request GET:/download-shared-object/{url}
     */
    downloadSharedObject: (url: string, params: RequestParams = {}) =>
      this.request<File, ApiError>({
        path: `/download-shared-object/${encodeURIComponent(url)}`,
        method: "GET",
        ...params,
      }),
  };
}

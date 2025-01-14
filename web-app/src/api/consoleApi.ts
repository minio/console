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
  };
  license = {
    /**
     * No description
     *
     * @tags License
     * @name LicenseAcknowledge
     * @summary Acknowledge the license
     * @request GET:/license/acknowledge
     * @secure
     */
    licenseAcknowledge: (params: RequestParams = {}) =>
      this.request<void, ApiError>({
        path: `/license/acknowledge`,
        method: "GET",
        secure: true,
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

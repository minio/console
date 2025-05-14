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

/** @default "PRIVATE" */
export enum BucketAccess {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  CUSTOM = "CUSTOM",
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

export interface ListBucketsResponse {
  /** list of resulting buckets */
  buckets?: Bucket[];
  /**
   * number of buckets accessible to the user
   * @format int64
   */
  total?: number;
}

export enum ObjectRetentionUnit {
  Days = "days",
  Years = "years",
}

export enum ObjectRetentionMode {
  Governance = "governance",
  Compliance = "compliance",
}

export interface GetBucketRetentionConfig {
  mode?: ObjectRetentionMode;
  unit?: ObjectRetentionUnit;
  /** @format int32 */
  validity?: number;
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

export interface MakeBucketsResponse {
  bucketName?: string;
}

export interface BucketQuota {
  quota?: number;
  type?: "hard";
}

export interface LoginResponse {
  sessionId?: string;
  IDPRefreshToken?: string;
}

export interface LoginDetails {
  loginStrategy?: "form" | "service-account" | "redirect-service-account";
  redirectRules?: RedirectRule[];
  isK8S?: boolean;
  animatedLogin?: boolean;
}

export interface LoginRequest {
  accessKey?: string;
  secretKey?: string;
  sts?: string;
  features?: {
    hide_menu?: boolean;
  };
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

export interface PutObjectTagsRequest {
  tags?: any;
}

export interface DeleteFile {
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

export interface Metadata {
  objectMetadata?: Record<string, any>;
}

export interface PermissionResource {
  resource?: string;
  conditionOperator?: string;
  prefixes?: string[];
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

export interface MaxShareLinkExpResponse {
  /** @format int64 */
  exp: number;
}

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
      objectList: string[],
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
      this.request<string, ApiError>({
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

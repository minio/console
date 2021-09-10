# -*- coding: utf-8 -*-
# MinIO Python Library for Amazon S3 Compatible Cloud Storage, (C)
# 2015, 2016, 2017 MinIO, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# pylint: disable=too-many-lines,disable=too-many-branches,too-many-statements
# pylint: disable=too-many-arguments

"""
Simple Storage Service (aka S3) client to perform bucket and object operations.
"""

from __future__ import absolute_import

import itertools
import os
import platform
from datetime import timedelta
from threading import Thread
from urllib.parse import urlunsplit
from xml.etree import ElementTree as ET

import certifi
import urllib3
from urllib3._collections import HTTPHeaderDict

from . import __title__, __version__, time
from .commonconfig import COPY, REPLACE, ComposeSource, CopySource, Tags
from .credentials import StaticProvider
from .datatypes import (CompleteMultipartUploadResult, EventIterable,
                        ListAllMyBucketsResult, ListMultipartUploadsResult,
                        ListPartsResult, Object, Part, PostPolicy,
                        parse_copy_object, parse_list_objects)
from .deleteobjects import DeleteError, DeleteRequest, DeleteResult
from .error import InvalidResponseError, S3Error, ServerError
from .helpers import (MAX_MULTIPART_COUNT, MAX_MULTIPART_OBJECT_SIZE,
                      MAX_PART_SIZE, MIN_PART_SIZE, BaseURL, ObjectWriteResult,
                      ThreadPool, check_bucket_name, check_non_empty_string,
                      check_sse, check_ssec, genheaders, get_part_info,
                      headers_to_strings, is_valid_policy_type, makedirs,
                      md5sum_hash, read_part_data, sha256_hash)
from .legalhold import LegalHold
from .lifecycleconfig import LifecycleConfig
from .notificationconfig import NotificationConfig
from .objectlockconfig import ObjectLockConfig
from .replicationconfig import ReplicationConfig
from .retention import Retention
from .select import SelectObjectReader, SelectRequest
from .signer import presign_v4, sign_v4_s3
from .sse import SseCustomerKey
from .sseconfig import SSEConfig
from .tagging import Tagging
from .versioningconfig import VersioningConfig
from .xml import Element, SubElement, findtext, getbytes, marshal, unmarshal

_DEFAULT_USER_AGENT = "MinIO ({os}; {arch}) {lib}/{ver}".format(
    os=platform.system(), arch=platform.machine(),
    lib=__title__, ver=__version__,
)


class Minio:  # pylint: disable=too-many-public-methods
    """
    Simple Storage Service (aka S3) client to perform bucket and object
    operations.

    :param endpoint: Hostname of a S3 service.
    :param access_key: Access key (aka user ID) of your account in S3 service.
    :param secret_key: Secret Key (aka password) of your account in S3 service.
    :param session_token: Session token of your account in S3 service.
    :param secure: Flag to indicate to use secure (TLS) connection to S3
        service or not.
    :param region: Region name of buckets in S3 service.
    :param http_client: Customized HTTP client.
    :param credentials: Credentials provider of your account in S3 service.
    :return: :class:`Minio <Minio>` object

    Example::
        # Create client with anonymous access.
        client = Minio("play.min.io")

        # Create client with access and secret key.
        client = Minio("s3.amazonaws.com", "ACCESS-KEY", "SECRET-KEY")

        # Create client with access key and secret key with specific region.
        client = Minio(
            "play.minio.io:9000",
            access_key="Q3AM3UQ867SPQQA43P2F",
            secret_key="zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
            region="my-region",
        )

    **NOTE on concurrent usage:** `Minio` object is thread safe when using
    the Python `threading` library. Specifically, it is **NOT** safe to share
    it between multiple processes, for example when using
    `multiprocessing.Pool`. The solution is simply to create a new `Minio`
    object in each process, and not share it between processes.

    """

    # pylint: disable=too-many-function-args
    def __init__(self, endpoint, access_key=None,
                 secret_key=None,
                 session_token=None,
                 secure=True,
                 region=None,
                 http_client=None,
                 credentials=None):
        # Validate http client has correct base class.
        if http_client and not isinstance(
                http_client,
                urllib3.poolmanager.PoolManager):
            raise ValueError(
                "HTTP client should be instance of "
                "`urllib3.poolmanager.PoolManager`"
            )

        self._region_map = dict()
        self._base_url = BaseURL(
            ("https://" if secure else "http://") + endpoint,
            region,
        )
        self._user_agent = _DEFAULT_USER_AGENT
        self._trace_stream = None
        if access_key:
            credentials = StaticProvider(access_key, secret_key, session_token)
        self._provider = credentials

        # Load CA certificates from SSL_CERT_FILE file if set
        timeout = timedelta(minutes=5).seconds
        ca_certs = os.environ.get('SSL_CERT_FILE') or certifi.where()
        self._http = http_client or urllib3.PoolManager(
            timeout=urllib3.util.Timeout(connect=timeout, read=timeout),
            maxsize=10,
            cert_reqs='CERT_REQUIRED',
            ca_certs=ca_certs,
            retries=urllib3.Retry(
                total=5,
                backoff_factor=0.2,
                status_forcelist=[500, 502, 503, 504]
            )
        )

    def __del__(self):
        self._http.clear()

    def _handle_redirect_response(
            self, method, bucket_name, response, retry=False,
    ):
        """
        Handle redirect response indicates whether retry HEAD request
        on failure.
        """
        code, message = {
            301: ("PermanentRedirect", "Moved Permanently"),
            307: ("Redirect", "Temporary redirect"),
            400: ("BadRequest", "Bad request"),
        }.get(response.status, (None, None))
        region = response.getheader("x-amz-bucket-region")
        if message and region:
            message += "; use region " + region

        if (
                retry and region and method == "HEAD" and bucket_name and
                self._region_map.get(bucket_name)
        ):
            code, message = ("RetryHead", None)

        return code, message

    def _build_headers(self, host, headers, body, creds):
        """Build headers with given parameters."""
        headers = headers or {}
        md5sum_added = headers.get("Content-MD5")
        headers["Host"] = host
        headers["User-Agent"] = self._user_agent
        sha256 = None
        md5sum = None

        if body:
            headers["Content-Length"] = str(len(body))
        if creds:
            if self._base_url.is_https:
                sha256 = "UNSIGNED-PAYLOAD"
                md5sum = None if md5sum_added else md5sum_hash(body)
            else:
                sha256 = sha256_hash(body)
        else:
            md5sum = None if md5sum_added else md5sum_hash(body)
        if md5sum:
            headers["Content-MD5"] = md5sum
        if sha256:
            headers["x-amz-content-sha256"] = sha256
        if creds and creds.session_token:
            headers["X-Amz-Security-Token"] = creds.session_token
        date = time.utcnow()
        headers["x-amz-date"] = time.to_amz_date(date)
        return headers, date

    def _url_open(  # pylint: disable=too-many-branches
            self,
            method,
            region,
            bucket_name=None,
            object_name=None,
            body=None,
            headers=None,
            query_params=None,
            preload_content=True,
            no_body_trace=False,
    ):
        """Execute HTTP request."""
        creds = self._provider.retrieve() if self._provider else None
        url = self._base_url.build(
            method,
            region,
            bucket_name=bucket_name,
            object_name=object_name,
            query_params=query_params,
        )
        headers, date = self._build_headers(url.netloc, headers, body, creds)
        if creds:
            headers = sign_v4_s3(
                method,
                url,
                region,
                headers,
                creds,
                headers.get("x-amz-content-sha256"),
                date,
            )

        if self._trace_stream:
            self._trace_stream.write("---------START-HTTP---------\n")
            self._trace_stream.write(
                "{0} {1}{2}{3} HTTP/1.1\n".format(
                    method,
                    url.path,
                    "?" if url.query else "",
                    url.query or "",
                ),
            )
            self._trace_stream.write(
                headers_to_strings(headers, titled_key=True),
            )
            self._trace_stream.write("\n")
            if not no_body_trace and body is not None:
                self._trace_stream.write("\n")
                self._trace_stream.write(
                    body.decode() if isinstance(body, bytes) else str(body),
                )
                self._trace_stream.write("\n")
            self._trace_stream.write("\n")

        http_headers = HTTPHeaderDict()
        for key, value in (headers or {}).items():
            if isinstance(value, (list, tuple)):
                _ = [http_headers.add(key, val) for val in value]
            else:
                http_headers.add(key, value)

        response = self._http.urlopen(
            method,
            urlunsplit(url),
            body=body,
            headers=http_headers,
            preload_content=preload_content,
        )

        if self._trace_stream:
            self._trace_stream.write("HTTP/1.1 {0}\n".format(response.status))
            self._trace_stream.write(
                headers_to_strings(response.getheaders()),
            )
            self._trace_stream.write("\n")

        if response.status in [200, 204, 206]:
            if self._trace_stream:
                if preload_content:
                    self._trace_stream.write("\n")
                    self._trace_stream.write(response.data.decode())
                    self._trace_stream.write("\n")
                self._trace_stream.write("----------END-HTTP----------\n")
            return response

        response.read(cache_content=True)
        if not preload_content:
            response.release_conn()

        if self._trace_stream and method != "HEAD" and response.data:
            self._trace_stream.write(response.data.decode())
            self._trace_stream.write("\n")

        if (
                method != "HEAD" and
                "application/xml" not in response.getheader(
                    "content-type", "",
                ).split(";")
        ):
            if self._trace_stream:
                self._trace_stream.write("----------END-HTTP----------\n")
            raise InvalidResponseError(
                response.status,
                response.getheader("content-type"),
                response.data.decode() if response.data else None,
            )

        if not response.data and method != "HEAD":
            if self._trace_stream:
                self._trace_stream.write("----------END-HTTP----------\n")
            raise InvalidResponseError(
                response.status,
                response.getheader("content-type"),
                None,
            )

        response_error = S3Error.fromxml(response) if response.data else None

        if self._trace_stream:
            self._trace_stream.write("----------END-HTTP----------\n")

        error_map = {
            301: lambda: self._handle_redirect_response(
                method, bucket_name, response, True,
            ),
            307: lambda: self._handle_redirect_response(
                method, bucket_name, response, True,
            ),
            400: lambda: self._handle_redirect_response(
                method, bucket_name, response, True,
            ),
            403: lambda: ("AccessDenied", "Access denied"),
            404: lambda: (
                ("NoSuchKey", "Object does not exist")
                if object_name
                else ("NoSuchBucket", "Bucket does not exist")
                if bucket_name
                else ("ResourceNotFound", "Request resource not found")
            ),
            405: lambda: (
                "MethodNotAllowed",
                "The specified method is not allowed against this resource",
            ),
            409: lambda: (
                ("NoSuchBucket", "Bucket does not exist")
                if bucket_name
                else ("ResourceConflict", "Request resource conflicts"),
            ),
            501: lambda: (
                "MethodNotAllowed",
                "The specified method is not allowed against this resource",
            ),
        }

        if not response_error:
            func = error_map.get(response.status)
            code, message = func() if func else (None, None)
            if not code:
                raise ServerError(
                    "server failed with HTTP status code {}".format(
                        response.status,
                    ),
                )
            response_error = S3Error(
                code,
                message,
                url.path,
                response.getheader("x-amz-request-id"),
                response.getheader("x-amz-id-2"),
                response,
                bucket_name=bucket_name,
                object_name=object_name,
            )

        if response_error.code in ["NoSuchBucket", "RetryHead"]:
            self._region_map.pop(bucket_name, None)

        raise response_error

    def _execute(
            self,
            method,
            bucket_name=None,
            object_name=None,
            body=None,
            headers=None,
            query_params=None,
            preload_content=True,
            no_body_trace=False,
    ):
        """Execute HTTP request."""
        region = self._get_region(bucket_name, None)

        try:
            return self._url_open(
                method,
                region,
                bucket_name=bucket_name,
                object_name=object_name,
                body=body,
                headers=headers,
                query_params=query_params,
                preload_content=preload_content,
                no_body_trace=no_body_trace,
            )
        except S3Error as exc:
            if exc.code != "RetryHead":
                raise

        # Retry only once on RetryHead error.
        try:
            return self._url_open(
                method,
                region,
                bucket_name=bucket_name,
                object_name=object_name,
                body=body,
                headers=headers,
                query_params=query_params,
                preload_content=preload_content,
                no_body_trace=no_body_trace,
            )
        except S3Error as exc:
            if exc.code != "RetryHead":
                raise

            code, message = self._handle_redirect_response(
                method, bucket_name, exc.response,
            )
            raise exc.copy(code, message)

    def _get_region(self, bucket_name, region):
        """
        Return region of given bucket either from region cache or set in
        constructor.
        """

        if region:
            # Error out if region does not match with region passed via
            # constructor.
            if self._base_url.region and self._base_url.region != region:
                raise ValueError(
                    "region must be {0}, but passed {1}".format(
                        self._base_url.region, region,
                    ),
                )
            return region

        if self._base_url.region:
            return self._base_url.region

        if not bucket_name or not self._provider:
            return "us-east-1"

        region = self._region_map.get(bucket_name)
        if region:
            return region

        # Execute GetBucketLocation REST API to get region of the bucket.
        response = self._url_open(
            "GET",
            "us-east-1",
            bucket_name=bucket_name,
            query_params={"location": ""},
        )

        element = ET.fromstring(response.data.decode())
        if not element.text:
            region = "us-east-1"
        elif element.text == "EU":
            region = "eu-west-1"
        else:
            region = element.text

        self._region_map[bucket_name] = region
        return region

    def set_app_info(self, app_name, app_version):
        """
        Set your application name and version to user agent header.

        :param app_name: Application name.
        :param app_version: Application version.

        Example::
            client.set_app_info('my_app', '1.0.2')
        """
        if not (app_name and app_version):
            raise ValueError("Application name/version cannot be empty.")

        self._user_agent = "{0} {1}/{2}".format(
            _DEFAULT_USER_AGENT, app_name, app_version,
        )

    def trace_on(self, stream):
        """
        Enable http trace.

        :param stream: Stream for writing HTTP call tracing.
        """
        if not stream:
            raise ValueError('Input stream for trace output is invalid.')
        # Save new output stream.
        self._trace_stream = stream

    def trace_off(self):
        """
        Disable HTTP trace.
        """
        self._trace_stream = None

    def enable_accelerate_endpoint(self):
        """Enables accelerate endpoint for Amazon S3 endpoint."""
        self._base_url.accelerate_host_flag = True

    def disable_accelerate_endpoint(self):
        """Disables accelerate endpoint for Amazon S3 endpoint."""
        self._base_url.accelerate_host_flag = False

    def enable_dualstack_endpoint(self):
        """Enables dualstack endpoint for Amazon S3 endpoint."""
        self._base_url.dualstack_host_flag = True

    def disable_dualstack_endpoint(self):
        """Disables dualstack endpoint for Amazon S3 endpoint."""
        self._base_url.dualstack_host_flag = False

    def enable_virtual_style_endpoint(self):
        """Enables virtual style endpoint."""
        self._base_url.virtual_style_flag = True

    def disable_virtual_style_endpoint(self):
        """Disables virtual style endpoint."""
        self._base_url.virtual_style_flag = False

    def select_object_content(self, bucket_name, object_name, request):
        """
        Select content of an object by SQL expression.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param request: :class:`SelectRequest <SelectRequest>` object.
        :return: A reader contains requested records and progress information.

        Example::
            with client.select_object_content(
                    "my-bucket",
                    "my-object.csv",
                    SelectRequest(
                        "select * from S3Object",
                        CSVInputSerialization(),
                        CSVOutputSerialization(),
                        request_progress=True,
                    ),
            ) as result:
                for data in result.stream():
                    print(data.decode())
                print(result.stats())
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        if not isinstance(request, SelectRequest):
            raise ValueError("request must be SelectRequest type")
        body = marshal(request)
        response = self._execute(
            "POST",
            bucket_name=bucket_name,
            object_name=object_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"select": "", "select-type": "2"},
            preload_content=False,
        )
        return SelectObjectReader(response)

    def make_bucket(self, bucket_name, location=None, object_lock=False):
        """
        Create a bucket with region and object lock.

        :param bucket_name: Name of the bucket.
        :param location: Region in which the bucket will be created.
        :param object_lock: Flag to set object-lock feature.

        Examples::
            # Create bucket.
            client.make_bucket("my-bucket")

            # Create bucket on specific region.
            client.make_bucket("my-bucket", "us-west-1")

            # Create bucket with object-lock feature on specific region.
            client.make_bucket("my-bucket", "eu-west-2", object_lock=True)
        """
        check_bucket_name(bucket_name, True)
        if self._base_url.region:
            # Error out if region does not match with region passed via
            # constructor.
            if location and self._base_url.region != location:
                raise ValueError(
                    "region must be {0}, but passed {1}".format(
                        self._base_url.region, location,
                    ),
                )
        location = self._base_url.region or location or "us-east-1"
        headers = (
            {"x-amz-bucket-object-lock-enabled": "true"}
            if object_lock else None
        )

        body = None
        if location != "us-east-1":
            element = Element("CreateBucketConfiguration")
            SubElement(element, "LocationConstraint", location)
            body = getbytes(element)
        self._url_open(
            "PUT",
            location,
            bucket_name=bucket_name,
            body=body,
            headers=headers,
        )
        self._region_map[bucket_name] = location

    def list_buckets(self):
        """
        List information of all accessible buckets.

        :return: List of :class:`Bucket <Bucket>` object.

        Example::
            buckets = client.list_buckets()
            for bucket in buckets:
                print(bucket.name, bucket.creation_date)
        """

        response = self._execute("GET")
        result = unmarshal(ListAllMyBucketsResult, response.data.decode())
        return result.buckets

    def bucket_exists(self, bucket_name):
        """
        Check if a bucket exists.

        :param bucket_name: Name of the bucket.
        :return: True if the bucket exists.

        Example::
            if client.bucket_exists("my-bucket"):
                print("my-bucket exists")
            else:
                print("my-bucket does not exist")
        """
        check_bucket_name(bucket_name)
        try:
            self._execute("HEAD", bucket_name)
            return True
        except S3Error as exc:
            if exc.code != "NoSuchBucket":
                raise
        return False

    def remove_bucket(self, bucket_name):
        """
        Remove an empty bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.remove_bucket("my-bucket")
        """
        check_bucket_name(bucket_name)
        self._execute("DELETE", bucket_name)
        self._region_map.pop(bucket_name, None)

    def get_bucket_policy(self, bucket_name):
        """
        Get bucket policy configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: Bucket policy configuration as JSON string.

        Example::
            policy = client.get_bucket_policy("my-bucket")
        """
        check_bucket_name(bucket_name)
        response = self._execute(
            "GET", bucket_name, query_params={"policy": ""},
        )
        return response.data.decode()

    def delete_bucket_policy(self, bucket_name):
        """
        Delete bucket policy configuration of a bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_bucket_policy("my-bucket")
        """
        check_bucket_name(bucket_name)
        self._execute("DELETE", bucket_name, query_params={"policy": ""})

    def set_bucket_policy(self, bucket_name, policy):
        """
        Set bucket policy configuration to a bucket.

        :param bucket_name: Name of the bucket.
        :param policy: Bucket policy configuration as JSON string.

        Example::
            client.set_bucket_policy("my-bucket", policy)
        """
        check_bucket_name(bucket_name)
        is_valid_policy_type(policy)
        self._execute(
            "PUT",
            bucket_name,
            body=policy,
            headers={"Content-MD5": md5sum_hash(policy)},
            query_params={"policy": ""},
        )

    def get_bucket_notification(self, bucket_name):
        """
        Get notification configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`NotificationConfig <NotificationConfig>` object.

        Example::
            config = client.get_bucket_notification("my-bucket")
        """
        check_bucket_name(bucket_name)
        response = self._execute(
            "GET", bucket_name, query_params={"notification": ""},
        )
        return unmarshal(NotificationConfig, response.data.decode())

    def set_bucket_notification(self, bucket_name, config):
        """
        Set notification configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :param config: class:`NotificationConfig <NotificationConfig>` object.

        Example::
            config = NotificationConfig(
                queue_config_list=[
                    QueueConfig(
                        "QUEUE-ARN-OF-THIS-BUCKET",
                        ["s3:ObjectCreated:*"],
                        config_id="1",
                        prefix_filter_rule=PrefixFilterRule("abc"),
                    ),
                ],
            )
            client.set_bucket_notification("my-bucket", config)
        """
        check_bucket_name(bucket_name)
        if not isinstance(config, NotificationConfig):
            raise ValueError("config must be NotificationConfig type")
        body = marshal(config)
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"notification": ""},
        )

    def delete_bucket_notification(self, bucket_name):
        """
        Delete notification configuration of a bucket. On success, S3 service
        stops notification of events previously set of the bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_bucket_notification("my-bucket")
        """
        self.set_bucket_notification(bucket_name, NotificationConfig())

    def set_bucket_encryption(self, bucket_name, config):
        """
        Set encryption configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :param config: :class:`SSEConfig <SSEConfig>` object.

        Example::
            client.set_bucket_encryption(
                "my-bucket", SSEConfig(Rule.new_sse_s3_rule()),
            )
        """
        check_bucket_name(bucket_name)
        if not isinstance(config, SSEConfig):
            raise ValueError("config must be SSEConfig type")
        body = marshal(config)
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"encryption": ""},
        )

    def get_bucket_encryption(self, bucket_name):
        """
        Get encryption configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`SSEConfig <SSEConfig>` object.

        Example::
            config = client.get_bucket_encryption("my-bucket")
        """
        check_bucket_name(bucket_name)
        try:
            response = self._execute(
                "GET",
                bucket_name,
                query_params={"encryption": ""},
            )
            return unmarshal(SSEConfig, response.data.decode())
        except S3Error as exc:
            if exc.code != "ServerSideEncryptionConfigurationNotFoundError":
                raise
        return None

    def delete_bucket_encryption(self, bucket_name):
        """
        Delete encryption configuration of a bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_bucket_encryption("my-bucket")
        """
        check_bucket_name(bucket_name)
        try:
            self._execute(
                "DELETE",
                bucket_name,
                query_params={"encryption": ""},
            )
        except S3Error as exc:
            if exc.code != "ServerSideEncryptionConfigurationNotFoundError":
                raise

    def listen_bucket_notification(self, bucket_name, prefix='', suffix='',
                                   events=('s3:ObjectCreated:*',
                                           's3:ObjectRemoved:*',
                                           's3:ObjectAccessed:*')):
        """
        Listen events of object prefix and suffix of a bucket. Caller should
        iterate returned iterator to read new events.

        :param bucket_name: Name of the bucket.
        :param prefix: Listen events of object starts with prefix.
        :param suffix: Listen events of object ends with suffix.
        :param events: Events to listen.
        :return: Iterator of event records as :dict:.

        Example::
            with client.listen_bucket_notification(
                "my-bucket",
                prefix="my-prefix/",
                events=["s3:ObjectCreated:*", "s3:ObjectRemoved:*"],
            ) as events:
                for event in events:
                    print(event)
        """
        check_bucket_name(bucket_name)
        if self._base_url.is_aws_host:
            raise ValueError(
                "ListenBucketNotification API is not supported in Amazon S3",
            )

        return EventIterable(
            lambda: self._execute(
                "GET",
                bucket_name,
                query_params={
                    "prefix": prefix or "",
                    "suffix": suffix or "",
                    "events": events,
                },
                preload_content=False,
            ),
        )

    def set_bucket_versioning(self, bucket_name, config):
        """
        Set versioning configuration to a bucket.

        :param bucket_name: Name of the bucket.
        :param config: :class:`VersioningConfig <VersioningConfig>`.

        Example::
            client.set_bucket_versioning(
                "my-bucket", VersioningConfig(ENABLED),
            )
        """
        check_bucket_name(bucket_name)
        if not isinstance(config, VersioningConfig):
            raise ValueError("config must be VersioningConfig type")
        body = marshal(config)
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"versioning": ""},
        )

    def get_bucket_versioning(self, bucket_name):
        """
        Get versioning configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`VersioningConfig <VersioningConfig>`.

        Example::
            config = client.get_bucket_versioning("my-bucket")
            print(config.status)
        """
        check_bucket_name(bucket_name)
        response = self._execute(
            "GET",
            bucket_name,
            query_params={"versioning": ""},
        )
        return unmarshal(VersioningConfig, response.data.decode())

    def fput_object(self, bucket_name, object_name, file_path,
                    content_type="application/octet-stream",
                    metadata=None, sse=None, progress=None,
                    part_size=0, num_parallel_uploads=3,
                    tags=None, retention=None, legal_hold=False):
        """
        Uploads data from a file to an object in a bucket.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param file_path: Name of file to upload.
        :param content_type: Content type of the object.
        :param metadata: Any additional metadata to be uploaded along
            with your PUT request.
        :param sse: Server-side encryption.
        :param progress: A progress object
        :param part_size: Multipart part size
        :param num_parallel_uploads: Number of parallel uploads.
        :param tags: :class:`Tags` for the object.
        :param retention: :class:`Retention` configuration object.
        :param legal_hold: Flag to set legal hold for the object.
        :return: :class:`ObjectWriteResult` object.

        Example::
            # Upload data.
            result = client.fput_object(
                "my-bucket", "my-object", "my-filename",
            )

            # Upload data with metadata.
            result = client.fput_object(
                "my-bucket", "my-object", "my-filename",
                metadata={"My-Project": "one"},
            )

            # Upload data with tags, retention and legal-hold.
            date = datetime.utcnow().replace(
                hour=0, minute=0, second=0, microsecond=0,
            ) + timedelta(days=30)
            tags = Tags(for_object=True)
            tags["User"] = "jsmith"
            result = client.fput_object(
                "my-bucket", "my-object", "my-filename",
                tags=tags,
                retention=Retention(GOVERNANCE, date),
                legal_hold=True,
            )
        """

        file_size = os.stat(file_path).st_size
        with open(file_path, "rb") as file_data:
            return self.put_object(
                bucket_name, object_name, file_data, file_size,
                content_type=content_type,
                metadata=metadata, sse=sse, progress=progress,
                part_size=part_size, num_parallel_uploads=num_parallel_uploads,
                tags=tags, retention=retention, legal_hold=legal_hold,
            )

    def fget_object(self, bucket_name, object_name, file_path,
                    request_headers=None, ssec=None, version_id=None,
                    extra_query_params=None, tmp_file_path=None):
        """
        Downloads data of an object to file.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param file_path: Name of file to download.
        :param request_headers: Any additional headers to be added with GET
                                request.
        :param ssec: Server-side encryption customer key.
        :param version_id: Version-ID of the object.
        :param extra_query_params: Extra query parameters for advanced usage.
        :param tmp_file_path: Path to a temporary file.
        :return: Object information.

        Example::
            # Download data of an object.
            client.fget_object("my-bucket", "my-object", "my-filename")

            # Download data of an object of version-ID.
            client.fget_object(
                "my-bucket", "my-object", "my-filename",
                version_id="dfbd25b3-abec-4184-a4e8-5a35a5c1174d",
            )

            # Download data of an SSE-C encrypted object.
            client.fget_object(
                "my-bucket", "my-object", "my-filename",
                ssec=SseCustomerKey(b"32byteslongsecretkeymustprovided"),
            )
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)

        if os.path.isdir(file_path):
            raise ValueError("file {0} is a directory".format(file_path))

        # Create top level directory if needed.
        makedirs(os.path.dirname(file_path))

        stat = self.stat_object(
            bucket_name,
            object_name,
            ssec,
            version_id=version_id,
        )

        # Write to a temporary file "file_path.part.minio" before saving.
        tmp_file_path = (
            tmp_file_path or file_path + "." + stat.etag + ".part.minio"
        )
        try:
            tmp_file_stat = os.stat(tmp_file_path)
        except IOError:
            tmp_file_stat = None  # Ignore this error.
        offset = tmp_file_stat.st_size if tmp_file_stat else 0
        if offset > stat.size:
            os.remove(tmp_file_path)
            offset = 0

        response = None
        try:
            response = self.get_object(
                bucket_name,
                object_name,
                offset=offset,
                request_headers=request_headers,
                ssec=ssec,
                version_id=version_id,
                extra_query_params=extra_query_params,
            )
            with open(tmp_file_path, "ab") as tmp_file:
                for data in response.stream(amt=1024*1024):
                    tmp_file.write(data)
            if os.path.exists(file_path):
                os.remove(file_path)  # For windows compatibility.
            os.rename(tmp_file_path, file_path)
            return stat
        finally:
            if response:
                response.close()
                response.release_conn()

    def get_object(self, bucket_name, object_name, offset=0, length=0,
                   request_headers=None, ssec=None, version_id=None,
                   extra_query_params=None):
        """
        Get data of an object. Returned response should be closed after use to
        release network resources. To reuse the connection, it's required to
        call `response.release_conn()` explicitly.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param offset: Start byte position of object data.
        :param length: Number of bytes of object data from offset.
        :param request_headers: Any additional headers to be added with GET
                                request.
        :param ssec: Server-side encryption customer key.
        :param version_id: Version-ID of the object.
        :param extra_query_params: Extra query parameters for advanced usage.
        :return: :class:`urllib3.response.HTTPResponse` object.

        Example::
            # Get data of an object.
            try:
                response = client.get_object("my-bucket", "my-object")
                # Read data from response.
            finally:
                response.close()
                response.release_conn()

            # Get data of an object of version-ID.
            try:
                response = client.get_object(
                    "my-bucket", "my-object",
                    version_id="dfbd25b3-abec-4184-a4e8-5a35a5c1174d",
                )
                # Read data from response.
            finally:
                response.close()
                response.release_conn()

            # Get data of an object from offset and length.
            try:
                response = client.get_object(
                    "my-bucket", "my-object", offset=512, length=1024,
                )
                # Read data from response.
            finally:
                response.close()
                response.release_conn()

            # Get data of an SSE-C encrypted object.
            try:
                response = client.get_object(
                    "my-bucket", "my-object",
                    ssec=SseCustomerKey(b"32byteslongsecretkeymustprovided"),
                )
                # Read data from response.
            finally:
                response.close()
                response.release_conn()
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        check_ssec(ssec)

        headers = ssec.headers() if ssec else {}
        headers.update(request_headers or {})

        if offset or length:
            headers['Range'] = 'bytes={}-{}'.format(
                offset, offset + length - 1 if length else "")

        if version_id:
            extra_query_params = extra_query_params or {}
            extra_query_params["versionId"] = version_id

        return self._execute(
            "GET",
            bucket_name,
            object_name,
            headers=headers,
            query_params=extra_query_params,
            preload_content=False,
        )

    def copy_object(self, bucket_name, object_name, source,
                    sse=None, metadata=None, tags=None, retention=None,
                    legal_hold=False, metadata_directive=None,
                    tagging_directive=None):
        """
        Create an object by server-side copying data from another object.
        In this API maximum supported source object size is 5GiB.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param source: :class:`CopySource` object.
        :param sse: Server-side encryption of destination object.
        :param metadata: Any user-defined metadata to be copied along with
                         destination object.
        :param tags: Tags for destination object.
        :param retention: :class:`Retention` configuration object.
        :param legal_hold: Flag to set legal hold for destination object.
        :param metadata_directive: Directive used to handle user metadata for
                                   destination object.
        :param tagging_directive: Directive used to handle tags for destination
                                   object.
        :return: :class:`ObjectWriteResult <ObjectWriteResult>` object.

        Example::
            # copy an object from a bucket to another.
            result = client.copy_object(
                "my-bucket",
                "my-object",
                CopySource("my-sourcebucket", "my-sourceobject"),
            )
            print(result.object_name, result.version_id)

            # copy an object with condition.
            result = client.copy_object(
                "my-bucket",
                "my-object",
                CopySource(
                    "my-sourcebucket",
                    "my-sourceobject",
                    modified_since=datetime(2014, 4, 1, tzinfo=timezone.utc),
                ),
            )
            print(result.object_name, result.version_id)

            # copy an object from a bucket with replacing metadata.
            metadata = {"test_meta_key": "test_meta_value"}
            result = client.copy_object(
                "my-bucket",
                "my-object",
                CopySource("my-sourcebucket", "my-sourceobject"),
                metadata=metadata,
                metadata_directive=REPLACE,
            )
            print(result.object_name, result.version_id)
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        if not isinstance(source, CopySource):
            raise ValueError("source must be CopySource type")
        check_sse(sse)
        if tags is not None and not isinstance(tags, Tags):
            raise ValueError("tags must be Tags type")
        if retention is not None and not isinstance(retention, Retention):
            raise ValueError("retention must be Retention type")
        if (
                metadata_directive is not None and
                metadata_directive not in [COPY, REPLACE]
        ):
            raise ValueError(
                "metadata directive must be {0} or {1}".format(COPY, REPLACE),
            )
        if (
                tagging_directive is not None and
                tagging_directive not in [COPY, REPLACE]
        ):
            raise ValueError(
                "tagging directive must be {0} or {1}".format(COPY, REPLACE),
            )

        size = -1
        if source.offset is None and source.length is None:
            stat = self.stat_object(
                source.bucket_name,
                source.object_name,
                version_id=source.version_id,
                ssec=source.ssec,
            )
            size = stat.size

        if (
                source.offset is not None or
                source.length is not None or
                size > MAX_PART_SIZE
        ):
            if metadata_directive == COPY:
                raise ValueError(
                    "COPY metadata directive is not applicable to source "
                    "object size greater than 5 GiB",
                )
            if tagging_directive == COPY:
                raise ValueError(
                    "COPY tagging directive is not applicable to source "
                    "object size greater than 5 GiB"
                )
            return self.compose_object(
                bucket_name, object_name, ComposeSource.of(source),
                sse=sse, metadata=metadata, tags=tags, retention=retention,
                legal_hold=legal_hold,
            )

        headers = genheaders(metadata, sse, tags, retention, legal_hold)
        if metadata_directive:
            headers["x-amz-metadata-directive"] = metadata_directive
        if tagging_directive:
            headers["x-amz-tagging-directive"] = tagging_directive
        headers.update(source.gen_copy_headers())
        response = self._execute(
            "PUT",
            bucket_name,
            object_name=object_name,
            headers=headers,
        )
        etag, last_modified = parse_copy_object(response)
        return ObjectWriteResult(
            bucket_name,
            object_name,
            response.getheader("x-amz-version-id"),
            etag,
            response.getheaders(),
            last_modified=last_modified,
        )

    def _calc_part_count(self, sources):
        """Calculate part count."""
        object_size = 0
        part_count = 0
        i = 0
        for src in sources:
            i += 1
            stat = self.stat_object(
                src.bucket_name,
                src.object_name,
                version_id=src.version_id,
                ssec=src.ssec,
            )
            src.build_headers(stat.size, stat.etag)
            size = stat.size
            if src.length is not None:
                size = src.length
            elif src.offset is not None:
                size -= src.offset

            if (
                    size < MIN_PART_SIZE and
                    len(sources) != 1 and
                    i != len(sources)
            ):
                raise ValueError(
                    "source {0}/{1}: size {2} must be greater than {3}".format(
                        src.bucket_name, src.object_name, size, MIN_PART_SIZE,
                    ),
                )

            object_size += size
            if object_size > MAX_MULTIPART_OBJECT_SIZE:
                raise ValueError(
                    "destination object size must be less than {0}".format(
                        MAX_MULTIPART_OBJECT_SIZE,
                    ),
                )

            if size > MAX_PART_SIZE:
                count = int(size / MAX_PART_SIZE)
                last_part_size = size - (count * MAX_PART_SIZE)
                if last_part_size > 0:
                    count += 1
                else:
                    last_part_size = MAX_PART_SIZE
                if (
                        last_part_size < MIN_PART_SIZE and
                        len(sources) != 1 and
                        i != len(sources)
                ):
                    raise ValueError(
                        (
                            "source {0}/{1}: for multipart split upload of "
                            "{2}, last part size is less than {3}"
                        ).format(
                            src.bucket_name, src.object_name, size,
                            MIN_PART_SIZE,
                        ),
                    )
                part_count += count
            else:
                part_count += 1

        if part_count > MAX_MULTIPART_COUNT:
            raise ValueError(
                (
                    "Compose sources create more than allowed multipart "
                    "count {0}"
                ).format(MAX_MULTIPART_COUNT),
            )
        return part_count

    def _upload_part_copy(self, bucket_name, object_name, upload_id,
                          part_number, headers):
        """Execute UploadPartCopy S3 API."""
        query_params = {
            "partNumber": str(part_number),
            "uploadId": upload_id,
        }
        response = self._execute(
            "PUT",
            bucket_name,
            object_name,
            headers=headers,
            query_params=query_params,
        )
        return parse_copy_object(response)

    def compose_object(  # pylint: disable=too-many-branches
            self, bucket_name, object_name, sources,
            sse=None, metadata=None, tags=None, retention=None,
            legal_hold=False,
    ):
        """
        Create an object by combining data from different source objects using
        server-side copy.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param sources: List of :class:`ComposeSource` object.
        :param sse: Server-side encryption of destination object.
        :param metadata: Any user-defined metadata to be copied along with
                         destination object.
        :param tags: Tags for destination object.
        :param retention: :class:`Retention` configuration object.
        :param legal_hold: Flag to set legal hold for destination object.
        :return: :class:`ObjectWriteResult <ObjectWriteResult>` object.

        Example::
            sources = [
                ComposeSource("my-job-bucket", "my-object-part-one"),
                ComposeSource("my-job-bucket", "my-object-part-two"),
                ComposeSource("my-job-bucket", "my-object-part-three"),
            ]

            # Create my-bucket/my-object by combining source object
            # list.
            result = client.compose_object("my-bucket", "my-object", sources)
            print(result.object_name, result.version_id)

            # Create my-bucket/my-object with user metadata by combining
            # source object list.
            result = client.compose_object(
                "my-bucket",
                "my-object",
                sources,
                metadata={"test_meta_key": "test_meta_value"},
            )
            print(result.object_name, result.version_id)

            # Create my-bucket/my-object with user metadata and
            # server-side encryption by combining source object list.
            client.compose_object(
                "my-bucket", "my-object", sources, sse=SseS3(),
            )
            print(result.object_name, result.version_id)
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        if not isinstance(sources, (list, tuple)) or not sources:
            raise ValueError("sources must be non-empty list or tuple type")
        i = 0
        for src in sources:
            if not isinstance(src, ComposeSource):
                raise ValueError(
                    "sources[{0}] must be ComposeSource type".format(i),
                )
            i += 1
        check_sse(sse)
        if tags is not None and not isinstance(tags, Tags):
            raise ValueError("tags must be Tags type")
        if retention is not None and not isinstance(retention, Retention):
            raise ValueError("retention must be Retention type")

        part_count = self._calc_part_count(sources)
        if (
                part_count == 1 and
                sources[0].offset is None and
                sources[0].length is None
        ):
            return self.copy_object(
                bucket_name, object_name, CopySource.of(sources[0]),
                sse=sse, metadata=metadata, tags=tags, retention=retention,
                legal_hold=legal_hold,
                metadata_directive=REPLACE if metadata else None,
                tagging_directive=REPLACE if tags else None,
            )

        headers = genheaders(metadata, sse, tags, retention, legal_hold)
        upload_id = self._create_multipart_upload(
            bucket_name, object_name, headers,
        )
        ssec_headers = sse.headers() if isinstance(sse, SseCustomerKey) else {}
        try:
            part_number = 0
            total_parts = []
            for src in sources:
                size = src.object_size
                if src.length is not None:
                    size = src.length
                elif src.offset is not None:
                    size -= src.offset
                offset = src.offset or 0
                headers = src.headers
                headers.update(ssec_headers)
                if size <= MAX_PART_SIZE:
                    part_number += 1
                    if src.length is not None:
                        headers["x-amz-copy-source-range"] = (
                            "bytes={0}-{1}".format(offset, offset+src.length-1)
                        )
                    elif src.offset is not None:
                        headers["x-amz-copy-source-range"] = (
                            "bytes={0}-{1}".format(offset, offset+size-1)
                        )
                    etag, _ = self._upload_part_copy(
                        bucket_name,
                        object_name,
                        upload_id,
                        part_number,
                        headers,
                    )
                    total_parts.append(Part(part_number, etag))
                    continue
                while size > 0:
                    part_number += 1
                    start_bytes = offset
                    end_bytes = start_bytes + MAX_PART_SIZE
                    if size < MAX_PART_SIZE:
                        end_bytes = start_bytes + size
                    headers_copy = headers.copy()
                    headers_copy["x-amz-copy-source-range"] = (
                        "bytes={0}-{1}".format(start_bytes, end_bytes)
                    )
                    etag, _ = self._upload_part_copy(
                        bucket_name,
                        object_name,
                        upload_id,
                        part_number,
                        headers_copy,
                    )
                    total_parts.append(Part(part_number, etag))
                    offset = start_bytes
                    size -= end_bytes - start_bytes
            result = self._complete_multipart_upload(
                bucket_name, object_name, upload_id, total_parts,
            )
            return ObjectWriteResult(
                result.bucket_name,
                result.object_name,
                result.version_id,
                result.etag,
                result.http_headers,
                location=result.location,
            )
        except Exception as exc:
            if upload_id:
                self._abort_multipart_upload(
                    bucket_name, object_name, upload_id,
                )
            raise exc

    def _abort_multipart_upload(self, bucket_name, object_name, upload_id):
        """Execute AbortMultipartUpload S3 API."""
        self._execute(
            "DELETE",
            bucket_name,
            object_name,
            query_params={'uploadId': upload_id},
        )

    def _complete_multipart_upload(
            self, bucket_name, object_name, upload_id, parts,
    ):
        """Execute CompleteMultipartUpload S3 API."""
        element = Element("CompleteMultipartUpload")
        for part in parts:
            tag = SubElement(element, "Part")
            SubElement(tag, "PartNumber", str(part.part_number))
            SubElement(tag, "ETag", '"' + part.etag + '"')
        body = getbytes(element)
        response = self._execute(
            "POST",
            bucket_name,
            object_name,
            body=body,
            headers={
                "Content-Type": 'application/xml',
                "Content-MD5": md5sum_hash(body),
            },
            query_params={'uploadId': upload_id},
        )
        return CompleteMultipartUploadResult(response)

    def _create_multipart_upload(self, bucket_name, object_name, headers):
        """Execute CreateMultipartUpload S3 API."""
        if not headers.get("Content-Type"):
            headers["Content-Type"] = "application/octet-stream"
        response = self._execute(
            "POST",
            bucket_name,
            object_name,
            headers=headers,
            query_params={"uploads": ""},
        )
        element = ET.fromstring(response.data.decode())
        return findtext(element, "UploadId")

    def _put_object(self, bucket_name, object_name, data, headers,
                    query_params=None):
        """Execute PutObject S3 API."""
        response = self._execute(
            "PUT",
            bucket_name,
            object_name,
            body=data,
            headers=headers,
            query_params=query_params,
            no_body_trace=True,
        )
        return ObjectWriteResult(
            bucket_name,
            object_name,
            response.getheader("x-amz-version-id"),
            response.getheader("etag").replace('"', ""),
            response.getheaders(),
        )

    def _upload_part(self, bucket_name, object_name, data, headers,
                     upload_id, part_number):
        """Execute UploadPart S3 API."""
        query_params = {
            "partNumber": str(part_number),
            "uploadId": upload_id,
        }
        result = self._put_object(
            bucket_name, object_name, data, headers, query_params=query_params,
        )
        return result.etag

    def _upload_part_task(self, args):
        """Upload_part task for ThreadPool."""
        return args[5], self._upload_part(*args)

    def put_object(self, bucket_name, object_name, data, length,
                   content_type="application/octet-stream",
                   metadata=None, sse=None, progress=None,
                   part_size=0, num_parallel_uploads=3,
                   tags=None, retention=None, legal_hold=False):
        """
        Uploads data from a stream to an object in a bucket.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param data: An object having callable read() returning bytes object.
        :param length: Data size; -1 for unknown size and set valid part_size.
        :param content_type: Content type of the object.
        :param metadata: Any additional metadata to be uploaded along
            with your PUT request.
        :param sse: Server-side encryption.
        :param progress: A progress object;
        :param part_size: Multipart part size.
        :param num_parallel_uploads: Number of parallel uploads.
        :param tags: :class:`Tags` for the object.
        :param retention: :class:`Retention` configuration object.
        :param legal_hold: Flag to set legal hold for the object.
        :return: :class:`ObjectWriteResult` object.

        Example::
            # Upload data.
            result = client.put_object(
                "my-bucket", "my-object", io.BytesIO(b"hello"), 5,
            )

            # Upload data with metadata.
            result = client.put_object(
                "my-bucket", "my-object", io.BytesIO(b"hello"), 5,
                metadata={"My-Project": "one"},
            )

            # Upload data with tags, retention and legal-hold.
            date = datetime.utcnow().replace(
                hour=0, minute=0, second=0, microsecond=0,
            ) + timedelta(days=30)
            tags = Tags(for_object=True)
            tags["User"] = "jsmith"
            result = client.put_object(
                "my-bucket", "my-object", io.BytesIO(b"hello"), 5,
                tags=tags,
                retention=Retention(GOVERNANCE, date),
                legal_hold=True,
            )
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        check_sse(sse)
        if tags is not None and not isinstance(tags, Tags):
            raise ValueError("tags must be Tags type")
        if retention is not None and not isinstance(retention, Retention):
            raise ValueError("retention must be Retention type")
        if not callable(getattr(data, "read")):
            raise ValueError("input data must have callable read()")
        part_size, part_count = get_part_info(length, part_size)
        if progress:
            if not isinstance(progress, Thread):
                raise TypeError("progress object must be instance of Thread")
            # Set progress bar length and object name before upload
            progress.set_meta(object_name=object_name, total_length=length)

        headers = genheaders(metadata, sse, tags, retention, legal_hold)
        headers["Content-Type"] = content_type or "application/octet-stream"

        object_size = length
        uploaded_size = 0
        part_number = 0
        one_byte = b""
        stop = False
        upload_id = None
        parts = []
        pool = None

        try:
            while not stop:
                part_number += 1
                if part_count > 0:
                    if part_number == part_count:
                        part_size = object_size - uploaded_size
                        stop = True
                    part_data = read_part_data(
                        data, part_size, progress=progress,
                    )
                    if len(part_data) != part_size:
                        raise IOError(
                            (
                                "stream having not enough data;"
                                "expected: {0}, got: {1} bytes"
                            ).format(part_size, len(part_data))
                        )
                else:
                    part_data = read_part_data(
                        data, part_size + 1, one_byte, progress=progress,
                    )
                    # If part_data_size is less or equal to part_size,
                    # then we have reached last part.
                    if len(part_data) <= part_size:
                        part_count = part_number
                        stop = True
                    else:
                        one_byte = part_data[-1:]
                        part_data = part_data[:-1]

                uploaded_size += len(part_data)

                if part_count == 1:
                    return self._put_object(
                        bucket_name, object_name, part_data, headers,
                    )

                if not upload_id:
                    upload_id = self._create_multipart_upload(
                        bucket_name, object_name, headers,
                    )
                    if num_parallel_uploads and num_parallel_uploads > 1:
                        pool = ThreadPool(num_parallel_uploads)
                        pool.start_parallel()

                args = (
                    bucket_name, object_name, part_data,
                    sse.headers() if isinstance(sse, SseCustomerKey) else None,
                    upload_id, part_number,
                )
                if num_parallel_uploads > 1:
                    pool.add_task(self._upload_part_task, args)
                else:
                    etag = self._upload_part(*args)
                    parts.append(Part(part_number, etag))

            if pool:
                result = pool.result()
                parts = [None] * part_count
                while not result.empty():
                    part_number, etag = result.get()
                    parts[part_number-1] = Part(part_number, etag)

            result = self._complete_multipart_upload(
                bucket_name, object_name, upload_id, parts,
            )
            return ObjectWriteResult(
                result.bucket_name,
                result.object_name,
                result.version_id,
                result.etag,
                result.http_headers,
                location=result.location,
            )
        except Exception as exc:
            if upload_id:
                self._abort_multipart_upload(
                    bucket_name, object_name, upload_id,
                )
            raise exc

    def list_objects(self, bucket_name, prefix=None, recursive=False,
                     start_after=None, include_user_meta=False,
                     include_version=False, use_api_v1=False,
                     use_url_encoding_type=True):
        """
        Lists object information of a bucket.

        :param bucket_name: Name of the bucket.
        :param prefix: Object name starts with prefix.
        :param recursive: List recursively than directory structure emulation.
        :param start_after: List objects after this key name.
        :param include_user_meta: MinIO specific flag to control to include
                                 user metadata.
        :param include_version: Flag to control whether include object
                                versions.
        :param use_api_v1: Flag to control to use ListObjectV1 S3 API or not.
        :param use_url_encoding_type: Flag to control whether URL encoding type
                                      to be used or not.
        :return: Iterator of :class:`Object <Object>`.

        Example::
            # List objects information.
            objects = client.list_objects("my-bucket")
            for obj in objects:
                print(obj)

            # List objects information whose names starts with "my/prefix/".
            objects = client.list_objects("my-bucket", prefix="my/prefix/")
            for obj in objects:
                print(obj)

            # List objects information recursively.
            objects = client.list_objects("my-bucket", recursive=True)
            for obj in objects:
                print(obj)

            # List objects information recursively whose names starts with
            # "my/prefix/".
            objects = client.list_objects(
                "my-bucket", prefix="my/prefix/", recursive=True,
            )
            for obj in objects:
                print(obj)

            # List objects information recursively after object name
            # "my/prefix/world/1".
            objects = client.list_objects(
                "my-bucket", recursive=True, start_after="my/prefix/world/1",
            )
            for obj in objects:
                print(obj)
        """
        return self._list_objects(
            bucket_name,
            delimiter=None if recursive else "/",
            include_user_meta=include_user_meta,
            prefix=prefix,
            start_after=start_after,
            use_api_v1=use_api_v1,
            include_version=include_version,
            encoding_type="url" if use_url_encoding_type else None,
        )

    def stat_object(self, bucket_name, object_name, ssec=None, version_id=None,
                    extra_query_params=None):
        """
        Get object information and metadata of an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param ssec: Server-side encryption customer key.
        :param version_id: Version ID of the object.
        :param extra_query_params: Extra query parameters for advanced usage.
        :return: :class:`Object <Object>`.

        Example::
            # Get object information.
            result = client.stat_object("my-bucket", "my-object")

            # Get object information of version-ID.
            result = client.stat_object(
                "my-bucket", "my-object",
                version_id="dfbd25b3-abec-4184-a4e8-5a35a5c1174d",
            )

            # Get SSE-C encrypted object information.
            result = client.stat_object(
                "my-bucket", "my-object",
                ssec=SseCustomerKey(b"32byteslongsecretkeymustprovided"),
            )
        """

        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        check_ssec(ssec)

        headers = ssec.headers() if ssec else {}
        query_params = extra_query_params or {}
        query_params.update({"versionId": version_id} if version_id else {})
        response = self._execute(
            "HEAD",
            bucket_name,
            object_name,
            headers=headers,
            query_params=query_params,
        )

        last_modified = response.getheader("last-modified")
        if last_modified:
            last_modified = time.from_http_header(last_modified)

        return Object(
            bucket_name,
            object_name,
            last_modified=last_modified,
            etag=response.getheader("etag", "").replace('"', ""),
            size=int(response.getheader("content-length", "0")),
            content_type=response.getheader("content-type"),
            metadata=response.headers,
            version_id=response.getheader("x-amz-version-id"),
        )

    def remove_object(self, bucket_name, object_name, version_id=None):
        """
        Remove an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the object.

        Example::
            # Remove object.
            client.remove_object("my-bucket", "my-object")

            # Remove version of an object.
            client.remove_object(
                "my-bucket", "my-object",
                version_id="dfbd25b3-abec-4184-a4e8-5a35a5c1174d",
            )
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        self._execute(
            "DELETE",
            bucket_name,
            object_name,
            query_params={"versionId": version_id} if version_id else None,
        )

    def _delete_objects(self, bucket_name, delete_object_list,
                        quiet=False, bypass_governance_mode=False):
        """
        Delete multiple objects.

        :param bucket_name: Name of the bucket.
        :param delete_object_list: List of maximum 1000
            :class:`DeleteObject <DeleteObject>` object.
        :param quiet: quiet flag.
        :param bypass_governance_mode: Bypass Governance retention mode.
        :return: :class:`DeleteResult <DeleteResult>` object.
        """
        body = marshal(DeleteRequest(delete_object_list, quiet=quiet))
        headers = {"Content-MD5": md5sum_hash(body)}
        if bypass_governance_mode:
            headers["x-amz-bypass-governance-retention"] = "true"
        response = self._execute(
            "POST",
            bucket_name,
            body=body,
            headers=headers,
            query_params={"delete": ""},
        )

        element = ET.fromstring(response.data.decode())
        return (
            DeleteResult([], [DeleteError.fromxml(element)])
            if element.tag.endswith("Error")
            else unmarshal(DeleteResult, response.data.decode())
        )

    def remove_objects(self, bucket_name, delete_object_list,
                       bypass_governance_mode=False):
        """
        Remove multiple objects.

        :param bucket_name: Name of the bucket.
        :param delete_object_list: An iterable containing
            :class:`DeleteObject <DeleteObject>` object.
        :param bypass_governance_mode: Bypass Governance retention mode.
        :return: An iterator containing :class:`DeleteError <DeleteError>`
            object.

        Example::
            # Remove list of objects.
            errors = client.remove_objects(
                "my-bucket",
                [
                    DeleteObject("my-object1"),
                    DeleteObject("my-object2"),
                    DeleteObject(
                        "my-object3", "13f88b18-8dcd-4c83-88f2-8631fdb6250c",
                    ),
                ],
            )
            for error in errors:
                print("error occured when deleting object", error)

            # Remove a prefix recursively.
            delete_object_list = map(
                lambda x: DeleteObject(x.object_name),
                client.list_objects("my-bucket", "my/prefix/", recursive=True),
            )
            errors = client.remove_objects("my-bucket", delete_object_list)
            for error in errors:
                print("error occured when deleting object", error)
        """
        check_bucket_name(bucket_name)

        # turn list like objects into an iterator.
        delete_object_list = itertools.chain(delete_object_list)

        while True:
            # get 1000 entries or whatever available.
            objects = [
                delete_object for _, delete_object in zip(
                    range(1000), delete_object_list,
                )
            ]

            if not objects:
                break

            result = self._delete_objects(
                bucket_name,
                objects,
                quiet=True,
                bypass_governance_mode=bypass_governance_mode,
            )

            for error in result.error_list:
                # AWS S3 returns "NoSuchVersion" error when
                # version doesn't exist ignore this error
                # yield all errors otherwise
                if error.code != "NoSuchVersion":
                    yield error

    def get_presigned_url(self, method, bucket_name, object_name,
                          expires=timedelta(days=7), response_headers=None,
                          request_date=None, version_id=None,
                          extra_query_params=None):
        """
        Get presigned URL of an object for HTTP method, expiry time and custom
        request parameters.

        :param method: HTTP method.
        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param expires: Expiry in seconds; defaults to 7 days.
        :param response_headers: Optional response_headers argument to
                                 specify response fields like date, size,
                                 type of file, data about server, etc.
        :param request_date: Optional request_date argument to
                             specify a different request date. Default is
                             current date.
        :param version_id: Version ID of the object.
        :param extra_query_params: Extra query parameters for advanced usage.
        :return: URL string.

        Example::
            # Get presigned URL string to delete 'my-object' in
            # 'my-bucket' with one day expiry.
            url = client.get_presigned_url(
                "DELETE",
                "my-bucket",
                "my-object",
                expires=timedelta(days=1),
            )
            print(url)
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        if expires.total_seconds() < 1 or expires.total_seconds() > 604800:
            raise ValueError("expires must be between 1 second to 7 days")

        region = self._get_region(bucket_name, None)
        query_params = extra_query_params or {}
        query_params.update({"versionId": version_id} if version_id else {})
        query_params.update(response_headers or {})
        creds = self._provider.retrieve() if self._provider else None
        if creds and creds.session_token:
            query_params["X-Amz-Security-Token"] = creds.session_token
        url = self._base_url.build(
            method,
            region,
            bucket_name=bucket_name,
            object_name=object_name,
            query_params=query_params,
        )

        if creds:
            url = presign_v4(
                method,
                url,
                region,
                creds,
                request_date or time.utcnow(),
                int(expires.total_seconds()),
            )
        return urlunsplit(url)

    def presigned_get_object(self, bucket_name, object_name,
                             expires=timedelta(days=7),
                             response_headers=None,
                             request_date=None,
                             version_id=None,
                             extra_query_params=None):
        """
        Get presigned URL of an object to download its data with expiry time
        and custom request parameters.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param expires: Expiry in seconds; defaults to 7 days.
        :param response_headers: Optional response_headers argument to
                                  specify response fields like date, size,
                                  type of file, data about server, etc.
        :param request_date: Optional request_date argument to
                              specify a different request date. Default is
                              current date.
        :param version_id: Version ID of the object.
        :param extra_query_params: Extra query parameters for advanced usage.
        :return: URL string.

        Example::
            # Get presigned URL string to download 'my-object' in
            # 'my-bucket' with default expiry (i.e. 7 days).
            url = client.presigned_get_object("my-bucket", "my-object")
            print(url)

            # Get presigned URL string to download 'my-object' in
            # 'my-bucket' with two hours expiry.
            url = client.presigned_get_object(
                "my-bucket", "my-object", expires=timedelta(hours=2),
            )
            print(url)
        """
        return self.get_presigned_url(
            "GET",
            bucket_name,
            object_name,
            expires,
            response_headers=response_headers,
            request_date=request_date,
            version_id=version_id,
            extra_query_params=extra_query_params,
        )

    def presigned_put_object(self, bucket_name, object_name,
                             expires=timedelta(days=7)):
        """
        Get presigned URL of an object to upload data with expiry time and
        custom request parameters.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param expires: Expiry in seconds; defaults to 7 days.
        :return: URL string.

        Example::
            # Get presigned URL string to upload data to 'my-object' in
            # 'my-bucket' with default expiry (i.e. 7 days).
            url = client.presigned_put_object("my-bucket", "my-object")
            print(url)

            # Get presigned URL string to upload data to 'my-object' in
            # 'my-bucket' with two hours expiry.
            url = client.presigned_put_object(
                "my-bucket", "my-object", expires=timedelta(hours=2),
            )
            print(url)
        """
        return self.get_presigned_url(
            "PUT", bucket_name, object_name, expires,
        )

    def presigned_post_policy(self, policy):
        """
        Get form-data of PostPolicy of an object to upload its data using POST
        method.

        :param policy: :class:`PostPolicy <PostPolicy>`.
        :return: :dict: contains form-data.

        Example::
            policy = PostPolicy(
                "my-bucket", datetime.utcnow() + timedelta(days=10),
            )
            policy.add_starts_with_condition("key", "my/object/prefix/")
            policy.add_content_length_range_condition(
                1*1024*1024, 10*1024*1024,
            )
            form_data = client.presigned_post_policy(policy)
        """
        if not isinstance(policy, PostPolicy):
            raise ValueError("policy must be PostPolicy type")
        if not self._provider:
            raise ValueError(
                "anonymous access does not require presigned post form-data",
            )
        return policy.form_data(
            self._provider.retrieve(),
            self._get_region(policy.bucket_name, None),
        )

    def delete_bucket_replication(self, bucket_name):
        """
        Delete replication configuration of a bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_bucket_replication("my-bucket")
        """
        check_bucket_name(bucket_name)
        self._execute("DELETE", bucket_name, query_params={"replication": ""})

    def get_bucket_replication(self, bucket_name):
        """
        Get bucket replication configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`ReplicationConfig <ReplicationConfig>` object.

        Example::
            config = client.get_bucket_replication("my-bucket")
        """
        check_bucket_name(bucket_name)
        try:
            response = self._execute(
                "GET", bucket_name, query_params={"replication": ""},
            )
            return unmarshal(ReplicationConfig, response.data.decode())
        except S3Error as exc:
            if exc.code != "ReplicationConfigurationNotFoundError":
                raise
        return None

    def set_bucket_replication(self, bucket_name, config):
        """
        Set bucket replication configuration to a bucket.

        :param bucket_name: Name of the bucket.
        :param config: :class:`ReplicationConfig <ReplicationConfig>` object.

        Example::
            config = ReplicationConfig(
                "REPLACE-WITH-ACTUAL-ROLE",
                [
                    Rule(
                        Destination(
                            "REPLACE-WITH-ACTUAL-DESTINATION-BUCKET-ARN",
                        ),
                        ENABLED,
                        delete_marker_replication=DeleteMarkerReplication(
                            DISABLED,
                        ),
                        rule_filter=Filter(
                            AndOperator(
                                "TaxDocs",
                                {"key1": "value1", "key2": "value2"},
                            ),
                        ),
                        rule_id="rule1",
                        priority=1,
                    ),
                ],
            )
            client.set_bucket_replication("my-bucket", config)
        """
        check_bucket_name(bucket_name)
        if not isinstance(config, ReplicationConfig):
            raise ValueError("config must be ReplicationConfig type")
        body = marshal(config)
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"replication": ""},
        )

    def delete_bucket_lifecycle(self, bucket_name):
        """
        Delete notification configuration of a bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_bucket_lifecycle("my-bucket")
        """
        check_bucket_name(bucket_name)
        self._execute("DELETE", bucket_name, query_params={"lifecycle": ""})

    def get_bucket_lifecycle(self, bucket_name):
        """
        Get bucket lifecycle configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`LifecycleConfig <LifecycleConfig>` object.

        Example::
            config = client.get_bucket_lifecycle("my-bucket")
        """
        check_bucket_name(bucket_name)
        try:
            response = self._execute(
                "GET", bucket_name, query_params={"lifecycle": ""},
            )
            return unmarshal(LifecycleConfig, response.data.decode())
        except S3Error as exc:
            if exc.code != "NoSuchLifecycleConfiguration":
                raise
        return None

    def set_bucket_lifecycle(self, bucket_name, config):
        """
        Set bucket lifecycle configuration to a bucket.

        :param bucket_name: Name of the bucket.
        :param config: :class:`LifecycleConfig <LifecycleConfig>` object.

        Example::
            config = LifecycleConfig(
                [
                    Rule(
                        ENABLED,
                        rule_filter=Filter(prefix="documents/"),
                        rule_id="rule1",
                        transition=Transition(
                            days=30, storage_class="GLACIER",
                        ),
                    ),
                    Rule(
                        ENABLED,
                        rule_filter=Filter(prefix="logs/"),
                        rule_id="rule2",
                        expiration=Expiration(days=365),
                    ),
                ],
            )
            client.set_bucket_lifecycle("my-bucket", config)
        """
        check_bucket_name(bucket_name)
        if not isinstance(config, LifecycleConfig):
            raise ValueError("config must be LifecycleConfig type")
        body = marshal(config)
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"lifecycle": ""},
        )

    def delete_bucket_tags(self, bucket_name):
        """
        Delete tags configuration of a bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_bucket_tags("my-bucket")
        """
        check_bucket_name(bucket_name)
        self._execute("DELETE", bucket_name, query_params={"tagging": ""})

    def get_bucket_tags(self, bucket_name):
        """
        Get tags configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`Tags <Tags>` object.

        Example::
            tags = client.get_bucket_tags("my-bucket")
        """
        check_bucket_name(bucket_name)
        try:
            response = self._execute(
                "GET", bucket_name, query_params={"tagging": ""},
            )
            tagging = unmarshal(Tagging, response.data.decode())
            return tagging.tags
        except S3Error as exc:
            if exc.code != "NoSuchTagSet":
                raise
        return None

    def set_bucket_tags(self, bucket_name, tags):
        """
        Set tags configuration to a bucket.

        :param bucket_name: Name of the bucket.
        :param tags: :class:`Tags <Tags>` object.

        Example::
            tags = Tags.new_bucket_tags()
            tags["Project"] = "Project One"
            tags["User"] = "jsmith"
            client.set_bucket_tags("my-bucket", tags)
        """
        check_bucket_name(bucket_name)
        if not isinstance(tags, Tags):
            raise ValueError("tags must be Tags type")
        body = marshal(Tagging(tags))
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"tagging": ""},
        )

    def delete_object_tags(self, bucket_name, object_name, version_id=None):
        """
        Delete tags configuration of an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the Object.

        Example::
            client.delete_object_tags("my-bucket", "my-object")
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        query_params = {"versionId": version_id} if version_id else {}
        query_params["tagging"] = ""
        self._execute(
            "DELETE",
            bucket_name,
            object_name=object_name,
            query_params=query_params,
        )

    def get_object_tags(self, bucket_name, object_name, version_id=None):
        """
        Get tags configuration of a object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the Object.
        :return: :class:`Tags <Tags>` object.

        Example::
            tags = client.get_object_tags("my-bucket", "my-object")
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        query_params = {"versionId": version_id} if version_id else {}
        query_params["tagging"] = ""
        try:
            response = self._execute(
                "GET",
                bucket_name,
                object_name=object_name,
                query_params=query_params,
            )
            tagging = unmarshal(Tagging, response.data.decode())
            return tagging.tags
        except S3Error as exc:
            if exc.code != "NoSuchTagSet":
                raise
        return None

    def set_object_tags(self, bucket_name, object_name, tags, version_id=None):
        """
        Set tags configuration to an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the Object.
        :param tags: :class:`Tags <Tags>` object.

        Example::
            tags = Tags.new_object_tags()
            tags["Project"] = "Project One"
            tags["User"] = "jsmith"
            client.set_object_tags("my-bucket", "my-object", tags)
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        if not isinstance(tags, Tags):
            raise ValueError("tags must be Tags type")
        body = marshal(Tagging(tags))
        query_params = {"versionId": version_id} if version_id else {}
        query_params["tagging"] = ""
        self._execute(
            "PUT",
            bucket_name,
            object_name=object_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params=query_params,
        )

    def enable_object_legal_hold(
            self, bucket_name, object_name, version_id=None,
    ):
        """
        Enable legal hold on an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the object.

        Example::
            client.enable_object_legal_hold("my-bucket", "my-object")
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        body = marshal(LegalHold(True))
        query_params = {"versionId", version_id} if version_id else {}
        query_params["legal-hold"] = ""
        self._execute(
            "PUT",
            bucket_name,
            object_name=object_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params=query_params,
        )

    def disable_object_legal_hold(
            self, bucket_name, object_name, version_id=None,
    ):
        """
        Disable legal hold on an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the object.

        Example::
            client.disable_object_legal_hold("my-bucket", "my-object")
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        body = marshal(LegalHold(False))
        query_params = {"versionId", version_id} if version_id else {}
        query_params["legal-hold"] = ""
        self._execute(
            "PUT",
            bucket_name,
            object_name=object_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params=query_params,
        )

    def is_object_legal_hold_enabled(
            self, bucket_name, object_name, version_id=None,
    ):
        """
        Returns true if legal hold is enabled on an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the object.

        Example::
            if client.is_object_legal_hold_enabled("my-bucket", "my-object"):
                print("legal hold is enabled on my-object")
            else:
                print("legal hold is not enabled on my-object")
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        query_params = {"versionId", version_id} if version_id else {}
        query_params["legal-hold"] = ""
        try:
            response = self._execute(
                "GET",
                bucket_name,
                object_name=object_name,
                query_params=query_params,
            )
            legal_hold = unmarshal(LegalHold, response.data.decode())
            return legal_hold.status
        except S3Error as exc:
            if exc.code != "NoSuchObjectLockConfiguration":
                raise
        return False

    def delete_object_lock_config(self, bucket_name):
        """
        Delete object-lock configuration of a bucket.

        :param bucket_name: Name of the bucket.

        Example::
            client.delete_object_lock_config("my-bucket")
        """
        self.set_object_lock_config(
            bucket_name, ObjectLockConfig(None, None, None)
        )

    def get_object_lock_config(self, bucket_name):
        """
        Get object-lock configuration of a bucket.

        :param bucket_name: Name of the bucket.
        :return: :class:`ObjectLockConfig <ObjectLockConfig>` object.

        Example::
            config = client.get_object_lock_config("my-bucket")
        """
        check_bucket_name(bucket_name)
        response = self._execute(
            "GET", bucket_name, query_params={"object-lock": ""},
        )
        return unmarshal(ObjectLockConfig, response.data.decode())

    def set_object_lock_config(self, bucket_name, config):
        """
        Set object-lock configuration to a bucket.

        :param bucket_name: Name of the bucket.
        :param config: :class:`ObjectLockConfig <ObjectLockConfig>` object.

        Example::
            config = ObjectLockConfig(GOVERNANCE, 15, DAYS)
            client.set_object_lock_condig("my-bucket", config)
        """
        check_bucket_name(bucket_name)
        if not isinstance(config, ObjectLockConfig):
            raise ValueError("config must be ObjectLockConfig type")
        body = marshal(config)
        self._execute(
            "PUT",
            bucket_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params={"object-lock": ""},
        )

    def get_object_retention(
            self, bucket_name, object_name, version_id=None,
    ):
        """
        Get retention configuration of an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the object.
        :return: :class:`Retention <Retention>` object.

        Example::
            config = client.get_object_retention("my-bucket", "my-object")
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        query_params = {"versionId", version_id} if version_id else {}
        query_params["retention"] = ""
        try:
            response = self._execute(
                "GET",
                bucket_name,
                object_name=object_name,
                query_params=query_params,
            )
            return unmarshal(Retention, response.data.decode())
        except S3Error as exc:
            if exc.code != "NoSuchObjectLockConfiguration":
                raise
        return None

    def set_object_retention(
            self, bucket_name, object_name, config, version_id=None,
    ):
        """
        Set retention configuration on an object.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param version_id: Version ID of the object.
        :param config: :class:`Retention <Retention>` object.

        Example::
            config = Retention(
                GOVERNANCE, datetime.utcnow() + timedelta(days=10),
            )
            client.set_object_retention("my-bucket", "my-object", config)
        """
        check_bucket_name(bucket_name)
        check_non_empty_string(object_name)
        if not isinstance(config, Retention):
            raise ValueError("config must be Retention type")
        body = marshal(config)
        query_params = {"versionId", version_id} if version_id else {}
        query_params["retention"] = ""
        self._execute(
            "PUT",
            bucket_name,
            object_name=object_name,
            body=body,
            headers={"Content-MD5": md5sum_hash(body)},
            query_params=query_params,
        )

    def _list_objects(  # pylint: disable=too-many-arguments,too-many-branches
            self,
            bucket_name,
            continuation_token=None,  # listV2 only
            delimiter=None,  # all
            encoding_type=None,  # all
            fetch_owner=None,  # listV2 only
            include_user_meta=None,  # MinIO specific listV2.
            max_keys=None,  # all
            prefix=None,  # all
            start_after=None,  # all: v1:marker, versioned:key_marker
            version_id_marker=None,  # versioned
            use_api_v1=False,
            include_version=False,
    ):
        """
        List objects optionally including versions.
        Note: Its required to send empty values to delimiter/prefix and 1000 to
        max-keys when not provided for server-side bucket policy evaluation to
        succeed; otherwise AccessDenied error will be returned for such
        policies.
        """

        check_bucket_name(bucket_name)

        if version_id_marker:
            include_version = True

        is_truncated = True
        while is_truncated:
            query = {}
            if include_version:
                query["versions"] = ""
            elif not use_api_v1:
                query["list-type"] = "2"

            if not include_version and not use_api_v1:
                if continuation_token:
                    query["continuation-token"] = continuation_token
                if fetch_owner:
                    query["fetch-owner"] = "true"
                if include_user_meta:
                    query["metadata"] = "true"
            query["delimiter"] = delimiter or ""
            if encoding_type:
                query["encoding-type"] = encoding_type
            query["max-keys"] = str(max_keys or 1000)
            query["prefix"] = prefix or ""
            if start_after:
                if include_version:
                    query["key-marker"] = start_after
                elif use_api_v1:
                    query["marker"] = start_after
                else:
                    query["start-after"] = start_after
            if version_id_marker:
                query["version-id-marker"] = version_id_marker

            response = self._execute("GET", bucket_name, query_params=query)

            objects, is_truncated, start_after, version_id_marker = (
                parse_list_objects(response)
            )

            if not include_version:
                version_id_marker = None
                if not use_api_v1:
                    continuation_token = start_after

            for obj in objects:
                yield obj

    def _list_multipart_uploads(self, bucket_name, delimiter=None,
                                encoding_type=None, key_marker=None,
                                max_uploads=None, prefix=None,
                                upload_id_marker=None, extra_headers=None,
                                extra_query_params=None):
        """
        Execute ListMultipartUploads S3 API.

        :param bucket_name: Name of the bucket.
        :param delimiter: (Optional) Delimiter on listing.
        :param encoding_type: (Optional) Encoding type.
        :param key_marker: (Optional) Key marker.
        :param max_uploads: (Optional) Maximum upload information to fetch.
        :param prefix: (Optional) Prefix on listing.
        :param upload_id_marker: (Optional) Upload ID marker.
        :param extra_headers: (Optional) Extra headers for advanced usage.
        :param extra_query_params: (Optional) Extra query parameters for
            advanced usage.
        :return:
            :class:`ListMultipartUploadsResult <ListMultipartUploadsResult>`
                object
        """

        query_params = extra_query_params or {}
        query_params.update(
            {
                "uploads": "",
                "delimiter": delimiter or "",
                "max-uploads": str(max_uploads or 1000),
                "prefix": prefix or "",
                "encoding-type": "url",
            },
        )
        if encoding_type:
            query_params["encoding-type"] = encoding_type
        if key_marker:
            query_params["key-marker"] = key_marker
        if upload_id_marker:
            query_params["upload-id-marker"] = upload_id_marker

        response = self._execute(
            "GET",
            bucket_name,
            query_params=query_params,
            headers=extra_headers,
        )
        return ListMultipartUploadsResult(response)

    def _list_parts(self, bucket_name, object_name, upload_id,
                    max_parts=None, part_number_marker=None,
                    extra_headers=None, extra_query_params=None):
        """
        Execute ListParts S3 API.

        :param bucket_name: Name of the bucket.
        :param object_name: Object name in the bucket.
        :param upload_id: Upload ID.
        :param max_parts: (Optional) Maximum parts information to fetch.
        :param part_number_marker: (Optional) Part number marker.
        :param extra_headers: (Optional) Extra headers for advanced usage.
        :param extra_query_params: (Optional) Extra query parameters for
            advanced usage.
        :return: :class:`ListPartsResult <ListPartsResult>` object
        """

        query_params = extra_query_params or {}
        query_params.update(
            {
                "uploadId": upload_id,
                "max-parts": str(max_parts or 1000),
            },
        )
        if part_number_marker:
            query_params["part-number-marker"] = part_number_marker

        response = self._execute(
            "GET",
            bucket_name,
            object_name=object_name,
            query_params=query_params,
            headers=extra_headers,
        )
        return ListPartsResult(response)

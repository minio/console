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

"""Helper functions."""

from __future__ import absolute_import, division, unicode_literals

import base64
import errno
import hashlib
import math
import os
import re
import urllib.parse
from queue import Queue
from threading import BoundedSemaphore, Thread

from .sse import Sse, SseCustomerKey
from .time import to_iso8601utc

# Constants
MAX_MULTIPART_COUNT = 10000  # 10000 parts
MAX_MULTIPART_OBJECT_SIZE = 5 * 1024 * 1024 * 1024 * 1024  # 5TiB
MAX_PART_SIZE = 5 * 1024 * 1024 * 1024  # 5GiB
MIN_PART_SIZE = 5 * 1024 * 1024  # 5MiB

_VALID_BUCKETNAME_REGEX = re.compile(
    '^[A-Za-z0-9][A-Za-z0-9\\.\\-\\_\\:]{1,61}[A-Za-z0-9]$')
_VALID_BUCKETNAME_STRICT_REGEX = re.compile(
    '^[a-z0-9][a-z0-9\\.\\-]{1,61}[a-z0-9]$')
_VALID_IP_ADDRESS = re.compile(
    r'^(\d+\.){3}\d+$')
_ALLOWED_HOSTNAME_REGEX = re.compile(
    '^((?!-)(?!_)[A-Z_\\d-]{1,63}(?<!-)(?<!_)\\.)*((?!_)(?!-)' +
    '[A-Z_\\d-]{1,63}(?<!-)(?<!_))$',
    re.IGNORECASE)

_EXTRACT_REGION_REGEX = re.compile('s3[.-]?(.+?).amazonaws.com')


def quote(resource, safe='/', encoding=None, errors=None):
    """
    Wrapper to urllib.parse.quote() replacing back to '~' for older python
    versions.
    """
    return urllib.parse.quote(
        resource,
        safe=safe,
        encoding=encoding,
        errors=errors,
    ).replace("%7E", "~")


def queryencode(query, safe='', encoding=None, errors=None):
    """Encode query parameter value."""
    return quote(query, safe, encoding, errors)


def headers_to_strings(headers, titled_key=False):
    """Convert HTTP headers to multi-line string."""
    return "\n".join(
        [
            "{0}: {1}".format(
                key.title() if titled_key else key,
                re.sub(
                    r"Credential=([^/]+)",
                    "Credential=*REDACTED*",
                    re.sub(
                        r"Signature=([0-9a-f]+)",
                        "Signature=*REDACTED*",
                        value if isinstance(value, str) else str(value),
                    ),
                ) if titled_key else value,
            ) for key, value in headers.items()
        ]
    )


def _validate_sizes(object_size, part_size):
    """Validate object and part size."""
    if part_size > 0:
        if part_size < MIN_PART_SIZE:
            raise ValueError(
                "part size {0} is not supported; minimum allowed 5MiB".format(
                    part_size,
                ),
            )
        if part_size > MAX_PART_SIZE:
            raise ValueError(
                "part size {0} is not supported; minimum allowed 5GiB".format(
                    part_size,
                ),
            )

    if object_size >= 0:
        if object_size > MAX_MULTIPART_OBJECT_SIZE:
            raise ValueError(
                (
                    "object size {0} is not supported; "
                    "maximum allowed 5TiB"
                ).format(object_size),
            )
    elif part_size <= 0:
        raise ValueError(
            "valid part size must be provided when object size is unknown",
        )


def _get_part_info(object_size, part_size):
    """Compute part information for object and part size."""
    _validate_sizes(object_size, part_size)

    if object_size < 0:
        return part_size, -1

    if part_size > 0:
        part_size = min(part_size, object_size)
        return part_size, math.ceil(object_size / part_size) if part_size else 1

    part_size = math.ceil(
        math.ceil(object_size / MAX_MULTIPART_COUNT) / MIN_PART_SIZE,
    ) * MIN_PART_SIZE
    return part_size, math.ceil(object_size / part_size) if part_size else 1


def get_part_info(object_size, part_size):
    """Compute part information for object and part size."""
    part_size, part_count = _get_part_info(object_size, part_size)
    if part_count > MAX_MULTIPART_COUNT:
        raise ValueError(
            (
                "object size {0} and part size {1} "
                "make more than {2} parts for upload"
            ).format(object_size, part_size, MAX_MULTIPART_COUNT),
        )
    return part_size, part_count


def read_part_data(stream, size, part_data=b'', progress=None):
    """Read part data of given size from stream."""
    size -= len(part_data)
    while size:
        data = stream.read(size)
        if not data:
            break  # EOF reached
        if not isinstance(data, bytes):
            raise ValueError("read() must return 'bytes' object")
        part_data += data
        size -= len(data)
        if progress:
            progress.update(len(data))
    return part_data


def makedirs(path):
    """Wrapper of os.makedirs() ignores errno.EEXIST."""
    try:
        if path:
            os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno != errno.EEXIST:
            raise

        if not os.path.isdir(path):
            raise ValueError(
                "path {0} is not a directory".format(path),
            ) from exc


def check_bucket_name(bucket_name, strict=False):
    """Check whether bucket name is valid optional with strict check or not."""

    # Verify bucket name is not empty
    bucket_name = str(bucket_name).strip()
    if not bucket_name:
        raise ValueError('Bucket name cannot be empty.')

    # Verify bucket name length.
    if len(bucket_name) < 3:
        raise ValueError('Bucket name cannot be less than'
                         ' 3 characters.')
    if len(bucket_name) > 63:
        raise ValueError('Bucket name cannot be greater than'
                         ' 63 characters.')

    match = _VALID_IP_ADDRESS.match(bucket_name)
    if match:
        raise ValueError('Bucket name cannot be an ip address')

    unallowed_successive_chars = ['..', '.-', '-.']
    if any(x in bucket_name for x in unallowed_successive_chars):
        raise ValueError('Bucket name contains invalid '
                         'successive chars '
                         + str(unallowed_successive_chars) + '.')

    if strict:
        match = _VALID_BUCKETNAME_STRICT_REGEX.match(bucket_name)
        if (not match) or match.end() != len(bucket_name):
            raise ValueError('Bucket name contains invalid '
                             'characters (strictly enforced).')

    match = _VALID_BUCKETNAME_REGEX.match(bucket_name)
    if (not match) or match.end() != len(bucket_name):
        raise ValueError('Bucket name does not follow S3 standards.'
                         ' Bucket: {0}'.format(bucket_name))


def check_non_empty_string(string):
    """Check whether given string is not empty."""
    try:
        if not string.strip():
            raise ValueError()
    except AttributeError as exc:
        raise TypeError() from exc


def is_valid_policy_type(policy):
    """
    Validate if policy is type str

    :param policy: S3 style Bucket policy.
    :return: True if policy parameter is of a valid type, 'string'.
    Raise :exc:`TypeError` otherwise.
    """
    if not isinstance(policy, (str, bytes)):
        raise TypeError("policy must be str or bytes type")

    check_non_empty_string(policy)

    return True


def check_ssec(sse):
    """Check sse is SseCustomerKey type or not."""
    if sse and not isinstance(sse, SseCustomerKey):
        raise ValueError("SseCustomerKey type is required")


def check_sse(sse):
    """Check sse is Sse type or not."""
    if sse and not isinstance(sse, Sse):
        raise ValueError("Sse type is required")


def md5sum_hash(data):
    """Compute MD5 of data and return hash as Base64 encoded value."""
    if data is None:
        return None

    hasher = hashlib.md5()
    hasher.update(data.encode() if isinstance(data, str) else data)
    md5sum = base64.b64encode(hasher.digest())
    return md5sum.decode() if isinstance(md5sum, bytes) else md5sum


def sha256_hash(data):
    """Compute SHA-256 of data and return hash as hex encoded value."""
    data = data or b""
    hasher = hashlib.sha256()
    hasher.update(data.encode() if isinstance(data, str) else data)
    sha256sum = hasher.hexdigest()
    return sha256sum.decode() if isinstance(sha256sum, bytes) else sha256sum


def url_replace(
        url, scheme=None, netloc=None, path=None, query=None, fragment=None
):
    """Return new URL with replaced properties in given URL."""
    return urllib.parse.SplitResult(
        scheme if scheme is not None else url.scheme,
        netloc if netloc is not None else url.netloc,
        path if path is not None else url.path,
        query if query is not None else url.query,
        fragment if fragment is not None else url.fragment,
    )


def _metadata_to_headers(metadata):
    """Convert user metadata to headers."""
    def normalize_key(key):
        if not key.lower().startswith("x-amz-meta-"):
            key = "X-Amz-Meta-" + key
        return key

    def to_string(value):
        value = str(value)
        try:
            value.encode("us-ascii")
        except UnicodeEncodeError as exc:
            raise ValueError(
                (
                    "unsupported metadata value {0}; "
                    "only US-ASCII encoded characters are supported"
                ).format(value)
            ) from exc
        return value

    def normalize_value(values):
        if not isinstance(values, (list, tuple)):
            values = [values]
        return [to_string(value) for value in values]

    return {
        normalize_key(key): normalize_value(value)
        for key, value in (metadata or {}).items()
    }


def normalize_headers(headers):
    """Normalize headers by prefixing 'X-Amz-Meta-' for user metadata."""
    headers = {str(key): value for key, value in (headers or {}).items()}

    def guess_user_metadata(key):
        key = key.lower()
        return not (
            key.startswith("x-amz-") or
            key in [
                "cache-control",
                "content-encoding",
                "content-type",
                "content-disposition",
                "content-language",
            ]
        )

    user_metadata = {
        key: value for key, value in headers.items()
        if guess_user_metadata(key)
    }

    # Remove guessed user metadata.
    _ = [headers.pop(key) for key in user_metadata]

    headers.update(_metadata_to_headers(user_metadata))
    return headers


def genheaders(headers, sse, tags, retention, legal_hold):
    """Generate headers for given parameters."""
    headers = normalize_headers(headers)
    headers.update(sse.headers() if sse else {})
    tagging = "&".join(
        [
            queryencode(key) + "=" + queryencode(value)
            for key, value in (tags or {}).items()
        ],
    )
    if tagging:
        headers["x-amz-tagging"] = tagging
    if retention and retention.mode:
        headers["x-amz-object-lock-mode"] = retention.mode
        headers["x-amz-object-lock-retain-until-date"] = (
            to_iso8601utc(retention.retain_until_date)
        )
    if legal_hold:
        headers["x-amz-object-lock-legal-hold"] = "ON"
    return headers


def _extract_region(host):
    """Extract region from Amazon S3 host."""

    tokens = host.split(".")
    token = tokens[1]

    # If token is "dualstack", then region might be in next token.
    if token == "dualstack":
        token = tokens[2]

    # If token is equal to "amazonaws", region is not passed in the host.
    if token == "amazonaws":
        return None

    # Return token as region.
    return token


class BaseURL:
    """Base URL of S3 endpoint."""

    def __init__(self, endpoint, region):
        url = urllib.parse.urlsplit(endpoint)
        host = url.hostname

        if url.scheme.lower() not in ["http", "https"]:
            raise ValueError("scheme in endpoint must be http or https")

        url = url_replace(url, scheme=url.scheme.lower())

        if url.path and url.path != "/":
            raise ValueError("path in endpoint is not allowed")

        url = url_replace(url, path="")

        if url.query:
            raise ValueError("query in endpoint is not allowed")

        if url.fragment:
            raise ValueError("fragment in endpoint is not allowed")

        try:
            url.port
        except ValueError as exc:
            raise ValueError("invalid port") from exc

        if url.username:
            raise ValueError("username in endpoint is not allowed")

        if url.password:
            raise ValueError("password in endpoint is not allowed")

        if (
                (url.scheme == "http" and url.port == 80) or
                (url.scheme == "https" and url.port == 443)
        ):
            url = url_replace(url, netloc=host)

        self._accelerate_host_flag = host.startswith("s3-accelerate.")
        self._is_aws_host = (
            (
                host.startswith("s3.") or self._accelerate_host_flag
            ) and
            (
                host.endswith(".amazonaws.com") or
                host.endswith(".amazonaws.com.cn")
            )
        )
        self._virtual_style_flag = (
            self._is_aws_host or host.endswith("aliyuncs.com")
        )

        region_in_host = None
        if self._is_aws_host:
            is_aws_china_host = host.endswith(".cn")
            url = url_replace(
                url,
                netloc=(
                    "amazonaws.com.cn"
                    if is_aws_china_host else "amazonaws.com"
                ),
            )
            region_in_host = _extract_region(host)

            if is_aws_china_host and not region_in_host and not region:
                raise ValueError(
                    "region missing in Amazon S3 China endpoint {0}".format(
                        endpoint,
                    ),
                )
            self._dualstack_host_flag = ".dualstack." in host
        else:
            self._accelerate_host_flag = False

        self._url = url
        self._region = region or region_in_host

    @property
    def region(self):
        """Get region."""
        return self._region

    @property
    def is_https(self):
        """Check if scheme is HTTPS."""
        return self._url.scheme == "https"

    @property
    def host(self):
        """Get hostname."""
        return self._url.netloc

    @property
    def is_aws_host(self):
        """Check if URL points to AWS host."""
        return self._is_aws_host

    @property
    def accelerate_host_flag(self):
        """Check if URL points to AWS accelerate host."""
        return self._accelerate_host_flag

    @accelerate_host_flag.setter
    def accelerate_host_flag(self, flag):
        """Check if URL points to AWS accelerate host."""
        if self._is_aws_host:
            self._accelerate_host_flag = flag

    @property
    def dualstack_host_flag(self):
        """Check if URL points to AWS dualstack host."""
        return self._dualstack_host_flag

    @dualstack_host_flag.setter
    def dualstack_host_flag(self, flag):
        """Check to use virtual style or not."""
        if self._is_aws_host:
            self._dualstack_host_flag = flag

    @property
    def virtual_style_flag(self):
        """Check to use virtual style or not."""
        return self._virtual_style_flag

    @virtual_style_flag.setter
    def virtual_style_flag(self, flag):
        """Check to use virtual style or not."""
        self._virtual_style_flag = flag

    def build(
            self, method, region,
            bucket_name=None, object_name=None, query_params=None,
    ):
        """Build URL for given information."""

        if not bucket_name and object_name:
            raise ValueError(
                "empty bucket name for object name {0}".format(object_name),
            )

        query = []
        for key, values in sorted((query_params or {}).items()):
            values = values if isinstance(values, (list, tuple)) else [values]
            query += [
                "{0}={1}".format(queryencode(key), queryencode(value))
                for value in sorted(values)
            ]
        url = url_replace(self._url, query="&".join(query))
        host = self._url.netloc

        if not bucket_name:
            url = url_replace(url, path="/")
            return (
                url_replace(url, netloc="s3." + region + "." + host)
                if self._is_aws_host else url
            )

        enforce_path_style = (
            # CreateBucket API requires path style in Amazon AWS S3.
            (method == "PUT" and not object_name and not query_params) or

            # GetBucketLocation API requires path style in Amazon AWS S3.
            (query_params and "location" in query_params) or

            # Use path style for bucket name containing '.' which causes
            # SSL certificate validation error.
            ("." in bucket_name and self._url.scheme == "https")
        )

        if self._is_aws_host:
            s3_domain = "s3."
            if self._accelerate_host_flag:
                if "." in bucket_name:
                    raise ValueError(
                        (
                            "bucket name '{0}' with '.' is not allowed "
                            "for accelerated endpoint"
                        ).format(bucket_name),
                    )

                if not enforce_path_style:
                    s3_domain = "s3-accelerate."

            dual_stack = "dualstack." if self._dualstack_host_flag else ""
            endpoint = s3_domain + dual_stack
            if enforce_path_style or not self._accelerate_host_flag:
                endpoint += region + "."
            host = endpoint + host

        if enforce_path_style or not self._virtual_style_flag:
            url = url_replace(url, netloc=host)
            url = url_replace(url, path="/" + bucket_name)
        else:
            url = url_replace(
                url,
                netloc=bucket_name + "." + host,
                path="/",
            )

        if object_name:
            path = url.path
            path += ("" if path.endswith("/") else "/") + quote(object_name)
            url = url_replace(url, path=path)

        return url


class ObjectWriteResult:
    """Result class of any APIs doing object creation."""

    def __init__(
            self, bucket_name, object_name, version_id, etag, http_headers,
            last_modified=None, location=None,
    ):
        self._bucket_name = bucket_name
        self._object_name = object_name
        self._version_id = version_id
        self._etag = etag
        self._http_headers = http_headers
        self._last_modified = last_modified
        self._location = location

    @property
    def bucket_name(self):
        """Get bucket name."""
        return self._bucket_name

    @property
    def object_name(self):
        """Get object name."""
        return self._object_name

    @property
    def version_id(self):
        """Get version ID."""
        return self._version_id

    @property
    def etag(self):
        """Get etag."""
        return self._etag

    @property
    def http_headers(self):
        """Get HTTP headers."""
        return self._http_headers

    @property
    def last_modified(self):
        """Get last-modified time."""
        return self._last_modified

    @property
    def location(self):
        """Get location."""
        return self._location


class Worker(Thread):
    """ Thread executing tasks from a given tasks queue """

    def __init__(self, tasks_queue, results_queue, exceptions_queue):
        Thread.__init__(self, daemon=True)
        self._tasks_queue = tasks_queue
        self._results_queue = results_queue
        self._exceptions_queue = exceptions_queue
        self.start()

    def run(self):
        """ Continously receive tasks and execute them """
        while True:
            task = self._tasks_queue.get()
            if not task:
                self._tasks_queue.task_done()
                break
            # No exception detected in any thread,
            # continue the execution.
            if self._exceptions_queue.empty():
                # Execute the task
                func, args, kargs, cleanup_func = task
                try:
                    result = func(*args, **kargs)
                    self._results_queue.put(result)
                except Exception as ex:  # pylint: disable=broad-except
                    self._exceptions_queue.put(ex)
                finally:
                    cleanup_func()
            # Mark this task as done, whether an exception happened or not
            self._tasks_queue.task_done()


class ThreadPool:
    """ Pool of threads consuming tasks from a queue """

    def __init__(self, num_threads):
        self._results_queue = Queue()
        self._exceptions_queue = Queue()
        self._tasks_queue = Queue()
        self._sem = BoundedSemaphore(num_threads)
        self._num_threads = num_threads

    def add_task(self, func, *args, **kargs):
        """
        Add a task to the queue. Calling this function can block
        until workers have a room for processing new tasks. Blocking
        the caller also prevents the latter from allocating a lot of
        memory while workers are still busy running their assigned tasks.
        """
        self._sem.acquire()  # pylint: disable=consider-using-with
        cleanup_func = self._sem.release
        self._tasks_queue.put((func, args, kargs, cleanup_func))

    def start_parallel(self):
        """ Prepare threads to run tasks"""
        for _ in range(self._num_threads):
            Worker(
                self._tasks_queue, self._results_queue, self._exceptions_queue,
            )

    def result(self):
        """ Stop threads and return the result of all called tasks """
        # Send None to all threads to cleanly stop them
        for _ in range(self._num_threads):
            self._tasks_queue.put(None)
        # Wait for completion of all the tasks in the queue
        self._tasks_queue.join()
        # Check if one of the thread raised an exception, if yes
        # raise it here in the function
        if not self._exceptions_queue.empty():
            raise self._exceptions_queue.get()
        return self._results_queue

# -*- coding: utf-8 -*-
# MinIO Python Library for Amazon S3 Compatible Cloud Storage,
# (C) 2015-2019 MinIO, Inc.
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

# pylint: disable=too-many-lines

"""
minio.error
~~~~~~~~~~~~~~~~~~~

This module provides custom exception classes for MinIO library
and API specific errors.

:copyright: (c) 2015, 2016, 2017 by MinIO, Inc.
:license: Apache 2.0, see LICENSE for more details.

"""

from xml.etree import ElementTree as ET

from .xml import findtext


class MinioException(Exception):
    """Base Minio exception."""


class InvalidResponseError(MinioException):
    """Raised to indicate that non-xml response from server."""

    def __init__(self, code, content_type, body):
        self._code = code
        self._content_type = content_type
        self._body = body
        super().__init__(
            (
                "non-XML response from server; "
                "Response code: {0}, Content-Type: {1}, Body: {2}"
            ).format(code, content_type, body),
        )


class ServerError(MinioException):
    """Raised to indicate that S3 service returning HTTP server error."""


class S3Error(MinioException):
    """
    Raised to indicate that error response is received
    when executing S3 operation.
    """

    def __init__(self, code, message, resource, request_id, host_id,
                 response, bucket_name=None, object_name=None):
        self._code = code
        self._message = message
        self._resource = resource
        self._request_id = request_id
        self._host_id = host_id
        self._response = response
        self._bucket_name = bucket_name
        self._object_name = object_name
        super().__init__(
            (
                "S3 operation failed; code: {0}, message: {1}, "
                "resource: {2}, request_id: {3}, host_id: {4}{5}{6}"
            ).format(
                self._code,
                self._message,
                self._resource,
                self._request_id,
                self._host_id,
                (
                    (", bucket_name: " + self._bucket_name)
                    if self._bucket_name else ""
                ),
                (
                    (", object_name: " + self._object_name)
                    if self._object_name else ""
                ),
            ),
        )

    @property
    def code(self):
        """Get S3 error code."""
        return self._code

    @property
    def message(self):
        """Get S3 error message."""
        return self._message

    @property
    def response(self):
        """Get HTTP response."""
        return self._response

    @classmethod
    def fromxml(cls, response):
        """Create new object with values from XML element."""
        element = ET.fromstring(response.data.decode())
        return cls(
            findtext(element, "Code"),
            findtext(element, "Message"),
            findtext(element, "Resource"),
            findtext(element, "RequestId"),
            findtext(element, "HostId"),
            bucket_name=findtext(element, "BucketName"),
            object_name=findtext(element, "Key"),
            response=response,
        )

    def copy(self, code, message):
        """Make a copy with replace code and message."""
        return S3Error(
            code,
            message,
            self._resource,
            self._request_id,
            self._host_id,
            self._response,
            self._bucket_name,
            self._object_name,
        )

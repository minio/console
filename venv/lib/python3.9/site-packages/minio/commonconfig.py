# -*- coding: utf-8 -*-
# MinIO Python Library for Amazon S3 Compatible Cloud Storage, (C)
# 2020 MinIO, Inc.
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

"""Common request/response configuration of S3 APIs."""
# pylint: disable=invalid-name

from __future__ import absolute_import

import datetime
from abc import ABCMeta

from .error import MinioException
from .helpers import quote
from .sse import SseCustomerKey
from .time import to_http_header
from .xml import SubElement, find, findall, findtext

COPY = "COPY"
REPLACE = "REPLACE"
DISABLED = "Disabled"
ENABLED = "Enabled"
GOVERNANCE = "GOVERNANCE"
COMPLIANCE = "COMPLIANCE"
_MAX_KEY_LENGTH = 128
_MAX_VALUE_LENGTH = 256
_MAX_OBJECT_TAG_COUNT = 10
_MAX_TAG_COUNT = 50


class Tags(dict):
    """dict extended to bucket/object tags."""

    def __init__(self, for_object=False):
        self._for_object = for_object
        super().__init__()

    def __setitem__(self, key, value):
        limit = _MAX_OBJECT_TAG_COUNT if self._for_object else _MAX_TAG_COUNT
        if len(self) == limit:
            raise ValueError(
                "only {0} {1} tags are allowed".format(
                    limit, "object" if self._for_object else "bucket",
                ),
            )
        if not key or len(key) > _MAX_KEY_LENGTH or "&" in key:
            raise ValueError("invalid tag key '{0}'".format(key))
        if value is None or len(value) > _MAX_VALUE_LENGTH or "&" in value:
            raise ValueError("invalid tag value '{0}'".format(value))
        super().__setitem__(key, value)

    @classmethod
    def new_bucket_tags(cls):
        """Create new bucket tags."""
        return cls()

    @classmethod
    def new_object_tags(cls):
        """Create new object tags."""
        return cls(True)

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        elements = findall(element, "Tag")
        obj = cls()
        for tag in elements:
            key = findtext(tag, "Key", True)
            value = findtext(tag, "Value", True)
            obj[key] = value
        return obj

    def toxml(self, element):
        """Convert to XML."""
        for key, value in self.items():
            tag = SubElement(element, "Tag")
            SubElement(tag, "Key", key)
            SubElement(tag, "Value", value)
        return element


class Tag:
    """Tag."""

    def __init__(self, key, value):
        if not key:
            raise ValueError("key must be provided")
        if value is None:
            raise ValueError("value must be provided")
        self._key = key
        self._value = value

    @property
    def key(self):
        """Get key."""
        return self._key

    @property
    def value(self):
        """Get value."""
        return self._value

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "Tag")
        key = findtext(element, "Key", True)
        value = findtext(element, "Value", True)
        return cls(key, value)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Tag")
        SubElement(element, "Key", self._key)
        SubElement(element, "Value", self._value)
        return element


class AndOperator:
    """AND operator."""

    def __init__(self, prefix=None, tags=None):
        if prefix is None and not tags:
            raise ValueError("at least prefix or tags must be provided")
        self._prefix = prefix
        self._tags = tags

    @property
    def prefix(self):
        """Get prefix."""
        return self._prefix

    @property
    def tags(self):
        """Get tags."""
        return self._tags

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "And")
        prefix = findtext(element, "Prefix")
        tags = (
            None if find(element, "Tag") is None
            else Tags.fromxml(element)
        )
        return cls(prefix, tags)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "And")
        if self._prefix is not None:
            SubElement(element, "Prefix", self._prefix)
        if self._tags is not None:
            self._tags.toxml(element)
        return element


class Filter:
    """Lifecycle rule filter."""

    def __init__(self, and_operator=None, prefix=None, tag=None):
        valid = (
            (and_operator is not None) ^
            (prefix is not None) ^
            (tag is not None)
        )
        if not valid:
            raise ValueError("only one of and, prefix or tag must be provided")
        self._and_operator = and_operator
        self._prefix = prefix
        self._tag = tag

    @property
    def and_operator(self):
        """Get AND operator."""
        return self._and_operator

    @property
    def prefix(self):
        """Get prefix."""
        return self._prefix

    @property
    def tag(self):
        """Get tag."""
        return self._tag

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "Filter")
        and_operator = (
            None if find(element, "And") is None
            else AndOperator.fromxml(element)
        )
        prefix = findtext(element, "Prefix")
        tag = None if find(element, "Tag") is None else Tag.fromxml(element)
        return cls(and_operator, prefix, tag)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Filter")
        if self._and_operator:
            self._and_operator.toxml(element)
        if self._prefix is not None:
            SubElement(element, "Prefix", self._prefix)
        if self._tag is not None:
            self._tag.toxml(element)
        return element


class BaseRule:
    """Base rule class for Replication and Lifecycle."""
    __metaclass__ = ABCMeta

    def __init__(self, rule_filter=None, rule_id=None):
        if rule_id is not None:
            rule_id = rule_id.strip()
            if not rule_id:
                raise ValueError("rule ID must be non-empty string")
            if len(rule_id) > 255:
                raise ValueError("rule ID must not exceed 255 characters")
        self._rule_filter = rule_filter
        self._rule_id = rule_id

    @property
    def rule_filter(self):
        """Get replication rule filter."""
        return self._rule_filter

    @property
    def rule_id(self):
        """Get rule ID."""
        return self._rule_id

    @staticmethod
    def parsexml(element):
        """Parse XML and return filter and ID."""
        return (
            None if find(element, "Filter") is None
            else Filter.fromxml(element)
        ), findtext(element, "ID")

    def toxml(self, element):
        """Convert to XML."""
        if self._rule_filter:
            self._rule_filter.toxml(element)
        if self._rule_id is not None:
            SubElement(element, "ID", self._rule_id)
        return element


def check_status(status):
    """Validate status."""
    if status not in [ENABLED, DISABLED]:
        raise ValueError("status must be 'Enabled' or 'Disabled'")


class ObjectConditionalReadArgs:
    """Base argument class holds condition properties for reading object."""
    __metaclass__ = ABCMeta

    def __init__(self, bucket_name, object_name, region=None, version_id=None,
                 ssec=None, offset=None, length=None, match_etag=None,
                 not_match_etag=None, modified_since=None,
                 unmodified_since=None):
        if ssec is not None and not isinstance(ssec, SseCustomerKey):
            raise ValueError("ssec must be SseCustomerKey type")
        if offset is not None and offset < 0:
            raise ValueError("offset should be zero or greater")
        if length is not None and length <= 0:
            raise ValueError("length should be greater than zero")
        if match_etag is not None and match_etag == "":
            raise ValueError("match_etag must not be empty")
        if not_match_etag is not None and not_match_etag == "":
            raise ValueError("not_match_etag must not be empty")
        if (
                modified_since is not None and
                not isinstance(modified_since, datetime.datetime)
        ):
            raise ValueError("modified_since must be datetime.datetime type")
        if (
                unmodified_since is not None and
                not isinstance(unmodified_since, datetime.datetime)
        ):
            raise ValueError("unmodified_since must be datetime.datetime type")

        self._bucket_name = bucket_name
        self._object_name = object_name
        self._region = region
        self._version_id = version_id
        self._ssec = ssec
        self._offset = offset
        self._length = length
        self._match_etag = match_etag
        self._not_match_etag = not_match_etag
        self._modified_since = modified_since
        self._unmodified_since = unmodified_since

    @property
    def bucket_name(self):
        """Get bucket name."""
        return self._bucket_name

    @property
    def object_name(self):
        """Get object name."""
        return self._object_name

    @property
    def region(self):
        """Get region."""
        return self._region

    @property
    def version_id(self):
        """Get version ID."""
        return self._version_id

    @property
    def ssec(self):
        """Get SSE-C."""
        return self._ssec

    @property
    def offset(self):
        """Get offset."""
        return self._offset

    @property
    def length(self):
        """Get length."""
        return self._length

    @property
    def match_etag(self):
        """Get match ETag condition."""
        return self._match_etag

    @property
    def not_match_etag(self):
        """Get not-match ETag condition."""
        return self._not_match_etag

    @property
    def modified_since(self):
        """Get modified since condition."""
        return self._modified_since

    @property
    def unmodified_since(self):
        """Get unmodified since condition."""
        return self._unmodified_since

    def gen_copy_headers(self):
        """Generate copy source headers."""
        copy_source = quote("/" + self._bucket_name + "/" + self._object_name)
        if self._version_id:
            copy_source += "?versionId=" + quote(self._version_id)

        headers = {"x-amz-copy-source": copy_source}
        if self._ssec:
            headers.update(self._ssec.copy_headers())
        if self._match_etag:
            headers["x-amz-copy-source-if-match"] = self._match_etag
        if self._not_match_etag:
            headers["x-amz-copy-source-if-none-match"] = self._not_match_etag
        if self._modified_since:
            headers["x-amz-copy-source-if-modified-since"] = (
                to_http_header(self._modified_since)
            )
        if self._unmodified_since:
            headers["x-amz-copy-source-if-unmodified-since"] = (
                to_http_header(self._unmodified_since)
            )
        return headers


class CopySource(ObjectConditionalReadArgs):
    """A source object defintion for copy_object method."""
    @classmethod
    def of(cls, src):
        """Create CopySource from another source."""
        return cls(
            src.bucket_name, src.object_name, src.region, src.version_id,
            src.ssec, src.offset, src.length, src.match_etag,
            src.not_match_etag, src.modified_since, src.unmodified_since,
        )


class ComposeSource(ObjectConditionalReadArgs):
    """A source object defintion for compose_object method."""

    def __init__(self, bucket_name, object_name, region=None, version_id=None,
                 ssec=None, offset=None, length=None, match_etag=None,
                 not_match_etag=None, modified_since=None,
                 unmodified_since=None):
        super().__init__(
            bucket_name, object_name, region, version_id, ssec, offset, length,
            match_etag, not_match_etag, modified_since, unmodified_since,
        )
        self._object_size = None
        self._headers = None

    def _validate_size(self, object_size):
        """Validate object size with offset and length."""
        def make_error(name, value):
            ver = ("?versionId="+self._version_id) if self._version_id else ""
            return ValueError(
                "Source {0}/{1}{2}: {3} {4} is beyond object size {5}".format(
                    self._bucket_name,
                    self._object_name,
                    ver,
                    name,
                    value,
                    object_size,
                )
            )

        if self._offset is not None and self._offset >= object_size:
            raise make_error("offset", self._offset)
        if self._length is not None:
            if self._length > object_size:
                raise make_error("length", self._length)
            offset = self._offset or 0
            if offset+self.length > object_size:
                raise make_error("compose size", offset+self._length)

    def build_headers(self, object_size, etag):
        """Build headers."""
        self._validate_size(object_size)
        self._object_size = object_size
        headers = self.gen_copy_headers()
        headers["x-amz-copy-source-if-match"] = self._match_etag or etag
        self._headers = headers

    @property
    def object_size(self):
        """Get object size."""
        if self._object_size is None:
            raise MinioException(
                "build_headers() must be called prior to "
                "this method invocation",
            )
        return self._object_size

    @property
    def headers(self):
        """Get headers."""
        if self._headers is None:
            raise MinioException(
                "build_headers() must be called prior to "
                "this method invocation",
            )
        return self._headers.copy()

    @classmethod
    def of(cls, src):
        """Create ComposeSource from another source."""
        return cls(
            src.bucket_name, src.object_name, src.region, src.version_id,
            src.ssec, src.offset, src.length, src.match_etag,
            src.not_match_etag, src.modified_since, src.unmodified_since,
        )

# -*- coding: utf-8 -*-
# MinIO Python Library for Amazon S3 Compatible Cloud Storage, (C)
# 2015, 2016, 2017, 2018, 2019 MinIO, Inc.
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

"""
Request/response of PutBucketLifecycleConfiguration and
GetBucketLifecycleConfiguration APIs.
"""
# pylint: disable=invalid-name

from __future__ import absolute_import

from abc import ABCMeta

from .commonconfig import BaseRule, check_status
from .time import from_iso8601utc, to_iso8601utc
from .xml import Element, SubElement, find, findall, findtext


class DateDays:
    """Base class holds date and days of Transition and Expiration."""
    __metaclass__ = ABCMeta

    def __init__(self, date=None, days=None):
        self._date = date
        self._days = days

    @property
    def date(self):
        """Get date."""
        return self._date

    @property
    def days(self):
        """Get days."""
        return self._days

    @staticmethod
    def parsexml(element):
        """Parse XML to date and days."""
        date = from_iso8601utc(findtext(element, "Date"))
        days = findtext(element, "Days")
        if days is not None:
            days = int(days)
        return date, days

    def toxml(self, element):
        """Convert to XML."""
        if self._date is not None:
            SubElement(
                element, "Date", to_iso8601utc(self._date),
            )
        if self._days:
            SubElement(element, "Days", str(self._days))
        return element


class Transition(DateDays):
    """Transition."""

    def __init__(self, date=None, days=None, storage_class=None):
        super().__init__(date, days)
        self._storage_class = storage_class

    @property
    def storage_class(self):
        """Get storage class."""
        return self._storage_class

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "Transition")
        date, days = cls.parsexml(element)
        return cls(date, days, findtext(element, "StorageClass"))

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "NoncurrentVersionTransition")
        super().toxml(element)
        if self._storage_class:
            SubElement(element, "StorageClass", self._storage_class)
        return element


class NoncurrentVersionTransition:
    """Noncurrent version transition."""

    def __init__(self, noncurrent_days=None, storage_class=None):
        self._noncurrent_days = noncurrent_days
        self._storage_class = storage_class

    @property
    def noncurrent_days(self):
        """Get Noncurrent days."""
        return self._noncurrent_days

    @property
    def storage_class(self):
        """Get storage class."""
        return self._storage_class

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "NoncurrentVersionTransition")
        noncurrent_days = findtext(element, "NoncurrentDays")
        if noncurrent_days is not None:
            noncurrent_days = int(noncurrent_days)
        return cls(noncurrent_days, findtext(element, "StorageClass"))

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "NoncurrentVersionTransition")
        if self._noncurrent_days:
            SubElement(element, "NoncurrentDays", str(self._noncurrent_days))
        if self._storage_class:
            SubElement(element, "StorageClass", self._storage_class)
        return element


class NoncurrentVersionExpiration:
    """Noncurrent version expiration."""

    def __init__(self, noncurrent_days=None):
        self._noncurrent_days = noncurrent_days

    @property
    def noncurrent_days(self):
        """Get Noncurrent days."""
        return self._noncurrent_days

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "NoncurrentVersionExpiration")
        noncurrent_days = findtext(element, "NoncurrentDays")
        if noncurrent_days is not None:
            noncurrent_days = int(noncurrent_days)
        return cls(noncurrent_days)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "NoncurrentVersionExpiration")
        if self._noncurrent_days:
            SubElement(element, "NoncurrentDays", str(self._noncurrent_days))
        return element


class Expiration(DateDays):
    """Expiration."""

    def __init__(self, date=None, days=None,
                 expired_object_delete_marker=None):
        super().__init__(date, days)
        self._expired_object_delete_marker = expired_object_delete_marker

    @property
    def expired_object_delete_marker(self):
        """Get expired object delete marker."""
        return self._expired_object_delete_marker

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "Expiration")
        date, days = cls.parsexml(element)
        expired_object_delete_marker = findtext(
            element, "ExpiredObjectDeleteMarker",
        )
        if expired_object_delete_marker is not None:
            if expired_object_delete_marker.title() not in ["False", "True"]:
                raise ValueError(
                    "value of ExpiredObjectDeleteMarker must be "
                    "'True' or 'False'",
                )
            expired_object_delete_marker = (
                expired_object_delete_marker.title() == "True"
            )

        return cls(date, days, expired_object_delete_marker)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Expiration")
        super().toxml(element)
        if self._expired_object_delete_marker is not None:
            SubElement(
                element,
                "ExpiredObjectDeleteMarker",
                str(self._expired_object_delete_marker),
            )
        return element


class AbortIncompleteMultipartUpload:
    """Abort incomplete multipart upload."""

    def __init__(self, days_after_initiation=None):
        self._days_after_initiation = days_after_initiation

    @property
    def days_after_initiation(self):
        """Get days after initiation."""
        return self._days_after_initiation

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "AbortIncompleteMultipartUpload")
        days_after_initiation = findtext(element, "DaysAfterInitiation")
        if days_after_initiation is not None:
            days_after_initiation = int(days_after_initiation)
        return cls(days_after_initiation)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "AbortIncompleteMultipartUpload")
        if self._days_after_initiation:
            SubElement(
                element,
                "DaysAfterInitiation",
                str(self._days_after_initiation),
            )
        return element


class Rule(BaseRule):
    """Lifecycle rule. """

    def __init__(self, status, abort_incomplete_multipart_upload=None,
                 expiration=None, rule_filter=None, rule_id=None,
                 noncurrent_version_expiration=None,
                 noncurrent_version_transition=None,
                 transition=None):
        check_status(status)
        if not rule_filter:
            raise ValueError("Rule filter must be provided")

        super().__init__(rule_filter, rule_id)

        self._status = status
        self._abort_incomplete_multipart_upload = (
            abort_incomplete_multipart_upload
        )
        self._expiration = expiration
        self._noncurrent_version_expiration = noncurrent_version_expiration
        self._noncurrent_version_transition = noncurrent_version_transition
        self._transition = transition

    @property
    def status(self):
        """Get status."""
        return self._status

    @property
    def abort_incomplete_multipart_upload(self):
        """Get abort incomplete multipart upload."""
        return self._abort_incomplete_multipart_upload

    @property
    def expiration(self):
        """Get expiration."""
        return self._expiration

    @property
    def noncurrent_version_expiration(self):
        """Get noncurrent version expiration."""
        return self._noncurrent_version_expiration

    @property
    def noncurrent_version_transition(self):
        """Get noncurrent version transition."""
        return self._noncurrent_version_transition

    @property
    def transition(self):
        """Get transition."""
        return self._transition

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        status = findtext(element, "Status", True)
        abort_incomplete_multipart_upload = (
            None if find(element, "AbortIncompleteMultipartUpload") is None
            else AbortIncompleteMultipartUpload.fromxml(element)
        )
        expiration = (
            None if find(element, "Expiration") is None
            else Expiration.fromxml(element)
        )
        rule_filter, rule_id = cls.parsexml(element)
        noncurrent_version_expiration = (
            None if find(element, "NoncurrentVersionExpiration") is None
            else NoncurrentVersionExpiration.fromxml(element)
        )
        noncurrent_version_transition = (
            None if find(element, "NoncurrentVersionTransition") is None
            else NoncurrentVersionTransition.fromxml(element)
        )
        transition = (
            None if find(element, "Transition") is None
            else Transition.fromxml(element)
        )

        return cls(
            status,
            abort_incomplete_multipart_upload=(
                abort_incomplete_multipart_upload
            ),
            expiration=expiration,
            rule_filter=rule_filter,
            rule_id=rule_id,
            noncurrent_version_expiration=noncurrent_version_expiration,
            noncurrent_version_transition=noncurrent_version_transition,
            transition=transition,
        )

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Rule")
        SubElement(element, "Status", self._status)
        if self._abort_incomplete_multipart_upload:
            self._abort_incomplete_multipart_upload.toxml(element)
        if self._expiration:
            self._expiration.toxml(element)
        super().toxml(element)
        if self._noncurrent_version_expiration:
            self._noncurrent_version_expiration.toxml(element)
        if self._noncurrent_version_transition:
            self._noncurrent_version_transition.toxml(element)
        if self._transition:
            self._transition.toxml(element)
        return element


class LifecycleConfig:
    """Lifecycle configuration."""

    def __init__(self, rules):
        if not rules:
            raise ValueError("rules must be provided")
        self._rules = rules

    @property
    def rules(self):
        """Get rules."""
        return self._rules

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        elements = findall(element, "Rule")
        rules = []
        for tag in elements:
            rules.append(Rule.fromxml(tag))
        return cls(rules)

    def toxml(self, element):
        """Convert to XML."""
        element = Element("LifecycleConfiguration")
        for rule in self._rules:
            rule.toxml(element)
        return element

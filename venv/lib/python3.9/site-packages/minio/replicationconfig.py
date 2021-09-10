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

"""Request/response of PutBucketReplication and GetBucketReplication APIs."""

from __future__ import absolute_import

from abc import ABCMeta

from .commonconfig import DISABLED, BaseRule, check_status
from .xml import Element, SubElement, find, findall, findtext


class Status:
    """Status."""
    __metaclass__ = ABCMeta

    def __init__(self, status):
        check_status(status)
        self._status = status

    @property
    def status(self):
        """Get status."""
        return self._status

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, cls.__name__)
        return cls(findtext(element, "Status", True))

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, self.__class__.__name__)
        SubElement(element, "Status", self._status)
        return element


class SseKmsEncryptedObjects(Status):
    """SSE KMS encrypted objects."""


class SourceSelectionCriteria:
    """Source selection criteria."""

    def __init__(self, sse_kms_encrypted_objects=None):
        self._sse_kms_encrypted_objects = sse_kms_encrypted_objects

    @property
    def sse_kms_encrypted_objects(self):
        """Get SSE KMS encrypted objects."""
        return self._sse_kms_encrypted_objects

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "SourceSelectionCriteria")
        return cls(
            None if find(element, "SseKmsEncryptedObjects") is None
            else SseKmsEncryptedObjects.fromxml(element)
        )

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "SourceSelectionCriteria")
        if self._sse_kms_encrypted_objects:
            self._sse_kms_encrypted_objects.toxml(element)
        return element


class ExistingObjectReplication(Status):
    """Existing object replication."""


class DeleteMarkerReplication(Status):
    """Delete marker replication."""

    def __init__(self, status=DISABLED):
        super().__init__(status)


class ReplicationTimeValue:
    """Replication time value."""
    __metaclass__ = ABCMeta

    def __init__(self, minutes=15):
        self._minutes = minutes

    @property
    def minutes(self):
        """Get minutes."""
        return self._minutes

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, cls.__name__)
        minutes = findtext(element, "Minutes")
        if minutes is not None:
            minutes = int(minutes)
        return cls(minutes)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, self.__class__.__name__)
        if self._minutes is not None:
            SubElement(element, "Minutes", str(self._minutes))
        return element


class Time(ReplicationTimeValue):
    """Time."""


class ReplicationTime:
    """Replication time."""

    def __init__(self, time, status):
        if not time:
            raise ValueError("time must be provided")
        check_status(status)
        self._time = time
        self._status = status

    @property
    def time(self):
        """Get time value."""
        return self._time

    @property
    def status(self):
        """Get status."""
        return self._status

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "ReplicationTime")
        time = Time.fromxml(element)
        status = findtext(element, "Status", True)
        return cls(time, status)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "ReplicationTime")
        self._time.toxml(element)
        SubElement(element, "Status", self._status)
        return element


class EventThreshold(ReplicationTimeValue):
    """Event threshold."""


class Metrics:
    """Metrics."""

    def __init__(self, event_threshold, status):
        if not event_threshold:
            raise ValueError("event threshold must be provided")
        check_status(status)
        self._event_threshold = event_threshold
        self._status = status

    @property
    def event_threshold(self):
        """Get event threshold."""
        return self._event_threshold

    @property
    def status(self):
        """Get status."""
        return self._status

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "Metrics")
        event_threshold = EventThreshold.fromxml(element)
        status = findtext(element, "Status", True)
        return cls(event_threshold, status)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Metrics")
        self._event_threshold.toxml(element)
        SubElement(element, "Status", self._status)
        return element


class EncryptionConfig:
    """Encryption configuration."""

    def __init__(self, replica_kms_key_id=None):
        self._replica_kms_key_id = replica_kms_key_id

    @property
    def replica_kms_key_id(self):
        """Get replica KMS key ID."""
        return self._replica_kms_key_id

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "EncryptionConfiguration")
        return cls(findtext(element, "ReplicaKmsKeyID"))

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "EncryptionConfiguration")
        SubElement(element, "ReplicaKmsKeyID", self._replica_kms_key_id)
        return element


class AccessControlTranslation:
    """Access control translation."""

    def __init__(self, owner="Destination"):
        if not owner:
            raise ValueError("owner must be provided")
        self._owner = owner

    @property
    def owner(self):
        """Get owner."""
        return self._owner

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "AccessControlTranslation")
        return cls(findtext(element, "Owner"))

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "AccessControlTranslation")
        SubElement(element, "Owner", self._owner)
        return element


class Destination:
    """Replication destination."""

    def __init__(self, bucket_arn,
                 access_control_translation=None, account=None,
                 encryption_config=None, metrics=None,
                 replication_time=None, storage_class=None):
        if not bucket_arn:
            raise ValueError("bucket ARN must be provided")
        self._bucket_arn = bucket_arn
        self._access_control_translation = access_control_translation
        self._account = account
        self._encryption_config = encryption_config
        self._metrics = metrics
        self._replication_time = replication_time
        self._storage_class = storage_class

    @property
    def bucket_arn(self):
        """Get bucket ARN."""
        return self._bucket_arn

    @property
    def access_control_translation(self):
        """Get access control translation. """
        return self._access_control_translation

    @property
    def account(self):
        """Get account."""
        return self._account

    @property
    def encryption_config(self):
        """Get encryption configuration."""
        return self._encryption_config

    @property
    def metrics(self):
        """Get metrics."""
        return self._metrics

    @property
    def replication_time(self):
        """Get replication time."""
        return self._replication_time

    @property
    def storage_class(self):
        """Get storage class."""
        return self._storage_class

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "Destination")
        access_control_translation = (
            None if find(element, "AccessControlTranslation") is None
            else AccessControlTranslation.fromxml(element)
        )
        account = findtext(element, "Account")
        bucket_arn = findtext(element, "Bucket", True)
        encryption_config = (
            None if find(element, "EncryptionConfiguration") is None
            else EncryptionConfig.fromxml(element)
        )
        metrics = (
            None if find(element, "Metrics") is None
            else Metrics.fromxml(element)
        )
        replication_time = (
            None if find(element, "ReplicationTime") is None
            else ReplicationTime.fromxml(element)
        )
        storage_class = findtext(element, "StorageClass")
        return cls(bucket_arn, access_control_translation, account,
                   encryption_config, metrics, replication_time, storage_class)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Destination")
        if self._access_control_translation:
            self._access_control_translation.toxml(element)
        if self._account is not None:
            SubElement(element, "Account", self._account)
        SubElement(element, "Bucket", self._bucket_arn)
        if self._encryption_config:
            self._encryption_config.toxml(element)
        if self._metrics:
            self._metrics.toxml(element)
        if self._replication_time:
            self._replication_time.toxml(element)
        if self._storage_class:
            SubElement(element, "StorageClass", self._storage_class)
        return element


class Rule(BaseRule):
    """Replication rule. """

    def __init__(self, destination, status,
                 delete_marker_replication=None,
                 existing_object_replication=None,
                 rule_filter=None, rule_id=None, prefix=None,
                 priority=None, source_selection_criteria=None):
        if not destination:
            raise ValueError("destination must be provided")

        check_status(status)

        super().__init__(rule_filter, rule_id)

        self._destination = destination
        self._status = status
        if rule_filter and not delete_marker_replication:
            delete_marker_replication = DeleteMarkerReplication()
        self._delete_marker_replication = delete_marker_replication
        self._existing_object_replication = existing_object_replication
        self._prefix = prefix
        self._priority = priority
        self._source_selection_criteria = source_selection_criteria

    @property
    def destination(self):
        """Get destination."""
        return self._destination

    @property
    def status(self):
        """Get status."""
        return self._status

    @property
    def delete_marker_replication(self):
        """Get delete marker replication."""
        return self._delete_marker_replication

    @property
    def existing_object_replication(self):
        """Get existing object replication."""
        return self._existing_object_replication

    @property
    def prefix(self):
        """Get prefix."""
        return self._prefix

    @property
    def priority(self):
        """Get priority."""
        return self._priority

    @property
    def source_selection_criteria(self):
        """Get source selection criteria."""
        return self._source_selection_criteria

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        delete_marker_replication = (
            None if find(element, "DeleteMarkerReplication") is None
            else DeleteMarkerReplication.fromxml(element)
        )
        destination = Destination.fromxml(element)
        existing_object_replication = (
            None if find(element, "ExistingObjectReplication") is None
            else ExistingObjectReplication.fromxml(element)
        )
        rule_filter, rule_id = cls.parsexml(element)
        prefix = findtext(element, "Prefix")
        priority = findtext(element, "Priority")
        if priority:
            priority = int(priority)
        source_selection_criteria = (
            None if find(element, "SourceSelectionCriteria") is None
            else SourceSelectionCriteria.fromxml(element)
        )
        status = findtext(element, "Status", True)

        return cls(destination, status, delete_marker_replication,
                   existing_object_replication, rule_filter,
                   rule_id, prefix, priority, source_selection_criteria)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Rule")
        if self._delete_marker_replication:
            self._delete_marker_replication.toxml(element)
        self._destination.toxml(element)
        if self._existing_object_replication:
            self._existing_object_replication.toxml(element)
        super().toxml(element)
        if self._prefix is not None:
            SubElement(element, "Prefix", self._prefix)
        if self._priority is not None:
            SubElement(element, "Priority", str(self._priority))
        if self._source_selection_criteria:
            self._source_selection_criteria.toxml(element)
        SubElement(element, "Status", self._status)
        return element


class ReplicationConfig:
    """Replication configuration."""

    def __init__(self, role, rules):
        if not role:
            raise ValueError("role must be provided")
        if not rules:
            raise ValueError("rules must be provided")
        if len(rules) > 1000:
            raise ValueError("more than 1000 rules are not supported")
        self._role = role
        self._rules = rules

    @property
    def role(self):
        """Get role."""
        return self._role

    @property
    def rules(self):
        """Get rules."""
        return self._rules

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        role = findtext(element, "Role", True)
        elements = findall(element, "Rule")
        rules = []
        for tag in elements:
            rules.append(Rule.fromxml(tag))
        return cls(role, rules)

    def toxml(self, element):
        """Convert to XML."""
        element = Element("ReplicationConfiguration")
        SubElement(element, "Role", self._role)
        for rule in self._rules:
            rule.toxml(element)
        return element

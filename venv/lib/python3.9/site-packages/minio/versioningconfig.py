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

"""Request/response of PutBucketVersioning and GetBucketVersioning APIs."""

from __future__ import absolute_import

from .commonconfig import DISABLED, ENABLED
from .xml import Element, SubElement, findtext

OFF = "Off"
SUSPENDED = "Suspended"


class VersioningConfig:
    """Versioning configuration."""

    def __init__(self, status=None, mfa_delete=None):
        if status is not None and status not in [ENABLED, SUSPENDED]:
            raise ValueError(
                "status must be {0} or {1}".format(ENABLED, SUSPENDED),
            )
        if mfa_delete is not None and mfa_delete not in [ENABLED, DISABLED]:
            raise ValueError(
                "MFA delete must be {0} or {1}".format(ENABLED, DISABLED),
            )
        self._status = status
        self._mfa_delete = mfa_delete

    @property
    def status(self):
        """Get status."""
        return self._status or OFF

    @property
    def mfa_delete(self):
        """Get MFA delete."""
        return self._mfa_delete

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        status = findtext(element, "Status")
        mfa_delete = findtext(element, "MFADelete")
        return cls(status, mfa_delete)

    def toxml(self, element):
        """Convert to XML."""
        element = Element("VersioningConfiguration")
        if self._status:
            SubElement(element, "Status", self._status)
        if self._mfa_delete:
            SubElement(element, "MFADelete", self._mfa_delete)
        return element

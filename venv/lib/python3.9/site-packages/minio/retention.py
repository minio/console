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

"""Request/response of PutObjectRetention and GetObjectRetention APIs."""

from __future__ import absolute_import

import datetime

from .commonconfig import COMPLIANCE, GOVERNANCE
from .time import from_iso8601utc, to_iso8601utc
from .xml import Element, SubElement, findtext


class Retention:
    """Retention configuration."""

    def __init__(self, mode, retain_until_date):
        if mode not in [GOVERNANCE, COMPLIANCE]:
            raise ValueError(
                "mode must be {0} or {1}".format(GOVERNANCE, COMPLIANCE),
            )
        if not isinstance(retain_until_date, datetime.datetime):
            raise ValueError(
                "retain until date must be datetime.datetime type",
            )
        self._mode = mode
        self._retain_until_date = retain_until_date

    @property
    def mode(self):
        """Get mode."""
        return self._mode

    @property
    def retain_until_date(self):
        """Get retain util date."""
        return self._retain_until_date

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        mode = findtext(element, "Mode", True)
        retain_until_date = from_iso8601utc(
            findtext(element, "RetainUntilDate", True),
        )
        return cls(mode, retain_until_date)

    def toxml(self, element):
        """Convert to XML."""
        element = Element("Retention")
        SubElement(element, "Mode", self._mode)
        SubElement(
            element,
            "RetainUntilDate",
            to_iso8601utc(self._retain_until_date),
        )
        return element

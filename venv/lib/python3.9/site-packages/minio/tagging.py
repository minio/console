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

"""Tagging for bucket and object."""

from __future__ import absolute_import

from .commonconfig import Tags
from .xml import Element, SubElement, find


class Tagging:
    """Tagging for buckets and objects."""

    def __init__(self, tags):
        self._tags = tags

    @property
    def tags(self):
        """Get tags."""
        return self._tags

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        element = find(element, "TagSet")
        tags = (
            None if find(element, "Tag") is None
            else Tags.fromxml(element)
        )
        return cls(tags)

    def toxml(self, element):
        """Convert to XML."""
        element = Element("Tagging")
        if self._tags:
            self._tags.toxml(SubElement(element, "TagSet"))
        return element

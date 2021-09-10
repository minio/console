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

"""Request/response of DeleteObjects API."""

from __future__ import absolute_import

from .xml import Element, SubElement, findall, findtext


class DeleteObject:
    """Delete object request information."""

    def __init__(self, name, version_id=None):
        self._name = name
        self._version_id = version_id

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "Object")
        SubElement(element, "Key", self._name)
        if self._version_id is not None:
            SubElement(element, "VersionId", self._version_id)
        return element


class DeleteRequest:
    """Delete object request."""

    def __init__(self, object_list, quiet=False):
        self._object_list = object_list
        self._quiet = quiet

    def toxml(self, element):
        """Convert to XML."""
        element = Element("Delete")
        if self._quiet:
            SubElement(element, "Quiet", str(self._quiet))
        for obj in self._object_list:
            obj.toxml(element)
        return element


class DeletedObject:
    """Deleted object information."""

    def __init__(self, name, version_id, delete_marker,
                 delete_marker_version_id):
        self._name = name
        self._version_id = version_id
        self._delete_marker = delete_marker
        self._delete_marker_version_id = delete_marker_version_id

    @property
    def name(self):
        """Get name."""
        return self._name

    @property
    def version_id(self):
        """Get version ID."""
        return self._version_id

    @property
    def delete_marker(self):
        """Get delete marker."""
        return self._delete_marker

    @property
    def delete_marker_version_id(self):
        """Get delete marker version ID."""
        return self._delete_marker_version_id

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        name = findtext(element, "Key", True)
        version_id = findtext(element, "VersionId")
        delete_marker = findtext(element, "DeleteMarker")
        delete_marker = (
            delete_marker is not None and delete_marker.title() == "True"
        )
        delete_marker_version_id = findtext(element, "DeleteMarkerVersionId")
        return cls(name, version_id, delete_marker, delete_marker_version_id)


class DeleteError:
    """Delete error information."""

    def __init__(self, code, message, name, version_id):
        self._code = code
        self._message = message
        self._name = name
        self._version_id = version_id

    @property
    def code(self):
        """Get error code."""
        return self._code

    @property
    def message(self):
        """Get error message."""
        return self._message

    @property
    def name(self):
        """Get name."""
        return self._name

    @property
    def version_id(self):
        """Get version ID."""
        return self._version_id

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        code = findtext(element, "Code", True)
        message = findtext(element, "Message")
        name = findtext(element, "Key")
        version_id = findtext(element, "VersionId")
        return cls(code, message, name, version_id)


class DeleteResult:
    """Delete object result."""

    def __init__(self, object_list, error_list):
        self._object_list = object_list
        self._error_list = error_list

    @property
    def object_list(self):
        """Get object list."""
        return self._object_list

    @property
    def error_list(self):
        """Get error list."""
        return self._error_list

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        elements = findall(element, "Deleted")
        object_list = []
        for tag in elements:
            object_list.append(DeletedObject.fromxml(tag))
        elements = findall(element, "Error")
        error_list = []
        for tag in elements:
            error_list.append(DeleteError.fromxml(tag))
        return cls(object_list, error_list)

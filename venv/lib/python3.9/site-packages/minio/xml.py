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

"""XML utility module."""

from __future__ import absolute_import

import io
from xml.etree import ElementTree as ET

_S3_NAMESPACE = "http://s3.amazonaws.com/doc/2006-03-01/"


def Element(tag, namespace=_S3_NAMESPACE):  # pylint: disable=invalid-name
    """Create ElementTree.Element with tag and namespace."""
    return ET.Element(tag, {'xmlns': namespace} if namespace else {})


def SubElement(parent, tag, text=None):  # pylint: disable=invalid-name
    """Create ElementTree.SubElement on parent with tag and text."""
    element = ET.SubElement(parent, tag)
    if text is not None:
        element.text = text
    return element


def _get_namespace(element):
    """Exact namespace if found."""
    start = element.tag.find("{")
    if start < 0:
        return ""
    start += 1
    end = element.tag.find("}")
    if end < 0:
        return ""
    return element.tag[start:end]


def findall(element, name):
    """Namespace aware ElementTree.Element.findall()."""
    namespace = _get_namespace(element)
    return element.findall(
        "ns:" + name if namespace else name,
        {"ns": namespace} if namespace else {},
    )


def find(element, name):
    """Namespace aware ElementTree.Element.find()."""
    namespace = _get_namespace(element)
    return element.find(
        "ns:" + name if namespace else name,
        {"ns": namespace} if namespace else {},
    )


def findtext(element, name, strict=False):
    """
    Namespace aware ElementTree.Element.findtext() with strict flag
    raises ValueError if element name not exist.
    """
    element = find(element, name)
    if element is None:
        if strict:
            raise ValueError("XML element <{0}> not found".format(name))
        return None
    return element.text or ""


def unmarshal(cls, xmlstring):
    """Unmarshal given XML string to an object of passed class."""
    return cls.fromxml(ET.fromstring(xmlstring))


def getbytes(element):
    """Convert ElementTree.Element to bytes."""
    data = io.BytesIO()
    ET.ElementTree(element).write(
        data, encoding=None, xml_declaration=False,
    )
    return data.getvalue()


def marshal(obj):
    """Get XML data as bytes of ElementTree.Element."""
    return getbytes(obj.toxml(None))

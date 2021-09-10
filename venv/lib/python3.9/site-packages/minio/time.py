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

"""Time formatter for S3 APIs."""

from __future__ import absolute_import

import locale
from contextlib import contextmanager
from datetime import datetime, timezone

from . import __LOCALE_LOCK__

_HTTP_HEADER_FORMAT = "%a, %d %b %Y %H:%M:%S GMT"


@contextmanager
def _set_locale(name):
    """Thread-safe wrapper to locale.setlocale()."""
    with __LOCALE_LOCK__:
        saved = locale.setlocale(locale.LC_ALL)
        try:
            yield locale.setlocale(locale.LC_ALL, name)
        finally:
            locale.setlocale(locale.LC_ALL, saved)


def _to_utc(value):
    """Convert to UTC time if value is not naive."""
    return (
        value.astimezone(timezone.utc).replace(tzinfo=None)
        if value.tzinfo else value
    )


def from_iso8601utc(value):
    """Parse UTC ISO-8601 formatted string to datetime."""
    if value is None:
        return None

    try:
        time = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        time = datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
    return time.replace(tzinfo=timezone.utc)


def to_iso8601utc(value):
    """Format datetime into UTC ISO-8601 formatted string."""
    if value is None:
        return None

    value = _to_utc(value)
    return (
        value.strftime("%Y-%m-%dT%H:%M:%S.") + value.strftime("%f")[:3] + "Z"
    )


def from_http_header(value):
    """Parse HTTP header date formatted string to datetime."""
    with _set_locale("C"):
        return datetime.strptime(
            value, _HTTP_HEADER_FORMAT,
        ).replace(tzinfo=timezone.utc)


def to_http_header(value):
    """Format datatime into HTTP header date formatted string."""
    with _set_locale("C"):
        return _to_utc(value).strftime(_HTTP_HEADER_FORMAT)


def to_amz_date(value):
    """Format datetime into AMZ date formatted string."""
    return _to_utc(value).strftime("%Y%m%dT%H%M%SZ")


def utcnow():
    """Timezone-aware wrapper to datetime.utcnow()."""
    return datetime.utcnow().replace(tzinfo=timezone.utc)


def to_signer_date(value):
    """Format datetime into SignatureV4 date formatted string."""
    return _to_utc(value).strftime("%Y%m%d")

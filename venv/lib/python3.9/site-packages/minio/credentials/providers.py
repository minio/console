# -*- coding: utf-8 -*-
# MinIO Python Library for Amazon S3 Compatible Cloud Storage,
# (C) 2020 MinIO, Inc.
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

"""Credential providers."""

import configparser
import ipaddress
import json
import os
import socket
import sys
import time
from abc import ABCMeta, abstractmethod
from datetime import timedelta
from urllib.parse import urlencode, urlsplit
from xml.etree import ElementTree

import urllib3

from minio.helpers import sha256_hash
from minio.signer import sign_v4_sts
from minio.time import from_iso8601utc, to_amz_date, utcnow
from minio.xml import find, findtext

from .credentials import Credentials

_MIN_DURATION_SECONDS = int(timedelta(minutes=15).total_seconds())
_MAX_DURATION_SECONDS = int(timedelta(days=7).total_seconds())
_DEFAULT_DURATION_SECONDS = int(timedelta(hours=1).total_seconds())


def _parse_credentials(data, name):
    """Parse data containing credentials XML."""
    element = ElementTree.fromstring(data)
    element = find(element, name)
    element = find(element, "Credentials")
    expiration = from_iso8601utc(findtext(element, "Expiration", True))
    return Credentials(
        findtext(element, "AccessKeyId", True),
        findtext(element, "SecretAccessKey", True),
        findtext(element, "SessionToken", True),
        expiration,
    )


def _urlopen(http_client, method, url, body=None, headers=None):
    """Wrapper of urlopen() handles HTTP status code."""
    res = http_client.urlopen(method, url, body=body, headers=headers)
    if res.status not in [200, 204, 206]:
        raise ValueError(
            "{0} failed with HTTP status code {1}".format(url, res.status),
        )
    return res


class Provider:  # pylint: disable=too-few-public-methods
    """Credential retriever."""
    __metaclass__ = ABCMeta

    @abstractmethod
    def retrieve(self):
        """Retrieve credentials and its expiry if available."""


class AssumeRoleProvider(Provider):
    """Assume-role credential provider."""

    def __init__(
            self, sts_endpoint, access_key, secret_key, duration_seconds=0,
            policy=None, region=None, role_arn=None, role_session_name=None,
            external_id=None, http_client=None,
    ):
        self._sts_endpoint = sts_endpoint
        self._access_key = access_key
        self._secret_key = secret_key
        self._region = region or ""
        self._http_client = http_client or urllib3.PoolManager(
            retries=urllib3.Retry(
                total=5,
                backoff_factor=0.2,
                status_forcelist=[500, 502, 503, 504],
            ),
        )

        query_params = {
            "Action": "AssumeRole",
            "Version": "2011-06-15",
            "DurationSeconds": str(
                duration_seconds
                if duration_seconds > _DEFAULT_DURATION_SECONDS
                else _DEFAULT_DURATION_SECONDS
            ),
        }

        if role_arn:
            query_params["RoleArn"] = role_arn
        if role_session_name:
            query_params["RoleSessionName"] = role_session_name
        if policy:
            query_params["Policy"] = policy
        if external_id:
            query_params["ExternalId"] = external_id

        self._body = urlencode(query_params)
        self._content_sha256 = sha256_hash(self._body)
        url = urlsplit(sts_endpoint)
        self._host = url.netloc
        if (
                (url.scheme == "http" and url.port == 80) or
                (url.scheme == "https" and url.port == 443)
        ):
            self._host = url.hostname
        self._credentials = None

    def retrieve(self):
        """Retrieve credentials."""
        if self._credentials and not self._credentials.is_expired():
            return self._credentials

        utctime = utcnow()
        headers = sign_v4_sts(
            "POST",
            urlsplit(self._sts_endpoint),
            self._region,
            {
                "Content-Type": "application/x-www-form-urlencoded",
                "Host": self._host,
                "X-Amz-Date": to_amz_date(utctime),
            },
            Credentials(self._access_key, self._secret_key),
            self._content_sha256,
            utctime,
        )

        res = _urlopen(
            self._http_client,
            "POST",
            self._sts_endpoint,
            body=self._body,
            headers=headers,
        )

        self._credentials = _parse_credentials(
            res.data.decode(), "AssumeRoleResult",
        )

        return self._credentials


class ChainedProvider(Provider):
    """Chained credential provider."""

    def __init__(self, providers):
        self._providers = providers
        self._provider = None
        self._credentials = None

    def retrieve(self):
        """Retrieve credentials from one of available provider."""
        if self._credentials and not self._credentials.is_expired():
            return self._credentials

        if self._provider:
            try:
                self._credentials = self._provider.retrieve()
                return self._credentials
            except ValueError:
                # Ignore this error and iterate other providers.
                pass

        for provider in self._providers:
            try:
                self._credentials = provider.retrieve()
                self._provider = provider
                return self._credentials
            except ValueError:
                # Ignore this error and iterate other providers.
                pass

        return ValueError("All providers fail to fetch credentials")


class EnvAWSProvider(Provider):
    """Credential provider from AWS environment variables."""

    def __init__(self):
        access_key = (
            os.environ.get("AWS_ACCESS_KEY_ID") or
            os.environ.get("AWS_ACCESS_KEY")
        )
        secret_key = (
            os.environ.get("AWS_SECRET_ACCESS_KEY") or
            os.environ.get("AWS_SECRET_KEY")
        )
        self._credentials = Credentials(
            access_key,
            secret_key,
            session_token=os.environ.get("AWS_SESSION_TOKEN"),
        )

    def retrieve(self):
        """Retrieve credentials."""
        return self._credentials


class EnvMinioProvider(Provider):
    """Credential provider from MinIO environment variables."""

    def __init__(self):
        self._credentials = Credentials(
            os.environ.get("MINIO_ACCESS_KEY"),
            os.environ.get("MINIO_SECRET_KEY"),
        )

    def retrieve(self):
        """Retrieve credentials."""
        return self._credentials


class AWSConfigProvider(Provider):
    """Credential provider from AWS credential file."""

    def __init__(self, filename=None, profile=None):
        self._filename = (
            filename or
            os.environ.get("AWS_SHARED_CREDENTIALS_FILE") or
            os.path.join(os.environ.get("HOME"), ".aws", "credentials")
        )
        self._profile = profile or os.environ.get("AWS_PROFILE") or "default"

    def retrieve(self):
        """Retrieve credentials from AWS configuration file."""
        parser = configparser.ConfigParser()
        parser.read(self._filename)
        access_key = parser.get(
            self._profile,
            "aws_access_key_id",
            fallback=None,
        )
        secret_key = parser.get(
            self._profile,
            "aws_secret_access_key",
            fallback=None,
        )
        session_token = parser.get(
            self._profile,
            "aws_session_token",
            fallback=None,
        )

        if not access_key:
            raise ValueError(
                (
                    "access key does not exist in profile "
                    "{0} in AWS credential file {1}"
                ).format(
                    self._profile, self._filename,
                ),
            )

        if not secret_key:
            raise ValueError(
                (
                    "secret key does not exist in profile "
                    "{0} in AWS credential file {1}"
                ).format(
                    self._profile, self._filename,
                ),
            )

        return Credentials(
            access_key,
            secret_key,
            session_token=session_token,
        )


class MinioClientConfigProvider(Provider):
    """Credential provider from MinIO Client configuration file."""

    def __init__(self, filename=None, alias=None):
        self._filename = (
            filename or
            os.path.join(
                os.environ.get("HOME"),
                "mc" if sys.platform == "win32" else ".mc",
                "config.json",
            )
        )
        self._alias = alias or os.environ.get("MINIO_ALIAS") or "s3"

    def retrieve(self):
        """Retrieve credential value from MinIO client configuration file."""
        try:
            with open(self._filename) as conf_file:
                config = json.load(conf_file)
            aliases = config.get("hosts") or config.get("aliases")
            if not aliases:
                raise ValueError(
                    "invalid configuration in file {0}".format(
                        self._filename,
                    ),
                )
            creds = aliases.get(self._alias)
            if not creds:
                raise ValueError(
                    (
                        "alias {0} not found in MinIO client"
                        "configuration file {1}"
                    ).format(
                        self._alias, self._filename,
                    ),
                )
            return Credentials(creds.get("accessKey"), creds.get("secretKey"))
        except (IOError, OSError) as exc:
            raise ValueError(
                "error in reading file {0}".format(self._filename),
            ) from exc


def _check_loopback_host(url):
    """Check whether host in url points only to localhost."""
    host = urllib3.util.parse_url(url).host
    try:
        addrs = set(info[4][0] for info in socket.getaddrinfo(host, None))
        for addr in addrs:
            if not ipaddress.ip_address(addr).is_loopback:
                raise ValueError(host + " is not loopback only host")
    except socket.gaierror as exc:
        raise ValueError("Host " + host + " is not loopback address") from exc


def _get_jwt_token(token_file):
    """Read and return content of token file. """
    try:
        with open(token_file) as file:
            return {"access_token": file.read(), "expires_in": "0"}
    except (IOError, OSError) as exc:
        raise ValueError(
            "error in reading file {0}".format(token_file),
        ) from exc


class IamAwsProvider(Provider):
    """Credential provider using IAM roles for Amazon EC2/ECS."""

    def __init__(self, custom_endpoint=None, http_client=None):
        self._custom_endpoint = custom_endpoint
        self._http_client = http_client or urllib3.PoolManager(
            retries=urllib3.Retry(
                total=5,
                backoff_factor=0.2,
                status_forcelist=[500, 502, 503, 504],
            ),
        )
        self._token_file = os.environ.get("AWS_WEB_IDENTITY_TOKEN_FILE")
        self._aws_region = os.environ.get("AWS_REGION")
        self._role_arn = os.environ.get("AWS_ROLE_ARN")
        self._role_session_name = os.environ.get("AWS_ROLE_SESSION_NAME")
        self._relative_uri = os.environ.get(
            "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        )
        if self._relative_uri and not self._relative_uri.startswith("/"):
            self._relative_uri = "/" + self._relative_uri
        self._full_uri = os.environ.get("AWS_CONTAINER_CREDENTIALS_FULL_URI")
        self._credentials = None

    def fetch(self, url):
        """Fetch credentials from EC2/ECS. """

        res = _urlopen(self._http_client, "GET", url)
        data = json.loads(res.data)
        if data.get("Code", "Success") != "Success":
            raise ValueError(
                "{0} failed with code {1} message {2}".format(
                    url, data["Code"], data.get("Message"),
                ),
            )
        data["Expiration"] = from_iso8601utc(data["Expiration"])

        return Credentials(
            data["AccessKeyId"],
            data["SecretAccessKey"],
            data["Token"],
            data["Expiration"],
        )

    def retrieve(self):
        """Retrieve credentials from WebIdentity/EC2/ECS."""

        if self._credentials and not self._credentials.is_expired():
            return self._credentials

        url = self._custom_endpoint
        if self._token_file:
            if not url:
                url = "https://sts.amazonaws.com"
                if self._aws_region:
                    url = "https://sts.{0}.amazonaws.com".format(
                        self._aws_region
                    )

            provider = WebIdentityProvider(
                lambda: _get_jwt_token(self._token_file),
                url,
                role_arn=self._role_arn,
                role_session_name=self._role_session_name,
                http_client=self._http_client,
            )
            self._credentials = provider.retrieve()
            return self._credentials

        if self._relative_uri:
            if not url:
                url = "http://169.254.170.2" + self._relative_uri
        elif self._full_uri:
            if not url:
                url = self._full_uri
            _check_loopback_host(url)
        else:
            if not url:
                url = (
                    "http://169.254.169.254" +
                    "/latest/meta-data/iam/security-credentials/"
                )

            res = _urlopen(self._http_client, "GET", url)
            role_names = res.data.decode("utf-8").split("\n")
            if not role_names:
                raise ValueError(
                    "no IAM roles attached to EC2 service {0}".format(url),
                )
            url += "/" + role_names[0].strip("\r")

        self._credentials = self.fetch(url)
        return self._credentials


class LdapIdentityProvider(Provider):
    """Credential provider using AssumeRoleWithLDAPIdentity API."""

    def __init__(
            self, sts_endpoint, ldap_username, ldap_password, http_client=None,
    ):
        self._sts_endpoint = sts_endpoint + "?" + urlencode(
            {
                "Action": "AssumeRoleWithLDAPIdentity",
                "Version": "2011-06-15",
                "LDAPUsername": ldap_username,
                "LDAPPassword": ldap_password,
            },
        )
        self._http_client = http_client or urllib3.PoolManager(
            retries=urllib3.Retry(
                total=5,
                backoff_factor=0.2,
                status_forcelist=[500, 502, 503, 504],
            ),
        )
        self._credentials = None

    def retrieve(self):
        """Retrieve credentials."""

        if self._credentials and not self._credentials.is_expired():
            return self._credentials

        res = _urlopen(
            self._http_client,
            "POST",
            self._sts_endpoint,
        )

        self._credentials = _parse_credentials(
            res.data.decode(), "AssumeRoleWithLDAPIdentityResult",
        )

        return self._credentials


class StaticProvider(Provider):
    """Fixed credential provider."""

    def __init__(self, access_key, secret_key, session_token=None):
        self._credentials = Credentials(access_key, secret_key, session_token)

    def retrieve(self):
        """Return passed credentials."""
        return self._credentials


class WebIdentityClientGrantsProvider(Provider):
    """Base class for WebIdentity and ClientGrants credentials provider."""
    __metaclass__ = ABCMeta

    def __init__(
            self, jwt_provider_func, sts_endpoint,
            duration_seconds=0, policy=None, role_arn=None,
            role_session_name=None, http_client=None,
    ):
        self._jwt_provider_func = jwt_provider_func
        self._sts_endpoint = sts_endpoint
        self._duration_seconds = duration_seconds
        self._policy = policy
        self._role_arn = role_arn
        self._role_session_name = role_session_name
        self._http_client = http_client or urllib3.PoolManager(
            retries=urllib3.Retry(
                total=5,
                backoff_factor=0.2,
                status_forcelist=[500, 502, 503, 504],
            ),
        )
        self._credentials = None

    @abstractmethod
    def _is_web_identity(self):
        """Check if derived class deal with WebIdentity."""

    def _get_duration_seconds(self, expiry):
        """Get DurationSeconds optimal value."""

        if self._duration_seconds:
            expiry = self._duration_seconds

        if expiry > _MAX_DURATION_SECONDS:
            return _MAX_DURATION_SECONDS

        if expiry <= 0:
            return expiry

        return (
            _MIN_DURATION_SECONDS if expiry < _MIN_DURATION_SECONDS else expiry
        )

    def retrieve(self):
        """Retrieve credentials."""

        if self._credentials and not self._credentials.is_expired():
            return self._credentials

        jwt = self._jwt_provider_func()

        query_params = {"Version": "2011-06-15"}
        duration_seconds = self._get_duration_seconds(
            int(jwt.get("expires_in", "0")),
        )
        if duration_seconds:
            query_params["DurationSeconds"] = str(duration_seconds)
        if self._policy:
            query_params["Policy"] = self._policy

        if self._is_web_identity():
            query_params["Action"] = "AssumeRoleWithWebIdentity"
            query_params["WebIdentityToken"] = jwt.get("access_token")
            if self._role_arn:
                query_params["RoleArn"] = self._role_arn
                query_params["RoleSessionName"] = (
                    self._role_session_name
                    if self._role_session_name
                    else str(time.time()).replace(".", "")
                )
        else:
            query_params["Action"] = "AssumeRoleWithClientGrants"
            query_params["Token"] = jwt.get("access_token")

        url = self._sts_endpoint + "?" + urlencode(query_params)
        res = _urlopen(self._http_client, "POST", url)

        self._credentials = _parse_credentials(
            res.data.decode(),
            (
                "AssumeRoleWithWebIdentityResult"
                if self._is_web_identity()
                else "AssumeRoleWithClientGrantsResult"
            ),
        )

        return self._credentials


class ClientGrantsProvider(WebIdentityClientGrantsProvider):
    """Credential provider using AssumeRoleWithClientGrants API."""

    def __init__(
            self, jwt_provider_func, sts_endpoint,
            duration_seconds=0, policy=None, http_client=None,
    ):
        super().__init__(
            jwt_provider_func, sts_endpoint, duration_seconds, policy,
            http_client=http_client,
        )

    def _is_web_identity(self):
        return False


class WebIdentityProvider(WebIdentityClientGrantsProvider):
    """Credential provider using AssumeRoleWithWebIdentity API."""

    def _is_web_identity(self):
        return True

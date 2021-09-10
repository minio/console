# -*- coding: utf-8 -*-
# MinIO Python Library for Amazon S3 Compatible Cloud Storage,
# (C) 2021 MinIO, Inc.
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

# pylint: disable=too-many-public-methods

"""MinIO Admin wrapper using MinIO Client (mc) tool."""

from __future__ import absolute_import

import json
import subprocess


class MinioAdmin:
    """MinIO Admin wrapper using MinIO Client (mc) tool."""

    def __init__(
            self, target,
            binary_path=None, config_dir=None, ignore_cert_check=False,
            timeout=None, env=None,
    ):
        self._target = target
        self._timeout = timeout
        self._env = env
        self._base_args = [binary_path or "mc", "--json"]
        if config_dir:
            self._base_args += ["--config-dir", config_dir]
        if ignore_cert_check:
            self._base_args.append("--insecure")
        self._base_args.append("admin")

    def _run(self, args, multiline=False):
        """Execute mc command and return JSON output."""
        proc = subprocess.run(
            self._base_args + args,
            capture_output=True,
            timeout=self._timeout,
            env=self._env,
            check=True,
            text=True,
        )
        if not proc.stdout:
            return [] if multiline else {}
        if multiline:
            return [json.loads(line) for line in proc.stdout.splitlines()]
        return json.loads(proc.stdout)

    def service_restart(self):
        """Restart MinIO service."""
        return self._run(["service", "restart", self._target])

    def service_stop(self):
        """Stop MinIO service."""
        return self._run(["service", "stop", self._target])

    def update(self):
        """Update MinIO."""
        return self._run(["update", self._target])

    def info(self):
        """Get MinIO server information."""
        return self._run(["info", self._target])

    def user_add(self, access_key, secret_key):
        """Add a new user."""
        return self._run(["user", "add", self._target, access_key, secret_key])

    def user_disable(self, access_key):
        """Disable user."""
        return self._run(["user", "disable", self._target, access_key])

    def user_enable(self, access_key):
        """Enable user."""
        return self._run(["user", "enable", self._target, access_key])

    def user_remove(self, access_key):
        """Remove user."""
        return self._run(["user", "remove", self._target, access_key])

    def user_info(self, access_key):
        """Get user information."""
        return self._run(["user", "info", self._target, access_key])

    def user_list(self):
        """List users."""
        return self._run(["user", "list", self._target], multiline=True)

    def group_add(self, group_name, members):
        """Add users a new or existing group."""
        return self._run(["group", "add", self._target, group_name] + members)

    def group_disable(self, group_name):
        """Disable group."""
        return self._run(["group", "disable", self._target, group_name])

    def group_enable(self, group_name):
        """Enable group."""
        return self._run(["group", "enable", self._target, group_name])

    def group_remove(self, group_name, members=None):
        """Remove group or members from a group."""
        return self._run(
            ["group", "remove", self._target, group_name] + (members or []),
        )

    def group_info(self, group_name):
        """Get group information."""
        return self._run(["group", "info", self._target, group_name])

    def group_list(self):
        """List groups."""
        return self._run(["group", "list", self._target], multiline=True)

    def policy_add(self, policy_name, policy_file):
        """Add new policy."""
        return self._run(
            ["policy", "add", self._target, policy_name, policy_file],
        )

    def policy_remove(self, policy_name):
        """Remove policy."""
        return self._run(["policy", "remove", self._target, policy_name])

    def policy_info(self, policy_name):
        """Get policy information."""
        return self._run(["policy", "info", self._target, policy_name])

    def policy_list(self):
        """List policies."""
        return self._run(["policy", "list", self._target], multiline=True)

    def policy_set(self, policy_name, user=None, group=None):
        """Set IAM policy on a user or group."""
        if (user is not None) ^ (group is not None):
            return self._run(
                [
                    "policy", "set", self._target, policy_name,
                    ("user=" if user else "group=") + (user or group),
                ],
            )
        raise ValueError("either user or group must be set")

    def config_get(self, key=None):
        """Get configuration parameters."""
        return self._run(
            ["config", "get", self._target] + [key] if key else [],
            key,
        )

    def config_set(self, key, config):
        """Set configuration parameters."""
        args = [name + "=" + value for name, value in config.items()]
        return self._run(["config", "set", self._target, key] + args)

    def config_reset(self, key, name=None):
        """Reset configuration parameters."""
        if name:
            key += ":" + name
        return self._run(["config", "reset", self._target, key])

    def config_remove(self, access_key):
        """Remove config."""
        return self._run(["config", "remove", self._target, access_key])

    def config_history(self):
        """Get historic configuration changes."""
        return self._run(["config", "history", self._target], multiline=True)

    def config_restore(self, restore_id):
        """Restore to a specific configuration history."""
        return self._run(["config", "restore", self._target, restore_id])

    def profile_start(self, profilers=()):
        """Start recording profile data."""
        args = ["profile", "start"]
        if profilers:
            args += ["--type", ",".join(profilers)]
        args.append(self._target)
        return self._run(args)

    def profile_stop(self):
        """Stop and download profile data."""
        return self._run(["profile", "stop", self._target])

    def top_locks(self):
        """Get a list of the 10 oldest locks on a MinIO cluster."""
        return self._run(["top", "locks", self._target], multiline=True)

    def prometheus_generate(self):
        """Generate prometheus configuration."""
        return self._run(["prometheus", "generate", self._target])

    def kms_key_create(self, key=None):
        """Create a new KMS master key."""
        return self._run(
            [
                "kms", "key", "create", self._target, key
            ] + ([key] if key else []),
        )

    def kms_key_status(self, key=None):
        """Get status information of a KMS master key."""
        return self._run(
            [
                "kms", "key", "status", self._target, key
            ] + ([key] if key else []),
        )

    def bucket_remote_add(
            self, src_bucket, dest_url,
            path=None, region=None, bandwidth=None, service=None,
    ):
        """Add a new remote target."""
        args = [
            "bucket", "remote", "add", self._target + "/" + src_bucket,
            dest_url, "--service", service or "replication",
        ]
        if path:
            args += ["--path", path]
        if region:
            args += ["--region", region]
        if bandwidth:
            args += ["--bandwidth", bandwidth]
        return self._run(args)

    def bucket_remote_edit(self, src_bucket, dest_url, arn):
        """Edit credentials of remote target."""
        return self._run(
            [
                "bucket", "remote", "edit", self._target + "/" + src_bucket,
                dest_url, "--arn", arn,
            ],
        )

    def bucket_remote_list(self, src_bucket=None, service=None):
        """List remote targets."""
        return self._run(
            [
                "bucket", "remote", "ls",
                self._target + ("/" + src_bucket if src_bucket else ""),
                "--service", service or "replication",
            ],
        )

    def bucket_remote_remove(self, src_bucket, arn):
        """Remove configured remote target."""
        return self._run(
            [
                "bucket", "remote", "rm", self._target + "/" + src_bucket,
                "--arn", arn,
            ],
        )

    def bucket_quota_set(self, bucket, fifo=None, hard=None):
        """Set bucket quota configuration."""
        if fifo is None and hard is None:
            raise ValueError("fifo or hard must be set")
        args = ["bucket", "quota", self._target + "/" + bucket]
        if fifo:
            args += ["--fifo", fifo]
        if hard:
            args += ["--hard", hard]
        return self._run(args)

    def bucket_quota_clear(self, bucket):
        """Clear bucket quota configuration."""
        return self._run(
            ["bucket", "quota", self._target + "/" + bucket, "--clear"],
        )

    def bucket_quota_get(self, bucket):
        """Get bucket quota configuration."""
        return self._run(["bucket", "quota", self._target + "/" + bucket])

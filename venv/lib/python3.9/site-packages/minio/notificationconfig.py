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

"""
Request/response of PutBucketNotificationConfiguration and
GetBucketNotiicationConfiguration APIs.
"""

from __future__ import absolute_import

from abc import ABCMeta

from .xml import Element, SubElement, find, findall, findtext


class FilterRule:
    """Filter rule."""

    __metaclass__ = ABCMeta

    def __init__(self, name, value):
        self._name = name
        self._value = value

    @property
    def name(self):
        """Get name."""
        return self._name

    @property
    def value(self):
        """Get value."""
        return self._value

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        name = findtext(element, "Name")
        value = findtext(element, "Value")
        return cls(name, value)

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "FilterRule")
        SubElement(element, "Name", self._name)
        SubElement(element, "Value", self._value)
        return element


class PrefixFilterRule(FilterRule):
    """Prefix filter rule."""

    def __init__(self, value):
        super().__init__("prefix", value)


class SuffixFilterRule(FilterRule):
    """Suffix filter rule."""

    def __init__(self, value):
        super().__init__("suffix", value)


class CommonConfig:
    """Common for cloud-function/queue/topic configuration."""

    __metaclass__ = ABCMeta

    def __init__(self, events, config_id, prefix_filter_rule,
                 suffix_filter_rule):
        if not events:
            raise ValueError("events must be provided")
        self._events = events
        self._config_id = config_id
        self._prefix_filter_rule = prefix_filter_rule
        self._suffix_filter_rule = suffix_filter_rule

    @property
    def events(self):
        """Get events."""
        return self._events

    @property
    def config_id(self):
        """Get configuration ID."""
        return self._config_id

    @property
    def prefix_filter_rule(self):
        """Get prefix filter rule."""
        return self._prefix_filter_rule

    @property
    def suffix_filter_rule(self):
        """Get suffix filter rule."""
        return self._suffix_filter_rule

    @staticmethod
    def parsexml(element):
        """Parse XML."""
        elements = findall(element, "Event")
        events = [tag.text for tag in elements]
        config_id = findtext(element, "Id")
        prefix_filter_rule = None
        suffix_filter_rule = None
        element = find(element, "Filter")
        if element is not None:
            element = find(element, "S3Key")
            elements = findall(element, "FilterRule")
            for tag in elements:
                filter_rule = FilterRule.fromxml(tag)
                if filter_rule.name == "prefix":
                    prefix_filter_rule = PrefixFilterRule(filter_rule.value)
                else:
                    suffix_filter_rule = SuffixFilterRule(filter_rule.value)
        return events, config_id, prefix_filter_rule, suffix_filter_rule

    def toxml(self, element):
        """Convert to XML."""
        for event in self._events:
            SubElement(element, "Event", event)
        if self._config_id is not None:
            SubElement(element, "Id", self._config_id)
        if self._prefix_filter_rule or self._suffix_filter_rule:
            rule = SubElement(element, "Filter")
            rule = SubElement(rule, "S3Key")
        if self._prefix_filter_rule:
            self._prefix_filter_rule.toxml(rule)
        if self._suffix_filter_rule:
            self._suffix_filter_rule.toxml(rule)
        return element


class CloudFuncConfig(CommonConfig):
    """Cloud function configuration."""

    def __init__(self, cloud_func, events, config_id=None,
                 prefix_filter_rule=None, suffix_filter_rule=None):
        if not cloud_func:
            raise ValueError("cloud function must be provided")
        self._cloud_func = cloud_func
        super().__init__(
            events, config_id, prefix_filter_rule, suffix_filter_rule,
        )

    @property
    def cloud_func(self):
        """Get cloud function ARN."""
        return self._cloud_func

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        cloud_func = findtext(element, "CloudFunction", True)
        (events, config_id, prefix_filter_rule,
         suffix_filter_rule) = cls.parsexml(element)
        return cls(
            cloud_func,
            events,
            config_id,
            prefix_filter_rule,
            suffix_filter_rule
        )

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "CloudFunctionConfiguration")
        SubElement(element, "CloudFunction", self._cloud_func)
        super().toxml(element)
        return element


class QueueConfig(CommonConfig):
    """Queue configuration."""

    def __init__(self, queue, events, config_id=None,
                 prefix_filter_rule=None, suffix_filter_rule=None):
        if not queue:
            raise ValueError("queue must be provided")
        self._queue = queue
        super().__init__(
            events, config_id, prefix_filter_rule, suffix_filter_rule,
        )

    @property
    def queue(self):
        """Get queue ARN."""
        return self._queue

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        queue = findtext(element, "Queue", True)
        (events, config_id, prefix_filter_rule,
         suffix_filter_rule) = cls.parsexml(element)
        return cls(
            queue,
            events,
            config_id,
            prefix_filter_rule,
            suffix_filter_rule
        )

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "QueueConfiguration")
        SubElement(element, "Queue", self._queue)
        super().toxml(element)
        return element


class TopicConfig(CommonConfig):
    """Get topic configuration."""

    def __init__(self, topic, events, config_id=None,
                 prefix_filter_rule=None, suffix_filter_rule=None):
        if not topic:
            raise ValueError("topic must be provided")
        self._topic = topic
        super().__init__(
            events, config_id, prefix_filter_rule, suffix_filter_rule,
        )

    @property
    def topic(self):
        """Get topic ARN."""
        return self._topic

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        topic = findtext(element, "Topic", True)
        (events, config_id, prefix_filter_rule,
         suffix_filter_rule) = cls.parsexml(element)
        return cls(
            topic,
            events,
            config_id,
            prefix_filter_rule,
            suffix_filter_rule
        )

    def toxml(self, element):
        """Convert to XML."""
        element = SubElement(element, "TopicConfiguration")
        SubElement(element, "Topic", self._topic)
        super().toxml(element)
        return element


class NotificationConfig:
    """Notification configuration."""

    def __init__(self, cloud_func_config_list=None, queue_config_list=None,
                 topic_config_list=None):
        self._cloud_func_config_list = cloud_func_config_list or []
        self._queue_config_list = queue_config_list or []
        self._topic_config_list = topic_config_list or []

    @property
    def cloud_func_config_list(self):
        """Get cloud function configuration list."""
        return self._cloud_func_config_list

    @property
    def queue_config_list(self):
        """Get queue configuration list."""
        return self._queue_config_list

    @property
    def topic_config_list(self):
        """Get topic configuration list."""
        return self._topic_config_list

    @classmethod
    def fromxml(cls, element):
        """Create new object with values from XML element."""
        elements = findall(element, "CloudFunctionConfiguration")
        cloud_func_config_list = []
        for tag in elements:
            cloud_func_config_list.append(CloudFuncConfig.fromxml(tag))
        elements = findall(element, "QueueConfiguration")
        queue_config_list = []
        for tag in elements:
            queue_config_list.append(QueueConfig.fromxml(tag))
        elements = findall(element, "TopicConfiguration")
        topic_config_list = []
        for tag in elements:
            topic_config_list.append(TopicConfig.fromxml(tag))
        return cls(
            cloud_func_config_list, queue_config_list, topic_config_list,
        )

    def toxml(self, element):
        """Convert to XML."""
        element = Element("NotificationConfiguration")
        for config in self._cloud_func_config_list:
            config.toxml(element)
        for config in self._queue_config_list:
            config.toxml(element)
        for config in self._topic_config_list:
            config.toxml(element)
        return element

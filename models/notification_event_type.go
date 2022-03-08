// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"encoding/json"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/validate"
)

// NotificationEventType notification event type
//
// swagger:model notificationEventType
type NotificationEventType string

func NewNotificationEventType(value NotificationEventType) *NotificationEventType {
	return &value
}

// Pointer returns a pointer to a freshly-allocated NotificationEventType.
func (m NotificationEventType) Pointer() *NotificationEventType {
	return &m
}

const (

	// NotificationEventTypePut captures enum value "put"
	NotificationEventTypePut NotificationEventType = "put"

	// NotificationEventTypeDelete captures enum value "delete"
	NotificationEventTypeDelete NotificationEventType = "delete"

	// NotificationEventTypeGet captures enum value "get"
	NotificationEventTypeGet NotificationEventType = "get"
)

// for schema
var notificationEventTypeEnum []interface{}

func init() {
	var res []NotificationEventType
	if err := json.Unmarshal([]byte(`["put","delete","get"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		notificationEventTypeEnum = append(notificationEventTypeEnum, v)
	}
}

func (m NotificationEventType) validateNotificationEventTypeEnum(path, location string, value NotificationEventType) error {
	if err := validate.EnumCase(path, location, value, notificationEventTypeEnum, true); err != nil {
		return err
	}
	return nil
}

// Validate validates this notification event type
func (m NotificationEventType) Validate(formats strfmt.Registry) error {
	var res []error

	// value enum
	if err := m.validateNotificationEventTypeEnum("", "body", m); err != nil {
		return err
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// ContextValidate validates this notification event type based on context it is used
func (m NotificationEventType) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

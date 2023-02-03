// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// ObjectBucketLifecycle object bucket lifecycle
//
// swagger:model objectBucketLifecycle
type ObjectBucketLifecycle struct {

	// expiration
	Expiration *ExpirationResponse `json:"expiration,omitempty"`

	// id
	ID string `json:"id,omitempty"`

	// prefix
	Prefix string `json:"prefix,omitempty"`

	// status
	Status string `json:"status,omitempty"`

	// tags
	Tags []*LifecycleTag `json:"tags"`

	// transition
	Transition *TransitionResponse `json:"transition,omitempty"`
}

// Validate validates this object bucket lifecycle
func (m *ObjectBucketLifecycle) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateExpiration(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTags(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTransition(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ObjectBucketLifecycle) validateExpiration(formats strfmt.Registry) error {
	if swag.IsZero(m.Expiration) { // not required
		return nil
	}

	if m.Expiration != nil {
		if err := m.Expiration.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("expiration")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("expiration")
			}
			return err
		}
	}

	return nil
}

func (m *ObjectBucketLifecycle) validateTags(formats strfmt.Registry) error {
	if swag.IsZero(m.Tags) { // not required
		return nil
	}

	for i := 0; i < len(m.Tags); i++ {
		if swag.IsZero(m.Tags[i]) { // not required
			continue
		}

		if m.Tags[i] != nil {
			if err := m.Tags[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("tags" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("tags" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *ObjectBucketLifecycle) validateTransition(formats strfmt.Registry) error {
	if swag.IsZero(m.Transition) { // not required
		return nil
	}

	if m.Transition != nil {
		if err := m.Transition.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("transition")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("transition")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this object bucket lifecycle based on the context it is used
func (m *ObjectBucketLifecycle) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateExpiration(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateTags(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateTransition(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ObjectBucketLifecycle) contextValidateExpiration(ctx context.Context, formats strfmt.Registry) error {

	if m.Expiration != nil {
		if err := m.Expiration.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("expiration")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("expiration")
			}
			return err
		}
	}

	return nil
}

func (m *ObjectBucketLifecycle) contextValidateTags(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Tags); i++ {

		if m.Tags[i] != nil {
			if err := m.Tags[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("tags" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("tags" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *ObjectBucketLifecycle) contextValidateTransition(ctx context.Context, formats strfmt.Registry) error {

	if m.Transition != nil {
		if err := m.Transition.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("transition")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("transition")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *ObjectBucketLifecycle) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ObjectBucketLifecycle) UnmarshalBinary(b []byte) error {
	var res ObjectBucketLifecycle
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

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

// PoolTolerations Tolerations allows users to set entries like effect, key, operator, value.
//
// swagger:model poolTolerations
type PoolTolerations []*PoolTolerationsItems0

// Validate validates this pool tolerations
func (m PoolTolerations) Validate(formats strfmt.Registry) error {
	var res []error

	for i := 0; i < len(m); i++ {
		if swag.IsZero(m[i]) { // not required
			continue
		}

		if m[i] != nil {
			if err := m[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName(strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName(strconv.Itoa(i))
				}
				return err
			}
		}

	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// ContextValidate validate this pool tolerations based on the context it is used
func (m PoolTolerations) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	for i := 0; i < len(m); i++ {

		if m[i] != nil {
			if err := m[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName(strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName(strconv.Itoa(i))
				}
				return err
			}
		}

	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// PoolTolerationsItems0 The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.
//
// swagger:model PoolTolerationsItems0
type PoolTolerationsItems0 struct {

	// Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.
	Effect string `json:"effect,omitempty"`

	// Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.
	Key string `json:"key,omitempty"`

	// Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.
	Operator string `json:"operator,omitempty"`

	// toleration seconds
	TolerationSeconds *PoolTolerationSeconds `json:"tolerationSeconds,omitempty"`

	// Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.
	Value string `json:"value,omitempty"`
}

// Validate validates this pool tolerations items0
func (m *PoolTolerationsItems0) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateTolerationSeconds(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PoolTolerationsItems0) validateTolerationSeconds(formats strfmt.Registry) error {
	if swag.IsZero(m.TolerationSeconds) { // not required
		return nil
	}

	if m.TolerationSeconds != nil {
		if err := m.TolerationSeconds.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("tolerationSeconds")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("tolerationSeconds")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this pool tolerations items0 based on the context it is used
func (m *PoolTolerationsItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateTolerationSeconds(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PoolTolerationsItems0) contextValidateTolerationSeconds(ctx context.Context, formats strfmt.Registry) error {

	if m.TolerationSeconds != nil {
		if err := m.TolerationSeconds.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("tolerationSeconds")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("tolerationSeconds")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *PoolTolerationsItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *PoolTolerationsItems0) UnmarshalBinary(b []byte) error {
	var res PoolTolerationsItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

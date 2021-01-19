// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// MakeBucketRequest make bucket request
//
// swagger:model makeBucketRequest
type MakeBucketRequest struct {

	// name
	// Required: true
	Name *string `json:"name"`

	// quota
	Quota *SetBucketQuota `json:"quota,omitempty"`

	// retention
	Retention *PutBucketRetentionRequest `json:"retention,omitempty"`

	// versioning
	Versioning bool `json:"versioning,omitempty"`
}

// Validate validates this make bucket request
func (m *MakeBucketRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateName(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateQuota(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateRetention(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *MakeBucketRequest) validateName(formats strfmt.Registry) error {

	if err := validate.Required("name", "body", m.Name); err != nil {
		return err
	}

	return nil
}

func (m *MakeBucketRequest) validateQuota(formats strfmt.Registry) error {

	if swag.IsZero(m.Quota) { // not required
		return nil
	}

	if m.Quota != nil {
		if err := m.Quota.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("quota")
			}
			return err
		}
	}

	return nil
}

func (m *MakeBucketRequest) validateRetention(formats strfmt.Registry) error {

	if swag.IsZero(m.Retention) { // not required
		return nil
	}

	if m.Retention != nil {
		if err := m.Retention.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("retention")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *MakeBucketRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *MakeBucketRequest) UnmarshalBinary(b []byte) error {
	var res MakeBucketRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

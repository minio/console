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

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// CustomStyles custom styles
//
// swagger:model customStyles
type CustomStyles struct {

	// background color
	BackgroundColor string `json:"backgroundColor,omitempty"`

	// button styles
	ButtonStyles *CustomButtons `json:"buttonStyles,omitempty"`

	// font color
	FontColor string `json:"fontColor,omitempty"`
}

// Validate validates this custom styles
func (m *CustomStyles) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateButtonStyles(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *CustomStyles) validateButtonStyles(formats strfmt.Registry) error {
	if swag.IsZero(m.ButtonStyles) { // not required
		return nil
	}

	if m.ButtonStyles != nil {
		if err := m.ButtonStyles.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("buttonStyles")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("buttonStyles")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this custom styles based on the context it is used
func (m *CustomStyles) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateButtonStyles(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *CustomStyles) contextValidateButtonStyles(ctx context.Context, formats strfmt.Registry) error {

	if m.ButtonStyles != nil {
		if err := m.ButtonStyles.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("buttonStyles")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("buttonStyles")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *CustomStyles) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *CustomStyles) UnmarshalBinary(b []byte) error {
	var res CustomStyles
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

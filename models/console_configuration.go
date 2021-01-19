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
)

// ConsoleConfiguration console configuration
//
// swagger:model consoleConfiguration
type ConsoleConfiguration struct {
	MetadataFields

	// image
	Image string `json:"image,omitempty"`
}

// UnmarshalJSON unmarshals this object from a JSON structure
func (m *ConsoleConfiguration) UnmarshalJSON(raw []byte) error {
	// AO0
	var aO0 MetadataFields
	if err := swag.ReadJSON(raw, &aO0); err != nil {
		return err
	}
	m.MetadataFields = aO0

	// AO1
	var dataAO1 struct {
		Image string `json:"image,omitempty"`
	}
	if err := swag.ReadJSON(raw, &dataAO1); err != nil {
		return err
	}

	m.Image = dataAO1.Image

	return nil
}

// MarshalJSON marshals this object to a JSON structure
func (m ConsoleConfiguration) MarshalJSON() ([]byte, error) {
	_parts := make([][]byte, 0, 2)

	aO0, err := swag.WriteJSON(m.MetadataFields)
	if err != nil {
		return nil, err
	}
	_parts = append(_parts, aO0)
	var dataAO1 struct {
		Image string `json:"image,omitempty"`
	}

	dataAO1.Image = m.Image

	jsonDataAO1, errAO1 := swag.WriteJSON(dataAO1)
	if errAO1 != nil {
		return nil, errAO1
	}
	_parts = append(_parts, jsonDataAO1)
	return swag.ConcatJSON(_parts...), nil
}

// Validate validates this console configuration
func (m *ConsoleConfiguration) Validate(formats strfmt.Registry) error {
	var res []error

	// validation for a type composition with MetadataFields
	if err := m.MetadataFields.Validate(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// MarshalBinary interface implementation
func (m *ConsoleConfiguration) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ConsoleConfiguration) UnmarshalBinary(b []byte) error {
	var res ConsoleConfiguration
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

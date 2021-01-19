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

// VaultConfiguration vault configuration
//
// swagger:model vaultConfiguration
type VaultConfiguration struct {

	// approle
	// Required: true
	Approle *VaultConfigurationApprole `json:"approle"`

	// endpoint
	// Required: true
	Endpoint *string `json:"endpoint"`

	// engine
	Engine string `json:"engine,omitempty"`

	// namespace
	Namespace string `json:"namespace,omitempty"`

	// prefix
	Prefix string `json:"prefix,omitempty"`

	// status
	Status *VaultConfigurationStatus `json:"status,omitempty"`

	// tls
	TLS *VaultConfigurationTLS `json:"tls,omitempty"`
}

// Validate validates this vault configuration
func (m *VaultConfiguration) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateApprole(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateEndpoint(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateStatus(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTLS(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *VaultConfiguration) validateApprole(formats strfmt.Registry) error {

	if err := validate.Required("approle", "body", m.Approle); err != nil {
		return err
	}

	if m.Approle != nil {
		if err := m.Approle.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("approle")
			}
			return err
		}
	}

	return nil
}

func (m *VaultConfiguration) validateEndpoint(formats strfmt.Registry) error {

	if err := validate.Required("endpoint", "body", m.Endpoint); err != nil {
		return err
	}

	return nil
}

func (m *VaultConfiguration) validateStatus(formats strfmt.Registry) error {

	if swag.IsZero(m.Status) { // not required
		return nil
	}

	if m.Status != nil {
		if err := m.Status.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("status")
			}
			return err
		}
	}

	return nil
}

func (m *VaultConfiguration) validateTLS(formats strfmt.Registry) error {

	if swag.IsZero(m.TLS) { // not required
		return nil
	}

	if m.TLS != nil {
		if err := m.TLS.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("tls")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *VaultConfiguration) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *VaultConfiguration) UnmarshalBinary(b []byte) error {
	var res VaultConfiguration
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// VaultConfigurationApprole vault configuration approle
//
// swagger:model VaultConfigurationApprole
type VaultConfigurationApprole struct {

	// engine
	Engine string `json:"engine,omitempty"`

	// id
	// Required: true
	ID *string `json:"id"`

	// retry
	Retry int64 `json:"retry,omitempty"`

	// secret
	// Required: true
	Secret *string `json:"secret"`
}

// Validate validates this vault configuration approle
func (m *VaultConfigurationApprole) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSecret(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *VaultConfigurationApprole) validateID(formats strfmt.Registry) error {

	if err := validate.Required("approle"+"."+"id", "body", m.ID); err != nil {
		return err
	}

	return nil
}

func (m *VaultConfigurationApprole) validateSecret(formats strfmt.Registry) error {

	if err := validate.Required("approle"+"."+"secret", "body", m.Secret); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *VaultConfigurationApprole) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *VaultConfigurationApprole) UnmarshalBinary(b []byte) error {
	var res VaultConfigurationApprole
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// VaultConfigurationStatus vault configuration status
//
// swagger:model VaultConfigurationStatus
type VaultConfigurationStatus struct {

	// ping
	Ping int64 `json:"ping,omitempty"`
}

// Validate validates this vault configuration status
func (m *VaultConfigurationStatus) Validate(formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *VaultConfigurationStatus) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *VaultConfigurationStatus) UnmarshalBinary(b []byte) error {
	var res VaultConfigurationStatus
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// VaultConfigurationTLS vault configuration TLS
//
// swagger:model VaultConfigurationTLS
type VaultConfigurationTLS struct {

	// ca
	Ca string `json:"ca,omitempty"`

	// crt
	Crt string `json:"crt,omitempty"`

	// key
	Key string `json:"key,omitempty"`
}

// Validate validates this vault configuration TLS
func (m *VaultConfigurationTLS) Validate(formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *VaultConfigurationTLS) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *VaultConfigurationTLS) UnmarshalBinary(b []byte) error {
	var res VaultConfigurationTLS
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

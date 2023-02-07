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

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// AzureConfiguration azure configuration
//
// swagger:model azureConfiguration
type AzureConfiguration struct {

	// keyvault
	// Required: true
	Keyvault *AzureConfigurationKeyvault `json:"keyvault"`
}

// Validate validates this azure configuration
func (m *AzureConfiguration) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateKeyvault(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AzureConfiguration) validateKeyvault(formats strfmt.Registry) error {

	if err := validate.Required("keyvault", "body", m.Keyvault); err != nil {
		return err
	}

	if m.Keyvault != nil {
		if err := m.Keyvault.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("keyvault")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("keyvault")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this azure configuration based on the context it is used
func (m *AzureConfiguration) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateKeyvault(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AzureConfiguration) contextValidateKeyvault(ctx context.Context, formats strfmt.Registry) error {

	if m.Keyvault != nil {
		if err := m.Keyvault.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("keyvault")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("keyvault")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *AzureConfiguration) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *AzureConfiguration) UnmarshalBinary(b []byte) error {
	var res AzureConfiguration
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// AzureConfigurationKeyvault azure configuration keyvault
//
// swagger:model AzureConfigurationKeyvault
type AzureConfigurationKeyvault struct {

	// credentials
	Credentials *AzureConfigurationKeyvaultCredentials `json:"credentials,omitempty"`

	// endpoint
	// Required: true
	Endpoint *string `json:"endpoint"`
}

// Validate validates this azure configuration keyvault
func (m *AzureConfigurationKeyvault) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCredentials(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateEndpoint(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AzureConfigurationKeyvault) validateCredentials(formats strfmt.Registry) error {
	if swag.IsZero(m.Credentials) { // not required
		return nil
	}

	if m.Credentials != nil {
		if err := m.Credentials.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("keyvault" + "." + "credentials")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("keyvault" + "." + "credentials")
			}
			return err
		}
	}

	return nil
}

func (m *AzureConfigurationKeyvault) validateEndpoint(formats strfmt.Registry) error {

	if err := validate.Required("keyvault"+"."+"endpoint", "body", m.Endpoint); err != nil {
		return err
	}

	return nil
}

// ContextValidate validate this azure configuration keyvault based on the context it is used
func (m *AzureConfigurationKeyvault) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateCredentials(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AzureConfigurationKeyvault) contextValidateCredentials(ctx context.Context, formats strfmt.Registry) error {

	if m.Credentials != nil {
		if err := m.Credentials.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("keyvault" + "." + "credentials")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("keyvault" + "." + "credentials")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *AzureConfigurationKeyvault) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *AzureConfigurationKeyvault) UnmarshalBinary(b []byte) error {
	var res AzureConfigurationKeyvault
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// AzureConfigurationKeyvaultCredentials azure configuration keyvault credentials
//
// swagger:model AzureConfigurationKeyvaultCredentials
type AzureConfigurationKeyvaultCredentials struct {

	// client id
	// Required: true
	ClientID *string `json:"client_id"`

	// client secret
	// Required: true
	ClientSecret *string `json:"client_secret"`

	// tenant id
	// Required: true
	TenantID *string `json:"tenant_id"`
}

// Validate validates this azure configuration keyvault credentials
func (m *AzureConfigurationKeyvaultCredentials) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateClientID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateClientSecret(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTenantID(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AzureConfigurationKeyvaultCredentials) validateClientID(formats strfmt.Registry) error {

	if err := validate.Required("keyvault"+"."+"credentials"+"."+"client_id", "body", m.ClientID); err != nil {
		return err
	}

	return nil
}

func (m *AzureConfigurationKeyvaultCredentials) validateClientSecret(formats strfmt.Registry) error {

	if err := validate.Required("keyvault"+"."+"credentials"+"."+"client_secret", "body", m.ClientSecret); err != nil {
		return err
	}

	return nil
}

func (m *AzureConfigurationKeyvaultCredentials) validateTenantID(formats strfmt.Registry) error {

	if err := validate.Required("keyvault"+"."+"credentials"+"."+"tenant_id", "body", m.TenantID); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this azure configuration keyvault credentials based on context it is used
func (m *AzureConfigurationKeyvaultCredentials) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *AzureConfigurationKeyvaultCredentials) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *AzureConfigurationKeyvaultCredentials) UnmarshalBinary(b []byte) error {
	var res AzureConfigurationKeyvaultCredentials
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

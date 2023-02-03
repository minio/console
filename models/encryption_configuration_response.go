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
)

// EncryptionConfigurationResponse encryption configuration response
//
// swagger:model encryptionConfigurationResponse
type EncryptionConfigurationResponse struct {
	MetadataFields

	// aws
	Aws *AwsConfiguration `json:"aws,omitempty"`

	// azure
	Azure *AzureConfiguration `json:"azure,omitempty"`

	// gcp
	Gcp *GcpConfiguration `json:"gcp,omitempty"`

	// gemalto
	Gemalto *GemaltoConfigurationResponse `json:"gemalto,omitempty"`

	// image
	Image string `json:"image,omitempty"`

	// kms mtls
	KmsMtls *EncryptionConfigurationResponseAO1KmsMtls `json:"kms_mtls,omitempty"`

	// minio mtls
	MinioMtls *CertificateInfo `json:"minio_mtls,omitempty"`

	// raw
	Raw string `json:"raw,omitempty"`

	// replicas
	Replicas string `json:"replicas,omitempty"`

	// security context
	SecurityContext *SecurityContext `json:"securityContext,omitempty"`

	// server tls
	ServerTLS *CertificateInfo `json:"server_tls,omitempty"`

	// vault
	Vault *VaultConfigurationResponse `json:"vault,omitempty"`
}

// UnmarshalJSON unmarshals this object from a JSON structure
func (m *EncryptionConfigurationResponse) UnmarshalJSON(raw []byte) error {
	// AO0
	var aO0 MetadataFields
	if err := swag.ReadJSON(raw, &aO0); err != nil {
		return err
	}
	m.MetadataFields = aO0

	// AO1
	var dataAO1 struct {
		Aws *AwsConfiguration `json:"aws,omitempty"`

		Azure *AzureConfiguration `json:"azure,omitempty"`

		Gcp *GcpConfiguration `json:"gcp,omitempty"`

		Gemalto *GemaltoConfigurationResponse `json:"gemalto,omitempty"`

		Image string `json:"image,omitempty"`

		KmsMtls *EncryptionConfigurationResponseAO1KmsMtls `json:"kms_mtls,omitempty"`

		MinioMtls *CertificateInfo `json:"minio_mtls,omitempty"`

		Raw string `json:"raw,omitempty"`

		Replicas string `json:"replicas,omitempty"`

		SecurityContext *SecurityContext `json:"securityContext,omitempty"`

		ServerTLS *CertificateInfo `json:"server_tls,omitempty"`

		Vault *VaultConfigurationResponse `json:"vault,omitempty"`
	}
	if err := swag.ReadJSON(raw, &dataAO1); err != nil {
		return err
	}

	m.Aws = dataAO1.Aws

	m.Azure = dataAO1.Azure

	m.Gcp = dataAO1.Gcp

	m.Gemalto = dataAO1.Gemalto

	m.Image = dataAO1.Image

	m.KmsMtls = dataAO1.KmsMtls

	m.MinioMtls = dataAO1.MinioMtls

	m.Raw = dataAO1.Raw

	m.Replicas = dataAO1.Replicas

	m.SecurityContext = dataAO1.SecurityContext

	m.ServerTLS = dataAO1.ServerTLS

	m.Vault = dataAO1.Vault

	return nil
}

// MarshalJSON marshals this object to a JSON structure
func (m EncryptionConfigurationResponse) MarshalJSON() ([]byte, error) {
	_parts := make([][]byte, 0, 2)

	aO0, err := swag.WriteJSON(m.MetadataFields)
	if err != nil {
		return nil, err
	}
	_parts = append(_parts, aO0)
	var dataAO1 struct {
		Aws *AwsConfiguration `json:"aws,omitempty"`

		Azure *AzureConfiguration `json:"azure,omitempty"`

		Gcp *GcpConfiguration `json:"gcp,omitempty"`

		Gemalto *GemaltoConfigurationResponse `json:"gemalto,omitempty"`

		Image string `json:"image,omitempty"`

		KmsMtls *EncryptionConfigurationResponseAO1KmsMtls `json:"kms_mtls,omitempty"`

		MinioMtls *CertificateInfo `json:"minio_mtls,omitempty"`

		Raw string `json:"raw,omitempty"`

		Replicas string `json:"replicas,omitempty"`

		SecurityContext *SecurityContext `json:"securityContext,omitempty"`

		ServerTLS *CertificateInfo `json:"server_tls,omitempty"`

		Vault *VaultConfigurationResponse `json:"vault,omitempty"`
	}

	dataAO1.Aws = m.Aws

	dataAO1.Azure = m.Azure

	dataAO1.Gcp = m.Gcp

	dataAO1.Gemalto = m.Gemalto

	dataAO1.Image = m.Image

	dataAO1.KmsMtls = m.KmsMtls

	dataAO1.MinioMtls = m.MinioMtls

	dataAO1.Raw = m.Raw

	dataAO1.Replicas = m.Replicas

	dataAO1.SecurityContext = m.SecurityContext

	dataAO1.ServerTLS = m.ServerTLS

	dataAO1.Vault = m.Vault

	jsonDataAO1, errAO1 := swag.WriteJSON(dataAO1)
	if errAO1 != nil {
		return nil, errAO1
	}
	_parts = append(_parts, jsonDataAO1)
	return swag.ConcatJSON(_parts...), nil
}

// Validate validates this encryption configuration response
func (m *EncryptionConfigurationResponse) Validate(formats strfmt.Registry) error {
	var res []error

	// validation for a type composition with MetadataFields
	if err := m.MetadataFields.Validate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateAws(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateAzure(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateGcp(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateGemalto(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateKmsMtls(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateMinioMtls(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSecurityContext(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateServerTLS(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateVault(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EncryptionConfigurationResponse) validateAws(formats strfmt.Registry) error {

	if swag.IsZero(m.Aws) { // not required
		return nil
	}

	if m.Aws != nil {
		if err := m.Aws.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("aws")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("aws")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateAzure(formats strfmt.Registry) error {

	if swag.IsZero(m.Azure) { // not required
		return nil
	}

	if m.Azure != nil {
		if err := m.Azure.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("azure")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("azure")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateGcp(formats strfmt.Registry) error {

	if swag.IsZero(m.Gcp) { // not required
		return nil
	}

	if m.Gcp != nil {
		if err := m.Gcp.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gcp")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gcp")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateGemalto(formats strfmt.Registry) error {

	if swag.IsZero(m.Gemalto) { // not required
		return nil
	}

	if m.Gemalto != nil {
		if err := m.Gemalto.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gemalto")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gemalto")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateKmsMtls(formats strfmt.Registry) error {

	if swag.IsZero(m.KmsMtls) { // not required
		return nil
	}

	if m.KmsMtls != nil {
		if err := m.KmsMtls.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("kms_mtls")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("kms_mtls")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateMinioMtls(formats strfmt.Registry) error {

	if swag.IsZero(m.MinioMtls) { // not required
		return nil
	}

	if m.MinioMtls != nil {
		if err := m.MinioMtls.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("minio_mtls")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("minio_mtls")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateSecurityContext(formats strfmt.Registry) error {

	if swag.IsZero(m.SecurityContext) { // not required
		return nil
	}

	if m.SecurityContext != nil {
		if err := m.SecurityContext.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("securityContext")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("securityContext")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateServerTLS(formats strfmt.Registry) error {

	if swag.IsZero(m.ServerTLS) { // not required
		return nil
	}

	if m.ServerTLS != nil {
		if err := m.ServerTLS.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("server_tls")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("server_tls")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateVault(formats strfmt.Registry) error {

	if swag.IsZero(m.Vault) { // not required
		return nil
	}

	if m.Vault != nil {
		if err := m.Vault.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("vault")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("vault")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this encryption configuration response based on the context it is used
func (m *EncryptionConfigurationResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	// validation for a type composition with MetadataFields
	if err := m.MetadataFields.ContextValidate(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateAws(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateAzure(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateGcp(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateGemalto(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateKmsMtls(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateMinioMtls(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateSecurityContext(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateServerTLS(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateVault(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateAws(ctx context.Context, formats strfmt.Registry) error {

	if m.Aws != nil {
		if err := m.Aws.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("aws")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("aws")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateAzure(ctx context.Context, formats strfmt.Registry) error {

	if m.Azure != nil {
		if err := m.Azure.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("azure")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("azure")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateGcp(ctx context.Context, formats strfmt.Registry) error {

	if m.Gcp != nil {
		if err := m.Gcp.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gcp")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gcp")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateGemalto(ctx context.Context, formats strfmt.Registry) error {

	if m.Gemalto != nil {
		if err := m.Gemalto.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gemalto")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gemalto")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateKmsMtls(ctx context.Context, formats strfmt.Registry) error {

	if m.KmsMtls != nil {
		if err := m.KmsMtls.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("kms_mtls")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("kms_mtls")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateMinioMtls(ctx context.Context, formats strfmt.Registry) error {

	if m.MinioMtls != nil {
		if err := m.MinioMtls.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("minio_mtls")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("minio_mtls")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateSecurityContext(ctx context.Context, formats strfmt.Registry) error {

	if m.SecurityContext != nil {
		if err := m.SecurityContext.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("securityContext")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("securityContext")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateServerTLS(ctx context.Context, formats strfmt.Registry) error {

	if m.ServerTLS != nil {
		if err := m.ServerTLS.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("server_tls")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("server_tls")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateVault(ctx context.Context, formats strfmt.Registry) error {

	if m.Vault != nil {
		if err := m.Vault.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("vault")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("vault")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *EncryptionConfigurationResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *EncryptionConfigurationResponse) UnmarshalBinary(b []byte) error {
	var res EncryptionConfigurationResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// EncryptionConfigurationResponseAO1KmsMtls encryption configuration response a o1 kms mtls
//
// swagger:model EncryptionConfigurationResponseAO1KmsMtls
type EncryptionConfigurationResponseAO1KmsMtls struct {

	// ca
	Ca *CertificateInfo `json:"ca,omitempty"`

	// crt
	Crt *CertificateInfo `json:"crt,omitempty"`
}

// Validate validates this encryption configuration response a o1 kms mtls
func (m *EncryptionConfigurationResponseAO1KmsMtls) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCa(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateCrt(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EncryptionConfigurationResponseAO1KmsMtls) validateCa(formats strfmt.Registry) error {
	if swag.IsZero(m.Ca) { // not required
		return nil
	}

	if m.Ca != nil {
		if err := m.Ca.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("kms_mtls" + "." + "ca")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("kms_mtls" + "." + "ca")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponseAO1KmsMtls) validateCrt(formats strfmt.Registry) error {
	if swag.IsZero(m.Crt) { // not required
		return nil
	}

	if m.Crt != nil {
		if err := m.Crt.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("kms_mtls" + "." + "crt")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("kms_mtls" + "." + "crt")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this encryption configuration response a o1 kms mtls based on the context it is used
func (m *EncryptionConfigurationResponseAO1KmsMtls) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateCa(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateCrt(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EncryptionConfigurationResponseAO1KmsMtls) contextValidateCa(ctx context.Context, formats strfmt.Registry) error {

	if m.Ca != nil {
		if err := m.Ca.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("kms_mtls" + "." + "ca")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("kms_mtls" + "." + "ca")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponseAO1KmsMtls) contextValidateCrt(ctx context.Context, formats strfmt.Registry) error {

	if m.Crt != nil {
		if err := m.Crt.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("kms_mtls" + "." + "crt")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("kms_mtls" + "." + "crt")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *EncryptionConfigurationResponseAO1KmsMtls) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *EncryptionConfigurationResponseAO1KmsMtls) UnmarshalBinary(b []byte) error {
	var res EncryptionConfigurationResponseAO1KmsMtls
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

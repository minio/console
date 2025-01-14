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
	"encoding/json"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// RemoteBucket remote bucket
//
// swagger:model remoteBucket
type RemoteBucket struct {

	// access key
	// Required: true
	// Min Length: 3
	AccessKey *string `json:"accessKey"`

	// bandwidth
	Bandwidth int64 `json:"bandwidth,omitempty"`

	// health check period
	HealthCheckPeriod int64 `json:"healthCheckPeriod,omitempty"`

	// remote a r n
	// Required: true
	RemoteARN *string `json:"remoteARN"`

	// secret key
	// Min Length: 8
	SecretKey string `json:"secretKey,omitempty"`

	// service
	// Enum: [replication]
	Service string `json:"service,omitempty"`

	// source bucket
	// Required: true
	SourceBucket *string `json:"sourceBucket"`

	// status
	Status string `json:"status,omitempty"`

	// sync mode
	SyncMode string `json:"syncMode,omitempty"`

	// target bucket
	TargetBucket string `json:"targetBucket,omitempty"`

	// target URL
	TargetURL string `json:"targetURL,omitempty"`
}

// Validate validates this remote bucket
func (m *RemoteBucket) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateAccessKey(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateRemoteARN(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSecretKey(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateService(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSourceBucket(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *RemoteBucket) validateAccessKey(formats strfmt.Registry) error {

	if err := validate.Required("accessKey", "body", m.AccessKey); err != nil {
		return err
	}

	if err := validate.MinLength("accessKey", "body", *m.AccessKey, 3); err != nil {
		return err
	}

	return nil
}

func (m *RemoteBucket) validateRemoteARN(formats strfmt.Registry) error {

	if err := validate.Required("remoteARN", "body", m.RemoteARN); err != nil {
		return err
	}

	return nil
}

func (m *RemoteBucket) validateSecretKey(formats strfmt.Registry) error {
	if swag.IsZero(m.SecretKey) { // not required
		return nil
	}

	if err := validate.MinLength("secretKey", "body", m.SecretKey, 8); err != nil {
		return err
	}

	return nil
}

var remoteBucketTypeServicePropEnum []interface{}

func init() {
	var res []string
	if err := json.Unmarshal([]byte(`["replication"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		remoteBucketTypeServicePropEnum = append(remoteBucketTypeServicePropEnum, v)
	}
}

const (

	// RemoteBucketServiceReplication captures enum value "replication"
	RemoteBucketServiceReplication string = "replication"
)

// prop value enum
func (m *RemoteBucket) validateServiceEnum(path, location string, value string) error {
	if err := validate.EnumCase(path, location, value, remoteBucketTypeServicePropEnum, true); err != nil {
		return err
	}
	return nil
}

func (m *RemoteBucket) validateService(formats strfmt.Registry) error {
	if swag.IsZero(m.Service) { // not required
		return nil
	}

	// value enum
	if err := m.validateServiceEnum("service", "body", m.Service); err != nil {
		return err
	}

	return nil
}

func (m *RemoteBucket) validateSourceBucket(formats strfmt.Registry) error {

	if err := validate.Required("sourceBucket", "body", m.SourceBucket); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this remote bucket based on context it is used
func (m *RemoteBucket) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *RemoteBucket) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *RemoteBucket) UnmarshalBinary(b []byte) error {
	var res RemoteBucket
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

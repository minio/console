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
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// TenantList tenant list
//
// swagger:model tenantList
type TenantList struct {

	// creation date
	CreationDate string `json:"creation_date,omitempty"`

	// current state
	CurrentState string `json:"currentState,omitempty"`

	// deletion date
	DeletionDate string `json:"deletion_date,omitempty"`

	// health status
	HealthStatus string `json:"health_status,omitempty"`

	// instance count
	InstanceCount int64 `json:"instance_count,omitempty"`

	// name
	Name string `json:"name,omitempty"`

	// namespace
	Namespace string `json:"namespace,omitempty"`

	// pool count
	PoolCount int64 `json:"pool_count,omitempty"`

	// total size
	TotalSize int64 `json:"total_size,omitempty"`

	// volume count
	VolumeCount int64 `json:"volume_count,omitempty"`
}

// Validate validates this tenant list
func (m *TenantList) Validate(formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *TenantList) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *TenantList) UnmarshalBinary(b []byte) error {
	var res TenantList
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

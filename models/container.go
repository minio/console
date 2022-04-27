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
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// Container container
//
// swagger:model container
type Container struct {

	// args
	Args []string `json:"args"`

	// container ID
	ContainerID string `json:"containerID,omitempty"`

	// environment variables
	EnvironmentVariables []*EnvironmentVariable `json:"environmentVariables"`

	// host ports
	HostPorts []string `json:"hostPorts"`

	// image
	Image string `json:"image,omitempty"`

	// image ID
	ImageID string `json:"imageID,omitempty"`

	// last state
	LastState *State `json:"lastState,omitempty"`

	// mounts
	Mounts []*Mount `json:"mounts"`

	// name
	Name string `json:"name,omitempty"`

	// ports
	Ports []string `json:"ports"`

	// ready
	Ready bool `json:"ready,omitempty"`

	// restart count
	RestartCount int64 `json:"restartCount,omitempty"`

	// state
	State *State `json:"state,omitempty"`
}

// Validate validates this container
func (m *Container) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateEnvironmentVariables(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateLastState(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateMounts(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateState(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Container) validateEnvironmentVariables(formats strfmt.Registry) error {
	if swag.IsZero(m.EnvironmentVariables) { // not required
		return nil
	}

	for i := 0; i < len(m.EnvironmentVariables); i++ {
		if swag.IsZero(m.EnvironmentVariables[i]) { // not required
			continue
		}

		if m.EnvironmentVariables[i] != nil {
			if err := m.EnvironmentVariables[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("environmentVariables" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("environmentVariables" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *Container) validateLastState(formats strfmt.Registry) error {
	if swag.IsZero(m.LastState) { // not required
		return nil
	}

	if m.LastState != nil {
		if err := m.LastState.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("lastState")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("lastState")
			}
			return err
		}
	}

	return nil
}

func (m *Container) validateMounts(formats strfmt.Registry) error {
	if swag.IsZero(m.Mounts) { // not required
		return nil
	}

	for i := 0; i < len(m.Mounts); i++ {
		if swag.IsZero(m.Mounts[i]) { // not required
			continue
		}

		if m.Mounts[i] != nil {
			if err := m.Mounts[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("mounts" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("mounts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *Container) validateState(formats strfmt.Registry) error {
	if swag.IsZero(m.State) { // not required
		return nil
	}

	if m.State != nil {
		if err := m.State.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("state")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("state")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this container based on the context it is used
func (m *Container) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateEnvironmentVariables(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateLastState(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateMounts(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateState(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Container) contextValidateEnvironmentVariables(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.EnvironmentVariables); i++ {

		if m.EnvironmentVariables[i] != nil {
			if err := m.EnvironmentVariables[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("environmentVariables" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("environmentVariables" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *Container) contextValidateLastState(ctx context.Context, formats strfmt.Registry) error {

	if m.LastState != nil {
		if err := m.LastState.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("lastState")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("lastState")
			}
			return err
		}
	}

	return nil
}

func (m *Container) contextValidateMounts(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Mounts); i++ {

		if m.Mounts[i] != nil {
			if err := m.Mounts[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("mounts" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("mounts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *Container) contextValidateState(ctx context.Context, formats strfmt.Registry) error {

	if m.State != nil {
		if err := m.State.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("state")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("state")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *Container) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *Container) UnmarshalBinary(b []byte) error {
	var res Container
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

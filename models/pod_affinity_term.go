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
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// PodAffinityTerm Required. A pod affinity term, associated with the corresponding weight.
//
// swagger:model podAffinityTerm
type PodAffinityTerm struct {

	// label selector
	LabelSelector *PodAffinityTermLabelSelector `json:"labelSelector,omitempty"`

	// namespaces specifies which namespaces the labelSelector applies to (matches against); null or empty list means "this pod's namespace"
	Namespaces []string `json:"namespaces"`

	// This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
	// Required: true
	TopologyKey *string `json:"topologyKey"`
}

// Validate validates this pod affinity term
func (m *PodAffinityTerm) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateLabelSelector(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTopologyKey(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PodAffinityTerm) validateLabelSelector(formats strfmt.Registry) error {

	if swag.IsZero(m.LabelSelector) { // not required
		return nil
	}

	if m.LabelSelector != nil {
		if err := m.LabelSelector.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("labelSelector")
			}
			return err
		}
	}

	return nil
}

func (m *PodAffinityTerm) validateTopologyKey(formats strfmt.Registry) error {

	if err := validate.Required("topologyKey", "body", m.TopologyKey); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *PodAffinityTerm) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *PodAffinityTerm) UnmarshalBinary(b []byte) error {
	var res PodAffinityTerm
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// PodAffinityTermLabelSelector A label query over a set of resources, in this case pods.
//
// swagger:model PodAffinityTermLabelSelector
type PodAffinityTermLabelSelector struct {

	// matchExpressions is a list of label selector requirements. The requirements are ANDed.
	MatchExpressions []*PodAffinityTermLabelSelectorMatchExpressionsItems0 `json:"matchExpressions"`

	// matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
	MatchLabels map[string]string `json:"matchLabels,omitempty"`
}

// Validate validates this pod affinity term label selector
func (m *PodAffinityTermLabelSelector) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateMatchExpressions(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PodAffinityTermLabelSelector) validateMatchExpressions(formats strfmt.Registry) error {

	if swag.IsZero(m.MatchExpressions) { // not required
		return nil
	}

	for i := 0; i < len(m.MatchExpressions); i++ {
		if swag.IsZero(m.MatchExpressions[i]) { // not required
			continue
		}

		if m.MatchExpressions[i] != nil {
			if err := m.MatchExpressions[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("labelSelector" + "." + "matchExpressions" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *PodAffinityTermLabelSelector) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *PodAffinityTermLabelSelector) UnmarshalBinary(b []byte) error {
	var res PodAffinityTermLabelSelector
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// PodAffinityTermLabelSelectorMatchExpressionsItems0 A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
//
// swagger:model PodAffinityTermLabelSelectorMatchExpressionsItems0
type PodAffinityTermLabelSelectorMatchExpressionsItems0 struct {

	// key is the label key that the selector applies to.
	// Required: true
	Key *string `json:"key"`

	// operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.
	// Required: true
	Operator *string `json:"operator"`

	// values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
	Values []string `json:"values"`
}

// Validate validates this pod affinity term label selector match expressions items0
func (m *PodAffinityTermLabelSelectorMatchExpressionsItems0) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateKey(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateOperator(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PodAffinityTermLabelSelectorMatchExpressionsItems0) validateKey(formats strfmt.Registry) error {

	if err := validate.Required("key", "body", m.Key); err != nil {
		return err
	}

	return nil
}

func (m *PodAffinityTermLabelSelectorMatchExpressionsItems0) validateOperator(formats strfmt.Registry) error {

	if err := validate.Required("operator", "body", m.Operator); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *PodAffinityTermLabelSelectorMatchExpressionsItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *PodAffinityTermLabelSelectorMatchExpressionsItems0) UnmarshalBinary(b []byte) error {
	var res PodAffinityTermLabelSelectorMatchExpressionsItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

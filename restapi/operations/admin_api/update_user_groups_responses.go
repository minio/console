// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

package admin_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/mcs/models"
)

// UpdateUserGroupsOKCode is the HTTP code returned for type UpdateUserGroupsOK
const UpdateUserGroupsOKCode int = 200

/*UpdateUserGroupsOK A successful response.

swagger:response updateUserGroupsOK
*/
type UpdateUserGroupsOK struct {

	/*
	  In: Body
	*/
	Payload *models.User `json:"body,omitempty"`
}

// NewUpdateUserGroupsOK creates UpdateUserGroupsOK with default headers values
func NewUpdateUserGroupsOK() *UpdateUserGroupsOK {

	return &UpdateUserGroupsOK{}
}

// WithPayload adds the payload to the update user groups o k response
func (o *UpdateUserGroupsOK) WithPayload(payload *models.User) *UpdateUserGroupsOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update user groups o k response
func (o *UpdateUserGroupsOK) SetPayload(payload *models.User) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdateUserGroupsOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*UpdateUserGroupsDefault Generic error response.

swagger:response updateUserGroupsDefault
*/
type UpdateUserGroupsDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewUpdateUserGroupsDefault creates UpdateUserGroupsDefault with default headers values
func NewUpdateUserGroupsDefault(code int) *UpdateUserGroupsDefault {
	if code <= 0 {
		code = 500
	}

	return &UpdateUserGroupsDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the update user groups default response
func (o *UpdateUserGroupsDefault) WithStatusCode(code int) *UpdateUserGroupsDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the update user groups default response
func (o *UpdateUserGroupsDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the update user groups default response
func (o *UpdateUserGroupsDefault) WithPayload(payload *models.Error) *UpdateUserGroupsDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update user groups default response
func (o *UpdateUserGroupsDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdateUserGroupsDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

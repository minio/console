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

package user

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// CreateAUserServiceAccountCreatedCode is the HTTP code returned for type CreateAUserServiceAccountCreated
const CreateAUserServiceAccountCreatedCode int = 201

/*
CreateAUserServiceAccountCreated A successful response.

swagger:response createAUserServiceAccountCreated
*/
type CreateAUserServiceAccountCreated struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceAccountCreds `json:"body,omitempty"`
}

// NewCreateAUserServiceAccountCreated creates CreateAUserServiceAccountCreated with default headers values
func NewCreateAUserServiceAccountCreated() *CreateAUserServiceAccountCreated {

	return &CreateAUserServiceAccountCreated{}
}

// WithPayload adds the payload to the create a user service account created response
func (o *CreateAUserServiceAccountCreated) WithPayload(payload *models.ServiceAccountCreds) *CreateAUserServiceAccountCreated {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the create a user service account created response
func (o *CreateAUserServiceAccountCreated) SetPayload(payload *models.ServiceAccountCreds) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *CreateAUserServiceAccountCreated) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(201)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*
CreateAUserServiceAccountDefault Generic error response.

swagger:response createAUserServiceAccountDefault
*/
type CreateAUserServiceAccountDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewCreateAUserServiceAccountDefault creates CreateAUserServiceAccountDefault with default headers values
func NewCreateAUserServiceAccountDefault(code int) *CreateAUserServiceAccountDefault {
	if code <= 0 {
		code = 500
	}

	return &CreateAUserServiceAccountDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the create a user service account default response
func (o *CreateAUserServiceAccountDefault) WithStatusCode(code int) *CreateAUserServiceAccountDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the create a user service account default response
func (o *CreateAUserServiceAccountDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the create a user service account default response
func (o *CreateAUserServiceAccountDefault) WithPayload(payload *models.Error) *CreateAUserServiceAccountDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the create a user service account default response
func (o *CreateAUserServiceAccountDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *CreateAUserServiceAccountDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

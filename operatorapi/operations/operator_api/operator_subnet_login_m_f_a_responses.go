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

package operator_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// OperatorSubnetLoginMFAOKCode is the HTTP code returned for type OperatorSubnetLoginMFAOK
const OperatorSubnetLoginMFAOKCode int = 200

/*OperatorSubnetLoginMFAOK A successful response.

swagger:response operatorSubnetLoginMFAOK
*/
type OperatorSubnetLoginMFAOK struct {

	/*
	  In: Body
	*/
	Payload *models.OperatorSubnetLoginResponse `json:"body,omitempty"`
}

// NewOperatorSubnetLoginMFAOK creates OperatorSubnetLoginMFAOK with default headers values
func NewOperatorSubnetLoginMFAOK() *OperatorSubnetLoginMFAOK {

	return &OperatorSubnetLoginMFAOK{}
}

// WithPayload adds the payload to the operator subnet login m f a o k response
func (o *OperatorSubnetLoginMFAOK) WithPayload(payload *models.OperatorSubnetLoginResponse) *OperatorSubnetLoginMFAOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the operator subnet login m f a o k response
func (o *OperatorSubnetLoginMFAOK) SetPayload(payload *models.OperatorSubnetLoginResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *OperatorSubnetLoginMFAOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*OperatorSubnetLoginMFADefault Generic error response.

swagger:response operatorSubnetLoginMFADefault
*/
type OperatorSubnetLoginMFADefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewOperatorSubnetLoginMFADefault creates OperatorSubnetLoginMFADefault with default headers values
func NewOperatorSubnetLoginMFADefault(code int) *OperatorSubnetLoginMFADefault {
	if code <= 0 {
		code = 500
	}

	return &OperatorSubnetLoginMFADefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the operator subnet login m f a default response
func (o *OperatorSubnetLoginMFADefault) WithStatusCode(code int) *OperatorSubnetLoginMFADefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the operator subnet login m f a default response
func (o *OperatorSubnetLoginMFADefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the operator subnet login m f a default response
func (o *OperatorSubnetLoginMFADefault) WithPayload(payload *models.Error) *OperatorSubnetLoginMFADefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the operator subnet login m f a default response
func (o *OperatorSubnetLoginMFADefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *OperatorSubnetLoginMFADefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

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

package subnet

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// SubnetLoginOKCode is the HTTP code returned for type SubnetLoginOK
const SubnetLoginOKCode int = 200

/*
SubnetLoginOK A successful response.

swagger:response subnetLoginOK
*/
type SubnetLoginOK struct {

	/*
	  In: Body
	*/
	Payload *models.SubnetLoginResponse `json:"body,omitempty"`
}

// NewSubnetLoginOK creates SubnetLoginOK with default headers values
func NewSubnetLoginOK() *SubnetLoginOK {

	return &SubnetLoginOK{}
}

// WithPayload adds the payload to the subnet login o k response
func (o *SubnetLoginOK) WithPayload(payload *models.SubnetLoginResponse) *SubnetLoginOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the subnet login o k response
func (o *SubnetLoginOK) SetPayload(payload *models.SubnetLoginResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SubnetLoginOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*
SubnetLoginDefault Generic error response.

swagger:response subnetLoginDefault
*/
type SubnetLoginDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSubnetLoginDefault creates SubnetLoginDefault with default headers values
func NewSubnetLoginDefault(code int) *SubnetLoginDefault {
	if code <= 0 {
		code = 500
	}

	return &SubnetLoginDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the subnet login default response
func (o *SubnetLoginDefault) WithStatusCode(code int) *SubnetLoginDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the subnet login default response
func (o *SubnetLoginDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the subnet login default response
func (o *SubnetLoginDefault) WithPayload(payload *models.Error) *SubnetLoginDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the subnet login default response
func (o *SubnetLoginDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SubnetLoginDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

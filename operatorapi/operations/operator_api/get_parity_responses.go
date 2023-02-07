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

package operator_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// GetParityOKCode is the HTTP code returned for type GetParityOK
const GetParityOKCode int = 200

/*
GetParityOK A successful response.

swagger:response getParityOK
*/
type GetParityOK struct {

	/*
	  In: Body
	*/
	Payload models.ParityResponse `json:"body,omitempty"`
}

// NewGetParityOK creates GetParityOK with default headers values
func NewGetParityOK() *GetParityOK {

	return &GetParityOK{}
}

// WithPayload adds the payload to the get parity o k response
func (o *GetParityOK) WithPayload(payload models.ParityResponse) *GetParityOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get parity o k response
func (o *GetParityOK) SetPayload(payload models.ParityResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetParityOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	payload := o.Payload
	if payload == nil {
		// return empty array
		payload = models.ParityResponse{}
	}

	if err := producer.Produce(rw, payload); err != nil {
		panic(err) // let the recovery middleware deal with this
	}
}

/*
GetParityDefault Generic error response.

swagger:response getParityDefault
*/
type GetParityDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewGetParityDefault creates GetParityDefault with default headers values
func NewGetParityDefault(code int) *GetParityDefault {
	if code <= 0 {
		code = 500
	}

	return &GetParityDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the get parity default response
func (o *GetParityDefault) WithStatusCode(code int) *GetParityDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the get parity default response
func (o *GetParityDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the get parity default response
func (o *GetParityDefault) WithPayload(payload *models.Error) *GetParityDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get parity default response
func (o *GetParityDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetParityDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

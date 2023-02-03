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

package tiering

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// GetTierOKCode is the HTTP code returned for type GetTierOK
const GetTierOKCode int = 200

/*
GetTierOK A successful response.

swagger:response getTierOK
*/
type GetTierOK struct {

	/*
	  In: Body
	*/
	Payload *models.Tier `json:"body,omitempty"`
}

// NewGetTierOK creates GetTierOK with default headers values
func NewGetTierOK() *GetTierOK {

	return &GetTierOK{}
}

// WithPayload adds the payload to the get tier o k response
func (o *GetTierOK) WithPayload(payload *models.Tier) *GetTierOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get tier o k response
func (o *GetTierOK) SetPayload(payload *models.Tier) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetTierOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*
GetTierDefault Generic error response.

swagger:response getTierDefault
*/
type GetTierDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewGetTierDefault creates GetTierDefault with default headers values
func NewGetTierDefault(code int) *GetTierDefault {
	if code <= 0 {
		code = 500
	}

	return &GetTierDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the get tier default response
func (o *GetTierDefault) WithStatusCode(code int) *GetTierDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the get tier default response
func (o *GetTierDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the get tier default response
func (o *GetTierDefault) WithPayload(payload *models.Error) *GetTierDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get tier default response
func (o *GetTierDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetTierDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

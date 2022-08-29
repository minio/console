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

// GetResourceQuotaOKCode is the HTTP code returned for type GetResourceQuotaOK
const GetResourceQuotaOKCode int = 200

/*
GetResourceQuotaOK A successful response.

swagger:response getResourceQuotaOK
*/
type GetResourceQuotaOK struct {

	/*
	  In: Body
	*/
	Payload *models.ResourceQuota `json:"body,omitempty"`
}

// NewGetResourceQuotaOK creates GetResourceQuotaOK with default headers values
func NewGetResourceQuotaOK() *GetResourceQuotaOK {

	return &GetResourceQuotaOK{}
}

// WithPayload adds the payload to the get resource quota o k response
func (o *GetResourceQuotaOK) WithPayload(payload *models.ResourceQuota) *GetResourceQuotaOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get resource quota o k response
func (o *GetResourceQuotaOK) SetPayload(payload *models.ResourceQuota) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetResourceQuotaOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*
GetResourceQuotaDefault Generic error response.

swagger:response getResourceQuotaDefault
*/
type GetResourceQuotaDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewGetResourceQuotaDefault creates GetResourceQuotaDefault with default headers values
func NewGetResourceQuotaDefault(code int) *GetResourceQuotaDefault {
	if code <= 0 {
		code = 500
	}

	return &GetResourceQuotaDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the get resource quota default response
func (o *GetResourceQuotaDefault) WithStatusCode(code int) *GetResourceQuotaDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the get resource quota default response
func (o *GetResourceQuotaDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the get resource quota default response
func (o *GetResourceQuotaDefault) WithPayload(payload *models.Error) *GetResourceQuotaDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get resource quota default response
func (o *GetResourceQuotaDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetResourceQuotaDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

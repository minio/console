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

package user_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// SetMultiBucketReplicationOKCode is the HTTP code returned for type SetMultiBucketReplicationOK
const SetMultiBucketReplicationOKCode int = 200

/*SetMultiBucketReplicationOK A successful response.

swagger:response setMultiBucketReplicationOK
*/
type SetMultiBucketReplicationOK struct {

	/*
	  In: Body
	*/
	Payload *models.MultiBucketResponseState `json:"body,omitempty"`
}

// NewSetMultiBucketReplicationOK creates SetMultiBucketReplicationOK with default headers values
func NewSetMultiBucketReplicationOK() *SetMultiBucketReplicationOK {

	return &SetMultiBucketReplicationOK{}
}

// WithPayload adds the payload to the set multi bucket replication o k response
func (o *SetMultiBucketReplicationOK) WithPayload(payload *models.MultiBucketResponseState) *SetMultiBucketReplicationOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the set multi bucket replication o k response
func (o *SetMultiBucketReplicationOK) SetPayload(payload *models.MultiBucketResponseState) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SetMultiBucketReplicationOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*SetMultiBucketReplicationDefault Generic error response.

swagger:response setMultiBucketReplicationDefault
*/
type SetMultiBucketReplicationDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSetMultiBucketReplicationDefault creates SetMultiBucketReplicationDefault with default headers values
func NewSetMultiBucketReplicationDefault(code int) *SetMultiBucketReplicationDefault {
	if code <= 0 {
		code = 500
	}

	return &SetMultiBucketReplicationDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the set multi bucket replication default response
func (o *SetMultiBucketReplicationDefault) WithStatusCode(code int) *SetMultiBucketReplicationDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the set multi bucket replication default response
func (o *SetMultiBucketReplicationDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the set multi bucket replication default response
func (o *SetMultiBucketReplicationDefault) WithPayload(payload *models.Error) *SetMultiBucketReplicationDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the set multi bucket replication default response
func (o *SetMultiBucketReplicationDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SetMultiBucketReplicationDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

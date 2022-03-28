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

// DeleteSelectedReplicationRulesNoContentCode is the HTTP code returned for type DeleteSelectedReplicationRulesNoContent
const DeleteSelectedReplicationRulesNoContentCode int = 204

/*DeleteSelectedReplicationRulesNoContent A successful response.

swagger:response deleteSelectedReplicationRulesNoContent
*/
type DeleteSelectedReplicationRulesNoContent struct {
}

// NewDeleteSelectedReplicationRulesNoContent creates DeleteSelectedReplicationRulesNoContent with default headers values
func NewDeleteSelectedReplicationRulesNoContent() *DeleteSelectedReplicationRulesNoContent {

	return &DeleteSelectedReplicationRulesNoContent{}
}

// WriteResponse to the client
func (o *DeleteSelectedReplicationRulesNoContent) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.Header().Del(runtime.HeaderContentType) //Remove Content-Type on empty responses

	rw.WriteHeader(204)
}

/*DeleteSelectedReplicationRulesDefault Generic error response.

swagger:response deleteSelectedReplicationRulesDefault
*/
type DeleteSelectedReplicationRulesDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewDeleteSelectedReplicationRulesDefault creates DeleteSelectedReplicationRulesDefault with default headers values
func NewDeleteSelectedReplicationRulesDefault(code int) *DeleteSelectedReplicationRulesDefault {
	if code <= 0 {
		code = 500
	}

	return &DeleteSelectedReplicationRulesDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the delete selected replication rules default response
func (o *DeleteSelectedReplicationRulesDefault) WithStatusCode(code int) *DeleteSelectedReplicationRulesDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the delete selected replication rules default response
func (o *DeleteSelectedReplicationRulesDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the delete selected replication rules default response
func (o *DeleteSelectedReplicationRulesDefault) WithPayload(payload *models.Error) *DeleteSelectedReplicationRulesDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the delete selected replication rules default response
func (o *DeleteSelectedReplicationRulesDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *DeleteSelectedReplicationRulesDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

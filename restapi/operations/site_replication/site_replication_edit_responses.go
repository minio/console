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

package site_replication

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// SiteReplicationEditOKCode is the HTTP code returned for type SiteReplicationEditOK
const SiteReplicationEditOKCode int = 200

/*
SiteReplicationEditOK A successful response.

swagger:response siteReplicationEditOK
*/
type SiteReplicationEditOK struct {

	/*
	  In: Body
	*/
	Payload *models.PeerSiteEditResponse `json:"body,omitempty"`
}

// NewSiteReplicationEditOK creates SiteReplicationEditOK with default headers values
func NewSiteReplicationEditOK() *SiteReplicationEditOK {

	return &SiteReplicationEditOK{}
}

// WithPayload adds the payload to the site replication edit o k response
func (o *SiteReplicationEditOK) WithPayload(payload *models.PeerSiteEditResponse) *SiteReplicationEditOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the site replication edit o k response
func (o *SiteReplicationEditOK) SetPayload(payload *models.PeerSiteEditResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SiteReplicationEditOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*
SiteReplicationEditDefault Generic error response.

swagger:response siteReplicationEditDefault
*/
type SiteReplicationEditDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSiteReplicationEditDefault creates SiteReplicationEditDefault with default headers values
func NewSiteReplicationEditDefault(code int) *SiteReplicationEditDefault {
	if code <= 0 {
		code = 500
	}

	return &SiteReplicationEditDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the site replication edit default response
func (o *SiteReplicationEditDefault) WithStatusCode(code int) *SiteReplicationEditDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the site replication edit default response
func (o *SiteReplicationEditDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the site replication edit default response
func (o *SiteReplicationEditDefault) WithPayload(payload *models.Error) *SiteReplicationEditDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the site replication edit default response
func (o *SiteReplicationEditDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SiteReplicationEditDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

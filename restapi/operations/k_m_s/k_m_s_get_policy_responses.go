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

package k_m_s

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// KMSGetPolicyOKCode is the HTTP code returned for type KMSGetPolicyOK
const KMSGetPolicyOKCode int = 200

/*
KMSGetPolicyOK A successful response.

swagger:response kMSGetPolicyOK
*/
type KMSGetPolicyOK struct {

	/*
	  In: Body
	*/
	Payload *models.KmsGetPolicyResponse `json:"body,omitempty"`
}

// NewKMSGetPolicyOK creates KMSGetPolicyOK with default headers values
func NewKMSGetPolicyOK() *KMSGetPolicyOK {

	return &KMSGetPolicyOK{}
}

// WithPayload adds the payload to the k m s get policy o k response
func (o *KMSGetPolicyOK) WithPayload(payload *models.KmsGetPolicyResponse) *KMSGetPolicyOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the k m s get policy o k response
func (o *KMSGetPolicyOK) SetPayload(payload *models.KmsGetPolicyResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *KMSGetPolicyOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*
KMSGetPolicyDefault Generic error response.

swagger:response kMSGetPolicyDefault
*/
type KMSGetPolicyDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewKMSGetPolicyDefault creates KMSGetPolicyDefault with default headers values
func NewKMSGetPolicyDefault(code int) *KMSGetPolicyDefault {
	if code <= 0 {
		code = 500
	}

	return &KMSGetPolicyDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the k m s get policy default response
func (o *KMSGetPolicyDefault) WithStatusCode(code int) *KMSGetPolicyDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the k m s get policy default response
func (o *KMSGetPolicyDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the k m s get policy default response
func (o *KMSGetPolicyDefault) WithPayload(payload *models.Error) *KMSGetPolicyDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the k m s get policy default response
func (o *KMSGetPolicyDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *KMSGetPolicyDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

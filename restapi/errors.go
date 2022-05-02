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

package restapi

import (
	"context"
	"errors"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go"
	"github.com/minio/minio-go/v7"
)

var (
	ErrDefault                          = errors.New("an errors occurred, please try again")
	ErrInvalidLogin                     = errors.New("invalid Login")
	ErrForbidden                        = errors.New("403 Forbidden")
	ErrFileTooLarge                     = errors.New("413 File too Large")
	ErrInvalidSession                   = errors.New("invalid session")
	ErrNotFound                         = errors.New("not found")
	ErrGroupAlreadyExists               = errors.New("error group name already in use")
	ErrInvalidErasureCodingValue        = errors.New("invalid Erasure Coding Value")
	ErrBucketBodyNotInRequest           = errors.New("error bucket body not in request")
	ErrBucketNameNotInRequest           = errors.New("error bucket name not in request")
	ErrGroupBodyNotInRequest            = errors.New("error group body not in request")
	ErrGroupNameNotInRequest            = errors.New("error group name not in request")
	ErrPolicyNameNotInRequest           = errors.New("error policy name not in request")
	ErrPolicyBodyNotInRequest           = errors.New("error policy body not in request")
	ErrPolicyNameContainsSpace          = errors.New("error policy name cannot contain spaces")
	ErrInvalidEncryptionAlgorithm       = errors.New("error invalid encryption algorithm")
	ErrSSENotConfigured                 = errors.New("error server side encryption configuration not found")
	ErrBucketLifeCycleNotConfigured     = errors.New("error bucket life cycle configuration not found")
	ErrChangePassword                   = errors.New("error please check your current password")
	ErrInvalidLicense                   = errors.New("invalid license key")
	ErrLicenseNotFound                  = errors.New("license not found")
	ErrAvoidSelfAccountDelete           = errors.New("logged in user cannot be deleted by itself")
	ErrAccessDenied                     = errors.New("access denied")
	ErrOauth2Provider                   = errors.New("unable to contact configured identity provider")
	ErrNonUniqueAccessKey               = errors.New("access key already in use")
	ErrRemoteTierExists                 = errors.New("specified remote tier already exists")
	ErrRemoteTierNotFound               = errors.New("specified remote tier was not found")
	ErrRemoteTierUppercase              = errors.New("tier name must be in uppercase")
	ErrRemoteTierBucketNotFound         = errors.New("remote tier bucket not found")
	ErrRemoteInvalidCredentials         = errors.New("invalid remote tier credentials")
	ErrUnableToGetTenantUsage           = errors.New("unable to get tenant usage")
	ErrTooManyNodes                     = errors.New("cannot request more nodes than what is available in the cluster")
	ErrTooFewNodes                      = errors.New("there are not enough nodes in the cluster to support this tenant")
	ErrTooFewAvailableNodes             = errors.New("there is not enough available nodes to satisfy this requirement")
	ErrFewerThanFourNodes               = errors.New("at least 4 nodes are required for a tenant")
	ErrUnableToGetTenantLogs            = errors.New("unable to get tenant logs")
	ErrUnableToUpdateTenantCertificates = errors.New("unable to update tenant certificates")
	ErrUpdatingEncryptionConfig         = errors.New("unable to update encryption configuration")
	ErrDeletingEncryptionConfig         = errors.New("error disabling tenant encryption")
	ErrEncryptionConfigNotFound         = errors.New("encryption configuration not found")
	ErrPolicyNotFound                   = errors.New("policy does not exist")
)

// ErrorWithContext :
func ErrorWithContext(ctx context.Context, err ...interface{}) *models.Error {
	errorCode := int32(500)
	errorMessage := ErrDefault.Error()
	var err1 error
	var exists bool
	if len(err) > 0 {
		if err1, exists = err[0].(error); exists {
			if err1.Error() == ErrForbidden.Error() {
				errorCode = 403
			}
			if err1 == ErrNotFound {
				errorCode = 404
				errorMessage = ErrNotFound.Error()
			}
			if errors.Is(err1, ErrInvalidLogin) {
				errorCode = 401
				errorMessage = ErrInvalidLogin.Error()
			}
			// console invalid erasure coding value
			if errors.Is(err1, ErrInvalidErasureCodingValue) {
				errorCode = 400
				errorMessage = ErrInvalidErasureCodingValue.Error()
			}
			if errors.Is(err1, ErrBucketBodyNotInRequest) {
				errorCode = 400
				errorMessage = ErrBucketBodyNotInRequest.Error()
			}
			if errors.Is(err1, ErrBucketNameNotInRequest) {
				errorCode = 400
				errorMessage = ErrBucketNameNotInRequest.Error()
			}
			if errors.Is(err1, ErrGroupBodyNotInRequest) {
				errorCode = 400
				errorMessage = ErrGroupBodyNotInRequest.Error()
			}
			if errors.Is(err1, ErrGroupNameNotInRequest) {
				errorCode = 400
				errorMessage = ErrGroupNameNotInRequest.Error()
			}
			if errors.Is(err1, ErrPolicyNameNotInRequest) {
				errorCode = 400
				errorMessage = ErrPolicyNameNotInRequest.Error()
			}
			if errors.Is(err1, ErrPolicyBodyNotInRequest) {
				errorCode = 400
				errorMessage = ErrPolicyBodyNotInRequest.Error()
			}
			// console invalid session errors
			if errors.Is(err1, ErrInvalidSession) {
				errorCode = 401
				errorMessage = ErrInvalidSession.Error()
			}
			if errors.Is(err1, ErrGroupAlreadyExists) {
				errorCode = 400
				errorMessage = ErrGroupAlreadyExists.Error()
			}
			// Bucket life cycle not configured
			if errors.Is(err1, ErrBucketLifeCycleNotConfigured) {
				errorCode = 404
				errorMessage = ErrBucketLifeCycleNotConfigured.Error()
			}
			// Encryption not configured
			if errors.Is(err1, ErrSSENotConfigured) {
				errorCode = 404
				errorMessage = ErrSSENotConfigured.Error()
			}
			// account change password
			if errors.Is(err1, ErrChangePassword) {
				errorCode = 403
				errorMessage = ErrChangePassword.Error()
			}
			if madmin.ToErrorResponse(err1).Code == "SignatureDoesNotMatch" {
				errorCode = 403
				errorMessage = ErrChangePassword.Error()
			}
			if errors.Is(err1, ErrLicenseNotFound) {
				errorCode = 404
				errorMessage = ErrLicenseNotFound.Error()
			}
			if errors.Is(err1, ErrInvalidLicense) {
				errorCode = 404
				errorMessage = ErrInvalidLicense.Error()
			}
			if errors.Is(err1, ErrAvoidSelfAccountDelete) {
				errorCode = 403
				errorMessage = ErrAvoidSelfAccountDelete.Error()
			}
			if errors.Is(err1, ErrAccessDenied) {
				errorCode = 403
				errorMessage = ErrAccessDenied.Error()
			}
			if errors.Is(err1, ErrPolicyNotFound) {
				errorCode = 404
				errorMessage = ErrPolicyNotFound.Error()
			}
			if madmin.ToErrorResponse(err1).Code == "AccessDenied" {
				errorCode = 403
				errorMessage = ErrAccessDenied.Error()
			}
			if madmin.ToErrorResponse(err1).Code == "InvalidAccessKeyId" {
				errorCode = 401
				errorMessage = ErrInvalidSession.Error()
			}
			// console invalid session errors
			if madmin.ToErrorResponse(err1).Code == "XMinioAdminNoSuchUser" {
				errorCode = 401
				errorMessage = ErrInvalidSession.Error()
			}
			// tiering errors
			if err1.Error() == ErrRemoteTierExists.Error() {
				errorCode = 400
				errorMessage = err1.Error()
			}
			if err1.Error() == ErrRemoteTierNotFound.Error() {
				errorCode = 400
				errorMessage = err1.Error()
			}

			if err1.Error() == ErrRemoteTierUppercase.Error() {
				errorCode = 400
				errorMessage = err1.Error()
			}
			if err1.Error() == ErrRemoteTierBucketNotFound.Error() {
				errorCode = 400
				errorMessage = err1.Error()
			}
			if err1.Error() == ErrRemoteInvalidCredentials.Error() {
				errorCode = 403
				errorMessage = err1.Error()
			}
			if err1.Error() == ErrFileTooLarge.Error() {
				errorCode = 413
				errorMessage = err1.Error()
			}
			// bucket already exists
			if minio.ToErrorResponse(err1).Code == "BucketAlreadyOwnedByYou" {
				errorCode = 400
				errorMessage = "Bucket already exists"
			}
			LogError(err1.Error(), err...)
			LogIf(ctx, err1, err...)
		}

		if len(err) > 1 && err[1] != nil {
			if err2, ok := err[1].(error); ok {
				errorMessage = err2.Error()
			}
		}
	}
	return &models.Error{Code: errorCode, Message: swag.String(errorMessage), DetailedMessage: swag.String(err1.Error())}

}

// Error receives an errors object and parse it against k8sErrors, returns the right errors code paired with a generic errors message
func Error(err ...interface{}) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	return ErrorWithContext(ctx, err...)
}

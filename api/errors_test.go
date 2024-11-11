// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

package api

import (
	"context"
	"fmt"
	"testing"

	"github.com/minio/console/models"
	"github.com/stretchr/testify/assert"
)

func TestError(t *testing.T) {
	type args struct {
		err []interface{}
	}

	type testError struct {
		name string
		args args
		want *CodedAPIError
	}

	var tests []testError

	type expectedError struct {
		err  error
		code int
	}

	appErrors := map[string]expectedError{
		"ErrDefault": {code: 500, err: ErrDefault},

		"ErrForbidden":                  {code: 403, err: ErrForbidden},
		"ErrFileTooLarge":               {code: 413, err: ErrFileTooLarge},
		"ErrInvalidSession":             {code: 401, err: ErrInvalidSession},
		"ErrNotFound":                   {code: 404, err: ErrNotFound},
		"ErrGroupAlreadyExists":         {code: 400, err: ErrGroupAlreadyExists},
		"ErrInvalidErasureCodingValue":  {code: 400, err: ErrInvalidErasureCodingValue},
		"ErrBucketBodyNotInRequest":     {code: 400, err: ErrBucketBodyNotInRequest},
		"ErrBucketNameNotInRequest":     {code: 400, err: ErrBucketNameNotInRequest},
		"ErrGroupBodyNotInRequest":      {code: 400, err: ErrGroupBodyNotInRequest},
		"ErrGroupNameNotInRequest":      {code: 400, err: ErrGroupNameNotInRequest},
		"ErrPolicyNameNotInRequest":     {code: 400, err: ErrPolicyNameNotInRequest},
		"ErrPolicyBodyNotInRequest":     {code: 400, err: ErrPolicyBodyNotInRequest},
		"ErrInvalidEncryptionAlgorithm": {code: 500, err: ErrInvalidEncryptionAlgorithm},
		"ErrSSENotConfigured":           {code: 404, err: ErrSSENotConfigured},
		"ErrChangePassword":             {code: 403, err: ErrChangePassword},
		"ErrInvalidLicense":             {code: 404, err: ErrInvalidLicense},
		"ErrLicenseNotFound":            {code: 404, err: ErrLicenseNotFound},
		"ErrAvoidSelfAccountDelete":     {code: 403, err: ErrAvoidSelfAccountDelete},

		"ErrNonUniqueAccessKey":               {code: 500, err: ErrNonUniqueAccessKey},
		"ErrRemoteTierExists":                 {code: 400, err: ErrRemoteTierExists},
		"ErrRemoteTierNotFound":               {code: 400, err: ErrRemoteTierNotFound},
		"ErrRemoteTierUppercase":              {code: 400, err: ErrRemoteTierUppercase},
		"ErrRemoteTierBucketNotFound":         {code: 400, err: ErrRemoteTierBucketNotFound},
		"ErrRemoteInvalidCredentials":         {code: 403, err: ErrRemoteInvalidCredentials},
		"ErrTooFewNodes":                      {code: 500, err: ErrTooFewNodes},
		"ErrUnableToGetTenantUsage":           {code: 500, err: ErrUnableToGetTenantUsage},
		"ErrTooManyNodes":                     {code: 500, err: ErrTooManyNodes},
		"ErrAccessDenied":                     {code: 403, err: ErrAccessDenied},
		"ErrTooFewAvailableNodes":             {code: 500, err: ErrTooFewAvailableNodes},
		"ErrFewerThanFourNodes":               {code: 500, err: ErrFewerThanFourNodes},
		"ErrUnableToGetTenantLogs":            {code: 500, err: ErrUnableToGetTenantLogs},
		"ErrUnableToUpdateTenantCertificates": {code: 500, err: ErrUnableToUpdateTenantCertificates},
		"ErrUpdatingEncryptionConfig":         {code: 500, err: ErrUpdatingEncryptionConfig},
		"ErrDeletingEncryptionConfig":         {code: 500, err: ErrDeletingEncryptionConfig},
		"ErrEncryptionConfigNotFound":         {code: 404, err: ErrEncryptionConfigNotFound},
	}

	for k, e := range appErrors {
		tests = append(tests, testError{
			name: fmt.Sprintf("%s error", k),
			args: args{
				err: []interface{}{e.err},
			},
			want: &CodedAPIError{
				Code:     e.code,
				APIError: &models.APIError{Message: e.err.Error(), DetailedMessage: e.err.Error()},
			},
		})
	}

	tests = append(tests,
		testError{
			name: "passing multiple errors but ErrInvalidLogin is last",
			args: args{
				err: []interface{}{ErrDefault, ErrInvalidLogin},
			},
			want: &CodedAPIError{
				Code:     int(401),
				APIError: &models.APIError{Message: ErrDefault.Error(), DetailedMessage: ""},
			},
		})
	tests = append(tests,
		testError{
			name: "login error omits detailedMessage",
			args: args{
				err: []interface{}{ErrInvalidLogin},
			},
			want: &CodedAPIError{
				Code:     int(401),
				APIError: &models.APIError{Message: ErrInvalidLogin.Error(), DetailedMessage: ""},
			},
		})

	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			got := Error(tt.args.err...)
			assert.Equalf(t, tt.want.Code, got.Code, "Error(%v) Got (%v)", tt.want.Code, got.Code)
			assert.Equalf(t, tt.want.APIError.DetailedMessage, got.APIError.DetailedMessage, "Error(%s) Got (%s)", tt.want.APIError.DetailedMessage, got.APIError.DetailedMessage)
		})
	}
}

func TestErrorWithContext(t *testing.T) {
	type args struct {
		ctx context.Context
		err []interface{}
	}
	tests := []struct {
		name string
		args args
		want *CodedAPIError
	}{
		{
			name: "default error",
			args: args{
				ctx: context.Background(),
				err: []interface{}{ErrDefault},
			},
			want: &CodedAPIError{
				Code: 500, APIError: &models.APIError{Message: ErrDefault.Error(), DetailedMessage: ErrDefault.Error()},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			assert.Equalf(t, tt.want, ErrorWithContext(tt.args.ctx, tt.args.err...), "ErrorWithContext(%v, %v)", tt.args.ctx, tt.args.err)
		})
	}
}

// This file is part of MinIO Console Server
// Copyright (c) 2024 MinIO, Inc.
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
	"testing"

	"github.com/go-openapi/swag"
	"github.com/stretchr/testify/assert"
)

func Test_checkMinIOStringURL(t *testing.T) {
	tAssert := assert.New(t)
	type args struct {
		encodedURL string
	}
	tests := []struct {
		test      string
		args      args
		wantError *string
		expected  *string
	}{
		{
			test: "valid encoded minIO URL returns decoded URL string", // http://localhost:9000/...
			args: args{
				encodedURL: "http://localhost:9000/bucket123/Audio%20icon%281%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=UBO1L1C7U87P1BP251TS%2F20240405%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240405T210133Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJVQk8xTDFDN1U4N1AxQlAyNTFUUyIsImV4cCI6MTcxMjM5NDA4OSwicGFyZW50IjoibWluaW9hZG1pbiJ9.V-KDgrLMUBlnJHKX6VxHl9-A_-PFEWok2dpTq-46blLmLsueTxshVaY4DZwGfom4TT5k8phUfgjcQansnbrkeA&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=07cad3eb2a6722b5baed09c6f1fe4a701bf12f48e1628b9d45c011d595567845",
			},
			wantError: nil,
			expected:  swag.String("http://localhost:9000/bucket123/Audio%20icon%281%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=UBO1L1C7U87P1BP251TS%2F20240405%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240405T210133Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJVQk8xTDFDN1U4N1AxQlAyNTFUUyIsImV4cCI6MTcxMjM5NDA4OSwicGFyZW50IjoibWluaW9hZG1pbiJ9.V-KDgrLMUBlnJHKX6VxHl9-A_-PFEWok2dpTq-46blLmLsueTxshVaY4DZwGfom4TT5k8phUfgjcQansnbrkeA&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=07cad3eb2a6722b5baed09c6f1fe4a701bf12f48e1628b9d45c011d595567845"),
		},
		{
			test: "valid encoded url but not coming from MinIO server returns forbidden error", // http://non-minio-host:9000/...
			args: args{
				encodedURL: "http://non-minio-host:9000/bucket123/Audio%20icon%281%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=UBO1L1C7U87P1BP251TS%2F20240405%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240405T210133Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJVQk8xTDFDN1U4N1AxQlAyNTFUUyIsImV4cCI6MTcxMjM5NDA4OSwicGFyZW50IjoibWluaW9hZG1pbiJ9.V-KDgrLMUBlnJHKX6VxHl9-A_-PFEWok2dpTq-46blLmLsueTxshVaY4DZwGfom4TT5k8phUfgjcQansnbrkeA&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=07cad3eb2a6722b5baed09c6f1fe4a701bf12f48e1628b9d45c011d595567845",
			},
			wantError: swag.String("403 Forbidden"),
			expected:  nil,
		},
		{
			test: "valid encoded url but not coming from MinIO server port returns forbidden error", // other port http://localhost:8902/...
			args: args{
				encodedURL: "http://localhost:8902/bucket123/Audio%20icon%281%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=UBO1L1C7U87P1BP251TS%2F20240405%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240405T210133Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJVQk8xTDFDN1U4N1AxQlAyNTFUUyIsImV4cCI6MTcxMjM5NDA4OSwicGFyZW50IjoibWluaW9hZG1pbiJ9.V-KDgrLMUBlnJHKX6VxHl9-A_-PFEWok2dpTq-46blLmLsueTxshVaY4DZwGfom4TT5k8phUfgjcQansnbrkeA&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=07cad3eb2a6722b5baed09c6f1fe4a701bf12f48e1628b9d45c011d595567845",
			},
			wantError: swag.String("403 Forbidden"),
			expected:  nil,
		},
		{
			test: "valid url but with invalid schema returns error",
			args: args{
				encodedURL: "postgres://postgres:123456@127.0.0.1:5432/dummy", // postgres://postgres:123456@127.0.0.1:5432/dummy

			},
			wantError: swag.String("unexpected scheme found postgres"),
			expected:  nil,
		},
		{
			test: "invalid url returns error",
			args: args{
				encodedURL: "asdsadsda", // asdsadsda

			},
			wantError: swag.String("unexpected scheme found "),
			expected:  nil,
		},
		{
			test: "plain url",
			args: args{
				encodedURL: "https://localhost:9000/cestest/Audio%20icon.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256",
			},
			wantError: nil,
			expected:  swag.String("https://localhost:9000/cestest/Audio%20icon.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(_ *testing.T) {
			url, err := checkMinIOStringURL(tt.args.encodedURL)
			if tt.wantError != nil {
				if err != nil {
					if err.Error() != *tt.wantError {
						t.Errorf("checkMinIOStringURL() error: `%v`, wantErr: `%s`, input: `%s`", err, *tt.wantError, tt.args.encodedURL)
						return
					}
				} else {
					t.Errorf("checkMinIOStringURL() error: `%v`, wantErr: `%s`, input: `%s`", err, *tt.wantError, tt.args.encodedURL)
					return
				}
			} else {
				if err != nil {
					t.Errorf("checkMinIOStringURL() error: `%s`, wantErr: `%v`, input: `%s`", err, tt.wantError, tt.args.encodedURL)
					return
				}
				tAssert.Equal(*tt.expected, *url)
			}
		})
	}
}

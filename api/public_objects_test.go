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

func Test_decodeMinIOStringURL(t *testing.T) {
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
				encodedURL: "aHR0cDovL2xvY2FsaG9zdDo5MDAwL2J1Y2tldDEyMy9BdWRpbyUyMGljb24lMjgxJTI5LnN2Zz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVVCTzFMMUM3VTg3UDFCUDI1MVRTJTJGMjAyNDA0MDUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNDA1VDIxMDEzM1omWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSlZRazh4VERGRE4xVTROMUF4UWxBeU5URlVVeUlzSW1WNGNDSTZNVGN4TWpNNU5EQTRPU3dpY0dGeVpXNTBJam9pYldsdWFXOWhaRzFwYmlKOS5WLUtEZ3JMTVVCbG5KSEtYNlZ4SGw5LUFfLVBGRVdvazJkcFRxLTQ2YmxMbUxzdWVUeHNoVmFZNERad0dmb200VFQ1azhwaFVmZ2pjUWFuc25icmtlQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTA3Y2FkM2ViMmE2NzIyYjViYWVkMDljNmYxZmU0YTcwMWJmMTJmNDhlMTYyOGI5ZDQ1YzAxMWQ1OTU1Njc4NDU",
			},
			wantError: nil,
			expected:  swag.String("http://localhost:9000/bucket123/Audio%20icon%281%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=UBO1L1C7U87P1BP251TS%2F20240405%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240405T210133Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJVQk8xTDFDN1U4N1AxQlAyNTFUUyIsImV4cCI6MTcxMjM5NDA4OSwicGFyZW50IjoibWluaW9hZG1pbiJ9.V-KDgrLMUBlnJHKX6VxHl9-A_-PFEWok2dpTq-46blLmLsueTxshVaY4DZwGfom4TT5k8phUfgjcQansnbrkeA&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=07cad3eb2a6722b5baed09c6f1fe4a701bf12f48e1628b9d45c011d595567845"),
		},
		{
			test: "valid encoded url but not coming from MinIO server returns forbidden error", // http://non-minio-host:9000/...
			args: args{
				encodedURL: "aHR0cDovL25vbi1taW5pby1ob3N0OjkwMDAvYnVja2V0MTIzL0F1ZGlvJTIwaWNvbiUyODElMjkuc3ZnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9VUJPMUwxQzdVODdQMUJQMjUxVFMlMkYyMDI0MDQwNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MDVUMjEwMTMzWiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKVlFrOHhUREZETjFVNE4xQXhRbEF5TlRGVVV5SXNJbVY0Y0NJNk1UY3hNak01TkRBNE9Td2ljR0Z5Wlc1MElqb2liV2x1YVc5aFpHMXBiaUo5LlYtS0RnckxNVUJsbkpIS1g2VnhIbDktQV8tUEZFV29rMmRwVHEtNDZibExtTHN1ZVR4c2hWYVk0RFp3R2ZvbTRUVDVrOHBoVWZnamNRYW5zbmJya2VBJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MDdjYWQzZWIyYTY3MjJiNWJhZWQwOWM2ZjFmZTRhNzAxYmYxMmY0OGUxNjI4YjlkNDVjMDExZDU5NTU2Nzg0NQ",
			},
			wantError: swag.String("403 Forbidden"),
			expected:  nil,
		},
		{
			test: "valid encoded url but not coming from MinIO server port returns forbidden error", // other port http://localhost:8902/...
			args: args{
				encodedURL: "aHR0cDovL2xvY2FsaG9zdDo4OTAyL2J1Y2tldDEyMy9BdWRpbyUyMGljb24lMjgxJTI5LnN2Zz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVVCTzFMMUM3VTg3UDFCUDI1MVRTJTJGMjAyNDA0MDUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNDA1VDIxMDEzM1omWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSlZRazh4VERGRE4xVTROMUF4UWxBeU5URlVVeUlzSW1WNGNDSTZNVGN4TWpNNU5EQTRPU3dpY0dGeVpXNTBJam9pYldsdWFXOWhaRzFwYmlKOS5WLUtEZ3JMTVVCbG5KSEtYNlZ4SGw5LUFfLVBGRVdvazJkcFRxLTQ2YmxMbUxzdWVUeHNoVmFZNERad0dmb200VFQ1azhwaFVmZ2pjUWFuc25icmtlQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTA3Y2FkM2ViMmE2NzIyYjViYWVkMDljNmYxZmU0YTcwMWJmMTJmNDhlMTYyOGI5ZDQ1YzAxMWQ1OTU1Njc4NDU",
			},
			wantError: swag.String("403 Forbidden"),
			expected:  nil,
		},
		{
			test: "valid url but with invalid schema returns error",
			args: args{
				encodedURL: "cG9zdGdyZXM6Ly9wb3N0Z3JlczoxMjM0NTZAMTI3LjAuMC4xOjU0MzIvZHVtbXk", // postgres://postgres:123456@127.0.0.1:5432/dummy

			},
			wantError: swag.String("unexpected scheme found postgres"),
			expected:  nil,
		},
		{
			test: "invalid url returns error",
			args: args{
				encodedURL: "YXNkc2Fkc2Rh", // asdsadsda

			},
			wantError: swag.String("unexpected scheme found "),
			expected:  nil,
		},
		{
			test: "plain url",
			args: args{
				encodedURL: "aHR0cHM6Ly9sb2NhbGhvc3Q6OTAwMC9jZXN0ZXN0L0F1ZGlvJTIwaWNvbi5zdmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTY",
			},
			wantError: nil,
			expected:  swag.String("https://localhost:9000/cestest/Audio%20icon.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.test, func(_ *testing.T) {
			url, err := decodeMinIOStringURL(tt.args.encodedURL)
			if tt.wantError != nil {
				if err != nil {
					if err.Error() != *tt.wantError {
						t.Errorf("decodeMinIOStringURL() error: `%v`, wantErr: `%s`", err, *tt.wantError)
						return
					}
				} else {
					t.Errorf("decodeMinIOStringURL() error: `%v`, wantErr: `%s`", err, *tt.wantError)
					return
				}
			} else {
				if err != nil {
					t.Errorf("decodeMinIOStringURL() error: `%s`, wantErr: `%v`", err, tt.wantError)
					return
				}
				tAssert.Equal(*tt.expected, *url)
			}
		})
	}
}

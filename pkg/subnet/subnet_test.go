// This file is part of MinIO Kubernetes Cloud
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

package subnet

import (
	"bytes"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"testing"

	"errors"
)

var HTTPGetMock func(url string) (resp *http.Response, err error)
var HTTPPostMock func(url, contentType string, body io.Reader) (resp *http.Response, err error)
var HTTPDoMock func(req *http.Request) (*http.Response, error)

type HTTPClientMock struct {
	Client *http.Client
}

func (c *HTTPClientMock) Get(url string) (resp *http.Response, err error) {
	return HTTPGetMock(url)
}

func (c *HTTPClientMock) Post(url, contentType string, body io.Reader) (resp *http.Response, err error) {
	return HTTPPostMock(url, contentType, body)
}

func (c *HTTPClientMock) Do(req *http.Request) (*http.Response, error) {
	return HTTPDoMock(req)
}

func Test_getLicenseFromCredentials(t *testing.T) {
	// HTTP Client mock
	clientMock := HTTPClientMock{
		Client: &http.Client{},
	}
	type args struct {
		client   HTTPClientMock
		username string
		password string
	}
	tests := []struct {
		name     string
		args     args
		want     string
		wantErr  bool
		mockFunc func()
	}{
		{
			name: "error when login against subnet",
			args: args{
				client:   clientMock,
				username: "invalid",
				password: "invalid",
			},
			want:    "",
			wantErr: true,
			mockFunc: func() {
				HTTPPostMock = func(url, contentType string, body io.Reader) (resp *http.Response, err error) {
					return nil, errors.New("something went wrong")
				}
			},
		},
		{
			name: "error because of malformed subnet response",
			args: args{
				client:   clientMock,
				username: "invalid",
				password: "invalid",
			},
			want:    "",
			wantErr: true,
			mockFunc: func() {
				HTTPPostMock = func(url, contentType string, body io.Reader) (resp *http.Response, err error) {
					return &http.Response{Body: ioutil.NopCloser(bytes.NewReader([]byte("foo")))}, nil
				}
			},
		},
		{
			name: "error when obtaining license from subnet",
			args: args{
				client:   clientMock,
				username: "valid",
				password: "valid",
			},
			want:    "",
			wantErr: true,
			mockFunc: func() {
				HTTPPostMock = func(url, contentType string, body io.Reader) (resp *http.Response, err error) {
					// returning test jwt token
					return &http.Response{Body: ioutil.NopCloser(bytes.NewReader([]byte("{\"has_memberships\":true,\"token_info\":{\"access_token\":\"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik4wRXdOa1V5UXpORU1UUkNOekU0UmpSR1JVWkJSa1UxUmtZNE9EY3lOekZHTXpjNU1qZ3hNZyJ9.eyJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vY2xhaW1zL2dyb3VwcyI6W10sImh0dHBzOi8vaWQuc3VibmV0Lm1pbi5pby9jbGFpbXMvcm9sZXMiOltdLCJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vY2xhaW1zL2VtYWlsIjoibGVuaW4rYzFAbWluaW8uaW8iLCJpc3MiOiJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vIiwic3ViIjoiYXV0aDB8NWZjZWFlYTMyNTNhZjEwMDc3NDZkMDM0IiwiYXVkIjoiaHR0cHM6Ly9zdWJuZXQubWluLmlvL2FwaSIsImlhdCI6MTYwODQxNjE5NiwiZXhwIjoxNjExMDA4MTk2LCJhenAiOiI1WTA0eVZlejNiOFgxUFVzRHVqSmxuZXVuY3ExVjZxaiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MiLCJndHkiOiJwYXNzd29yZCJ9.GC8DRLT0jUEteuBZBmyMXMswLSblCr_89Gu5NcVRUzKSYAaZ5VFW4UFgo1BpiC0sePuWJ0Vykitphx7znTfZfj5B3mZbOw3ejG6kxz7nm9DuYMmySJFYnwroZ9EP02vkW7-n_-YvEg8le1wXfkJ3lTUzO3aWddS4rfQRsZ2YJJUj61GiNyEK_QNP4PrYOuzLyD1wV75NejFqfcFoj7nRkT1K2BM0-89-_f2AFDGTjov6Ig6s1s-zLC9wxcYSmubNwpCJytZmQgPqIepOr065Y6OB4n0n0B5sXguuGuzb8VAkECrHhHPz8ta926fc0jC4XxVCNKdbV1_qC3-1yY7AJA\",\"expires_in\":2592000.0,\"token_type\":\"Bearer\"}}")))}, nil
				}
				HTTPDoMock = func(req *http.Request) (*http.Response, error) {
					return nil, errors.New("something went wrong")
				}
			},
		},
		{
			name: "error when obtaining license from subnet because of malformed response",
			args: args{
				client:   clientMock,
				username: "valid",
				password: "valid",
			},
			want:    "",
			wantErr: true,
			mockFunc: func() {
				HTTPPostMock = func(url, contentType string, body io.Reader) (resp *http.Response, err error) {
					// returning test jwt token
					return &http.Response{Body: ioutil.NopCloser(bytes.NewReader([]byte("{\"has_memberships\":true,\"token_info\":{\"access_token\":\"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik4wRXdOa1V5UXpORU1UUkNOekU0UmpSR1JVWkJSa1UxUmtZNE9EY3lOekZHTXpjNU1qZ3hNZyJ9.eyJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vY2xhaW1zL2dyb3VwcyI6W10sImh0dHBzOi8vaWQuc3VibmV0Lm1pbi5pby9jbGFpbXMvcm9sZXMiOltdLCJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vY2xhaW1zL2VtYWlsIjoibGVuaW4rYzFAbWluaW8uaW8iLCJpc3MiOiJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vIiwic3ViIjoiYXV0aDB8NWZjZWFlYTMyNTNhZjEwMDc3NDZkMDM0IiwiYXVkIjoiaHR0cHM6Ly9zdWJuZXQubWluLmlvL2FwaSIsImlhdCI6MTYwODQxNjE5NiwiZXhwIjoxNjExMDA4MTk2LCJhenAiOiI1WTA0eVZlejNiOFgxUFVzRHVqSmxuZXVuY3ExVjZxaiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MiLCJndHkiOiJwYXNzd29yZCJ9.GC8DRLT0jUEteuBZBmyMXMswLSblCr_89Gu5NcVRUzKSYAaZ5VFW4UFgo1BpiC0sePuWJ0Vykitphx7znTfZfj5B3mZbOw3ejG6kxz7nm9DuYMmySJFYnwroZ9EP02vkW7-n_-YvEg8le1wXfkJ3lTUzO3aWddS4rfQRsZ2YJJUj61GiNyEK_QNP4PrYOuzLyD1wV75NejFqfcFoj7nRkT1K2BM0-89-_f2AFDGTjov6Ig6s1s-zLC9wxcYSmubNwpCJytZmQgPqIepOr065Y6OB4n0n0B5sXguuGuzb8VAkECrHhHPz8ta926fc0jC4XxVCNKdbV1_qC3-1yY7AJA\",\"expires_in\":2592000.0,\"token_type\":\"Bearer\"}}")))}, nil
				}
				HTTPDoMock = func(req *http.Request) (*http.Response, error) {
					return &http.Response{Body: ioutil.NopCloser(bytes.NewReader([]byte("foo")))}, nil
				}
			},
		},
		{
			name: "license obtained successfully",
			args: args{
				client:   clientMock,
				username: "valid",
				password: "valid",
			},
			want:    license,
			wantErr: false,
			mockFunc: func() {
				HTTPPostMock = func(url, contentType string, body io.Reader) (resp *http.Response, err error) {
					// returning test jwt token
					return &http.Response{
						StatusCode: 200,
						Body:       ioutil.NopCloser(bytes.NewReader([]byte("{\"has_memberships\":true,\"token_info\":{\"access_token\":\"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik4wRXdOa1V5UXpORU1UUkNOekU0UmpSR1JVWkJSa1UxUmtZNE9EY3lOekZHTXpjNU1qZ3hNZyJ9.eyJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vY2xhaW1zL2dyb3VwcyI6W10sImh0dHBzOi8vaWQuc3VibmV0Lm1pbi5pby9jbGFpbXMvcm9sZXMiOltdLCJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vY2xhaW1zL2VtYWlsIjoibGVuaW4rYzFAbWluaW8uaW8iLCJpc3MiOiJodHRwczovL2lkLnN1Ym5ldC5taW4uaW8vIiwic3ViIjoiYXV0aDB8NWZjZWFlYTMyNTNhZjEwMDc3NDZkMDM0IiwiYXVkIjoiaHR0cHM6Ly9zdWJuZXQubWluLmlvL2FwaSIsImlhdCI6MTYwODQxNjE5NiwiZXhwIjoxNjExMDA4MTk2LCJhenAiOiI1WTA0eVZlejNiOFgxUFVzRHVqSmxuZXVuY3ExVjZxaiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MiLCJndHkiOiJwYXNzd29yZCJ9.GC8DRLT0jUEteuBZBmyMXMswLSblCr_89Gu5NcVRUzKSYAaZ5VFW4UFgo1BpiC0sePuWJ0Vykitphx7znTfZfj5B3mZbOw3ejG6kxz7nm9DuYMmySJFYnwroZ9EP02vkW7-n_-YvEg8le1wXfkJ3lTUzO3aWddS4rfQRsZ2YJJUj61GiNyEK_QNP4PrYOuzLyD1wV75NejFqfcFoj7nRkT1K2BM0-89-_f2AFDGTjov6Ig6s1s-zLC9wxcYSmubNwpCJytZmQgPqIepOr065Y6OB4n0n0B5sXguuGuzb8VAkECrHhHPz8ta926fc0jC4XxVCNKdbV1_qC3-1yY7AJA\",\"expires_in\":2592000.0,\"token_type\":\"Bearer\"}}"))),
					}, nil
				}
				HTTPDoMock = func(req *http.Request) (*http.Response, error) {
					// returning test jwt license
					return &http.Response{
						StatusCode: 200,
						Body:       ioutil.NopCloser(bytes.NewReader([]byte("{\"license\":\"" + license + "\",\"metadata\":{\"email\":\"lenin+c1@minio.io\",\"issuer\":\"subnet@minio.io\",\"accountId\":176,\"teamName\":\"console-customer\",\"serviceType\":\"STANDARD\",\"capacity\":25,\"requestedAt\":\"2020-12-19T22:23:31.609144732Z\",\"expiresAt\":\"2021-12-19T22:23:31.609144732Z\"}}"))),
					}, nil
				}
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mockFunc != nil {
				tt.mockFunc()
			}
			got, err := getLicenseFromCredentials(&tt.args.client, tt.args.username, tt.args.password)
			if (err != nil) != tt.wantErr {
				t.Errorf("getLicenseFromCredentials() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("getLicenseFromCredentials() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_downloadSubnetPublicKey(t *testing.T) {
	// HTTP Client mock
	clientMock := HTTPClientMock{
		Client: &http.Client{},
	}
	type args struct {
		client HTTPClientMock
	}
	tests := []struct {
		name     string
		args     args
		want     string
		wantErr  bool
		mockFunc func()
	}{
		{
			name: "error downloading public key",
			args: args{
				client: clientMock,
			},
			mockFunc: func() {
				HTTPGetMock = func(url string) (resp *http.Response, err error) {
					return nil, errors.New("something went wrong")
				}
			},
			wantErr: true,
			want:    "",
		},
		{
			name: "public key download successfully",
			args: args{
				client: clientMock,
			},
			mockFunc: func() {
				HTTPGetMock = func(url string) (resp *http.Response, err error) {
					return &http.Response{Body: ioutil.NopCloser(bytes.NewReader([]byte("foo")))}, nil
				}
			},
			wantErr: false,
			want:    "foo",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mockFunc != nil {
				tt.mockFunc()
			}
			got, err := downloadSubnetPublicKey(&tt.args.client)
			if (err != nil) != tt.wantErr {
				t.Errorf("downloadSubnetPublicKey() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("downloadSubnetPublicKey() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestValidateLicense(t *testing.T) {
	// HTTP Client mock
	clientMock := HTTPClientMock{
		Client: &http.Client{},
	}
	type args struct {
		client     HTTPClientMock
		licenseKey string
		email      string
		password   string
	}
	tests := []struct {
		name        string
		args        args
		wantLicense string
		wantErr     bool
		mockFunc    func()
	}{
		{
			name: "error because nor license nor user or password was provided",
			args: args{
				client:     clientMock,
				licenseKey: "",
				email:      "",
				password:   "",
			},
			wantErr: true,
		},
		{
			name: "error because could not get license from credentials",
			args: args{
				client:     clientMock,
				licenseKey: "",
				email:      "email",
				password:   "password",
			},
			wantErr: true,
			mockFunc: func() {
				HTTPPostMock = func(url, contentType string, body io.Reader) (resp *http.Response, err error) {
					return nil, errors.New("something went wrong")
				}
			},
		},
		{
			name: "error because invalid license",
			args: args{
				client:     clientMock,
				licenseKey: "invalid license",
				email:      "",
				password:   "",
			},
			wantErr: true,
			mockFunc: func() {
				HTTPGetMock = func(url string) (resp *http.Response, err error) {
					return &http.Response{Body: ioutil.NopCloser(strings.NewReader(publicKeys[0]))}, nil
				}
			},
		},
		{
			name: "license validated successfully",
			args: args{
				client:     clientMock,
				licenseKey: license,
				email:      "",
				password:   "",
			},
			wantErr: false,
			mockFunc: func() {
				HTTPGetMock = func(url string) (resp *http.Response, err error) {
					return &http.Response{Body: ioutil.NopCloser(strings.NewReader(publicKeys[0]))}, nil
				}
			},
			wantLicense: license,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.mockFunc != nil {
				tt.mockFunc()
			}
			_, gotLicense, err := ValidateLicense(&tt.args.client, tt.args.licenseKey, tt.args.email, tt.args.password)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateLicense() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if gotLicense != tt.wantLicense {
				t.Errorf("ValidateLicense() gotLicense = %v, want %v", gotLicense, tt.wantLicense)
			}
		})
	}
}

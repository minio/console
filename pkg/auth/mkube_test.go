package auth

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"testing"
)

// RoundTripFunc .
type RoundTripFunc func(req *http.Request) (*http.Response, error)

// RoundTrip .
func (f RoundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

//NewTestClient returns *http.Client with Transport replaced to avoid making real calls
func NewTestClient(fn RoundTripFunc) *http.Client {
	return &http.Client{
		Transport: fn,
	}
}

func Test_isServiceAccountTokenValid(t *testing.T) {

	successResponse := NewTestClient(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       ioutil.NopCloser(bytes.NewBufferString(`OK`)),
			Header:     make(http.Header),
		}, nil
	})

	failResponse := NewTestClient(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 500,
			Body:       ioutil.NopCloser(bytes.NewBufferString(`NOTOK`)),
			Header:     make(http.Header),
		}, errors.New("something wrong")
	})

	type args struct {
		client *http.Client
		jwt    string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "Success authentication - correct jwt (service account token)",
			args: args{
				client: successResponse,
				jwt:    "GOODTOKEN",
			},
			want: true,
		},
		{
			name: "Fail authentication - incorrect jwt (service account token)",
			args: args{
				client: failResponse,
				jwt:    "BADTOKEN",
			},
			want: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isServiceAccountTokenValid(tt.args.client, tt.args.jwt); got != tt.want {
				t.Errorf("isServiceAccountTokenValid() = %v, want %v", got, tt.want)
			}
		})
	}
}

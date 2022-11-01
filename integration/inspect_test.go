package integration

import (
	"fmt"
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Inspect(volume string, file string, enc bool) (*http.Response, error) {
	requestURL := fmt.Sprintf("http://localhost:9090/api/v1/admin/inspect?volume=%s&file=%s&encrypt=%t", volume, file, enc)
	request, err := http.NewRequest(
		"GET", requestURL, nil)
	if err != nil {
		log.Println(err)
	}
	request.Header.Add("Cookie", fmt.Sprintf("token=%s", token))
	request.Header.Add("Content-Type", "application/json")
	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	response, err := client.Do(request)
	return response, err
}

func TestInspect(t *testing.T) {
	assert := assert.New(t)

	type args struct {
		volume  string
		file    string
		encrypt bool
	}

	// Inspect returns successful response always
	tests := []struct {
		name          string
		args          args
		expStatusCode int
		expectedError bool
	}{
		{
			name: "Test Invalid Path",
			args: args{
				volume:  "/test-with-slash",
				file:    "/test-with-slash",
				encrypt: false,
			},
			expStatusCode: 200,
			expectedError: false,
		},

		{
			name: "Test Invalid characters in Path",
			args: args{
				volume:  "//test",
				file:    "//bucket",
				encrypt: false,
			},
			expStatusCode: 200,
			expectedError: true,
		},
		{
			name: "Test valid bucket",
			args: args{
				volume:  "test-bucket",
				file:    "test.txt",
				encrypt: true,
			},
			// TODO: Change back to 200 when https://github.com/minio/minio/pull/15474 is merged.
			expStatusCode: 500,
			expectedError: false,
		},
		{
			name: "Test Empty Path", // Un processable entity error
			args: args{
				volume:  "",
				file:    "",
				encrypt: false,
			},
			expStatusCode: 422,
			expectedError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := Inspect(tt.args.volume, tt.args.file, tt.args.encrypt)
			if tt.expectedError {
				assert.Nil(err)
				if err != nil {
					log.Println(err)
					return
				}
			}
			if resp != nil {
				assert.Equal(
					tt.expStatusCode,
					resp.StatusCode,
				)
			}
		})
	}
}

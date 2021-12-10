package auth

import (
	"context"
	"errors"
	"testing"

	"github.com/minio/console/cluster"
	operatorClientset "github.com/minio/operator/pkg/client/clientset/versioned"
)

type operatorClientTest struct {
	client *operatorClientset.Clientset
}

var operatorAuthenticateMock func(ctx context.Context) ([]byte, error)

// TenantDelete implements the minio instance delete action from minio-operator
func (c *operatorClientTest) Authenticate(ctx context.Context) ([]byte, error) {
	return operatorAuthenticateMock(ctx)
}

func Test_checkServiceAccountTokenValid(t *testing.T) {
	successResponse := func() {
		operatorAuthenticateMock = func(ctx context.Context) ([]byte, error) {
			return nil, nil
		}
	}

	failResponse := func() {
		operatorAuthenticateMock = func(ctx context.Context) ([]byte, error) {
			return nil, errors.New("something went wrong")
		}
	}

	opClientClientSet, _ := cluster.OperatorClient("")

	opClient := &operatorClientTest{
		client: opClientClientSet,
	}

	type args struct {
		ctx            context.Context
		operatorClient *operatorClientTest
		mockFunction   func()
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "Success authentication - correct jwt (service account token)",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				mockFunction:   successResponse,
			},
			want: true,
		},
		{
			name: "Fail authentication - incorrect jwt (service account token)",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				mockFunction:   failResponse,
			},
			want: false,
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			if tt.args.mockFunction != nil {
				tt.args.mockFunction()
			}
			got := checkServiceAccountTokenValid(tt.args.ctx, tt.args.operatorClient)
			if got != nil && tt.want {
				t.Errorf("checkServiceAccountTokenValid() = expected success but got %s", got)
			}
			if got == nil && !tt.want {
				t.Error("checkServiceAccountTokenValid() = expected failure but got success")
			}
		})
	}
}

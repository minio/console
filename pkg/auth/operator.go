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

package auth

import (
	"context"

	"github.com/minio/console/cluster"
	"github.com/minio/minio-go/v7/pkg/credentials"
	operatorClientset "github.com/minio/operator/pkg/client/clientset/versioned"
)

// operatorCredentialsProvider is an struct to hold the JWT (service account token)
type operatorCredentialsProvider struct {
	serviceAccountJWT string
}

// Implementing the interfaces of the minio Provider, we use this to leverage on the existing console Authentication flow
func (s operatorCredentialsProvider) Retrieve() (credentials.Value, error) {
	return credentials.Value{
		AccessKeyID:     "",
		SecretAccessKey: "",
		SessionToken:    s.serviceAccountJWT,
	}, nil
}

// IsExpired dummy function, must be implemented in order to work with the minio provider authentication
func (s operatorCredentialsProvider) IsExpired() bool {
	return false
}

// OperatorClient interface with all functions to be implemented
// by mock when testing, it should include all OperatorClient respective api calls
// that are used within this project.
type OperatorClient interface {
	Authenticate(context.Context) ([]byte, error)
}

// Interface implementation
//
// Define the structure of a operator client and define the functions that are actually used
// from the minio operator.
type operatorClient struct {
	client *operatorClientset.Clientset
}

// Authenticate implements the operator authenticate function via REST /api
func (c *operatorClient) Authenticate(ctx context.Context) ([]byte, error) {
	return c.client.RESTClient().Verb("GET").RequestURI("/api").DoRaw(ctx)
}

// checkServiceAccountTokenValid will make an authenticated request against kubernetes api, if the
// request success means the provided jwt its a valid service account token and the console user can use it for future
// requests until it expires
func checkServiceAccountTokenValid(ctx context.Context, operatorClient OperatorClient) error {
	_, err := operatorClient.Authenticate(ctx)
	return err
}

// GetConsoleCredentialsForOperator will validate the provided JWT (service account token) and return it in the form of credentials.Login
func GetConsoleCredentialsForOperator(jwt string) (*credentials.Credentials, error) {
	ctx := context.Background()
	opClientClientSet, err := cluster.OperatorClient(jwt)
	if err != nil {
		return nil, err
	}
	opClient := &operatorClient{
		client: opClientClientSet,
	}
	if err = checkServiceAccountTokenValid(ctx, opClient); err != nil {
		return nil, errInvalidCredentials
	}
	return credentials.New(operatorCredentialsProvider{serviceAccountJWT: jwt}), nil
}

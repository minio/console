// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
	"fmt"
	"log"
	"net/http"

	"github.com/minio/mcs/cluster"
	"github.com/minio/minio-go/v6/pkg/credentials"
)

// operatorCredentialsProvider is an struct to hold the JWT (service account token)
type operatorCredentialsProvider struct {
	serviceAccountJWT string
}

// Implementing the interfaces of the minio Provider, we use this to leverage on the existing mcs Authentication flow
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

// isServiceAccountTokenValid will make an authenticated request (using bearer token) against kubernetes api, if the
// request success means the provided jwt its a valid service account token and the MCS user can use it for future
// requests until it fails
func isServiceAccountTokenValid(client *http.Client, jwt string) bool {
	//# Explore the API with TOKEN
	//curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
	apiURL := fmt.Sprintf("%s/api", cluster.GetK8sAPIServer())
	req, _ := http.NewRequest("GET", apiURL, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", jwt))
	_, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

// GetMcsCredentialsForOperator will validate the provided JWT (service account token) and return it in the form of credentials.Credentials
func GetMcsCredentialsForOperator(jwt string) (*credentials.Credentials, error) {
	client := http.Client{}
	if isServiceAccountTokenValid(&client, jwt) {
		return credentials.New(operatorCredentialsProvider{serviceAccountJWT: jwt}), nil
	}
	return nil, errInvalidCredentials
}

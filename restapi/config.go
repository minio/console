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

package restapi

import (
	"strings"

	"github.com/minio/minio/pkg/env"
)

func getAccessKey() string {
	return env.Get(McsAccessKey, "minioadmin")
}

func getSecretKey() string {
	return env.Get(McsSecretKey, "minioadmin")
}

func getMinIOServer() string {
	return env.Get(McsMinIOServer, "http://localhost:9000")
}

func getMinIOEndpoint() string {
	server := getMinIOServer()
	if strings.Contains(server, "://") {
		parts := strings.Split(server, "://")
		if len(parts) > 1 {
			server = parts[1]
		}
	}
	return server
}

func getMinIOEndpointSSL() bool {
	server := getMinIOServer()
	if strings.Contains(server, "://") {
		parts := strings.Split(server, "://")
		if len(parts) > 1 {
			if parts[1] == "https" {
				return true
			}
		}
	}
	return false
}

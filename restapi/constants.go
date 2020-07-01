// This file is part of MinIO Kubernetes Cloud
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

const (
	// consts for common configuration
	M3Version     = `0.1.0`
	M3Hostname    = "M3_HOSTNAME"
	M3Port        = "M3_PORT"
	M3TLSHostname = "M3_TLS_HOSTNAME"
	M3TLSPort     = "M3_TLS_PORT"
	// M3TenantMemorySize Memory size to be used when creating MinioInstance request
	M3TenantMemorySize = "M3_TENANT_MEMORY_SIZE"
)

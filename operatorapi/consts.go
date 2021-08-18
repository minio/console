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

package operatorapi

// list of all console environment constants
const (
	ConsoleSubnetLicense        = "CONSOLE_SUBNET_LICENSE"
	ConsoleOperatorSAToken      = "CONSOLE_OPERATOR_SA_TOKEN"
	ConsoleOperatorConsoleImage = "CONSOLE_OPERATOR_CONSOLE_IMAGE"
	MinIOSubnetLicense          = "MINIO_SUBNET_LICENSE"

	// Constants for prometheus annotations
	prometheusPath   = "prometheus.io/path"
	prometheusPort   = "prometheus.io/port"
	prometheusScrape = "prometheus.io/scrape"
)

// Image versions
const (
	KESImageVersion            = "minio/kes:v0.15.1"
	ConsoleImageDefaultVersion = "minio/console:v0.9.2"
)

// K8s

const (
	OperatorSubnetLicenseSecretName = "subnet-license"
)

// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"os"

	"github.com/minio/console/pkg/http"
	"github.com/minio/console/pkg/subnet"
)

type SubnetPlan int

const (
	PlanAGPL SubnetPlan = iota
	PlanStandard
	PlanEnterprise
)

func (sp SubnetPlan) String() string {
	switch sp {
	case PlanStandard:
		return "standard"
	case PlanEnterprise:
		return "enterprise"
	default:
		return "agpl"
	}
}

var InstanceLicensePlan = PlanAGPL

func fetchLicensePlan() {
	client := &http.Client{
		Client: GetConsoleHTTPClient(""),
	}
	licenseInfo, err := subnet.ParseLicense(client, os.Getenv(EnvSubnetLicense))
	if err != nil {
		return
	}
	switch licenseInfo.Plan {
	case "STANDARD":
		InstanceLicensePlan = PlanStandard
	case "ENTERPRISE":
		InstanceLicensePlan = PlanEnterprise
	default:
		InstanceLicensePlan = PlanAGPL
	}
}

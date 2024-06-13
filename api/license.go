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

package api

import (
	"net/http"
	"os"

	"github.com/minio/pkg/v3/licverifier"
	"github.com/minio/pkg/v3/subnet"
)

type SubnetPlan int

const (
	PlanAGPL SubnetPlan = iota
	PlanStandard
	PlanEnterprise
	PlanEnterpriseLite
	PlanEnterprisePlus
)

func (sp SubnetPlan) String() string {
	switch sp {
	case PlanStandard:
		return "standard"
	case PlanEnterprise:
		return "enterprise"
	case PlanEnterpriseLite:
		return "enterprise-lite"
	case PlanEnterprisePlus:
		return "enterprise-plus"
	default:
		return "agpl"
	}
}

var InstanceLicensePlan = PlanAGPL

func getLicenseInfo(client http.Client, license string) (*licverifier.LicenseInfo, error) {
	lv := subnet.LicenseValidator{
		Client:            client,
		ExpiryGracePeriod: 0,
	}
	lv.Init(getConsoleDevMode())
	return lv.ParseLicense(license)
}

func fetchLicensePlan() {
	client := GetConsoleHTTPClient("127.0.0.1")
	licenseInfo, err := getLicenseInfo(*client, os.Getenv(EnvSubnetLicense))
	if err != nil {
		return
	}
	switch licenseInfo.Plan {
	case "STANDARD":
		InstanceLicensePlan = PlanStandard
	case "ENTERPRISE":
		InstanceLicensePlan = PlanEnterprise
	case "ENTERPRISE-LITE":
		InstanceLicensePlan = PlanEnterpriseLite
	case "ENTERPRISE-PLUS":
		InstanceLicensePlan = PlanEnterprisePlus
	default:
		InstanceLicensePlan = PlanAGPL
	}
}

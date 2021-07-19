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
//

package restapi

import (
	"github.com/minio/console/cluster"
	"github.com/minio/console/pkg/subnet"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerSubscriptionHandlers(api *operations.ConsoleAPI) {
	// Get subscription information handler
	api.AdminAPISubscriptionInfoHandler = admin_api.SubscriptionInfoHandlerFunc(func(params admin_api.SubscriptionInfoParams, session *models.Principal) middleware.Responder {
		license, err := getSubscriptionInfoResponse()
		if err != nil {
			return admin_api.NewSubscriptionInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSubscriptionInfoOK().WithPayload(license)
	})
}

// retrieveLicense returns license from K8S secrets (If console is deployed in operator mode) or from
// the configured CONSOLE_SUBNET_LICENSE environment variable
func retrieveLicense() string {
	// If Console is running in Tenant Admin mode retrieve license from env variable
	license := GetSubnetLicense()
	return license
}

// subscriptionValidate will validate the provided jwt license against the subnet public key
func subscriptionValidate(client cluster.HTTPClientI, license, email, password string) (*models.License, string, error) {
	licenseInfo, rawLicense, err := subnet.ValidateLicense(client, license, email, password)
	if err != nil {
		return nil, "", err
	}
	return &models.License{
		Email:           licenseInfo.Email,
		AccountID:       licenseInfo.AccountID,
		StorageCapacity: licenseInfo.StorageCapacity,
		Plan:            licenseInfo.Plan,
		ExpiresAt:       licenseInfo.ExpiresAt.String(),
		Organization:    licenseInfo.Organization,
	}, rawLicense, nil
}

// getSubscriptionInfoResponse returns information about the current configured subnet license for Console
func getSubscriptionInfoResponse() (*models.License, *models.Error) {
	var licenseInfo *models.License
	client := &cluster.HTTPClient{
		Client: GetConsoleSTSClient(),
	}
	licenseKey := retrieveLicense()
	// validate license key and obtain license info
	licenseInfo, _, err := subscriptionValidate(client, licenseKey, "", "")
	if err != nil {
		return nil, PrepareError(errLicenseNotFound, nil, err)
	}
	return licenseInfo, nil
}

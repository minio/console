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

// +build !operator

package restapi

import (
	"context"
	"errors"

	"github.com/minio/console/cluster"
)

// retrieveLicense returns license from the configured CONSOLE_SUBNET_LICENSE environment variable
func retrieveLicense(ctx context.Context, sessionToken string) (string, error) {
	return GetSubnetLicense(), nil
}

// RefreshLicense will check current subnet license and try to renew it
func RefreshLicense() error {
	// Get current license
	saK8SToken := getK8sSAToken()
	licenseKey, err := retrieveLicense(context.Background(), saK8SToken)
	if licenseKey == "" {
		return errors.New("no license present")
	}
	if err != nil {
		return err
	}
	client := &cluster.HTTPClient{
		Client: GetConsoleSTSClient(),
	}
	// Attempt to refresh license
	_, refreshedLicenseKey, err := subscriptionRefresh(client, licenseKey)
	if err != nil {
		return err
	}
	if refreshedLicenseKey == "" {
		return errors.New("license expired, please open a support ticket at https://subnet.min.io/")
	}
	// store new license in memory for console ui
	LicenseKey = refreshedLicenseKey
	return nil
}

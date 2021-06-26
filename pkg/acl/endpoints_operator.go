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

// +build operator

package acl

import iampolicy "github.com/minio/pkg/iam/policy"

const (
	tenants               = "/tenants"
	tenantsDetail         = "/namespaces/:tenantNamespace/tenants/:tenantName"
	podsDetail            = "/namespaces/:tenantNamespace/tenants/:tenantName/pods/:podName"
	tenantsDetailSummary  = "/namespaces/:tenantNamespace/tenants/:tenantName/summary"
	tenantsDetailMetrics  = "/namespaces/:tenantNamespace/tenants/:tenantName/metrics"
	tenantsDetailPods     = "/namespaces/:tenantNamespace/tenants/:tenantName/pods"
	tenantsDetailPools    = "/namespaces/:tenantNamespace/tenants/:tenantName/pools"
	tenantsDetailLicense  = "/namespaces/:tenantNamespace/tenants/:tenantName/license"
	tenantsDetailSecurity = "/namespaces/:tenantNamespace/tenants/:tenantName/security"
	storage               = "/storage"
	storageVolumes        = "/storage/volumes"
	storageDrives         = "/storage/drives"
	license               = "/license"
)

// tenantsActionSet temporally no actions needed for tenants sections to work
var tenantsActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

var storageActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

// operatorRules contains the mapping between endpoints and ActionSets for operator only mode
var operatorRules = map[string]actionsSet{
	tenants:               tenantsActionSet,
	tenantsDetail:         tenantsActionSet,
	tenantsDetailSummary:  tenantsActionSet,
	tenantsDetailMetrics:  tenantsActionSet,
	tenantsDetailPods:     tenantsActionSet,
	tenantsDetailPools:    tenantsActionSet,
	tenantsDetailLicense:  tenantsActionSet,
	tenantsDetailSecurity: tenantsActionSet,
	podsDetail:            tenantsActionSet,
	storage:               storageActionSet,
	storageDrives:         storageActionSet,
	storageVolumes:        storageActionSet,
	license:               licenseActionSet,
}

// GetAuthorizedEndpoints return a list of allowed endpoint based on a provided *iampolicy.Policy
// ie: pages the user should have access based on his current privileges
func GetAuthorizedEndpoints(actions []string) []string {
	// Prepare new ActionSet structure that will hold all the user actions
	userAllowedAction := actionsStringToActionSet(actions)
	var allowedEndpoints []string
	for endpoint, rules := range operatorRules {
		// check if user policy matches s3:* or admin:* typesIntersection
		endpointActionTypes := rules.actionTypes
		typesIntersection := endpointActionTypes.Intersection(userAllowedAction)
		if len(typesIntersection) == len(endpointActionTypes.ToSlice()) {
			allowedEndpoints = append(allowedEndpoints, endpoint)
			continue
		}
		// check if user policy matches explicitly defined endpoint required actions
		endpointRequiredActions := rules.actions
		actionsIntersection := endpointRequiredActions.Intersection(userAllowedAction)
		if len(actionsIntersection) == len(endpointRequiredActions.ToSlice()) {
			allowedEndpoints = append(allowedEndpoints, endpoint)
		}
	}
	return allowedEndpoints
}

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

package acl

import (
	iampolicy "github.com/minio/pkg/iam/policy"
)

// endpoints definition
var (
	configuration               = "/settings"
	users                       = "/users"
	usersDetail                 = "/users/:userName"
	groups                      = "/groups"
	iamPolicies                 = "/policies"
	policiesDetail              = "/policies/:policyName"
	dashboard                   = "/dashboard"
	profiling                   = "/profiling"
	buckets                     = "/buckets"
	bucketsDetail               = "/buckets/:bucketName"
	bucketsDetailSummary        = "/buckets/:bucketName/summary"
	bucketsDetailEvents         = "/buckets/:bucketName/events"
	bucketsDetailReplication    = "/buckets/:bucketName/replication"
	bucketsDetailLifecycle      = "/buckets/:bucketName/lifecycle"
	bucketsDetailAccess         = "/buckets/:bucketName/access"
	bucketsDetailAccessPolicies = "/buckets/:bucketName/access/policies"
	bucketsDetailAccessUsers    = "/buckets/:bucketName/access/users"
	serviceAccounts             = "/account"
	changePassword              = "/account/change-password"
	tenants                     = "/tenants"
	tenantsDetail               = "/namespaces/:tenantNamespace/tenants/:tenantName"
	podsDetail                  = "/namespaces/:tenantNamespace/tenants/:tenantName/pods/:podName"
	tenantsDetailSummary        = "/namespaces/:tenantNamespace/tenants/:tenantName/summary"
	tenantsDetailMetrics        = "/namespaces/:tenantNamespace/tenants/:tenantName/metrics"
	tenantsDetailPods           = "/namespaces/:tenantNamespace/tenants/:tenantName/pods"
	tenantsDetailPools          = "/namespaces/:tenantNamespace/tenants/:tenantName/pools"
	tenantsDetailLicense        = "/namespaces/:tenantNamespace/tenants/:tenantName/license"
	tenantsDetailSecurity       = "/namespaces/:tenantNamespace/tenants/:tenantName/security"
	storage                     = "/storage"
	storageVolumes              = "/storage/volumes"
	storageDrives               = "/storage/drives"
	remoteBuckets               = "/remote-buckets"
	replication                 = "/replication"
	objectBrowser               = "/object-browser/:bucket/*"
	objectBrowserBucket         = "/object-browser/:bucket"
	mainObjectBrowser           = "/object-browser"
	license                     = "/license"
	watch                       = "/watch"
	heal                        = "/heal"
	trace                       = "/trace"
	logs                        = "/logs"
	healthInfo                  = "/health-info"
)

type ConfigurationActionSet struct {
	actionTypes iampolicy.ActionSet
	actions     iampolicy.ActionSet
}

// configurationActionSet contains the list of admin actions required for this endpoint to work
var configurationActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConfigUpdateAdminAction,
	),
}

// dashboardActionSet contains the list of admin actions required for this endpoint to work
var dashboardActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ServerInfoAdminAction,
	),
}

// groupsActionSet contains the list of admin actions required for this endpoint to work
var groupsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListGroupsAdminAction,
		iampolicy.AddUserToGroupAdminAction,
		//iampolicy.GetGroupAdminAction,
		iampolicy.EnableGroupAdminAction,
		iampolicy.DisableGroupAdminAction,
	),
}

// iamPoliciesActionSet contains the list of admin actions required for this endpoint to work
var iamPoliciesActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.GetPolicyAdminAction,
		iampolicy.DeletePolicyAdminAction,
		iampolicy.CreatePolicyAdminAction,
		iampolicy.AttachPolicyAdminAction,
		iampolicy.ListUserPoliciesAdminAction,
	),
}

// profilingActionSet contains the list of admin actions required for this endpoint to work
var profilingActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ProfilingAdminAction,
	),
}

// usersActionSet contains the list of admin actions required for this endpoint to work
var usersActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListUsersAdminAction,
		iampolicy.CreateUserAdminAction,
		iampolicy.DeleteUserAdminAction,
		iampolicy.GetUserAdminAction,
		iampolicy.EnableUserAdminAction,
		iampolicy.DisableUserAdminAction,
	),
}

// bucketsActionSet contains the list of admin actions required for this endpoint to work
var bucketsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllActions,
	),
	actions: iampolicy.NewActionSet(
		// Read access to buckets
		iampolicy.ListMultipartUploadPartsAction,
		iampolicy.ListBucketMultipartUploadsAction,
		iampolicy.ListBucketAction,
		iampolicy.HeadBucketAction,
		iampolicy.GetObjectAction,
		iampolicy.GetBucketLocationAction,
		// Write access to buckets
		iampolicy.AbortMultipartUploadAction,
		iampolicy.CreateBucketAction,
		iampolicy.PutObjectAction,
		iampolicy.DeleteObjectAction,
		iampolicy.DeleteBucketAction,
		// Assign bucket policies
		iampolicy.PutBucketPolicyAction,
		iampolicy.DeleteBucketPolicyAction,
		iampolicy.GetBucketPolicyAction,
	),
}

// serviceAccountsActionSet no actions needed for this module to work
var serviceAccountsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

// changePasswordActionSet requires admin:CreateUser policy permission
var changePasswordActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.CreateUserAdminAction,
	),
}

// tenantsActionSet temporally no actions needed for tenants sections to work
var tenantsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

var storageActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

var remoteBucketsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConfigUpdateAdminAction,
	),
}

var replicationActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConfigUpdateAdminAction,
	),
}

// objectBrowserActionSet no actions needed for this module to work
var objectBrowserActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

// licenseActionSet no actions needed for this module to work
var licenseActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

// watchActionSet contains the list of admin actions required for this endpoint to work
var watchActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListenBucketNotificationAction,
	),
}

// healActionSet contains the list of admin actions required for this endpoint to work
var healActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.HealAdminAction,
	),
}

// logsActionSet contains the list of admin actions required for this endpoint to work
var logsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConsoleLogAdminAction,
	),
}

// traceActionSet contains the list of admin actions required for this endpoint to work
var traceActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.TraceAdminAction,
	),
}

// healthInfoActionSet contains the list of admin actions required for this endpoint to work
var healthInfoActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.HealthInfoAdminAction,
	),
}

var displayRules = map[string]func() bool{
	// disable users page if LDAP is enabled
	users: func() bool {
		return !GetLDAPEnabled()
	},
	// disable groups page if LDAP is enabled
	groups: func() bool {
		return !GetLDAPEnabled()
	},
}

// endpointRules contains the mapping between endpoints and ActionSets, additional rules can be added here
var endpointRules = map[string]ConfigurationActionSet{
	configuration:               configurationActionSet,
	users:                       usersActionSet,
	usersDetail:                 usersActionSet,
	groups:                      groupsActionSet,
	iamPolicies:                 iamPoliciesActionSet,
	policiesDetail:              iamPoliciesActionSet,
	dashboard:                   dashboardActionSet,
	profiling:                   profilingActionSet,
	buckets:                     bucketsActionSet,
	bucketsDetail:               bucketsActionSet,
	bucketsDetailSummary:        bucketsActionSet,
	bucketsDetailEvents:         bucketsActionSet,
	bucketsDetailReplication:    bucketsActionSet,
	bucketsDetailLifecycle:      bucketsActionSet,
	bucketsDetailAccess:         bucketsActionSet,
	bucketsDetailAccessPolicies: bucketsActionSet,
	bucketsDetailAccessUsers:    bucketsActionSet,
	serviceAccounts:             serviceAccountsActionSet,
	changePassword:              changePasswordActionSet,
	remoteBuckets:               remoteBucketsActionSet,
	replication:                 replicationActionSet,
	objectBrowser:               objectBrowserActionSet,
	mainObjectBrowser:           objectBrowserActionSet,
	objectBrowserBucket:         objectBrowserActionSet,
	license:                     licenseActionSet,
	watch:                       watchActionSet,
	heal:                        healActionSet,
	trace:                       traceActionSet,
	logs:                        logsActionSet,
	healthInfo:                  healthInfoActionSet,
}

// operatorRules contains the mapping between endpoints and ActionSets for operator only mode
var operatorRules = map[string]ConfigurationActionSet{
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

// operatorOnly ENV variable
var operatorOnly = GetOperatorMode()

// GetActionsStringFromPolicy extract the admin/s3 actions from a given policy and return them in []string format
//
// ie:
//	{
//		"Version": "2012-10-17",
//		"Statement": [{
//				"Action": [
//					"admin:ServerInfo",
//					"admin:CreatePolicy",
//					"admin:GetUser"
//				],
//				...
//			},
//			{
//				"Action": [
//					"s3:ListenBucketNotification",
//					"s3:PutBucketNotification"
//				],
//				...
//			}
//		]
//	}
// Will produce an array like: ["admin:ServerInfo", "admin:CreatePolicy", "admin:GetUser", "s3:ListenBucketNotification", "s3:PutBucketNotification"]\
func GetActionsStringFromPolicy(policy *iampolicy.Policy) []string {
	var actions []string
	for _, statement := range policy.Statements {
		// We only care about allowed actions
		if statement.Effect.IsAllowed(true) {
			for _, action := range statement.Actions.ToSlice() {
				actions = append(actions, string(action))
			}
		}
	}
	return actions
}

// actionsStringToActionSet convert a given string array to iampolicy.ActionSet structure
// this avoids ending with duplicate actions
func actionsStringToActionSet(actions []string) iampolicy.ActionSet {
	actionsSet := iampolicy.ActionSet{}
	for _, action := range actions {
		actionsSet.Add(iampolicy.Action(action))
	}
	return actionsSet
}

// GetAuthorizedEndpoints return a list of allowed endpoint based on a provided *iampolicy.Policy
// ie: pages the user should have access based on his current privileges
func GetAuthorizedEndpoints(actions []string) []string {
	rangeTake := endpointRules

	if operatorOnly {
		rangeTake = operatorRules
	}

	// Prepare new ActionSet structure that will hold all the user actions
	userAllowedAction := actionsStringToActionSet(actions)
	var allowedEndpoints []string
	for endpoint, rules := range rangeTake {

		// check if display rule exists for this endpoint, this will control
		// what user sees on the console UI
		if rule, ok := displayRules[endpoint]; ok {
			if rule != nil && !rule() {
				continue
			}
		}

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

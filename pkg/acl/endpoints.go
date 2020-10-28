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

package acl

import (
	iampolicy "github.com/minio/minio/pkg/iam/policy"
)

// endpoints definition
var (
	configuration       = "/configurations-list"
	users               = "/users"
	groups              = "/groups"
	iamPolicies         = "/policies"
	dashboard           = "/dashboard"
	profiling           = "/profiling"
	trace               = "/trace"
	logs                = "/logs"
	watch               = "/watch"
	notifications       = "/notification-endpoints"
	buckets             = "/buckets"
	bucketsDetail       = "/buckets/:bucketName"
	serviceAccounts     = "/service-accounts"
	tenants             = "/tenants"
	tenantsDetail       = "/namespaces/:tenantNamespace/tenants/:tenantName"
	heal                = "/heal"
	remoteBuckets       = "/remote-buckets"
	replication         = "/replication"
	objectBrowser       = "/object-browser/:bucket/*"
	objectBrowserBucket = "/object-browser/:bucket"
	mainObjectBrowser   = "/object-browser"
	license             = "/license"
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

// logsActionSet contains the list of admin actions required for this endpoint to work
var logsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConsoleLogAdminAction,
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

// traceActionSet contains the list of admin actions required for this endpoint to work
var traceActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.TraceAdminAction,
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

// watchActionSet contains the list of admin actions required for this endpoint to work
var watchActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListenBucketNotificationAction,
	),
}

// notificationsActionSet contains the list of admin actions required for this endpoint to work
var notificationsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListenBucketNotificationAction,
		iampolicy.PutBucketNotificationAction,
		iampolicy.GetBucketNotificationAction,
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

// tenantsActionSet temporally no actions needed for tenants sections to work
var tenantsActionSet = ConfigurationActionSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
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

// endpointRules contains the mapping between endpoints and ActionSets, additional rules can be added here
var endpointRules = map[string]ConfigurationActionSet{
	configuration:       configurationActionSet,
	users:               usersActionSet,
	groups:              groupsActionSet,
	iamPolicies:         iamPoliciesActionSet,
	dashboard:           dashboardActionSet,
	profiling:           profilingActionSet,
	trace:               traceActionSet,
	logs:                logsActionSet,
	watch:               watchActionSet,
	notifications:       notificationsActionSet,
	buckets:             bucketsActionSet,
	bucketsDetail:       bucketsActionSet,
	serviceAccounts:     serviceAccountsActionSet,
	heal:                healActionSet,
	remoteBuckets:       remoteBucketsActionSet,
	replication:         replicationActionSet,
	objectBrowser:       objectBrowserActionSet,
	mainObjectBrowser:   objectBrowserActionSet,
	objectBrowserBucket: objectBrowserActionSet,
	license:             licenseActionSet,
}

// operatorRules contains the mapping between endpoints and ActionSets for operator only mode
var operatorRules = map[string]ConfigurationActionSet{
	tenants:       tenantsActionSet,
	tenantsDetail: tenantsActionSet,
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

	if len(actions) == 0 {
		return []string{}
	}
	// Prepare new ActionSet structure that will hold all the user actions
	userAllowedAction := actionsStringToActionSet(actions)
	allowedEndpoints := []string{}
	for endpoint, rules := range rangeTake {
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

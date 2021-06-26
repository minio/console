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

// +build !operator

package acl

import (
	iampolicy "github.com/minio/pkg/iam/policy"
)

// endpoints definition
var (
	config                      = "/settings"
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

// configActionSet contains the list of admin actions required for this endpoint to work
var configActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConfigUpdateAdminAction,
	),
}

// dashboardActionSet contains the list of admin actions required for this endpoint to work
var dashboardActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ServerInfoAdminAction,
	),
}

// groupsActionSet contains the list of admin actions required for this endpoint to work
var groupsActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListGroupsAdminAction,
		iampolicy.AddUserToGroupAdminAction,
		iampolicy.GetGroupAdminAction,
		iampolicy.EnableGroupAdminAction,
		iampolicy.DisableGroupAdminAction,
	),
}

// iamPoliciesActionSet contains the list of admin actions required for this endpoint to work
var iamPoliciesActionSet = actionsSet{
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
var profilingActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ProfilingAdminAction,
	),
}

// usersActionSet contains the list of admin actions required for this endpoint to work
var usersActionSet = actionsSet{
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
var bucketsActionSet = actionsSet{
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
var serviceAccountsActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

// changePasswordActionSet requires admin:CreateUser policy permission
var changePasswordActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.CreateUserAdminAction,
	),
}

var remoteBucketsActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConfigUpdateAdminAction,
	),
}

var replicationActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConfigUpdateAdminAction,
	),
}

// objectBrowserActionSet no actions needed for this module to work
var objectBrowserActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
}

// watchActionSet contains the list of admin actions required for this endpoint to work
var watchActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ListenBucketNotificationAction,
	),
}

// healActionSet contains the list of admin actions required for this endpoint to work
var healActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.HealAdminAction,
	),
}

// logsActionSet contains the list of admin actions required for this endpoint to work
var logsActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.ConsoleLogAdminAction,
	),
}

// traceActionSet contains the list of admin actions required for this endpoint to work
var traceActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.TraceAdminAction,
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

// healthInfoActionSet contains the list of admin actions required for this endpoint to work
var healthInfoActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(
		iampolicy.AllAdminActions,
	),
	actions: iampolicy.NewActionSet(
		iampolicy.HealthInfoAdminAction,
	),
}

// endpointRules contains the mapping between endpoints and ActionSets, additional rules can be added here
var endpointRules = map[string]actionsSet{
	config:                      configActionSet,
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

// GetAuthorizedEndpoints return a list of allowed endpoint based on a provided *iampolicy.Policy
// ie: pages the user should have access based on his current privileges
func GetAuthorizedEndpoints(actions []string) []string {
	// Prepare new ActionSet structure that will hold all the user actions
	userAllowedAction := actionsStringToActionSet(actions)
	var allowedEndpoints []string
	for endpoint, rules := range endpointRules {
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

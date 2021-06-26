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

import iampolicy "github.com/minio/pkg/iam/policy"

type actionsSet struct {
	actionTypes iampolicy.ActionSet
	actions     iampolicy.ActionSet
}

// licenseActionSet no actions needed for this module to work
var licenseActionSet = actionsSet{
	actionTypes: iampolicy.NewActionSet(),
	actions:     iampolicy.NewActionSet(),
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

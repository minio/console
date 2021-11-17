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

package restapi

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/minio/pkg/bucket/policy/condition"

	minioIAMPolicy "github.com/minio/pkg/iam/policy"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
)

func isErasureMode() bool {
	u, err := url.Parse(getMinIOServer())
	if err != nil {
		panic(err)
	}
	u.Path = "/minio/health/cluster"

	req, err := http.NewRequest(http.MethodGet, u.String(), nil)
	if err != nil {
		panic(err)
	}

	clnt := GetConsoleHTTPClient()
	resp, err := clnt.Do(req)
	if err != nil {
		panic(err)
	}

	if resp.StatusCode != http.StatusOK {
		return false
	}

	return resp.Header.Get("x-minio-write-quorum") != ""
}

func registerSessionHandlers(api *operations.ConsoleAPI) {
	// session check
	api.UserAPISessionCheckHandler = user_api.SessionCheckHandlerFunc(func(params user_api.SessionCheckParams, session *models.Principal) middleware.Responder {
		sessionResp, err := getSessionResponse(session)
		if err != nil {
			return user_api.NewSessionCheckDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewSessionCheckOK().WithPayload(sessionResp)
	})
}

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(session *models.Principal) (*models.SessionResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	if session == nil {
		return nil, prepareError(errorGenericInvalidSession)
	}

	// initialize admin client
	mAdminClient, err := NewMinioAdminClient(&models.Principal{
		STSAccessKeyID:     session.STSAccessKeyID,
		STSSecretAccessKey: session.STSSecretAccessKey,
		STSSessionToken:    session.STSSessionToken,
	})
	if err != nil {
		return nil, prepareError(err, errorGenericInvalidSession)
	}
	userAdminClient := AdminClient{Client: mAdminClient}
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	policy, err := getAccountPolicy(ctx, userAdminClient)
	if err != nil {
		return nil, prepareError(err, errorGenericInvalidSession)
	}
	// by default every user starts with an empty array of available val
	// therefore we would have access only to pages that doesn't require any privilege
	// ie: service-account page
	var actions []string
	// if a policy is assigned to this user we parse the val from there
	if policy != nil {
		actions = acl.GetActionsStringFromPolicy(policy)
	}

	// This actions will be global, meaning has to be attached to all resources
	conditionValues := map[string][]string{
		condition.AWSUsername.Name(): {session.AccountAccessKey},
	}
	defaultActions := policy.IsAllowedActions("", "", conditionValues)
	consoleResourceName := "console-ui"
	permissions := map[string]minioIAMPolicy.ActionSet{
		consoleResourceName: defaultActions,
	}
	deniedActions := map[string]minioIAMPolicy.ActionSet{}
	for _, statement := range policy.Statements {
		for _, resource := range statement.Resources.ToSlice() {
			resourceName := resource.String()
			statementActions := statement.Actions.ToSlice()
			if statement.Effect == "Allow" {
				// check if val are denied before adding them to the map
				var allowedActions []minioIAMPolicy.Action
				if dActions, ok := deniedActions[resourceName]; ok {
					for _, action := range statementActions {
						if len(dActions.Intersection(minioIAMPolicy.NewActionSet(action))) == 0 {
							// It's ok to allow this action
							allowedActions = append(allowedActions, action)
						}
					}
				} else {
					allowedActions = statementActions
				}

				// Add validated actions
				if resourceActions, ok := permissions[resourceName]; ok {
					mergedActions := append(resourceActions.ToSlice(), allowedActions...)
					permissions[resourceName] = minioIAMPolicy.NewActionSet(mergedActions...)
				} else {
					mergedActions := append(defaultActions.ToSlice(), allowedActions...)
					permissions[resourceName] = minioIAMPolicy.NewActionSet(mergedActions...)
				}
			} else {
				// Add new banned actions to the map
				if resourceActions, ok := deniedActions[resourceName]; ok {
					mergedActions := append(resourceActions.ToSlice(), statementActions...)
					deniedActions[resourceName] = minioIAMPolicy.NewActionSet(mergedActions...)
				} else {
					deniedActions[resourceName] = statement.Actions
				}
				// Remove existing val from key if necessary
				if currentResourceActions, ok := permissions[resourceName]; ok {
					var newAllowedActions []minioIAMPolicy.Action
					for _, action := range currentResourceActions.ToSlice() {
						if len(deniedActions[resourceName].Intersection(minioIAMPolicy.NewActionSet(action))) == 0 {
							// It's ok to allow this action
							newAllowedActions = append(newAllowedActions, action)
						}
					}
					permissions[resourceName] = minioIAMPolicy.NewActionSet(newAllowedActions...)
				}
			}
		}
	}
	resourcePermissions := map[string][]string{}
	for key, val := range permissions {
		var resourceActions []string
		for _, action := range val.ToSlice() {
			resourceActions = append(resourceActions, string(action))
		}
		resourcePermissions[key] = resourceActions

	}
	rawPolicy, err := json.Marshal(policy)
	if err != nil {
		return nil, prepareError(err, errorGenericInvalidSession)
	}
	var sessionPolicy *models.IamPolicy
	err = json.Unmarshal(rawPolicy, &sessionPolicy)
	if err != nil {
		return nil, prepareError(err)
	}
	sessionResp := &models.SessionResponse{
		Pages:           acl.GetAuthorizedEndpoints(actions),
		Features:        getListOfEnabledFeatures(),
		Status:          models.SessionResponseStatusOk,
		Operator:        false,
		DistributedMode: isErasureMode(),
		Permissions:     resourcePermissions,
	}
	return sessionResp, nil
}

// getListOfEnabledFeatures returns a list of features
func getListOfEnabledFeatures() []string {
	var features []string
	logSearchURL := getLogSearchURL()

	if logSearchURL != "" {
		features = append(features, "log-search")
	}

	return features
}

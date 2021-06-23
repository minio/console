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
	"bytes"
	"context"
	"encoding/json"
	"sort"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
	iampolicy "github.com/minio/pkg/iam/policy"
)

func registersPoliciesHandler(api *operations.ConsoleAPI) {
	// List Policies
	api.AdminAPIListPoliciesHandler = admin_api.ListPoliciesHandlerFunc(func(params admin_api.ListPoliciesParams, session *models.Principal) middleware.Responder {
		listPoliciesResponse, err := getListPoliciesResponse(session)
		if err != nil {
			return admin_api.NewListPoliciesDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListPoliciesOK().WithPayload(listPoliciesResponse)
	})
	// Policy Info
	api.AdminAPIPolicyInfoHandler = admin_api.PolicyInfoHandlerFunc(func(params admin_api.PolicyInfoParams, session *models.Principal) middleware.Responder {
		policyInfo, err := getPolicyInfoResponse(session, params)
		if err != nil {
			return admin_api.NewPolicyInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewPolicyInfoOK().WithPayload(policyInfo)
	})
	// Add Policy
	api.AdminAPIAddPolicyHandler = admin_api.AddPolicyHandlerFunc(func(params admin_api.AddPolicyParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getAddPolicyResponse(session, params.Body)
		if err != nil {
			return admin_api.NewAddPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAddPolicyCreated().WithPayload(policyResponse)
	})
	// Remove Policy
	api.AdminAPIRemovePolicyHandler = admin_api.RemovePolicyHandlerFunc(func(params admin_api.RemovePolicyParams, session *models.Principal) middleware.Responder {
		if err := getRemovePolicyResponse(session, params); err != nil {
			return admin_api.NewRemovePolicyDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewRemovePolicyNoContent()
	})
	// Set Policy
	api.AdminAPISetPolicyHandler = admin_api.SetPolicyHandlerFunc(func(params admin_api.SetPolicyParams, session *models.Principal) middleware.Responder {
		if err := getSetPolicyResponse(session, params.Name, params.Body); err != nil {
			return admin_api.NewSetPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSetPolicyNoContent()
	})
	// Set Policy Multiple User/Groups
	api.AdminAPISetPolicyMultipleHandler = admin_api.SetPolicyMultipleHandlerFunc(func(params admin_api.SetPolicyMultipleParams, session *models.Principal) middleware.Responder {
		if err := getSetPolicyMultipleResponse(session, params.Name, params.Body); err != nil {
			return admin_api.NewSetPolicyMultipleDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewSetPolicyMultipleNoContent()
	})
	api.AdminAPIListPoliciesWithBucketHandler = admin_api.ListPoliciesWithBucketHandlerFunc(func(params admin_api.ListPoliciesWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getListPoliciesWithBucketResponse(session, params.Bucket)
		if err != nil {
			return admin_api.NewListPoliciesWithBucketDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListPoliciesWithBucketOK().WithPayload(policyResponse)
	})
	api.AdminAPIListUsersForPolicyHandler = admin_api.ListUsersForPolicyHandlerFunc(func(params admin_api.ListUsersForPolicyParams, session *models.Principal) middleware.Responder {
		policyUsersResponse, err := getListUsersForPolicyResponse(session, params.Policy)
		if err != nil {
			return admin_api.NewListUsersForPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListUsersForPolicyOK().WithPayload(policyUsersResponse)
	})
	api.AdminAPIListGroupsForPolicyHandler = admin_api.ListGroupsForPolicyHandlerFunc(func(params admin_api.ListGroupsForPolicyParams, session *models.Principal) middleware.Responder {
		policyGroupsResponse, err := getListGroupsForPolicyResponse(session, params.Policy)
		if err != nil {
			return admin_api.NewListGroupsForPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewListGroupsForPolicyOK().WithPayload(policyGroupsResponse)
	})
}

func getListPoliciesWithBucketResponse(session *models.Principal, bucket string) (*models.ListPoliciesResponse, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	policies, err := listPoliciesWithBucket(ctx, bucket, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	// serialize output
	listPoliciesResponse := &models.ListPoliciesResponse{
		Policies: policies,
		Total:    int64(len(policies)),
	}
	return listPoliciesResponse, nil
}

// listPoliciesWithBucket calls MinIO server to list all policy names present on the server that apply to a particular bucket.
// listPoliciesWithBucket() converts the map[string][]byte returned by client.listPolicies()
// to []*models.Policy by iterating over each key in policyRawMap and
// then using Unmarshal on the raw bytes to create a *models.Policy
func listPoliciesWithBucket(ctx context.Context, bucket string, client MinioAdmin) ([]*models.Policy, error) {
	policyMap, err := client.listPolicies(ctx)
	var policies []*models.Policy
	if err != nil {
		return nil, err
	}
	for name, policy := range policyMap {
		policy, err := parsePolicy(name, policy)
		if err != nil {
			return nil, err
		}
		if policyMatchesBucket(policy, bucket) {
			policies = append(policies, policy)
		}
	}
	return policies, nil
}

func policyMatchesBucket(policy *models.Policy, bucket string) bool {
	policyData := &iampolicy.Policy{}
	json.Unmarshal([]byte(policy.Policy), policyData)
	policyStatements := policyData.Statements
	for i := 0; i < len(policyStatements); i++ {
		resources := policyStatements[i].Resources
		if resources.Match(bucket, map[string][]string{}) {
			return true
		}
	}
	return false
}

// listPolicies calls MinIO server to list all policy names present on the server.
// listPolicies() converts the map[string][]byte returned by client.listPolicies()
// to []*models.Policy by iterating over each key in policyRawMap and
// then using Unmarshal on the raw bytes to create a *models.Policy
func listPolicies(ctx context.Context, client MinioAdmin) ([]*models.Policy, error) {
	policyMap, err := client.listPolicies(ctx)
	var policies []*models.Policy
	if err != nil {
		return nil, err
	}
	for name, policy := range policyMap {
		policy, err := parsePolicy(name, policy)
		if err != nil {
			return nil, err
		}
		policies = append(policies, policy)
	}
	return policies, nil
}

// getListPoliciesResponse performs listPolicies() and serializes it to the handler's output
func getListPoliciesResponse(session *models.Principal) (*models.ListPoliciesResponse, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	policies, err := listPolicies(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	// serialize output
	listPoliciesResponse := &models.ListPoliciesResponse{
		Policies: policies,
		Total:    int64(len(policies)),
	}
	return listPoliciesResponse, nil
}

// getListUsersForPoliciesResponse performs lists users affected by a given policy.
func getListUsersForPolicyResponse(session *models.Principal, policy string) ([]string, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	users, err := listUsers(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}

	var filteredUsers []string
	for _, user := range users {
		for _, upolicy := range user.Policy {
			if upolicy == policy {
				filteredUsers = append(filteredUsers, user.AccessKey)
				break
			}
		}
	}
	sort.Strings(filteredUsers)
	return filteredUsers, nil
}

func getListGroupsForPolicyResponse(session *models.Principal, policy string) ([]string, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	groups, err := adminClient.listGroups(ctx)
	if err != nil {
		return nil, prepareError(err)
	}

	var filteredGroups []string
	for _, group := range groups {
		info, err := groupInfo(ctx, adminClient, group)
		if err != nil {
			LogError("unable to fetch group info %s: %v", group, err)
		}
		if info.Policy == policy {
			filteredGroups = append(filteredGroups, group)
		}
	}
	sort.Strings(filteredGroups)
	return filteredGroups, nil
}

// removePolicy() calls MinIO server to remove a policy based on name.
func removePolicy(ctx context.Context, client MinioAdmin, name string) error {
	err := client.removePolicy(ctx, name)
	if err != nil {
		return err
	}
	return nil
}

// getRemovePolicyResponse() performs removePolicy() and serializes it to the handler's output
func getRemovePolicyResponse(session *models.Principal, params admin_api.RemovePolicyParams) *models.Error {
	ctx := context.Background()
	if params.Name == "" {
		return prepareError(errPolicyNameNotInRequest)
	}
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := removePolicy(ctx, adminClient, params.Name); err != nil {
		return prepareError(err)
	}
	return nil
}

// addPolicy calls MinIO server to add a canned policy.
// addPolicy() takes name and policy in string format, policy
// policy must be string in json format, in the future this will change
// to a Policy struct{} - https://github.com/minio/minio/issues/9171
func addPolicy(ctx context.Context, client MinioAdmin, name, policy string) (*models.Policy, error) {
	iamp, err := iampolicy.ParseConfig(bytes.NewReader([]byte(policy)))
	if err != nil {
		return nil, err
	}
	if err := client.addPolicy(ctx, name, iamp); err != nil {
		return nil, err
	}
	policyObject, err := policyInfo(ctx, client, name)
	if err != nil {
		return nil, err
	}
	return policyObject, nil
}

// getAddPolicyResponse performs addPolicy() and serializes it to the handler's output
func getAddPolicyResponse(session *models.Principal, params *models.AddPolicyRequest) (*models.Policy, *models.Error) {
	ctx := context.Background()
	if params == nil {
		return nil, prepareError(errPolicyBodyNotInRequest)
	}

	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	policy, err := addPolicy(ctx, adminClient, *params.Name, *params.Policy)
	if err != nil {
		return nil, prepareError(err)
	}
	return policy, nil
}

// policyInfo calls MinIO server to retrieve information of a canned policy.
// policyInfo() takes a policy name, obtains the []byte (represents a string in JSON format)
// and return it as *models.Policy , in the future this will change
// to a Policy struct{} - https://github.com/minio/minio/issues/9171
func policyInfo(ctx context.Context, client MinioAdmin, name string) (*models.Policy, error) {
	policyRaw, err := client.getPolicy(ctx, name)
	if err != nil {
		return nil, err
	}
	policy, err := parsePolicy(name, policyRaw)
	if err != nil {
		return nil, err
	}
	return policy, nil
}

// getPolicyInfoResponse performs policyInfo() and serializes it to the handler's output
func getPolicyInfoResponse(session *models.Principal, params admin_api.PolicyInfoParams) (*models.Policy, *models.Error) {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	policy, err := policyInfo(ctx, adminClient, params.Name)
	if err != nil {
		return nil, prepareError(err)
	}
	return policy, nil
}

// setPolicy() calls MinIO server to assign policy to a group or user.
func setPolicy(ctx context.Context, client MinioAdmin, name, entityName string, entityType models.PolicyEntity) error {
	isGroup := false
	if entityType == models.PolicyEntityGroup {
		isGroup = true
	}
	return client.setPolicy(ctx, name, entityName, isGroup)
}

// getSetPolicyResponse() performs setPolicy() and serializes it to the handler's output
func getSetPolicyResponse(session *models.Principal, name string, params *models.SetPolicyRequest) *models.Error {
	ctx := context.Background()
	if name == "" {
		return prepareError(errPolicyNameNotInRequest)
	}
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := setPolicy(ctx, adminClient, name, *params.EntityName, *params.EntityType); err != nil {
		return prepareError(err)
	}
	return nil
}

func getSetPolicyMultipleResponse(session *models.Principal, name string, params *models.SetPolicyMultipleRequest) *models.Error {
	ctx := context.Background()
	mAdmin, err := newAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}

	if err := setPolicyMultipleEntities(ctx, adminClient, name, params.Users, params.Groups); err != nil {
		return prepareError(err)
	}
	return nil
}

// setPolicyMultipleEntities sets a policy to multiple users/groups
func setPolicyMultipleEntities(ctx context.Context, client MinioAdmin, policyName string, users, groups []models.IamEntity) error {
	for _, user := range users {
		if err := client.setPolicy(ctx, policyName, string(user), false); err != nil {
			return err
		}
	}
	for _, group := range groups {
		if err := client.setPolicy(ctx, policyName, string(group), true); err != nil {
			return err
		}
	}
	return nil
}

// parsePolicy() converts from *rawPolicy to *models.Policy
func parsePolicy(name string, rawPolicy *iampolicy.Policy) (*models.Policy, error) {
	stringPolicy, err := json.Marshal(rawPolicy)
	if err != nil {
		return nil, err
	}
	policy := &models.Policy{
		Name:   name,
		Policy: string(stringPolicy),
	}
	return policy, nil
}

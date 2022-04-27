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
	"fmt"
	"sort"
	"strings"

	bucketApi "github.com/minio/console/restapi/operations/bucket"
	policyApi "github.com/minio/console/restapi/operations/policy"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	iampolicy "github.com/minio/pkg/iam/policy"
)

func registersPoliciesHandler(api *operations.ConsoleAPI) {
	// List Policies
	api.PolicyListPoliciesHandler = policyApi.ListPoliciesHandlerFunc(func(params policyApi.ListPoliciesParams, session *models.Principal) middleware.Responder {
		listPoliciesResponse, err := getListPoliciesResponse(session)
		if err != nil {
			return policyApi.NewListPoliciesDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewListPoliciesOK().WithPayload(listPoliciesResponse)
	})
	// Policy Info
	api.PolicyPolicyInfoHandler = policyApi.PolicyInfoHandlerFunc(func(params policyApi.PolicyInfoParams, session *models.Principal) middleware.Responder {
		policyInfo, err := getPolicyInfoResponse(session, params)
		if err != nil {
			return policyApi.NewPolicyInfoDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewPolicyInfoOK().WithPayload(policyInfo)
	})
	// Add Policy
	api.PolicyAddPolicyHandler = policyApi.AddPolicyHandlerFunc(func(params policyApi.AddPolicyParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getAddPolicyResponse(session, params.Body)
		if err != nil {
			return policyApi.NewAddPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewAddPolicyCreated().WithPayload(policyResponse)
	})
	// Remove Policy
	api.PolicyRemovePolicyHandler = policyApi.RemovePolicyHandlerFunc(func(params policyApi.RemovePolicyParams, session *models.Principal) middleware.Responder {
		if err := getRemovePolicyResponse(session, params); err != nil {
			return policyApi.NewRemovePolicyDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewRemovePolicyNoContent()
	})
	// Set Policy
	api.PolicySetPolicyHandler = policyApi.SetPolicyHandlerFunc(func(params policyApi.SetPolicyParams, session *models.Principal) middleware.Responder {
		if err := getSetPolicyResponse(session, params.Body); err != nil {
			return policyApi.NewSetPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewSetPolicyNoContent()
	})
	// Set Policy Multiple User/Groups
	api.PolicySetPolicyMultipleHandler = policyApi.SetPolicyMultipleHandlerFunc(func(params policyApi.SetPolicyMultipleParams, session *models.Principal) middleware.Responder {
		if err := getSetPolicyMultipleResponse(session, params.Body); err != nil {
			return policyApi.NewSetPolicyMultipleDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewSetPolicyMultipleNoContent()
	})
	api.BucketListPoliciesWithBucketHandler = bucketApi.ListPoliciesWithBucketHandlerFunc(func(params bucketApi.ListPoliciesWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getListPoliciesWithBucketResponse(session, params.Bucket)
		if err != nil {
			return bucketApi.NewListPoliciesWithBucketDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewListPoliciesWithBucketOK().WithPayload(policyResponse)
	})
	api.BucketListAccessRulesWithBucketHandler = bucketApi.ListAccessRulesWithBucketHandlerFunc(func(params bucketApi.ListAccessRulesWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getListAccessRulesWithBucketResponse(session, params.Bucket)
		if err != nil {
			return bucketApi.NewListAccessRulesWithBucketDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewListAccessRulesWithBucketOK().WithPayload(policyResponse)
	})
	api.BucketSetAccessRuleWithBucketHandler = bucketApi.SetAccessRuleWithBucketHandlerFunc(func(params bucketApi.SetAccessRuleWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getSetAccessRuleWithBucketResponse(session, params.Bucket, params.Prefixaccess)
		if err != nil {
			return bucketApi.NewSetAccessRuleWithBucketDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewSetAccessRuleWithBucketOK().WithPayload(policyResponse)
	})
	api.BucketDeleteAccessRuleWithBucketHandler = bucketApi.DeleteAccessRuleWithBucketHandlerFunc(func(params bucketApi.DeleteAccessRuleWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getDeleteAccessRuleWithBucketResponse(session, params.Bucket, params.Prefix)
		if err != nil {
			return bucketApi.NewDeleteAccessRuleWithBucketDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewDeleteAccessRuleWithBucketOK().WithPayload(policyResponse)
	})
	api.PolicyListUsersForPolicyHandler = policyApi.ListUsersForPolicyHandlerFunc(func(params policyApi.ListUsersForPolicyParams, session *models.Principal) middleware.Responder {
		policyUsersResponse, err := getListUsersForPolicyResponse(session, params.Policy)
		if err != nil {
			return policyApi.NewListUsersForPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewListUsersForPolicyOK().WithPayload(policyUsersResponse)
	})
	api.PolicyListGroupsForPolicyHandler = policyApi.ListGroupsForPolicyHandlerFunc(func(params policyApi.ListGroupsForPolicyParams, session *models.Principal) middleware.Responder {
		policyGroupsResponse, err := getListGroupsForPolicyResponse(session, params.Policy)
		if err != nil {
			return policyApi.NewListGroupsForPolicyDefault(int(err.Code)).WithPayload(err)
		}
		return policyApi.NewListGroupsForPolicyOK().WithPayload(policyGroupsResponse)
	})
}

func getListAccessRulesWithBucketResponse(session *models.Principal, bucket string) (*models.ListAccessRulesResponse, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client, err := newS3BucketClient(session, bucket, "")
	if err != nil {
		return nil, prepareError(err)
	}
	accessRules, _ := client.GetAccessRules(ctx)
	var accessRuleList []*models.AccessRule
	for k, v := range accessRules {
		accessRuleList = append(accessRuleList, &models.AccessRule{Prefix: k[len(bucket)+1 : len(k)-1], Access: v})
	}
	return &models.ListAccessRulesResponse{AccessRules: accessRuleList}, nil
}

func getSetAccessRuleWithBucketResponse(session *models.Principal, bucket string, prefixAccess *models.PrefixAccessPair) (bool, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client, err := newS3BucketClient(session, bucket, prefixAccess.Prefix)
	if err != nil {
		return false, prepareError(err)
	}
	errorVal := client.SetAccess(ctx, prefixAccess.Access, false)
	if errorVal != nil {
		return false, prepareError(errorVal.Cause)
	}
	return true, nil
}

func getDeleteAccessRuleWithBucketResponse(session *models.Principal, bucket string, prefix *models.PrefixWrapper) (bool, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client, err := newS3BucketClient(session, bucket, prefix.Prefix)
	if err != nil {
		return false, prepareError(err)
	}
	errorVal := client.SetAccess(ctx, "none", false)
	if errorVal != nil {
		return false, prepareError(errorVal.Cause)
	}
	return true, nil
}

func getListPoliciesWithBucketResponse(session *models.Principal, bucket string) (*models.ListPoliciesResponse, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

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
	err := json.Unmarshal([]byte(policy.Policy), policyData)
	if err != nil {
		LogError("error parsing policy: %v", err)
		return false
	}
	policyStatements := policyData.Statements
	for i := 0; i < len(policyStatements); i++ {
		resources := policyStatements[i].Resources
		if resources.Match(bucket, map[string][]string{}) {
			return true
		}
		if resources.Match(fmt.Sprintf("%s/*", bucket), map[string][]string{}) {
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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	groups, err := adminClient.listGroups(ctx)
	if err != nil {
		return nil, prepareError(err)
	}

	var filteredGroups []string
	for _, group := range groups {
		info, err := groupInfo(ctx, adminClient, group)
		if err != nil {
			return nil, prepareError(err)
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
func getRemovePolicyResponse(session *models.Principal, params policyApi.RemovePolicyParams) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if params.Name == "" {
		return prepareError(errPolicyNameNotInRequest)
	}
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if params == nil {
		return nil, prepareError(errPolicyBodyNotInRequest)
	}

	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
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
func getPolicyInfoResponse(session *models.Principal, params policyApi.PolicyInfoParams) (*models.Policy, *models.Error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
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
func getSetPolicyResponse(session *models.Principal, params *models.SetPolicyNameRequest) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// if len(params.Name) == 0 {
	//   return prepareError(errPolicyNameNotInRequest)
	// }
	// Removing this section
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	if err := setPolicy(ctx, adminClient, strings.Join(params.Name, ","), *params.EntityName, *params.EntityType); err != nil {
		return prepareError(err)
	}
	return nil
}

func getSetPolicyMultipleResponse(session *models.Principal, params *models.SetPolicyMultipleNameRequest) *models.Error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	if err := setPolicyMultipleEntities(ctx, adminClient, strings.Join(params.Name, ","), params.Users, params.Groups); err != nil {
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

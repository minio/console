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

package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	bucketApi "github.com/minio/console/api/operations/bucket"
	policyApi "github.com/minio/console/api/operations/policy"
	s3 "github.com/minio/minio-go/v7"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/models"
	iampolicy "github.com/minio/pkg/v3/policy"

	policies "github.com/minio/console/api/policy"
)

func registersPoliciesHandler(api *operations.ConsoleAPI) {
	// List Policies
	api.PolicyListPoliciesHandler = policyApi.ListPoliciesHandlerFunc(func(params policyApi.ListPoliciesParams, session *models.Principal) middleware.Responder {
		listPoliciesResponse, err := getListPoliciesResponse(session, params)
		if err != nil {
			return policyApi.NewListPoliciesDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewListPoliciesOK().WithPayload(listPoliciesResponse)
	})
	// Policy Info
	api.PolicyPolicyInfoHandler = policyApi.PolicyInfoHandlerFunc(func(params policyApi.PolicyInfoParams, session *models.Principal) middleware.Responder {
		policyInfo, err := getPolicyInfoResponse(session, params)
		if err != nil {
			return policyApi.NewPolicyInfoDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewPolicyInfoOK().WithPayload(policyInfo)
	})
	// Add Policy
	api.PolicyAddPolicyHandler = policyApi.AddPolicyHandlerFunc(func(params policyApi.AddPolicyParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getAddPolicyResponse(session, params)
		if err != nil {
			return policyApi.NewAddPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewAddPolicyCreated().WithPayload(policyResponse)
	})
	// Remove Policy
	api.PolicyRemovePolicyHandler = policyApi.RemovePolicyHandlerFunc(func(params policyApi.RemovePolicyParams, session *models.Principal) middleware.Responder {
		if err := getRemovePolicyResponse(session, params); err != nil {
			return policyApi.NewRemovePolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewRemovePolicyNoContent()
	})
	// Set Policy
	api.PolicySetPolicyHandler = policyApi.SetPolicyHandlerFunc(func(params policyApi.SetPolicyParams, session *models.Principal) middleware.Responder {
		if err := getSetPolicyResponse(session, params); err != nil {
			return policyApi.NewSetPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewSetPolicyNoContent()
	})
	// Set Policy Multiple User/Groups
	api.PolicySetPolicyMultipleHandler = policyApi.SetPolicyMultipleHandlerFunc(func(params policyApi.SetPolicyMultipleParams, session *models.Principal) middleware.Responder {
		if err := getSetPolicyMultipleResponse(session, params); err != nil {
			return policyApi.NewSetPolicyMultipleDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewSetPolicyMultipleNoContent()
	})
	api.BucketListPoliciesWithBucketHandler = bucketApi.ListPoliciesWithBucketHandlerFunc(func(params bucketApi.ListPoliciesWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getListPoliciesWithBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewListPoliciesWithBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewListPoliciesWithBucketOK().WithPayload(policyResponse)
	})
	api.BucketListAccessRulesWithBucketHandler = bucketApi.ListAccessRulesWithBucketHandlerFunc(func(params bucketApi.ListAccessRulesWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getListAccessRulesWithBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewListAccessRulesWithBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewListAccessRulesWithBucketOK().WithPayload(policyResponse)
	})
	api.BucketSetAccessRuleWithBucketHandler = bucketApi.SetAccessRuleWithBucketHandlerFunc(func(params bucketApi.SetAccessRuleWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getSetAccessRuleWithBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewSetAccessRuleWithBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewSetAccessRuleWithBucketOK().WithPayload(policyResponse)
	})
	api.BucketDeleteAccessRuleWithBucketHandler = bucketApi.DeleteAccessRuleWithBucketHandlerFunc(func(params bucketApi.DeleteAccessRuleWithBucketParams, session *models.Principal) middleware.Responder {
		policyResponse, err := getDeleteAccessRuleWithBucketResponse(session, params)
		if err != nil {
			return bucketApi.NewDeleteAccessRuleWithBucketDefault(err.Code).WithPayload(err.APIError)
		}
		return bucketApi.NewDeleteAccessRuleWithBucketOK().WithPayload(policyResponse)
	})
	api.PolicyListUsersForPolicyHandler = policyApi.ListUsersForPolicyHandlerFunc(func(params policyApi.ListUsersForPolicyParams, session *models.Principal) middleware.Responder {
		policyUsersResponse, err := getListUsersForPolicyResponse(session, params)
		if err != nil {
			return policyApi.NewListUsersForPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewListUsersForPolicyOK().WithPayload(policyUsersResponse)
	})
	api.PolicyListGroupsForPolicyHandler = policyApi.ListGroupsForPolicyHandlerFunc(func(params policyApi.ListGroupsForPolicyParams, session *models.Principal) middleware.Responder {
		policyGroupsResponse, err := getListGroupsForPolicyResponse(session, params)
		if err != nil {
			return policyApi.NewListGroupsForPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewListGroupsForPolicyOK().WithPayload(policyGroupsResponse)
	})
	// Gets policies for currently logged in user
	api.PolicyGetUserPolicyHandler = policyApi.GetUserPolicyHandlerFunc(func(params policyApi.GetUserPolicyParams, session *models.Principal) middleware.Responder {
		userPolicyResponse, err := getUserPolicyResponse(params.HTTPRequest.Context(), session)
		if err != nil {
			return policyApi.NewGetUserPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewGetUserPolicyOK().WithPayload(userPolicyResponse)
	})
	// Gets policies for specified user
	api.PolicyGetSAUserPolicyHandler = policyApi.GetSAUserPolicyHandlerFunc(func(params policyApi.GetSAUserPolicyParams, session *models.Principal) middleware.Responder {
		userPolicyResponse, err := getSAUserPolicyResponse(session, params)
		if err != nil {
			return policyApi.NewGetSAUserPolicyDefault(err.Code).WithPayload(err.APIError)
		}
		return policyApi.NewGetSAUserPolicyOK().WithPayload(userPolicyResponse)
	})
}

func getListAccessRulesWithBucketResponse(session *models.Principal, params bucketApi.ListAccessRulesWithBucketParams) (*models.ListAccessRulesResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	bucket := params.Bucket
	client, err := newS3BucketClient(session, bucket, "", getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	accessRules, _ := client.GetAccessRules(ctx)
	var accessRuleList []*models.AccessRule
	for k, v := range accessRules {
		accessRuleList = append(accessRuleList, &models.AccessRule{Prefix: k[len(bucket)+1 : len(k)-1], Access: v})
	}
	return &models.ListAccessRulesResponse{AccessRules: accessRuleList}, nil
}

func getSetAccessRuleWithBucketResponse(session *models.Principal, params bucketApi.SetAccessRuleWithBucketParams) (bool, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	prefixAccess := params.Prefixaccess
	client, err := newS3BucketClient(session, params.Bucket, prefixAccess.Prefix, getClientIP(params.HTTPRequest))
	if err != nil {
		return false, ErrorWithContext(ctx, err)
	}
	errorVal := client.SetAccess(ctx, prefixAccess.Access, false)
	if errorVal != nil {
		returnError := ErrorWithContext(ctx, errorVal.Cause)
		minioError := s3.ToErrorResponse(errorVal.Cause)
		if minioError.Code == "NoSuchBucket" {
			returnError.Code = 404
		}
		return false, returnError
	}
	return true, nil
}

func getDeleteAccessRuleWithBucketResponse(session *models.Principal, params bucketApi.DeleteAccessRuleWithBucketParams) (bool, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	bucket := params.Bucket
	prefix := params.Prefix
	client, err := newS3BucketClient(session, bucket, prefix.Prefix, getClientIP(params.HTTPRequest))
	if err != nil {
		return false, ErrorWithContext(ctx, err)
	}
	errorVal := client.SetAccess(ctx, "none", false)
	if errorVal != nil {
		return false, ErrorWithContext(ctx, errorVal.Cause)
	}
	return true, nil
}

func getListPoliciesWithBucketResponse(session *models.Principal, params bucketApi.ListPoliciesWithBucketParams) (*models.ListPoliciesResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	policies, err := listPoliciesWithBucket(ctx, params.Bucket, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
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
		if policyMatchesBucket(ctx, policy, bucket) {
			policies = append(policies, policy)
		}
	}
	return policies, nil
}

func policyMatchesBucket(ctx context.Context, policy *models.Policy, bucket string) bool {
	policyData := &iampolicy.Policy{}
	err := json.Unmarshal([]byte(policy.Policy), policyData)
	if err != nil {
		ErrorWithContext(ctx, fmt.Errorf("error parsing policy: %v", err))
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
func getListPoliciesResponse(session *models.Principal, params policyApi.ListPoliciesParams) (*models.ListPoliciesResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	policies, err := listPolicies(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// serialize output
	listPoliciesResponse := &models.ListPoliciesResponse{
		Policies: policies,
		Total:    int64(len(policies)),
	}
	return listPoliciesResponse, nil
}

// getListUsersForPoliciesResponse performs lists users affected by a given policy.
func getListUsersForPolicyResponse(session *models.Principal, params policyApi.ListUsersForPolicyParams) ([]string, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	policies, err := listPolicies(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	found := false
	for i := range policies {
		if policies[i].Name == params.Policy {
			found = true
		}
	}
	if !found {
		return nil, ErrorWithContext(ctx, ErrPolicyNotFound, fmt.Errorf("the policy %s does not exist", params.Policy))
	}
	users, err := listUsers(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	var filteredUsers []string
	for _, user := range users {
		for _, upolicy := range user.Policy {
			if upolicy == params.Policy {
				filteredUsers = append(filteredUsers, user.AccessKey)
				break
			}
		}
	}
	sort.Strings(filteredUsers)
	return filteredUsers, nil
}

func getUserPolicyResponse(ctx context.Context, session *models.Principal) (string, *CodedAPIError) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	// serialize output
	if session == nil {
		return "nil", ErrorWithContext(ctx, ErrPolicyNotFound)
	}
	tokenClaims, _ := getClaimsFromToken(session.STSSessionToken)

	// initialize admin client
	mAdminClient, err := NewMinioAdminClient(ctx, &models.Principal{
		STSAccessKeyID:     session.STSAccessKeyID,
		STSSecretAccessKey: session.STSSecretAccessKey,
		STSSessionToken:    session.STSSessionToken,
	})
	if err != nil {
		return "nil", ErrorWithContext(ctx, err)
	}
	userAdminClient := AdminClient{Client: mAdminClient}
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	accountInfo, err := getAccountInfo(ctx, userAdminClient)
	if err != nil {
		return "nil", ErrorWithContext(ctx, err)
	}
	rawPolicy := policies.ReplacePolicyVariables(tokenClaims, accountInfo)
	return string(rawPolicy), nil
}

func getSAUserPolicyResponse(session *models.Principal, params policyApi.GetSAUserPolicyParams) (*models.AUserPolicyResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	// serialize output
	if session == nil {
		return nil, ErrorWithContext(ctx, ErrPolicyNotFound)
	}
	// initialize admin client
	mAdminClient, err := NewMinioAdminClient(params.HTTPRequest.Context(), &models.Principal{
		STSAccessKeyID:     session.STSAccessKeyID,
		STSSecretAccessKey: session.STSSecretAccessKey,
		STSSessionToken:    session.STSSessionToken,
	})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	userAdminClient := AdminClient{Client: mAdminClient}

	user, err := getUserInfo(ctx, userAdminClient, params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	var userPolicies []string
	if len(user.PolicyName) > 0 {
		userPolicies = strings.Split(user.PolicyName, ",")
	}

	for _, group := range user.MemberOf {
		groupDesc, err := groupInfo(ctx, userAdminClient, group)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		if groupDesc.Policy != "" {
			userPolicies = append(userPolicies, strings.Split(groupDesc.Policy, ",")...)
		}
	}

	allKeys := make(map[string]bool)
	var userPolicyList []string

	for _, item := range userPolicies {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			userPolicyList = append(userPolicyList, item)
		}
	}
	var userStatements []iampolicy.Statement

	for _, pol := range userPolicyList {
		policy, err := getPolicyStatements(ctx, userAdminClient, pol)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		userStatements = append(userStatements, policy...)
	}

	combinedPolicy := iampolicy.Policy{
		Version:    "2012-10-17",
		Statements: userStatements,
	}

	stringPolicy, err := json.Marshal(combinedPolicy)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	parsedPolicy := string(stringPolicy)

	getUserPoliciesResponse := &models.AUserPolicyResponse{
		Policy: parsedPolicy,
	}

	return getUserPoliciesResponse, nil
}

func getListGroupsForPolicyResponse(session *models.Principal, params policyApi.ListGroupsForPolicyParams) ([]string, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	policies, err := listPolicies(ctx, adminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	found := false
	for i := range policies {
		if policies[i].Name == params.Policy {
			found = true
		}
	}
	if !found {
		return nil, ErrorWithContext(ctx, ErrPolicyNotFound, fmt.Errorf("the policy %s does not exist", params.Policy))
	}

	groups, err := adminClient.listGroups(ctx)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	var filteredGroups []string
	for _, group := range groups {
		info, err := groupInfo(ctx, adminClient, group)
		if err != nil {
			return nil, ErrorWithContext(ctx, err)
		}
		groupPolicies := strings.Split(info.Policy, ",")
		for _, groupPolicy := range groupPolicies {
			if groupPolicy == params.Policy {
				filteredGroups = append(filteredGroups, group)
			}
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
func getRemovePolicyResponse(session *models.Principal, params policyApi.RemovePolicyParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	if params.Name == "" {
		return ErrorWithContext(ctx, ErrPolicyNameNotInRequest)
	}
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	if err := removePolicy(ctx, adminClient, params.Name); err != nil {
		return ErrorWithContext(ctx, err)
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
func getAddPolicyResponse(session *models.Principal, params policyApi.AddPolicyParams) (*models.Policy, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	if params.Body == nil {
		return nil, ErrorWithContext(ctx, ErrPolicyBodyNotInRequest)
	}
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	policy, err := addPolicy(ctx, adminClient, *params.Body.Name, *params.Body.Policy)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
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

// getPolicy Statements calls MinIO server to retrieve information of a canned policy.
// and returns the associated Statements
func getPolicyStatements(ctx context.Context, client MinioAdmin, name string) ([]iampolicy.Statement, error) {
	policyRaw, err := client.getPolicy(ctx, name)
	if err != nil {
		return nil, err
	}

	return policyRaw.Statements, nil
}

// getPolicyInfoResponse performs policyInfo() and serializes it to the handler's output
func getPolicyInfoResponse(session *models.Principal, params policyApi.PolicyInfoParams) (*models.Policy, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	policy, err := policyInfo(ctx, adminClient, params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return policy, nil
}

// SetPolicy calls MinIO server to assign policy to a group or user.
func SetPolicy(ctx context.Context, client MinioAdmin, name, entityName string, entityType models.PolicyEntity) error {
	isGroup := false
	if entityType == models.PolicyEntityGroup {
		isGroup = true
	}
	return client.setPolicy(ctx, name, entityName, isGroup)
}

// getSetPolicyResponse() performs SetPolicy() and serializes it to the handler's output
func getSetPolicyResponse(session *models.Principal, params policyApi.SetPolicyParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	// Removing this section
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	if err := SetPolicy(ctx, adminClient, strings.Join(params.Body.Name, ","), *params.Body.EntityName, *params.Body.EntityType); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func getSetPolicyMultipleResponse(session *models.Principal, params policyApi.SetPolicyMultipleParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	if err := setPolicyMultipleEntities(ctx, adminClient, strings.Join(params.Body.Name, ","), params.Body.Users, params.Body.Groups); err != nil {
		return ErrorWithContext(ctx, err)
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
		groupDesc, err := groupInfo(ctx, client, string(group))
		if err != nil {
			return err
		}
		allGroupPolicies := ""
		if len(groups) > 1 {
			allGroupPolicies = groupDesc.Policy + "," + policyName
			s := strings.Split(allGroupPolicies, ",")
			allGroupPolicies = strings.Join(UniqueKeys(s), ",")
		} else {
			allGroupPolicies = policyName
		}
		if err := client.setPolicy(ctx, allGroupPolicies, string(group), true); err != nil {
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

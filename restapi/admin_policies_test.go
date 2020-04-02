// This file is part of MinIO Kubernetes Cloud
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

package restapi

import (
	"context"
	"fmt"
	"testing"

	"errors"

	"github.com/minio/m3/mcs/models"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioListPoliciesMock func() (map[string][]byte, error)
var minioGetPolicyMock func(name string) ([]byte, error)
var minioRemovePolicyMock func(name string) error
var minioAddPolicyMock func(name, policy string) error
var minioSetPolicyMock func(policyName, entityName string, isGroup bool) error

// mock function of listPolicies()
func (ac adminClientMock) listPolicies(ctx context.Context) (map[string][]byte, error) {
	return minioListPoliciesMock()
}

// mock function of getPolicy()
func (ac adminClientMock) getPolicy(ctx context.Context, name string) ([]byte, error) {
	return minioGetPolicyMock(name)
}

// mock function of removePolicy()
func (ac adminClientMock) removePolicy(ctx context.Context, name string) error {
	return minioRemovePolicyMock(name)
}

// mock function of addPolicy()
func (ac adminClientMock) addPolicy(ctx context.Context, name, policy string) error {
	return minioAddPolicyMock(name, policy)
}

// mock function setPolicy()
func (ac adminClientMock) setPolicy(ctx context.Context, policyName, entityName string, isGroup bool) error {
	return minioSetPolicyMock(policyName, entityName, isGroup)
}

func TestListPolicies(t *testing.T) {
	ctx := context.Background()
	assert := assert.New(t)
	adminClient := adminClientMock{}
	mockPoliciesList := map[string][]byte{
		"readonly":    []byte("{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}"),
		"readwrite":   []byte("{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:*\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}"),
		"diagnostics": []byte("{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"admin:ServerInfo\",\"admin:HardwareInfo\",\"admin:TopLocksInfo\",\"admin:PerfInfo\",\"admin:Profiling\",\"admin:ServerTrace\",\"admin:ConsoleLog\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}"),
	}
	assertPoliciesMap := map[string]models.Policy{
		"readonly": {
			Name: "readonly",
			Statements: []*models.Statement{
				{
					Actions:   []string{"s3:GetBucketLocation", "s3:GetObject"},
					Effect:    "Allow",
					Resources: []string{"arn:aws:s3:::*"},
				},
			},
			Version: "2012-10-17",
		},
		"readwrite": {
			Name: "readwrite",
			Statements: []*models.Statement{
				{
					Actions:   []string{"s3:*"},
					Effect:    "Allow",
					Resources: []string{"arn:aws:s3:::*"},
				},
			},
			Version: "2012-10-17",
		},
		"diagnostics": {
			Name: "diagnostics",
			Statements: []*models.Statement{
				{
					Actions: []string{
						"admin:ServerInfo",
						"admin:HardwareInfo",
						"admin:TopLocksInfo",
						"admin:PerfInfo",
						"admin:Profiling",
						"admin:ServerTrace",
						"admin:ConsoleLog",
					},
					Effect:    "Allow",
					Resources: []string{"arn:aws:s3:::*"},
				},
			},
			Version: "2012-10-17",
		},
	}
	// mock function response from listPolicies()
	minioListPoliciesMock = func() (map[string][]byte, error) {
		return mockPoliciesList, nil
	}
	// Test-1 : listPolicies() Get response from minio client with three Canned Policies and return the same number on listPolicies()
	function := "listPolicies()"
	policiesList, err := listPolicies(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of Policies is correct
	assert.Equal(len(mockPoliciesList), len(policiesList), fmt.Sprintf("Failed on %s: length of Policies's lists is not the same", function))
	// Test-2 :
	// get list policies response, this response should have Name, Version and Statement
	// as part of each Policy
	for _, policy := range policiesList {
		assertPolicy := assertPoliciesMap[policy.Name]
		// Check if policy statement has the same length as in the assertPoliciesMap
		assert.Equal(len(policy.Statements), len(assertPolicy.Statements))
		// Check if policy name is the same as in the assertPoliciesMap
		assert.Equal(policy.Name, assertPolicy.Name)
		// Check if policy version is the same as in the assertPoliciesMap
		assert.Equal(policy.Version, assertPolicy.Version)
		// Iterate over each policy statement
		for i, statement := range policy.Statements {
			// Check if each statement effect is the same as in the assertPoliciesMap statement
			assert.Equal(statement.Effect, assertPolicy.Statements[i].Effect)
			// Check if each statement action is the same as in the assertPoliciesMap statement
			assert.Equal(statement.Actions, assertPolicy.Statements[i].Actions)
			// Check if each statement resource is the same as in the assertPoliciesMap resource
			assert.Equal(statement.Resources, assertPolicy.Statements[i].Resources)
		}
	}
	// Test-3 : listPolicies() Return error and see that the error is handled correctly and returned
	minioListPoliciesMock = func() (map[string][]byte, error) {
		return nil, errors.New("error")
	}
	_, err = listPolicies(ctx, adminClient)
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
	//Test-4 : listPolicies() handles malformed json
	minioListPoliciesMock = func() (map[string][]byte, error) {
		malformedData := map[string][]byte{
			"malformed-policy": []byte("asdasdasdasdasd"),
		}
		return malformedData, nil
	}
	_, err = listPolicies(ctx, adminClient)
	if assert.Error(err) {
		assert.NotEmpty(err.Error())
	}
}

func TestRemovePolicy(t *testing.T) {
	ctx := context.Background()

	assert := assert.New(t)
	adminClient := adminClientMock{}
	// Test-1 : removePolicy() remove an existing policy
	policyToRemove := "mcs-policy"
	minioRemovePolicyMock = func(name string) error {
		return nil
	}
	function := "removePolicy()"
	if err := removePolicy(ctx, adminClient, policyToRemove); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2 : removePolicy() Return error and see that the error is handled correctly and returned
	minioRemovePolicyMock = func(name string) error {
		return errors.New("error")
	}
	if err := removePolicy(ctx, adminClient, policyToRemove); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestAddPolicy(t *testing.T) {
	ctx := context.Background()
	assert := assert.New(t)
	adminClient := adminClientMock{}
	policyName := "new-policy"
	policyDefinition := "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}"
	minioAddPolicyMock = func(name, policy string) error {
		return nil
	}
	minioGetPolicyMock = func(name string) (bytes []byte, err error) {
		return []byte(policyDefinition), nil
	}
	assertPolicy := models.Policy{
		Name: "new-policy",
		Statements: []*models.Statement{
			{
				Actions:   []string{"s3:GetBucketLocation", "s3:GetObject", "s3:ListAllMyBuckets"},
				Effect:    "Allow",
				Resources: []string{"arn:aws:s3:::*"},
			},
		},
		Version: "2012-10-17",
	}
	// Test-1 : addPolicy() adds a new policy
	function := "addPolicy()"
	policy, err := addPolicy(ctx, adminClient, policyName, policyDefinition)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(policy.Name, assertPolicy.Name)
	assert.Equal(policy.Version, assertPolicy.Version)
	assert.Equal(len(policy.Statements), len(assertPolicy.Statements))
	// Test-2 : addPolicy() got an error while adding policy
	minioAddPolicyMock = func(name, policy string) error {
		return errors.New("error")
	}
	if _, err := addPolicy(ctx, adminClient, policyName, policyDefinition); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
	// Test-3 : addPolicy() got an error while retrieving policy
	minioAddPolicyMock = func(name, policy string) error {
		return nil
	}
	minioGetPolicyMock = func(name string) (bytes []byte, err error) {
		return nil, errors.New("error")
	}
	if _, err := addPolicy(ctx, adminClient, policyName, policyDefinition); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
	// Test-4 : addPolicy() got an error while parsing policy
	minioGetPolicyMock = func(name string) (bytes []byte, err error) {
		return []byte("eaeaeaeae"), nil
	}
	if _, err := addPolicy(ctx, adminClient, policyName, policyDefinition); assert.Error(err) {
		assert.NotEmpty(err.Error())
	}
}

func TestSetPolicy(t *testing.T) {
	ctx := context.Background()
	assert := assert.New(t)
	adminClient := adminClientMock{}
	policyName := "readOnly"
	entityName := "alevsk"
	entityObject := models.PolicyEntityUser
	minioSetPolicyMock = func(policyName, entityName string, isGroup bool) error {
		return nil
	}
	// Test-1 : setPolicy() set policy to user
	function := "setPolicy()"
	err := setPolicy(ctx, adminClient, policyName, entityName, entityObject)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2 : setPolicy() set policy to group
	entityObject = models.PolicyEntityGroup
	err = setPolicy(ctx, adminClient, policyName, entityName, entityObject)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-3 : setPolicy() set policy to user and get error
	entityObject = models.PolicyEntityUser
	minioSetPolicyMock = func(policyName, entityName string, isGroup bool) error {
		return errors.New("error")
	}
	if err := setPolicy(ctx, adminClient, policyName, entityName, entityObject); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
	// Test-4 : setPolicy() set policy to group and get error
	entityObject = models.PolicyEntityGroup
	minioSetPolicyMock = func(policyName, entityName string, isGroup bool) error {
		return errors.New("error")
	}
	if err := setPolicy(ctx, adminClient, policyName, entityName, entityObject); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

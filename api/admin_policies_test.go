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
	"errors"
	"fmt"
	"reflect"
	"testing"

	"github.com/minio/console/models"
	iampolicy "github.com/minio/pkg/v3/policy"
	"github.com/stretchr/testify/assert"
)

func TestListPolicies(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	funcAssert := assert.New(t)
	adminClient := AdminClientMock{}
	// mock function response from listPolicies()
	minioListPoliciesMock = func() (map[string]*iampolicy.Policy, error) {
		var readonly iampolicy.Policy
		var readwrite iampolicy.Policy
		var diagnostis iampolicy.Policy

		for _, p := range iampolicy.DefaultPolicies {
			switch p.Name {
			case "readonly":
				readonly = p.Definition
			case "readwrite":
				readwrite = p.Definition
			case "diagnostics":
				diagnostis = p.Definition
			}
		}

		return map[string]*iampolicy.Policy{
			"readonly":    &readonly,
			"readwrite":   &readwrite,
			"diagnostics": &diagnostis,
		}, nil
	}
	// Test-1 : listPolicies() Get response from minio client with three Canned Policies and return the same number on listPolicies()
	function := "listPolicies()"
	policiesList, err := listPolicies(ctx, adminClient)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// verify length of Policies is correct
	funcAssert.Equal(3, len(policiesList), fmt.Sprintf("Failed on %s: length of Policies's lists is not the same", function))
	// Test-2 : listPolicies() Return error and see that the error is handled correctly and returned
	minioListPoliciesMock = func() (map[string]*iampolicy.Policy, error) {
		return nil, errors.New("error")
	}
	_, err = listPolicies(ctx, adminClient)
	if funcAssert.Error(err) {
		funcAssert.Equal("error", err.Error())
	}
}

func TestRemovePolicy(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	funcAssert := assert.New(t)
	adminClient := AdminClientMock{}
	// Test-1 : removePolicy() remove an existing policy
	policyToRemove := "console-policy"
	minioRemovePolicyMock = func(_ string) error {
		return nil
	}
	function := "removePolicy()"
	if err := removePolicy(ctx, adminClient, policyToRemove); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2 : removePolicy() Return error and see that the error is handled correctly and returned
	minioRemovePolicyMock = func(_ string) error {
		return errors.New("error")
	}
	if err := removePolicy(ctx, adminClient, policyToRemove); funcAssert.Error(err) {
		funcAssert.Equal("error", err.Error())
	}
}

func TestAddPolicy(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	funcAssert := assert.New(t)
	adminClient := AdminClientMock{}
	policyName := "new-policy"
	policyDefinition := "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}"
	minioAddPolicyMock = func(_ string, _ *iampolicy.Policy) error {
		return nil
	}
	minioGetPolicyMock = func(_ string) (*iampolicy.Policy, error) {
		policy := "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}"
		iamp, err := iampolicy.ParseConfig(bytes.NewReader([]byte(policy)))
		if err != nil {
			return nil, err
		}
		return iamp, nil
	}
	assertPolicy := models.Policy{
		Name:   "new-policy",
		Policy: "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::*\"]}]}",
	}
	// Test-1 : addPolicy() adds a new policy
	function := "addPolicy()"
	policy, err := addPolicy(ctx, adminClient, policyName, policyDefinition)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	} else {
		funcAssert.Equal(policy.Name, assertPolicy.Name)

		var expectedPolicy iampolicy.Policy
		var actualPolicy iampolicy.Policy
		err1 := json.Unmarshal([]byte(policy.Policy), &expectedPolicy)
		funcAssert.NoError(err1)
		err2 := json.Unmarshal([]byte(assertPolicy.Policy), &actualPolicy)
		funcAssert.NoError(err2)
		funcAssert.Equal(expectedPolicy, actualPolicy)
	}
	// Test-2 : addPolicy() got an error while adding policy
	minioAddPolicyMock = func(_ string, _ *iampolicy.Policy) error {
		return errors.New("error")
	}
	if _, err := addPolicy(ctx, adminClient, policyName, policyDefinition); funcAssert.Error(err) {
		funcAssert.Equal("error", err.Error())
	}
	// Test-3 : addPolicy() got an error while retrieving policy
	minioAddPolicyMock = func(_ string, _ *iampolicy.Policy) error {
		return nil
	}
	minioGetPolicyMock = func(_ string) (*iampolicy.Policy, error) {
		return nil, errors.New("error")
	}
	if _, err := addPolicy(ctx, adminClient, policyName, policyDefinition); funcAssert.Error(err) {
		funcAssert.Equal("error", err.Error())
	}
}

func TestSetPolicy(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	funcAssert := assert.New(t)
	adminClient := AdminClientMock{}
	policyName := "readOnly"
	entityName := "alevsk"
	entityObject := models.PolicyEntityUser
	minioSetPolicyMock = func(_, _ string, _ bool) error {
		return nil
	}
	// Test-1 : SetPolicy() set policy to user
	function := "SetPolicy()"
	err := SetPolicy(ctx, adminClient, policyName, entityName, entityObject)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-2 : SetPolicy() set policy to group
	entityObject = models.PolicyEntityGroup
	err = SetPolicy(ctx, adminClient, policyName, entityName, entityObject)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// Test-3 : SetPolicy() set policy to user and get error
	entityObject = models.PolicyEntityUser
	minioSetPolicyMock = func(_, _ string, _ bool) error {
		return errors.New("error")
	}
	if err := SetPolicy(ctx, adminClient, policyName, entityName, entityObject); funcAssert.Error(err) {
		funcAssert.Equal("error", err.Error())
	}
	// Test-4 : SetPolicy() set policy to group and get error
	entityObject = models.PolicyEntityGroup
	minioSetPolicyMock = func(_, _ string, _ bool) error {
		return errors.New("error")
	}
	if err := SetPolicy(ctx, adminClient, policyName, entityName, entityObject); funcAssert.Error(err) {
		funcAssert.Equal("error", err.Error())
	}
}

func Test_SetPolicyMultiple(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	adminClient := AdminClientMock{}

	type args struct {
		policyName    string
		users         []models.IamEntity
		groups        []models.IamEntity
		setPolicyFunc func(policyName, entityName string, isGroup bool) error
	}
	tests := []struct {
		name          string
		args          args
		errorExpected error
	}{
		{
			name: "Set policy to multiple users and groups",
			args: args{
				policyName: "readonly",
				users:      []models.IamEntity{"user1", "user2"},
				groups:     []models.IamEntity{"group1", "group2"},
				setPolicyFunc: func(_, _ string, _ bool) error {
					return nil
				},
			},
			errorExpected: nil,
		},
		{
			name: "Return error on set policy function",
			args: args{
				policyName: "readonly",
				users:      []models.IamEntity{"user1", "user2"},
				groups:     []models.IamEntity{"group1", "group2"},
				setPolicyFunc: func(_, _ string, _ bool) error {
					return errors.New("error set")
				},
			},
			errorExpected: errors.New("error set"),
		},
		{
			// Description: Empty lists of users and groups are acceptable
			name: "Empty lists of users and groups",
			args: args{
				policyName: "readonly",
				users:      []models.IamEntity{},
				groups:     []models.IamEntity{},
				setPolicyFunc: func(_, _ string, _ bool) error {
					return nil
				},
			},
			errorExpected: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			minioSetPolicyMock = tt.args.setPolicyFunc
			got := setPolicyMultipleEntities(ctx, adminClient, tt.args.policyName, tt.args.users, tt.args.groups)
			if !reflect.DeepEqual(got, tt.errorExpected) {
				ji, _ := json.Marshal(got)
				vi, _ := json.Marshal(tt.errorExpected)
				t.Errorf("got %s want %s", ji, vi)
			}
		})
	}
}

func Test_policyMatchesBucket(t *testing.T) {
	type args struct {
		ctx    context.Context
		policy *models.Policy
		bucket string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "Test1",
			args: args{ctx: context.Background(), policy: &models.Policy{Name: "consoleAdmin", Policy: `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "admin:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::*"
            ]
        }
    ]
}`}, bucket: "test1"},
			want: true,
		},
		{
			name: "Test2",
			args: args{ctx: context.Background(), policy: &models.Policy{Name: "consoleAdmin", Policy: `{
				"Version": "2012-10-17",
				"Statement": [
			{
				"Effect": "Allow",
				"Action": [
				"s3:*"
			],
				"Resource": [
				"arn:aws:s3:::bucket1"
			]
			}
			]
			}`}, bucket: "test1"},
			want: false,
		},
		{
			name: "Test3",
			args: args{ctx: context.Background(), policy: &models.Policy{Name: "consoleAdmin", Policy: `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:ListStorageLensConfigurations",
                "s3:GetAccessPoint",
                "s3:PutAccountPublicAccessBlock",
                "s3:GetAccountPublicAccessBlock",
                "s3:ListAllMyBuckets",
                "s3:ListAccessPoints",
                "s3:ListJobs",
                "s3:PutStorageLensConfiguration",
                "s3:CreateJob"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::test",
                "arn:aws:s3:::test/*",
                "arn:aws:s3:::lkasdkljasd090901",
                "arn:aws:s3:::lkasdkljasd090901/*"
                ]
        }
    ]
	}`}, bucket: "test1"},
			want: false,
		},
		{
			name: "Test4",
			args: args{ctx: context.Background(), policy: &models.Policy{Name: "consoleAdmin", Policy: `{
				"Version": "2012-10-17",
				"Statement": [
			{
				"Effect": "Allow",
				"Action": [
				"s3:*"
			],
				"Resource": [
				"arn:aws:s3:::bucket1"
			]
			}
			]
			}`}, bucket: "bucket1"},
			want: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			if got := policyMatchesBucket(tt.args.ctx, tt.args.policy, tt.args.bucket); got != tt.want {
				t.Errorf("policyMatchesBucket() = %v, want %v", got, tt.want)
			}
		})
	}
}

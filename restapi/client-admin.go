// This file is part of MinIO Orchestrator
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
	"io"
	"path/filepath"
	"runtime"

	"github.com/minio/console/models"
	mcCmd "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7/pkg/credentials"
	mauth "github.com/minio/minio/pkg/auth"
	iampolicy "github.com/minio/minio/pkg/iam/policy"
	"github.com/minio/minio/pkg/madmin"
)

const globalAppName = "console"

// NewAdminClient gives a new madmin client interface
func NewAdminClient(url, accessKey, secretKey string) (*madmin.AdminClient, *probe.Error) {
	return NewAdminClientWithInsecure(url, accessKey, secretKey, false)
}

// NewAdminClientWithInsecure gives a new madmin client interface either secure or insecure based on parameter
func NewAdminClientWithInsecure(url, accessKey, secretKey string, insecure bool) (*madmin.AdminClient, *probe.Error) {
	appName := filepath.Base(globalAppName)

	s3Client, err := s3AdminNew(&mcCmd.Config{
		HostURL:     url,
		AccessKey:   accessKey,
		SecretKey:   secretKey,
		AppName:     appName,
		AppVersion:  ConsoleVersion,
		AppComments: []string{appName, runtime.GOOS, runtime.GOARCH},
		Insecure:    insecure,
	})
	if err != nil {
		return nil, err.Trace(url)
	}
	stsClient := PrepareSTSClient(insecure)
	s3Client.SetCustomTransport(stsClient.Transport)
	return s3Client, nil
}

// s3AdminNew returns an initialized minioAdmin structure. If debug is enabled,
// it also enables an internal trace transport.
var s3AdminNew = mcCmd.NewAdminFactory()

// MinioAdmin interface with all functions to be implemented
// by mock when testing, it should include all MinioAdmin respective api calls
// that are used within this project.
type MinioAdmin interface {
	listUsers(ctx context.Context) (map[string]madmin.UserInfo, error)
	addUser(ctx context.Context, acessKey, SecretKey string) error
	removeUser(ctx context.Context, accessKey string) error
	getUserInfo(ctx context.Context, accessKey string) (madmin.UserInfo, error)
	setUserStatus(ctx context.Context, accessKey string, status madmin.AccountStatus) error
	listGroups(ctx context.Context) ([]string, error)
	updateGroupMembers(ctx context.Context, greq madmin.GroupAddRemove) error
	getGroupDescription(ctx context.Context, group string) (*madmin.GroupDesc, error)
	setGroupStatus(ctx context.Context, group string, status madmin.GroupStatus) error
	listPolicies(ctx context.Context) (map[string]*iampolicy.Policy, error)
	getPolicy(ctx context.Context, name string) (*iampolicy.Policy, error)
	removePolicy(ctx context.Context, name string) error
	addPolicy(ctx context.Context, name string, policy *iampolicy.Policy) error
	setPolicy(ctx context.Context, policyName, entityName string, isGroup bool) error
	getConfigKV(ctx context.Context, key string) ([]byte, error)
	helpConfigKV(ctx context.Context, subSys, key string, envOnly bool) (madmin.Help, error)
	setConfigKV(ctx context.Context, kv string) (err error)
	serviceRestart(ctx context.Context) error
	serverInfo(ctx context.Context) (madmin.InfoMessage, error)
	startProfiling(ctx context.Context, profiler madmin.ProfilerType) ([]madmin.StartProfilingResult, error)
	stopProfiling(ctx context.Context) (io.ReadCloser, error)
	serviceTrace(ctx context.Context, allTrace, errTrace bool) <-chan madmin.ServiceTraceInfo
	getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo
	accountUsageInfo(ctx context.Context) (madmin.AccountUsageInfo, error)
	heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
		forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error)
	// Service Accounts
	addServiceAccount(ctx context.Context, policy *iampolicy.Policy) (mauth.Credentials, error)
	listServiceAccounts(ctx context.Context) (madmin.ListServiceAccountsResp, error)
	deleteServiceAccount(ctx context.Context, serviceAccount string) error
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type adminClient struct {
	client *madmin.AdminClient
}

// implements madmin.ListUsers()
func (ac adminClient) listUsers(ctx context.Context) (map[string]madmin.UserInfo, error) {
	return ac.client.ListUsers(ctx)
}

// implements madmin.AddUser()
func (ac adminClient) addUser(ctx context.Context, acessKey, secretKey string) error {
	return ac.client.AddUser(ctx, acessKey, secretKey)
}

// implements madmin.RemoveUser()
func (ac adminClient) removeUser(ctx context.Context, accessKey string) error {
	return ac.client.RemoveUser(ctx, accessKey)
}

//implements madmin.GetUserInfo()
func (ac adminClient) getUserInfo(ctx context.Context, accessKey string) (madmin.UserInfo, error) {
	return ac.client.GetUserInfo(ctx, accessKey)
}

// implements madmin.SetUserStatus()
func (ac adminClient) setUserStatus(ctx context.Context, accessKey string, status madmin.AccountStatus) error {
	return ac.client.SetUserStatus(ctx, accessKey, status)
}

// implements madmin.ListGroups()
func (ac adminClient) listGroups(ctx context.Context) ([]string, error) {
	return ac.client.ListGroups(ctx)
}

// implements madmin.UpdateGroupMembers()
func (ac adminClient) updateGroupMembers(ctx context.Context, greq madmin.GroupAddRemove) error {
	return ac.client.UpdateGroupMembers(ctx, greq)
}

// implements madmin.GetGroupDescription(group)
func (ac adminClient) getGroupDescription(ctx context.Context, group string) (*madmin.GroupDesc, error) {
	return ac.client.GetGroupDescription(ctx, group)
}

// implements madmin.SetGroupStatus(group, status)
func (ac adminClient) setGroupStatus(ctx context.Context, group string, status madmin.GroupStatus) error {
	return ac.client.SetGroupStatus(ctx, group, status)
}

// implements madmin.ListCannedPolicies()
func (ac adminClient) listPolicies(ctx context.Context) (map[string]*iampolicy.Policy, error) {
	return ac.client.ListCannedPolicies(ctx)
}

// implements madmin.ListCannedPolicies()
func (ac adminClient) getPolicy(ctx context.Context, name string) (*iampolicy.Policy, error) {
	return ac.client.InfoCannedPolicy(ctx, name)
}

// implements madmin.RemoveCannedPolicy()
func (ac adminClient) removePolicy(ctx context.Context, name string) error {
	return ac.client.RemoveCannedPolicy(ctx, name)
}

// implements madmin.AddCannedPolicy()
func (ac adminClient) addPolicy(ctx context.Context, name string, policy *iampolicy.Policy) error {
	return ac.client.AddCannedPolicy(ctx, name, policy)
}

// implements madmin.SetPolicy()
func (ac adminClient) setPolicy(ctx context.Context, policyName, entityName string, isGroup bool) error {
	return ac.client.SetPolicy(ctx, policyName, entityName, isGroup)
}

// implements madmin.GetConfigKV()
func (ac adminClient) getConfigKV(ctx context.Context, key string) ([]byte, error) {
	return ac.client.GetConfigKV(ctx, key)
}

// implements madmin.HelpConfigKV()
func (ac adminClient) helpConfigKV(ctx context.Context, subSys, key string, envOnly bool) (madmin.Help, error) {
	return ac.client.HelpConfigKV(ctx, subSys, key, envOnly)
}

// implements madmin.SetConfigKV()
func (ac adminClient) setConfigKV(ctx context.Context, kv string) (err error) {
	return ac.client.SetConfigKV(ctx, kv)
}

// implements madmin.ServiceRestart()
func (ac adminClient) serviceRestart(ctx context.Context) (err error) {
	return ac.client.ServiceRestart(ctx)
}

// implements madmin.ServerInfo()
func (ac adminClient) serverInfo(ctx context.Context) (madmin.InfoMessage, error) {
	return ac.client.ServerInfo(ctx)
}

// implements madmin.StartProfiling()
func (ac adminClient) startProfiling(ctx context.Context, profiler madmin.ProfilerType) ([]madmin.StartProfilingResult, error) {
	return ac.client.StartProfiling(ctx, profiler)
}

// implements madmin.DownloadProfilingData()
func (ac adminClient) stopProfiling(ctx context.Context) (io.ReadCloser, error) {
	return ac.client.DownloadProfilingData(ctx)
}

// implements madmin.ServiceTrace()
func (ac adminClient) serviceTrace(ctx context.Context, allTrace, errTrace bool) <-chan madmin.ServiceTraceInfo {
	return ac.client.ServiceTrace(ctx, allTrace, errTrace)
}

// implements madmin.GetLogs()
func (ac adminClient) getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
	return ac.client.GetLogs(ctx, node, lineCnt, logKind)
}

// implements madmin.AddServiceAccount()
func (ac adminClient) addServiceAccount(ctx context.Context, policy *iampolicy.Policy) (mauth.Credentials, error) {
	return ac.client.AddServiceAccount(ctx, policy)
}

// implements madmin.ListServiceAccounts()
func (ac adminClient) listServiceAccounts(ctx context.Context) (madmin.ListServiceAccountsResp, error) {
	return ac.client.ListServiceAccounts(ctx)
}

// implements madmin.DeleteServiceAccount()
func (ac adminClient) deleteServiceAccount(ctx context.Context, serviceAccount string) error {
	return ac.client.DeleteServiceAccount(ctx, serviceAccount)
}

// implements madmin.AccountingUsageInfo()
func (ac adminClient) accountUsageInfo(ctx context.Context) (madmin.AccountUsageInfo, error) {
	return ac.client.AccountUsageInfo(ctx)
}

func (ac adminClient) heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
	return ac.client.Heal(ctx, bucket, prefix, healOpts, clientToken, forceStart, forceStop)
}

func newMAdminClient(sessionClaims *models.Principal) (*madmin.AdminClient, error) {
	adminClient, err := newAdminFromClaims(sessionClaims)
	if err != nil {
		return nil, err
	}
	return adminClient, nil
}

// newAdminFromClaims creates a minio admin from Decrypted claims using Assume role credentials
func newAdminFromClaims(claims *models.Principal) (*madmin.AdminClient, error) {
	tlsEnabled := getMinIOEndpointIsSecure()
	endpoint := getMinIOEndpoint()

	adminClient, err := madmin.NewWithOptions(endpoint, &madmin.Options{
		Creds:  credentials.NewStaticV4(claims.AccessKeyID, claims.SecretAccessKey, claims.SessionToken),
		Secure: tlsEnabled,
	})
	if err != nil {
		return nil, err
	}
	stsClient := PrepareSTSClient(false)
	adminClient.SetCustomTransport(stsClient.Transport)
	return adminClient, nil
}

func newSuperMAdminClient() (*madmin.AdminClient, error) {
	endpoint := getMinIOServer()
	accessKeyID := getAccessKey()
	secretAccessKey := getSecretKey()
	adminClient, pErr := NewAdminClient(endpoint, accessKeyID, secretAccessKey)
	if pErr != nil {
		return nil, pErr.Cause
	}
	return adminClient, nil
}

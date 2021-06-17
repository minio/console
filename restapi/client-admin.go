// This file is part of MinIO Orchestrator
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
	"errors"
	"io"
	"net/http"
	"time"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg"
	"github.com/minio/madmin-go"
	mcCmd "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7/pkg/credentials"
	iampolicy "github.com/minio/pkg/iam/policy"
)

const globalAppName = "MinIO Console"

// NewAdminClient gives a new madmin client interface
func NewAdminClient(url, accessKey, secretKey, sessionToken string) (*madmin.AdminClient, *probe.Error) {
	return NewAdminClientWithInsecure(url, accessKey, secretKey, sessionToken, false)
}

// NewAdminClientWithInsecure gives a new madmin client interface either secure or insecure based on parameter
func NewAdminClientWithInsecure(url, accessKey, secretKey, sessionToken string, insecure bool) (*madmin.AdminClient, *probe.Error) {
	s3Client, err := s3AdminNew(&mcCmd.Config{
		HostURL:      url,
		AccessKey:    accessKey,
		SecretKey:    secretKey,
		SessionToken: sessionToken,
		AppName:      globalAppName,
		AppVersion:   pkg.Version,
		Insecure:     insecure,
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
	setConfigKV(ctx context.Context, kv string) (restart bool, err error)
	serviceRestart(ctx context.Context) error
	serverInfo(ctx context.Context) (madmin.InfoMessage, error)
	startProfiling(ctx context.Context, profiler madmin.ProfilerType) ([]madmin.StartProfilingResult, error)
	stopProfiling(ctx context.Context) (io.ReadCloser, error)
	serviceTrace(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo
	getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo
	accountInfo(ctx context.Context) (madmin.AccountInfo, error)
	heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
		forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error)
	// Service Accounts
	addServiceAccount(ctx context.Context, policy *iampolicy.Policy) (madmin.Credentials, error)
	listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error)
	deleteServiceAccount(ctx context.Context, serviceAccount string) error
	// Remote Buckets
	listRemoteBuckets(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error)
	getRemoteBucket(ctx context.Context, bucket, arnType string) (targets *madmin.BucketTarget, err error)
	removeRemoteBucket(ctx context.Context, bucket, arn string) error
	addRemoteBucket(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error)
	// Account password management
	changePassword(ctx context.Context, accessKey, secretKey string) error

	serverHealthInfo(ctx context.Context, healthDataTypes []madmin.HealthDataType, deadline time.Duration) (interface{}, string, error)
	// List Tiers
	listTiers(ctx context.Context) ([]*madmin.TierConfig, error)
	// Add Tier
	addTier(ctx context.Context, tier *madmin.TierConfig) error
	// Edit Tier Credentials
	editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type adminClient struct {
	client *madmin.AdminClient
}

func (ac adminClient) changePassword(ctx context.Context, accessKey, secretKey string) error {
	return ac.client.SetUser(ctx, accessKey, secretKey, madmin.AccountEnabled)
}

// implements madmin.ListUsers()
func (ac adminClient) listUsers(ctx context.Context) (map[string]madmin.UserInfo, error) {
	return ac.client.ListUsers(ctx)
}

// implements madmin.AddUser()
func (ac adminClient) addUser(ctx context.Context, accessKey, secretKey string) error {
	return ac.client.AddUser(ctx, accessKey, secretKey)
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
	policyMap, err := ac.client.ListCannedPolicies(ctx)
	if err != nil {
		return nil, err
	}
	policies := make(map[string]*iampolicy.Policy, len(policyMap))
	for k, v := range policyMap {
		p, err := iampolicy.ParseConfig(bytes.NewReader(v))
		if err != nil {
			return nil, err
		}
		policies[k] = p
	}
	return policies, nil
}

// implements madmin.ListCannedPolicies()
func (ac adminClient) getPolicy(ctx context.Context, name string) (*iampolicy.Policy, error) {
	praw, err := ac.client.InfoCannedPolicy(ctx, name)
	if err != nil {
		return nil, err
	}
	return iampolicy.ParseConfig(bytes.NewReader(praw))
}

// implements madmin.RemoveCannedPolicy()
func (ac adminClient) removePolicy(ctx context.Context, name string) error {
	return ac.client.RemoveCannedPolicy(ctx, name)
}

// implements madmin.AddCannedPolicy()
func (ac adminClient) addPolicy(ctx context.Context, name string, policy *iampolicy.Policy) error {
	buf, err := json.Marshal(policy)
	if err != nil {
		return err
	}
	return ac.client.AddCannedPolicy(ctx, name, buf)
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
func (ac adminClient) setConfigKV(ctx context.Context, kv string) (restart bool, err error) {
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
func (ac adminClient) serviceTrace(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
	thresholdT := time.Duration(threshold)

	tracingOptions := madmin.ServiceTraceOpts{
		S3:         true,
		OnlyErrors: errTrace,
		Internal:   internal,
		Storage:    storage,
		OS:         os,
		Threshold:  thresholdT,
	}

	return ac.client.ServiceTrace(ctx, tracingOptions)
}

// implements madmin.GetLogs()
func (ac adminClient) getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
	return ac.client.GetLogs(ctx, node, lineCnt, logKind)
}

// implements madmin.AddServiceAccount()
func (ac adminClient) addServiceAccount(ctx context.Context, policy *iampolicy.Policy) (madmin.Credentials, error) {
	buf, err := json.Marshal(policy)
	if err != nil {
		return madmin.Credentials{}, err
	}
	return ac.client.AddServiceAccount(ctx, madmin.AddServiceAccountReq{
		Policy:     buf,
		TargetUser: "",
		AccessKey:  "",
		SecretKey:  "",
	})
}

// implements madmin.ListServiceAccounts()
func (ac adminClient) listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
	// TODO: Fix this
	return ac.client.ListServiceAccounts(ctx, user)
}

// implements madmin.DeleteServiceAccount()
func (ac adminClient) deleteServiceAccount(ctx context.Context, serviceAccount string) error {
	return ac.client.DeleteServiceAccount(ctx, serviceAccount)
}

// implements madmin.AccountingUsageInfo()
func (ac adminClient) accountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return ac.client.AccountInfo(ctx)
}

func (ac adminClient) heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
	return ac.client.Heal(ctx, bucket, prefix, healOpts, clientToken, forceStart, forceStop)
}

// listRemoteBuckets - return a list of remote buckets
func (ac adminClient) listRemoteBuckets(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error) {
	return ac.client.ListRemoteTargets(ctx, bucket, arnType)
}

// getRemoteBucket - gets remote bucked based on a given bucket name
func (ac adminClient) getRemoteBucket(ctx context.Context, bucket, arnType string) (*madmin.BucketTarget, error) {
	targets, err := ac.client.ListRemoteTargets(ctx, bucket, arnType)
	if err != nil {
		return nil, err
	}
	if len(targets) > 0 {
		return &targets[0], nil
	}
	return nil, err
}

// removeRemoteBucket removes a remote target associated with particular ARN for this bucket
func (ac adminClient) removeRemoteBucket(ctx context.Context, bucket, arn string) error {
	return ac.client.RemoveRemoteTarget(ctx, bucket, arn)
}

// addRemoteBucket sets up a remote target for this bucket
func (ac adminClient) addRemoteBucket(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error) {
	return ac.client.SetRemoteTarget(ctx, bucket, target)
}

func (ac adminClient) setBucketQuota(ctx context.Context, bucket string, quota *madmin.BucketQuota) error {
	return ac.client.SetBucketQuota(ctx, bucket, quota)
}

func (ac adminClient) getBucketQuota(ctx context.Context, bucket string) (madmin.BucketQuota, error) {
	return ac.client.GetBucketQuota(ctx, bucket)
}

// serverHealthInfo implements mc.ServerHealthInfo - Connect to a minio server and call Health Info Management API
func (ac adminClient) serverHealthInfo(ctx context.Context, healthDataTypes []madmin.HealthDataType, deadline time.Duration) (interface{}, string, error) {
	resp, version, err := ac.client.ServerHealthInfo(ctx, healthDataTypes, deadline)
	if err != nil {
		return nil, version, err
	}

	var healthInfo interface{}

	decoder := json.NewDecoder(resp.Body)
	switch version {
	case madmin.HealthInfoVersion0:
		for {
			var info madmin.HealthInfoV0
			err = decoder.Decode(&info)
			if err != nil && !errors.Is(err, io.EOF) {
				return nil, version, err
			}

			healthInfo = mcCmd.MapHealthInfoToV1(info, nil)
		}
	case madmin.HealthInfoVersion:
		for {
			var info madmin.HealthInfo
			if err != nil && !errors.Is(err, io.EOF) {
				return nil, version, err
			}

			healthInfo = info
		}
	}
	return healthInfo, version, nil
}

// implements madmin.listTiers()
func (ac adminClient) listTiers(ctx context.Context) ([]*madmin.TierConfig, error) {
	return ac.client.ListTiers(ctx)
}

// implements madmin.AddTier()
func (ac adminClient) addTier(ctx context.Context, cfg *madmin.TierConfig) error {
	return ac.client.AddTier(ctx, cfg)
}

// implements madmin.EditTier()
func (ac adminClient) editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error {
	return ac.client.EditTier(ctx, tierName, creds)
}

func newAdminClient(sessionClaims *models.Principal) (*madmin.AdminClient, error) {
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
		Creds:  credentials.NewStaticV4(claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken),
		Secure: tlsEnabled,
	})
	if err != nil {
		return nil, err
	}
	adminClient.SetCustomTransport(GetConsoleSTSClient().Transport)
	return adminClient, nil
}

// newAdminFromCreds Creates a minio client using custom credentials for connecting to a remote host
func newAdminFromCreds(accessKey, secretKey, endpoint string, tlsEnabled bool) (*madmin.AdminClient, error) {
	minioClient, err := madmin.NewWithOptions(endpoint, &madmin.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: tlsEnabled,
	})

	if err != nil {
		return nil, err
	}

	return minioClient, nil
}

// stsClient is a custom http client, this client should not be called directly and instead be
// called using GetConsoleSTSClient() to ensure is initialized and the certificates are loaded correctly
var stsClient *http.Client

// GetConsoleSTSClient will initialize the console STS Client with Custom TLS Transport that with loads certs at .console/certs/CAs
func GetConsoleSTSClient() *http.Client {
	if stsClient == nil {
		stsClient = PrepareSTSClient(false)
	}
	return stsClient
}

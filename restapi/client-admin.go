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
	stsClient := PrepareConsoleHTTPClient(insecure)
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
	AccountInfo(ctx context.Context) (madmin.AccountInfo, error)
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
type AdminClient struct {
	Client *madmin.AdminClient
}

func (ac AdminClient) changePassword(ctx context.Context, accessKey, secretKey string) error {
	return ac.Client.SetUser(ctx, accessKey, secretKey, madmin.AccountEnabled)
}

// implements madmin.ListUsers()
func (ac AdminClient) listUsers(ctx context.Context) (map[string]madmin.UserInfo, error) {
	return ac.Client.ListUsers(ctx)
}

// implements madmin.AddUser()
func (ac AdminClient) addUser(ctx context.Context, accessKey, secretKey string) error {
	return ac.Client.AddUser(ctx, accessKey, secretKey)
}

// implements madmin.RemoveUser()
func (ac AdminClient) removeUser(ctx context.Context, accessKey string) error {
	return ac.Client.RemoveUser(ctx, accessKey)
}

//implements madmin.GetUserInfo()
func (ac AdminClient) getUserInfo(ctx context.Context, accessKey string) (madmin.UserInfo, error) {
	return ac.Client.GetUserInfo(ctx, accessKey)
}

// implements madmin.SetUserStatus()
func (ac AdminClient) setUserStatus(ctx context.Context, accessKey string, status madmin.AccountStatus) error {
	return ac.Client.SetUserStatus(ctx, accessKey, status)
}

// implements madmin.ListGroups()
func (ac AdminClient) listGroups(ctx context.Context) ([]string, error) {
	return ac.Client.ListGroups(ctx)
}

// implements madmin.UpdateGroupMembers()
func (ac AdminClient) updateGroupMembers(ctx context.Context, greq madmin.GroupAddRemove) error {
	return ac.Client.UpdateGroupMembers(ctx, greq)
}

// implements madmin.GetGroupDescription(group)
func (ac AdminClient) getGroupDescription(ctx context.Context, group string) (*madmin.GroupDesc, error) {
	return ac.Client.GetGroupDescription(ctx, group)
}

// implements madmin.SetGroupStatus(group, status)
func (ac AdminClient) setGroupStatus(ctx context.Context, group string, status madmin.GroupStatus) error {
	return ac.Client.SetGroupStatus(ctx, group, status)
}

// implements madmin.ListCannedPolicies()
func (ac AdminClient) listPolicies(ctx context.Context) (map[string]*iampolicy.Policy, error) {
	policyMap, err := ac.Client.ListCannedPolicies(ctx)
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
func (ac AdminClient) getPolicy(ctx context.Context, name string) (*iampolicy.Policy, error) {
	praw, err := ac.Client.InfoCannedPolicy(ctx, name)
	if err != nil {
		return nil, err
	}
	return iampolicy.ParseConfig(bytes.NewReader(praw))
}

// implements madmin.RemoveCannedPolicy()
func (ac AdminClient) removePolicy(ctx context.Context, name string) error {
	return ac.Client.RemoveCannedPolicy(ctx, name)
}

// implements madmin.AddCannedPolicy()
func (ac AdminClient) addPolicy(ctx context.Context, name string, policy *iampolicy.Policy) error {
	buf, err := json.Marshal(policy)
	if err != nil {
		return err
	}
	return ac.Client.AddCannedPolicy(ctx, name, buf)
}

// implements madmin.SetPolicy()
func (ac AdminClient) setPolicy(ctx context.Context, policyName, entityName string, isGroup bool) error {
	return ac.Client.SetPolicy(ctx, policyName, entityName, isGroup)
}

// implements madmin.GetConfigKV()
func (ac AdminClient) getConfigKV(ctx context.Context, key string) ([]byte, error) {
	return ac.Client.GetConfigKV(ctx, key)
}

// implements madmin.HelpConfigKV()
func (ac AdminClient) helpConfigKV(ctx context.Context, subSys, key string, envOnly bool) (madmin.Help, error) {
	return ac.Client.HelpConfigKV(ctx, subSys, key, envOnly)
}

// implements madmin.SetConfigKV()
func (ac AdminClient) setConfigKV(ctx context.Context, kv string) (restart bool, err error) {
	return ac.Client.SetConfigKV(ctx, kv)
}

// implements madmin.ServiceRestart()
func (ac AdminClient) serviceRestart(ctx context.Context) (err error) {
	return ac.Client.ServiceRestart(ctx)
}

// implements madmin.ServerInfo()
func (ac AdminClient) serverInfo(ctx context.Context) (madmin.InfoMessage, error) {
	return ac.Client.ServerInfo(ctx)
}

// implements madmin.StartProfiling()
func (ac AdminClient) startProfiling(ctx context.Context, profiler madmin.ProfilerType) ([]madmin.StartProfilingResult, error) {
	return ac.Client.StartProfiling(ctx, profiler)
}

// implements madmin.DownloadProfilingData()
func (ac AdminClient) stopProfiling(ctx context.Context) (io.ReadCloser, error) {
	return ac.Client.DownloadProfilingData(ctx)
}

// implements madmin.ServiceTrace()
func (ac AdminClient) serviceTrace(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
	thresholdT := time.Duration(threshold)

	tracingOptions := madmin.ServiceTraceOpts{
		S3:         true,
		OnlyErrors: errTrace,
		Internal:   internal,
		Storage:    storage,
		OS:         os,
		Threshold:  thresholdT,
	}

	return ac.Client.ServiceTrace(ctx, tracingOptions)
}

// implements madmin.GetLogs()
func (ac AdminClient) getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
	return ac.Client.GetLogs(ctx, node, lineCnt, logKind)
}

// implements madmin.AddServiceAccount()
func (ac AdminClient) addServiceAccount(ctx context.Context, policy *iampolicy.Policy) (madmin.Credentials, error) {
	buf, err := json.Marshal(policy)
	if err != nil {
		return madmin.Credentials{}, err
	}
	return ac.Client.AddServiceAccount(ctx, madmin.AddServiceAccountReq{
		Policy:     buf,
		TargetUser: "",
		AccessKey:  "",
		SecretKey:  "",
	})
}

// implements madmin.ListServiceAccounts()
func (ac AdminClient) listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
	// TODO: Fix this
	return ac.Client.ListServiceAccounts(ctx, user)
}

// implements madmin.DeleteServiceAccount()
func (ac AdminClient) deleteServiceAccount(ctx context.Context, serviceAccount string) error {
	return ac.Client.DeleteServiceAccount(ctx, serviceAccount)
}

// AccountInfo implements madmin.AccountingUsageInfo()
func (ac AdminClient) AccountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return ac.Client.AccountInfo(ctx)
}

func (ac AdminClient) heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
	return ac.Client.Heal(ctx, bucket, prefix, healOpts, clientToken, forceStart, forceStop)
}

// listRemoteBuckets - return a list of remote buckets
func (ac AdminClient) listRemoteBuckets(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error) {
	return ac.Client.ListRemoteTargets(ctx, bucket, arnType)
}

// getRemoteBucket - gets remote bucked based on a given bucket name
func (ac AdminClient) getRemoteBucket(ctx context.Context, bucket, arnType string) (*madmin.BucketTarget, error) {
	targets, err := ac.Client.ListRemoteTargets(ctx, bucket, arnType)
	if err != nil {
		return nil, err
	}
	if len(targets) > 0 {
		return &targets[0], nil
	}
	return nil, err
}

// removeRemoteBucket removes a remote target associated with particular ARN for this bucket
func (ac AdminClient) removeRemoteBucket(ctx context.Context, bucket, arn string) error {
	return ac.Client.RemoveRemoteTarget(ctx, bucket, arn)
}

// addRemoteBucket sets up a remote target for this bucket
func (ac AdminClient) addRemoteBucket(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error) {
	return ac.Client.SetRemoteTarget(ctx, bucket, target)
}

func (ac AdminClient) setBucketQuota(ctx context.Context, bucket string, quota *madmin.BucketQuota) error {
	return ac.Client.SetBucketQuota(ctx, bucket, quota)
}

func (ac AdminClient) getBucketQuota(ctx context.Context, bucket string) (madmin.BucketQuota, error) {
	return ac.Client.GetBucketQuota(ctx, bucket)
}

// serverHealthInfo implements mc.ServerHealthInfo - Connect to a minio server and call Health Info Management API
func (ac AdminClient) serverHealthInfo(ctx context.Context, healthDataTypes []madmin.HealthDataType, deadline time.Duration) (interface{}, string, error) {
	resp, version, err := ac.Client.ServerHealthInfo(ctx, healthDataTypes, deadline)
	if err != nil {
		return nil, version, err
	}

	var healthInfo interface{}

	decoder := json.NewDecoder(resp.Body)
	switch version {
	case madmin.HealthInfoVersion0:
		info := madmin.HealthInfoV0{}
		for {
			if err = decoder.Decode(&info); err != nil {
				break
			}
		}

		// Old minio versions don't return the MinIO info in
		// response of the healthinfo api. So fetch it separately
		minioInfo, err := ac.Client.ServerInfo(ctx)
		if err != nil {
			info.Minio.Error = err.Error()
		} else {
			info.Minio.Info = minioInfo
		}

		healthInfo = mcCmd.MapHealthInfoToV1(info, nil)
		version = madmin.HealthInfoVersion1
	case madmin.HealthInfoVersion:
		info := madmin.HealthInfo{}
		for {
			if err = decoder.Decode(&info); err != nil {
				break
			}
		}
		healthInfo = info
	}

	return healthInfo, version, nil
}

// implements madmin.listTiers()
func (ac AdminClient) listTiers(ctx context.Context) ([]*madmin.TierConfig, error) {
	return ac.Client.ListTiers(ctx)
}

// implements madmin.AddTier()
func (ac AdminClient) addTier(ctx context.Context, cfg *madmin.TierConfig) error {
	return ac.Client.AddTier(ctx, cfg)
}

// implements madmin.EditTier()
func (ac AdminClient) editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error {
	return ac.Client.EditTier(ctx, tierName, creds)
}

func NewMinioAdminClient(sessionClaims *models.Principal) (*madmin.AdminClient, error) {
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
	adminClient.SetCustomTransport(GetConsoleHTTPClient().Transport)
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

// httpClient is a custom http client, this client should not be called directly and instead be
// called using GetConsoleHTTPClient() to ensure is initialized and the certificates are loaded correctly
var httpClient *http.Client

// GetConsoleHTTPClient will initialize the console HTTP Client with fully populated custom TLS
// Transport that with loads certs at
// - ${HOME}/.console/certs/CAs
// - ${HOME}/.minio/certs/CAs
func GetConsoleHTTPClient() *http.Client {
	if httpClient == nil {
		httpClient = PrepareConsoleHTTPClient(false)
	}
	return httpClient
}

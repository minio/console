// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"context"
	"io"
	"time"

	"github.com/minio/madmin-go/v3"
	iampolicy "github.com/minio/pkg/v3/policy"
)

type AdminClientMock struct{}

var (
	MinioServerInfoMock     func(ctx context.Context) (madmin.InfoMessage, error)
	minioChangePasswordMock func(ctx context.Context, accessKey, secretKey string) error

	minioHelpConfigKVMock       func(subSys, key string, envOnly bool) (madmin.Help, error)
	minioGetConfigKVMock        func(key string) ([]byte, error)
	minioSetConfigKVMock        func(kv string) (restart bool, err error)
	minioDelConfigKVMock        func(name string) (err error)
	minioHelpConfigKVGlobalMock func(envOnly bool) (madmin.Help, error)

	minioGetLogsMock func(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo

	minioListGroupsMock          func() ([]string, error)
	minioUpdateGroupMembersMock  func(madmin.GroupAddRemove) error
	minioGetGroupDescriptionMock func(group string) (*madmin.GroupDesc, error)
	minioSetGroupStatusMock      func(group string, status madmin.GroupStatus) error

	minioHealMock func(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
		forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error)

	minioServerHealthInfoMock func(ctx context.Context, deadline time.Duration) (interface{}, string, error)

	minioListPoliciesMock func() (map[string]*iampolicy.Policy, error)
	minioGetPolicyMock    func(name string) (*iampolicy.Policy, error)
	minioRemovePolicyMock func(name string) error
	minioAddPolicyMock    func(name string, policy *iampolicy.Policy) error
	minioSetPolicyMock    func(policyName, entityName string, isGroup bool) error

	minioStartProfiling func(profiler madmin.ProfilerType, duration time.Duration) (io.ReadCloser, error)

	minioServiceRestartMock func(ctx context.Context) error

	getSiteReplicationInfo        func(ctx context.Context) (*madmin.SiteReplicationInfo, error)
	addSiteReplicationInfo        func(ctx context.Context, sites []madmin.PeerSite) (*madmin.ReplicateAddStatus, error)
	editSiteReplicationInfo       func(ctx context.Context, site madmin.PeerInfo) (*madmin.ReplicateEditStatus, error)
	deleteSiteReplicationInfoMock func(ctx context.Context, removeReq madmin.SRRemoveReq) (*madmin.ReplicateRemoveStatus, error)
	getSiteReplicationStatus      func(ctx context.Context, params madmin.SRStatusOptions) (*madmin.SRStatusInfo, error)

	minioListTiersMock        func(ctx context.Context) ([]*madmin.TierConfig, error)
	minioTierStatsMock        func(ctx context.Context) ([]madmin.TierInfo, error)
	minioAddTiersMock         func(ctx context.Context, tier *madmin.TierConfig) error
	minioRemoveTierMock       func(ctx context.Context, tierName string) error
	minioEditTiersMock        func(ctx context.Context, tierName string, creds madmin.TierCreds) error
	minioVerifyTierStatusMock func(ctx context.Context, tierName string) error

	minioServiceTraceMock func(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo

	minioListUsersMock     func() (map[string]madmin.UserInfo, error)
	minioAddUserMock       func(accessKey, secreyKey string) error
	minioRemoveUserMock    func(accessKey string) error
	minioGetUserInfoMock   func(accessKey string) (madmin.UserInfo, error)
	minioSetUserStatusMock func(accessKey string, status madmin.AccountStatus) error

	minioAccountInfoMock           func(ctx context.Context) (madmin.AccountInfo, error)
	minioAddServiceAccountMock     func(ctx context.Context, policy string, user string, accessKey string, secretKey string, description string, name string, expiry *time.Time, status string) (madmin.Credentials, error)
	minioListServiceAccountsMock   func(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error)
	minioDeleteServiceAccountMock  func(ctx context.Context, serviceAccount string) error
	minioInfoServiceAccountMock    func(ctx context.Context, serviceAccount string) (madmin.InfoServiceAccountResp, error)
	minioUpdateServiceAccountMock  func(ctx context.Context, serviceAccount string, opts madmin.UpdateServiceAccountReq) error
	minioGetLDAPPolicyEntitiesMock func(ctx context.Context, query madmin.PolicyEntitiesQuery) (madmin.PolicyEntitiesResult, error)

	minioListRemoteBucketsMock func(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error)
	minioGetRemoteBucketMock   func(ctx context.Context, bucket, arnType string) (targets *madmin.BucketTarget, err error)
	minioAddRemoteBucketMock   func(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error)
)

func (ac AdminClientMock) serverInfo(ctx context.Context) (madmin.InfoMessage, error) {
	return MinioServerInfoMock(ctx)
}

func (ac AdminClientMock) listRemoteBuckets(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error) {
	return minioListRemoteBucketsMock(ctx, bucket, arnType)
}

func (ac AdminClientMock) getRemoteBucket(ctx context.Context, bucket, arnType string) (targets *madmin.BucketTarget, err error) {
	return minioGetRemoteBucketMock(ctx, bucket, arnType)
}

func (ac AdminClientMock) removeRemoteBucket(_ context.Context, _, _ string) error {
	return nil
}

func (ac AdminClientMock) addRemoteBucket(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error) {
	return minioAddRemoteBucketMock(ctx, bucket, target)
}

func (ac AdminClientMock) changePassword(ctx context.Context, accessKey, secretKey string) error {
	return minioChangePasswordMock(ctx, accessKey, secretKey)
}

func (ac AdminClientMock) speedtest(_ context.Context, _ madmin.SpeedtestOpts) (chan madmin.SpeedTestResult, error) {
	return nil, nil
}

func (ac AdminClientMock) verifyTierStatus(ctx context.Context, tier string) error {
	return minioVerifyTierStatusMock(ctx, tier)
}

// mock function helpConfigKV()
func (ac AdminClientMock) helpConfigKV(_ context.Context, subSys, key string, envOnly bool) (madmin.Help, error) {
	return minioHelpConfigKVMock(subSys, key, envOnly)
}

// mock function getConfigKV()
func (ac AdminClientMock) getConfigKV(_ context.Context, name string) ([]byte, error) {
	return minioGetConfigKVMock(name)
}

// mock function setConfigKV()
func (ac AdminClientMock) setConfigKV(_ context.Context, kv string) (restart bool, err error) {
	return minioSetConfigKVMock(kv)
}

// mock function helpConfigKV()
func (ac AdminClientMock) helpConfigKVGlobal(_ context.Context, envOnly bool) (madmin.Help, error) {
	return minioHelpConfigKVGlobalMock(envOnly)
}

func (ac AdminClientMock) delConfigKV(_ context.Context, name string) (err error) {
	return minioDelConfigKVMock(name)
}

func (ac AdminClientMock) getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
	return minioGetLogsMock(ctx, node, lineCnt, logKind)
}

func (ac AdminClientMock) listGroups(_ context.Context) ([]string, error) {
	return minioListGroupsMock()
}

func (ac AdminClientMock) updateGroupMembers(_ context.Context, req madmin.GroupAddRemove) error {
	return minioUpdateGroupMembersMock(req)
}

func (ac AdminClientMock) getGroupDescription(_ context.Context, group string) (*madmin.GroupDesc, error) {
	return minioGetGroupDescriptionMock(group)
}

func (ac AdminClientMock) setGroupStatus(_ context.Context, group string, status madmin.GroupStatus) error {
	return minioSetGroupStatusMock(group, status)
}

func (ac AdminClientMock) heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool,
) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
	return minioHealMock(ctx, bucket, prefix, healOpts, clientToken, forceStart, forceStop)
}

func (ac AdminClientMock) serverHealthInfo(ctx context.Context, deadline time.Duration) (interface{}, string, error) {
	return minioServerHealthInfoMock(ctx, deadline)
}

func (ac AdminClientMock) addOrUpdateIDPConfig(_ context.Context, _, _, _ string, _ bool) (restart bool, err error) {
	return true, nil
}

func (ac AdminClientMock) listIDPConfig(_ context.Context, _ string) ([]madmin.IDPListItem, error) {
	return []madmin.IDPListItem{{Name: "mock"}}, nil
}

func (ac AdminClientMock) deleteIDPConfig(_ context.Context, _, _ string) (restart bool, err error) {
	return true, nil
}

func (ac AdminClientMock) getIDPConfig(_ context.Context, _, _ string) (c madmin.IDPConfig, err error) {
	return madmin.IDPConfig{Info: []madmin.IDPCfgInfo{{Key: "mock", Value: "mock"}}}, nil
}

func (ac AdminClientMock) kmsStatus(_ context.Context) (madmin.KMSStatus, error) {
	return madmin.KMSStatus{Name: "name", DefaultKeyID: "key", Endpoints: map[string]madmin.ItemState{"localhost": madmin.ItemState("online")}}, nil
}

func (ac AdminClientMock) kmsAPIs(_ context.Context) ([]madmin.KMSAPI, error) {
	return []madmin.KMSAPI{{Method: "GET", Path: "/mock"}}, nil
}

func (ac AdminClientMock) kmsMetrics(_ context.Context) (*madmin.KMSMetrics, error) {
	return &madmin.KMSMetrics{}, nil
}

func (ac AdminClientMock) kmsVersion(_ context.Context) (*madmin.KMSVersion, error) {
	return &madmin.KMSVersion{Version: "test-version"}, nil
}

func (ac AdminClientMock) createKey(_ context.Context, _ string) error {
	return nil
}

func (ac AdminClientMock) listKeys(_ context.Context, _ string) ([]madmin.KMSKeyInfo, error) {
	return []madmin.KMSKeyInfo{{
		Name:      "name",
		CreatedBy: "by",
	}}, nil
}

func (ac AdminClientMock) keyStatus(_ context.Context, _ string) (*madmin.KMSKeyStatus, error) {
	return &madmin.KMSKeyStatus{KeyID: "key"}, nil
}

func (ac AdminClientMock) listPolicies(_ context.Context) (map[string]*iampolicy.Policy, error) {
	return minioListPoliciesMock()
}

func (ac AdminClientMock) getPolicy(_ context.Context, name string) (*iampolicy.Policy, error) {
	return minioGetPolicyMock(name)
}

func (ac AdminClientMock) removePolicy(_ context.Context, name string) error {
	return minioRemovePolicyMock(name)
}

func (ac AdminClientMock) addPolicy(_ context.Context, name string, policy *iampolicy.Policy) error {
	return minioAddPolicyMock(name, policy)
}

func (ac AdminClientMock) setPolicy(_ context.Context, policyName, entityName string, isGroup bool) error {
	return minioSetPolicyMock(policyName, entityName, isGroup)
}

// mock function for startProfiling()
func (ac AdminClientMock) startProfiling(_ context.Context, profiler madmin.ProfilerType, duration time.Duration) (io.ReadCloser, error) {
	return minioStartProfiling(profiler, duration)
}

// mock function of serviceRestart()
func (ac AdminClientMock) serviceRestart(ctx context.Context) error {
	return minioServiceRestartMock(ctx)
}

func (ac AdminClientMock) getSiteReplicationInfo(ctx context.Context) (*madmin.SiteReplicationInfo, error) {
	return getSiteReplicationInfo(ctx)
}

func (ac AdminClientMock) addSiteReplicationInfo(ctx context.Context, sites []madmin.PeerSite, _ madmin.SRAddOptions) (*madmin.ReplicateAddStatus, error) {
	return addSiteReplicationInfo(ctx, sites)
}

func (ac AdminClientMock) editSiteReplicationInfo(ctx context.Context, site madmin.PeerInfo, _ madmin.SREditOptions) (*madmin.ReplicateEditStatus, error) {
	return editSiteReplicationInfo(ctx, site)
}

func (ac AdminClientMock) deleteSiteReplicationInfo(ctx context.Context, removeReq madmin.SRRemoveReq) (*madmin.ReplicateRemoveStatus, error) {
	return deleteSiteReplicationInfoMock(ctx, removeReq)
}

func (ac AdminClientMock) getSiteReplicationStatus(ctx context.Context, params madmin.SRStatusOptions) (*madmin.SRStatusInfo, error) {
	return getSiteReplicationStatus(ctx, params)
}

func (ac AdminClientMock) listTiers(ctx context.Context) ([]*madmin.TierConfig, error) {
	return minioListTiersMock(ctx)
}

func (ac AdminClientMock) tierStats(ctx context.Context) ([]madmin.TierInfo, error) {
	return minioTierStatsMock(ctx)
}

func (ac AdminClientMock) addTier(ctx context.Context, tier *madmin.TierConfig) error {
	return minioAddTiersMock(ctx, tier)
}

func (ac AdminClientMock) removeTier(ctx context.Context, tierName string) error {
	return minioRemoveTierMock(ctx, tierName)
}

func (ac AdminClientMock) editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error {
	return minioEditTiersMock(ctx, tierName, creds)
}

func (ac AdminClientMock) serviceTrace(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
	return minioServiceTraceMock(ctx, threshold, s3, internal, storage, os, errTrace)
}

func (ac AdminClientMock) listUsers(_ context.Context) (map[string]madmin.UserInfo, error) {
	return minioListUsersMock()
}

func (ac AdminClientMock) addUser(_ context.Context, accessKey, secretKey string) error {
	return minioAddUserMock(accessKey, secretKey)
}

func (ac AdminClientMock) removeUser(_ context.Context, accessKey string) error {
	return minioRemoveUserMock(accessKey)
}

func (ac AdminClientMock) getUserInfo(_ context.Context, accessKey string) (madmin.UserInfo, error) {
	return minioGetUserInfoMock(accessKey)
}

func (ac AdminClientMock) setUserStatus(_ context.Context, accessKey string, status madmin.AccountStatus) error {
	return minioSetUserStatusMock(accessKey, status)
}

func (ac AdminClientMock) AccountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return minioAccountInfoMock(ctx)
}

func (ac AdminClientMock) addServiceAccount(ctx context.Context, policy string, user string, accessKey string, secretKey string, description string, name string, expiry *time.Time, status string) (madmin.Credentials, error) {
	return minioAddServiceAccountMock(ctx, policy, user, accessKey, secretKey, description, name, expiry, status)
}

func (ac AdminClientMock) listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
	return minioListServiceAccountsMock(ctx, user)
}

func (ac AdminClientMock) deleteServiceAccount(ctx context.Context, serviceAccount string) error {
	return minioDeleteServiceAccountMock(ctx, serviceAccount)
}

func (ac AdminClientMock) infoServiceAccount(ctx context.Context, serviceAccount string) (madmin.InfoServiceAccountResp, error) {
	return minioInfoServiceAccountMock(ctx, serviceAccount)
}

func (ac AdminClientMock) updateServiceAccount(ctx context.Context, serviceAccount string, opts madmin.UpdateServiceAccountReq) error {
	return minioUpdateServiceAccountMock(ctx, serviceAccount, opts)
}

func (ac AdminClientMock) getLDAPPolicyEntities(ctx context.Context, query madmin.PolicyEntitiesQuery) (madmin.PolicyEntitiesResult, error) {
	return minioGetLDAPPolicyEntitiesMock(ctx, query)
}

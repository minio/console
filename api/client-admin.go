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
	"io"
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/minio/console/pkg"

	"github.com/minio/console/pkg/utils"

	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/minio/minio-go/v7/pkg/credentials"
	iampolicy "github.com/minio/pkg/v3/policy"
)

const globalAppName = "MinIO Console"

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
	helpConfigKVGlobal(ctx context.Context, envOnly bool) (madmin.Help, error)
	setConfigKV(ctx context.Context, kv string) (restart bool, err error)
	delConfigKV(ctx context.Context, kv string) (err error)
	serviceRestart(ctx context.Context) error
	serverInfo(ctx context.Context) (madmin.InfoMessage, error)
	startProfiling(ctx context.Context, profiler madmin.ProfilerType, duration time.Duration) (io.ReadCloser, error)
	serviceTrace(ctx context.Context, threshold int64, s3, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo
	getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo
	AccountInfo(ctx context.Context) (madmin.AccountInfo, error)
	heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
		forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error)
	// Service Accounts
	addServiceAccount(ctx context.Context, policy string, user string, accessKey string, secretKey string, name string, description string, expiry *time.Time, comment string) (madmin.Credentials, error)
	listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error)
	deleteServiceAccount(ctx context.Context, serviceAccount string) error
	infoServiceAccount(ctx context.Context, serviceAccount string) (madmin.InfoServiceAccountResp, error)
	updateServiceAccount(ctx context.Context, serviceAccount string, opts madmin.UpdateServiceAccountReq) error
	// Remote Buckets
	listRemoteBuckets(ctx context.Context, bucket, arnType string) (targets []madmin.BucketTarget, err error)
	getRemoteBucket(ctx context.Context, bucket, arnType string) (targets *madmin.BucketTarget, err error)
	removeRemoteBucket(ctx context.Context, bucket, arn string) error
	addRemoteBucket(ctx context.Context, bucket string, target *madmin.BucketTarget) (string, error)
	// Account password management
	changePassword(ctx context.Context, accessKey, secretKey string) error
	serverHealthInfo(ctx context.Context, deadline time.Duration) (interface{}, string, error)
	// List Tiers
	listTiers(ctx context.Context) ([]*madmin.TierConfig, error)
	// Tier Info
	tierStats(ctx context.Context) ([]madmin.TierInfo, error)
	// Add Tier
	addTier(ctx context.Context, tier *madmin.TierConfig) error
	// Edit Tier Credentials
	editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error
	// verify Tier status
	verifyTierStatus(ctx context.Context, tierName string) error
	// remove empty Tier
	removeTier(ctx context.Context, tierName string) error
	// Speedtest
	speedtest(ctx context.Context, opts madmin.SpeedtestOpts) (chan madmin.SpeedTestResult, error)
	// Site Relication
	getSiteReplicationInfo(ctx context.Context) (*madmin.SiteReplicationInfo, error)
	addSiteReplicationInfo(ctx context.Context, sites []madmin.PeerSite, opts madmin.SRAddOptions) (*madmin.ReplicateAddStatus, error)
	editSiteReplicationInfo(ctx context.Context, site madmin.PeerInfo, opts madmin.SREditOptions) (*madmin.ReplicateEditStatus, error)
	deleteSiteReplicationInfo(ctx context.Context, removeReq madmin.SRRemoveReq) (*madmin.ReplicateRemoveStatus, error)

	// Replication status
	getSiteReplicationStatus(ctx context.Context, params madmin.SRStatusOptions) (*madmin.SRStatusInfo, error)

	// KMS
	kmsStatus(ctx context.Context) (madmin.KMSStatus, error)
	kmsMetrics(ctx context.Context) (*madmin.KMSMetrics, error)
	kmsAPIs(ctx context.Context) ([]madmin.KMSAPI, error)
	kmsVersion(ctx context.Context) (*madmin.KMSVersion, error)
	createKey(ctx context.Context, key string) error
	listKeys(ctx context.Context, pattern string) ([]madmin.KMSKeyInfo, error)
	keyStatus(ctx context.Context, key string) (*madmin.KMSKeyStatus, error)

	// IDP
	addOrUpdateIDPConfig(ctx context.Context, idpType, cfgName, cfgData string, update bool) (restart bool, err error)
	listIDPConfig(ctx context.Context, idpType string) ([]madmin.IDPListItem, error)
	deleteIDPConfig(ctx context.Context, idpType, cfgName string) (restart bool, err error)
	getIDPConfig(ctx context.Context, cfgType, cfgName string) (c madmin.IDPConfig, err error)

	// LDAP
	getLDAPPolicyEntities(ctx context.Context, query madmin.PolicyEntitiesQuery) (madmin.PolicyEntitiesResult, error)
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

// implements madmin.GetUserInfo()
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
	info, err := ac.Client.InfoCannedPolicyV2(ctx, name)
	if err != nil {
		return nil, err
	}
	return iampolicy.ParseConfig(bytes.NewReader(info.Policy))
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
	// nolint:staticcheck // ignore SA1019
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

// implements madmin.helpConfigKVGlobal()
func (ac AdminClient) helpConfigKVGlobal(ctx context.Context, envOnly bool) (madmin.Help, error) {
	return ac.Client.HelpConfigKV(ctx, "", "", envOnly)
}

// implements madmin.SetConfigKV()
func (ac AdminClient) setConfigKV(ctx context.Context, kv string) (restart bool, err error) {
	return ac.Client.SetConfigKV(ctx, kv)
}

// implements madmin.DelConfigKV()
func (ac AdminClient) delConfigKV(ctx context.Context, kv string) (err error) {
	_, err = ac.Client.DelConfigKV(ctx, kv)
	return err
}

// implements madmin.ServiceRestart()
func (ac AdminClient) serviceRestart(ctx context.Context) (err error) {
	return ac.Client.ServiceRestartV2(ctx)
}

// implements madmin.ServerInfo()
func (ac AdminClient) serverInfo(ctx context.Context) (madmin.InfoMessage, error) {
	return ac.Client.ServerInfo(ctx)
}

// implements madmin.StartProfiling()
func (ac AdminClient) startProfiling(ctx context.Context, profiler madmin.ProfilerType, duration time.Duration) (io.ReadCloser, error) {
	return ac.Client.Profile(ctx, profiler, duration)
}

// implements madmin.ServiceTrace()
func (ac AdminClient) serviceTrace(ctx context.Context, threshold int64, _, internal, storage, os, errTrace bool) <-chan madmin.ServiceTraceInfo {
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
func (ac AdminClient) addServiceAccount(ctx context.Context, policy string, user string, accessKey string, secretKey string, name string, description string, expiry *time.Time, comment string) (madmin.Credentials, error) {
	return ac.Client.AddServiceAccount(ctx, madmin.AddServiceAccountReq{
		Policy:      []byte(policy),
		TargetUser:  user,
		AccessKey:   accessKey,
		SecretKey:   secretKey,
		Name:        name,
		Description: description,
		Expiration:  expiry,
		Comment:     comment,
	})
}

// implements madmin.ListServiceAccounts()
func (ac AdminClient) listServiceAccounts(ctx context.Context, user string) (madmin.ListServiceAccountsResp, error) {
	return ac.Client.ListServiceAccounts(ctx, user)
}

// implements madmin.DeleteServiceAccount()
func (ac AdminClient) deleteServiceAccount(ctx context.Context, serviceAccount string) error {
	return ac.Client.DeleteServiceAccount(ctx, serviceAccount)
}

// implements madmin.InfoServiceAccount()
func (ac AdminClient) infoServiceAccount(ctx context.Context, serviceAccount string) (madmin.InfoServiceAccountResp, error) {
	return ac.Client.InfoServiceAccount(ctx, serviceAccount)
}

// implements madmin.UpdateServiceAccount()
func (ac AdminClient) updateServiceAccount(ctx context.Context, serviceAccount string, opts madmin.UpdateServiceAccountReq) error {
	return ac.Client.UpdateServiceAccount(ctx, serviceAccount, opts)
}

// AccountInfo implements madmin.AccountInfo()
func (ac AdminClient) AccountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return ac.Client.AccountInfo(ctx, madmin.AccountOpts{})
}

func (ac AdminClient) heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool,
) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
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
func (ac AdminClient) serverHealthInfo(ctx context.Context, deadline time.Duration) (interface{}, string, error) {
	info := madmin.HealthInfo{}
	var healthInfo interface{}
	var version string
	var resp *http.Response
	var err error
	resp, version, err = ac.Client.ServerHealthInfo(ctx, madmin.HealthDataTypesList, deadline, "")
	if err != nil {
		return nil, version, err
	}
	decoder := json.NewDecoder(resp.Body)
	for {
		if err = decoder.Decode(&info); err != nil {
			break
		}
	}
	if info.Version == "" {
		return nil, "", ErrHealthReportFail
	}
	healthInfo = info

	return healthInfo, version, nil
}

// implements madmin.listTiers()
func (ac AdminClient) listTiers(ctx context.Context) ([]*madmin.TierConfig, error) {
	return ac.Client.ListTiers(ctx)
}

// implements madmin.tierStats()
func (ac AdminClient) tierStats(ctx context.Context) ([]madmin.TierInfo, error) {
	return ac.Client.TierStats(ctx)
}

// implements madmin.AddTier()
func (ac AdminClient) addTier(ctx context.Context, cfg *madmin.TierConfig) error {
	return ac.Client.AddTier(ctx, cfg)
}

// implements madmin.Inspect()
func (ac AdminClient) inspect(ctx context.Context, insOpts madmin.InspectOptions) ([]byte, io.ReadCloser, error) {
	return ac.Client.Inspect(ctx, insOpts)
}

// implements madmin.EditTier()
func (ac AdminClient) editTierCreds(ctx context.Context, tierName string, creds madmin.TierCreds) error {
	return ac.Client.EditTier(ctx, tierName, creds)
}

// implements madmin.VerifyTier()
func (ac AdminClient) verifyTierStatus(ctx context.Context, tierName string) error {
	return ac.Client.VerifyTier(ctx, tierName)
}

// implements madmin.RemoveTier()
func (ac AdminClient) removeTier(ctx context.Context, tierName string) error {
	return ac.Client.RemoveTier(ctx, tierName)
}

func NewMinioAdminClient(ctx context.Context, sessionClaims *models.Principal) (*madmin.AdminClient, error) {
	clientIP := utils.ClientIPFromContext(ctx)
	adminClient, err := newAdminFromClaims(sessionClaims, clientIP)
	if err != nil {
		return nil, err
	}
	adminClient.SetAppInfo(globalAppName, pkg.Version)
	return adminClient, nil
}

// newAdminFromClaims creates a minio admin from Decrypted claims using Assume role credentials
func newAdminFromClaims(claims *models.Principal, clientIP string) (*madmin.AdminClient, error) {
	tlsEnabled := getMinIOEndpointIsSecure()
	endpoint := getMinIOEndpoint()

	adminClient, err := madmin.NewWithOptions(endpoint, &madmin.Options{
		Creds:  credentials.NewStaticV4(claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken),
		Secure: tlsEnabled,
	})
	if err != nil {
		return nil, err
	}
	adminClient.SetAppInfo(globalAppName, pkg.Version)
	adminClient.SetCustomTransport(PrepareSTSClientTransport(clientIP))
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
	minioClient.SetAppInfo(globalAppName, pkg.Version)
	return minioClient, nil
}

// isLocalAddress returns true if the url contains an IPv4/IPv6 hostname
// that points to the local machine - FQDN are not supported
func isLocalIPEndpoint(endpoint string) bool {
	u, err := url.Parse(endpoint)
	if err != nil {
		return false
	}
	return isLocalIPAddress(u.Hostname())
}

// isLocalAddress returns true if the url contains an IPv4/IPv6 hostname
// that points to the local machine - FQDN are not supported
func isLocalIPAddress(ipAddr string) bool {
	if ipAddr == "" {
		return false
	}
	if ipAddr == "localhost" {
		return true
	}
	ip := net.ParseIP(ipAddr)
	return ip != nil && ip.IsLoopback()
}

// GetConsoleHTTPClient caches different http clients depending on the target endpoint while taking
// in consideration CA certs stored in ${HOME}/.console/certs/CAs and ${HOME}/.minio/certs/CAs
// If the target endpoint points to a loopback device, skip the TLS verification.
func GetConsoleHTTPClient(clientIP string) *http.Client {
	return PrepareConsoleHTTPClient(clientIP)
}

var (
	// De-facto standard header keys.
	xForwardedFor = http.CanonicalHeaderKey("X-Forwarded-For")
	xRealIP       = http.CanonicalHeaderKey("X-Real-IP")
)

var (
	// RFC7239 defines a new "Forwarded: " header designed to replace the
	// existing use of X-Forwarded-* headers.
	// e.g. Forwarded: for=192.0.2.60;proto=https;by=203.0.113.43
	forwarded = http.CanonicalHeaderKey("Forwarded")
	// Allows for a sub-match of the first value after 'for=' to the next
	// comma, semi-colon or space. The match is case-insensitive.
	forRegex = regexp.MustCompile(`(?i)(?:for=)([^(;|,| )]+)(.*)`)
)

// getSourceIPFromHeaders retrieves the IP from the X-Forwarded-For, X-Real-IP
// and RFC7239 Forwarded headers (in that order)
func getSourceIPFromHeaders(r *http.Request) string {
	var addr string

	if fwd := r.Header.Get(xForwardedFor); fwd != "" {
		// Only grab the first (client) address. Note that '192.168.0.1,
		// 10.1.1.1' is a valid key for X-Forwarded-For where addresses after
		// the first may represent forwarding proxies earlier in the chain.
		s := strings.Index(fwd, ", ")
		if s == -1 {
			s = len(fwd)
		}
		addr = fwd[:s]
	} else if fwd := r.Header.Get(xRealIP); fwd != "" {
		// X-Real-IP should only contain one IP address (the client making the
		// request).
		addr = fwd
	} else if fwd := r.Header.Get(forwarded); fwd != "" {
		// match should contain at least two elements if the protocol was
		// specified in the Forwarded header. The first element will always be
		// the 'for=' capture, which we ignore. In the case of multiple IP
		// addresses (for=8.8.8.8, 8.8.4.4, 172.16.1.20 is valid) we only
		// extract the first, which should be the client IP.
		if match := forRegex.FindStringSubmatch(fwd); len(match) > 1 {
			// IPv6 addresses in Forwarded headers are quoted-strings. We strip
			// these quotes.
			addr = strings.Trim(match[1], `"`)
		}
	}

	return addr
}

// getClientIP retrieves the IP from the request headers
// and falls back to r.RemoteAddr when necessary.
// however returns without bracketing.
func getClientIP(r *http.Request) string {
	addr := getSourceIPFromHeaders(r)
	if addr == "" {
		addr = r.RemoteAddr
	}

	// Default to remote address if headers not set.
	raddr, _, _ := net.SplitHostPort(addr)
	if raddr == "" {
		return addr
	}
	return raddr
}

func (ac AdminClient) speedtest(ctx context.Context, opts madmin.SpeedtestOpts) (chan madmin.SpeedTestResult, error) {
	return ac.Client.Speedtest(ctx, opts)
}

// Site Replication
func (ac AdminClient) getSiteReplicationInfo(ctx context.Context) (*madmin.SiteReplicationInfo, error) {
	res, err := ac.Client.SiteReplicationInfo(ctx)
	if err != nil {
		return nil, err
	}
	return &madmin.SiteReplicationInfo{
		Enabled:                 res.Enabled,
		Name:                    res.Name,
		Sites:                   res.Sites,
		ServiceAccountAccessKey: res.ServiceAccountAccessKey,
	}, nil
}

func (ac AdminClient) addSiteReplicationInfo(ctx context.Context, sites []madmin.PeerSite, opts madmin.SRAddOptions) (*madmin.ReplicateAddStatus, error) {
	res, err := ac.Client.SiteReplicationAdd(ctx, sites, opts)
	if err != nil {
		return nil, err
	}

	return &madmin.ReplicateAddStatus{
		Success:                 res.Success,
		Status:                  res.Status,
		ErrDetail:               res.ErrDetail,
		InitialSyncErrorMessage: res.InitialSyncErrorMessage,
	}, nil
}

func (ac AdminClient) editSiteReplicationInfo(ctx context.Context, site madmin.PeerInfo, opts madmin.SREditOptions) (*madmin.ReplicateEditStatus, error) {
	res, err := ac.Client.SiteReplicationEdit(ctx, site, opts)
	if err != nil {
		return nil, err
	}
	return &madmin.ReplicateEditStatus{
		Success:   res.Success,
		Status:    res.Status,
		ErrDetail: res.ErrDetail,
	}, nil
}

func (ac AdminClient) deleteSiteReplicationInfo(ctx context.Context, removeReq madmin.SRRemoveReq) (*madmin.ReplicateRemoveStatus, error) {
	res, err := ac.Client.SiteReplicationRemove(ctx, removeReq)
	if err != nil {
		return nil, err
	}
	return &madmin.ReplicateRemoveStatus{
		Status:    res.Status,
		ErrDetail: res.ErrDetail,
	}, nil
}

func (ac AdminClient) getSiteReplicationStatus(ctx context.Context, params madmin.SRStatusOptions) (*madmin.SRStatusInfo, error) {
	res, err := ac.Client.SRStatusInfo(ctx, params)
	if err != nil {
		return nil, err
	}
	return &res, nil
}

func (ac AdminClient) kmsStatus(ctx context.Context) (madmin.KMSStatus, error) {
	return ac.Client.KMSStatus(ctx)
}

func (ac AdminClient) kmsMetrics(ctx context.Context) (*madmin.KMSMetrics, error) {
	return ac.Client.KMSMetrics(ctx)
}

func (ac AdminClient) kmsAPIs(ctx context.Context) ([]madmin.KMSAPI, error) {
	return ac.Client.KMSAPIs(ctx)
}

func (ac AdminClient) kmsVersion(ctx context.Context) (*madmin.KMSVersion, error) {
	return ac.Client.KMSVersion(ctx)
}

func (ac AdminClient) createKey(ctx context.Context, key string) error {
	return ac.Client.CreateKey(ctx, key)
}

func (ac AdminClient) listKeys(ctx context.Context, pattern string) ([]madmin.KMSKeyInfo, error) {
	return ac.Client.ListKeys(ctx, pattern)
}

func (ac AdminClient) keyStatus(ctx context.Context, key string) (*madmin.KMSKeyStatus, error) {
	return ac.Client.GetKeyStatus(ctx, key)
}

func (ac AdminClient) addOrUpdateIDPConfig(ctx context.Context, idpType, cfgName, cfgData string, update bool) (restart bool, err error) {
	return ac.Client.AddOrUpdateIDPConfig(ctx, idpType, cfgName, cfgData, update)
}

func (ac AdminClient) listIDPConfig(ctx context.Context, idpType string) ([]madmin.IDPListItem, error) {
	return ac.Client.ListIDPConfig(ctx, idpType)
}

func (ac AdminClient) deleteIDPConfig(ctx context.Context, idpType, cfgName string) (restart bool, err error) {
	return ac.Client.DeleteIDPConfig(ctx, idpType, cfgName)
}

func (ac AdminClient) getIDPConfig(ctx context.Context, idpType, cfgName string) (c madmin.IDPConfig, err error) {
	return ac.Client.GetIDPConfig(ctx, idpType, cfgName)
}

func (ac AdminClient) getLDAPPolicyEntities(ctx context.Context, query madmin.PolicyEntitiesQuery) (madmin.PolicyEntitiesResult, error) {
	return ac.Client.GetLDAPPolicyEntities(ctx, query)
}

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
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/minio/minio-go/v7/pkg/replication"
	"github.com/minio/minio-go/v7/pkg/sse"

	"errors"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/ldap"
	xjwt "github.com/minio/console/pkg/auth/token"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio-go/v7/pkg/lifecycle"
	"github.com/minio/minio-go/v7/pkg/notification"
	"github.com/minio/minio-go/v7/pkg/tags"
)

func init() {
	// All minio-go API operations shall be performed only once,
	// another way to look at this is we are turning off retries.
	minio.MaxRetry = 1
}

// MinioClient interface with all functions to be implemented
// by mock when testing, it should include all MinioClient respective api calls
// that are used within this project.
type MinioClient interface {
	listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error)
	makeBucketWithContext(ctx context.Context, bucketName, location string, objectLocking bool) error
	setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error
	removeBucket(ctx context.Context, bucketName string) error
	getBucketNotification(ctx context.Context, bucketName string) (config notification.Configuration, err error)
	getBucketPolicy(ctx context.Context, bucketName string) (string, error)
	listObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
	getObjectRetention(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error)
	getObjectLegalHold(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error)
	putObject(ctx context.Context, bucketName, objectName string, reader io.Reader, objectSize int64, opts minio.PutObjectOptions) (info minio.UploadInfo, err error)
	putObjectLegalHold(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error
	putObjectRetention(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error
	setBucketEncryption(ctx context.Context, bucketName string, config *sse.Configuration) error
	removeBucketEncryption(ctx context.Context, bucketName string) error
	getBucketEncryption(ctx context.Context, bucketName string) (*sse.Configuration, error)
	putObjectTagging(ctx context.Context, bucketName, objectName string, otags *tags.Tags, opts minio.PutObjectTaggingOptions) error
	getObjectTagging(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error)
	setObjectLockConfig(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error
	getBucketObjectLockConfig(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	getObjectLockConfig(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	getLifecycleRules(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error)
	setBucketLifecycle(ctx context.Context, bucketName string, config *lifecycle.Configuration) error
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type minioClient struct {
	client *minio.Client
}

// implements minio.ListBuckets(ctx)
func (c minioClient) listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error) {
	return c.client.ListBuckets(ctx)
}

// implements minio.MakeBucketWithContext(ctx, bucketName, location, objectLocking)
func (c minioClient) makeBucketWithContext(ctx context.Context, bucketName, location string, objectLocking bool) error {
	return c.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{
		Region:        location,
		ObjectLocking: objectLocking,
	})
}

// implements minio.SetBucketPolicyWithContext(ctx, bucketName, policy)
func (c minioClient) setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error {
	return c.client.SetBucketPolicy(ctx, bucketName, policy)
}

// implements minio.RemoveBucket(bucketName)
func (c minioClient) removeBucket(ctx context.Context, bucketName string) error {
	return c.client.RemoveBucket(ctx, bucketName)
}

// implements minio.GetBucketNotification(bucketName)
func (c minioClient) getBucketNotification(ctx context.Context, bucketName string) (config notification.Configuration, err error) {
	return c.client.GetBucketNotification(ctx, bucketName)
}

// implements minio.GetBucketPolicy(bucketName)
func (c minioClient) getBucketPolicy(ctx context.Context, bucketName string) (string, error) {
	return c.client.GetBucketPolicy(ctx, bucketName)
}

// implements minio.getBucketVersioning(ctx, bucketName)
func (c minioClient) getBucketVersioning(ctx context.Context, bucketName string) (minio.BucketVersioningConfiguration, error) {
	return c.client.GetBucketVersioning(ctx, bucketName)
}

// implements minio.getBucketVersioning(ctx, bucketName)
func (c minioClient) getBucketReplication(ctx context.Context, bucketName string) (replication.Config, error) {
	return c.client.GetBucketReplication(ctx, bucketName)
}

// implements minio.listObjects(ctx)
func (c minioClient) listObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	return c.client.ListObjects(ctx, bucket, opts)
}

func (c minioClient) getObjectRetention(ctx context.Context, bucketName, objectName, versionID string) (mode *minio.RetentionMode, retainUntilDate *time.Time, err error) {
	return c.client.GetObjectRetention(ctx, bucketName, objectName, versionID)
}

func (c minioClient) getObjectLegalHold(ctx context.Context, bucketName, objectName string, opts minio.GetObjectLegalHoldOptions) (status *minio.LegalHoldStatus, err error) {
	return c.client.GetObjectLegalHold(ctx, bucketName, objectName, opts)
}

func (c minioClient) putObject(ctx context.Context, bucketName, objectName string, reader io.Reader, objectSize int64, opts minio.PutObjectOptions) (info minio.UploadInfo, err error) {
	return c.client.PutObject(ctx, bucketName, objectName, reader, objectSize, opts)
}

func (c minioClient) putObjectLegalHold(ctx context.Context, bucketName, objectName string, opts minio.PutObjectLegalHoldOptions) error {
	return c.client.PutObjectLegalHold(ctx, bucketName, objectName, opts)
}

func (c minioClient) putObjectRetention(ctx context.Context, bucketName, objectName string, opts minio.PutObjectRetentionOptions) error {
	return c.client.PutObjectRetention(ctx, bucketName, objectName, opts)
}

// implements minio.SetBucketEncryption(ctx, bucketName, config)
func (c minioClient) setBucketEncryption(ctx context.Context, bucketName string, config *sse.Configuration) error {
	return c.client.SetBucketEncryption(ctx, bucketName, config)
}

// implements minio.RemoveBucketEncryption(ctx, bucketName)
func (c minioClient) removeBucketEncryption(ctx context.Context, bucketName string) error {
	return c.client.RemoveBucketEncryption(ctx, bucketName)
}

// implements minio.GetBucketEncryption(ctx, bucketName, config)
func (c minioClient) getBucketEncryption(ctx context.Context, bucketName string) (*sse.Configuration, error) {
	return c.client.GetBucketEncryption(ctx, bucketName)
}

func (c minioClient) putObjectTagging(ctx context.Context, bucketName, objectName string, otags *tags.Tags, opts minio.PutObjectTaggingOptions) error {
	return c.client.PutObjectTagging(ctx, bucketName, objectName, otags, opts)
}

func (c minioClient) getObjectTagging(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error) {
	return c.client.GetObjectTagging(ctx, bucketName, objectName, opts)
}

func (c minioClient) setObjectLockConfig(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
	return c.client.SetObjectLockConfig(ctx, bucketName, mode, validity, unit)
}

func (c minioClient) getBucketObjectLockConfig(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
	return c.client.GetBucketObjectLockConfig(ctx, bucketName)
}

func (c minioClient) getObjectLockConfig(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error) {
	return c.client.GetObjectLockConfig(ctx, bucketName)
}

func (c minioClient) getLifecycleRules(ctx context.Context, bucketName string) (lifecycle *lifecycle.Configuration, err error) {
	return c.client.GetBucketLifecycle(ctx, bucketName)
}

func (c minioClient) setBucketLifecycle(ctx context.Context, bucketName string, config *lifecycle.Configuration) error {
	return c.client.SetBucketLifecycle(ctx, bucketName, config)
}

// MCClient interface with all functions to be implemented
// by mock when testing, it should include all mc/S3Client respective api calls
// that are used within this project.
type MCClient interface {
	addNotificationConfig(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error
	removeNotificationConfig(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error
	watch(ctx context.Context, options mc.WatchOptions) (*mc.WatchObject, *probe.Error)
	remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error
	list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
	get(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error)
	shareDownload(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error)
	setVersioning(ctx context.Context, status string) *probe.Error
}

// Interface implementation
//
// Define the structure of a mc S3Client and define the functions that are actually used
// from mcS3client api.
type mcClient struct {
	client *mc.S3Client
}

// implements S3Client.AddNotificationConfig()
func (c mcClient) addNotificationConfig(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error {
	return c.client.AddNotificationConfig(ctx, arn, events, prefix, suffix, ignoreExisting)
}

// implements S3Client.RemoveNotificationConfig()
func (c mcClient) removeNotificationConfig(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error {
	return c.client.RemoveNotificationConfig(ctx, arn, event, prefix, suffix)
}

func (c mcClient) watch(ctx context.Context, options mc.WatchOptions) (*mc.WatchObject, *probe.Error) {
	return c.client.Watch(ctx, options)
}

func (c mcClient) setReplication(ctx context.Context, cfg *replication.Config, opts replication.Options) *probe.Error {
	return c.client.SetReplication(ctx, cfg, opts)
}

func (c mcClient) setVersioning(ctx context.Context, status string) *probe.Error {
	return c.client.SetVersion(ctx, status)
}

func (c mcClient) remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
	return c.client.Remove(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
}

func (c mcClient) list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
	return c.client.List(ctx, opts)
}

func (c mcClient) get(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error) {
	return c.client.Get(ctx, opts)
}

func (c mcClient) shareDownload(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error) {
	return c.client.ShareDownload(ctx, versionID, expires)
}

// ConsoleCredentialsI interface with all functions to be implemented
// by mock when testing, it should include all needed consoleCredentials.Login api calls
// that are used within this project.
type ConsoleCredentialsI interface {
	Get() (credentials.Value, error)
	Expire()
	GetAccountAccessKey() string
	GetActions() []string
}

// Interface implementation
type consoleCredentials struct {
	consoleCredentials *credentials.Credentials
	accountAccessKey   string
	actions            []string
}

func (c consoleCredentials) GetActions() []string {
	return c.actions
}

func (c consoleCredentials) GetAccountAccessKey() string {
	return c.accountAccessKey
}

// implements *Login.Get()
func (c consoleCredentials) Get() (credentials.Value, error) {
	return c.consoleCredentials.Get()
}

// implements *Login.Expire()
func (c consoleCredentials) Expire() {
	c.consoleCredentials.Expire()
}

// consoleSTSAssumeRole it's a STSAssumeRole wrapper, in general
// there's no need to use this struct anywhere else in the project, it's only required
// for passing a custom *http.Client to *credentials.STSAssumeRole
type consoleSTSAssumeRole struct {
	stsAssumeRole *credentials.STSAssumeRole
}

func (s consoleSTSAssumeRole) Retrieve() (credentials.Value, error) {
	return s.stsAssumeRole.Retrieve()
}

func (s consoleSTSAssumeRole) IsExpired() bool {
	return s.stsAssumeRole.IsExpired()
}

func newConsoleCredentials(accessKey, secretKey, location string) (*credentials.Credentials, error) {
	// Future authentication methods can be added under this switch statement
	switch {
	// authentication for Operator Console
	case acl.GetOperatorMode():
		{
			creds, err := auth.GetConsoleCredentialsForOperator(secretKey)
			if err != nil {
				return nil, err
			}
			return creds, nil
		}
	// LDAP authentication for Console
	case ldap.GetLDAPEnabled():
		{
			creds, err := auth.GetCredentialsFromLDAP(GetConsoleSTSClient(), getMinIOServer(), accessKey, secretKey)
			if err != nil {
				return nil, err
			}
			return creds, nil
		}
	// default authentication for Console is via STS (Security Token Service) against MinIO
	default:
		{
			if accessKey == "" || secretKey == "" {
				return nil, errors.New("credentials endpoint, access and secret key are mandatory for AssumeRoleSTS")
			}
			opts := credentials.STSAssumeRoleOptions{
				AccessKey:       accessKey,
				SecretKey:       secretKey,
				Location:        location,
				DurationSeconds: xjwt.GetConsoleSTSDurationInSeconds(),
			}
			stsAssumeRole := &credentials.STSAssumeRole{
				Client:      GetConsoleSTSClient(),
				STSEndpoint: getMinIOServer(),
				Options:     opts,
			}
			consoleSTSWrapper := consoleSTSAssumeRole{stsAssumeRole: stsAssumeRole}
			return credentials.New(consoleSTSWrapper), nil
		}
	}
}

// getConsoleCredentialsFromSession returns the *consoleCredentials.Login associated to the
// provided session token, this is useful for running the Expire() or IsExpired() operations
func getConsoleCredentialsFromSession(claims *models.Principal) *credentials.Credentials {
	return credentials.NewStaticV4(claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken)
}

// newMinioClient creates a new MinIO client based on the consoleCredentials extracted
// from the provided session token
func newMinioClient(claims *models.Principal) (*minio.Client, error) {
	creds := getConsoleCredentialsFromSession(claims)
	minioClient, err := minio.New(getMinIOEndpoint(), &minio.Options{
		Creds:     creds,
		Secure:    getMinIOEndpointIsSecure(),
		Transport: GetConsoleSTSClient().Transport,
	})
	if err != nil {
		return nil, err
	}
	return minioClient, nil
}

// newS3BucketClient creates a new mc S3Client to talk to the server based on a bucket
func newS3BucketClient(claims *models.Principal, bucketName string, prefix string) (*mc.S3Client, error) {
	endpoint := getMinIOServer()

	if strings.TrimSpace(bucketName) != "" {
		endpoint += fmt.Sprintf("/%s", bucketName)
	}

	if strings.TrimSpace(prefix) != "" {
		endpoint += fmt.Sprintf("/%s", prefix)
	}

	if claims == nil {
		return nil, fmt.Errorf("the provided credentials are invalid")
	}

	s3Config := newS3Config(endpoint, claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken, false)
	client, pErr := mc.S3New(s3Config)
	if pErr != nil {
		return nil, pErr.Cause
	}
	s3Client, ok := client.(*mc.S3Client)
	if !ok {
		return nil, fmt.Errorf("the provided url doesn't point to a S3 server")
	}

	return s3Client, nil
}

// newS3Config simply creates a new Config struct using the passed
// parameters.
func newS3Config(endpoint, accessKey, secretKey, sessionToken string, insecure bool) *mc.Config {
	// We have a valid alias and hostConfig. We populate the/
	// consoleCredentials from the match found in the config file.
	s3Config := new(mc.Config)

	s3Config.AppName = globalAppName
	s3Config.AppVersion = pkg.Version
	s3Config.Debug = false
	s3Config.Insecure = insecure

	s3Config.HostURL = endpoint
	s3Config.AccessKey = accessKey
	s3Config.SecretKey = secretKey
	s3Config.SessionToken = sessionToken
	s3Config.Signature = "S3v4"
	s3Config.Transport = prepareSTSClientTransport(insecure)

	return s3Config
}

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
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/minio/minio-go/v7/pkg/replication"
	"github.com/minio/minio-go/v7/pkg/sse"
	xnet "github.com/minio/pkg/v3/net"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/ldap"
	xjwt "github.com/minio/console/pkg/auth/token"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
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
	statObject(ctx context.Context, bucketName, prefix string, opts minio.GetObjectOptions) (objectInfo minio.ObjectInfo, err error)
	setBucketEncryption(ctx context.Context, bucketName string, config *sse.Configuration) error
	removeBucketEncryption(ctx context.Context, bucketName string) error
	getBucketEncryption(ctx context.Context, bucketName string) (*sse.Configuration, error)
	putObjectTagging(ctx context.Context, bucketName, objectName string, otags *tags.Tags, opts minio.PutObjectTaggingOptions) error
	getObjectTagging(ctx context.Context, bucketName, objectName string, opts minio.GetObjectTaggingOptions) (*tags.Tags, error)
	setObjectLockConfig(ctx context.Context, bucketName string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error
	getBucketObjectLockConfig(ctx context.Context, bucketName string) (mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	getObjectLockConfig(ctx context.Context, bucketName string) (lock string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit, err error)
	copyObject(ctx context.Context, dst minio.CopyDestOptions, src minio.CopySrcOptions) (minio.UploadInfo, error)
	GetBucketTagging(ctx context.Context, bucketName string) (*tags.Tags, error)
	SetBucketTagging(ctx context.Context, bucketName string, tags *tags.Tags) error
	RemoveBucketTagging(ctx context.Context, bucketName string) error
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type minioClient struct {
	client *minio.Client
}

func (c minioClient) GetBucketTagging(ctx context.Context, bucketName string) (*tags.Tags, error) {
	return c.client.GetBucketTagging(ctx, bucketName)
}

func (c minioClient) SetBucketTagging(ctx context.Context, bucketName string, tags *tags.Tags) error {
	return c.client.SetBucketTagging(ctx, bucketName, tags)
}

func (c minioClient) RemoveBucketTagging(ctx context.Context, bucketName string) error {
	return c.client.RemoveBucketTagging(ctx, bucketName)
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

func (c minioClient) statObject(ctx context.Context, bucketName, prefix string, opts minio.GetObjectOptions) (objectInfo minio.ObjectInfo, err error) {
	return c.client.StatObject(ctx, bucketName, prefix, opts)
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

func (c minioClient) copyObject(ctx context.Context, dst minio.CopyDestOptions, src minio.CopySrcOptions) (minio.UploadInfo, error) {
	return c.client.CopyObject(ctx, dst, src)
}

// MCClient interface with all functions to be implemented
// by mock when testing, it should include all mc/S3Client respective api calls
// that are used within this project.
type MCClient interface {
	addNotificationConfig(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error
	removeNotificationConfig(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error
	watch(ctx context.Context, options mc.WatchOptions) (*mc.WatchObject, *probe.Error)
	remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass, forceDelete bool, contentCh <-chan *mc.ClientContent) <-chan mc.RemoveResult
	list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
	get(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error)
	shareDownload(ctx context.Context, versionID string, expires time.Duration) (string, *probe.Error)
	setVersioning(ctx context.Context, status string, excludePrefix []string, excludeFolders bool) *probe.Error
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

func (c mcClient) deleteAllReplicationRules(ctx context.Context) *probe.Error {
	return c.client.RemoveReplication(ctx)
}

func (c mcClient) setVersioning(ctx context.Context, status string, excludePrefix []string, excludeFolders bool) *probe.Error {
	return c.client.SetVersion(ctx, status, excludePrefix, excludeFolders)
}

func (c mcClient) remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass, forceDelete bool, contentCh <-chan *mc.ClientContent) <-chan mc.RemoveResult {
	return c.client.Remove(ctx, isIncomplete, isRemoveBucket, isBypass, forceDelete, contentCh)
}

func (c mcClient) list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
	return c.client.List(ctx, opts)
}

func (c mcClient) get(ctx context.Context, opts mc.GetOptions) (io.ReadCloser, *probe.Error) {
	rd, _, err := c.client.Get(ctx, opts)
	return rd, err
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
}

// Interface implementation
type ConsoleCredentials struct {
	ConsoleCredentials *credentials.Credentials
	AccountAccessKey   string
	CredContext        *credentials.CredContext
}

func (c ConsoleCredentials) GetAccountAccessKey() string {
	return c.AccountAccessKey
}

// Get implements *Login.Get()
func (c ConsoleCredentials) Get() (credentials.Value, error) {
	return c.ConsoleCredentials.GetWithContext(c.CredContext)
}

// Expire implements *Login.Expire()
func (c ConsoleCredentials) Expire() {
	c.ConsoleCredentials.Expire()
}

// consoleSTSAssumeRole it's a STSAssumeRole wrapper, in general
// there's no need to use this struct anywhere else in the project, it's only required
// for passing a custom *http.Client to *credentials.STSAssumeRole
type consoleSTSAssumeRole struct {
	stsAssumeRole *credentials.STSAssumeRole
}

func (s consoleSTSAssumeRole) RetrieveWithCredContext(cc *credentials.CredContext) (credentials.Value, error) {
	return s.stsAssumeRole.RetrieveWithCredContext(cc)
}

func (s consoleSTSAssumeRole) Retrieve() (credentials.Value, error) {
	return s.stsAssumeRole.Retrieve()
}

func (s consoleSTSAssumeRole) IsExpired() bool {
	return s.stsAssumeRole.IsExpired()
}

func stsCredentials(minioURL, accessKey, secretKey, location string, client *http.Client) (*credentials.Credentials, error) {
	if accessKey == "" || secretKey == "" {
		return nil, errors.New("credentials endpoint, access and secret key are mandatory for AssumeRoleSTS")
	}
	opts := credentials.STSAssumeRoleOptions{
		AccessKey:       accessKey,
		SecretKey:       secretKey,
		Location:        location,
		DurationSeconds: int(xjwt.GetConsoleSTSDuration().Seconds()),
	}
	stsAssumeRole := &credentials.STSAssumeRole{
		Client:      client,
		STSEndpoint: minioURL,
		Options:     opts,
	}
	consoleSTSWrapper := consoleSTSAssumeRole{stsAssumeRole: stsAssumeRole}
	return credentials.New(consoleSTSWrapper), nil
}

func NewConsoleCredentials(accessKey, secretKey, location string, client *http.Client) (*credentials.Credentials, error) {
	minioURL := getMinIOServer()

	// LDAP authentication for Console
	if ldap.GetLDAPEnabled() {
		creds, err := auth.GetCredentialsFromLDAP(client, minioURL, accessKey, secretKey)
		if err != nil {
			return nil, err
		}

		credContext := &credentials.CredContext{
			Client: client,
		}

		// We verify if LDAP credentials are correct and no error is returned
		_, err = creds.GetWithContext(credContext)

		if err != nil && strings.Contains(strings.ToLower(err.Error()), "not found") {
			// We try to use STS Credentials in case LDAP credentials are incorrect.
			stsCreds, errSTS := stsCredentials(minioURL, accessKey, secretKey, location, client)

			// If there is an error with STS too, then we return the original LDAP error
			if errSTS != nil {
				LogError("error in STS credentials for LDAP case: %v ", errSTS)

				// We return LDAP result
				return creds, nil
			}

			_, err := stsCreds.GetWithContext(credContext)
			// There is an error with STS credentials, We return the result of LDAP as STS is not a priority in this case.
			if err != nil {
				return creds, nil
			}

			return stsCreds, nil
		}

		return creds, nil
	}

	return stsCredentials(minioURL, accessKey, secretKey, location, client)
}

// getConsoleCredentialsFromSession returns the *consoleCredentials.Login associated to the
// provided session token, this is useful for running the Expire() or IsExpired() operations
func getConsoleCredentialsFromSession(claims *models.Principal) *credentials.Credentials {
	if claims == nil {
		return credentials.NewStaticV4("", "", "")
	}
	return credentials.NewStaticV4(claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken)
}

// newMinioClient creates a new MinIO client based on the ConsoleCredentials extracted
// from the provided session token
func newMinioClient(claims *models.Principal, clientIP string) (*minio.Client, error) {
	creds := getConsoleCredentialsFromSession(claims)
	endpoint := getMinIOEndpoint()
	secure := getMinIOEndpointIsSecure()
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:     creds,
		Secure:    secure,
		Transport: GetConsoleHTTPClient(clientIP).Transport,
	})
	if err != nil {
		return nil, err
	}
	// set user-agent to differentiate Console UI requests for auditing.
	minioClient.SetAppInfo("MinIO Console", pkg.Version)
	return minioClient, nil
}

// computeObjectURLWithoutEncode returns a MinIO url containing the object filename without encoding
func computeObjectURLWithoutEncode(bucketName, prefix string) (string, error) {
	u, err := xnet.ParseHTTPURL(getMinIOServer())
	if err != nil {
		return "", fmt.Errorf("the provided endpoint: '%s' is invalid", getMinIOServer())
	}
	var p string
	if strings.TrimSpace(bucketName) != "" {
		p = path.Join(p, bucketName)
	}
	if strings.TrimSpace(prefix) != "" {
		p = pathJoinFinalSlash(p, prefix)
	}
	return u.String() + "/" + p, nil
}

// newS3BucketClient creates a new mc S3Client to talk to the server based on a bucket
func newS3BucketClient(claims *models.Principal, bucketName string, prefix string, clientIP string) (*mc.S3Client, error) {
	if claims == nil {
		return nil, fmt.Errorf("the provided credentials are invalid")
	}
	// It's very important to avoid encoding the prefix since the minio client will encode the path itself
	objectURL, err := computeObjectURLWithoutEncode(bucketName, prefix)
	if err != nil {
		return nil, fmt.Errorf("the provided endpoint is invalid")
	}
	s3Config := newS3Config(objectURL, claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken, clientIP)
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

// pathJoinFinalSlash - like path.Join() but retains trailing slashSeparator of the last element
func pathJoinFinalSlash(elem ...string) string {
	if len(elem) > 0 {
		if strings.HasSuffix(elem[len(elem)-1], SlashSeparator) {
			return path.Join(elem...) + SlashSeparator
		}
	}
	return path.Join(elem...)
}

// Deprecated
// newS3Config simply creates a new Config struct using the passed
// parameters.
func newS3Config(endpoint, accessKey, secretKey, sessionToken string, clientIP string) *mc.Config {
	// We have a valid alias and hostConfig. We populate the/
	// consoleCredentials from the match found in the config file.
	return &mc.Config{
		HostURL:      endpoint,
		AccessKey:    accessKey,
		SecretKey:    secretKey,
		SessionToken: sessionToken,
		Signature:    "S3v4",
		AppName:      globalAppName,
		AppVersion:   pkg.Version,
		Insecure:     isLocalIPEndpoint(endpoint),
		Transport: &ConsoleTransport{
			ClientIP:  clientIP,
			Transport: GlobalTransport,
		},
	}
}

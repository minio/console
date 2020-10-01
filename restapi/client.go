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
	"fmt"
	"strings"

	"github.com/minio/minio-go/v7/pkg/replication"

	"errors"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg/acl"
	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/auth/ldap"
	xjwt "github.com/minio/console/pkg/auth/token"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio-go/v7/pkg/notification"
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
	makeBucketWithContext(ctx context.Context, bucketName, location string) error
	setBucketPolicyWithContext(ctx context.Context, bucketName, policy string) error
	removeBucket(ctx context.Context, bucketName string) error
	getBucketNotification(ctx context.Context, bucketName string) (config notification.Configuration, err error)
	getBucketPolicy(ctx context.Context, bucketName string) (string, error)
	listObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type minioClient struct {
	client *minio.Client
}

// implements minio.ListBucketsWithContext(ctx)
func (c minioClient) listBucketsWithContext(ctx context.Context) ([]minio.BucketInfo, error) {
	return c.client.ListBuckets(ctx)
}

// implements minio.MakeBucketWithContext(ctx, bucketName, location)
func (c minioClient) makeBucketWithContext(ctx context.Context, bucketName, location string) error {
	return c.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{
		Region: location,
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

// implements minio.enableVersioning(ctx, bucketName)
func (c minioClient) enableVersioning(ctx context.Context, bucketName string) error {
	return c.client.EnableVersioning(ctx, bucketName)
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

// MCClient interface with all functions to be implemented
// by mock when testing, it should include all mc/S3Client respective api calls
// that are used within this project.
type MCClient interface {
	addNotificationConfig(ctx context.Context, arn string, events []string, prefix, suffix string, ignoreExisting bool) *probe.Error
	removeNotificationConfig(ctx context.Context, arn string, event string, prefix string, suffix string) *probe.Error
	watch(ctx context.Context, options mc.WatchOptions) (*mc.WatchObject, *probe.Error)
	remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error
	list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent
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

func (c mcClient) remove(ctx context.Context, isIncomplete, isRemoveBucket, isBypass bool, contentCh <-chan *mc.ClientContent) <-chan *probe.Error {
	return c.client.Remove(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
}

func (c mcClient) list(ctx context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
	return c.client.List(ctx, opts)
}

// ConsoleCredentials interface with all functions to be implemented
// by mock when testing, it should include all needed consoleCredentials.Login api calls
// that are used within this project.
type ConsoleCredentials interface {
	Get() (credentials.Value, error)
	Expire()
}

// Interface implementation
type consoleCredentials struct {
	consoleCredentials *credentials.Credentials
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

// STSClient contains http.client configuration need it by STSAssumeRole
var (
	MinioEndpoint = getMinIOServer()
)

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
			if MinioEndpoint == "" {
				return nil, errors.New("endpoint cannot be empty for AssumeRoleSTS")
			}
			creds, err := auth.GetConsoleCredentialsFromLDAP(MinioEndpoint, accessKey, secretKey)
			if err != nil {
				return nil, err
			}
			return creds, nil
		}
	// default authentication for Console is via STS (Security Token Service) against MinIO
	default:
		{
			if MinioEndpoint == "" || accessKey == "" || secretKey == "" {
				return nil, errors.New("creredentials endpont, access and secretkey are mandatory for AssumeRoleSTS")
			}
			opts := credentials.STSAssumeRoleOptions{
				AccessKey:       accessKey,
				SecretKey:       secretKey,
				Location:        location,
				DurationSeconds: xjwt.GetConsoleSTSAndJWTDurationInSeconds(),
			}
			stsClient := PrepareSTSClient(false)
			stsAssumeRole := &credentials.STSAssumeRole{
				Client:      stsClient,
				STSEndpoint: MinioEndpoint,
				Options:     opts,
			}
			consoleSTSWrapper := consoleSTSAssumeRole{stsAssumeRole: stsAssumeRole}
			return credentials.New(consoleSTSWrapper), nil
		}
	}
}

// GetClaimsFromJWT decrypt and returns the claims associated to a provided jwt
func GetClaimsFromJWT(jwt string) (*auth.DecryptedClaims, error) {
	claims, err := auth.SessionTokenAuthenticate(jwt)
	if err != nil {
		return nil, err
	}
	return claims, nil
}

// getConsoleCredentialsFromSession returns the *consoleCredentials.Login associated to the
// provided jwt, this is useful for running the Expire() or IsExpired() operations
func getConsoleCredentialsFromSession(claims *models.Principal) *credentials.Credentials {
	return credentials.NewStaticV4(claims.AccessKeyID, claims.SecretAccessKey, claims.SessionToken)
}

// newMinioClient creates a new MinIO client based on the consoleCredentials extracted
// from the provided jwt
func newMinioClient(claims *models.Principal) (*minio.Client, error) {
	creds := getConsoleCredentialsFromSession(claims)
	stsClient := PrepareSTSClient(false)
	minioClient, err := minio.New(getMinIOEndpoint(), &minio.Options{
		Creds:     creds,
		Secure:    getMinIOEndpointIsSecure(),
		Transport: stsClient.Transport,
	})
	if err != nil {
		return nil, err
	}
	return minioClient, nil
}

// newS3BucketClient creates a new mc S3Client to talk to the server based on a bucket
func newS3BucketClient(claims *models.Principal, bucketName string, prefix string) (*mc.S3Client, error) {
	endpoint := getMinIOServer()
	useTLS := getMinIOEndpointIsSecure()

	if strings.TrimSpace(bucketName) != "" {
		endpoint += fmt.Sprintf("/%s", bucketName)
	}

	if strings.TrimSpace(prefix) != "" {
		endpoint += fmt.Sprintf("/%s", prefix)
	}

	if claims == nil {
		return nil, fmt.Errorf("the provided credentials are invalid")
	}

	s3Config := newS3Config(endpoint, claims.AccessKeyID, claims.SecretAccessKey, claims.SessionToken, !useTLS)
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
func newS3Config(endpoint, accessKey, secretKey, sessionToken string, isSecure bool) *mc.Config {
	// We have a valid alias and hostConfig. We populate the
	// consoleCredentials from the match found in the config file.
	s3Config := new(mc.Config)

	s3Config.AppName = "console" // TODO: make this a constant
	s3Config.AppVersion = ""     // TODO: get this from constant or build
	s3Config.AppComments = []string{}
	s3Config.Debug = false
	s3Config.Insecure = isSecure

	s3Config.HostURL = endpoint
	s3Config.AccessKey = accessKey
	s3Config.SecretKey = secretKey
	s3Config.SessionToken = sessionToken
	s3Config.Signature = "S3v4"
	return s3Config
}

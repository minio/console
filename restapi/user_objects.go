// This file is part of MinIO Console Server
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
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/minio-go/v7"
)

// enum types
const (
	objectStorage = iota // MinIO and S3 compatible cloud storage
	fileSystem           // POSIX compatible file systems
)

func registerObjectsHandlers(api *operations.ConsoleAPI) {
	// list objects
	api.UserAPIListObjectsHandler = user_api.ListObjectsHandlerFunc(func(params user_api.ListObjectsParams, session *models.Principal) middleware.Responder {
		resp, err := getListObjectsResponse(session, params)
		if err != nil {
			return user_api.NewListObjectsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewListObjectsOK().WithPayload(resp)
	})
	// delete object
	api.UserAPIDeleteObjectHandler = user_api.DeleteObjectHandlerFunc(func(params user_api.DeleteObjectParams, session *models.Principal) middleware.Responder {
		if err := getDeleteObjectResponse(session, params); err != nil {
			return user_api.NewDeleteObjectDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewDeleteObjectOK()
	})
}

// getListObjectsResponse returns a list of objects
func getListObjectsResponse(session *models.Principal, params user_api.ListObjectsParams) (*models.ListObjectsResponse, *models.Error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	var prefix string
	var recursive bool
	if params.Prefix != nil {
		prefix = *params.Prefix
	}
	if params.Recursive != nil {
		recursive = *params.Recursive
	}
	// bucket request needed to proceed
	if params.BucketName == "" {
		return nil, prepareError(errBucketNameNotInRequest)
	}
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	objs, err := listBucketObjects(ctx, minioClient, params.BucketName, prefix, recursive)
	if err != nil {
		return nil, prepareError(err)
	}

	resp := &models.ListObjectsResponse{
		Objects: objs,
		Total:   int64(len(objs)),
	}
	return resp, nil
}

// listBucketObjects gets an array of objects in a bucket
func listBucketObjects(ctx context.Context, client MinioClient, bucketName string, prefix string, recursive bool) ([]*models.BucketObject, error) {
	var objects []*models.BucketObject
	for lsObj := range client.listObjects(ctx, bucketName, minio.ListObjectsOptions{Prefix: prefix, Recursive: recursive}) {
		if lsObj.Err != nil {
			return nil, lsObj.Err
		}
		obj := &models.BucketObject{
			Name:         lsObj.Key,
			Size:         lsObj.Size,
			LastModified: lsObj.LastModified.String(),
			ContentType:  lsObj.ContentType,
		}
		objects = append(objects, obj)
	}
	return objects, nil
}

// getDeleteObjectResponse returns whether there was an error on deletion of object
func getDeleteObjectResponse(session *models.Principal, params user_api.DeleteObjectParams) *models.Error {
	ctx := context.Background()
	s3Client, err := newS3BucketClient(session, params.BucketName, params.Path)
	if err != nil {
		return prepareError(err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	var rec bool
	var version string
	if params.Recursive != nil {
		rec = *params.Recursive
	}
	if params.VersionID != nil {
		version = *params.VersionID
	}
	err = deleteObjects(ctx, mcClient, params.BucketName, params.Path, version, rec)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

// deleteObjects deletes either a single object or multiple objects based on recursive flag
func deleteObjects(ctx context.Context, client MCClient, bucket, path string, versionID string, recursive bool) error {
	if recursive {
		if err := deleteMultipleObjects(ctx, client, recursive); err != nil {
			return err
		}
	} else {
		if err := deleteSingleObject(ctx, client, bucket, path, versionID); err != nil {
			return err
		}
	}
	return nil
}

// deleteMultipleObjects uses listing before removal, it can list recursively or not,
//   Use cases:
//      * Remove objects recursively
func deleteMultipleObjects(ctx context.Context, client MCClient, recursive bool) error {
	isRemoveBucket := false
	isIncomplete := false
	isBypass := false
	listOpts := mc.ListOptions{IsRecursive: recursive, IsIncomplete: isIncomplete, ShowDir: mc.DirNone}
	// TODO: support older Versions
	contentCh := make(chan *mc.ClientContent, 1)

	errorCh := client.remove(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
	for content := range client.list(ctx, listOpts) {
		if content.Err != nil {
			switch content.Err.ToGoError().(type) {
			// ignore same as mc
			case mc.PathInsufficientPermission:
				// Ignore Permission error.
				continue
			}
			close(contentCh)
			return content.Err.Cause
		}
		sent := false
		for !sent {
			select {
			case contentCh <- content:
				sent = true
			case pErr := <-errorCh:
				switch pErr.ToGoError().(type) {
				// ignore same as mc
				case mc.PathInsufficientPermission:
					// Ignore Permission error.
					continue
				}
				close(contentCh)
				return pErr.Cause
			}
		}
	}
	close(contentCh)
	for pErr := range errorCh {
		if pErr != nil {
			switch pErr.ToGoError().(type) {
			// ignore same as mc
			case mc.PathInsufficientPermission:
				// Ignore Permission error.
				continue
			}
			return pErr.Cause
		}
	}
	return nil

}

func deleteSingleObject(ctx context.Context, client MCClient, bucket, object string, versionID string) error {
	targetURL := fmt.Sprintf("%s/%s", bucket, object)
	contentCh := make(chan *mc.ClientContent, 1)
	contentCh <- &mc.ClientContent{URL: *newClientURL(targetURL), VersionID: versionID}
	close(contentCh)

	isRemoveBucket := false
	isIncomplete := false
	isBypass := false

	errorCh := client.remove(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
	for pErr := range errorCh {
		if pErr != nil {
			switch pErr.ToGoError().(type) {
			// ignore same as mc
			case mc.PathInsufficientPermission:
				// Ignore Permission error.
				continue
			}
			return pErr.Cause
		}
	}
	return nil
}

// newClientURL returns an abstracted URL for filesystems and object storage.
func newClientURL(urlStr string) *mc.ClientURL {
	scheme, rest := getScheme(urlStr)
	if strings.HasPrefix(rest, "//") {
		// if rest has '//' prefix, skip them
		var authority string
		authority, rest = splitSpecial(rest[2:], "/", false)
		if rest == "" {
			rest = "/"
		}
		host := getHost(authority)
		if host != "" && (scheme == "http" || scheme == "https") {
			return &mc.ClientURL{
				Scheme:          scheme,
				Type:            objectStorage,
				Host:            host,
				Path:            rest,
				SchemeSeparator: "://",
				Separator:       '/',
			}
		}
	}
	return &mc.ClientURL{
		Type:      fileSystem,
		Path:      rest,
		Separator: filepath.Separator,
	}
}

// Maybe rawurl is of the form scheme:path. (Scheme must be [a-zA-Z][a-zA-Z0-9+-.]*)
// If so, return scheme, path; else return "", rawurl.
func getScheme(rawurl string) (scheme, path string) {
	urlSplits := strings.Split(rawurl, "://")
	if len(urlSplits) == 2 {
		scheme, uri := urlSplits[0], "//"+urlSplits[1]
		// ignore numbers in scheme
		validScheme := regexp.MustCompile("^[a-zA-Z]+$")
		if uri != "" {
			if validScheme.MatchString(scheme) {
				return scheme, uri
			}
		}
	}
	return "", rawurl
}

// Assuming s is of the form [s delimiter s].
// If so, return s, [delimiter]s or return s, s if cutdelimiter == true
// If no delimiter found return s, "".
func splitSpecial(s string, delimiter string, cutdelimiter bool) (string, string) {
	i := strings.Index(s, delimiter)
	if i < 0 {
		// if delimiter not found return as is.
		return s, ""
	}
	// if delimiter should be removed, remove it.
	if cutdelimiter {
		return s[0:i], s[i+len(delimiter):]
	}
	// return split strings with delimiter
	return s[0:i], s[i:]
}

// getHost - extract host from authority string, we do not support ftp style username@ yet.
func getHost(authority string) (host string) {
	i := strings.LastIndex(authority, "@")
	if i >= 0 {
		// TODO support, username@password style userinfo, useful for ftp support.
		return
	}
	return authority
}

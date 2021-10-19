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

package restapi

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"log"
	"net/http"
	"path"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"errors"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/user_api"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/tags"
	"github.com/minio/pkg/mimedb"
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
	// delete multiple objects
	api.UserAPIDeleteMultipleObjectsHandler = user_api.DeleteMultipleObjectsHandlerFunc(func(params user_api.DeleteMultipleObjectsParams, session *models.Principal) middleware.Responder {
		if err := getDeleteMultiplePathsResponse(session, params); err != nil {
			return user_api.NewDeleteMultipleObjectsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewDeleteMultipleObjectsOK()
	})
	// download object
	api.UserAPIDownloadObjectHandler = user_api.DownloadObjectHandlerFunc(func(params user_api.DownloadObjectParams, session *models.Principal) middleware.Responder {
		isPreview := *params.Preview
		resp, err := getDownloadObjectResponse(session, params)
		if err != nil {
			return user_api.NewDownloadObjectDefault(int(err.Code)).WithPayload(err)
		}
		return middleware.ResponderFunc(func(rw http.ResponseWriter, _ runtime.Producer) {
			defer resp.Close()

			// indicate it's a download / inline content to the browser, and the size of the object
			var prefixPath string
			var filename string
			if params.Prefix != "" {
				encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
				decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
				if err != nil {
					log.Println(err)
				}

				prefixPath = string(decodedPrefix)
			}
			prefixElements := strings.Split(prefixPath, "/")
			if len(prefixElements) > 0 {
				filename = prefixElements[len(prefixElements)-1]
			}
			if isPreview {
				rw.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", filename))
				rw.Header().Set("X-Frame-Options", "SAMEORIGIN")
				rw.Header().Set("X-XSS-Protection", "1")

			} else {
				rw.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
				rw.Header().Set("Content-Type", "application/octet-stream")
			}

			// indicate object size & content type
			stat, err := resp.(*minio.Object).Stat()
			if err != nil {
				log.Println(err)
			} else {
				rw.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size))

				contentType := stat.ContentType

				if isPreview {
					// In case content type was uploaded as octet-stream, we double verify content type
					if stat.ContentType == "application/octet-stream" {
						contentType = mimedb.TypeByExtension(filepath.Ext(filename))
					}
				}

				rw.Header().Set("Content-Type", contentType)
			}

			// Copy the stream
			_, err = io.Copy(rw, resp)
			if err != nil {
				log.Println(err)
			}
		})
	})
	// upload object
	api.UserAPIPostBucketsBucketNameObjectsUploadHandler = user_api.PostBucketsBucketNameObjectsUploadHandlerFunc(func(params user_api.PostBucketsBucketNameObjectsUploadParams, session *models.Principal) middleware.Responder {
		if err := getUploadObjectResponse(session, params); err != nil {
			return user_api.NewPostBucketsBucketNameObjectsUploadDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewPostBucketsBucketNameObjectsUploadOK()
	})
	// get share object url
	api.UserAPIShareObjectHandler = user_api.ShareObjectHandlerFunc(func(params user_api.ShareObjectParams, session *models.Principal) middleware.Responder {
		resp, err := getShareObjectResponse(session, params)
		if err != nil {
			return user_api.NewShareObjectDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewShareObjectOK().WithPayload(*resp)
	})
	// set object legalhold status
	api.UserAPIPutObjectLegalHoldHandler = user_api.PutObjectLegalHoldHandlerFunc(func(params user_api.PutObjectLegalHoldParams, session *models.Principal) middleware.Responder {
		if err := getSetObjectLegalHoldResponse(session, params); err != nil {
			return user_api.NewPutObjectLegalHoldDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewPutObjectLegalHoldOK()
	})
	// set object retention
	api.UserAPIPutObjectRetentionHandler = user_api.PutObjectRetentionHandlerFunc(func(params user_api.PutObjectRetentionParams, session *models.Principal) middleware.Responder {
		if err := getSetObjectRetentionResponse(session, params); err != nil {
			return user_api.NewPutObjectRetentionDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewPutObjectRetentionOK()
	})
	// delete object retention
	api.UserAPIDeleteObjectRetentionHandler = user_api.DeleteObjectRetentionHandlerFunc(func(params user_api.DeleteObjectRetentionParams, session *models.Principal) middleware.Responder {
		if err := deleteObjectRetentionResponse(session, params); err != nil {
			return user_api.NewDeleteObjectRetentionDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewDeleteObjectRetentionOK()
	})
	// set tags in object
	api.UserAPIPutObjectTagsHandler = user_api.PutObjectTagsHandlerFunc(func(params user_api.PutObjectTagsParams, session *models.Principal) middleware.Responder {
		if err := getPutObjectTagsResponse(session, params); err != nil {
			return user_api.NewPutObjectTagsDefault(int(err.Code)).WithPayload(err)
		}
		return user_api.NewPutObjectTagsOK()
	})
}

// getListObjectsResponse returns a list of objects
func getListObjectsResponse(session *models.Principal, params user_api.ListObjectsParams) (*models.ListObjectsResponse, *models.Error) {
	var prefix string
	var recursive bool
	var withVersions bool
	var withMetadata bool
	if params.Prefix != nil {
		encodedPrefix := SanitizeEncodedPrefix(*params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return nil, prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	if params.Recursive != nil {
		recursive = *params.Recursive
	}
	if isErasureBackend() && params.WithVersions != nil {
		withVersions = *params.WithVersions
	}
	if params.WithMetadata != nil {
		withMetadata = *params.WithMetadata
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

	objs, err := listBucketObjects(params.HTTPRequest.Context(), minioClient, params.BucketName, prefix, recursive, withVersions, withMetadata)
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
func listBucketObjects(ctx context.Context, client MinioClient, bucketName string, prefix string, recursive, withVersions bool, withMetadata bool) ([]*models.BucketObject, error) {
	var objects []*models.BucketObject
	for lsObj := range client.listObjects(ctx, bucketName, minio.ListObjectsOptions{Prefix: prefix, Recursive: recursive, WithVersions: withVersions, WithMetadata: withMetadata}) {
		if lsObj.Err != nil {
			return nil, lsObj.Err
		}

		obj := &models.BucketObject{
			Name:           lsObj.Key,
			Size:           lsObj.Size,
			LastModified:   lsObj.LastModified.Format(time.RFC3339),
			ContentType:    lsObj.ContentType,
			VersionID:      lsObj.VersionID,
			IsLatest:       lsObj.IsLatest,
			IsDeleteMarker: lsObj.IsDeleteMarker,
			UserTags:       lsObj.UserTags,
			UserMetadata:   lsObj.UserMetadata,
		}
		// only if single object with or without versions; get legalhold, retention and tags
		if !lsObj.IsDeleteMarker && prefix != "" && !strings.HasSuffix(prefix, "/") {
			// Add Legal Hold Status if available
			legalHoldStatus, err := client.getObjectLegalHold(ctx, bucketName, lsObj.Key, minio.GetObjectLegalHoldOptions{VersionID: lsObj.VersionID})
			if err != nil {
				errResp := minio.ToErrorResponse(probe.NewError(err).ToGoError())
				if errResp.Code != "InvalidRequest" && errResp.Code != "NoSuchObjectLockConfiguration" {
					LogError("error getting legal hold status for %s : %v", lsObj.VersionID, err)
				}
			} else {
				if legalHoldStatus != nil {
					obj.LegalHoldStatus = string(*legalHoldStatus)
				}
			}
			// Add Retention Status if available
			retention, retUntilDate, err := client.getObjectRetention(ctx, bucketName, lsObj.Key, lsObj.VersionID)
			if err != nil {
				errResp := minio.ToErrorResponse(probe.NewError(err).ToGoError())
				if errResp.Code != "InvalidRequest" && errResp.Code != "NoSuchObjectLockConfiguration" {
					LogError("error getting retention status for %s : %v", lsObj.VersionID, err)
				}
			} else {
				if retention != nil && retUntilDate != nil {
					date := *retUntilDate
					obj.RetentionMode = string(*retention)
					obj.RetentionUntilDate = date.Format(time.RFC3339)
				}
			}
			tags, err := client.getObjectTagging(ctx, bucketName, lsObj.Key, minio.GetObjectTaggingOptions{VersionID: lsObj.VersionID})
			if err != nil {
				LogError("error getting object tags for %s : %v", lsObj.VersionID, err)
			} else {
				obj.Tags = tags.ToMap()
			}
		}
		objects = append(objects, obj)
	}
	return objects, nil
}

func getDownloadObjectResponse(session *models.Principal, params user_api.DownloadObjectParams) (io.ReadCloser, *models.Error) {
	ctx := context.Background()
	var prefix string
	if params.Prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return nil, prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	s3Client, err := newS3BucketClient(session, params.BucketName, prefix)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	object, err := downloadObject(ctx, mcClient, params.VersionID)
	if err != nil {
		return nil, prepareError(err)
	}
	return object, nil
}

func downloadObject(ctx context.Context, client MCClient, versionID *string) (io.ReadCloser, error) {
	// TODO: handle encrypted files
	var reader io.ReadCloser
	var version string
	if versionID != nil {
		version = *versionID
	}
	reader, pErr := client.get(ctx, mc.GetOptions{VersionID: version})
	if pErr != nil {
		return nil, pErr.Cause
	}
	return reader, nil
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

// getDeleteMultiplePathsResponse returns whether there was an error on deletion of any object
func getDeleteMultiplePathsResponse(session *models.Principal, params user_api.DeleteMultipleObjectsParams) *models.Error {
	ctx := context.Background()
	var version string
	for i := 0; i < len(params.Files); i++ {
		if params.Files[i].VersionID != "" {
			version = params.Files[i].VersionID
		}
		prefix := params.Files[i].Path
		s3Client, err := newS3BucketClient(session, params.BucketName, prefix)
		if err != nil {
			return prepareError(err)
		}
		// create a mc S3Client interface implementation
		// defining the client to be used
		mcClient := mcClient{client: s3Client}
		err = deleteObjects(ctx, mcClient, params.BucketName, params.Files[i].Path, version, params.Files[i].Recursive)
		if err != nil {
			return prepareError(err)
		}
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
	listOpts := mc.ListOptions{Recursive: recursive, Incomplete: isIncomplete, ShowDir: mc.DirNone}
	// TODO: support older Versions
	contentCh := make(chan *mc.ClientContent, 1)

	errorCh := client.remove(ctx, isIncomplete, isRemoveBucket, isBypass, contentCh)
OUTER_LOOP:
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
				if pErr != nil {
					switch pErr.ToGoError().(type) {
					// ignore same as mc
					case mc.PathInsufficientPermission:
						// Ignore Permission error.
						continue
					}
					close(contentCh)
					return pErr.Cause
				}
				break OUTER_LOOP
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

func getUploadObjectResponse(session *models.Principal, params user_api.PostBucketsBucketNameObjectsUploadParams) *models.Error {
	ctx := context.Background()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := uploadFiles(ctx, minioClient, params); err != nil {
		return prepareError(err, ErrorGeneric)
	}
	return nil
}

// uploadFiles gets files from http.Request form and uploads them to MinIO
func uploadFiles(ctx context.Context, client MinioClient, params user_api.PostBucketsBucketNameObjectsUploadParams) error {
	var prefix string
	if params.Prefix != nil {
		encodedPrefix := SanitizeEncodedPrefix(*params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return err
		}
		prefix = string(decodedPrefix)
	}

	// parse a request body as multipart/form-data.
	// 32 << 20 is default max memory
	mr, err := params.HTTPRequest.MultipartReader()
	if err != nil {
		return err
	}

	for {
		p, err := mr.NextPart()
		if err == io.EOF {
			break
		}

		size, err := strconv.ParseInt(p.FormName(), 10, 64)
		if err != nil {
			return err
		}

		contentType := p.Header.Get("content-type")
		if contentType == "" {
			contentType = mimedb.TypeByExtension(filepath.Ext(p.FileName()))
		}

		_, err = client.putObject(ctx, params.BucketName, path.Join(prefix, p.FileName()), p, size, minio.PutObjectOptions{
			ContentType:      contentType,
			DisableMultipart: true, // Do not upload as multipart stream for console uploader.
		})

		if err != nil {
			return err
		}
	}

	return nil
}

// getShareObjectResponse returns a share object url
func getShareObjectResponse(session *models.Principal, params user_api.ShareObjectParams) (*string, *models.Error) {
	ctx := context.Background()
	var prefix string
	if params.Prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return nil, prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	s3Client, err := newS3BucketClient(session, params.BucketName, prefix)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	var expireDuration string
	if params.Expires != nil {
		expireDuration = *params.Expires
	}
	url, err := getShareObjectURL(ctx, mcClient, params.VersionID, expireDuration)
	if err != nil {
		return nil, prepareError(err)
	}
	return url, nil
}

func getShareObjectURL(ctx context.Context, client MCClient, versionID string, duration string) (url *string, err error) {
	// default duration 7d if not defined
	if strings.TrimSpace(duration) == "" {
		duration = "168h"
	}

	expiresDuration, err := time.ParseDuration(duration)
	if err != nil {
		return nil, err
	}
	objURL, pErr := client.shareDownload(ctx, versionID, expiresDuration)
	if pErr != nil {
		return nil, pErr.Cause
	}
	return &objURL, nil
}

func getSetObjectLegalHoldResponse(session *models.Principal, params user_api.PutObjectLegalHoldParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	var prefix string
	if params.Prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	err = setObjectLegalHold(ctx, minioClient, params.BucketName, prefix, params.VersionID, *params.Body.Status)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

func setObjectLegalHold(ctx context.Context, client MinioClient, bucketName, prefix, versionID string, status models.ObjectLegalHoldStatus) error {
	var lstatus minio.LegalHoldStatus
	if status == models.ObjectLegalHoldStatusEnabled {
		lstatus = minio.LegalHoldEnabled
	} else {
		lstatus = minio.LegalHoldDisabled
	}
	return client.putObjectLegalHold(ctx, bucketName, prefix, minio.PutObjectLegalHoldOptions{VersionID: versionID, Status: &lstatus})
}

func getSetObjectRetentionResponse(session *models.Principal, params user_api.PutObjectRetentionParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	var prefix string
	if params.Prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	err = setObjectRetention(ctx, minioClient, params.BucketName, params.VersionID, prefix, params.Body)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

func setObjectRetention(ctx context.Context, client MinioClient, bucketName, versionID, prefix string, retentionOps *models.PutObjectRetentionRequest) error {
	if retentionOps == nil {
		return errors.New("object retention options can't be nil")
	}
	if retentionOps.Expires == nil {
		return errors.New("object retention expires can't be nil")
	}

	var mode minio.RetentionMode
	if *retentionOps.Mode == models.ObjectRetentionModeGovernance {
		mode = minio.Governance
	} else {
		mode = minio.Compliance
	}
	retentionUntilDate, err := time.Parse(time.RFC3339, *retentionOps.Expires)
	if err != nil {
		return err
	}
	opts := minio.PutObjectRetentionOptions{
		GovernanceBypass: retentionOps.GovernanceBypass,
		RetainUntilDate:  &retentionUntilDate,
		Mode:             &mode,
		VersionID:        versionID,
	}
	return client.putObjectRetention(ctx, bucketName, prefix, opts)
}

func deleteObjectRetentionResponse(session *models.Principal, params user_api.DeleteObjectRetentionParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	var prefix string
	if params.Prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	err = deleteObjectRetention(ctx, minioClient, params.BucketName, prefix, params.VersionID)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

func deleteObjectRetention(ctx context.Context, client MinioClient, bucketName, prefix, versionID string) error {
	opts := minio.PutObjectRetentionOptions{
		GovernanceBypass: true,
		VersionID:        versionID,
	}

	return client.putObjectRetention(ctx, bucketName, prefix, opts)
}

func getPutObjectTagsResponse(session *models.Principal, params user_api.PutObjectTagsParams) *models.Error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	var prefix string
	if params.Prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(params.Prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			return prepareError(err)
		}
		prefix = string(decodedPrefix)
	}
	err = putObjectTags(ctx, minioClient, params.BucketName, prefix, params.VersionID, params.Body.Tags)
	if err != nil {
		return prepareError(err)
	}
	return nil
}

func putObjectTags(ctx context.Context, client MinioClient, bucketName, prefix, versionID string, tagMap map[string]string) error {
	opt := minio.PutObjectTaggingOptions{
		VersionID: versionID,
	}
	otags, err := tags.MapToObjectTags(tagMap)
	if err != nil {
		return err
	}
	return client.putObjectTagging(ctx, bucketName, prefix, otags, opt)
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

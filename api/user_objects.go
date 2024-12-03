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
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"

	"github.com/minio/console/pkg/utils"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/klauspost/compress/zip"
	"github.com/minio/console/api/operations"
	objectApi "github.com/minio/console/api/operations/object"
	"github.com/minio/console/models"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7/pkg/tags"
	"github.com/minio/pkg/v3/mimedb"
)

// enum types
const (
	objectStorage = iota // MinIO and S3 compatible cloud storage
	fileSystem           // POSIX compatible file systems
)

func registerObjectsHandlers(api *operations.ConsoleAPI) {
	// list objects
	api.ObjectListObjectsHandler = objectApi.ListObjectsHandlerFunc(func(params objectApi.ListObjectsParams, session *models.Principal) middleware.Responder {
		resp, err := getListObjectsResponse(session, params)
		if err != nil {
			return objectApi.NewListObjectsDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewListObjectsOK().WithPayload(resp)
	})
	// delete object
	api.ObjectDeleteObjectHandler = objectApi.DeleteObjectHandlerFunc(func(params objectApi.DeleteObjectParams, session *models.Principal) middleware.Responder {
		if err := getDeleteObjectResponse(session, params); err != nil {
			return objectApi.NewDeleteObjectDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewDeleteObjectOK()
	})
	// delete multiple objects
	api.ObjectDeleteMultipleObjectsHandler = objectApi.DeleteMultipleObjectsHandlerFunc(func(params objectApi.DeleteMultipleObjectsParams, session *models.Principal) middleware.Responder {
		if err := getDeleteMultiplePathsResponse(session, params); err != nil {
			return objectApi.NewDeleteMultipleObjectsDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewDeleteMultipleObjectsOK()
	})
	// download object
	api.ObjectDownloadObjectHandler = objectApi.DownloadObjectHandlerFunc(func(params objectApi.DownloadObjectParams, session *models.Principal) middleware.Responder {
		isFolder := false

		folders := strings.Split(params.Prefix, "/")
		if folders[len(folders)-1] == "" {
			isFolder = true
		}
		var resp middleware.Responder
		var err *CodedAPIError

		if isFolder {
			resp, err = getDownloadFolderResponse(session, params)
		} else {
			resp, err = getDownloadObjectResponse(session, params)
		}

		if err != nil {
			return objectApi.NewDownloadObjectDefault(err.Code).WithPayload(err.APIError)
		}
		return resp
	})
	// download multiple objects
	api.ObjectDownloadMultipleObjectsHandler = objectApi.DownloadMultipleObjectsHandlerFunc(func(params objectApi.DownloadMultipleObjectsParams, session *models.Principal) middleware.Responder {
		ctx := params.HTTPRequest.Context()
		if len(params.ObjectList) < 1 {
			errCode := ErrorWithContext(ctx, errors.New("could not download, since object list is empty"))
			return objectApi.NewDownloadMultipleObjectsDefault(errCode.Code).WithPayload(errCode.APIError)
		}
		var resp middleware.Responder
		var err *CodedAPIError
		resp, err = getMultipleFilesDownloadResponse(session, params)
		if err != nil {
			return objectApi.NewDownloadMultipleObjectsDefault(err.Code).WithPayload(err.APIError)
		}
		return resp
	})

	// upload object
	api.ObjectPostBucketsBucketNameObjectsUploadHandler = objectApi.PostBucketsBucketNameObjectsUploadHandlerFunc(func(params objectApi.PostBucketsBucketNameObjectsUploadParams, session *models.Principal) middleware.Responder {
		if err := getUploadObjectResponse(session, params); err != nil {
			if strings.Contains(err.APIError.DetailedMessage, "413") {
				return objectApi.NewPostBucketsBucketNameObjectsUploadDefault(413).WithPayload(err.APIError)
			}
			return objectApi.NewPostBucketsBucketNameObjectsUploadDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewPostBucketsBucketNameObjectsUploadOK()
	})
	// get share object url
	api.ObjectShareObjectHandler = objectApi.ShareObjectHandlerFunc(func(params objectApi.ShareObjectParams, session *models.Principal) middleware.Responder {
		resp, err := getShareObjectResponse(session, params)
		if err != nil {
			return objectApi.NewShareObjectDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewShareObjectOK().WithPayload(*resp)
	})
	// set object legalhold status
	api.ObjectPutObjectLegalHoldHandler = objectApi.PutObjectLegalHoldHandlerFunc(func(params objectApi.PutObjectLegalHoldParams, session *models.Principal) middleware.Responder {
		if err := getSetObjectLegalHoldResponse(session, params); err != nil {
			return objectApi.NewPutObjectLegalHoldDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewPutObjectLegalHoldOK()
	})
	// set object retention
	api.ObjectPutObjectRetentionHandler = objectApi.PutObjectRetentionHandlerFunc(func(params objectApi.PutObjectRetentionParams, session *models.Principal) middleware.Responder {
		if err := getSetObjectRetentionResponse(session, params); err != nil {
			return objectApi.NewPutObjectRetentionDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewPutObjectRetentionOK()
	})
	// delete object retention
	api.ObjectDeleteObjectRetentionHandler = objectApi.DeleteObjectRetentionHandlerFunc(func(params objectApi.DeleteObjectRetentionParams, session *models.Principal) middleware.Responder {
		if err := deleteObjectRetentionResponse(session, params); err != nil {
			return objectApi.NewDeleteObjectRetentionDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewDeleteObjectRetentionOK()
	})
	// set tags in object
	api.ObjectPutObjectTagsHandler = objectApi.PutObjectTagsHandlerFunc(func(params objectApi.PutObjectTagsParams, session *models.Principal) middleware.Responder {
		if err := getPutObjectTagsResponse(session, params); err != nil {
			return objectApi.NewPutObjectTagsDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewPutObjectTagsOK()
	})
	// Restore file version
	api.ObjectPutObjectRestoreHandler = objectApi.PutObjectRestoreHandlerFunc(func(params objectApi.PutObjectRestoreParams, session *models.Principal) middleware.Responder {
		if err := getPutObjectRestoreResponse(session, params); err != nil {
			return objectApi.NewPutObjectRestoreDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewPutObjectRestoreOK()
	})
	// Metadata in object
	api.ObjectGetObjectMetadataHandler = objectApi.GetObjectMetadataHandlerFunc(func(params objectApi.GetObjectMetadataParams, session *models.Principal) middleware.Responder {
		resp, err := getObjectMetadataResponse(session, params)
		if err != nil {
			return objectApi.NewGetObjectMetadataDefault(err.Code).WithPayload(err.APIError)
		}
		return objectApi.NewGetObjectMetadataOK().WithPayload(resp)
	})
}

// getListObjectsResponse returns a list of objects
func getListObjectsResponse(session *models.Principal, params objectApi.ListObjectsParams) (*models.ListObjectsResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	var prefix string
	var recursive bool
	var withVersions bool
	var withMetadata bool
	if params.Prefix != nil {
		prefix = *params.Prefix
	}
	if params.Recursive != nil {
		recursive = *params.Recursive
	}
	if params.WithVersions != nil {
		withVersions = *params.WithVersions
	}
	if params.WithMetadata != nil {
		withMetadata = *params.WithMetadata
	}
	// bucket request needed to proceed
	if params.BucketName == "" {
		return nil, ErrorWithContext(ctx, ErrBucketNameNotInRequest)
	}
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	objs, err := listBucketObjects(ListObjectsOpts{
		ctx:          ctx,
		client:       minioClient,
		bucketName:   params.BucketName,
		prefix:       prefix,
		recursive:    recursive,
		withVersions: withVersions,
		withMetadata: withMetadata,
		limit:        params.Limit,
	})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	resp := &models.ListObjectsResponse{
		Objects: objs,
		Total:   int64(len(objs)),
	}
	return resp, nil
}

type ListObjectsOpts struct {
	ctx          context.Context
	client       MinioClient
	bucketName   string
	prefix       string
	recursive    bool
	withVersions bool
	withMetadata bool
	limit        *int32
}

// listBucketObjects gets an array of objects in a bucket
func listBucketObjects(listOpts ListObjectsOpts) ([]*models.BucketObject, error) {
	var objects []*models.BucketObject
	opts := minio.ListObjectsOptions{
		Prefix:       listOpts.prefix,
		Recursive:    listOpts.recursive,
		WithVersions: listOpts.withVersions,
		WithMetadata: listOpts.withMetadata,
		MaxKeys:      100,
	}
	if listOpts.withMetadata {
		opts.MaxKeys = 1
	}
	if listOpts.limit != nil {
		opts.MaxKeys = int(*listOpts.limit)
	}
	var totalObjs int32
	for lsObj := range listOpts.client.listObjects(listOpts.ctx, listOpts.bucketName, opts) {
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
			Etag:           lsObj.ETag,
		}
		// only if single object with or without versions; get legalhold, retention and tags
		if !lsObj.IsDeleteMarker && listOpts.prefix != "" && !strings.HasSuffix(listOpts.prefix, "/") {
			// Add Legal Hold Status if available
			legalHoldStatus, err := listOpts.client.getObjectLegalHold(listOpts.ctx, listOpts.bucketName, lsObj.Key, minio.GetObjectLegalHoldOptions{VersionID: lsObj.VersionID})
			if err != nil {
				errResp := minio.ToErrorResponse(probe.NewError(err).ToGoError())
				if errResp.Code != "InvalidRequest" && errResp.Code != "NoSuchObjectLockConfiguration" {
					ErrorWithContext(listOpts.ctx, fmt.Errorf("error getting legal hold status for %s : %v", lsObj.VersionID, err))
				}
			} else if legalHoldStatus != nil {
				obj.LegalHoldStatus = string(*legalHoldStatus)
			}
			// Add Retention Status if available
			retention, retUntilDate, err := listOpts.client.getObjectRetention(listOpts.ctx, listOpts.bucketName, lsObj.Key, lsObj.VersionID)
			if err != nil {
				errResp := minio.ToErrorResponse(probe.NewError(err).ToGoError())
				if errResp.Code != "InvalidRequest" && errResp.Code != "NoSuchObjectLockConfiguration" {
					ErrorWithContext(listOpts.ctx, fmt.Errorf("error getting retention status for %s : %v", lsObj.VersionID, err))
				}
			} else if retention != nil && retUntilDate != nil {
				date := *retUntilDate
				obj.RetentionMode = string(*retention)
				obj.RetentionUntilDate = date.Format(time.RFC3339)
			}
			objTags, err := listOpts.client.getObjectTagging(listOpts.ctx, listOpts.bucketName, lsObj.Key, minio.GetObjectTaggingOptions{VersionID: lsObj.VersionID})
			if err != nil {
				ErrorWithContext(listOpts.ctx, fmt.Errorf("error getting object tags for %s : %v", lsObj.VersionID, err))
			} else {
				obj.Tags = objTags.ToMap()
			}
		}
		objects = append(objects, obj)
		totalObjs++

		if listOpts.limit != nil {
			if totalObjs >= *listOpts.limit {
				break
			}
		}
	}
	return objects, nil
}

type httpRange struct {
	Start  int64
	Length int64
}

// Example:
//
//	"Content-Range": "bytes 100-200/1000"
//	"Content-Range": "bytes 100-200/*"
func getRange(start, end, total int64) string {
	// unknown total: -1
	if total == -1 {
		return fmt.Sprintf("bytes %d-%d/*", start, end)
	}

	return fmt.Sprintf("bytes %d-%d/%d", start, end, total)
}

// Example:
//
//	"Range": "bytes=100-200"
//	"Range": "bytes=-50"
//	"Range": "bytes=150-"
//	"Range": "bytes=0-0,-1"
func parseRange(s string, size int64) ([]httpRange, error) {
	if s == "" {
		return nil, nil // header not present
	}
	const b = "bytes="
	if !strings.HasPrefix(s, b) {
		return nil, errors.New("invalid range")
	}
	var ranges []httpRange
	for _, ra := range strings.Split(s[len(b):], ",") {
		ra = strings.TrimSpace(ra)
		if ra == "" {
			continue
		}
		i := strings.Index(ra, "-")
		if i < 0 {
			return nil, errors.New("invalid range")
		}
		start, end := strings.TrimSpace(ra[:i]), strings.TrimSpace(ra[i+1:])
		var r httpRange
		if start == "" {
			// If no start is specified, end specifies the
			// range start relative to the end of the file.
			i, err := strconv.ParseInt(end, 10, 64)
			if err != nil {
				return nil, errors.New("invalid range")
			}
			if i > size {
				i = size
			}
			r.Start = size - i
			r.Length = size - r.Start
		} else {
			i, err := strconv.ParseInt(start, 10, 64)
			if err != nil || i >= size || i < 0 {
				return nil, errors.New("invalid range")
			}
			r.Start = i
			if end == "" {
				// If no end is specified, range extends to end of the file.
				r.Length = size - r.Start
			} else {
				i, err := strconv.ParseInt(end, 10, 64)
				if err != nil || r.Start > i {
					return nil, errors.New("invalid range")
				}
				if i >= size {
					i = size - 1
				}
				r.Length = i - r.Start + 1
			}
		}
		ranges = append(ranges, r)
	}
	return ranges, nil
}

func getDownloadObjectResponse(session *models.Principal, params objectApi.DownloadObjectParams) (middleware.Responder, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	opts := minio.GetObjectOptions{}

	if params.VersionID != nil && *params.VersionID != "" {
		opts.VersionID = *params.VersionID
	}

	resp, err := mClient.GetObject(ctx, params.BucketName, params.Prefix, opts)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return middleware.ResponderFunc(func(rw http.ResponseWriter, _ runtime.Producer) {
		defer resp.Close()

		isPreview := params.Preview != nil && *params.Preview
		overrideName := *params.OverrideFileName

		// indicate it's a download / inline content to the browser, and the size of the object
		var filename string
		prefixElements := strings.Split(params.Prefix, "/")
		if len(prefixElements) > 0 && overrideName == "" {
			if prefixElements[len(prefixElements)-1] == "" {
				filename = prefixElements[len(prefixElements)-2]
			} else {
				filename = prefixElements[len(prefixElements)-1]
			}
		} else if overrideName != "" {
			filename = overrideName
		}

		escapedName := url.PathEscape(filename)

		// indicate object size & content type
		stat, err := resp.Stat()
		if err != nil {
			minErr := minio.ToErrorResponse(err)
			fmtError := ErrorWithContext(ctx, fmt.Errorf("failed to get Stat() response from server for %s (version %s): %v", params.Prefix, opts.VersionID, minErr.Error()))
			http.Error(rw, fmtError.APIError.DetailedMessage, http.StatusInternalServerError)
			return
		}

		// if we are getting a Range Request (video) handle that specially
		ranges, err := parseRange(params.HTTPRequest.Header.Get("Range"), stat.Size)
		if err != nil {
			fmtError := ErrorWithContext(ctx, fmt.Errorf("unable to parse range header input %s: %v", params.HTTPRequest.Header.Get("Range"), err))
			http.Error(rw, fmtError.APIError.DetailedMessage, http.StatusInternalServerError)
			return
		}
		contentType := stat.ContentType
		rw.Header().Set("X-XSS-Protection", "1; mode=block")

		if isPreview && isSafeToPreview(contentType) {
			rw.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", escapedName))
			rw.Header().Set("X-Frame-Options", "SAMEORIGIN")
		} else {
			rw.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", escapedName))
		}

		rw.Header().Set("Last-Modified", stat.LastModified.UTC().Format(http.TimeFormat))

		if isPreview {
			// In case content type was uploaded as octet-stream, we double verify content type
			if stat.ContentType == "application/octet-stream" {
				contentType = mimedb.TypeByExtension(filepath.Ext(escapedName))
			}
		}
		rw.Header().Set("Content-Type", contentType)
		length := stat.Size
		if len(ranges) > 0 {
			start := ranges[0].Start
			length = ranges[0].Length

			_, err = resp.Seek(start, io.SeekStart)
			if err != nil {
				fmtError := ErrorWithContext(ctx, fmt.Errorf("unable to seek at offset %d: %v", start, err))
				http.Error(rw, fmtError.APIError.DetailedMessage, http.StatusInternalServerError)
				return
			}

			rw.Header().Set("Accept-Ranges", "bytes")
			rw.Header().Set("Access-Control-Allow-Origin", "*")
			rw.Header().Set("Content-Range", getRange(start, start+length-1, stat.Size))
			rw.WriteHeader(http.StatusPartialContent)
		}

		rw.Header().Set("Content-Length", fmt.Sprintf("%d", length))
		_, err = io.Copy(rw, io.LimitReader(resp, length))
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("unable to write all data to client: %v", err))
			// You can't change headers after you already started writing the body.
			// Handle incomplete write in client.
			return
		}
	}), nil
}

func getDownloadFolderResponse(session *models.Principal, params objectApi.DownloadObjectParams) (middleware.Responder, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))

	folders := strings.Split(params.Prefix, "/")

	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	minioClient := minioClient{client: mClient}
	objects, err := listBucketObjects(ListObjectsOpts{
		ctx:          ctx,
		client:       minioClient,
		bucketName:   params.BucketName,
		prefix:       params.Prefix,
		recursive:    true,
		withVersions: false,
		withMetadata: false,
	})
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	resp, pw := io.Pipe()
	// Create file async
	go func() {
		defer pw.Close()
		zipw := zip.NewWriter(pw)
		var folder string
		if len(folders) > 1 {
			folder = folders[len(folders)-2]
		}
		defer zipw.Close()

		for i, obj := range objects {
			name := folder + objects[i].Name[len(params.Prefix)-1:]
			object, err := mClient.GetObject(ctx, params.BucketName, obj.Name, minio.GetObjectOptions{})
			if err != nil {
				// Ignore errors, move to next
				continue
			}
			modified, _ := time.Parse(time.RFC3339, obj.LastModified)
			f, err := zipw.CreateHeader(&zip.FileHeader{
				Name:     name,
				NonUTF8:  false,
				Method:   zip.Deflate,
				Modified: modified,
			})
			if err != nil {
				object.Close()
				// Ignore errors, move to next
				continue
			}

			_, err = io.Copy(f, object)
			object.Close()
			if err != nil {
				// We have a partial object, report error.
				pw.CloseWithError(err)
				return
			}
		}
	}()

	return middleware.ResponderFunc(func(rw http.ResponseWriter, _ runtime.Producer) {
		defer resp.Close()

		// indicate it's a download / inline content to the browser, and the size of the object
		var filename string
		prefixElements := strings.Split(params.Prefix, "/")
		if len(prefixElements) > 0 {
			if prefixElements[len(prefixElements)-1] == "" {
				filename = prefixElements[len(prefixElements)-2]
			} else {
				filename = prefixElements[len(prefixElements)-1]
			}
		}
		escapedName := url.PathEscape(filename)

		rw.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.zip\"", escapedName))
		rw.Header().Set("Content-Type", "application/zip")

		// Copy the stream
		_, err := io.Copy(rw, resp)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("unable to write all the requested data: %v", err))
			// You can't change headers after you already started writing the body.
			// Handle incomplete write in client.
			return
		}
	}), nil
}

func getMultipleFilesDownloadResponse(session *models.Principal, params objectApi.DownloadMultipleObjectsParams) (middleware.Responder, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	minioClient := minioClient{client: mClient}

	resp, pw := io.Pipe()
	// Create file async
	go func() {
		defer pw.Close()
		zipw := zip.NewWriter(pw)
		defer zipw.Close()

		addToZip := func(name string, modified time.Time) (io.Writer, error) {
			f, err := zipw.CreateHeader(&zip.FileHeader{
				Name:     name,
				NonUTF8:  false,
				Method:   zip.Deflate,
				Modified: modified,
			})
			return f, err
		}

		for _, dObj := range params.ObjectList {
			// if a prefix is selected, list and add objects recursively
			// the prefixes are not base64 encoded.
			if strings.HasSuffix(dObj, "/") {
				prefix := dObj

				folders := strings.Split(prefix, "/")

				var folder string
				if len(folders) > 1 {
					folder = folders[len(folders)-2]
				}

				objects, err := listBucketObjects(ListObjectsOpts{
					ctx:          ctx,
					client:       minioClient,
					bucketName:   params.BucketName,
					prefix:       prefix,
					recursive:    true,
					withVersions: false,
					withMetadata: false,
				})
				if err != nil {
					pw.CloseWithError(err)
				}

				for i, obj := range objects {
					name := folder + objects[i].Name[len(prefix)-1:]

					object, err := mClient.GetObject(ctx, params.BucketName, obj.Name, minio.GetObjectOptions{})
					if err != nil {
						// Ignore errors, move to next
						continue
					}

					modified, _ := time.Parse(time.RFC3339, obj.LastModified)
					f, err := addToZip(name, modified)
					if err != nil {
						object.Close()
						// Ignore errors, move to next
						continue
					}

					_, err = io.Copy(f, object)
					object.Close()
					if err != nil {
						// We have a partial object, report error.
						pw.CloseWithError(err)
						return
					}
				}

			} else {
				object, err := mClient.GetObject(ctx, params.BucketName, dObj, minio.GetObjectOptions{})
				if err != nil {
					// Ignore errors, move to next
					continue
				}

				// add selected individual object
				objectData, err := object.Stat()
				if err != nil {
					// Ignore errors, move to next
					continue
				}

				prefixes := strings.Split(dObj, "/")
				// truncate upper level prefixes to make the download as flat at the current level.
				objectName := prefixes[len(prefixes)-1]
				f, err := addToZip(objectName, objectData.LastModified)
				if err != nil {
					object.Close()
					// Ignore errors, move to next
					continue
				}

				_, err = io.Copy(f, object)
				object.Close()
				if err != nil {
					// We have a partial object, report error.
					pw.CloseWithError(err)
					return
				}
			}
		}
	}()

	return middleware.ResponderFunc(func(rw http.ResponseWriter, _ runtime.Producer) {
		defer resp.Close()

		// indicate it's a download / inline content to the browser, and the size of the object
		fileName := "selected_files_" + strings.ReplaceAll(strings.ReplaceAll(time.Now().UTC().Format(time.RFC3339), ":", ""), "-", "")

		rw.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.zip\"", fileName))
		rw.Header().Set("Content-Type", "application/zip")

		// Copy the stream
		_, err := io.Copy(rw, resp)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("unable to write all the requested data: %v", err))
			// You can't change headers after you already started writing the body.
			// Handle incomplete write in client.
			return
		}
	}), nil
}

// getDeleteObjectResponse returns whether there was an error on deletion of object
func getDeleteObjectResponse(session *models.Principal, params objectApi.DeleteObjectParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	s3Client, err := newS3BucketClient(session, params.BucketName, params.Prefix, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	var rec bool
	var version string
	var allVersions bool
	var nonCurrentVersions bool
	var bypass bool
	if params.Recursive != nil {
		rec = *params.Recursive
	}
	if params.VersionID != nil {
		version = *params.VersionID
	}
	if params.AllVersions != nil {
		allVersions = *params.AllVersions
	}
	if params.NonCurrentVersions != nil {
		nonCurrentVersions = *params.NonCurrentVersions
	}
	if params.Bypass != nil {
		bypass = *params.Bypass
	}

	if allVersions && nonCurrentVersions {
		err := errors.New("cannot set delete all versions and delete non-current versions flags at the same time")
		return ErrorWithContext(ctx, err)
	}

	err = deleteObjects(ctx, mcClient, params.BucketName, params.Prefix, version, rec, allVersions, nonCurrentVersions, bypass)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// getDeleteMultiplePathsResponse returns whether there was an error on deletion of any object
func getDeleteMultiplePathsResponse(session *models.Principal, params objectApi.DeleteMultipleObjectsParams) *CodedAPIError {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	var version string
	var allVersions bool
	var bypass bool
	if params.AllVersions != nil {
		allVersions = *params.AllVersions
	}
	if params.Bypass != nil {
		bypass = *params.Bypass
	}
	for i := 0; i < len(params.Files); i++ {
		if params.Files[i].VersionID != "" {
			version = params.Files[i].VersionID
		}
		prefix := params.Files[i].Path
		s3Client, err := newS3BucketClient(session, params.BucketName, prefix, getClientIP(params.HTTPRequest))
		if err != nil {
			return ErrorWithContext(ctx, err)
		}
		// create a mc S3Client interface implementation
		// defining the client to be used
		mcClient := mcClient{client: s3Client}
		err = deleteObjects(ctx, mcClient, params.BucketName, params.Files[i].Path, version, params.Files[i].Recursive, allVersions, false, bypass)
		if err != nil {
			return ErrorWithContext(ctx, err)
		}
	}
	return nil
}

// deleteObjects deletes either a single object or multiple objects based on recursive flag
func deleteObjects(ctx context.Context, client MCClient, bucket string, path string, versionID string, recursive, allVersions, nonCurrentVersionsOnly, bypass bool) error {
	// Delete All non-Current versions only.
	if nonCurrentVersionsOnly {
		return deleteNonCurrentVersions(ctx, client, bypass)
	}

	if recursive || allVersions {
		return deleteMultipleObjects(ctx, client, path, recursive, allVersions, bypass)
	}

	return deleteSingleObject(ctx, client, bucket, path, versionID, bypass)
}

// Return standardized URL to be used to compare later.
func getStandardizedURL(targetURL string) string {
	return filepath.FromSlash(targetURL)
}

// deleteMultipleObjects uses listing before removal, it can list recursively or not,
//
//	Use cases:
//	   * Remove objects recursively
func deleteMultipleObjects(ctx context.Context, client MCClient, path string, recursive, allVersions, isBypass bool) error {
	// Constants defined to make this code more readable
	const (
		isIncomplete   = false
		isRemoveBucket = false
		forceDelete    = false // Force delete not meant to be used by console UI.
	)

	listOpts := mc.ListOptions{
		Recursive:         recursive,
		Incomplete:        isIncomplete,
		ShowDir:           mc.DirNone,
		WithOlderVersions: allVersions,
		WithDeleteMarkers: allVersions,
	}

	lctx, cancel := context.WithCancel(ctx)
	defer cancel()

	contentCh := make(chan *mc.ClientContent)

	go func() {
		defer close(contentCh)

		for content := range client.list(lctx, listOpts) {
			if content.Err != nil {
				continue
			}

			if !strings.HasSuffix(getStandardizedURL(content.URL.Path), path) && !strings.HasSuffix(path, "/") {
				continue
			}

			select {
			case contentCh <- content:
			case <-lctx.Done():
				return
			}
		}
	}()

	for result := range client.remove(ctx, isIncomplete, isRemoveBucket, isBypass, forceDelete, contentCh) {
		if result.Err != nil {
			return result.Err.Cause
		}
	}

	return nil
}

func deleteSingleObject(ctx context.Context, client MCClient, bucket, object string, versionID string, isBypass bool) error {
	targetURL := fmt.Sprintf("%s/%s", bucket, object)
	contentCh := make(chan *mc.ClientContent, 1)
	contentCh <- &mc.ClientContent{URL: *newClientURL(targetURL), VersionID: versionID}
	close(contentCh)

	isIncomplete := false
	isRemoveBucket := false

	resultCh := client.remove(ctx, isIncomplete, isRemoveBucket, isBypass, false, contentCh)
	for result := range resultCh {
		if result.Err != nil {
			return result.Err.Cause
		}
	}
	return nil
}

func deleteNonCurrentVersions(ctx context.Context, client MCClient, isBypass bool) error {
	lctx, cancel := context.WithCancel(ctx)
	defer cancel()

	contentCh := make(chan *mc.ClientContent)

	go func() {
		defer close(contentCh)

		// Get current object versions
		for lsObj := range client.list(lctx, mc.ListOptions{
			WithDeleteMarkers: true,
			WithOlderVersions: true,
			Recursive:         true,
		}) {
			if lsObj.Err != nil {
				continue
			}

			if lsObj.IsLatest {
				continue
			}

			// All non-current objects proceed to purge.
			select {
			case contentCh <- lsObj:
			case <-lctx.Done():
				return
			}
		}
	}()

	for result := range client.remove(ctx, false, false, isBypass, false, contentCh) {
		if result.Err != nil {
			return result.Err.Cause
		}
	}

	return nil
}

func getUploadObjectResponse(session *models.Principal, params objectApi.PostBucketsBucketNameObjectsUploadParams) *CodedAPIError {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	if err := uploadFiles(ctx, minioClient, params); err != nil {
		return ErrorWithContext(ctx, err, ErrDefault)
	}
	return nil
}

// uploadFiles gets files from http.Request form and uploads them to MinIO
func uploadFiles(ctx context.Context, client MinioClient, params objectApi.PostBucketsBucketNameObjectsUploadParams) error {
	var prefix string
	if params.Prefix != nil {
		prefix = *params.Prefix
		// trim any leading '/', since that is not expected
		// for any object.
		prefix = strings.TrimPrefix(prefix, "/")
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
		objectName := prefix // prefix will have complete object path e.g: /test-prefix/test-object.txt
		_, err = client.putObject(ctx, params.BucketName, objectName, p, size, minio.PutObjectOptions{
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
func getShareObjectResponse(session *models.Principal, params objectApi.ShareObjectParams) (*string, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()
	clientIP := utils.ClientIPFromContext(ctx)
	s3Client, err := newS3BucketClient(session, params.BucketName, params.Prefix, clientIP)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	var expireDuration string
	if params.Expires != nil {
		expireDuration = *params.Expires
	}
	url, err := getShareObjectURL(ctx, mcClient, params.HTTPRequest, params.VersionID, expireDuration)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return url, nil
}

func getShareObjectURL(ctx context.Context, client MCClient, r *http.Request, versionID string, duration string) (*string, error) {
	// default duration 7d if not defined
	if strings.TrimSpace(duration) == "" {
		duration = "168h"
	}
	expiresDuration, err := time.ParseDuration(duration)
	if err != nil {
		return nil, err
	}
	minioURL, pErr := client.shareDownload(ctx, versionID, expiresDuration)
	if pErr != nil {
		return nil, pErr.Cause
	}

	requestURL := getRequestURLWithScheme(r)
	encodedURL := base64.RawURLEncoding.EncodeToString([]byte(minioURL))

	objURL := fmt.Sprintf("%s/api/v1/download-shared-object/%s", requestURL, url.PathEscape(encodedURL))
	return &objURL, nil
}

func getRequestURLWithScheme(r *http.Request) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}

	redirectURL := getConsoleBrowserRedirectURL()
	if redirectURL != "" {
		return strings.TrimSuffix(redirectURL, "/")
	}

	return fmt.Sprintf("%s://%s", scheme, r.Host)
}

func getSetObjectLegalHoldResponse(session *models.Principal, params objectApi.PutObjectLegalHoldParams) *CodedAPIError {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = setObjectLegalHold(ctx, minioClient, params.BucketName, params.Prefix, params.VersionID, *params.Body.Status)
	if err != nil {
		return ErrorWithContext(ctx, err)
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

func getSetObjectRetentionResponse(session *models.Principal, params objectApi.PutObjectRetentionParams) *CodedAPIError {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = setObjectRetention(ctx, minioClient, params.BucketName, params.VersionID, params.Prefix, params.Body)
	if err != nil {
		return ErrorWithContext(ctx, err)
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

func deleteObjectRetentionResponse(session *models.Principal, params objectApi.DeleteObjectRetentionParams) *CodedAPIError {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = deleteObjectRetention(ctx, minioClient, params.BucketName, params.Prefix, params.VersionID)
	if err != nil {
		return ErrorWithContext(ctx, err)
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

func getPutObjectTagsResponse(session *models.Principal, params objectApi.PutObjectTagsParams) *CodedAPIError {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = putObjectTags(ctx, minioClient, params.BucketName, params.Prefix, params.VersionID, params.Body.Tags)
	if err != nil {
		return ErrorWithContext(ctx, err)
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

// Restore Object Version
func getPutObjectRestoreResponse(session *models.Principal, params objectApi.PutObjectRestoreParams) *CodedAPIError {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	err = restoreObject(ctx, minioClient, params.BucketName, params.Prefix, params.VersionID)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func restoreObject(ctx context.Context, client MinioClient, bucketName, prefix, versionID string) error {
	// Select required version
	srcOpts := minio.CopySrcOptions{
		Bucket:    bucketName,
		Object:    prefix,
		VersionID: versionID,
	}

	// Destination object, same as current bucket
	replaceMetadata := make(map[string]string)
	replaceMetadata["copy-source"] = versionID

	dstOpts := minio.CopyDestOptions{
		Bucket:       bucketName,
		Object:       prefix,
		UserMetadata: replaceMetadata,
	}

	// Copy object call
	_, err := client.copyObject(ctx, dstOpts, srcOpts)
	if err != nil {
		return err
	}

	return nil
}

// Metadata Response from minio-go API
func getObjectMetadataResponse(session *models.Principal, params objectApi.GetObjectMetadataParams) (*models.Metadata, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()
	mClient, err := newMinioClient(session, getClientIP(params.HTTPRequest))
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}
	var versionID string
	if params.VersionID != nil {
		versionID = *params.VersionID
	}

	objectInfo, err := getObjectInfo(ctx, minioClient, params.BucketName, params.Prefix, versionID)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	metadata := &models.Metadata{ObjectMetadata: objectInfo.Metadata}

	return metadata, nil
}

func getObjectInfo(ctx context.Context, client MinioClient, bucketName, prefix, versionID string) (minio.ObjectInfo, error) {
	objectData, err := client.statObject(ctx, bucketName, prefix, minio.GetObjectOptions{VersionID: versionID})
	if err != nil {
		return minio.ObjectInfo{}, err
	}

	return objectData, nil
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

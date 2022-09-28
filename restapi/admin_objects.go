// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/minio/mc/cmd"
	"github.com/minio/minio-go/v7"

	"github.com/minio/console/models"
)

type objectsListOpts struct {
	BucketName string
	Prefix     string
}

type rewindListOpts struct {
	BucketName string
	Prefix     string
	Date       time.Time
}

func getObjectsOptionsFromReq(req *http.Request) (*objectsListOpts, error) {
	pOptions := objectsListOpts{
		BucketName: req.FormValue("bucketName"),
		Prefix:     "",
	}

	prefix := req.FormValue("prefix")

	if prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			LogError("error decoding prefix: %v", err)
			return nil, err
		}

		pOptions.Prefix = string(decodedPrefix)
	}

	return &pOptions, nil
}

func startObjectsListing(ctx context.Context, conn WSConn, client MinioClient, objOpts *objectsListOpts) error {
	opts := minio.ListObjectsOptions{
		Prefix:  objOpts.Prefix,
		MaxKeys: 10,
	}

	lsObjCh := client.listObjects(ctx, objOpts.BucketName, opts)

	for {
		select {
		case <-ctx.Done():
			return nil
		case lsObj, ok := <-lsObjCh:
			if lsObj.Err != nil {
				return lsObj.Err
			}

			if !ok {
				return nil
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

			// Serializing message
			bytes, err := json.Marshal(obj)
			if err != nil {
				LogError("error serializing obj listing json: %v", err)
				return err
			}
			// Send Message through websocket connection
			err = conn.writeMessage(websocket.TextMessage, bytes)
			if err != nil {
				LogError("error writing obj listing response: %v", err)
				return err
			}
		}
	}
}

func getRewindOptionsFromReq(req *http.Request) (*rewindListOpts, error) {
	pOptions := rewindListOpts{
		BucketName: req.FormValue("bucketName"),
		Prefix:     "",
	}

	prefix := req.FormValue("prefix")

	if prefix != "" {
		encodedPrefix := SanitizeEncodedPrefix(prefix)
		decodedPrefix, err := base64.StdEncoding.DecodeString(encodedPrefix)
		if err != nil {
			LogError("error decoding prefix: %v", err)
			return nil, err
		}

		pOptions.Prefix = string(decodedPrefix)
	}

	parsedDate, errDate := time.Parse(time.RFC3339, req.FormValue("date"))

	if errDate != nil {
		return nil, errDate
	}

	pOptions.Date = parsedDate

	return &pOptions, nil
}

func startRewindListing(ctx context.Context, conn WSConn, client MCClient, objOpts *rewindListOpts) error {
	lsRewind := client.list(ctx, cmd.ListOptions{TimeRef: objOpts.Date, WithDeleteMarkers: true})

	for {
		select {
		case <-ctx.Done():
			return nil
		case content, ok := <-lsRewind:
			if !ok {
				return nil
			}

			// build object name
			name := strings.ReplaceAll(content.URL.Path, fmt.Sprintf("/%s/", objOpts.BucketName), "")

			listElement := &models.RewindItem{
				LastModified: content.Time.Format(time.RFC3339),
				Size:         content.Size,
				VersionID:    content.VersionID,
				DeleteFlag:   content.IsDeleteMarker,
				IsLatest:     content.IsLatest,
				Action:       "",
				Name:         name,
			}

			// Serializing message
			bytes, err := json.Marshal(listElement)
			if err != nil {
				LogError("error serializing obj listing json: %v", err)
				return err
			}
			// Send Message through websocket connection
			err = conn.writeMessage(websocket.TextMessage, bytes)
			if err != nil {
				LogError("error writing obj listing response: %v", err)
				return err
			}
		}
	}
}

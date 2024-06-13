// This file is part of MinIO Console Server
// Copyright (c) 2024 MinIO, Inc.
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
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/public"
	xnet "github.com/minio/pkg/v3/net"
)

func registerPublicObjectsHandlers(api *operations.ConsoleAPI) {
	api.PublicDownloadSharedObjectHandler = public.DownloadSharedObjectHandlerFunc(func(params public.DownloadSharedObjectParams) middleware.Responder {
		resp, err := getDownloadPublicObjectResponse(params)
		if err != nil {
			return public.NewDownloadSharedObjectDefault(err.Code).WithPayload(err.APIError)
		}
		return resp
	})
}

func getDownloadPublicObjectResponse(params public.DownloadSharedObjectParams) (middleware.Responder, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()

	inputURLDecoded, err := decodeMinIOStringURL(params.URL)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	if inputURLDecoded == nil {
		return nil, ErrorWithContext(ctx, ErrDefault, fmt.Errorf("decoded url is null"))
	}

	req, err := http.NewRequest(http.MethodGet, *inputURLDecoded, nil)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	clnt := PrepareConsoleHTTPClient(getClientIP(params.HTTPRequest))
	resp, err := clnt.Do(req)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return middleware.ResponderFunc(func(rw http.ResponseWriter, _ runtime.Producer) {
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(rw, resp.Status, resp.StatusCode)
			return
		}

		urlObj, err := url.Parse(*inputURLDecoded)
		if err != nil {
			http.Error(rw, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Add the filename
		_, objectName := url2BucketAndObject(urlObj)
		escapedName := url.PathEscape(objectName)
		rw.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", escapedName))

		_, err = io.Copy(rw, resp.Body)
		if err != nil {
			http.Error(rw, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}), nil
}

// decodeMinIOStringURL decodes url and validates is a MinIO url endpoint
func decodeMinIOStringURL(inputURL string) (*string, error) {
	decodedURL, err := base64.RawURLEncoding.DecodeString(inputURL)
	if err != nil {
		return nil, err
	}

	// Validate input URL
	parsedURL, err := xnet.ParseHTTPURL(string(decodedURL))
	if err != nil {
		return nil, err
	}
	// Ensure incoming url points to MinIO Server
	minIOHost := getMinIOEndpoint()
	if parsedURL.Host != minIOHost {
		return nil, ErrForbidden
	}
	return swag.String(string(decodedURL)), nil
}

func url2BucketAndObject(u *url.URL) (bucketName, objectName string) {
	tokens := splitStr(u.Path, "/", 3)
	return tokens[1], tokens[2]
}

// splitStr splits a string into n parts, empty strings are added
// if we are not able to reach n elements
func splitStr(path, sep string, n int) []string {
	splits := strings.SplitN(path, sep, n)
	// Add empty strings if we found elements less than nr
	for i := n - len(splits); i > 0; i-- {
		splits = append(splits, "")
	}
	return splits
}

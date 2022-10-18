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
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"strings"
	"unicode/utf8"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	inspectApi "github.com/minio/console/restapi/operations/inspect"
	"github.com/minio/madmin-go"
	"github.com/secure-io/sio-go"
)

func registerInspectHandler(api *operations.ConsoleAPI) {
	api.InspectInspectHandler = inspectApi.InspectHandlerFunc(func(params inspectApi.InspectParams, principal *models.Principal) middleware.Responder {
		if v, err := base64.URLEncoding.DecodeString(params.File); err == nil && utf8.Valid(v) {
			params.File = string(v)
		}

		if v, err := base64.URLEncoding.DecodeString(params.Volume); err == nil && utf8.Valid(v) {
			params.Volume = string(v)
		}

		k, r, err := getInspectResult(principal, &params)
		if err != nil {
			return inspectApi.NewInspectDefault(int(err.Code)).WithPayload(err)
		}

		return middleware.ResponderFunc(processInspectResponse(&params, k, r))
	})
}

func getInspectResult(session *models.Principal, params *inspectApi.InspectParams) ([]byte, io.ReadCloser, *models.Error) {
	ctx := params.HTTPRequest.Context()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, nil, ErrorWithContext(ctx, err)
	}

	cfg := madmin.InspectOptions{
		File:   params.File,
		Volume: params.Volume,
	}

	// TODO: Remove encryption option and always encrypt.
	// Maybe also add public key field.
	if params.Encrypt != nil && *params.Encrypt {
		cfg.PublicKey, _ = base64.StdEncoding.DecodeString("MIIBCgKCAQEAs/128UFS9A8YSJY1XqYKt06dLVQQCGDee69T+0Tip/1jGAB4z0/3QMpH0MiS8Wjs4BRWV51qvkfAHzwwdU7y6jxU05ctb/H/WzRj3FYdhhHKdzear9TLJftlTs+xwj2XaADjbLXCV1jGLS889A7f7z5DgABlVZMQd9BjVAR8ED3xRJ2/ZCNuQVJ+A8r7TYPGMY3wWvhhPgPk3Lx4WDZxDiDNlFs4GQSaESSsiVTb9vyGe/94CsCTM6Cw9QG6ifHKCa/rFszPYdKCabAfHcS3eTr0GM+TThSsxO7KfuscbmLJkfQev1srfL2Ii2RbnysqIJVWKEwdW05ID8ryPkuTuwIDAQAB")
	}

	// create a MinIO Admin Client interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}

	k, r, err := adminClient.inspect(ctx, cfg)
	if err != nil {
		return nil, nil, ErrorWithContext(ctx, err)
	}
	return k, r, nil
}

// borrowed from mc cli
func decryptInspectV1(key [32]byte, r io.Reader) io.ReadCloser {
	stream, err := sio.AES_256_GCM.Stream(key[:])
	if err != nil {
		return nil
	}
	nonce := make([]byte, stream.NonceSize())
	return io.NopCloser(stream.DecryptReader(r, nonce, nil))
}

func processInspectResponse(params *inspectApi.InspectParams, k []byte, r io.ReadCloser) func(w http.ResponseWriter, _ runtime.Producer) {
	isEnc := params.Encrypt != nil && *params.Encrypt
	return func(w http.ResponseWriter, _ runtime.Producer) {
		ext := "enc"
		if len(k) == 32 && !isEnc {
			ext = "zip"
			r = decryptInspectV1(*(*[32]byte)(k), r)
		}
		fileName := fmt.Sprintf("inspect-%s-%s.%s", params.Volume, params.File, ext)
		fileName = strings.Map(func(r rune) rune {
			switch {
			case r >= 'A' && r <= 'Z':
				return r
			case r >= 'a' && r <= 'z':
				return r
			case r >= '0' && r <= '9':
				return r
			default:
				if strings.ContainsAny(string(r), "-+._") {
					return r
				}
				return '_'
			}
		}, fileName)
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))

		_, err := io.Copy(w, r)
		if err != nil {
			LogError("Unable to write all the data: %v", err)
		}
	}
}

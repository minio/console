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
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"hash/crc32"
	"io"
	"io/ioutil"
	"net/http"

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
		k, r, err := getInspectResult(principal, &params)
		isEncryptOn := params.Encrypt != nil && *params.Encrypt

		if err != nil {
			return inspectApi.NewInspectDefault(int(err.Code)).WithPayload(err)
		}

		return middleware.ResponderFunc(processInspectResponse(isEncryptOn, k, r))
	})
}

func getInspectResult(session *models.Principal, params *inspectApi.InspectParams) ([]byte, io.ReadCloser, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, nil, ErrorWithContext(ctx, err)
	}

	var cfg madmin.InspectOptions
	cfg.File = params.File
	cfg.Volume = params.Volume

	// TODO: Remove encryption option and always encrypt.
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
	return ioutil.NopCloser(stream.DecryptReader(r, nonce, nil))
}

func processInspectResponse(isEnc bool, k []byte, r io.ReadCloser) func(w http.ResponseWriter, _ runtime.Producer) {
	return func(w http.ResponseWriter, _ runtime.Producer) {
		fileName := fmt.Sprintf("inspect.enc")
		if len(k) == 32 {
			var id [4]byte
			binary.LittleEndian.PutUint32(id[:], crc32.ChecksumIEEE(k[:]))
			defer r.Close()

			ext := "enc"
			if !isEnc {
				ext = "zip"
				r = decryptInspectV1(*(*[32]byte)(k), r)
			}

			fileName = fmt.Sprintf("inspect.%s.%s", hex.EncodeToString(id[:]), ext)

			if isEnc {
				// use cookie to transmit the Decryption Key.
				hexKey := hex.EncodeToString(id[:]) + hex.EncodeToString(k[:])
				cookie := http.Cookie{
					Name:   fileName,
					Value:  hexKey,
					Path:   "/",
					MaxAge: 3000,
				}
				http.SetCookie(w, &cookie)
			}
		}

		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))

		_, err := io.Copy(w, r)
		if err != nil {
			LogError("Unable to write all the data: %v", err)
		}
	}
}

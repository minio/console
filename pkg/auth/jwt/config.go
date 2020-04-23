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

package jwt

import (
	"crypto/rand"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/minio/minio/pkg/env"
)

// Do not use:
// https://stackoverflow.com/questions/22892120/how-to-generate-a-random-string-of-a-fixed-length-in-go
// It relies on math/rand and therefore not on a cryptographically secure RNG => It must not be used
// for access/secret keys.

// The alphabet of random character string. Each character must be unique.
//
// The RandomCharString implementation requires that: 256 / len(letters) is a natural numbers.
// For example: 256 / 64 = 4. However, 5 > 256/62 > 4 and therefore we must not use a alphabet
// of 62 characters.
// The reason is that if 256 / len(letters) is not a natural number then certain characters become
// more likely then others.
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345"

func RandomCharString(n int) string {
	random := make([]byte, n)
	if _, err := io.ReadFull(rand.Reader, random); err != nil {
		panic(err) // Can only happen if we would run out of entropy.
	}

	var s strings.Builder
	for _, v := range random {
		j := v % byte(len(letters))
		s.WriteByte(letters[j])
	}
	return s.String()
}

// defaultHmacJWTPassphrase will be used by default if application is not configured with a custom MCS_HMAC_JWT_SECRET secret
var defaultHmacJWTPassphrase = RandomCharString(64)

// GetHmacJWTSecret returns the 64 bytes secret used for signing the generated JWT for the application
func GetHmacJWTSecret() string {
	return env.Get(McsHmacJWTSecret, defaultHmacJWTPassphrase)
}

// McsSTSAndJWTDurationSeconds returns the default session duration for the STS requested tokens and the generated JWTs.
// Ideally both values should match so jwt and Minio sts sessions expires at the same time.
func GetMcsSTSAndJWTDurationInSeconds() int {
	duration, err := strconv.Atoi(env.Get(McsSTSAndJWTDurationSeconds, "3600"))
	if err != nil {
		duration = 3600
	}
	return duration
}

// GetMcsSTSAndJWTDurationTime returns GetMcsSTSAndJWTDurationInSeconds in duration format
func GetMcsSTSAndJWTDurationTime() time.Duration {
	duration := GetMcsSTSAndJWTDurationInSeconds()
	return time.Duration(duration) * time.Second
}

// defaultPBKDFPassphrase
var defaultPBKDFPassphrase = RandomCharString(64)

// GetPBKDFPassphrase returns passphrase for the pbkdf2 function used to encrypt JWT payload
func GetPBKDFPassphrase() string {
	return env.Get(McsPBKDFPassphrase, defaultPBKDFPassphrase)
}

var defaultPBKDFSalt = RandomCharString(64)

// GetPBKDFSalt returns salt for the pbkdf2 function used to encrypt JWT payload
func GetPBKDFSalt() string {
	return env.Get(McsPBKDFSalt, defaultPBKDFSalt)
}

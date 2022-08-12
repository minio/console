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
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	xjwt "github.com/minio/console/pkg/auth/token"
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

type CustomButtonStyle struct {
	BackgroundColor *string `json:"backgroundColor"`
	TextColor       *string `json:"textColor"`
	HoverColor      *string `json:"hoverColor"`
	HoverText       *string `json:"hoverText"`
	ActiveColor     *string `json:"activeColor"`
	ActiveText      *string `json:"activeText"`
}

type CustomStyles struct {
	BackgroundColor *string            `json:"backgroundColor"`
	FontColor       *string            `json:"fontColor"`
	ButtonStyles    *CustomButtonStyle `json:"buttonStyles"`
}

func RandomCharStringWithAlphabet(n int, alphabet string) string {
	random := make([]byte, n)
	if _, err := io.ReadFull(rand.Reader, random); err != nil {
		panic(err) // Can only happen if we would run out of entropy.
	}

	var s strings.Builder
	for _, v := range random {
		j := v % byte(len(alphabet))
		s.WriteByte(alphabet[j])
	}
	return s.String()
}

func RandomCharString(n int) string {
	return RandomCharStringWithAlphabet(n, letters)
}

// DifferenceArrays returns the elements in `a` that aren't in `b`.
func DifferenceArrays(a, b []string) []string {
	mb := make(map[string]struct{}, len(b))
	for _, x := range b {
		mb[x] = struct{}{}
	}
	var diff []string
	for _, x := range a {
		if _, found := mb[x]; !found {
			diff = append(diff, x)
		}
	}
	return diff
}

// IsElementInArray returns true if the string belongs to the slice
func IsElementInArray(a []string, b string) bool {
	for _, e := range a {
		if e == b {
			return true
		}
	}

	return false
}

// UniqueKeys returns an array without duplicated keys
func UniqueKeys(a []string) []string {
	keys := make(map[string]bool)
	list := []string{}
	for _, entry := range a {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func NewSessionCookieForConsole(token string) http.Cookie {
	sessionDuration := xjwt.GetConsoleSTSDuration()
	return http.Cookie{
		Path:     "/",
		Name:     "token",
		Value:    token,
		MaxAge:   int(sessionDuration.Seconds()), // default 1 hr
		Expires:  time.Now().Add(sessionDuration),
		HttpOnly: true,
		// if len(GlobalPublicCerts) > 0 is true, that means Console is running with TLS enable and the browser
		// should not leak any cookie if we access the site using HTTP
		Secure: len(GlobalPublicCerts) > 0,
		// read more: https://web.dev/samesite-cookies-explained/
		SameSite: http.SameSiteLaxMode,
	}
}

func ExpireSessionCookie() http.Cookie {
	return http.Cookie{
		Path:     "/",
		Name:     "token",
		Value:    "",
		MaxAge:   -1,
		Expires:  time.Now().Add(-100 * time.Hour),
		HttpOnly: true,
		// if len(GlobalPublicCerts) > 0 is true, that means Console is running with TLS enable and the browser
		// should not leak any cookie if we access the site using HTTP
		Secure: len(GlobalPublicCerts) > 0,
		// read more: https://web.dev/samesite-cookies-explained/
		SameSite: http.SameSiteLaxMode,
	}
}

func EmbeddedStyleCookie(encodedStyles string) (http.Cookie, error) {
	// encodedStyle JSON validation
	str, err := base64.StdEncoding.DecodeString(encodedStyles)

	if err != nil {
		fmt.Println("Error Decode", err)
		return http.Cookie{}, err
	}

	var styleElements *CustomStyles

	err = json.Unmarshal(str, &styleElements)

	if err != nil {
		fmt.Println("Encoded: ", string(str))
		fmt.Println("Error Marshal", err)
		return http.Cookie{}, err
	}

	if styleElements.BackgroundColor == nil || styleElements.FontColor == nil || styleElements.ButtonStyles == nil {
		return http.Cookie{}, errors.New("specified style is not in the correct format")
	}

	sessionDuration := xjwt.GetConsoleSTSDuration()
	return http.Cookie{
		Path:    "/",
		Name:    "eb_st",
		Value:   encodedStyles,
		MaxAge:  int(sessionDuration.Seconds()), // default 1 hr
		Expires: time.Now().Add(sessionDuration),
		// We need this cookie to be accessible from javascript
		HttpOnly: false,
		// if len(GlobalPublicCerts) > 0 is true, that means Console is running with TLS enable and the browser
		// should not leak any cookie if we access the site using HTTP
		Secure: len(GlobalPublicCerts) > 0,
		// read more: https://web.dev/samesite-cookies-explained/
		SameSite: http.SameSiteLaxMode,
	}, nil
}

// SanitizeEncodedPrefix replaces spaces for + since those are lost when you do GET parameters
func SanitizeEncodedPrefix(rawPrefix string) string {
	return strings.ReplaceAll(rawPrefix, " ", "+")
}

var safeMimeTypes = []string{
	"image/jpeg",
	"image/apng",
	"image/avif",
	"image/webp",
	"image/bmp",
	"image/x-icon",
	"image/gif",
	"image/png",
	"image/heic",
	"image/heif",
	"application/pdf",
	"text/plain",
	"application/json",
	"audio/wav",
	"audio/mpeg",
	"audio/aiff",
	"audio/dsd",
	"video/mp4",
	"video/x-msvideo",
	"video/mpeg",
	"audio/webm",
	"video/webm",
	"video/quicktime",
	"video/x-flv",
	"audio/x-matroska",
	"video/x-matroska",
	"video/x-ms-wmv",
	"application/metastream",
	"video/avchd-stream",
	"audio/mp4",
	"video/mp4",
}

func isSafeToPreview(str string) bool {
	for _, v := range safeMimeTypes {
		if v == str {
			return true
		}
	}
	return false
}

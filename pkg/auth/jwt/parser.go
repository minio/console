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

// This file is a re-implementation of the original code here with some
// additional allocation tweaks reproduced using GODEBUG=allocfreetrace=1
// original file https://github.com/dgrijalva/jwt-go/blob/master/parser.go
// borrowed under MIT License https://github.com/dgrijalva/jwt-go/blob/master/LICENSE

import (
	"crypto"
	"crypto/hmac"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	jwtgo "github.com/dgrijalva/jwt-go"
	jsoniter "github.com/json-iterator/go"
)

const (
	claimData = "data"
	claimSub  = "sub"
)

// SigningMethodHMAC - Implements the HMAC-SHA family of signing methods signing methods
// Expects key type of []byte for both signing and validation
type SigningMethodHMAC struct {
	Name string
	Hash crypto.Hash
}

// Specific instances for HS256, HS384, HS512
var (
	SigningMethodHS256 *SigningMethodHMAC
	SigningMethodHS384 *SigningMethodHMAC
	SigningMethodHS512 *SigningMethodHMAC
)

var (
	base64BufPool sync.Pool
	hmacSigners   []*SigningMethodHMAC
)

func init() {
	base64BufPool = sync.Pool{
		New: func() interface{} {
			buf := make([]byte, 8192)
			return &buf
		},
	}

	hmacSigners = []*SigningMethodHMAC{
		{"HS256", crypto.SHA256},
		{"HS384", crypto.SHA384},
		{"HS512", crypto.SHA512},
	}
}

// StandardClaims are basically standard claims with "Data"
type StandardClaims struct {
	Data string `json:"data,omitempty"`
	jwtgo.StandardClaims
}

// MapClaims - implements custom unmarshaller
type MapClaims struct {
	Data    string `json:"data,omitempty"`
	Subject string `json:"sub,omitempty"`
	jwtgo.MapClaims
}

// NewStandardClaims - initializes standard claims
func NewStandardClaims() *StandardClaims {
	return &StandardClaims{}
}

// SetIssuer sets issuer for these claims
func (c *StandardClaims) SetIssuer(issuer string) {
	c.Issuer = issuer
}

// SetAudience sets audience for these claims
func (c *StandardClaims) SetAudience(aud string) {
	c.Audience = aud
}

// SetExpiry sets expiry in unix epoch secs
func (c *StandardClaims) SetExpiry(t time.Time) {
	c.ExpiresAt = t.Unix()
}

// SetSubject sets unique identifier for the jwt
func (c *StandardClaims) SetSubject(subject string) {
	c.Subject = subject
}

// SetData sets the "Data" custom field.
func (c *StandardClaims) SetData(data string) {
	c.Data = data
}

// Valid - implements https://godoc.org/github.com/dgrijalva/jwt-go#Claims compatible
// claims interface, additionally validates "Data" field.
func (c *StandardClaims) Valid() error {
	if err := c.StandardClaims.Valid(); err != nil {
		return err
	}

	if c.Data == "" || c.Subject == "" {
		return jwtgo.NewValidationError("data/sub",
			jwtgo.ValidationErrorClaimsInvalid)
	}
	return nil
}

// NewMapClaims - Initializes a new map claims
func NewMapClaims() *MapClaims {
	return &MapClaims{MapClaims: jwtgo.MapClaims{}}
}

// Lookup returns the value and if the key is found.
func (c *MapClaims) Lookup(key string) (value string, ok bool) {
	var vinterface interface{}
	vinterface, ok = c.MapClaims[key]
	if ok {
		value, ok = vinterface.(string)
	}
	return
}

// SetExpiry sets expiry in unix epoch secs
func (c *MapClaims) SetExpiry(t time.Time) {
	c.MapClaims["exp"] = t.Unix()
}

// SetData sets the "Data" custom field.
func (c *MapClaims) SetData(data string) {
	c.MapClaims[claimData] = data
}

// Valid - implements https://godoc.org/github.com/dgrijalva/jwt-go#Claims compatible
// claims interface, additionally validates "Data" field.
func (c *MapClaims) Valid() error {
	if err := c.MapClaims.Valid(); err != nil {
		return err
	}

	if c.Data == "" || c.Subject == "" {
		return jwtgo.NewValidationError("data/subject",
			jwtgo.ValidationErrorClaimsInvalid)
	}
	return nil
}

// Map returns underlying low-level map claims.
func (c *MapClaims) Map() map[string]interface{} {
	return c.MapClaims
}

// MarshalJSON marshals the MapClaims struct
func (c *MapClaims) MarshalJSON() ([]byte, error) {
	return json.Marshal(c.MapClaims)
}

// https://tools.ietf.org/html/rfc7519#page-11
type jwtHeader struct {
	Algorithm string `json:"alg"`
	Type      string `json:"typ"`
}

// ParseWithClaims - parse the token string, valid methods.
func ParseWithClaims(tokenStr string, claims *MapClaims) error {
	bufp := base64BufPool.Get().(*[]byte)
	defer base64BufPool.Put(bufp)

	signer, err := parseUnverifiedMapClaims(tokenStr, claims, *bufp)
	if err != nil {
		return err
	}

	i := strings.LastIndex(tokenStr, ".")
	if i < 0 {
		return jwtgo.ErrSignatureInvalid
	}

	n, err := base64Decode(tokenStr[i+1:], *bufp)
	if err != nil {
		return err
	}

	var ok bool

	claims.Data, ok = claims.Lookup(claimData)
	if !ok {
		return jwtgo.NewValidationError("data missing",
			jwtgo.ValidationErrorClaimsInvalid)
	}

	claims.Subject, ok = claims.Lookup(claimSub)
	if !ok {
		return jwtgo.NewValidationError("sub missing",
			jwtgo.ValidationErrorClaimsInvalid)
	}

	hasher := hmac.New(signer.Hash.New, []byte(GetHmacJWTSecret()))
	hasher.Write([]byte(tokenStr[:i]))
	if !hmac.Equal((*bufp)[:n], hasher.Sum(nil)) {
		return jwtgo.ErrSignatureInvalid
	}

	// Signature is valid, lets validate the claims for
	// other fields such as expiry etc.
	return claims.Valid()
}

// base64Decode returns the bytes represented by the base64 string s.
func base64Decode(s string, buf []byte) (int, error) {
	return base64.RawURLEncoding.Decode(buf, []byte(s))
}

// ParseUnverifiedMapClaims - WARNING: Don't use this method unless you know what you're doing
//
// This method parses the token but doesn't validate the signature. It's only
// ever useful in cases where you know the signature is valid (because it has
// been checked previously in the stack) and you want to extract values from
// it.
func parseUnverifiedMapClaims(tokenString string, claims *MapClaims, buf []byte) (*SigningMethodHMAC, error) {
	if strings.Count(tokenString, ".") != 2 {
		return nil, jwtgo.ErrSignatureInvalid
	}

	i := strings.Index(tokenString, ".")
	j := strings.LastIndex(tokenString, ".")

	n, err := base64Decode(tokenString[:i], buf)
	if err != nil {
		return nil, &jwtgo.ValidationError{Inner: err, Errors: jwtgo.ValidationErrorMalformed}
	}

	var header = jwtHeader{}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	if err = json.Unmarshal(buf[:n], &header); err != nil {
		return nil, &jwtgo.ValidationError{Inner: err, Errors: jwtgo.ValidationErrorMalformed}
	}

	n, err = base64Decode(tokenString[i+1:j], buf)
	if err != nil {
		return nil, &jwtgo.ValidationError{Inner: err, Errors: jwtgo.ValidationErrorMalformed}
	}

	if err = json.Unmarshal(buf[:n], &claims.MapClaims); err != nil {
		return nil, &jwtgo.ValidationError{Inner: err, Errors: jwtgo.ValidationErrorMalformed}
	}

	for _, signer := range hmacSigners {
		if header.Algorithm == signer.Name {
			return signer, nil
		}
	}

	return nil, jwtgo.NewValidationError(fmt.Sprintf("signing method (%s) is unavailable.", header.Algorithm),
		jwtgo.ValidationErrorUnverifiable)
}

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

package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha1"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth/token"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"golang.org/x/crypto/pbkdf2"
)

var (
	errNoAuthToken  = errors.New("session token missing")
	errReadingToken = errors.New("session token internal data is malformed")
	errClaimsFormat = errors.New("encrypted session token claims not in the right format")
)

// derivedKey is the key used to encrypt the session token claims, its derived using pbkdf on CONSOLE_PBKDF_PASSPHRASE with CONSOLE_PBKDF_SALT
var derivedKey = pbkdf2.Key([]byte(token.GetPBKDFPassphrase()), []byte(token.GetPBKDFSalt()), 4096, 32, sha1.New)

// IsSessionTokenValid returns true or false depending if the provided session token is valid or not
func IsSessionTokenValid(token string) bool {
	_, err := SessionTokenAuthenticate(token)
	return err == nil
}

// DecryptedClaims claims struct for decrypted credentials
type DecryptedClaims struct {
	AccessKeyID     string
	SecretAccessKey string
	SessionToken    string
	Actions         []string
}

// SessionTokenAuthenticate takes a session token, decode it, extract claims and validate the signature
// if the session token claims are valid we proceed to decrypt the information inside
//
// returns claims after validation in the following format:
//
//	type DecryptedClaims struct {
//		AccessKeyID
//		SecretAccessKey
//		SessionToken
//	}
func SessionTokenAuthenticate(token string) (*DecryptedClaims, error) {
	if token == "" {
		return nil, errNoAuthToken
	}
	// decrypt encrypted token
	claimTokens, err := decryptClaims(token)
	if err != nil {
		// we print decryption token error information for debugging purposes
		log.Println(err)
		// we return a generic error that doesn't give any information to attackers
		return nil, errReadingToken
	}
	// claimsTokens contains the decrypted JWT for Console
	return claimTokens, nil
}

// NewEncryptedTokenForClient generates a new session token with claims based on the provided STS credentials, first
// encrypts the claims and the sign them
func NewEncryptedTokenForClient(credentials *credentials.Value, actions []string) (string, error) {
	if credentials != nil {
		encryptedClaims, err := encryptClaims(credentials.AccessKeyID, credentials.SecretAccessKey, credentials.SessionToken, actions)
		if err != nil {
			return "", err
		}
		return encryptedClaims, nil
	}
	return "", errors.New("provided credentials are empty")
}

// encryptClaims() receives the STS claims, concatenate them and encrypt them using AES-GCM
// returns a base64 encoded ciphertext
func encryptClaims(accessKeyID, secretAccessKey, sessionToken string, actions []string) (string, error) {
	payload := []byte(fmt.Sprintf("%s#%s#%s#%s", accessKeyID, secretAccessKey, sessionToken, strings.Join(actions, ",")))
	ciphertext, err := encrypt(payload)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// decryptClaims() receives base64 encoded ciphertext, decode it, decrypt it (AES-GCM) and produces a *DecryptedClaims object
func decryptClaims(ciphertext string) (*DecryptedClaims, error) {
	decoded, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		log.Println(err)
		return nil, errClaimsFormat
	}
	plaintext, err := decrypt(decoded)
	if err != nil {
		log.Println(err)
		return nil, errClaimsFormat
	}
	s := strings.Split(string(plaintext), "#")
	// Validate that the decrypted string has the right format "accessKeyID:secretAccessKey:sessionToken"
	if len(s) != 4 {
		return nil, errClaimsFormat
	}
	accessKeyID, secretAccessKey, sessionToken, actions := s[0], s[1], s[2], s[3]
	actionsList := strings.Split(actions, ",")
	return &DecryptedClaims{
		AccessKeyID:     accessKeyID,
		SecretAccessKey: secretAccessKey,
		SessionToken:    sessionToken,
		Actions:         actionsList,
	}, nil
}

// Encrypt a blob of data using AEAD (AES-GCM) with a pbkdf2 derived key
func encrypt(plaintext []byte) ([]byte, error) {
	block, _ := aes.NewCipher(derivedKey)
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}
	cipherText := gcm.Seal(nonce, nonce, plaintext, nil)
	return cipherText, nil
}

// Decrypts a blob of data using AEAD (AES-GCM) with a pbkdf2 derived key
func decrypt(data []byte) ([]byte, error) {
	block, err := aes.NewCipher(derivedKey)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonceSize := gcm.NonceSize()
	nonce, cipherText := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, cipherText, nil)
	if err != nil {
		return nil, err
	}
	return plaintext, nil
}

// GetTokenFromRequest returns a token from a http Request
// either defined on a cookie `token` or on Authorization header.
//
// Authorization Header needs to be like "Authorization Bearer <token>"
func GetTokenFromRequest(r *http.Request) (*string, error) {
	// Get Auth token
	var reqToken string

	// Token might come either as a Cookie or as a Header
	// if not set in cookie, check if it is set on Header.
	tokenCookie, err := r.Cookie("token")
	if err != nil {
		headerToken := r.Header.Get("Authorization")
		// reqToken should come as "Bearer <token>"
		splitHeaderToken := strings.Split(headerToken, "Bearer")
		if len(splitHeaderToken) <= 1 {
			return nil, errNoAuthToken
		}
		reqToken = strings.TrimSpace(splitHeaderToken[1])
	} else {
		reqToken = strings.TrimSpace(tokenCookie.Value)
	}
	return swag.String(reqToken), nil
}

func GetClaimsFromTokenInRequest(req *http.Request) (*models.Principal, error) {
	sessionID, err := GetTokenFromRequest(req)
	if err != nil {
		return nil, err
	}
	// Perform decryption of the session token, if Console is able to decrypt the session token that means a valid session
	// was used in the first place to get it
	claims, err := SessionTokenAuthenticate(*sessionID)
	if err != nil {
		return nil, err
	}
	return &models.Principal{
		AccessKeyID:     claims.AccessKeyID,
		Actions:         claims.Actions,
		SecretAccessKey: claims.SecretAccessKey,
		SessionToken:    claims.SessionToken,
	}, nil
}

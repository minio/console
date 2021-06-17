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

package auth

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"crypto/sha1"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth/token"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/secure-io/sio-go/sioutil"
	"golang.org/x/crypto/chacha20"
	"golang.org/x/crypto/chacha20poly1305"
	"golang.org/x/crypto/pbkdf2"
)

// Session token errors
var (
	ErrNoAuthToken  = errors.New("session token missing")
	errTokenExpired = errors.New("session token has expired")
	errReadingToken = errors.New("session token internal data is malformed")
)

// derivedKey is the key used to encrypt the session token claims, its derived using pbkdf on CONSOLE_PBKDF_PASSPHRASE with CONSOLE_PBKDF_SALT
var derivedKey = pbkdf2.Key([]byte(token.GetPBKDFPassphrase()), []byte(token.GetPBKDFSalt()), 4096, 32, sha1.New)

// IsSessionTokenValid returns true or false depending if the provided session token is valid or not
func IsSessionTokenValid(token string) bool {
	_, err := SessionTokenAuthenticate(token)
	return err == nil
}

// TokenClaims claims struct for decrypted credentials
type TokenClaims struct {
	STSAccessKeyID     string   `json:"stsAccessKeyID,omitempty"`
	STSSecretAccessKey string   `json:"stsSecretAccessKey,omitempty"`
	STSSessionToken    string   `json:"stsSessionToken,omitempty"`
	AccountAccessKey   string   `json:"accountAccessKey,omitempty"`
	Actions            []string `json:"actions,omitempty"`
}

// SessionTokenAuthenticate takes a session token, decode it, extract claims and validate the signature
// if the session token claims are valid we proceed to decrypt the information inside
//
// returns claims after validation in the following format:
//
//	type TokenClaims struct {
//		STSAccessKeyID
//		STSSecretAccessKey
//		STSSessionToken
//		AccountAccessKey
//		Actions
//	}
func SessionTokenAuthenticate(token string) (*TokenClaims, error) {
	if token == "" {
		return nil, ErrNoAuthToken
	}
	// decrypt encrypted token
	claimTokens, err := decryptClaims(token)
	if err != nil {
		// we print decryption token error information for debugging purposes
		// we return a generic error that doesn't give any information to attackers
		return nil, errReadingToken
	}
	// claimsTokens contains the decrypted JWT for Console
	return claimTokens, nil
}

// NewEncryptedTokenForClient generates a new session token with claims based on the provided STS credentials, first
// encrypts the claims and the sign them
func NewEncryptedTokenForClient(credentials *credentials.Value, accountAccessKey string, actions []string) (string, error) {
	if credentials != nil {
		encryptedClaims, err := encryptClaims(&TokenClaims{
			STSAccessKeyID:     credentials.AccessKeyID,
			STSSecretAccessKey: credentials.SecretAccessKey,
			STSSessionToken:    credentials.SessionToken,
			AccountAccessKey:   accountAccessKey,
			Actions:            actions,
		})
		if err != nil {
			return "", err
		}
		return encryptedClaims, nil
	}
	return "", errors.New("provided credentials are empty")
}

// encryptClaims() receives the STS claims, concatenate them and encrypt them using AES-GCM
// returns a base64 encoded ciphertext
func encryptClaims(credentials *TokenClaims) (string, error) {
	payload, err := json.Marshal(credentials)
	if err != nil {
		return "", err
	}
	ciphertext, err := encrypt(payload, []byte{})
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// decryptClaims() receives base64 encoded ciphertext, decode it, decrypt it (AES-GCM) and produces a *TokenClaims object
func decryptClaims(ciphertext string) (*TokenClaims, error) {
	decoded, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return nil, err
	}
	plaintext, err := decrypt(decoded, []byte{})
	if err != nil {
		return nil, err
	}
	tokenClaims := &TokenClaims{}
	if err = json.Unmarshal(plaintext, tokenClaims); err != nil {
		return nil, err
	}
	return tokenClaims, nil
}

const (
	aesGcm   = 0x00
	c20p1305 = 0x01
)

// Encrypt a blob of data using AEAD scheme, AES-GCM if the executing CPU
// provides AES hardware support, otherwise will use ChaCha20-Poly1305
// with a pbkdf2 derived key, this function should be used to encrypt a session
// or data key provided as plaintext.
//
// The returned ciphertext data consists of:
//    AEAD ID | iv | nonce | encrypted data
//       1      16		 12     ~ len(data)
func encrypt(plaintext, associatedData []byte) ([]byte, error) {
	iv, err := sioutil.Random(16) // 16 bytes IV
	if err != nil {
		return nil, err
	}
	var algorithm byte
	if sioutil.NativeAES() {
		algorithm = aesGcm
	} else {
		algorithm = c20p1305
	}
	var aead cipher.AEAD
	switch algorithm {
	case aesGcm:
		mac := hmac.New(sha256.New, derivedKey)
		mac.Write(iv)
		sealingKey := mac.Sum(nil)

		var block cipher.Block
		block, err = aes.NewCipher(sealingKey)
		if err != nil {
			return nil, err
		}
		aead, err = cipher.NewGCM(block)
		if err != nil {
			return nil, err
		}
	case c20p1305:
		var sealingKey []byte
		sealingKey, err = chacha20.HChaCha20(derivedKey, iv) // HChaCha20 expects nonce of 16 bytes
		if err != nil {
			return nil, err
		}
		aead, err = chacha20poly1305.New(sealingKey)
		if err != nil {
			return nil, err
		}
	}
	nonce, err := sioutil.Random(aead.NonceSize())
	if err != nil {
		return nil, err
	}

	sealedBytes := aead.Seal(nil, nonce, plaintext, associatedData)

	// ciphertext = AEAD ID | iv | nonce | sealed bytes

	var buf bytes.Buffer
	buf.WriteByte(algorithm)
	buf.Write(iv)
	buf.Write(nonce)
	buf.Write(sealedBytes)

	return buf.Bytes(), nil
}

// Decrypts a blob of data using AEAD scheme AES-GCM if the executing CPU
// provides AES hardware support, otherwise will use ChaCha20-Poly1305with
// and a pbkdf2 derived key
func decrypt(ciphertext []byte, associatedData []byte) ([]byte, error) {
	var (
		algorithm [1]byte
		iv        [16]byte
		nonce     [12]byte // This depends on the AEAD but both used ciphers have the same nonce length.
	)

	r := bytes.NewReader(ciphertext)
	if _, err := io.ReadFull(r, algorithm[:]); err != nil {
		return nil, err
	}
	if _, err := io.ReadFull(r, iv[:]); err != nil {
		return nil, err
	}
	if _, err := io.ReadFull(r, nonce[:]); err != nil {
		return nil, err
	}

	var aead cipher.AEAD
	switch algorithm[0] {
	case aesGcm:
		mac := hmac.New(sha256.New, derivedKey)
		mac.Write(iv[:])
		sealingKey := mac.Sum(nil)
		block, err := aes.NewCipher(sealingKey[:])
		if err != nil {
			return nil, err
		}
		aead, err = cipher.NewGCM(block)
		if err != nil {
			return nil, err
		}
	case c20p1305:
		sealingKey, err := chacha20.HChaCha20(derivedKey, iv[:]) // HChaCha20 expects nonce of 16 bytes
		if err != nil {
			return nil, err
		}
		aead, err = chacha20poly1305.New(sealingKey)
		if err != nil {
			return nil, err
		}
	default:
		return nil, fmt.Errorf("invalid algorithm: %v", algorithm)
	}

	if len(nonce) != aead.NonceSize() {
		return nil, fmt.Errorf("invalid nonce size %d, expected %d", len(nonce), aead.NonceSize())
	}

	sealedBytes, err := ioutil.ReadAll(r)
	if err != nil {
		return nil, err
	}

	plaintext, err := aead.Open(nil, nonce[:], sealedBytes, associatedData)
	if err != nil {
		return nil, err
	}

	return plaintext, nil
}

// GetTokenFromRequest returns a token from a http Request
// either defined on a cookie `token` or on Authorization header.
//
// Authorization Header needs to be like "Authorization Bearer <token>"
func GetTokenFromRequest(r *http.Request) (string, error) {
	// Token might come either as a Cookie or as a Header
	// if not set in cookie, check if it is set on Header.
	tokenCookie, err := r.Cookie("token")
	if err != nil {
		return "", ErrNoAuthToken
	}
	currentTime := time.Now()
	if tokenCookie.Expires.After(currentTime) {
		return "", errTokenExpired
	}
	return strings.TrimSpace(tokenCookie.Value), nil
}

func GetClaimsFromTokenInRequest(req *http.Request) (*models.Principal, error) {
	sessionID, err := GetTokenFromRequest(req)
	if err != nil {
		return nil, err
	}
	// Perform decryption of the session token, if Console is able to decrypt the session token that means a valid session
	// was used in the first place to get it
	claims, err := SessionTokenAuthenticate(sessionID)
	if err != nil {
		return nil, err
	}
	return &models.Principal{
		STSAccessKeyID:     claims.STSAccessKeyID,
		Actions:            claims.Actions,
		STSSecretAccessKey: claims.STSSecretAccessKey,
		STSSessionToken:    claims.STSSessionToken,
		AccountAccessKey:   claims.AccountAccessKey,
	}, nil
}

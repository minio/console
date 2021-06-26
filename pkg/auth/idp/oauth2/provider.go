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

package oauth2

import (
	"context"
	"crypto/sha1"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/minio/minio-go/v7/pkg/credentials"

	"github.com/coreos/go-oidc"
	"github.com/minio/console/pkg/auth/utils"
	"golang.org/x/crypto/pbkdf2"
	"golang.org/x/oauth2"
	xoauth2 "golang.org/x/oauth2"
)

type Configuration interface {
	Exchange(ctx context.Context, code string, opts ...xoauth2.AuthCodeOption) (*xoauth2.Token, error)
	AuthCodeURL(state string, opts ...xoauth2.AuthCodeOption) string
	PasswordCredentialsToken(ctx context.Context, username string, password string) (*xoauth2.Token, error)
	Client(ctx context.Context, t *xoauth2.Token) *http.Client
	TokenSource(ctx context.Context, t *xoauth2.Token) xoauth2.TokenSource
}

type Config struct {
	xoauth2.Config
}

func (ac Config) Exchange(ctx context.Context, code string, opts ...xoauth2.AuthCodeOption) (*xoauth2.Token, error) {
	return ac.Exchange(ctx, code, opts...)
}

func (ac Config) AuthCodeURL(state string, opts ...xoauth2.AuthCodeOption) string {
	return ac.AuthCodeURL(state, opts...)
}

func (ac Config) PasswordCredentialsToken(ctx context.Context, username string, password string) (*xoauth2.Token, error) {
	return ac.PasswordCredentialsToken(ctx, username, password)
}

func (ac Config) Client(ctx context.Context, t *xoauth2.Token) *http.Client {
	return ac.Client(ctx, t)
}

func (ac Config) TokenSource(ctx context.Context, t *xoauth2.Token) xoauth2.TokenSource {
	return ac.TokenSource(ctx, t)
}

// Provider is a wrapper of the oauth2 configuration and the oidc provider
type Provider struct {
	// oauth2Config is an interface configuration that contains the following fields
	// Config{
	// 	 ClientID string
	//	 ClientSecret string
	//	 RedirectURL string
	//	 Endpoint oauth2.Endpoint
	//	 Scopes []string
	// }
	// - ClientID is the public identifier for this application
	// - ClientSecret is a shared secret between this application and the authorization server
	// - RedirectURL is the URL to redirect users going through
	//   the OAuth flow, after the resource owner's URLs.
	// - Endpoint contains the resource server's token endpoint
	//   URLs. These are constants specific to each server and are
	//   often available via site-specific packages, such as
	//   google.Endpoint or github.Endpoint.
	// - Scopes specifies optional requested permissions.
	ClientID       string
	oauth2Config   Configuration
	oidcProvider   *oidc.Provider
	provHTTPClient *http.Client
}

// derivedKey is the key used to compute the HMAC for signing the oauth state parameter
// its derived using pbkdf on CONSOLE_IDP_HMAC_PASSPHRASE with CONSOLE_IDP_HMAC_SALT
var derivedKey = pbkdf2.Key([]byte(getPassphraseForIdpHmac()), []byte(getSaltForIdpHmac()), 4096, 32, sha1.New)

// NewOauth2ProviderClient instantiates a new oauth2 client using the configured credentials
// it returns a *Provider object that contains the necessary configuration to initiate an
// oauth2 authentication flow
func NewOauth2ProviderClient(ctx context.Context, scopes []string, httpClient *http.Client) (*Provider, error) {
	customCtx := oidc.ClientContext(ctx, httpClient)
	provider, err := oidc.NewProvider(customCtx, GetIdpURL())
	if err != nil {
		return nil, err
	}
	// if google, change scopes
	u, err := url.Parse(GetIdpURL())
	if err != nil {
		return nil, err
	}
	// below verification should not be necessary if the user configure exactly the
	// scopes he need, will be removed on a future release
	if u.Host == "google.com" {
		scopes = []string{oidc.ScopeOpenID}
	}
	// If provided scopes are empty we use a default list or the user configured list
	if len(scopes) == 0 {
		scopes = strings.Split(getIdpScopes(), ",")
	}
	client := new(Provider)
	client.oauth2Config = &xoauth2.Config{
		ClientID:     GetIdpClientID(),
		ClientSecret: GetIdpSecret(),
		RedirectURL:  GetIdpCallbackURL(),
		Endpoint:     provider.Endpoint(),
		Scopes:       scopes,
	}
	client.oidcProvider = provider
	client.ClientID = GetIdpClientID()
	client.provHTTPClient = httpClient

	return client, nil
}

type User struct {
	AppMetadata       map[string]interface{} `json:"app_metadata"`
	Blocked           bool                   `json:"blocked"`
	CreatedAt         string                 `json:"created_at"`
	Email             string                 `json:"email"`
	EmailVerified     bool                   `json:"email_verified"`
	FamilyName        string                 `json:"family_name"`
	GivenName         string                 `json:"given_name"`
	Identities        []interface{}          `json:"identities"`
	LastIP            string                 `json:"last_ip"`
	LastLogin         string                 `json:"last_login"`
	LastPasswordReset string                 `json:"last_password_reset"`
	LoginsCount       int                    `json:"logins_count"`
	MultiFactor       string                 `json:"multifactor"`
	Name              string                 `json:"name"`
	Nickname          string                 `json:"nickname"`
	PhoneNumber       string                 `json:"phone_number"`
	PhoneVerified     bool                   `json:"phone_verified"`
	Picture           string                 `json:"picture"`
	UpdatedAt         string                 `json:"updated_at"`
	UserID            string                 `json:"user_id"`
	UserMetadata      map[string]interface{} `json:"user_metadata"`
	Username          string                 `json:"username"`
}

// VerifyIdentity will contact the configured IDP and validate the user identity based on the authorization code
func (client *Provider) VerifyIdentity(ctx context.Context, code, state string) (*credentials.Credentials, error) {
	// verify the provided state is valid (prevents CSRF attacks)
	if err := validateOauth2State(state); err != nil {
		return nil, err
	}
	getWebTokenExpiry := func() (*credentials.WebIdentityToken, error) {
		customCtx := context.WithValue(ctx, oauth2.HTTPClient, client.provHTTPClient)
		oauth2Token, err := client.oauth2Config.Exchange(customCtx, code)
		if err != nil {
			return nil, err
		}
		if !oauth2Token.Valid() {
			return nil, errors.New("invalid token")
		}

		// expiration configured in the token itself
		expiration := int(oauth2Token.Expiry.Sub(time.Now().UTC()).Seconds())

		// check if user configured a hardcoded expiration for console via env variables
		// and override the incoming expiration
		userConfiguredExpiration := getIdpTokenExpiration()
		if userConfiguredExpiration != "" {
			expiration, _ = strconv.Atoi(userConfiguredExpiration)
		}
		idToken := oauth2Token.Extra("id_token")
		if idToken == nil {
			return nil, errors.New("returned token is missing id_token claim")
		}
		return &credentials.WebIdentityToken{
			Token:  idToken.(string),
			Expiry: expiration,
		}, nil
	}
	stsEndpoint := GetSTSEndpoint()
	sts := credentials.New(&credentials.STSWebIdentity{
		Client:              client.provHTTPClient,
		STSEndpoint:         stsEndpoint,
		GetWebIDTokenExpiry: getWebTokenExpiry,
	})
	return sts, nil
}

// validateOauth2State validates the provided state was originated using the same
// instance (or one configured using the same secrets) of Console, this is basically used to prevent CSRF attacks
// https://security.stackexchange.com/questions/20187/oauth2-cross-site-request-forgery-and-state-parameter
func validateOauth2State(state string) error {
	// state contains a base64 encoded string that may ends with "==", the browser encodes that to "%3D%3D"
	// query unescape is need it before trying to decode the base64 string
	encodedMessage, err := url.QueryUnescape(state)
	if err != nil {
		return err
	}
	// decode the state parameter value
	message, err := base64.StdEncoding.DecodeString(encodedMessage)
	if err != nil {
		return err
	}
	s := strings.Split(string(message), ":")
	// Validate that the decoded message has the right format "message:hmac"
	if len(s) != 2 {
		return fmt.Errorf("invalid number of tokens, expected only 2, got %d instead", len(s))
	}
	// extract the state and hmac
	incomingState, incomingHmac := s[0], s[1]
	// validate that hmac(incomingState + pbkdf2(secret, salt)) == incomingHmac
	if calculatedHmac := utils.ComputeHmac256(incomingState, derivedKey); calculatedHmac != incomingHmac {
		return fmt.Errorf("oauth2 state is invalid, expected %s, got %s", calculatedHmac, incomingHmac)
	}
	return nil
}

// GetRandomStateWithHMAC computes message + hmac(message, pbkdf2(key, salt)) to be used as state during the oauth authorization
func GetRandomStateWithHMAC(length int) string {
	state := utils.RandomCharString(length)
	hmac := utils.ComputeHmac256(state, derivedKey)
	return base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", state, hmac)))
}

// GenerateLoginURL returns a new login URL based on the configured IDP
func (client *Provider) GenerateLoginURL() string {
	// generates random state and sign it using HMAC256
	state := GetRandomStateWithHMAC(25)
	loginURL := client.oauth2Config.AuthCodeURL(state)
	return strings.TrimSpace(loginURL)
}

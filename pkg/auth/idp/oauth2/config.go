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

// Package oauth2 contains all the necessary configurations to initialize the
// idp communication using oauth2 protocol
package oauth2

import (
	"crypto/sha1"
	"fmt"
	"net/http"
	"strings"

	"github.com/minio/minio-go/v7/pkg/set"
	"github.com/minio/pkg/v3/env"
	"golang.org/x/crypto/pbkdf2"
	"golang.org/x/oauth2"
	xoauth2 "golang.org/x/oauth2"
)

// ProviderConfig - OpenID IDP Configuration for console.
type ProviderConfig struct {
	URL                      string
	DisplayName              string // user-provided - can be empty
	ClientID, ClientSecret   string
	HMACSalt, HMACPassphrase string
	Scopes                   string
	Userinfo                 bool
	RedirectCallbackDynamic  bool
	RedirectCallback         string
	EndSessionEndpoint       string
	RoleArn                  string // can be empty
}

// GetOauth2Provider instantiates a new oauth2 client using the configured credentials
// it returns a *Provider object that contains the necessary configuration to initiate an
// oauth2 authentication flow.
//
// We only support Authentication with the Authorization Code Flow - spec:
// https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth
func (pc ProviderConfig) GetOauth2Provider(name string, scopes []string, r *http.Request, clnt *http.Client) (provider *Provider, err error) {
	var ddoc DiscoveryDoc
	ddoc, err = parseDiscoveryDoc(r.Context(), pc.URL, clnt)
	if err != nil {
		return nil, err
	}

	supportedResponseTypes := set.NewStringSet()
	for _, responseType := range ddoc.ResponseTypesSupported {
		// FIXME: ResponseTypesSupported is a JSON array of strings - it
		// may not actually have strings with spaces inside them -
		// making the following code unnecessary.
		for _, s := range strings.Fields(responseType) {
			supportedResponseTypes.Add(s)
		}
	}

	isSupported := requiredResponseTypes.Difference(supportedResponseTypes).IsEmpty()
	if !isSupported {
		return nil, fmt.Errorf("expected 'code' response type - got %s, login not allowed", ddoc.ResponseTypesSupported)
	}

	// If provided scopes are empty we use the user configured list or a default list.
	if len(scopes) == 0 {
		for _, s := range strings.Split(pc.Scopes, ",") {
			w := strings.TrimSpace(s)
			if w == "" {
				continue
			}
			scopes = append(scopes, w)
		}
		if len(scopes) == 0 {
			scopes = defaultScopes
		}
	}

	redirectURL := pc.RedirectCallback
	if pc.RedirectCallbackDynamic {
		// dynamic redirect if set, will generate redirect URLs
		// dynamically based on incoming requests.
		redirectURL = getLoginCallbackURL(r)
	}

	// add "openid" scope always.
	scopes = append(scopes, "openid")

	client := new(Provider)
	client.oauth2Config = &xoauth2.Config{
		ClientID:     pc.ClientID,
		ClientSecret: pc.ClientSecret,
		RedirectURL:  redirectURL,
		Endpoint: oauth2.Endpoint{
			AuthURL:  ddoc.AuthEndpoint,
			TokenURL: ddoc.TokenEndpoint,
		},
		Scopes: scopes,
	}

	client.IDPName = name
	client.UserInfo = pc.Userinfo
	client.client = clnt

	return client, nil
}

// GetStateKeyFunc - return the key function used to generate the authorization
// code flow state parameter.

func (pc ProviderConfig) GetStateKeyFunc() StateKeyFunc {
	return func() []byte {
		return pbkdf2.Key([]byte(pc.HMACPassphrase), []byte(pc.HMACSalt), 4096, 32, sha1.New)
	}
}

func (pc ProviderConfig) GetARNInf() string {
	return pc.RoleArn
}

type OpenIDPCfg map[string]ProviderConfig

func GetSTSEndpoint() string {
	return strings.TrimSpace(env.Get(ConsoleMinIOServer, "http://localhost:9000"))
}

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

package api

import (
	"context"
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/minio/console/pkg"

	"github.com/minio/console/pkg/utils"

	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const globalAppName = "MinIO Console"

// MinioAdmin interface with all functions to be implemented
// by mock when testing, it should include all MinioAdmin respective api calls
// that are used within this project.
type MinioAdmin interface {
	AccountInfo(ctx context.Context) (madmin.AccountInfo, error)
	// KMS
	kmsStatus(ctx context.Context) (madmin.KMSStatus, error)
}

// Interface implementation
//
// Define the structure of a minIO Client and define the functions that are actually used
// from minIO api.
type AdminClient struct {
	Client *madmin.AdminClient
}

// AccountInfo implements madmin.AccountInfo()
func (ac AdminClient) AccountInfo(ctx context.Context) (madmin.AccountInfo, error) {
	return ac.Client.AccountInfo(ctx, madmin.AccountOpts{})
}

func (ac AdminClient) getBucketQuota(ctx context.Context, bucket string) (madmin.BucketQuota, error) {
	return ac.Client.GetBucketQuota(ctx, bucket)
}

func (ac AdminClient) kmsStatus(ctx context.Context) (madmin.KMSStatus, error) {
	return ac.Client.KMSStatus(ctx)
}

func NewMinioAdminClient(ctx context.Context, sessionClaims *models.Principal) (*madmin.AdminClient, error) {
	clientIP := utils.ClientIPFromContext(ctx)
	adminClient, err := newAdminFromClaims(sessionClaims, clientIP)
	if err != nil {
		return nil, err
	}
	adminClient.SetAppInfo(globalAppName, pkg.Version)
	return adminClient, nil
}

// newAdminFromClaims creates a minio admin from Decrypted claims using Assume role credentials
func newAdminFromClaims(claims *models.Principal, clientIP string) (*madmin.AdminClient, error) {
	tlsEnabled := getMinIOEndpointIsSecure()
	endpoint := getMinIOEndpoint()

	adminClient, err := madmin.NewWithOptions(endpoint, &madmin.Options{
		Creds:  credentials.NewStaticV4(claims.STSAccessKeyID, claims.STSSecretAccessKey, claims.STSSessionToken),
		Secure: tlsEnabled,
	})
	if err != nil {
		return nil, err
	}
	adminClient.SetAppInfo(globalAppName, pkg.Version)
	adminClient.SetCustomTransport(PrepareSTSClientTransport(clientIP))
	return adminClient, nil
}

// isLocalAddress returns true if the url contains an IPv4/IPv6 hostname
// that points to the local machine - FQDN are not supported
func isLocalIPEndpoint(endpoint string) bool {
	u, err := url.Parse(endpoint)
	if err != nil {
		return false
	}
	return isLocalIPAddress(u.Hostname())
}

// isLocalAddress returns true if the url contains an IPv4/IPv6 hostname
// that points to the local machine - FQDN are not supported
func isLocalIPAddress(ipAddr string) bool {
	if ipAddr == "" {
		return false
	}
	if ipAddr == "localhost" {
		return true
	}
	ip := net.ParseIP(ipAddr)
	return ip != nil && ip.IsLoopback()
}

// GetConsoleHTTPClient caches different http clients depending on the target endpoint while taking
// in consideration CA certs stored in ${HOME}/.console/certs/CAs and ${HOME}/.minio/certs/CAs
// If the target endpoint points to a loopback device, skip the TLS verification.
func GetConsoleHTTPClient(clientIP string) *http.Client {
	return PrepareConsoleHTTPClient(clientIP)
}

var (
	// De-facto standard header keys.
	xForwardedFor = http.CanonicalHeaderKey("X-Forwarded-For")
	xRealIP       = http.CanonicalHeaderKey("X-Real-IP")
)

var (
	// RFC7239 defines a new "Forwarded: " header designed to replace the
	// existing use of X-Forwarded-* headers.
	// e.g. Forwarded: for=192.0.2.60;proto=https;by=203.0.113.43
	forwarded = http.CanonicalHeaderKey("Forwarded")
	// Allows for a sub-match of the first value after 'for=' to the next
	// comma, semi-colon or space. The match is case-insensitive.
	forRegex = regexp.MustCompile(`(?i)(?:for=)([^(;|,| )]+)(.*)`)
)

// getSourceIPFromHeaders retrieves the IP from the X-Forwarded-For, X-Real-IP
// and RFC7239 Forwarded headers (in that order)
func getSourceIPFromHeaders(r *http.Request) string {
	var addr string

	if fwd := r.Header.Get(xForwardedFor); fwd != "" {
		// Only grab the first (client) address. Note that '192.168.0.1,
		// 10.1.1.1' is a valid key for X-Forwarded-For where addresses after
		// the first may represent forwarding proxies earlier in the chain.
		s := strings.Index(fwd, ", ")
		if s == -1 {
			s = len(fwd)
		}
		addr = fwd[:s]
	} else if fwd := r.Header.Get(xRealIP); fwd != "" {
		// X-Real-IP should only contain one IP address (the client making the
		// request).
		addr = fwd
	} else if fwd := r.Header.Get(forwarded); fwd != "" {
		// match should contain at least two elements if the protocol was
		// specified in the Forwarded header. The first element will always be
		// the 'for=' capture, which we ignore. In the case of multiple IP
		// addresses (for=8.8.8.8, 8.8.4.4, 172.16.1.20 is valid) we only
		// extract the first, which should be the client IP.
		if match := forRegex.FindStringSubmatch(fwd); len(match) > 1 {
			// IPv6 addresses in Forwarded headers are quoted-strings. We strip
			// these quotes.
			addr = strings.Trim(match[1], `"`)
		}
	}

	return addr
}

// getClientIP retrieves the IP from the request headers
// and falls back to r.RemoteAddr when necessary.
// however returns without bracketing.
func getClientIP(r *http.Request) string {
	addr := getSourceIPFromHeaders(r)
	if addr == "" {
		addr = r.RemoteAddr
	}

	// Default to remote address if headers not set.
	raddr, _, _ := net.SplitHostPort(addr)
	if raddr == "" {
		return addr
	}
	return raddr
}

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

package restapi

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/minio/minio/pkg/env"
)

// Port mcs default port
var Port = "9090"

// Hostname mcs hostname
var Hostname = "localhost"

// TLSHostname mcs tls hostname
var TLSHostname = "localhost"

// TLSPort mcs tls port
var TLSPort = "9443"

// TLSRedirect mcs tls redirect rule
var TLSRedirect = "off"

func getAccessKey() string {
	return env.Get(McsAccessKey, "minioadmin")
}

func getSecretKey() string {
	return env.Get(McsSecretKey, "minioadmin")
}

func getMinIOServer() string {
	return env.Get(McsMinIOServer, "http://localhost:9000")
}

func getMinIOEndpoint() string {
	server := getMinIOServer()
	if strings.Contains(server, "://") {
		parts := strings.Split(server, "://")
		if len(parts) > 1 {
			server = parts[1]
		}
	}
	return server
}

func getMinIOEndpointIsSecure() bool {
	server := getMinIOServer()
	if strings.Contains(server, "://") {
		parts := strings.Split(server, "://")
		if len(parts) > 1 {
			if parts[1] == "https" {
				return true
			}
		}
	}
	return false
}

func getProductionMode() bool {
	return strings.ToLower(env.Get(McsProductionMode, "on")) == "on"
}

// GetHostname gets mcs hostname set on env variable,
// default one or defined on run command
func GetHostname() string {
	return strings.ToLower(env.Get(McsHostname, Hostname))
}

// GetPort gets mcs por set on env variable
// or default one
func GetPort() int {
	port, err := strconv.Atoi(env.Get(McsPort, Port))
	if err != nil {
		port = 9090
	}
	return port
}

// GetSSLHostname gets mcs ssl hostname set on env variable
// or default one
func GetSSLHostname() string {
	return strings.ToLower(env.Get(McsTLSHostname, TLSHostname))
}

// GetSSLPort gets mcs ssl port set on env variable
// or default one
func GetSSLPort() int {
	port, err := strconv.Atoi(env.Get(McsTLSPort, TLSPort))
	if err != nil {
		port = 9443
	}
	return port
}

// Get secure middleware env variable configurations
func getSecureAllowedHosts() []string {
	allowedHosts := env.Get(McsSecureAllowedHosts, "")
	if allowedHosts != "" {
		return strings.Split(allowedHosts, ",")
	}
	return []string{}
}

// AllowedHostsAreRegex determines, if the provided AllowedHosts slice contains valid regular expressions. Default is false.
func getSecureAllowedHostsAreRegex() bool {
	return strings.ToLower(env.Get(McsSecureAllowedHostsAreRegex, "off")) == "on"
}

// If FrameDeny is set to true, adds the X-Frame-Options header with the value of `DENY`. Default is true.
func getSecureFrameDeny() bool {
	return strings.ToLower(env.Get(McsSecureFrameDeny, "on")) == "on"
}

// If ContentTypeNosniff is true, adds the X-Content-Type-Options header with the value `nosniff`. Default is true.
func getSecureContentTypeNonSniff() bool {
	return strings.ToLower(env.Get(McsSecureContentTypeNoSniff, "on")) == "on"
}

// If BrowserXssFilter is true, adds the X-XSS-Protection header with the value `1; mode=block`. Default is true.
func getSecureBrowserXSSFilter() bool {
	return strings.ToLower(env.Get(McsSecureBrowserXSSFilter, "on")) == "on"
}

// ContentSecurityPolicy allows the Content-Security-Policy header value to be set with a custom value. Default is "".
// Passing a template string will replace `$NONCE` with a dynamic nonce value of 16 bytes for each request which can be
// later retrieved using the Nonce function.
func getSecureContentSecurityPolicy() string {
	return env.Get(McsSecureContentSecurityPolicy, "")
}

// ContentSecurityPolicyReportOnly allows the Content-Security-Policy-Report-Only header value to be set with a custom value. Default is "".
func getSecureContentSecurityPolicyReportOnly() string {
	return env.Get(McsSecureContentSecurityPolicyReportOnly, "")
}

// HostsProxyHeaders is a set of header keys that may hold a proxied hostname value for the request.
func getSecureHostsProxyHeaders() []string {
	allowedHosts := env.Get(McsSecureHostsProxyHeaders, "")
	if allowedHosts != "" {
		return strings.Split(allowedHosts, ",")
	}
	return []string{}
}

// If SSLRedirect is set to true, then only allow HTTPS requests. Default is true.
func getSSLRedirect() bool {
	return strings.ToLower(env.Get(McsSecureSSLRedirect, TLSRedirect)) == "on"
}

// SSLHost is the host name that is used to redirect HTTP requests to HTTPS. Default is "", which indicates to use the same host.
func getSecureSSLHost() string {
	return env.Get(McsSecureSSLHost, fmt.Sprintf("%s:%s", TLSHostname, TLSPort))
}

// STSSeconds is the max-age of the Strict-Transport-Security header. Default is 0, which would NOT include the header.
func getSecureSTSSeconds() int64 {
	seconds, err := strconv.Atoi(env.Get(McsSecureSTSSeconds, "0"))
	if err != nil {
		seconds = 0
	}
	return int64(seconds)
}

// If STSIncludeSubdomains is set to true, the `includeSubdomains` will be appended to the Strict-Transport-Security header. Default is false.
func getSecureSTSIncludeSubdomains() bool {
	return strings.ToLower(env.Get(McsSecureSTSIncludeSubdomains, "off")) == "on"
}

// If STSPreload is set to true, the `preload` flag will be appended to the Strict-Transport-Security header. Default is false.
func getSecureSTSPreload() bool {
	return strings.ToLower(env.Get(McsSecureSTSPreload, "off")) == "on"
}

// If SSLTemporaryRedirect is true, the a 302 will be used while redirecting. Default is false (301).
func getSecureSSLTemporaryRedirect() bool {
	return strings.ToLower(env.Get(McsSecureSSLTemporaryRedirect, "off")) == "on"
}

// STS header is only included when the connection is HTTPS.
func getSecureForceSTSHeader() bool {
	return strings.ToLower(env.Get(McsSecureForceSTSHeader, "off")) == "on"
}

// PublicKey implements HPKP to prevent MITM attacks with forged certificates. Default is "".
func getSecurePublicKey() string {
	return env.Get(McsSecurePublicKey, "")
}

// ReferrerPolicy allows the Referrer-Policy header with the value to be set with a custom value. Default is "".
func getSecureReferrerPolicy() string {
	return env.Get(McsSecureReferrerPolicy, "")
}

// FeaturePolicy allows the Feature-Policy header with the value to be set with a custom value. Default is "".
func getSecureFeaturePolicy() string {
	return env.Get(McsSecureFeaturePolicy, "")
}

func getSecureExpectCTHeader() string {
	return env.Get(McsSecureExpectCTHeader, "")
}

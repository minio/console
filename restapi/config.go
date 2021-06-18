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
	"crypto/x509"
	"io/ioutil"
	"net"
	"strconv"
	"strings"
	"time"

	xcerts "github.com/minio/pkg/certs"
	"github.com/minio/pkg/env"
)

var (
	// Port console default port
	Port = "9090"

	// Hostname console hostname
	// avoid listening on 0.0.0.0 by default
	// instead listen on all IPv4 and IPv6
	// - Hostname should be empty.
	Hostname = ""

	// TLSPort console tls port
	TLSPort = "9443"

	// TLSRedirect console tls redirect rule
	TLSRedirect = "on"

	// SessionDuration cookie validity duration
	SessionDuration = 45 * time.Minute

	// LicenseKey in memory license key used by console ui
	LicenseKey = ""
)

var consoleImage string

func init() {
	consoleImage = env.Get(ConsoleOperatorConsoleImage, ConsoleImageDefaultVersion)
}

func getMinIOServer() string {
	return strings.TrimSpace(env.Get(ConsoleMinIOServer, "http://localhost:9000"))
}

func getMinIORegion() string {
	return strings.TrimSpace(env.Get(ConsoleMinIORegion, ""))
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
			if parts[0] == "https" {
				return true
			}
		}
	}
	return false
}

// GetHostname gets console hostname set on env variable,
// default one or defined on run command
func GetHostname() string {
	return strings.ToLower(env.Get(ConsoleHostname, Hostname))
}

// GetPort gets console por set on env variable
// or default one
func GetPort() int {
	port, err := strconv.Atoi(env.Get(ConsolePort, Port))
	if err != nil {
		port = 9090
	}
	return port
}

// GetTLSHostname gets console tls hostname set on env variable
// or default one
func GetTLSHostname() string {
	return strings.ToLower(env.Get(ConsoleTLSHostname, Hostname))
}

// GetTLSPort gets console tls port set on env variable
// or default one
func GetTLSPort() int {
	port, err := strconv.Atoi(env.Get(ConsoleTLSPort, TLSPort))
	if err != nil {
		port = 9443
	}
	return port
}

// If GetTLSRedirect is set to true, then only allow HTTPS requests. Default is true.
func GetTLSRedirect() string {
	return strings.ToLower(env.Get(ConsoleSecureTLSRedirect, TLSRedirect))
}

// Get secure middleware env variable configurations
func getSecureAllowedHosts() []string {
	allowedHosts := env.Get(ConsoleSecureAllowedHosts, "")
	if allowedHosts != "" {
		return strings.Split(allowedHosts, ",")
	}
	return []string{}
}

// AllowedHostsAreRegex determines, if the provided AllowedHosts slice contains valid regular expressions. Default is false.
func getSecureAllowedHostsAreRegex() bool {
	return strings.ToLower(env.Get(ConsoleSecureAllowedHostsAreRegex, "off")) == "on"
}

// If FrameDeny is set to true, adds the X-Frame-Options header with the value of `DENY`. Default is true.
func getSecureFrameDeny() bool {
	return strings.ToLower(env.Get(ConsoleSecureFrameDeny, "on")) == "on"
}

// If ContentTypeNosniff is true, adds the X-Content-Type-Options header with the value `nosniff`. Default is true.
func getSecureContentTypeNonSniff() bool {
	return strings.ToLower(env.Get(ConsoleSecureContentTypeNoSniff, "on")) == "on"
}

// If BrowserXssFilter is true, adds the X-XSS-Protection header with the value `1; mode=block`. Default is true.
func getSecureBrowserXSSFilter() bool {
	return strings.ToLower(env.Get(ConsoleSecureBrowserXSSFilter, "on")) == "on"
}

// ContentSecurityPolicy allows the Content-Security-Policy header value to be set with a custom value. Default is "".
// Passing a template string will replace `$NONCE` with a dynamic nonce value of 16 bytes for each request which can be
// later retrieved using the Nonce function.
func getSecureContentSecurityPolicy() string {
	return env.Get(ConsoleSecureContentSecurityPolicy, "")
}

// ContentSecurityPolicyReportOnly allows the Content-Security-Policy-Report-Only header value to be set with a custom value. Default is "".
func getSecureContentSecurityPolicyReportOnly() string {
	return env.Get(ConsoleSecureContentSecurityPolicyReportOnly, "")
}

// HostsProxyHeaders is a set of header keys that may hold a proxied hostname value for the request.
func getSecureHostsProxyHeaders() []string {
	allowedHosts := env.Get(ConsoleSecureHostsProxyHeaders, "")
	if allowedHosts != "" {
		return strings.Split(allowedHosts, ",")
	}
	return []string{}
}

// TLSHost is the host name that is used to redirect HTTP requests to HTTPS. Default is "", which indicates to use the same host.
func getSecureTLSHost() string {
	return env.Get(ConsoleSecureTLSHost, net.JoinHostPort(Hostname, TLSPort))
}

// STSSeconds is the max-age of the Strict-Transport-Security header. Default is 0, which would NOT include the header.
func getSecureSTSSeconds() int64 {
	seconds, err := strconv.Atoi(env.Get(ConsoleSecureSTSSeconds, "0"))
	if err != nil {
		seconds = 0
	}
	return int64(seconds)
}

// If STSIncludeSubdomains is set to true, the `includeSubdomains` will be appended to the Strict-Transport-Security header. Default is false.
func getSecureSTSIncludeSubdomains() bool {
	return strings.ToLower(env.Get(ConsoleSecureSTSIncludeSubdomains, "off")) == "on"
}

// If STSPreload is set to true, the `preload` flag will be appended to the Strict-Transport-Security header. Default is false.
func getSecureSTSPreload() bool {
	return strings.ToLower(env.Get(ConsoleSecureSTSPreload, "off")) == "on"
}

// If TLSTemporaryRedirect is true, the a 302 will be used while redirecting. Default is false (301).
func getSecureTLSTemporaryRedirect() bool {
	return strings.ToLower(env.Get(ConsoleSecureTLSTemporaryRedirect, "off")) == "on"
}

// STS header is only included when the connection is HTTPS.
func getSecureForceSTSHeader() bool {
	return strings.ToLower(env.Get(ConsoleSecureForceSTSHeader, "off")) == "on"
}

// PublicKey implements HPKP to prevent MITM attacks with forged certificates. Default is "".
func getSecurePublicKey() string {
	return env.Get(ConsoleSecurePublicKey, "")
}

// ReferrerPolicy allows the Referrer-Policy header with the value to be set with a custom value. Default is "".
func getSecureReferrerPolicy() string {
	return env.Get(ConsoleSecureReferrerPolicy, "")
}

// FeaturePolicy allows the Feature-Policy header with the value to be set with a custom value. Default is "".
func getSecureFeaturePolicy() string {
	return env.Get(ConsoleSecureFeaturePolicy, "")
}

func getSecureExpectCTHeader() string {
	return env.Get(ConsoleSecureExpectCTHeader, "")
}

func getLogSearchAPIToken() string {
	if v := env.Get(ConsoleLogQueryAuthToken, ""); v != "" {
		return v
	}
	return env.Get(LogSearchQueryAuthToken, "")
}

func getLogSearchURL() string {
	return env.Get(ConsoleLogQueryURL, "http://localhost:8080")
}

func getPrometheusURL() string {
	return env.Get(PrometheusURL, "")
}

func getPrometheusJobID() string {
	return env.Get(PrometheusJobID, "minio-job")
}

// GetSubnetLicense returns the current subnet jwt license
func GetSubnetLicense() string {
	// if we have a license key in memory return that
	if LicenseKey != "" {
		return LicenseKey
	}
	// return license configured via environment variable
	LicenseKey = env.Get(ConsoleSubnetLicense, "")
	return LicenseKey
}

var (
	// GlobalRootCAs is CA root certificates, a nil value means system certs pool will be used
	GlobalRootCAs *x509.CertPool
	// GlobalPublicCerts has certificates Console will use to serve clients
	GlobalPublicCerts []*x509.Certificate
	// GlobalTLSCertsManager custom TLS Manager for SNI support
	GlobalTLSCertsManager *xcerts.Manager
)

// getK8sSAToken assumes the plugin is running inside a k8s pod and extract the current service account from the
// /var/run/secrets/kubernetes.io/serviceaccount/token file
func getK8sSAToken() string {
	dat, err := ioutil.ReadFile("/var/run/secrets/kubernetes.io/serviceaccount/token")
	if err != nil {
		return env.Get(ConsoleOperatorSAToken, "")
	}
	return string(dat)
}

func getConsoleImage() string {
	return consoleImage
}

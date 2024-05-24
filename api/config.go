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
	"crypto/tls"
	"crypto/x509"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/minio/console/pkg/auth/idp/oauth2"
	xcerts "github.com/minio/pkg/v3/certs"
	"github.com/minio/pkg/v3/env"
	xnet "github.com/minio/pkg/v3/net"
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

	ConsoleResourceName = "console-ui"
)

var (
	// GlobalRootCAs is CA root certificates, a nil value means system certs pool will be used
	GlobalRootCAs *x509.CertPool
	// GlobalPublicCerts has certificates Console will use to serve clients
	GlobalPublicCerts []*x509.Certificate
	// GlobalTLSCertsManager custom TLS Manager for SNI support
	GlobalTLSCertsManager *xcerts.Manager
	// GlobalTransport is common transport used for all HTTP calls, this is set via
	// MinIO server to be the correct transport, however we still define some defaults
	// here just in case.
	GlobalTransport = &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 15 * time.Second,
		}).DialContext,
		MaxIdleConns:          1024,
		MaxIdleConnsPerHost:   1024,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 10 * time.Second,
		DisableCompression:    true, // Set to avoid auto-decompression
		TLSClientConfig: &tls.Config{
			// Can't use SSLv3 because of POODLE and BEAST
			// Can't use TLSv1.0 because of POODLE and BEAST using CBC cipher
			// Can't use TLSv1.1 because of RC4 cipher usage
			MinVersion: tls.VersionTLS12,
			// Console runs in the same pod/node as MinIO this is acceptable.
			InsecureSkipVerify: true,
			RootCAs:            GlobalRootCAs,
		},
	}
)

// MinIOConfig represents application configuration passed in from the MinIO
// server to the console.
type MinIOConfig struct {
	OpenIDProviders oauth2.OpenIDPCfg
}

// GlobalMinIOConfig is the global application configuration passed in from the
// MinIO server.
var GlobalMinIOConfig MinIOConfig

func getMinIOServer() string {
	return strings.TrimSpace(env.Get(ConsoleMinIOServer, "http://localhost:9000"))
}

func getSubnetProxy() string {
	return strings.TrimSpace(env.Get(ConsoleSubnetProxy, ""))
}

func GetMinIORegion() string {
	return strings.TrimSpace(env.Get(ConsoleMinIORegion, ""))
}

func getMinIOEndpoint() string {
	u, err := xnet.ParseHTTPURL(getMinIOServer())
	if err != nil {
		panic(err)
	}
	return u.Host
}

func getMinIOEndpointIsSecure() bool {
	u, err := xnet.ParseHTTPURL(getMinIOServer())
	if err != nil {
		panic(err)
	}
	return u.Scheme == "https"
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
func GetSecureAllowedHosts() []string {
	allowedHosts := env.Get(ConsoleSecureAllowedHosts, "")
	if allowedHosts != "" {
		return strings.Split(allowedHosts, ",")
	}
	return []string{}
}

// AllowedHostsAreRegex determines, if the provided AllowedHosts slice contains valid regular expressions. Default is false.
func GetSecureAllowedHostsAreRegex() bool {
	return strings.ToLower(env.Get(ConsoleSecureAllowedHostsAreRegex, "off")) == "on"
}

// If FrameDeny is set to true, adds the X-Frame-Options header with the value of `DENY`. Default is true.
func GetSecureFrameDeny() bool {
	return strings.ToLower(env.Get(ConsoleSecureFrameDeny, "on")) == "on"
}

// If ContentTypeNosniff is true, adds the X-Content-Type-Options header with the value `nosniff`. Default is true.
func GetSecureContentTypeNonSniff() bool {
	return strings.ToLower(env.Get(ConsoleSecureContentTypeNoSniff, "on")) == "on"
}

// If BrowserXssFilter is true, adds the X-XSS-Protection header with the value `1; mode=block`. Default is true.
func GetSecureBrowserXSSFilter() bool {
	return strings.ToLower(env.Get(ConsoleSecureBrowserXSSFilter, "on")) == "on"
}

// ContentSecurityPolicy allows the Content-Security-Policy header value to be set with a custom value. Default is "".
// Passing a template string will replace `$NONCE` with a dynamic nonce value of 16 bytes for each request which can be
// later retrieved using the Nonce function.
func GetSecureContentSecurityPolicy() string {
	return env.Get(ConsoleSecureContentSecurityPolicy, "")
}

// ContentSecurityPolicyReportOnly allows the Content-Security-Policy-Report-Only header value to be set with a custom value. Default is "".
func GetSecureContentSecurityPolicyReportOnly() string {
	return env.Get(ConsoleSecureContentSecurityPolicyReportOnly, "")
}

// HostsProxyHeaders is a set of header keys that may hold a proxied hostname value for the request.
func GetSecureHostsProxyHeaders() []string {
	allowedHosts := env.Get(ConsoleSecureHostsProxyHeaders, "")
	if allowedHosts != "" {
		return strings.Split(allowedHosts, ",")
	}
	return []string{}
}

// TLSHost is the host name that is used to redirect HTTP requests to HTTPS. Default is "", which indicates to use the same host.
func GetSecureTLSHost() string {
	tlsHost := env.Get(ConsoleSecureTLSHost, "")
	if tlsHost == "" && Hostname != "" {
		return net.JoinHostPort(Hostname, TLSPort)
	}
	return ""
}

// STSSeconds is the max-age of the Strict-Transport-Security header. Default is 0, which would NOT include the header.
func GetSecureSTSSeconds() int64 {
	seconds, err := strconv.Atoi(env.Get(ConsoleSecureSTSSeconds, "0"))
	if err != nil {
		seconds = 0
	}
	return int64(seconds)
}

// If STSIncludeSubdomains is set to true, the `includeSubdomains` will be appended to the Strict-Transport-Security header. Default is false.
func GetSecureSTSIncludeSubdomains() bool {
	return strings.ToLower(env.Get(ConsoleSecureSTSIncludeSubdomains, "off")) == "on"
}

// If STSPreload is set to true, the `preload` flag will be appended to the Strict-Transport-Security header. Default is false.
func GetSecureSTSPreload() bool {
	return strings.ToLower(env.Get(ConsoleSecureSTSPreload, "off")) == "on"
}

// If TLSTemporaryRedirect is true, the a 302 will be used while redirecting. Default is false (301).
func GetSecureTLSTemporaryRedirect() bool {
	return strings.ToLower(env.Get(ConsoleSecureTLSTemporaryRedirect, "off")) == "on"
}

// STS header is only included when the connection is HTTPS.
func GetSecureForceSTSHeader() bool {
	return strings.ToLower(env.Get(ConsoleSecureForceSTSHeader, "off")) == "on"
}

// ReferrerPolicy allows the Referrer-Policy header with the value to be set with a custom value. Default is "".
func GetSecureReferrerPolicy() string {
	return env.Get(ConsoleSecureReferrerPolicy, "")
}

// FeaturePolicy allows the Feature-Policy header with the value to be set with a custom value. Default is "".
func GetSecureFeaturePolicy() string {
	return env.Get(ConsoleSecureFeaturePolicy, "")
}

func getLogSearchAPIToken() string {
	if v := env.Get(ConsoleLogQueryAuthToken, ""); v != "" {
		return v
	}
	return env.Get(LogSearchQueryAuthToken, "")
}

func getLogSearchURL() string {
	return env.Get(ConsoleLogQueryURL, "")
}

func getPrometheusURL() string {
	return env.Get(PrometheusURL, "")
}

func getPrometheusAuthToken() string {
	return env.Get(PrometheusAuthToken, "")
}

func getPrometheusJobID() string {
	return env.Get(PrometheusJobID, "minio-job")
}

func getPrometheusExtraLabels() string {
	return env.Get(PrometheusExtraLabels, "")
}

func getMaxConcurrentUploadsLimit() int64 {
	cu, err := strconv.ParseInt(env.Get(ConsoleMaxConcurrentUploads, "10"), 10, 64)
	if err != nil {
		return 10
	}

	return cu
}

func getMaxConcurrentDownloadsLimit() int64 {
	cu, err := strconv.ParseInt(env.Get(ConsoleMaxConcurrentDownloads, "20"), 10, 64)
	if err != nil {
		return 20
	}

	return cu
}

func getConsoleDevMode() bool {
	return strings.ToLower(env.Get(ConsoleDevMode, "off")) == "on"
}

func getConsoleAnimatedLogin() bool {
	return strings.ToLower(env.Get(ConsoleAnimatedLogin, "on")) == "on"
}

func getConsoleBrowserRedirectURL() string {
	return env.Get(ConsoleBrowserRedirectURL, "")
}

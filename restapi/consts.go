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

const (
	// consts for common configuration
	ConsoleVersion               = `0.1.0`
	ConsoleAccessKey             = "CONSOLE_ACCESS_KEY"
	ConsoleSecretKey             = "CONSOLE_SECRET_KEY"
	ConsoleMinIOServer           = "CONSOLE_MINIO_SERVER"
	ConsoleMinIOServerTLSRootCAs = "CONSOLE_MINIO_SERVER_TLS_ROOT_CAS"
	ConsoleProductionMode        = "CONSOLE_PRODUCTION_MODE"
	ConsoleHostname              = "CONSOLE_HOSTNAME"
	ConsolePort                  = "CONSOLE_PORT"
	ConsoleTLSHostname           = "CONSOLE_TLS_HOSTNAME"
	ConsoleTLSPort               = "CONSOLE_TLS_PORT"

	// consts for Secure middleware
	ConsoleSecureAllowedHosts                    = "CONSOLE_SECURE_ALLOWED_HOSTS"
	ConsoleSecureAllowedHostsAreRegex            = "CONSOLE_SECURE_ALLOWED_HOSTS_ARE_REGEX"
	ConsoleSecureFrameDeny                       = "CONSOLE_SECURE_FRAME_DENY"
	ConsoleSecureContentTypeNoSniff              = "CONSOLE_SECURE_CONTENT_TYPE_NO_SNIFF"
	ConsoleSecureBrowserXSSFilter                = "CONSOLE_SECURE_BROWSER_XSS_FILTER"
	ConsoleSecureContentSecurityPolicy           = "CONSOLE_SECURE_CONTENT_SECURITY_POLICY"
	ConsoleSecureContentSecurityPolicyReportOnly = "CONSOLE_SECURE_CONTENT_SECURITY_POLICY_REPORT_ONLY"
	ConsoleSecureHostsProxyHeaders               = "CONSOLE_SECURE_HOSTS_PROXY_HEADERS"
	ConsoleSecureSTSSeconds                      = "CONSOLE_SECURE_STS_SECONDS"
	ConsoleSecureSTSIncludeSubdomains            = "CONSOLE_SECURE_STS_INCLUDE_SUB_DOMAINS"
	ConsoleSecureSTSPreload                      = "CONSOLE_SECURE_STS_PRELOAD"
	ConsoleSecureSSLRedirect                     = "CONSOLE_SECURE_SSL_REDIRECT"
	ConsoleSecureSSLHost                         = "CONSOLE_SECURE_SSL_HOST"
	ConsoleSecureSSLTemporaryRedirect            = "CONSOLE_SECURE_SSL_TEMPORARY_REDIRECT"
	ConsoleSecureForceSTSHeader                  = "CONSOLE_SECURE_FORCE_STS_HEADER"
	ConsoleSecurePublicKey                       = "CONSOLE_SECURE_PUBLIC_KEY"
	ConsoleSecureReferrerPolicy                  = "CONSOLE_SECURE_REFERRER_POLICY"
	ConsoleSecureFeaturePolicy                   = "CONSOLE_SECURE_FEATURE_POLICY"
	ConsoleSecureExpectCTHeader                  = "CONSOLE_SECURE_EXPECT_CT_HEADER"
)

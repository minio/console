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

// list of all console environment constants
const (
	// Constants for common configuration
	ConsoleMinIOServer = "CONSOLE_MINIO_SERVER"
	ConsoleMinIORegion = "CONSOLE_MINIO_REGION"
	ConsoleHostname    = "CONSOLE_HOSTNAME"
	ConsolePort        = "CONSOLE_PORT"
	ConsoleTLSPort     = "CONSOLE_TLS_PORT"

	// Constants for Secure middleware
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
	ConsoleSecureTLSRedirect                     = "CONSOLE_SECURE_TLS_REDIRECT"
	ConsoleSecureTLSHost                         = "CONSOLE_SECURE_TLS_HOST"
	ConsoleSecureForceSTSHeader                  = "CONSOLE_SECURE_FORCE_STS_HEADER"
	ConsoleSecureReferrerPolicy                  = "CONSOLE_SECURE_REFERRER_POLICY"
	ConsoleSecureFeaturePolicy                   = "CONSOLE_SECURE_FEATURE_POLICY"
	ConsoleLogQueryURL                           = "CONSOLE_LOG_QUERY_URL"
	ConsoleLogQueryAuthToken                     = "CONSOLE_LOG_QUERY_AUTH_TOKEN"
	ConsoleMaxConcurrentUploads                  = "CONSOLE_MAX_CONCURRENT_UPLOADS"
	ConsoleMaxConcurrentDownloads                = "CONSOLE_MAX_CONCURRENT_DOWNLOADS"
	ConsoleDevMode                               = "CONSOLE_DEV_MODE"
	ConsoleAnimatedLogin                         = "CONSOLE_ANIMATED_LOGIN"
	ConsoleBrowserRedirectURL                    = "CONSOLE_BROWSER_REDIRECT_URL"
	LogSearchQueryAuthToken                      = "LOGSEARCH_QUERY_AUTH_TOKEN"
	SlashSeparator                               = "/"
	LocalAddress                                 = "127.0.0.1"
)

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
	McsVersion               = `0.1.0`
	McsAccessKey             = "MCS_ACCESS_KEY"
	McsSecretKey             = "MCS_SECRET_KEY"
	McsMinIOServer           = "MCS_MINIO_SERVER"
	McsMinIOServerTLSRootCAs = "MCS_MINIO_SERVER_TLS_ROOT_CAS"
	McsProductionMode        = "MCS_PRODUCTION_MODE"
	McsHostname              = "MCS_HOSTNAME"
	McsPort                  = "MCS_PORT"
	McsTLSHostname           = "MCS_TLS_HOSTNAME"
	McsTLSPort               = "MCS_TLS_PORT"

	// consts for Secure middleware
	McsSecureAllowedHosts                    = "MCS_SECURE_ALLOWED_HOSTS"
	McsSecureAllowedHostsAreRegex            = "MCS_SECURE_ALLOWED_HOSTS_ARE_REGEX"
	McsSecureFrameDeny                       = "MCS_SECURE_FRAME_DENY"
	McsSecureContentTypeNoSniff              = "MCS_SECURE_CONTENT_TYPE_NO_SNIFF"
	McsSecureBrowserXSSFilter                = "MCS_SECURE_BROWSER_XSS_FILTER"
	McsSecureContentSecurityPolicy           = "MCS_SECURE_CONTENT_SECURITY_POLICY"
	McsSecureContentSecurityPolicyReportOnly = "MCS_SECURE_CONTENT_SECURITY_POLICY_REPORT_ONLY"
	McsSecureHostsProxyHeaders               = "MCS_SECURE_HOSTS_PROXY_HEADERS"
	McsSecureSTSSeconds                      = "MCS_SECURE_STS_SECONDS"
	McsSecureSTSIncludeSubdomains            = "MCS_SECURE_STS_INCLUDE_SUB_DOMAINS"
	McsSecureSTSPreload                      = "MCS_SECURE_STS_PRELOAD"
	McsSecureSSLRedirect                     = "MCS_SECURE_SSL_REDIRECT"
	McsSecureSSLHost                         = "MCS_SECURE_SSL_HOST"
	McsSecureSSLTemporaryRedirect            = "MCS_SECURE_SSL_TEMPORARY_REDIRECT"
	McsSecureForceSTSHeader                  = "MCS_SECURE_FORCE_STS_HEADER"
	McsSecurePublicKey                       = "MCS_SECURE_PUBLIC_KEY"
	McsSecureReferrerPolicy                  = "MCS_SECURE_REFERRER_POLICY"
	McsSecureFeaturePolicy                   = "MCS_SECURE_FEATURE_POLICY"
	McsSecureExpectCTHeader                  = "MCS_SECURE_EXPECT_CT_HEADER"
	McsM3Host                                = "MCS_M3_HOSTNAME"
)

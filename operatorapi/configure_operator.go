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
//

package operatorapi

import (
	"crypto/tls"
	"net/http"
	"strings"

	"github.com/klauspost/compress/gzhttp"
	"github.com/minio/console/restapi"
	"github.com/unrolled/secure"

	"github.com/minio/console/pkg/auth"

	"github.com/go-openapi/swag"

	"github.com/go-openapi/errors"

	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
)

//go:generate swagger generate server --target ../../console --name Operator --spec ../swagger-operator.yml --server-package operatorapi --principal models.Principal --exclude-main

var additionalServerFlags = struct {
	CertsDir string `long:"certs-dir" description:"path to certs directory" env:"CONSOLE_CERTS_DIR"`
}{}

func configureFlags(api *operations.OperatorAPI) {
	api.CommandLineOptionsGroups = []swag.CommandLineOptionsGroup{
		{
			ShortDescription: "additional server flags",
			Options:          &additionalServerFlags,
		},
	}
}

func configureAPI(api *operations.OperatorAPI) http.Handler {
	// Applies when the "x-token" header is set
	api.KeyAuth = func(token string, scopes []string) (*models.Principal, error) {
		// we are validating the session token by decrypting the claims inside, if the operation succeed that means the jwt
		// was generated and signed by us in the first place
		claims, err := auth.ParseClaimsFromToken(token)
		if err != nil {
			api.Logger("Unable to validate the session token %s: %v", token, err)
			return nil, errors.New(401, "incorrect api key auth")
		}
		return &models.Principal{
			STSAccessKeyID:     claims.STSAccessKeyID,
			STSSecretAccessKey: claims.STSSecretAccessKey,
			STSSessionToken:    claims.STSSessionToken,
			AccountAccessKey:   claims.AccountAccessKey,
		}, nil
	}
	// Register logout handlers
	registerLogoutHandlers(api)
	// Register login handlers
	registerLoginHandlers(api)
	registerSessionHandlers(api)
	registerVersionHandlers(api)

	// Operator Console
	// Register tenant handlers
	registerTenantHandlers(api)
	// Register ResourceQuota handlers
	registerResourceQuotaHandlers(api)
	// Register Nodes' handlers
	registerNodesHandlers(api)
	// Register Parity' handlers
	registerParityHandlers(api)

	// Volumes handlers
	registerVolumesHandlers(api)
	// Namespaces handlers
	registerNamespaceHandlers(api)

	api.PreServerShutdown = func() {}

	api.ServerShutdown = func() {}

	return setupGlobalMiddleware(api.Serve(setupMiddlewares))
}

// The TLS configuration before HTTPS server starts.
func configureTLS(tlsConfig *tls.Config) {
	tlsConfig.RootCAs = restapi.GlobalRootCAs
	tlsConfig.GetCertificate = restapi.GlobalTLSCertsManager.GetCertificate
}

// As soon as server is initialized but not run yet, this function will be called.
// If you need to modify a config, store server instance to stop it individually later, this is the place.
// This function can be called multiple times, depending on the number of serving schemes.
// scheme value will be set accordingly: "http", "https" or "unix".
func configureServer(s *http.Server, scheme, addr string) {
}

// The middleware configuration is for the handler executors. These do not apply to the swagger.json document.
// The middleware executes after routing but before authentication, binding and validation.
func setupMiddlewares(handler http.Handler) http.Handler {
	return handler
}

// proxyMiddleware adds the proxy capability
func proxyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/proxy") || strings.HasPrefix(r.URL.Path, "/api/hop") {
			serveProxy(w, r)
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

// The middleware configuration happens before anything, this middleware also applies to serving the swagger.json document.
// So this is a good place to plug in a panic handling middleware, logging and metrics.
func setupGlobalMiddleware(handler http.Handler) http.Handler {
	// proxy requests
	next := proxyMiddleware(handler)
	// if audit-log is enabled console will log all incoming request
	next = restapi.AuditLogMiddleware(next)
	// serve static files
	next = restapi.FileServerMiddleware(next)
	// add information to request context
	next = restapi.ContextMiddleware(next)
	// handle cookie or authorization header for session
	next = restapi.AuthenticationMiddleware(next)
	// Secure middleware, this middleware wrap all the previous handlers and add
	// HTTP security headers
	secureOptions := secure.Options{
		AllowedHosts:                    restapi.GetSecureAllowedHosts(),
		AllowedHostsAreRegex:            restapi.GetSecureAllowedHostsAreRegex(),
		HostsProxyHeaders:               restapi.GetSecureHostsProxyHeaders(),
		SSLRedirect:                     restapi.GetTLSRedirect() == "on" && len(restapi.GlobalPublicCerts) > 0,
		SSLHost:                         restapi.GetSecureTLSHost(),
		STSSeconds:                      restapi.GetSecureSTSSeconds(),
		STSIncludeSubdomains:            restapi.GetSecureSTSIncludeSubdomains(),
		STSPreload:                      restapi.GetSecureSTSPreload(),
		SSLTemporaryRedirect:            restapi.GetSecureTLSTemporaryRedirect(),
		SSLHostFunc:                     nil,
		ForceSTSHeader:                  restapi.GetSecureForceSTSHeader(),
		FrameDeny:                       restapi.GetSecureFrameDeny(),
		ContentTypeNosniff:              restapi.GetSecureContentTypeNonSniff(),
		BrowserXssFilter:                restapi.GetSecureBrowserXSSFilter(),
		ContentSecurityPolicy:           restapi.GetSecureContentSecurityPolicy(),
		ContentSecurityPolicyReportOnly: restapi.GetSecureContentSecurityPolicyReportOnly(),
		PublicKey:                       restapi.GetSecurePublicKey(),
		ReferrerPolicy:                  restapi.GetSecureReferrerPolicy(),
		FeaturePolicy:                   restapi.GetSecureFeaturePolicy(),
		ExpectCTHeader:                  restapi.GetSecureExpectCTHeader(),
		IsDevelopment:                   false,
	}
	secureMiddleware := secure.New(secureOptions)
	next = secureMiddleware.Handler(next)
	return gzhttp.GzipHandler(next)
}

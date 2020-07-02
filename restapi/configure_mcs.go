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

// This file is safe to edit. Once it exists it will not be overwritten

package restapi

import (
	"crypto/tls"
	"log"
	"net/http"
	"strings"

	"github.com/minio/mcs/models"
	"github.com/minio/mcs/pkg"
	"github.com/minio/mcs/pkg/auth"

	assetFS "github.com/elazarl/go-bindata-assetfs"

	portalUI "github.com/minio/mcs/portal-ui"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/minio/mcs/restapi/operations"
	"github.com/unrolled/secure"
)

//go:generate swagger generate server --target ../../mcs --name Mcs --spec ../swagger.yml

func configureFlags(api *operations.McsAPI) {
	// api.CommandLineOptionsGroups = []swag.CommandLineOptionsGroup{ ... }
}

func configureAPI(api *operations.McsAPI) http.Handler {
	// configure the api here
	api.ServeError = errors.ServeError

	// Set your custom logger if needed. Default one is log.Printf
	// Expected interface func(string, ...interface{})
	//
	// Example:
	// api.Logger = log.Printf

	api.JSONConsumer = runtime.JSONConsumer()

	api.JSONProducer = runtime.JSONProducer()
	// Applies when the "x-token" header is set

	api.KeyAuth = func(token string, scopes []string) (*models.Principal, error) {
		if auth.IsJWTValid(token) {
			prin := models.Principal(token)
			return &prin, nil
		}
		log.Printf("Access attempt with incorrect api key auth: %s", token)
		return nil, errors.New(401, "incorrect api key auth")
	}

	// Register login handlers
	registerLoginHandlers(api)
	// Register logout handlers
	registerLogoutHandlers(api)
	// Register bucket handlers
	registerBucketsHandlers(api)
	// Register all users handlers
	registerUsersHandlers(api)
	// Register groups handlers
	registerGroupsHandlers(api)
	// Register policies handlers
	registersPoliciesHandler(api)
	// Register configurations handlers
	registerConfigHandlers(api)
	// Register bucket events handlers
	registerBucketEventsHandlers(api)
	// Register service handlers
	registerServiceHandlers(api)
	// Register profiling handlers
	registerProfilingHandler(api)
	// Register session handlers
	registerSessionHandlers(api)
	// Register admin info handlers
	registerAdminInfoHandlers(api)
	// Register admin arns handlers
	registerAdminArnsHandlers(api)
	// Register admin notification endpoints handlers
	registerAdminNotificationEndpointsHandlers(api)
	// Register admin Service Account Handlers
	registerServiceAccountsHandlers(api)

	//m3
	// Register tenant handlers
	registerTenantHandlers(api)
	// Register ResourceQuota handlers
	registerResourceQuotaHandlers(api)

	api.PreServerShutdown = func() {}

	api.ServerShutdown = func() {}

	return setupGlobalMiddleware(api.Serve(setupMiddlewares))
}

// The TLS configuration before HTTPS server starts.
func configureTLS(tlsConfig *tls.Config) {
	// Make all necessary changes to the TLS configuration here.
}

// As soon as server is initialized but not run yet, this function will be called.
// If you need to modify a config, store server instance to stop it individually later, this is the place.
// This function can be called multiple times, depending on the number of serving schemes.
// scheme value will be set accordingly: "http", "https" or "unix"
func configureServer(s *http.Server, scheme, addr string) {
}

// The middleware configuration is for the handler executors. These do not apply to the swagger.json document.
// The middleware executes after routing but before authentication, binding and validation
func setupMiddlewares(handler http.Handler) http.Handler {
	return handler
}

// The middleware configuration happens before anything, this middleware also applies to serving the swagger.json document.
// So this is a good place to plug in a panic handling middleware, logging and metrics
func setupGlobalMiddleware(handler http.Handler) http.Handler {
	// serve static files
	next := FileServerMiddleware(handler)
	// Secure middleware, this middleware wrap all the previous handlers and add
	// HTTP security headers
	secureOptions := secure.Options{
		AllowedHosts:                    getSecureAllowedHosts(),
		AllowedHostsAreRegex:            getSecureAllowedHostsAreRegex(),
		HostsProxyHeaders:               getSecureHostsProxyHeaders(),
		SSLRedirect:                     getSSLRedirect(),
		SSLHost:                         getSecureSSLHost(),
		STSSeconds:                      getSecureSTSSeconds(),
		STSIncludeSubdomains:            getSecureSTSIncludeSubdomains(),
		STSPreload:                      getSecureSTSPreload(),
		SSLTemporaryRedirect:            getSecureSSLTemporaryRedirect(),
		SSLHostFunc:                     nil,
		ForceSTSHeader:                  getSecureForceSTSHeader(),
		FrameDeny:                       getSecureFrameDeny(),
		ContentTypeNosniff:              getSecureContentTypeNonSniff(),
		BrowserXssFilter:                getSecureBrowserXSSFilter(),
		ContentSecurityPolicy:           getSecureContentSecurityPolicy(),
		ContentSecurityPolicyReportOnly: getSecureContentSecurityPolicyReportOnly(),
		PublicKey:                       getSecurePublicKey(),
		ReferrerPolicy:                  getSecureReferrerPolicy(),
		FeaturePolicy:                   getSecureFeaturePolicy(),
		ExpectCTHeader:                  getSecureExpectCTHeader(),
		IsDevelopment:                   !getProductionMode(),
	}
	secureMiddleware := secure.New(secureOptions)
	app := secureMiddleware.Handler(next)
	return app
}

// FileServerMiddleware serves files from the static folder
func FileServerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Server", "mcs/"+pkg.Version) // add HTTP Server header
		switch {
		case strings.HasPrefix(r.URL.Path, "/ws"):
			serveWS(w, r)
		case strings.HasPrefix(r.URL.Path, "/api"):
			next.ServeHTTP(w, r)
		default:
			assets := assetFS.AssetFS{
				Asset:     portalUI.Asset,
				AssetDir:  portalUI.AssetDir,
				AssetInfo: portalUI.AssetInfo,
				Prefix:    "build"}
			wrapHandlerSinglePageApplication(http.FileServer(&assets)).ServeHTTP(w, r)

		}
	})
}

type notFoundRedirectRespWr struct {
	http.ResponseWriter // We embed http.ResponseWriter
	status              int
}

func (w *notFoundRedirectRespWr) WriteHeader(status int) {
	w.status = status // Store the status for our own use
	if status != http.StatusNotFound {
		w.ResponseWriter.WriteHeader(status)
	}
}

func (w *notFoundRedirectRespWr) Write(p []byte) (int, error) {
	if w.status != http.StatusNotFound {
		return w.ResponseWriter.Write(p)
	}
	return len(p), nil // Lie that we successfully wrote it
}

// wrapHandlerSinglePageApplication handles a http.FileServer returning a 404 and overrides it with index.html
func wrapHandlerSinglePageApplication(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nfrw := &notFoundRedirectRespWr{ResponseWriter: w}
		h.ServeHTTP(nfrw, r)
		if nfrw.status == 404 {
			log.Printf("Redirecting %s to index.html.", r.RequestURI)
			http.Redirect(w, r, "/index.html", http.StatusFound)
		}
	}
}

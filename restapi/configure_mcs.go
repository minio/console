// This file is part of MinIO Kubernetes Cloud
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

	"github.com/minio/m3/mcs/restapi/sessions"

	"github.com/minio/m3/mcs/models"

	assetfs "github.com/elazarl/go-bindata-assetfs"

	portalUI "github.com/minio/m3/mcs/portal-ui"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/minio/m3/mcs/restapi/operations"
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

	api.KeyAuth = func(token string, scopes []string) (interface{}, error) {
		if sessions.GetInstance().ValidSession(token) {
			prin := models.Principal(token)
			return &prin, nil
		}
		log.Printf("Access attempt with incorrect api key auth: %s", token)
		return nil, errors.New(401, "incorrect api key auth")
	}

	// Register login handlers
	registerLoginHandlers(api)
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
	return next
}

// FileServerMiddleware serves files from the static folder
func FileServerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api") {
			next.ServeHTTP(w, r)
		} else {
			http.FileServer(&assetfs.AssetFS{
				Asset:     portalUI.Asset,
				AssetDir:  portalUI.AssetDir,
				AssetInfo: portalUI.AssetInfo,
				Prefix:    "build"}).ServeHTTP(w, r)
		}
	})
}

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

package main

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/minio/console/pkg/logger"

	"github.com/minio/cli"
	"github.com/minio/console/api"
)

var appCmds = []cli.Command{
	serverCmd,
	updateCmd,
}

// StartServer starts the console service
func StartServer(ctx *cli.Context) error {
	if err := loadAllCerts(ctx); err != nil {
		// Log this as a warning and continue running console without TLS certificates
		api.LogError("Unable to load certs: %v", err)
	}

	xctx := context.Background()

	transport := api.PrepareSTSClientTransport(api.LocalAddress).Transport.(*http.Transport)
	if err := logger.InitializeLogger(xctx, transport); err != nil {
		fmt.Println("error InitializeLogger", err)
		logger.CriticalIf(xctx, err)
	}
	// custom error configuration
	api.LogInfo = logger.Info
	api.LogError = logger.Error
	api.LogIf = logger.LogIf

	var rctx api.Context
	if err := rctx.Load(ctx); err != nil {
		api.LogError("argument validation failed: %v", err)
		return err
	}

	server, err := buildServer()
	if err != nil {
		api.LogError("Unable to initialize console server: %v", err)
		return err
	}

	server.Host = rctx.Host
	server.Port = rctx.HTTPPort
	// set conservative timesout for uploads
	server.ReadTimeout = 1 * time.Hour
	// no timeouts for response for downloads
	server.WriteTimeout = 0
	api.Port = strconv.Itoa(server.Port)
	api.Hostname = server.Host

	if len(api.GlobalPublicCerts) > 0 {
		// If TLS certificates are provided enforce the HTTPS schema, meaning console will redirect
		// plain HTTP connections to HTTPS server
		server.EnabledListeners = []string{"http", "https"}
		server.TLSPort = rctx.HTTPSPort
		// Need to store tls-port, tls-host un config variables so secure.middleware can read from there
		api.TLSPort = strconv.Itoa(server.TLSPort)
		api.Hostname = rctx.Host
		api.TLSRedirect = rctx.TLSRedirect
	}

	defer server.Shutdown()

	if err = server.Serve(); err != nil {
		server.Logf("error serving API: %v", err)
		return err
	}

	return nil
}

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
	"io/ioutil"
	"path/filepath"
	"strconv"
	"time"

	xcerts "github.com/minio/pkg/certs"

	"github.com/go-openapi/loads"
	"github.com/jessevdk/go-flags"
	"github.com/minio/cli"
	"github.com/minio/console/pkg/certs"
	"github.com/minio/console/restapi"
	"github.com/minio/console/restapi/operations"
)

// starts the server
var serverCmd = cli.Command{
	Name:    "server",
	Aliases: []string{"srv"},
	Usage:   "Start MinIO Console server",
	Action:  StartServer,
	Flags: []cli.Flag{
		cli.StringFlag{
			Name:  "host",
			Value: restapi.GetHostname(),
			Usage: "bind to a specific HOST, HOST can be an IP or hostname",
		},
		cli.IntFlag{
			Name:  "port",
			Value: restapi.GetPort(),
			Usage: "bind to specific HTTP port",
		},
		// This is kept here for backward compatibility,
		// hostname's do not have HTTP or HTTPs
		// hostnames are opaque so using --host
		// works for both HTTP and HTTPS setup.
		cli.StringFlag{
			Name:   "tls-host",
			Value:  restapi.GetHostname(),
			Hidden: true,
		},
		cli.StringFlag{
			Name:  "certs-dir",
			Value: certs.GlobalCertsCADir.Get(),
			Usage: "path to certs directory",
		},
		cli.IntFlag{
			Name:  "tls-port",
			Value: restapi.GetTLSPort(),
			Usage: "bind to specific HTTPS port",
		},
		cli.StringFlag{
			Name:  "tls-redirect",
			Value: restapi.GetTLSRedirect(),
			Usage: "toggle HTTP->HTTPS redirect",
		},
		cli.StringFlag{
			Name:   "tls-certificate",
			Value:  "",
			Usage:  "path to TLS public certificate",
			Hidden: true,
		},
		cli.StringFlag{
			Name:   "tls-key",
			Value:  "",
			Usage:  "path to TLS private key",
			Hidden: true,
		},
		cli.StringFlag{
			Name:   "tls-ca",
			Value:  "",
			Usage:  "path to TLS Certificate Authority",
			Hidden: true,
		},
	},
}

func buildServer() (*restapi.Server, error) {
	swaggerSpec, err := loads.Embedded(restapi.SwaggerJSON, restapi.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	api := operations.NewConsoleAPI(swaggerSpec)
	api.Logger = restapi.LogInfo
	server := restapi.NewServer(api)

	parser := flags.NewParser(server, flags.Default)
	parser.ShortDescription = "MinIO Console Server"
	parser.LongDescription = swaggerSpec.Spec().Info.Description

	server.ConfigureFlags()

	// register all APIs
	server.ConfigureAPI()

	for _, optsGroup := range api.CommandLineOptionsGroups {
		_, err := parser.AddGroup(optsGroup.ShortDescription, optsGroup.LongDescription, optsGroup.Options)
		if err != nil {
			return nil, err
		}
	}

	if _, err := parser.Parse(); err != nil {
		return nil, err
	}

	return server, nil
}

func loadAllCerts(ctx *cli.Context) error {
	var err error
	// Set all certs and CAs directories path
	certs.GlobalCertsDir, _, err = certs.NewConfigDirFromCtx(ctx, "certs-dir", certs.DefaultCertsDir.Get)
	if err != nil {
		return err
	}

	certs.GlobalCertsCADir = &certs.ConfigDir{Path: filepath.Join(certs.GlobalCertsDir.Get(), certs.CertsCADir)}
	// check if certs and CAs directories exists or can be created
	if err = certs.MkdirAllIgnorePerm(certs.GlobalCertsCADir.Get()); err != nil {
		return fmt.Errorf("unable to create certs CA directory at %s: with %w", certs.GlobalCertsCADir.Get(), err)
	}
	var manager *xcerts.Manager
	// load the certificates and the CAs
	restapi.GlobalRootCAs, restapi.GlobalPublicCerts, manager = certs.GetAllCertificatesAndCAs()
	restapi.GlobalTLSCertsManager = &certs.TLSCertsManager{
		Manager: manager,
	}

	{
		// TLS flags from swagger server, used to support VMware vsphere operator version.
		swaggerServerCertificate := ctx.String("tls-certificate")
		swaggerServerCertificateKey := ctx.String("tls-key")
		swaggerServerCACertificate := ctx.String("tls-ca")
		// load tls cert and key from swagger server tls-certificate and tls-key flags
		if swaggerServerCertificate != "" && swaggerServerCertificateKey != "" {
			if err = restapi.GlobalTLSCertsManager.AddCertificate(context.Background(), swaggerServerCertificate, swaggerServerCertificateKey); err != nil {
				return err
			}
			if x509Certs, err := certs.ParsePublicCertFile(swaggerServerCertificate); err == nil {
				restapi.GlobalPublicCerts = append(restapi.GlobalPublicCerts, x509Certs...)
			}
		}

		// load ca cert from swagger server tls-ca flag
		if swaggerServerCACertificate != "" {
			caCert, caCertErr := ioutil.ReadFile(swaggerServerCACertificate)
			if caCertErr == nil {
				restapi.GlobalRootCAs.AppendCertsFromPEM(caCert)
			}
		}
	}

	return nil
}

// StartServer starts the console service
func StartServer(ctx *cli.Context) error {
	if err := loadAllCerts(ctx); err != nil {
		// Log this as a warning and continue running console without TLS certificates
		restapi.LogError("Unable to load certs: %v", err)
	}

	var rctx restapi.Context
	if err := rctx.Load(ctx); err != nil {
		restapi.LogError("argument validation failed: %v", err)
		return err
	}

	server, err := buildServer()
	if err != nil {
		restapi.LogError("Unable to initialize console server: %v", err)
		return err
	}

	server.Host = rctx.Host
	server.Port = rctx.HTTPPort
	restapi.Port = strconv.Itoa(server.Port)
	restapi.Hostname = server.Host

	if len(restapi.GlobalPublicCerts) > 0 {
		// If TLS certificates are provided enforce the HTTPS schema, meaning console will redirect
		// plain HTTP connections to HTTPS server
		server.EnabledListeners = []string{"http", "https"}
		server.TLSPort = rctx.HTTPSPort
		// Need to store tls-port, tls-host un config variables so secure.middleware can read from there
		restapi.TLSPort = strconv.Itoa(server.TLSPort)
		restapi.Hostname = rctx.Host
		restapi.TLSRedirect = rctx.TLSRedirect
	}

	defer server.Shutdown()

	// subnet license refresh process
	go func() {
		// start refreshing subnet license after 5 seconds..
		time.Sleep(time.Second * 5)

		failedAttempts := 0
		for {
			if err := restapi.RefreshLicense(); err != nil {
				restapi.LogError("Refreshing subnet license failed: %v", err)
				failedAttempts++
				// end license refresh after 3 consecutive failed attempts
				if failedAttempts >= 3 {
					return
				}
				// wait 5 minutes and retry again
				time.Sleep(time.Minute * 5)
				continue
			}
			// if license refreshed successfully reset the counter
			failedAttempts = 0
			// try to refresh license every 24 hrs
			time.Sleep(time.Hour * 24)
		}
	}()

	return server.Serve()
}

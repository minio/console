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

package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/go-openapi/loads"
	"github.com/jessevdk/go-flags"
	"github.com/minio/cli"
	"github.com/minio/console/pkg/certs"
	"github.com/minio/console/restapi"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/minio/cmd/logger"
	certsx "github.com/minio/minio/pkg/certs"
)

// starts the server
var serverCmd = cli.Command{
	Name:    "server",
	Aliases: []string{"srv"},
	Usage:   "starts Console server",
	Action:  startServer,
	Flags: []cli.Flag{
		cli.StringFlag{
			Name:  "host",
			Value: restapi.GetHostname(),
			Usage: "HTTP server hostname",
		},
		cli.IntFlag{
			Name:  "port",
			Value: restapi.GetPort(),
			Usage: "HTTP Server port",
		},
		cli.StringFlag{
			Name:  "tls-host",
			Value: restapi.GetTLSHostname(),
			Usage: "HTTPS server hostname",
		},
		cli.IntFlag{
			Name:  "tls-port",
			Value: restapi.GetTLSPort(),
			Usage: "HTTPS server port",
		},
		cli.StringFlag{
			Name:  "certs-dir",
			Value: certs.GlobalCertsCADir.Get(),
			Usage: "path to certs directory",
		},
	},
}

// starts the controller
func startServer(ctx *cli.Context) error {
	swaggerSpec, err := loads.Embedded(restapi.SwaggerJSON, restapi.FlatSwaggerJSON)
	if err != nil {
		log.Fatalln(err)
	}

	api := operations.NewConsoleAPI(swaggerSpec)
	server := restapi.NewServer(api)
	defer server.Shutdown()

	parser := flags.NewParser(server, flags.Default)
	parser.ShortDescription = "MinIO Console Server"
	parser.LongDescription = swaggerSpec.Spec().Info.Description

	server.ConfigureFlags()

	for _, optsGroup := range api.CommandLineOptionsGroups {
		_, err := parser.AddGroup(optsGroup.ShortDescription, optsGroup.LongDescription, optsGroup.Options)
		if err != nil {
			log.Fatalln(err)
		}
	}

	if _, err := parser.Parse(); err != nil {
		code := 1
		if fe, ok := err.(*flags.Error); ok {
			if fe.Type == flags.ErrHelp {
				code = 0
			}
		}
		os.Exit(code)
	}

	server.Host = ctx.String("host")
	server.Port = ctx.Int("port")

	restapi.Hostname = ctx.String("host")
	restapi.Port = fmt.Sprintf("%v", ctx.Int("port"))

	// Set all certs and CAs directories.
	certs.GlobalCertsDir, _ = certs.NewConfigDirFromCtx(ctx, "certs-dir", certs.DefaultCertsDir.Get)
	certs.GlobalCertsCADir = &certs.ConfigDir{Path: filepath.Join(certs.GlobalCertsDir.Get(), certs.CertsCADir)}

	if err := certs.MkdirAllIgnorePerm(certs.GlobalCertsCADir.Get()); err != nil {
		log.Println(fmt.Sprintf("Unable to create certs CA directory at %s", certs.GlobalCertsCADir.Get()))
	}

	// load all CAs from ~/.console/certs/CAs
	restapi.GlobalRootCAs, err = certsx.GetRootCAs(certs.GlobalCertsCADir.Get())
	logger.FatalIf(err, "Failed to read root CAs (%v)", err)
	// load all certs from ~/.console/certs
	restapi.GlobalPublicCerts, restapi.GlobalTLSCertsManager, err = certs.GetTLSConfig()
	logger.FatalIf(err, "Unable to load the TLS configuration")

	if len(restapi.GlobalPublicCerts) > 0 && restapi.GlobalRootCAs != nil {
		// If TLS certificates are provided enforce the HTTPS schema, meaning console will redirect
		// plain HTTP connections to HTTPS server
		server.EnabledListeners = []string{"http", "https"}
		server.TLSPort = ctx.Int("tls-port")
		server.TLSHost = ctx.String("tls-host")
		// Need to store tls-port, tls-host un config variables so secure.middleware can read from there
		restapi.TLSPort = fmt.Sprintf("%v", ctx.Int("tls-port"))
		restapi.TLSHostname = ctx.String("tls-host")
		restapi.TLSRedirect = "on"
	}

	server.ConfigureAPI()

	if err := server.Serve(); err != nil {
		log.Fatalln(err)
	}
	return nil
}

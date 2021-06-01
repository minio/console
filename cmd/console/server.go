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
	"log"
	"os"
	"path/filepath"
	"time"

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
			Name:  "tls-redirect",
			Value: restapi.GetTLSRedirect(),
			Usage: "HTTPS redirect by default",
		},
		cli.StringFlag{
			Name:  "certs-dir",
			Value: certs.GlobalCertsCADir.Get(),
			Usage: "path to certs directory",
		},
		cli.StringFlag{
			Name:  "tls-certificate",
			Value: "",
			Usage: "path tls certificate",
		},
		cli.StringFlag{
			Name:  "tls-key",
			Value: "",
			Usage: "path tls key",
		},
		cli.StringFlag{
			Name:  "tls-ca",
			Value: "",
			Usage: "path tls ca",
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

	// Set all certs and CAs directories path
	certs.GlobalCertsDir, _ = certs.NewConfigDirFromCtx(ctx, "certs-dir", certs.DefaultCertsDir.Get)
	certs.GlobalCertsCADir = &certs.ConfigDir{Path: filepath.Join(certs.GlobalCertsDir.Get(), certs.CertsCADir)}

	// check if certs and CAs directories exists or can be created
	if err := certs.MkdirAllIgnorePerm(certs.GlobalCertsCADir.Get()); err != nil {
		log.Println(fmt.Sprintf("Unable to create certs CA directory at %s", certs.GlobalCertsCADir.Get()))
	}
	// load the certificates and the CAs
	restapi.GlobalRootCAs, restapi.GlobalPublicCerts, restapi.GlobalTLSCertsManager = certs.GetAllCertificatesAndCAs()

	// TLS flags from swagger server, used to support older versions of minio-operator
	swaggerServerCertificate := ctx.String("tls-certificate")
	swaggerServerCertificateKey := ctx.String("tls-key")
	SwaggerServerCACertificate := ctx.String("tls-ca")
	// load tls cert and key from swagger server tls-certificate and tls-key flags
	if swaggerServerCertificate != "" && swaggerServerCertificateKey != "" {
		if errAddCert := certs.AddCertificate(context.Background(), restapi.GlobalTLSCertsManager, swaggerServerCertificate, swaggerServerCertificateKey); errAddCert != nil {
			log.Println(errAddCert)
		}
		if x509Certs, errParseCert := certs.ParsePublicCertFile(swaggerServerCertificate); errParseCert == nil {
			if len(x509Certs) > 0 {
				restapi.GlobalPublicCerts = append(restapi.GlobalPublicCerts, x509Certs[0])
			}
		}
	}
	// load ca cert from swagger server tls-ca flag
	if SwaggerServerCACertificate != "" {
		caCert, caCertErr := ioutil.ReadFile(SwaggerServerCACertificate)
		if caCertErr == nil {
			restapi.GlobalRootCAs.AppendCertsFromPEM(caCert)
		}
	}

	if len(restapi.GlobalPublicCerts) > 0 {
		// If TLS certificates are provided enforce the HTTPS schema, meaning console will redirect
		// plain HTTP connections to HTTPS server
		server.EnabledListeners = []string{"http", "https"}
		server.TLSPort = ctx.Int("tls-port")
		server.TLSHost = ctx.String("tls-host")
		// Need to store tls-port, tls-host un config variables so secure.middleware can read from there
		restapi.TLSPort = fmt.Sprintf("%v", ctx.Int("tls-port"))
		restapi.TLSHostname = ctx.String("tls-host")
		restapi.TLSRedirect = ctx.String("tls-redirect")
	}

	server.ConfigureAPI()

	// subnet license refresh process
	go func() {
		failedAttempts := 0
		for {
			if err := restapi.RefreshLicense(); err != nil {
				log.Println(err)
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

	if err := server.Serve(); err != nil {
		log.Fatalln(err)
	}
	return nil
}

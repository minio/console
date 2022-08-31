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
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"syscall"

	"github.com/go-openapi/loads"
	"github.com/jessevdk/go-flags"
	"github.com/minio/cli"
	consoleoauth2 "github.com/minio/console/pkg/auth/idp/oauth2"
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

var ssoTesting = ""

func buildServer() (*restapi.Server, error) {
	pcfg := map[string]consoleoauth2.ProviderConfig{
		"_": {
			URL:              "",
			ClientID:         "",
			ClientSecret:     "",
			RedirectCallback: "",
		},
	}
	if ssoTesting == "readFromVars" {
		URL := os.Getenv("CONSOLE_IDP_URL")
		ClientID := os.Getenv("CONSOLE_IDP_CLIENT_ID")
		ClientSecret := os.Getenv("CONSOLE_IDP_SECRET")
		RedirectCallback := os.Getenv("CONSOLE_IDP_CALLBACK")
		fmt.Println(" ")
		fmt.Println("=========================================================")
		fmt.Println("We are going to be testing with Environment Variables SSO")
		fmt.Println("CONSOLE_IDP_URL: ", URL)
		fmt.Println("CONSOLE_IDP_CLIENT_ID: ", ClientID)
		fmt.Println("CONSOLE_IDP_SECRET: ", ClientSecret)
		fmt.Println("CONSOLE_IDP_CALLBACK: ", RedirectCallback)
		fmt.Println("=========================================================")
		fmt.Println(" ")

		// Configure Console Server with vars to get the idp config from the container
		pcfg = map[string]consoleoauth2.ProviderConfig{
			"_": {
				URL:              URL,
				ClientID:         ClientID,
				ClientSecret:     ClientSecret,
				RedirectCallback: RedirectCallback,
			},
		}

	}

	swaggerSpec, err := loads.Embedded(restapi.SwaggerJSON, restapi.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	api := operations.NewConsoleAPI(swaggerSpec)
	api.Logger = restapi.LogInfo

	// Only set via environmental variables when testing console in dev env.
	if ssoTesting == "readFromVars" {
		restapi.GlobalMinIOConfig = restapi.MinIOConfig{
			OpenIDProviders: pcfg,
		}
	}

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
		return fmt.Errorf("unable to create certs CA directory at %s: failed with %w", certs.GlobalCertsCADir.Get(), err)
	}

	// load the certificates and the CAs
	restapi.GlobalRootCAs, restapi.GlobalPublicCerts, restapi.GlobalTLSCertsManager, err = certs.GetAllCertificatesAndCAs()
	if err != nil {
		return fmt.Errorf("unable to load certificates at %s: failed with %w", certs.GlobalCertsDir.Get(), err)
	}

	{
		// TLS flags from swagger server, used to support VMware vsphere operator version.
		swaggerServerCertificate := ctx.String("tls-certificate")
		swaggerServerCertificateKey := ctx.String("tls-key")
		swaggerServerCACertificate := ctx.String("tls-ca")
		// load tls cert and key from swagger server tls-certificate and tls-key flags
		if swaggerServerCertificate != "" && swaggerServerCertificateKey != "" {
			if err = restapi.GlobalTLSCertsManager.AddCertificate(swaggerServerCertificate, swaggerServerCertificateKey); err != nil {
				return err
			}
			x509Certs, err := certs.ParsePublicCertFile(swaggerServerCertificate)
			if err == nil {
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

	if restapi.GlobalTLSCertsManager != nil {
		restapi.GlobalTLSCertsManager.ReloadOnSignal(syscall.SIGHUP)
	}

	return nil
}

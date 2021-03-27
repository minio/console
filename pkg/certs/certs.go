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

package certs

import (
	"context"
	"crypto/x509"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/minio/cli"
	"github.com/minio/minio/cmd/config"
	"github.com/minio/minio/cmd/logger"
	xcerts "github.com/minio/minio/pkg/certs"
	"github.com/mitchellh/go-homedir"
)

// ConfigDir - points to a user set directory.
type ConfigDir struct {
	Path string
}

// Get - returns current directory.
func (dir *ConfigDir) Get() string {
	return dir.Path
}

func getDefaultConfigDir() string {
	homeDir, err := homedir.Dir()
	if err != nil {
		return ""
	}
	return filepath.Join(homeDir, DefaultConsoleConfigDir)
}

func getDefaultCertsDir() string {
	return filepath.Join(getDefaultConfigDir(), CertsDir)
}

func getDefaultCertsCADir() string {
	return filepath.Join(getDefaultCertsDir(), CertsCADir)
}

// isFile - returns whether given Path is a file or not.
func isFile(path string) bool {
	if fi, err := os.Stat(path); err == nil {
		return fi.Mode().IsRegular()
	}

	return false
}

var (
	// DefaultCertsDir certs directory.
	DefaultCertsDir = &ConfigDir{Path: getDefaultCertsDir()}
	// DefaultCertsCADir CA directory.
	DefaultCertsCADir = &ConfigDir{Path: getDefaultCertsCADir()}
	// GlobalCertsDir points to current certs directory set by user with --certs-dir
	GlobalCertsDir = DefaultCertsDir
	// GlobalCertsCADir points to relative Path to certs directory and is <value-of-certs-dir>/CAs
	GlobalCertsCADir = DefaultCertsCADir
)

// MkdirAllIgnorePerm attempts to create all directories, ignores any permission denied errors.
func MkdirAllIgnorePerm(path string) error {
	err := os.MkdirAll(path, 0700)
	if err != nil {
		// It is possible in kubernetes like deployments this directory
		// is already mounted and is not writable, ignore any write errors.
		if os.IsPermission(err) {
			err = nil
		}
	}
	return err
}

func NewConfigDirFromCtx(ctx *cli.Context, option string, getDefaultDir func() string) (*ConfigDir, bool) {
	var dir string
	var dirSet bool

	switch {
	case ctx.IsSet(option):
		dir = ctx.String(option)
		dirSet = true
	case ctx.GlobalIsSet(option):
		dir = ctx.GlobalString(option)
		dirSet = true
		// cli package does not expose parent's option option.  Below code is workaround.
		if dir == "" || dir == getDefaultDir() {
			dirSet = false // Unset to false since GlobalIsSet() true is a false positive.
			if ctx.Parent().GlobalIsSet(option) {
				dir = ctx.Parent().GlobalString(option)
				dirSet = true
			}
		}
	default:
		// Neither local nor global option is provided.  In this case, try to use
		// default directory.
		dir = getDefaultDir()
		if dir == "" {
			logger.FatalIf(errors.New("invalid arguments specified"), "%s option must be provided", option)
		}
	}

	if dir == "" {
		logger.FatalIf(errors.New("empty directory"), "%s directory cannot be empty", option)
	}

	// Disallow relative paths, figure out absolute paths.
	dirAbs, err := filepath.Abs(dir)
	logger.FatalIf(err, "Unable to fetch absolute path for %s=%s", option, dir)
	logger.FatalIf(MkdirAllIgnorePerm(dirAbs), "Unable to create directory specified %s=%s", option, dir)

	return &ConfigDir{Path: dirAbs}, dirSet
}

func getPublicCertFile() string {
	return filepath.Join(GlobalCertsDir.Get(), PublicCertFile)
}

func getPrivateKeyFile() string {
	return filepath.Join(GlobalCertsDir.Get(), PrivateKeyFile)
}

func GetTLSConfig() (x509Certs []*x509.Certificate, manager *xcerts.Manager, err error) {

	ctx := context.Background()

	if !(isFile(getPublicCertFile()) && isFile(getPrivateKeyFile())) {
		return nil, nil, nil
	}

	if x509Certs, err = config.ParsePublicCertFile(getPublicCertFile()); err != nil {
		return nil, nil, err
	}

	manager, err = xcerts.NewManager(ctx, getPublicCertFile(), getPrivateKeyFile(), config.LoadX509KeyPair)
	if err != nil {
		return nil, nil, err
	}

	//Console has support for multiple certificates. It expects the following structure:
	// certs/
	//  │
	//  ├─ public.crt
	//  ├─ private.key
	//  │
	//  ├─ example.com/
	//  │   │
	//  │   ├─ public.crt
	//  │   └─ private.key
	//  └─ foobar.org/
	//     │
	//     ├─ public.crt
	//     └─ private.key
	//  ...
	//
	//Therefore, we read all filenames in the cert directory and check
	//for each directory whether it contains a public.crt and private.key.
	// If so, we try to add it to certificate manager.
	root, err := os.Open(GlobalCertsDir.Get())
	if err != nil {
		return nil, nil, err
	}
	defer root.Close()

	files, err := root.Readdir(-1)
	if err != nil {
		return nil, nil, err
	}
	for _, file := range files {
		// Ignore all
		// - regular files
		// - "CAs" directory
		// - any directory which starts with ".."
		if file.Mode().IsRegular() || file.Name() == "CAs" || strings.HasPrefix(file.Name(), "..") {
			continue
		}
		if file.Mode()&os.ModeSymlink == os.ModeSymlink {
			file, err = os.Stat(filepath.Join(root.Name(), file.Name()))
			if err != nil {
				// not accessible ignore
				continue
			}
			if !file.IsDir() {
				continue
			}
		}

		var (
			certFile = filepath.Join(root.Name(), file.Name(), PublicCertFile)
			keyFile  = filepath.Join(root.Name(), file.Name(), PrivateKeyFile)
		)
		if !isFile(certFile) || !isFile(keyFile) {
			continue
		}
		if err = manager.AddCertificate(certFile, keyFile); err != nil {
			err = fmt.Errorf("unable to load TLS certificate '%s,%s': %w", certFile, keyFile, err)
			logger.LogIf(ctx, err, logger.Application)
		}
	}
	return x509Certs, manager, nil
}

func GetAllCertificatesAndCAs() (*x509.CertPool, []*x509.Certificate, *xcerts.Manager) {
	// load all CAs from ~/.console/certs/CAs
	GlobalRootCAs, err := xcerts.GetRootCAs(GlobalCertsCADir.Get())
	logger.FatalIf(err, "Failed to read root CAs (%v)", err)
	// load all certs from ~/.console/certs
	globalPublicCerts, globalTLSCertsManager, err := GetTLSConfig()
	logger.FatalIf(err, "Unable to load the TLS configuration")
	return GlobalRootCAs, globalPublicCerts, globalTLSCertsManager
}

// AddCertificate check if Manager is initialized and then append a new certificate to it
func AddCertificate(ctx context.Context, manager *xcerts.Manager, publicKey, privateKey string) (err error) {
	// If Cert Manager is not nil add more certificates
	if manager != nil {
		return manager.AddCertificate(publicKey, privateKey)
	}
	// Initialize cert manager
	manager, err = xcerts.NewManager(ctx, publicKey, privateKey, config.LoadX509KeyPair)
	return err
}

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
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/blang/semver/v4"
	"github.com/cheggaaa/pb/v3"
	"github.com/minio/cli"
	"github.com/minio/console/pkg"
	"github.com/minio/selfupdate"
)

func getUpdateTransport(timeout time.Duration) http.RoundTripper {
	var updateTransport http.RoundTripper = &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   timeout,
			KeepAlive: timeout,
			DualStack: true,
		}).DialContext,
		IdleConnTimeout:       timeout,
		TLSHandshakeTimeout:   timeout,
		ExpectContinueTimeout: timeout,
		DisableCompression:    true,
	}
	return updateTransport
}

func getUpdateReaderFromURL(u string, transport http.RoundTripper) (io.ReadCloser, int64, error) {
	clnt := &http.Client{
		Transport: transport,
	}
	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, -1, err
	}

	resp, err := clnt.Do(req)
	if err != nil {
		return nil, -1, err
	}
	return resp.Body, resp.ContentLength, nil
}

const defaultPubKey = "RWTx5Zr1tiHQLwG9keckT0c45M3AGeHD6IvimQHpyRywVWGbP1aVSGav"

func getLatestRelease(tr http.RoundTripper) (string, error) {
	releaseURL := "https://api.github.com/repos/minio/console/releases/latest"

	body, _, err := getUpdateReaderFromURL(releaseURL, tr)
	if err != nil {
		return "", fmt.Errorf("unable to access github release URL %w", err)
	}
	defer body.Close()

	lm := make(map[string]interface{})
	if err = json.NewDecoder(body).Decode(&lm); err != nil {
		return "", err
	}
	rel, ok := lm["tag_name"].(string)
	if !ok {
		return "", errors.New("unable to find latest release tag")
	}
	return rel, nil
}

// update console in-place
var updateCmd = cli.Command{
	Name:   "update",
	Usage:  "update console to latest release",
	Action: updateInplace,
}

func updateInplace(_ *cli.Context) error {
	transport := getUpdateTransport(30 * time.Second)
	rel, err := getLatestRelease(transport)
	if err != nil {
		return err
	}

	latest, err := semver.Make(strings.TrimPrefix(rel, "v"))
	if err != nil {
		return err
	}

	current, err := semver.Make(pkg.Version)
	if err != nil {
		return err
	}

	if current.GTE(latest) {
		fmt.Printf("You are already running the latest version v%v.\n", pkg.Version)
		return nil
	}

	consoleBin := fmt.Sprintf("https://github.com/minio/console/releases/download/%s/console-%s-%s", rel, runtime.GOOS, runtime.GOARCH)
	reader, length, err := getUpdateReaderFromURL(consoleBin, transport)
	if err != nil {
		return fmt.Errorf("unable to fetch binary from %s: %w", consoleBin, err)
	}

	minisignPubkey := os.Getenv("CONSOLE_MINISIGN_PUBKEY")
	if minisignPubkey == "" {
		minisignPubkey = defaultPubKey
	}

	v := selfupdate.NewVerifier()
	if err = v.LoadFromURL(consoleBin+".minisig", minisignPubkey, transport); err != nil {
		return fmt.Errorf("unable to fetch binary signature for %s: %w", consoleBin, err)
	}
	opts := selfupdate.Options{
		Verifier: v,
	}

	tmpl := `{{ red "Downloading:" }} {{bar . (red "[") (green "=") (red "]")}} {{speed . | rndcolor }}`
	bar := pb.ProgressBarTemplate(tmpl).Start64(length)
	barReader := bar.NewProxyReader(reader)
	if err = selfupdate.Apply(barReader, opts); err != nil {
		bar.Finish()
		if rerr := selfupdate.RollbackError(err); rerr != nil {
			return rerr
		}
		return err
	}

	bar.Finish()
	fmt.Printf("Updated 'console' to latest release %s\n", rel)
	return nil
}

// This file is part of MinIO Kubernetes Cloud
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

package cluster

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/minio/pkg/env"
)

var (
	errCantDetermineMinIOImage = errors.New("can't determine MinIO Image")
)

func GetK8sAPIServer() string {
	// if console is running inside a k8s pod KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT will contain the k8s api server apiServerAddress
	// if console is not running inside k8s by default will look for the k8s api server on localhost:8001 (kubectl proxy)
	// NOTE: using kubectl proxy is for local development only, since every request send to localhost:8001 will bypass service account authentication
	// more info here: https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api
	// you can override this using CONSOLE_K8S_API_SERVER, ie use the k8s cluster from `kubectl config view`
	host, port := env.Get("KUBERNETES_SERVICE_HOST", ""), env.Get("KUBERNETES_SERVICE_PORT", "")
	apiServerAddress := "http://localhost:8001"
	if host != "" && port != "" {
		apiServerAddress = "https://" + net.JoinHostPort(host, port)
	}
	return env.Get(ConsoleK8sAPIServer, apiServerAddress)
}

// If CONSOLE_K8S_API_SERVER_TLS_ROOT_CA is true console will load the certificate into the
// http.client rootCAs pool, this is useful for testing an k8s ApiServer or when working with self-signed certificates
func getK8sAPIServerTLSRootCA() string {
	return strings.TrimSpace(env.Get(ConsoleK8SAPIServerTLSRootCA, ""))
}

// GetNsFromFile assumes console is running inside a k8s pod and extract the current namespace from the
// /var/run/secrets/kubernetes.io/serviceaccount/namespace file
func GetNsFromFile() string {
	dat, err := ioutil.ReadFile("/var/run/secrets/kubernetes.io/serviceaccount/namespace")
	if err != nil {
		return "default"
	}
	return string(dat)
}

// Namespace will run only once at console startup
var Namespace = GetNsFromFile()

// getLatestMinIOImage returns the latest docker image for MinIO if found on the internet
func getLatestMinIOImage(client HTTPClientI) (*string, error) {
	resp, err := client.Get("https://dl.min.io/server/minio/release/linux-amd64/")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var re = regexp.MustCompile(`(?m)\.\/minio\.(RELEASE.*?Z)"`)
	// look for a single match
	matches := re.FindAllStringSubmatch(string(body), 1)
	for i := range matches {
		release := matches[i][1]
		dockerImage := fmt.Sprintf("minio/minio:%s", release)
		return &dockerImage, nil
	}
	return nil, errCantDetermineMinIOImage
}

var latestMinIOImage, errLatestMinIOImage = getLatestMinIOImage(
	&HTTPClient{
		Client: &http.Client{
			Timeout: 15 * time.Second,
		},
	})

// GetMinioImage returns the image URL to be used when deploying a MinIO instance, if there is
// a preferred image to be used (configured via ENVIRONMENT VARIABLES) GetMinioImage will return that
// if not, GetMinioImage will try to obtain the image URL for the latest version of MinIO and return that
func GetMinioImage() (*string, error) {
	image := strings.TrimSpace(env.Get(ConsoleMinioImage, ""))
	// if there is a preferred image configured by the user we'll always return that
	if image != "" {
		return &image, nil
	}
	if errLatestMinIOImage != nil {
		return nil, errLatestMinIOImage
	}
	return latestMinIOImage, nil
}

// GetLatestMinioImage returns the latest image URL on minio repository
func GetLatestMinioImage(client HTTPClientI) (*string, error) {
	latestMinIOImage, err := getLatestMinIOImage(client)
	if err != nil {
		return nil, err
	}
	return latestMinIOImage, nil
}

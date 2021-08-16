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

package operatorapi

import (
	"bytes"
	"crypto/sha1"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/cookiejar"
	url2 "net/url"
	"strings"

	v2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/minio/console/cluster"

	"github.com/minio/console/pkg/auth"
)

func serveProxy(responseWriter http.ResponseWriter, req *http.Request) {
	urlParts := strings.Split(req.URL.Path, "/")

	if len(urlParts) < 5 {
		log.Println(len(urlParts))
		return
	}
	namespace := urlParts[3]
	tenantName := urlParts[4]

	// validate the tenantName

	token, err := auth.GetTokenFromRequest(req)
	if err != nil {
		log.Println(err)
		responseWriter.WriteHeader(401)
		return
	}
	claims, err := auth.SessionTokenAuthenticate(token)
	if err != nil {
		log.Printf("Unable to validate the session token %s: %v\n", token, err)
		responseWriter.WriteHeader(401)

		return
	}

	STSSessionToken := claims.STSSessionToken

	opClientClientSet, err := cluster.OperatorClient(STSSessionToken)
	if err != nil {
		log.Println(err)
		responseWriter.WriteHeader(404)
		return
	}
	opClient := operatorClient{
		client: opClientClientSet,
	}
	tenant, err := opClient.TenantGet(req.Context(), namespace, tenantName, metav1.GetOptions{})
	if err != nil {
		log.Println(err)
		responseWriter.WriteHeader(502)
		return
	}

	nsTenant := fmt.Sprintf("%s/%s", tenant.Namespace, tenant.Name)

	tenantSchema := "http"
	tenantPort := ":9090"
	if tenant.AutoCert() || tenant.ConsoleExternalCert() {
		tenantSchema = "https"
		tenantPort = ":9443"
	}
	tenantURL := fmt.Sprintf("%s://%s.%s.svc.%s%s", tenantSchema, tenant.ConsoleCIServiceName(), tenant.Namespace, v2.GetClusterDomain(), tenantPort)
	// for development
	//tenantURL = "http://localhost:9091"
	//tenantURL = "https://localhost:9443"

	h := sha1.New()
	h.Write([]byte(nsTenant))
	tenantCookieName := fmt.Sprintf("token-%x", string(h.Sum(nil)))
	tenantCookie, err := req.Cookie(tenantCookieName)
	if err != nil {
		// login to tenantName
		loginURL := fmt.Sprintf("%s/api/v1/login", tenantURL)

		// get the tenant credentials
		clientSet, err := cluster.K8sClient(STSSessionToken)
		if err != nil {
			log.Println(err)
			responseWriter.WriteHeader(500)
			return
		}

		// FIXME: abstract this to a common tenant.GetConfiguration() function
		tenantConfiguration := map[string][]byte{}

		for _, config := range tenant.GetEnvVars() {
			tenantConfiguration[config.Name] = []byte(config.Value)
		}

		if tenant.HasCredsSecret() {
			minioSecret, err := clientSet.CoreV1().Secrets(tenant.Namespace).Get(req.Context(), tenant.Spec.CredsSecret.Name, metav1.GetOptions{})
			if err != nil {
				log.Println(err)
				responseWriter.WriteHeader(500)
				return
			}
			configFromCredsSecret := minioSecret.Data
			for key, val := range configFromCredsSecret {
				tenantConfiguration[key] = val
			}
		}

		if tenant.HasConfigurationSecret() {
			minioConfigurationSecret, err := clientSet.CoreV1().Secrets(tenant.Namespace).Get(req.Context(), tenant.Spec.Configuration.Name, metav1.GetOptions{})
			if err == nil {
				configFromFile := v2.ParseRawConfiguration(minioConfigurationSecret.Data["config.env"])
				for key, val := range configFromFile {
					tenantConfiguration[key] = val
				}
			}
		}

		data := map[string]string{
			"accessKey": string(tenantConfiguration["accesskey"]),
			"secretKey": string(tenantConfiguration["secretkey"]),
		}
		payload, _ := json.Marshal(data)

		loginReq, err := http.NewRequest(http.MethodPost, loginURL, bytes.NewReader(payload))
		if err != nil {
			log.Println(err)
			responseWriter.WriteHeader(500)
			return
		}
		loginReq.Header.Add("Content-Type", "application/json")

		// FIXME: in the future we should use restapi.GetConsoleHTTPClient()
		tr := &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
		client := &http.Client{Transport: tr}

		loginResp, err := client.Do(loginReq)
		if err != nil {
			log.Println(err)
			responseWriter.WriteHeader(500)
			return
		}

		if loginResp.StatusCode < 200 && loginResp.StatusCode <= 299 {
			log.Println(fmt.Printf("Status: %d. Couldn't complete login", loginResp.StatusCode))
			responseWriter.WriteHeader(500)
			return
		}

		for _, c := range loginResp.Cookies() {
			if c.Name == "token" {
				tenantCookie = c
				c := &http.Cookie{
					Name:     tenantCookieName,
					Value:    c.Value,
					Path:     c.Path,
					Expires:  c.Expires,
					HttpOnly: c.HttpOnly,
				}

				http.SetCookie(responseWriter, c)
				break
			}
		}
		defer loginResp.Body.Close()
	}
	if tenantCookie == nil {
		log.Println(errors.New("couldn't login to tenant and get cookie"))
		responseWriter.WriteHeader(500)
		return
	}

	targetURL, err := url2.Parse(tenantURL)
	if err != nil {
		log.Println(err)
		responseWriter.WriteHeader(500)
		return
	}
	targetURL.Path = strings.Replace(req.URL.Path, fmt.Sprintf("/api/proxy/%s/%s", tenant.Namespace, tenant.Name), "", -1)

	proxiedCookie := &http.Cookie{
		Name:     "token",
		Value:    tenantCookie.Value,
		Path:     tenantCookie.Path,
		Expires:  tenantCookie.Expires,
		HttpOnly: tenantCookie.HttpOnly,
	}

	proxyCookieJar, _ := cookiejar.New(nil)
	proxyCookieJar.SetCookies(targetURL, []*http.Cookie{proxiedCookie})

	tr := &http.Transport{
		// FIXME: use restapi.GetConsoleHTTPClient()
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr,
		Jar: proxyCookieJar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		}}
	// copy query params
	targetURL.RawQuery = req.URL.Query().Encode()
	proxRequest, err := http.NewRequest(req.Method, targetURL.String(), req.Body)
	if err != nil {
		log.Println(err)
		responseWriter.WriteHeader(500)
		return
	}

	for _, v := range req.Header.Values("Content-Type") {
		proxRequest.Header.Add("Content-Type", v)
	}

	resp, err := client.Do(proxRequest)
	if err != nil {
		log.Println(err)
		responseWriter.WriteHeader(500)
		return
	}

	for hk, hv := range resp.Header {
		if hk != "X-Frame-Options" {
			for _, v := range hv {
				responseWriter.Header().Add(hk, v)
			}
		}
	}
	// Allow iframes
	responseWriter.Header().Set("X-Frame-Options", "SAMEORIGIN")
	responseWriter.Header().Set("X-XSS-Protection", "1")

	io.Copy(responseWriter, resp.Body)

}
